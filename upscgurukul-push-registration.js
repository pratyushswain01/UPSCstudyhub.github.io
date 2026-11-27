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

const VAPID_KEY = "BAH-ScLXAlvU4Ug9tpLCgxjqdyNkjmUlql5G6EF_71xk5t0sHHMTKO6-Yn8R8GzThiXEmrosiGlfWASXwLjbnsU";

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

function updateSidebarButton(label, enabled = false) {
  const button = document.getElementById("ug-sidebar-notifications");
  if (!button) return;
  const span = button.querySelector("span");
  if (span) span.textContent = label;
  button.classList.toggle("is-enabled", enabled);
  button.disabled = enabled;
}
let registering = false;
async function enableFromSidebar() {
  if (registering) return;
  registering = true;
  const button = document.getElementById("ug-sidebar-notifications");
  if (button) { button.disabled = true; const span=button.querySelector("span"); if(span)span.textContent="Enabling notifications…"; }
  try {
    const platform = await registerPush();
    updateSidebarButton("Notifications enabled ✓", true);
    console.info("[UPSC Gurukul] Notifications enabled on", platform);
  } catch (error) {
    console.error("[UPSC Gurukul push]", error);
    updateSidebarButton("Retry notifications", false);
    if (button) button.disabled = false;
    alert("Push registration failed:\\n" + (error?.message || "Unknown error"));
  } finally { registering = false; }
}
document.addEventListener("ug:enable-notifications", enableFromSidebar);
// Run as soon as possible
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function init() {
  if (Notification.permission === "granted") {
    registerPush().then(() => updateSidebarButton("Notifications enabled ✓", true))
      .catch(() => updateSidebarButton("Enable notifications", false));
  } else {
    updateSidebarButton("Enable notifications", false);
  }
}




