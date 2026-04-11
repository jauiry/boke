// Service Worker for PWA - 离线缓存支持

const CACHE_NAME = 'mxqys-blog-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 请求拦截 - 网络优先，缓存 fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API 请求不缓存
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 图片请求 - 缓存优先
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        }).catch(() => {
          // 图片加载失败返回占位图
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#7c3aed" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="24">图片</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        });
      })
    );
    return;
  }

  // 页面和静态资源 - 网络优先
  event.respondWith(
    fetch(request)
      .then((response) => {
        // 缓存成功的响应
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败，从缓存返回
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // 缓存也没有，返回离线页面
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// 推送通知支持（未来扩展）
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title || '新文章', {
        body: data.body || '博客有新内容更新',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: data.url,
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});
