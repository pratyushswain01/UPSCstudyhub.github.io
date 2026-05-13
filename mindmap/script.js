// UPSChub™ Mind Map Viewer System
// Created by Pratyush Swain

// Global State
let currentChapter = null;
let currentZoom = 1;
let currentRotation = 0;
let currentBrightness = 100;
let currentContrast = 100;
let isPanning = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;
let velocity = { x: 0, y: 0 };
let lastMoveTime = 0;
let toolbarTimeout = null;
let bookmarkedChapters = new Set();
let completedChapters = new Set();
let recentChapters = [];
let studyDuration = {};

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const subjectsContainer = document.getElementById('subjectsContainer');
const recentChaptersContainer = document.getElementById('recentChapters');
const welcomeScreen = document.getElementById('welcomeScreen');
const viewerContainer = document.getElementById('viewerContainer');
const viewerWrapper = document.getElementById('viewerWrapper');
const mindMapImage = document.getElementById('mindMapImage');
const chapterInfo = document.getElementById('chapterInfo');
const floatingToolbar = document.getElementById('floatingToolbar');
const miniMap = document.getElementById('miniMap');
const miniMapCanvas = document.getElementById('miniMapCanvas');
const miniMapViewport = document.getElementById('miniMapViewport');
const loadingIndicator = document.getElementById('loadingIndicator');
const fullscreenOverlay = document.getElementById('fullscreenOverlay');
const fullscreenImage = document.getElementById('fullscreenImage');
const fullscreenClose = document.getElementById('fullscreenClose');
const toast = document.getElementById('toast');

