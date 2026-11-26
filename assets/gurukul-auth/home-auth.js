import {
  auth, watchUser, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  updateProfile, GoogleAuthProvider, signInWithPopup, signOut, sendPasswordResetEmail
} from "/auth/firebase-auth.js";

(() => {
  if (window.__UG_HOME_AUTH__) return;
  window.__UG_HOME_AUTH__ = true;

  const style = document.createElement("style");
  style.textContent = `
    .ug-home-account{border:1px solid rgba(214,173,83,.45);background:linear-gradient(135deg,#f0d58c,#d6ad53);color:#101a32;border-radius:999px;padding:9px 15px;font:600 13px inherit;cursor:pointer;white-space:nowrap;max-width:180px;overflow:hidden;text-overflow:ellipsis}
    .ug-auth-backdrop{position:fixed;inset:0;z-index:2147483000;background:rgba(4,10,22,.68);backdrop-filter:blur(12px);display:none;align-items:center;justify-content:center;padding:18px}
    .ug-auth-backdrop.is-open{display:flex}
    .ug-auth-card{width:min(100%,420px);max-height:min(90vh,760px);overflow:auto;background:#101a32;color:#f5f7fb;border:1px solid rgba(229,199,126,.25);border-radius:22px;padding:26px;box-shadow:0 28px 90px rgba(0,0,0,.45);font-family:system-ui,sans-serif}
    .ug-auth-card h2{font-size:24px;margin:0 0 7px}.ug-auth-sub{color:#9fb0c8;font-size:13px;margin:0 0 20px}
    .ug-auth-tabs{display:flex;gap:8px;margin-bottom:16px}.ug-auth-tabs button,.ug-auth-action{border:0;border-radius:11px;padding:11px 14px;background:#1e293b;color:#dce7f7;font-weight:650;cursor:pointer}
    .ug-auth-tabs button[aria-selected=true]{background:#d6ad53;color:#101a32}
    .ug-auth-field{display:block;margin:12px 0 6px;color:#cbd5e1;font-size:13px}.ug-auth-input{width:100%;box-sizing:border-box;padding:12px;border-radius:10px;border:1px solid #334155;background:#0b1424;color:#fff;font:inherit}
    .ug-auth-action{width:100%;margin-top:12px;background:#0f766e;color:white}.ug-auth-action:disabled{opacity:.6;cursor:wait}
    .ug-auth-google{background:#f8fafc;color:#172033}.ug-auth-close{float:right;background:transparent;border:0;color:#cbd5e1;font-size:24px;cursor:pointer}
    .ug-auth-error{min-height:20px;color:#fca5a5;font-size:13px;margin:10px 0}.ug-auth-note{color:#9fb0c8;font-size:12px;line-height:1.5;margin-top:14px}
    .ug-auth-check{display:flex;gap:9px;align-items:flex-start;font-size:12px;color:#cbd5e1;margin-top:14px}.ug-auth-check input{margin-top:3px}
    .ug-auth-account{padding:14px;background:#0b1424;border:1px solid #334155;border-radius:12px;overflow-wrap:anywhere}
    @media(max-width:520px){.ug-home-account{padding:8px 11px;font-size:12px}.ug-auth-card{padding:21px}}
  `;
  document.head.appendChild(style);

  const button = document.getElementById("ug-home-account");
  if (!button) return;

  const backdrop = document.createElement("div");
  backdrop.className = "ug-auth-backdrop";
  backdrop.innerHTML = `
    <section class="ug-auth-card" role="dialog" aria-modal="true" aria-labelledby="ug-auth-title">
      <button type="button" class="ug-auth-close" aria-label="Close">×</button>
      <h2 id="ug-auth-title">Welcome to UPSC Gurukul</h2>
      <p class="ug-auth-sub">One account for your learning journey across the website.</p>
      <div class="ug-auth-tabs"><button type="button" data-mode="login" aria-selected="true">Log in</button><button type="button" data-mode="signup" aria-selected="false">Create account</button></div>
      <div class="ug-auth-account" hidden></div>
      <form>
        <div data-name-wrap hidden><label class="ug-auth-field" for="ug-auth-name">Full name</label><input class="ug-auth-input" id="ug-auth-name" name="name" autocomplete="name"></div>
        <label class="ug-auth-field" for="ug-auth-email">Email address</label><input class="ug-auth-input" id="ug-auth-email" name="email" type="email" required autocomplete="email">
        <label class="ug-auth-field" for="ug-auth-password">Password</label><input class="ug-auth-input" id="ug-auth-password" name="password" type="password" required minlength="6" autocomplete="current-password">
        <label class="ug-auth-check" data-consent-wrap hidden><input type="checkbox" name="consent"><span>I agree to the <a href="/privacy.html" target="_blank" rel="noopener">Privacy Notice</a> and <a href="/terms.html" target="_blank" rel="noopener">Terms</a>.</span></label>
        <p class="ug-auth-error" role="status" aria-live="polite"></p>
        <button class="ug-auth-action" type="submit">Log in</button>
      </form>
      <button type="button" class="ug-auth-action ug-auth-google">Continue with Google</button>
      <button type="button" class="ug-auth-action" data-signout hidden>Sign out</button>
      <button type="button" class="ug-auth-action" data-reset style="background:transparent;color:#9fb0c8">Forgot password?</button>
      <p class="ug-auth-note">Your sign-in is shared with supported UPSC Gurukul pages on this domain. Keep your password private.</p>
    </section>`;
  document.body.appendChild(backdrop);

  const $ = (s) => backdrop.querySelector(s);
  let mode = "login";
  let currentUser = null;
  const showError = (message = "") => { $(".ug-auth-error").textContent = message; };
  const open = () => { backdrop.classList.add("is-open"); document.body.style.overflow = "hidden"; showError(); };
  const close = () => { backdrop.classList.remove("is-open"); document.body.style.overflow = ""; };
  const setMode = (next) => {
    mode = next;
    $("[data-name-wrap]").hidden = mode !== "signup";
    $("[data-consent-wrap]").hidden = mode !== "signup";
    $(".ug-auth-tabs").hidden = !!currentUser;
    $("form").hidden = !!currentUser;
    $(".ug-auth-google").hidden = !!currentUser;
    $("[data-reset]").hidden = !!currentUser || mode === "signup";
    $("[data-signout]").hidden = !currentUser;
    $(".ug-auth-account").hidden = !currentUser;
    $(".ug-auth-account").textContent = currentUser ? "Signed in as " + (currentUser.email || currentUser.displayName || "student") : "";
    $(".ug-auth-card h2").textContent = currentUser ? "Your account" : (mode === "signup" ? "Create your account" : "Welcome back");
    $(".ug-auth-sub").textContent = currentUser ? "Your UPSC Gurukul account is active on this page." : "One account for your learning journey across the website.";
    $("[data-mode=login]").setAttribute("aria-selected", String(mode === "login"));
    $("[data-mode=signup]").setAttribute("aria-selected", String(mode === "signup"));
    $("form button[type=submit]").textContent = mode === "signup" ? "Create account" : "Log in";
    $("#ug-auth-password").autocomplete = mode === "signup" ? "new-password" : "current-password";
    showError();
  };

  button.addEventListener("click", () => { setMode(currentUser ? "login" : "login"); open(); });
  $(".ug-auth-close").addEventListener("click", close);
  backdrop.addEventListener("click", e => { if (e.target === backdrop) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && backdrop.classList.contains("is-open")) close(); });
  backdrop.querySelectorAll("[data-mode]").forEach(tab => tab.addEventListener("click", () => setMode(tab.dataset.mode)));

  $("form").addEventListener("submit", async e => {
    e.preventDefault();
    showError();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const submit = $("form button[type=submit]");
    submit.disabled = true;
    try {
      if (mode === "signup") {
        if (!form.elements.consent.checked) throw new Error("Please accept the Privacy Notice and Terms to create an account.");
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = String(data.get("name") || "").trim();
        if (displayName) await updateProfile(credential.user, { displayName });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      close();
    } catch (error) {
      showError(error.code ? error.code + ": " + (error.message || "Authentication failed") : error.message);
    } finally {
      submit.disabled = false;
    }
  });

  $(".ug-auth-google").addEventListener("click", async () => {
    showError();
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      close();
    } catch (error) {
      showError(error.code ? error.code + ": " + error.message : error.message);
    }
  });

  $("[data-reset]").addEventListener("click", async () => {
    const email = $("#ug-auth-email").value.trim();
    if (!email) return showError("Enter your email address first.");
    try {
      await sendPasswordResetEmail(auth, email);
      showError("Password reset email sent. Please check your inbox.");
    } catch (error) {
      showError(error.code ? error.code + ": " + error.message : error.message);
    }
  });

  $("[data-signout]").addEventListener("click", async () => {
    try { await signOut(auth); close(); }
    catch (error) { showError(error.message); }
  });

  watchUser(user => {
    currentUser = user;
    button.textContent = user ? (user.displayName || user.email?.split("@")[0] || "Account") : "Log in";
    button.title = user ? "Signed in — open account options" : "Log in or create an account";
    button.setAttribute("aria-label", button.title);
    if (backdrop.classList.contains("is-open")) setMode(mode);
  });
  setMode("login");
})();
