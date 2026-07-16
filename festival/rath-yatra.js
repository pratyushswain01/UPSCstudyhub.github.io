// festival/rath-yatra.js

function loadRathYatra() {
    if (localStorage.getItem('rathYatraClosed') === 'true') return;

    const container = document.createElement('div');
    container.id = "rathYatraFestive";
    container.innerHTML = `
        <div class="fixed inset-0 z-[9999] pointer-events-none">
            <!-- Falling Flowers -->
            <div id="flowers" class="absolute inset-0"></div>

            <!-- Banner -->
            <div class="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 via-red-600 to-amber-500 text-white py-4 shadow-2xl pointer-events-auto">
                <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <span class="text-4xl">🚩</span>
                        <div>
                            <h2 class="text-xl font-bold">Jai Jagannath! Happy Rath Yatra</h2>
                            <p class="text-sm opacity-90">May Lord Jagannath bless your UPSC journey</p>
                        </div>
                    </div>
                    <button onclick="closeRathYatra()" class="text-2xl font-bold px-3">✕</button>
                </div>
            </div>

            <!-- 3 Chariots -->
            <div class="fixed bottom-12 left-0 right-0 flex justify-center gap-16 z-20 pointer-events-auto">
                <div class="text-center"><div class="text-5xl animate-bounce">🛤️🚩</div><p class="text-white text-xs">Balabhadra</p></div>
                <div class="text-center scale-125"><div class="text-6xl animate-bounce">🛕</div><p class="text-white font-bold">Lord Jagannath</p></div>
                <div class="text-center"><div class="text-5xl animate-bounce">🛤️🚩</div><p class="text-white text-xs">Subhadra</p></div>
            </div>
        </div>
    `;

    document.body.appendChild(container);
    startFallingFlowers();
}

function startFallingFlowers() {
    const container = document.getElementById('flowers');
    if (!container) return;

    setInterval(() => {
        const flower = document.createElement('div');
        flower.textContent = ['🌸','🌺','🌼','🪷','🌷'][Math.floor(Math.random()*5)];
        flower.style.position = 'absolute';
        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.fontSize = '20px';
        flower.style.opacity = Math.random() * 0.7 + 0.4;
        flower.style.animation = `fall ${Math.random()*6 + 5}s linear forwards`;
        flower.style.zIndex = '5';
        container.appendChild(flower);

        setTimeout(() => flower.remove(), 15000);
    }, 220);
}

window.closeRathYatra = function() {
    localStorage.setItem('rathYatraClosed', 'true');
    const el = document.getElementById('rathYatraFestive');
    if (el) el.remove();
};

// Add required CSS animation
const style = document.createElement('style');
style.innerHTML = `@keyframes fall { to { transform: translateY(110vh) rotate(720deg); } }`;
document.head.appendChild(style);

// Auto start
window.addEventListener('load', loadRathYatra);