// Demo Data
const demoData = {
    subjects: [
        {
            id: 'history',
            name: 'History',
            icon: '📚',
            chapters: [
                { id: 'h1', title: 'Ancient India', subject: 'History', imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=2000', progress: 75 },
                { id: 'h2', title: 'Medieval India', subject: 'History', imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=2000', progress: 50 },
                { id: 'h3', title: 'Modern India', subject: 'History', imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=2000', progress: 30 },
                { id: 'h4', title: 'World History', subject: 'History', imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=2000', progress: 0 }
            ]
        },
        {
            id: 'geography',
            name: 'Geography',
            icon: '🌍',
            chapters: [
                { id: 'g1', title: 'Physical Geography', subject: 'Geography', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2000', progress: 60 },
                { id: 'g2', title: 'Indian Geography', subject: 'Geography', imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=2000', progress: 45 },
                { id: 'g3', title: 'World Geography', subject: 'Geography', imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=2000', progress: 20 },
                { id: 'g4', title: 'Climate & Weather', subject: 'Geography', imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=2000', progress: 0 }
            ]
        },
        {
            id: 'polity',
            name: 'Polity',
            icon: '⚖️',
            chapters: [
                { id: 'p1', title: 'Indian Constitution', subject: 'Polity', imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=2000', progress: 80 },
                { id: 'p2', title: 'Fundamental Rights', subject: 'Polity', imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=2000', progress: 55 },
                { id: 'p3', title: 'Parliament', subject: 'Polity', imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=2000', progress: 35 },
                { id: 'p4', title: 'Judiciary', subject: 'Polity', imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=2000', progress: 10 }
            ]
        },
        {
            id: 'economy',
            name: 'Economy',
            icon: '💰',
            chapters: [
                { id: 'e1', title: 'Indian Economy Overview', subject: 'Economy', imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=2000', progress: 70 },
                { id: 'e2', title: 'Banking System', subject: 'Economy', imageUrl: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=2000', progress: 40 },
                { id: 'e3', title: 'Economic Planning', subject: 'Economy', imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=2000', progress: 25 },
                { id: 'e4', title: 'International Trade', subject: 'Economy', imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=2000', progress: 0 }
            ]
        },
        {
            id: 'science',
            name: 'Science & Technology',
            icon: '🔬',
            chapters: [
                { id: 's1', title: 'Space Technology', subject: 'Science', imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=2000', progress: 65 },
                { id: 's2', title: 'Biotechnology', subject: 'Science', imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=2000', progress: 50 },
                { id: 's3', title: 'Information Technology', subject: 'Science', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=2000', progress: 30 },
                { id: 's4', title: 'Environmental Science', subject: 'Science', imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=2000', progress: 15 }
            ]
        },
        {
            id: 'ethics',
            name: 'Ethics & Integrity',
            icon: '🤝',
            chapters: [
                { id: 'et1', title: 'Ethics Fundamentals', subject: 'Ethics', imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=2000', progress: 55 },
                { id: 'et2', title: 'Case Studies', subject: 'Ethics', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=2000', progress: 35 },
                { id: 'et3', title: 'Aptitude', subject: 'Ethics', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=2000', progress: 20 },
                { id: 'et4', title: 'Integrity & Governance', subject: 'Ethics', imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=2000', progress: 0 }
            ]
        }
    ]
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadFromLocalStorage();
    renderSubjects();
    renderRecentChapters();
    setupEventListeners();
    setupKeyboardShortcuts();
    checkTheme();
});

// Initialize App
function initializeApp() {
    console.log('🚀 UPSChub™ Mind Map Viewer Initialized');
    document.body.classList.add('no-transition');
    setTimeout(() => {
        document.body.classList.remove('no-transition');
    }, 100);
}

// Load data from localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('upschub_data');
    if (saved) {
        const data = JSON.parse(saved);
        bookmarkedChapters = new Set(data.bookmarks || []);
        completedChapters = new Set(data.completed || []);
        recentChapters = data.recent || [];
        studyDuration = data.duration || {};
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    const data = {
        bookmarks: Array.from(bookmarkedChapters),
        completed: Array.from(completedChapters),
        recent: recentChapters,
        duration: studyDuration,
        lastChapter: currentChapter?.id
    };
    localStorage.setItem('upschub_data', JSON.stringify(data));
}

// Render Subjects
function renderSubjects() {
    subjectsContainer.innerHTML = '';

    demoData.subjects.forEach(subject => {
        const subjectGroup = document.createElement('div');
        subjectGroup.className = 'subject-group';
        subjectGroup.innerHTML = `
            <div class="subject-header" data-subject="${subject.id}">
                <div class="subject-title-group">
                    <div class="subject-icon">${subject.icon}</div>
                    <div class="subject-info">
                        <h3>${subject.name}</h3>
                        <p>${subject.chapters.length} chapters</p>
                    </div>
                </div>
                <div class="subject-toggle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                    </svg>
                </div>
            </div>
            <div class="chapters-list">
                ${subject.chapters.map(chapter => `
                    <div class="chapter-item" data-chapter="${chapter.id}">
                        <div class="chapter-content">
                            <h4>${chapter.title}</h4>
                            <div class="chapter-meta">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${chapter.progress}%"></div>
                                </div>
                                <span>${chapter.progress}%</span>
                            </div>
                        </div>
                        <div class="chapter-actions">
                            <div class="chapter-bookmark ${bookmarkedChapters.has(chapter.id) ? 'active' : ''}" data-chapter-id="${chapter.id}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M19 21L12 16L5 21V5A2 2 0 0 1 7 3H17A2 2 0 0 1 19 5Z"/>
                                </svg>
                            </div>
                            <div class="chapter-complete ${completedChapters.has(chapter.id) ? 'active' : ''}" data-chapter-id="${chapter.id}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        subjectsContainer.appendChild(subjectGroup);
    });
}

// Render Recent Chapters
function renderRecentChapters() {
    if (recentChapters.length === 0) {
        recentChaptersContainer.innerHTML = '<p style="font-size: 13px; color: var(--text-muted); padding: 12px;">No recent chapters yet</p>';
        return;
    }

    recentChaptersContainer.innerHTML = recentChapters.slice(0, 3).map(chapterId => {
        const chapter = findChapterById(chapterId);
        if (!chapter) return '';
        return `
            <div class="recent-item" data-chapter="${chapter.id}">
                <h4>${chapter.title}</h4>
                <p>${chapter.subject}</p>
            </div>
        `;
    }).join('');
}

// Find chapter by ID
function findChapterById(id) {
    for (const subject of demoData.subjects) {
        const chapter = subject.chapters.find(ch => ch.id === id);
        if (chapter) return chapter;
    }
    return null;
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    mobileMenuBtn?.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Subject expand/collapse
    subjectsContainer.addEventListener('click', (e) => {
        const header = e.target.closest('.subject-header');
        if (header) {
            const subjectGroup = header.parentElement;
            subjectGroup.classList.toggle('collapsed');
        }

        // Chapter click
        const chapterItem = e.target.closest('.chapter-item');
        if (chapterItem && !e.target.closest('.chapter-bookmark') && !e.target.closest('.chapter-complete')) {
            const chapterId = chapterItem.dataset.chapter;
            loadChapter(chapterId);

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        }

        // Bookmark click
        const bookmarkBtn = e.target.closest('.chapter-bookmark');
        if (bookmarkBtn) {
            e.stopPropagation();
            const chapterId = bookmarkBtn.dataset.chapterId;
            toggleBookmark(chapterId);
        }

        // Complete click
        const completeBtn = e.target.closest('.chapter-complete');
        if (completeBtn) {
            e.stopPropagation();
            const chapterId = completeBtn.dataset.chapterId;
            toggleComplete(chapterId);
        }
    });

    // Recent chapters click
    recentChaptersContainer.addEventListener('click', (e) => {
        const recentItem = e.target.closest('.recent-item');
        if (recentItem) {
            const chapterId = recentItem.dataset.chapter;
            loadChapter(chapterId);

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterChapters(query);
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Toolbar buttons
    document.getElementById('zoomInBtn').addEventListener('click', () => zoom(0.2));
    document.getElementById('zoomOutBtn').addEventListener('click', () => zoom(-0.2));
    document.getElementById('resetBtn').addEventListener('click', resetView);
    document.getElementById('fitScreenBtn').addEventListener('click', fitToScreen);
    document.getElementById('fitWidthBtn').addEventListener('click', fitToWidth);
    document.getElementById('rotateBtn').addEventListener('click', rotateImage);
    document.getElementById('handToolBtn').addEventListener('click', toggleHandTool);
    document.getElementById('fullscreenBtn').addEventListener('click', openFullscreen);

    // Sliders
    document.getElementById('brightnessSlider').addEventListener('input', (e) => {
        currentBrightness = e.target.value;
        updateImageFilters();
    });

    document.getElementById('contrastSlider').addEventListener('input', (e) => {
        currentContrast = e.target.value;
        updateImageFilters();
    });

    // Top bar actions
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    document.getElementById('shareBtn').addEventListener('click', shareChapter);
    document.getElementById('bookmarkBtn').addEventListener('click', () => {
        if (currentChapter) {
            toggleBookmark(currentChapter.id);
            const btn = document.getElementById('bookmarkBtn');
            btn.classList.toggle('active', bookmarkedChapters.has(currentChapter.id));
        }
    });

    // Fullscreen close
    fullscreenClose.addEventListener('click', closeFullscreen);

    // Image viewer interactions
    setupImageViewer();

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// Setup Image Viewer
function setupImageViewer() {
    // Mouse wheel zoom
    viewerWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        zoom(delta, e.clientX, e.clientY);
    }, { passive: false });

    // Mouse drag
    viewerWrapper.addEventListener('mousedown', startPan);
    document.addEventListener('mousemove', pan);
    document.addEventListener('mouseup', endPan);

    // Touch events
    let touchStartDistance = 0;
    let touchStartScale = 1;

    viewerWrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            // Pinch zoom start
            touchStartDistance = getTouchDistance(e.touches);
            touchStartScale = currentZoom;
        } else if (e.touches.length === 1) {
            // Pan start
            startPan(e.touches[0]);
        }
    });

    viewerWrapper.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (e.touches.length === 2) {
            // Pinch zoom
            const distance = getTouchDistance(e.touches);
            const scale = (distance / touchStartDistance) * touchStartScale;
            currentZoom = Math.max(0.5, Math.min(5, scale));
            updateTransform();
        } else if (e.touches.length === 1 && isPanning) {
            // Pan
            pan(e.touches[0]);
        }
    }, { passive: false });

    viewerWrapper.addEventListener('touchend', endPan);

    // Double tap/click zoom
    let lastTap = 0;
    viewerWrapper.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
            const zoomAmount = currentZoom < 2 ? 1 : -currentZoom + 1;
            zoom(zoomAmount, e.clientX, e.clientY);
        }
        lastTap = now;
    });

    // Auto-hide toolbar
    let toolbarHideTimeout;
    viewerWrapper.addEventListener('mousemove', () => {
        floatingToolbar.classList.remove('hidden');
        clearTimeout(toolbarHideTimeout);
        toolbarHideTimeout = setTimeout(() => {
            floatingToolbar.classList.add('hidden');
        }, 3000);
    });

    // Mini map click
    miniMapCanvas.addEventListener('click', (e) => {
        const rect = miniMapCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const img = mindMapImage;
        translateX = -x * img.naturalWidth * currentZoom + viewerWrapper.offsetWidth / 2;
        translateY = -y * img.naturalHeight * currentZoom + viewerWrapper.offsetHeight / 2;

        updateTransform();
        updateMiniMap();
    });
}

// Get touch distance for pinch zoom
function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Start panning
function startPan(e) {
    isPanning = true;
    startX = (e.clientX || e.pageX) - translateX;
    startY = (e.clientY || e.pageY) - translateY;
    viewerWrapper.classList.add('grabbing');
    velocity = { x: 0, y: 0 };
    lastMoveTime = Date.now();
}

// Pan image
function pan(e) {
    if (!isPanning) return;

    const currentX = e.clientX || e.pageX;
    const currentY = e.clientY || e.pageY;

    const newX = currentX - startX;
    const newY = currentY - startY;

    const now = Date.now();
    const dt = now - lastMoveTime;

    if (dt > 0) {
        velocity.x = (newX - translateX) / dt * 16;
        velocity.y = (newY - translateY) / dt * 16;
    }

    translateX = newX;
    translateY = newY;
    lastMoveTime = now;

    updateTransform();
    updateMiniMap();
}

// End panning
function endPan() {
    if (!isPanning) return;
    isPanning = false;
    viewerWrapper.classList.remove('grabbing');

    // Apply momentum
    applyMomentum();
}

// Apply momentum scrolling
function applyMomentum() {
    const friction = 0.95;
    const minVelocity = 0.5;

    function animate() {
        if (Math.abs(velocity.x) < minVelocity && Math.abs(velocity.y) < minVelocity) {
            return;
        }

        translateX += velocity.x;
        translateY += velocity.y;

        velocity.x *= friction;
        velocity.y *= friction;

        updateTransform();
        updateMiniMap();

        requestAnimationFrame(animate);
    }

    if (Math.abs(velocity.x) >= minVelocity || Math.abs(velocity.y) >= minVelocity) {
        requestAnimationFrame(animate);
    }
}

// Zoom function
function zoom(delta, centerX, centerY) {
    const oldZoom = currentZoom;
    currentZoom = Math.max(0.5, Math.min(5, currentZoom + delta));

    if (centerX !== undefined && centerY !== undefined) {
        const rect = viewerWrapper.getBoundingClientRect();
        const x = centerX - rect.left;
        const y = centerY - rect.top;

        translateX = x - (x - translateX) * (currentZoom / oldZoom);
        translateY = y - (y - translateY) * (currentZoom / oldZoom);
    }

    updateTransform();
    updateMiniMap();
}

// Update transform
function updateTransform() {
    mindMapImage.style.transform = `
        translate(${translateX}px, ${translateY}px) 
        scale(${currentZoom}) 
        rotate(${currentRotation}deg)
    `;
}

// Update image filters
function updateImageFilters() {
    mindMapImage.style.filter = `
        brightness(${currentBrightness}%) 
        contrast(${currentContrast}%)
    `;
}

// Reset view
function resetView() {
    currentZoom = 1;
    currentRotation = 0;
    currentBrightness = 100;
    currentContrast = 100;
    translateX = 0;
    translateY = 0;

    document.getElementById('brightnessSlider').value = 100;
    document.getElementById('contrastSlider').value = 100;

    updateTransform();
    updateImageFilters();
    updateMiniMap();

    showToast('View reset');
}

// Fit to screen
function fitToScreen() {
    const img = mindMapImage;
    const container = viewerWrapper;

    const scaleX = container.offsetWidth / img.naturalWidth;
    const scaleY = container.offsetHeight / img.naturalHeight;

    currentZoom = Math.min(scaleX, scaleY) * 0.9;
    translateX = (container.offsetWidth - img.naturalWidth * currentZoom) / 2;
    translateY = (container.offsetHeight - img.naturalHeight * currentZoom) / 2;

    updateTransform();
    updateMiniMap();

    showToast('Fit to screen');
}

// Fit to width
function fitToWidth() {
    const img = mindMapImage;
    const container = viewerWrapper;

    currentZoom = (container.offsetWidth / img.naturalWidth) * 0.95;
    translateX = (container.offsetWidth - img.naturalWidth * currentZoom) / 2;
    translateY = (container.offsetHeight - img.naturalHeight * currentZoom) / 2;

    updateTransform();
    updateMiniMap();

    showToast('Fit to width');
}

// Rotate image
function rotateImage() {
    currentRotation = (currentRotation + 90) % 360;
    updateTransform();
    showToast('Rotated 90°');
}

// Toggle hand tool
function toggleHandTool() {
    const btn = document.getElementById('handToolBtn');
    btn.classList.toggle('active');
    viewerWrapper.style.cursor = btn.classList.contains('active') ? 'grab' : 'default';
    showToast(btn.classList.contains('active') ? 'Hand tool on' : 'Hand tool off');
}

// Update mini map
function updateMiniMap() {
    if (!currentChapter) return;

    const canvas = miniMapCanvas;
    const ctx = canvas.getContext('2d');
    const img = mindMapImage;

    canvas.width = 200;
    canvas.height = 150;

    const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

    // Draw viewport
    const viewportScale = scale / currentZoom;
    const viewportX = offsetX - translateX * viewportScale;
    const viewportY = offsetY - translateY * viewportScale;
    const viewportWidth = viewerWrapper.offsetWidth * viewportScale;
    const viewportHeight = viewerWrapper.offsetHeight * viewportScale;

    miniMapViewport.style.left = `${viewportX}px`;
    miniMapViewport.style.top = `${viewportY}px`;
    miniMapViewport.style.width = `${viewportWidth}px`;
    miniMapViewport.style.height = `${viewportHeight}px`;
}

// Load chapter
function loadChapter(chapterId) {
    const chapter = findChapterById(chapterId);
    if (!chapter) return;

    currentChapter = chapter;

    // Update UI
    welcomeScreen.style.display = 'none';
    viewerContainer.classList.add('active');
    loadingIndicator.style.display = 'flex';

    // Update chapter info
    document.querySelector('.chapter-title').textContent = chapter.title;
    document.querySelector('.chapter-subject').textContent = chapter.subject;

    // Update bookmark button
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    bookmarkBtn.classList.toggle('active', bookmarkedChapters.has(chapter.id));

    // Update active state
    document.querySelectorAll('.chapter-item').forEach(item => {
        item.classList.toggle('active', item.dataset.chapter === chapterId);
    });

    // Load image
    const img = new Image();
    img.onload = () => {
        mindMapImage.src = img.src;
        mindMapImage.style.width = `${img.naturalWidth}px`;
        mindMapImage.style.height = `${img.naturalHeight}px`;

        loadingIndicator.style.display = 'none';

        // Reset view
        resetView();
        fitToScreen();

        // Update mini map
        setTimeout(() => updateMiniMap(), 100);

        showToast(`Loaded: ${chapter.title}`);
    };

    img.onerror = () => {
        loadingIndicator.style.display = 'none';
        showToast('Failed to load image');
    };

    img.src = chapter.imageUrl;

    // Update recent chapters
    recentChapters = recentChapters.filter(id => id !== chapterId);
    recentChapters.unshift(chapterId);
    recentChapters = recentChapters.slice(0, 10);

    renderRecentChapters();
    saveToLocalStorage();

    // Track study time
    trackStudyTime(chapterId);
}

// Track study time
function trackStudyTime(chapterId) {
    const startTime = Date.now();

    const interval = setInterval(() => {
        if (currentChapter?.id !== chapterId) {
            clearInterval(interval);
            return;
        }

        const duration = Math.floor((Date.now() - startTime) / 1000);
        studyDuration[chapterId] = (studyDuration[chapterId] || 0) + 1;
        saveToLocalStorage();
    }, 1000);
}

// Toggle bookmark
function toggleBookmark(chapterId) {
    if (bookmarkedChapters.has(chapterId)) {
        bookmarkedChapters.delete(chapterId);
        showToast('Bookmark removed');
    } else {
        bookmarkedChapters.add(chapterId);
        showToast('Bookmarked');
    }

    // Update UI
    document.querySelectorAll(`.chapter-bookmark[data-chapter-id="${chapterId}"]`).forEach(btn => {
        btn.classList.toggle('active', bookmarkedChapters.has(chapterId));
    });

    if (currentChapter?.id === chapterId) {
        document.getElementById('bookmarkBtn').classList.toggle('active', bookmarkedChapters.has(chapterId));
    }

    saveToLocalStorage();
}

// Toggle complete
function toggleComplete(chapterId) {
    if (completedChapters.has(chapterId)) {
        completedChapters.delete(chapterId);
        showToast('Marked incomplete');
    } else {
        completedChapters.add(chapterId);
        showToast('Marked complete');
    }

    // Update UI
    document.querySelectorAll(`.chapter-complete[data-chapter-id="${chapterId}"]`).forEach(btn => {
        btn.classList.toggle('active', completedChapters.has(chapterId));
    });

    saveToLocalStorage();
}

// Download image
function downloadImage() {
    if (!currentChapter) return;

    const link = document.createElement('a');
    link.href = mindMapImage.src;
    link.download = `${currentChapter.title.replace(/\s+/g, '_')}.jpg`;
    link.click();

    showToast('Download started');
}

// Share chapter
function shareChapter() {
    if (!currentChapter) return;

    if (navigator.share) {
        navigator.share({
            title: `UPSChub™ - ${currentChapter.title}`,
            text: `Check out this mind map: ${currentChapter.title}`,
            url: window.location.href
        }).catch(() => { });
    } else {
        // Fallback: copy link
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard');
    }
}

// Open fullscreen
function openFullscreen() {
    if (!currentChapter) return;

    fullscreenImage.src = mindMapImage.src;
    fullscreenOverlay.classList.add('active');

    // Request fullscreen on mobile
    if (fullscreenOverlay.requestFullscreen) {
        fullscreenOverlay.requestFullscreen();
    } else if (fullscreenOverlay.webkitRequestFullscreen) {
        fullscreenOverlay.webkitRequestFullscreen();
    }

    // Lock orientation to landscape on mobile
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => { });
    }
}

// Close fullscreen
function closeFullscreen() {
    fullscreenOverlay.classList.remove('active');

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }

    if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
    }
}

// Filter chapters
function filterChapters(query) {
    document.querySelectorAll('.chapter-item').forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const match = title.includes(query);
        item.style.display = match ? 'flex' : 'none';
    });

    // Show/hide empty subjects
    document.querySelectorAll('.subject-group').forEach(group => {
        const visibleChapters = group.querySelectorAll('.chapter-item[style="display: flex;"]').length;
        group.style.display = visibleChapters > 0 ? 'block' : 'none';
    });
}

// Toggle theme
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('upschub_theme', newTheme);

    showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode`);
}

// Check theme
function checkTheme() {
    const saved = localStorage.getItem('upschub_theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    }
}

// Show toast
function showToast(message) {
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;

        switch (e.key) {
            case '=':
            case '+':
                e.preventDefault();
                zoom(0.2);
                break;
            case '-':
            case '_':
                e.preventDefault();
                zoom(-0.2);
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                resetView();
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                openFullscreen();
                break;
            case 'h':
            case 'H':
                e.preventDefault();
                toggleHandTool();
                break;
            case 'Escape':
                if (fullscreenOverlay.classList.contains('active')) {
                    closeFullscreen();
                }
                break;
        }
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    if (currentChapter) {
        updateMiniMap();
    }
});

// Prevent context menu on images
mindMapImage.addEventListener('contextmenu', (e) => e.preventDefault());
fullscreenImage.addEventListener('contextmenu', (e) => e.preventDefault());

console.log('✅ UPSChub™ Ready - All systems operational');