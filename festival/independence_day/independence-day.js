/**
 * UPSChub — Independence Day 2026 Festival Module
 * Final Stable Version
 * Prefix: id26-
 * 
 * Behavior:
 * - Opens automatically only on first visit
 * - After closing → stays closed on refresh
 * - Opens again only when reminder button is clicked
 */

(function () {
  'use strict';

  /* =========================================================
     CONFIGURATION
     ========================================================= */
  const IndependenceDayConfig = {
    enabled: true,
    eventYear: 2026,
    eventDate: new Date(2026, 7, 15, 0, 0, 0), // 15 Aug 2026
    
    storageDays: 1,                 // how many days to stay closed
    quizUrl: '',
    polityUrl: '/Polity.notes.html',
    forceShow: false                // keep false
    autoOpen: false
  };

  if (!IndependenceDayConfig.enabled) return;

  /* =========================================================
     SAFETY + EARLY EXIT
     ========================================================= */
function safeInit() {
  // Do NOT auto open the large banner
  // It will only open when reminder button is clicked
  console.log('[ID26] Large banner ready. Waiting for reminder button...');
}

  /* =========================================================
     LOCAL STORAGE LOGIC
     ========================================================= */
  function shouldShowFestival() {
    if (IndependenceDayConfig.forceShow) return true;

    try {
      const raw = localStorage.getItem(IndependenceDayConfig.storageKey);
      if (!raw) return true; // never closed before → show

      const data = JSON.parse(raw);
      const closedAt = data.closedAt || 0;
      const days = IndependenceDayConfig.storageDays * 24 * 60 * 60 * 1000;

      // Show again only after X days
      return (Date.now() - closedAt) > days;
    } catch (e) {
      return true;
    }
  }

  function markClosed() {
    try {
      localStorage.setItem(IndependenceDayConfig.storageKey, JSON.stringify({
        closedAt: Date.now(),
        year: IndependenceDayConfig.eventYear
      }));
    } catch (e) {}
  }

  /* =========================================================
     MAIN INIT
     ========================================================= */
  function initIndependenceDay(force = false) {
    // force = true → coming from reminder button
    // force = false → normal page load
    if (!force && !shouldShowFestival()) {
      return; // already closed → do not open
    }

    if (document.getElementById('id26-root')) return;

    injectStyles();
    createOverlay();
    startCountdown();
    bindEvents();

    requestAnimationFrame(() => {
      const root = document.getElementById('id26-root');
      if (root) {
        root.classList.add('id26-visible');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Make available for reminder bar
  window.initIndependenceDay = initIndependenceDay;

  /* =========================================================
     STYLES
     ========================================================= */
  function injectStyles() {
    if (document.getElementById('id26-styles')) return;

    const css = `
#id26-root {
  --saffron: #FF9933;
  --white: #FFFFFF;
  --green: #138808;
  --navy: #0a0f1c;
  --chakra: #000080;
  --gold: #f5d76e;
  --text: #f0f4f8;
  --muted: #a0aec0;
  --card: rgba(15, 23, 42, 0.72);
  --radius: 16px;
  --transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--navy);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, visibility 0.5s ease;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text);
  line-height: 1.55;
}

#id26-root.id26-visible {
  opacity: 1;
  visibility: visible;
}

#id26-root * { box-sizing: border-box; margin: 0; padding: 0; }

#id26-root .id26-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

#id26-root .id26-bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 10%, rgba(255,153,51,0.18) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 80% 90%, rgba(19,136,8,0.16) 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 60%),
    linear-gradient(180deg, #070b14 0%, #0a1220 40%, #071018 100%);
}

#id26-root .id26-particles { position: absolute; inset: 0; }

#id26-root .id26-particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255,255,255,0.55);
  border-radius: 50%;
  animation: id26-float linear infinite;
}

@keyframes id26-float {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.5; }
  100% { transform: translateY(-100vh) scale(0.6); opacity: 0; }
}

#id26-root .id26-chakra-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(90vw, 700px);
  height: min(90vw, 700px);
  transform: translate(-50%, -50%);
  opacity: 0.07;
  animation: id26-spin 36s linear infinite;
}

@keyframes id26-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

#id26-root .id26-close {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 100;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(10,15,28,0.75);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 26px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
}

#id26-root .id26-close:hover {
  background: rgba(255,153,51,0.25);
  border-color: #FF9933;
  transform: scale(1.08);
}

#id26-root .id26-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 70px 20px 80px;
}

#id26-root .id26-hero {
  text-align: center;
  padding: 20px 0 50px;
}

#id26-root .id26-flag-wrap {
  width: 120px;
  height: 80px;
  margin: 0 auto 28px;
  filter: drop-shadow(0 8px 20px rgba(0,0,0,0.4));
  animation: id26-flag-sway 5s ease-in-out infinite;
}

@keyframes id26-flag-sway {
  0%, 100% { transform: rotate(-1.5deg); }
  50% { transform: rotate(1.5deg); }
}

#id26-root .id26-flag {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 15px rgba(0,0,0,0.35);
}

#id26-root .id26-flag-saffron { flex: 1; background: #FF9933; }

#id26-root .id26-flag-white {
  flex: 1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

#id26-root .id26-flag-green { flex: 1; background: #138808; }

#id26-root .id26-flag-chakra {
  width: 22px;
  height: 22px;
  display: block;
  animation: id26-spin 20s linear infinite;
}

/* Mobile fix for Ashoka Chakra */
@media (max-width: 768px) {
  #id26-root .id26-flag-wrap {
    width: 100px;
    height: 67px;
  }
  #id26-root .id26-flag-chakra {
    width: 18px !important;
    height: 18px !important;
  }
}

@media (max-width: 480px) {
  #id26-root .id26-flag-wrap {
    width: 90px;
    height: 60px;
  }
  #id26-root .id26-flag-chakra {
    width: 16px !important;
    height: 16px !important;
  }
}

#id26-root .id26-eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #FF9933;
  font-weight: 600;
  margin-bottom: 12px;
}

#id26-root .id26-title {
  font-size: clamp(2.1rem, 7vw, 3.6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #fff 0%, #f5d76e 40%, #FF9933 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

#id26-root .id26-date {
  font-size: 1.15rem;
  color: #a0aec0;
  margin-bottom: 18px;
}

#id26-root .id26-tagline {
  font-size: clamp(1.05rem, 2.8vw, 1.35rem);
  margin-bottom: 10px;
}

#id26-root .id26-subtag {
  font-size: 0.95rem;
  color: #a0aec0;
  margin-bottom: 28px;
}

#id26-root .id26-brand {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.45);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 32px;
}

#id26-root .id26-countdown-wrap {
  margin: 28px auto 36px;
  max-width: 480px;
}

#id26-root .id26-countdown-label {
  font-size: 0.75rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #FF9933;
  margin-bottom: 14px;
  font-weight: 600;
}

#id26-root .id26-countdown {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

#id26-root .id26-cd-item {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 14px 16px;
  min-width: 78px;
}

#id26-root .id26-cd-num {
  font-size: 1.7rem;
  font-weight: 700;
}

#id26-root .id26-cd-unit {
  font-size: 0.7rem;
  color: #a0aec0;
  text-transform: uppercase;
  margin-top: 4px;
}

#id26-root .id26-celebration {
  font-size: 1.25rem;
  font-weight: 600;
  color: #f5d76e;
  padding: 16px 24px;
  background: rgba(255,153,51,0.12);
  border: 1px solid rgba(255,153,51,0.3);
  border-radius: 12px;
  display: inline-block;
}

#id26-root .id26-btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
  margin-top: 8px;
}

#id26-root .id26-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 26px;
  border-radius: 999px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.25s;
  text-decoration: none;
}

#id26-root .id26-btn-primary {
  background: linear-gradient(135deg, #FF9933, #e67e22);
  color: #1a1200;
  box-shadow: 0 8px 25px rgba(255,153,51,0.35);
}

#id26-root .id26-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(255,153,51,0.45);
}

#id26-root .id26-btn-secondary {
  background: transparent;
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}

#id26-root .id26-btn-secondary:hover {
  border-color: #FF9933;
  background: rgba(255,153,51,0.1);
}

#id26-root .id26-section {
  margin: 70px 0;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

#id26-root .id26-section.id26-inview {
  opacity: 1;
  transform: translateY(0);
}

#id26-root .id26-section-title {
  font-size: clamp(1.4rem, 4vw, 1.9rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
}

#id26-root .id26-section-sub {
  text-align: center;
  color: #a0aec0;
  max-width: 540px;
  margin: 0 auto 36px;
  font-size: 0.98rem;
}

#id26-root .id26-timeline {
  position: relative;
  max-width: 820px;
  margin: 0 auto;
}

#id26-root .id26-timeline::before {
  content: '';
  position: absolute;
  left: 18px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: linear-gradient(to bottom, #FF9933, #138808);
  opacity: 0.5;
}

#id26-root .id26-tl-item {
  position: relative;
  padding-left: 52px;
  margin-bottom: 28px;
}

#id26-root .id26-tl-dot {
  position: absolute;
  left: 10px;
  top: 6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0a0f1c;
  border: 3px solid #FF9933;
}

#id26-root .id26-tl-year {
  font-size: 0.85rem;
  font-weight: 700;
  color: #FF9933;
  margin-bottom: 4px;
}

#id26-root .id26-tl-title {
  font-size: 1.08rem;
  font-weight: 600;
  margin-bottom: 4px;
}

#id26-root .id26-tl-desc {
  font-size: 0.92rem;
  color: #a0aec0;
}

#id26-root .id26-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

#id26-root .id26-card {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 22px 20px;
  transition: all 0.25s;
}

#id26-root .id26-card:hover {
  border-color: rgba(255,153,51,0.35);
  transform: translateY(-4px);
}

#id26-root .id26-card-name {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 6px;
}

#id26-root .id26-card-role {
  font-size: 0.88rem;
  color: #a0aec0;
}

#id26-root .id26-preamble {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  max-width: 560px;
  margin: 0 auto 32px;
}

#id26-root .id26-value {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 18px 16px;
  text-align: center;
}

#id26-root .id26-value-label {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #FF9933;
}

#id26-root .id26-contrib {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 820px;
  margin: 0 auto;
}

#id26-root .id26-contrib-card {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 26px 20px;
  text-align: center;
}

#id26-root .id26-contrib-icon {
  font-size: 1.6rem;
  margin-bottom: 12px;
}

#id26-root .id26-contrib-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 8px;
}

#id26-root .id26-contrib-desc {
  font-size: 0.88rem;
  color: #a0aec0;
}

#id26-root .id26-quiz-box {
  background: linear-gradient(145deg, rgba(255,153,51,0.1), rgba(19,136,8,0.08));
  border: 1px solid rgba(255,153,51,0.25);
  border-radius: 20px;
  padding: 36px 28px;
  text-align: center;
  max-width: 560px;
  margin: 0 auto;
}

#id26-root .id26-quiz-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin: 18px 0 26px;
  font-size: 0.85rem;
  color: #a0aec0;
}

#id26-root .id26-quiz-meta span {
  background: rgba(0,0,0,0.25);
  padding: 6px 14px;
  border-radius: 999px;
}

#id26-root .id26-quote {
  text-align: center;
  max-width: 640px;
  margin: 0 auto;
  padding: 20px;
}

#id26-root .id26-quote-text {
  font-size: clamp(1.15rem, 3vw, 1.45rem);
  font-weight: 500;
  font-style: italic;
  margin-bottom: 16px;
}

#id26-root .id26-quote-sub {
  font-size: 0.98rem;
  color: #a0aec0;
}

#id26-root .id26-final {
  text-align: center;
  padding: 40px 20px 20px;
}

#id26-root .id26-final-title {
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff, #FF9933);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

#id26-root .id26-final-flag {
  font-size: 2.4rem;
  margin: 12px 0;
}

#id26-root .id26-final-text {
  font-size: 1.1rem;
  color: #a0aec0;
  margin-bottom: 8px;
}

#id26-root .id26-jai {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #f5d76e;
  margin: 24px 0 12px;
}

#id26-root .id26-team {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.4);
}

@media (prefers-reduced-motion: reduce) {
  #id26-root .id26-chakra-bg,
  #id26-root .id26-flag-wrap,
  #id26-root .id26-flag-chakra,
  #id26-root .id26-particle {
    animation: none !important;
  }
  #id26-root .id26-section {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 768px) {
  #id26-root .id26-content { padding: 60px 16px 60px; }
  #id26-root .id26-close { top: 12px; right: 12px; width: 40px; height: 40px; font-size: 22px; }
  #id26-root .id26-flag-wrap { width: 96px; height: 64px; }
  #id26-root .id26-contrib { grid-template-columns: 1fr; }
  #id26-root .id26-preamble { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 480px) {
  #id26-root .id26-btn { width: 100%; max-width: 300px; }
  #id26-root .id26-preamble { grid-template-columns: 1fr; }
  #id26-root .id26-cards { grid-template-columns: 1fr; }
}
`;

    const style = document.createElement('style');
    style.id = 'id26-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* =========================================================
     CREATE OVERLAY
     ========================================================= */
  function createOverlay() {
    const root = document.createElement('div');
    root.id = 'id26-root';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Independence Day 2026 Celebration');

    root.innerHTML = `
      <div class="id26-bg" aria-hidden="true">
        <div class="id26-bg-gradient"></div>
        <div class="id26-particles" id="id26-particles"></div>
        <div class="id26-chakra-bg">${createChakraSVG(700)}</div>
      </div>

      <button class="id26-close" id="id26-close-btn" aria-label="Close Independence Day celebration">×</button>

      <div class="id26-content">
        <header class="id26-hero">
          <div class="id26-flag-wrap">
            <div class="id26-flag">
              <div class="id26-flag-saffron"></div>
              <div class="id26-flag-white">${createChakraSVG(22)}</div>
              <div class="id26-flag-green"></div>
            </div>
          </div>

          <p class="id26-eyebrow">India • 15 August 2026</p>
          <h1 class="id26-title">Happy Independence Day</h1>
          <p class="id26-date">15 August 2026 • 80 Years of Freedom</p>
          <p class="id26-tagline">From the freedom we inherited to the India we build.</p>
          <p class="id26-subtag">Learn. Prepare. Serve. Build the Nation.</p>
          <p class="id26-brand">UPSChub</p>

          <div class="id26-countdown-wrap" id="id26-countdown-area"></div>

          <div class="id26-btn-row">
            <button class="id26-btn id26-btn-primary" id="id26-explore-btn">Explore India's Journey</button>
            <button class="id26-btn id26-btn-secondary" id="id26-quiz-btn">Independence Day Quiz</button>
          </div>
        </header>

        <section class="id26-section" id="id26-timeline">
          <h2 class="id26-section-title">From Freedom to Nation Building</h2>
          <p class="id26-section-sub">Key milestones that shaped modern India</p>
          <div class="id26-timeline">${createTimeline()}</div>
        </section>

        <section class="id26-section">
          <h2 class="id26-section-title">The People Who Inspired a Nation</h2>
          <p class="id26-section-sub">Leaders whose vision and courage continue to guide us</p>
          <div class="id26-cards">${createPersonalities()}</div>
        </section>

        <section class="id26-section">
          <h2 class="id26-section-title">Freedom Found a Vision in the Constitution</h2>
          <p class="id26-section-sub">The ideals that define the Republic of India</p>
          <div class="id26-preamble">
            <div class="id26-value"><div class="id26-value-label">JUSTICE</div></div>
            <div class="id26-value"><div class="id26-value-label">LIBERTY</div></div>
            <div class="id26-value"><div class="id26-value-label">EQUALITY</div></div>
            <div class="id26-value"><div class="id26-value-label">FRATERNITY</div></div>
          </div>
          <div style="text-align:center;">
            <a href="$IndependenceDayConfig.polityUrl = "/Polity.notes.html";" class="id26-btn id26-btn-secondary">Explore Indian Polity</a>
          </div>
        </section>

        <section class="id26-section">
          <h2 class="id26-section-title">Your Preparation is Also a Contribution</h2>
          <p class="id26-section-sub">
            Every concept you learn, every answer you write, and every challenge you overcome
            prepares you not just for an examination, but for the responsibility of serving the nation.
          </p>
          <div class="id26-contrib">
            <div class="id26-contrib-card">
              <div class="id26-contrib-icon">📚</div>
              <div class="id26-contrib-title">KNOWLEDGE</div>
              <div class="id26-contrib-desc">Understand India deeply — its history, polity, society and challenges.</div>
            </div>
            <div class="id26-contrib-card">
              <div class="id26-contrib-icon">🧭</div>
              <div class="id26-contrib-title">RESPONSIBILITY</div>
              <div class="id26-contrib-desc">Recognise your role as a future administrator and citizen.</div>
            </div>
            <div class="id26-contrib-card">
              <div class="id26-contrib-icon">🇮🇳</div>
              <div class="id26-contrib-title">SERVICE</div>
              <div class="id26-contrib-desc">Prepare yourself to serve the nation with integrity and purpose.</div>
            </div>
          </div>
        </section>

        <section class="id26-section">
          <div class="id26-quiz-box">
            <h2 class="id26-section-title" style="margin-bottom:8px;">🇮🇳 Independence Day Special Quiz</h2>
            <p class="id26-section-sub" style="margin-bottom:0;">
              Test your knowledge of India's freedom struggle, Constitution and nation-building journey.
            </p>
            <div class="id26-quiz-meta">
              <span>10+ Questions</span>
              <span>UPSC-Oriented</span>
              <span>History + Polity</span>
            </div>
            <button class="id26-btn id26-btn-primary" id="id26-start-quiz">Start Quiz</button>
            <p id="id26-quiz-msg" style="margin-top:16px;font-size:0.9rem;color:#a0aec0;display:none;"></p>
          </div>
        </section>

        <section class="id26-section">
          <div class="id26-quote">
            <p class="id26-quote-text">“The freedom we celebrate today is the responsibility we carry into tomorrow.”</p>
            <p class="id26-quote-sub">The future of India will be shaped by what we learn, what we value and what we choose to serve.</p>
          </div>
        </section>

        <section class="id26-section id26-final">
          <h2 class="id26-final-title">Happy Independence Day</h2>
          <div class="id26-final-flag">🇮🇳</div>
          <p class="id26-final-text">From the freedom we inherited</p>
          <p class="id26-final-text">to the India we build.</p>
          <p class="id26-jai">JAI HIND</p>
          <p class="id26-team">— Team UPSChub</p>
        </section>
      </div>
    `;

    document.body.appendChild(root);
    createParticles();
    observeSections();
  }

  /* =========================================================
     HELPERS
     ========================================================= */
  function createChakraSVG(size) {
    const s = size || 100;
    return `
      <svg class="id26-flag-chakra" width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="#000080" stroke-width="3" fill="none"/>
        <circle cx="50" cy="50" r="8" fill="#000080"/>
        ${Array.from({length: 24}, (_, i) => {
          const angle = (i * 15) * Math.PI / 180;
          const x1 = 50 + 10 * Math.cos(angle);
          const y1 = 50 + 10 * Math.sin(angle);
          const x2 = 50 + 42 * Math.cos(angle);
          const y2 = 50 + 42 * Math.sin(angle);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000080" stroke-width="1.8"/>`;
        }).join('')}
      </svg>
    `;
  }

  function createTimeline() {
    const items = [
      { year: '1857', title: 'The Revolt of 1857', desc: 'The first major uprising against British rule, marking the beginning of organised resistance.' },
      { year: '1885', title: 'Formation of the Indian National Congress', desc: 'A platform that gradually became the principal vehicle of the freedom struggle.' },
      { year: '1919', title: 'Jallianwala Bagh', desc: 'A turning point that hardened national resolve against colonial rule.' },
      { year: '1930', title: 'Civil Disobedience Movement', desc: 'Mass participation under Gandhi’s leadership challenged the moral authority of the Raj.' },
      { year: '1942', title: 'Quit India Movement', desc: 'The final major mass campaign demanding an end to British rule.' },
      { year: '1947', title: 'India Becomes Independent', desc: 'On 15 August 1947, India awoke to life and freedom.' },
      { year: '1950', title: 'The Constitution Comes into Force', desc: 'India became a sovereign democratic republic on 26 January 1950.' },
      { year: '2026', title: 'A New Generation Shapes India’s Future', desc: 'Today’s aspirants carry forward the unfinished work of nation-building.' }
    ];

    return items.map(item => `
      <div class="id26-tl-item">
        <div class="id26-tl-dot"></div>
        <div class="id26-tl-year">${item.year}</div>
        <div class="id26-tl-title">${item.title}</div>
        <div class="id26-tl-desc">${item.desc}</div>
      </div>
    `).join('');
  }

  function createPersonalities() {
    const people = [
      { name: 'Mahatma Gandhi', role: 'Non-violent resistance and mass mobilisation that defined the freedom struggle.' },
      { name: 'Subhas Chandra Bose', role: 'A powerful symbol of India’s armed struggle and uncompromising nationalism.' },
      { name: 'Bhagat Singh', role: 'A revolutionary whose courage and sacrifice became part of India’s freedom narrative.' },
      { name: 'Sardar Vallabhbhai Patel', role: 'Key leader in the independence movement and the integration of princely states.' },
      { name: 'Dr. B. R. Ambedkar', role: 'Chairman of the Drafting Committee and architect of India’s constitutional framework.' },
      { name: 'Jawaharlal Nehru', role: 'Major leader of the freedom movement and India’s first Prime Minister.' }
    ];

    return people.map(p => `
      <div class="id26-card">
        <div class="id26-card-name">${p.name}</div>
        <div class="id26-card-role">${p.role}</div>
      </div>
    `).join('');
  }

  function createParticles() {
    const container = document.getElementById('id26-particles');
    if (!container) return;
    const count = window.innerWidth < 600 ? 18 : 32;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'id26-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDuration = (8 + Math.random() * 14) + 's';
      p.style.animationDelay = (Math.random() * 8) + 's';
      p.style.opacity = 0.2 + Math.random() * 0.5;
      container.appendChild(p);
    }
  }

  /* =========================================================
     COUNTDOWN
     ========================================================= */
  let countdownInterval = null;

  function startCountdown() {
    const area = document.getElementById('id26-countdown-area');
    if (!area) return;

    function update() {
      const now = new Date();
      const target = IndependenceDayConfig.eventDate;
      const diff = target - now;

      if (diff <= 0 && now.getFullYear() === 2026 && now.getMonth() === 7 && now.getDate() === 15) {
        area.innerHTML = `<div class="id26-celebration">TODAY, INDIA CELEBRATES<br>80 YEARS OF INDEPENDENCE</div>`;
        clearInterval(countdownInterval);
        return;
      }

      if (diff <= 0) {
        area.innerHTML = `<div class="id26-celebration" style="font-size:1.1rem;">80 Years of Independence<br><span style="font-size:0.9rem;opacity:0.8;">The journey continues</span></div>`;
        clearInterval(countdownInterval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      area.innerHTML = `
        <p class="id26-countdown-label">India Celebrates In</p>
        <div class="id26-countdown">
          <div class="id26-cd-item"><div class="id26-cd-num">${String(days).padStart(2,'0')}</div><div class="id26-cd-unit">Days</div></div>
          <div class="id26-cd-item"><div class="id26-cd-num">${String(hours).padStart(2,'0')}</div><div class="id26-cd-unit">Hours</div></div>
          <div class="id26-cd-item"><div class="id26-cd-num">${String(mins).padStart(2,'0')}</div><div class="id26-cd-unit">Minutes</div></div>
          <div class="id26-cd-item"><div class="id26-cd-num">${String(secs).padStart(2,'0')}</div><div class="id26-cd-unit">Seconds</div></div>
        </div>
      `;
    }

    update();
    countdownInterval = setInterval(update, 1000);
  }

  /* =========================================================
     EVENTS
     ========================================================= */
  function bindEvents() {
    const root = document.getElementById('id26-root');
    const closeBtn = document.getElementById('id26-close-btn');
    const exploreBtn = document.getElementById('id26-explore-btn');
    const quizBtn = document.getElementById('id26-quiz-btn');
    const startQuizBtn = document.getElementById('id26-start-quiz');
    const quizMsg = document.getElementById('id26-quiz-msg');

    function closeFestival() {
      if (!root) return;
      root.classList.remove('id26-visible');
      setTimeout(() => {
        root.remove();
        document.getElementById('id26-styles')?.remove();
        if (countdownInterval) clearInterval(countdownInterval);
      }, 500);
      markClosed(); // important: mark as closed
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeFestival);

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape' && document.getElementById('id26-root')) {
        closeFestival();
        document.removeEventListener('keydown', onKey);
      }
    });

    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        document.getElementById('id26-timeline')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    function handleQuiz() {
      if (IndependenceDayConfig.quizUrl) {
        window.location.href = IndependenceDayConfig.quizUrl;
      } else if (quizMsg) {
        quizMsg.style.display = 'block';
        quizMsg.textContent = 'Quiz coming soon. Stay tuned on UPSChub!';
      }
    }

    if (quizBtn) quizBtn.addEventListener('click', handleQuiz);
    if (startQuizBtn) startQuizBtn.addEventListener('click', handleQuiz);
  }

  function observeSections() {
    const sections = document.querySelectorAll('#id26-root .id26-section');
    if (!('IntersectionObserver' in window)) {
      sections.forEach(s => s.classList.add('id26-inview'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('id26-inview');
      });
    }, { threshold: 0.15 });
    sections.forEach(s => io.observe(s));
  }

  /* =========================================================
     LISTEN FOR REMINDER BAR
     ========================================================= */
  window.addEventListener('upsChub:openIndependenceDay', function () {
  console.log('[ID26] Opening from reminder button');

  try {
    localStorage.removeItem(IndependenceDayConfig.storageKey);
  } catch (e) {}

  const existing = document.getElementById('id26-root');
  if (existing) existing.remove();
  document.getElementById('id26-styles')?.remove();

  initIndependenceDay(true); // force open
});

  /* =========================================================
     BOOT
     ========================================================= */
  safeInit();

})();
