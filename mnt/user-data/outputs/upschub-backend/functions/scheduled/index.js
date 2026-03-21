'use strict';

/**
 * SCHEDULED CLOUD FUNCTIONS
 * All cron-driven jobs for reminders, streak checks, and analytics.
 */

const functions = require('firebase-functions');
const admin     = require('firebase-admin');

const { AIService }           = require('./services/aiService');
const { FCMService }          = require('./services/fcmService');
const { StreakService }        = require('./services/streakService');
const { TelegramService }     = require('./webhooks/telegram');
const { WhatsAppService }     = require('./webhooks/whatsapp');

// ─── MORNING BRIEFING — 8:00 AM daily ─────────────────────────────────────────
exports.dailyMorningBriefing = functions
  .runWith({ timeoutSeconds: 540, memory: '512MB' })
  .pubsub.schedule('0 8 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async () => {
    const db   = admin.firestore();
    const snap = await db.collection('users')
      .where('preferences.notifications.morning', '==', true)
      .get();

    const jobs = snap.docs.map(async (doc) => {
      const user   = { uid: doc.id, ...doc.data() };
      const tasks  = await getTodayTasksForUser(doc.id);
      const streak = user.streak;

      // Generate AI message once, reuse across channels
      const aiMsg = await AIService.generateMorningBriefing({ user, tasks, streak });

      await Promise.allSettled([
        user.preferences?.notifications?.fcm &&
          FCMService.sendMorningBriefingPush(doc.id, tasks.length, aiMsg),
        user.telegram?.chatId &&
          user.preferences?.notifications?.telegram &&
          TelegramService.sendMessage(user.telegram.chatId,
            `🌅 <b>Good morning, ${user.displayName}!</b>\n\n${aiMsg}\n\n` +
            `📋 Tasks today: <b>${tasks.length}</b>\n🔥 Streak: <b>${streak.current} days</b>`
          ),
        user.phone &&
          user.preferences?.notifications?.whatsapp &&
          WhatsAppService.sendMorningBriefing(doc.id),
      ]);
    });

    await Promise.allSettled(jobs);
    functions.logger.info('Morning briefings sent', { count: snap.size });
  });

// ─── DEADLINE REMINDERS — every 15 min ────────────────────────────────────────
exports.deadlineReminders = functions
  .runWith({ timeoutSeconds: 300, memory: '256MB' })
  .pubsub.schedule('*/15 * * * *')
  .onRun(async () => {
    const db  = admin.firestore();
    const now = new Date();
    const in30 = new Date(now.getTime() + 30 * 60 * 1000);
    const in15 = new Date(now.getTime() + 15 * 60 * 1000);

    const snap = await db.collection('tasks')
      .where('completed', '==', false)
      .where('dueDate', '>=', in15)
      .where('dueDate', '<=', in30)
      .where('reminderSent', '==', false)
      .limit(50)
      .get();

    const jobs = snap.docs.map(async (doc) => {
      const task = { id: doc.id, ...doc.data() };
      const user = await db.collection('users').doc(task.userId).get().then(s => s.data());
      if (!user) return;

      const mins  = Math.round((new Date(task.dueDate) - now) / 60000);
      const aiMsg = await AIService.generateDeadlineAlert({ task, minutesBefore: mins, streak: user.streak });

      await Promise.allSettled([
        user.preferences?.notifications?.fcm    && FCMService.sendTaskReminder(task.userId, task, aiMsg),
        user.telegram?.chatId                   && TelegramService.sendMessage(user.telegram.chatId, `⏰ ${aiMsg}`),
        user.phone                              && WhatsAppService.sendDeadlineAlert(task.userId, task, mins),
      ]);

      // Mark reminder as sent
      await doc.ref.update({ reminderSent: true });
    });

    await Promise.allSettled(jobs);
    functions.logger.info('Deadline reminders sent', { count: snap.size });
  });

