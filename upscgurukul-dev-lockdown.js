(async function () {
  "use strict";
  const ID = "ug-construction-lockdown-frame";

  async function enabled() {
    try {
      const r = await fetch("/debug-mode.json?t=" + Date.now(), { cache: "no-store" });
      return r.ok && (await r.json()).enabled === true;
    } catch (_) { return false; }
  }

  function showScreen() {
    if (document.getElementById(ID)) return;
    const frame = document.createElement("iframe");
    frame.id = ID;
    frame.title = "UPSC Gurukul Development Status";
    frame.src = "/base.html?v=3";
    frame.style.cssText = "position:fixed;inset:0;width:100%;height:100%;border:0;z-index:2147483647;background:#080d18";
    document.documentElement.appendChild(frame);
  }

  function removeScreen() {
    document.getElementById(ID)?.remove();
  }

  window.addEventListener("message", async event => {
    if (event.origin !== location.origin) return;
    if (event.data?.type !== "UG_PRIVATE_DEBUG_UNLOCK") return;
    if (!(await enabled())) { location.reload(); return; }
    sessionStorage.setItem("ugPrivateDebugSession", "active");
    removeScreen();
    location.reload();
  });

  if (await enabled()) {
    if (sessionStorage.getItem("ugPrivateDebugSession") !== "active") showScreen();
  } else {
    sessionStorage.removeItem("ugPrivateDebugSession");
    removeScreen();
  }

  // Turn an already-open lockdown off promptly after the public switch changes.
  setInterval(async () => {
    if (!(await enabled())) {
      sessionStorage.removeItem("ugPrivateDebugSession");
      removeScreen();
    }
  }, 5000);
})();

