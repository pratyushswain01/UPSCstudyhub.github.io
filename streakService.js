'use strict';

/**
 * STREAK SERVICE
 */
const admin     = require('firebase-admin');
const functions = require('firebase-functions');

const FREEZE_DAYS_PER_WEEK = 2;
const MILESTONES = [7, 14, 21, 30, 60, 90, 180, 365];

async function getStreak(userId) {
  const db   = admin.firestore();
  const snap = await db.collection('users').doc(userId).get();
  const data = snap.data();
  return data?.streak || { current: 0, best: 0, freezeDaysLeft: FREEZE_DAYS_PER_WEEK, todayCompleted: false };
}

async function processTaskCompletion(userId) {
  const db   = admin.firestore();
  const ref  = db.collection('users').doc(userId);
  const now  = new Date();
  const today = now.toISOString().split('T')[0];

  return db.runTransaction(async (tx) => {
    const snap   = await tx.get(ref);
    const data   = snap.data();
    const streak = data.streak || { current: 0, best: 0, lastDate: null, freezeDaysLeft: FREEZE_DAYS_PER_WEEK };

    if (streak.lastDate === today) {
      // Already counted today — check if tasks needed met
      return { streak, alreadyCounted: true };
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newCurrent = streak.current;

    if (streak.lastDate === yesterdayStr) {
      newCurrent += 1; // Consecutive day
    } else if (!streak.lastDate) {
      newCurrent = 1; // First ever
    } else {
      newCurrent = 1; // Streak broken, restart
    }

    const newBest = Math.max(newCurrent, streak.best || 0);
    const isMilestone = MILESTONES.includes(newCurrent);

    const updated = {
      ...streak,
      current:       newCurrent,
      best:          newBest,
      lastDate:      today,
      todayCompleted: true,
    };

    tx.update(ref, { streak: updated });

    // Record in streakHistory
    tx.set(ref.collection('streakHistory').doc(today), {
      date:        today,
      completed:   true,
      streakCount: newCurrent,
    });

    return { streak: updated, isMilestone };
  });
}

async function useFreeze(userId) {
  const db  = admin.firestore();
  const ref = db.collection('users').doc(userId);

  return db.runTransaction(async (tx) => {
    const snap   = await tx.get(ref);
    const streak = snap.data()?.streak || {};

    if (!streak.freezeDaysLeft || streak.freezeDaysLeft <= 0) {
      return { success: false, max: FREEZE_DAYS_PER_WEEK };
    }

    const today = new Date().toISOString().split('T')[0];
    const updated = {
      ...streak,
      freezeDaysLeft: streak.freezeDaysLeft - 1,
      lastDate:       today,
      todayCompleted: true,
    };
    tx.update(ref, { streak: updated });
    tx.set(ref.collection('streakHistory').doc(today), { date: today, freeze: true, streakCount: streak.current });
    return { success: true, freezeDaysLeft: updated.freezeDaysLeft };
  });
}

async function resetWeeklyFreezes() {
  const db   = admin.firestore();
  const snap = await db.collection('users').get();
  const batch = db.batch();
  snap.docs.forEach(doc => {
    batch.update(doc.ref, { 'streak.freezeDaysLeft': FREEZE_DAYS_PER_WEEK });
  });
  await batch.commit();
  functions.logger.info('Weekly freeze reset complete', { users: snap.size });
}

module.exports = { StreakService: { getStreak, processTaskCompletion, useFreeze, resetWeeklyFreezes } };
