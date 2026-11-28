import { watchUser } from "/auth/firebase-auth.js";
(() => {
  "use strict";
  if (window.__UG_MAINTENANCE_GATE__) return;
  window.__UG_MAINTENANCE_GATE__ = true;

  // The public root landing page remains available to everyone.
  const path = location.pathname.replace(/\\/+$/, "") || "/";
  if (path === "/" || path === "/index.html" || path === "/auth/login.html" || path === "/homeUPSChub.html") return;

  const ADMIN_UIDS = new Set(["W0IMog3J0wca3KOYjNqnOxCSxhJ3","t7ogzAcEJeO0UD8x3OkWzGiA3OF2"]);
  const style = document.createElement("style");
  style.textContent = `
    html.ug-maintenance-active,html.ug-maintenance-active body{overflow:hidden!important}
    #ug-maintenance-screen{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:26px;background:#fff;color:#1d1d1f;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif;text-align:center;box-sizing:border-box}
    #ug-maintenance-screen *{box-sizing:border-box}
    #ug-maintenance-screen .ugm-card{width:min(100%,620px)}
    #ug-maintenance-screen .ugm-mark{width:54px;height:54px;margin:0 auto 28px;border:1px solid #e5e5e7;border-radius:17px;display:grid;place-items:center;font-size:23px;font-weight:700}
    #ug-maintenance-screen .ugm-eyebrow{color:#86868b;font-size:11px;font-weight:700;letter-spacing:2px}
    #ug-maintenance-screen h1{margin:17px 0 12px;font-size:clamp(30px,5vw,44px);line-height:1.08;letter-spacing:-1.8px}
    #ug-maintenance-screen .ugm-copy{margin:0 auto;color:#6e6e73;font-size:16px;line-height:1.65;max-width:510px}
    #ug-maintenance-screen .ugm-status{display:inline-flex;align-items:center;gap:9px;margin-top:27px;padding:10px 14px;border:1px solid #e8e8ed;border-radius:999px;color:#424245;font-size:12px;font-weight:600}
    #ug-maintenance-screen .ugm-dot{width:7px;height:7px;border-radius:50%;background:#d49b38;box-shadow:0 0 0 4px #f8f1e4}
    #ug-maintenance-screen .ugm-admin{display:inline-block;margin-top:28px;color:#6e6e73;font-size:12px;text-decoration:none;border-bottom:1px solid #d2d2d7;padding:7px 2px}
    #ug-maintenance-screen .ugm-admin:hover{color:#1d1d1f;border-color:#1d1d1f}
    #ug-maintenance-screen .ugm-foot{margin-top:44px;color:#a1a1a6;font-size:11px}
  `;
  document.documentElement.appendChild(style);
  const screen=document.createElement("main");
  screen.id="ug-maintenance-screen";
  screen.setAttribute("role","status");
  screen.setAttribute("aria-live","polite");
  const next = location.pathname + location.search + location.hash;
  const loginUrl = "/auth/login.html?next=" + encodeURIComponent(next);
  screen.innerHTML='<div class="ugm-card"><div class="ugm-mark">G</div><div class="ugm-eyebrow">UPSC GURUKUL · SYSTEM NOTICE</div><h1>We’ll be back shortly.</h1><p class="ugm-copy">We’re upgrading our backend infrastructure and hardening authentication, access controls and data protection to improve platform security and reliability.</p><div class="ugm-status"><span class="ugm-dot"></span>Backend security maintenance in progress</div><div><a class="ugm-admin" href="'+loginUrl+'">Administrator sign-in</a></div><div class="ugm-foot">Thank you for your patience · UPSC Gurukul</div></div>';
  document.documentElement.classList.add("ug-maintenance-active");
  (document.body||document.documentElement).appendChild(screen);

  let settled=false;
  const timeout=setTimeout(()=>{
    if(!settled)screen.querySelector(".ugm-copy").textContent="The platform is undergoing a security update. Please try again shortly.";
  },10000);
  watchUser(user=>{
    if(settled)return;
    if(user && ADMIN_UIDS.has(user.uid)){
      settled=true;clearTimeout(timeout);
      screen.remove();style.remove();
      document.documentElement.classList.remove("ug-maintenance-active");
      document.documentElement.dataset.ugAdminAccess="granted";
    } else if(user) {
      settled=true;clearTimeout(timeout);
      screen.querySelector(".ugm-copy").textContent="This area is temporarily restricted during maintenance. Administrator access is required.";
    } else {
      // Keep the maintenance screen visible while signed out; the administrator link remains available.
      settled=true;clearTimeout(timeout);
    }
  });
})();
