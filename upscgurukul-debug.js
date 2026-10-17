
// End the private debug session when the page is closed or navigated away.
window.addEventListener("pagehide", () => {
  try { sessionStorage.removeItem("ugPrivateDebugSession"); } catch (_) {}
});
