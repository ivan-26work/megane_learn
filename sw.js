/* ═══════════════════════════════════════════════
   MEGANE_LEARN — Service Worker
   Cache dynamique pour mode hors ligne
═══════════════════════════════════════════════ */

const CACHE_NAME = 'megane-learn-v1';

// Fichiers à mettre en cache lors de l'installation
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/css/index.css',
  '/js/index.js',
  '/manifest.json',
  '/logo.png',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Share+Tech+Mono&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Pages circuits et cours (seront ajoutées dynamiquement)
const CIRCUIT_PAGES = [
  '/rl-serie.html',
  '/rc-serie.html',
  '/rlc-serie.html',
  '/rl-parallele.html',
  '/rc-parallele.html',
  '/rlc-parallele.html',
  '/cours-rl-serie.html',
  '/cours-rc-serie.html',
  '/cours-rlc-serie.html',
  '/cours-rl-parallele.html',
  '/cours-rc-parallele.html',
  '/cours-rlc-parallele.html',
  '/convert.html'
];

// ── INSTALLATION : mise en cache des fichiers statiques ──
self.addEventListener('install', event => {
  console.log('[SW] Installation');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// ── ACTIVATION : nettoyage des anciens caches ──
self.addEventListener('activate', event => {
  console.log('[SW] Activation');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Suppression ancien cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ── INTERCEPTION DES REQUÊTES ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Ignorer les requêtes non HTTP/HTTPS
  if (!event.request.url.startsWith('http')) return;
  
  // Stratégie : Cache d'abord, puis réseau
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then(networkResponse => {
        // Mettre en cache les pages circuits et cours
        if (CIRCUIT_PAGES.includes(url.pathname)) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback pour hors ligne
        if (url.pathname === '/' || url.pathname === '/index.html') {
          return caches.match('/index.html');
        }
        // Page hors ligne personnalisée
        return new Response(
          '<!DOCTYPE html><html><head><title>Hors ligne</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#e8ecf1;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center}</style></head><body><div><h1>📡 Hors ligne</h1><p>Vérifiez votre connexion Internet.</p><button onclick="location.reload()">Réessayer</button></div></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      });
    })
  );
});

// ── MISE À JOUR DYNAMIQUE DES PAGES ──
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_NEW_PAGE') {
    const pageUrl = event.data.url;
    if (pageUrl && !CIRCUIT_PAGES.includes(pageUrl)) {
      CIRCUIT_PAGES.push(pageUrl);
      caches.open(CACHE_NAME).then(cache => {
        fetch(pageUrl).then(response => {
          if (response.ok) cache.put(pageUrl, response);
        });
      });
    }
  }
});