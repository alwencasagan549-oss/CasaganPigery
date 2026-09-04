const CACHE_NAME = 'casaganpigery-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through fetch to satisfy PWA install requirements
  event.respondWith(fetch(event.request).catch(() => {
    // Optional offline fallback could go here
    return new Response('Offline mode');
  }));
});
