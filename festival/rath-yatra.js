// festival/rath-yatra.js - Using Local Images

function loadRathYatra() {
    const today = new Date().toDateString();
    if (localStorage.getItem('rathYatraClosedDate') === today) return;

    const festiveHTML = `
        <div class="fixed inset-0 z-[9999] pointer-events-none overflow-hidden" id="rathFestiveWrapper">
            
            <div id="fallingFlowers" class="absolute inset-0"></div>

            <!-- Top Banner -->
            <div class="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 via-red-600 to-amber-500 text-white py-5 shadow-2xl pointer-events-auto">
                <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div class="flex items-center gap-5">
                        <span class="text-5xl">🚩</span>
                        <div>
                            <h2 class="text-2xl md:text-3xl font-bold">Jai Jagannath!</h2>
                            <p class="text-lg">Happy Rath Yatra</p>
                            <p class="text-sm opacity-80">May Lord Jagannath bless your UPSC journey</p>
                        </div>
                    </div>
                    <button onclick="closeRathYatra()" class="text-4xl leading-none hover:scale-110 px-3">✕</button>
                </div>
            </div>

            <!-- Big Animated Chariot -->
            <div class="fixed bottom-24 left-0 right-0 flex justify-center z-20 pointer-events-auto">
                <img id="bigChariot" 
                     src="images/rath-chariot.png" 
                     alt="Rath Yatra Chariot" 
                     class="max-w-[90%] md:max-w-[72%] drop-shadow-2xl">
            </div>

            <!-- Three Lords Combined -->
            <div class="fixed bottom-8 left-0 right-0 flex justify-center z-30 pointer-events-auto">
                <img src="images/jagannath-balabhadra-subhadra.png" 
                     alt="Jagannath Balabhadra Subhadra" 
                     class="w-80 md:w-96 h-auto rounded-3xl border-4 border-white shadow-2xl">
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = festiveHTML;
    document.body.appendChild(container.firstElementChild);

    startFallingFlowers();
    animateBigChariot();
}

// Falling Flowers (Reduced)
function startFallingFlowers() {
    const container = document.getElementById('fallingFlowers');
    if (!container) return;

    setInterval(() => {
        const flower = document.createElement('div');
        flower.textContent = ['🌸','🌺','🌼','🪷','🌷'][Math.floor(Math.random() * 5)];
        flower.style.position = 'absolute';
        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.fontSize = '22px';
        flower.style.opacity = Math.random() * 0.7 + 0.4;
        flower.style.animation = `fall ${Math.random() * 6 + 8}s linear forwards`;
        container.appendChild(flower);
        setTimeout(() => flower.remove(), 18000);
    }, 320);
}

function animateBigChariot() {
    const chariot = document.getElementById('bigChariot');
    if (chariot) chariot.style.animation = 'chariotMove 15s linear infinite';

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fall { to { transform: translateY(110vh) rotate(720deg); } }
        @keyframes chariotMove {
            0% { transform: translateX(-130%) scale(0.9); }
            100% { transform: translateX(150%) scale(0.9); }
        }
    `;
    document.head.appendChild(style);
}

window.closeRathYatra = function() {
    const today = new Date().toDateString();
    localStorage.setItem('rathYatraClosedDate', today);
    const wrapper = document.getElementById('rathFestiveWrapper');
    if (wrapper) wrapper.remove();
};

window.addEventListener('load', loadRathYatra);
