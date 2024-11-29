// Import Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Offline fallback page
const OFFLINE_URL = '/PWA/offline.html';

// Precache assets (ensure these are updated on build)
workbox.precaching.precacheAndRoute([
    { url: '/PWA/index.html', revision: null },
    { url: '/PWA/home.html', revision: null },
    { url: '/PWA/styles.css', revision: null },
    { url: '/PWA/script.js', revision: null },
    { url: '/PWA/sw-register.js', revision: null },
    { url: '/PWA/offline.html', revision: null },
]);

// Use a NetworkFirst strategy for all navigation requests
workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
        cacheName: 'dynamic-pages',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 50, // Maximum number of pages to cache
                maxAgeSeconds: 24 * 60 * 60, // Cache for 1 day
            }),
        ],
    })
);

// Use a CacheFirst strategy for static assets (CSS, JS, images)
workbox.routing.registerRoute(
    ({ request }) =>
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'image',
    new workbox.strategies.CacheFirst({
        cacheName: 'static-assets',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 100, // Cache up to 100 static files
                maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
            }),
        ],
    })
);

// Fallback to offline page when navigation fails
workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.mode === 'navigate') {
        return caches.match(OFFLINE_URL);
    }
    return Response.error(); // For other requests, return an error
});
