(() => {
  "use strict";
  if (window.__gurukulMitraLoaded) return;
  window.__gurukulMitraLoaded = true;

  // Replace this with the URL printed by `npx wrangler deploy`.
  const API_BASE = "https://gurukul-mitra-ai.pratyushkumarswain2005.workers.dev";
  const MAX_HISTORY = 8;
  const history = [];
  const fallbackAnswers = [
    { keys: ["prelims", "preliminary"], answer: "For Prelims, build strong foundations, revise standard sources, solve previous-year questions, and analyse each mock test. I can help you build a weekly plan." },
    { keys: ["mains", "answer writing"], answer: "For Mains, practise a clear introduction, organised arguments with examples, and a balanced conclusion. Use timed answer-writing practice and review your structure." },
    { keys: ["csat"], answer: "Practise comprehension, reasoning, and numeracy regularly. Track accuracy and time, then target the question types where you lose the most marks." },
    { keys: ["study plan", "timetable", "schedule"], answer: "I can help make a realistic plan. Tell me your available hours, exam stage, and strongest and weakest subjects." },
    { keys: ["quiz", "test me"], answer: "Quick quiz: Fundamental Rights are in which part of the Indian Constitution? A) Part II  B) Part III  C) Part IV  D) Part IVA. Reply with A, B, C, or D." }
  ];

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = new URL("/gurukul-mitra/gurukul-mitra.css", document.currentScript?.src || location.href).href;
  document.head.appendChild(css);

  const root = document.createElement("div");
  root.id = "gurukul-mitra-root";
  root.innerHTML = `
    <button class="gm-launcher" type="button" aria-label="Open Gurukul Mitra assistant" aria-expanded="false">
      <span class="gm-mark" aria-hidden="true">Ã¢Å“Â¦</span><span>Gurukul Mitra</span>
    </button>
    <section class="gm-panel" role="dialog" aria-label="Gurukul Mitra AI assistant" aria-modal="false">
      <header class="gm-head">
        <div class="gm-avatar" aria-hidden="true">Ã¢Å“Â¦</div>
        <div class="gm-headcopy"><div class="gm-title">Gurukul Mitra</div><div class="gm-subtitle">Your UPSC study companion</div></div>
        <button class="gm-close" type="button" aria-label="Close assistant">Ãƒâ€”</button>
      </header>
      <div class="gm-messages" aria-live="polite">
        <div class="gm-welcome"><strong>Namaste, Aspirant!</strong>Ask me about UPSC concepts, study strategy, or practise a quick quiz.</div>
        <div class="gm-suggestions">
          <button class="gm-suggestion" type="button">Make a study plan</button>
          <button class="gm-suggestion" type="button">Explain Prelims strategy</button>
          <button class="gm-suggestion" type="button">Quiz me</button>
          <button class="gm-suggestion" type="button">CSAT tips</button>
        </div>
      </div>
      <form class="gm-compose">
        <textarea class="gm-input" rows="1" maxlength="1800" placeholder="Ask your UPSC questionÃ¢â‚¬Â¦" aria-label="Your question"></textarea>
        <button class="gm-send" type="submit" aria-label="Send message">Ã¢Å¾Â¤</button>
      </form>
      <div class="gm-foot">AI answers can make mistakes. Verify important facts with trusted sources.</div>
    </section>`;
  document.body.appendChild(root);

  const launcher = root.querySelector(".gm-launcher");
  const panel = root.querySelector(".gm-panel");
  const close = root.querySelector(".gm-close");
  const form = root.querySelector(".gm-compose");
  const input = root.querySelector(".gm-input");
  const send = root.querySelector(".gm-send");
  const messages = root.querySelector(".gm-messages");
  let busy = false;

  function setOpen(open) {
    panel.classList.toggle("gm-open", open);
    launcher.setAttribute("aria-expanded", String(open));
    if (open) setTimeout(() => input.focus(), 80);
  }
  launcher.addEventListener("click", () => setOpen(!panel.classList.contains("gm-open")));
  close.addEventListener("click", () => { setOpen(false); launcher.focus(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && panel.classList.contains("gm-open")) setOpen(false); });

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
  function localFallback(text) {
    const q = text.toLowerCase();
    const found = fallbackAnswers.find(item => item.keys.some(k => q.includes(k)));
    return found ? found.answer : "I can help with UPSC concepts, study plans, and practice quizzes. The AI service is currently unavailable. Try Ã¢â‚¬Å“make a study planÃ¢â‚¬Â, Ã¢â‚¬Å“CSAT tipsÃ¢â‚¬Â, or Ã¢â‚¬Å“quiz meÃ¢â‚¬Â.";
  }
  async function ask(text) {
    const message = text.trim();
    if (!message || busy) return;
    addMessage("user", message);
    input.value = "";
    input.style.height = "auto";
    busy = true; send.disabled = true;
    const pending = addMessage("assistant", "ThinkingÃ¢â‚¬Â¦");
    try {
      if (API_BASE.includes("REPLACE-WITH-YOUR-SUBDOMAIN")) throw new Error("AI endpoint not configured");
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 18000);
      let response;
      try {
        response = await fetch(`${API_BASE.replace(/\/$/, "")}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, history: history.slice(-MAX_HISTORY) }),
          signal: controller.signal
        });
      } finally { clearTimeout(timeout); }
      if (!response.ok) throw new Error("AI unavailable");
      const data = await response.json();
      pending.textContent = data.reply || localFallback(message);
      if (data.fallback) {
        const note = document.createElement("small"); note.textContent = "Fallback answer";
        pending.appendChild(note);
      }
      history.push({ role: "user", content: message }, { role: "assistant", content: pending.firstChild?.textContent || pending.textContent });
      while (history.length > MAX_HISTORY) history.shift();
    } catch {
      pending.textContent = localFallback(message);
      const note = document.createElement("small"); note.textContent = "Offline / fallback response";
      pending.appendChild(note);
    } finally {
      busy = false; send.disabled = false; input.focus(); messages.scrollTop = messages.scrollHeight;
    }
  }
  form.addEventListener("submit", e => { e.preventDefault(); ask(input.value); });
  input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = `${Math.min(input.scrollHeight, 110)}px`; });
  root.querySelectorAll(".gm-suggestion").forEach(button => button.addEventListener("click", () => ask(button.textContent)));
})();

