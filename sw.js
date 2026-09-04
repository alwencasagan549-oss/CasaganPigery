const CACHE_NAME = 'casagan-pigery-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/assets/logo-192x192.png',
  '/assets/logo-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only intercept same-origin GET requests
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Only intercept requests for pre-cached static assets.
  // Dynamic assets, pages, and other resources must bypass the service worker
  // to avoid being blocked by InfinityFree's security challenge system.
  const isPreCached = ASSETS_TO_CACHE.includes(url.pathname);
  if (!isPreCached) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
