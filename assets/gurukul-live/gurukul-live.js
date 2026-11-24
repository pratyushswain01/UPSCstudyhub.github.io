(() => {
  "use strict";

  if (window.__GURUKUL_LIVE_ISLAND__) return;
  window.__GURUKUL_LIVE_ISLAND__ = true;

  const KEY = "gurukul_live_island_v2";
  const HISTORY_KEY = "gurukul_live_history_v2";

  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const save = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  };

  const now = () => Date.now();

  let state = read(KEY, {
    active: false,
    paused: false,
    title: "Ready to study?",
    subtitle: "UPSC Gurukul",
    type: "study",
    startedAt: null,
    elapsed: 0,
    progress: 0,
    expanded: false,
    updatedAt: now()
  });

  let activityHistory = read(HISTORY_KEY, []);

  function elapsedSeconds() {
    if (!state.active) return state.elapsed || 0;
    if (state.paused) return state.elapsed || 0;
    return (state.elapsed || 0) +
      Math.max(0, Math.floor((now() - state.startedAt) / 1000));
  }

  function formatTime(seconds) {
    seconds = Math.max(0, Math.floor(seconds || 0));
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
  }

  function saveState() {
    state.updatedAt = now();
    save(KEY, state);
  }

  function addHistory(title, type) {
    activityHistory.unshift({
      title,
      type,
      time: new Date().toISOString()
    });
    activityHistory = activityHistory.slice(0, 30);
    save(HISTORY_KEY, activityHistory);
  }

  function detectPage() {
    const path = location.pathname.toLowerCase();
    const title = document.title || "";

    if (/test|exam|quiz|mock|prelims/.test(path)) {
      return {
        type: "exam",
        title: "Exam workspace",
        subtitle: title || "UPSC Test Series"
      };
    }

    if (/notes|reader|chapter|geography|polity|history/.test(path)) {
      return {
        type: "notes",
        title: "Reading in progress",
        subtitle: title || "Study Notes"
      };
    }

    if (/current-affairs|daily-test/.test(path)) {
      return {
        type: "current",
        title: "Current Affairs",
        subtitle: title || "Daily Preparation"
      };
    }

    return {
      type: "study",
      title: "UPSC Gurukul",
      subtitle: title || "Your learning space"
    };
  }

  function ensureState() {
    const page = detectPage();
    state.pageType = page.type;
    state.pageTitle = page.subtitle;
    saveState();
  }

  function start(title, type, subtitle) {
    state = {
      ...state,
      active: true,
      paused: false,
      title: title || "Study session",
      subtitle: subtitle || "UPSC Gurukul",
      type: type || "study",
      startedAt: now(),
      elapsed: 0,
      progress: state.progress || 0,
      expanded: true
    };
    addHistory(state.title, state.type);
    scheduleAutoCollapse();
    saveState();
    render();
  }

  function pause() {
    if (!state.active || state.paused) return;
    state.elapsed = elapsedSeconds();
    state.paused = true;
    state.startedAt = null;
    saveState();
    render();
  }

  function resume() {
    if (!state.active || !state.paused) return;
    state.paused = false;
    state.startedAt = now();
    saveState();
    render();
  }

  function finish() {
    if (state.active) {
      state.elapsed = elapsedSeconds();
      addHistory("Completed: " + state.title, state.type);
    }
    state.active = false;
    state.paused = false;
    state.startedAt = null;
    state.title = "Session completed";
    state.subtitle = "Well done, aspirant!";
    state.progress = 100;
    saveState();
    render();
  }

  function setProgress(value) {
    state.progress = Math.min(100, Math.max(0, Number(value) || 0));
    saveState();
    render();
  }

  function record(title, type) {
    addHistory(title || "Activity recorded", type || "activity");
    render();
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);
  }

  function iconFor(type) {
    return ({
      exam: "✦",
      notes: "▤",
      current: "◷",
      study: "✧",
      activity: "●"
    })[type] || "✧";
  }

  function getStatus() {
    if (!navigator.onLine) return "Offline";
    if (!state.active) return "Ready";
    return state.paused ? "Paused" : "In progress";
  }

  let gliCollapseTimer = null;

  function scheduleAutoCollapse() {
    if (gliCollapseTimer) clearTimeout(gliCollapseTimer);

    gliCollapseTimer = setTimeout(() => {
      if (state.expanded) {
        state.expanded = false;
        saveState();
        render();
      }
    }, 8000);
  }
  function render() {
    let root = document.getElementById("gurukul-live-island");
    if (!root) return;

    const expanded = !!state.expanded;
    const time = formatTime(elapsedSeconds());
    const progress = Math.min(100, Math.max(0, state.progress || 0));
    const page = detectPage();

    root.className = expanded ? "gli-root gli-expanded" : "gli-root gli-compact";

    root.innerHTML = `
      <button class="gli-pill" type="button" data-action="toggle"
        aria-expanded="${expanded}" aria-label="Toggle Gurukul Live activity">
        <span class="gli-pulse"></span>
        <span class="gli-pill-label">GURUKUL LIVE</span>
        <span class="gli-pill-time">${state.active ? time : "READY"}</span>
        <span class="gli-chevron">${expanded ? "⌄" : "⌃"}</span>
      </button>

      ${expanded ? `
      <section class="gli-panel">
        <div class="gli-panel-head">
          <div>
            <div class="gli-eyebrow">YOUR LEARNING ACTIVITY</div>
            <div class="gli-heading">${escapeHTML(state.title)}</div>
            <div class="gli-subtitle">${escapeHTML(state.subtitle)}</div>
          </div>
          <span class="gli-type-icon">${iconFor(state.type)}</span>
        </div>

        <div class="gli-timer">${time}</div>
        <div class="gli-status-row">
          <span class="gli-status-dot"></span>
          <span>${getStatus()}</span>
          <span class="gli-page-type">${escapeHTML(page.type.toUpperCase())}</span>
        </div>

        <div class="gli-progress-track">
          <div class="gli-progress-fill" style="width:${progress}%"></div>
        </div>
        <div class="gli-progress-label">
          <span>Activity progress</span>
          <strong>${progress}%</strong>
        </div>

        <div class="gli-controls">
          ${state.active
            ? state.paused
              ? `<button data-action="resume" class="gli-button gli-primary">Resume</button>`
              : `<button data-action="pause" class="gli-button gli-primary">Pause</button>`
            : `<button data-action="start" class="gli-button gli-primary">Start studying</button>`
          }
          ${state.active
            ? `<button data-action="finish" class="gli-button gli-secondary">Finish</button>`
            : `<button data-action="start-page" class="gli-button gli-secondary">Start this page</button>`
          }
        </div>

        <div class="gli-footer">
          <span>UPSC GURUKUL</span>
          <span>${navigator.onLine ? "Connected" : "Offline"}</span>
        </div>
      </section>` : ""}
    `;
  }

  function createIsland() {
    if (document.getElementById("gurukul-live-island")) return;

    const root = document.createElement("div");
    root.id = "gurukul-live-island";
    root.className = "gli-root gli-compact";
    document.body.appendChild(root);

    root.addEventListener("click", event => {
      const button = event.target.closest("[data-action]");
      if (!button) return;

      const action = button.dataset.action;

      if (action === "toggle") {
        state.expanded = !state.expanded;
        if (state.expanded) scheduleAutoCollapse();
        else if (gliCollapseTimer) clearTimeout(gliCollapseTimer);
        saveState();
        render();
      }

      if (action === "start") {
        start("Study session", "study", detectPage().subtitle);
      }

      if (action === "start-page") {
        const page = detectPage();
        start(page.title, page.type, page.subtitle);
      }

      if (action === "pause") pause();
      if (action === "resume") resume();
      if (action === "finish") finish();
    });

    render();
  }

  function mount() {
    if (!document.body) return;
    ensureState();
    createIsland();
  }

  function routeChanged() {
    ensureState();
    render();
  }

  // Detect normal page navigation and SPA navigation.
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    setTimeout(routeChanged, 50);
    return result;
  };

  window.addEventListener("popstate", routeChanged);
  window.addEventListener("online", render);
  window.addEventListener("offline", render);

  // Public integration API for exams, notes and other modules.
  window.GurukulLive = {
    start,
    pause,
    resume,
    finish,
    record,
    setProgress,
    getState: () => ({
      ...state,
      elapsed: elapsedSeconds()
    }),
    expand: () => {
      state.expanded = true;
      scheduleAutoCollapse();
      saveState();
      render();
    },
    collapse: () => {
      state.expanded = false;
      saveState();
      render();
    }
  };

  // Keep timer display updated without losing elapsed time.
  setInterval(() => {
    const root = document.getElementById("gurukul-live-island");
    if (root && state.active) render();
  }, 1000);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();

