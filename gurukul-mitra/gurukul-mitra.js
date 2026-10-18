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
      keys: ["study plan", "timetable", "schedule"],
      answer: "I can help make a realistic plan. Tell me your available hours, exam stage, and strongest and weakest subjects."
    },
    {
      keys: ["quiz", "test me"],
      answer: "Quick quiz: Fundamental Rights are in which part of the Indian Constitution? A) Part II  B) Part III  C) Part IV  D) Part IVA. Reply with A, B, C, or D."
    },
    {
      keys: ["revision", "revise"],
      answer: "Effective revision uses spaced repetition, short notes, and active recall. Focus on weak areas first and interleave subjects rather than studying one topic for long stretches."
    },
    {
      keys: ["concept", "explain"],
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
    <button class="gm-launcher" type="button" aria-label="Open Gurukul Mitra assistant" aria-expanded="false">
      <span class="gm-mark" aria-hidden="true">ॐ</span>
      <span class="gm-launcher-label">Gurukul Mitra</span>
    </button>
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
      <div class="gm-messages" aria-live="polite">
        <div class="gm-welcome">
          <strong>Namaste, Aspirant!</strong>
          <p>Your learning companion for UPSC concepts, study strategy, revision, and practice.</p>
        </div>
        <div class="gm-suggestions">
          <button class="gm-suggestion" type="button">Make a study plan</button>
          <button class="gm-suggestion" type="button">Explain Prelims strategy</button>
          <button class="gm-suggestion" type="button">Practise a quiz</button>
          <button class="gm-suggestion" type="button">CSAT tips</button>
          <button class="gm-suggestion" type="button">Explain a concept</button>
          <button class="gm-suggestion" type="button">Help with revision</button>
        </div>
      </div>
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

  let busy = false;

  function setOpen(open) {
    panel.classList.toggle("gm-open", open);
    launcher.setAttribute("aria-expanded", String(open));
    if (open) {
      setTimeout(() => input.focus(), 80);
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

      // Replace loading indicator safely
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

  // Form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input.value);
  });

  // Enter to send, Shift+Enter for newline
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask(input.value);
    }
  });

  // Auto-resize textarea
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 110)}px`;
  });

  // Quick-action chips
  root.querySelectorAll(".gm-suggestion").forEach((button) => {
    button.addEventListener("click", () => {
      ask(button.textContent);
    });
  });
})();
