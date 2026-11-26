import {
  auth, watchUser, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  updateProfile, GoogleAuthProvider, signInWithPopup, signOut, sendPasswordResetEmail
} from "/auth/firebase-auth.js";

(() => {
  if (window.__UG_HOME_AUTH__) return;
  window.__UG_HOME_AUTH__ = true;
  const style = document.createElement("style");
  style.textContent = `
    .ug-home-account{border:1px solid rgba(214,173,83,.38)!important;background:rgba(255,255,255,.86)!important;color:#172033!important;border-radius:999px!important;padding:9px 15px!important;font:650 13px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif!important;cursor:pointer!important;white-space:nowrap!important;max-width:180px!important;overflow:hidden!important;text-overflow:ellipsis!important;box-shadow:0 2px 10px #1522380b!important}
    .ug-auth-backdrop{position:fixed!important;inset:0!important;z-index:2147483000!important;background:rgba(12,18,30,.48)!important;backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;display:none!important;align-items:center!important;justify-content:center!important;padding:18px!important;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",sans-serif!important}
    .ug-auth-backdrop.is-open{display:flex!important}
    .ug-auth-card{box-sizing:border-box!important;width:min(100%,440px)!important;max-height:92dvh!important;overflow:auto!important;background:rgba(250,250,252,.97)!important;color:#17191f!important;border:1px solid rgba(255,255,255,.72)!important;border-radius:28px!important;padding:30px!important;box-shadow:0 30px 100px rgba(0,0,0,.24)!important;font-family:inherit!important}
    .ug-auth-card h2{margin:0 0 7px!important;color:#17191f!important;font-size:27px!important;line-height:1.15!important;letter-spacing:-.8px!important;font-weight:750!important}
    .ug-auth-sub{color:#737984!important;font-size:13px!important;line-height:1.55!important;margin:0 0 22px!important}
    .ug-auth-tabs{display:grid!important;grid-template-columns:1fr 1fr!important;gap:5px!important;padding:4px!important;background:#eceef2!important;border-radius:13px!important;margin-bottom:18px!important}
    .ug-auth-tabs button{border:0!important;border-radius:10px!important;padding:10px!important;background:transparent!important;color:#666d78!important;font-weight:650!important;cursor:pointer!important}
    .ug-auth-tabs button[aria-selected=true]{background:#fff!important;color:#17191f!important;box-shadow:0 1px 4px #00000012!important}
    .ug-auth-field{display:block!important;margin:13px 0 7px!important;color:#343943!important;font-size:12px!important;font-weight:650!important}
    .ug-auth-input{width:100%!important;box-sizing:border-box!important;padding:13px 14px!important;border-radius:12px!important;border:1px solid #d9dde4!important;background:#fff!important;color:#17191f!important;font:15px inherit!important;outline:none!important;transition:border-color .15s,box-shadow .15s!important}
    .ug-auth-input:focus{border-color:#8d9db7!important;box-shadow:0 0 0 4px rgba(80,110,160,.12)!important}
    .ug-auth-action{width:100%!important;margin-top:12px!important;padding:13px 15px!important;border:0!important;border-radius:13px!important;background:#17191f!important;color:#fff!important;font-size:14px!important;font-weight:650!important;cursor:pointer!important}
    .ug-auth-action:disabled{opacity:.55!important;cursor:wait!important}
    .ug-auth-google{background:#fff!important;color:#252a32!important;border:1px solid #dfe2e8!important}
    .ug-auth-close{float:right!important;border:0!important;background:#eceef2!important;color:#4a505a!important;width:32px!important;height:32px!important;border-radius:50%!important;font-size:21px!important;cursor:pointer!important}
    .ug-auth-error{min-height:18px!important;color:#b42318!important;font-size:12px!important;line-height:1.45!important;margin:10px 0!important}
    .ug-auth-note{color:#8a909a!important;font-size:11px!important;line-height:1.55!important;margin-top:18px!important}
    .ug-auth-check{display:flex!important;gap:9px!important;align-items:flex-start!important;font-size:11px!important;color:#626976!important;margin-top:14px!important}
    .ug-auth-check input{margin-top:3px!important}
    .ug-auth-account{padding:15px!important;background:#fff!important;border:1px solid #e4e6eb!important;border-radius:14px!important;overflow-wrap:anywhere!important;color:#3d4552!important;font-size:13px!important}
    .ug-auth-card a{color:#365d9b!important;text-decoration:underline!important}
    @media(max-width:520px){.ug-home-account{padding:8px 11px!important;font-size:12px!important}.ug-auth-card{padding:23px!important;border-radius:23px!important}}
  `;
  document.head.appendChild(style);
  const button=document.getElementById("ug-home-account");
  if(!button)return;
  const backdrop=document.createElement("div");
  backdrop.className="ug-auth-backdrop";
  backdrop.innerHTML=`
    <section class="ug-auth-card" role="dialog" aria-modal="true" aria-labelledby="ug-auth-title">
      <button type="button" class="ug-auth-close" aria-label="Close">×</button>
      <h2 id="ug-auth-title">Your next chapter starts here.</h2>
      <p class="ug-auth-sub">Sign in to continue your preparation with UPSC Gurukul.</p>
      <div class="ug-auth-tabs"><button type="button" data-mode="login" aria-selected="true">Sign in</button><button type="button" data-mode="signup" aria-selected="false">Create account</button></div>
      <div class="ug-auth-account" hidden></div>
      <form>
        <div data-name-wrap hidden><label class="ug-auth-field" for="ug-auth-name">Full name</label><input class="ug-auth-input" id="ug-auth-name" name="name" autocomplete="name"></div>
        <label class="ug-auth-field" for="ug-auth-email">Email address</label><input class="ug-auth-input" id="ug-auth-email" name="email" type="email" required autocomplete="email" placeholder="you@example.com">
        <label class="ug-auth-field" for="ug-auth-password">Password</label><input class="ug-auth-input" id="ug-auth-password" name="password" type="password" required minlength="6" autocomplete="current-password" placeholder="At least 6 characters">
        <label class="ug-auth-check" data-consent-wrap hidden><input type="checkbox" name="consent"><span>I agree to the <a href="/privacy.html" target="_blank" rel="noopener">Privacy Notice</a> and <a href="/terms.html" target="_blank" rel="noopener">Terms</a>.</span></label>
        <p class="ug-auth-error" role="status" aria-live="polite"></p>
        <button class="ug-auth-action" type="submit">Sign in</button>
      </form>
      <button type="button" class="ug-auth-action ug-auth-google">Continue with Google</button>
      <button type="button" class="ug-auth-action" data-signout hidden>Sign out</button>
      <button type="button" class="ug-auth-action" data-reset style="background:transparent!important;color:#626976!important">Forgot password?</button>
      <p class="ug-auth-note">Your account works across supported UPSC Gurukul pages. Your study activity is private to your account.</p>
    </section>`;
  document.body.appendChild(backdrop);
  const $=s=>backdrop.querySelector(s);
  let mode="login",currentUser=null;
  const showError=(m="")=>{$(".ug-auth-error").textContent=m;};
  const open=()=>{backdrop.classList.add("is-open");document.body.style.overflow="hidden";showError();};
  const close=()=>{backdrop.classList.remove("is-open");document.body.style.overflow="";button.focus();};
  const setMode=next=>{
    mode=next;
    $("[data-name-wrap]").hidden=mode!=="signup";$("[data-consent-wrap]").hidden=false;
    $(".ug-auth-tabs").hidden=!!currentUser;$("form").hidden=!!currentUser;$(".ug-auth-google").hidden=!!currentUser;
    $("[data-reset]").hidden=!!currentUser||mode==="signup";$("[data-signout]").hidden=!currentUser;
    $(".ug-auth-account").hidden=!currentUser;$(".ug-auth-account").textContent=currentUser?"Signed in as "+(currentUser.email||currentUser.displayName||"student"):"";
    $(".ug-auth-card h2").textContent=currentUser?"Your account":mode==="signup"?"Create your account":"Your next chapter starts here.";
    $(".ug-auth-sub").textContent=currentUser?"Your UPSC Gurukul account is active.":"Sign in to continue your preparation with UPSC Gurukul.";
    $("[data-mode=login]").setAttribute("aria-selected",String(mode==="login"));$("[data-mode=signup]").setAttribute("aria-selected",String(mode==="signup"));
    $("form button[type=submit]").textContent=mode==="signup"?"Create account":"Sign in";$("#ug-auth-password").autocomplete=mode==="signup"?"new-password":"current-password";showError();
  };
  button.addEventListener("click",()=>{if(currentUser){location.href="/account.html";return;}setMode("login");open();});
  $(".ug-auth-close").addEventListener("click",close);
  backdrop.addEventListener("click",e=>{if(e.target===backdrop)close();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&backdrop.classList.contains("is-open"))close();});
  backdrop.querySelectorAll("[data-mode]").forEach(tab=>tab.addEventListener("click",()=>setMode(tab.dataset.mode)));
  $("form").addEventListener("submit",async e=>{
    e.preventDefault();showError();const form=e.currentTarget,data=new FormData(form),email=String(data.get("email")||"").trim(),password=String(data.get("password")||""),submit=$("form button[type=submit]");submit.disabled=true;
    try{
      if(!form.elements.consent.checked)throw new Error("Please tick the box to agree to the Privacy Notice and Terms before continuing.");
      if(mode==="signup"){
        const credential=await createUserWithEmailAndPassword(auth,email,password);const name=String(data.get("name")||"").trim();if(name)await updateProfile(credential.user,{displayName:name});
        try{localStorage.setItem("ug_consent_record",JSON.stringify({email,purposes:["account"],ts:Date.now(),v:1}));}catch(_){}
      }else await signInWithEmailAndPassword(auth,email,password);
      close();
    }catch(error){showError(error.code?error.code+": "+error.message:error.message);}
    finally{submit.disabled=false;}
  });
  $(".ug-auth-google").addEventListener("click",async()=>{
    showError();if(!$("#ug-auth-email").form.elements.consent.checked)return showError("Please tick the box to agree to the Privacy Notice and Terms before continuing.");try{const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:"select_account"});await signInWithPopup(auth,provider);close();}
    catch(error){showError(error.code?error.code+": "+error.message:error.message);}
  });
  $("[data-reset]").addEventListener("click",async()=>{
    const email=$("#ug-auth-email").value.trim();if(!email)return showError("Enter your email address first.");
    try{await sendPasswordResetEmail(auth,email);showError("Password reset email sent. Please check your inbox.");}
    catch(error){showError(error.code?error.code+": "+error.message:error.message);}
  });
  $("[data-signout]").addEventListener("click",async()=>{try{await signOut(auth);close();}catch(error){showError(error.message);}});
  watchUser(user=>{
    currentUser=user;button.textContent=user?(user.displayName||user.email?.split("@")[0]||"Account"):"Sign in";
    button.title=user?"Signed in — open account options":"Sign in or create an account";
    button.setAttribute("aria-label",button.title);if(backdrop.classList.contains("is-open"))setMode(mode);
  });
  setMode("login");
})();
