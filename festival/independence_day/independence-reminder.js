/**
 * UPSChub — Independence Day 2026 Top Reminder Bar
 * Self-contained • Fully isolated • Does NOT touch the large banner
 * Namespace: id26-reminder
 */

(function () {
  'use strict';

  /* =========================================================
     CONFIGURATION
     ========================================================= */
  const CONFIG = {
    enabled: true,
    eventDate: '2026-08-15',          // YYYY-MM-DD
    autoShow: true,
    storageKey: 'upsChubIndependenceReminderClosed',
    zIndex: 99990                     // just below the large banner (99999)
  };

  /* =========================================================
     EARLY EXIT
     ========================================================= */
  if (!CONFIG.enabled) return;

  // Only show on/around the event day (optional safety)
  function isRelevantDate() {
    try {
      const today = new Date();
      const event = new Date(CONFIG.eventDate + 'T00:00:00');
      const diffDays = Math.abs((today - event) / (1000 * 60 * 60 * 24));
      return diffDays <= 3; // show 3 days before/after (adjust if needed)
    } catch (e) {
      return true;
    }
  }

  if (!isRelevantDate()) return;

  /* =========================================================
     STORAGE
     ========================================================= */
  function isReminderClosed() {
    try {
      return sessionStorage.getItem(CONFIG.storageKey) === 'true';
    } catch (e) {
      return false;
    }
  }

  function markReminderClosed() {
    try {
      sessionStorage.setItem(CONFIG.storageKey, 'true');
    } catch (e) {}
  }

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    if (isReminderClosed()) return;
    if (document.getElementById('id26-reminder-root')) return;

    injectStyles();
    createReminder();
    bindEvents();
  }

  /* =========================================================
     STYLES (fully scoped)
     ========================================================= */
  function injectStyles() {
    if (document.getElementById('id26-reminder-styles')) return;

    const css = `
/* ========== ID26 REMINDER – COMPLETELY ISOLATED ========== */
#id26-reminder-root {
  --saffron: #FF9933;
  --white: #FFFFFF;
  --green: #138808;
  --navy: #0b1220;
  --chakra: #000080;
  --text: #f1f5f9;
  --muted: #94a3b8;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${CONFIG.zIndex};
  transform: translateY(-100%);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  pointer-events: none;
}

#id26-reminder-root.id26-reminder-visible {
  transform: translateY(0);
  pointer-events: auto;
}

#id26-reminder-root * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#id26-reminder-root .id26-reminder-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 56px;
  padding: 10px 16px;
  background: linear-gradient(
    90deg,
    rgba(255, 153, 51, 0.15) 0%,
    rgba(15, 23, 42, 0.92) 18%,
    rgba(15, 23, 42, 0.95) 82%,
    rgba(19, 136, 8, 0.15) 100%
  );
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 153, 51, 0.25);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
  color: var(--text);
}

/* Left accent line */
#id26-reminder-root .id26-reminder-bar::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, var(--saffron), var(--white), var(--green));
}

#id26-reminder-root .id26-reminder-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

#id26-reminder-root .id26-reminder-flag {
  flex-shrink: 0;
  font-size: 1.35rem;
  line-height: 1;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
}

#id26-reminder-root .id26-reminder-text-wrap {
  min-width: 0;
}

#id26-reminder-root .id26-reminder-title {
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--white);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#id26-reminder-root .id26-reminder-sub {
  font-size: 0.78rem;
  color: var(--muted);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#id26-reminder-root .id26-reminder-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

#id26-reminder-root .id26-reminder-open {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, var(--saffron), #e67e22);
  color: #1a1200;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;
  box-shadow: 0 2px 12px rgba(255, 153, 51, 0.35);
}

#id26-reminder-root .id26-reminder-open:hover,
#id26-reminder-root .id26-reminder-open:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(255, 153, 51, 0.5);
  outline: none;
}

#id26-reminder-root .id26-reminder-open:active {
  transform: translateY(0);
}

#id26-reminder-root .id26-reminder-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: var(--white);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

#id26-reminder-root .id26-reminder-close:hover,
#id26-reminder-root .id26-reminder-close:focus-visible {
  background: rgba(255, 153, 51, 0.25);
  border-color: var(--saffron);
  outline: none;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  #id26-reminder-root {
    transition: none !important;
  }
}

/* ========== MOBILE ========== */
@media (max-width: 640px) {
  #id26-reminder-root .id26-reminder-bar {
    min-height: 72px;
    padding: 12px 14px;
    flex-wrap: wrap;
    gap: 10px;
  }

  #id26-reminder-root .id26-reminder-left {
    width: 100%;
    order: 1;
  }

  #id26-reminder-root .id26-reminder-actions {
    width: 100%;
    order: 2;
    justify-content: space-between;
  }

  #id26-reminder-root .id26-reminder-title {
    font-size: 0.88rem;
  }

  #id26-reminder-root .id26-reminder-sub {
    font-size: 0.75rem;
  }

  #id26-reminder-root .id26-reminder-open {
    flex: 1;
    justify-content: center;
    padding: 10px 14px;
    font-size: 0.82rem;
  }
}

@media (max-width: 380px) {
  #id26-reminder-root .id26-reminder-sub {
    display: none; /* keep it ultra-compact on very small screens */
  }
}
`;

    const style = document.createElement('style');
    style.id = 'id26-reminder-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* =========================================================
     CREATE DOM
     ========================================================= */
  function createReminder() {
    const root = document.createElement('div');
    root.id = 'id26-reminder-root';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Independence Day reminder');

    root.innerHTML = `
      <div class="id26-reminder-bar">
        <div class="id26-reminder-left">
          <span class="id26-reminder-flag" aria-hidden="true">🇮🇳</span>
          <div class="id26-reminder-text-wrap">
            <div class="id26-reminder-title">HAPPY INDEPENDENCE DAY</div>
            <div class="id26-reminder-sub">Celebrating 80 years of India's Independence</div>
          </div>
        </div>

        <div class="id26-reminder-actions">
          <button class="id26-reminder-open" id="id26-reminder-open-btn" type="button">
            OPEN CELEBRATION →
          </button>
          <button class="id26-reminder-close" id="id26-reminder-close-btn" type="button"
                  aria-label="Close Independence Day reminder">
            ×
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.add('id26-reminder-visible');
      });
    });
  }

  /* =========================================================
     EVENTS
     ========================================================= */
  function bindEvents() {
    const openBtn = document.getElementById('id26-reminder-open-btn');
    const closeBtn = document.getElementById('id26-reminder-close-btn');
    const root = document.getElementById('id26-reminder-root');

    // OPEN → trigger large banner
    if (openBtn) {
      openBtn.addEventListener('click', function () {
        // Preferred: CustomEvent (safest, decoupled)
        window.dispatchEvent(new CustomEvent('upsChub:openIndependenceDay'));

        // Fallback: global API if your large banner exposes it
        if (window.UPSChubIndependenceDay && typeof window.UPSChubIndependenceDay.open === 'function') {
          window.UPSChubIndependenceDay.open();
        } else {
          // Last-resort gentle warning – never breaks the page
          console.warn('[ID26 Reminder] Independence Day banner is not available or does not expose an open() method.');
        }
      });
    }

    // CLOSE → hide only the reminder
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (!root) return;
        root.classList.remove('id26-reminder-visible');
        markReminderClosed();

        // Clean up after animation
        setTimeout(() => {
          root.remove();
          const styles = document.getElementById('id26-reminder-styles');
          if (styles) styles.remove();
        }, 500);
      });
    }
  }

  /* =========================================================
     BOOT
     ========================================================= */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
