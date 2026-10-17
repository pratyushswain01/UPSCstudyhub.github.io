(async function () {
  "use strict";

  const BRAND = "2026 @ Pratyush.dev inc";
  const SECRET = "debug@2026";
  const STYLE_ID = "ug-construction-lockdown";

  async function readMode() {
    try {
      const response = await fetch("/debug-mode.json?t=" + Date.now(), {
        cache: "no-store"
      });
      if (!response.ok) return false;
      return (await response.json()).enabled === true;
    } catch (_) {
      return false;
    }
  }

  function makeScreen() {
    let screen = document.getElementById(STYLE_ID);
    if (screen) return screen;

    screen = document.createElement("div");
    screen.id = STYLE_ID;
    screen.style.cssText = [
      "position:fixed", "inset:0", "z-index:2147483647",
      "display:flex", "align-items:center", "justify-content:center",
      "box-sizing:border-box", "padding:24px", "background:#080d18",
      "color:#f8fafc", "font-family:system-ui,sans-serif",
      "text-align:center", "overflow:auto"
    ].join(";");

    screen.innerHTML = `
      <div style="max-width:520px;width:100%">
        <div style="font-size:48px;margin-bottom:18px">🛠️</div>
        <div style="font-size:12px;letter-spacing:4px;color:#fbbf24">
          UPSC GURUKUL
        </div>
        <h1 style="font-size:clamp(30px,7vw,48px);margin:14px 0">
          UNDER CONSTRUCTION
        </h1>
        <p style="color:#b8c4d6;line-height:1.8">
          We are improving your learning experience.
          The website and app will be back soon.
        </p>
        <div style="height:3px;background:#253247;border-radius:8px;overflow:hidden;margin:26px 0">
          <div style="height:100%;width:65%;background:#fbbf24"></div>
        </div>
        <button id="ug-private-unlock"
          style="background:transparent;color:#64748b;border:1px solid #334155;border-radius:8px;padding:9px 12px">
          Developer access
        </button>
        <p style="font-size:11px;color:#64748b;margin-top:24px">${BRAND}</p>
      </div>`;
    document.body.appendChild(screen);

    screen.querySelector("#ug-private-unlock").onclick = async () => {
      if (!(await readMode())) {
        location.reload();
        return;
      }
      const password = prompt("Enter developer password:");
      if (password !== SECRET) {
        if (password !== null) alert("Access denied.");
        return;
      }
      alert("Password accepted. Connect your debugger, then press OK to open this private development session.");
      if (!(await readMode())) {
        location.reload();
        return;
      }
      sessionStorage.setItem("ugPrivateDebugSession", "active");
      screen.remove();
      if (typeof window.enablePratyushDebug === "function") {
        window.enablePratyushDebug();
      }
    };
    return screen;
  }

  const enabled = await readMode();
  if (!enabled) {
    sessionStorage.removeItem("ugPrivateDebugSession");
    return;
  }

  if (sessionStorage.getItem("ugPrivateDebugSession") !== "active") {
    makeScreen();
  }
})();
