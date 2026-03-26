/* ═══════════════════════════════════════════════
   MEGANE_LEARN — sw.js
   Service Worker PWA
   Stratégie : Cache First + Network Fallback
   Fonctionnement hors-ligne complet
═══════════════════════════════════════════════ */

const CACHE_NAME    = 'megane-learn-v1';
const BASE          = '/megane_learn';

/* ── Fichiers à mettre en cache au démarrage ── */
const PRECACHE = [
  `${BASE}/`,
  `${BASE}/index.html`,

  /* Pages circuit simulation */
  `${BASE}/rl-serie.html`,
  `${BASE}/rc-serie.html`,
  `${BASE}/rlc-serie.html`,
  `${BASE}/rl-parallele.html`,
  `${BASE}/rc-parallele.html`,
  `${BASE}/rlc-parallele.html`,

  /* Pages cours */
  `${BASE}/cours-rl-serie.html`,
  `${BASE}/cours-rc-serie.html`,
  `${BASE}/cours-rlc-serie.html`,
  `${BASE}/cours-rl-parallele.html`,
  `${BASE}/cours-rc-parallele.html`,
  `${BASE}/cours-rlc-parallele.html`,

  /* Pages annexes */
  `${BASE}/apropos.html`,
  `${BASE}/contact.html`,
  `${BASE}/faq.html`,
  `${BASE}/aide.html`,
  `${BASE}/confidentialite.html`,
  `${BASE}/convert.html`,
  `${BASE}/store.html`,

  /* CSS */
  `${BASE}/css/index.css`,
  `${BASE}/css/structure.css`,
  `${BASE}/css/rl-serie.css`,
  `${BASE}/css/rc-serie.css`,
  `${BASE}/css/rlc-serie.css`,
  `${BASE}/css/rl-parallele.css`,
  `${BASE}/css/rc-parallele.css`,
  `${BASE}/css/rlc-parallele.css`,
  `${BASE}/css/cours-rl-serie.css`,
  `${BASE}/css/cours-rc-serie.css`,
  `${BASE}/css/cours-rlc-serie.css`,
  `${BASE}/css/cours-rl-parallele.css`,
  `${BASE}/css/cours-rc-parallele.css`,
  `${BASE}/css/cours-rlc-parallele.css`,
  `${BASE}/css/convert.css`,

  /* JS */
  `${BASE}/js/index.js`,
  `${BASE}/js/structure.js`,
  `${BASE}/js/rl-serie.js`,
  `${BASE}/js/rc-serie.js`,
  `${BASE}/js/rlc-serie.js`,
  `${BASE}/js/rl-parallele.js`,
  `${BASE}/js/rc-parallele.js`,
  `${BASE}/js/rlc-parallele.js`,
  `${BASE}/js/cours-rl-serie.js`,
  `${BASE}/js/cours-rc-serie.js`,
  `${BASE}/js/cours-rlc-serie.js`,
  `${BASE}/js/cours-rl-parallele.js`,
  `${BASE}/js/cours-rc-parallele.js`,
  `${BASE}/js/cours-rlc-parallele.js`,
  `${BASE}/js/convert.js`,

  /* Assets */
  `${BASE}/logo.png`,
  `${BASE}/manifest.json`,

  /* CDN externes */
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Share+Tech+Mono&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
];

/* ═══════════════════════════════════════════════
   INSTALL — Précache de tous les fichiers
═══════════════════════════════════════════════ */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        PRECACHE.map(url =>
          cache.add(url).catch(err => {
            console.warn(`[SW] Impossible de cacher : ${url}`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

/* ═══════════════════════════════════════════════
   ACTIVATE — Nettoyage des anciens caches
═══════════════════════════════════════════════ */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log(`[SW] Suppression ancien cache : ${key}`);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

/* ═══════════════════════════════════════════════
   FETCH — Stratégie Cache First
   1. Cache → retourne immédiatement (rapide)
   2. Réseau → met à jour le cache en arrière-plan
   3. Hors-ligne → retourne le cache ou la page offline
═══════════════════════════════════════════════ */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;

  // Ignorer les requêtes chrome-extension et autres protocoles
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      // ── Stratégie : Stale While Revalidate ──
      // Retourner le cache immédiatement + mettre à jour en arrière-plan
      const networkFetch = fetch(event.request)
        .then(networkResponse => {
          // Mettre en cache la nouvelle réponse
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Hors-ligne : retourner le cache ou page fallback
          if (cached) return cached;
          // Si page HTML manquante, retourner index
          if (event.request.destination === 'document') {
            return caches.match(`${BASE}/index.html`);
          }
        });

      // Si on a du cache, retourner immédiatement (+ mise à jour silencieuse)
      return cached || networkFetch;
    })
  );
});

/* ═══════════════════════════════════════════════
   MESSAGE — Forcer la mise à jour du cache
═══════════════════════════════════════════════ */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ cleared: true });
    });
  }
});

/* ═══════════════════════════════════════════════
   BACKGROUND SYNC — Synchronisation différée
   (pour les actions effectuées hors-ligne)
═══════════════════════════════════════════════ */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

async function syncFavorites() {
  // Les favoris sont en localStorage, rien à synchroniser côté serveur
  // Prêt pour une future API si besoin
  console.log('[SW] Sync favoris effectué');
}
