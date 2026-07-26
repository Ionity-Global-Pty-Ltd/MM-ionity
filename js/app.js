/* ============================================================
   MojoMind — Creative Resilience PWA
   App shell, router, state and screens.
   Pathing mirrors the MojoMind screen recordings exactly:
   Sign In → Terms → Welcome → Demographics → Home
   Home → Instructions | Support | Pre-Survey | Art | Chat | Post-Survey
   © IONITY Global (Pty) Ltd.
   ============================================================ */
'use strict';

/* ── Icons (inline SVG) ──────────────────────────────────── */
const I = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/></svg>',
  headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13a8 8 0 0 1 16 0"/><rect x="2.5" y="13" width="4" height="7" rx="2"/><rect x="17.5" y="13" width="4" height="7" rx="2"/><path d="M19.5 20a4 4 0 0 1-4 2h-2"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><path d="M9 12h6M9 16h6"/></svg>',
  clipboardCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1H9z"/><path d="m9 13.5 2.2 2.2L15.5 11"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1H9z"/><path d="M9 11h6M9 15h6"/></svg>',
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 1 9-9c0 2.2-1.8 3-3.5 3H15a2 2 0 0 0-1.4 3.4c.6.6.4 2.6-1.6 2.6Z"/><circle cx="7.5" cy="11.5" r="1.15" fill="currentColor" stroke="none"/><circle cx="10.5" cy="7.5" r="1.15" fill="currentColor" stroke="none"/><circle cx="15.5" cy="7.5" r="1.15" fill="currentColor" stroke="none"/><circle cx="18" cy="11.5" r="1.15" fill="currentColor" stroke="none"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.9A8 8 0 1 1 21 12Z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v2a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 4.2 2 2 0 0 1 5.1 2h2a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.25a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.54.84l10-6.5a1 1 0 0 0 0-1.68l-10-6.5A1 1 0 0 0 8 5.5Z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h2.4l1.2-2.4A1 1 0 0 1 8.5 5h7a1 1 0 0 1 .9.6L17.6 8H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="14" r="3.4"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  heart: (on) => `<svg viewBox="0 0 24 24" fill="${on ? '#f3256b' : '#c9c3d1'}"><path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.3 4.9 6 4.5c2-.2 3.9.8 6 3 2.1-2.2 4-3.2 6-3 3.7.4 5.6 4.1 4 7.2C19.5 16.3 12 21 12 21Z"/></svg>`,
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
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
};

/* Flower logo (brand mark used across the app, as in the recordings) */
function flowerSVG(size = 34, opts = {}) {
  const petals = [];
  for (let k = 0; k < 6; k++) {
    petals.push(`<ellipse cx="0" cy="-13" rx="6.5" ry="12" transform="rotate(${k * 60})" fill="${opts.petal || 'url(#mmpet)'}" opacity=".96"/>`);
  }
  return `<svg viewBox="-25 -25 50 50" width="${size}" height="${size}" aria-hidden="true">
    <defs>
      <linearGradient id="mmpet" x1="0" y1="-1" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#fbc9e4"/>
      </linearGradient>
      <radialGradient id="mmcore"><stop offset="0" stop-color="#ffd166"/><stop offset="1" stop-color="#f3256b"/></radialGradient>
    </defs>
    <g>${petals.join('')}</g>
    <circle r="6.6" fill="${opts.core || 'url(#mmcore)'}"/>
  </svg>`;
}

/* Rainbow knot logo for the sign-in screen (original MojoMind mark) */
function knotSVG(size = 84) {
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" class="auth-logo" aria-label="MojoMind logo">
    <defs>
      <linearGradient id="mmrb" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f0813c"/><stop offset=".28" stop-color="#ee2b63"/>
        <stop offset=".55" stop-color="#8a2eae"/><stop offset=".8" stop-color="#3f6ad8"/>
        <stop offset="1" stop-color="#34c759"/>
      </linearGradient>
    </defs>
    <g fill="none" stroke="url(#mmrb)" stroke-width="7" stroke-linecap="round">
      <path d="M50 52 C 24 20, 56 8, 54 30 C 52 46, 30 58, 22 44"/>
      <path d="M50 52 C 76 20, 44 8, 46 30 C 48 46, 70 58, 78 44"/>
      <path d="M50 52 C 30 78, 62 94, 60 70 C 58 54, 34 50, 28 66"/>
      <path d="M50 52 C 70 78, 38 94, 40 70 C 42 54, 66 50, 72 66"/>
    </g>
    <circle cx="50" cy="51" r="7.5" fill="url(#mmrb)"/>
  </svg>`;
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

/* ── State ───────────────────────────────────────────────── */
const KEY = 'mojomind:v1';
const blankState = () => ({
  auth: null,
  consented: false,
  onboarded: false,
  demographics: null,        // {answers, completedAt}
  surveys: { pre: {}, post: {} }, // pre.mental = {answers, completedAt}
  drafts: {},                // draft answers per runner key
  moods: [],                 // {mood, note, at}
  lastMoodPrompt: 0,
  activities: {},            // id -> {option, uploads[], reflections{}, submittedAt}
  chat: { group: {}, individual: {} }, // scope -> actId -> [{who, text, at}]
  chatRead: {},
  startedAt: null,
});
let S = load();
function load() {
  try { return Object.assign(blankState(), JSON.parse(localStorage.getItem(KEY)) || {}); }
  catch { return blankState(); }
}
function save() { localStorage.setItem(KEY, JSON.stringify(S)); }

/* Derived flags */
const preDone  = () => MM.PRE_SURVEYS.every(id => S.surveys.pre[id]?.completedAt);
const postDone = () => MM.POST_SURVEYS.every(id => S.surveys.post[id]?.completedAt);
const artOpen  = () => preDone();
const chatOpen = () => preDone();
const postOpen = () => preDone();
const actState = id => S.activities[id] || null;
const actsDone = () => MM.ACTIVITIES.filter(a => actState(a.id)?.submittedAt).length;

