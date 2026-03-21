'use strict';

/**
 * FCM PUSH NOTIFICATION SERVICE
 * ──────────────────────────────
 * Firebase Cloud Messaging for web & mobile push notifications.
 */

const admin     = require('firebase-admin');
const functions = require('firebase-functions');

const messaging = admin.messaging();

// ─── SEND TO SINGLE DEVICE ────────────────────────────────────────────────────
async function sendToDevice(fcmToken, payload) {
  const message = {
    token: fcmToken,
    notification: {
      title: payload.title,
      body:  payload.body,
    },
    data: payload.data || {},
    webpush: {
      fcm_options: { link: payload.link || 'https://app.upschub.com' },
      notification: {
        icon:  '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        vibrate: [200, 100, 200],
        requireInteraction: payload.requireInteraction || false,
        actions: payload.actions || [],
      },
    },
    android: {
      priority: payload.priority === 'high' ? 'high' : 'normal',
      notification: { channel_id: 'upschub_main', color: '#6c63ff' },
    },
    apns: {
      payload: { aps: { badge: payload.badge || 0, sound: 'default' } },
    },
  };

  try {
    const res = await messaging.send(message);
    functions.logger.info('FCM sent', { messageId: res });
    return res;
  } catch (err) {
    if (err.code === 'messaging/registration-token-not-registered') {
      // Token expired — clean it up in Firestore
      await cleanupExpiredToken(fcmToken);
    }
    functions.logger.error('FCM error', { error: err.message });
    throw err;
  }
}

// ─── SEND TO MULTIPLE DEVICES ─────────────────────────────────────────────────
async function sendToMultipleDevices(tokens, payload) {
  if (!tokens.length) return;
  const message = {
    tokens,
    notification: { title: payload.title, body: payload.body },
    data: payload.data || {},
  };
  const res = await messaging.sendEachForMulticast(message);
  functions.logger.info('FCM multicast result', {
    success: res.successCount,
    failure: res.failureCount,
  });
  // Clean up invalid tokens
  res.responses.forEach((r, i) => {
    if (!r.success && r.error?.code === 'messaging/registration-token-not-registered') {
      cleanupExpiredToken(tokens[i]);
    }
  });
  return res;
}

// ─── SEND TO TOPIC ────────────────────────────────────────────────────────────
async function sendToTopic(topic, payload) {
  const message = {
    topic,
    notification: { title: payload.title, body: payload.body },
    data: payload.data || {},
  };
  return messaging.send(message);
}

// ─── SUBSCRIBE TO TOPIC ───────────────────────────────────────────────────────
async function subscribeToTopic(tokens, topic) {
  return messaging.subscribeToTopic(tokens, topic);
}

// ─── SEND TASK REMINDER ───────────────────────────────────────────────────────
async function sendTaskReminder(userId, task, aiMessage) {
  const db     = admin.firestore();
  const tokens = await getUserFCMTokens(userId);
  if (!tokens.length) return;

  await sendToMultipleDevices(tokens, {
    title: '⏰ Task Reminder',
    body:  aiMessage || `"${task.title}" is due soon!`,
    data:  { taskId: task.id, type: 'reminder', click_action: 'OPEN_TASK' },
    link:  `https://app.upschub.com/tasks/${task.id}`,
    requireInteraction: true,
    actions: [
      { action: 'done',    title: '✓ Done'  },
      { action: 'snooze',  title: '⏱ +15min' },
    ],
  });
}

// ─── SEND STREAK ALERT ────────────────────────────────────────────────────────
async function sendStreakAlert(userId, streak, aiMessage) {
  const tokens = await getUserFCMTokens(userId);
  if (!tokens.length) return;

  await sendToMultipleDevices(tokens, {
    title:    '🔥 Streak at Risk!',
    body:     aiMessage || `Your ${streak.current}-day streak needs saving!`,
    priority: 'high',
    data:     { type: 'streak_alert', streak: String(streak.current) },
    requireInteraction: true,
  });
}

// ─── SEND MORNING BRIEFING ────────────────────────────────────────────────────
async function sendMorningBriefingPush(userId, taskCount, aiMessage) {
  const tokens = await getUserFCMTokens(userId);
  if (!tokens.length) return;

  await sendToMultipleDevices(tokens, {
    title: '🌅 Good Morning!',
    body:  aiMessage || `You have ${taskCount} tasks today. Let's go!`,
    data:  { type: 'morning_briefing', taskCount: String(taskCount) },
    badge: taskCount,
  });
}

// ─── SEND ACHIEVEMENT UNLOCKED ────────────────────────────────────────────────
async function sendAchievementUnlocked(userId, achievement) {
  const tokens = await getUserFCMTokens(userId);
  if (!tokens.length) return;

  await sendToMultipleDevices(tokens, {
    title: `🏆 Achievement Unlocked: ${achievement.name}!`,
    body:  achievement.description,
    data:  { type: 'achievement', achievementId: achievement.id },
  });
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function getUserFCMTokens(userId) {
  const db   = admin.firestore();
  const snap = await db.collection('users').doc(userId).collection('fcmTokens').get();
  return snap.docs.map(d => d.data().token).filter(Boolean);
}

async function cleanupExpiredToken(token) {
  try {
    const db   = admin.firestore();
    const snap = await db.collectionGroup('fcmTokens').where('token', '==', token).limit(1).get();
    snap.docs.forEach(d => d.ref.delete());
  } catch (e) {
    functions.logger.warn('Token cleanup failed', { error: e.message });
  }
}

// ─── REGISTER TOKEN ENDPOINT ──────────────────────────────────────────────────
const router = require('express').Router();

router.post('/register', async (req, res) => {
  const { token, device } = req.body;
  const userId = req.user.uid;

  if (!token) return res.status(400).json({ error: 'FCM token required' });

  const db = admin.firestore();
  await db.collection('users').doc(userId).collection('fcmTokens').doc(token.slice(-20)).set({
    token,
    device:    device || 'web',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Subscribe to user-specific topic
  await subscribeToTopic([token], `user_${userId}`);

  res.json({ success: true });
});

router.delete('/unregister', async (req, res) => {
  const { token } = req.body;
  const userId    = req.user.uid;
  const db        = admin.firestore();
  await db.collection('users').doc(userId).collection('fcmTokens').doc(token.slice(-20)).delete();
  res.json({ success: true });
});

module.exports = router;

module.exports.FCMService = {
  sendToDevice,
  sendToMultipleDevices,
  sendToTopic,
  subscribeToTopic,
  sendTaskReminder,
  sendStreakAlert,
  sendMorningBriefingPush,
  sendAchievementUnlocked,
  getUserFCMTokens,
};
