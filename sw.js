/**
 * sw.js - Service Worker für Offline-Fähigkeit (AP15)
 *
 * Strategie: "Network-First, Cache-Fallback"
 * - Online wird immer die aktuelle Version geladen (keine veralteten Dateien nach Updates)
 * - Jede erfolgreiche Antwort wird im Cache abgelegt
 * - Offline (z.B. Funkloch in der Altstadt) wird aus dem Cache bedient
 */
const CACHE_NAME = 'krimi-hof-v10';
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
  './js/station-dialogues.js',
  './js/coords.js',
  './js/debug.js',
  './js/easter-eggs.js',
  './js/geo.js',
  './js/scoring.js',
  './js/state.js',
  './js/sync.js',
  './js/timelock.js',
  './js/ui/dialogue.js',
  './js/ui/dossier.js',
  './js/ui/final.js',
  './js/ui/intro.js',
  './js/ui/landing.js',
  './js/ui/lockscreen.js',
  './js/ui/map.js',
  './js/ui/navigator.js',
  './js/ui/station.js',
  './js/ui/street-events.js',
  './js/ui/trackables.js',
  './js/ui/gadgets/ambigram.js',
  './js/ui/gadgets/briefcase.js',
  './js/ui/gadgets/coaster.js',
  './js/ui/gadgets/cryptowheel.js',
  './js/ui/gadgets/dice.js',
  './js/ui/gadgets/fake-call.js',
  './js/ui/gadgets/gadget-manager.js',
  './js/ui/gadgets/laser.js',
  './js/ui/gadgets/letter.js',
  './js/ui/gadgets/mugshot.js',
  './js/ui/gadgets/polaroid.js',
  './js/ui/gadgets/scanner.js',
  './js/ui/gadgets/scratch.js',
  './js/ui/gadgets/stealth.js',
  './js/ui/gadgets/time-slider.js',
  './js/ui/gadgets/uv-light.js',
  './js/ui/gadgets/whisper.js',
  './js/ui/gadgets/wiretap.js',
  './vendor/suncalc.js',
  './vendor/qrcode.min.js',
  './vendor/leaflet/leaflet.js',
  './vendor/leaflet/leaflet.css',
  './assets/avatar.jpg',
  './assets/hero_hof_night.jpg',
  './assets/seal_schlappen.jpg',
  './assets/soundtrack.mp3'
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
