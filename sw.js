
const CACHE_NAME = 'math-mole-cache-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './src/app.component.html',
  './src/app.component.ts',
  './src/components/mole.component.ts',
  './src/components/particle-effect.component.ts',
  './src/services/game.store.ts',
  './src/assets/icons/icon-192.png',
  './src/assets/icons/icon-512.png',
];

// Install the service worker and cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Clean up old caches on activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response, else fetch from network
        return response || fetch(event.request);
      })
  );
});
