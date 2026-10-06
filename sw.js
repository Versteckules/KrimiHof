/**
 * sw.js - Service Worker für Offline-Fähigkeit (AP15)
 *
 * Strategie: "Network-First, Cache-Fallback"
 * - Online wird immer die aktuelle Version geladen (keine veralteten Dateien nach Updates)
 * - Jede erfolgreiche Antwort wird im Cache abgelegt
 * - Offline (z.B. Funkloch in der Altstadt) wird aus dem Cache bedient
 */
const CACHE_NAME = 'krimi-hof-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './config.js',
  './css/tokens.css',
  './css/base.css',
  './css/components.css',
  './css/effects.css',
  './css/debug.css',
  './data/stations.json',
  './data/story.json',
  './data/events.json',
  './data/final.json',
  './js/main.js',
  './js/answers.js',
  './js/audio.js',
  './js/clock.js',
  './js/config-loader.js',
  './js/coords.js',
  './js/debug.js',
  './js/easter-eggs.js',
  './js/geo.js',
  './js/scoring.js',
  './js/state.js',
  './js/sync.js',
  './js/timelock.js',
  './js/ui/dossier.js',
  './js/ui/final.js',
  './js/ui/landing.js',
  './js/ui/lockscreen.js',
  './js/ui/map.js',
  './js/ui/navigator.js',
  './js/ui/station.js',
  './js/ui/street-events.js',
  './js/ui/gadgets/gadget-manager.js',
  './vendor/suncalc.js',
  './vendor/qrcode.min.js',
  './vendor/leaflet/leaflet.js',
  './vendor/leaflet/leaflet.css',
  './assets/avatar.jpg',
  './assets/hero_hof_night.jpg',
  './assets/seal_schlappen.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // Einzeln cachen: eine fehlende Datei darf die Installation nicht abbrechen
      .then((cache) => Promise.all(
        ASSETS.map((url) => cache.add(url).catch((err) => console.warn('[SW] Nicht gecacht:', url, err)))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isMapTile = url.hostname.endsWith('basemaps.cartocdn.com');

  // Fremde Ressourcen (außer Kartenkacheln) nicht anfassen
  if (!isSameOrigin && !isMapTile) return;

  event.respondWith(
    fetch(req)
      .then((response) => {
        if (response && (response.ok || response.type === 'opaque')) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return response;
      })
      .catch(() => caches.match(req, { ignoreSearch: isSameOrigin }))
  );
});
