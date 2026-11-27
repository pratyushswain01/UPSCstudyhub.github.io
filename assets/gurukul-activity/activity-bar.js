import { auth, watchUser } from "/auth/firebase-auth.js";

(() => {
  "use strict";
  if (window.__GURUKUL_ACTIVITY_BAR__) return;
  window.__GURUKUL_ACTIVITY_BAR__ = true;
const ACTIVITY_API = "https://upscgurukul-activity-api.pratyushkumarswain2005.workers.dev";
  const HEARTBEAT_MS = 30000, IDLE_MS = 120000;
  const DAILY_GOAL_SECONDS = 2 * 60 * 60;
  let user=null, callActivity=null, sessionId=null, tracking=false, starting=false;
  let requestQueue=Promise.resolve();
  let lastInteraction=Date.now(), lastSyncAt=Date.now(), todayBase=0, sessionBase=0;
  let summary=null, heartbeatTimer=null, uiTimer=null, root=null, modal=null;
  let discipline=null, disciplineRoot=null, disciplineStyle=null;

  const esc = v => String(v || "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const fmt = n => { n=Math.max(0,Math.floor(n||0)); return [Math.floor(n/3600),Math.floor((n%3600)/60),n%60].map(v=>String(v).padStart(2,"0")).join(":"); };
  const fmtCompact = n => { n=Math.max(0,Math.floor(n||0)); if(n<60)return n+"s"; if(n<3600)return Math.floor(n/60)+"m "+(n%60)+"s"; return Math.floor(n/3600)+"h "+Math.floor((n%3600)/60)+"m"; };
  const liveExtra = () => tracking && document.visibilityState==="visible" && Date.now()-lastInteraction<IDLE_MS ? Math.max(0,Math.floor((Date.now()-lastSyncAt)/1000)) : 0;
  const todaySeconds = () => todayBase + liveExtra();
  const pageInfo = () => ({pagePath:location.pathname.slice(0,240),pageTitle:(document.title||"UPSC Gurukul").slice(0,120)});

  function isRecoveryPage(){
    return /recovery|study-material|materials|geography|ncert|notes|reader|pdf|preplibrary|library|current-affairs|revision|mapping/i.test(location.pathname);
  }
  function mountDisciplineStyles(){
    if(disciplineStyle)return;
    disciplineStyle=document.createElement("style");
    disciplineStyle.id="gurukul-discipline-style";
    disciplineStyle.textContent=`
      #gurukul-discipline-panel{position:fixed;z-index:2147483000;left:16px;right:16px;top:16px;margin:auto;width:min(560px,calc(100% - 32px));padding:20px;border:1px solid rgba(222,190,122,.35);border-radius:20px;background:linear-gradient(145deg,#17263a,#0c1726);color:#f8fafc;box-shadow:0 24px 80px rgba(0,0,0,.42);font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      #gurukul-discipline-panel *{box-sizing:border-box}
      #gurukul-discipline-panel .gd-kicker{color:#e4c989;font-size:10px;font-weight:800;letter-spacing:1.5px}
      #gurukul-discipline-panel h2{margin:7px 0;color:#fff;font-size:22px;line-height:1.2}
      #gurukul-discipline-panel p{margin:7px 0;color:#c2ccda;font-size:13px}
      #gurukul-discipline-panel .gd-time{margin:13px 0 4px;color:#f2d795;font-size:30px;font-weight:800;font-variant-numeric:tabular-nums}
      #gurukul-discipline-panel .gd-track{height:8px;overflow:hidden;border-radius:20px;background:rgba(255,255,255,.13)}
      #gurukul-discipline-panel .gd-track i{display:block;height:100%;width:0;background:linear-gradient(90deg,#b88b45,#f1d48e);transition:width .2s}
      #gurukul-discipline-panel .gd-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
      #gurukul-discipline-panel a{display:inline-flex;align-items:center;min-height:37px;padding:0 12px;border:1px solid rgba(230,204,145,.3);border-radius:10px;color:#f5dfae;text-decoration:none;font-size:12px;font-weight:700;background:rgba(255,255,255,.06)}
      #gurukul-discipline-panel.gd-lock{top:50%;transform:translateY(-50%);width:min(520px,calc(100% - 32px))}
      #gurukul-discipline-shade{position:fixed;z-index:2147482999;inset:0;background:rgba(5,10,18,.88);backdrop-filter:blur(12px)}
      body.gd-discipline-locked{overflow:hidden!important}
      @media(max-width:560px){#gurukul-discipline-panel{top:10px;left:10px;right:10px;width:auto;padding:17px}#gurukul-discipline-panel.gd-lock{top:50%;left:16px;right:16px;width:auto}}
    `;
    document.head.appendChild(disciplineStyle);
  }
  function renderDiscipline(next){
    if(next)discipline=next;
    const restricted=!!(discipline&&discipline.restricted&&!discipline.isAdmin);
    if(!restricted){
      disciplineRoot?.remove();disciplineRoot=null;
      document.getElementById("gurukul-discipline-shade")?.remove();
      document.body.classList.remove("gd-discipline-locked");
      return;
    }
    mountDisciplineStyles();
    if(!disciplineRoot){
      disciplineRoot=document.createElement("section");
      disciplineRoot.id="gurukul-discipline-panel";
      document.body.appendChild(disciplineRoot);
    }
    const recovery=isRecoveryPage();
    const seconds=Math.max(0,Number(discipline.recoverySeconds)||0);
    const percent=Math.min(100,Math.round(seconds/DAILY_GOAL_SECONDS*100));
    const remaining=Math.max(0,DAILY_GOAL_SECONDS-seconds);
    disciplineRoot.className=recovery?"":"gd-lock";
    disciplineRoot.innerHTML=
      '<div class="gd-kicker">UPSC GURUKUL · DISCIPLINE RECOVERY</div>'+
      '<h2>'+(recovery?'Recovery study in progress':'Access temporarily restricted')+'</h2>'+
      '<p>'+(recovery?'Continue studying on this approved materials page. Your recovery time is counted while this page is visible and active.':'Your daily study target was missed after your grace day was used. Complete two fresh hours of active study to restore normal access.')+'</p>'+
      '<div class="gd-time">'+fmt(seconds)+' <span style="font-size:13px;color:#b9c4d3;font-weight:600">/ 02:00:00</span></div>'+
      '<div class="gd-track"><i style="width:'+percent+'%"></i></div>'+
      '<p>'+(remaining>0?fmt(remaining)+' remaining to restore access':'Recovery target complete. Refreshing your status…')+'</p>'+
      '<div class="gd-links">'+
      '<a href="/notes.html">Study Notes</a>'+
      '<a href="/mapping.html">Mapping Practice</a>'+
      '<a href="/revision.html">Revision Tools</a>'+
      '<a href="/notes/index.html">Notes Library</a>'+
      '</div>';
    if(recovery){
      document.getElementById("gurukul-discipline-shade")?.remove();
      document.body.classList.remove("gd-discipline-locked");
    }else{
      if(!document.getElementById("gurukul-discipline-shade")){
        const shade=document.createElement("div");
        shade.id="gurukul-discipline-shade";
        document.body.appendChild(shade);
      }
      document.body.classList.add("gd-discipline-locked");
    }
  }
  function mountStyles(){
    if(document.getElementById("gurukul-activity-style")) return;
    const link=document.createElement("link"); link.id="gurukul-activity-style"; link.rel="stylesheet";
    link.href="/assets/gurukul-activity/activity-bar.css?v=2"; document.head.appendChild(link);
  }
  function mountBar(){
    if(root||!document.body) return;
    root=document.createElement("div"); root.id="gurukul-activity-bar";
    root.innerHTML='<button class="ga-trigger" type="button" aria-haspopup="dialog" aria-expanded="false"><span class="ga-live-dot"></span><span class="ga-trigger-label">GURUKUL ACTIVITY</span><span class="ga-trigger-time" data-ga-time>Today 00:00:00</span><span class="ga-streak-pill" data-ga-streak-pill>🔥 <b data-ga-bar-streak>0 day streak</b><small data-ga-bar-goal>2 hr daily goal</small></span><span class="ga-trigger-open">View activity <span aria-hidden="true">↗</span></span></button>';
    const first=document.body.firstElementChild;
    if(first) document.body.insertBefore(root,first); else document.body.appendChild(root);
    root.querySelector(".ga-trigger").addEventListener("click",openModal);
  }
  function ensureModal(){
    if(modal) return;
    modal=document.createElement("div"); modal.className="ga-backdrop"; modal.hidden=true; modal.setAttribute("aria-hidden","true");
    modal.innerHTML='<section class="ga-modal" role="dialog" aria-modal="true" aria-labelledby="ga-title"><header class="ga-modal-head"><div><div class="ga-kicker">UPSC GURUKUL · LEARNING INSIGHTS</div><h2 id="ga-title">Your activity</h2><p class="ga-subtitle">A private view of your active time on Gurukul</p></div><button class="ga-close" type="button" aria-label="Close activity">×</button></header><div class="ga-summary-grid"><article class="ga-stat ga-stat-primary"><span>Today</span><strong data-ga-today>00:00:00</strong><small>Active time</small></article><article class="ga-stat"><span>Last 7 days</span><strong data-ga-week>0h 0m</strong><small data-ga-days>Across 7 days</small></article></div><section class="ga-streak" data-ga-streak><div class="ga-streak-top"><div><span class="ga-streak-kicker">DAILY STUDY STREAK</span><strong><span data-ga-streak-current>0</span> days <span class="ga-streak-fire">🔥</span></strong><small data-ga-streak-best>Best: 0 days</small></div><div class="ga-streak-badge" data-ga-streak-status>IN PROGRESS</div></div><div class="ga-streak-track"><i data-ga-streak-progress></i></div><div class="ga-streak-bottom"><span data-ga-streak-message>2 hours to complete today’s goal</span><span>2 HOURS / DAY</span></div></section><section class="ga-section"><div class="ga-section-title"><h3>Weekly activity</h3><span>IST</span></div><div class="ga-week" data-ga-week-bars></div></section><section class="ga-section"><div class="ga-section-title"><h3>Recent sessions</h3><span>Only visible to you</span></div><div class="ga-sessions" data-ga-sessions><div class="ga-loading">Loading your activity…</div></div></section><footer class="ga-modal-foot"><span class="ga-foot-dot"></span> Time is counted only while this page is visible and recently active.</footer></section>';
    document.body.appendChild(modal);
    modal.querySelector(".ga-close").addEventListener("click",closeModal);
    modal.addEventListener("click",e=>{if(e.target===modal)closeModal();});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)closeModal();});
  }
  function openModal(){
    if(!user)return; ensureModal(); modal.hidden=false; modal.setAttribute("aria-hidden","false");
    root.querySelector(".ga-trigger").setAttribute("aria-expanded","true");
    document.body.classList.add("ga-modal-open"); renderSummary(); loadSummary(); modal.querySelector(".ga-close").focus();
  }
  function closeModal(){
    if(!modal||modal.hidden)return; modal.hidden=true; modal.setAttribute("aria-hidden","true");
    root?.querySelector(".ga-trigger")?.setAttribute("aria-expanded","false");
    document.body.classList.remove("ga-modal-open"); root?.querySelector(".ga-trigger")?.focus();
  }
  function renderSummary(){
    if(!modal)return; modal.querySelector("[data-ga-today]").textContent=fmt(todaySeconds());
    if(!summary)return;
    const days=summary.days||[], total=days.reduce((a,d)=>a+(d.seconds||0),0);
    modal.querySelector("[data-ga-week]").textContent=fmtCompact(total);
    const streak=summary.streak||{goalSeconds:7200,current:0,best:0};
    const goal=Number(streak.goalSeconds)||DAILY_GOAL_SECONDS, today=todaySeconds(), completed=today>=goal;
    modal.querySelector("[data-ga-streak-current]").textContent=String((streak.current||0)+(completed&& !streak.todayCompleted?1:0));
    modal.querySelector("[data-ga-streak-best]").textContent="Best: "+Math.max(streak.best||0,(streak.current||0)+(completed&&!streak.todayCompleted?1:0))+" days";
    modal.querySelector("[data-ga-streak-status]").textContent=completed?"GOAL COMPLETED":"IN PROGRESS";
    modal.querySelector("[data-ga-streak-progress]").style.width=Math.min(100,Math.round(today/goal*100))+"%";
    modal.querySelector("[data-ga-streak-message]").textContent=completed?"Daily goal complete — streak protected!":Math.ceil(Math.max(0,goal-today)/60)+" minutes left to complete today’s goal";
    modal.querySelector("[data-ga-days]").textContent=days.filter(d=>d.seconds>0).length+" active days";
    const max=Math.max(3600,...days.map(d=>d.seconds||0));
    modal.querySelector("[data-ga-week-bars]").innerHTML=days.map(d=>{
      const pct=Math.min(100,Math.round(((d.seconds||0)/max)*100));
      return '<div class="ga-day"><div class="ga-bar-track"><i style="height:'+pct+'%"></i></div><strong>'+Math.floor((d.seconds||0)/3600)+'h</strong><span>'+esc(d.label)+'</span></div>';
    }).join("");
    const sessions=summary.recentSessions||[];
    modal.querySelector("[data-ga-sessions]").innerHTML=sessions.length?sessions.map(s=>{
      const date=s.startedAt?new Date(s.startedAt).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"}):"Recent session";
      return '<div class="ga-session"><span class="ga-session-icon">◷</span><div class="ga-session-copy"><strong>'+esc(s.title||"Study session")+'</strong><small>'+esc(date)+' · '+esc(s.pagePath||"Gurukul")+'</small></div><span class="ga-session-duration">'+(s.durationSeconds>0?fmt(s.durationSeconds):"Under 20s")+'</span></div>';
    }).join(""):'<div class="ga-empty">Your study sessions will appear here as you use Gurukul.</div>';
  }
  async function loadSummary(){
    if(!callActivity||!user)return;
    const holder=modal?.querySelector("[data-ga-sessions]");
    if(holder)holder.innerHTML='<div class="ga-loading">Loading your activity…</div>';
    try{
      summary=(await callActivity({action:"summary"})).data;
      discipline=summary.discipline||null; renderDiscipline(discipline);
      todayBase=summary.todaySeconds||0; lastSyncAt=Date.now(); renderSummary(); updateBar();
    }catch(e){
      console.warn("[Gurukul Activity] Summary unavailable:",e);
      if(holder)holder.innerHTML='<div class="ga-empty">Activity summary is temporarily unavailable. Please try again.</div>';
    }
  }
  async function send(action){
    if(!callActivity||!user||!sessionId)return null;
    // Capture the session identity now. The request queue guarantees that
    // heartbeat/end requests are not silently discarded during another fetch.
    const requestUser=user, requestSessionId=sessionId;
    const payload=Object.assign({action,sessionId:requestSessionId},pageInfo());
    const run=async()=>{
      try{
        const data=(await callActivity(payload,requestUser)).data||{};
        if(typeof data.todaySeconds==="number")todayBase=data.todaySeconds;
        if(typeof data.sessionSeconds==="number")sessionBase=data.sessionSeconds;
        if(data.discipline)renderDiscipline(data.discipline);
        lastSyncAt=Date.now();
        if(data.sessionClosed && sessionId===requestSessionId){tracking=false;sessionId=null;}
        updateBar();renderSummary();return data;
      }catch(e){console.warn("[Gurukul Activity] Sync failed ("+action+"):",e);return null;}
    };
    const task=requestQueue.then(run,run);
    requestQueue=task.then(()=>undefined,()=>undefined);
    return task;
  }
  async function beginSession(){
    if(!user||tracking||starting||document.visibilityState!=="visible"||Date.now()-lastInteraction>=IDLE_MS)return;
    starting=true;
    const requestUser=user;
    sessionId=crypto.randomUUID().replace(/-/g,"");sessionBase=0;
    try{
      const data=await send("start");
      if(data && user===requestUser){
        tracking=true;lastSyncAt=Date.now();updateBar();
        // If focus was lost while the start request was in flight, close it.
        if(document.visibilityState!=="visible"||Date.now()-lastInteraction>=IDLE_MS){
          await send("end");tracking=false;sessionId=null;updateBar();
        }
      }else if(sessionId){sessionId=null;tracking=false;updateBar();}
    }finally{starting=false;}
  }
  async function heartbeat(){
    if(!user)return;
    const eligible=document.visibilityState==="visible"&&Date.now()-lastInteraction<IDLE_MS;
    if(!eligible){if(tracking)await send("end");tracking=false;sessionId=null;updateBar();return;}
    if(!tracking){await beginSession();return;}
    await send("heartbeat");
  }
  function interaction(){lastInteraction=Date.now();if(user&&!tracking&&document.visibilityState==="visible")beginSession();}
  function updateBar(){
    if(!root)return;const t=root.querySelector("[data-ga-time]");if(t)t.textContent="Today "+fmt(todaySeconds());
    const streak=summary?.streak||{},goal=Number(streak.goalSeconds)||DAILY_GOAL_SECONDS,today=todaySeconds(),done=today>=goal;
    const current=(streak.current||0)+(done&&!streak.todayCompleted?1:0);
    const streakNode=root.querySelector("[data-ga-bar-streak]");if(streakNode)streakNode.textContent=current+" day"+(current===1?"":"s")+" streak";
    const goalNode=root.querySelector("[data-ga-bar-goal]");if(goalNode)goalNode.textContent=done?"Daily goal complete":Math.ceil(Math.max(0,goal-today)/60)+" min left today";
    root.querySelector(".ga-live-dot")?.classList.toggle("is-active",tracking);
  }
  function initTracking(){
    heartbeatTimer=setInterval(heartbeat,HEARTBEAT_MS);
    uiTimer=setInterval(()=>{updateBar();if(modal&&!modal.hidden)renderSummary();if(user&&tracking&&Date.now()-lastInteraction>=IDLE_MS)heartbeat();},1000);
    ["pointerdown","keydown","scroll","touchstart","click"].forEach(n=>document.addEventListener(n,interaction,{passive:true,capture:true}));
    document.addEventListener("visibilitychange",()=>{
      if(document.visibilityState==="hidden"&&tracking){send("end");tracking=false;sessionId=null;updateBar();}
      else if(document.visibilityState==="visible"){lastInteraction=Date.now();beginSession();}
    });
    window.addEventListener("focus",()=>{lastInteraction=Date.now();beginSession();});
    window.addEventListener("pagehide",()=>{if(tracking)send("end");});
  }
  async function boot(){
    try{
      callActivity=async (payload,authUser=user)=>{
        if(!authUser) throw new Error("Sign in required");
        const token=await authUser.getIdToken();
        const response=await fetch(ACTIVITY_API+"/api/activity",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},body:JSON.stringify(payload),keepalive:payload.action==="end"});
        const result=await response.json().catch(()=>({error:"Invalid server response"}));
        if(!response.ok) throw new Error(result.error||"Activity service unavailable");
        return {data:result};
      };
      mountStyles();mountBar();initTracking();
      watchUser(async nextUser=>{
        user=nextUser;
        if(!user){if(tracking)await send("end");tracking=false;sessionId=null;if(root)root.hidden=true;closeModal();return;}
        if(root)root.hidden=false;lastInteraction=Date.now();await loadSummary();await beginSession();
      });
    }catch(e){console.error("[Gurukul Activity] Could not initialize:",e);}
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();