// ─── EVENING STREAK ALERT — 8:00 PM ──────────────────────────────────────────
exports.eveningStreakAlert = functions
  .pubsub.schedule('0 20 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async () => {
    const db   = admin.firestore();
    const snap = await db.collection('users')
      .where('streak.current', '>', 0)
      .where('streak.todayCompleted', '==', false)
      .get();

    const jobs = snap.docs.map(async (doc) => {
      const user   = { uid: doc.id, ...doc.data() };
      const tasks  = await getTodayTasksForUser(doc.id);
      const remaining = tasks.filter(t => !t.completed).length;
      if (remaining === 0) return;

      const aiMsg = await AIService.generateStreakDangerMessage({ streak: user.streak, tasksRemaining: remaining });

      await Promise.allSettled([
        user.preferences?.notifications?.fcm  && FCMService.sendStreakAlert(doc.id, user.streak, aiMsg),
        user.telegram?.chatId                 && TelegramService.sendMessage(user.telegram.chatId, `🔥 ${aiMsg}`),
        user.phone                            && WhatsAppService.sendStreakDangerAlert(doc.id, user.streak, remaining),
      ]);
    });

    await Promise.allSettled(jobs);
    functions.logger.info('Streak alerts sent', { count: snap.size });
  });

// ─── WEEKLY ANALYTICS REPORT — Sunday 9:00 AM ─────────────────────────────────
exports.weeklyAnalyticsReport = functions
  .pubsub.schedule('0 9 * * 0')
  .timeZone('Asia/Kolkata')
  .onRun(async () => {
    const db   = admin.firestore();
    const snap = await db.collection('users').get();

    const jobs = snap.docs.map(async (doc) => {
      const userId = doc.id;
      const stats  = await computeWeeklyStats(userId);
      const streak = doc.data().streak;
      const aiMsg  = await AIService.generateWeeklyInsight({ stats, streak });

      // Store in analytics collection
      await db.collection('analytics').doc(userId).collection('weekly').add({
        ...stats,
        aiInsight: aiMsg,
        weekEnd:   admin.firestore.FieldValue.serverTimestamp(),
      });

      // Notify user
      const user = doc.data();
      if (user.telegram?.chatId) {
        await TelegramService.sendMessage(user.telegram.chatId,
          `📊 <b>Weekly Report</b>\n\n✅ ${stats.completed} tasks done (${stats.completionRate}%)\n` +
          `📈 Score: ${stats.productivityScore}/100\n🔥 Streak: ${streak.current} days\n\n${aiMsg}`
        );
      }
    });

    await Promise.allSettled(jobs);
    functions.logger.info('Weekly reports sent');
  });

// ─── STREAK PROCESSING — midnight ─────────────────────────────────────────────
exports.streakProcessing = functions
  .pubsub.schedule('0 0 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async () => {
    const db   = admin.firestore();
    const snap = await db.collection('users').get();

    // Reset todayCompleted flags and check for broken streaks
    const batch = db.batch();
    snap.docs.forEach(doc => {
      batch.update(doc.ref, { 'streak.todayCompleted': false });
    });
    await batch.commit();

    // Reset weekly freeze days on Sunday
    const day = new Date().getDay();
    if (day === 0) await StreakService.resetWeeklyFreezes();

    functions.logger.info('Streak processing complete');
  });

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function getTodayTasksForUser(userId) {
  const db    = admin.firestore();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const snap  = await db.collection('tasks')
    .where('userId', '==', userId)
    .where('createdAt', '>=', today)
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function computeWeeklyStats(userId) {
  const db      = admin.firestore();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const snap    = await db.collection('tasks')
    .where('userId', '==', userId)
    .where('createdAt', '>=', weekAgo)
    .get();

  const tasks     = snap.docs.map(d => d.data());
  const completed = tasks.filter(t => t.completed).length;
  const total     = tasks.length;
  const rate      = total > 0 ? Math.round((completed / total) * 100) : 0;

  const byDay = {};
  tasks.filter(t => t.completed).forEach(t => {
    const d = new Date(t.completedAt?.toDate?.() || Date.now()).toLocaleDateString('en', { weekday: 'short' });
    byDay[d] = (byDay[d] || 0) + 1;
  });
  const bestDay = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return {
    completed,
    created:            total,
    completionRate:     rate,
    productivityScore:  Math.min(100, Math.round(rate * 0.6 + (completed * 2))),
    bestDay,
    tasksByDay:         byDay,
  };
}
