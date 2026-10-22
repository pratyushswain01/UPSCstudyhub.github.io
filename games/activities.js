/* Other game content. Every item is unreviewed starter content: check it against its source. */
(function(){
var DP='directive-principles-of-state-policy';
var SORT={
'indian-drainage-systems':{buckets:['Bay of Bengal','Arabian Sea'],items:[['Godavari',0,'The Godavari drains into the Bay of Bengal.'],['Krishna',0,''],['Mahanadi',0,''],['Kaveri',0,''],['Narmada',1,'The Narmada flows west to the Arabian Sea.'],['Tapi',1,''],['Sabarmati',1,'It reaches the Gulf of Khambhat, an arm of the Arabian Sea.']]},
'fundamental-rights':{buckets:['Fundamental Right','Directive Principle'],items:[['Article 14',0,'Equality before law.'],['Article 21',0,'Life and personal liberty.'],['Article 32',0,'Constitutional remedies.'],['Article 40 (village panchayats)',1,'Article 40 is a Directive Principle.'],['Article 44 (uniform civil code)',1,'Article 44 is a Directive Principle.'],['Article 48 (agriculture and animal husbandry)',1,'Article 48 is a Directive Principle.']]},
'environmental-conventions':{buckets:['Ozone layer','Climate change'],items:[['Montreal Protocol',0,''],['Vienna Convention',0,'The 1985 Vienna Convention protects the ozone layer.'],['Kyoto Protocol',1,''],['Paris Agreement',1,'']]},
'physiographic-divisions-of-india':{buckets:['Himalaya','Western Ghats'],items:[['Nanda Devi',0,''],['Kangchenjunga',0,''],['Anamudi',1,'Anamudi is in the Anamalai Hills, Western Ghats.'],['Doddabetta',1,'Doddabetta is in the Nilgiri Hills, Western Ghats.']]}};
SORT[DP]=SORT['fundamental-rights'];
var ORDER={
'indian-national-movement':{title:'Order these events, earliest first',items:[['Partition of Bengal',1905],['Lucknow Pact',1916],['Jallianwala Bagh massacre',1919],['Dandi March',1930],['Quit India Movement',1942]]},
'historical-background':{title:'Order the constitutional milestones, earliest first',items:[['Regulating Act',1773],['Government of India Act (Crown rule)',1858],['Morley-Minto Reforms',1909],['Montagu-Chelmsford Reforms',1919],['Government of India Act',1935],['Constitution comes into force',1950]]},
'environmental-conventions':{title:'Order the agreements, earliest first',items:[['Ramsar Convention',1971],['Montreal Protocol',1987],['Kyoto Protocol',1997],['Paris Agreement',2015]]}};
var TF={
'fundamental-rights':[['Article 32 is the remedy for enforcing Fundamental Rights.',true,'Correct.'],['The Right to Property is a Fundamental Right.',false,'It became a legal right under Article 300A in 1978.'],['Article 21 applies only to citizens.',false,'It protects every person.'],['Habeas corpus concerns unlawful detention.',true,'Correct.']],
'preamble':[['The word "Secular" was in the original 1950 Preamble.',false,'The 42nd Amendment (1976) added it.'],['The Preamble begins "We, the people of India".',true,'Correct.'],['The Preamble can be enforced in court by itself.',false,'It is not enforceable on its own.']],
'emergency-provisions':[['Article 356 deals with Financial Emergency.',false,'Article 360 does; 356 is President\'s Rule.'],['National Emergency can be declared for armed rebellion.',true,'Correct (Article 352).']],
'indian-drainage-systems':[['The Narmada drains into the Bay of Bengal.',false,'It drains into the Arabian Sea.'],['The Godavari is the longest peninsular river.',true,'Correct.'],['The Yamuna joins the Ganga at Prayagraj.',true,'Correct.'],['The Brahmaputra is called Tsangpo in Tibet.',true,'Correct.']],
'physiographic-divisions-of-india':[['Nanda Devi lies entirely within India.',true,'Correct.'],['Anamudi is in the Eastern Ghats.',false,'It is in the Western Ghats.']],
'indian-national-movement':[['The INC was founded in 1885.',true,'Correct.'],['The Dandi March came before the Jallianwala Bagh massacre.',false,'Jallianwala Bagh was 1919, Dandi 1930.'],['The Quit India Movement began in 1942.',true,'Correct.']],
'historical-background':[['The Regulating Act was passed in 1858.',false,'It was passed in 1773.'],['The Government of India Act 1935 introduced provincial autonomy.',true,'Correct.']],
'monetary-policy':[['The MPC has six members.',true,'Correct.'],['The repo rate is what banks pay on public deposits.',false,'It is the RBI\'s short-term lending rate to banks.']],
'environmental-conventions':[['The Montreal Protocol targets ozone-depleting substances.',true,'Correct.'],['The Ramsar Convention is about forests.',false,'It is about wetlands.'],['The Paris Agreement was adopted in 2015.',true,'Correct.']],
'percentages':[['25% of 80 is 30.',false,'25% of 80 is 20.'],['The average of 10, 20 and 30 is 20.',true,'60 / 3 = 20.']]};
var PAIRS={
'indian-drainage-systems':[['Sabarmati','Ahmedabad'],['Musi','Hyderabad'],['Gomti','Lucknow'],['Tapi','Surat']],
'fundamental-rights':[['Article 14','Equality before law'],['Article 17','Abolition of untouchability'],['Article 21','Life and personal liberty'],['Article 32','Constitutional remedies']],
'emergency-provisions':[['Article 352','National Emergency'],['Article 356','President\'s Rule'],['Article 360','Financial Emergency']],
'indian-national-movement':[['Congress founded','1885'],['Lucknow Pact','1916'],['Gandhi-Irwin Pact','1931'],['Quit India','1942']],
'monetary-policy':[['Repo rate','RBI lends to banks'],['MPC','Six members'],['Inflation target','4% (+/- 2%)']],
'environmental-conventions':[['Ramsar','Wetlands'],['Montreal Protocol','Ozone layer'],['Paris Agreement','Climate change'],['CITES','Trade in endangered species']]};
window.UG_ACT={SORT:SORT,ORDER:ORDER,TF:TF,PAIRS:PAIRS};
})();
