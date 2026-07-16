// festival/rath-yatra.js

function loadRathYatra() {
    const today = new Date().toDateString();

    if (localStorage.getItem("rathYatraClosedDate") === today) return;

    const festiveHTML = `
<div id="rathFestiveWrapper"
     class="fixed inset-0 z-[80] pointer-events-none overflow-hidden">

    <!-- Falling Flowers -->
    <div id="fallingFlowers" class="absolute inset-0"></div>

    <!-- Top Banner -->
    <div id="rathBanner"
         class="fixed top-0 left-0 right-0
                bg-gradient-to-r
                from-orange-600
                via-red-600
                to-amber-500
                text-white
                py-2
                shadow-xl
                pointer-events-auto
                z-[90]">

        <div class="max-w-7xl mx-auto px-4
                    flex items-center justify-between">

            <div class="flex items-center gap-3">

                <span id="rathFlag" class="text-2xl inline-block origin-bottom-left">🚩</span>

                <div>
                    <h2 class="font-bold text-base md:text-lg leading-tight">
                        Jai Jagannath!
                    </h2>

                    <p class="text-xs opacity-90">
                        Happy Rath Yatra • May Lord Jagannath bless your UPSC journey
                    </p>
                </div>

            </div>

            <button
                onclick="closeRathYatra()"
                class="text-2xl hover:scale-110 transition">
                ✕
            </button>

        </div>

    </div>

    <!-- Running Rath (travels full width) -->
    <div id="chariotTrack" class="fixed bottom-16 left-0 w-full h-0 pointer-events-none">

        <div id="bigChariot" class="absolute bottom-0 left-0 will-change-transform">

            <img
                src="festival/images/rath-chariot.png"
                alt="Rath Yatra"
                class="w-32 md:w-40 lg:w-48 h-auto drop-shadow-2xl">

            <div id="chariotDust" class="absolute -inset-x-2 bottom-1 h-2"></div>

        </div>

    </div>

    <!-- Lord Jagannath, floating centered above the stages section -->
    <div id="jagannathWrap"
         class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">

        <div id="jagannathGlow"
             class="absolute inset-0 rounded-2xl blur-xl bg-amber-400/40"></div>

        <img
            id="jagannathImg"
            src="festival/images/jagannath-balabhadra-subhadra.png"
            alt="Jagannath"
            class="relative w-24 md:w-28 h-auto
                   rounded-2xl
                   border-2
                   border-white
                   shadow-2xl">

    </div>

</div>
`;

    const container = document.createElement("div");
    container.innerHTML = festiveHTML;

    document.body.appendChild(container.firstElementChild);

    pushDownHeader();
    startFallingFlowers();
    injectFestiveStyles();
    animateBigChariot();
    animateJagannath();
}

/* Push Header */

function pushDownHeader() {

    const header = document.querySelector("header");

    if (header) {

        header.style.transition = "top .35s ease";
        header.style.top = "48px";

    }

}

/* Falling Flowers */

function startFallingFlowers() {

    const container = document.getElementById("fallingFlowers");

    if (!container) return;

    const flowers = ["🌸","🌺","🌼","🪷","🌷"];

    setInterval(() => {

        const flower = document.createElement("div");

        flower.innerText =
            flowers[Math.floor(Math.random()*flowers.length)];

        flower.style.position="absolute";
        flower.style.left=Math.random()*100+"vw";
        flower.style.top="-40px";
        flower.style.fontSize=(Math.random()*10+14)+"px";
        flower.style.opacity=Math.random()*0.5+0.5;
        flower.style.animation=`fall ${Math.random()*4+7}s linear forwards`;

        container.appendChild(flower);

        setTimeout(()=>{
            flower.remove();
        },12000);

    },700);

}

/* Shared keyframes + one-time style injection */

function injectFestiveStyles(){

    const style=document.createElement("style");

    style.innerHTML=`

@keyframes fall{
    0%{ transform:translateY(-30px) rotate(0deg); }
    100%{ transform:translateY(110vh) rotate(720deg); }
}

@keyframes chariotRun{
    0%{   transform:translateX(-8vw)  scaleX(1)   translateY(0); }
    5%{   transform:translateX(-8vw)  scaleX(1)   translateY(-4px); }
    45%{  transform:translateX(94vw)  scaleX(1)   translateY(0); }
    50%{  transform:translateX(97vw)  scaleX(1)   translateY(-6px); }
    52%{  transform:translateX(97vw)  scaleX(-1)  translateY(-6px); }
    55%{  transform:translateX(94vw)  scaleX(-1)  translateY(0); }
    95%{  transform:translateX(-8vw)  scaleX(-1)  translateY(0); }
    98%{  transform:translateX(-8vw)  scaleX(-1)  translateY(-4px); }
    100%{ transform:translateX(-8vw)  scaleX(1)   translateY(0); }
}

@keyframes chariotBob{
    0%,100%{ transform:translateY(0); }
    50%{ transform:translateY(-5px); }
}

@keyframes jagannathFloat{
    0%,100%{ transform:translateY(0); }
    50%{ transform:translateY(-10px); }
}

@keyframes jagannathGlowPulse{
    0%,100%{ opacity:.35; transform:scale(1); }
    50%{ opacity:.6; transform:scale(1.08); }
}

@keyframes flagWave{
    0%,100%{ transform:rotate(-4deg); }
    50%{ transform:rotate(10deg); }
}

@keyframes dustPuff{
    0%{ opacity:.55; transform:translateX(0) scale(1); }
    100%{ opacity:0; transform:translateX(-40px) scale(1.6); }
}
`;

    document.head.appendChild(style);

}

/* Rath Animation */

function animateBigChariot(){

    const chariot=document.getElementById("bigChariot");
    const flag=document.getElementById("rathFlag");

    if(chariot){
        chariot.style.animation="chariotRun 16s ease-in-out infinite";
    }

    if(flag){
        flag.style.animation="flagWave 1.4s ease-in-out infinite";
    }

    startDustTrail();

}

/* Dust trail behind the chariot wheels */

function startDustTrail(){

    const dustHost=document.getElementById("chariotDust");

    if(!dustHost) return;

    setInterval(()=>{

        const puff=document.createElement("span");

        puff.style.position="absolute";
        puff.style.bottom="0";
        puff.style.left=Math.random()*20+"px";
        puff.style.width="6px";
        puff.style.height="6px";
        puff.style.borderRadius="50%";
        puff.style.background="rgba(180,150,110,0.6)";
        puff.style.animation="dustPuff .8s ease-out forwards";

        dustHost.appendChild(puff);

        setTimeout(()=>puff.remove(),900);

    },220);

}

/* Jagannath gentle float + glow */

function animateJagannath(){

    const img=document.getElementById("jagannathImg");
    const glow=document.getElementById("jagannathGlow");

    if(img){
        img.style.animation="jagannathFloat 3.2s ease-in-out infinite";
    }

    if(glow){
        glow.style.animation="jagannathGlowPulse 3.2s ease-in-out infinite";
    }

}

/* Close */

window.closeRathYatra=function(){

    localStorage.setItem(
        "rathYatraClosedDate",
        new Date().toDateString()
    );

    const header=document.querySelector("header");

    if(header){

        header.style.top="0";

    }

    document.getElementById("rathFestiveWrapper")?.remove();

}

window.addEventListener("load",loadRathYatra);
