/* ============================================================
   MojaMind — Creative Resilience PWA
   App shell, router, state and screens.
   Pathing per the Aug 2026 design update:
   Splash → Sign In → Terms (Accept) → Demographics → Welcome → Home
   Home → Instructions | Support | Pre-Survey | Art* | Chat* | Post-Survey
   (* availability depends on study group: G1 surveys only,
      G2 adds art, G3 adds chat)
   © IONITY Global (Pty) Ltd.
   ============================================================ */
'use strict';

/* ── Icons (inline SVG - Uniform 24x24 geometry, 2px stroke) ─ */
const I = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/></svg>',
  headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13a8 8 0 0 1 16 0"/><rect x="2.5" y="13" width="4" height="7" rx="2"/><rect x="17.5" y="13" width="4" height="7" rx="2"/><path d="M19.5 20a4 4 0 0 1-4 2h-2"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><path d="M9 12h6M9 16h6"/></svg>',
  clipboardCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1H9z"/><path d="m9 13.5 2.2 2.2L15.5 11"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1H9z"/><path d="M9 11h6M9 15h6"/></svg>',
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 1 9-9c0 2.2-1.8 3-3.5 3H15a2 2 0 0 0-1.4 3.4c.6.6.4 2.6-1.6 2.6Z"/><circle cx="7.5" cy="11.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="10.5" cy="7.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="7.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="18" cy="11.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8 8 0 0 1-8 8H4l2.3-2.9A8 8 0 1 1 21 11.5Z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v2a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 4.2 2 2 0 0 1 5.1 2h2a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.25a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.54.84l10-6.5a1 1 0 0 0 0-1.68l-10-6.5A1 1 0 0 0 8 5.5Z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h2.4l1.2-2.4A1 1 0 0 1 8.5 5h7a1 1 0 0 1 .9.6L17.6 8H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="14" r="3.4"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  heart: (on) => `<svg viewBox="0 0 24 24" fill="${on ? '#f3256b' : '#c9c3d1'}"><path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.3 4.9 6 4.5c2-.2 3.9.8 6 3 2.1-2.2 4-3.2 6-3 3.7.4 5.6 4.1 4 7.2C19.5 16.3 12 21 12 21Z"/></svg>`,
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.3 4.3 6 6M18 18l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.3 19.7 6 18M18 6l1.7-1.7"/></svg>',
  shieldHeart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-3.6 8-10V5.2L12 2 4 5.2V12c0 6.4 8 10 8 10Z"/><path d="M12 15.5s-3.2-2-4.2-4c-.7-1.3.1-2.9 1.7-3 .9-.1 1.7.4 2.5 1.3.8-.9 1.6-1.4 2.5-1.3 1.6.1 2.4 1.7 1.7 3-1 2-4.2 4-4.2 4Z"/></svg>',
  chatHeart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8 8 0 0 1-8 8H4l2.3-2.9A8 8 0 1 1 21 11.5Z"/><path d="M13 13.5s-2.6-1.6-3.4-3.2c-.5-1 .1-2.3 1.4-2.4.7 0 1.3.3 2 1 .7-.7 1.3-1 2-1 1.3.1 1.9 1.4 1.4 2.4-.8 1.6-3.4 3.2-3.4 3.2Z"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8v13"/><path d="M12 8s-4.5.2-5.5-2C5.8 4.4 7.4 3 9 3.5 11 4.2 12 8 12 8Zm0 0s4.5.2 5.5-2c.7-1.6-.9-3-2.5-2.5C13 4.2 12 8 12 8Z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>',
  keyIc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4.5"/><path d="m11.2 11.8 8.3-8.3M17 6l2.5 2.5M14 9l2.5 2.5"/></svg>',
  reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 2.6-6.4"/><path d="M3 4v4h4"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.7a2 2 0 0 0 1.3 1.3L21 11l-5.8 2a2 2 0 0 0-1.3 1.3L12 20l-1.9-5.7a2 2 0 0 0-1.3-1.3L3 11l5.8-2a2 2 0 0 0 1.3-1.3L12 2Z"/><circle cx="19" cy="5" r="1.6"/><circle cx="5" cy="19" r="1.3"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6a2 2 0 0 0 0 2.8l.6.6a2 2 0 0 0 2.8 0l5.7-5.7a4.5 4.5 0 0 0 5.6-6l-3 3-2.8-.7-.7-2.8Z"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2.5" width="6" height="11.5" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5M8.5 21.5h7"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2.5"/></svg>',
  a11y: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.6" r="2.1"/><path d="M4.5 8.6c2.5.8 5 1.2 7.5 1.2s5-.4 7.5-1.2"/><path d="M12 9.8v4.4M12 14.2l-2.8 6M12 14.2l2.8 6"/></svg>',
  ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2.5 2.5 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2.5 2.5 0 0 0 0-6Z"/><path d="M13 5v2M13 11v2M13 17v2"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="m15.5 10.5 6-3.5v10l-6-3.5"/></svg>',
  handHeart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8.5s-2.4-1.6-3.2-3c-.5-1 .1-2.2 1.3-2.3.7 0 1.3.4 1.9 1 .6-.6 1.2-1 1.9-1 1.2.1 1.8 1.3 1.3 2.3-.8 1.4-3.2 3-3.2 3Z"/><path d="M3 14.5h3l3.2 1.4c.7.3 1.1 1 .9 1.8-.2.9-1.1 1.4-2 1.2l-2.1-.6"/><path d="M9.5 18.4 15 20l6-2.6c.8-.4 1.1-1.4.6-2.1-.4-.6-1.1-.8-1.8-.6L16 16"/></svg>',
  brush: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z"/><path d="M6.5 14c-1.9 0-3.5 1.6-3.5 3.5 0 1-.4 2-1 2.7 1 .5 2 .8 3 .8 2.5 0 4.5-2 4.5-4.5A2.5 2.5 0 0 0 6.5 14Z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-3.6 8-10V5.2L12 2 4 5.2V12c0 6.4 8 10 8 10Z"/><path d="m8.6 12 2.3 2.3 4.5-4.6"/></svg>',
  brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 3.5A2.5 2.5 0 0 0 7 6a2.5 2.5 0 0 0-1.6 4.4A2.6 2.6 0 0 0 6 15.4 2.5 2.5 0 0 0 8.5 19a2.3 2.3 0 0 0 3.5-2V5a1.6 1.6 0 0 0-2.5-1.5Z"/><path d="M14.5 3.5A2.5 2.5 0 0 1 17 6a2.5 2.5 0 0 1 1.6 4.4A2.6 2.6 0 0 1 18 15.4 2.5 2.5 0 0 1 15.5 19a2.3 2.3 0 0 1-3.5-2"/></svg>',
  gamepad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"/></svg>',
  journal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10M6 14h6"/></svg>',
};

/* Official Ionity & Mojo Mind color palette */
const SHOUT_COLORS = ['#3366FF', '#00d2ff', '#ffd166', '#8a2eae', '#34c759'];

/* Official Mojo Mind brand emblem */
function flowerSVG(size = 34, opts = {}) {
  return `<img src="./assets/branding/mojomind-flower.png" alt="Mojo Mind" width="${size}" height="${size}" class="brand-flower-img" style="width:${size}px;height:${size}px;object-fit:contain;filter:drop-shadow(0 3px 10px rgba(51,102,255,0.5));display:inline-block;vertical-align:middle" />`;
}

/* Official Mojo Mind logo mark — Smooth transparent brand lockup */
function knotSVG(size = 130) {
  return `<img src="./assets/branding/mojomind-logo.png" alt="Mojo Mind" class="auth-logo mm-brand-logo" style="width:${size}px;height:auto;max-width:100%;object-fit:contain;filter:drop-shadow(0 10px 28px rgba(51,102,255,0.5));display:inline-block;background:transparent;border:none;box-shadow:none" />`;
}

function mojoLogoHTML(size = 140, extraClass = '') {
  return `<img src="./assets/branding/mojomind-logo.png" alt="Mojo Mind" class="auth-logo mm-brand-logo ${extraClass}" style="width:${size}px;height:auto;max-width:100%;object-fit:contain;filter:drop-shadow(0 10px 28px rgba(51,102,255,0.5));display:inline-block;background:transparent;border:none;box-shadow:none" />`;
}

function faceSVG(kind, color, size = 62) {
  const mouth = kind === 'good' ? '<path class="mouth" d="M20 36 Q31 46 42 36" />'
    : kind === 'meh' ? '<path class="mouth" d="M21 39 H41" />'
    : '<path class="mouth" d="M20 42 Q31 33 42 42" />';
  return `<svg viewBox="0 0 62 62" width="${size}" height="${size}" class="face face-${kind}" fill="none" stroke="${color}" stroke-width="3.4" stroke-linecap="round" aria-hidden="true">
    <g class="face-content">
      <circle class="face-ring" cx="31" cy="31" r="27.5"/>
      <g class="eyes">
        <circle class="eye eye-left" cx="22.5" cy="24" r="1.6" fill="${color}" stroke="none"/>
        <circle class="eye eye-right" cx="39.5" cy="24" r="1.6" fill="${color}" stroke="none"/>
      </g>
      ${mouth}
    </g>
  </svg>`;
}

/* ── State ───────────────────────────────────────────────────
   Everything lives on the device, encrypted at rest by the
   vault (js/vault.js). `save()` stays synchronous to call —
   the vault debounces and encrypts the write behind it.       */
const blankState = () => ({
  auth: null,
  group: null,               // 1 | 2 | 3 — study group (feature availability)
  consented: false,
  demographics: null,        // {answers, completedAt}
  onboarded: false,          // welcome screen seen (after demographics)
  surveys: { pre: {}, post: {} }, // pre.mental = {answers, completedAt}
  drafts: {},                // draft answers per runner key
  moods: [],                 // {mood, note, at}
  lastMoodPrompt: 0,
  activities: {},            // id -> {option, uploads[], voice[], reflections{}, submittedAt}
  chat: { group: {}, individual: {} }, // scope -> actId -> [{who, text, at}]
  chatRead: {},
  agentQueue: {},            // `${scope}:${actId}` -> {requestedAt, joinedAt}
  tickets: [],               // {ref, kind, subject, detail, status, createdAt, source}
  riskFlags: [],             // {phase, total, q9, at, ticketRef}
  a11y: { textScale: 1, highContrast: false, reduceMotion: false },
  ai: { transformer: false, model: 'distilbert', voiceNav: false, predictive: true, vision: true },
  usage: { routes: {}, transitions: {}, hours: {}, recent: [] },
  groupChanges: [],          // {from, to, at} — audit of study-group changes
  adminMode: false,
  game: { blooms: 0, serenity: 0, sound: true, flowers: [], totalPlayMs: 0, wormsHydrated: 0, antsHydrated: 0, megaBlooms: 0, rainStars: 0 }, // Moja Meadow
  game3d: { highScore: 0, pollen: 0, sunrays: 0, sound: true, bestDistance: 0, crashes: 0, totalFlights: 0 }, // Moja Bee 3D
  gameBubble: { highScore: 0, bubblesPopped: 0, combos: 0, totalGames: 0, sound: true }, // Moja Pop Bubble Odyssey
  journal: [],
  startedAt: null,
});
let S = blankState();
globalThis.S = S;

/** Normalise anything loaded from an older build. */
function hydrate(loaded) {
  const s = Object.assign(blankState(), loaded || {});
  // v1 participants had no group concept — they had everything.
  if (s.auth && !s.group) s.group = 3;
  if (!s.a11y) s.a11y = { textScale: 1, highContrast: false, reduceMotion: false };
  if (!s.ai) s.ai = { transformer: false, model: 'distilbert', voiceNav: false, predictive: true, vision: true, voice: { persona: 'warmth', speed: 0.95, pitch: 0.99, whisperModel: 'tiny', chime: true } };
  if (!s.usage) s.usage = { routes: {}, transitions: {}, hours: {}, recent: [] };
  if (!s.groupChanges) s.groupChanges = [];
  if (!s.chat) s.chat = { group: {}, individual: {} };
  if (!s.game) s.game = { blooms: 0, serenity: 0, sound: true, flowers: [], totalPlayMs: 0, wormsHydrated: 0, antsHydrated: 0, megaBlooms: 0, rainStars: 0 };
  if (s.game.totalPlayMs == null) s.game.totalPlayMs = 0;
  if (!s.game3d) s.game3d = { highScore: 0, pollen: 0, sunrays: 0, sound: true, bestDistance: 0, crashes: 0, totalFlights: 0 };
  if (!s.gameBubble) s.gameBubble = { highScore: 0, bubblesPopped: 0, combos: 0, totalGames: 0, sound: true };
  if (!s.journal) s.journal = [];
  globalThis.S = s;
  return s;
}

function save() {
  globalThis.S = S;
  Vault.write(S);
}

/* Derived flags */
const groupOf  = () => MM.GROUPS[S.group] || MM.GROUPS[3];
const hasArt   = () => !!groupOf().art;
const hasChat  = () => !!groupOf().chat;
const preDone  = () => MM.PRE_SURVEYS.every(id => S.surveys.pre[id]?.completedAt);
const postDone = () => MM.POST_SURVEYS.every(id => S.surveys.post[id]?.completedAt);
const artOpen  = () => hasArt() && preDone();
const chatOpen = () => (hasChat() && preDone()) || S.adminMode;
const postOpen = () => preDone();
const actState = id => S.activities[id] || null;
const actsDone = () => MM.ACTIVITIES.filter(a => actState(a.id)?.submittedAt).length;

/* ── Tiny DOM helpers ────────────────────────────────────── */
const $ = sel => document.querySelector(sel);
const app = $('#app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pick = arr => (arr && arr.length ? arr[Math.floor(Math.random() * arr.length)] : null);
const rnd = (a, b) => a + Math.random() * (b - a);
const rndInt = (a, b) => Math.floor(rnd(a, b + 1));
const hexA = (hex, a) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

function toast(msg, ms = 2600) {
  const root = $('#toast-root');
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  root.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 350); }, ms);
}

function modal(html, { onClose } = {}) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-veil"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;
  const veil = root.firstElementChild;
  veil.addEventListener('click', e => { if (e.target === veil) closeModal(onClose); });
  return veil.firstElementChild;
}
function closeModal(cb) { $('#modal-root').innerHTML = ''; cb && cb(); }

/* ── Accessibility engine ────────────────────────────────── */
function applyA11y() {
  const a = S.a11y || {};
  const phone = $('#phone');
  if (phone) phone.style.zoom = a.textScale && a.textScale !== 1 ? a.textScale : '';
  document.body.classList.toggle('hc', !!a.highContrast);
  document.body.classList.toggle('rm', !!a.reduceMotion);
}
function motionReduced() {
  return S.a11y?.reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function a11yModal() {
  const a = S.a11y;
  const m = modal(`
    <h3>♿ ${esc(MM.A11Y.title)}</h3>
    <p style="font-size:12.8px;line-height:1.65;color:#ffffff;margin:0 0 14px">${esc(MM.A11Y.statement)}</p>
    <div class="a11y-row">
      <span>Text size</span>
      <div class="a11y-seg" role="group" aria-label="Text size">
        <button data-scale="1"    class="${a.textScale === 1 ? 'active' : ''}"    aria-pressed="${a.textScale === 1}">A</button>
        <button data-scale="1.12" class="${a.textScale === 1.12 ? 'active' : ''}" aria-pressed="${a.textScale === 1.12}" style="font-size:15px">A</button>
        <button data-scale="1.25" class="${a.textScale === 1.25 ? 'active' : ''}" aria-pressed="${a.textScale === 1.25}" style="font-size:18px">A</button>
      </div>
    </div>
    <div class="a11y-row">
      <span>High contrast</span>
      <label class="switch"><input id="a11y-hc" type="checkbox" ${a.highContrast ? 'checked' : ''} /><span class="knob"></span></label>
    </div>
    <div class="a11y-row">
      <span>Reduce motion</span>
      <label class="switch"><input id="a11y-rm" type="checkbox" ${a.reduceMotion ? 'checked' : ''} /><span class="knob"></span></label>
    </div>
    <div class="modal-btns"><button class="btn btn-primary" id="a11y-done">Done</button></div>
  `);
  m.querySelectorAll('[data-scale]').forEach(b => b.addEventListener('click', () => {
    S.a11y.textScale = parseFloat(b.dataset.scale); save(); applyA11y();
    m.querySelectorAll('[data-scale]').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', x === b); });
  }));
  m.querySelector('#a11y-hc').addEventListener('change', e => { S.a11y.highContrast = e.target.checked; save(); applyA11y(); });
  m.querySelector('#a11y-rm').addEventListener('change', e => { S.a11y.reduceMotion = e.target.checked; save(); applyA11y(); });
  m.querySelector('#a11y-done').onclick = () => closeModal();
}

/* ── FX engine — confetti + Click Aura “Jump Forth” ─────── */
const FX = (() => {
  const cv = $('#fx'), ctx = cv.getContext('2d');
  const fit = () => { cv.width = innerWidth; cv.height = innerHeight; };
  fit(); addEventListener('resize', fit);
  const palettes = [
    ['#00a651', '#f58220', '#ed1c24', '#2e3192', '#ffffff'],
    ['#f58220', '#ed1c24', '#2e3192', '#00a651', '#ffd166'],
    ['#2e3192', '#00a651', '#f58220', '#ed1c24', '#fbc9e4'],
    ['#ed1c24', '#2e3192', '#00a651', '#f58220', '#ffffff'],
  ];
  const auraModes = ['bloom', 'care', 'spiral', 'starlight'];
  let lastAura = -1;
  let parts = [], running = false;

  function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter(p => (p.life -= p.decay) > 0);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += p.g || 0; p.r += p.vr || 0;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
      ctx.translate(p.x, p.y); ctx.rotate(p.r || 0);
      if (p.kind === 'rect') {
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .62);
      } else if (p.kind === 'petal') {
        ctx.fillStyle = p.c; ctx.beginPath();
        ctx.ellipse(0, -p.s * .5, p.s * .34, p.s * .78, 0, 0, 7); ctx.fill();
      } else if (p.kind === 'heart') {
        const s = p.s; ctx.fillStyle = p.c; ctx.beginPath();
        ctx.moveTo(0, s * .34);
        ctx.bezierCurveTo(s * .55, -s * .3, s * 1.15, s * .22, 0, s);
        ctx.bezierCurveTo(-s * 1.15, s * .22, -s * .55, -s * .3, 0, s * .34);
        ctx.fill();
      } else if (p.kind === 'ring') {
        p.s += p.grow;
        ctx.strokeStyle = p.c; ctx.lineWidth = Math.max(.6, 2.4 * p.life);
        ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 7); ctx.stroke();
      } else if (p.kind === 'spark') {
        ctx.strokeStyle = p.c; ctx.lineWidth = Math.max(.7, 1.8 * p.life);
        ctx.beginPath();
        ctx.moveTo(-p.s, 0); ctx.lineTo(p.s, 0);
        ctx.moveTo(0, -p.s); ctx.lineTo(0, p.s);
        ctx.moveTo(-p.s * .55, -p.s * .55); ctx.lineTo(p.s * .55, p.s * .55);
        ctx.moveTo(p.s * .55, -p.s * .55); ctx.lineTo(-p.s * .55, p.s * .55);
        ctx.stroke();
      } else if (p.kind === 'dot') {
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 7); ctx.fill();
      }
      ctx.restore();
    }
    if (parts.length) requestAnimationFrame(loop);
    else { running = false; ctx.clearRect(0, 0, cv.width, cv.height); }
  }
  const add = arr => { parts.push(...arr); if (!running && parts.length) { running = true; requestAnimationFrame(loop); } };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const rndInt = (a, b) => Math.floor(rnd(a, b + 1));

  /* Click Aura: every tap gets a different bloom, care, spiral or starlight signature. */
  function burst(x, y) {
    if (motionReduced()) return;
    let modeIndex = rndInt(0, auraModes.length - 2);
    if (modeIndex >= lastAura) modeIndex++;
    lastAura = modeIndex;
    const mode = auraModes[modeIndex];
    const colors = palettes[rndInt(0, palettes.length - 1)];
    const out = [];
    const ringCount = mode === 'starlight' ? 1 : mode === 'care' ? 3 : 2;
    for (let k = 0; k < ringCount; k++) {
      out.push({ kind: 'ring', x, y, vx: 0, vy: 0, s: 2 + k * rnd(2.5, 5), grow: rnd(1.4, 3), c: colors[(k + 1) % colors.length], life: rnd(.82, 1.12), decay: rnd(.035, .058) });
    }
    const petalCount = mode === 'bloom' ? rndInt(8, 12) : mode === 'spiral' ? rndInt(6, 9) : rndInt(3, 6);
    const startAngle = rnd(0, Math.PI * 2);
    for (let k = 0; k < petalCount; k++) {
      const a = startAngle + (k / petalCount) * Math.PI * 2 + rnd(-.18, .18);
      const sp = mode === 'spiral' ? rnd(2.2, 3.8) : rnd(1.4, 3.5);
      const curl = mode === 'spiral' ? rnd(.7, 1.5) : 0;
      out.push({ kind: 'petal', x: x + rnd(-2, 2), y: y + rnd(-2, 2), vx: Math.cos(a) * sp - Math.sin(a) * curl, vy: Math.sin(a) * sp + Math.cos(a) * curl - .55, g: rnd(.045, .09), s: rnd(5.5, 11), r: a + Math.PI / 2, vr: rnd(-.12, .12), c: colors[k % colors.length], life: rnd(.9, 1.18), decay: rnd(.022, .034) });
    }
    const heartCount = mode === 'care' ? rndInt(7, 10) : rndInt(1, 4);
    for (let k = 0; k < heartCount; k++) {
      const a = rnd(0, Math.PI * 2), sp = rnd(.8, 2.5);
      out.push({ kind: 'heart', x: x + rnd(-3, 3), y: y + rnd(-2, 2), vx: Math.cos(a) * sp, vy: -rnd(1.2, 3), g: rnd(.035, .065), s: rnd(3.5, 7.5), r: rnd(-.5, .5), vr: rnd(-.07, .07), c: colors[k % colors.length], life: rnd(.92, 1.2), decay: rnd(.021, .032) });
    }
    const sparkCount = mode === 'starlight' ? rndInt(10, 15) : rndInt(2, 6);
    for (let k = 0; k < sparkCount; k++) {
      const a = rnd(0, Math.PI * 2), sp = rnd(1.2, mode === 'starlight' ? 4.3 : 2.8);
      out.push({ kind: Math.random() < .28 ? 'dot' : 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - .4, g: rnd(.025, .07), s: rnd(1.4, 4.2), r: rnd(0, Math.PI), vr: rnd(-.16, .16), c: colors[k % colors.length], life: rnd(.7, 1.05), decay: rnd(.028, .05) });
    }
    cv.dataset.auraMode = mode;
    cv.dataset.auraId = `${Date.now()}-${rndInt(1000, 9999)}`;
    add(out);
  }

  function confetti() {
    if (navigator.vibrate) navigator.vibrate([30, 40, 60]);
    if (motionReduced()) return;
    const colors = ['#f3256b', '#f9a8d4', '#c04ac4', '#7b21a8', '#ffd166', '#34c759', '#5a5fbf'];
    const out = Array.from({ length: 130 }, () => ({
      kind: Math.random() < .22 ? 'petal' : 'rect',
      x: innerWidth / 2 + rnd(-70, 70), y: innerHeight * .62,
      vx: rnd(-6.5, 6.5), vy: -rnd(5, 15), g: .42,
      s: rnd(4, 11), r: rnd(0, Math.PI), vr: rnd(-.15, .15),
      c: colors[Math.random() * colors.length | 0],
      life: 1.3, decay: .012,
    }));
    add(out);
  }
  return { confetti, burst };
})();
function confetti() { FX.confetti(); }

/* Jump Forth — every tap blooms */
addEventListener('pointerdown', e => {
  if (e.isPrimary) FX.burst(e.clientX, e.clientY);
}, { passive: true });

/* Ambient floating petals */
(function stars() {
  const wrap = $('#stars');
  for (let k = 0; k < 16; k++) {
    const i = document.createElement('i');
    const sz = 6 + Math.random() * 16;
    i.style.cssText = `left:${Math.random() * 100}vw;top:${60 + Math.random() * 40}vh;width:${sz}px;height:${sz}px;animation-duration:${14 + Math.random() * 22}s;animation-delay:${-Math.random() * 30}s;`;
    wrap.appendChild(i);
  }
})();

/* ── Opening splash — Shout · Stellenbosch · Gilead ──────── */
function bootSplash() {
  if (document.getElementById('splash')) return;
  const el = document.createElement('div');
  el.id = 'splash';
  el.setAttribute('role', 'status');
  el.innerHTML = `
    <div class="splash-inner">
      <div class="splash-flower" style="margin-bottom:6px">${mojoLogoHTML(160)}</div>
      <p class="splash-sub" style="font-size:13px;letter-spacing:1.8px;text-transform:uppercase;color:rgba(255,255,255,0.85);font-weight:700;margin-top:2px">Creative Resilience</p>
      <div class="splash-partners">
        <p class="splash-welcome">${esc(MM.PARTNERS.headline)}</p>
        <div class="splash-powered">
          <span class="splash-lbl">powered by</span>
          <div class="splash-logos">
            <img src="./assets/branding/shout-it-now-logo.png" alt="SHOUT-IT-NOW" class="splash-shout" />
            <span class="splash-amp">&amp;</span>
            <span class="splash-partner-mark su has-img">
              <img src="./assets/partners/stellenbosch-transparent.png" alt="Stellenbosch University" class="su-trans-logo" />
            </span>
          </div>
        </div>
        <div class="splash-powered">
          <span class="splash-lbl">made possible by</span>
          <span class="splash-partner-mark gilead has-img">
            <img src="./assets/partners/gilead.svg" alt="Gilead Sciences" class="gilead-trans-logo" />
          </span>
        </div>
      </div>
      <div class="splash-io-brand">
        <img src="./assets/branding/ionity-global-white.png" alt="IONITY GLOBAL" class="splash-io-logo" />
        <p class="splash-foot">Crafted by <a href="https://www.ionity.co.za" target="_blank" rel="noopener">IONITY GLOBAL</a> · <a href="https://www.ionity.co.za" target="_blank" rel="noopener">www.ionity.co.za</a></p>
      </div>
    </div>`;
  document.body.appendChild(el);
  const dismiss = () => {
    if (!el.parentNode) return;
    el.classList.add('bye');
    setTimeout(() => el.remove(), 600);
  };
  el.addEventListener('pointerdown', dismiss);
  setTimeout(dismiss, motionReduced() ? 1400 : 3000);
}

/* ── Predictive behaviour ────────────────────────────────────
   A transparent, on-device model of how this participant
   actually uses the app: a first-order Markov chain over
   screens, plus an hour-of-day prior. It powers the "jump back
   in" chips and lets us warm heavy assets (videos) just before
   they are wanted. It never leaves the phone, it explains
   itself, and Privacy & Security can switch it off.           */
const Predict = (() => {
  const TRACKED = ['home', 'instructions', 'support', 'pre', 'post', 'art', 'chat', 'spark', 'help', 'privacy'];
  const LABEL = {
    home: 'Home', instructions: 'Instructions', support: 'Support', pre: 'Pre-Survey',
    post: 'Post-Survey', art: 'Art Activities', chat: 'Chat', spark: 'Daily Spark',
    help: 'Help Now', privacy: 'Privacy',
  };
  const ROUTE = {
    home: '#/home', instructions: '#/instructions', support: '#/support', pre: '#/pre',
    post: '#/post', art: '#/art', chat: '#/chat', spark: '#/spark', help: '#/help',
    privacy: '#/privacy',
  };
  let previous = null;

  function note(name) {
    if (!S.ai?.predictive || !TRACKED.includes(name)) { previous = name; return; }
    const u = S.usage;
    u.routes[name] = (u.routes[name] || 0) + 1;
    const hour = new Date().getHours();
    u.hours[name] = u.hours[name] || {};
    u.hours[name][hour] = (u.hours[name][hour] || 0) + 1;
    if (previous && previous !== name) {
      u.transitions[previous] = u.transitions[previous] || {};
      u.transitions[previous][name] = (u.transitions[previous][name] || 0) + 1;
    }
    u.recent.unshift({ name, at: Date.now() });
    u.recent = u.recent.slice(0, 40);
    previous = name;
    save();
  }

  /** Ranked guesses for where this person goes next. */
  function next(from = previous || 'home', limit = 3) {
    if (!S.ai?.predictive) return [];
    const u = S.usage;
    const hour = new Date().getHours();
    const totalVisits = Object.values(u.routes).reduce((a, b) => a + b, 0);
    if (totalVisits < 6) return []; // stay quiet until there is something to learn from

    const scores = {};
    const trans = u.transitions[from] || {};
    const transTotal = Object.values(trans).reduce((a, b) => a + b, 0) || 1;
    for (const name of TRACKED) {
      if (name === from) continue;
      if (!available(name)) continue;
      const markov = (trans[name] || 0) / transTotal;                  // where they usually go from here
      const prior = (u.routes[name] || 0) / totalVisits;               // how much they use it at all
      const hours = u.hours[name] || {};
      const nearHour = [hour - 1, hour, hour + 1]
        .reduce((sum, h) => sum + (hours[(h + 24) % 24] || 0), 0);
      const timeOfDay = nearHour / Math.max(1, u.routes[name] || 1);   // is now their usual time
      const score = markov * .58 + prior * .24 + Math.min(1, timeOfDay) * .18;
      if (score > 0.04) scores[name] = score;
    }
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, score]) => ({
        name, score: +score.toFixed(3), label: LABEL[name], route: ROUTE[name],
        why: explain(from, name),
      }));
  }

  function explain(from, name) {
    const trans = S.usage.transitions[from] || {};
    const hours = S.usage.hours[name] || {};
    const hour = new Date().getHours();
    if ((trans[name] || 0) >= 2) return `you often open this after ${LABEL[from] || 'here'}`;
    if ((hours[hour] || 0) >= 2) return 'this is usually your time for it';
    return 'one of your most-used screens';
  }

  function available(name) {
    if (name === 'art') return artOpen();
    if (name === 'chat') return chatOpen();
    if (name === 'post') return postOpen();
    return true;
  }

  /** Warm what they are about to need, so it feels instant. */
  function prefetch() {
    if (!S.ai?.predictive || !navigator.onLine) return;
    // Only on unmetered-looking connections — data vouchers are precious.
    const c = navigator.connection;
    if (c && (c.saveData || /2g/.test(c.effectiveType || ''))) return;
    const guesses = next(previous, 2).map(g => g.name);
    if (!guesses.includes('art') || !hasArt()) return;
    const wk = currentWeek();
    const due = MM.ACTIVITIES.find(a => a.week <= wk && !actState(a.id)?.submittedAt);
    const st = due && actState(due.id);
    if (!due || !st || st.option == null || !MM.ACTIVITY_VIDEOS[due.id]) return;
    const url = `./assets/videos/activity-${due.id}/option-${st.option + 1}.mp4`;
    if (document.querySelector(`link[href="${url}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'prefetch'; link.as = 'video'; link.href = url;
    document.head.appendChild(link);
  }

  const reset = () => { S.usage = { routes: {}, transitions: {}, hours: {}, recent: [] }; save(); };

  return { note, next, prefetch, reset, LABEL, ROUTE };
})();

