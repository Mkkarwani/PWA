if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/PWA/sw.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);

            // Listen for waiting service worker and reload when it's activated
            if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }

            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('New content available, reloading...');
                        window.location.reload();
                    }
                });
            });
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}
