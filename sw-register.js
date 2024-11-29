if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/PWA/sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// Reload Page When Online
window.addEventListener('online', () => {
    console.log('Back online: Reloading to fetch latest content.');
    location.reload();
});

