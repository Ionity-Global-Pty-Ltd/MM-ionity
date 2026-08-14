/* MojaMind service worker — offline-first PWA
   © IONITY Global (Pty) Ltd */
'use strict';

const VERSION = 'mojamind-v2.8.1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/data.js',
  './js/vault.js',
  './js/nlp.js',
  './js/llm.js',
  './js/voice.js',
  './js/soundscape.js',
  './js/draw.js',
  './js/journal.js',
  './js/portfolio.js',
  './js/video.js',
  './js/game.js',
  './js/game3d.js',
  './js/bubble.js',
  './js/app.js',
  './icons/favicon.svg',
  './assets/branding/ionity-logo.svg',
  './assets/branding/ionity-global.png',
  './assets/branding/ionity-global-white.png',
  './assets/branding/shout-colour-cloud.png',
  './assets/branding/shout-it-now-logo.png',
  './assets/partners/stellenbosch-transparent.png',
  './assets/partners/stellenbosch.png',
  './assets/partners/stellenbosch-transparent.svg',
  './assets/partners/stellenbosch.webp',
  './assets/partners/gilead.svg',
  './assets/partners/gilead.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Inspiration videos: network-only, never pre-cached or stored.
  // They are large, they stream on demand, and participants are on data
  // vouchers — silently filling the cache with 130 MB of MP4 would be rude.
  if (url.origin === location.origin && url.pathname.includes('/assets/videos/')) return;

  // Range requests (media seeking) must bypass the cache entirely.
  if (req.headers.has('range')) return;

  // App shell: cache-first
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req, { ignoreSearch: true }).then(hit =>
        hit ||
        fetch(req).then(res => {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
          return res;
        }).catch(() => caches.match('./index.html'))
      )
    );
    return;
  }

  // Fonts & CDN: stale-while-revalidate
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(
      caches.open(VERSION + '-ext').then(async c => {
        const hit = await c.match(req);
        const net = fetch(req).then(res => { c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      })
    );
  }
});
