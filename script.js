// ===============================
// Video sequence configuration
// ===============================
const VIDEO_SEQUENCE = {
    // Forward videos
    walk1: { file: 'assets/videos/walk1.mp4', nextPopup: 'popup1' },
    walk2: { file: 'assets/videos/walk2.mp4', nextPopup: 'popup2' },
    walk3: { file: 'assets/videos/walk3.mp4', nextPopup: 'popup3' },
    walk4: { file: 'assets/videos/walk4.mp4', nextPopup: 'popup4' },
    walk5: { file: 'assets/videos/walk5.mp4', nextPopup: 'popup5' },
    walk6: { file: 'assets/videos/walk6.mp4', nextPopup: 'popup6' }, // DEAD END

    // Reverse videos
    reverse1: { file: null, nextPopup: 'popup1' },
    reverse2: { file: 'assets/videos/reverse2.mp4', nextPopup: 'popup2' },
    reverse3: { file: 'assets/videos/reverse3.mp4', nextPopup: 'popup3' },
    reverse4: { file: 'assets/videos/reverse4.mp4', nextPopup: 'popup4' },
    reverse5: { file: 'assets/videos/reverse5.mp4', nextPopup: 'popup5' }
};

// ===============================
// DOM Elements
// ===============================
const videoElement = document.getElementById('current-video');
const videoContainer = document.querySelector('.video-container');
const popupContainers = document.querySelectorAll('.popup-container');

const bgAudio = document.getElementById('bg-audio');
const fxAudio = document.getElementById('fx-audio');

const landing = document.getElementById('landing');
const startBtn = document.getElementById('start-btn');

// ===============================
// State
// ===============================
let currentVideoId = null;
let isTransitioning = false;
let activePopup = null;
let audioStarted = false;

// ===============================
// INIT (runs on page load)
// ===============================
function init() {
    preloadVideos();               // load videos while landing is visible
    setupButtonListeners();
    videoElement.addEventListener('ended', handleVideoEnded);
}

// ===============================
// START BUTTON (user interaction)
// ===============================
if (startBtn && landing) {
    startBtn.addEventListener('click', () => {
        if (audioStarted) return;
        audioStarted = true;

        // ---- AUDIO ----
        bgAudio.volume = 0.6;
        bgAudio.play().catch(() => {});

        setTimeout(() => {
            fxAudio.play().catch(() => {});
        }, 3500);

        // ---- VIDEO ----
        loadAndPlayVideo('walk1');

        // ---- LANDING FADE OUT ----
        landing.classList.add('fade-out');
        setTimeout(() => {
            landing.style.display = 'none';
        }, 800);
    });
}

// ===============================
// VIDEO LOGIC
// ===============================
function loadAndPlayVideo(videoId) {
    if (isTransitioning || !VIDEO_SEQUENCE[videoId]) return;
    isTransitioning = true;

    if (activePopup) {
        hidePopup(activePopup, () => {
            executeVideoLoad(videoId);
        });
    } else {
        executeVideoLoad(videoId);
    }
}

function executeVideoLoad(videoId) {
    currentVideoId = videoId;
    videoContainer.classList.remove('popup-active');

    const file = VIDEO_SEQUENCE[videoId].file;
    if (!file) {
        isTransitioning = false;
        return;
    }

    videoElement.src = file;
    videoElement.load();

    videoElement.play()
        .then(() => {
            isTransitioning = false;
        })
        .catch(() => {
            isTransitioning = false;
        });
}

function handleVideoEnded() {
    videoElement.pause();

    setTimeout(() => {
        videoContainer.classList.add('popup-active');

        const nextPopup = VIDEO_SEQUENCE[currentVideoId]?.nextPopup;
        if (nextPopup) {
            setTimeout(() => {
                showPopup(nextPopup);
            }, 300);
        }
    }, 100);
}

// ===============================
// POPUPS
// ===============================
function showPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (!popup) return;

    popup.style.display = 'flex';

    setTimeout(() => {
        activePopup = popupId;
        popup.classList.add('active');
        popup.classList.remove('exiting');
    }, 10);
}

function hidePopup(popupId, callback) {
    const popup = document.getElementById(popupId);
    if (!popup) {
        callback && callback();
        return;
    }

    popup.classList.add('exiting');
    popup.classList.remove('active');

    setTimeout(() => {
        popup.style.display = 'none';
        popup.classList.remove('exiting');
        activePopup = null;
        callback && callback();
    }, 800);
}

// ===============================
// BUTTON LISTENERS
// ===============================
function setupButtonListeners() {
    document.querySelectorAll('.continue-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            if (isTransitioning) return;
            const next = e.currentTarget.dataset.next;
            if (next) loadAndPlayVideo(next);
        });
    });

    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            if (isTransitioning) return;
            const prev = e.currentTarget.dataset.prev;
            if (prev) loadAndPlayVideo(prev);
        });
    });

    document.querySelectorAll('.restart-btn').forEach(btn => {
        btn.addEventListener('click', () => window.location.reload());
    });

    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = 'assets/info/info.pdf';
            link.download = 'info.pdf';
            link.click();
        });
    });
}

// ===============================
// PRELOAD VIDEOS
// ===============================
function preloadVideos() {
    Object.values(VIDEO_SEQUENCE).forEach(video => {
        if (!video.file) return;
        const v = document.createElement('video');
        v.src = video.file;
        v.preload = 'auto';
    });
}

// ===============================
// START APP
// ===============================
window.addEventListener('DOMContentLoaded', init);

console.log('Video Game Experience Loaded');
console.log('Video sequence:', Object.keys(VIDEO_SEQUENCE));
