require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

// ─── FIREBASE INIT ─────────────────
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors({
  origin: [
    'https://upscstudyhub-github.web.app',
    'https://upscstudyhub-github.firebaseapp.com',
    'http://localhost:5003',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors());
app.use(express.json());

// ─── BASIC ROUTE ─────────────────
app.get('/', (req, res) => {
  res.send('🚀 UPSChub AI Server Running');
});

// ─── SAFE IMPORTS ─────────────────
let sendTelegramReminder, sendWhatsAppReminder, generateReminder;

try {
  ({ sendTelegramReminder } = require('./telegram'));
} catch (e) {
  console.log("⚠️ Telegram module not working:", e.message);
}

try {
  ({ sendWhatsAppReminder } = require('./whatsapp'));
} catch (e) {
  console.log("⚠️ WhatsApp module not working:", e.message);
}

try {
  ({ generateReminder } = require('./aiService'));
} catch (e) {
  console.log("⚠️ AI module not working:", e.message);
}

// ─── TEST ROUTES ─────────────────
app.get('/test-telegram', async (req, res) => {
  if (!sendTelegramReminder) return res.send("❌ Telegram module not available");
  try {
    await sendTelegramReminder({ title: "Test Task", time: "Now" });
    res.send("✅ Telegram message sent");
  } catch (err) {
    res.send("❌ Error: " + err.message);
  }
});

app.get('/test-whatsapp', async (req, res) => {
  if (!sendWhatsAppReminder) return res.send("❌ WhatsApp module not available");
  try {
    await sendWhatsAppReminder({ title: "Test Task", time: "Now" });
    res.send("✅ WhatsApp message sent");
  } catch (err) {
    res.send("❌ Error: " + err.message);
  }
});

app.get('/test-ai', async (req, res) => {
  if (!generateReminder) return res.send("❌ AI module not available");
  try {
    const msg = await generateReminder("Study Polity");
    res.send("🤖 AI says: " + msg);
  } catch (err) {
    res.send("❌ Error: " + err.message);
  }
});

// ─── TASK ROUTES ─────────────────

// ➕ Add Task → saves to Firestore under user's subcollection
app.post('/add-task', async (req, res) => {
  try {
    const { title, category, priority, due, notes, userId } = req.body;

    const taskData = {
      title,
      category:  category  || 'work',
      priority:  priority  || 'medium',
      due:       due       || 'Today',
      notes:     notes     || '',
      completed: false,
      createdAt: Date.now(),
      userId:    userId || 'anonymous'
    };

    const ref = await db
      .collection('tasks')
      .doc(userId || 'anonymous')
      .collection('userTasks')
      .add(taskData);

    console.log("✅ Task saved:", ref.id);

    if (sendTelegramReminder) {
      await sendTelegramReminder({ title, time: "Added Now ✅" });
    }

    res.json({ id: ref.id, ...taskData });

  } catch (err) {
    console.error("❌ Add task error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 📋 Get All Tasks for a user from Firestore
app.get('/tasks', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const snapshot = await db
      .collection('tasks')
      .doc(userId)
      .collection('userTasks')
      .orderBy('createdAt', 'desc')
      .get();

    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tasks);

  } catch (err) {
    console.error("❌ Get tasks error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Complete Task → updates Firestore
app.post('/complete-task', async (req, res) => {
  try {
    const { id, completed, userId } = req.body;

    if (!userId || !id) {
      return res.status(400).json({ error: 'userId and id are required' });
    }

    await db
      .collection('tasks')
      .doc(userId)
      .collection('userTasks')
      .doc(id)
      .update({
        completed:   completed !== undefined ? completed : true,
        completedAt: completed !== false ? Date.now() : null
      });

    console.log("✅ Task updated in Firestore:", id);
    res.json({ success: true });

  } catch (err) {
    console.error("❌ Complete task error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete Task → removes from Firestore
app.post('/delete-task', async (req, res) => {
  try {
    const { id, userId } = req.body;

    if (!userId || !id) {
      return res.status(400).json({ error: 'userId and id are required' });
    }

    await db
      .collection('tasks')
      .doc(userId)
      .collection('userTasks')
      .doc(id)
      .delete();

    console.log("✅ Task deleted from Firestore:", id);
    res.json({ success: true });

  } catch (err) {
    console.error("❌ Delete task error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── STREAK ROUTES ─────────────────

// GET /streak — returns current streak data for a user
app.get('/streak', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const doc = await db.collection('streaks').doc(userId).get();
    if (!doc.exists) {
      return res.json({ currentStreak: 0, bestStreak: 0, freezeDaysLeft: 2, lastActiveDate: null, dailyGoal: 3 });
    }
    res.json(doc.data());
  } catch (err) {
    console.error('❌ Get streak error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /update-streak — recalculates streak based on tasks completed today vs daily goal
app.post('/update-streak', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    // --- get user settings (dailyGoal) ---
    const settingsDoc = await db.collection('userSettings').doc(userId).get();
    const dailyGoal = settingsDoc.exists ? (settingsDoc.data().dailyGoal || 3) : 3;

    // --- count tasks completed TODAY ---
    const tasksSnap = await db
      .collection('tasks').doc(userId).collection('userTasks')
      .where('completed', '==', true)
      .get();

    const todayCount = tasksSnap.docs.filter(d => {
      const completedAt = d.data().completedAt;
      if (!completedAt) return true; // no timestamp = legacy task, count it
      const dateStr = new Date(completedAt).toISOString().split('T')[0];
      return dateStr === today;
    }).length;

    const goalMet = todayCount >= dailyGoal;

    // --- get current streak doc ---
    const streakRef = db.collection('streaks').doc(userId);
    const streakDoc = await streakRef.get();
    let data = streakDoc.exists
      ? streakDoc.data()
      : { currentStreak: 0, bestStreak: 0, freezeDaysLeft: 2, lastActiveDate: null, dailyGoal: dailyGoal };

    const last = data.lastActiveDate; // "YYYY-MM-DD" or null

    // Calculate day difference
    let dayDiff = 0;
    if (last) {
      const lastDate = new Date(last);
      const todayDate = new Date(today);
      dayDiff = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
    }

    let currentStreak  = data.currentStreak  ?? 0;
    let bestStreak     = data.bestStreak     ?? 0;
    let freezeDaysLeft = data.freezeDaysLeft ?? 2;

    if (goalMet) {
      if (!last || dayDiff === 0) {
        // Same day — just make sure streak is at least 1
        if (currentStreak === 0) currentStreak = 1;
      } else if (dayDiff === 1) {
        // Consecutive day — increment streak
        currentStreak += 1;
      } else if (dayDiff > 1) {
        // Gap — check freeze days for missed days
        const missedDays = dayDiff - 1;
        if (freezeDaysLeft >= missedDays) {
          freezeDaysLeft -= missedDays;
          currentStreak += 1; // freeze protected the gap
        } else {
          // Not enough freeze — streak resets
          freezeDaysLeft = 0;
          currentStreak = 1;
        }
      }
      // Update best streak
      if (currentStreak > bestStreak) bestStreak = currentStreak;
      data.lastActiveDate = today;
    }
    // If goal NOT met today — don't update streak yet (wait till end of day or next completion)

    const updated = { currentStreak, bestStreak, freezeDaysLeft, lastActiveDate: data.lastActiveDate, dailyGoal, todayCount, goalMet, updatedAt: Date.now() };
    await streakRef.set(updated);
    res.json(updated);

  } catch (err) {
    console.error('❌ Update streak error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /get-settings — returns user settings including telegramChatId
app.get('/get-settings', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const doc = await db.collection('userSettings').doc(userId).get();
    if (!doc.exists) return res.json({ dailyGoal: 3, freezeDays: 2, telegramChatId: null });
    res.json(doc.data());
  } catch (err) {
    console.error('❌ Get settings error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /save-settings — saves user settings (dailyGoal, freezeDays, telegramChatId)
app.post('/save-settings', async (req, res) => {
  try {
    const { userId, dailyGoal, freezeDays, telegramChatId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const update = { updatedAt: Date.now() };
    if (dailyGoal  !== undefined) update.dailyGoal  = parseInt(dailyGoal)  || 3;
    if (freezeDays !== undefined) update.freezeDays = parseInt(freezeDays) || 2;
    if (telegramChatId !== undefined) update.telegramChatId = String(telegramChatId);

    await db.collection('userSettings').doc(userId).set(update, { merge: true });

    // If streak-related settings changed, update streak doc too
    if (dailyGoal !== undefined || freezeDays !== undefined) {
      const streakUpdate = {};
      if (dailyGoal  !== undefined) streakUpdate.dailyGoal      = parseInt(dailyGoal)  || 3;
      if (freezeDays !== undefined) streakUpdate.freezeDaysLeft = parseInt(freezeDays) || 2;
      await db.collection('streaks').doc(userId).set(streakUpdate, { merge: true });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Save settings error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── HOURLY REMINDER — sends to each user's own Telegram chat ID ─────────────────
setInterval(async () => {
  if (!sendTelegramReminder) return;
  try {
    // Get all users who have a telegramChatId saved
    const settingsSnap = await db.collection('userSettings').get();
    for (const settingsDoc of settingsSnap.docs) {
      const userId = settingsDoc.id;
      const { telegramChatId } = settingsDoc.data();
      if (!telegramChatId) continue; // skip users with no Telegram linked

      // Get their incomplete tasks
      const tasksSnap = await db
        .collection('tasks').doc(userId).collection('userTasks')
        .where('completed', '==', false)
        .get();

      if (tasksSnap.empty) continue;

      // Get their streak
      const streakDoc = await db.collection('streaks').doc(userId).get();
      const streak = streakDoc.exists ? streakDoc.data().currentStreak || 0 : 0;

      // Build task list
      const taskList = tasksSnap.docs.slice(0, 5).map((d, i) => (i+1) + '. ' + d.data().title).join('\n');
      const streak_info = streak > 0 ? ' | Streak: ' + streak + ' days' : '';
      const message = 'UPSChub Reminder\n\nPending Tasks:\n' + taskList + streak_info + '\n\nKeep going!';

      await sendTelegramReminder({ chatId: telegramChatId, message });
    }
  } catch (err) {
    console.error("❌ Reminder error:", err.message);
  }
}, 3600000);

// ─── SERVE HTML ─────────────────
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'upschub-app.html'));
});

app.get('/add-task', (req, res) => {
  res.sendFile(path.join(__dirname, 'upschub-app.html'));
});

// ✅ Catch-all — must be LAST, handles any other frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'upschub-app.html'));
});

// ─── START SERVER ─────────────────
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log('🔥 Server running on port ' + PORT);
  console.log('🔥 Connected to Firestore');

  // Keep-alive: ping self every 10 mins to prevent Render free tier sleep
  setInterval(() => {
    require('https').get('https://upse-planner.onrender.com/', (res) => {
      console.log('Keep-alive ping: ' + res.statusCode);
    }).on('error', (e) => {
      console.log('Keep-alive error (ok): ' + e.message);
    });
  }, 10 * 60 * 1000); // every 10 minutes
});