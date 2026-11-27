/* Study Supervisor disabled by request (2026-11-27).
   Gurukul Mitra chatbot remains enabled independently. */
(() => {
  "use strict";
  const removeSupervisor = () => {
    document.getElementById("gm-supervisor")?.remove();
    document.querySelectorAll('script[src*="study-supervisor.js"]').forEach((script) => {
      if (script.dataset.gmSupervisorDisabled !== "1") script.dataset.gmSupervisorDisabled = "1";
    });
  };
  removeSupervisor();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", removeSupervisor, { once: true });
  }
})();
