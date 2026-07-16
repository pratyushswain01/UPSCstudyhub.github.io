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

                <span class="text-2xl">🚩</span>

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

    <!-- Moving Rath (Larger and travels full screen) -->
    <div class="fixed bottom-12 left-0 z-30 pointer-events-none">

        <img
            id="bigChariot"
            src="festival/images/rath-chariot.png"
            alt="Rath Yatra"
            class="w-40 md:w-56 h-auto drop-shadow-xl">

    </div>

    <!-- Centered Lord Jagannath (Larger and positioned in the middle) -->
    <div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none">

        <img
            src="festival/images/jagannath-balabhadra-subhadra.png"
            alt="Jagannath"
            class="w-32 md:w-48 h-auto
                   rounded-xl
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

    const flowers = ["🌸","🌺","🌼","🪷","🌷"];

    setInterval(() => {
        const flower = document.createElement("div");

        flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];

        flower.style.position = "absolute";
        flower.style.left = Math.random() * 100 + "vw";
        flower.style.top = "-40px";
        flower.style.fontSize = "16px";
        flower.style.opacity = Math.random() * 0.5 + 0.5;
        flower.style.animation = `fall ${Math.random() * 4 + 7}s linear forwards`;

        container.appendChild(flower);

        setTimeout(() => {
            flower.remove();
        }, 12000);

    }, 700);
}

/* Rath Animation */

function animateBigChariot() {
    const chariot = document.getElementById("bigChariot");

    if (chariot) {
        // Increased speed and covers full screen (12s instead of 18s)
        chariot.style.animation = "chariotMove 12s linear infinite";
    }

    const style = document.createElement("style");

    style.innerHTML = `
@keyframes fall {
    0% {
        transform: translateY(-30px) rotate(0deg);
    }
    100% {
        transform: translateY(110vh) rotate(720deg);
    }
}

@keyframes chariotMove {
    0% {
        /* Starts completely off-screen on the left */
        transform: translateX(-100%);
    }
    100% {
        /* Travels all the way off-screen to the right */
        transform: translateX(110vw);
    }
}
`;

    document.head.appendChild(style);
}

/* Close */

window.closeRathYatra = function() {
    localStorage.setItem(
        "rathYatraClosedDate",
        new Date().toDateString()
    );

    const header = document.querySelector("header");

    if (header) {
        header.style.top = "0";
    }

    document.getElementById("rathFestiveWrapper")?.remove();
}

window.addEventListener("load", loadRathYatra);
