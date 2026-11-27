const PROJECT_ID="upscstudyhub-github";
const ISSUER="https://securetoken.google.com/"+PROJECT_ID;
const JWKS_URL="https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
const ADMIN_UIDS=new Set(["W0IMog3J0wca3KOYjNqnOxCSxhJ3","t7ogzAcEJeO0UD8x3OkWzGiA3OF2"]);
const ALLOWED_ORIGINS=new Set(["https://upscgurukul.online","https://www.upscgurukul.online","https://pratyushswain.in","https://www.pratyushswain.in","https://pratyushswain01.github.io"]);
let keyCache=null,keyExpiry=0;
function response(data,status=200,origin=""){
 const h={"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","Vary":"Origin"};
 if(ALLOWED_ORIGINS.has(origin)){h["Access-Control-Allow-Origin"]=origin;h["Access-Control-Allow-Methods"]="GET, OPTIONS";h["Access-Control-Allow-Headers"]="Authorization, Content-Type";h["Access-Control-Max-Age"]="86400";}
 return new Response(JSON.stringify(data),{status,headers:h});
}
function b64(s){s=s.replace(/-/g,"+").replace(/_/g,"/");s+="=".repeat((4-s.length%4)%4);return Uint8Array.from(atob(s),c=>c.charCodeAt(0));}
function decode(s){return JSON.parse(new TextDecoder().decode(b64(s)));}
async function getKeys(){
 if(keyCache&&Date.now()<keyExpiry)return keyCache;
 const r=await fetch(JWKS_URL,{cf:{cacheTtl:3600,cacheEverything:true}});
 if(!r.ok)throw Error("Firebase signing keys unavailable");
 keyCache=(await r.json()).keys||[];keyExpiry=Date.now()+3600000;return keyCache;
}
async function verifyAdmin(request){
 const auth=request.headers.get("Authorization")||"";
 if(!auth.startsWith("Bearer "))throw Error("Authentication required");
 const p=auth.slice(7).split(".");
 if(p.length!==3)throw Error("Invalid token");
 const h=decode(p[0]),c=decode(p[1]),now=Math.floor(Date.now()/1000);
 if(h.alg!=="RS256"||!h.kid||c.aud!==PROJECT_ID||c.iss!==ISSUER||typeof c.sub!=="string"||!c.sub||!Number.isFinite(c.exp)||c.exp<=now||!Number.isFinite(c.iat)||c.iat>now+60||!Number.isFinite(c.auth_time)||c.auth_time>now+60)throw Error("Invalid or expired authentication token");
 if(!ADMIN_UIDS.has(c.sub))throw Error("Admin access required");
 let jwk=(await getKeys()).find(k=>k.kid===h.kid);
 if(!jwk){keyCache=null;jwk=(await getKeys()).find(k=>k.kid===h.kid);}
 if(!jwk)throw Error("Unknown Firebase signing key");
 const key=await crypto.subtle.importKey("jwk",jwk,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
 if(!await crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,b64(p[2]),new TextEncoder().encode(p[0]+"."+p[1])))throw Error("Invalid authentication signature");
 return c.sub;
}
function istDate(ms){const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(ms));const o=Object.fromEntries(parts.map(x=>[x.type,x.value]));return o.year+"-"+o.month+"-"+o.day;}

let googleTokenCache=null,googleTokenExpiry=0;
function pemBytes(pem){const b=pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\\s/g,"");return Uint8Array.from(atob(b),c=>c.charCodeAt(0));}
function b64url(bytes){let s="";for(const b of new Uint8Array(bytes))s+=String.fromCharCode(b);return btoa(s).replace(/=/g,"").replace(/\\+/g,"-").replace(/\\//g,"_");}
async function getGoogleAccessToken(env){
 if(googleTokenCache&&Date.now()<googleTokenExpiry-60000)return googleTokenCache;
 if(!env.FIREBASE_SERVICE_ACCOUNT_JSON)throw Error("Student names are not configured yet. Add FIREBASE_SERVICE_ACCOUNT_JSON to this Worker.");
 const sa=JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
 if(!sa.client_email||!sa.private_key)throw Error("Firebase service account secret is invalid");
 const now=Math.floor(Date.now()/1000),header=b64url(new TextEncoder().encode(JSON.stringify({alg:"RS256",typ:"JWT"})));
 const claim=b64url(new TextEncoder().encode(JSON.stringify({iss:sa.client_email,scope:"https://www.googleapis.com/auth/datastore",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600})));
 const unsigned=header+"."+claim;
 const key=await crypto.subtle.importKey("pkcs8",pemBytes(sa.private_key),{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["sign"]);
 const sig=await crypto.subtle.sign("RSASSA-PKCS1-v1_5",key,new TextEncoder().encode(unsigned));
 const assertion=unsigned+"."+b64url(sig);
 const form=new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion});
 const r=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:form});
 const data=await r.json();if(!r.ok||!data.access_token)throw Error("Could not authenticate the Firebase service account");
 googleTokenCache=data.access_token;googleTokenExpiry=Date.now()+Number(data.expires_in||3600)*1000;return googleTokenCache;
}
async function attachStudentNames(users,env){
 const token=await getGoogleAccessToken(env),base="https://firestore.googleapis.com/v1/projects/"+PROJECT_ID+"/databases/(default)/documents/artifacts/default-app-id/users/";
 let cursor=0;
 await Promise.all(Array.from({length:Math.min(8,users.length)},async()=>{
  while(cursor<users.length){
   const user=users[cursor++];
   try{
    const r=await fetch(base+encodeURIComponent(user.uid),{headers:{Authorization:"Bearer "+token}});
    if(!r.ok){user.display_name="";continue;}
    const doc=await r.json(),f=doc.fields||{};
    user.display_name=f.displayName?.stringValue||f.name?.stringValue||"";
   }catch{user.display_name="";}
  }
 }));
}

