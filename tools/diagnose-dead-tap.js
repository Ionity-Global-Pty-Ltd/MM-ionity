/* ============================================================
   MojaMind — "Tap Does Nothing" Diagnostic
   Author: Johan Wilhelm van Antwerp · Ionity (Pty) Ltd / AEDI

   HOW TO USE
   1. Open the live app (https://ionity.art) or your local build.
   2. Get to the Home screen (finish onboarding if prompted).
   3. Open DevTools -> Console (F12; on Android use remote debugging).
   4. Paste this ENTIRE file, press Enter, read the VERDICT lines.
   5. Send the output back so the exact fix can be applied.
   ============================================================ */
(() => {
  const out = [];
  const log = (...a) => { out.push(a.join(' ')); console.log(...a); };

  log('%c-- MojaMind dead-tap diagnostic --', 'font-weight:bold');
  log('hash        :', location.hash || '(none)');
  log('globals     : S=' + typeof window.S,
      'routes=' + typeof window.routes,
      'nav=' + typeof window.nav,
      'MMJournal=' + typeof window.MMJournal,
      'MMI18n=' + typeof window.MMI18n);

  // 1) Locate the Writer & Journal tile (and all tiles)
  const tiles = [...document.querySelectorAll('.tile')];
  log('tiles found :', tiles.length,
      '->', tiles.map(t => t.dataset.route).join(', ') || '(none)');
  const jt = tiles.find(t => (t.dataset.route || '').includes('journal'))
          || document.querySelector('[data-route="#/journal"]');
  if (!jt) { log('%cVERDICT: no Writer/Journal tile in DOM on this screen.', 'color:#e94560'); return dump(); }

  // 2) What element actually sits at the tile's centre? (overlay test)
  const r = jt.getBoundingClientRect();
  const cx = Math.round(r.left + r.width / 2), cy = Math.round(r.top + r.height / 2);
  const top = document.elementFromPoint(cx, cy);
  const hitsTile = jt.contains(top) || top === jt;
  log('tile rect   :', JSON.stringify({ x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }));
  log('topmost@ctr :', top ? (top.tagName + '.' + (top.className || '').toString().slice(0, 40)) : '(null)');
  if (!hitsTile && top) {
    const cs = getComputedStyle(top);
    log('%cVERDICT: an OVERLAY is stealing the tap.', 'color:#e94560;font-weight:bold');
    log('   intercepting element:', top.id ? '#' + top.id : top.tagName,
        '| position:', cs.position, '| z-index:', cs.zIndex, '| pointer-events:', cs.pointerEvents);
    log('   FIX: give that element  pointer-events:none  (or lower its z-index / shrink it).');
  } else {
    log('overlay?    : none -- the tile itself is the topmost element (good).');
  }

  // 3) Is a click listener attached, and does clicking change the route?
  const before = location.hash;
  let navSeen = false;
  const origNav = window.nav;
  if (typeof origNav === 'function') { window.nav = (h) => { navSeen = true; return origNav(h); }; }
  jt.click();
  setTimeout(() => {
    if (typeof origNav === 'function') window.nav = origNav;
    const after = location.hash;
    log('click test  : nav() called =', navSeen, '| hash', before, '->', after);
    if (!navSeen && before === after) {
      log('%cVERDICT: click did NOT trigger navigation -- listener missing or a JS error broke render.', 'color:#e94560;font-weight:bold');
      log('   Check the Console for a red error stack when the Home screen rendered.');
    } else if (after.includes('journal')) {
      log('%cResult: navigation FIRED -- route reached ' + after + '. If the screen still looks dead, the bug is inside the journal route render.', 'color:#2ecc71');
    }
    // 4) Service worker / stale-cache check
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(rs => {
        log('SW regs     :', rs.length, '| controller:', !!navigator.serviceWorker.controller);
        caches.keys().then(k => {
          log('caches      :', k.join(', ') || '(none)');
          log('   If a cache name is OLDER than the current build, unregister the SW + clear caches:');
          log('   navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister())); caches.keys().then(k=>k.forEach(c=>caches.delete(c))); location.reload();');
          dump();
        });
      });
    } else { dump(); }
  }, 400);

  function dump() {
    log('%c-- copy everything above this line --', 'font-weight:bold');
    try { window.__mojaDiag = out.join('\n'); log('(also saved to window.__mojaDiag)'); } catch {}
  }
})();
