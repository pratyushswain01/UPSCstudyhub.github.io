(async function () {
  "use strict";

  const FRAME_ID = "ug-construction-lockdown-frame";
  const SWITCH_URL = "/debug-mode.json?t=" + Date.now();

  async function debugEnabled() {
    try {
      const response = await fetch(
        "/debug-mode.json?t=" + Date.now(),
        { cache: "no-store" }
      );
      if (!response.ok) return false;
      const data = await response.json();
      return data.enabled === true;
    } catch (_) {
      return false;
    }
  }

  function removeScreen() {
    const frame = document.getElementById(FRAME_ID);
    if (frame) frame.remove();
  }

  function buildScreen() {
    if (document.getElementById(FRAME_ID)) return;

    const frame = document.createElement("iframe");
    frame.id = FRAME_ID;
    frame.title = "UPSC Gurukul Development Status";
    frame.setAttribute("allow", "fullscreen");
    frame.setAttribute("referrerpolicy", "same-origin");
    frame.style.cssText =
      "position:fixed;inset:0;width:100%;height:100%;border:0;" +
      "z-index:2147483647;background:#081321";

    frame.srcdoc = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="color-scheme" content="dark">
<title>UPSC Gurukul — Under Construction</title>
<style>
:root{
  color-scheme:dark;
  --gold:#edc878;
  --ink:#091426;
  --muted:#b7c5d8;
  --cycle:72s;
}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;font-family:Inter,system-ui,-apple-system,
"Segoe UI",sans-serif;background:var(--ink);color:#f7f8fc}
body{min-height:100vh;min-height:100dvh;overflow:hidden}
button{font:inherit}
.page{
  position:relative;isolation:isolate;min-height:100vh;min-height:100dvh;
  display:flex;align-items:center;justify-content:center;overflow:hidden;
  padding:76px 20px 60px;background:#091426
}
.scene{position:absolute;inset:0;z-index:-1;overflow:hidden;
  background:linear-gradient(180deg,#07142c 0%,#1c355a 58%,#e08c79 100%);
  animation:sky-cycle var(--cycle) linear infinite}
.scene:after{content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(4,10,24,.12),transparent 40%,
  rgba(3,12,25,.12))}
.stars{position:absolute;inset:0;opacity:0;
  background-image:
  radial-gradient(2px 2px at 12% 17%,#fff 98%,transparent),
  radial-gradient(1.5px 1.5px at 25% 30%,#fff 98%,transparent),
  radial-gradient(2px 2px at 43% 12%,#fff 98%,transparent),
  radial-gradient(1.5px 1.5px at 58% 23%,#fff 98%,transparent),
  radial-gradient(2px 2px at 76% 16%,#fff 98%,transparent),
  radial-gradient(1px 1px at 88% 34%,#fff 98%,transparent),
  radial-gradient(1.5px 1.5px at 67% 39%,#fff 98%,transparent),
  radial-gradient(1px 1px at 35% 44%,#fff 98%,transparent);
  animation:star-cycle var(--cycle) linear infinite}
.orbit{
  position:absolute;left:50%;top:67%;
  width:min(90vw,760px);height:min(90vw,760px);
  transform:translate(-50%,-50%);
  animation:orbit-cycle var(--cycle) linear infinite;
  pointer-events:none
}
.sun{
  position:absolute;left:50%;top:0;transform:translateX(-50%);
  width:clamp(48px,7vw,76px);height:clamp(48px,7vw,76px);
  border-radius:50%;
  background:radial-gradient(circle at 34% 30%,#fffbe3 0%,#ffe6a0 37%,#ffad63 72%,#ed8157 100%);
  box-shadow:0 0 28px 10px rgba(255,197,115,.3),0 0 90px 24px rgba(255,158,89,.2)
}
.moon{
  position:absolute;left:50%;bottom:0;transform:translateX(-50%);
  width:clamp(38px,5.5vw,57px);height:clamp(38px,5.5vw,57px);
  border-radius:50%;background:#f5f0d9;
  box-shadow:0 0 26px 7px rgba(210,228,255,.25)
}
.moon:after{content:"";position:absolute;left:13px;top:-5px;
  width:100%;height:100%;border-radius:50%;background:#263d60}
.cloud{
  position:absolute;width:130px;height:25px;border-radius:50px;
  background:rgba(255,235,221,.18);filter:blur(1px);
  animation:cloud-drift 38s linear infinite
}
.cloud:before,.cloud:after{content:"";position:absolute;bottom:7px;
  border-radius:50%;background:inherit}
.cloud:before{left:20px;width:45px;height:39px}
.cloud:after{left:57px;width:61px;height:49px}
.cloud.a{top:23%;left:-180px;animation-delay:-11s}
.cloud.b{top:37%;left:-200px;transform:scale(.8);animation-delay:-28s}
.cloud.c{top:16%;left:-250px;transform:scale(.65);animation-delay:-19s;opacity:.6}
.hills{position:absolute;inset:0;pointer-events:none}
.mountain{position:absolute;left:-5%;width:110%;bottom:0}
.mountain.far{height:44%;background:#52627b;opacity:.57;
  clip-path:polygon(0 73%,12% 43%,21% 62%,37% 12%,50% 55%,67% 22%,
  81% 59%,92% 36%,100% 59%,100% 100%,0 100%)}
.mountain.middle{height:33%;background:#263e5b;
  clip-path:polygon(0 58%,14% 27%,27% 57%,42% 18%,58% 53%,75% 14%,
  88% 50%,100% 32%,100% 100%,0 100%)}
.mountain.near{height:21%;background:#0b1c31;
  clip-path:polygon(0 38%,17% 52%,31% 23%,48% 47%,65% 20%,
  82% 44%,100% 26%,100% 100%,0 100%)}
.content{
  position:relative;z-index:2;width:min(710px,100%);
  text-align:center;padding:18px 0
}
.brand{display:inline-flex;align-items:center;justify-content:center;gap:11px;
  color:var(--gold);font-size:12px;font-weight:800;letter-spacing:3px}
.logo{width:42px;height:42px;border:1px solid rgba(237,200,120,.75);
  border-radius:13px;display:grid;place-items:center;
  background:linear-gradient(145deg,rgba(24,45,71,.92),rgba(7,20,38,.92));
  box-shadow:0 7px 24px rgba(0,0,0,.12)}
.kicker{margin:27px 0 13px;font-size:11px;letter-spacing:3px;
  text-transform:uppercase;font-weight:800;color:#f0dfc7}
h1{margin:0;font-size:clamp(38px,7.4vw,70px);line-height:1.04;
  letter-spacing:-2px;font-weight:850;text-shadow:0 4px 24px rgba(0,0,0,.15)}
h1 span{display:block;color:#ffe0a0}
.rule{width:66px;height:3px;border-radius:9px;margin:24px auto 19px;
  background:linear-gradient(90deg,#b98a45,#ffe5a7,#b98a45)}
.description{max-width:540px;margin:0 auto;color:#eef1f7;
  font-size:clamp(14px,2.2vw,17px);line-height:1.8;
  text-shadow:0 2px 12px rgba(0,0,0,.25)}
.status{display:inline-flex;align-items:center;gap:9px;margin-top:23px;
  padding:10px 15px;border:1px solid rgba(255,231,184,.38);
  border-radius:999px;background:rgba(9,20,38,.36);
  color:#fff1d0;font-size:12px;backdrop-filter:blur(8px)}
.dot{width:7px;height:7px;border-radius:50%;background:#ffe0a0;
  box-shadow:0 0 0 5px rgba(255,224,160,.12);animation:pulse 2s ease-in-out infinite}
.progress{height:4px;width:min(300px,75%);overflow:hidden;border-radius:8px;
  margin:21px auto 0;background:rgba(9,20,38,.38)}
.progress:after{content:"";display:block;width:35%;height:100%;
  border-radius:8px;background:linear-gradient(90deg,#b98a45,#fff0b9);
  animation:progress 3.4s ease-in-out infinite alternate}
.info-btn{position:absolute;z-index:5;right:20px;top:20px;width:46px;height:46px;
  border:1px solid rgba(255,226,166,.8);border-radius:50%;
  background:rgba(8,20,38,.7);color:#ffe1a0;font-size:23px;font-weight:800;
  display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(8px);
  transition:transform .2s,background .2s}
.info-btn:hover{transform:translateY(-2px);background:rgba(26,46,72,.92)}
.dev-btn{margin-top:22px;padding:11px 17px;border:1px solid rgba(255,226,166,.48);
  border-radius:10px;color:#fff2d5;background:rgba(8,20,38,.48);
  font-size:12px;cursor:pointer;backdrop-filter:blur(8px);transition:.2s}
.dev-btn:hover{background:rgba(8,20,38,.75);border-color:#ffe1a0}
.footer{position:absolute;z-index:4;bottom:15px;left:15px;right:15px;
  text-align:center;font-size:11px;letter-spacing:.4px;color:rgba(239,241,248,.8)}
.modal-backdrop{position:fixed;inset:0;z-index:10;display:none;align-items:center;
  justify-content:center;padding:18px;background:rgba(2,8,18,.78);
  backdrop-filter:blur(10px)}
.modal-backdrop.open{display:flex}
.modal{width:min(510px,100%);max-height:85vh;max-height:85dvh;overflow:auto;
  border:1px solid #40526b;border-radius:20px;
  background:linear-gradient(155deg,#172b44,#091628 80%);
  box-shadow:0 25px 90px rgba(0,0,0,.5);padding:24px;text-align:left}
.modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.modal-kicker{color:var(--gold);font-size:10px;letter-spacing:2px;font-weight:800}
.modal h2{font-size:25px;letter-spacing:-.5px;margin:8px 0 0}
.close{width:36px;height:36px;flex:none;border:1px solid #40526b;
  border-radius:50%;color:#e7edf5;background:#102038;font-size:22px;cursor:pointer}
.modal-intro{color:#bdc9d9;line-height:1.75;font-size:14px;margin:17px 0 20px}
.detail{padding:14px 0;border-top:1px solid rgba(145,169,198,.16)}
.detail h3{font-size:13px;color:#f1d8a5;margin:0 0 7px}
.detail p{font-size:13px;color:#b8c6d8;line-height:1.75;margin:0}
.modal-foot{margin-top:17px;color:#8294ab;font-size:11px}
@keyframes sky-cycle{
  0%,100%{background:linear-gradient(180deg,#07132b 0%,#182b50 54%,#4c456b 100%)}
  12%{background:linear-gradient(180deg,#17264a 0%,#5b6082 48%,#e6a084 100%)}
  25%{background:linear-gradient(180deg,#4386bd 0%,#8ecbdf 55%,#f4d4a4 100%)}
  50%{background:linear-gradient(180deg,#2376b4 0%,#79c4e1 57%,#f3d49d 100%)}
  68%{background:linear-gradient(180deg,#594b82 0%,#d78491 52%,#f4b27f 100%)}
  82%{background:linear-gradient(180deg,#111a3c 0%,#29395f 54%,#7d607a 100%)}
}
@keyframes orbit-cycle{from{transform:translate(-50%,-50%) rotate(0deg)}
  to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes star-cycle{0%,20%,50%{opacity:0}70%{opacity:.3}85%,100%{opacity:.95}}
@keyframes cloud-drift{from{margin-left:0}to{margin-left:calc(100vw + 360px)}}
@keyframes pulse{50%{opacity:.55;box-shadow:0 0 0 8px rgba(255,224,160,.03)}}
@keyframes progress{from{transform:translateX(-5%)}to{transform:translateX(205%)}}
@media(max-width:520px){
  .page{padding:76px 20px 54px}
  .brand{font-size:10px;letter-spacing:2px}
  .logo{width:37px;height:37px}
  .kicker{font-size:9px;letter-spacing:1.7px;margin-top:24px}
  h1{letter-spacing:-1.3px}
  .description{line-height:1.7}
  .orbit{top:65%;width:95vw;height:95vw}
  .mountain.far{height:36%}
  .mountain.middle{height:27%}
  .mountain.near{height:18%}
  .info-btn{right:14px;top:14px;width:42px;height:42px}
  .modal{padding:20px;border-radius:16px}
}
@media(max-height:600px) and (min-width:521px){
  .page{padding-top:58px;padding-bottom:45px}
  .kicker{margin-top:15px}
  .rule{margin:15px auto}
  .status{margin-top:15px}
  .progress{margin-top:14px}
  .dev-btn{margin-top:14px}
}
@media(prefers-reduced-motion:reduce){
  .scene,.stars,.orbit,.cloud,.dot,.progress:after{animation:none!important}
  .scene{background:linear-gradient(180deg,#142342,#365779 58%,#b17e7d)}
}
</style>
</head>
<body>
<main class="page">
<div class="scene" aria-hidden="true">
  <div class="stars"></div>
  <div class="cloud a"></div><div class="cloud b"></div><div class="cloud c"></div>
  <div class="orbit"><span class="sun"></span><span class="moon"></span></div>
  <div class="hills">
    <div class="mountain far"></div>
    <div class="mountain middle"></div>
    <div class="mountain near"></div>
  </div>
</div>
<button class="info-btn" id="infoBtn" type="button"
  aria-label="Information about this page" title="About this page">i</button>
<section class="content" aria-labelledby="heading">
  <div class="brand">
    <span class="logo" role="img" aria-label="UPSC Gurukul logo">
      <svg viewBox="0 0 48 48" width="30" height="30" fill="none"
        xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M7 18 24 6 41 18" stroke="#EDC878" stroke-width="2.3"
          stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11 20H37M14 20V32M21 20V32M28 20V32M35 20V32M9 35H39"
          stroke="#EDC878" stroke-width="2" stroke-linecap="round"/>
        <path d="M24 12C19 17 20 22 24 24C28 22 29 17 24 12Z" fill="#FFE6A5"/>
        <path d="M18 39H30" stroke="#EDC878" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </span>
    <span>UPSC GURUKUL</span>
  </div>
  <p class="kicker">A better learning experience is being prepared</p>
  <h1 id="heading">Under <span>Construction</span></h1>
  <div class="rule"></div>
  <p class="description">We’re working behind the scenes to prepare this page.
    The public experience is temporarily unavailable while development is in progress.</p>
  <div class="status"><span class="dot"></span><span>Development in progress</span></div>
  <div class="progress" aria-hidden="true"></div>
  <button class="dev-btn" id="devBtn" type="button">Developer Access ↗</button>
</section>
<footer class="footer">2026 @ Pratyush.dev inc</footer>
</main>
<div class="modal-backdrop" id="infoModal" role="dialog" aria-modal="true"
  aria-labelledby="modalTitle">
  <section class="modal">
    <div class="modal-head"><div>
      <div class="modal-kicker">PAGE INFORMATION</div>
      <h2 id="modalTitle">What does this page mean?</h2>
    </div><button class="close" id="closeModal" type="button"
      aria-label="Close information">×</button></div>
    <p class="modal-intro">You are viewing the temporary development screen for
      UPSC Gurukul. It appears instead of the normal page while this website is
      being worked on.</p>
    <div class="detail"><h3>Why am I seeing this?</h3>
      <p>The website is currently in development mode. The regular public page is
        being kept out of view during this period.</p></div>
    <div class="detail"><h3>What is happening now?</h3>
      <p>Development work and checks are in progress. Some pages or features may
        not yet be available, and the finished experience may change.</p></div>
    <div class="detail"><h3>What should I do?</h3>
      <p>You can close this panel and remain on this status screen. The site
        administrator can restore the public experience when the site is ready.</p></div>
    <div class="modal-foot">UPSC Gurukul · Development status · 2026 @ Pratyush.dev inc</div>
  </section>
</div>
<script>
(function(){
  var modal=document.getElementById("infoModal");
  var info=document.getElementById("infoBtn");
  var close=document.getElementById("closeModal");
  var dev=document.getElementById("devBtn");
  function openModal(){modal.classList.add("open");close.focus();}
  function closeModal(){modal.classList.remove("open");info.focus();}
  info.addEventListener("click",openModal);
  close.addEventListener("click",closeModal);
  modal.addEventListener("click",function(e){if(e.target===modal)closeModal();});
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"&&modal.classList.contains("open"))closeModal();
  });
  dev.addEventListener("click",function(){
    dev.disabled=true;
    dev.textContent="Checking developer access…";
    try{
      parent.postMessage({type:"UG_PRIVATE_DEBUG_UNLOCK"},location.origin);
    }catch(_){
      dev.disabled=false;
      dev.textContent="Developer Access ↗";
    }
  });
})();
<\/script>
</body>
</html>`;

    document.documentElement.appendChild(frame);
  }

  window.addEventListener("message", async function (event) {
    if (event.origin !== location.origin) return;
    if (event.data?.type !== "UG_PRIVATE_DEBUG_UNLOCK") return;

    if (!(await debugEnabled())) {
      sessionStorage.removeItem("ugPrivateDebugSession");
      removeScreen();
      return;
    }

    sessionStorage.setItem("ugPrivateDebugSession", "active");
    removeScreen();

    // Release the early loading cover only after access is verified.
    document.getElementById("ug-early-lockdown-cover")?.remove();
  });

  if (await debugEnabled()) {
    if (sessionStorage.getItem("ugPrivateDebugSession") !== "active") {
      buildScreen();
    } else {
      document.getElementById("ug-early-lockdown-cover")?.remove();
    }
  } else {
    sessionStorage.removeItem("ugPrivateDebugSession");
    removeScreen();
  }

  // Re-check the public switch. If it is turned off, revoke the debug session.
  setInterval(async function () {
    if (!(await debugEnabled())) {
      sessionStorage.removeItem("ugPrivateDebugSession");
      removeScreen();
    }
  }, 5000);
})();