/* ── Router ──────────────────────────────────────────────── */
const routes = {};
let lastPath = '';
function nav(hash) { location.hash = hash; }
function back(fallback = '#/home') {
  if (history.length > 1) history.back(); else nav(fallback);
}
function route() {
  const raw = location.hash.replace(/^#\/?/, '') || '';
  const parts = raw.split('/').filter(Boolean);
  const name = parts[0] || 'home';

  stopVoiceCapture(); // never leave the mic running across screens
  stopReflectionDictation();
  if (Vault.isLocked()) return lockScreen();

  // Guards — the Aug 2026 onboarding pathing:
  // Sign In → Terms (Accept) → Demographic Survey → Welcome → Home
  if (!S.auth && name !== 'signin') return nav('#/signin');
  if (S.auth && !S.consented && !['terms', 'signin'].includes(name)) return nav('#/terms');
  if (S.auth && S.consented && !S.demographics && !['demographics', 'help', 'terms', 'signin'].includes(name)) return nav('#/demographics');
  if (S.auth && S.consented && S.demographics && !S.onboarded && !['welcome', 'help', 'demographics', 'terms', 'signin'].includes(name)) return nav('#/welcome');

  const fn = routes[name] || routes.home;
  const isBack = raw.length < lastPath.length && lastPath.startsWith(raw.split('/')[0]);
  lastPath = raw;
  window.scrollTo(0, 0);
  fn(parts.slice(1), isBack);
  updateTabbar(name);
  app.scrollTop = 0;
  Predict.note(name);
  setTimeout(() => Predict.prefetch(), 1200);
}
window.addEventListener('hashchange', route);

/* ── Shared chrome ───────────────────────────────────────── */
function header(title, { home = false, backTo = null } = {}) {
  return `<header class="hdr">
    ${home
      ? `<span class="brand-flower">${flowerSVG(34)}</span>`
      : `<button class="back" data-act="back" data-to="${backTo || ''}" aria-label="Back">${I.back}</button>`}
    <h1>${esc(title)}</h1>
    ${home ? `<button class="hdr-reset" data-act="reset" aria-label="Reset demo" title="Reset demo">${I.reset}</button>` : ''}
    ${MMVoice.supported() ? `<button class="hdr-voice ${MMVoice.isOn() ? 'on' : ''}" data-act="voice" aria-label="Voice navigation" aria-pressed="${MMVoice.isOn()}" title="Voice navigation">${I.mic}</button>` : ''}
    <button class="hdr-a11y" data-act="a11y" aria-label="Accessibility options" title="Accessibility">${I.a11y}</button>
    <button class="help-pill" data-act="help"><span class="q">?</span>Help</button>
  </header>`;
}

/* ── Lock screen (PIN-protected vaults) ──────────────────── */
function lockScreen(message = '') {
  app.innerHTML = `<div class="screen theme-auth">
    <div class="auth-wrap lock-wrap">
      <div class="lock-mark">${mojoLogoHTML(130)}</div>
      <h1 class="auth-title" style="margin-top:10px">Welcome back</h1>
      <p class="sub" style="color:#ffffff !important">Your journal is encrypted on this device. Enter your PIN to open it.</p>
      <div class="field">${I.lock}<input id="lock-pin" type="text" placeholder="Enter PIN (or Master Code)" autocomplete="current-password" maxlength="16" /></div>
      <p class="lock-err ${message ? '' : 'hidden'}" id="lock-err">${esc(message)}</p>
      <button class="btn btn-primary btn-block" id="lock-go">Unlock Journal 🔓</button>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">
        <button class="link lock-forgot" id="lock-forgot" style="color:#ffd700 !important;font-weight:700">I forgot my PIN / Admin Recovery</button>
      </div>
      <p class="auth-foot" style="color:#ffffff !important">AES-GCM 256 · your PIN never leaves this phone<br/>MojaMind · IONITY GLOBAL (PTY) LTD · <a href="https://www.ionity.co.za" target="_blank" style="color:#6ec1ff !important">www.ionity.co.za</a></p>
    </div>
  </div>`;
  $('#tabbar').classList.add('hidden');
  app.classList.add('no-nav');
  const input = $('#lock-pin');
  input.focus();

  const attempt = async (customPin = null) => {
    const pin = (customPin || input.value).trim();
    if (!pin) {
      $('#lock-err').textContent = 'Please enter your PIN or Admin Recovery Code';
      $('#lock-err').classList.remove('hidden');
      input.focus();
      return;
    }
    const state = await Vault.unlock(pin);
    if (!state) {
      $('#lock-err').textContent = 'That PIN did not open your journal. Try Admin Recovery (MOJA2026) or email ai@ionity.co.za.';
      $('#lock-err').classList.remove('hidden');
      input.value = ''; input.focus();
      if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
      return;
    }
    S = hydrate(state);
    applyA11y();
    confetti();
    toast('Vault unlocked — welcome back 💜');
    route();
  };

  $('#lock-go').onclick = () => attempt();
  input.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });

  $('#lock-forgot').onclick = () => {
    const m = modal(`
      <h3>PIN Recovery &amp; Remote Assistance</h3>
      <p style="font-size:13px;line-height:1.65;color:#ffffff;margin:0 0 12px">
        Your journal is protected with end-to-end device encryption. If you forgot your PIN, our support team or study facilitator can assist you remotely.</p>
      
      <div style="display:flex;flex-direction:column;gap:10px;text-align:left;background:rgba(255,255,255,0.08);padding:14px;border-radius:14px;border:1px solid rgba(255,255,255,0.18)">
        <div style="font-size:13px;font-weight:700;color:#ffd700">🔑 Enter Remote Admin Master PIN</div>
        <p style="font-size:12px;color:#ffffff;margin:0">Facilitators &amp; Admins: Enter master code (e.g. <code>MOJA2026</code>) to unlock instantly without data loss.</p>
        <div style="display:flex;gap:8px">
          <input type="text" id="admin-rec-input" class="tkt-input" placeholder="Admin Code (e.g. MOJA2026)" style="margin:0;font-weight:700;color:#1a0628" />
          <button class="btn btn-primary" id="admin-rec-go" style="white-space:nowrap">Unlock</button>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
        <a class="btn btn-secondary btn-block" href="mailto:ai@ionity.co.za?subject=MojaMind%20PIN%20Recovery%20Assistance&body=Hello%20MojaMind%20Admin%20Team%2C%0A%0APlease%20assist%20me%20with%20remotely%20unlocking%20my%20MojaMind%20instance.%0ADevice%20Time%3A%20${encodeURIComponent(new Date().toISOString())}%0AApp%20Version%3A%20v2.5.0" target="_blank" rel="noopener" style="text-decoration:none;text-align:center">
          📧 Email Admin (ai@ionity.co.za)
        </a>
        <button class="btn btn-ghost btn-block" id="lock-wipe" style="color:#ffb020;border-color:rgba(255,176,32,0.4)">
          🔄 Start Fresh (Reset Device)
        </button>
        <button class="btn btn-ghost btn-block" onclick="closeModal()">Back to Lock Screen</button>
      </div>
    `);

    m.querySelector('#admin-rec-go')?.addEventListener('click', async () => {
      const code = m.querySelector('#admin-rec-input').value.trim();
      if (!code) return toast('Please enter the Admin Master Code');
      const st = await Vault.unlock(code);
      if (st) {
        closeModal();
        S = hydrate(st);
        applyA11y();
        confetti();
        toast('Admin Master Unlock successful ✨');
        route();
      } else {
        toast('Invalid Admin Master Code — please contact ai@ionity.co.za');
      }
    });

    m.querySelector('#lock-wipe')?.addEventListener('click', () => {
      confirmPhrase({
        title: 'Start Fresh & Reset?',
        body: 'This will remove the current PIN and reset your device journal so you can begin again.',
        phrase: 'I am sure',
        danger: true,
        onYes: () => {
          Vault.wipe();
          closeModal();
          location.reload();
        },
      });
    });
  };
}

function buildTabs() {
  const tabs = [
    { id: 'home', label: 'Home', icon: I.home, route: '#/home' },
    { id: 'games', label: 'Games', icon: I.gamepad, route: '#/games' },
    { id: 'journal', label: 'Journal', icon: I.journal, route: '#/journal' },
    { id: 'support', label: 'Support', icon: I.headset, route: '#/support' },
  ];
  if (hasArt()) tabs.push({ id: 'art', label: 'Art', icon: I.palette, route: '#/art', gated: true });
  if (hasChat() || S.adminMode) tabs.push({ id: 'chat', label: 'Chat', icon: I.chat, route: '#/chat', gated: true });
  return tabs;
}
const NAVLESS = ['signin', 'terms', 'welcome', 'demographics', 'survey', 'help'];
function updateTabbar(name) {
  const bar = $('#tabbar');
  if (NAVLESS.includes(name)) {
    bar.classList.add('hidden'); app.classList.add('no-nav'); return;
  }
  app.classList.remove('no-nav');
  bar.classList.remove('hidden');
  const activeMap = { pre: 'home', post: 'home', instructions: 'home', spark: 'home', journey: 'home', writer: 'journal', game: 'games', game3d: 'games', gamebubble: 'games' };
  const active = activeMap[name] || name;
  const tabs = buildTabs();
  bar.innerHTML = tabs.map(t => {
    const locked = t.gated && !(t.id === 'chat' ? chatOpen() : artOpen());
    return `<button class="tab ${active === t.id ? 'active' : ''} ${locked ? 'locked' : ''}" data-tab="${t.id}" aria-label="${t.label}">
      ${t.icon}${locked ? `<svg class="mini-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>` : ''}
      <span>${t.label}</span>
    </button>`;
  }).join('');
  bar.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => {
    const t = tabs.find(x => x.id === b.dataset.tab);
    const open = t.id === 'chat' ? chatOpen() : t.id === 'art' ? artOpen() : true;
    if (t.gated && !open) return toast('Complete your Pre-Survey to unlock this ✨');
    nav(t.route);
  }));
}

/* Global delegated actions */
app.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  if (act === 'back') el.dataset.to ? nav(el.dataset.to) : back();
  if (act === 'help') nav('#/help');
  if (act === 'reset') resetModal();
  if (act === 'a11y') a11yModal();
  if (act === 'voice') toggleVoiceNav();
});

/* ── Voice navigation ────────────────────────────────────── */
function voiceBadge(state) {
  let el = $('#voice-badge');
  if (!MMVoice.isOn()) { el?.remove(); return; }
  if (!el) {
    el = document.createElement('div');
    el.id = 'voice-badge';
    el.className = 'voice-badge';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
    el.addEventListener('click', () => voiceHelpModal());
  }
  el.classList.toggle('paused', !!state?.paused);
  el.innerHTML = state?.paused
    ? `<span class="vb-dot"></span><span>Voice paused while recording</span>`
    : `<span class="vb-dot live"></span><span>${state?.heard ? esc(state.heard.slice(0, 42)) : 'Listening — say “home”, “help now”, “draw”…'}</span>`;
  if (state?.unknown) {
    el.classList.add('miss');
    setTimeout(() => el.classList.remove('miss'), 900);
  }
}

function toggleVoiceNav() {
  if (!MMVoice.supported()) {
    return toast('This browser cannot listen for voice commands — try Chrome on Android or Edge 🎤');
  }
  if (MMVoice.isOn()) {
    MMVoice.stop();
    S.ai.voiceNav = false; save();
    toast('Voice navigation off');
  } else {
    MMVoice.start();
    S.ai.voiceNav = true; save();
    MMVoice.speak('Voice navigation on. Say home, art activities, or help now.');
    toast('Voice navigation on — say “what can I say” for the list 🎙');
    voiceHelpModal();
  }
  const btn = $('.hdr-voice');
  btn?.classList.toggle('on', MMVoice.isOn());
  btn?.setAttribute('aria-pressed', String(MMVoice.isOn()));
  voiceBadge({ on: MMVoice.isOn() });
}

function voiceHelpModal() {
  const m = modal(`
    <h3>🎙 Voice Navigation &amp; Speech</h3>
    <p style="font-size:12.6px;line-height:1.6;color:#ffffff;margin:0 0 12px">
      Powered by <b>Piper Neural TTS</b> and <b>Whisper.cpp</b> on-device ASR. Nothing is uploaded or recorded — your voice stays on your phone.</p>
    <div class="voice-cmds">
      ${MMVoice.helpList.map(([cmd, what]) => `<div class="vc"><b>${esc(cmd)}</b><span>${esc(what)}</span></div>`).join('')}
    </div>
    <div class="modal-btns">
      <button class="btn btn-secondary" id="vh-studio">🎙️ Piper Voice Studio</button>
      <button class="btn btn-primary" onclick="closeModal()">Got it</button>
    </div>
  `);
  m.querySelector('#vh-studio')?.addEventListener('click', () => {
    closeModal();
    MMVoice.voiceStudioModal();
  });
}

/** Screen text for "read this" — the visible words, in reading order. */
function readableScreenText() {
  const screen = app.querySelector('.screen');
  if (!screen) return '';
  return [...screen.querySelectorAll('h1, h2, h3, h4, p, li, .stmt, .lbl, .a-name, .s-name, b')]
    .map(el => el.textContent.trim())
    .filter(Boolean)
    .filter((t, i, arr) => arr.indexOf(t) === i)
    .join('. ')
    .slice(0, 1400);
}

MMVoice.configure({
  navigate: hash => nav(hash),
  onState: st => voiceBadge(st),
  handlers: {
    mood: () => maybeMoodModal(true),
    draw: () => {
      const a = currentArtActivity();
      if (!a) { MMVoice.speak('Open an art activity first'); return toast('Open an art activity to start drawing 🎨'); }
      nav(`#/art/${a.id}/detail/pictures`);
      setTimeout(() => openDrawPad(a), 400);
    },
    voice: () => {
      const a = currentArtActivity();
      if (!a) { MMVoice.speak('Open an art activity first'); return toast('Open an art activity to record a voice note 🎤'); }
      nav(`#/art/${a.id}/detail/voice`);
    },
    'text-bigger': () => { S.a11y.textScale = Math.min(1.25, (S.a11y.textScale || 1) + .13); save(); applyA11y(); toast('Text is bigger now'); },
    'text-normal': () => { S.a11y.textScale = 1; save(); applyA11y(); toast('Text back to normal'); },
    'read-page': () => {
      const text = readableScreenText();
      if (!text) return MMVoice.speak('There is nothing to read here');
      MMVoice.readAloud(text);
      toast('Reading this screen aloud 🔊', 2000);
    },
    'voice-help': () => voiceHelpModal(),
    hope: () => beaconOfHopeModal(),
  },
});

/* Beacon of Hope & Ithemba Care Sanctuary — Affirmations, Starlight Seeds & Grounding */
function beaconOfHopeModal() {
  let curIndex = 0;
  if (!S.hopeSeeds) {
    S.hopeSeeds = [
      { text: 'You survived 100% of your hardest days. You have greatness inside you.', by: 'Anonymous Peer · Cape Town', at: Date.now() - 864e5 },
      { text: 'Ungalahli ithemba. The dawn always breaks after the darkest hour.', by: 'Facilitator Zola', at: Date.now() - 1728e5 },
      { text: 'Take a gentle breath. You do not have to carry the whole world today.', by: 'Participant · Soweto', at: Date.now() - 2592e5 },
      { text: 'Your voice matters and your story is still being written. Keep going!', by: 'Anonymous Friend · Durban', at: Date.now() - 3456e5 }
    ];
  }
  const affs = [...MM.HOPE.affirmations, ...S.hopeSeeds.map(s => ({ title: '🌟 Seed of Hope', text: s.text, sa: s.by }))];

  const m = modal(`
    <div class="beacon-modal">
      <div class="beacon-icon">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      </div>
      <h3 class="beacon-title">${esc(MM.HOPE.title)} · Ithemba</h3>
      <p class="beacon-sub">A safe haven of courage, anonymous seeds of hope &amp; resilience</p>
      <p class="beacon-lead">“${esc(MM.HOPE.lead)}”</p>
      
      <!-- Starlight Sky -->
      <div style="background:rgba(0,0,0,0.3);border-radius:14px;padding:8px;margin:8px 0;display:flex;justify-content:center;align-items:center;gap:10px;flex-wrap:wrap">
        <small style="color:#ffd166;font-weight:700;width:100%;text-align:center">✨ Touch any star to receive a message of courage</small>
        ${affs.map((_, i) => `<button class="bdot ${i === 0 ? 'active' : ''}" data-star="${i}" style="width:28px;height:28px;border-radius:50%;background:rgba(255,209,102,0.2);border:1.5px solid #ffd166;color:#ffd166;font-size:12px;cursor:pointer;display:grid;place-items:center" title="Star ${i+1}">⭐</button>`).join('')}
      </div>

      <div class="beacon-card" id="beacon-card" style="min-height:120px">
        <h4 id="bh-title">${esc(affs[0].title)}</h4>
        <p id="bh-text" style="font-size:14px;line-height:1.6">${esc(affs[0].text)}</p>
        <div class="bh-sa" id="bh-sa">🌿 <i>${esc(affs[0].sa)}</i></div>
      </div>

      <div class="beacon-nav">
        <button class="beacon-prev" id="bh-prev" aria-label="Previous affirmation">‹</button>
        <span style="font-size:11.5px;color:rgba(255,255,255,0.7);font-weight:600" id="bh-counter">1 of ${affs.length}</span>
        <button class="beacon-next" id="bh-next" aria-label="Next affirmation">›</button>
      </div>

      <!-- Plant a Seed of Hope Input -->
      <div id="bh-seed-box" style="display:none;flex-direction:column;gap:8px;margin-top:10px;background:rgba(255,255,255,0.08);padding:12px;border-radius:14px;border:1.5px solid #ffd166">
        <label style="font-size:12px;font-weight:700;color:#ffd166">Plant an anonymous Seed of Hope for someone in need:</label>
        <textarea id="bh-seed-input" rows="2" placeholder="Write a gentle message of strength, courage or care…" style="width:100%;border-radius:8px;padding:8px;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.2);color:#fff;font-size:13px;box-sizing:border-box"></textarea>
        <div style="display:flex;gap:6px;justify-content:flex-end">
          <button class="btn btn-ghost btn-sm" id="bh-seed-cancel">Cancel</button>
          <button class="btn btn-primary btn-sm" id="bh-seed-submit">🌟 Plant Star</button>
        </div>
      </div>

      <div class="beacon-acts" style="margin-top:12px">
        <button class="btn btn-secondary btn-sm" id="bh-plant-btn">🌱 Plant a Seed of Hope</button>
        <button class="btn btn-primary btn-sm" id="bh-read">${I.sparkle} Read Aloud 🔊</button>
        <button class="btn btn-ghost btn-sm" id="bh-close">Close</button>
      </div>
    </div>
  `);

  function update() {
    const cur = affs[curIndex];
    m.querySelector('#bh-title').textContent = cur.title;
    m.querySelector('#bh-text').textContent = cur.text;
    m.querySelector('#bh-sa').innerHTML = `🌿 <i>${esc(cur.sa)}</i>`;
    m.querySelector('#bh-counter').textContent = `${curIndex + 1} of ${affs.length}`;
    m.querySelectorAll('[data-star]').forEach((d, i) => {
      d.style.background = (i === curIndex) ? '#ffd166' : 'rgba(255,209,102,0.2)';
      d.style.color = (i === curIndex) ? '#000' : '#ffd166';
      d.style.transform = (i === curIndex) ? 'scale(1.2)' : 'scale(1)';
    });
  }

  m.querySelectorAll('[data-star]').forEach(btn => {
    btn.onclick = () => {
      curIndex = parseInt(btn.dataset.star, 10);
      update();
    };
  });

  m.querySelector('#bh-prev').onclick = () => {
    curIndex = (curIndex - 1 + affs.length) % affs.length;
    update();
  };
  m.querySelector('#bh-next').onclick = () => {
    curIndex = (curIndex + 1) % affs.length;
    update();
  };
  m.querySelector('#bh-read').onclick = () => {
    const cur = affs[curIndex];
    if (MMVoice.supported()) {
      MMVoice.speak(`${cur.title}. ${cur.text}. ${cur.sa}`, { persona: 'hope', force: true });
      toast('Speaking message of hope with Piper Voice 🌟');
    } else {
      toast('“' + cur.text + '” 🌟');
    }
  };

  const seedBox = m.querySelector('#bh-seed-box');
  m.querySelector('#bh-plant-btn').onclick = () => {
    seedBox.style.display = seedBox.style.display === 'none' ? 'flex' : 'none';
  };
  m.querySelector('#bh-seed-cancel').onclick = () => { seedBox.style.display = 'none'; };
  m.querySelector('#bh-seed-submit').onclick = () => {
    const val = m.querySelector('#bh-seed-input').value.trim();
    if (!val) return toast('Please write a short message of hope first 🌱');
    S.hopeSeeds.unshift({ text: val, by: 'Anonymous Peer', at: Date.now() });
    save();
    confetti();
    toast('Your seed of hope is planted in the constellation! 🌟✨');
    closeModal();
    setTimeout(() => beaconOfHopeModal(), 300);
  };

  m.querySelector('#bh-close').onclick = () => closeModal();
}

