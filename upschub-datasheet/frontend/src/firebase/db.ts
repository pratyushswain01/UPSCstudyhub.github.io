import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from './config.js'; // Ensure this points to your firebase setup

export const saveQuizResult = async (userId: string, xpEarned: number) => {
    try {
        const userRef = doc(db, 'users', userId);

        // Increment XP and update progress
        await updateDoc(userRef, {
            xp: increment(xpEarned),
            lastUpdated: new Date().toISOString()
        });

        console.log("✅ XP Saved to Firestore");
    } catch (error) {
        console.error("❌ Error saving progress:", error);
    }
};