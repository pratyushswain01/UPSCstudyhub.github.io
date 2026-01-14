// Import Firebase scripts for the background worker
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize with your project config (from Project Settings)
firebase.initializeApp({
  apiKey: "AIzaSyBoPtr3d8se-fcGXkzixG8OE7dFvYjPcs4",
  projectId: "upscstudyhub-github",
  messagingSenderId: "451692540885",
  appId: "1:451692540885:web:b425e85128e5de97c7c35c"
});

const messaging = firebase.messaging();

// This handles the notification when the app is in the background
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'images/LOGO.jpg' // Add your logo path here
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
