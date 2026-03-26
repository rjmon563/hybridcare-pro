const CACHE_NAME = 'hybridcare-pro-v4';
const STATIC_ASSETS = [
    '/hybridcare-pro/',
    '/hybridcare-pro/index.html',
    '/hybridcare-pro/manifest.json',
    '/hybridcare-pro/offline.html',
    '/hybridcare-pro/icons/icon-192.png',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