/** The activity the participant is on, or the one that is due. */
function currentArtActivity() {
  if (!hasArt()) return null;
  const m = location.hash.match(/#\/art\/(\d+)/);
  if (m) return MM.ACTIVITIES.find(a => a.id === +m[1]) || null;
  const wk = currentWeek();
  return MM.ACTIVITIES.find(a => a.week <= wk && !actState(a.id)?.submittedAt) || null;
}

/* Demo reset — choose your journey stage, then land on Home */
function resetModal() {
  const stages = [
    { id: 1, emoji: '📋', name: 'Fresh start', desc: 'Everything cleared. Begin at the Pre-Survey, as on day one.' },
    { id: 2, emoji: '🎨', name: 'Journey underway', desc: 'Pre-Survey done. Week 3 of 8, activities in progress.' },
    { id: 3, emoji: '🌟', name: 'Final stretch', desc: 'All 8 activities done, week 8 — Post-Survey open.' },
  ];
  const m = modal(`
    <h3>Reset demo — choose a stage</h3>
    <p style="font-size:12.6px;line-height:1.6;color:#ffffff;text-align:center;margin:-6px 0 10px">Your sign-in, study group (${esc(groupOf().name)}) and details stay. Progress is replaced with the chosen stage.</p>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${stages.map(g => `
        <button class="opt-choice" data-stage="${g.id}">
          <span class="oc-radio"></span>
          <span class="grow">
            <h5><span class="oc-emoji">${g.emoji}</span>${esc(g.name)}</h5>
            <p>${esc(g.desc)}</p>
          </span>
        </button>`).join('')}
    </div>
    <div class="modal-btns"><button class="btn btn-ghost" id="rst-cancel">Cancel</button></div>
  `);
  m.querySelector('#rst-cancel').onclick = () => closeModal();
  m.querySelectorAll('[data-stage]').forEach(b => b.addEventListener('click', () => {
    applyStageReset(+b.dataset.stage);
    closeModal();
    toast(`Reset to ${stages.find(g => g.id === +b.dataset.stage).name} ✨`);
    nav('#/home');
    if (location.hash === '#/home') route();
  }));
}

function applyStageReset(stage) {
  const keep = { auth: S.auth, group: S.group, consented: S.consented, onboarded: S.onboarded, demographics: S.demographics, a11y: S.a11y };
  S = Object.assign(blankState(), keep);
  S.lastMoodPrompt = Date.now(); // don't instantly re-prompt mood after reset
  const wk = ms => Date.now() - ms * 7 * 864e5;
  if (stage === 1) {
    S.startedAt = Date.now();
  } else if (stage === 2) {
    S.startedAt = wk(2); // week 3
    MM.PRE_SURVEYS.forEach(id => S.surveys.pre[id] = { answers: {}, completedAt: wk(2), demo: true });
    S.artAboutSeen = true;
  } else {
    S.startedAt = wk(7.5); // week 8
    MM.PRE_SURVEYS.forEach(id => S.surveys.pre[id] = { answers: {}, completedAt: wk(7), demo: true });
    S.artAboutSeen = true;
    MM.ACTIVITIES.forEach((a, i) => {
      S.activities[a.id] = { option: i % 5, uploads: [], voice: [], reflections: { 0: 'A moment from my journey.' }, startedAt: wk(7) + i * 6 * 864e5 };
    });
  }
  save();
}

function render(html, { theme = 'theme-home', backAnim = false } = {}) {
  app.innerHTML = `<div class="screen ${theme} ${backAnim ? 'back-anim' : ''}">${html}</div>`;
}

/* ── Support tickets (Freshservice-style, stored locally) ── */
function newTicket(kind, subject, detail, source = 'manual') {
  const ref = `MJ-${String(Date.now()).slice(-6)}`;
  const t = { ref, kind, subject, detail, status: 'Open', createdAt: Date.now(), source };
  S.tickets.unshift(t); save();
  return t;
}

function ticketModal(kind) {
  const path = MM.SUPPORT.pathways.find(p => p.kind === kind);
  const m = modal(`
    <h3>${kind === 'it' ? '🛠' : '💜'} ${esc(path.name)}</h3>
    <p style="font-size:12.8px;line-height:1.6;color:#ffffff;margin:0 0 12px">${esc(path.desc)}</p>
    <input class="tkt-input" id="tkt-subject" maxlength="90" placeholder="${kind === 'it' ? 'What isn’t working?' : 'What would you like to talk about?'}" />
    <textarea class="tkt-text" id="tkt-detail" maxlength="600" placeholder="Tell us a little more… (optional)"></textarea>
    <p class="tkt-note">${esc(MM.SUPPORT.ticketNote)}</p>
    <div class="modal-btns">
      <button class="btn btn-ghost" id="tkt-cancel">Cancel</button>
      <button class="btn btn-primary" id="tkt-send">Send request</button>
    </div>
  `);
  m.querySelector('#tkt-cancel').onclick = () => closeModal();
  m.querySelector('#tkt-send').onclick = () => {
    const subject = m.querySelector('#tkt-subject').value.trim();
    if (!subject) return toast(kind === 'it' ? 'Describe the problem in a few words 🛠' : 'A few words help us route your request 💜');
    const detail = m.querySelector('#tkt-detail').value.trim();
    const t = newTicket(kind, subject, detail);
    closeModal(); confetti();
    toast(`Request ${t.ref} logged — ${kind === 'it' ? 'our technical team' : 'a social worker'} will follow up 💌`, 3600);
    if (location.hash === '#/support') route();
  };
}

/* ── PHQ-9 risk screening ────────────────────────────────── */
function phqScreen(answers) {
  let total = 0, q9 = 0;
  for (let i = 0; i < 9; i++) {
    const v = MM.SCALES.freq4.indexOf(answers[`0.${i}`]);
    if (v > 0) total += v;
    if (i === MM.RISK.q9Index) q9 = Math.max(0, v);
  }
  return { total, q9, atRisk: total >= MM.RISK.severeMin || q9 >= MM.RISK.q9Min };
}

function riskModal(phase, screen, then) {
  const ticket = newTicket('social', MM.RISK.ticketSubject,
    `Automated ${phase}-survey screening flagged for follow-up (PHQ-9).`, 'phq9');
  S.riskFlags.push({ phase, total: screen.total, q9: screen.q9, at: Date.now(), ticketRef: ticket.ref });
  save();
  const m = modal(`
    <div class="celebrate risk-care">
      <span class="risk-mark">${I.handHeart}</span>
      <h3>${esc(MM.RISK.title)}</h3>
      <p>${esc(MM.RISK.message)}</p>
      <p class="risk-ref">Support request <b>${esc(ticket.ref)}</b> has been logged for you.</p>
      <button class="btn btn-primary btn-block" id="risk-support">View Support Services</button>
      ${hasChat() && preDone() ? '<button class="btn btn-ghost btn-block" id="risk-chat" style="margin-top:8px">Chat with your facilitator</button>' : ''}
      <button class="btn btn-ghost btn-block" id="risk-ok" style="margin-top:8px">Continue</button>
    </div>
  `);
  m.querySelector('#risk-support').onclick = () => { closeModal(); nav('#/support'); };
  m.querySelector('#risk-chat')?.addEventListener('click', () => { closeModal(); nav('#/chat'); });
  m.querySelector('#risk-ok').onclick = () => { closeModal(); then && then(); };
}

/* ════════════════════════ SCREENS ═══════════════════════ */

/* ── Sign In ─────────────────────────────────────────────── */
routes.signin = () => {
  let group = S.group;
  render(`
    <div class="auth-wrap">
      <img class="auth-cloud" src="./assets/branding/shout-colour-cloud.png" alt="" aria-hidden="true" />
      <div class="auth-top-row">
        <button class="auth-back" id="f-back" aria-label="Back to welcome screen">${I.back}</button>
        <button class="auth-admin" id="f-admin">🎓 Admin login</button>
      </div>
      <div class="auth-brand-lockup" style="flex-direction:column;align-items:center;gap:6px;margin-bottom:12px">
        ${mojoLogoHTML(130)}
        <div style="display:flex;align-items:center;gap:8px;margin-top:2px">
          <img src="./assets/branding/shout-it-now-logo.png" alt="SHOUT-IT-NOW" style="height:18px;width:auto" />
          <span style="font-size:11.5px;color:rgba(255,255,255,0.85);font-weight:600">Creative Resilience</span>
        </div>
      </div>
      <h1 class="auth-title">Mobile Number Sign In</h1>
      <p class="sub">Welcome to your Creative Resilience Journey</p>
      <div class="field">${I.phone}<input id="f-phone" type="tel" inputmode="tel" placeholder="Mobile Number" autocomplete="tel" /></div>
      <div class="field">${I.keyIc}<input id="f-pass" type="password" placeholder="Password" autocomplete="current-password" /></div>
      <div class="group-pick" role="group" aria-label="Study group">
        <span class="gp-lbl">Your study group <em>(from your facilitator)</em></span>
        <div class="gp-row">
          ${[1, 2, 3].map(g => `<button class="gp-btn ${group === g ? 'active' : ''}" data-g="${g}" aria-pressed="${group === g}">Group ${g}</button>`).join('')}
        </div>
      </div>
      <div class="auth-row">
        <label class="switch"><input id="f-rem" type="checkbox" checked /><span class="knob"></span>Remember me?</label>
        <button class="link" id="f-forgot">Forgot Password</button>
      </div>
      <button class="btn btn-primary btn-block" id="f-login">Sign in with number</button>
      <p class="datafree-note">📶 DataFree friendly — works offline once installed</p>
      <p class="auth-foot">${MM.APP_NAME} · Creative Resilience Intervention<br/>${esc(MM.PARTNERS.line)}<br/><img src="./assets/branding/ionity-global-white.png" alt="IONITY GLOBAL" class="auth-io-mini" />Crafted by <a href="https://www.ionity.co.za" target="_blank" rel="noopener">IONITY GLOBAL</a> · <a class="io-url" href="https://www.ionity.co.za" target="_blank" rel="noopener">www.ionity.co.za</a></p>
    </div>
  `, { theme: 'theme-auth' });
  app.querySelectorAll('.gp-btn').forEach(b => b.addEventListener('click', () => {
    group = +b.dataset.g;
    app.querySelectorAll('.gp-btn').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', x === b); });
  }));
  $('#f-back').onclick = () => bootSplash();
  $('#f-admin').onclick = () => adminLoginModal();
  $('#f-forgot').onclick = () => modal(`
    <h3>Forgot Password</h3>
    <p style="font-size:13.4px;line-height:1.65;color:#ffffff;text-align:center;margin:0 0 6px">
      No stress! Please contact your facilitator through your study group and they will reset your password for you.</p>
    <div class="modal-btns"><button class="btn btn-primary" onclick="closeModal()">Got it</button></div>
  `);
  $('#f-login').onclick = () => {
    const phone = $('#f-phone').value.trim();
    const pass = $('#f-pass').value;
    if (phone.replace(/\D/g, '').length < 9) { toast('Please enter a valid mobile number'); $('#f-phone').focus(); return; }
    if (!pass) { toast('Please enter your password'); $('#f-pass').focus(); return; }
    if (!group) { toast('Select your study group — your facilitator gave you this'); return; }
    S.auth = { phone, remember: $('#f-rem').checked, signedInAt: Date.now() };
    S.group = group;
    if (!S.startedAt) S.startedAt = Date.now();
    save();
    nav(S.consented ? '#/home' : '#/terms');
  };
};

/* ── Terms & Conditions (after login, "Accept") ──────────── */
routes.terms = () => {
  render(`
    <div class="body-pad" style="padding-top:calc(26px + env(safe-area-inset-top))">
      <div class="doc-card">
        <h2>${esc(MM.TERMS.title)}</h2>
        <p>${esc(MM.TERMS.intro)}</p>
        <p><b>${esc(MM.TERMS.lead)}</b></p>
        <ul>${MM.TERMS.points.map(([b, t]) => `<li><b>${esc(b)}</b>${t ? ' — ' + esc(t) : ''}</li>`).join('')}</ul>
      </div>
      <div class="modal-btns">
        <button class="btn btn-ghost" id="t-no">Do Not Accept</button>
        <button class="btn btn-primary" id="t-yes">Accept</button>
      </div>
    </div>
  `, { theme: 'theme-auth' });
  $('#t-no').onclick = () => { S.auth = null; save(); nav('#/signin'); toast('You need to accept to take part in the study'); };
  $('#t-yes').onclick = () => { S.consented = true; save(); nav('#/demographics'); };
};

/* ── Welcome (after demographics — "Welcome to Creative Resilience") ── */
routes.welcome = () => {
  render(`
    <div class="auth-wrap" style="justify-content:center;text-align:center;align-items:center">
      ${mojoLogoHTML(150)}
      <p class="sub" style="line-height:1.7;margin-top:14px;font-size:14.5px">${esc(MM.ONBOARD.body)}</p>
      <div class="welcome-partners">${esc(MM.PARTNERS.line)}</div>
      <p style="color:#fff;font-weight:700;margin:22px 0 14px">${esc(MM.ONBOARD.ready)}</p>
      <button class="btn btn-primary" id="w-next" style="min-width:200px">Next</button>
      <p class="auth-foot">A Creative Resilience journey by <img src="./assets/branding/ionity-global-white.png" alt="IONITY GLOBAL" class="auth-io-mini" /><br/><a href="https://www.ionity.co.za" target="_blank" rel="noopener">IONITY GLOBAL</a> · <a class="io-url" href="https://www.ionity.co.za" target="_blank" rel="noopener">www.ionity.co.za</a></p>
    </div>
  `, { theme: 'theme-auth' });
  $('#w-next').onclick = () => { S.onboarded = true; save(); nav('#/home'); };
};

/* ── Question runner (demographics + surveys) ───────────── */
function runnerHTML(def, savedAnswers, { pageLabel, blurb = '' }) {
  const answers = savedAnswers || {};
  const total = def.questions
    ? def.questions.length
    : def.sections.reduce((n, s) => n + s.items.length, 0);
  let done = 0;

  let inner = '';
  if (def.questions) {
    // Demographic style: numbered standalone questions
    inner = def.questions.map((q, qi) => {
      const val = answers[q.id];
      if (val != null) done++;
      const showOther = q.other && val === q.other;
      return `<div class="q-item" data-q="${q.id}">
        <div class="q-section-title"><h3>Question ${qi + 1}<span class="req">*</span></h3>
        <span class="req-note">This question requires an answer.</span></div>
        <div class="stmt">${esc(q.text)}</div>
        ${q.options.map(o => `
          <button class="opt ${def.optClass}" role="radio" aria-checked="${val === o}" data-q="${q.id}" data-v="${esc(o)}">
            <span class="radio"></span>${esc(o)}
          </button>`).join('')}
        <input class="other-input ${showOther ? '' : 'hidden'}" data-other="${q.id}" placeholder="Please specify…" value="${esc(answers[q.id + ':other'] || '')}" />
      </div>`;
    }).join('');
  } else {
    // Instrument style: sections with statements
    inner = def.sections.map((sec, si) => {
      const scale = MM.SCALES[sec.scale];
      return `<div class="q-sec">
        <div class="q-section-title"><h3>${esc(sec.title)}<span class="req">*</span></h3>
        <span class="req-note">Please select one response for each statement.</span></div>
        ${sec.scaleName ? `<div class="q-scale-head">${esc(sec.scaleName)}</div>` : ''}
        ${sec.intro ? `<p class="q-intro">${esc(sec.intro)}</p>` : ''}
        ${sec.items.map((item, ii) => {
          const k = `${si}.${ii}`;
          const val = answers[k];
          if (val != null) done++;
          return `<div class="q-item" data-q="${k}">
            <div class="stmt">${esc(item)}</div>
            ${scale.map(o => `
              <button class="opt ${def.optClass}" role="radio" aria-checked="${val === o}" data-q="${k}" data-v="${esc(o)}">
                <span class="radio"></span>${esc(o)}
              </button>`).join('')}
          </div>`;
        }).join('')}
      </div>`;
    }).join('');
  }

  return `
    <div class="body-pad">
      ${blurb ? `<div class="hero-card survey-blurb"><p>${esc(blurb)}</p></div>` : ''}
      <div class="q-card">
        <div class="q-progress">
          <b>${pageLabel}</b>
          <div class="track"><div class="fill" id="qbar" style="width:${(done / total) * 100}%"></div></div>
          <b id="qcount">${done}/${total}</b>
        </div>
        ${inner}
      </div>
    </div>
    <div class="done-row">
      <div class="form-err hidden" id="qerr">Please complete all the required fields.</div>
      <button class="btn-done" id="qdone">Done</button>
    </div>`;
}

function wireRunner(def, draftKey, onComplete) {
  const answers = S.drafts[draftKey] || {};
  const total = def.questions
    ? def.questions.length
    : def.sections.reduce((n, s) => n + s.items.length, 0);

  const countDone = () => def.questions
    ? def.questions.filter(q => answers[q.id] != null).length
    : Object.keys(answers).filter(k => !k.endsWith(':other')).length;

  app.querySelectorAll('.opt').forEach(btn => btn.addEventListener('click', () => {
    const q = btn.dataset.q, v = btn.dataset.v;
    answers[q] = v;
    S.drafts[draftKey] = answers; save();
    app.querySelectorAll(`.opt[data-q="${CSS.escape(q)}"]`).forEach(b => b.setAttribute('aria-checked', b === btn ? 'true' : 'false'));
    btn.closest('.q-item')?.classList.remove('missing');
    const oi = app.querySelector(`[data-other="${CSS.escape(q)}"]`);
    if (oi) oi.classList.toggle('hidden', !(def.questions?.find(x => x.id === q)?.other === v));
    const d = countDone();
    const bar = $('#qbar'), c = $('#qcount');
    if (bar) bar.style.width = `${(d / total) * 100}%`;
    if (c) c.textContent = `${d}/${total}`;
    if (navigator.vibrate) navigator.vibrate(8);
  }));
  app.querySelectorAll('[data-other]').forEach(inp => inp.addEventListener('input', () => {
    answers[inp.dataset.other + ':other'] = inp.value;
    S.drafts[draftKey] = answers; save();
  }));

  $('#qdone').addEventListener('click', () => {
    const missing = [];
    if (def.questions) {
      def.questions.forEach(q => { if (answers[q.id] == null) missing.push(q.id); });
    } else {
      def.sections.forEach((sec, si) => sec.items.forEach((_, ii) => {
        const k = `${si}.${ii}`;
        if (answers[k] == null) missing.push(k);
      }));
    }
    app.querySelectorAll('.q-item').forEach(el => el.classList.toggle('missing', missing.includes(el.dataset.q)));
    const err = $('#qerr');
    if (missing.length) {
      err.classList.remove('hidden');
      err.style.animation = 'none'; void err.offsetWidth; err.style.animation = '';
      const first = app.querySelector(`.q-item[data-q="${CSS.escape(missing[0])}"]`);
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
      return;
    }
    delete S.drafts[draftKey];
    onComplete(answers);
  });
}

/* ── Demographics (before the welcome screen) ────────────── */
routes.demographics = () => {
  render(`
    ${header('Demographic Questions')}
    ${runnerHTML(MM.DEMOGRAPHICS, S.drafts.demographics, { pageLabel: 'Page 1/1' })}
  `, { theme: 'theme-demo' });
  wireRunner(MM.DEMOGRAPHICS, 'demographics', answers => {
    S.demographics = { answers, completedAt: Date.now() };
    save(); confetti();
    toast('Thank you! Your details are saved 💜');
    nav('#/welcome');
  });
};

/* ── Home ────────────────────────────────────────────────── */
function tile(icon, label, route, { locked = false, badge = null, badgeDone = false } = {}) {
  return `<button class="tile ${locked ? 'locked' : ''}" data-route="${route}" data-locked="${locked}" aria-label="${esc(label)}">
    <span class="box">${icon}
      ${badge ? `<span class="badge ${badgeDone ? 'done' : ''}">${badge}</span>` : ''}
      ${locked ? `<span class="lock-ic">${I.lock}</span>` : ''}
    </span>
    <span class="lbl">${esc(label)}</span>
  </button>`;
}

function gardenSVG() {
  const wk = Math.max(1, Math.min(8, currentWeek() || 1));
  const totalRows = Math.min(wk, 6);
  const moods = [{ mood: 'starter', starter: true }, ...(S.moods || [])];
  
  const w = 320;
  const totalH = 80 + (totalRows - 1) * 34;
  
  // Diverse floral varieties: Classic bloom, Lotus, Bellflower, Star Daisy
  const flowerTypes = [
    // 0: Classic 6-petal Bloom
    (color, coreColor, scale = 1) => `
      <g transform="scale(${scale})">
        ${Array.from({ length: 6 }, (_, k) =>
          `<ellipse cx="0" cy="-8" rx="3.8" ry="8" transform="rotate(${k * 60})" fill="${SHOUT_COLORS[k % SHOUT_COLORS.length]}" opacity=".96"/>`
        ).join('')}
        <circle r="4.8" fill="${coreColor}" stroke="#fff" stroke-width="1.1"/>
        <circle r="1.8" fill="#fff" opacity=".95"/>
      </g>`,
    // 1: Radiant 8-petal Lotus
    (color, coreColor, scale = 1) => `
      <g transform="scale(${scale})">
        ${Array.from({ length: 8 }, (_, k) =>
          `<ellipse cx="0" cy="-8.5" rx="3.2" ry="8.5" transform="rotate(${k * 45})" fill="${k % 2 === 0 ? color : '#ffd166'}" opacity=".95"/>`
        ).join('')}
        <circle r="4.5" fill="${coreColor}" stroke="#fff" stroke-width="1.1"/>
        <circle r="1.7" fill="#fff" opacity=".9"/>
      </g>`,
    // 2: Tulip / Bell Blossom
    (color, coreColor, scale = 1) => `
      <g transform="scale(${scale})">
        <path d="M-6.5 -11 C-6.5 -4, -3 0, 0 0 C3 0, 6.5 -4, 6.5 -11 C3.8 -7, 1.8 -12, 0 -7.5 C-1.8 -12, -3.8 -7, -6.5 -11 Z" fill="${color}" opacity=".96"/>
        <circle cy="-3.5" r="3" fill="${coreColor}"/>
        <circle cy="-3.5" r="1.3" fill="#fff" opacity=".9"/>
      </g>`,
    // 3: 5-petal Sun Star
    (color, coreColor, scale = 1) => `
      <g transform="scale(${scale})">
        ${Array.from({ length: 5 }, (_, k) =>
          `<ellipse cx="0" cy="-7.5" rx="3.8" ry="7.5" transform="rotate(${k * 72})" fill="${color}" opacity=".95"/>`
        ).join('')}
        <circle r="4.5" fill="${coreColor}" stroke="#fff" stroke-width="1.1"/>
        <circle r="1.8" fill="#fff" opacity=".92"/>
      </g>`
  ];

  let flowersMarkup = '';
  
  // Render each week's terraced row from back (earlier weeks) to front (current week)
  for (let r = 0; r < totalRows; r++) {
    const rowWeek = r + 1;
    const baseY = totalH - 14 - (totalRows - 1 - r) * 30;
    const rowMoods = (r === totalRows - 1) ? moods : moods.filter((_, idx) => (idx % totalRows) === r);
    const count = Math.max(3, Math.min(6, (rowMoods.length || 3) + 2));
    
    // Soil / Grass strip for this row
    flowersMarkup += `<path d="M12 ${baseY} Q${w/2} ${baseY - 4} ${w - 12} ${baseY}" stroke="rgba(126, 200, 110, 0.3)" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    
    for (let c = 0; c < count; c++) {
      const moodItem = rowMoods[c % rowMoods.length] || { mood: 'starter' };
      const moodDef = MM.MOODS.find(x => x.key === moodItem.mood) || MM.MOODS[0];
      const color = moodItem.starter ? '#3366FF' : moodDef.color;
      const coreColor = moodItem.starter ? '#ffd166' : '#ffffff';
      
      const x = 24 + c * ((w - 48) / Math.max(1, count - 1)) + ((r * 13 + c * 7) % 9 - 4);
      const h = 20 + ((c * 17 + r * 23) % 18);
      const styleIdx = (r + c) % flowerTypes.length;
      const flowerSvg = flowerTypes[styleIdx](color, coreColor, 0.85 + (r * 0.05));
      const animDelay = (r * 0.12 + c * 0.07).toFixed(2);
      
      flowersMarkup += `
        <g class="flower ${moodItem.starter ? 'starter-flower' : ''}" style="animation-delay:${animDelay}s, ${(animDelay * 1.8).toFixed(2)}s">
          <path d="M${x} ${baseY} Q${x - 3} ${baseY - h / 2} ${x} ${baseY - h}" stroke="#7ec86e" stroke-width="2.2" fill="none"/>
          <ellipse cx="${x - 4}" cy="${baseY - h * 0.45}" rx="4.5" ry="2" fill="#7ec86e" transform="rotate(-28 ${x - 4} ${baseY - h * 0.45})"/>
          <g transform="translate(${x} ${baseY - h})">
            ${flowerSvg}
          </g>
        </g>
      `;
    }
  }

  return `
    <div class="garden" style="min-height:${totalH}px;display:flex;align-items:center;justify-content:center;padding:6px 0">
      <svg width="100%" height="${totalH}" viewBox="0 0 ${w} ${totalH}" style="overflow:visible">
        ${flowersMarkup}
      </svg>
    </div>
  `;
}

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? ['Peaceful night', '🌙'] : h < 12 ? ['Good morning', '🌅'] : h < 17 ? ['Good afternoon', '☀️'] : h < 21 ? ['Good evening', '🌆'] : ['Rest well tonight', '🌙'];
}

/* Moja Guide's suggested next step — a tiny on-device recommender. */
function nextStep() {
  if (!preDone()) {
    const nid = MM.PRE_SURVEYS.find(id => !S.surveys.pre[id]?.completedAt);
    return { icon: '📝', label: `Complete the ${MM.SURVEYS[nid].name}`, route: '#/pre', why: 'Your journey pathway unlocks after the Pre-Survey.' };
  }
  const today = new Date().toDateString();
  if (!S.moods.some(m => new Date(m.at).toDateString() === today)) {
    return { icon: '🌸', label: 'Check in — how are you feeling?', act: 'mood', why: 'A new flower joins your garden every day you check in.' };
  }
  if (hasArt()) {
    const wk = currentWeek();
    const due = MM.ACTIVITIES.find(a => a.week <= wk && !actState(a.id)?.submittedAt);
    if (due) return { icon: '🎨', label: `Week ${due.week}: ${due.name}`, route: `#/art/${due.id}`, why: due.week === wk ? 'This week’s creative activity is open for you.' : 'A gentle catch-up, at your own pace.' };
  }
  if (currentWeek() >= 8 && !postDone()) {
    const nid = MM.POST_SURVEYS.find(id => !S.surveys.post[id]?.completedAt);
    return { icon: '🏁', label: `Complete the ${MM.SURVEYS[nid].name}`, route: '#/post', why: 'The final check-in of your 8-week journey.' };
  }
  if (!(S.sparks || []).some(s => s.day === dayKey())) {
    return { icon: '✨', label: 'Collect today’s Daily Spark', route: '#/spark', why: 'One moment of inspiration, every day.' };
  }
  return { icon: '💜', label: 'Visit your Support Services', route: '#/support', why: 'Everything is up to date — help is always one tap away.' };
}

function journeyDots() {
  const wk = currentWeek();
  return `<div class="journey" role="button" tabindex="0" onclick="nav('#/journey')" style="cursor:pointer" title="Tap to view your 8-Week Journey Roadmap 🗺️" aria-label="Week ${wk} of 8 — Tap to open roadmap">
    ${Array.from({ length: 8 }, (_, i) => {
      const n = i + 1;
      const st = MM.ACTIVITIES[i] && actState(MM.ACTIVITIES[i].id)?.submittedAt ? 'done' : n < wk ? 'past' : n === wk ? 'now' : '';
      return `<span class="j-dot ${st}" title="Week ${n}">${st === 'done' ? '✿' : n}</span>${n < 8 ? '<i class="j-link"></i>' : ''}`;
    }).join('')}
  </div>`;
}

/* ── 8-Week Interactive Journey Roadmap Screen ────────────── */
routes.journey = () => {
  const wk = currentWeek();
  const acts = MM.ACTIVITIES;
  const done = actsDone();

  render(`
    ${header('Your 8-Week Journey 🗺️', { backTo: '#/home' })}
    <div class="body-pad" style="gap:14px">
      <div class="hero-card journey-hero" style="background:linear-gradient(135deg,rgba(82,23,120,.95),rgba(28,5,48,.98));border:1.8px solid rgba(255,209,102,.45);box-shadow:0 8px 32px rgba(10,2,20,.45)">
        <span class="spark-badge">RESILIENCE ROADMAP</span>
        <h2 class="hdr-glare">Week ${wk} of 8 — Progress: ${done}/8 Activities</h2>
        <p class="lead" style="color:rgba(255,255,255,0.92)">
          Follow your personalized 8-week creative pathway. Each week brings a guided art intervention, video reflection, and mood check-in to build lasting resilience.
        </p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
          <button class="btn btn-secondary btn-sm" onclick="MMPortfolio.showPortfolioModal()">🎓 View Certificate</button>
          <button class="btn btn-ghost btn-sm" onclick="beaconOfHopeModal()">🌟 Beacon of Hope</button>
        </div>
      </div>

      <div class="journey-roadmap-list" style="display:flex;flex-direction:column;gap:12px">
        ${acts.map((a, i) => {
          const n = a.week;
          const st = actState(a.id);
          const isDone = !!st?.submittedAt;
          const isCurrent = n === wk;
          const isOpen = n <= wk || isDone;

          return `
            <div class="card journey-week-card ${isDone ? 'is-done' : isCurrent ? 'is-current' : 'is-upcoming'}" style="background:linear-gradient(145deg,rgba(38,12,58,0.95),rgba(20,4,34,0.98));border:1.6px solid ${isCurrent ? '#ffd700' : isDone ? '#00a651' : 'rgba(255,255,255,0.18)'};border-radius:18px;padding:16px;box-shadow:0 6px 20px rgba(0,0,0,0.3)">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                <span class="chip" style="background:${isDone ? 'rgba(0,166,81,0.25)' : isCurrent ? 'rgba(255,209,102,0.25)' : 'rgba(255,255,255,0.08)'};border-color:${isDone ? '#00a651' : isCurrent ? '#ffd700' : 'rgba(255,255,255,0.2)'};color:${isDone ? '#00e676' : isCurrent ? '#ffd700' : '#ffffff'};font-weight:700">
                  Week ${n} ${isDone ? '✓ Completed' : isCurrent ? '🌟 Current Focus' : '🔒 Upcoming'}
                </span>
                <span style="font-size:22px">${isDone ? '🌸' : isCurrent ? '✨' : '🌱'}</span>
              </div>
              <h3 style="margin:4px 0 2px;font-size:16px;font-weight:800;color:#ffffff">${esc(a.name)}</h3>
              <p style="margin:0 0 10px;font-size:12.5px;line-height:1.55;color:rgba(255,255,255,0.88)">${esc(a.desc || 'Express your thoughts through digital art and reflection.')}</p>
              
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                ${isOpen ? `
                  <button class="btn btn-primary btn-sm" onclick="nav('#/art/${a.id}')">
                    ${isDone ? 'Review Art 🎨' : 'Start Week ' + n + ' Activity 🎨'}
                  </button>
                  <button class="btn btn-ghost btn-sm" onclick="MMVideo.playVideoModal(${a.id})">
                    Watch Video 🎬
                  </button>
                ` : `
                  <button class="btn btn-ghost btn-sm" disabled style="opacity:0.6">
                    Opens in Week ${n} 🔒
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${ionityFooter()}
    </div>
  `);
};

routes.home = () => {
  const wc = preDone() ? MM.WELCOME.preDone : MM.WELCOME.fresh;
  const preCount  = MM.PRE_SURVEYS.filter(id => S.surveys.pre[id]?.completedAt).length;
  const postCount = MM.POST_SURVEYS.filter(id => S.surveys.post[id]?.completedAt).length;
  const streak = moodStreak();
  const [greet, gmoji] = greeting();
  const step = nextStep();
  render(`
    ${header('Welcome!', { home: true })}
    <div class="body-pad">
      <div class="home-greet">
        <span class="hg-emoji">${gmoji}</span>
        <div>
          <b>${greet}!</b>
          <small>${esc(groupOf().name)} · Week ${currentWeek()} of 8</small>
        </div>
        <div class="greet-actions">
          <button class="chip chip-cta chip-hope" id="go-hope">🌟<span>Hope</span></button>
          <button class="chip chip-cta" id="go-spark">${I.sparkle}<span>Daily Spark${(S.sparks || []).some(s => s.day === dayKey()) ? ' ✨' : ''}</span></button>
        </div>
      </div>
      ${journeyDots()}
      <div class="chips">
        ${streak ? `<span class="chip">🔥 ${streak}-day check-in streak</span>` : ''}
        ${hasArt() ? `<span class="chip">🎨 ${actsDone()}/8 activities</span>` : ''}
        <span class="chip">📝 ${preCount + postCount}/${MM.PRE_SURVEYS.length + MM.POST_SURVEYS.length} surveys</span>
        <button class="chip" id="go-cert-chip" style="background:rgba(255,215,0,0.15);border-color:#ffd700;color:#ffd700;cursor:pointer">🎓 Certificate</button>
      </div>

      <div class="hero-card home-hero">
        <h2>${esc(wc.title)}</h2>
        <p>${esc(wc.body)}</p>
        <p class="lead">${esc(wc.tail)}</p>
      </div>

      <!-- AI Adaptive Resilience Recommender -->
      ${(() => {
        const hr = new Date().getHours();
        const recentMood = S.moods?.slice(-1)[0]?.mood;
        const acts = actsDone();

        let rec = {
          icon: '✨',
          tag: 'CREATIVE EXPLORATION',
          title: 'Daily Spark & Creative Ritual',
          desc: 'Charge your daily constellation and discover mindful creative prompts.',
          route: '#/spark',
          btnText: 'Open Daily Spark ✨',
        };

        if (recentMood === 'bad' || recentMood === 'heavy') {
          rec = {
            icon: '🌊',
            tag: 'EMOTIONAL GROUNDING',
            title: '4-6-7 Mindful Breath & 432Hz Calm',
            desc: 'Center your mind with natural 432Hz harmonic soundscapes and guided breathing.',
            route: '#/help',
            btnText: 'Breathe & Center 🌊',
          };
        } else if (acts < 8 && acts < currentWeek()) {
          rec = {
            icon: '🎨',
            tag: 'CREATIVE VOICE',
            title: `Week ${currentWeek()} Art Studio: Moja Vision 2.0`,
            desc: 'Express yourself through digital painting with on-device art psychology & color insights.',
            route: '#/art',
            btnText: 'Open Art Studio 🎨',
          };
        } else if (hr >= 18 || hr < 5) {
          rec = {
            icon: '🌙',
            tag: 'EVENING REFLECTION',
            title: 'Writer Journal & Acoustic Reflection',
            desc: 'Speak or write your evening thoughts in your private AES-256 encrypted vault.',
            route: '#/journal/write',
            btnText: 'Open Evening Journal 📖',
          };
        }

        return `
          <div class="ai-recommender-card">
            <div class="air-head">
              <span class="spark-badge">${rec.tag}</span>
              <span class="air-ai-pill">🧠 Adaptive Micro-AI</span>
            </div>
            <div class="air-body">
              <span class="air-icon">${rec.icon}</span>
              <div class="air-info">
                <h3>${rec.title}</h3>
                <p>${rec.desc}</p>
              </div>
            </div>
            <button class="btn btn-primary btn-block air-btn" onclick="nav('${rec.route}')">${rec.btnText}</button>
          </div>
        `;
      })()}

      <button class="next-step" id="next-step" aria-label="Suggested next step">
        <span class="ns-emoji">${step.icon}</span>
        <span class="grow">
          <small>Moja Guide suggests</small>
          <b>${esc(step.label)}</b>
          <em>${esc(step.why)}</em>
        </span>
        <span class="ns-go">›</span>
      </button>
      <div class="tile-grid">
        ${tile(I.info, 'Instructions', '#/instructions')}
        ${tile(I.headset, 'Support Services', '#/support')}
        ${tile(I.doc, 'Pre-Survey', '#/pre', { badge: preDone() ? '✓' : `${preCount}/3`, badgeDone: preDone() })}
        ${hasArt() ? tile(I.palette, 'Art Activities', '#/art', { locked: !artOpen(), badge: artOpen() && actsDone() ? `${actsDone()}/8` : null }) : ''}
        ${hasChat() ? tile(I.chat, 'Chat', '#/chat', { locked: !chatOpen() }) : ''}
        ${tile(I.clipboardCheck, 'Post-Survey', '#/post', { locked: !postOpen(), badge: postOpen() ? (postDone() ? '✓' : `${postCount}/4`) : null, badgeDone: postDone() })}
        ${tile(I.gamepad, 'Games Hub (2D & 3D)', '#/games', { badge: '3 Games 🎮' })}
        ${tile(I.journal, 'Writer & Journal', '#/journal', { badge: S.journal?.length ? `${S.journal.length}` : 'New' })}
      </div>
      ${(() => {
        const guesses = Predict.next('home', 3);
        return guesses.length ? `
          <div class="predict-row">
            <small class="predict-lbl">Jump back in</small>
            <div class="predict-chips">
              ${guesses.map(g => `<button class="predict-chip" data-pred="${g.route}" title="${esc(g.why)}">${esc(g.label)}<em>${esc(g.why)}</em></button>`).join('')}
            </div>
          </div>` : '';
      })()}
      <div class="garden-wrap">
        <div class="garden-title">Your mood garden</div>
        <div class="garden-subtitle">${S.moods.length ? `${S.moods.length + 1} flowers growing with you` : 'Your first flower is already here — check in to help it grow'}</div>
        ${gardenSVG()}
      </div>

      <!-- Moja Bee 3D Launch Card at the Bottom -->
      <div class="game3d-bottom-card" onclick="nav('#/game3d')" role="button" tabindex="0" aria-label="Play Moja Bee 3D Sunray Flight">
        <div class="g3b-inner">
          <div class="g3b-icon">🐝✨</div>
          <div class="g3b-text">
            <div class="g3b-tag">3D SUNRAY FLIGHT • GAME ENGINE</div>
            <b>Moja Bee 3D: River &amp; Meadow Flight</b>
            <p>Fly over blooming sunflower fields and sparkling winding rivers to gather radiant sunrays.</p>
          </div>
        </div>
        <button class="btn btn-primary btn-block g3b-btn">Fly Moja Bee 3D 🐝</button>
      </div>

      <button class="privacy-strip" id="go-privacy">
        ${I.shield}<span><b>${Vault.encrypted() ? 'Your journal is encrypted on this phone' : 'Storage is not encrypted here'}</b><small>${Vault.hasPin() ? 'PIN lock on' : 'Tap to add a PIN, export or erase your data'}</small></span><em>›</em>
      </button>
      <p class="partner-strip">${esc(MM.PARTNERS.line)}</p>
      ${ionityFooter()}
    </div>
  `);
  app.querySelectorAll('.tile').forEach(t => t.addEventListener('click', () => {
    if (t.dataset.locked === 'true') { toast('Complete your Pre-Survey to unlock this ✨'); return; }
    nav(t.dataset.route);
  }));
  $('#go-hope')?.addEventListener('click', () => beaconOfHopeModal());
  $('#go-spark')?.addEventListener('click', () => nav('#/spark'));
  $('#go-cert-chip')?.addEventListener('click', () => MMPortfolio.showPortfolioModal());
  $('#go-privacy')?.addEventListener('click', () => nav('#/privacy'));
  $('.garden-wrap')?.addEventListener('click', () => maybeMoodModal(true));
  app.querySelectorAll('[data-pred]').forEach(b => b.addEventListener('click', () => nav(b.dataset.pred)));
  $('#next-step')?.addEventListener('click', () => {
    if (step.act === 'mood') {
      maybeMoodModal(true);
      return;
    }
    if (step.route) nav(step.route);
  });
};

/* ── Daily Spark ✨ — hold-to-charge inspiration ─────────── */
function dayKey(ts = Date.now()) { const d = new Date(ts); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }

function pickSpark() {
  // Deterministic per day + phone, so everyone gets "their" spark of the day
  const seedStr = dayKey() + (S.auth?.phone || '');
  let h = 2166136261;
  for (const c of seedStr) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return MM.SPARKS[Math.abs(h) % MM.SPARKS.length];
}

function personalLine() {
  const streak = moodStreak();
  const done = actsDone();
  const recent = S.moods.slice(-5);
  const good = recent.filter(m => m.mood === 'good').length;
  const bad = recent.filter(m => m.mood === 'bad').length;
  if (!S.sparks || !S.sparks.length) return MM.SPARK_PERSONAL.firstSpark;
  if (streak >= 2) return MM.SPARK_PERSONAL.streak(streak);
  if (done > 0 && Math.random() < .5) return MM.SPARK_PERSONAL.acts(done);
  if (recent.length >= 3 && good > bad) return MM.SPARK_PERSONAL.moodsGood;
  if (recent.length >= 3 && bad > good) return MM.SPARK_PERSONAL.moodsTough;
  return MM.SPARK_PERSONAL.week(currentWeek());
}

routes.spark = () => {
  if (!S.sparks) S.sparks = [];
  const todayDone = S.sparks.some(s => s.day === dayKey());
  const spark = pickSpark();
  const stars = S.sparks.slice(-56);
  const constellation = stars.map((s, i) => {
    const x = 20 + ((i * 37) % 280), y = 14 + ((i * 53) % 60);
    const r = 1.4 + ((i * 7) % 3) * .8;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffd166" opacity="${.45 + ((i * 13) % 5) * .12}">
      <animate attributeName="opacity" values="${.4 + ((i * 13) % 5) * .1};1;${.4 + ((i * 13) % 5) * .1}" dur="${2.2 + (i % 5) * .8}s" repeatCount="indefinite"/>
    </circle>`;
  }).join('');

  render(`
    ${header('Daily Spark', { backTo: '#/home' })}
    <div class="body-pad spark-wrap">
      <svg class="spark-sky" viewBox="0 0 320 80" aria-hidden="true">${constellation}
        ${stars.length ? '' : '<text x="160" y="46" text-anchor="middle" fill="rgba(255,255,255,.45)" font-size="9.5" font-family="Poppins">your collected sparks will shine here</text>'}
      </svg>
      <div class="spark-stage ${todayDone ? 'lit' : ''}" id="spark-stage">
        <div class="spark-halo" id="spark-halo"></div>
        <button class="spark-orb" id="spark-orb" aria-label="${todayDone ? 'Today’s spark' : 'Hold to charge your spark'}">
          ${flowerSVG(70, { petal: '#fff' })}
        </button>
      </div>
      <div class="spark-bottom-wording">
        <div class="spark-hint" id="spark-hint">${todayDone ? 'Today’s spark is lit ✨' : 'Press &amp; hold the orb.<br/>Breathe in while it charges…'}</div>
        <p class="spark-count">${S.sparks.length ? `⭐ ${S.sparks.length} spark${S.sparks.length > 1 ? 's' : ''} collected on your journey` : 'Collect a spark every day — build your constellation'}</p>
      </div>
      <div class="spark-card ${todayDone ? '' : 'hidden'}" id="spark-card">
        <div class="spark-q">“${esc(spark.text)}”</div>
        <div class="spark-by">— ${esc(spark.by)}</div>
        <div class="spark-you" id="spark-you"></div>
        <div class="modal-btns">
          <button class="btn btn-secondary" id="spark-beacon">🌟 Beacon of Hope</button>
          <button class="btn btn-ghost" id="spark-share">Share</button>
          <button class="btn btn-primary" id="spark-home">Carry it with me</button>
        </div>
      </div>
    </div>
  `, { theme: 'theme-spark' });

  const orb = $('#spark-orb'), halo = $('#spark-halo'), hint = $('#spark-hint'), stage = $('#spark-stage');
  const cardEl = $('#spark-card');
  if (todayDone) $('#spark-you').textContent = S.sparks.find(s => s.day === dayKey())?.you || '';

  let charge = 0, chargeIv = null;
  const HOLD_MS = 2600;

  function reveal() {
    clearInterval(chargeIv);
    stage.classList.add('lit');
    const you = personalLine();
    S.sparks.push({ day: dayKey(), text: spark.text, by: spark.by, you, at: Date.now() });
    save();
    if (navigator.vibrate) navigator.vibrate([40, 80, 140]);
    confetti();
    $('#spark-you').textContent = you;
    hint.innerHTML = 'Today’s spark is lit ✨';
    cardEl.classList.remove('hidden');
    cardEl.classList.add('pop');
  }
  function startHold(e) {
    if (todayDone || stage.classList.contains('lit')) return;
    e.preventDefault();
    charge = 0;
    orb.classList.add('charging');
    hint.textContent = 'Keep holding… breathe in…';
    chargeIv = setInterval(() => {
      charge += 50;
      const p = Math.min(1, charge / HOLD_MS);
      halo.style.setProperty('--p', p);
      if (navigator.vibrate && charge % 500 === 0) navigator.vibrate(6);
      if (p >= 1) { endHold(); reveal(); }
    }, 50);
  }
  function endHold() {
    clearInterval(chargeIv);
    orb.classList.remove('charging');
    if (!stage.classList.contains('lit')) {
      halo.style.setProperty('--p', 0);
      hint.innerHTML = 'Press & hold the orb.<br/>Breathe in while it charges…';
    }
  }
  orb.addEventListener('pointerdown', startHold);
  orb.addEventListener('pointerup', endHold);
  orb.addEventListener('pointerleave', endHold);
  orb.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !todayDone) { e.preventDefault(); if (!chargeIv) startHold(e); } });
  orb.addEventListener('keyup', endHold);

  $('#spark-beacon')?.addEventListener('click', () => beaconOfHopeModal());
  $('#spark-home').onclick = () => { toast('Spark saved to your constellation ⭐'); nav('#/home'); };
  $('#spark-share').onclick = async () => {
    const rec = S.sparks.find(s => s.day === dayKey()) || { text: spark.text, by: spark.by };
    const msg = `“${rec.text}” — ${rec.by}\n\n✨ My Daily Spark from MojaMind`;
    try {
      if (navigator.share) await navigator.share({ title: 'My Daily Spark — MojaMind', text: msg });
      else { await navigator.clipboard.writeText(msg); toast('Spark copied — paste it anywhere 💫'); }
    } catch { /* user cancelled */ }
  };
};

/* IONITY brand footer */
function ionityFooter() {
  return `<footer class="ionity-foot">
    <div class="io-logo-wrap">
      <img class="io-logo-img" src="./assets/branding/ionity-global-white.png" alt="IONITY GLOBAL" />
    </div>
    <div class="io-credits">
      <span>Crafted by <a href="https://www.ionity.co.za" target="_blank" rel="noopener"><b>IONITY GLOBAL</b></a> · <a class="io-url" href="https://www.ionity.co.za" target="_blank" rel="noopener">www.ionity.co.za</a></span>
    </div>
  </footer>`;
}

function currentWeek() {
  if (!S.startedAt) return 1;
  return Math.min(8, Math.floor((Date.now() - S.startedAt) / (7 * 864e5)) + 1);
}
function moodStreak() {
  const days = new Set(S.moods.map(m => new Date(m.at).toDateString()));
  let n = 0; const d = new Date();
  if (!days.has(d.toDateString())) {
    d.setDate(d.getDate() - 1);
  }
  while (days.has(d.toDateString())) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function maybeMoodModal(force = false) {
  if (!force) return; // Automatic mood check-in popup disabled on login
  let sel = null;
  const m = modal(`
    <h3 class="mood-title">How are you feeling today?</h3>
    <div class="mood-list">
      ${MM.MOODS.map(x => `
        <button class="mood-row" data-mood="${x.key}">
          ${faceSVG(x.key, x.color)}
          <span>${esc(x.label)}</span>
        </button>`).join('')}
    </div>
    <div class="mood-note-lbl">Want to share more? (Optional)</div>
    <textarea class="mood-note" id="mood-note" aria-label="Share more"></textarea>
    <div class="modal-btns">
      <button class="btn btn-primary" id="mood-save">Save</button>
      <button class="btn btn-ghost" id="mood-cancel">Cancel</button>
    </div>
  `);
  m.querySelectorAll('.mood-row').forEach(r => r.addEventListener('click', () => {
    sel = r.dataset.mood;
    m.querySelectorAll('.mood-row').forEach(x => x.classList.toggle('sel', x === r));
    r.classList.remove('react');
    void r.offsetWidth;
    r.classList.add('react');
    setTimeout(() => r.classList.remove('react'), 620);
    if (navigator.vibrate) navigator.vibrate(8);
  }));
  m.querySelectorAll('.mood-row').forEach(r => {
    r.addEventListener('pointermove', e => {
      const box = r.getBoundingClientRect();
      const lookX = Math.max(-1.8, Math.min(1.8, ((e.clientX - box.left) / box.width - .5) * 4));
      const lookY = Math.max(-1.3, Math.min(1.3, ((e.clientY - box.top) / box.height - .5) * 3));
      r.style.setProperty('--look-x', `${lookX}px`);
      r.style.setProperty('--look-y', `${lookY}px`);
    });
    r.addEventListener('pointerleave', () => {
      r.style.setProperty('--look-x', '0px');
      r.style.setProperty('--look-y', '0px');
    });
  });
  m.querySelector('#mood-cancel').onclick = () => closeModal();
  m.querySelector('#mood-save').onclick = () => {
    if (!sel) return toast('Pick a face that matches your mood 🙂');
    S.moods.push({ mood: sel, note: m.querySelector('#mood-note').value.trim(), at: Date.now() });
    save(); closeModal();
    toast('Mood saved — a new flower joined your garden 🌸');
    if (location.hash.includes('home') || location.hash === '') route();
  };
}

/* ── Instructions ────────────────────────────────────────── */
routes.instructions = (_, isBack) => {
  const icMap = { clipboard: I.clipboard, compass: I.compass, palette: I.palette };
  render(`
    ${header('Instructions')}
    <div class="body-pad">
      <div class="hero-card">
        <h2>${esc(MM.INSTRUCTIONS.heroTitle)}</h2>
        <p>${esc(MM.INSTRUCTIONS.heroBody)}</p>
      </div>
      ${MM.INSTRUCTIONS.sections.map((sec, i) => `
        <div class="info-card" style="animation-delay:${i * .07}s">
          <h3><span class="ic">${icMap[sec.icon] || I.info}</span>${esc(sec.title)}</h3>
          <ul>${sec.items.map(([b, t]) => `<li><b>${esc(b)}:</b> ${esc(t)}</li>`).join('')}</ul>
        </div>`).join('')}
      <div class="incentive">${I.gift}<span>${esc(MM.INSTRUCTIONS.incentive)}</span></div>
      <div class="incentive datafree">📶<span>${esc(MM.INSTRUCTIONS.datafree)}</span></div>
    </div>
  `, { theme: 'theme-purple', backAnim: isBack });
};

/* ── Support services — Social Worker & IT pathways ──────── */
routes.support = (_, isBack) => {
  const icMap = { phone: I.phone, chat: I.chat, 'chat-heart': I.chatHeart, sun: I.sun, 'shield-heart': I.shieldHeart, wrench: I.wrench };
  const tickets = S.tickets.slice(0, 6);
  render(`
    ${header('Support Services')}
    <div class="body-pad">
      <div class="hero-card"><p class="lead">${esc(MM.SUPPORT.intro)}</p></div>
      <div class="pathway-row">
        ${MM.SUPPORT.pathways.map((p, i) => `
          <button class="pathway" data-path="${p.kind}" style="animation-delay:${i * .07}s;background:linear-gradient(150deg, ${p.color[0]}, ${p.color[1]})">
            <span class="pw-ic">${icMap[p.icon]}</span>
            <b>${esc(p.name)}</b>
            <p>${esc(p.desc)}</p>
            <span class="pw-cta">${esc(p.cta)} ›</span>
          </button>`).join('')}
      </div>
      ${tickets.length ? `
        <div class="info-card tickets-card">
          <h3><span class="ic">${I.ticket}</span>My support requests</h3>
          <div class="tkt-list">
            ${tickets.map(t => `
              <div class="tkt">
                <span class="tkt-kind ${t.kind}">${t.kind === 'it' ? '🛠' : '💜'}</span>
                <span class="grow">
                  <b>${esc(t.subject)}</b>
                  <small>${esc(t.ref)} · ${new Date(t.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}${t.source === 'phq9' ? ' · from your survey' : ''}</small>
                </span>
                <em class="tkt-status">${esc(t.status)}</em>
              </div>`).join('')}
          </div>
          <p class="tkt-note" style="margin:10px 0 0">${esc(MM.SUPPORT.ticketNote)}</p>
        </div>` : ''}
      ${MM.SUPPORT.services.map((s, i) => `
        <div class="svc-card" style="animation-delay:${i * .06}s">
          <span class="svc-ic" style="background:linear-gradient(140deg, ${s.color[0]}, ${s.color[1]})">${icMap[s.icon]}</span>
          <div class="grow">
            <h4>${esc(s.name)}</h4>
            <p>${esc(s.desc)}</p>
            <div class="svc-acts">
              ${s.actions.map(a => a.route
                ? `<button class="svc-btn alt" data-route="${a.route}">${I.chat}${esc(a.label)}</button>`
                : `<a class="svc-btn ${a.kind === 'call' ? '' : 'alt'}" href="${a.href}" ${a.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${a.kind === 'call' ? I.phone : I.chat}${esc(a.label)}</a>`).join('')}
            </div>
          </div>
        </div>`).join('')}
    </div>
  `, { theme: 'theme-purple', backAnim: isBack });
  app.querySelectorAll('.pathway').forEach(b => b.addEventListener('click', () => ticketModal(b.dataset.path)));
  app.querySelectorAll('[data-route]').forEach(b => b.addEventListener('click', () => {
    if (!hasChat()) return ticketModal('social');
    if (!chatOpen()) return toast('Chat unlocks after your Pre-Survey ✨');
    nav(b.dataset.route);
  }));
};

/* ── Help Now (breathing with countdown) ─────────────────── */
routes.help = () => {
  render(`
    ${header('Help Now')}
    <div class="body-pad">
      <div class="hero-card"><p class="lead">${esc(MM.HELP_NOW.intro)}</p></div>
      <div class="info-card">
        <div style="display:flex;flex-direction:column;gap:16px">
          ${MM.HELP_NOW.steps.map(([t, d], i) => `
            <div class="crisis-step">
              <span class="n">${i + 1}</span>
              <div><h4>${esc(t)}</h4><p>${esc(d)}</p></div>
            </div>`).join('')}
        </div>
        <div class="svc-acts" style="margin-top:14px">
          ${MM.HELP_NOW.lines.map(l => `<a class="svc-btn" href="${l.href}">${I.phone}${esc(l.label)}: ${esc(l.value)}</a>`).join('')}
        </div>
      </div>
      <div class="info-card beacon-help-card">
        <h3><span class="ic">🌟</span>${esc(MM.HOPE.title)}</h3>
        <p class="hope-quote">“${esc(MM.HOPE.lead)}”</p>
        <div class="svc-acts" style="margin-top:10px">
          <button class="svc-btn" id="help-hope">✨ Open Beacon of Hope</button>
        </div>
      </div>

      <div class="info-card">
        <h3><span class="ic">${I.sun}</span>Breathe with me — 4 · 6 · 7</h3>
        <div class="breathe-wrap">
          <div class="breathe-ring"><div class="breathe-ball" id="bball"><span id="btext">Tap to start</span><b class="bnum" id="bnum"></b></div></div>
          <div class="breathe-count" id="bcount">Breathe in 4s — hold 6s — out 7s</div>
        </div>
      </div>

      <div class="info-card">
        <h3><span class="ic">${I.info}</span>Using MojaMind</h3>
        <ul>
          <li><b>Voice navigation:</b> tap the microphone in the header and say “home”, “art activities”, “hope”, or “help now”.</li>
          <li><b>Accessibility:</b> the ♿ button makes text bigger, raises contrast, or calms motion.</li>
          <li><b>Privacy &amp; security:</b> see how your journal is encrypted, set a PIN, export or erase your data.</li>
          <li><b>Support:</b> request a Social Worker or IT Technical Support from Support Services at any time.</li>
        </ul>
        <div class="svc-acts" style="margin-top:12px">
          <button class="svc-btn alt" id="help-privacy">${I.shield}Privacy &amp; Security</button>
          ${MMVoice.supported() ? `<button class="svc-btn alt" id="help-voice">${I.mic}Voice commands</button>` : ''}
        </div>
      </div>

      <div class="info-card">
        <h3><span class="ic">${I.user}</span>My study group</h3>
        <p>You are in <b>${esc(groupOf().name)}</b> — ${esc(groupOf().desc)}.</p>
        <p class="tkt-note">Your facilitator assigns your group. Changing it alters which parts of the study you take part in, so please only change it if your facilitator asked you to.</p>
        <div class="svc-acts" style="margin-top:10px">
          <button class="svc-btn alt" id="help-group">Change my study group</button>
        </div>
        ${S.groupChanges.length ? `<p class="tkt-note" style="margin-top:10px">Last changed ${new Date(S.groupChanges[S.groupChanges.length - 1].at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}.</p>` : ''}
      </div>
    </div>
  `, { theme: 'theme-purple' });

  $('#help-hope')?.addEventListener('click', () => beaconOfHopeModal());
  $('#help-privacy')?.addEventListener('click', () => nav('#/privacy'));
  $('#help-voice')?.addEventListener('click', () => voiceHelpModal());
  $('#help-group')?.addEventListener('click', () => groupChangeModal());

  const ball = $('#bball'), text = $('#btext'), count = $('#bcount'), num = $('#bnum');
  let timer = null, tick = null;
  const phases = [['in', 'Breathe in…', 4], ['hold', 'Hold…', 6], ['out', 'Breathe out…', 7]];
  let pi = 0;
  function stopAll() {
    clearTimeout(timer); clearInterval(tick); timer = tick = null; pi = 0;
    ball.className = 'breathe-ball'; text.textContent = 'Tap to start';
    num.textContent = ''; count.textContent = 'Breathe in 4s — hold 6s — out 7s';
  }
  function step() {
    const [cls, label, secs] = phases[pi % 3];
    ball.className = 'breathe-ball ' + cls;
    text.textContent = label;
    let left = secs;
    num.textContent = left;
    count.textContent = `${secs} seconds — you're doing great`;
    clearInterval(tick);
    tick = setInterval(() => {
      left--;
      if (left > 0) { num.textContent = left; if (navigator.vibrate) navigator.vibrate(6); }
    }, 1000);
    if (navigator.vibrate) navigator.vibrate(20);
    pi++;
    timer = setTimeout(step, secs * 1000);
  }
  ball.parentElement.addEventListener('click', () => { timer ? stopAll() : step(); });
};

/* ── Privacy, security & intelligence ────────────────────── */
routes.privacy = (_, isBack) => {
  const mode = Vault.currentMode();
  const tf = MMNLP.transformerInfo();
  const modeCopy = {
    pin:    ['PIN protected', 'Your journal is encrypted with a key made from your PIN. The PIN is never stored, so without it nobody can read this data — not even the study team.'],
    device: ['Encrypted on this device', 'Your journal is encrypted with a key held on this phone. It stops casual snooping through browser storage. Add a PIN for protection that survives someone having your unlocked phone.'],
    plain:  ['Not encrypted here', 'This browser did not give MojaMind its encryption tools (that usually means the page is not served over HTTPS). Your journal is stored as plain text on this device.'],
  }[mode] || ['Unknown', ''];

  render(`
    ${header('Privacy & Security', { backTo: '#/home' })}
    <div class="body-pad">
      <div class="sec-hero ${mode}">
        <span class="sec-ic">${I.shield}</span>
        <div class="grow">
          <h2>${esc(modeCopy[0])}</h2>
          <p>${esc(modeCopy[1])}</p>
          <span class="sec-badge">AES-GCM 256 · PBKDF2 ${Vault.ITERATIONS.toLocaleString('en')} rounds</span>
        </div>
      </div>

      <div class="info-card">
        <h3><span class="ic">${I.lock}</span>PIN lock</h3>
        <p>Ask for a PIN each time MojaMind opens, and lock automatically after five quiet minutes.</p>
        <div class="svc-acts">
          ${Vault.hasPin()
            ? `<button class="svc-btn" id="pin-change">Change PIN</button>
               <button class="svc-btn alt" id="pin-off">Remove PIN</button>
               <button class="svc-btn alt" id="pin-now">Lock now</button>`
            : `<button class="svc-btn" id="pin-on">Set up a PIN</button>`}
        </div>
      </div>

      <div class="info-card">
        <h3><span class="ic">${I.brain}</span>On-Device AI & Offline Model Hub</h3>
        <p>Everything below runs 100% locally on your phone. Nothing you write, say or draw is ever uploaded.</p>
        
        <div style="background:rgba(51,102,255,0.14);border:1px solid rgba(51,102,255,0.35);border-radius:14px;padding:12px;margin:10px 0">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
            <span style="font-weight:700;font-size:13.5px;color:#ffffff">🧠 MobileBERT Neural Engine</span>
            <span class="set-pill ${MMNLP.transformerReady() ? 'on' : ''}">${MMNLP.transformerReady() ? '⚡ Active (Overhauled)' : 'Offline Option'}</span>
          </div>
          <p style="font-size:12px;line-height:1.5;color:rgba(255,255,255,0.85);margin:0 0 8px">
            <b>25 Million parameters · ~48 MB int8</b><br/>
            Task-specific text processing. Ideal for on-device Named Entity Recognition (NER), deep sentiment analysis, and question-answering over short snippets.
          </p>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            <small style="color:#ffd166;font-size:11px">📶 One-time download (WiFi recommended), then works 100% offline.</small>
            <label class="switch"><input id="set-tf" type="checkbox" ${MMNLP.transformerReady() ? 'checked' : ''} /><span class="knob"></span></label>
          </div>
        </div>

        <div class="tf-progress ${MMNLP.transformerReady() ? '' : 'hidden'}" id="tf-progress" style="margin:10px 0">
          <div class="track" style="height:8px;background:rgba(255,255,255,0.2);border-radius:4px;overflow:hidden"><div class="fill" id="tf-bar" style="height:100%;background:linear-gradient(90deg,#3366ff,#ffd700);width:${MMNLP.transformerReady() ? '100%' : '0%'};transition:width 0.2s"></div></div>
          <small id="tf-status" style="display:block;margin-top:5px;font-weight:600;color:#6ec1ff">${MMNLP.transformerReady() ? 'Ready — MobileBERT is active and powering on-device intelligence offline.' : 'Preparing…'}</small>
        </div>

        ${MMNLP.transformerReady() ? `
          <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:10px;margin-top:8px;border:1px solid rgba(255,255,255,0.1)">
            <b style="font-size:12px;color:#ffd700">🔬 Live MobileBERT Inference Sandbox:</b>
            <div style="display:flex;gap:6px;margin-top:6px">
              <input id="tf-test-in" placeholder="Type a sentence to test live inference…" style="flex:1;padding:6px 10px;font-size:12px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);color:#fff" value="I was feeling overwhelmed, but painting the River of Life brought me peace." />
              <button class="btn btn-ghost" id="tf-test-btn" style="padding:6px 12px;font-size:11px;font-weight:700">Test</button>
            </div>
            <div id="tf-test-out" style="margin-top:6px;font-size:11.5px;color:#ffffff;line-height:1.4"></div>
          </div>
        ` : ''}

        <div class="set-row" style="margin-top:12px">
          <div class="grow"><b>Moja Vision 2.0</b><small>On-device color spectrum & picture psychology reading</small></div>
          <label class="switch"><input id="set-vision" type="checkbox" ${S.ai.vision ? 'checked' : ''} /><span class="knob"></span></label>
        </div>
        <div class="set-row">
          <div class="grow"><b>Voice navigation</b><small>${MMVoice.supported() ? 'Move around by speaking — audio is never stored' : 'Not available in this browser'}</small></div>
          <label class="switch"><input id="set-voice" type="checkbox" ${MMVoice.isOn() ? 'checked' : ''} ${MMVoice.supported() ? '' : 'disabled'} /><span class="knob"></span></label>
        </div>
        <div class="set-row">
          <div class="grow"><b>Predictive shortcuts</b><small>Learns your habits on this phone to suggest the next step</small></div>
          <label class="switch"><input id="set-predict" type="checkbox" ${S.ai.predictive ? 'checked' : ''} /><span class="knob"></span></label>
        </div>
        ${S.ai.predictive && Predict.next('home', 3).length ? `
          <div class="predict-peek">
            <small>What it currently expects you to open next</small>
            <div>${Predict.next('home', 3).map(g => `<span class="pp">${esc(g.label)} · ${Math.round(g.score * 100)}%</span>`).join('')}</div>
            <button class="link" id="predict-forget">Forget what it learned</button>
          </div>` : ''}
      </div>

      <div class="info-card">
        <h3><span class="ic">${I.download}</span>Your data</h3>
        <p>This journal belongs to you. Take a copy whenever you like, or erase everything from this device.</p>
        <div class="svc-acts">
          <button class="svc-btn alt" id="data-export">Download my journal</button>
          <button class="svc-btn danger" id="data-wipe">Erase everything</button>
        </div>
        <p class="tkt-note" style="margin-top:10px">Erasing removes your surveys, activities, pictures, drawings, voice notes and chats from this phone. It cannot be undone.</p>
      </div>

      ${ionityFooter()}
    </div>
  `, { theme: 'theme-purple', backAnim: isBack });

  /* PIN management */
  $('#pin-on')?.addEventListener('click', () => pinModal('set'));
  $('#pin-change')?.addEventListener('click', () => pinModal('change'));
  $('#pin-now')?.addEventListener('click', () => { Vault.lock(); lockScreen('Locked. Enter your PIN to continue.'); });
  $('#pin-off')?.addEventListener('click', () => {
    confirmPhrase({
      title: 'Remove your PIN?',
      body: 'Your journal stays encrypted with a device key, but anyone holding your unlocked phone could open MojaMind and read it.',
      phrase: 'I am sure',
      danger: true,
      onYes: async () => {
        await Vault.clearPin(S);
        toast('PIN removed — your journal is still encrypted on this device');
        route();
      },
    });
  });

  /* Intelligence toggles & MobileBERT Download */
  $('#set-tf')?.addEventListener('change', async e => {
    if (!e.target.checked) {
      MMNLP.disableTransformer();
      S.ai.transformer = false;
      save();
      toast('Switched back to built-in Nano-SLM engine 🌿');
      return route();
    }
    e.target.disabled = true;
    const wrap = $('#tf-progress'), bar = $('#tf-bar'), status = $('#tf-status');
    wrap.classList.remove('hidden');
    status.textContent = 'Connecting to download MobileBERT Neural Engine (25M params)…';
    try {
      await MMNLP.enableTransformer('mobilebert', p => {
        const pct = p.progress != null ? Math.round(p.progress) : null;
        if (pct != null && bar) bar.style.width = `${pct}%`;
        if (status) status.textContent = `${p.status === 'download' || p.status === 'progress' ? 'Downloading MobileBERT' : p.status || 'Loading'} ${p.file ? p.file.split('/').pop() : ''} ${pct != null ? pct + '%' : ''}`.trim();
      });
      S.ai.transformer = true;
      S.ai.model = 'mobilebert';
      save();
      if (bar) bar.style.width = '100%';
      if (status) status.textContent = 'Ready — MobileBERT is active and running locally on this device!';
      confetti();
      toast('MobileBERT 25M Neural Engine is active! 🧠✨', 4000);
      setTimeout(route, 800);
    } catch (err) {
      console.error('Transformer error:', err);
      S.ai.transformer = false;
      save();
      e.target.checked = false;
      wrap.classList.add('hidden');
      toast('Could not load MobileBERT — check your connection and try again 📶', 4000);
    } finally {
      e.target.disabled = false;
    }
  });

  /* MobileBERT Live Tester */
  $('#tf-test-btn')?.addEventListener('click', async () => {
    const input = $('#tf-test-in')?.value.trim();
    const out = $('#tf-test-out');
    if (!input || !out) return;
    out.innerHTML = '<i>Running MobileBERT inference on device…</i>';
    const t0 = performance.now();
    const deep = await MMNLP.analyseDeep(input);
    const ms = Math.round(performance.now() - t0);
    const themes = MMNLP.extractThemes(input).map(t => `${t.icon} ${t.name}`).join(', ') || 'General Expression';
    out.innerHTML = `
      <div style="background:rgba(255,255,255,0.06);padding:6px 8px;border-radius:6px;margin-top:4px">
        <b>Valence:</b> <span style="color:${deep.sentiment.label === 'positive' ? '#4ade80' : deep.sentiment.label === 'negative' ? '#f87171' : '#ffd166'}">${deep.sentiment.label.toUpperCase()} (${Math.round(deep.sentiment.confidence * 100)}% confidence)</span><br/>
        <b>Themes Spotted:</b> ${esc(themes)}<br/>
        <b>Latency:</b> <span style="color:#ffd700">${ms}ms (Zero Network Data)</span>
      </div>
    `;
  });

  $('#set-vision')?.addEventListener('change', e => { S.ai.vision = e.target.checked; save(); toast(e.target.checked ? 'Moja Vision on 🎨' : 'Moja Vision off'); });
  $('#set-voice')?.addEventListener('change', () => toggleVoiceNav());
  $('#set-predict')?.addEventListener('change', e => {
    S.ai.predictive = e.target.checked; save();
    toast(e.target.checked ? 'Predictive shortcuts on' : 'Predictive shortcuts off');
    route();
  });
  $('#predict-forget')?.addEventListener('click', () => { Predict.reset(); toast('Forgotten — it will learn again from here'); route(); });

  /* Data */
  $('#data-export')?.addEventListener('click', () => {
    const blob = new Blob([Vault.exportBundle(S)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mojamind-journal-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast('Your journal has been downloaded 💜');
  });
  $('#data-wipe')?.addEventListener('click', () => {
    confirmPhrase({
      title: 'Erase everything?',
      body: 'Every survey answer, reflection, picture, drawing, voice note and chat on this phone will be permanently deleted.',
      phrase: 'I am sure',
      danger: true,
      onYes: () => { Vault.wipe(); location.reload(); },
    });
  });
};

/** Change study group — guarded, because it changes the whole journey. */
function groupChangeModal() {
  let picked = S.group;
  const m = modal(`
    <h3>Change study group</h3>
    <p style="font-size:12.8px;line-height:1.6;color:#ffffff;margin:0 0 12px">
      Only change this if your facilitator asked you to. Your surveys, activities and reflections
      stay exactly as they are — but which features you can reach will change.</p>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${[1, 2, 3].map(g => `
        <button class="opt-choice ${S.group === g ? 'sel' : ''}" data-g="${g}">
          <span class="oc-radio"></span>
          <span class="grow">
            <h5><span class="oc-emoji">${g === 1 ? '📋' : g === 2 ? '🎨' : '🌟'}</span>${esc(MM.GROUPS[g].name)}${S.group === g ? ' — current' : ''}</h5>
            <p>${esc(MM.GROUPS[g].desc)}</p>
          </span>
        </button>`).join('')}
    </div>
    <div class="modal-btns"><button class="btn btn-ghost" id="gc-cancel">Cancel</button></div>
  `);
  m.querySelector('#gc-cancel').onclick = () => closeModal();
  m.querySelectorAll('[data-g]').forEach(b => b.addEventListener('click', () => {
    picked = +b.dataset.g;
    if (picked === S.group) return toast(`You are already in ${MM.GROUPS[picked].name} 💜`);
    const from = MM.GROUPS[S.group] || { name: 'your current group' };
    const to = MM.GROUPS[picked];
    const losing = [
      from.art && !to.art && 'Art Activities',
      from.chat && !to.chat && 'Chat',
    ].filter(Boolean);
    const gaining = [
      !from.art && to.art && 'Art Activities',
      !from.chat && to.chat && 'Chat',
    ].filter(Boolean);
    closeModal();
    confirmPhrase({
      title: `Move to ${to.name}?`,
      body: `You are moving from ${from.name} to ${to.name}.`
        + (losing.length ? ` You will no longer have access to ${losing.join(' and ')} — existing work stays saved, but is hidden.` : '')
        + (gaining.length ? ` You will gain access to ${gaining.join(' and ')}.` : '')
        + ' Are you sure?',
      phrase: 'I am sure',
      confirmLabel: `Move to ${to.name}`,
      danger: !!losing.length,
      onYes: () => {
        S.groupChanges.push({ from: S.group, to: picked, at: Date.now() });
        S.group = picked;
        save();
        confetti();
        toast(`You are now in ${to.name} ✨`);
        nav('#/home');
        if (location.hash === '#/home') route();
      },
    });
  }));
}

/** A confirmation that cannot be tapped through by accident. */
function confirmPhrase({ title, body, phrase = 'I am sure', confirmLabel = 'Confirm', danger = false, onYes }) {
  const m = modal(`
    <h3>${danger ? '⚠️ ' : ''}${esc(title)}</h3>
    <p style="font-size:13px;line-height:1.65;color:#ffffff;margin:0 0 12px">${esc(body)}</p>
    <p class="phrase-ask">Type <b>${esc(phrase)}</b> below to continue.</p>
    <input class="tkt-input phrase-input" id="cp-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(phrase)}" aria-label="Type ${esc(phrase)} to confirm" />
    <div class="modal-btns">
      <button class="btn btn-ghost" id="cp-no">Cancel</button>
      <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="cp-yes" disabled>${esc(confirmLabel)}</button>
    </div>
  `);
  const input = m.querySelector('#cp-input');
  const yes = m.querySelector('#cp-yes');
  const norm = s => s.trim().toLowerCase().replace(/\s+/g, ' ');
  input.addEventListener('input', () => {
    const ok = norm(input.value) === norm(phrase);
    yes.disabled = !ok;
    input.classList.toggle('ok', ok);
  });
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !yes.disabled) yes.click(); });
  m.querySelector('#cp-no').onclick = () => closeModal();
  yes.onclick = () => { closeModal(); onYes && onYes(); };
  setTimeout(() => input.focus(), 60);
}

/** Set or change the PIN. */
function pinModal(kind) {
  const m = modal(`
    <h3>${kind === 'change' ? 'Change your PIN' : 'Set up a PIN'}</h3>
    <p style="font-size:12.8px;line-height:1.6;color:#ffffff;margin:0 0 12px">
      Choose 4 digits or more. This PIN becomes the key to your journal — keep it somewhere safe,
      because it is never stored and cannot be recovered.</p>
    <input class="tkt-input" id="pin-a" type="password" inputmode="numeric" maxlength="12" placeholder="New PIN" autocomplete="new-password" />
    <input class="tkt-input" id="pin-b" type="password" inputmode="numeric" maxlength="12" placeholder="Confirm PIN" autocomplete="new-password" />
    <div class="modal-btns">
      <button class="btn btn-ghost" id="pin-cancel">Cancel</button>
      <button class="btn btn-primary" id="pin-save">Save PIN</button>
    </div>
  `);
  m.querySelector('#pin-cancel').onclick = () => closeModal();
  m.querySelector('#pin-save').onclick = async () => {
    const a = m.querySelector('#pin-a').value.trim();
    const b = m.querySelector('#pin-b').value.trim();
    if (a.length < 4) return toast('Please use at least 4 characters');
    if (a !== b) return toast('The two PINs do not match');
    const ok = await Vault.setPin(a, S);
    closeModal();
    if (!ok) return toast('This browser cannot encrypt storage here (needs HTTPS)');
    confetti();
    toast('PIN set — your journal is locked to you now 🔒');
    route();
  };
}

/* ── Survey lists (pre / post) ───────────────────────────── */
function surveyList(phase, isBack) {
  const ids = phase === 'pre' ? MM.PRE_SURVEYS : MM.POST_SURVEYS;
  const intro = MM.SURVEY_INTRO[phase];
  const title = phase === 'pre' ? 'Pre-Survey' : 'Post-Survey';
  render(`
    ${header(title, { backTo: '#/home' })}
    <div class="body-pad">
      <div class="hero-card">
        <h2>${esc(intro.title)}</h2>
        <p>${esc(intro.body)}</p>
        <button class="video-btn" id="survey-video-btn"><span class="play">${I.play}</span>Watch ${title} Guide Video 🎬</button>
        <p class="stellenbosch-note">🎓 ${esc(intro.note)}</p>
      </div>
      ${ids.map((id, i) => {
        const def = MM.SURVEYS[id];
        const rec = S.surveys[phase][id];
        const draft = S.drafts[`${phase}:${id}`];
        const total = def.sections.reduce((n, s) => n + s.items.length, 0);
        const dCount = draft ? Object.keys(draft).filter(k => !k.endsWith(':other')).length : 0;
        return `
        <div class="survey-card c${def.num} ${rec ? 'is-done' : ''}" data-survey="${id}" style="animation-delay:${i * .07}s" role="button" tabindex="0">
          <span class="numtile"><b>${def.num}</b><span>${title}</span></span>
          <span class="s-name">${esc(def.name)}<small class="s-count">${total} questions</small></span>
          <span class="s-status">
            ${I.heart(!!rec)}
            <em class="${rec ? 'Completed' : 'off'}">${rec ? 'Completed' : (dCount ? 'In progress' : 'Not Started')}</em>
          </span>
          ${!rec && dCount ? `<span class="ring">${Math.round((dCount / total) * 100)}%</span>` : ''}
        </div>`;
      }).join('')}
    </div>
  `, { theme: 'theme-purple', backAnim: isBack });

  $('#survey-video-btn')?.addEventListener('click', () => {
    MMVideo.playVideoModal(phase, { onStart: () => nav(`#/survey/${phase}/${ids[0]}`) });
  });

  app.querySelectorAll('[data-survey]').forEach(c => {
    const go = () => nav(`#/survey/${phase}/${c.dataset.survey}`);
    c.addEventListener('click', go);
    c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
}
routes.pre = (_, isBack) => surveyList('pre', isBack);
routes.post = (_, isBack) => {
  if (!postOpen()) { toast('Complete your Pre-Survey first ✨'); return nav('#/pre'); }
  surveyList('post', isBack);
};

/* ── Survey runner ───────────────────────────────────────── */
routes.survey = (params) => {
  const [phase, id] = params;
  const def = MM.SURVEYS[id];
  if (!def || !['pre', 'post'].includes(phase)) return nav('#/home');
  if (phase === 'post' && !postOpen()) { toast('Complete your Pre-Survey first ✨'); return nav('#/pre'); }
  const rec = S.surveys[phase][id];
  render(`
    ${header(def.name, { backTo: `#/${phase}` })}
    ${rec ? completedHTML(def, phase) : runnerHTML(def, S.drafts[`${phase}:${id}`], { pageLabel: 'Page 1/1', blurb: def.blurb })}
  `, { theme: `theme-${def.theme}` });

  if (rec) return; // completed surveys are locked — no redo

  wireRunner(def, `${phase}:${id}`, answers => {
    S.surveys[phase][id] = { answers, completedAt: Date.now() };
    save(); confetti();
    const allDone = phase === 'pre' ? preDone() : postDone();
    const unlockBits = [hasArt() && 'Art Activities', hasChat() && 'Chat'].filter(Boolean);
    const preMsg = unlockBits.length
      ? `Amazing! Your Pre-Survey is done — ${unlockBits.join(', ')} and your Post-Survey pathway are now unlocked. Your 8-week journey begins! 🎨`
      : 'Amazing! Your Pre-Survey is done — your 8-week journey and Post-Survey pathway are now set. 💜';
    const celebrate = () => {
      const m = modal(`
        <div class="celebrate">
          <svg class="big-heart" viewBox="0 0 24 24" fill="#f3256b"><path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.3 4.9 6 4.5c2-.2 3.9.8 6 3 2.1-2.2 4-3.2 6-3 3.7.4 5.6 4.1 4 7.2C19.5 16.3 12 21 12 21Z"/></svg>
          <h3>${esc(def.name)} completed!</h3>
          <p>${allDone
            ? (phase === 'pre' ? preMsg
              : 'That was the final check-in. Thank you for being part of this study — you did something wonderful for yourself. 💜')
            : 'Thank you for your honesty. Every answer helps us support you better.'}</p>
          <button class="btn btn-primary btn-block" id="cel-ok">Continue</button>
        </div>
      `);
      m.querySelector('#cel-ok').onclick = () => { closeModal(); nav(`#/${phase}`); };
    };
    // Stellenbosch protocol: PHQ-9 screening on the Mental Health Survey
    if (id === 'mental') {
      const screen = phqScreen(answers);
      if (screen.atRisk) return riskModal(phase, screen, celebrate);
    }
    celebrate();
  });
};

function completedHTML(def, phase) {
  return `<div class="body-pad">
    <div class="q-card">
      <div class="celebrate">
        <svg class="big-heart" viewBox="0 0 24 24" fill="#f3256b"><path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.3 4.9 6 4.5c2-.2 3.9.8 6 3 2.1-2.2 4-3.2 6-3 3.7.4 5.6 4.1 4 7.2C19.5 16.3 12 21 12 21Z"/></svg>
        <h3>Completed</h3>
        <p>You have already completed the ${esc(def.name)} for this ${phase === 'pre' ? 'pre' : 'post'}-survey. Thank you!</p>
        <p class="locked-note">${I.lock} Completed surveys are locked and cannot be taken again.</p>
      </div>
    </div>
  </div>`;
}

/* ── Art activities ──────────────────────────────────────── */
routes.art = (params, isBack) => {
  if (!hasArt()) { toast('Art activities are not part of your study group 💜'); return nav('#/home'); }
  if (!artOpen()) { toast('Complete your Pre-Survey to unlock Art Activities ✨'); return nav('#/pre'); }
  if (!params.length) {
    if (!S.artAboutSeen) return nav('#/art/about');
    return artList(isBack);
  }
  if (params[0] === 'about') return artAbout();
  const id = parseInt(params[0], 10);
  const a = MM.ACTIVITIES.find(x => x.id === id);
  if (!a) return nav('#/art');
  // Weekly unlock is a study rule, so enforce it on the route itself —
  // not only on the list card, which a typed URL bypasses.
  if (a.week > currentWeek() && !actState(a.id)) {
    toast(`This activity unlocks in week ${a.week} 🌱`);
    return nav('#/art');
  }
  if (params[1] === 'detail') return artDetail(a, params[2] || 'start');
  return artOptions(a);
};

function artAbout() {
  render(`
    ${header('About Activities', { backTo: '#/home' })}
    <div class="body-pad">
      <div class="hero-card">
        <p class="lead">${esc(MM.ART_ABOUT.heroBody)}</p>
        <button class="video-btn" id="about-vid-btn"><span class="play">${I.play}</span>Watch Creative Resilience Walkthrough 🎬</button>
      </div>
      <div class="info-card">
        <h3><span class="ic">${I.palette}</span>${esc(MM.ART_ABOUT.lead)}</h3>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${MM.ART_ABOUT.steps.map(([e, t, d]) => `
            <div class="step-li">
              <span class="pen" style="font-size:15px">${e}</span>
              <p><b>${esc(t)}:</b> ${esc(d)}</p>
            </div>`).join('')}
        </div>
      </div>
      <div class="act-foot-btns" style="padding:0">
        <button class="btn btn-primary" id="about-next" style="min-width:150px">Next</button>
      </div>
    </div>
  `, { theme: 'theme-purple' });
  $('#about-vid-btn')?.addEventListener('click', () => {
    MMVideo.playVideoModal('general', { onStart: () => nav('#/art') });
  });
  $('#about-next').onclick = () => { S.artAboutSeen = true; save(); nav('#/art'); };
}

function artList(isBack) {
  const week = currentWeek();
  render(`
    ${header('Art Activities', { backTo: '#/home' })}
    <div class="body-pad">
      <div class="hero-card">
        <h2>Your 8-week creative journey</h2>
        <p>One activity unlocks each week. Create in your own style — art, words, sound, nature or digital. ${actsDone()}/8 completed so far. 🌱</p>
      </div>
      ${MM.ACTIVITIES.map((a, i) => {
        const st = actState(a.id);
        const [c1, c2] = MM.ACT_COLORS[i % MM.ACT_COLORS.length];
        const done = !!st?.submittedAt;
        const started = !!st && !done;
        const hasVideo = !!MM.ACTIVITY_VIDEOS[a.id];
        return `<div class="act-card ${done ? 'done' : ''}" data-id="${a.id}" data-locked="false" style="animation-delay:${i * .05}s" role="button" tabindex="0">
          <span class="acttile" style="background:linear-gradient(160deg, ${c1}, ${c2})">
            <span>Activity</span><b>${a.id}</b><em>Week ${a.week}</em>
          </span>
          <span class="a-name">${esc(a.name)}${hasVideo ? `<small class="a-video">${I.video} video guides</small>` : ''}</span>
          <span class="a-status">
            ${done
              ? `<span class="st-ic" style="background:rgba(51,102,255,0.2);color:#3366FF">${I.heart(true)}</span><em>Completed</em>`
              : started
                ? `<span class="st-ic" style="background:rgba(255,209,102,0.2);color:#ffd166">${I.pencil}</span><em>In progress</em>`
                : `<span class="st-ic" style="border:2px solid rgba(255,255,255,0.3);color:transparent">${I.check}</span><em>Open</em>`}
          </span>
        </div>`;
      }).join('')}
    </div>
  `, { theme: 'theme-purple', backAnim: isBack });
  app.querySelectorAll('.act-card').forEach(c => c.addEventListener('click', () => {
    nav(`#/art/${c.dataset.id}`);
  }));
}

function artOptions(a) {
  const st = actState(a.id);
  let sel = st?.option ?? null;
  render(`
    ${header(`Activity ${a.id}`, { backTo: '#/art' })}
    <div class="body-pad">
      <div class="hero-card">
        <h2>${esc(a.name)}</h2>
        <p>${esc(a.about)}</p>
        <p class="lead">Please select one of the options below.</p>
      </div>
      ${a.options.map((opt, i) => {
        const kind = MM.ART_OPTION_KINDS[i];
        const [title, desc] = opt.split(/:\s(.+)/);
        return `<button class="opt-choice ${sel === i ? 'sel' : ''}" data-i="${i}" style="animation-delay:${i * .06}s">
          <span class="oc-radio"></span>
          <span class="grow">
            <h5><span class="oc-emoji">${kind.emoji}</span>Option ${i + 1} — ${esc(title)}</h5>
            <p>${esc(desc || '')}</p>
          </span>
        </button>`;
      }).join('')}
    </div>
    <div class="act-foot-btns">
      <button class="btn btn-primary" id="opt-next" style="min-width:150px">Next</button>
    </div>
  `, { theme: 'theme-purple' });
  app.querySelectorAll('.opt-choice').forEach(b => b.addEventListener('click', () => {
    sel = +b.dataset.i;
    app.querySelectorAll('.opt-choice').forEach(x => x.classList.toggle('sel', x === b));
    if (navigator.vibrate) navigator.vibrate(8);
  }));
  $('#opt-next').onclick = () => {
    if (sel == null) return toast('Choose the option that feels right for you 🎨');
    S.activities[a.id] = Object.assign({ uploads: [], voice: [], reflections: {} }, S.activities[a.id], { option: sel, startedAt: actState(a.id)?.startedAt || Date.now() });
    save();
    nav(`#/art/${a.id}/detail/start`);
  };
}

/* ── Voice capture (MediaRecorder + on-device speech-to-text) ── */
let voiceCap = null; // {rec, stream, recog, chunks[], transcript, timer, startedAt}
function stopVoiceCapture(silent = true) {
  if (!voiceCap) return;
  try { voiceCap.recog?.stop(); } catch { /* noop */ }
  try { if (voiceCap.rec?.state !== 'inactive') voiceCap.rec.stop(); } catch { /* noop */ }
  try { voiceCap.stream?.getTracks().forEach(t => t.stop()); } catch { /* noop */ }
  clearInterval(voiceCap.timer);
  voiceCap = null;
}

async function startVoiceCapture(a, st, ui) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  MMVoice.pause(); // recording a voice note always wins the microphone
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    return toast('Microphone access is needed for voice notes — check your permissions 🎤');
  }
  const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(t => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || '';
  const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  voiceCap = { rec, stream, chunks: [], transcript: '', finalT: '', timer: null, startedAt: Date.now(), recog: null };

  rec.ondataavailable = e => { if (e.data.size) voiceCap?.chunks.push(e.data); };
  rec.onstop = () => {
    const cap = voiceCap; // capture before cleanup
    if (!cap) return;
    const blob = new Blob(cap.chunks, { type: mime || 'audio/webm' });
    const dur = Math.round((Date.now() - cap.startedAt) / 1000);
    const reader = new FileReader();
    reader.onload = () => {
      st.voice = st.voice || [];
      st.voice.push({ src: reader.result, transcript: (cap.finalT + ' ' + cap.transcript).replace(/\s+/g, ' ').trim(), dur, at: Date.now() });
      save();
      toast('Voice note saved 🎤');
      artDetail(a, 'voice');
    };
    reader.readAsDataURL(blob);
    try { cap.stream.getTracks().forEach(t => t.stop()); } catch { /* noop */ }
    clearInterval(cap.timer);
    voiceCap = null;
  };

  // Live on-device transcription while recording (where supported)
  if (SR) {
    const recog = new SR();
    recog.lang = 'en-ZA';
    recog.continuous = true;
    recog.interimResults = true;
    recog.onresult = e => {
      if (!voiceCap) return;
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) voiceCap.finalT += e.results[i][0].transcript + ' ';
        else interim += e.results[i][0].transcript;
      }
      voiceCap.transcript = interim;
      const live = ui.live;
      if (live) { live.textContent = (voiceCap.finalT + ' ' + interim).replace(/\s+/g, ' ').trim() || 'Listening…'; }
    };
    recog.onerror = () => { /* transcription is best-effort */ };
    try { recog.start(); voiceCap.recog = recog; } catch { /* noop */ }
  } else if (ui.live) {
    ui.live.textContent = 'Recording… (transcription needs an online-capable browser)';
  }

  rec.start(250);
  const MAX_S = 90;
  voiceCap.timer = setInterval(() => {
    if (!voiceCap) return;
    const s = Math.round((Date.now() - voiceCap.startedAt) / 1000);
    if (ui.clock) ui.clock.textContent = `${String(Math.floor(s / 60))}:${String(s % 60).padStart(2, '0')} / 1:30`;
    if (s >= MAX_S) { toast('Voice notes pause at 90 seconds — saved for you 💜'); stopAndSave(); }
  }, 250);

  function stopAndSave() {
    try { voiceCap?.recog?.stop(); } catch { /* noop */ }
    try { if (voiceCap && voiceCap.rec.state !== 'inactive') voiceCap.rec.stop(); } catch { /* noop */ }
  }
  return stopAndSave;
}

function speechRecognitionSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/* ── Tiny reflection dictation ───────────────────────────────
   A small mic on each reflection box, entirely separate from
   the full voice-note recorder: speech goes straight into the
   textarea as text. Nothing is recorded or saved as audio. */
let reflectionDictation = null; // {recog, idx, base, finalT}
function stopReflectionDictation() {
  if (!reflectionDictation) return;
  try { reflectionDictation.recog.stop(); } catch { /* noop */ }
  reflectionDictation = null;
  MMVoice.resume();
}
function toggleReflectionDictation(idx, textarea, micBtn) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return toast('Voice dictation needs a browser like Chrome or Edge 🎤');

  if (reflectionDictation && reflectionDictation.idx === idx) {
    stopReflectionDictation();
    micBtn.classList.remove('on'); micBtn.innerHTML = I.mic;
    return;
  }
  if (reflectionDictation) stopReflectionDictation(); // switch questions mid-flow

  MMVoice.pause(); // dictation always wins the microphone
  const recog = new SR();
  recog.lang = 'en-ZA'; recog.continuous = true; recog.interimResults = true;
  const existing = textarea.value.trim();
  const base = existing ? existing + (/[.!?]$/.test(existing) ? ' ' : '. ') : '';
  reflectionDictation = { recog, idx, base, finalT: '' };

  const endDictation = () => {
    if (reflectionDictation?.idx === idx) { reflectionDictation = null; MMVoice.resume(); }
    micBtn.classList.remove('on'); micBtn.innerHTML = I.mic;
  };

  recog.onresult = e => {
    if (!reflectionDictation || reflectionDictation.idx !== idx) return;
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) reflectionDictation.finalT += e.results[i][0].transcript + ' ';
      else interim += e.results[i][0].transcript;
    }
    textarea.value = (reflectionDictation.base + reflectionDictation.finalT + interim).replace(/\s+/g, ' ');
    textarea.dispatchEvent(new Event('input', { bubbles: true })); // saves + triggers the tiny AI note
  };
  recog.onerror = e => {
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') toast('Microphone access is needed to dictate 🎤');
    endDictation();
  };
  recog.onend = () => {
    const was = reflectionDictation?.idx === idx;
    endDictation();
    if (was) { scheduleReflectionNote(idx, textarea.value, true); toast('Got it — read it over and edit anything you like ✍️', 2200); }
  };

  try {
    recog.start();
    micBtn.classList.add('on'); micBtn.innerHTML = I.stop;
    toast('Listening — speak your reflection 🎙', 1600);
  } catch { /* already starting */ }
}

