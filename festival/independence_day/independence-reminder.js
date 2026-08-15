/**
 * UPSChub — Independence Day 2026 Top Reminder Bar
 * Shows on EVERY page load / refresh (even after closing)
 */

(function () {
  'use strict';

  const CONFIG = {
    enabled: true,
    eventDate: '2026-08-15',
    zIndex: 99990
  };

  if (!CONFIG.enabled) return;

  // Show only around Independence Day
  function isRelevantDate() {
    try {
      const today = new Date();
      const event = new Date(CONFIG.eventDate + 'T00:00:00');
      const diff = Math.abs((today - event) / (1000 * 60 * 60 * 24));
      return diff <= 4;
    } catch (e) {
      return true;
    }
  }

  if (!isRelevantDate()) return;

  function init() {
    // Always show — no storage check
    if (document.getElementById('id26-reminder-root')) return;

    injectStyles();
    createReminder();
    bindEvents();
  }

  function injectStyles() {
    if (document.getElementById('id26-reminder-styles')) return;

    const css = `
#id26-reminder-root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${CONFIG.zIndex};
  transform: translateY(-100%);
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  pointer-events: none;
}
#id26-reminder-root.id26-reminder-visible {
  transform: translateY(0);
  pointer-events: auto;
}
#id26-reminder-root * { box-sizing: border-box; margin: 0; padding: 0; }

#id26-reminder-root .id26-reminder-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 56px;
  padding: 10px 16px;
  background: linear-gradient(90deg, rgba(255,153,51,0.18) 0%, rgba(15,23,42,0.95) 20%, rgba(15,23,42,0.95) 80%, rgba(19,136,8,0.18) 100%);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,153,51,0.3);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  color: #f1f5f9;
}
#id26-reminder-root .id26-reminder-bar::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #FF9933, #ffffff, #138808);
}
#id26-reminder-root .id26-reminder-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}
#id26-reminder-root .id26-reminder-flag {
  font-size: 1.35rem;
  flex-shrink: 0;
}
#id26-reminder-root .id26-reminder-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#id26-reminder-root .id26-reminder-sub {
  font-size: 0.78rem;
  color: #94a3b8;
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
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #FF9933, #e67e22);
  color: #1a1200;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.2s;
}
#id26-reminder-root .id26-reminder-open:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255,153,51,0.4);
}
#id26-reminder-root .id26-reminder-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.08);
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
#id26-reminder-root .id26-reminder-close:hover {
  background: rgba(255,153,51,0.3);
  border-color: #FF9933;
}

@media (max-width: 640px) {
  #id26-reminder-root .id26-reminder-bar {
    min-height: 70px;
    flex-wrap: wrap;
    padding: 12px 14px;
  }
  #id26-reminder-root .id26-reminder-left { width: 100%; }
  #id26-reminder-root .id26-reminder-actions { width: 100%; justify-content: space-between; }
  #id26-reminder-root .id26-reminder-open { flex: 1; justify-content: center; }
}
@media (max-width: 380px) {
  #id26-reminder-root .id26-reminder-sub { display: none; }
}
`;

    const style = document.createElement('style');
    style.id = 'id26-reminder-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createReminder() {
    const root = document.createElement('div');
    root.id = 'id26-reminder-root';
    root.innerHTML = `
      <div class="id26-reminder-bar">
        <div class="id26-reminder-left">
          <span class="id26-reminder-flag">🇮🇳</span>
          <div>
            <div class="id26-reminder-title">HAPPY INDEPENDENCE DAY</div>
            <div class="id26-reminder-sub">Celebrating 80 years of India's Independence</div>
          </div>
        </div>
        <div class="id26-reminder-actions">
          <button class="id26-reminder-open" id="id26-reminder-open-btn">OPEN CELEBRATION →</button>
          <button class="id26-reminder-close" id="id26-reminder-close-btn" aria-label="Close">×</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    requestAnimationFrame(() => {
      root.classList.add('id26-reminder-visible');
    });
  }

  function openLargeBanner() {
    console.log('%c[ID26] Opening large Independence Day banner...', 'color: #FF9933');

    try {
      localStorage.removeItem('upschub_id26_closed');
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('upsChub:openIndependenceDay'));

    if (typeof window.initIndependenceDay === 'function') {
      window.initIndependenceDay(true);
      return;
    }

    if (window.UPSChubIndependenceDay?.open) {
      window.UPSChubIndependenceDay.open();
    }
  }

  function bindEvents() {
    const openBtn = document.getElementById('id26-reminder-open-btn');
    const closeBtn = document.getElementById('id26-reminder-close-btn');
    const root = document.getElementById('id26-reminder-root');

    if (openBtn) {
      openBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openLargeBanner();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        root.classList.remove('id26-reminder-visible');

        // Only hide temporarily — will show again on next refresh
        setTimeout(() => {
          root.remove();
          document.getElementById('id26-reminder-styles')?.remove();
        }, 450);
      });
    }
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
