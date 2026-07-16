// festival/rath-yatra.js

function loadRathYatra() {
    const today = new Date().toDateString();

    // TEMPORARY: Comment out the line below if you want to test without having to clear Local Storage every time
    if (localStorage.getItem("rathYatraClosedDate") === today) return;

    const festiveHTML = `
<div id="rathFestiveWrapper" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 80; pointer-events: none; overflow: hidden;">

    <!-- Falling Flowers -->
    <div id="fallingFlowers" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>

    <!-- Top Banner -->
    <div id="rathBanner"
         class="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 via-red-600 to-amber-500 text-white py-2 shadow-xl pointer-events-auto z-[90]">
        <div class="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="text-2xl">🚩</span>
                <div>
                    <h2 class="font-bold text-base md:text-lg leading-tight">Jai Jagannath!</h2>
                    <p class="text-xs opacity-90">Happy Rath Yatra • May Lord Jagannath bless your UPSC journey</p>
                </div>
            </div>
            <button onclick="closeRathYatra()" class="text-2xl hover:scale-110 transition">✕</button>
        </div>
    </div>

    <!-- CENTERED LORD JAGANNATH (Bigger, Middle of Screen) -->
    <div style="position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%); z-index: 40; pointer-events: none; text-align: center;">
        <img src="festival/images/jagannath-balabhadra-subhadra.png" 
             alt="Lord Jagannath" 
             style="width: 280px; max-width: 60vw; height: auto; border-radius: 16px; border: 4px solid white; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
    </div>

    <!-- FULL WIDTH RATH CHARIOT (Bottom of Screen) -->
    <div style="position: fixed; bottom: -2%; left: 0; width: 100vw; z-index: 30; pointer-events: none;">
        <img id="bigChariot" 
             src="festival/images/rath-chariot.png" 
             alt="Rath Yatra Chariot" 
             style="width: 100vw; max-width: 100%; height: auto; object-fit: contain; filter: drop-shadow(0 -10px 25px rgba(0,0,0,0.4));">
    </div>

</div>
`;

    const container = document.createElement("div");
    container.innerHTML = festiveHTML;
    document.body.appendChild(container.firstElementChild);

    pushDownHeader();
    startFallingFlowers();
    animateBigChariot();
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
        flower.style.fontSize = Math.random() * 10 + 16 + "px"; // Variable sizes
        flower.style.opacity = Math.random() * 0.5 + 0.5;
        flower.style.animation = `fall ${Math.random() * 3 + 6}s linear forwards`;

        container.appendChild(flower);

        setTimeout(() => {
            flower.remove();
        }, 10000);
    }, 500);
}

/* Rath Animation (Fast & Full Width Pan) */
function animateBigChariot() {
    const chariot = document.getElementById("bigChariot");

    if (chariot) {
        // Fast animation across the screen
        chariot.style.animation = "chariotMove 8s linear infinite";
    }

    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes fall {
        0% { transform: translateY(-30px) rotate(0deg); }
        100% { transform: translateY(110vh) rotate(720deg); }
    }

    @keyframes chariotMove {
        0% { transform: translateX(-120vw); }
        100% { transform: translateX(120vw); }
    }
    `;
    document.head.appendChild(style);
}

/* Close Banner */
window.closeRathYatra = function() {
    localStorage.setItem("rathYatraClosedDate", new Date().toDateString());

    const header = document.querySelector("header");
    if (header) {
        header.style.top = "0";
    }
    document.getElementById("rathFestiveWrapper")?.remove();
}

window.addEventListener("load", loadRathYatra);