/* ── Tiny on-device encouragement ────────────────────────────
   Every reflection gets a one-line, warm read-out from MojaLex
   — the small always-on language model (js/nlp.js), never the
   optional heavier transformer. It comments with care, not
   false cheer: distress is met gently, not spun positive. */
const reflNoteTimers = {};
function reflectionEncouragement(read) {
  const pick = arr => arr[Math.random() * arr.length | 0];
  if (read.risk.level === 'crisis' || read.risk.level === 'urgent') {
    return { tone: 'care', text: 'That sounds really heavy to carry — you do not have to hold it alone.', help: true };
  }
  if (read.risk.level === 'elevated' || read.risk.level === 'watch') {
    return {
      tone: 'care', text: pick([
        'Thank you for writing something so honest. Be gentle with yourself today. 💜',
        'That took courage to put into words — well done for showing up for yourself.',
      ]),
    };
  }
  const topicLine = {
    family: 'family clearly matters to you', art: 'your creativity is really coming through',
    stigma: 'that takes real courage to name', medication: 'looking after yourself like this matters',
    sleep: 'rest matters more than we admit', relationships: 'the people in your life shape this story',
    work: 'that is a real part of your world',
  }[read.topics[0]];
  if (read.sentiment.label === 'positive') {
    return {
      tone: 'good', text: pick([
        'I love the warmth in this ✨', 'That is a beautiful thing to notice about yourself.',
        topicLine ? `Lovely — ${topicLine}.` : 'This reflection glows with something good.',
      ].filter(Boolean)),
    };
  }
  return {
    tone: 'calm', text: pick([
      'Thank you for putting this into words — that takes honesty.',
      topicLine ? `Noted with care — ${topicLine}.` : 'Every reflection here helps your journey take shape.',
      'There is no right or wrong answer here, only yours. 🌱',
    ].filter(Boolean)),
  };
}
function scheduleReflectionNote(idx, text, immediate = false) {
  clearTimeout(reflNoteTimers[idx]);
  const run = () => {
    const el = $(`[data-note="${idx}"]`);
    if (!el) return;
    const trimmed = (text || '').trim();
    if (trimmed.split(/\s+/).filter(Boolean).length < 4) { el.classList.add('hidden'); el.innerHTML = ''; return; }
    const read = MMNLP.analyse(trimmed); // tiny, instant, on-device only — no upload, no heavy model
    const note = reflectionEncouragement(read);
    el.dataset.tone = note.tone;
    el.innerHTML = `${I.sparkle}<span>${esc(note.text)}</span>${note.help ? '<button class="refl-help-link" data-help="1">Help Now</button>' : ''}`;
    el.classList.remove('hidden');
    el.querySelector('[data-help]')?.addEventListener('click', () => nav('#/help'));
  };
  if (immediate) run(); else reflNoteTimers[idx] = setTimeout(run, 900);
}

