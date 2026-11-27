const PROJECT_ID="upscstudyhub-github";
const ISSUER="https://securetoken.google.com/"+PROJECT_ID;
const JWKS_URL="https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
const ADMIN_UIDS=new Set(["W0IMog3J0wca3KOYjNqnOxCSxhJ3","t7ogzAcEJeO0UD8x3OkWzGiA3OF2"]);
const ORIGINS=new Set(["https://upscgurukul.online","https://www.upscgurukul.online","https://pratyushswain.in","https://www.pratyushswain.in","https://pratyushswain01.github.io"]);
let jwksCache=null,jwksUntil=0,accessToken=null,accessUntil=0;
const json=(v,s=200,o="")=>new Response(JSON.stringify(v),{status:s,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","Vary":"Origin",...(ORIGINS.has(o)?{"Access-Control-Allow-Origin":o,"Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Authorization, Content-Type"}:{})}});
const b64=s=>{s=s.replace(/-/g,"+").replace(/_/g,"/");s+="=".repeat((4-s.length%4)%4);return Uint8Array.from(atob(s),c=>c.charCodeAt(0));};
const decode=s=>JSON.parse(new TextDecoder().decode(b64(s)));
const b64u=b=>{let s="";for(const x of new Uint8Array(b))s+=String.fromCharCode(x);return btoa(s).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");};
async function verify(request){
 const a=request.headers.get("Authorization")||"";if(!a.startsWith("Bearer "))throw Error("Authentication required");
 const p=a.slice(7).split(".");if(p.length!==3)throw Error("Invalid token");
 const h=decode(p[0]),c=decode(p[1]),n=Math.floor(Date.now()/1000);
 if(h.alg!=="RS256"||!h.kid||c.aud!==PROJECT_ID||c.iss!==ISSUER||typeof c.sub!=="string"||!c.sub||!Number.isFinite(c.exp)||c.exp<=n||!Number.isFinite(c.iat)||c.iat>n+60||!Number.isFinite(c.auth_time)||c.auth_time>n+60)throw Error("Invalid or expired token");
 if(!ADMIN_UIDS.has(c.sub))throw Error("Admin access required");
 if(!jwksCache||Date.now()>jwksUntil){const r=await fetch(JWKS_URL);if(!r.ok)throw Error("Firebase signing keys unavailable");jwksCache=(await r.json()).keys||[];jwksUntil=Date.now()+3600000;}
 let k=jwksCache.find(x=>x.kid===h.kid);if(!k){jwksCache=null;return verify(request);}
 const key=await crypto.subtle.importKey("jwk",k,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
 if(!await crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,b64(p[2]),new TextEncoder().encode(p[0]+"."+p[1])))throw Error("Invalid token signature");
 return c.sub;
}
function pem(p){return Uint8Array.from(atob(p.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\\s/g,"")),c=>c.charCodeAt(0));}
async function googleToken(env){
 if(accessToken&&Date.now()<accessUntil-60000)return accessToken;
 if(!env.FIREBASE_SERVICE_ACCOUNT_JSON)throw Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON Worker secret");
 const sa=JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON),now=Math.floor(Date.now()/1000);
 const h=b64u(new TextEncoder().encode(JSON.stringify({alg:"RS256",typ:"JWT"})));
 const c=b64u(new TextEncoder().encode(JSON.stringify({iss:sa.client_email,scope:"https://www.googleapis.com/auth/firebase.messaging https://www.googleapis.com/auth/datastore",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600})));
 const unsigned=h+"."+c,key=await crypto.subtle.importKey("pkcs8",pem(sa.private_key),{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["sign"]);
 const sig=await crypto.subtle.sign("RSASSA-PKCS1-v1_5",key,new TextEncoder().encode(unsigned));
 const form=new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion:unsigned+"."+b64u(sig)});
 const r=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:form}),d=await r.json();
 if(!r.ok||!d.access_token)throw Error("Google service-account authentication failed");
 accessToken=d.access_token;accessUntil=Date.now()+Number(d.expires_in||3600)*1000;return accessToken;
}
async function listDevices(env,token){
 const base="https://firestore.googleapis.com/v1/projects/"+PROJECT_ID+"/databases/(default)/documents";
 let pageToken="",out=[];
 do{
  const u=new URL(base+"/notificationDevices");u.searchParams.set("pageSize","1000");if(pageToken)u.searchParams.set("pageToken",pageToken);
  const r=await fetch(u,{headers:{Authorization:"Bearer "+token}});if(!r.ok){const t=await r.text();throw Error("Could not read notificationDevices: "+t.slice(0,300));}
  const d=await r.json();
  for(const doc of d.documents||[]){const f=doc.fields||{},v=x=>x?.booleanValue===true;
   const fcm=f.fcmToken?.stringValue||f.token?.stringValue||f.registrationToken?.stringValue||"";
   if(fcm&&v(f.notificationsEnabled)&&v(f.optedIn)&&v(f.enabled))out.push({name:doc.name,token:fcm});
  }
  pageToken=d.nextPageToken||"";
 }while(pageToken);
 return out;
}
async function sendOne(token,payload,env,google){
 const body={message:{token,notification:{title:payload.title,body:payload.body},data:{url:payload.url||"/",type:"admin_broadcast"},webpush:{headers:{Urgency:"high"},notification:{icon:"/images/LOGO.jpg",badge:"/images/LOGO.jpg"},fcmOptions:{link:payload.url||"https://upscgurukul.online/"}}}};
 const r=await fetch("https://fcm.googleapis.com/v1/projects/"+PROJECT_ID+"/messages:send",{method:"POST",headers:{Authorization:"Bearer "+google,"Content-Type":"application/json"},body:JSON.stringify(body)});
 const d=await r.json().catch(()=>({}));
 if(!r.ok){const code=d.error?.details?.[0]?.errorCode||d.error?.status||"SEND_ERROR";return {ok:false,code,message:d.error?.message||"FCM send failed",invalid:["UNREGISTERED","INVALID_ARGUMENT"].includes(code)};}
 return {ok:true};
}
async function broadcast(env,payload){
 const google=await googleToken(env),devices=await listDevices(env,google);
 let sent=0,failed=0,invalid=0,errors=[];
 let cursor=0;
 await Promise.all(Array.from({length:Math.min(20,devices.length)},async()=>{while(cursor<devices.length){const d=devices[cursor++];const r=await sendOne(d.token,payload,env,google);if(r.ok)sent++;else{failed++;if(r.invalid)invalid++;if(errors.length<8)errors.push(r.code+": "+r.message);}}}));
 return {targeted:devices.length,sent,failed,invalid,errors};
}
export default {async fetch(req,env){
 const origin=req.headers.get("Origin")||"",url=new URL(req.url);
 if(req.method==="OPTIONS")return ORIGINS.has(origin)?new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Authorization, Content-Type","Access-Control-Max-Age":"86400","Vary":"Origin"}}):new Response(null,{status:403});
 if(req.method==="GET"&&url.pathname==="/health")return json({ok:true,service:"gurukul-push-admin"},200,origin);
 if(!ORIGINS.has(origin))return json({error:"Origin not allowed"},403,origin);
 try{
  await verify(req);
  if(req.method==="GET"&&url.pathname==="/api/admin/push/stats"){
   const t=await googleToken(env),devices=await listDevices(env,t);return json({ok:true,subscribedDevices:devices.length},200,origin);
  }
  if(req.method==="POST"&&url.pathname==="/api/admin/push/send"){
   const p=await req.json(),title=String(p.title||"").trim(),body=String(p.body||"").trim(),target=String(p.target||"all");
   if(!title||title.length>80||!body||body.length>240) return json({error:"Title (1–80 characters) and message (1–240 characters) are required."},400,origin);
   if(target!=="all")return json({error:"Only opted-in subscribed devices are currently supported."},400,origin);
   const result=await broadcast(env,{title,body,url:String(p.url||"/").slice(0,500)});
   return json({ok:true,...result,sentAt:new Date().toISOString()},200,origin);
  }
  return json({error:"Not found"},404,origin);
 }catch(e){const m=e?.message||"Push service error";return json({error:m},/Authentication|token signature/i.test(m)?401:/Admin access/i.test(m)?403:500,origin);}
}};
