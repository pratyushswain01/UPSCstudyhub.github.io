/* UPSC Gurukul Games - app logic (views, game modes, progress). Content lives in ../data/ */
(function(){'use strict';
var $=function(s){return document.querySelector(s)};
function el(t,p){var n=document.createElement(t);if(p)for(var k in p){var v=p[k];if(v==null||v===false)continue;if(k==='c')n.className=v;else if(k==='t')n.textContent=v;else if(k==='on')for(var e in v)n.addEventListener(e,v[e]);else n.setAttribute(k,v===true?'':v)}for(var i=2;i<arguments.length;i++){var a=arguments[i];if(a==null||a===false)continue;if(Array.isArray(a))a.forEach(function(x){n.append(x)});else n.append(a)}return n}
function slug(s){return s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
/* data comes from ../data/*.js */
var SUBJ=window.UG_CAT.SUBJ,KW=window.UG_CAT.KW,B=window.UG_BANK,ACT=window.UG_ACT,PAIRS=ACT.PAIRS;
var CH=[];SUBJ.forEach(function(s){s.ch.forEach(function(t){CH.push({id:slug(t),t:t,s:s})})});
function chap(id){return CH.filter(function(c){return c.id===id})[0]}
/* ---- storage ---- */
var K='ug.games.v1',mem=null,P;
try{P=JSON.parse(localStorage.getItem(K))}catch(e){P=null}P=P||{};['h','d','miss','bm'].forEach(function(k){P[k]=P[k]||{}});P.s=P.s||[];P.days=P.days||[];
function save(){mem=P;try{localStorage.setItem(K,JSON.stringify(P))}catch(e){}}
function qs(id){return B.filter(function(q){return q.c===id})}
/* mastery: per question, 0, .5 or 1 for 0/1/2 latest correct answers; mastered needs 80%+ and every question tried twice */
function mastery(id){var l=qs(id);if(!l.length)return null;var sum=0,twice=true,tried=0;l.forEach(function(q){var h=P.h[q.id]||[];if(h.length)tried++;if(h.length<2)twice=false;var k=0;for(var i=h.length-1;i>=0&&h[i]&&k<2;i--)k++;sum+=k/2});var p=sum/l.length;return{pct:Math.round(p*100),tried:tried,n:l.length,done:twice&&p>=.8}}
function has(id){return qs(id).length||PAIRS[id]||ACT.TF[id]||ACT.ORDER[id]||ACT.SORT[id]}
function status(id){if(!has(id))return['soon','Questions are being added'];var m=mastery(id);if(m&&m.done)return['m','Mastered'];if(m&&m.tried)return['s','In progress ('+m.tried+'/'+m.n+' tried)'];return P.s.some(function(s){return s.c===id})?['s','Played']:['n','Not played']}
function today(){return new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'})}
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){var a=seed;return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuf(a,r){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor((r||Math.random)()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var G=null,T=null,app=$('#app'),filt={q:'',s:''};
function stop(){clearInterval(T);T=null}
function route(){stop();G=null;var m=location.hash.match(/^#\/c\/(.+)$/);if(m&&chap(m[1]))chapter(m[1]);else home();window.scrollTo(0,0)}
/* ---- home ---- */
function home(){app.replaceChildren();
var d=today(),elig=CH.filter(function(c){return qs(c.id).length}),dc=elig[hash(d)%elig.length],dd=P.d[d];
var last=P.s.length&&chap(P.s[P.s.length-1].c);
app.append(el('h1',{t:'Learn chapter by chapter, through games'}),
el('p',{c:'muted',t:'Pick a subject and chapter, play, read the explanations, and revisit your mistakes.'}),
el('div',{c:'note',t:'Starter questions were written for this project and are marked "unreviewed". Check each against its source before relying on it. Progress is saved only in this browser.'}),
el('div',{c:'card'},el('b',{t:'Daily challenge - '+d+' (India time)'}),el('p',{c:'muted',t:dc.s.t+' / '+dc.t+' - 5 questions, about 3 minutes'}),dd?el('p',{t:'Done today: '+dd.s+' / '+dd.t+'. Replay it in practice below.'}):null,el('button',{c:'btn pri',type:'button',on:{click:function(){start(dc.id,'daily')}},t:dd?'Replay daily':'Play daily challenge'})),
last?el('p',null,'Continue: ',el('a',{href:'#/c/'+last.id,t:last.t})):null);
var inp=el('input',{type:'search',placeholder:'Search chapters, e.g. Article 32 or Indian rivers','aria-label':'Search chapters',value:filt.q}),box=el('div');
inp.addEventListener('input',function(){filt.q=inp.value;list(box)});
var chips=el('div',{c:'row',style:'margin:12px 0'},chip('All',''));SUBJ.forEach(function(s){chips.append(chip(s.t,s.id))});
function chip(t,v){return el('button',{c:'chip'+(filt.s===v?' on':''),type:'button',on:{click:function(){filt.s=v;home()}},t:t})}
app.append(el('div',{style:'margin-top:18px'},inp),chips,box);list(box);
var bm=CH.filter(function(c){return P.bm[c.id]});if(bm.length)app.append(el('h2',{t:'Bookmarked'}),el('div',{c:'row'},bm.map(function(c){return el('a',{c:'chip',href:'#/c/'+c.id,t:c.t})})));
app.append(el('h2',{t:'Achievements'}),el('div',{c:'row'},badges().map(function(b){return el('span',{c:'tag '+(b[1]?'m':''),title:b[2],t:(b[1]?'Earned: ':'Locked: ')+b[0]})})))}
function list(box){var q=filt.q.trim().toLowerCase(),r=CH.filter(function(c){return(!filt.s||c.s.id===filt.s)&&(!q||(c.t+' '+c.s.t+' '+(KW[c.id]||'')).toLowerCase().indexOf(q)>-1)});
box.replaceChildren(r.length?el('div',{c:'grid'},r.map(function(c){var st=status(c.id),m=mastery(c.id);return el('a',{c:'card',href:'#/c/'+c.id},el('span',{c:'tag '+st[0],t:st[1]}),el('h3',{style:'margin-top:8px;font-size:1.05rem',t:c.t}),el('div',{c:'muted',t:c.s.t}),m?el('div',{c:'bar'},el('i',{style:'width:'+m.pct+'%'})):null)})):el('p',{c:'muted',t:'No chapters match "'+filt.q+'".'}))}
function badges(){var md={};P.s.forEach(function(s){md[s.mode]=1});var tr=0,csat=0,ch=0,mast=0,win=false;P.s.forEach(function(s){if(s.t>=3&&s.s/s.t>=.8)win=true});
CH.forEach(function(c){var l=qs(c.id);if(l.some(function(q){return(P.h[q.id]||[]).length}))ch++;var m=mastery(c.id);if(m&&m.done)mast++;if(c.s.id==='csat')l.forEach(function(q){var h=P.h[q.id]||[];if(h[h.length-1])csat++})});
return[['First Victory',win,'Score 80% or more in a session of 3+ questions'],['Chapter Explorer',ch>=5,'Play 5 different chapters'],['Seven Days of Learning',P.days.length>=7,'Play on 7 different days'],['CSAT Challenger',csat>=5,'Answer 5 CSAT questions correctly'],['Game Hopper',Object.keys(md).length>=5,'Play 5 different game types'],['Chapter Mastered',mast>=1,'Master a chapter (80%+ and every question answered twice)']]}
/* ---- chapter dashboard ---- */
function chapter(id){app.replaceChildren();var c=chap(id),l=qs(id),m=mastery(id),st=status(id),miss=(P.miss[id]||[]).length,best=0,bt=[];
P.s.forEach(function(s){if(s.c===id&&s.mode!=='daily'&&s.t)best=Math.max(best,Math.round(100*s.s/s.t))});
var dsel=el('select',{'aria-label':'Difficulty'},[['0','All levels'],['1','Beginner'],['2','Intermediate'],['3','Advanced']].map(function(o){return el('option',{value:o[0],t:o[1]})}));
function gb(t,mode,pri,dis){return el('button',{c:'btn'+(pri?' pri':''),type:'button',disabled:dis,on:{click:function(){start(id,mode,+dsel.value)}},t:t})}
if(l.length){bt.push(dsel,gb('Practice (untimed)','practice',1),gb('Timed (30 s each)','timed'));if(l.length>=4)bt.push(gb('Boss challenge (3 lives)','boss'));if(l.some(function(q){return q.k==='fill'}))bt.push(gb('Fill in the blanks','fill'))}
if(ACT.SORT[id])bt.push(gb('Sort into groups','sort'));if(ACT.TF[id])bt.push(gb('Rapid true/false (60 s)','tf'));if(ACT.ORDER[id])bt.push(gb('Chronology ordering','order'));
if(PAIRS[id])bt.push(gb('Match the pairs','pairs'),gb('Memory cards','memory'));if(l.length)bt.push(gb('Review mistakes ('+miss+')','mistakes',0,!miss));
app.append(el('a',{href:'#/',t:'< All chapters'}),el('h1',{style:'margin-top:8px',t:c.t}),el('p',{c:'muted',t:c.s.t+' - Source: '+c.s.src}),
el('div',{c:'row'},el('span',{c:'tag '+st[0],t:st[1]}),el('button',{c:'chip',type:'button',on:{click:function(){P.bm[id]=!P.bm[id];if(!P.bm[id])delete P.bm[id];save();chapter(id)}},t:P.bm[id]?'Bookmarked':'Bookmark'})),
has(id)?el('div',null,m?el('div',{c:'card',style:'margin-top:14px'},el('b',{t:'Progress'}),el('p',{c:'muted',t:m.pct+'% mastery - '+m.tried+' of '+m.n+' questions tried - best session '+best+'% - '+miss+' to review'}),el('div',{c:'bar'},el('i',{style:'width:'+m.pct+'%'})),el('p',{c:'muted',t:'Mastery counts only questions answered correctly in their latest two attempts. A chapter is mastered at 80%+ with every question answered at least twice. Other games add practice but not mastery.'})):null,el('h2',{t:'Choose a game'}),el('div',{c:'row'},bt)):el('div',{c:'note',t:'Questions are being added for this chapter. It cannot be played yet.'}))}
/* ---- game ---- */
function start(id,mode,diff){var l;stop();
var simple={pairs:pairs,memory:memory,order:order,tf:tf};
if(simple[mode]){G={id:id,mode:mode};return simple[mode]()}
if(mode==='daily'){var r=rng(hash(today()));l=shuf(qs(id),r).slice(0,5)}
else if(mode==='mistakes'){var ids=P.miss[id]||[];l=qs(id).filter(function(q){return ids.indexOf(q.id)>-1})}
else if(mode==='sort'){var S0=ACT.SORT[id];l=shuf(S0.items.map(function(x,i){return{id:'sort-'+id+'-'+i,c:id,k:'sort',d:2,q:'Which group? '+x[0],o:S0.buckets,a:x[1],e:x[2]||'',f:false}}))}
else if(mode==='fill'){l=shuf(qs(id).filter(function(q){return q.k==='fill'}))}
else if(mode==='boss'){l=shuf(qs(id)).sort(function(a,b){return a.d-b.d})}
else{l=qs(id).filter(function(q){return!diff||q.d===diff});if(!l.length){alert('No questions at this level yet. Showing all levels.');l=qs(id)}l=shuf(l)}
G={id:id,mode:mode,diff:diff,lives:3,list:l.map(function(q){var p=q.o.map(function(_,i){return i});return{q:q,perm:q.f?shuf(p):p}}),i:0,right:0,log:[]};play()}
function play(){stop();app.replaceChildren();var g=G;if(g.i>=g.list.length)return done(g.log,g.right,g.list.length);
var it=g.list[g.i],q=it.q,fb=el('div'),nx=el('button',{c:'btn pri',type:'button',style:'margin-top:12px',hidden:true,t:g.i+1<g.list.length?'Next question':'See results'}),btns=[],tm=el('span',{c:'muted'});
function answer(oi){if(it.done)return;it.done=true;stop();var ok=oi===q.a;if(ok)g.right++;else if(g.mode==='boss')g.lives--;g.log.push({q:q,ok:ok,pick:oi});
btns.forEach(function(b,j){b.disabled=true;if(it.perm[j]===q.a)b.classList.add('ok');else if(it.perm[j]===oi)b.classList.add('no')});
fb.replaceChildren(el('div',{c:'fb'},el('b',{t:oi<0?'Time up. ':ok?'Correct. ':'Not quite. '}),q.e));if(g.mode==='boss'){tm.textContent='Lives: '+g.lives;if(g.lives<=0)nx.textContent='See results'}nx.hidden=false;nx.focus()}
it.perm.forEach(function(oi,j){var b=el('button',{c:'opt',type:'button',on:{click:function(){answer(oi)}}},(j+1)+'. '+q.o[oi]);btns.push(b)});
nx.addEventListener('click',function(){if(g.mode==='boss'&&g.lives<=0)return done(g.log,g.right,g.log.length);g.i++;play()});
app.append(el('a',{href:'#/c/'+g.id,t:'< Quit'}),el('div',{c:'row',style:'justify-content:space-between;margin-top:8px'},el('span',{c:'muted',t:chap(g.id).t+' - question '+(g.i+1)+' of '+g.list.length}),tm),
el('div',{c:'card',style:'margin-top:10px'},el('h3',{style:'font-size:1.15rem',t:q.q}),btns,fb,nx,el('p',{c:'muted',style:'margin:12px 0 0',t:'Unreviewed - check against the source. Keys 1-4 select an option.'})));
if(g.mode==='boss')tm.textContent='Lives: '+g.lives;
if(g.mode==='timed'){var left=30;tm.textContent='30 s';T=setInterval(function(){left--;tm.textContent=left+' s';if(left<=0)answer(-1)},1000)}}
function pairs(){app.replaceChildren();var id=G.id,P0=PAIRS[id],sel=-1,done=0,wrong=0,L=P0.map(function(p,i){return[i,p[0]]}),R=shuf(P0.map(function(p,i){return[i,p[1]]})),lb=[],rb=[],msg=el('p',{c:'muted',t:'Tap an item on the left, then its match on the right.'});
function pick(side,i,b){if(b.disabled)return;if(side==='l'){sel=i;lb.forEach(function(x){x.classList.remove('sel')});b.classList.add('sel');return}if(sel<0){msg.textContent='Choose a left item first.';return}
if(sel===i){done++;b.disabled=true;b.classList.add('ok');lb.forEach(function(x){if(x.classList.contains('sel')){x.disabled=true;x.classList.remove('sel');x.classList.add('ok')}});sel=-1;msg.textContent=done+' of '+P0.length+' matched.';if(done===P0.length){var s=Math.max(0,P0.length-wrong);G.mode='pairs';return done_(s,P0.length,wrong)}}
else{wrong++;b.classList.add('no');setTimeout(function(){b.classList.remove('no')},500);msg.textContent='Not a match. Mistakes: '+wrong}}
function done_(s,t,w){done_.w=w;finish([{q:{id:id+'-pairs',c:id,q:'Match the pairs',e:'Matched with '+w+' mistake(s).'},ok:w===0}],s,t,'pairs')}
L.forEach(function(x){lb.push(el('button',{c:'opt',type:'button',on:{click:function(e){pick('l',x[0],e.currentTarget)}}},x[1]))});
R.forEach(function(x){rb.push(el('button',{c:'opt',type:'button',on:{click:function(e){pick('r',x[0],e.currentTarget)}}},x[1]))});
app.append(el('a',{href:'#/c/'+id,t:'< Quit'}),el('h2',{t:'Match the pairs - '+chap(id).t}),msg,el('div',{c:'pg'},el('div',null,lb),el('div',null,rb)))}
function flash(b,cls){b.classList.add(cls);setTimeout(function(){b.classList.remove(cls)},500)}
function order(){app.replaceChildren();var id=G.id,O=ACT.ORDER[id],n=O.items.length,next=0,wrong=0,bs=[],msg=el('p',{c:'muted',t:'Tap the events from earliest to latest.'});
shuf(O.items.map(function(_,i){return i})).forEach(function(i){var b=el('button',{c:'opt',type:'button'},O.items[i][0]);b.addEventListener('click',function(){if(b.disabled)return;
if(i===next){b.disabled=true;b.classList.add('ok');b.textContent=(next+1)+'. '+O.items[i][0]+' ('+O.items[i][1]+')';next++;msg.textContent=next+' of '+n+' placed. Mistakes: '+wrong;
if(next===n)finish([{q:{id:id+'-order',c:id,q:O.title,e:'Placed with '+wrong+' mistake(s).'},ok:wrong===0}],Math.max(0,n-wrong),n,'order')}
else{wrong++;flash(b,'no');msg.textContent='Not the next one. Mistakes: '+wrong}});bs.push(b)});
app.append(el('a',{href:'#/c/'+id,t:'< Quit'}),el('h2',{t:O.title}),msg,el('div',{c:'mg'},bs))}
function memory(){app.replaceChildren();var id=G.id,P0=PAIRS[id].slice(0,6),n=P0.length,cards=[],open=[],moves=0,found=0,lock=false,bs=[],msg=el('p',{c:'muted',t:'Flip two cards to find each matching pair. Moves: 0'});
P0.forEach(function(p,i){cards.push([i,p[0]],[i,p[1]])});cards=shuf(cards);
cards.forEach(function(cd,k){var b=el('button',{c:'opt',type:'button','aria-label':'Card '+(k+1)},'?');b.addEventListener('click',function(){if(lock||b.disabled||open.indexOf(k)>-1)return;b.textContent=cd[1];b.classList.add('sel');open.push(k);
if(open.length===2){moves++;msg.textContent='Moves: '+moves;var a=open[0],c2=open[1];
if(cards[a][0]===cards[c2][0]){[a,c2].forEach(function(x){bs[x].classList.remove('sel');bs[x].classList.add('ok');bs[x].disabled=true});open=[];found++;
if(found===n)finish([{q:{id:id+'-memory',c:id,q:'Memory cards',e:'Finished in '+moves+' moves (the minimum is '+n+').'},ok:moves<=n+3}],n,moves,'memory')}
else{lock=true;setTimeout(function(){[a,c2].forEach(function(x){bs[x].classList.remove('sel');bs[x].textContent='?'});open=[];lock=false},900)}}});bs.push(b)});
app.append(el('a',{href:'#/c/'+id,t:'< Quit'}),el('h2',{t:'Memory cards - '+chap(id).t}),msg,el('div',{c:'mg'},bs))}
function tf(){app.replaceChildren();var id=G.id,items=shuf(ACT.TF[id]),i=0,right=0,log=[],left=60,streak=0,box=el('div',{c:'card',style:'margin-top:10px'}),hud=el('div',{c:'row',style:'justify-content:space-between'}),over=false;
function end(){if(over)return;over=true;stop();finish(log,right,log.length,'tf')}
function show(){if(i>=items.length)return end();var it=items[i];box.replaceChildren(el('div',null,el('h3',{style:'font-size:1.15rem',t:it[0]}),[true,false].map(function(v){var b=el('button',{c:'opt',type:'button',on:{click:function(){if(over||b.disabled)return;var ok=v===it[1];if(ok){right++;streak++}else streak=0;
log.push({q:{id:'tf-'+id+'-'+i,c:id,q:it[0],o:['True','False'],a:it[1]?0:1,e:it[2]},ok:ok});Array.prototype.forEach.call(box.querySelectorAll('.opt'),function(x){x.disabled=true});b.classList.add(ok?'ok':'no');hud.firstChild.textContent='Score '+right+'/'+log.length+' - streak '+streak;i++;setTimeout(show,700)}}},(v?'1. True':'2. False'));return b})))}
hud.append(el('span',{c:'muted',t:'Score 0/0 - streak 0'}),el('b',{t:'60 s'}));
app.append(el('a',{href:'#/c/'+id,t:'< Quit'}),el('h2',{t:'Rapid true/false - '+chap(id).t}),hud,box);show();
T=setInterval(function(){left--;hud.lastChild.textContent=left+' s';if(left<=0)end()},1000)}
function done(log,right,total){finish(log,right,total,G.mode)}
function finish(log,right,total,mode){stop();var id=G.id,d=today(),g=G;
log.forEach(function(x){var h=P.h[x.q.id]=P.h[x.q.id]||[];h.push(!!x.ok);if(h.length>10)h.shift();var m=P.miss[id]=P.miss[id]||[],k=m.indexOf(x.q.id);if(!x.ok&&k<0&&B.some(function(b){return b.id===x.q.id}))m.push(x.q.id);if(x.ok&&k>-1)m.splice(k,1)});
P.s.push({c:id,mode:mode,s:right,t:total,d:d});if(P.s.length>200)P.s.shift();if(P.days.indexOf(d)<0)P.days.push(d);if(mode==='daily'&&!P.d[d])P.d[d]={c:id,s:right,t:total};save();
app.replaceChildren();var wrong=log.filter(function(x){return!x.ok&&x.q.o});
app.append(el('h1',{t:'Results'}),el('div',{c:'big',t:right+' / '+total}),el('p',{c:'muted',t:chap(id).t+' - '+mode+' - this is a practice score, not a mastery claim.'}),
mode==='boss'?el('p',{t:(g&&g.list&&right===g.list.length)?'Boss defeated! Every question cleared.':'Boss round over. Read the explanations and try again.'}):null,el('div',{c:'row'},el('button',{c:'btn pri',type:'button',on:{click:function(){start(id,mode==='daily'?'practice':mode,g.diff)}},t:'Replay'}),(P.miss[id]||[]).length&&mode!=='mistakes'?el('button',{c:'btn',type:'button',on:{click:function(){start(id,'mistakes')}},t:'Review mistakes'}):null,el('a',{c:'btn',href:'#/c/'+id,style:'text-decoration:none',t:'Chapter dashboard'})),
wrong.length?el('h2',{t:'What to revisit'}):null,wrong.map(function(x){return el('div',{c:'card',style:'margin-top:10px'},el('b',{t:x.q.q}),el('p',{c:'muted',t:'Answer: '+x.q.o[x.q.a]}),el('p',{style:'margin:0',t:x.q.e}))}));G=null}
document.addEventListener('keydown',function(e){if(!G||['pairs','memory','order'].indexOf(G.mode)>-1||e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;var n=+e.key;if(n>=1&&n<=4){var b=document.querySelectorAll('.opt')[n-1];if(b&&!b.disabled)b.click()}});
$('#th').addEventListener('click',function(){var r=document.documentElement,d=r.getAttribute('data-theme')==='dark'?'light':'dark';r.setAttribute('data-theme',d);try{localStorage.setItem('ug-theme',d)}catch(e){}});
window.addEventListener('hashchange',route);route();
})();