/* ── Tiny DOM helpers ────────────────────────────────────── */
const $ = sel => document.querySelector(sel);
const app = $('#app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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

/* ── FX engine — confetti + Click Aura “Jump Forth” ─────── */
const FX = (() => {
  const cv = $('#fx'), ctx = cv.getContext('2d');
  const fit = () => { cv.width = innerWidth; cv.height = innerHeight; };
  fit(); addEventListener('resize', fit);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const palettes = [
    ['#f3256b', '#f9a8d4', '#ffffff', '#e393ec', '#ffd166'],
    ['#34c759', '#ffd166', '#ffffff', '#f0813c', '#ee2b63'],
    ['#5a5fbf', '#c04ac4', '#fbc9e4', '#ffffff', '#7ec86e'],
    ['#ff8a3d', '#f3256b', '#8e3ba8', '#ffd166', '#ffffff'],
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
    if (reduced) return;
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
    if (reduced) return;
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

  // Guards — enforce the exact onboarding pathing
  if (!S.auth && name !== 'signin') return nav('#/signin');
  if (S.auth && !S.consented && name !== 'terms' && name !== 'signin') return nav('#/terms');
  if (S.auth && S.consented && !S.onboarded && !['welcome', 'terms', 'signin'].includes(name)) return nav('#/welcome');
  if (S.auth && S.consented && S.onboarded && !S.demographics && !['demographics', 'help', 'signin'].includes(name)) return nav('#/demographics');

  const fn = routes[name] || routes.home;
  const isBack = raw.length < lastPath.length && lastPath.startsWith(raw.split('/')[0]);
  lastPath = raw;
  window.scrollTo(0, 0);
  fn(parts.slice(1), isBack);
  updateTabbar(name);
  app.scrollTop = 0;
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
    <button class="help-pill" data-act="help"><span class="q">?</span>Help</button>
  </header>`;
}

const TABS = [
  { id: 'home', label: 'Home', icon: I.home, route: '#/home' },
  { id: 'support', label: 'Support', icon: I.headset, route: '#/support' },
  { id: 'art', label: 'Art', icon: I.palette, route: '#/art', gated: true },
  { id: 'chat', label: 'Chat', icon: I.chat, route: '#/chat', gated: true },
];
const NAVLESS = ['signin', 'terms', 'welcome', 'demographics', 'survey', 'help'];
function updateTabbar(name) {
  const bar = $('#tabbar');
  if (NAVLESS.includes(name)) {
    bar.classList.add('hidden'); app.classList.add('no-nav'); return;
  }
  app.classList.remove('no-nav');
  bar.classList.remove('hidden');
  const activeMap = { pre: 'home', post: 'home', instructions: 'home', spark: 'home' };
  const active = activeMap[name] || name;
  bar.innerHTML = TABS.map(t => {
    const locked = t.gated && !artOpen();
    return `<button class="tab ${active === t.id ? 'active' : ''} ${locked ? 'locked' : ''}" data-tab="${t.id}" aria-label="${t.label}">
      ${t.icon}${locked ? `<svg class="mini-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>` : ''}
      <span>${t.label}</span>
    </button>`;
  }).join('');
  bar.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => {
    const t = TABS.find(x => x.id === b.dataset.tab);
    if (t.gated && !artOpen()) return toast('Complete your Pre-Survey to unlock this ✨');
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
});

/* Demo reset — choose your study group, then land on Home */
function resetModal() {
  const groups = [
    { id: 1, emoji: '\uD83D\uDCCB', name: 'Group 1 — Fresh start', desc: 'Everything cleared. Begin at the Pre-Survey, as on day one.' },
    { id: 2, emoji: '\uD83C\uDFA8', name: 'Group 2 — Journey underway', desc: 'Pre-Survey done. Art Activities & Chat unlocked, week 3 of 8.' },
    { id: 3, emoji: '\uD83C\uDF1F', name: 'Group 3 — Final stretch', desc: 'All 8 activities done, week 8 — Post-Survey open.' },
  ];
  const m = modal(`
    <h3>Reset demo — choose a group</h3>
    <p style="font-size:12.6px;line-height:1.6;color:#5c4f73;text-align:center;margin:-6px 0 14px">Your sign-in and details stay. Progress is replaced with the chosen group\u2019s state.</p>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${groups.map(g => `
        <button class="opt-choice" data-group="${g.id}">
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
  m.querySelectorAll('[data-group]').forEach(b => b.addEventListener('click', () => {
    applyGroupReset(+b.dataset.group);
    closeModal();
    toast(`Reset to ${groups.find(g => g.id === +b.dataset.group).name} \u2728`);
    nav('#/home');
    if (location.hash === '#/home') route();
  }));
}

function applyGroupReset(group) {
  const keep = { auth: S.auth, consented: S.consented, onboarded: S.onboarded, demographics: S.demographics };
  S = Object.assign(blankState(), keep);
  S.lastMoodPrompt = Date.now(); // don't instantly re-prompt mood after reset
  const wk = ms => Date.now() - ms * 7 * 864e5;
  if (group === 1) {
    S.startedAt = Date.now();
  } else if (group === 2) {
    S.startedAt = wk(2); // week 3
    MM.PRE_SURVEYS.forEach(id => S.surveys.pre[id] = { answers: {}, completedAt: wk(2), demo: true });
    S.artAboutSeen = true;
  } else {
    S.startedAt = wk(7.5); // week 8
    MM.PRE_SURVEYS.forEach(id => S.surveys.pre[id] = { answers: {}, completedAt: wk(7), demo: true });
    S.artAboutSeen = true;
    MM.ACTIVITIES.forEach((a, i) => {
      S.activities[a.id] = { option: i % 5, uploads: [], reflections: { 0: 'A moment from my journey.' }, startedAt: wk(7) + i * 6 * 864e5, submittedAt: wk(7) + i * 6.5 * 864e5 };
    });
  }
  save();
}

function render(html, { theme = 'theme-home', backAnim = false } = {}) {
  app.innerHTML = `<div class="screen ${theme} ${backAnim ? 'back-anim' : ''}">${html}</div>`;
}

/* ════════════════════════ SCREENS ═══════════════════════ */

/* ── Sign In ─────────────────────────────────────────────── */
routes.signin = () => {
  render(`
    <div class="auth-wrap">
      <img class="auth-cloud" src="./assets/branding/shout-colour-cloud.png" alt="" aria-hidden="true" />
      <div class="auth-brand-lockup">
        <img src="./assets/branding/shout-it-now-logo.png" alt="SHOUT-IT-NOW" />
        <span>Creative Resilience with MojoMind</span>
      </div>
      <h1 class="auth-title">Mobile Number Sign In</h1>
      <p class="sub">Welcome to ${MM.APP_NAME}</p>
      <div class="field">${I.phone}<input id="f-phone" type="tel" inputmode="tel" placeholder="Mobile Number" autocomplete="tel" /></div>
      <div class="field">${I.keyIc}<input id="f-pass" type="password" placeholder="Password" autocomplete="current-password" /></div>
      <div class="auth-row">
        <label class="switch"><input id="f-rem" type="checkbox" checked /><span class="knob"></span>Remember me?</label>
        <button class="link" id="f-forgot">Forgot Password</button>
      </div>
      <button class="btn btn-primary btn-block" id="f-login">Sign in with number</button>
      <p class="auth-foot">${MM.APP_NAME} · Creative Resilience Intervention<br/>Crafted with ❤ by <a href="https://www.ionity.co.za" target="_blank" rel="noopener"><b>IONITY GLOBAL (PTY) LTD</b></a><br/><a class="io-url" href="https://www.ionity.co.za" target="_blank" rel="noopener">www.ionity.co.za</a></p>
    </div>
  `, { theme: 'theme-auth' });
  $('#f-forgot').onclick = () => modal(`
    <h3>Forgot Password</h3>
    <p style="font-size:13.4px;line-height:1.65;color:#4a3f60;text-align:center;margin:0 0 6px">
      No stress! Please contact your facilitator through your study group and they will reset your password for you.</p>
    <div class="modal-btns"><button class="btn btn-primary" onclick="closeModal()">Got it</button></div>
  `);
  $('#f-login').onclick = () => {
    const phone = $('#f-phone').value.trim();
    const pass = $('#f-pass').value;
    if (phone.replace(/\D/g, '').length < 9) { toast('Please enter a valid mobile number'); $('#f-phone').focus(); return; }
    if (!pass) { toast('Please enter your password'); $('#f-pass').focus(); return; }
    S.auth = { phone, remember: $('#f-rem').checked, signedInAt: Date.now() };
    if (!S.startedAt) S.startedAt = Date.now();
    save();
    nav(S.consented ? '#/home' : '#/terms');
  };
};

/* ── Terms & Conditions ──────────────────────────────────── */
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
  $('#t-yes').onclick = () => { S.consented = true; save(); nav('#/welcome'); };
};

/* ── Welcome (onboarding) ────────────────────────────────── */
routes.welcome = () => {
  render(`
    <div class="auth-wrap" style="justify-content:center;text-align:center;align-items:center">
      ${flowerSVG(96)}
      <h1 style="font-size:26px;margin-top:18px">${esc(MM.ONBOARD.title)}</h1>
      <p class="sub" style="line-height:1.7;margin-top:10px">${esc(MM.ONBOARD.body)}</p>
      <p style="color:#fff;font-weight:700;margin:26px 0 14px">${esc(MM.ONBOARD.ready)}</p>
      <button class="btn btn-primary" id="w-start" style="min-width:200px">Start</button>
      <p class="auth-foot">A Creative Resilience journey by <a href="https://www.ionity.co.za" target="_blank" rel="noopener"><b>IONITY GLOBAL (PTY) LTD</b></a><br/><a class="io-url" href="https://www.ionity.co.za" target="_blank" rel="noopener">www.ionity.co.za</a></p>
    </div>
  `, { theme: 'theme-auth' });
  $('#w-start').onclick = () => { S.onboarded = true; save(); nav('#/demographics'); };
};

/* ── Question runner (demographics + surveys) ───────────── */
function runnerHTML(def, savedAnswers, { pageLabel }) {
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
        <span class="req-note">This question requires an answer.</span></div>
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

/* ── Demographics ────────────────────────────────────────── */
routes.demographics = () => {
  render(`
    ${header('Demographic Questions')}
    ${runnerHTML(MM.DEMOGRAPHICS, S.drafts.demographics, { pageLabel: 'Page 1/1' })}
  `, { theme: 'theme-demo' });
  wireRunner(MM.DEMOGRAPHICS, 'demographics', answers => {
    S.demographics = { answers, completedAt: Date.now() };
    save(); confetti();
    toast('Thank you! Your details are saved 💜');
    nav('#/home');
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
  const moods = [{ mood: 'starter', starter: true }, ...S.moods.slice(-13)];
  const w = Math.max(220, moods.length * 30 + 40);
  const flowers = moods.map((m, i) => {
    const x = 26 + i * ((w - 52) / Math.max(1, moods.length - 1) || 0);
    const h = m.starter ? 42 : 26 + ((i * 7919) % 22);
    const mood = MM.MOODS.find(x2 => x2.key === m.mood) || MM.MOODS[0];
    const starterColors = ['#ffffff', '#f9a8d4', '#ffd166', '#e393ec', '#f3256b'];
    const petals = Array.from({ length: 5 }, (_, k) =>
      `<ellipse cx="0" cy="-7.2" rx="3.6" ry="7.2" transform="rotate(${k * 72})" fill="${m.starter ? starterColors[k] : mood.color}" opacity=".95"/>`).join('');
    return `<g class="flower ${m.starter ? 'starter-flower' : ''}" style="animation-delay:${i * .06}s, ${i * .4}s">
      <path d="M${x} 86 Q${x - 5} ${86 - h / 2} ${x} ${86 - h}" stroke="#7ec86e" stroke-width="2.6" fill="none"/>
      <ellipse cx="${x - 6}" cy="${86 - h * .45}" rx="5.4" ry="2.3" fill="#7ec86e" transform="rotate(-32 ${x - 6} ${86 - h * .45})"/>
      <g transform="translate(${x} ${86 - h})">${petals}<circle r="3.4" fill="#ffd166"/></g>
    </g>`;
  }).join('');
  return `<div class="garden"><svg width="${w}" height="92" viewBox="0 0 ${w} 92">${flowers}</svg></div>`;
}

routes.home = () => {
  const wc = preDone() ? MM.WELCOME.preDone : MM.WELCOME.fresh;
  const preCount  = MM.PRE_SURVEYS.filter(id => S.surveys.pre[id]?.completedAt).length;
  const postCount = MM.POST_SURVEYS.filter(id => S.surveys.post[id]?.completedAt).length;
  const streak = moodStreak();
  render(`
    ${header('Welcome!', { home: true })}
    <div class="body-pad">
      <div class="chips">
        <span class="chip">${flowerSVG(14, { petal: '#fff', core: '#ffd166' })} Week ${currentWeek()} of 8</span>
        ${streak ? `<span class="chip">🔥 ${streak}-day check-in streak</span>` : ''}
        <span class="chip">🎨 ${actsDone()}/8 activities</span>
        <button class="chip chip-cta" id="go-spark">${I.sparkle}<span>Daily Spark${(S.sparks || []).some(s => s.day === dayKey()) ? ' ✨' : ''}</span></button>
      </div>
      <div class="hero-card home-hero">
        <h2>${esc(wc.title)}</h2>
        <p>${esc(wc.body)}</p>
        <p class="lead">${esc(wc.tail)}</p>
      </div>
      <div class="tile-grid">
        ${tile(I.info, 'Instructions', '#/instructions')}
        ${tile(I.headset, 'Support Services', '#/support')}
        ${tile(I.doc, 'Pre-Survey', '#/pre', { badge: preDone() ? '✓' : `${preCount}/3`, badgeDone: preDone() })}
        ${tile(I.palette, 'Art Activities', '#/art', { locked: !artOpen(), badge: artOpen() && actsDone() ? `${actsDone()}/8` : null })}
        ${tile(I.chat, 'Chat', '#/chat', { locked: !chatOpen() })}
        ${tile(I.clipboardCheck, 'Post-Survey', '#/post', { locked: !postOpen(), badge: postOpen() ? (postDone() ? '✓' : `${postCount}/4`) : null, badgeDone: postDone() })}
      </div>
      <div class="garden-wrap">
        <div class="garden-title">Your mood garden</div>
        <div class="garden-subtitle">${S.moods.length ? `${S.moods.length + 1} flowers growing with you` : 'Your first flower is already here — check in to help it grow'}</div>
        ${gardenSVG()}
      </div>
      ${ionityFooter()}
    </div>
  `);
  app.querySelectorAll('.tile').forEach(t => t.addEventListener('click', () => {
    if (t.dataset.locked === 'true') { toast('Complete your Pre-Survey to unlock this ✨'); return; }
    nav(t.dataset.route);
  }));
  $('#go-spark')?.addEventListener('click', () => nav('#/spark'));
  maybeMoodModal();
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
        <button class="spark-orb" id="spark-orb" aria-label="${todayDone ? 'Today\u2019s spark' : 'Hold to charge your spark'}">
          ${flowerSVG(70, { petal: '#fff' })}
        </button>
        <div class="spark-hint" id="spark-hint">${todayDone ? 'Today\u2019s spark is lit \u2728' : 'Press & hold the orb.<br/>Breathe in while it charges\u2026'}</div>
      </div>
      <div class="spark-card ${todayDone ? '' : 'hidden'}" id="spark-card">
        <div class="spark-q">\u201C${esc(spark.text)}\u201D</div>
        <div class="spark-by">\u2014 ${esc(spark.by)}</div>
        <div class="spark-you" id="spark-you"></div>
        <div class="modal-btns">
          <button class="btn btn-ghost" id="spark-share">Share</button>
          <button class="btn btn-primary" id="spark-home">Carry it with me</button>
        </div>
      </div>
      <p class="spark-count">${S.sparks.length ? `\u2b50 ${S.sparks.length} spark${S.sparks.length > 1 ? 's' : ''} collected on your journey` : 'Collect a spark every day \u2014 build your constellation'}</p>
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
    hint.innerHTML = 'Today\u2019s spark is lit \u2728';
    cardEl.classList.remove('hidden');
    cardEl.classList.add('pop');
  }
  function startHold(e) {
    if (todayDone || stage.classList.contains('lit')) return;
    e.preventDefault();
    charge = 0;
    orb.classList.add('charging');
    hint.textContent = 'Keep holding\u2026 breathe in\u2026';
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
      hint.innerHTML = 'Press & hold the orb.<br/>Breathe in while it charges\u2026';
    }
  }
  orb.addEventListener('pointerdown', startHold);
  orb.addEventListener('pointerup', endHold);
  orb.addEventListener('pointerleave', endHold);
  orb.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !todayDone) { e.preventDefault(); if (!chargeIv) startHold(e); } });
  orb.addEventListener('keyup', endHold);

  $('#spark-home').onclick = () => { toast('Spark saved to your constellation \u2b50'); nav('#/home'); };
  $('#spark-share').onclick = async () => {
    const rec = S.sparks.find(s => s.day === dayKey()) || { text: spark.text, by: spark.by };
    const msg = `\u201C${rec.text}\u201D \u2014 ${rec.by}\n\n\u2728 My Daily Spark from MojoMind`;
    try {
      if (navigator.share) await navigator.share({ title: 'My Daily Spark \u2014 MojoMind', text: msg });
      else { await navigator.clipboard.writeText(msg); toast('Spark copied \u2014 paste it anywhere \uD83D\uDCAB'); }
    } catch { /* user cancelled */ }
  };
};

/* IONITY brand footer */
function ionityFooter() {
  return `<footer class="ionity-foot">
    <svg class="io-mark" viewBox="0 0 24 24" aria-hidden="true">
      <defs><linearGradient id="iog" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffd166"/><stop offset=".5" stop-color="#f3256b"/><stop offset="1" stop-color="#c04ac4"/>
      </linearGradient></defs>
      <ellipse cx="12" cy="12" rx="9.6" ry="4.1" fill="none" stroke="url(#iog)" stroke-width="1.5" transform="rotate(-24 12 12)"/>
      <ellipse cx="12" cy="12" rx="9.6" ry="4.1" fill="none" stroke="url(#iog)" stroke-width="1.5" opacity=".5" transform="rotate(52 12 12)"/>
      <circle cx="12" cy="12" r="3" fill="url(#iog)"/>
      <circle cx="20.4" cy="8.2" r="1.6" fill="url(#iog)"/>
    </svg>
    <span>Crafted by <a href="https://www.ionity.co.za" target="_blank" rel="noopener"><b>IONITY GLOBAL (PTY) LTD</b></a></span>
    <a class="io-url" href="https://www.ionity.co.za" target="_blank" rel="noopener">www.ionity.co.za</a>
  </footer>`;
}

function currentWeek() {
  if (!S.startedAt) return 1;
  return Math.min(8, Math.floor((Date.now() - S.startedAt) / (7 * 864e5)) + 1);
}
function moodStreak() {
  const days = new Set(S.moods.map(m => new Date(m.at).toDateString()));
  let n = 0; const d = new Date();
  while (days.has(d.toDateString())) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function maybeMoodModal(force = false) {
  const today = new Date().toDateString();
  const already = S.moods.some(m => new Date(m.at).toDateString() === today);
  if (!force && (already || new Date(S.lastMoodPrompt).toDateString() === today)) return;
  S.lastMoodPrompt = Date.now(); save();
  let sel = null;
  const m = modal(`
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
    </div>
  `, { theme: 'theme-purple', backAnim: isBack });
};

/* ── Support services ────────────────────────────────────── */
routes.support = (_, isBack) => {
  const icMap = { phone: I.phone, chat: I.chat, 'chat-heart': I.chatHeart, sun: I.sun, 'shield-heart': I.shieldHeart };
  render(`
    ${header('Support Services')}
    <div class="body-pad">
      <div class="hero-card"><p class="lead">${esc(MM.SUPPORT.intro)}</p></div>
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
  app.querySelectorAll('[data-route]').forEach(b => b.addEventListener('click', () => {
    if (!chatOpen()) return toast('Chat unlocks after your Pre-Survey ✨');
    nav(b.dataset.route);
  }));
};

/* ── Help Now ────────────────────────────────────────────── */
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
      <div class="info-card">
        <h3><span class="ic">${I.sun}</span>Breathe with me — 4 · 6 · 7</h3>
        <div class="breathe-wrap">
          <div class="breathe-ring"><div class="breathe-ball" id="bball"><span id="btext">Tap to start</span></div></div>
          <div class="breathe-count" id="bcount">Breathe in 4s — hold 6s — out 7s</div>
        </div>
      </div>
    </div>
  `, { theme: 'theme-purple' });

  const ball = $('#bball'), text = $('#btext'), count = $('#bcount');
  let timer = null;
  const phases = [['in', 'Breathe in…', 4], ['hold', 'Hold…', 6], ['out', 'Breathe out…', 7]];
  let pi = 0;
  function step() {
    const [cls, label, secs] = phases[pi % 3];
    ball.className = 'breathe-ball ' + cls;
    text.textContent = label;
    count.textContent = `${secs} seconds — you're doing great`;
    if (navigator.vibrate) navigator.vibrate(20);
    pi++;
    timer = setTimeout(step, secs * 1000);
  }
  ball.parentElement.addEventListener('click', () => {
    if (timer) { clearTimeout(timer); timer = null; pi = 0; ball.className = 'breathe-ball'; text.textContent = 'Tap to start'; count.textContent = 'Breathe in 4s — hold 6s — out 7s'; }
    else step();
  });
};

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
          <span class="s-name">${esc(def.name)}</span>
          <span class="s-status">
            ${I.heart(!!rec)}
            <em class="${rec ? 'on' : 'off'}">${rec ? 'Completed' : (dCount ? 'In progress' : 'Not Started')}</em>
          </span>
          ${!rec && dCount ? `<span class="ring">${Math.round((dCount / total) * 100)}%</span>` : ''}
        </div>`;
      }).join('')}
    </div>
  `, { theme: 'theme-purple', backAnim: isBack });
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
  const rec = S.surveys[phase][id];
  render(`
    ${header(def.name, { backTo: `#/${phase}` })}
    ${rec ? completedHTML(def, phase) : runnerHTML(def, S.drafts[`${phase}:${id}`], { pageLabel: 'Page 1/1' })}
  `, { theme: `theme-${def.theme}` });

  if (rec) {
    $('#redo')?.addEventListener('click', () => {
      delete S.surveys[phase][id]; save(); route();
    });
    return;
  }
  wireRunner(def, `${phase}:${id}`, answers => {
    S.surveys[phase][id] = { answers, completedAt: Date.now() };
    save(); confetti();
    const allDone = phase === 'pre' ? preDone() : postDone();
    const m = modal(`
      <div class="celebrate">
        <svg class="big-heart" viewBox="0 0 24 24" fill="#f3256b"><path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.3 4.9 6 4.5c2-.2 3.9.8 6 3 2.1-2.2 4-3.2 6-3 3.7.4 5.6 4.1 4 7.2C19.5 16.3 12 21 12 21Z"/></svg>
        <h3>${esc(def.name)} completed!</h3>
        <p>${allDone
          ? (phase === 'pre'
            ? 'Amazing! Your Pre-Survey is done — Art Activities, Chat and your Post-Survey are now unlocked. Your 8-week journey begins! 🎨'
            : 'That was the final check-in. Thank you for being part of this study — you did something wonderful for yourself. 💜')
          : 'Thank you for your honesty. Every answer helps us support you better.'}</p>
        <button class="btn btn-primary btn-block" id="cel-ok">Continue</button>
      </div>
    `);
    m.querySelector('#cel-ok').onclick = () => { closeModal(); nav(`#/${phase}`); };
  });
};

