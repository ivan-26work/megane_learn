/* ═══════════════════════════════════════════════
   MEGANE_LEARN — Service Worker Hors Ligne Total
   Toutes les pages sont mises en cache
   L'application fonctionne sans connexion internet
═══════════════════════════════════════════════ */

const CACHE_NAME = 'megane-learn-v3';

// TOUS les fichiers à mettre en cache
const ALL_FILES = [
  // Pages principales
  '/megane_learn/',
  '/megane_learn/index.html',
  '/megane_learn/manifest.json',
  
  // Circuits série
  '/megane_learn/rl-serie.html',
  '/megane_learn/rc-serie.html',
  '/megane_learn/rlc-serie.html',
  
  // Circuits parallèle
  '/megane_learn/rl-parallele.html',
  '/megane_learn/rc-parallele.html',
  '/megane_learn/rlc-parallele.html',
  
  // Cours série
  '/megane_learn/cours-rl-serie.html',
  '/megane_learn/cours-rc-serie.html',
  '/megane_learn/cours-rlc-serie.html',
  
  // Cours parallèle
  '/megane_learn/cours-rl-parallele.html',
  '/megane_learn/cours-rc-parallele.html',
  '/megane_learn/cours-rlc-parallele.html',
  
  // Outils
  '/megane_learn/convert.html',
  '/megane_learn/store.html',
  
  // Styles principaux
  '/megane_learn/css/index.css',
  '/megane_learn/css/structure.css',
  
  // Styles circuits série
  '/megane_learn/css/rl-serie.css',
  '/megane_learn/css/rc-serie.css',
  '/megane_learn/css/rlc-serie.css',
  
  // Styles circuits parallèle
  '/megane_learn/css/rl-parallele.css',
  '/megane_learn/css/rc-parallele.css',
  '/megane_learn/css/rlc-parallele.css',
  
  // Styles cours série
  '/megane_learn/css/cours-rl-serie.css',
  '/megane_learn/css/cours-rc-serie.css',
  '/megane_learn/css/cours-rlc-serie.css',
  
  // Styles cours parallèle
  '/megane_learn/css/cours-rl-parallele.css',
  '/megane_learn/css/cours-rc-parallele.css',
  '/megane_learn/css/cours-rlc-parallele.css',
  
  // Styles convertisseur
  '/megane_learn/css/convert.css',
  
  // Scripts principaux
  '/megane_learn/js/index.js',
  '/megane_learn/js/structure.js',
  
  // Scripts circuits série
  '/megane_learn/js/rl-serie.js',
  '/megane_learn/js/rc-serie.js',
  '/megane_learn/js/rlc-serie.js',
  
  // Scripts circuits parallèle
  '/megane_learn/js/rl-parallele.js',
  '/megane_learn/js/rc-parallele.js',
  '/megane_learn/js/rlc-parallele.js',
  
  // Scripts cours série
  '/megane_learn/js/cours-rl-serie.js',
  '/megane_learn/js/cours-rc-serie.js',
  '/megane_learn/js/cours-rlc-serie.js',
  
  // Scripts cours parallèle
  '/megane_learn/js/cours-rl-parallele.js',
  '/megane_learn/js/cours-rc-parallele.js',
  '/megane_learn/js/cours-rlc-parallele.js',
  
  // Scripts convertisseur
  '/megane_learn/js/convert.js',
  
  // Images
  '/megane_learn/images/rl-serie.png',
  '/megane_learn/images/rc-serie.png',
  '/megane_learn/images/rlc-serie.png',
  '/megane_learn/images/rl-parallele.png',
  '/megane_learn/images/rc-parallele.png',
  '/megane_learn/images/rlc-parallele.png',
  '/megane_learn/images/icon-192.png',
  '/megane_learn/images/icon-512.png',
  '/megane_learn/logo.png'
];

// Ressources externes (Google Fonts, Font Awesome)
const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Share+Tech+Mono&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

/* ── PAGE HORS LIGNE STYLISÉE ── */
const OFFLINE_PAGE = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Hors ligne - MEGANE_LEARN</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: linear-gradient(135deg, #e8ecf1 0%, #d0d5df 100%);
      font-family: 'Nunito', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    [data-theme="dark"] body {
      background: linear-gradient(135deg, #1e2330 0%, #14181f 100%);
    }
    .offline-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 32px;
      padding: 40px 32px;
      max-width: 340px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      animation: fadeInUp 0.5s ease;
    }
    [data-theme="dark"] .offline-card {
      background: rgba(30, 35, 48, 0.95);
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .offline-icon { font-size: 4.5rem; margin-bottom: 20px; animation: pulse 1.5s ease infinite; }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
    }
    .offline-title { font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; color: #2d3548; }
    [data-theme="dark"] .offline-title { color: #dce6f5; }
    .offline-text { color: #7a8499; margin-bottom: 28px; line-height: 1.5; font-size: 0.95rem; }
    [data-theme="dark"] .offline-text { color: #6a7a99; }
    .retry-btn {
      background: #4f7cff;
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 40px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .retry-btn:hover { background: #3a6bff; transform: translateY(-2px); }
    .retry-btn:active { transform: translateY(0); }
    .offline-footer { margin-top: 24px; font-size: 0.7rem; color: #a0a8b5; }
    [data-theme="dark"] .offline-footer { color: #5a6a89; }
  </style>
  <script>
    const savedTheme = localStorage.getItem('ml_theme');
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.setAttribute('data-theme', 'dark');
  </script>
</head>
<body>
  <div class="offline-card">
    <div class="offline-icon"><i class="fas fa-wifi"></i></div>
    <div class="offline-title">Hors ligne</div>
    <div class="offline-text">Vérifiez votre connexion internet et réessayez.</div>
    <button class="retry-btn" onclick="location.reload()"><i class="fas fa-sync-alt"></i> Réessayer</button>
    <div class="offline-footer"><i class="fas fa-bolt"></i> MEGANE_LEARN</div>
  </div>
</body>
</html>`;

/* ── INSTALLATION : Cache TOUS les fichiers ── */
self.addEventListener('install', event => {
  console.log('[SW] Installation - mise en cache de tous les fichiers');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        // Ajouter tous les fichiers locaux
        return cache.addAll(ALL_FILES).catch(err => {
          console.error('[SW] Erreur cache fichier:', err);
        });
      }),
      caches.open(CACHE_NAME).then(cache => {
        // Ajouter les ressources externes
        return cache.addAll(EXTERNAL_ASSETS).catch(err => {
          console.error('[SW] Erreur cache externe:', err);
        });
      })
    ])
  );
  self.skipWaiting();
});

/* ── ACTIVATION : Nettoie les anciens caches ── */
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

/* ── INTERCEPTION DES REQUÊTES : TOUT depuis le cache ── */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Ignorer les requêtes non HTTP/HTTPS
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Cache hit - retour immédiat (hors ligne possible)
        return cachedResponse;
      }
      
      // Cache miss - on va chercher sur le réseau
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        
        // Mettre en cache pour la prochaine fois
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return networkResponse;
      }).catch(err => {
        console.log('[SW] Erreur réseau:', err);
        
        // Pour les requêtes HTML, afficher la page hors ligne
        const accept = event.request.headers.get('accept');
        if (accept && accept.includes('text/html')) {
          return new Response(OFFLINE_PAGE, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        // Pour les images non trouvées en cache
        if (accept && accept.includes('image')) {
          return new Response('', { status: 404 });
        }
        
        return new Response('Vérifiez votre connexion internet', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});

/* ── MESSAGE : Communication avec la page ── */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
