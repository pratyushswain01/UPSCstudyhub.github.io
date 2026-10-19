(() => {
  "use strict";
  if (window.__gurukulMitraLoaded) return;
  window.__gurukulMitraLoaded = true;

  // Cloudflare Worker endpoint
  const API_BASE = "https://gurukul-mitra-ai.pratyushkumarswain2005.workers.dev";
  const MAX_HISTORY = 8;
  const history = [];

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
        <span class="gm-mark" aria-hidden="true">ॐ</span>
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
    if (!panel.classList.contains("gm-open")) {
      launcherWrap.classList.add("gm-launcher-hidden");
    }
  }

  function revealLauncherTemporarily() {
    launcherWrap.classList.remove("gm-launcher-hidden");
    if (launcherHideTimer) clearTimeout(launcherHideTimer);
    if (!panel.classList.contains("gm-open")) {
      launcherHideTimer = setTimeout(hideLauncher, 6500);
    }
  }

  // Keep the greeting brief; hide the large launcher after initial attention.
  setTimeout(showBubble, 1200);
  setTimeout(hideBubble, 6500);
  setTimeout(hideLauncher, 8500);

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
      <strong>Namaste, Aspirant!</strong>
      <p>“Your journey to civil services starts with one good question. I'm Gurukul Mitra, your UPSC companion—here to help you learn, plan, practise, and move forward with confidence.”</p>
      <p class="gm-question">What shall we work on today?</p>
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

  function setOpen(open) {
    panel.classList.toggle("gm-open", open);
    launcher.setAttribute("aria-expanded", String(open));

    if (open) {
      if (launcherHideTimer) clearTimeout(launcherHideTimer);
      launcherWrap.classList.remove("gm-launcher-hidden");
      hideBubble();
      if (!hasConversation) showWelcome();
      setTimeout(() => input.focus(), 80);
    } else {
      launcherHideTimer = setTimeout(hideLauncher, 6500);
    }
  }

  launcher.addEventListener("click", () => {
    setOpen(!panel.classList.contains("gm-open"));
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
            history: history.slice(-MAX_HISTORY)
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
