const PROJECT_ID = "upscstudyhub-github";
const ISSUER = "https://securetoken.google.com/" + PROJECT_ID;
const JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
const ALLOWED_ORIGINS = new Set(["https://upscgurukul.online","https://www.upscgurukul.online","https://pratyushswain.in","https://www.pratyushswain.in","https://pratyushswain01.github.io"]);
let cachedKeys = null, keysExpireAt = 0;

function json(data, status=200, origin="") {
  const h={"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","Vary":"Origin"};
  if(origin && ALLOWED_ORIGINS.has(origin)){h["Access-Control-Allow-Origin"]=origin;h["Access-Control-Allow-Methods"]="POST, OPTIONS";h["Access-Control-Allow-Headers"]="Authorization, Content-Type";h["Access-Control-Max-Age"]="86400";}
  return new Response(JSON.stringify(data),{status,headers:h});
}
function decode64(s){s=s.replace(/-/g,"+").replace(/_/g,"/");s+="=".repeat((4-s.length%4)%4);return Uint8Array.from(atob(s),c=>c.charCodeAt(0));}
function decode(s){return JSON.parse(new TextDecoder().decode(decode64(s)));}
async function keys(){
  if(cachedKeys && Date.now()<keysExpireAt)return cachedKeys;
  const r=await fetch(JWKS_URL,{cf:{cacheTtl:3600,cacheEverything:true}});
  if(!r.ok)throw Error("Firebase signing keys unavailable");
  cachedKeys=(await r.json()).keys||[];keysExpireAt=Date.now()+3600000;return cachedKeys;
}
async function verifySignature(jwk,parts,uid){
  const key=await crypto.subtle.importKey("jwk",jwk,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
  const ok=await crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,decode64(parts[2]),new TextEncoder().encode(parts[0]+"."+parts[1]));
  if(!ok)throw Error("Invalid authentication signature");return uid;
}
async function verifyToken(request){
  const auth=request.headers.get("Authorization")||"";
  if(!auth.startsWith("Bearer "))throw Error("Authentication required");
  const p=auth.slice(7).split(".");if(p.length!==3)throw Error("Invalid token");
  const h=decode(p[0]),c=decode(p[1]),now=Math.floor(Date.now()/1000);
  if(h.alg!=="RS256"||!h.kid||c.aud!==PROJECT_ID||c.iss!==ISSUER||typeof c.sub!=="string"||!c.sub||!Number.isFinite(c.exp)||c.exp<=now||!Number.isFinite(c.iat)||c.iat>now+60||!Number.isFinite(c.auth_time)||c.auth_time>now+60)throw Error("Expired or invalid authentication token");
  let jwk=(await keys()).find(k=>k.kid===h.kid);
  if(!jwk){cachedKeys=null;jwk=(await keys()).find(k=>k.kid===h.kid);}
  if(!jwk)throw Error("Unknown signing key");
  return verifySignature(jwk,p,c.sub);
}
function indiaDate(ms){
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(ms));
  const o=Object.fromEntries(parts.map(x=>[x.type,x.value]));return o.year+"-"+o.month+"-"+o.day;
}
function label(date){return new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",weekday:"short"}).format(new Date(date+"T12:00:00+05:30"));}
async function today(db,uid,date){
  const r=await db.prepare("SELECT seconds FROM activity_daily WHERE uid=? AND activity_date=?").bind(uid,date).first();return r?r.seconds:0;
}
async function start(db,uid,b,now){
  const id=String(b.sessionId||"");if(!/^[a-f0-9]{24,80}$/i.test(id))throw Error("Invalid session identifier");
  const date=indiaDate(now),path=String(b.pagePath||"/").slice(0,240),title=String(b.pageTitle||"UPSC Gurukul").slice(0,120);
  await db.batch([
    db.prepare("INSERT INTO activity_sessions(session_id,uid,started_at,last_heartbeat_at,seconds,page_path,page_title) VALUES(?,?,?,?,0,?,?)").bind(id,uid,now,now,path,title),
    db.prepare("INSERT INTO activity_daily(uid,activity_date,seconds,sessions) VALUES(?,?,0,1) ON CONFLICT(uid,activity_date) DO UPDATE SET sessions=sessions+1").bind(uid,date)
  ]);
  return {sessionSeconds:0,todaySeconds:await today(db,uid,date)};
}
async function touch(db,uid,b,now,end){
  const id=String(b.sessionId||"");if(!/^[a-f0-9]{24,80}$/i.test(id))throw Error("Invalid session identifier");
  const s=await db.prepare("SELECT last_heartbeat_at,seconds FROM activity_sessions WHERE session_id=? AND uid=? AND ended_at IS NULL").bind(id,uid).first();
  if(!s)return {sessionClosed:true,sessionSeconds:0,todaySeconds:await today(db,uid,indiaDate(now))};
  // Persist short active sessions too: tab switches, navigation, and mobile page exits often happen before the next 30s heartbeat.
  // Ignore gaps over 90s to avoid crediting a suspended/background browser as active.
  const gap=now-s.last_heartbeat_at,credit=gap>=1000&&gap<=90000?Math.min(60,Math.floor(gap/1000)):0,date=indiaDate(now);
  const statements=[db.prepare("UPDATE activity_sessions SET last_heartbeat_at=?,seconds=seconds+?,page_path=?,page_title=?,ended_at=? WHERE session_id=? AND uid=? AND ended_at IS NULL").bind(now,credit,String(b.pagePath||"/").slice(0,240),String(b.pageTitle||"UPSC Gurukul").slice(0,120),end?now:null,id,uid)];
  if(credit)statements.push(db.prepare("INSERT INTO activity_daily(uid,activity_date,seconds,sessions) VALUES(?,?,?,0) ON CONFLICT(uid,activity_date) DO UPDATE SET seconds=seconds+excluded.seconds").bind(uid,date,credit));
  await db.batch(statements);
  const updated=await db.prepare("SELECT seconds FROM activity_sessions WHERE session_id=? AND uid=?").bind(id,uid).first();
  return {sessionSeconds:updated?updated.seconds:0,todaySeconds:await today(db,uid,date),sessionClosed:end};
}
const STREAK_GOAL_SECONDS=1800;
function shiftDate(date,delta){
  const d=new Date(date+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+delta);return d.toISOString().slice(0,10);
}
async function getSummary(db,uid,now){
  const todayDate=indiaDate(now),from=indiaDate(now-6*86400000);
  const r=await db.prepare("SELECT activity_date,seconds FROM activity_daily WHERE uid=? AND activity_date<=? ORDER BY activity_date").bind(uid,todayDate).all();
  const allRows=r.results||[],map=new Map(allRows.map(x=>[x.activity_date,x.seconds])),days=[];
  for(let i=6;i>=0;i--){const d=shiftDate(todayDate,-i);days.push({date:d,label:label(d),seconds:map.get(d)||0});}
  // A streak is earned only after the daily active-time target is reached.
  // Before today's target is reached, yesterday's completed streak remains alive for the rest of today.
  let cursor=map.get(todayDate)>=STREAK_GOAL_SECONDS?todayDate:shiftDate(todayDate,-1);
  let current=0;
  while((map.get(cursor)||0)>=STREAK_GOAL_SECONDS){current++;cursor=shiftDate(cursor,-1);}
  let best=0,run=0,previous=null;
  for(const row of allRows){
    if((row.seconds||0)<STREAK_GOAL_SECONDS){run=0;previous=row.activity_date;continue;}
    run=previous&&shiftDate(previous,1)===row.activity_date?run+1:1;
    best=Math.max(best,run);previous=row.activity_date;
  }
  const todaySeconds=map.get(todayDate)||0;
  const streak={goalSeconds:STREAK_GOAL_SECONDS,todaySeconds,remainingSeconds:Math.max(0,STREAK_GOAL_SECONDS-todaySeconds),todayCompleted:todaySeconds>=STREAK_GOAL_SECONDS,current,best};
  const s=await db.prepare("SELECT started_at,seconds,page_path,page_title FROM activity_sessions WHERE uid=? ORDER BY started_at DESC LIMIT 10").bind(uid).all();
  return {todaySeconds,days,streak,recentSessions:(s.results||[]).map(x=>({startedAt:x.started_at,durationSeconds:x.seconds,pagePath:x.page_path,title:x.page_title}))};
}
export default {async fetch(request,env){
  const origin=request.headers.get("Origin")||"";
  if(request.method==="OPTIONS"){
    if(!ALLOWED_ORIGINS.has(origin))return new Response(null,{status:403});
    return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Authorization, Content-Type","Access-Control-Max-Age":"86400","Vary":"Origin"}});
  }
  const url=new URL(request.url);
  if(request.method==="GET"&&url.pathname==="/health")return json({ok:true,service:"gurukul-activity"},200,origin);
  if(request.method!=="POST"||url.pathname!=="/api/activity")return json({error:"Not found"},404,origin);
  if(origin&&!ALLOWED_ORIGINS.has(origin))return json({error:"Origin not allowed"},403);
  try{
    const uid=await verifyToken(request),body=await request.json(),now=Date.now();let result;
    if(body.action==="start")result=await start(env.DB,uid,body,now);
    else if(body.action==="heartbeat")result=await touch(env.DB,uid,body,now,false);
    else if(body.action==="end")result=await touch(env.DB,uid,body,now,true);
    else if(body.action==="summary")result=await getSummary(env.DB,uid,now);
    else return json({error:"Invalid activity action"},400,origin);
    return json(result,200,origin);
  }catch(e){const m=e&&e.message?e.message:"Activity service error";return json({error:m},/Authentication|token|signature|signing key|Origin/i.test(m)?401:400,origin);}
}};
