const CACHE = 'stempel-v3';
const SHELL = [
  'index.html',
  'mitarbeiter.html',
  'config.js',
  'styles.css',
  'app-kunde.js',
  'app-mitarbeiter.js',
  'manifest.webmanifest',
  'icon-180.png',
  'icon-192.png',
  'icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Eigene Dateien aus dem Cache, alles andere (Stempel-Daten, CDN) immer aus dem Netz
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then((c) => c.match(e.request, { ignoreSearch: true })).then((hit) => hit || fetch(e.request))
  );
});
