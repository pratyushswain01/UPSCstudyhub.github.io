// festival/rath-yatra.js
// Self-contained: uses its own <style> block (NOT Tailwind utility classes)
// so it always renders correctly, even if your Tailwind build hasn't been
// rebuilt to include new class names used here. Safe on every refresh.

(function () {

    function loadRathYatra() {

        const today = new Date().toDateString();

        if (localStorage.getItem("rathYatraClosedDate") === today) return;

        // remove any stale leftover instance before adding a new one
        document.getElementById("rathFestiveWrapper")?.remove();
        document.getElementById("rathYatraStyles")?.remove();

        injectFestiveStyles();

        const festiveHTML = `
<div id="rathFestiveWrapper" class="rath-overlay">

    <!-- Falling Flowers -->
    <div id="fallingFlowers" class="rath-flowers"></div>

    <!-- Top Banner -->
    <div id="rathBanner" class="rath-banner">
        <div class="rath-banner-inner">
            <div class="rath-banner-left">
                <span id="rathFlag" class="rath-flag">🚩</span>
                <div>
                    <h2 class="rath-title">Jai Jagannath!</h2>
                    <p class="rath-sub">Happy Rath Yatra • May Lord Jagannath bless your UPSC journey</p>
                </div>
            </div>
            <button onclick="closeRathYatra()" class="rath-close" aria-label="Close">✕</button>
        </div>
    </div>

    <!-- Running Rath (travels the full width of the screen) -->
    <div id="chariotTrack" class="rath-chariot-track">
        <div id="bigChariot" class="rath-chariot">
            <img src="festival/images/rath-chariot.png" alt="Rath Yatra">
            <div id="chariotDust" class="rath-dust"></div>
        </div>
    </div>

    <!-- Lord Jagannath, floating centered above the page -->
    <div id="jagannathWrap" class="rath-jagannath-wrap">
        <div id="jagannathGlow" class="rath-jagannath-glow"></div>
        <img id="jagannathImg" class="rath-jagannath-img"
             src="festival/images/jagannath-balabhadra-subhadra.png"
             alt="Jagannath">
    </div>

</div>
`;

        const container = document.createElement("div");
        container.innerHTML = festiveHTML;

        document.body.appendChild(container.firstElementChild);

        pushDownHeader();
        startFallingFlowers();
        startDustTrail();

    }

    /* One-time scoped CSS. Plain CSS, no Tailwind dependency,
       so it cannot break due to purge/build/cache issues. */

    function injectFestiveStyles() {

        const style = document.createElement("style");
        style.id = "rathYatraStyles";

        style.innerHTML = `
.rath-overlay{position:fixed;inset:0;z-index:80;pointer-events:none;}
.rath-flowers{position:absolute;inset:0;overflow:hidden;}

.rath-banner{position:fixed;top:0;left:0;right:0;z-index:90;padding:8px 16px;
    color:#fff;background:linear-gradient(to right,#ea580c,#dc2626,#f59e0b);
    box-shadow:0 10px 25px rgba(0,0,0,.25);pointer-events:auto;}
.rath-banner-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;}
.rath-banner-left{display:flex;align-items:center;gap:12px;}
.rath-flag{font-size:24px;display:inline-block;transform-origin:bottom left;animation:flagWave 1.4s ease-in-out infinite;}
.rath-title{font-weight:700;font-size:16px;line-height:1.2;margin:0;}
.rath-sub{font-size:12px;opacity:.9;margin:2px 0 0;}
.rath-close{background:none;border:none;color:#fff;font-size:22px;line-height:1;cursor:pointer;
    transition:transform .15s ease;padding:0;}
.rath-close:hover{transform:scale(1.12);}

.rath-chariot-track{position:fixed;bottom:64px;left:0;width:100%;height:0;pointer-events:none;}
.rath-chariot{position:absolute;bottom:0;left:0;width:150px;will-change:transform;
    animation:chariotRun 10s linear infinite;}
.rath-chariot img{display:block;width:100%;height:auto;
    filter:drop-shadow(0 14px 20px rgba(0,0,0,.35));}
.rath-dust{position:absolute;left:-8px;right:-8px;bottom:4px;height:8px;}
@media(min-width:768px){.rath-chariot{width:190px;}}
@media(min-width:1024px){.rath-chariot{width:230px;}}

.rath-jagannath-wrap{position:fixed;top:64px;left:50%;transform:translateX(-50%);
    z-index:99999;pointer-events:none;}
.rath-jagannath-glow{position:absolute;inset:0;border-radius:16px;filter:blur(20px);
    background:rgba(251,191,36,.4);animation:jagannathGlowPulse 3.2s ease-in-out infinite;}
.rath-jagannath-img{position:relative;display:block;width:140px;height:auto;
    border-radius:16px;border:2px solid #fff;box-shadow:0 14px 30px rgba(0,0,0,.35);
    animation:jagannathFloat 3.2s ease-in-out infinite;}
@media(min-width:768px){.rath-jagannath-img{width:170px;}}

@keyframes fall{
    0%{ transform:translateY(-30px) rotate(0deg); }
    100%{ transform:translateY(110vh) rotate(720deg); }
}

@keyframes chariotRun{
    0%{   transform:translateX(-15vw) translateY(0); }
    5%{   transform:translateX(-12vw) translateY(-4px); }
    50%{  transform:translateX(45vw)  translateY(0); }
    95%{  transform:translateX(102vw) translateY(-4px); }
    100%{ transform:translateX(105vw) translateY(0); }
}

@keyframes jagannathFloat{
    0%,100%{ transform:translateY(0); }
    50%{ transform:translateY(10px); }
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

        const flowers = ["🌸", "🌺", "🌼", "🪷", "🌷"];

        setInterval(() => {

            const flower = document.createElement("div");

            flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];

            flower.style.position = "absolute";
            flower.style.left = Math.random() * 100 + "vw";
            flower.style.top = "-40px";
            flower.style.fontSize = (Math.random() * 10 + 14) + "px";
            flower.style.opacity = Math.random() * 0.5 + 0.5;
            flower.style.animation = `fall ${Math.random() * 4 + 7}s linear forwards`;

            container.appendChild(flower);

            setTimeout(() => { flower.remove(); }, 12000);

        }, 700);

    }

    /* Dust trail behind the chariot wheels */

    function startDustTrail() {

        const dustHost = document.getElementById("chariotDust");

        if (!dustHost) return;

        setInterval(() => {

            const puff = document.createElement("span");

            puff.style.position = "absolute";
            puff.style.bottom = "0";
            puff.style.left = Math.random() * 20 + "px";
            puff.style.width = "6px";
            puff.style.height = "6px";
            puff.style.borderRadius = "50%";
            puff.style.background = "rgba(180,150,110,0.6)";
            puff.style.animation = "dustPuff .8s ease-out forwards";

            dustHost.appendChild(puff);

            setTimeout(() => puff.remove(), 900);

        }, 220);

    }

    /* Close */

    window.closeRathYatra = function () {

        localStorage.setItem("rathYatraClosedDate", new Date().toDateString());

        const header = document.querySelector("header");

        if (header) header.style.top = "0";

        document.getElementById("rathFestiveWrapper")?.remove();
        document.getElementById("rathYatraStyles")?.remove();

    };

    window.addEventListener("load", loadRathYatra);

})();
