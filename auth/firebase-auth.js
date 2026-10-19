/**
 * auth/firebase-auth.js
 * UPSC गुरुकुल — single Firebase project
 * One registration → logged in on website + app (same domain)
 */
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const FB = {
  apiKey: "AIzaSyBoPtr3d8se-fcGXkzixG8OE7dFvYjPcs4",
  authDomain: "upscstudyhub-github.firebaseapp.com",
  projectId: "upscstudyhub-github",
  storageBucket: "upscstudyhub-github.firebasestorage.app",
  messagingSenderId: "451692540885",
  appId: "1:451692540885:web:b425e85128e5de97c7c35c"
};

const app = getApps().length ? getApp() : initializeApp(FB);
export const auth = getAuth(app);

// Keep session across tabs/pages (and app WebView on same domain)
setPersistence(auth, browserLocalPersistence).catch(() => {
  /* ignore if storage blocked */
});

export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification
};

/** Subscribe to auth state on any page */
export function watchUser(callback) {
  return onAuthStateChanged(auth, callback);
}

/** Friendly error text for UI */
export function authErrorMessage(error) {
  const map = {
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/user-not-found": "No account found. Please sign up.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/email-already-in-use": "This email is already registered. Please log in.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/popup-blocked": "Allow popups and try again.",
    "auth/unauthorized-domain": "Add this domain in Firebase Authorized domains.",
    "auth/network-request-failed": "Network error. Check your connection."
  };
  return map[error?.code] || error?.message || "Authentication failed. Please try again.";
}