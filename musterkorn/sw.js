const CACHE = 'musterkorn-v2';
const SHELL = [
  'index.html',
  'mitarbeiter.html',
  'config.js',
  'styles.css',
  'app-mitarbeiter.js',
  'manifest.webmanifest',
  'icon-180.png',
  'icon-192.png',
  'icon-512.png',
  'img/hero-brote.jpg',
  'img/landbrot.jpg',
  'img/vollkornbrot.jpg',
  'img/kastenweissbrot.jpg',
  'img/croissant.jpg',
  'img/schokobroetchen.jpg',
  'img/cookies.jpg',
  'img/donuts.jpg',
  'img/schokotorte.jpg',
  'img/theke.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Seiten und Skripte zuerst aus dem Netz (neue Angebote kommen sofort an), offline aus dem Cache.
// Bilder zuerst aus dem Cache. Stempel-Daten und CDN laufen nie über den Cache.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  if (e.request.destination === 'image') {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(url.pathname, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
