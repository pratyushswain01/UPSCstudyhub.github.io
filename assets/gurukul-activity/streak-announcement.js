/* UPSC Gurukul — Two-hour Daily Study Streak launch notice */
(function(){
 "use strict";
 const KEY="gurukul-streak-launch-notice-dismissed-v3",ID="gurukul-streak-launch-notice";
 if(window.__GURUKUL_STREAK_NOTICE_V2__)return;window.__GURUKUL_STREAK_NOTICE_V2__=true;
 function show(){
  try{if(localStorage.getItem(KEY)==="1")return;}catch(e){}
  if(document.getElementById(ID))return;
  const style=document.createElement("style");style.textContent=`
  #${ID}{position:fixed;inset:0;z-index:2147483002;display:grid;place-items:center;padding:18px;background:rgba(27,25,21,.58);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}
  #${ID} *{box-sizing:border-box}
  #${ID} .card{position:relative;width:min(100%,448px);padding:32px 30px 25px;border:1px solid #e5d6b9;border-radius:22px;background:linear-gradient(155deg,#fffdf8 0%,#f8f2e6 100%);color:#29261f;box-shadow:0 24px 70px rgba(20,17,11,.28)}
  #${ID} .close{position:absolute;right:15px;top:15px;width:34px;height:34px;border:1px solid #ded4c2;border-radius:50%;background:#fffaf0;color:#494237;font-size:21px;line-height:1;cursor:pointer;transition:background .18s,transform .18s}
  #${ID} .close:hover{background:#f0e6d3;transform:rotate(90deg)}
  #${ID} .icon{display:grid;place-items:center;width:48px;height:48px;margin-bottom:20px;border:1px solid #ead8ad;border-radius:15px;background:#f6ecd5;font-size:25px}
  #${ID} .eyebrow{color:#98702d;font-size:10px;font-weight:800;letter-spacing:2.1px;text-transform:uppercase}
  #${ID} h2{max-width:360px;margin:10px 0 12px;color:#26231d;font-family:Georgia,"Times New Roman",serif;font-size:clamp(27px,6vw,34px);font-weight:700;line-height:1.12;letter-spacing:-.55px}
  #${ID} p{margin:0;color:#625b4f;font-size:13.5px;line-height:1.75}
  #${ID} .points{display:grid;gap:12px;margin:21px 0 22px;padding:17px 18px;border:1px solid #e8deca;border-radius:15px;background:rgba(255,255,255,.68)}
  #${ID} .point{font-size:12px;line-height:1.55;color:#514a3f}
  #${ID} .point b{color:#805b20;font-weight:800}
  #${ID} .actions{display:flex;gap:10px}
  #${ID} button.action{min-height:46px;padding:0 17px;border-radius:11px;font-family:inherit;font-size:12px;font-weight:800;cursor:pointer;transition:transform .18s,background .18s}
  #${ID} button.action:hover{transform:translateY(-1px)}
  #${ID} .primary{flex:1;border:1px solid #29261f;background:linear-gradient(135deg,#373229,#211f1a);color:#fffaf0;box-shadow:0 5px 13px rgba(41,38,31,.13)}
  #${ID} .primary:hover{background:#171612}
  #${ID} .later{border:1px solid #d8cdb9;background:transparent;color:#514a3f}
  #${ID} .later:hover{background:#f0e8da}
  #${ID} .foot{margin-top:16px;text-align:center;color:#8a806f;font-size:10px;letter-spacing:.15px}
  @media(max-width:480px){#${ID}{padding:14px}#${ID} .card{padding:27px 21px 22px;border-radius:19px}#${ID} .points{padding:15px}#${ID} .actions{flex-direction:column}#${ID} .later{min-height:42px}}
  @media(prefers-reduced-motion:reduce){#${ID} *,#${ID} *:before,#${ID} *:after{transition:none!important}}
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