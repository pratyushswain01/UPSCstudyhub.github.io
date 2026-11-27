(() => {
  "use strict";
  if (window.__gurukulMitraLoaded) return;
  window.__gurukulMitraLoaded = true;
// Cloudflare Worker endpoint
  const API_BASE = "https://gurukul-mitra-ai.pratyushkumarswain2005.workers.dev";
  const MAX_HISTORY = 8;
  const history = [];
  const pageContext = { title: (document.title || 'UPSC Gurukul').slice(0, 100), path: (location.pathname || '/').split('?')[0].slice(0, 80) };
  const pageGuide = (() => { const p = pageContext.path.toLowerCase(); if (p.includes('test') || p.includes('quiz')) return 'You are on a practice or test page. I can help explain instructions, revise a topic, or review answers after you finish.'; if (p.includes('geography') || p.includes('notes')) return 'You are in the learning and notes area. I can explain a concept, make revision points, or quiz you on this topic.'; if (p.includes('planner') || p.includes('schedule')) return 'You are in a planning area. I can help organise today’s study blocks and revision priorities.'; if (p.includes('activity') || p.includes('account')) return 'You are viewing your account or activity. I can explain your study streak and two-hour daily target.'; return 'I can guide you around UPSC Gurukul, help plan your study, explain UPSC topics, or give you a quick practice question.'; })();

  const fallbackAnswers = [
    {
      keys: ["prelims", "preliminary"],
      answer: "For Prelims, build strong foundations, revise standard sources, solve previous-year questions, and analyse each mock test. I can help you build a weekly plan."
    },
    {
      keys: ["mains", "answer writing"],
      answer: "For Mains, practise a clear introduction, organised arguments with examples, and a balanced conclusion. Use timed answer-writing practice and review your structure."
    },
    {
      keys: ["csat"],
      answer: "Practise comprehension, reasoning, and numeracy regularly. Track accuracy and time, then target the question types where you lose the most marks."
    },
    {
      keys: ["study plan", "timetable", "schedule", "build my study plan"],
      answer: "I can help make a realistic plan. Tell me your available hours, exam stage, and strongest and weakest subjects."
    },
    {
      keys: ["quiz", "test me", "test my knowledge"],
      answer: "Quick quiz: Fundamental Rights are in which part of the Indian Constitution? A) Part II  B) Part III  C) Part IV  D) Part IVA. Reply with A, B, C, or D."
    },
    {
      keys: ["revision", "revise"],
      answer: "Effective revision uses spaced repetition, short notes, and active recall. Focus on weak areas first and interleave subjects rather than studying one topic for long stretches."
    },
    {
      keys: ["concept", "explain", "learn a upsc concept"],
      answer: "Tell me the specific concept or topic you want explained, and I will break it down clearly with relevant examples for UPSC."
    }
  ];

  // Load stylesheet
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = new URL("/gurukul-mitra/gurukul-mitra.css", document.currentScript?.src || location.href).href;
  document.head.appendChild(css);

  // Build root
  const root = document.createElement("div");
  root.id = "gurukul-mitra-root";

  const currentYear = new Date().getFullYear();

  root.innerHTML = `
    <!-- Floating Launcher + Greeting Bubble -->
    <div class="gm-launcher-wrap">
      <div class="gm-bubble" id="gmBubble" role="status" aria-live="polite">
        <div class="gm-bubble-text">
          <strong>Namaste, Aspirant!</strong>
          How may I help you today?<br>
          <span class="gm-bubble-cta">Click me →</span>
        </div>
        <button class="gm-bubble-close" type="button" aria-label="Dismiss greeting">×</button>
      </div>

      <button class="gm-launcher" type="button" aria-label="Open Gurukul Mitra assistant" aria-expanded="false">
        <span class="gm-mark" aria-hidden="true"><svg viewBox="0 0 48 48" class="gm-mini-robot" aria-hidden="true"><path d="M24 7V4" stroke="#e8ce91" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="3.5" r="3" fill="#e8ce91"/><rect x="7" y="10" width="34" height="29" rx="11" fill="#f8f7ef" stroke="#d5e0d6" stroke-width="2"/><rect x="11" y="15" width="26" height="17" rx="7" fill="#183d36"/><circle cx="18" cy="23" r="2.5" fill="#e8ce91"/><circle cx="30" cy="23" r="2.5" fill="#e8ce91"/><path d="M19 28Q24 32 29 28" fill="none" stroke="#f2e4c2" stroke-width="1.8" stroke-linecap="round"/><path d="M7 20L3 23V29L7 31M41 20L45 23V29L41 31" fill="none" stroke="#d5e0d6" stroke-width="3" stroke-linecap="round"/></svg></span>
        <span class="gm-launcher-label">Gurukul Mitra</span>
      </button>
    </div>

    <section class="gm-panel" role="dialog" aria-label="Gurukul Mitra AI assistant" aria-modal="false">
      <header class="gm-head">
        <div class="gm-avatar" aria-hidden="true">ॐ</div>
        <div class="gm-headcopy">
          <div class="gm-title">Gurukul Mitra</div>
          <div class="gm-subtitle">Your UPSC study companion</div>
          <div class="gm-status" aria-hidden="true">
            <span class="gm-status-dot"></span>
            <span>Online</span>
          </div>
        </div>
        <button class="gm-expand" type="button" aria-label="Switch to compact assistant" title="Switch view">↗</button>
        <button class="gm-close" type="button" aria-label="Close assistant">×</button>
      </header>
      <div class="gm-messages" aria-live="polite"></div>
      <form class="gm-compose">
        <textarea class="gm-input" rows="1" maxlength="1800" placeholder="Ask your UPSC question..." aria-label="Your question"></textarea>
        <button class="gm-send" type="submit" aria-label="Send message">↑</button>
      </form>
      <div class="gm-foot">
        <div>AI responses may contain errors. Verify important facts with trusted sources.</div>
        <span class="gm-watermark">Gurukul Mitra · UPSC Gurukul</span>
        <div class="gm-credits">Developed by Pratyush Swain · © ${currentYear} UPSC Gurukul. All rights reserved.</div>
      </div>
    </section>
  `;

  document.body.appendChild(root);

  // Elements
  const launcher = root.querySelector(".gm-launcher");
  const panel = root.querySelector(".gm-panel");
  const closeBtn = root.querySelector(".gm-close");
  const expandBtn = root.querySelector(".gm-expand");
  const form = root.querySelector(".gm-compose");
  const input = root.querySelector(".gm-input");
  const sendBtn = root.querySelector(".gm-send");
  const messages = root.querySelector(".gm-messages");
  const bubble = root.querySelector("#gmBubble");
  const bubbleClose = root.querySelector(".gm-bubble-close");

  let busy = false;
  let hasConversation = false;

  // ---------- Greeting Bubble Logic ----------
  const BUBBLE_KEY = "gm_bubble_shown";
  const launcherWrap = root.querySelector(".gm-launcher-wrap");
  let launcherHideTimer = null;

  // Small persistent side tab lets visitors bring the launcher back.
  const sideTab = document.createElement("button");
  sideTab.type = "button";
  sideTab.className = "gm-side-tab";
  sideTab.textContent = "Mitra";
  sideTab.setAttribute("aria-label", "Show Gurukul Mitra launcher");
  sideTab.title = "Open Gurukul Mitra";
  root.appendChild(sideTab);

  function showBubble() {
    try {
      if (sessionStorage.getItem(BUBBLE_KEY)) return;
    } catch (_) {}
    if (!panel.classList.contains("gm-open")) {
      bubble.classList.add("gm-bubble-visible");
    }
  }

  function hideBubble() {
    bubble.classList.remove("gm-bubble-visible");
    try { sessionStorage.setItem(BUBBLE_KEY, "1"); } catch (_) {}
  }

  function hideLauncher() {
    // Keep the small robot visible for the entire visit.
    launcherWrap.classList.remove("gm-launcher-hidden");
  }

  function revealLauncherTemporarily() {
    launcherWrap.classList.remove("gm-launcher-hidden");
  }

  // The greeting is brief; the robot itself remains visible.
  setTimeout(showBubble, 900);
  setTimeout(hideBubble, 7000);

  bubbleClose.addEventListener("click", (e) => {
    e.stopPropagation();
    hideBubble();
  });

  // Scrolling briefly reveals the launcher. The side tab stays available.
  let scrollRevealTimer = null;
  window.addEventListener("scroll", () => {
    if (panel.classList.contains("gm-open")) return;
    revealLauncherTemporarily();
    if (scrollRevealTimer) clearTimeout(scrollRevealTimer);
    scrollRevealTimer = setTimeout(hideLauncher, 6500);
  }, { passive: true });

  sideTab.addEventListener("click", () => {
    setOpen(true);
  });
  document.addEventListener("ug:open-mitra", () => setOpen(true));
// ---------- Welcome inside panel ----------
  function showWelcome() {
    if (hasConversation || messages.querySelector(".gm-msg")) return;

    const existingWelcome = messages.querySelector(".gm-welcome");
    if (existingWelcome) existingWelcome.remove();
    const existingSuggestions = messages.querySelector(".gm-suggestions");
    if (existingSuggestions) existingSuggestions.remove();

    const welcome = document.createElement("div");
    welcome.className = "gm-welcome";
    welcome.innerHTML = `
      <div class="gm-robot-stage" aria-label="Gurukul Mitra AI robot">
        <div class="gm-robot-aura"></div>
        <svg class="gm-robot" viewBox="0 0 220 220" role="img" aria-label="Friendly Gurukul Mitra robot">
          <defs>
            <linearGradient id="gmBotShell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffdf6"/><stop offset="1" stop-color="#dfe9df"/></linearGradient>
            <linearGradient id="gmBotGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8ce91"/><stop offset="1" stop-color="#b58a43"/></linearGradient>
          </defs>
          <path d="M110 28V16" stroke="#a8874b" stroke-width="5" stroke-linecap="round"/>
          <circle cx="110" cy="12" r="7" fill="#d9b66f" class="gm-robot-signal"/>
          <rect x="48" y="47" width="124" height="104" rx="38" fill="url(#gmBotShell)" stroke="#b9c8bc" stroke-width="3"/>
          <rect x="61" y="66" width="98" height="62" rx="25" fill="#183d36"/>
          <ellipse cx="87" cy="95" rx="8" ry="11" fill="#e8cf98" class="gm-robot-eye"/>
          <ellipse cx="133" cy="95" rx="8" ry="11" fill="#e8cf98" class="gm-robot-eye"/>
          <path d="M92 112Q110 126 128 112" fill="none" stroke="#f2e4c2" stroke-width="4" stroke-linecap="round"/>
          <path d="M48 82L29 91V119L49 126M172 82L191 91V119L171 126" fill="none" stroke="#b9c8bc" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="72" y="145" width="76" height="39" rx="17" fill="url(#gmBotShell)" stroke="#b9c8bc" stroke-width="3"/>
          <circle cx="110" cy="164" r="7" fill="url(#gmBotGold)"/>
          <path d="M82 185L72 199M138 185L148 199" stroke="#b9c8bc" stroke-width="9" stroke-linecap="round"/>
          <path d="M92 202H128" stroke="#b58a43" stroke-width="5" stroke-linecap="round"/>
        </svg>
        <span class="gm-robot-orbit gm-orbit-one"></span><span class="gm-robot-orbit gm-orbit-two"></span>
      </div>
      <div class="gm-welcome-copy"><strong>Namaste, Aspirant!</strong>
      <p>“Your journey to civil services starts with one good question. I'm Gurukul Mitra, your UPSC companion—here to help you learn, plan, practise, and move forward with confidence.”</p>
      <p class="gm-question">What shall we work on today?</p>
      <p class="gm-page-guide">${pageGuide}</p></div>
    `;

    const suggestions = document.createElement("div");
    suggestions.className = "gm-suggestions";

    const chips = [
      { label: "Learn a UPSC concept", prompt: "Explain an important UPSC concept clearly with examples." },
      { label: "Build my study plan", prompt: "Help me build a realistic weekly study plan for UPSC." },
      { label: "Test my knowledge", prompt: "Quiz me with a short UPSC-style question." },
      { label: "Ask me anything", prompt: "I have a question about UPSC preparation." }
    ];

    chips.forEach((chip) => {
      const btn = document.createElement("button");
      btn.className = "gm-suggestion";
      btn.type = "button";
      btn.textContent = chip.label;
      btn.addEventListener("click", () => {
        welcome.remove();
        suggestions.remove();
        ask(chip.prompt);
      });
      suggestions.appendChild(btn);
    });

    messages.appendChild(welcome);
    messages.appendChild(suggestions);
  }

  function setFullScreen(full) {
    panel.classList.toggle("gm-fullscreen", full);
    expandBtn.textContent = full ? "↙" : "↗";
    expandBtn.setAttribute("aria-label", full ? "Switch to compact assistant" : "Switch to full-screen assistant");
    expandBtn.title = full ? "Switch to compact view" : "Open full-screen experience";
  }

  function setOpen(open) {
    panel.classList.toggle("gm-open", open);
    if (open) setFullScreen(true);
    else setFullScreen(false);
    launcher.setAttribute("aria-expanded", String(open));

    if (open) {
      if (launcherHideTimer) clearTimeout(launcherHideTimer);
      launcherWrap.classList.remove("gm-launcher-hidden");
      hideBubble();
      if (!hasConversation) showWelcome();
      setTimeout(() => input.focus(), 80);
    } else {
      launcherWrap.classList.remove("gm-launcher-hidden");
    }
  }

  launcher.addEventListener("click", () => {
    setOpen(!panel.classList.contains("gm-open"));
  });

  expandBtn.addEventListener("click", () => {
    setFullScreen(!panel.classList.contains("gm-fullscreen"));
  });

  closeBtn.addEventListener("click", () => {
    setOpen(false);
    launcher.focus();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("gm-open")) {
      setOpen(false);
      launcher.focus();
    }
  });

  function addMessage(role, text, note) {
    const item = document.createElement("div");
    item.className = `gm-msg ${role}`;
    item.textContent = text;
    if (note) {
      const small = document.createElement("small");
      small.textContent = note;
      item.appendChild(small);
    }
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }

  function addLoading() {
    const item = document.createElement("div");
    item.className = "gm-msg assistant loading";
    item.innerHTML = `<span class="gm-typing" aria-hidden="true"><span></span><span></span><span></span></span> Thinking...`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }

  function localFallback(text) {
    const q = text.toLowerCase();
    const found = fallbackAnswers.find((item) =>
      item.keys.some((k) => q.includes(k))
    );
    return found
      ? found.answer
      : "I can help with UPSC concepts, study plans, and practice quizzes. The AI service is currently unavailable. Try “make a study plan”, “CSAT tips”, or “quiz me”.";
  }

  async function ask(text) {
    const message = text.trim();
    if (!message || busy) return;

    hasConversation = true;

    const welcomeEl = messages.querySelector(".gm-welcome");
    if (welcomeEl) welcomeEl.remove();
    const suggestionsEl = messages.querySelector(".gm-suggestions");
    if (suggestionsEl) suggestionsEl.remove();

    addMessage("user", message);
    input.value = "";
    input.style.height = "auto";
    busy = true;
    sendBtn.disabled = true;

    const pending = addLoading();

    try {
      if (API_BASE.includes("REPLACE-WITH-YOUR-SUBDOMAIN")) {
        throw new Error("AI endpoint not configured");
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 18000);

      let response;
      try {
        response = await fetch(`${API_BASE.replace(/\/$/, "")}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            history: history.slice(-MAX_HISTORY),
            context: pageContext
          }),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) throw new Error("AI unavailable");

      const data = await response.json();
      const reply = data.reply || localFallback(message);

      pending.className = "gm-msg assistant";
      pending.textContent = reply;

      if (data.fallback) {
        const note = document.createElement("small");
        note.textContent = "Fallback answer";
        pending.appendChild(note);
      }

      history.push(
        { role: "user", content: message },
        { role: "assistant", content: reply }
      );
      while (history.length > MAX_HISTORY) history.shift();
    } catch {
      pending.className = "gm-msg assistant";
      pending.textContent = localFallback(message);
      const note = document.createElement("small");
      note.textContent = "Offline / fallback response";
      pending.appendChild(note);
    } finally {
      busy = false;
      sendBtn.disabled = false;
      input.focus();
      messages.scrollTop = messages.scrollHeight;
    }
  }


  // Contextual guidance uses page metadata and the control the visitor activates.
  // It does not capture screenshots, monitor keystrokes, or inspect private screen content.
  let guideTimer = null;
  function guideVisitor(message) {
    if (!message || panel.classList.contains("gm-open")) return;
    const textNode = bubble.querySelector(".gm-bubble-text");
    if (textNode) textNode.innerHTML = '<strong>Gurukul Mitra</strong>' + message + '<br><span class="gm-bubble-cta">Tap my robot for help →</span>';
    bubble.classList.add("gm-bubble-visible");
    if (guideTimer) clearTimeout(guideTimer);
    guideTimer = setTimeout(() => bubble.classList.remove("gm-bubble-visible"), 5200);
  }
  function guidanceForControl(el) {
    const raw = (el.getAttribute("aria-label") || el.innerText || el.getAttribute("title") || el.textContent || "");
    const label = String(raw).trim().replace(/\s+/g, " ").slice(0, 90).toLowerCase();
    if (!label) return "";
    if (/test|quiz|mock|practice|submit/.test(label)) return "Starting practice? Read each question carefully, watch your time, and review explanations when you finish.";
    if (/note|read|chapter|geography|history|polity|economy/.test(label)) return "Opening study material? I can explain difficult points, create revision notes, or quiz you on this topic.";
    if (/planner|schedule|calendar|task/.test(label)) return "Planning your study? I can help divide your syllabus into realistic daily targets and revision blocks.";
    if (/download|pdf|resource|library/.test(label)) return "Need help with this resource? Tap my robot and I can guide you through it.";
    if (/login|sign in|account|profile/.test(label)) return "Need help with your account? I can guide you without asking for your password.";
    return "";
  }
  document.addEventListener("click", (event) => {
    const el = event.target && event.target.closest ? event.target.closest("a,button,[role='button']") : null;
    if (!el || root.contains(el)) return;
    const message = guidanceForControl(el);
    if (message) guideVisitor(message);
  }, true);
  document.addEventListener("focusin", (event) => {
    const el = event.target;
    if (!el || root.contains(el) || !el.matches || !el.matches("input,textarea,select")) return;
    const hint = el.getAttribute("placeholder") || el.getAttribute("aria-label") || "";
    if (hint) guideVisitor("Need help with this form? I can explain what to enter and help you plan the next step.");
  }, true);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input.value);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask(input.value);
    }
  });

  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 110)}px`;
  });
})();
