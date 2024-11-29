const CACHE_NAME = 'dynamic-cache'; // Static name; no need to update manually
const OFFLINE_URL = '/PWA/offline.html';
const ASSETS = [
    '/PWA/index.html',
    '/PWA/home.html',
    '/PWA/styles.css',
    '/PWA/script.js',
    '/PWA/sw-register.js',
    '/PWA/offline.html',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets...');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting(); // Activate new service worker immediately
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => 
            Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
    self.clients.claim(); // Start controlling all clients immediately
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone()); // Update cache
                        return response;
                    });
                })
                .catch(() => caches.match(OFFLINE_URL)) // Serve offline page if offline
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return (
                    response ||
                    fetch(event.request).then((networkResponse) => {
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    })
                );
            })
        );
    }
});
