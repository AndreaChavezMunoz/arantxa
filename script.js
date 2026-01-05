// Video sequence configuration
const VIDEO_SEQUENCE = {
    // Forward videos
    walk1: { file: 'assets/videos/walk1.mp4', nextPopup: 'popup1' },
    walk2: { file: 'assets/videos/walk2.mp4', nextPopup: 'popup2' },
    walk3: { file: 'assets/videos/walk3.mp4', nextPopup: 'popup3' },
    walk4: { file: 'assets/videos/walk4.mp4', nextPopup: 'popup4' },
    walk5: { file: 'assets/videos/walk5.mp4', nextPopup: 'popup5' },
    walk6: { file: 'assets/videos/walk6.mp4', nextPopup: 'popup6' }, // DEAD END

    // Reverse videos (reverse1 exists but unused)
    reverse1: { file: null, nextPopup: 'popup1' },
    reverse2: { file: 'assets/videos/reverse2.mp4', nextPopup: 'popup2' },
    reverse3: { file: 'assets/videos/reverse3.mp4', nextPopup: 'popup3' },
    reverse4: { file: 'assets/videos/reverse4.mp4', nextPopup: 'popup4' },
    reverse5: { file: 'assets/videos/reverse5.mp4', nextPopup: 'popup5' }
};


// DOM Elements
const videoElement = document.getElementById('current-video');
const videoContainer = document.querySelector('.video-container');
const videoOverlay = document.querySelector('.video-overlay');
const popupContainers = document.querySelectorAll('.popup-container');

const bgAudio = document.getElementById('bg-audio');
const fxAudio = document.getElementById('fx-audio');

let audioStarted = false;

// State
let currentVideoId = 'walk1';
let isTransitioning = false;
let activePopup = null;

// Initialize - Start with first video
function init() {
    loadAndPlayVideo('walk1');
    
    // Setup all button event listeners
    setupButtonListeners();
    
    // Video event listeners
    videoElement.addEventListener('ended', handleVideoEnded);
    
    // Preload all videos for smooth transitions
    preloadVideos();
}

// Load and play a video
function loadAndPlayVideo(videoId) {
    if (isTransitioning || !VIDEO_SEQUENCE[videoId]) return;
    
    isTransitioning = true;
    
    // Animate out current popup if exists
    if (activePopup) {
        hidePopup(activePopup, () => {
            // After popup slides out, load new video
            executeVideoLoad(videoId);
        });
    } else {
        // No active popup, load directly
        executeVideoLoad(videoId);
    }
}

function executeVideoLoad(videoId) {
    currentVideoId = videoId;
    
    // Remove blur overlay
    videoContainer.classList.remove('popup-active');
    
    // Set video source
    videoElement.src = VIDEO_SEQUENCE[videoId].file;
    
    // Load and play
    videoElement.load();
    videoElement.play().then(() => {
        isTransitioning = false;
    }).catch(error => {
        console.log('Auto-play prevented, will play after interaction');
        isTransitioning = false;
    });
}

// Handle video ended
function handleVideoEnded() {
    // Freeze on last frame
    videoElement.pause();
    
    // Add blur overlay with delay for smooth transition
    setTimeout(() => {
        videoContainer.classList.add('popup-active');
        
        // Show the appropriate popup
        const nextPopup = VIDEO_SEQUENCE[currentVideoId].nextPopup;
        if (nextPopup) {
            setTimeout(() => {
                showPopup(nextPopup);
            }, 300);
        }
    }, 100);
}

// Show a specific popup
function showPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        // Make sure popup is visible before adding active class
        popup.style.display = 'flex';
        
        // Small delay to ensure display is set before animation
        setTimeout(() => {
            activePopup = popupId;
            popup.classList.add('active');
            popup.classList.remove('exiting');
        }, 10);
    }
}

// Hide a popup with animation
function hidePopup(popupId, callback) {
    const popup = document.getElementById(popupId);
    if (popup) {
        // Add exiting class to trigger slide-out animation
        popup.classList.add('exiting');
        popup.classList.remove('active');
        
        // Wait for animation to complete (match CSS animation duration)
        setTimeout(() => {
            // Hide the popup completely
            popup.style.display = 'none';
            popup.classList.remove('exiting');
            
            // Remove the display none after animation so it can slide in again later
            setTimeout(() => {
                popup.style.display = '';
            }, 100);
            
            activePopup = null;
            if (callback) callback();
        }, 800); // Match slideOut animation duration in CSS (0.8s)
    } else if (callback) {
        callback();
    }
}

// Hide all popups
function hideAllPopups() {
    popupContainers.forEach(popup => {
        popup.classList.remove('active', 'exiting');
        popup.style.display = 'none';
        
        // Reset display after a moment
        setTimeout(() => {
            popup.style.display = '';
        }, 100);
    });
    activePopup = null;
}

// Setup button event listeners
function setupButtonListeners() {
    // Continue buttons
    document.querySelectorAll('.continue-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (isTransitioning) return;
            const nextVideo = e.target.closest('.continue-btn').dataset.next;
            if (nextVideo) {
                loadAndPlayVideo(nextVideo);
            }
        });
    });
    
    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (isTransitioning) return;
            const prevVideo = e.target.closest('.back-btn').dataset.prev;
            if (prevVideo) {
                loadAndPlayVideo(prevVideo);
            }
        });
    });

    // Restart button
    document.querySelectorAll('.restart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.reload();
        });
    });

    // Download PDF button
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = 'assets/info/info.pdf';
            link.download = 'info.pdf';
            link.click();
        });
    });

}

// Preload all videos for smooth transitions
function preloadVideos() {
    Object.values(VIDEO_SEQUENCE).forEach(video => {
        if (!video.file) return; 

        const preloadVideo = document.createElement('video');
        preloadVideo.src = video.file;
        preloadVideo.preload = 'auto';
    });
}


// Start when page loads
window.addEventListener('DOMContentLoaded', init);

// Fallback: If video doesn't autoplay, allow clicking anywhere to start
document.addEventListener('click', () => {
    if (videoElement.paused && !isTransitioning && videoElement.src) {
        videoElement.play();
    }
}, { once: true });

// Debug info
console.log('Video Game Experience Loaded');
console.log('Video sequence:', Object.keys(VIDEO_SEQUENCE));