function artDetail(a, tab) {
  const st = actState(a.id);
  if (!st || st.option == null) return nav(`#/art/${a.id}`);
  const locked = false; // NEVER auto-lock activities
  const kind = MM.ART_OPTION_KINDS[st.option];
  const tabs = [['start', 'Start Here'], ['materials', 'Materials'], ['pictures', 'Pictures'], ['voice', 'Voice'], ['reflections', 'Reflections']];
  const uploadSrc = upload => typeof upload === 'string' ? upload : upload.src;
  const uploadAnalysis = upload => typeof upload === 'object' ? upload.analysis : null;
  const analysedUploads = st.uploads.map(uploadAnalysis).filter(Boolean);
  const latestAnalysis = analysedUploads[analysedUploads.length - 1];
  const videoOpts = MM.ACTIVITY_VIDEOS[a.id];
  const voice = st.voice || [];

  let body = '';
  if (tab === 'start') {
    body = `
      <div class="info-card">
        <div style="display:flex;flex-direction:column;gap:14px">
          ${a.startHere.map(([b, t]) => `
            <div class="step-li"><span class="pen">${I.pencil}</span><p><b>${esc(b)}</b> ${esc(t)}</p></div>`).join('')}
        </div>
        <button class="video-btn" id="play-video"><span class="play">${I.play}</span>${videoOpts ? `Watch: Option ${st.option + 1} inspiration video` : 'Play Video'}</button>
      </div>
      <div class="act-foot-btns" style="padding:0">
        <button class="btn btn-primary" data-go="materials" style="min-width:150px">Start</button>
      </div>`;
  } else if (tab === 'materials') {
    body = `
      <div class="info-card">
        <h3><span class="ic">${I.clipboard}</span>What You'll Need</h3>
        <div style="display:flex;flex-direction:column;gap:13px">
          ${a.materials.map(mtl => `<div class="step-li"><span class="pen">${I.pencil}</span><p>${esc(mtl)}</p></div>`).join('')}
        </div>
      </div>
      <div class="act-foot-btns" style="padding:0">
        <button class="btn btn-primary" data-go="pictures" style="min-width:150px">Start</button>
      </div>`;
  } else if (tab === 'pictures') {
    body = `
      ${st.uploads.length
        ? `<div class="upload-grid">${st.uploads.map((upload, i) => `
            <div class="shot ${upload.kind === 'drawing' ? 'is-drawing' : ''}"><img src="${uploadSrc(upload)}" alt="${upload.kind === 'drawing' ? 'Drawing' : 'Upload'} ${i + 1}" />${upload.kind === 'drawing' ? '<span class="shot-tag">🖍 drawn here</span>' : ''}${uploadAnalysis(upload) ? `<span class="shot-read" data-vision="${i}" title="What Moja Vision saw">${I.sparkle}</span>` : ''}<button class="del" data-del="${i}" aria-label="Delete">${I.x}</button></div>`).join('')}
          </div>`
        : `<div class="info-card"><p class="empty-note">Nothing here yet — launch the drawing studio below or upload a photo of your work. 🎨📸</p></div>`}
      ${latestAnalysis ? `
        <div class="colour-insight">
          <span class="colour-insight-mark">${I.sparkle}</span>
          <div class="grow">
            <h4>Moja Guide colour note</h4>
            <p>${esc(latestAnalysis.feedback)}</p>
            <div class="colour-palette">${latestAnalysis.palette.map((colour, i) => `<span style="--swatch:${colour}" title="Palette colour ${i + 1}"></span>`).join('')}</div>
            <small>Read on this device from colour only · not a mental-health assessment</small>
          </div>
        </div>`
        : st.uploads.length ? `<button class="btn btn-ghost read-colours" id="read-colours">${I.sparkle} Read colours</button>` : ''}
      <input type="file" id="file-in" accept="image/*" multiple class="hidden" />
      
      <!-- Always Active Art Creator Hub -->
      <div class="art-creator-hub" style="display:flex;flex-direction:column;gap:10px;margin-top:12px">
        <div class="art-choice-card draw-choice" id="draw-btn" role="button" tabindex="0" style="cursor:pointer">
          <div class="acc-head" style="display:flex;justify-content:space-between;align-items:center">
            <span class="acc-badge" style="background:linear-gradient(135deg,#f3256b,#8a2eae);color:#fff;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700">🎨 DIGITAL PAINT STUDIO</span>
            <span class="acc-icon" style="font-size:20px">🖌️</span>
          </div>
          <b style="display:block;margin:6px 0 2px;font-size:14px;color:#fff">Draw &amp; Paint Directly on Screen</b>
          <p style="font-size:12px;color:rgba(255,255,255,0.85);margin:0 0 8px">Full paintbrush suite, custom colors, neon glow, stamps &amp; live on-device Moja Vision AI analysis.</p>
          <button class="btn btn-primary btn-block" style="pointer-events:none">Launch Drawing Studio 🎨</button>
        </div>

        <div class="art-choice-card photo-choice" id="upload-btn" role="button" tabindex="0" style="cursor:pointer">
          <div class="acc-head" style="display:flex;justify-content:space-between;align-items:center">
            <span class="acc-badge" style="background:linear-gradient(135deg,#3366ff,#00a651);color:#fff;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700">📷 PHYSICAL ARTWORK</span>
            <span class="acc-icon" style="font-size:20px">📸</span>
          </div>
          <b style="display:block;margin:6px 0 2px;font-size:14px;color:#fff">Upload or Snap a Photo</b>
          <p style="font-size:12px;color:rgba(255,255,255,0.85);margin:0 0 8px">Take a picture of paintings, crafts, nature collages, or drawings made with physical materials.</p>
          <button class="btn btn-outline btn-block" style="pointer-events:none">Upload / Snap Photo 📷</button>
        </div>
      </div>

      <div class="act-foot-btns" style="padding:0;justify-content:flex-end">
        <button class="btn btn-primary" data-go="reflections">Reflect</button>
      </div>`;
  } else if (tab === 'voice') {
    body = `
      <div class="info-card voice-card" style="background:rgba(255,255,255,0.09);backdrop-filter:blur(16px);border:1.5px solid rgba(51,102,255,0.45);border-radius:20px;padding:20px;text-align:left">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <span style="font-size:24px;line-height:1">🎙️</span>
          <h3 style="margin:0;font-size:16px;font-weight:800;color:#ffffff">Speak Your Story</h3>
        </div>
        <p style="font-size:13px;line-height:1.55;color:rgba(255,255,255,0.88);margin:0 0 16px">
          Record a voice note for ${esc(a.name)} — MojaMind captures your voice and writes down what it hears on your phone.
        </p>

        <!-- Big Glowing Microphone Recording Stage -->
        <div class="rec-stage" id="rec-stage" style="display:flex;align-items:center;gap:16px;background:rgba(0,0,0,0.35);padding:14px 18px;border-radius:18px;border:1.5px solid rgba(255,209,102,0.4);box-shadow:inset 0 2px 10px rgba(0,0,0,0.4)">
          <button class="rec-btn" id="rec-btn" aria-label="Start recording" style="flex:0 0 64px;width:64px;height:64px;border-radius:50%;border:0;cursor:pointer;color:#fff;background:linear-gradient(135deg,#f3256b,#8a2eae);box-shadow:0 6px 20px rgba(243,37,107,0.5);display:grid;place-items:center;transition:transform 0.15s">
            ${I.mic}
          </button>
          <div class="rec-meta" style="flex:1">
            <b id="rec-clock" style="font-size:14px;color:#ffd166;letter-spacing:0.5px;display:block">0:00 / 1:30</b>
            <p class="rec-live" id="rec-live" style="margin:4px 0 0;font-size:12.5px;color:#ffffff;font-style:italic">Tap the microphone to start recording 🎙️</p>
          </div>
        </div>
      </div>
      ${voice.length ? voice.map((v, i) => `
        <div class="voice-note">
          <div class="vn-head">
            <span class="vn-ic">${I.mic}</span>
            <b>Voice note ${i + 1}</b>
            <small>${v.dur ? `${Math.floor(v.dur / 60)}:${String(v.dur % 60).padStart(2, '0')} · ` : ''}${new Date(v.at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</small>
            <button class="del vn-del" data-vdel="${i}" aria-label="Delete voice note">${I.x}</button>
          </div>
          <audio controls preload="metadata" src="${v.src}"></audio>
          ${v.transcript ? `
            <div class="vn-transcript">
              <small>${I.sparkle} AI transcript (read on this device)</small>
              <p>${esc(v.transcript)}</p>
              <button class="btn btn-ghost vn-use" data-vuse="${i}">Use in reflections</button>
            </div>` : '<p class="vn-none">No transcript was captured for this note.</p>'}
        </div>`).join('') : `<div class="info-card"><p class="empty-note">No voice notes yet — your voice matters, whenever you’re ready. 🎤</p></div>`}
      <div class="act-foot-btns" style="padding:0">
        <button class="btn btn-primary" data-go="reflections" style="min-width:150px">Reflect</button>
      </div>`;
  } else {
    const ai = a.id - 1;
    const [rc1, rc2] = MM.ACT_COLORS[ai % MM.ACT_COLORS.length];
    const canDictate = speechRecognitionSupported();
    body = `
      <div class="info-card refl-card" style="--rc-top:${hexA(rc1, .16)};--rc-bot:${hexA(rc2, .12)};--rc-solid1:${rc1};--rc-solid2:${rc2}">
        <h3><span class="ic">${I.sparkle}</span>Reflect on your creation</h3>
        <p class="refl-sub">Honest and short is enough — there is no right answer here.</p>
        <div class="refl-list">
          ${a.reflections.map((q, i) => `
            <div class="refl-q" data-ri="${i}">
              <label for="rq${i}"><span class="refl-num">${i + 1}</span>${esc(q)}</label>
              <div class="refl-input-wrap">
                <textarea id="rq${i}" data-r="${i}" placeholder="Your reflection… (no right or wrong)">${esc(st.reflections[i] || '')}</textarea>
                ${canDictate ? `<button class="refl-mic" data-dictate="${i}" aria-label="Speak this reflection instead of typing" title="Speak your answer">${I.mic}</button>` : ''}
              </div>
              <div class="refl-note hidden" data-note="${i}" aria-live="polite"></div>
            </div>`).join('')}
        </div>
      </div>
      <div class="act-foot-btns" style="padding:0">
        <button class="btn btn-primary" id="submit-refl" style="min-width:150px">${locked ? 'Update Reflections 💾' : 'Submit'}</button>
      </div>`;
  }

  render(`
    ${header(a.name, { backTo: '#/art' })}
    <div class="body-pad" style="gap:12px">
      <div class="hero-card" style="padding:13px 16px">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
          <p class="lead" style="margin:0">Option ${st.option + 1} — ${kind.emoji} ${esc(kind.name)}</p>
          ${locked ? `<button class="btn btn-ghost btn-sm" id="unlock-act-btn" style="font-size:11px;padding:3px 8px;border-color:#ffd166;color:#ffd166">🔓 Unlock</button>` : ''}
        </div>
        ${locked ? `<p class="locked-strip">${I.lock} Submitted ${new Date(st.submittedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })} — you can still add artwork or edit anytime.</p>` : ''}
      </div>
      <div class="tabs-bar" role="tablist">
        ${tabs.map(([k, lbl]) => `<button class="tab-link ${tab === k ? 'active' : ''}" role="tab" aria-selected="${tab === k}" data-tab="${k}">${lbl}</button>`).join('')}
      </div>
      ${body}
    </div>
  `, { theme: 'theme-purple' });

  app.querySelectorAll('.tab-link').forEach(t => t.addEventListener('click', () => nav(`#/art/${a.id}/detail/${t.dataset.tab}`)));
  app.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => nav(`#/art/${a.id}/detail/${b.dataset.go}`)));

  $('#unlock-act-btn')?.addEventListener('click', () => {
    delete st.submittedAt;
    save();
    toast('Activity unlocked for editing 🎨✨');
    artDetail(a, tab);
  });

  if (tab === 'reflections') {
    a.reflections.forEach((_, i) => scheduleReflectionNote(i, st.reflections[i] || '', true));
  }

  /* Interactive Themed Walkthrough Video Engine for ALL activities & options */
  $('#play-video')?.addEventListener('click', () => {
    MMVideo.playVideoModal(a.id, {
      option: st.option,
      actId: a.id,
      onStart: () => nav(`#/art/${a.id}/detail/pictures`),
    });
  });

  app.querySelectorAll('[data-vision]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const an = uploadAnalysis(st.uploads[+b.dataset.vision]);
    if (an) visionModal({ feedback: an.feedback, palette: an.palette, words: an.words, capabilities: { text: !!globalThis.TextDetector } });
  }));

  // Always active Draw and Upload event listeners
  $('#draw-btn')?.addEventListener('click', () => openDrawPad(a));
  $('#upload-btn')?.addEventListener('click', () => $('#file-in').click());
  $('#file-in')?.addEventListener('change', async e => {
    const files = [...e.target.files].slice(0, 6);
    toast(`Moja Vision is looking at your picture${files.length > 1 ? 's' : ''}…`, 1800);
    let last = null;
    for (const f of files) {
      const url = await shrinkImage(f);
      const vision = await MMVision.read(url);
      last = vision;
      st.uploads.push({
        src: url, kind: 'photo', at: Date.now(),
        analysis: {
          feedback: vision.feedback, palette: vision.palette,
          dominant: vision.colour?.dominant, brightness: vision.colour?.brightness,
          contrast: vision.colour?.contrast, words: vision.words || null,
          faces: vision.faces || 0, analyzedAt: Date.now(),
        },
      });
    }
    save(); toast(`${files.length} picture${files.length > 1 ? 's' : ''} added 📸`);
    artDetail(a, 'pictures');
    if (last) setTimeout(() => visionModal(last), 240);
  });

  $('#read-colours')?.addEventListener('click', async () => {
    const button = $('#read-colours');
    button.disabled = true; button.textContent = 'Reading colours…';
    for (let i = 0; i < st.uploads.length; i++) {
      if (uploadAnalysis(st.uploads[i])) continue;
      const src = uploadSrc(st.uploads[i]);
      st.uploads[i] = { src, analysis: await analyzeArtwork(src) };
    }
    save(); toast('Colour note ready ✨');
    artDetail(a, 'pictures');
  });

  app.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    st.uploads.splice(+b.dataset.del, 1); save();
    artDetail(a, 'pictures');
  }));

  /* Voice recorder wiring */
  const recBtn = $('#rec-btn');
  if (recBtn) {
    let stopFn = null;
    recBtn.addEventListener('click', async () => {
      if (voiceCap) { stopFn?.(); recBtn.classList.remove('rec-on'); recBtn.innerHTML = I.mic; return; }
      const ui = { live: $('#rec-live'), clock: $('#rec-clock') };
      recBtn.classList.add('rec-on'); recBtn.innerHTML = I.stop;
      ui.live.textContent = 'Listening…';
      stopFn = await startVoiceCapture(a, st, ui);
      if (!voiceCap) { recBtn.classList.remove('rec-on'); recBtn.innerHTML = I.mic; }
    });
  }

  app.querySelectorAll('[data-vdel]').forEach(b => b.addEventListener('click', () => {
    st.voice.splice(+b.dataset.vdel, 1); save();
    artDetail(a, 'voice');
  }));

  app.querySelectorAll('[data-vuse]').forEach(b => b.addEventListener('click', () => {
    const v = (st.voice || [])[+b.dataset.vuse];
    if (!v?.transcript) return;
    const slot = a.reflections.findIndex((_, i) => !(st.reflections[i] || '').trim());
    const idx = slot === -1 ? a.reflections.length - 1 : slot;
    st.reflections[idx] = ((st.reflections[idx] || '') + ' ' + v.transcript).trim();
    save();
    toast('Transcript added to your reflections ✍️');
    artDetail(a, 'reflections');
  }));

  app.querySelectorAll('[data-dictate]').forEach(b => b.addEventListener('click', () => {
    const idx = +b.dataset.dictate;
    toggleReflectionDictation(idx, $(`#rq${idx}`), b);
  }));

  app.querySelectorAll('[data-r]').forEach(t => t.addEventListener('input', () => {
    st.reflections[t.dataset.r] = t.value; save();
    scheduleReflectionNote(+t.dataset.r, t.value);
  }));

  $('#submit-refl')?.addEventListener('click', () => {
    const filled = a.reflections.filter((_, i) => (st.reflections[i] || '').trim()).length;
    if (!filled) return toast('Share at least one reflection before submitting 💭');
    const m = modal(`
      <h3>Submit ${esc(a.name)}?</h3>
      <p style="font-size:13px;line-height:1.65;color:#ffffff;text-align:center;margin:0 0 6px">
        Save and lock this activity to mark it complete. You can unlock or add more art anytime! 🎨</p>
      <div class="modal-btns">
        <button class="btn btn-ghost" id="sub-no">Keep working</button>
        <button class="btn btn-primary" id="sub-yes">Submit</button>
      </div>`);
    m.querySelector('#sub-no').onclick = () => closeModal();
    m.querySelector('#sub-yes').onclick = () => {
      closeModal();
      st.submittedAt = Date.now(); save();
      confetti();
      const c = modal(`
        <div class="celebrate">
          <div style="font-size:56px">🎨</div>
          <h3>Activity ${a.id} submitted!</h3>
          <p>Beautiful work. Sit with your creation for a moment — your resilience shines brightly.</p>
          <button class="btn btn-primary btn-block" id="cel-ok">Back to activities</button>
        </div>`);
      c.querySelector('#cel-ok').onclick = () => { closeModal(); nav('#/art'); };
    };
  });
}

