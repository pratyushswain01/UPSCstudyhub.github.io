const cacheName = 'upschub-v3'; // Increment this (v4, v5...) whenever you push a manual update

// Essential files to cache for offline start
const staticAssets = [
  './',
  './index.html',
  './manifest.json',
  './version.json',
  './images/logo_192.png',
  './images/logo_512.png'
];

// 1. INSTALL: Pre-cache the basic app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('UPSChub: Pre-caching app shell');
      return cache.addAll(staticAssets);
    })
  );
  // Important: We don't call skipWaiting() here automatically anymore
  // so that our manual "Update Now" button has full control.
});

// 2. ACTIVATE: Clean up OLD caches (v1, v2, etc.)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName)
            .map(key => {
              console.log('UPSChub: Deleting old cache', key);
              return caches.delete(key);
            })
      );
    })
  );
  return self.clients.claim(); // Immediately takes control of all open pages
});

// 3. FETCH: Network-First Strategy
// This ensures students see the latest notes if online, but works offline too.
self.addEventListener('fetch', e => {
  // Skip cross-origin requests
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // If we got the page, save a copy in the cache
        const resClone = res.clone();
        caches.open(cacheName).then(cache => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => {
        // If internet fails, look for the page in our cache
        return caches.match(e.request);
      })
  );
});

// 4. MANUAL UPDATE SIGNAL: Listen for the "Update Now" click from index.html
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
