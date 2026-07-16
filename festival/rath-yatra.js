// festival/rath-yatra.js - Shows Today Only

function loadRathYatra() {
    const today = new Date().toDateString(); // e.g., "Thu Jul 16 2026"
    
    // Check if already closed today
    if (localStorage.getItem('rathYatraClosedDate') === today) {
        return;
    }

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

            <!-- Three Lords -->
            <div class="fixed bottom-8 left-0 right-0 flex justify-center gap-8 md:gap-16 z-20 pointer-events-auto">
                <div class="text-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Balabhadra.jpg/220px-Balabhadra.jpg" 
                         alt="Balabhadra" class="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-white shadow-lg">
                    <p class="text-white text-xs font-medium mt-2">Balabhadra</p>
                </div>

                <div class="text-center scale-125">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Jagannath_Puri.jpg/220px-Jagannath_Puri.jpg" 
                         alt="Lord Jagannath" class="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-white shadow-xl">
                    <p class="text-white font-bold mt-2">Lord Jagannath</p>
                </div>

                <div class="text-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Subhadra.jpg/220px-Subhadra.jpg" 
                         alt="Subhadra" class="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-white shadow-lg">
                    <p class="text-white text-xs font-medium mt-2">Subhadra</p>
                </div>
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = festiveHTML;
    document.body.appendChild(container.firstElementChild);

    startFallingFlowers();
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
        flower.style.fontSize = '22px';
        flower.style.opacity = Math.random() * 0.7 + 0.4;
        flower.style.animation = `fall ${Math.random() * 5 + 6}s linear forwards`;
        container.appendChild(flower);
        setTimeout(() => flower.remove(), 16000);
    }, 220);
}

window.closeRathYatra = function() {
    const today = new Date().toDateString();
    localStorage.setItem('rathYatraClosedDate', today);
    
    const wrapper = document.getElementById('rathFestiveWrapper');
    if (wrapper) wrapper.remove();
};

// Animation Styles
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fall { 
        to { transform: translateY(110vh) rotate(720deg); } 
    }
`;
document.head.appendChild(style);

// Auto Load
window.addEventListener('load', loadRathYatra);
