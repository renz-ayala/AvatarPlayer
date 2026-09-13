(function () {
    'use strict';

    function cleanUrl(url) {
        return url
            ? url.split('?')[0].split('#')[0].toLowerCase()
            : '';
    }

    if (window === window.top) {
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'AUTONEXT_VIDEO_ENDED') {
                navigateNext();
            }
        });

        let scrolled = false;
        const performScroll = () => {
            if (scrolled) {
                return;
            }

            const target = document.querySelector('.post-body iframe, .post-body, .post-title');

            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                scrolled = true;
                console.log('redirect to:', target);
            }
        };

        [300, 800, 1500].forEach(delay => setTimeout(performScroll, delay));
    }

    function triggerClickSequence(elem) {
        if (!elem) {
            return;
        }

        ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(eventType => {
            elem.dispatchEvent(new MouseEvent(eventType, { bubbles: true, cancelable: true, view: window }));
        });
    }

    function tryStartPlayback() {
        const video = document.querySelector('video');
        const playBtn = document.querySelector(
            '.ytp-large-play-button, .ytp-large-play-button-red-bg, button[aria-label="Reproducir"], .ytp-play-button, div[class*="ppVepb"]'
        );

        if (video) {
            if (video.paused) {
                if (playBtn) {
                    triggerClickSequence(playBtn);
                }

                video.play().catch(() => {});
            }

            if (!video.dataset.nextBound) {
                video.dataset.nextBound = 'true';
                video.addEventListener('ended', () => {
                    console.log('finalizó el cap');

                    if (window === window.top) {
                        navigateNext();
                    } else {
                        window.top.postMessage({ type: 'AUTONEXT_VIDEO_ENDED' }, '*');
                    }
                });
            }
        } else if (playBtn) {
            triggerClickSequence(playBtn);
        }
    }

    function navigateNext() {
        const currentUrl = cleanUrl(window.top.location.href);
        const currentIndex = PLAYLIST.findIndex(url => cleanUrl(url) === currentUrl);

        console.log('uri actual; ', currentUrl);

        if (currentIndex !== -1 && currentIndex + 1 < PLAYLIST.length) {
            const nextUrl = PLAYLIST[currentIndex + 1];
            console.log('siguiente uri: ', nextUrl);

            window.top.location.href = nextUrl;
        }
    }

    let attempts = 0;
    const interval = setInterval(() => {
        attempts++;
        tryStartPlayback();
        const video = document.querySelector('video');
        if ((video && !video.paused) || attempts > 25) {
            clearInterval(interval);
        }
    }, 800);

})();

// npm init -y
// npm install --save-dev @types/chrome
// [Destiny] --autoplay-policy=no-user-gesture-required