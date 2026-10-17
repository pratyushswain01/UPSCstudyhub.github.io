(async function () {
  "use strict";

  const ID = "ug-construction-lockdown-frame";

  async function enabled() {
    try {
      const r = await fetch("/debug-mode.json?t=" + Date.now(), {
        cache: "no-store"
      });
      return r.ok && (await r.json()).enabled === true;
    } catch (_) {
      return false;
    }
  }

  function showScreen() {
    if (document.getElementById(ID)) return;

    const frame = document.createElement("iframe");
    frame.id = ID;
    frame.title = "UPSC Gurukul Development Status";
    frame.setAttribute("allow", "fullscreen");
    frame.style.cssText =
      "position:fixed;inset:0;width:100%;height:100%;border:0;" +
      "z-index:2147483647;background:#081321";

    frame.srcdoc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<title>UPSC Gurukul — Under Construction</title>
<style>
:root{color-scheme:dark;--gold:#e8c47a;--muted:#a8b6ca;--panel:#111f33}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;font-family:Inter,system-ui,-apple-system,
Segoe UI,sans-serif;background:#081321;color:#f5f7fb}
body{min-height:100vh;min-height:100dvh;overflow:auto}
button{font:inherit}
.page{position:relative;isolation:isolate;min-height:100vh;min-height:100dvh;
display:flex;align-items:center;justify-content:center;overflow:hidden;
padding:76px 20px 38px}
.glow{position:absolute;z-index:-2;width:75vw;height:75vw;max-width:760px;
max-height:760px;left:50%;top:47%;transform:translate(-50%,-50%);
background:radial-gradient(circle,rgba(40,92,139,.23),transparent 68%);
pointer-events:none}
.grid{position:absolute;inset:0;z-index:-2;opacity:.14;
background-image:linear-gradient(rgba(155,187,222,.13) 1px,transparent 1px),
linear-gradient(90deg,rgba(155,187,222,.13) 1px,transparent 1px);
background-size:42px 42px;mask-image:linear-gradient(to bottom,black,transparent 90%)}
.info-btn{position:absolute;right:20px;top:20px;width:46px;height:46px;
border-radius:50%;border:1px solid rgba(232,196,122,.65);
background:rgba(17,31,51,.9);color:var(--gold);font-size:23px;font-weight:700;
cursor:pointer;display:grid;place-items:center;transition:.2s}
.info-btn:hover{background:#263b56;transform:translateY(-2px)}
.content{width:min(720px,100%);text-align:center;padding:22px 0 12px}
.brand{display:inline-flex;align-items:center;gap:10px;color:var(--gold);
font-size:12px;font-weight:800;letter-spacing:3px}
.brand-mark{width:35px;height:35px;border:1px solid rgba(232,196,122,.6);
border-radius:11px;display:grid;place-items:center;font-size:19px;
background:linear-gradient(145deg,#1a304a,#0b1728)}
.eyebrow{margin:29px 0 12px;color:#a8bdd5;font-size:11px;font-weight:800;
letter-spacing:3px;text-transform:uppercase}
h1{font-size:clamp(38px,7.4vw,70px);line-height:1.03;letter-spacing:-2px;
margin:0;font-weight:850}
h1 span{display:block;color:var(--gold)}
.rule{width:66px;height:3px;margin:25px auto 20px;border-radius:5px;
background:linear-gradient(90deg,#b98a45,#ffe5a7,#b98a45)}
.description{max-width:540px;margin:0 auto;color:var(--muted);
font-size:clamp(14px,2.2vw,17px);line-height:1.8}
.status{display:inline-flex;align-items:center;gap:9px;margin:25px 0 0;
padding:10px 15px;border:1px solid rgba(232,196,122,.24);
border-radius:999px;background:rgba(232,196,122,.06);
font-size:12px;color:#ead8b2}
.dot{width:7px;height:7px;background:var(--gold);border-radius:50%;
box-shadow:0 0 0 5px rgba(232,196,122,.1);animation:pulse 1.8s infinite}
.progress{max-width:310px;height:4px;margin:22px auto 0;border-radius:8px;
background:#1b2b40;overflow:hidden}
.progress:after{content:"";display:block;width:38%;height:100%;
background:linear-gradient(90deg,#a87837,#ffe5a7);
border-radius:8px;animation:progress 2.8s ease-in-out infinite alternate}
.waves{position:absolute;z-index:-1;left:0;right:0;bottom:-2px;height:190px;
overflow:hidden;pointer-events:none;opacity:.82}
.wave{position:absolute;left:-30%;width:160%;height:150px;bottom:-42px;
border-radius:44% 56% 0 0 / 23% 28% 0 0;transform:rotate(-3deg)}
.wave.one{background:linear-gradient(180deg,rgba(31,76,117,.32),#102641);
animation:wave 12s ease-in-out infinite alternate}
.wave.two{bottom:-62px;background:linear-gradient(180deg,rgba(27,62,99,.42),#0c1b2e);
animation:wave 9s ease-in-out infinite alternate-reverse}
.wave.three{bottom:-88px;background:linear-gradient(180deg,rgba(20,47,76,.6),#081321);
animation:wave 14s ease-in-out infinite alternate}
.footer{position:absolute;bottom:16px;left:15px;right:15px;text-align:center;
font-size:11px;letter-spacing:.4px;color:#71849d}
.dev-btn{margin-top:21px;padding:10px 16px;border:1px solid #344a65;
border-radius:10px;color:#d8e4f3;background:rgba(15,29,47,.82);
font-size:12px;cursor:pointer;transition:.2s}
.dev-btn:hover{border-color:var(--gold);color:var(--gold)}
.modal-backdrop{position:fixed;inset:0;z-index:5;display:none;align-items:center;
justify-content:center;padding:18px;background:rgba(2,8,17,.78);
backdrop-filter:blur(9px)}
.modal-backdrop.open{display:flex}
.modal{width:min(510px,100%);max-height:85vh;max-height:85dvh;overflow:auto;
border:1px solid #344862;border-radius:20px;
background:linear-gradient(155deg,#15263c,#0b1728 75%);
box-shadow:0 25px 90px rgba(0,0,0,.5);padding:24px;text-align:left}
.modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.modal-kicker{color:var(--gold);font-size:10px;letter-spacing:2px;font-weight:800}
.modal h2{font-size:25px;letter-spacing:-.5px;margin:8px 0 0}
.close{width:36px;height:36px;flex:none;border:1px solid #344862;border-radius:50%;
color:#e7edf5;background:#102038;font-size:22px;cursor:pointer}
.modal-intro{color:#bdc9d9;line-height:1.75;font-size:14px;margin:17px 0 20px}
.detail{padding:14px 0;border-top:1px solid rgba(145,169,198,.16)}
.detail h3{font-size:13px;color:#f1d8a5;margin:0 0 7px}
.detail p{font-size:13px;color:#aebdd0;line-height:1.75;margin:0}
.modal-foot{margin-top:17px;color:#71849d;font-size:11px}
@keyframes pulse{50%{opacity:.45;box-shadow:0 0 0 8px rgba(232,196,122,.02)}}
@keyframes progress{from{transform:translateX(-10%)}to{transform:translateX(175%)}}
@keyframes wave{from{transform:translateX(-2%) rotate(-3deg)}
to{transform:translateX(5%) rotate(2deg)}}
@media(max-width:480px){
.page{padding:78px 20px 55px}.info-btn{right:15px;top:15px}
.brand{font-size:10px;letter-spacing:2px}.brand-mark{width:31px;height:31px}
.eyebrow{font-size:10px;letter-spacing:2px;margin-top:26px}
h1{letter-spacing:-1.4px}.description{line-height:1.7}
.waves{height:145px}.modal{padding:20px;border-radius:16px}
}
@media(prefers-reduced-motion:reduce){
*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;
scroll-behavior:auto!important;transition:none!important}
}
</style>
</head>
<body>
<main class="page">
<div class="glow"></div><div class="grid"></div>
<button class="info-btn" id="infoBtn" type="button" aria-label="Information about this page"
title="About this page">i</button>
<section class="content" aria-labelledby="heading">
<div class="brand"><span class="brand-mark">ग</span><span>UPSC GURUKUL</span></div>
<p class="eyebrow">A better learning experience is being prepared</p>
<h1 id="heading">Under <span>Construction</span></h1>
<div class="rule"></div>
<p class="description">We’re working behind the scenes to prepare this page.
The public experience is temporarily unavailable while development is in progress.</p>
<div class="status"><span class="dot"></span><span>Development in progress</span></div>
<div class="progress" aria-hidden="true"></div>
<button class="dev-btn" id="devBtn" type="button">Developer Access ↗</button>
</section>
<div class="waves" aria-hidden="true"><div class="wave one"></div>
<div class="wave two"></div><div class="wave three"></div></div>
<footer class="footer">2026 @ Pratyush.dev inc</footer>
</main>
<div class="modal-backdrop" id="infoModal" role="dialog" aria-modal="true"
aria-labelledby="modalTitle">
<section class="modal">
<div class="modal-head"><div><div class="modal-kicker">PAGE INFORMATION</div>
<h2 id="modalTitle">What does this page mean?</h2></div>
<button class="close" id="closeModal" type="button" aria-label="Close information">×</button>
</div>
<p class="modal-intro">You are viewing the temporary development screen for UPSC Gurukul.
This screen appears instead of the normal page while the website is being worked on.</p>
<div class="detail"><h3>Why am I seeing this?</h3>
<p>The website is currently in development mode. The regular public page is being
kept out of view during this period.</p></div>
<div class="detail"><h3>What is happening now?</h3>
<p>Development work and checks are in progress. Some features or pages may not yet
be available, and the finished experience may look different from this screen.</p></div>
<div class="detail"><h3>What should I do?</h3>
<p>You can close this information panel and remain on this status page. When the
public site is ready, this temporary screen can be removed by the site administrator.</p></div>
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
    dev.textContent="Opening developer portal…";
    window.location.replace("/base.html?v=4");
  });
})();
<\/script>
</body>
</html>`;

    document.documentElement.appendChild(frame);
  }

  function removeScreen() {
    document.getElementById(ID)?.remove();
  }

  window.addEventListener("message", async event => {
    if (event.origin !== location.origin) return;
    if (event.data?.type !== "UG_PRIVATE_DEBUG_UNLOCK") return;

    if (!(await enabled())) {
      sessionStorage.removeItem("ugPrivateDebugSession");
      removeScreen();
      return;
    }

    sessionStorage.setItem("ugPrivateDebugSession", "active");
    removeScreen();
  });

  if (await enabled()) {
    if (sessionStorage.getItem("ugPrivateDebugSession") !== "active") {
      showScreen();
    }
  } else {
    sessionStorage.removeItem("ugPrivateDebugSession");
    removeScreen();
  }

  // Re-check the public switch periodically, as before.
  setInterval(async () => {
    if (!(await enabled())) {
      sessionStorage.removeItem("ugPrivateDebugSession");
      removeScreen();
    }
  }, 5000);
})();