function completedHTML(def, phase) {
  return `<div class="body-pad">
    <div class="q-card">
      <div class="celebrate">
        <svg class="big-heart" viewBox="0 0 24 24" fill="#f3256b"><path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.3 4.9 6 4.5c2-.2 3.9.8 6 3 2.1-2.2 4-3.2 6-3 3.7.4 5.6 4.1 4 7.2C19.5 16.3 12 21 12 21Z"/></svg>
        <h3>Completed</h3>
        <p>You have already completed the ${esc(def.name)} for this ${phase === 'pre' ? 'pre' : 'post'}-survey. Thank you!</p>
        <button class="btn btn-ghost btn-block" id="redo">Redo survey (demo)</button>
      </div>
    </div>
  </div>`;
}

/* ── Art activities ──────────────────────────────────────── */
routes.art = (params, isBack) => {
  if (!artOpen()) { toast('Complete your Pre-Survey to unlock Art Activities ✨'); return nav('#/pre'); }
  if (!params.length) {
    if (!S.artAboutSeen) return nav('#/art/about');
    return artList(isBack);
  }
  if (params[0] === 'about') return artAbout();
  const id = parseInt(params[0], 10);
  const a = MM.ACTIVITIES.find(x => x.id === id);
  if (!a) return nav('#/art');
  if (params[1] === 'detail') return artDetail(a, params[2] || 'start');
  return artOptions(a);
};

