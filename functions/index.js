const {setGlobalOptions} = require("firebase-functions");
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

setGlobalOptions({maxInstances:10});
if (!admin.apps.length) admin.initializeApp();
const db=admin.firestore();
const Timestamp=admin.firestore.Timestamp;

function indiaDateKey(date=new Date()){
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(date);
  const v=Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return v.year+"-"+v.month+"-"+v.day;
}
function previousDateKey(daysAgo){
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
  const v=Object.fromEntries(parts.map(p=>[p.type,Number(p.value)]));
  return new Date(Date.UTC(v.year,v.month-1,v.day-daysAgo,12)).toISOString().slice(0,10);
}

exports.gurukulActivity=onCall({region:"asia-south1",maxInstances:10},async request=>{
  const uid=request.auth&&request.auth.uid;
  if(!uid)throw new HttpsError("unauthenticated","Please sign in to view your activity.");
  const data=request.data||{}, action=String(data.action||"");
  if(action==="summary"){
    const today=indiaDateKey(), dates=Array.from({length:7},(_,i)=>previousDateKey(i));
    const [dailyDocs,profileSnap,todaySnap]=await Promise.all([
      Promise.all(dates.map(date=>db.collection("gurukulActivityDaily").doc(uid+"_"+date).get())),
      db.collection("gurukulActivityProfiles").doc(uid).get(),
      db.collection("gurukulActivityDaily").doc(uid+"_"+today).get()
    ]);
    const days=dailyDocs.map((snap,i)=>({
      date:dates[i],
      label:new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",weekday:"short"}).format(new Date(dates[i]+"T12:00:00+05:30")),
      seconds:snap.exists?Number(snap.get("seconds")||0):0
    })).reverse();
    const profile=profileSnap.exists?profileSnap.data():{};
    return {todaySeconds:todaySnap.exists?Number(todaySnap.get("seconds")||0):0,days,recentSessions:Array.isArray(profile.recentSessions)?profile.recentSessions.slice(0,8):[]};
  }
  const sessionId=String(data.sessionId||"");
  if(!/^[a-zA-Z0-9_-]{16,80}$/.test(sessionId))throw new HttpsError("invalid-argument","Invalid activity session.");
  if(!["start","heartbeat","end"].includes(action))throw new HttpsError("invalid-argument","Unsupported activity action.");
  const now=Timestamp.now(), nowMs=now.toMillis(), date=indiaDateKey(new Date(nowMs));
  const sessionRef=db.collection("gurukulActivitySessions").doc(uid+"_"+sessionId);
  const dayRef=db.collection("gurukulActivityDaily").doc(uid+"_"+date);
  const profileRef=db.collection("gurukulActivityProfiles").doc(uid);
  const pagePath=String(data.pagePath||"/").slice(0,240), pageTitle=String(data.pageTitle||"UPSC Gurukul").slice(0,120);
  return db.runTransaction(async tx=>{
    const [sessionSnap,daySnap,profileSnap]=await Promise.all([tx.get(sessionRef),tx.get(dayRef),tx.get(profileRef)]);
    const daySeconds=daySnap.exists?Number(daySnap.get("seconds")||0):0;
    const daySessions=daySnap.exists?Number(daySnap.get("sessions")||0):0;
    if(action==="start"){
      if(sessionSnap.exists)throw new HttpsError("already-exists","This session already exists.");
      tx.create(sessionRef,{uid,sessionId,pagePath,pageTitle,startedAt:now,lastHeartbeatAt:now,endedAt:null,totalSeconds:0});
      tx.set(dayRef,{uid,date,seconds:daySeconds,sessions:daySessions+1,updatedAt:now},{merge:true});
      const profile=profileSnap.exists?profileSnap.data():{};
      const recent=Array.isArray(profile.recentSessions)?profile.recentSessions:[];
      const entry={sessionId,title:pageTitle,pagePath,startedAt:now.toDate().toISOString(),durationSeconds:null};
      tx.set(profileRef,{recentSessions:[entry,...recent.filter(x=>x.sessionId!==sessionId)].slice(0,8),updatedAt:now},{merge:true});
      return {todaySeconds:daySeconds,sessionSeconds:0,sessionClosed:false};
    }
    if(!sessionSnap.exists)throw new HttpsError("not-found","Activity session was not found.");
    const session=sessionSnap.data();
    if(session.uid!==uid)throw new HttpsError("permission-denied","This activity session does not belong to you.");
    if(session.endedAt)return {todaySeconds:daySeconds,sessionSeconds:Number(session.totalSeconds||0),sessionClosed:true};
    const lastMs=session.lastHeartbeatAt&&session.lastHeartbeatAt.toMillis?session.lastHeartbeatAt.toMillis():nowMs;
    const gap=Math.floor((nowMs-lastMs)/1000);
    const credited=gap>=20&&gap<=60?Math.min(gap,45):0;
    const total=Number(session.totalSeconds||0)+credited, closed=action==="end";
    tx.update(sessionRef,{lastHeartbeatAt:now,lastPagePath:pagePath,lastPageTitle:pageTitle,totalSeconds:total,...(closed?{endedAt:now}:{})});
    tx.set(dayRef,{uid,date,seconds:daySeconds+credited,sessions:daySessions,updatedAt:now},{merge:true});
    if(closed&&profileSnap.exists){
      const profile=profileSnap.data(),recent=Array.isArray(profile.recentSessions)?profile.recentSessions:[];
      tx.set(profileRef,{recentSessions:recent.map(item=>item.sessionId===sessionId?{...item,durationSeconds:total}:item),updatedAt:now},{merge:true});
    }
    return {todaySeconds:daySeconds+credited,sessionSeconds:total,sessionClosed:closed};
  });
});