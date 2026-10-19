(() => {
  const KEY = "ug_consent_v1";
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}

  function loadAds() {
    if (!saved || !saved.ads) return;
  }

  if (saved) { loadAds(); return; }

  const bar = document.createElement("div");
  bar.innerHTML = `
  <div style="position:fixed;bottom:0;left:0;right:0;z-index:2147483002;background:#0f172a;color:#e2e8f0;padding:14px 16px;font:14px system-ui;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between">
    <div style="max-width:640px">We use essential storage for login and preferences. Optional ads need your OK. <a href="/privacy.html" style="color:#5eead4">Privacy</a></div>
    <div style="display:flex;gap:8px">
      <button type="button" data-c="essential" style="padding:10px 14px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;cursor:pointer">Essential only</button>
      <button type="button" data-c="all" style="padding:10px 14px;border-radius:10px;border:0;background:#0f766e;color:#fff;cursor:pointer">Accept all</button>
    </div>
  </div>`;
  document.body.appendChild(bar);

  bar.addEventListener("click", (e) => {
    const b = e.target.closest("[data-c]");
    if (!b) return;
    const all = b.getAttribute("data-c") === "all";
    saved = { essential: true, ads: all, analytics: all, ts: Date.now(), v: 1 };
    localStorage.setItem(KEY, JSON.stringify(saved));
    bar.remove();
    loadAds();
  });
})();