function artAbout() {
  render(`
    ${header('About Activities', { backTo: '#/home' })}
    <div class="body-pad">
      <div class="hero-card"><p class="lead">${esc(MM.ART_ABOUT.heroBody)}</p></div>
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
        const locked = a.week > week && !st;
        const [c1, c2] = MM.ACT_COLORS[i % MM.ACT_COLORS.length];
        const done = !!st?.submittedAt;
        const started = !!st && !done;
        return `<div class="act-card ${done ? 'done' : ''} ${locked ? 'locked' : ''}" data-id="${a.id}" data-locked="${locked}" style="animation-delay:${i * .05}s" role="button" tabindex="0">
          <span class="acttile" style="background:linear-gradient(160deg, ${c1}, ${c2})">
            <span>Activity</span><b>${a.id}</b><em>Week ${a.week}</em>
          </span>
          <span class="a-name">${esc(a.name)}</span>
          <span class="a-status">
            ${done
              ? `<span class="st-ic" style="background:#fdf2f8;color:#f3256b">${I.heart(true)}</span><em>Completed</em>`
              : locked
                ? `<span class="st-ic" style="background:#f0edf4;color:#9b93aa">${I.lock}</span><em>Locked</em>`
                : started
                  ? `<span class="st-ic" style="background:#fff7ed;color:#e8891d">${I.pencil}</span><em>In progress</em>`
                  : `<span class="st-ic" style="border:2.4px solid #c9c3d1;color:transparent">${I.check}</span><em>Not Started</em>`}
          </span>
        </div>`;
      }).join('')}
    </div>
  `, { theme: 'theme-purple', backAnim: isBack });
  app.querySelectorAll('.act-card').forEach(c => c.addEventListener('click', () => {
    if (c.dataset.locked === 'true') return toast(`This activity unlocks in week ${MM.ACTIVITIES.find(a => a.id == c.dataset.id).week} 🌱`);
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
    S.activities[a.id] = Object.assign({ uploads: [], reflections: {} }, S.activities[a.id], { option: sel, startedAt: actState(a.id)?.startedAt || Date.now() });
    save();
    nav(`#/art/${a.id}/detail/start`);
  };
}

function artDetail(a, tab) {
  const st = actState(a.id);
  if (!st || st.option == null) return nav(`#/art/${a.id}`);
  const kind = MM.ART_OPTION_KINDS[st.option];
  const tabs = [['start', 'Start Here'], ['materials', 'Materials'], ['pictures', 'Pictures'], ['reflections', 'Reflections']];

  let body = '';
  if (tab === 'start') {
    body = `
      <div class="info-card">
        <div style="display:flex;flex-direction:column;gap:14px">
          ${a.startHere.map(([b, t]) => `
            <div class="step-li"><span class="pen">${I.pencil}</span><p><b>${esc(b)}</b> ${esc(t)}</p></div>`).join('')}
        </div>
        <button class="video-btn" id="play-video"><span class="play">${I.play}</span>Play Video</button>
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
        ? `<div class="upload-grid">${st.uploads.map((u, i) => `
            <div class="shot"><img src="${u}" alt="Upload ${i + 1}" /><button class="del" data-del="${i}" aria-label="Delete">${I.x}</button></div>`).join('')}
          </div>`
        : `<div class="info-card"><p class="empty-note">No pictures have been uploaded yet.</p></div>`}
      <input type="file" id="file-in" accept="image/*" multiple class="hidden" />
      <div class="act-foot-btns" style="padding:0;justify-content:space-between">
        <button class="btn btn-ghost" id="upload-btn" style="display:inline-flex;align-items:center;gap:8px">${I.camera} Upload</button>
        <button class="btn btn-primary" data-go="reflections">Reflect</button>
      </div>`;
  } else {
    body = `
      <div class="info-card">
        <div style="display:flex;flex-direction:column;gap:18px">
          ${a.reflections.map((q, i) => `
            <div class="refl-q">
              <label for="rq${i}"><svg class="pen-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>${i + 1}. ${esc(q)}</label>
              <textarea id="rq${i}" data-r="${i}" placeholder="Your reflection… (no right or wrong)">${esc(st.reflections[i] || '')}</textarea>
            </div>`).join('')}
        </div>
      </div>
      <div class="act-foot-btns" style="padding:0">
        <button class="btn btn-primary" id="submit-refl" style="min-width:150px">${st.submittedAt ? 'Update' : 'Submit'}</button>
      </div>`;
  }

  render(`
    ${header(a.name, { backTo: '#/art' })}
    <div class="body-pad" style="gap:12px">
      <div class="hero-card" style="padding:13px 16px">
        <p class="lead" style="margin:0">Option ${st.option + 1} — ${kind.emoji} ${esc(kind.name)}</p>
      </div>
      <div class="tabs-bar" role="tablist">
        ${tabs.map(([k, lbl]) => `<button class="tab-link ${tab === k ? 'active' : ''}" role="tab" aria-selected="${tab === k}" data-tab="${k}">${lbl}</button>`).join('')}
      </div>
      ${body}
    </div>
  `, { theme: 'theme-purple' });

  app.querySelectorAll('.tab-link').forEach(t => t.addEventListener('click', () => nav(`#/art/${a.id}/detail/${t.dataset.tab}`)));
  app.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => nav(`#/art/${a.id}/detail/${b.dataset.go}`)));

  $('#play-video')?.addEventListener('click', () => modal(`
    <h3>${esc(a.name)} — video guide</h3>
    <div style="aspect-ratio:16/9;border-radius:16px;display:grid;place-items:center;background:linear-gradient(140deg,#8a2eae,#3d1160);color:#fff">
      <div style="text-align:center;padding:16px">
        <div style="font-size:34px">🎬</div>
        <p style="font-size:13px;opacity:.85;margin:8px 0 0">Your facilitator's video guide will appear here when it is published to your group.</p>
      </div>
    </div>
    <div class="modal-btns"><button class="btn btn-primary" onclick="closeModal()">Close</button></div>
  `));

  $('#upload-btn')?.addEventListener('click', () => $('#file-in').click());
  $('#file-in')?.addEventListener('change', async e => {
    const files = [...e.target.files].slice(0, 6);
    for (const f of files) {
      const url = await shrinkImage(f);
      st.uploads.push(url);
    }
    save(); toast(`${files.length} picture${files.length > 1 ? 's' : ''} added 📸`);
    artDetail(a, 'pictures');
  });
  app.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    st.uploads.splice(+b.dataset.del, 1); save();
    artDetail(a, 'pictures');
  }));

  app.querySelectorAll('[data-r]').forEach(t => t.addEventListener('input', () => {
    st.reflections[t.dataset.r] = t.value; save();
  }));
  $('#submit-refl')?.addEventListener('click', () => {
    const filled = a.reflections.filter((_, i) => (st.reflections[i] || '').trim()).length;
    if (!filled) return toast('Share at least one reflection before submitting 💭');
    const first = !st.submittedAt;
    st.submittedAt = Date.now(); save();
    if (first) {
      confetti();
      const m = modal(`
        <div class="celebrate">
          <div style="font-size:56px">🎨</div>
          <h3>Activity ${a.id} submitted!</h3>
          <p>Beautiful work. Sit with your creation for a moment — you can revisit or update your reflections any time.</p>
          <button class="btn btn-primary btn-block" id="cel-ok">Back to activities</button>
        </div>`);
      m.querySelector('#cel-ok').onclick = () => { closeModal(); nav('#/art'); };
    } else { toast('Reflections updated 💜'); nav('#/art'); }
  });
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