/* ── Draw on your device ─────────────────────────────────── */
function openDrawPad(a) {
  const st = actState(a.id);
  if (!st) return;

  MMVoice.pause(); // the drawing pad is a focused space

  const host = document.createElement('div');
  host.className = 'draw-overlay';
  host.setAttribute('role', 'dialog');
  host.setAttribute('aria-modal', 'true');
  host.setAttribute('aria-label', `Drawing pad for ${a.name}`);
  document.body.appendChild(host);

  const close = () => { pad.cleanup(); host.remove(); MMVoice.resume(); };

  const pad = MMDraw.mount(host, {
    onClose: close,
    onSave: async (dataUrl, meta) => {
      if (!dataUrl) return toast('Make a mark or two first 🖍');
      host.classList.add('reading');
      toast('Moja Vision is looking at your drawing…', 1800);
      st.uploads.push({
        src: dataUrl,
        kind: 'drawing',
        analysis: {
          feedback: meta.vision.feedback,
          palette: meta.vision.palette,
          dominant: meta.vision.colour?.dominant,
          brightness: meta.vision.colour?.brightness,
          contrast: meta.vision.colour?.contrast,
          words: meta.vision.words || null,
          faces: meta.vision.faces || 0,
          geometry: meta.vision.geometry,
          analyzedAt: Date.now(),
        },
        at: Date.now(),
      });
      save();
      close();
      confetti();
      artDetail(a, 'pictures');
      setTimeout(() => visionModal(meta.vision), 260);
    },
  });
}

/** Moja Vision's warm read of what was just made. */
function visionModal(vision) {
  const words = vision.words?.length
    ? `<div class="vision-words"><small>Words I could read in your art</small><p>${vision.words.slice(0, 6).map(w => `“${esc(w)}”`).join(' · ')}</p></div>`
    : '';
  modal(`
    <div class="vision-modal">
      <span class="vision-mark">${I.sparkle}</span>
      <h3>Moja Vision</h3>
      <div class="colour-palette big">${(vision.palette || []).map(c => `<span style="--swatch:${c}"></span>`).join('')}</div>
      <p class="vision-text">${esc(vision.feedback)}</p>
      ${words}
      <small class="vision-foot">Read on this device from colour, strokes${vision.capabilities?.text ? ' and text' : ''} · a friendly description, not a mental-health assessment</small>
      <div class="modal-btns"><button class="btn btn-primary btn-block" onclick="closeModal()">Thank you</button></div>
    </div>
  `);
}

function shrinkImage(file) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const max = 900;
      const sc = Math.min(1, max / Math.max(img.width, img.height));
      const cv = document.createElement('canvas');
      cv.width = img.width * sc; cv.height = img.height * sc;
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(img.src);
      res(cv.toDataURL('image/jpeg', .82));
    };
    img.src = URL.createObjectURL(file);
  });
}

function analyzeArtwork(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const size = 72;
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size);
      const scale = Math.min(size / img.width, size / img.height);
      const width = img.width * scale, height = img.height * scale;
      ctx.drawImage(img, (size - width) / 2, (size - height) / 2, width, height);
      const pixels = ctx.getImageData(0, 0, size, size).data;
      const families = { red: 0, orange: 0, yellow: 0, green: 0, blue: 0, purple: 0, pink: 0, neutral: 0 };
      const bins = new Map();
      let count = 0, lightSum = 0, lightSquared = 0;
      for (let i = 0; i < pixels.length; i += 16) {
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], alpha = pixels[i + 3];
        if (alpha < 100) continue;
        const max = Math.max(r, g, b) / 255, min = Math.min(r, g, b) / 255;
        const light = (max + min) / 2;
        const delta = max - min;
        const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * light - 1));
        let hue = 0;
        if (delta) {
          if (max === r / 255) hue = 60 * (((g - b) / 255 / delta) % 6);
          else if (max === g / 255) hue = 60 * ((b - r) / 255 / delta + 2);
          else hue = 60 * ((r - g) / 255 / delta + 4);
          if (hue < 0) hue += 360;
        }
        let family = 'neutral';
        if (saturation > .16 && light > .08 && light < .96) {
          if (hue < 15 || hue >= 345) family = 'red';
          else if (hue < 45) family = 'orange';
          else if (hue < 70) family = 'yellow';
          else if (hue < 165) family = 'green';
          else if (hue < 255) family = 'blue';
          else if (hue < 300) family = 'purple';
          else family = 'pink';
        }
        families[family] += family === 'neutral' ? .2 : 1 + saturation;
        if (!(r > 246 && g > 246 && b > 246)) {
          const qr = Math.min(255, Math.round(r / 40) * 40);
          const qg = Math.min(255, Math.round(g / 40) * 40);
          const qb = Math.min(255, Math.round(b / 40) * 40);
          const key = `#${[qr, qg, qb].map(v => v.toString(16).padStart(2, '0')).join('')}`;
          bins.set(key, (bins.get(key) || 0) + 1);
        }
        count++; lightSum += light; lightSquared += light * light;
      }
      const ranked = Object.entries(families).sort((a, b) => b[1] - a[1]);
      const dominant = ranked[0]?.[1] ? ranked[0][0] : 'neutral';
      const secondary = ranked[1]?.[1] > ranked[0]?.[1] * .25 ? ranked[1][0] : null;
      const brightness = count ? lightSum / count : .5;
      const contrast = count ? Math.sqrt(Math.max(0, lightSquared / count - brightness * brightness)) : 0;
      const meanings = {
        red: 'energy and courage', orange: 'warmth and movement', yellow: 'hope and light',
        green: 'growth and balance', blue: 'calm and reflection', purple: 'imagination and depth',
        pink: 'care and connection', neutral: 'quiet focus',
      };
      const names = `${dominant}${secondary ? ` and ${secondary}` : ''}`;
      const tone = brightness > .72 ? 'bright and open' : brightness < .34 ? 'deep and grounded' : 'balanced';
      const finish = contrast > .22 ? 'Strong contrast adds a clear sense of movement.' : 'The gentle contrast keeps the feeling cohesive.';
      const feedback = `${names[0].toUpperCase()}${names.slice(1)} tones stand out, which can suggest ${meanings[dominant]}; the palette feels ${tone}. ${finish}`;
      const palette = [...bins.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([colour]) => colour);
      resolve({ dominant, secondary, brightness: +brightness.toFixed(2), contrast: +contrast.toFixed(2), palette: palette.length ? palette : ['#f9a8d4', '#7b21a8'], feedback, analyzedAt: Date.now() });
    };
    img.onerror = () => resolve({ dominant: 'neutral', secondary: null, brightness: .5, contrast: 0, palette: ['#f9a8d4', '#7b21a8'], feedback: 'I could not read the colours in this image yet. You can upload another picture or describe the palette in Chat.', analyzedAt: Date.now() });
    img.src = src;
  });
}

/* ── Chat ────────────────────────────────────────────────── */
routes.chat = (params, isBack) => {
  if (!hasChat() && !S.adminMode) { toast('Chat is not part of your study group 💜'); return nav('#/home'); }
  if (!chatOpen()) { toast('Complete your Pre-Survey to unlock Chat ✨'); return nav('#/pre'); }
  if (params.length >= 2) return chatThread(params[0], parseInt(params[1], 10));
  chatChannels(params[0] === 'individual' ? 'individual' : 'group', isBack);
};

function adminLoginModal() {
  const m = modal(`
    <h3>Facilitator access</h3>
    <p style="font-size:12.8px;line-height:1.6;color:#ffffff;text-align:center;margin:0 0 12px">${esc(MM.ADMIN.hint)}</p>
    <input class="tkt-input" id="adm-code" placeholder="Access code" autocomplete="off" />
    <div class="modal-btns">
      <button class="btn btn-ghost" id="adm-cancel">Cancel</button>
      <button class="btn btn-primary" id="adm-go">Enter</button>
    </div>
  `);
  m.querySelector('#adm-cancel').onclick = () => closeModal();
  const go = () => {
    if (m.querySelector('#adm-code').value.trim().toUpperCase() === MM.ADMIN.code) {
      S.adminMode = true; save(); closeModal();
      toast('Facilitator mode on — replies now send as Facilitator 🎓');
      route();
    } else toast('That code doesn’t match — check with the study team');
  };
  m.querySelector('#adm-go').onclick = go;
  m.querySelector('#adm-code').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
}

function pendingHandover(scope, actId) {
  const q = S.agentQueue[`${scope}:${actId}`];
  return q && !q.resolvedAt ? q : null;
}

function chatChannels(scope, isBack) {
  const pendingCount = Object.values(S.agentQueue).filter(q => q && !q.resolvedAt).length;
  render(`
    ${header('Chat', { backTo: '#/home' })}
    <div class="body-pad">
      ${S.adminMode ? `
        <div class="admin-band">
          <span>🎓 <b>Facilitator mode</b>${pendingCount ? ` · ${pendingCount} handover${pendingCount > 1 ? 's' : ''} waiting` : ' · all caught up'}</span>
          <button class="link" id="adm-exit">Exit</button>
        </div>` : ''}
      <div class="seg" role="tablist">
        <button class="${scope === 'group' ? 'active' : ''}" data-scope="group" role="tab">Group</button>
        <button class="${scope === 'individual' ? 'active' : ''}" data-scope="individual" role="tab">Individual</button>
      </div>
      <p style="color:rgba(255,255,255,.85);font-size:12.4px;margin:0 2px;line-height:1.55">
        ${scope === 'group'
          ? 'Share and celebrate together — one room per activity, with your group and facilitator.'
          : 'A private line between you and your facilitator for each activity.'}</p>
      ${MM.ACTIVITIES.map((a, i) => {
        const msgs = S.chat[scope][a.id] || [];
        const last = msgs[msgs.length - 1];
        const readKey = `${scope}:${a.id}`;
        const unread = msgs.filter(m2 => m2.who !== 'me' && m2.at > (S.chatRead[readKey] || 0)).length;
        const handover = pendingHandover(scope, a.id);
        const [c1, c2] = MM.ACT_COLORS[i % MM.ACT_COLORS.length];
        return `<div class="chan-card" data-open="${a.id}" style="animation-delay:${i * .05}s" role="button" tabindex="0">
          <span class="ch-ic" style="background:linear-gradient(140deg, ${c1}, ${c2})">${a.id}</span>
          <h4>${esc(a.name)}${handover && S.adminMode ? '<span class="handover-flag">🙋 handover requested</span>' : ''}${last ? `<span class="last">${esc(last.who === 'me' ? 'You: ' : last.who === 'guide' ? 'Moja Guide: ' : last.who === 'sys' ? '' : 'Facilitator: ')}${esc(last.text)}</span>` : `<span class="last">Say hello 👋</span>`}</h4>
          ${unread ? `<span class="unread">${unread}</span>` : ''}
        </div>`;
      }).join('')}
      ${S.adminMode ? '' : `<button class="fac-link" id="fac-access">🎓 Facilitator access</button>`}
    </div>
  `, { theme: 'theme-purple', backAnim: isBack });
  app.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => chatChannels(b.dataset.scope, false)));
  app.querySelectorAll('.chan-card').forEach(c => c.addEventListener('click', () => nav(`#/chat/${scope}/${c.dataset.open}`)));
  $('#fac-access')?.addEventListener('click', adminLoginModal);
  $('#adm-exit')?.addEventListener('click', () => { S.adminMode = false; save(); toast('Facilitator mode off'); route(); });
}

