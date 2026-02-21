const cacheName = 'upschub-v3';

// We only "pre-cache" the home page. 
// The other 100+ pages will be cached automatically as the user visits them.
const staticAssets = [
  './',
  './index.html',
  './images/logo_192.png' 
];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

// The Fetch logic: 
// 1. Try to get the latest version from the internet.
// 2. If successful, save a copy in the background.
// 3. If the internet fails, show the saved copy from the cache.
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(cacheName).then(cache => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
