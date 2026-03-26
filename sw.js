const CACHE_NAME = 'megane-learn-v2';
const urlsToCache = [
  '/megane_learn/',
  '/megane_learn/index.html',
  '/megane_learn/rl-serie.html',
  '/megane_learn/rc-serie.html',
  '/megane_learn/rlc-serie.html',
  '/megane_learn/rl-parallele.html',
  '/megane_learn/rc-parallele.html',
  '/megane_learn/rlc-parallele.html',
  '/megane_learn/convert.html',
  '/megane_learn/store.html',
  '/megane_learn/css/index.css',
  '/megane_learn/css/structure.css',
  '/megane_learn/css/rl-serie.css',
  '/megane_learn/css/rc-serie.css',
  '/megane_learn/css/rlc-serie.css',
  '/megane_learn/js/index.js',
  '/megane_learn/js/structure.js',
  '/megane_learn/js/rl-serie.js',
  '/megane_learn/js/rc-serie.js',
  '/megane_learn/js/rlc-serie.js',
  '/megane_learn/images/icon-192.png',
  '/megane_learn/images/icon-512.png',
  '/megane_learn/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
