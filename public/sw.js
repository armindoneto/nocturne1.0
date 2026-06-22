const CACHE_NAME = 'nocturne-v1.1.0';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Pre-cache warning:', err);
      });
    })
  );
  // Activate right away without waiting
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Let network take priority, then cache. This is safe and prevents stuck loads.
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
      .then((response) => response || new Response('Offline', { status: 503 }))
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
