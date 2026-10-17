import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getMessaging, getToken, isSupported } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyBoPtr3d8se-fcGXkzixG8OE7dFvYjPcs4",
  authDomain: "upscstudyhub-github.firebaseapp.com",
  projectId: "upscstudyhub-github",
  storageBucket: "upscstudyhub-github.appspot.com",
  messagingSenderId: "451692540885",
  appId: "1:451692540885:web:b425e85128e5de97c7c35c"
};

const VAPID_KEY = "BGKEpaujSsPlAOnayTs--9Ko5ge5Rr1ckfeYxunCD54fNNH11RKk8x9eXIlDWLRp8djIIRfctvuX9LcTyQ0V6Fo";

function getVisitorId() {
  let id = localStorage.getItem("visitorId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitorId", id);
  }
  return id;
}

async function registerPush() {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    throw new Error("This browser does not support web push notifications.");
  }
  if (!(await isSupported())) {
    throw new Error("Firebase Messaging is not supported in this browser.");
  }

  const permission = Notification.permission === "granted"
    ? "granted"
    : await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  // Register (or re-use) the messaging service worker
  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
  await navigator.serviceWorker.ready;

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration
  });
  if (!token) throw new Error("Firebase did not return an FCM token.");

  const db = getFirestore(app);
  const platform = /Android/i.test(navigator.userAgent) ? "android" : "web";
  const visitorId = getVisitorId();
  const now = serverTimestamp();

  // Write to BOTH places the Worker reads
  const common = {
    fcmToken: token,
    token: token,
    registrationToken: token,
    type: "anonymous_visitor",
    platform,
    deviceType: platform,
    notificationsEnabled: true,
    optedIn: true,
    enabled: true,
    subscribedAt: now,
    updatedAt: now
  };

  // 1. artifacts path (already used by homeUPSChub)
  await setDoc(doc(db, "artifacts", "default-app-id", "users", visitorId), common, { merge: true });

  // 2. notificationDevices path (Worker primary collection)
  // Use a deterministic ID so we never create duplicates
  const deviceId = "device_" + visitorId;
  await setDoc(doc(db, "notificationDevices", deviceId), common, { merge: true });

  console.info("[UPSC Gurukul] Token saved for", platform, "visitor", visitorId);
  return platform;
}

function addEnableButton() {
  if (document.getElementById("upscgurukul-enable-push")) return;

  const button = document.createElement("button");
  button.id = "upscgurukul-enable-push";
  button.type = "button";
  button.textContent = "Enable notifications";
  button.setAttribute("aria-label", "Enable UPSC Gurukul push notifications");
  Object.assign(button.style, {
    position: "fixed",
    right: "16px",
    bottom: "20px",
    zIndex: "2147483647",
    padding: "12px 16px",
    border: "0",
    borderRadius: "999px",
    background: "#173f8a",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 4px 16px rgba(0,0,0,.22)",
    cursor: "pointer"
  });

  button.addEventListener("click", async () => {
    button.disabled = true;
    button.textContent = "Registering...";
    try {
      const platform = await registerPush();
      button.textContent = "Notifications enabled ✓";
      button.title = "Registered as " + platform;
      setTimeout(() => button.remove(), 3000);
    } catch (error) {
      console.error("[UPSC Gurukul push]", error);
      button.disabled = false;
      button.textContent = "Retry notifications";
      button.title = error?.message || "Registration failed";
      alert("Push registration failed:\n" + (error?.message || "Unknown error"));
    }
  });

  document.body.appendChild(button);
}

// Run as soon as possible
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function init() {
  if (Notification.permission === "granted") {
    registerPush()
      .then(() => {
        document.getElementById("upscgurukul-enable-push")?.remove();
        console.info("[UPSC Gurukul] Auto-registered.");
      })
      .catch(() => addEnableButton());
  } else {
    addEnableButton();
  }
}
