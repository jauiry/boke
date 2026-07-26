// Service Worker v2 — improved caching strategy
const CACHE_NAME = 'mxqys-blog-v2';
const MAX_CACHE_ENTRIES = 50;

// Prune old cache entries to prevent unlimited growth
async function pruneCache(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > MAX_CACHE_ENTRIES) {
    const toDelete = keys.slice(0, keys.length - MAX_CACHE_ENTRIES);
    await Promise.all(toDelete.map(k => cache.delete(k)));
  }
}

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/', '/manifest.json']);
    })
  );
  self.skipWaiting();
});

// Activate — purge old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Helper: stale-while-revalidate
function staleWhileRevalidate(request, cacheName) {
  return caches.match(request).then((cached) => {
    const fetchPromise = fetch(request).then((response) => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(request, clone);
          pruneCache(cacheName);
        });
      }
      return response;
    }).catch(() => cached);
    return cached || fetchPromise;
  });
}

// Helper: cache-first for images
function cacheFirst(request, cacheName) {
  return caches.match(request).then((cached) => {
    if (cached) return cached;
    return fetch(request).then((response) => {
      const clone = response.clone();
      caches.open(cacheName).then((cache) => {
        cache.put(request, clone);
        pruneCache(cacheName);
      });
      return response;
    }).catch(() => {
      return new Response(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect fill="#a83f32" width="400" height="200"/><text x="200" y="110" text-anchor="middle" fill="white" font-size="20" font-family="system-ui">Image</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    });
  });
}

// Fetch
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip API requests
  if (url.pathname.startsWith('/api/')) return;

  // Images: cache-first
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, CACHE_NAME));
    return;
  }

  // Fonts: cache-first
  if (request.destination === 'font') {
    event.respondWith(cacheFirst(request, CACHE_NAME));
    return;
  }

  // Pages & static assets: stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request, CACHE_NAME));
});

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title || '新文章', {
        body: data.body || '博客有新内容更新',
        icon: '/icon-192.svg',
        data: data.url,
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});
