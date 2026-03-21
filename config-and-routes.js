// =====================================================
// functions/config.js
// =====================================================
'use strict';

module.exports = {
  telegram: {
    botToken:   process.env.TELEGRAM_BOT_TOKEN   || functions.config().telegram?.bot_token,
    webhookUrl: process.env.TELEGRAM_WEBHOOK_URL || functions.config().telegram?.webhook_url,
  },
  twilio: {
    accountSid:    process.env.TWILIO_ACCOUNT_SID   || functions.config().twilio?.account_sid,
    authToken:     process.env.TWILIO_AUTH_TOKEN     || functions.config().twilio?.auth_token,
    whatsappFrom:  process.env.TWILIO_WHATSAPP_FROM  || 'whatsapp:+14155238886',
    webhookUrl:    process.env.TWILIO_WEBHOOK_URL    || functions.config().twilio?.webhook_url,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || functions.config().anthropic?.api_key,
    model:  'claude-sonnet-4-20250514',
  },
};

const functions = require('firebase-functions');


// =====================================================
// functions/middleware/auth.js
// =====================================================
// (appended below as comment block for single-file output)

/*
'use strict';
const admin = require('firebase-admin');

async function verifyAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', code: 'NO_TOKEN' });
  }
  try {
    const token       = header.split('Bearer ')[1];
    req.user          = await admin.auth().verifyIdToken(token);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
  }
}

module.exports = { verifyAuth };
*/


// =====================================================
// functions/routes/tasks.js
// =====================================================
/*
'use strict';
const express  = require('express');
const admin    = require('firebase-admin');
const { AIService }    = require('../services/aiService');
const { StreakService } = require('../services/streakService');
const { FCMService }   = require('../services/fcmService');

const router = express.Router();

// GET /api/tasks
router.get('/', async (req, res) => {
  const { category, priority, completed, limit = 50 } = req.query;
  let query = admin.firestore().collection('tasks').where('userId', '==', req.user.uid);
  if (category)  query = query.where('category', '==', category);
  if (priority)  query = query.where('priority', '==', priority);
  if (completed !== undefined) query = query.where('completed', '==', completed === 'true');
  query = query.orderBy('createdAt', 'desc').limit(Number(limit));
  const snap  = await query.get();
  const tasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json({ success: true, tasks, count: tasks.length });
});

// POST /api/tasks
router.post('/', async (req, res) => {
  const { title, category, priority, dueDate, notes, notify } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  const task = {
    userId:      req.user.uid,
    title, category: category || 'work',
    priority:    priority    || 'medium',
    dueDate:     dueDate     ? new Date(dueDate) : null,
    notes:       notes       || '',
    completed:   false,
    reminderSent: false,
    createdAt:   admin.firestore.FieldValue.serverTimestamp(),
  };

  const ref = await admin.firestore().collection('tasks').add(task);

  // Optional: schedule AI-generated reminder message
  if (notify && dueDate) {
    const aiMsg = await AIService.generateDeadlineAlert({
      task: { ...task, id: ref.id },
      minutesBefore: 30,
      streak: { current: 0 },
    });
    await FCMService.sendTaskReminder(req.user.uid, { ...task, id: ref.id }, aiMsg);
  }

  res.status(201).json({ success: true, taskId: ref.id });
});

// POST /api/tasks/:id/complete
router.post('/:id/complete', async (req, res) => {
  const db   = admin.firestore();
  const ref  = db.collection('tasks').doc(req.params.id);
  const snap = await ref.get();
  if (!snap.exists || snap.data().userId !== req.user.uid)
    return res.status(404).json({ error: 'Task not found' });

  await ref.update({ completed: true, completedAt: admin.firestore.FieldValue.serverTimestamp() });
  const streak = await StreakService.processTaskCompletion(req.user.uid);
  res.json({ success: true, streak: streak.streak });
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  const ref = admin.firestore().collection('tasks').doc(req.params.id);
  const s   = await ref.get();
  if (!s.exists || s.data().userId !== req.user.uid)
    return res.status(404).json({ error: 'Task not found' });
  await ref.delete();
  res.json({ success: true });
});

module.exports = router;
*/


// =====================================================
// functions/routes/ai.js
// =====================================================
/*
'use strict';
const express    = require('express');
const admin      = require('firebase-admin');
const { AIService } = require('../services/aiService');

const router = express.Router();

// POST /api/ai/suggest
router.post('/suggest', async (req, res) => {
  const userId = req.user.uid;
  const db     = admin.firestore();
  const [userSnap, tasksSnap] = await Promise.all([
    db.collection('users').doc(userId).get(),
    db.collection('tasks').where('userId', '==', userId).where('completed', '==', true)
      .orderBy('completedAt', 'desc').limit(20).get(),
  ]);

  const user        = userSnap.data();
  const recentTasks = tasksSnap.docs.map(d => d.data());
  const suggestions = await AIService.suggestTasks({ user, recentTasks, streak: user.streak, preferences: user.preferences });
  res.json({ success: true, suggestions });
});

// POST /api/ai/motivate
router.post('/motivate', async (req, res) => {
  const userId = req.user.uid;
  const user   = await admin.firestore().collection('users').doc(userId).get().then(s => s.data());
  const msg    = await AIService.generateMotivation({ user, streak: user.streak });
  res.json({ success: true, message: msg });
});

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  const userId = req.user.uid;
  const db     = admin.firestore();
  const [userSnap, tasksSnap] = await Promise.all([
    db.collection('users').doc(userId).get(),
    db.collection('tasks').where('userId', '==', userId).orderBy('createdAt', 'desc').limit(10).get(),
  ]);

  const user        = userSnap.data();
  const recentTasks = tasksSnap.docs.map(d => d.data());
  const reply       = await AIService.chatAssistant({ message, user, streak: user.streak, recentTasks, history });
  res.json({ success: true, reply });
});

module.exports = router;
*/


// =====================================================
// functions/routes/analytics.js
// =====================================================
/*
'use strict';
const express = require('express');
const admin   = require('firebase-admin');
const { AIService } = require('../services/aiService');

const router = express.Router();

router.get('/', async (req, res) => {
  const userId  = req.user.uid;
  const { period = 'week' } = req.query;
  const db      = admin.firestore();

  const days    = period === 'month' ? 30 : 7;
  const since   = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const snap    = await db.collection('tasks')
    .where('userId', '==', userId)
    .where('createdAt', '>=', since)
    .get();

  const tasks     = snap.docs.map(d => d.data());
  const completed = tasks.filter(t => t.completed).length;
  const total     = tasks.length;
  const rate      = total > 0 ? Math.round((completed / total) * 100) : 0;

  const user   = await db.collection('users').doc(userId).get().then(s => s.data());
  const streak = user.streak;

  const byCategory = tasks.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + (t.completed ? 1 : 0);
    return acc;
  }, {});

  const byDay = tasks.filter(t => t.completed).reduce((acc, t) => {
    const d = new Date(t.completedAt?.toDate?.() || Date.now()).toLocaleDateString('en', { weekday: 'short' });
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const score  = Math.min(100, Math.round(rate * 0.6 + completed * 2 + streak.current * 0.5));
  const insight = await AIService.generateWeeklyInsight({ stats: { completed, completionRate: rate, productivityScore: score, bestDay: 'Wed' }, streak });

  res.json({
    success: true,
    period,
    stats: { completed, total, completionRate: rate, productivityScore: score },
    streak,
    breakdown: { byCategory, byDay },
    aiInsight: insight,
  });
});

module.exports = router;
*/
