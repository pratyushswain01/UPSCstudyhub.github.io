import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// You can get these values from your Firebase Console (Project Settings)
const firebaseConfig = {
    apiKey: "AIzaSyBoPtr3d8se-fcGXkzixG8OE7dFvYjPcs4",
    authDomain: "upscstudyhub-github.firebaseapp.com",
    databaseURL: "https://upscstudyhub-github-default-rtdb.firebaseio.com",
    projectId: "upscstudyhub-github",
    storageBucket: "upscstudyhub-github.firebasestorage.app",
    messagingSenderId: "451692540885",
    appId: "1:451692540885:web:b425e85128e5de97c7c35c",
    measurementId: "G-33F0XSLP53"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
export const db = getFirestore(app);