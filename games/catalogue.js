/* Subjects and chapters. Add a chapter by adding its title to a list. Chapters with no content show "Questions are being added". */
(function(){
var SUBJ=[
{id:'polity',t:'Indian Polity',src:'Constitution of India (text) and landmark judgments',ch:['Historical Background','Preamble','Fundamental Rights','Directive Principles of State Policy','Fundamental Duties','Basic Structure Doctrine','Emergency Provisions','Parliament','Supreme Court']},
{id:'geography',t:'Geography',src:'NCERT Geography textbooks; Survey of India',ch:['Physiographic Divisions of India','Indian Drainage Systems','Indian Climate','Soils']},
{id:'history',t:'History',src:'NCERT History textbooks',ch:['Indian National Movement','Mauryan Empire','Delhi Sultanate']},
{id:'economy',t:'Economy',src:'RBI and Economic Survey publications',ch:['Inflation','Monetary Policy','Government Budget']},
{id:'environment',t:'Environment',src:'UNEP and Ministry of Environment publications',ch:['Environmental Conventions','Protected Areas']},
{id:'csat',t:'CSAT',src:'Worked arithmetic (checked by calculation)',ch:['Percentages','Ratio and Proportion','Number Series','Time and Work','Time, Speed and Distance']}];
var KW={'fundamental-rights':'article 14 article 17 article 21 article 24 article 32 writs habeas corpus mandamus','preamble':'42nd amendment berubari kesavananda','basic-structure-doctrine':'kesavananda bharati basic structure','emergency-provisions':'article 352 article 356 article 360 president rule','indian-drainage-systems':'rivers indian rivers godavari narmada brahmaputra','physiographic-divisions-of-india':'himalaya peaks nanda devi anamudi western ghats','indian-national-movement':'congress lucknow pact gandhi','monetary-policy':'repo rate mpc rbi','environmental-conventions':'ramsar montreal paris agreement'};
KW['directive-principles-of-state-policy']='article 36 article 40 article 44 article 48 dpsp uniform civil code';KW['historical-background']='regulating act government of india act 1935 morley minto';
window.UG_CAT={SUBJ:SUBJ,KW:KW};
})();