export default {async fetch(request,env){
 const origin=request.headers.get("Origin")||"";
 if(request.method==="OPTIONS")return ALLOWED_ORIGINS.has(origin)?new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Allow-Headers":"Authorization, Content-Type","Access-Control-Max-Age":"86400","Vary":"Origin"}}):new Response(null,{status:403});
 const url=new URL(request.url);
 if(request.method==="GET"&&url.pathname==="/health")return response({ok:true,service:"gurukul-discipline-admin"},200,origin);
 if(request.method!=="GET"||url.pathname!=="/api/admin/discipline")return response({error:"Not found"},404,origin);
 if(!ALLOWED_ORIGINS.has(origin))return response({error:"Origin not allowed"},403);
 try{
  const adminUid=await verifyAdmin(request),today=istDate(Date.now());
  const q=await env.DB.prepare(`
   WITH all_uids AS (
    SELECT uid FROM activity_daily
    UNION SELECT uid FROM discipline_state
    UNION SELECT uid FROM activity_sessions
   ),
   daily AS (
    SELECT uid,
      SUM(CASE WHEN activity_date=? THEN seconds ELSE 0 END) AS today_seconds,
      SUM(CASE WHEN activity_date>=date(?, '-6 days') AND activity_date<=? THEN seconds ELSE 0 END) AS week_seconds,
      MAX(activity_date) AS last_activity_date
    FROM activity_daily GROUP BY uid
   ),
   sessions AS (
    SELECT uid,COUNT(*) AS session_count,MAX(started_at) AS last_session_at
    FROM activity_sessions GROUP BY uid
   )
   SELECT u.uid,
     COALESCE(d.today_seconds,0) AS today_seconds,
     COALESCE(d.week_seconds,0) AS week_seconds,
     d.last_activity_date,
     COALESCE(s.session_count,0) AS session_count,
     s.last_session_at,
     COALESCE(ds.restricted,0) AS restricted,
     COALESCE(ds.recovery_seconds,0) AS recovery_seconds,
     ds.last_evaluated_date,
     ds.restricted_since,
     ds.grace_used_at,
     (SELECT COUNT(*) FROM discipline_grace_events ge WHERE ge.uid=u.uid AND ge.created_at>=?) AS grace_events_30d
   FROM all_uids u
   LEFT JOIN daily d ON d.uid=u.uid
   LEFT JOIN sessions s ON s.uid=u.uid
   LEFT JOIN discipline_state ds ON ds.uid=u.uid
   ORDER BY restricted DESC, today_seconds ASC, last_session_at DESC
   LIMIT 500
  `).bind(today,today,today,Date.now()-30*86400000).all();
  const users=(q.results||[]).map(x=>({...x,uid:String(x.uid),status:x.restricted?"restricted":(x.recovery_seconds>0&&x.recovery_seconds<7200?"recovery":"active"),display_name:""}));
  try{await attachStudentNames(users,env);}catch(nameError){console.warn("Student name lookup unavailable:",nameError?.message||nameError);}
  return response({ok:true,today,adminUid,totalUsers:users.length,restrictedUsers:users.filter(x=>x.restricted).length,recoveringUsers:users.filter(x=>x.status==="recovery").length,users},200,origin);
 }catch(e){const message=e?.message||"Admin service error";const code=/Authentication|token|signature|signing key/i.test(message)?401:/Admin access/i.test(message)?403:500;return response({error:message},code,origin);}
}};