/* ── Chat ────────────────────────────────────────────────── */
routes.chat = (params, isBack) => {
  if (!chatOpen()) { toast('Complete your Pre-Survey to unlock Chat ✨'); return nav('#/pre'); }
  if (params.length >= 2) return chatThread(params[0], parseInt(params[1], 10));
  chatChannels(params[0] === 'individual' ? 'individual' : 'group', isBack);
};

function chatChannels(scope, isBack) {
  render(`
    ${header('Chat', { backTo: '#/home' })}
    <div class="body-pad">
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
        const [c1, c2] = MM.ACT_COLORS[i % MM.ACT_COLORS.length];
        return `<div class="chan-card" data-open="${a.id}" style="animation-delay:${i * .05}s" role="button" tabindex="0">
          <span class="ch-ic" style="background:linear-gradient(140deg, ${c1}, ${c2})">${a.id}</span>
          <h4>${esc(a.name)}${last ? `<span class="last">${esc(last.who === 'me' ? 'You: ' : last.who === 'guide' ? 'Mojo Guide: ' : 'Facilitator: ')}${esc(last.text)}</span>` : `<span class="last">Say hello 👋</span>`}</h4>
          ${unread ? `<span class="unread">${unread}</span>` : ''}
        </div>`;
      }).join('')}
    </div>
  `, { theme: 'theme-purple', backAnim: isBack });
  app.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => chatChannels(b.dataset.scope, false)));
  app.querySelectorAll('.chan-card').forEach(c => c.addEventListener('click', () => nav(`#/chat/${scope}/${c.dataset.open}`)));
}

