// A name for your offline storage box.
// If you make major changes to the offline page, you can change 'v1' to 'v2', etc.
const CACHE_NAME = 'upschub-offline-v1';

// The single, all-in-one offline page you want to save.
const OFFLINE_URL = 'offline.html';

/**
 * The 'install' event runs when the service worker is first installed.
 * We use it to save (cache) our offline page.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // We are telling the browser to save our offline page in the "storage box".
      await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
    })()
  );
  // This makes the new service worker take control immediately.
  self.skipWaiting();
});

/**
 * The 'activate' event runs after the service worker is installed.
 * It's a good place to clean up old, unused caches.
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // This allows the service worker to control the page without needing a reload.
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }
      // Delete any old caches that don't match the current CACHE_NAME.
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })()
  );
  self.clients.claim();
});

/**
 * The 'fetch' event runs every time the browser tries to get something from the network.
 * We will check here if the user is offline and trying to navigate to a new page.
 */
self.addEventListener('fetch', (event) => {
  // We only want to intercept navigation requests (i.e., when a user clicks a link to a new page).
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // First, try to get the page from the internet.
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // If the internet request fails (user is offline), get the page from our "storage box".
          console.log('Fetch failed; returning offline page instead.', error);
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }
});