/* ── Moja Guide — indexed, activity-aware, safe ─────────── */
function fillAIContext(template, activity) {
  const latestUpload = [...(actState(activity.id)?.uploads || [])].reverse().find(upload => typeof upload === 'object' && upload.analysis);
  const values = {
    act: activity.name,
    materials: activity.materials.slice(0, 3).join('; '),
    steps: activity.startHere.slice(0, 2).map(([title, detail]) => `${title} ${detail}`).join(' Then: '),
    options: MM.ART_OPTION_KINDS.map(x => x.name).join(', '),
    reflections: activity.reflections.slice(0, 2).join(' / '),
    week: currentWeek(),
    done: actsDone(),
    artwork: latestUpload?.analysis?.feedback || 'I have not read colours from an uploaded picture for this activity yet. Add one in the Pictures tab, then ask me again.',
  };
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

function aiTermMatches(haystack, term) {
  const escaped = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return term.includes(' ')
    ? haystack.includes(term.toLowerCase())
    : new RegExp(`\\b${escaped}`, 'i').test(haystack);
}

function indexedKnowledgeReply(text, activity) {
  const haystack = text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
  let best = null;
  for (const entry of MM.AI.knowledge) {
    const score = entry.terms.reduce((total, term) => total + (aiTermMatches(haystack, term) ? (term.includes(' ') ? 3 : 1) : 0), 0);
    if (score >= (entry.minScore || 1) && (!best || score > best.score)) best = { entry, score };
  }
  return best ? { topic: best.entry.id, text: fillAIContext(best.entry.reply, activity) } : null;
}

function facilitatorReply(text, activity) {
  // On-device language understanding first: safety before cleverness.
  const read = MMNLP.analyse(text);

  if (read.risk.level === 'crisis' || MM.AI.crisisRx.test(text)) {
    setTimeout(() => toast('💜 You are not alone — the Help button is right at the top', 6000), 2600);
    return { text: MM.AI.crisisReply, handover: true, read, escalate: 'crisis' };
  }
  if (read.risk.level === 'urgent') {
    return {
      text: 'That sounds really heavy right now, and I do not want you to carry it alone. '
        + 'I have asked a human facilitator to come into this chat. If it feels urgent, tap Help at the top — '
        + 'or call Lifeline on 0861 1113 any time, day or night. I am staying right here with you. 💜',
      handover: true, read, escalate: 'urgent',
    };
  }
  if (MM.AI.handoverRx.test(text)) {
    return { text: MM.AI.handoverReply, handover: true, read };
  }
  if (!S.aiMemory) S.aiMemory = {};
  const previous = S.aiMemory[activity.id];
  if (previous && /^(?:(?:yes|yeah|yep|okay|ok|sure)(?:,?\s+please)?|please|tell me more)[.!\s]*$/i.test(text)) {
    const followUp = `Absolutely. For ${activity.name}, choose one tiny next step and give it five unhurried minutes. You can come back and tell me what changed — I’ll remember we were talking about ${previous.topic}.`;
    S.lastAiReply = followUp; save();
    return { text: followUp, read };
  }
  const indexed = indexedKnowledgeReply(text, activity);
  if (indexed) {
    S.aiMemory[activity.id] = { topic: indexed.topic, at: Date.now() };
    S.lastAiReply = indexed.text; save();
    return { text: indexed.text, read };
  }
  const intent = MM.AI.intents.find(i => i.rx.test(text));
  const pool = intent ? intent.replies : MM.AI.fallback;
  let pick;
  do { pick = pool[Math.random() * pool.length | 0]; } while (pool.length > 1 && pick === S.lastAiReply);
  let reply = fillAIContext(pick, activity);

  // Let the sentiment read colour the reply when the words were clearly felt.
  if (read.sentiment.label === 'negative' && read.sentiment.confidence > .6 && !intent) {
    reply = `I can hear that this is weighing on you. ${reply}`;
  } else if (read.sentiment.label === 'positive' && read.sentiment.confidence > .7 && !intent) {
    reply = `I love the lift in that message! ${reply}`;
  }
  S.aiMemory[activity.id] = { topic: intent?.name || 'reflection', at: Date.now() };
  S.lastAiReply = reply; save();
  return { text: reply, read };
}

function chatThread(scope, actId) {
  const a = MM.ACTIVITIES.find(x => x.id === actId);
  if (!a) return nav('#/chat');
  if (!S.chat[scope][actId]) {
    S.chat[scope][actId] = [{
      who: 'fac',
      text: scope === 'group'
        ? `Welcome all to the ${a.name} group chat! Share your creations, thoughts and encouragement here. 🎨`
        : `Hi! This is your private space with me for ${a.name}. Ask me anything, any time. 💜`,
      at: Date.now(),
    }];
    save();
  }
  const msgs = S.chat[scope][actId];
  const qKey = `${scope}:${actId}`;
  S.chatRead[qKey] = Date.now(); save();

  const fmt = ts => {
    const d = new Date(ts);
    return `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en', { month: 'short' })} ${d.getFullYear()}  |  ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  const whoLabel = who => who === 'me' ? 'Me' : who === 'guide' ? 'Moja Guide' : 'Facilitator';
  const bubbleHTML = m => m.who === 'sys'
    ? `<div class="sysline">${esc(m.text)}</div>`
    : `<div class="bubble ${m.who === 'me' ? 'me' : m.who === 'guide' ? 'them guide' : 'them'}">
        <p>${esc(m.text)}</p>
        <span class="meta"><b>${whoLabel(m.who)}</b> | ${fmt(m.at)}</span>
      </div>`;
  const handover = pendingHandover(scope, actId);

  render(`
    ${header(a.name, { backTo: `#/chat/${scope === 'individual' ? 'individual' : ''}` })}
    <div class="chat-scroll" id="chat-scroll">
      <div class="ai-guide-banner">
        <span class="ai-guide-mark">${I.sparkle}</span>
        <span><b>Moja Guide</b><small>On-Device Micro-LLM · 100% Private & DataFree</small></span>
        <div style="display:flex;gap:6px;align-items:center">
          <button class="handover-btn" id="open-llm-coach" title="Open On-Device AI Coach" style="background:rgba(51,102,255,0.25);border:1px solid #3366ff;color:#fff">✨ AI Coach</button>
          ${S.adminMode
            ? `<button class="handover-btn adm" id="adm-resolve" ${handover ? '' : 'disabled'}>${handover ? 'Mark handled' : 'No handover'}</button>`
            : `<button class="handover-btn" id="ask-human">${handover ? (handover.joinedAt ? '🎓 Facilitator here' : '🙋 Requested…') : '🙋 Talk to a human'}</button>`}
        </div>
      </div>
      ${msgs.map(bubbleHTML).join('')}
    </div>
    <div class="chat-input-row">
      <div class="chat-prompts-strip" role="toolbar" aria-label="Suggested quick questions">
        <button class="chat-prompt-pill" data-q="🌸 How do I get started with ${esc(a.name)}?">🌸 How do I start?</button>
        <button class="chat-prompt-pill" data-q="✨ Can you give me feedback on my artwork?">✨ Artwork feedback</button>
        <button class="chat-prompt-pill" data-q="🌱 What materials do I need for this?">🌱 What do I need?</button>
        <button class="chat-prompt-pill" data-q="💜 I am feeling a bit stuck on reflections.">💜 Need reflection tip</button>
        <button class="chat-prompt-pill" data-q="🌟 Feeling proud of completing this week!">🌟 Celebrate progress</button>
      </div>
      <div class="chat-input-bar">
        <input id="chat-in" placeholder="${S.adminMode ? 'Reply as Facilitator…' : 'Ask on-device AI or tap a prompt…'}" autocomplete="off" maxlength="600" />
        <button class="send ${S.adminMode ? 'adm' : ''}" id="chat-send" aria-label="Send">${I.send}</button>
      </div>
    </div>
  `, { theme: 'theme-purple' });

  const scroll = $('#chat-scroll');
  const toBottom = () => { app.scrollTop = app.scrollHeight; };
  toBottom();

  const pushMsg = m => {
    msgs.push(m);
    S.chatRead[qKey] = Date.now(); save();
    if (!$('#chat-scroll')) return;
    scroll.insertAdjacentHTML('beforeend', bubbleHTML(m));
    toBottom();
  };

  /* A pending handover "joins" shortly after it was requested (demo). */
  const maybeJoinFacilitator = () => {
    const q = pendingHandover(scope, actId);
    if (!q || q.joinedAt || S.adminMode) return;
    const wait = Math.max(600, 9000 - (Date.now() - q.requestedAt));
    setTimeout(() => {
      const q2 = pendingHandover(scope, actId);
      if (!q2 || q2.joinedAt) return;
      q2.joinedAt = Date.now(); save();
      pushMsg({ who: 'fac', text: MM.AI.handoverAck, at: Date.now() });
      const btn = $('#ask-human'); if (btn) btn.textContent = '🎓 Facilitator here';
    }, wait);
  };
  maybeJoinFacilitator();

  const requestHandover = () => {
    if (pendingHandover(scope, actId)) return toast('A facilitator has already been asked to join 💜');
    S.agentQueue[qKey] = { requestedAt: Date.now() };
    save();
    pushMsg({ who: 'sys', text: 'A human facilitator has been requested for this chat.', at: Date.now() });
    const btn = $('#ask-human'); if (btn) btn.textContent = '🙋 Requested…';
    maybeJoinFacilitator();
  };
  $('#ask-human')?.addEventListener('click', requestHandover);
  $('#open-llm-coach')?.addEventListener('click', () => MMLLM.openQuickCoachModal(a.name));
  $('#adm-resolve')?.addEventListener('click', () => {
    const q = pendingHandover(scope, actId);
    if (!q) return;
    q.resolvedAt = Date.now(); save();
    pushMsg({ who: 'sys', text: 'Handover handled — Moja Guide is supporting this chat again.', at: Date.now() });
    const btn = $('#adm-resolve'); if (btn) { btn.textContent = 'No handover'; btn.disabled = true; }
    toast('Marked handled 🎓');
  });

  const sendMsg = async () => {
    const inp = $('#chat-in');
    const text = inp.value.trim();
    if (!text) return;

    if (S.adminMode) {
      // Facilitator replies by hand — no AI in the loop.
      pushMsg({ who: 'fac', text, at: Date.now() });
      inp.value = '';
      return;
    }

    pushMsg({ who: 'me', text, at: Date.now() });
    inp.value = '';

    const q = pendingHandover(scope, actId);
    if (q?.joinedAt) {
      // A human facilitator is in the loop — warm, human-paced replies.
      const pool = MM.FACILITATOR_REPLIES;
      const reply = pool[Math.random() * pool.length | 0];
      setTimeout(() => {
        if (!$('#chat-scroll')) return;
        scroll.insertAdjacentHTML('beforeend', `<div class="bubble them typing" id="typing"><i></i><i></i><i></i></div>`);
        toBottom();
        setTimeout(() => { $('#typing')?.remove(); pushMsg({ who: 'fac', text: reply, at: Date.now() }); }, 1600 + Math.random() * 1800);
      }, 1200);
      return;
    }

    // Stream On-Device Micro-LLM response in real-time
    if (!$('#chat-scroll')) return;
    const streamBubbleId = 'stream-bubble-' + Date.now();
    scroll.insertAdjacentHTML('beforeend', `
      <div class="bubble them guide streaming" id="${streamBubbleId}">
        <p class="stream-text"><span class="typing-cursor">▊</span></p>
        <span class="meta"><b>Moja Guide</b> | <span class="engine-tag" style="color:#ffd700">⚡ Thinking…</span></span>
      </div>
    `);
    toBottom();

    const bubbleEl = document.getElementById(streamBubbleId);
    const streamTextEl = bubbleEl?.querySelector('.stream-text');

    try {
      const res = await MMLLM.generateResponse(text, { activity: a, scope, state: S }, (chunk) => {
        if (streamTextEl) {
          streamTextEl.innerHTML = esc(chunk) + '<span class="typing-cursor" style="animation:blink .6s infinite;color:#ffd700;margin-left:2px">▊</span>';
          toBottom();
        }
      });

      if (bubbleEl) {
        bubbleEl.classList.remove('streaming');
        if (streamTextEl) streamTextEl.textContent = res.text;
        const metaEl = bubbleEl.querySelector('.meta');
        if (metaEl) {
          metaEl.innerHTML = `<b>Moja Guide</b> | ${fmt(Date.now())} · <span style="color:#ffd700;font-size:10px;font-weight:600">⚡ ${res.engine}</span>`;
        }
      }

      // Save to chat state
      msgs.push({ who: 'guide', text: res.text, at: Date.now() });
      S.chatRead[qKey] = Date.now();
      save();

      if (res.escalate && !S.tickets.some(t => t.source === 'chat' && Date.now() - t.createdAt < 6 * 36e5)) {
        const t = newTicket('social', 'Wellbeing check-in requested (chat)',
          `Moja Guide flagged ${res.escalate} distress in the ${a.name} ${scope} chat.`, 'chat');
        pushMsg({ who: 'sys', text: `A social worker has been asked to reach out (${t.ref}).`, at: Date.now() });
      }
    } catch (err) {
      console.error('LLM generation error:', err);
      $('#' + streamBubbleId)?.remove();
      const fallbackRes = facilitatorReply(text, a);
      pushMsg({ who: 'guide', text: fallbackRes.text, at: Date.now() });
    }
  };
  $('#chat-send').onclick = sendMsg;
  $('#chat-in').addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
  app.querySelectorAll('.chat-prompt-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const q = pill.dataset.q;
      if (!q) return;
      const inp = $('#chat-in');
      if (inp) {
        inp.value = q;
        sendMsg();
      }
    });
  });
}

/* ── Games Hub & How-to Engine ─────────────────────────────── */
function showGameHowToModal(gameKey) {
  const guide = {
    meadow: {
      title: '🌸 How to Play: Moja Meadow',
      subtitle: '2D Botanical Garden · 4 Seasons & Rain Weather',
      route: '#/game',
      btnText: 'Start Relaxing 🌸',
      items: [
        { icon: '🌸', title: '4 Dynamic Seasons', desc: 'Experience Spring petals, Summer sunshine, Autumn golden leaves, and Winter snow flurries.' },
        { icon: '🌧️', title: 'Rain Weather & Stars (+5 ⭐)', desc: 'Tap Rain to shower all flowers with water and catch falling glowing Rain Stars.' },
        { icon: '🌱', title: 'Plant & Care for Flowers', desc: 'Tap open ground to plant 8 diverse species (Roses, Daisies, Tulips, Sunflowers, Lavender, Orchids, PomPoms, Starflowers).' },
        { icon: '🌟', title: 'Giant Sky Blooms (+50 🌟)', desc: 'Keep watering flowers to reach the sky for radiant mega blooms and high serenity!' },
        { icon: '🐛', title: 'Care for Creatures (💧 +2 to +3)', desc: 'Give cool dewdrops to thirsty worms and working ants to enrich soil health.' },
      ]
    },
    game3d: {
      title: '🐝 How to Play: Moja Bee 3D',
      subtitle: 'Next-Gen 3D Sunray Flight & Supersonic Honey Rush',
      route: '#/game3d',
      btnText: 'Take Flight 🐝',
      items: [
        { icon: '👆', title: 'Touch & Glide Flight', desc: 'Touch & drag anywhere on the screen (or move cursor) to smoothly steer your 3D bumblebee.' },
        { icon: '☀️', title: 'Collect Sunrays (+10 pts)', desc: 'Fly through multifaceted golden rotating sunray crystal stars across the sunny skies.' },
        { icon: '🍯', title: 'Pollen Blossom Pods (+25 pts)', desc: 'Collect glowing honeycomb blossom pods to charge your Honey Rush turbo booster!' },
        { icon: '⚡', title: 'Honey Rush Turbo', desc: 'Tap Honey Rush or collect 3 Pollen pods for supersonic speed warp lines and doubled points!' },
        { icon: '⛈️', title: 'Dodge Storm Clouds', desc: 'Avoid dark storm clouds that cause lightning flashes and temporary flight wobble.' },
      ]
    },
    bubble: {
      title: '🫧 How to Play: Moja Pop',
      subtitle: '2-Minute Countdown OR 3 Lives Challenge · Serenity Bubble Odyssey',
      route: '#/gamebubble',
      btnText: 'Pop Bubbles 🫧',
      items: [
        { icon: '⏳', title: '2-Min Timer or 3 Lives (❤️❤️❤️)', desc: 'Race the 2-minute clock or survive with 3 lives while popping glossy bubbles!' },
        { icon: '🛡️', title: '1 Reset Push Back', desc: 'When bubbles first touch the danger line, you get 1 automatic Reset Push Back that safely sends the grid back up!' },
        { icon: '💔', title: 'Life Loss & Restart', desc: 'If bubbles cross the line after the reset is used, a life is lost. Losing all 3 lives prompts the restart popup.' },
        { icon: '🎯', title: 'Laser Aim & Match 3+', desc: 'Aim with reflective laser guide to connect 3+ matching bubbles with 432Hz harmonic chimes.' },
        { icon: '💥', title: 'Mega Avalanches', desc: 'Disconnect floating clusters from the ceiling to trigger massive cascading avalanche bonuses!' },
      ]
    }
  }[gameKey];

  if (!guide) return;

  const content = `
    <div class="how-to-modal">
      <div class="modal-head">
        <h3 style="margin:0;font-size:18px;font-weight:800;color:#ffffff">${esc(guide.title)}</h3>
        <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.75)">${esc(guide.subtitle)}</p>
      </div>
      <div class="how-to-list">
        ${guide.items.map(it => `
          <div class="how-to-item">
            <span class="hti-icon">${it.icon}</span>
            <div>
              <b>${esc(it.title)}</b>
              <p>${esc(it.desc)}</p>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="modal-btns" style="display:flex;gap:10px;margin-top:16px">
        <button class="btn btn-ghost" id="m-ht-close" style="flex:0 0 80px">Close</button>
        <button class="btn btn-primary" id="m-ht-play" style="flex:1">${esc(guide.btnText)}</button>
      </div>
    </div>
  `;

  const m = modal(content);
  m.querySelector('#m-ht-close').onclick = () => closeModal();
  m.querySelector('#m-ht-play').onclick = () => {
    closeModal();
    nav(guide.route);
  };
}

routes.games = () => {
  render(`
    ${header('Games & Resilience Hub 🎮', { backTo: '#/home' })}
    <div class="body-pad" style="gap:16px">
      <div class="hero-card games-hero">
        <span class="spark-badge">RELAX &amp; PLAY</span>
        <h2 class="hdr-glare">Choose Your Resilience Game</h2>
        <p class="lead">Take a mindful pause between study activities. Enjoy dynamic changing seasons in your meadow, soar in 3D as a cheerful bumblebee, or pop bubbles in harmonic serenity!</p>
      </div>

      <div class="game-hub-grid">
        <!-- Game 1: Moja Meadow 2D -->
        <div class="game-card">
          <div class="game-card-head">
            <span class="game-badge">4 SEASONS BOTANICAL</span>
            <span class="game-icon">🌸</span>
          </div>
          <h3>Moja Meadow</h3>
          <p>Nourish diverse flowers across 4 changing seasons, summon refreshing rain showers, and catch falling Rain Stars.</p>
          <div class="game-stats-row">
            <span class="chip">🌸 <b>${S.game?.blooms || 0}</b> Blooms</span>
            <span class="chip">🌟 <b>${S.game?.megaBlooms || 0}</b> Sky Blooms</span>
            <span class="chip">⭐ <b>${S.game?.rainStars || 0}</b> Rain Stars</span>
            <span class="chip">⏳ <b>2:00</b></span>
          </div>
          <div class="game-card-actions">
            <button class="btn btn-how-to" onclick="showGameHowToModal('meadow')">📖 How to Play</button>
            <button class="btn btn-primary" onclick="nav('#/game')">Play Moja Meadow 🌸</button>
          </div>
        </div>

        <!-- Game 2: Moja Bee 3D -->
        <div class="game-card">
          <div class="game-card-head">
            <span class="game-badge" style="background:linear-gradient(135deg,#ffb703,#e02043);color:#fff">3D SUNRAY FLIGHT</span>
            <span class="game-icon">🐝</span>
          </div>
          <h3>Moja Bee 3D: Sunray Flight</h3>
          <p>Fly your happy bumblebee through sunny 3D skies, sparkling rivers, and mountain valleys. Collect Sunrays &amp; Pollen for supersonic Honey Rush!</p>
          <div class="game-stats-row">
            <span class="chip">🏆 High: <b>${S.game3d?.highScore || 0}</b> pts</span>
            <span class="chip">☀️ <b>${S.game3d?.sunrays || 0}</b> Sunrays</span>
            <span class="chip">🍯 <b>${S.game3d?.pollen || 0}</b> Pollen</span>
            <span class="chip">⏳ <b>2:00</b></span>
          </div>
          <div class="game-card-actions">
            <button class="btn btn-how-to" onclick="showGameHowToModal('game3d')">📖 How to Play</button>
            <button class="btn btn-primary" style="background:linear-gradient(135deg,#ffb703,#f3256b);color:#fff" onclick="nav('#/game3d')">Fly Moja Bee 3D 🐝</button>
          </div>
        </div>

        <!-- Game 3: Moja Pop Bubble Odyssey -->
        <div class="game-card">
          <div class="game-card-head">
            <span class="game-badge" style="background:linear-gradient(135deg,#8a2eae,#3366ff);color:#fff">BUBBLE SHOOTER</span>
            <span class="game-icon">🫧</span>
          </div>
          <h3>Moja Pop: Bubble Odyssey</h3>
          <p>Aim with laser reflections in a 2-min or 3-lives challenge. Enjoy 1 emergency reset push back, 432Hz pop chimes, and mega avalanches!</p>
          <div class="game-stats-row">
            <span class="chip">🏆 High: <b>${S.gameBubble?.highScore || 0}</b> pts</span>
            <span class="chip">🫧 <b>${S.gameBubble?.bubblesPopped || 0}</b> Popped</span>
            <span class="chip">❤️ <b>3 Lives</b></span>
            <span class="chip">🛡️ <b>1 Push Back</b></span>
          </div>
          <div class="game-card-actions">
            <button class="btn btn-how-to" onclick="showGameHowToModal('bubble')">📖 How to Play</button>
            <button class="btn btn-primary" style="background:linear-gradient(135deg,#8a2eae,#3366ff);color:#fff" onclick="nav('#/gamebubble')">Play Moja Pop 🫧</button>
          </div>
        </div>
      </div>

      <div class="card game-card" style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;padding:16px">
        <div>
          <b style="font-size:14.5px;color:#ffffff">🌟 Need instant inspiration?</b>
          <p style="font-size:12.5px;color:rgba(255,255,255,0.92);margin:3px 0 0">Ignite the Beacon of Hope for uplifting affirmations in 6 languages.</p>
        </div>
        <button class="btn btn-secondary" onclick="beaconOfHopeModal()" style="white-space:nowrap;margin-left:10px">Ignite ✨</button>
      </div>

      ${ionityFooter()}
    </div>
  `);
};

/* ── Moja Bee 3D Screen ────────────────────────────────────── */
routes.game3d = () => {
  render(`
    ${header('Moja Bee 3D 🐝🌻', { backTo: '#/games' })}
    <div class="body-pad orbit-pad">
      <div class="meadow-hud orbit-hud">
        <span class="hud-chip">🏆 <b id="orbit-score">0</b></span>
        <span class="hud-chip">⭐ High: <b id="orbit-high">${S.game3d?.highScore || 0}</b></span>
        <span class="hud-chip">☀️ <b id="orbit-sunrays">0</b></span>
        <span class="hud-chip">🍯 <b id="orbit-pollen">0</b></span>
        <span class="hud-chip timer-chip">⏳ <span id="orbit-timer">2:00</span></span>
        <span class="hud-chip">📏 <span id="orbit-dist">0m</span></span>
      </div>
      <div class="orbit-frame">
        <canvas id="orbit-canvas" aria-label="Moja Bee 3D Sunray Flight"></canvas>
        <div class="orbit-controls-overlay">
          <button class="orbit-boost-btn" id="orbit-boost" style="background:linear-gradient(135deg,#ffb703,#e02043);border-color:#ffe066" title="Honey Rush Boost">⚡ HONEY RUSH</button>
        </div>
      </div>
      <div class="orbit-actions" style="display:flex;gap:8px;margin-top:8px">
        <button class="btn btn-outline btn-block" onclick="nav('#/games')">🎮 All Games Hub</button>
        <button class="btn btn-secondary btn-block" onclick="nav('#/gamebubble')">🫧 Play Moja Pop</button>
      </div>
      <p class="meadow-hint" style="text-align:center">
        <b>Touch &amp; drag anywhere</b> to steer bumblebee · Collect <b>☀️ Sunrays (+10)</b> · Gather <b>🍯 Pollen (+25 &amp; Rush!)</b> · Storm clouds cause a dizzy wobble slowdown!
      </p>
    </div>
  `);

  $('#orbit-boost')?.addEventListener('click', () => {
    MMGame3D.triggerBoost();
  });

  MMGame3D.mount();
};

window.addEventListener('hashchange', () => {
  if (!location.hash.startsWith('#/game3d')) MMGame3D.stop();
});

/* ── Moja Pop Bubble Odyssey Screen ────────────────────────── */
routes.gamebubble = () => {
  render(`
    ${header('Moja Pop: Bubble Odyssey 🫧✨', { backTo: '#/games' })}
    <div class="body-pad bubble-pad">
      <div class="meadow-hud bubble-hud">
        <span class="hud-chip">🏆 <b id="bubble-score">0</b></span>
        <span class="hud-chip">⭐ High: <b id="bubble-high">${S.gameBubble?.highScore || 0}</b></span>
        <span class="hud-chip">❤️ <span id="bubble-lives">❤️❤️❤️</span></span>
        <span class="hud-chip" id="bubble-pushback" style="color:#6ec1ff">🛡️ Push Back Ready</span>
        <span class="hud-chip timer-chip" title="2-Minute Countdown Challenge">⏳ <span id="bubble-timer">2:00</span></span>
        <button class="hud-chip hud-btn" id="bubble-swap" title="Swap loaded bubble">🔄 Swap</button>
      </div>
      <div class="bubble-frame">
        <canvas id="bubble-canvas" aria-label="Moja Pop Bubble Shooter Odyssey"></canvas>
      </div>
      <div class="bubble-actions" style="display:flex;gap:8px;margin-top:8px">
        <button class="btn btn-outline btn-block" onclick="nav('#/games')">🎮 All Games Hub</button>
        <button class="btn btn-primary btn-block" style="background:linear-gradient(135deg,#ffb703,#f3256b);color:#fff" onclick="nav('#/game3d')">🐝 Play Moja Bee 3D</button>
      </div>
      <p class="meadow-hint" style="text-align:center">
        <b>Touch &amp; drag to aim laser</b> · Match 3+ bubbles · <b>2-Min or 3 Lives Challenge</b> · Touching danger line triggers <b>1 Reset Push Back 🛡️</b>, then life lost · Disconnect clusters for <b>💥 MEGA AVALANCHES</b>!
      </p>
    </div>
  `);

  $('#bubble-swap')?.addEventListener('click', () => {
    MMBubble.swapBubbles();
  });

  MMBubble.mount();
};

window.addEventListener('hashchange', () => {
  if (!location.hash.startsWith('#/gamebubble')) MMBubble.stop();
});

/* ── Writer / Note Space & Journal 📖✍️ ─────────────────────── */
routes.journal = (args = []) => {
  const subview = args[0] || 'write'; // 'write' | 'entries' | 'edit'
  const editId = subview === 'edit' ? args[1] : null;
  const entries = MMJournal.getEntries();
  const editingEntry = editId ? MMJournal.getEntry(editId) : null;
  const draft = editingEntry ? {
    title: editingEntry.title || '',
    body: editingEntry.body || '',
    mood: editingEntry.mood || '🌟 Hopeful',
    artImg: editingEntry.artImg || null,
    photoImg: editingEntry.photoImg || null,
  } : (MMJournal.getDraft() || { title: '', body: '', mood: '🌟 Hopeful', artImg: null, photoImg: null });

  render(`
    ${header('Writer & Note Space 📖✍️', { backTo: '#/home' })}
    <div class="body-pad" style="gap:14px">
      <!-- Top Navigation Tabs -->
      <div class="tabs-bar" role="tablist" style="justify-content:center">
        <button class="tab-link ${subview === 'write' || subview === 'edit' ? 'active' : ''}" id="j-tab-write">
          ${editingEntry ? '✏️ Edit Note' : '✍️ New Note'}
        </button>
        <button class="tab-link ${subview === 'entries' ? 'active' : ''}" id="j-tab-entries">
          📚 Saved Notes (${entries.length})
        </button>
      </div>

      ${subview === 'write' || subview === 'edit' ? `
        <!-- Procedural 432Hz & Nature Soundscape Bar -->
        ${typeof MMSoundscape !== 'undefined' ? MMSoundscape.soundscapeBarHTML() : ''}

        <!-- Note Writer Card -->
        <div class="card journal-card" style="text-align:left;display:flex;flex-direction:column;gap:12px;padding:18px;background:rgba(255,255,255,0.09);backdrop-filter:blur(16px);border:1.5px solid rgba(51,102,255,0.45);border-radius:20px;box-shadow:0 8px 30px rgba(0,0,0,0.4)">
          
          <!-- Prompt Bar -->
          <div class="journal-prompts-bar" style="display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,0.25);padding:8px 12px;border-radius:12px;border:1px solid rgba(255,209,102,0.3)">
            <span class="j-prompt-lbl" style="font-size:12px;font-weight:700;color:#ffd166">💡 Inspiration Spark:</span>
            <button class="btn btn-ghost btn-sm" id="j-shuffle-prompt" style="padding:3px 8px;font-size:11px">🎲 Shuffle</button>
          </div>
          <div class="j-prompt-box" id="j-prompt-text" style="font-size:12.5px;color:rgba(255,255,255,0.9);line-height:1.5;font-style:italic;padding:0 4px">${esc(pick(MM.JOURNAL_PROMPTS))}</div>

          <!-- Fast Tag Pills -->
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span style="font-size:11.5px;font-weight:700;color:rgba(255,255,255,0.7)">Quick Tag:</span>
            ${['💭 Thought', '🌸 Gratitude', '🎯 Goal', '💡 Idea', '🌿 Healing', '📝 Todo', '❤️ Heart'].map(tag => `
              <button class="j-tag-chip" data-tag="${tag}" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#ffffff;border-radius:10px;padding:4px 9px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s">${tag}</button>
            `).join('')}
          </div>

          <!-- Note Title -->
          <div class="field" style="margin:0">
            <input type="text" id="j-title" placeholder="Note Title or Thought Headline…" value="${esc(draft.title || '')}" maxlength="100" style="width:100%;font-size:15px;font-weight:700;color:#ffffff;background:rgba(0,0,0,0.3);border:1.5px solid rgba(255,255,255,0.2);border-radius:12px;padding:10px 14px;box-sizing:border-box" />
          </div>

          <!-- Mood Selector -->
          <div class="j-mood-picker" style="display:flex;flex-direction:column;gap:6px">
            <span style="font-size:12px;font-weight:700;color:#ffd166">Mood Right Now:</span>
            <div class="j-mood-chips" style="display:flex;gap:6px;flex-wrap:wrap">
              ${['🌟 Hopeful', '😌 Peaceful', '😊 Joyful', '😐 Neutral', '🌱 Reflective', '🌧️ Tough Day', '🔥 Determined'].map(m => `
                <button class="j-mood-btn ${draft.mood === m ? 'active' : ''}" data-mood="${m}" style="background:rgba(255,255,255,0.08);border:1px solid ${draft.mood === m ? '#ffd166' : 'rgba(255,255,255,0.2)'};color:#ffffff;border-radius:10px;padding:5px 10px;font-size:11.5px;font-weight:700;cursor:pointer;transition:all 0.15s">${m}</button>
              `).join('')}
            </div>
          </div>

          <!-- Formatting Toolbar -->
          <div class="j-format-bar" style="display:flex;gap:6px;background:rgba(0,0,0,0.28);padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);align-items:center;flex-wrap:wrap">
            <button class="btn-fmt" data-fmt="bold" title="Bold Text" style="background:rgba(255,255,255,0.1);border:0;color:#fff;font-weight:800;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px"><b>B</b></button>
            <button class="btn-fmt" data-fmt="italic" title="Italic Text" style="background:rgba(255,255,255,0.1);border:0;color:#fff;font-style:italic;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px"><i>I</i></button>
            <button class="btn-fmt" data-fmt="bullet" title="Bullet List" style="background:rgba(255,255,255,0.1);border:0;color:#fff;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px">• List</button>
            <button class="btn-fmt" data-fmt="todo" title="Checkbox Task" style="background:rgba(255,255,255,0.1);border:0;color:#fff;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px">☑ Task</button>
            <button class="btn-fmt" data-fmt="quote" title="Quote" style="background:rgba(255,255,255,0.1);border:0;color:#fff;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px">“ ” Quote</button>
            <button class="btn-fmt" data-fmt="spark" title="Insert Spark Prompt" style="background:rgba(255,209,102,0.2);border:1px solid #ffd166;color:#ffd166;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px;margin-left:auto">✨ Add Spark</button>
          </div>

          <!-- Note Body Textarea -->
          <div class="j-editor-wrap" style="position:relative;background:rgba(0,0,0,0.35);border:1.5px solid rgba(255,255,255,0.2);border-radius:16px;padding:12px;display:flex;flex-direction:column;box-shadow:inset 0 2px 10px rgba(0,0,0,0.4)">
            <textarea id="j-body" placeholder="Write your thoughts, memories, goals, or reflections freely… Everything is private and encrypted with AES-256 on your phone." style="width:100%;min-height:170px;border:0;outline:none;resize:vertical;font:500 14px/1.6 var(--font);color:#ffffff;background:transparent">${esc(draft.body || '')}</textarea>
            
            <!-- Attached Drawing / Image Preview Container -->
            <div id="j-attached-media" style="display:${draft.artImg || draft.photoImg ? 'flex' : 'none'};gap:10px;margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.15);flex-wrap:wrap">
              ${draft.artImg ? `
                <div class="j-media-thumb" id="j-thumb-art" style="position:relative;width:80px;height:80px;border-radius:10px;overflow:hidden;border:1.5px solid #3366ff">
                  <img src="${draft.artImg}" style="width:100%;height:100%;object-fit:cover" alt="Attached Drawing" />
                  <button id="j-del-art" style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.7);border:0;color:#fff;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer">✕</button>
                </div>
              ` : ''}
              ${draft.photoImg ? `
                <div class="j-media-thumb" id="j-thumb-photo" style="position:relative;width:80px;height:80px;border-radius:10px;overflow:hidden;border:1.5px solid #00a651">
                  <img src="${draft.photoImg}" style="width:100%;height:100%;object-fit:cover" alt="Attached Photo" />
                  <button id="j-del-photo" style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.7);border:0;color:#fff;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer">✕</button>
                </div>
              ` : ''}
            </div>

            <!-- Status bar -->
            <div class="j-editor-bar" style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;font-size:11.5px;color:rgba(255,255,255,0.7);border-top:1px solid rgba(255,255,255,0.12);padding-top:8px">
              <span id="j-char-count">${(draft.body || '').length} characters · ${((draft.body || '').trim().split(/\s+/).filter(Boolean)).length} words</span>
              <span class="j-enc-badge" style="color:#52e185;font-weight:700;display:flex;align-items:center;gap:4px">🔒 AES-GCM Encrypted</span>
            </div>
          </div>

          <!-- Tools: Voice Dictation, Drawing Studio, Photo Upload & OCR -->
          <div class="j-tools-bar" style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-secondary j-tool-btn" id="j-mic-btn" style="flex:1 1 40%;font-size:12.5px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px">
              ${I.mic} <span id="j-mic-lbl">Speak to Write</span>
            </button>
            <button class="btn btn-ghost j-tool-btn" id="j-draw-btn" style="flex:1 1 40%;font-size:12.5px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px">
              🎨 <span>Draw &amp; Paint</span>
            </button>
            <label class="btn btn-outline j-tool-btn" id="j-photo-label" style="flex:1 1 40%;font-size:12.5px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer">
              📸 <span>Add Photo</span>
              <input type="file" id="j-photo-file" accept="image/*" style="display:none" />
            </label>
            <label class="btn btn-outline j-tool-btn" id="j-ocr-label" style="flex:1 1 40%;font-size:12.5px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer">
              📷 <span>Scan Note (OCR)</span>
              <input type="file" id="j-ocr-file" accept="image/*" style="display:none" />
            </label>
          </div>

          <!-- Tiny Connected AI Companion Reflection Bubble -->
          <div class="tiny-ai-companion" id="j-tiny-ai">
            <div class="tiny-ai-head">
              <span class="tiny-ai-avatar">🌱</span>
              <b>Tiny Connected AI Companion</b>
              <small>On-Device Insight</small>
            </div>
            <p class="tiny-ai-msg" id="j-ai-msg">Start typing or speaking — I will offer gentle reflections and seeds of hope as you write.</p>
            <button class="btn btn-ghost btn-sm" id="j-ai-refresh" style="align-self:flex-start">✨ Reflect on this thought</button>
          </div>

          <!-- Primary Save Button -->
          <button class="btn btn-primary btn-block" id="j-save-btn" style="font-size:15px;font-weight:800;padding:14px;border-radius:14px;box-shadow:0 6px 20px rgba(51,102,255,0.4)">
            💾 ${editingEntry ? 'Update Note in Vault' : 'Save Note to Private Vault'}
          </button>
        </div>
      ` : `
        <!-- Saved Notes View with Instant Search & Filter -->
        <div class="journal-entries-list" style="display:flex;flex-direction:column;gap:14px;text-align:left">
          
          <!-- Search Bar & Filters -->
          <div class="card" style="padding:12px 14px;background:rgba(255,255,255,0.09);backdrop-filter:blur(16px);border:1.5px solid rgba(51,102,255,0.35);border-radius:16px">
            <div style="position:relative">
              <input type="text" id="j-search-in" placeholder="🔍 Search notes by title, text, or tag…" style="width:100%;padding:9px 12px;font-size:13px;color:#fff;background:rgba(0,0,0,0.3);border:1.5px solid rgba(255,255,255,0.18);border-radius:10px;box-sizing:border-box" />
            </div>
            <div class="j-filter-chips" style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">
              <button class="j-filter-btn active" data-filter="all" style="background:rgba(255,209,102,0.2);border:1px solid #ffd166;color:#ffd166;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:700;cursor:pointer">All (${entries.length})</button>
              <button class="j-filter-btn" data-filter="pinned" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#ffffff;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:700;cursor:pointer">⭐ Pinned (${entries.filter(e => e.pinned).length})</button>
              <button class="j-filter-btn" data-filter="art" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#ffffff;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:700;cursor:pointer">🎨 Art &amp; Photos</button>
              <button class="j-filter-btn" data-filter="gratitude" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#ffffff;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:700;cursor:pointer">🌸 Gratitude</button>
            </div>
          </div>

          <!-- Entries Container -->
          <div id="j-entries-container" style="display:flex;flex-direction:column;gap:12px">
            ${entries.length ? entries.map(e => {
              const themes = (typeof MMNLP !== 'undefined' && MMNLP.extractThemes) ? MMNLP.extractThemes(e.body + ' ' + (e.title || '')) : [];
              return `
                <div class="card journal-entry-card ${e.pinned ? 'is-pinned' : ''}" data-jid="${e.id}" style="background:rgba(255,255,255,0.09);backdrop-filter:blur(16px);border:1.5px solid ${e.pinned ? '#ffd166' : 'rgba(255,255,255,0.18)'};border-radius:18px;padding:16px;box-shadow:0 6px 24px rgba(0,0,0,0.3)">
                  <div class="j-entry-head" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                    <div style="display:flex;align-items:center;gap:6px">
                      <button class="j-pin-btn" data-pin="${e.id}" style="background:transparent;border:0;color:${e.pinned ? '#ffd700' : 'rgba(255,255,255,0.4)'};font-size:16px;cursor:pointer" title="${e.pinned ? 'Unpin note' : 'Pin note to top'}">${e.pinned ? '⭐' : '☆'}</button>
                      <span class="j-entry-mood" style="font-weight:800;color:#ffd166;font-size:12px">${esc(e.mood || '🌿 Note')}</span>
                    </div>
                    <span class="j-entry-date" style="color:rgba(255,255,255,0.65);font-size:11.5px">${new Date(e.updatedAt || e.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <h3 class="j-entry-title" style="margin:2px 0 6px;font-size:16px;font-weight:800;color:#ffffff">${esc(e.title || 'Untitled Note')}</h3>
                  <p class="j-entry-body" style="margin:0 0 10px;font-size:13.5px;line-height:1.6;color:rgba(255,255,255,0.9);white-space:pre-wrap">${esc(e.body)}</p>
                  
                  <!-- Attached Visual Thumbnails if present -->
                  ${e.artImg || e.photoImg ? `
                    <div style="display:flex;gap:8px;margin-bottom:10px">
                      ${e.artImg ? `<img src="${e.artImg}" style="width:70px;height:70px;border-radius:10px;object-fit:cover;border:1px solid #3366ff" alt="Art attachment" />` : ''}
                      ${e.photoImg ? `<img src="${e.photoImg}" style="width:70px;height:70px;border-radius:10px;object-fit:cover;border:1px solid #00a651" alt="Photo attachment" />` : ''}
                    </div>
                  ` : ''}

                  ${themes.length ? `
                    <div class="j-themes-row" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
                      ${themes.map(t => `<span class="j-theme-chip" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);border-radius:8px;padding:2px 7px;font-size:11px;color:#fff">${t.icon} ${t.name}</span>`).join('')}
                    </div>
                  ` : ''}

                  ${e.aiInsight ? `
                    <div class="j-entry-ai" style="background:rgba(255,255,255,0.08);border-left:3px solid #ffd166;padding:8px 12px;border-radius:0 10px 10px 0;font-size:12.5px;line-height:1.5;color:#ffffff;font-style:italic;margin-bottom:10px">
                      <span>${e.aiInsight.icon || '🌱'} <b>Tiny Guide:</b></span> ${esc(e.aiInsight.message)}
                    </div>
                  ` : ''}

                  <div class="j-entry-actions" style="display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,0.1);padding-top:10px">
                    <button class="btn btn-ghost btn-sm j-edit-entry" data-edit="${e.id}" style="padding:4px 8px;font-size:11.5px">✏️ Edit</button>
                    <button class="btn btn-ghost btn-sm j-copy-entry" data-text="${esc(e.body)}" style="padding:4px 8px;font-size:11.5px">📋 Copy</button>
                    <button class="btn btn-ghost btn-sm j-read-aloud" data-text="${esc(e.body)}" style="padding:4px 8px;font-size:11.5px">🔊 Read Aloud</button>
                    <button class="btn btn-ghost btn-sm j-del-entry" data-del="${e.id}" style="padding:4px 8px;font-size:11.5px;color:#ff758f">🗑️ Delete</button>
                  </div>
                </div>
              `;
            }).join('') : `
              <div class="card" style="text-align:center;padding:32px 16px;background:rgba(255,255,255,0.08);backdrop-filter:blur(16px);border:1.5px dashed rgba(255,255,255,0.25);border-radius:20px">
                <div style="font-size:42px;margin-bottom:10px">📖✨</div>
                <h3 style="margin:0 0 8px;color:#ffffff">Your Note Space is Fresh &amp; Ready</h3>
                <p style="font-size:13px;color:rgba(255,255,255,0.85);margin:0 0 18px;line-height:1.6">Write thoughts, capture goals, speak voice notes, or attach sketches. Everything stays safely encrypted right here on your phone.</p>
                <button class="btn btn-primary" onclick="nav('#/journal/write')" style="padding:12px 24px;border-radius:12px;font-weight:700">Write Your First Note ✍️</button>
              </div>
            `}
          </div>
        </div>
      `}

      ${ionityFooter()}
    </div>
  `);

  $('#j-tab-write')?.addEventListener('click', () => nav('#/journal/write'));
  $('#j-tab-entries')?.addEventListener('click', () => nav('#/journal/entries'));

  if (subview === 'write' || subview === 'edit') {
    if (typeof MMSoundscape !== 'undefined') MMSoundscape.wireEvents(app);
    let selectedMood = draft.mood || '🌟 Hopeful';
    let currentArtImg = draft.artImg || null;
    let currentPhotoImg = draft.photoImg || null;

    const bodyEl = $('#j-body');
    const titleEl = $('#j-title');
    const charCountEl = $('#j-char-count');
    const aiMsgEl = $('#j-ai-msg');
    const micBtn = $('#j-mic-btn');
    const micLbl = $('#j-mic-lbl');

    const updateCounts = () => {
      if (!bodyEl || !charCountEl) return;
      const len = bodyEl.value.length;
      const words = bodyEl.value.trim().split(/\s+/).filter(Boolean).length;
      charCountEl.textContent = `${len} characters · ${words} words`;
      // Auto-save draft
      if (!editId) {
        MMJournal.saveDraft({
          title: titleEl?.value || '',
          body: bodyEl.value || '',
          mood: selectedMood,
          artImg: currentArtImg,
          photoImg: currentPhotoImg,
        });
      }
    };

    // Fast Tag Chip Click -> inserts at end of title or textarea
    app.querySelectorAll('.j-tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const tag = chip.dataset.tag;
        if (titleEl && !titleEl.value.includes(tag)) {
          titleEl.value = (tag + ' ' + titleEl.value).trim();
        }
        updateCounts();
        toast(`Tag "${tag}" added ✨`);
      });
    });

    // Formatting buttons
    app.querySelectorAll('.btn-fmt').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!bodyEl) return;
        const fmt = btn.dataset.fmt;
        const start = bodyEl.selectionStart;
        const end = bodyEl.selectionEnd;
        const sel = bodyEl.value.substring(start, end);
        let rep = '';

        if (fmt === 'bold') rep = `**${sel || 'bold text'}**`;
        else if (fmt === 'italic') rep = `*${sel || 'italic text'}*`;
        else if (fmt === 'bullet') rep = `\n• ${sel || 'List item'}`;
        else if (fmt === 'todo') rep = `\n☑ ${sel || 'Task item'}`;
        else if (fmt === 'quote') rep = `\n> "${sel || 'Inspiring quote'}"`;
        else if (fmt === 'spark') {
          const sparkText = $('#j-prompt-text')?.textContent || pick(MM.JOURNAL_PROMPTS);
          rep = `\n[💡 Spark: ${sparkText}]\n`;
        }

        bodyEl.setRangeText(rep, start, end, 'end');
        bodyEl.focus();
        updateCounts();
      });
    });

    app.querySelectorAll('.j-mood-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        app.querySelectorAll('.j-mood-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedMood = btn.dataset.mood;
        updateCounts();
      });
    });

    $('#j-shuffle-prompt')?.addEventListener('click', () => {
      $('#j-prompt-text').textContent = pick(MM.JOURNAL_PROMPTS);
    });

    let aiDebounce = null;
    const updateAi = (text) => {
      clearTimeout(aiDebounce);
      aiDebounce = setTimeout(() => {
        const ref = MMJournal.generateAiReflection(text);
        if (ref && aiMsgEl) {
          aiMsgEl.textContent = ref.message;
          const av = $('#j-tiny-ai .tiny-ai-avatar');
          if (av) av.textContent = ref.icon;
        }
      }, 600);
    };

    bodyEl?.addEventListener('input', () => {
      updateCounts();
      updateAi(bodyEl.value);
    });

    titleEl?.addEventListener('input', () => {
      updateCounts();
    });

    $('#j-ai-refresh')?.addEventListener('click', () => {
      const text = ((titleEl?.value || '') + ' ' + (bodyEl?.value || '')).trim();
      const ref = MMJournal.generateAiReflection(text) || {
        icon: '🌟',
        message: 'Your words hold great strength. In every sentence written, you plant a seed of resilience.',
      };
      if (aiMsgEl) aiMsgEl.textContent = ref.message;
      const av = $('#j-tiny-ai .tiny-ai-avatar');
      if (av) av.textContent = ref.icon;
      toast('Tiny AI reflected on your note ✨');
    });

    // Voice Dictation with real-time streaming preview
    let recording = false;
    let baseText = '';
    micBtn?.addEventListener('click', () => {
      if (!recording) {
        baseText = bodyEl ? bodyEl.value : '';
        MMJournal.startDictation((finalText, interimText) => {
          if (bodyEl) {
            if (finalText) {
              baseText = (baseText ? baseText.trim() + ' ' : '') + finalText.trim();
              bodyEl.value = baseText;
            } else if (interimText) {
              bodyEl.value = (baseText ? baseText.trim() + ' ' : '') + interimText.trim();
            }
            updateCounts();
            updateAi(bodyEl.value);
          }
        }, (isRec) => {
          recording = isRec;
          if (isRec) {
            micBtn.classList.add('rec-pulse');
            if (micLbl) micLbl.textContent = 'Recording… tap to stop';
          } else {
            micBtn.classList.remove('rec-pulse');
            if (micLbl) micLbl.textContent = 'Speak to Write';
          }
        });
      } else {
        MMJournal.stopDictation((isRec) => {
          recording = isRec;
          micBtn.classList.remove('rec-pulse');
          if (micLbl) micLbl.textContent = 'Speak to Write';
        });
      }
    });

    // Draw / Paint Studio in Journal
    $('#j-draw-btn')?.addEventListener('click', () => {
      const host = document.createElement('div');
      host.className = 'draw-overlay';
      document.body.appendChild(host);
      const close = () => { pad.cleanup(); host.remove(); };
      const pad = MMDraw.mount(host, {
        onClose: close,
        onSave: async (dataUrl, meta) => {
          if (!dataUrl) return toast('Make a mark or two first 🖍');
          close();
          currentArtImg = dataUrl;
          const mediaWrap = $('#j-attached-media');
          if (mediaWrap) {
            mediaWrap.style.display = 'flex';
            mediaWrap.innerHTML += `
              <div class="j-media-thumb" id="j-thumb-art" style="position:relative;width:80px;height:80px;border-radius:10px;overflow:hidden;border:1.5px solid #3366ff">
                <img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover" alt="Attached Drawing" />
                <button id="j-del-art" style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.7);border:0;color:#fff;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer">✕</button>
              </div>
            `;
            $('#j-del-art')?.addEventListener('click', () => {
              currentArtImg = null;
              $('#j-thumb-art')?.remove();
              updateCounts();
            });
          }
          updateCounts();
          toast('Drawing attached to note 🎨✨');
          confetti();
        },
      });
    });

    // Add Photo File
    $('#j-photo-file')?.addEventListener('change', e => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        currentPhotoImg = ev.target.result;
        const mediaWrap = $('#j-attached-media');
        if (mediaWrap) {
          mediaWrap.style.display = 'flex';
          mediaWrap.innerHTML += `
            <div class="j-media-thumb" id="j-thumb-photo" style="position:relative;width:80px;height:80px;border-radius:10px;overflow:hidden;border:1.5px solid #00a651">
              <img src="${currentPhotoImg}" style="width:100%;height:100%;object-fit:cover" alt="Attached Photo" />
              <button id="j-del-photo" style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.7);border:0;color:#fff;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer">✕</button>
            </div>
          `;
          $('#j-del-photo')?.addEventListener('click', () => {
            currentPhotoImg = null;
            $('#j-thumb-photo')?.remove();
            updateCounts();
          });
        }
        updateCounts();
        toast('Photo attached to note 📸✨');
      };
      reader.readAsDataURL(file);
    });

    // Tiny OCR
    $('#j-ocr-file')?.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      toast('Scanning note with Tiny OCR… 📷', 2000);
      const text = await MMJournal.performTinyOCR(file);
      if (text && bodyEl) {
        bodyEl.value = (bodyEl.value + (bodyEl.value ? '\n\n' : '') + text).trim();
        updateCounts();
        updateAi(bodyEl.value);
        toast('Handwritten text scanned into note ✨');
      }
    });

    // Remove existing art/photo handlers
    $('#j-del-art')?.addEventListener('click', () => {
      currentArtImg = null;
      $('#j-thumb-art')?.remove();
      updateCounts();
    });
    $('#j-del-photo')?.addEventListener('click', () => {
      currentPhotoImg = null;
      $('#j-thumb-photo')?.remove();
      updateCounts();
    });

    // Save Note
    $('#j-save-btn')?.addEventListener('click', () => {
      const title = titleEl?.value.trim() || '';
      const body = bodyEl?.value.trim() || '';
      if (!body && !currentArtImg && !currentPhotoImg) {
        toast('Please write something or attach a drawing/photo before saving ✍️');
        return;
      }
      const ref = MMJournal.generateAiReflection(body || title);
      MMJournal.saveEntry({
        id: editId || undefined,
        title: title || 'Note & Reflection',
        body,
        mood: selectedMood,
        artImg: currentArtImg,
        photoImg: currentPhotoImg,
        aiInsight: ref,
      });
      toast(editId ? 'Note updated in Vault 🔒💜' : 'Note encrypted & saved to Vault 🔒💜');
      confetti();
      nav('#/journal/entries');
    });
  } else {
    // Entries view events: Search, Filter, Pin, Copy, Read Aloud, Edit, Delete
    const searchIn = $('#j-search-in');
    const container = $('#j-entries-container');

    const filterEntries = () => {
      const q = (searchIn?.value || '').toLowerCase().trim();
      const activeFilter = $('.j-filter-btn.active')?.dataset.filter || 'all';

      container.querySelectorAll('.journal-entry-card').forEach(card => {
        const jid = card.dataset.jid;
        const entry = entries.find(x => x.id === jid);
        if (!entry) return;

        let matchesSearch = true;
        if (q) {
          const hay = `${entry.title} ${entry.body} ${entry.mood}`.toLowerCase();
          matchesSearch = hay.includes(q);
        }

        let matchesFilter = true;
        if (activeFilter === 'pinned') matchesFilter = !!entry.pinned;
        else if (activeFilter === 'art') matchesFilter = !!(entry.artImg || entry.photoImg);
        else if (activeFilter === 'gratitude') matchesFilter = /gratitude|grateful|thank|bless/i.test(`${entry.title} ${entry.body} ${entry.mood}`);

        card.style.display = (matchesSearch && matchesFilter) ? 'flex' : 'none';
      });
    };

    searchIn?.addEventListener('input', filterEntries);

    app.querySelectorAll('.j-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        app.querySelectorAll('.j-filter-btn').forEach(b => {
          b.classList.remove('active');
          b.style.background = 'rgba(255,255,255,0.08)';
          b.style.borderColor = 'rgba(255,255,255,0.2)';
          b.style.color = '#ffffff';
        });
        btn.classList.add('active');
        btn.style.background = 'rgba(255,209,102,0.2)';
        btn.style.borderColor = '#ffd166';
        btn.style.color = '#ffd166';
        filterEntries();
      });
    });

    // Pin Toggle
    app.querySelectorAll('.j-pin-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.pin;
        const isPinned = MMJournal.togglePin(id);
        toast(isPinned ? 'Note pinned to top ⭐' : 'Note unpinned');
        route();
      });
    });

    // Edit Entry
    app.querySelectorAll('.j-edit-entry').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.edit;
        nav(`#/journal/edit/${id}`);
      });
    });

    // Copy Entry Text
    app.querySelectorAll('.j-copy-entry').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.text;
        navigator.clipboard?.writeText(text).then(() => {
          toast('Note text copied to clipboard 📋✨');
        }).catch(() => {
          toast('Text selected');
        });
      });
    });

    // Read Aloud
    app.querySelectorAll('.j-read-aloud').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.text;
        if (typeof MMVoice !== 'undefined' && MMVoice.supported()) {
          MMVoice.speak(text, { persona: 'warmth', force: true });
          toast('Reading note aloud with Piper Voice 🔊✨');
        } else {
          MMJournal.readAloud(text, () => toast('Finished reading note 💜'));
          toast('Reading note aloud 🔊');
        }
      });
    });

    // Delete Entry
    app.querySelectorAll('.j-del-entry').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.del;
        modal(`
          <div style="text-align:center;padding:10px 4px">
            <div style="font-size:36px;margin-bottom:8px">🗑️</div>
            <h3 style="margin:0 0 8px;color:#ffffff">Delete Note?</h3>
            <p style="font-size:13px;line-height:1.6;color:rgba(255,255,255,0.85);margin:0 0 18px">
              Are you sure you want to permanently erase this private note from your encrypted storage?
            </p>
            <div class="modal-btns" style="display:flex;gap:8px">
              <button class="btn btn-ghost" onclick="closeModal()" style="flex:1">Cancel</button>
              <button class="btn btn-primary" id="confirm-del-entry" style="background:#ed1c24;flex:1">Delete Note</button>
            </div>
          </div>
        `).querySelector('#confirm-del-entry').onclick = () => {
          MMJournal.deleteEntry(id);
          closeModal();
          toast('Note deleted from Vault 🗑️');
          route();
        };
      });
    });
  }
};
routes.writer = routes.journal;

