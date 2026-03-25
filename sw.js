const CACHE_NAME = 'hybridcare-pro-v3';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/offline.html',
    '/icons/icon-72.png',
    '/icons/icon-96.png',
    '/icons/icon-128.png',
    '/icons/icon-144.png',
    '/icons/icon-152.png',
    '/icons/icon-192.png',
    '/icons/icon-384.png',
    '/icons/icon-512.png'
];

// Instalación - cachear assets estáticos
self.addEventListener('install', event => {
    console.log('[SW] HybridCare Pro - Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Cacheando assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activación - limpiar caches antiguas
self.addEventListener('activate', event => {
    console.log('[SW] HybridCare Pro - Activando...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Eliminando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia: Network First con fallback a cache
self.addEventListener('fetch', event => {
    // Ignorar peticiones a APIs externas y websockets
    if (event.request.url.includes('googleapis') || 
        event.request.url.includes('chart.googleapis') ||
        event.request.url.includes('bluetooth')) {
        return;
    }
    
    // Para navegación (HTML)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request)
                        .then(cached => {
                            if (cached) return cached;
                            return caches.match('/offline.html');
                        });
                })
        );
        return;
    }
    
    // Para otros recursos (CSS, JS, imágenes)
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200) {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
});

// Notificaciones push
self.addEventListener('push', event => {
    let data = {};
    try {
        data = event.data.json();
    } catch (e) {
        data = { title: 'HybridCare Pro', body: event.data.text() };
    }
    
    const options = {
        body: data.body || 'Nueva alerta del vehículo',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        },
        actions: [
            { action: 'view', title: 'Ver diagnóstico' },
            { action: 'dismiss', title: 'Ignorar' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'HybridCare Pro', options)
    );
});

// Clic en notificación
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

// Sincronización en segundo plano
self.addEventListener('sync', event => {
    console.log('[SW] Sincronización en segundo plano:', event.tag);
    if (event.tag === 'sync-faults') {
        event.waitUntil(syncPendingFaults());
    }
});

async function syncPendingFaults() {
    const cache = await caches.open(CACHE_NAME);
    const pendingFaults = await cache.match('pending-faults');
    
    if (pendingFaults) {
        const faults = await pendingFaults.json();
        console.log('[SW] Sincronizando fallos pendientes:', faults);
        
        // Aquí iría la lógica para enviar al servidor
        // Por ahora solo eliminamos los pendientes
        await cache.delete('pending-faults');
    }
}

// Mensajes desde la página
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});