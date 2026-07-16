// =============================================
// Final Rath Yatra Festival Script
// Place this file in: festival/rath-yatra.js
// =============================================

function loadRathYatra() {
    if (localStorage.getItem('rathYatraClosed') === 'true') return;

    const festiveHTML = `
        <div class="fixed inset-0 z-[9999] pointer-events-none" id="rathFestiveWrapper">
            
            <!-- Falling Flowers -->
            <div id="fallingFlowers" class="absolute inset-0"></div>

            <!-- Top Banner -->
            <div class="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 via-red-600 to-amber-500 text-white py-4 shadow-2xl pointer-events-auto">
                <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <span class="text-4xl">🚩</span>
                        <div>
                            <h2 class="text-xl md:text-2xl font-bold">Jai Jagannath! Happy Rath Yatra</h2>
                            <p class="text-sm opacity-90">May Lord Jagannath bless you with wisdom and success in your UPSC journey</p>
                        </div>
                    </div>
                    <button onclick="closeRathYatra()" 
                            class="text-3xl leading-none hover:scale-110 transition-all px-2">✕</button>
                </div>
            </div>

            <!-- Three SVG Chariots -->
            <div class="fixed bottom-8 left-0 right-0 flex justify-center gap-12 md:gap-20 z-20 pointer-events-auto">
                
                <!-- Balabhadra -->
                <div class="text-center">
                    <svg width="100" height="110" viewBox="0 0 100 110" class="chariot-svg">
                        <rect x="18" y="55" width="64" height="28" rx="6" fill="#f59e0b" stroke="#b45309" stroke-width="4"/>
                        <circle cx="32" cy="85" r="9" fill="#1f2937"/>
                        <circle cx="68" cy="85" r="9" fill="#1f2937"/>
                        <polygon points="25,48 50,28 75,48" fill="#dc2626"/>
                    </svg>
                    <p class="text-white text-xs font-medium mt-2">Balabhadra</p>
                </div>

                <!-- Lord Jagannath (Main) -->
                <div class="text-center scale-125">
                    <svg width="130" height="130" viewBox="0 0 100 120" class="chariot-svg">
                        <rect x="12" y="52" width="76" height="32" rx="8" fill="#b45309" stroke="#854d0e" stroke-width="5"/>
                        <circle cx="28" cy="87" r="10" fill="#1f2937"/>
                        <circle cx="72" cy="87" r="10" fill="#1f2937"/>
                        <polygon points="20,45 50,18 80,45" fill="#dc2626"/>
                        <circle cx="50" cy="38" r="14" fill="#fcd34d"/>
                    </svg>
                    <p class="text-white font-bold mt-2">Lord Jagannath</p>
                </div>

                <!-- Subhadra -->
                <div class="text-center">
                    <svg width="100" height="110" viewBox="0 0 100 110" class="chariot-svg">
                        <rect x="18" y="55" width="64" height="28" rx="6" fill="#f59e0b" stroke="#b45309" stroke-width="4"/>
                        <circle cx="32" cy="85" r="9" fill="#1f2937"/>
                        <circle cx="68" cy="85" r="9" fill="#1f2937"/>
                        <polygon points="25,48 50,28 75,48" fill="#dc2626"/>
                    </svg>
                    <p class="text-white text-xs font-medium mt-2">Subhadra</p>
                </div>
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = festiveHTML;
    document.body.appendChild(container.firstElementChild);

    startFallingFlowers();
    animateChariots();
}

// Falling Flowers
function startFallingFlowers() {
    const container = document.getElementById('fallingFlowers');
    if (!container) return;

    setInterval(() => {
        const flower = document.createElement('div');
        flower.textContent = ['🌸','🌺','🌼','🪷','🌷','🍃'][Math.floor(Math.random() * 6)];
        flower.style.position = 'absolute';
        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.fontSize = '20px';
        flower.style.opacity = Math.random() * 0.7 + 0.4;
        flower.style.animation = `fall ${Math.random() * 5 + 6}s linear forwards`;
        container.appendChild(flower);

        setTimeout(() => flower.remove(), 16000);
    }, 220);
}

// Chariot Animation
function animateChariots() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fall { to { transform: translateY(110vh) rotate(720deg); } }
        .chariot-svg {
            animation: chariotPull 4s ease-in-out infinite alternate;
            filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));
        }
        @keyframes chariotPull {
            from { transform: translateY(0) rotate(-3deg); }
            to   { transform: translateY(-12px) rotate(3deg); }
        }
    `;
    document.head.appendChild(style);
}

window.closeRathYatra = function() {
    localStorage.setItem('rathYatraClosed', 'true');
    const wrapper = document.getElementById('rathFestiveWrapper');
    if (wrapper) wrapper.remove();
};

// Auto Load
window.addEventListener('load', loadRathYatra);
