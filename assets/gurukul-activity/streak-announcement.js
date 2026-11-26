/* UPSC Gurukul — Daily Study Streak launch notice
   Shown once per browser profile; works in the Android WebView too. */
(function () {
  "use strict";
  const KEY = "gurukul-streak-launch-notice-dismissed-v1";
  const STYLE_ID = "gurukul-streak-launch-style";
  const MODAL_ID = "gurukul-streak-launch-notice";
  if (window.__GURUKUL_STREAK_NOTICE__) return;
  window.__GURUKUL_STREAK_NOTICE__ = true;

  function showNotice() {
    try { if (localStorage.getItem(KEY) === "1") return; } catch (_) {}
    if (document.getElementById(MODAL_ID)) return;

    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        #${MODAL_ID}{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:18px;background:rgba(8,16,30,.68);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;animation:gurukulNoticeFade .22s ease}
        #${MODAL_ID} *{box-sizing:border-box}
        #${MODAL_ID} .gn-card{position:relative;width:min(100%,470px);overflow:hidden;border:1px solid rgba(220,190,125,.32);border-radius:25px;background:linear-gradient(155deg,#17283e 0%,#0b1729 70%,#101f34 100%);color:#f8f4ea;box-shadow:0 28px 90px rgba(0,0,0,.42);padding:30px 27px 24px}
        #${MODAL_ID} .gn-glow{position:absolute;width:220px;height:220px;right:-100px;top:-115px;border-radius:50%;background:rgba(218,176,93,.2);filter:blur(8px);pointer-events:none}
        #${MODAL_ID} .gn-close{position:absolute;right:15px;top:14px;width:34px;height:34px;border:1px solid rgba(255,255,255,.16);border-radius:50%;background:rgba(255,255,255,.07);color:#fff;font-size:22px;line-height:1;cursor:pointer}
        #${MODAL_ID} .gn-icon{display:grid;place-items:center;width:52px;height:52px;margin-bottom:18px;border-radius:17px;background:rgba(222,184,105,.13);border:1px solid rgba(222,184,105,.28);font-size:26px}
        #${MODAL_ID} .gn-eyebrow{color:#dfbd78;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase}
        #${MODAL_ID} h2{margin:9px 0 10px;color:#fff;font-size:clamp(25px,6vw,32px);line-height:1.12;letter-spacing:-.8px}
        #${MODAL_ID} .gn-copy{margin:0;color:#c6d0dc;font-size:14px;line-height:1.65}
        #${MODAL_ID} .gn-features{display:grid;gap:10px;margin:20px 0 22px;padding:15px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:rgba(255,255,255,.045)}
        #${MODAL_ID} .gn-feature{display:flex;align-items:flex-start;gap:10px;color:#e8edf3;font-size:12px;line-height:1.45}
        #${MODAL_ID} .gn-check{color:#e6c57f;font-weight:900}
        #${MODAL_ID} .gn-actions{display:flex;gap:10px}
        #${MODAL_ID} .gn-primary,#${MODAL_ID} .gn-secondary{min-height:45px;border-radius:13px;padding:0 16px;font-size:13px;font-weight:800;cursor:pointer}
        #${MODAL_ID} .gn-primary{flex:1;border:0;background:linear-gradient(135deg,#f0d99f,#c99a4b);color:#172337}
        #${MODAL_ID} .gn-secondary{border:1px solid rgba(255,255,255,.18);background:transparent;color:#e7edf5}
        #${MODAL_ID} .gn-foot{margin:15px 0 0;text-align:center;color:#95a4b6;font-size:10px}
        @keyframes gurukulNoticeFade{from{opacity:0}to{opacity:1}}
        @media(max-width:420px){#${MODAL_ID}{padding:13px}#${MODAL_ID} .gn-card{padding:25px 20px 20px;border-radius:21px}#${MODAL_ID} .gn-actions{flex-direction:column}#${MODAL_ID} .gn-secondary{min-height:40px}}
        @media(prefers-reduced-motion:reduce){#${MODAL_ID}{animation:none}}
      `;
      document.head.appendChild(style);
    }

    const overlay = document.createElement("div");
    overlay.id = MODAL_ID;
    overlay.setAttribute("role", "presentation");
    overlay.innerHTML = `
      <section class="gn-card" role="dialog" aria-modal="true" aria-labelledby="gn-title" aria-describedby="gn-copy">
        <div class="gn-glow" aria-hidden="true"></div>
        <button class="gn-close" type="button" aria-label="Close notice">×</button>
        <div class="gn-icon" aria-hidden="true">🔥</div>
        <div class="gn-eyebrow">A new way to stay consistent</div>
        <h2 id="gn-title">Your study streak starts here.</h2>
        <p class="gn-copy" id="gn-copy">Introducing Daily Study Streaks on UPSC Gurukul. Turn your daily effort into a habit and see your consistency grow, one focused day at a time.</p>
        <div class="gn-features">
          <div class="gn-feature"><span class="gn-check">✓</span><span><strong>30 minutes a day</strong> of verified active study protects your streak.</span></div>
          <div class="gn-feature"><span class="gn-check">✓</span><span><strong>Track your progress</strong> with current streak, best streak and daily goal progress.</span></div>
          <div class="gn-feature"><span class="gn-check">✓</span><span><strong>Across your devices</strong> when you sign in with the same Gurukul account.</span></div>
        </div>
        <div class="gn-actions">
          <button class="gn-primary" type="button" data-gn-view>View my streak</button>
          <button class="gn-secondary" type="button" data-gn-close>Maybe later</button>
        </div>
        <p class="gn-foot">Your progress is personal. Your consistency is powerful.</p>
      </section>`;
    document.body.appendChild(overlay);

    function dismiss() {
      try { localStorage.setItem(KEY, "1"); } catch (_) {}
      overlay.remove();
    }
    overlay.querySelector(".gn-close").addEventListener("click", dismiss);
    overlay.querySelector("[data-gn-close]").addEventListener("click", dismiss);
    overlay.addEventListener("click", event => { if (event.target === overlay) dismiss(); });
    document.addEventListener("keydown", function onKey(event) {
      if (event.key === "Escape" && document.getElementById(MODAL_ID)) {
        dismiss(); document.removeEventListener("keydown", onKey);
      }
    });
    overlay.querySelector("[data-gn-view]").addEventListener("click", () => {
      dismiss();
      const trigger = document.querySelector("#gurukul-activity-bar .ga-trigger");
      if (trigger) trigger.click();
      else window.location.hash = "gurukul-activity-bar";
    });
    overlay.querySelector(".gn-close").focus();
  }

  function init() {
    window.setTimeout(showNotice, 1100);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
