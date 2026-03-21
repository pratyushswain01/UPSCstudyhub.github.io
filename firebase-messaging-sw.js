importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBoPtr3d8se-fcGxkzixG8OE7dfVyjPcs4",
  authDomain: "upscstudyhub-github.firebaseapp.com",
  projectId: "upscstudyhub-github",
  messagingSenderId: "451692540885",
  appId: "1:451692540885:web:b425e85128e5de97c7c35c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);

  const notificationTitle = payload.notification?.title || "UPSC Hub";
  const notificationOptions = {
    body: payload.notification?.body || "New update available",
    icon: "/images/LOGO.jpg",
    badge: "/images/LOGO.jpg",
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