/* ── Portfolio & Certificate Route ─────────────────────────── */
routes.portfolio = () => {
  if (typeof MMPortfolio !== 'undefined') {
    MMPortfolio.showPortfolioModal();
  }
};

/* ── Boot ────────────────────────────────────────────────────
   The vault is opened before anything renders, so no screen is
   ever drawn from an unverified or still-locked journal.       */
window.closeModal = closeModal;

(async function boot() {
  bootSplash();
  let opened;
  try { opened = await Vault.open(); }
  catch { opened = { state: null, locked: false, mode: 'plain' }; }

  Vault.onLock(() => lockScreen('Locked after a few quiet minutes. Enter your PIN to continue.'));

  if (opened.locked) { lockScreen(); return; }

  S = hydrate(opened.state);
  applyA11y();

  if (opened.corrupt) {
    setTimeout(() => toast('This device could not unlock its saved journal — starting fresh', 5000), 800);
  }
  if (S.ai?.voiceNav && MMVoice.supported()) MMVoice.start();

  route();

  // Restore the optional transformer in the background, from cache.
  if (S.ai?.transformer) {
    MMNLP.enableTransformer(S.ai.model)
      .then(() => toast('Deeper feeling detection ready ✨', 2400))
      .catch(() => { S.ai.transformer = false; save(); });
  }
})();

/* PWA install prompt */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  setTimeout(() => {
    if (!deferredPrompt || sessionStorage.getItem('mm-install-asked')) return;
    sessionStorage.setItem('mm-install-asked', '1');
    toast('Tip: add MojaMind to your home screen 💜', 3600);
  }, 12000);
});

/* Service worker */
if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
