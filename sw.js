const CACHE_NAME = 'upschub-v4'; // Bump version to force update
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/version.json',
  '/offline.html', // Must be cached first
  '/images/logo_192.png',
  '/images/logo_512.png',
  '/home/UPSChub.html' // Add your main pages
];

self.addEventListener('install', event => {
  console.log('UPSChub: Installing service worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('UPSChub: Caching app shell');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(err => console.error('Cache failed:', err))
  );
  self.skipWaiting(); // Take control immediately
});

self.addEventListener('activate', event => {
  console.log('UPSChub: Activating service worker');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('UPSChub: Deleting old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  // Skip non-GET or cross-origin
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  // NAVIGATION REQUESTS (pages): Network first, offline.html fallback
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful response
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          console.log('UPSChub: Serving offline.html for', request.url);
          const cache = await caches.open(CACHE_NAME);
          const offlinePage = await cache.match(OFFLINE_URL);
          return offlinePage || new Response('Offline page not cached', { status: 503 });
        })
    );
    return;
  }

  // OTHER ASSETS: Cache-first with network fallback
  event.respondWith(
    caches.match(request)
      .then(cached => cached || fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      }))
      .catch(() => caches.match(request))
  );
});

// Manual update from your "Update Now" button
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
