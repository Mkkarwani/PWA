const CACHE_NAME = 'studyfreinds-cache-v1';
const OFFLINE_URL = '/PWA/offline.html';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                OFFLINE_URL,
                '/PWA/styles.css',
                '/PWA/script.js',
                '/PWA/icons/icon-192x192.png',
                '/PWA/icons/icon-512x512.png'
            ]);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Update the cache with the new response
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone);
                    });
                    return response;
                })
                .catch(() => {
                    // Serve offline.html if the user is offline
                    return caches.match(OFFLINE_URL);
                })
        );
    } else {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match(event.request)) // Serve from cache if offline
        );
    }
});
