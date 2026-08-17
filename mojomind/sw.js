/* ============================================================
   MojaMind Service Worker — High-Performance Offline-First PWA
   Strategies:
   1. Cache-First: Static immutable assets (icons, branding images, fonts)
   2. Stale-While-Revalidate: App code & scripts (index, app.js, data, css)
   3. LRU Cache Size Limiter: Keeps storage lean and prevents slowdowns
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za · www.ionity.today
   ============================================================ */
'use strict';

const CACHE_VERSION = 'mojamind-v3.5.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const MAX_RUNTIME_ITEMS = 60;

/* ── App SHELL only ────────────────────────────────────────
   Precache the minimum needed for first paint + onboarding.
   Heavy feature modules (draw, game, game3d, bubble, merge,
   video, soundscape, journal, portfolio, pixelthoughts) are
   loaded on demand via ensureModule() and cached lazily by the
   runtime handler below. This prevents the "download the whole
   app in one shot" install lag on low-end devices.            */
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/data.js',
  './js/vault.js',
  './js/sync.js',
  './js/nlp.js',
  './js/llm.js',
  './js/voice.js',
  './js/app.js',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './assets/branding/ionity-logo.svg',
  './assets/branding/mojomind-flower.svg',
  './assets/branding/ionity-global.png',
  './assets/branding/ionity-global-white.png',
  './assets/branding/shout-colour-cloud.png',
  './assets/branding/shout-it-now-logo.png',
  './assets/partners/stellenbosch-transparent.svg',
  './assets/partners/stellenbosch-transparent.png',
  './assets/partners/stellenbosch.png',
  './assets/partners/stellenbosch.webp',
  './assets/partners/gilead.svg',
  './assets/partners/gilead.png',
];

/* ── LRU Dynamic Cache Size Limiter ───────────────────────── */
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxItems);
  }
}

/* ── Install & Pre-cache ──────────────────────────────────── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ── Activation & Old Cache Cleanup ───────────────────────── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch Handlers ───────────────────────────────────────── */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Large video streams: Network only (never bloat client cache)
  if (url.origin === location.origin && url.pathname.includes('/assets/videos/')) return;

  // Range requests (media seeking) bypass cache
  if (req.headers.has('range')) return;

  // Static Assets (Icons, Images, Fonts): Cache-First Strategy
  const isStatic = /\.(png|jpg|jpeg|svg|webp|ico|woff|woff2|ttf|eot)$/i.test(url.pathname) ||
                   /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);

  if (isStatic) {
    e.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          if (!res || res.status !== 200 || res.type === 'opaque') return res;
          const copy = res.clone();
          caches.open(STATIC_CACHE).then(cache => {
            cache.put(req, copy);
            limitCacheSize(STATIC_CACHE, 80);
          });
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // App Shell & Code (HTML, CSS, JS): Network-First (with offline cache fallback)
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req).then(networkRes => {
        if (networkRes && networkRes.status === 200) {
          const copy = networkRes.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(req, copy);
            limitCacheSize(RUNTIME_CACHE, MAX_RUNTIME_ITEMS);
          });
        }
        return networkRes;
      }).catch(() => caches.match(req).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }
});
