(() => {
  "use strict";

  function installPrivacySideTab() {
    if (document.getElementById("ug-privacy-side-tab")) return;

    // Hide the previous bottom-corner preference shortcut.
    const style = document.createElement("style");
    style.id = "ug-privacy-side-tab-style";
    style.textContent = `
      #ug-consent-preferences {
        display: none !important;
      }

      #ug-privacy-side-tab {
        position: fixed;
        right: 0;
        top: 52%;
        transform: translateY(-50%);
        z-index: 2147483000;
        width: 36px;
        min-height: 100px;
        padding: 12px 7px;
        border: 1px solid rgba(255,255,255,.28);
        border-right: 0;
        border-radius: 12px 0 0 12px;
        background: linear-gradient(180deg, #174ea6, #102a56);
        color: #fff;
        box-shadow: 0 4px 18px rgba(0,0,0,.24);
        font: 700 12px/1.2 system-ui, sans-serif;
        letter-spacing: .3px;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        cursor: pointer;
        touch-action: pan-y;
        -webkit-tap-highlight-color: transparent;
      }

      #ug-privacy-side-tab:focus-visible {
        outline: 3px solid #facc15;
        outline-offset: 3px;
      }

      @media (max-width: 600px) {
        #ug-privacy-side-tab {
          width: 31px;
          min-height: 88px;
          padding: 10px 5px;
          font-size: 11px;
        }
      }
    `;
    document.head.appendChild(style);

    const tab = document.createElement("button");
    tab.id = "ug-privacy-side-tab";
    tab.type = "button";
    tab.textContent = "Privacy";
    tab.setAttribute("aria-label",
      "Tap to change privacy preferences. Swipe left to open the Privacy Policy.");
    tab.title = "Tap: privacy preferences · Swipe left: Privacy Policy";
    document.body.appendChild(tab);

    let startX = 0;
    let startY = 0;
    let swiped = false;

    tab.addEventListener("touchstart", (event) => {
      const touch = event.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      swiped = false;
    }, { passive: true });

    tab.addEventListener("touchend", (event) => {
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (dx < -45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        swiped = true;
        window.location.href = "/privacy.html";
      }
    }, { passive: true });

    tab.addEventListener("click", () => {
      if (swiped) {
        swiped = false;
        return;
      }

      const consent = window.UPSCGurukulConsent;

      if (consent && typeof consent.openPreferences === "function") {
        consent.openPreferences();
      } else {
        window.location.href = "/privacy.html";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installPrivacySideTab, {
      once: true
    });
  } else {
    installPrivacySideTab();
  }
})();