/* ── Mojo Guide — indexed, activity-aware, safe ─────────── */
function fillAIContext(template, activity) {
  const values = {
    act: activity.name,
    materials: activity.materials.slice(0, 3).join('; '),
    steps: activity.startHere.slice(0, 2).map(([title, detail]) => `${title} ${detail}`).join(' Then: '),
    options: MM.ART_OPTION_KINDS.map(x => x.name).join(', '),
    reflections: activity.reflections.slice(0, 2).join(' / '),
    week: currentWeek(),
    done: actsDone(),
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
  if (MM.AI.crisisRx.test(text)) {
    setTimeout(() => toast('💜 You are not alone — the Help button is right at the top', 6000), 2600);
    return MM.AI.crisisReply;
  }
  if (!S.aiMemory) S.aiMemory = {};
  const previous = S.aiMemory[activity.id];
  if (previous && /^(?:(?:yes|yeah|yep|okay|ok|sure)(?:,?\s+please)?|please|tell me more)[.!\s]*$/i.test(text)) {
    const followUp = `Absolutely. For ${activity.name}, choose one tiny next step and give it five unhurried minutes. You can come back and tell me what changed — I’ll remember we were talking about ${previous.topic}.`;
    S.lastAiReply = followUp; save();
    return followUp;
  }
  const indexed = indexedKnowledgeReply(text, activity);
  if (indexed) {
    S.aiMemory[activity.id] = { topic: indexed.topic, at: Date.now() };
    S.lastAiReply = indexed.text; save();
    return indexed.text;
  }
  const intent = MM.AI.intents.find(i => i.rx.test(text));
  const pool = intent ? intent.replies : MM.AI.fallback;
  let pick;
  do { pick = pool[Math.random() * pool.length | 0]; } while (pool.length > 1 && pick === S.lastAiReply);
  const reply = fillAIContext(pick, activity);
  S.aiMemory[activity.id] = { topic: intent?.name || 'reflection', at: Date.now() };
  S.lastAiReply = reply; save();
  return reply;
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
  S.chatRead[`${scope}:${actId}`] = Date.now(); save();

  const fmt = ts => {
    const d = new Date(ts);
    return `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en', { month: 'short' })} ${d.getFullYear()}  |  ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  const whoLabel = who => who === 'me' ? 'Me' : who === 'guide' ? 'Mojo Guide' : 'Facilitator';
  render(`
    ${header(a.name, { backTo: `#/chat/${scope === 'individual' ? 'individual' : ''}` })}
    <div class="chat-scroll" id="chat-scroll">
      <div class="ai-guide-banner">
        <span class="ai-guide-mark">${I.sparkle}</span>
        <span><b>Mojo Guide</b><small>Activity-aware support</small></span>
      </div>
      ${msgs.map(m => `
        <div class="bubble ${m.who === 'me' ? 'me' : m.who === 'guide' ? 'them guide' : 'them'}">
          <p>${esc(m.text)}</p>
          <span class="meta"><b>${whoLabel(m.who)}</b> | ${fmt(m.at)}</span>
        </div>`).join('')}
    </div>
    <div class="chat-input-row">
      <input id="chat-in" placeholder="Type a message…" autocomplete="off" maxlength="600" />
      <button class="send" id="chat-send" aria-label="Send">${I.send}</button>
    </div>
  `, { theme: 'theme-purple' });

  const scroll = $('#chat-scroll');
  const toBottom = () => { app.scrollTop = app.scrollHeight; };
  toBottom();

  const sendMsg = () => {
    const inp = $('#chat-in');
    const text = inp.value.trim();
    if (!text) return;
    msgs.push({ who: 'me', text, at: Date.now() });
    save(); inp.value = '';
    scroll.insertAdjacentHTML('beforeend', `
      <div class="bubble me"><p>${esc(text)}</p><span class="meta"><b>Me</b> | ${fmt(Date.now())}</span></div>`);
    toBottom();
    // Facilitator reply — intent-aware AI with typing indicator
    const reply = facilitatorReply(text, a);
    setTimeout(() => {
      if (!$('#chat-scroll')) return;
      scroll.insertAdjacentHTML('beforeend', `<div class="bubble them typing" id="typing"><i></i><i></i><i></i></div>`);
      toBottom();
      setTimeout(() => {
        $('#typing')?.remove();
        msgs.push({ who: 'guide', text: reply, at: Date.now() });
        S.chatRead[`${scope}:${actId}`] = Date.now(); save();
        if (!$('#chat-scroll')) return;
        scroll.insertAdjacentHTML('beforeend', `
          <div class="bubble them guide"><p>${esc(reply)}</p><span class="meta"><b>Mojo Guide</b> | ${fmt(Date.now())}</span></div>`);
        toBottom();
      }, 900 + Math.min(2600, reply.length * 16));
    }, 700);
  };
  $('#chat-send').onclick = sendMsg;
  $('#chat-in').addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
}

/* ── Boot ────────────────────────────────────────────────── */
window.closeModal = closeModal;
route();

/* PWA install prompt */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  setTimeout(() => {
    if (!deferredPrompt || sessionStorage.getItem('mm-install-asked')) return;
    sessionStorage.setItem('mm-install-asked', '1');
    toast('Tip: add MojoMind to your home screen 💜', 3600);
  }, 12000);
});

/* Service worker */
if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
