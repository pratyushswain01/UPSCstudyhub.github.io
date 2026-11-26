/* UPSC Gurukul — Two-hour Daily Study Streak launch notice */
(function(){
 "use strict";
 const KEY="gurukul-streak-launch-notice-dismissed-v2",ID="gurukul-streak-launch-notice";
 if(window.__GURUKUL_STREAK_NOTICE_V2__)return;window.__GURUKUL_STREAK_NOTICE_V2__=true;
 function show(){
  try{if(localStorage.getItem(KEY)==="1")return;}catch(e){}
  if(document.getElementById(ID))return;
  const style=document.createElement("style");style.textContent=`
  #${ID}{position:fixed;inset:0;z-index:2147483002;display:grid;place-items:center;padding:clamp(14px,3vw,28px);background:rgba(30,27,22,.48);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
  #${ID} *{box-sizing:border-box}
  #${ID} .card{position:relative;width:min(100%,520px);max-height:min(90dvh,760px);overflow-y:auto;padding:clamp(25px,5vw,38px);border:1px solid #e5dccb;border-radius:22px;background:#fbf8f1;color:#292820;box-shadow:0 24px 70px rgba(34,29,20,.24)}
  #${ID} .close{position:absolute;right:17px;top:17px;display:grid;place-items:center;width:36px;height:36px;border:1px solid #ded6c8;border-radius:50%;background:#f4efe5;color:#514b40;font-size:22px;line-height:1;cursor:pointer;transition:background .18s,border-color .18s}
  #${ID} .close:hover{background:#eee5d5;border-color:#cdbb98}
  #${ID} .icon{display:grid;place-items:center;width:54px;height:54px;margin-bottom:22px;border:1px solid #ead9b6;border-radius:17px;background:#f5ecd9;font-size:27px}
  #${ID} .eyebrow{color:#9b7435;font-size:10px;font-weight:800;letter-spacing:2px;line-height:1.5;text-transform:uppercase;padding-right:38px}
  #${ID} h2{max-width:430px;margin:10px 0 13px;color:#28271f;font-family:Georgia,"Times New Roman",serif;font-size:clamp(29px,6vw,39px);font-weight:600;letter-spacing:-.8px;line-height:1.12}
  #${ID} p{max-width:440px;margin:0;color:#625d52;font-size:14px;line-height:1.75}
  #${ID} .points{display:grid;gap:13px;margin:22px 0;padding:18px 19px;border:1px solid #e8dfd0;border-radius:15px;background:#f5f1e8}
  #${ID} .point{display:grid;grid-template-columns:18px 1fr;gap:8px;color:#5a554a;font-size:13px;line-height:1.55}
  #${ID} .point:before{content:"✓";color:#71805a;font-size:14px;font-weight:800}
  #${ID} .point b{color:#38352d;font-weight:750}
  #${ID} .actions{display:flex;gap:11px;align-items:center}
  #${ID} button.action{min-height:48px;padding:0 19px;border-radius:11px;font:700 13px/1 Inter,system-ui,sans-serif;cursor:pointer;transition:transform .18s,background .18s}
  #${ID} button.action:hover{transform:translateY(-1px)}
  #${ID} .primary{flex:1;border:1px solid #98733c;background:#a9874f;color:#fffdf8}
  #${ID} .primary:hover{background:#92713f}
  #${ID} .later{border:1px solid #d8d0c2;background:transparent;color:#514b40}
  #${ID} .later:hover{background:#f1ebdf}
  #${ID} .foot{margin:17px 0 0;text-align:center;color:#8b8375;font-size:10px;line-height:1.5;letter-spacing:.2px}
  @media(max-width:480px){#${ID} .card{padding:27px 21px 22px;border-radius:18px}#${ID} .points{padding:15px}#${ID} .actions{flex-direction:column;align-items:stretch}#${ID} button.action{width:100%}}
  @media(prefers-reduced-motion:reduce){#${ID} *,#${ID} *:before{transition:none!important}}
  `;document.head.appendChild(style);tudy Streak launch notice */
(function(){
 "use strict";
 const KEY="gurukul-streak-launch-notice-dismissed-v2",ID="gurukul-streak-launch-notice";
 if(window.__GURUKUL_STREAK_NOTICE_V2__)return;window.__GURUKUL_STREAK_NOTICE_V2__=true;
 function show(){
  try{if(localStorage.getItem(KEY)==="1")return;}catch(e){}
  if(document.getElementById(ID))return;
  const style=document.createElement("style");style.textContent=`
  #${ID}{position:fixed;inset:0;z-index:2147483002;display:grid;place-items:center;padding:16px;background:rgba(6,13,25,.72);backdrop-filter:blur(10px);font-family:Inter,system-ui,sans-serif}
  #${ID} *{box-sizing:border-box}#${ID} .card{position:relative;width:min(100%,470px);padding:30px 26px 24px;border:1px solid rgba(230,190,105,.3);border-radius:24px;background:linear-gradient(150deg,#1a2a40,#0c1728);color:#f8fafc;box-shadow:0 28px 90px #0008}
  #${ID} .close{position:absolute;right:14px;top:12px;width:34px;height:34px;border:1px solid #ffffff30;border-radius:50%;background:#ffffff12;color:#fff;font-size:22px;cursor:pointer}
  #${ID} .icon{font-size:30px;margin-bottom:14px}#${ID} .eyebrow{color:#e6c57f;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase}
  #${ID} h2{margin:9px 0 10px;font-size:clamp(25px,6vw,32px);line-height:1.12;color:#fff}
  #${ID} p{color:#c5d0de;font-size:14px;line-height:1.65;margin:0}
  #${ID} .points{display:grid;gap:11px;margin:20px 0;padding:16px;border:1px solid #ffffff1a;border-radius:16px;background:#ffffff0a}
  #${ID} .point{font-size:12px;line-height:1.5;color:#e6edf5}#${ID} .point b{color:#f0d58c}
  #${ID} .actions{display:flex;gap:10px}#${ID} button.action{min-height:45px;padding:0 16px;border-radius:12px;font-weight:800;cursor:pointer}
  #${ID} .primary{flex:1;border:0;background:linear-gradient(135deg,#f0d99f,#c99a4b);color:#172337}
  #${ID} .later{border:1px solid #ffffff30;background:transparent;color:#fff}
  #${ID} .foot{text-align:center;font-size:10px;color:#9aaabd;margin-top:14px}
  @media(max-width:420px){#${ID} .card{padding:25px 19px 20px}#${ID} .actions{flex-direction:column}}
  `;document.head.appendChild(style);
  const overlay=document.createElement("div");overlay.id=ID;overlay.innerHTML=`
   <section class="card" role="dialog" aria-modal="true" aria-labelledby="gsn-title">
    <button class="close" type="button" aria-label="Close">×</button>
    <div class="icon">🔥</div><div class="eyebrow">Introducing a stronger study habit</div>
    <h2 id="gsn-title">Your 2-hour daily study streak starts now.</h2>
    <p>UPSC Gurukul now helps you build consistency with a daily study streak. Complete two hours of verified active study each day to grow and protect your streak.</p>
    <div class="points">
     <div class="point">✓ <b>2 hours every day</b> — the new daily streak target.</div>
     <div class="point">✓ <b>Track your progress</b> — current streak, best streak and time remaining.</div>
     <div class="point">✓ <b>Across devices</b> — sign in with the same Gurukul account to sync your progress.</div>
    </div>
    <div class="actions"><button class="action primary" type="button" data-view>View my streak</button><button class="action later" type="button" data-close>Maybe later</button></div>
    <div class="foot">Study with discipline. Build your streak. Move closer to your goal.</div>
   </section>`;
  document.body.appendChild(overlay);
  function close(){try{localStorage.setItem(KEY,"1")}catch(e){}overlay.remove()}
  overlay.querySelector(".close").onclick=close;overlay.querySelector("[data-close]").onclick=close;
  overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
  overlay.querySelector("[data-view]").onclick=()=>{close();const b=document.querySelector("#gurukul-activity-bar .ga-trigger");if(b)b.click()};
  const esc=e=>{if(e.key==="Escape"&&document.getElementById(ID)){close();document.removeEventListener("keydown",esc)}};
  document.addEventListener("keydown",esc);overlay.querySelector(".close").focus();
 }
 const init=()=>setTimeout(show,1000);
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();