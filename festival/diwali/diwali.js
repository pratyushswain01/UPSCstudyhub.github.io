/**
 * UPSC Gurukul — Premium Diwali Festival Banner
 * Isolated via Shadow DOM. Vanilla JS + SVG + Canvas.
 * No external dependencies. Production-ready.
 */
(function () {
  'use strict';

  if (window.__UPSC_DIWALI_LOADED__) return;
  window.__UPSC_DIWALI_LOADED__ = true;

  const CONFIG = {
    delayMs: 750,
    displayMs: 11000,
    retractMs: 900,
    particleBudget: 180,
    maxDpr: 1.75
  };

  const prefersReduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function createBanner() {
    const host = document.createElement('div');
    host.id = 'upsc-diwali-host';
    host.setAttribute('aria-live', 'polite');
    host.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:0;z-index:2147483000;pointer-events:none;overflow:visible;';

    const shadow = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      :host { all: initial; }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .banner {
        position: relative;
        width: 100%;
        max-width: 100vw;
        background: linear-gradient(180deg,
          #2a0a18 0%,
          #3d1024 18%,
          #4a152c 45%,
          #3a0f22 78%,
          #2a0a18 100%);
        border-bottom: 1.5px solid rgba(212, 175, 55, 0.55);
        box-shadow:
          0 8px 32px rgba(0,0,0,0.45),
          0 2px 0 rgba(212,175,55,0.25) inset;
        transform: translateY(-105%);
        transition: transform 0.95s cubic-bezier(0.22, 1, 0.36, 1);
        pointer-events: auto;
        overflow: hidden;
        font-family: Georgia, 'Times New Roman', serif;
      }

      .banner.visible {
        transform: translateY(0);
      }

      .banner.retracting {
        transform: translateY(-105%);
        transition: transform 0.9s cubic-bezier(0.55, 0.06, 0.68, 0.19);
      }

      .canvas-layer {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      }

      .content {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: clamp(12px, 3vw, 36px);
        padding: clamp(14px, 2.2vw, 22px) clamp(12px, 3vw, 28px);
        min-height: clamp(110px, 18vw, 148px);
      }

      .diya-wrap {
        flex-shrink: 0;
        width: clamp(56px, 9vw, 92px);
        height: clamp(72px, 12vw, 118px);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        filter: drop-shadow(0 0 10px rgba(255, 160, 40, 0.35));
      }

      .diya-wrap svg {
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .greeting {
        flex: 1 1 auto;
        text-align: center;
        max-width: 520px;
        padding: 0 4px;
      }

      .title-en {
        font-family: 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif;
        font-size: clamp(1.15rem, 3.4vw, 1.85rem);
        font-weight: 700;
        letter-spacing: 0.14em;
        color: #f5e6c8;
        text-shadow:
          0 0 18px rgba(255, 190, 80, 0.45),
          0 1px 2px rgba(0,0,0,0.5);
        margin-bottom: 2px;
        line-height: 1.15;
      }

      .title-hi {
        font-family: 'Noto Serif Devanagari', 'Noto Sans Devanagari', 'Mangal', 'Kokila', Georgia, serif;
        font-size: clamp(0.95rem, 2.6vw, 1.35rem);
        font-weight: 600;
        color: #e8c878;
        letter-spacing: 0.04em;
        margin-bottom: 8px;
        line-height: 1.3;
        text-shadow: 0 0 12px rgba(255, 180, 60, 0.3);
      }

      .message {
        font-family: Georgia, 'Times New Roman', serif;
        font-size: clamp(0.68rem, 1.55vw, 0.82rem);
        line-height: 1.45;
        color: rgba(245, 230, 200, 0.88);
        max-width: 460px;
        margin: 0 auto;
        font-style: italic;
      }

      .ornament {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin: 6px 0 4px;
        opacity: 0.75;
      }

      .ornament-line {
        height: 1px;
        width: clamp(28px, 8vw, 56px);
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent);
      }

      .ornament-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: radial-gradient(circle, #f0d878 0%, #c9a227 70%);
        box-shadow: 0 0 6px rgba(255,200,80,0.5);
      }

      .close-btn {
        position: absolute;
        top: 8px;
        right: 10px;
        z-index: 5;
        width: 28px;
        height: 28px;
        border: 1px solid rgba(212,175,55,0.4);
        border-radius: 50%;
        background: rgba(40, 12, 22, 0.65);
        color: #e8d4a8;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, border-color 0.2s;
        pointer-events: auto;
      }

      .close-btn:hover,
      .close-btn:focus-visible {
        background: rgba(60, 20, 35, 0.9);
        border-color: rgba(212,175,55,0.75);
        outline: none;
      }

      .border-top {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg,
          transparent 0%,
          rgba(212,175,55,0.15) 15%,
          rgba(232,200,100,0.7) 50%,
          rgba(212,175,55,0.15) 85%,
          transparent 100%);
        z-index: 3;
      }

      .rangoli-edge {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 6px;
        background:
          repeating-linear-gradient(90deg,
            transparent 0 10px,
            rgba(212,175,55,0.25) 10px 12px,
            transparent 12px 22px);
        opacity: 0.6;
        z-index: 3;
      }

      @media (max-width: 480px) {
        .content {
          gap: 8px;
          padding: 12px 10px 14px;
          min-height: 100px;
        }
        .diya-wrap {
          width: 48px;
          height: 64px;
        }
        .message {
          font-size: 0.65rem;
          line-height: 1.4;
        }
        .title-en {
          letter-spacing: 0.1em;
        }
      }

      @media (max-width: 360px) {
        .diya-wrap {
          width: 42px;
          height: 56px;
        }
        .message {
          display: none;
        }
      }
    `;

    const diyaSVG = `
      <svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="brass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f0d878"/>
            <stop offset="35%" stop-color="#c9a227"/>
            <stop offset="70%" stop-color="#a67c1a"/>
            <stop offset="100%" stop-color="#8a6412"/>
          </linearGradient>
          <linearGradient id="brassDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#d4af37"/>
            <stop offset="100%" stop-color="#6b4e0e"/>
          </linearGradient>
          <radialGradient id="oilGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stop-color="#3a2a12"/>
            <stop offset="100%" stop-color="#1a1208"/>
          </radialGradient>
          <radialGradient id="flameCore" cx="50%" cy="70%" r="50%">
            <stop offset="0%" stop-color="#fffef5"/>
            <stop offset="40%" stop-color="#ffe566"/>
            <stop offset="100%" stop-color="#ff9a1a" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="flameOuter" cx="50%" cy="65%" r="55%">
            <stop offset="0%" stop-color="#ffb833" stop-opacity="0.9"/>
            <stop offset="60%" stop-color="#ff6b00" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#cc3300" stop-opacity="0"/>
          </radialGradient>
          <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5"/>
          </filter>
        </defs>

        <!-- Pedestal base -->
        <ellipse cx="40" cy="104" rx="28" ry="5" fill="url(#brassDark)" opacity="0.85"/>
        <path d="M14 98 Q14 90 22 88 L58 88 Q66 90 66 98 Z" fill="url(#brass)"/>
        <ellipse cx="40" cy="88" rx="24" ry="3.5" fill="#e8c878" opacity="0.35"/>

        <!-- Stem -->
        <rect x="36" y="58" width="8" height="32" rx="2" fill="url(#brassDark)"/>
        <rect x="37.5" y="58" width="5" height="32" rx="1.5" fill="#f0d878" opacity="0.25"/>

        <!-- Decorative rings on stem -->
        <ellipse cx="40" cy="68" rx="7" ry="2.2" fill="url(#brass)"/>
        <ellipse cx="40" cy="78" rx="6.5" ry="2" fill="url(#brass)"/>

        <!-- Bowl -->
        <path d="M18 58 Q18 42 40 40 Q62 42 62 58 Q62 66 40 68 Q18 66 18 58 Z" fill="url(#brass)"/>
        <ellipse cx="40" cy="52" rx="18" ry="7" fill="url(#oilGrad)"/>
        <ellipse cx="40" cy="50" rx="15" ry="4.5" fill="#2a1e0c" opacity="0.6"/>

        <!-- Rim highlight -->
        <path d="M20 56 Q20 48 40 46 Q60 48 60 56" fill="none" stroke="#f5e6a8" stroke-width="1.2" opacity="0.45"/>

        <!-- Wick -->
        <rect x="38.5" y="42" width="3" height="10" rx="1" fill="#2c2010"/>
        <rect x="39" y="40" width="2" height="4" rx="0.8" fill="#4a3820"/>

        <!-- Flame outer glow -->
        <ellipse class="flame-glow" cx="40" cy="32" rx="14" ry="18" fill="url(#flameOuter)" filter="url(#softGlow)" opacity="0.7"/>

        <!-- Flame body -->
        <path class="flame-body" d="M40 18 Q48 28 44 38 Q40 44 36 38 Q32 28 40 18 Z"
              fill="url(#flameOuter)" filter="url(#glow)"/>
        <path class="flame-core" d="M40 22 Q44 30 42 37 Q40 40 38 37 Q36 30 40 22 Z"
              fill="url(#flameCore)"/>

        <!-- Small sparkle -->
        <circle class="spark" cx="40" cy="20" r="1.2" fill="#fffef0" opacity="0.9"/>
      </svg>
    `;

    const container = document.createElement('div');
    container.className = 'banner';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Diwali greeting');

    container.innerHTML = `
      <div class="border-top" aria-hidden="true"></div>
      <canvas class="canvas-layer" aria-hidden="true"></canvas>
      <button class="close-btn" type="button" aria-label="Close Diwali greeting">&times;</button>
      <div class="content">
        <div class="diya-wrap" aria-hidden="true">${diyaSVG.replace(/id="/g, 'id="l-')}</div>
        <div class="greeting">
          <div class="title-en">HAPPY DIWALI</div>
          <div class="title-hi">शुभ दीपावली</div>
          <div class="ornament" aria-hidden="true">
            <span class="ornament-line"></span>
            <span class="ornament-dot"></span>
            <span class="ornament-line"></span>
          </div>
          <p class="message">May the light of knowledge brighten every path and bring happiness, peace, prosperity and new beginnings to you and your family.</p>
        </div>
        <div class="diya-wrap" aria-hidden="true">${diyaSVG.replace(/id="/g, 'id="r-')}</div>
      </div>
      <div class="rangoli-edge" aria-hidden="true"></div>
    `;

    shadow.appendChild(style);
    shadow.appendChild(container);
    document.body.appendChild(host);

    return { host, shadow, container };
  }

  function animateFlames(shadow) {
    const flames = shadow.querySelectorAll('.flame-body, .flame-core, .flame-glow, .spark');
    let t = 0;
    let raf = null;

    function tick() {
      t += 0.045;
      flames.forEach((el, i) => {
        const phase = t + i * 0.7;
        const scaleY = 0.92 + Math.sin(phase * 2.1) * 0.08 + Math.sin(phase * 3.7) * 0.04;
        const scaleX = 0.96 + Math.sin(phase * 1.6 + 1) * 0.05;
        const dy = Math.sin(phase * 2.4) * 1.4;
        const rot = Math.sin(phase * 1.3) * 2.5;
        if (el.classList.contains('flame-glow')) {
          el.style.transform = `translateY(${dy * 0.6}px) scale(${scaleX * 1.05}, ${scaleY * 1.08})`;
          el.style.opacity = String(0.55 + Math.sin(phase * 1.8) * 0.2);
        } else if (el.classList.contains('spark')) {
          el.style.transform = `translate(${Math.sin(phase * 3) * 2}px, ${-2 + Math.sin(phase * 2.5) * 3}px)`;
          el.style.opacity = String(0.5 + Math.sin(phase * 4) * 0.4);
        } else {
          el.style.transformOrigin = '50% 90%';
          el.style.transform = `translateY(${dy}px) rotate(${rot}deg) scale(${scaleX}, ${scaleY})`;
        }
      });
      raf = requestAnimationFrame(tick);
    }

    if (!prefersReduced) raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }

  function createFireworks(canvas, bannerEl) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let rockets = [];
    let raf = null;
    let lastSpawn = 0;
    let running = true;
    let dpr = 1;

    function resize() {
      const rect = bannerEl.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnRocket() {
      if (particles.length + rockets.length > CONFIG.particleBudget) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const side = Math.random() > 0.5;
      rockets.push({
        x: side ? Math.random() * w * 0.28 : w * 0.72 + Math.random() * w * 0.28,
        y: h + 4,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(3.8 + Math.random() * 2.4),
        life: 1,
        hue: 38 + Math.random() * 18,
        targetY: h * (0.18 + Math.random() * 0.35)
      });
    }

    function explode(x, y, hue, size) {
      const count = Math.floor(18 + size * 28);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const speed = (1.2 + Math.random() * 2.8) * (0.6 + size * 0.5);
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.012 + Math.random() * 0.018,
          size: 1.1 + Math.random() * 2.2 * size,
          hue: hue + (Math.random() - 0.5) * 12,
          sparkle: Math.random() > 0.65
        });
      }
      // secondary smaller burst
      if (size > 0.7 && particles.length < CONFIG.particleBudget - 20) {
        setTimeout(() => {
          if (!running) return;
          for (let i = 0; i < 10; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = 0.8 + Math.random() * 1.4;
            particles.push({
              x: x + (Math.random() - 0.5) * 12,
              y: y + (Math.random() - 0.5) * 12,
              vx: Math.cos(a) * s,
              vy: Math.sin(a) * s,
              life: 0.85,
              decay: 0.02,
              size: 0.8 + Math.random() * 1.2,
              hue: hue + 8,
              sparkle: true
            });
          }
        }, 90 + Math.random() * 80);
      }
    }

    function loop(ts) {
      if (!running) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      if (ts - lastSpawn > 480 + Math.random() * 520) {
        spawnRocket();
        lastSpawn = ts;
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.018;
        r.life -= 0.008;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${r.hue}, 90%, 72%, ${Math.min(1, r.life + 0.3)})`;
        ctx.arc(r.x, r.y, 1.6, 0, Math.PI * 2);
        ctx.fill();

        // trail
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${r.hue}, 80%, 60%, 0.35)`;
        ctx.lineWidth = 1;
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - r.vx * 3, r.y - r.vy * 3);
        ctx.stroke();

        if (r.y <= r.targetY || r.life <= 0) {
          explode(r.x, r.y, r.hue, 0.7 + Math.random() * 0.5);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.035;
        p.vx *= 0.99;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = Math.max(0, p.life);
        if (p.sparkle && Math.random() > 0.6) {
          ctx.beginPath();
          ctx.fillStyle = `hsla(${p.hue}, 95%, 85%, ${alpha})`;
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.fillStyle = `hsla(${p.hue}, 88%, ${55 + p.life * 25}%, ${alpha * 0.9})`;
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(loop);
    }

    resize();
    if (!prefersReduced) {
      lastSpawn = performance.now();
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return {
      stop() {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        particles = [];
        rockets = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      },
      resize
    };
  }

  function run() {
    const { host, shadow, container } = createBanner();
    const canvas = shadow.querySelector('.canvas-layer');
    const closeBtn = shadow.querySelector('.close-btn');

    let stopFlames = () => {};
    let fireworks = null;
    let timers = [];
    let cleaned = false;

    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      timers.forEach(clearTimeout);
      timers = [];
      stopFlames();
      if (fireworks) fireworks.stop();
      if (host.parentNode) host.parentNode.removeChild(host);
      document.removeEventListener('visibilitychange', onVis);
    }

    function retract() {
      container.classList.remove('visible');
      container.classList.add('retracting');
      const t = setTimeout(cleanup, CONFIG.retractMs + 50);
      timers.push(t);
    }

    function onVis() {
      if (document.hidden && fireworks) {
        fireworks.stop();
      }
    }

    document.addEventListener('visibilitychange', onVis);

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      retract();
    });

    // Delayed entrance
    const enterTimer = setTimeout(() => {
      container.classList.add('visible');
      stopFlames = animateFlames(shadow);
      fireworks = createFireworks(canvas, container);

      if (prefersReduced) {
        // Still show banner briefly, no particles
        const reducedTimer = setTimeout(retract, 6000);
        timers.push(reducedTimer);
      } else {
        const displayTimer = setTimeout(retract, CONFIG.displayMs);
        timers.push(displayTimer);
      }
    }, prefersReduced ? 200 : CONFIG.delayMs);

    timers.push(enterTimer);

    // Safety: force cleanup after max lifetime
    const safety = setTimeout(cleanup, CONFIG.delayMs + CONFIG.displayMs + CONFIG.retractMs + 2000);
    timers.push(safety);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
