/* ============================================================
   MojaMind — Creative Resilience PWA
   App shell, router, state and screens.
   Pathing per the Aug 2026 design update:
   Splash → Sign In → Terms (Accept) → Welcome → Demographics → Home
   Home → Instructions | Support | Pre-Survey | Art* | Chat* | Post-Survey
   (* availability depends on study group: G1 surveys only,
      G2 adds art, G3 adds chat)
   © IONITY Global (Pty) Ltd.
   ============================================================ */
'use strict';

/* ── Bespoke Creative Resilience & MojaMind Icons (24x24 geometry, 2px stroke) ─ */
const I = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
  headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="2" y="13" width="4" height="7" rx="2"/><rect x="18" y="13" width="4" height="7" rx="2"/><path d="M20 20v1a2 2 0 0 1-2 2h-4"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
  clipboardCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="18" rx="2.5"/><path d="M9 4V2.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5V4"/><path d="m8.5 13.5 2.5 2.5 5-5"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="18" rx="2.5"/><path d="M9 4V2.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5V4"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="13" y2="18"/></svg>',
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.97 3.63 9.09 8.35 9.87.58.1 1.05-.39 1.05-.98v-1.12c0-.83.67-1.5 1.5-1.5h1.6c3.87 0 7-3.13 7-7 0-5.52-4.48-9.27-9.5-9.27z"/><circle cx="7.5" cy="10" r="1.1" fill="currentColor"/><circle cx="10.5" cy="6.5" r="1.1" fill="currentColor"/><circle cx="14.5" cy="7" r="1.1" fill="currentColor"/><circle cx="17" cy="11" r="1.1" fill="currentColor"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 0 1-4.2-.92L3 20l1.2-3.6A7.52 7.52 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/><circle cx="8" cy="12" r="1.15" fill="currentColor"/><circle cx="12" cy="12" r="1.15" fill="currentColor"/><circle cx="16" cy="12" r="1.15" fill="currentColor"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="11"/><circle cx="12" cy="7.5" r="1.2" fill="currentColor"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2.5"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.54.84l10-6.5a1 1 0 0 0 0-1.68l-10-6.5A1 1 0 0 0 8 5.5Z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  heart: (on) => `<svg viewBox="0 0 24 24" fill="${on ? '#f3256b' : 'none'}" stroke="${on ? '#f3256b' : 'currentColor'}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 12.572l-7.5 7.428-7.5-7.428m0 0a5 5 0 1 1 7.5-6.566 5 5 0 1 1 7.5 6.572"/></svg>`,
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  shieldHeart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 9c-.8-1-2-1.5-3.2-1-1.3.6-1.8 2.2-.8 3.5 1 1.4 4 4 4 4s3-2.6 4-4c1-1.3.5-2.9-.8-3.5-1.2-.5-2.4 0-3.2 1z" fill="currentColor"/></svg>',
  chatHeart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 0 1-4.2-.92L3 20l1.2-3.6A7.52 7.52 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/><path d="M12 9.5c-.6-.8-1.5-1.2-2.4-.8-1 .5-1.3 1.7-.6 2.7.8 1.1 3 3.1 3 3.1s2.2-2 3-3.1c.7-1 .4-2.2-.6-2.7-.9-.4-1.8 0-2.4.8z" fill="currentColor"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8v13"/><path d="M12 8s-4.5.2-5.5-2C5.8 4.4 7.4 3 9 3.5 11 4.2 12 8 12 8Zm0 0s4.5.2 5.5-2c.7-1.6-.9-3-2.5-2.5C13 4.2 12 8 12 8Z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>',
  keyIc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 8.8-8.8M16 6.5l2.5 2.5M13 9.5l2.5 2.5"/></svg>',
  reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 2.6-6.4"/><polyline points="3 4 3 9 8 9"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z"/><circle cx="19" cy="4" r="1.3"/><circle cx="5" cy="19" r="1.3"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6a2 2 0 0 0 0 2.8l.6.6a2 2 0 0 0 2.8 0l5.7-5.7a4.5 4.5 0 0 0 5.6-6l-3 3-2.8-.7-.7-2.8Z"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="3"/></svg>',
  a11y: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.5" r="2.2"/><path d="M4.5 8.5c2.5.8 5 1.2 7.5 1.2s5-.4 7.5-1.2"/><path d="M12 9.7v4.5M12 14.2l-3 6M12 14.2l3 6"/></svg>',
  ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><line x1="13" y1="5" x2="13" y2="19" stroke-dasharray="2 2"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="14" height="14" rx="3"/><path d="m16 10 5-3.5v11L16 14"/></svg>',
  handHeart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8.5s-2.4-1.6-3.2-3c-.5-1 .1-2.2 1.3-2.3.7 0 1.3.4 1.9 1 .6-.6 1.2-1 1.9-1 1.2.1 1.8 1.3 1.3 2.3-.8 1.4-3.2 3-3.2 3Z" fill="currentColor"/><path d="M3 14.5h3l3.2 1.4c.7.3 1.1 1 .9 1.8-.2.9-1.1 1.4-2 1.2l-2.1-.6"/><path d="M9.5 18.4 15 20l6-2.6c.8-.4 1.1-1.4.6-2.1-.4-.6-1.1-.8-1.8-.6L16 16"/></svg>',
  brush: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.34-3 3 0 1.31-1.16 1.7-1.67 2.18-.46.44-.08 1.88 1.1 1.88 3.31 0 6.57-2.3 6.57-5.5 0-1.66-1.34-3-3-3z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
  brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 4a3.5 3.5 0 0 0-3.5 3.5 3.5 3.5 0 0 0-1.5 6 3.5 3.5 0 0 0 3.5 5.5 3.5 3.5 0 0 0 3.5-3V8a4 4 0 0 0-2-4z"/><path d="M14.5 4a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1 1.5 6 3.5 3.5 0 0 1-3.5 5.5 3.5 3.5 0 0 1-3.5-3V8a4 4 0 0 1 2-4z"/></svg>',
  gamepad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4M8 10v4"/><circle cx="15.5" cy="10.5" r=".8" fill="currentColor"/><circle cx="18" cy="12" r=".8" fill="currentColor"/><circle cx="15.5" cy="13.5" r=".8" fill="currentColor"/><circle cx="13" cy="12" r=".8" fill="currentColor"/></svg>',
  journal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M4 7h16M8 3v18"/><line x1="12" y1="11" x2="16" y2="11"/><line x1="12" y1="15" x2="16" y2="15"/></svg>',
};

/* Official Ionity & MojaMind color palette */
const SHOUT_COLORS = ['#3366FF', '#00d2ff', '#ffd166', '#8a2eae', '#34c759'];

/* Official MojaMind brand emblem — High Definition Vector SVG (0 raster cutoffs) */
function flowerSVG(size = 34, opts = {}) {
  const id = opts.id || ('mm-flw-' + Math.random().toString(36).slice(2, 7));
  const dropGlow = opts.noShadow ? '' : 'filter:drop-shadow(0 4px 14px rgba(51,102,255,0.45));';
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" class="brand-flower-img ${opts.className || ''}" style="width:${size}px;height:${size}px;display:inline-block;vertical-align:middle;${dropGlow}overflow:visible;flex-shrink:0" aria-label="MojaMind Emblem">
    <defs>
      <linearGradient id="${id}-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF453A"/><stop offset="100%" stop-color="#D70015"/></linearGradient>
      <linearGradient id="${id}-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#30D158"/><stop offset="100%" stop-color="#1B8738"/></linearGradient>
      <linearGradient id="${id}-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00D2FF"/><stop offset="100%" stop-color="#007AFF"/></linearGradient>
      <linearGradient id="${id}-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3366FF"/><stop offset="100%" stop-color="#1D4ED8"/></linearGradient>
      <linearGradient id="${id}-p" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#BF5AF2"/><stop offset="100%" stop-color="#7B21A8"/></linearGradient>
      <linearGradient id="${id}-o" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFB340"/><stop offset="100%" stop-color="#FF5E3A"/></linearGradient>
      <radialGradient id="${id}-core" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="25%" stop-color="#FFE066"/><stop offset="70%" stop-color="#FFB703"/><stop offset="100%" stop-color="#FB8500"/></radialGradient>
    </defs>
    <g transform="rotate(0 50 50)">
      <path d="M 50 6 C 61 6, 65 24, 58 39 C 54 45, 46 45, 42 39 C 35 24, 39 6, 50 6 Z" fill="url(#${id}-r)"/>
      <path d="M 50 11 C 56 11, 59 23, 55 33 C 52 37, 48 37, 45 33 C 41 23, 44 11, 50 11 Z" fill="rgba(255,255,255,0.28)"/>
    </g>
    <g transform="rotate(60 50 50)">
      <path d="M 50 6 C 61 6, 65 24, 58 39 C 54 45, 46 45, 42 39 C 35 24, 39 6, 50 6 Z" fill="url(#${id}-g)"/>
      <path d="M 50 11 C 56 11, 59 23, 55 33 C 52 37, 48 37, 45 33 C 41 23, 44 11, 50 11 Z" fill="rgba(255,255,255,0.28)"/>
    </g>
    <g transform="rotate(120 50 50)">
      <path d="M 50 6 C 61 6, 65 24, 58 39 C 54 45, 46 45, 42 39 C 35 24, 39 6, 50 6 Z" fill="url(#${id}-c)"/>
      <path d="M 50 11 C 56 11, 59 23, 55 33 C 52 37, 48 37, 45 33 C 41 23, 44 11, 50 11 Z" fill="rgba(255,255,255,0.28)"/>
    </g>
    <g transform="rotate(180 50 50)">
      <path d="M 50 6 C 61 6, 65 24, 58 39 C 54 45, 46 45, 42 39 C 35 24, 39 6, 50 6 Z" fill="url(#${id}-b)"/>
      <path d="M 50 11 C 56 11, 59 23, 55 33 C 52 37, 48 37, 45 33 C 41 23, 44 11, 50 11 Z" fill="rgba(255,255,255,0.28)"/>
    </g>
    <g transform="rotate(240 50 50)">
      <path d="M 50 6 C 61 6, 65 24, 58 39 C 54 45, 46 45, 42 39 C 35 24, 39 6, 50 6 Z" fill="url(#${id}-p)"/>
      <path d="M 50 11 C 56 11, 59 23, 55 33 C 52 37, 48 37, 45 33 C 41 23, 44 11, 50 11 Z" fill="rgba(255,255,255,0.28)"/>
    </g>
    <g transform="rotate(300 50 50)">
      <path d="M 50 6 C 61 6, 65 24, 58 39 C 54 45, 46 45, 42 39 C 35 24, 39 6, 50 6 Z" fill="url(#${id}-o)"/>
      <path d="M 50 11 C 56 11, 59 23, 55 33 C 52 37, 48 37, 45 33 C 41 23, 44 11, 50 11 Z" fill="rgba(255,255,255,0.28)"/>
    </g>
    <!-- Center Core Outer Shade -->
    <circle cx="50" cy="50" r="16.5" fill="rgba(42,10,68,0.55)"/>
    <!-- Center Glowing Amber Bead -->
    <circle cx="50" cy="50" r="14.5" fill="url(#${id}-core)"/>
    <!-- Specular Gloss Highlight -->
    <ellipse cx="45.5" cy="44.5" rx="4.8" ry="3.2" transform="rotate(-30 45.5 44.5)" fill="rgba(255,255,255,0.92)"/>
  </svg>`;
}

/* Official MojaMind logo mark — Smooth transparent brand lockup */
function knotSVG(size = 130) {
  return `<img src="./assets/branding/mojomind-logo.png?v=3.4.0" alt="MojaMind" class="auth-logo mm-brand-logo" style="width:${size}px;height:auto;max-width:100%;object-fit:contain;filter:drop-shadow(0 10px 28px rgba(51,102,255,0.5));display:inline-block;background:transparent;border:none;box-shadow:none" />`;
}

function mojoLogoHTML(size = 140, extraClass = '') {
  return `<img src="./assets/branding/mojomind-logo.png?v=3.4.0" alt="MojaMind" class="auth-logo mm-brand-logo ${extraClass}" style="width:${size}px;height:auto;max-width:100%;object-fit:contain;filter:drop-shadow(0 10px 28px rgba(51,102,255,0.5));display:inline-block;background:transparent;border:none;box-shadow:none" />`;
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

/* Official MojaMind Animated Talking Flower Mascot (Item 10) */
function talkingFlowerSVG(size = 56, isTalking = true) {
  return `<div class="talking-flower-mascot ${isTalking ? 'is-talking' : ''}" style="width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;position:relative;vertical-align:middle">
    <svg viewBox="0 0 100 100" width="${size}" height="${size}" style="width:100%;height:100%;filter:drop-shadow(0 4px 14px rgba(51,102,255,0.4))">
      <!-- Blooming Petals with Organic Sway -->
      <g class="tf-petals" style="transform-origin:50px 50px">
        <ellipse cx="50" cy="20" rx="11" ry="18" fill="#00c9a7" />
        <ellipse cx="76" cy="35" rx="18" ry="11" fill="#f59e0b" />
        <ellipse cx="76" cy="65" rx="18" ry="11" fill="#ef4444" />
        <ellipse cx="50" cy="80" rx="11" ry="18" fill="#3366FF" />
        <ellipse cx="24" cy="65" rx="18" ry="11" fill="#10b981" />
        <ellipse cx="24" cy="35" rx="18" ry="11" fill="#f97316" />
      </g>
      <!-- Central Glowing Face Core -->
      <circle cx="50" cy="50" r="21" fill="url(#tf-core-grad)" stroke="#ffd700" stroke-width="2.2" />
      <!-- Radiant Eyes -->
      <circle cx="42" cy="45" r="3.2" fill="#1a0b2e" />
      <circle cx="58" cy="45" r="3.2" fill="#1a0b2e" />
      <circle cx="43.5" cy="43.5" r="1.2" fill="#ffffff" />
      <circle cx="59.5" cy="43.5" r="1.2" fill="#ffffff" />
      <!-- Talking Mouth with Speech Waves -->
      <path class="tf-mouth" d="M43 54 Q50 61 57 54" fill="none" stroke="#991b1b" stroke-width="2.6" stroke-linecap="round" />
      <defs>
        <radialGradient id="tf-core-grad" cx="40%" cy="35%">
          <stop offset="0%" stop-color="#fff8db" />
          <stop offset="60%" stop-color="#ffd166" />
          <stop offset="100%" stop-color="#f59e0b" />
        </radialGradient>
      </defs>
    </svg>
    ${isTalking ? '<span class="tf-pulse-ring"></span>' : ''}
  </div>`;
}

function showAiGuidanceModal(title, message, nextActionRoute = null, btnText = 'Take Me There ✨') {
  const m = modal(`
    <div style="text-align:center;padding:10px 4px">
      <div style="margin-bottom:12px">${talkingFlowerSVG(72, true)}</div>
      <span class="spark-badge" style="margin-bottom:8px">🌸 MOJA GUIDE ADVISORY</span>
      <h3 style="font-size:18px;font-weight:800;color:#ffffff;margin:6px 0">${esc(title)}</h3>
      <p style="font-size:13.5px;line-height:1.65;color:rgba(255,255,255,0.9);margin:0 0 16px">${esc(message)}</p>
      <div class="modal-btns">
        ${nextActionRoute ? `<button class="btn btn-primary" id="ai-guide-next">${esc(btnText)}</button>` : ''}
        <button class="btn btn-ghost" onclick="closeModal()">Got it 🌸</button>
      </div>
    </div>
  `);
  if (nextActionRoute) {
    m.querySelector('#ai-guide-next').onclick = () => {
      closeModal();
      nav(nextActionRoute);
    };
  }
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
  game: { blooms: 0, serenity: 0, sound: false, flowers: [], totalPlayMs: 0, wormsHydrated: 0, antsHydrated: 0, megaBlooms: 0, rainStars: 0 }, // Moja Meadow
  game3d: { highScore: 0, pollen: 0, sunrays: 0, sound: false, bestDistance: 0, crashes: 0, totalFlights: 0 }, // Moja Bee 3D
  gameBubble: { highScore: 0, bubblesPopped: 0, combos: 0, totalGames: 0, sound: false }, // Moja Pop Bubble Odyssey
  gameMerge: { highScore: 0, totalMerges: 0, maxTier: 0, sound: false }, // Moja Merge
  soundscape: { on: false },
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
  if (!s.ai) s.ai = { transformer: false, model: 'distilbert', voiceNav: false, predictive: true, vision: true, voice: { persona: 'warmth', speed: 0.95, pitch: 0.99, whisperModel: 'tiny', chime: false } };
  if (!s.usage) s.usage = { routes: {}, transitions: {}, hours: {}, recent: [] };
  if (!s.groupChanges) s.groupChanges = [];
  if (!s.chat) s.chat = { group: {}, individual: {} };
  if (!s.game) s.game = { blooms: 0, serenity: 0, sound: false, flowers: [], totalPlayMs: 0, wormsHydrated: 0, antsHydrated: 0, megaBlooms: 0, rainStars: 0 };
  if (s.game.totalPlayMs == null) s.game.totalPlayMs = 0;
  if (!s.game3d) s.game3d = { highScore: 0, pollen: 0, sunrays: 0, sound: false, bestDistance: 0, crashes: 0, totalFlights: 0 };
  if (!s.gameBubble) s.gameBubble = { highScore: 0, bubblesPopped: 0, combos: 0, totalGames: 0, sound: false };
  if (!s.gameMerge) s.gameMerge = { highScore: 0, totalMerges: 0, maxTier: 0, sound: false };
  if (!s.soundscape) s.soundscape = { on: false };
  if (!s.journal) s.journal = [];
  // Normalise every activity record so partial/legacy entries can never
  // crash array access (uploads/voice/reflections). Fixes "activity crashed".
  if (s.activities && typeof s.activities === 'object') {
    for (const k of Object.keys(s.activities)) {
      const a = s.activities[k]; if (!a || typeof a !== 'object') continue;
      if (!Array.isArray(a.uploads)) a.uploads = [];
      if (!Array.isArray(a.voice)) a.voice = [];
      if (!a.reflections || typeof a.reflections !== 'object') a.reflections = {};
    }
  }
  globalThis.S = s;
  return s;
}

function save() {
  globalThis.S = S;
  try {
    Vault.write(S);
  } catch (e) {
    // Storage full (large artwork / photos). Warn the participant so
    // work is never silently lost — they can download art to device.
    const quota = e && (e.name === 'QuotaExceededError' || /quota/i.test(e.message || ''));
    try { toast(quota ? 'Device storage is full — use ⬇️ Save to Device to keep your artwork 📥' : 'Could not save — please try again', 4200); } catch (_) {}
    console.warn('[MojaMind] save failed:', e);
  }
}

/* Derived flags */
const groupOf  = () => MM.GROUPS[S.group] || MM.GROUPS[3];
const hasArt   = () => !!groupOf().art;
const hasChat  = () => !!groupOf().chat;
const preDone  = () => MM.PRE_SURVEYS.every(id => S.surveys.pre[id]?.completedAt);
const postDone = () => MM.POST_SURVEYS.every(id => S.surveys.post[id]?.completedAt);
const artOpen  = () => hasArt() && preDone();
const chatOpen = () => (hasChat() && preDone()) || S.adminMode;
const actState = id => S.activities[id] || null;
const actsDone = () => MM.ACTIVITIES.filter(a => actState(a.id)?.submittedAt).length;
const allActsDone = () => actsDone() === MM.ACTIVITIES.length;
/* Sequential gating — an activity stays locked until the previous one
   is submitted (Week 1 → 2 → 3 …). The first activity is always open. */
const actLocked = a => {
  const idx = MM.ACTIVITIES.findIndex(x => x.id === a.id);
  if (idx <= 0) return false;
  return !actState(MM.ACTIVITIES[idx - 1].id)?.submittedAt;
};
/* Post-survey opens only once pre-surveys AND (for art groups) all
   art activities are complete. Group 1 has no art, so pre-done unlocks. */
const postOpen = () => preDone() && (!hasArt() || allActsDone()) || S.adminMode;

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

/* ── Low-power detection ─────────────────────────────────────
   Most participants are on inexpensive, low-RAM Android phones on
   slow/limited data. Auto-detect that and switch on a lightweight
   render path: no tap-aura particles, minimal confetti, no ambient
   petals, and CSS that drops the expensive backdrop-blur/heavy
   shadows (the biggest GPU cost on budget devices). Also honoured
   when the user turns on Reduce Motion. */
const LOW_POWER = (() => {
  try {
    const c = navigator.connection || {};
    const mem = navigator.deviceMemory;            // GB (Chrome/Android)
    const cores = navigator.hardwareConcurrency;   // logical cores
    return (typeof mem === 'number' && mem <= 4)
      || (typeof cores === 'number' && cores <= 4)
      || !!c.saveData
      || /(^|\b)(2g|slow-2g|3g)\b/.test(c.effectiveType || '')
      || matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch { return false; }
})();
globalThis.MM_LOWPOWER = LOW_POWER;
try { if (LOW_POWER && document.body) document.body.classList.add('low-power'); } catch (_) {}

/* ── Accessibility engine ────────────────────────────────── */
function applyA11y() {
  const a = S.a11y || {};
  const phone = $('#phone');
  if (phone) phone.style.zoom = a.textScale && a.textScale !== 1 ? a.textScale : '';
  document.body.classList.toggle('hc', !!a.highContrast);
  document.body.classList.toggle('rm', !!a.reduceMotion);
  // low-power is auto OR forced by the Reduce Motion switch
  document.body.classList.toggle('low-power', LOW_POWER || !!a.reduceMotion);
}
function motionReduced() {
  return LOW_POWER || S.a11y?.reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
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

/* Jump Forth — intelligent burst on tap with frame throttle */
let _lastBurstTime = 0;
addEventListener('pointerdown', e => {
  if (!e.isPrimary) return;
  const now = performance.now();
  if (now - _lastBurstTime < 240) return; // Prevent excessive canvas particle stacking on rapid taps
  _lastBurstTime = now;
  FX.burst(e.clientX, e.clientY);
}, { passive: true });

/* Ambient floating petals — deferred for zero-lag initial paint */
function initAmbientStars() {
  if (motionReduced()) return; // skip ambient petals on low-power / reduced-motion
  const wrap = $('#stars');
  if (!wrap || wrap.children.length > 0) return;
  const count = LOW_POWER ? 0 : 12;
  for (let k = 0; k < count; k++) {
    const i = document.createElement('i');
    const sz = 6 + Math.random() * 14;
    i.style.cssText = `left:${Math.random() * 100}vw;top:${60 + Math.random() * 40}vh;width:${sz}px;height:${sz}px;animation-duration:${16 + Math.random() * 20}s;animation-delay:${-Math.random() * 30}s;`;
    wrap.appendChild(i);
  }
}
if (typeof requestIdleCallback !== 'undefined') {
  requestIdleCallback(initAmbientStars, { timeout: 1200 });
} else {
  setTimeout(initAmbientStars, 250);
}

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
              <img src="./assets/partners/stellenbosch-transparent.svg?v=3.4.0" alt="Stellenbosch University" class="su-trans-logo" />
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
        <p class="splash-foot">Offline Design · <a href="https://www.ionity.co.za" target="_blank" rel="noopener">IONITY GLOBAL</a> · <a href="https://www.ionity.co.za" target="_blank" rel="noopener">www.ionity.co.za</a></p>
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

/* ── Dynamic On-Demand Subsystem Module Loader ───────────── */
const _loadedModules = new Set();
const _loadingPromises = new Map();
async function ensureModule(name, src) {
  if (_loadedModules.has(name) || (typeof window[name] !== 'undefined' && !window[name].__isProxy)) {
    _loadedModules.add(name);
    return true;
  }
  if (_loadingPromises.has(name)) {
    return _loadingPromises.get(name);
  }
  const p = new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => {
      _loadedModules.add(name);
      _loadingPromises.delete(name);
      resolve(true);
    };
    s.onerror = (err) => {
      console.warn('Dynamic module load fallback:', src, err);
      _loadingPromises.delete(name);
      resolve(false);
    };
    document.head.appendChild(s);
  });
  _loadingPromises.set(name, p);
  return p;
}

/* ── Stop inactive background animation loops & engines ──── */
function teardownActiveEngines() {
  try { if (typeof MMGame3D !== 'undefined' && MMGame3D.stop) MMGame3D.stop(); } catch {}
  try { if (typeof MMGame !== 'undefined' && MMGame.stop) MMGame.stop(); } catch {}
  try { if (typeof MMBubble !== 'undefined' && MMBubble.stop) MMBubble.stop(); } catch {}
  try { if (typeof MMPixelThoughts !== 'undefined' && MMPixelThoughts.stop) MMPixelThoughts.stop(); } catch {}
  try { if (typeof MMVideo !== 'undefined' && MMVideo.stop) MMVideo.stop(); } catch {}
}

/* ── Lazy Module Proxy Bridges ───────────────────────────── */
if (typeof window.MMVideo === 'undefined' || window.MMVideo.__isProxy) {
  window.MMVideo = {
    __isProxy: true,
    playVideoModal: async (key, opts = {}) => {
      try {
        const ok = await ensureModule('MMVideo', './js/video.js?v=3.4.0');
        if (ok && typeof window.MMVideo !== 'undefined' && !window.MMVideo.__isProxy && window.MMVideo.playVideoModal) {
          window.MMVideo.playVideoModal(key, opts);
        } else {
          console.warn('[MojaMind] MMVideo module could not be initialized');
        }
      } catch (e) {
        console.warn('[MojaMind] video failed to open:', e);
        try { toast('The guide video could not open — you can start the activity directly 💜'); } catch (_) {}
      }
    },
    stop: () => {}
  };
}
if (typeof window.MMSoundscape === 'undefined' || window.MMSoundscape.__isProxy) {
  window.MMSoundscape = {
    __isProxy: true,
    toggle: async () => {
      await ensureModule('MMSoundscape', './js/soundscape.js?v=2.8.2');
      if (typeof window.MMSoundscape !== 'undefined' && !window.MMSoundscape.__isProxy && window.MMSoundscape.toggle) {
        window.MMSoundscape.toggle();
      }
    },
    isPlaying: () => false,
    stop: () => {}
  };
}
if (typeof window.MMPortfolio === 'undefined' || window.MMPortfolio.__isProxy) {
  window.MMPortfolio = {
    __isProxy: true,
    showPortfolioModal: async () => {
      await ensureModule('MMPortfolio', './js/portfolio.js?v=2.8.2');
      if (typeof window.MMPortfolio !== 'undefined' && !window.MMPortfolio.__isProxy && window.MMPortfolio.showPortfolioModal) {
        window.MMPortfolio.showPortfolioModal();
      }
    }
  };
}

/* ── Router ──────────────────────────────────────────────── */
const routes = {};
let lastPath = '';
function nav(hash) { location.hash = hash; }
function back(fallback = '#/home') {
  if (history.length > 1) history.back(); else nav(fallback);
}
function route() {
  teardownActiveEngines(); // Clean up memory and cancel active RAFs
  const raw = location.hash.replace(/^#\/?/, '') || '';
  const parts = raw.split('/').filter(Boolean);
  const name = parts[0] || 'home';

  stopVoiceCapture(); // never leave the mic running across screens
  stopReflectionDictation();
  if (Vault.isLocked()) return lockScreen();

  // Guards — the Aug 2026 onboarding pathing:
  // Sign In → Terms (Accept) → Welcome → Demographic Survey → Home
  if (!S.auth && name !== 'signin') return nav('#/signin');
  if (S.auth && !S.consented && !['terms', 'signin'].includes(name)) return nav('#/terms');
  if (S.auth && S.consented && !S.onboarded && !['welcome', 'help', 'terms', 'signin'].includes(name)) return nav('#/welcome');
  if (S.auth && S.consented && S.onboarded && !S.demographics && !['demographics', 'help', 'welcome', 'terms', 'signin'].includes(name)) return nav('#/demographics');

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
      ? `<button class="brand-flower-btn" data-act="flower-care" aria-label="Open Ithemba Care Sanctuary" title="Ithemba Hope & Grounding Sanctuary" style="background:transparent;border:0;padding:0;cursor:pointer;display:grid;place-items:center">${flowerSVG(34)}</button>`
      : `<button class="back" data-act="back" data-to="${backTo || ''}" aria-label="Back">${I.back}</button>`}
    <h1>${esc(title)}</h1>
    <button class="hdr-sound ${MMSoundscape.isPlaying() ? 'on' : ''}" data-act="soundscape" aria-label="Ambient 432Hz Soundscapes" title="Ambient 432Hz Soundscapes">🎧</button>
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
const NAVLESS = ['signin', 'terms', 'welcome', 'demographics'];
function updateTabbar(name) {
  const bar = $('#tabbar');
  const vSidebar = $('#vertical-sidebar');

  if (vSidebar) {
    if (NAVLESS.includes(name) || !S.auth || !S.onboarded) {
      vSidebar.classList.add('hidden');
    } else {
      vSidebar.classList.remove('hidden');
      const soundDot = $('#vs-sound-dot');
      if (soundDot) soundDot.classList.toggle('on', typeof MMSoundscape !== 'undefined' && MMSoundscape.isPlaying());
      const voiceDot = $('#vs-voice-dot');
      if (voiceDot) voiceDot.classList.toggle('on', typeof MMVoice !== 'undefined' && MMVoice.isOn());
    }
  }

  if (NAVLESS.includes(name) || name === 'survey' || name === 'help') {
    if (bar) { bar.classList.add('hidden'); app.classList.add('no-nav'); }
    if (NAVLESS.includes(name)) return;
  }
  app.classList.remove('no-nav');
  if (bar) bar.classList.remove('hidden');
  const activeMap = { pre: 'home', post: 'home', instructions: 'home', spark: 'home', journey: 'home', writer: 'journal', game: 'games', game3d: 'games', gamebubble: 'games' };
  const active = activeMap[name] || name;
  const tabs = buildTabs();
  if (bar) {
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
  if (act === 'soundscape') MMSoundscape.showModal();
  if (act === 'flower-care') beaconOfHopeModal();
});

/* Unified Vertical Right-Side Sidebar Actions */
document.addEventListener('click', e => {
  const vsToggle = e.target.closest('#vs-toggle');
  if (vsToggle) {
    e.preventDefault();
    $('#vertical-sidebar')?.classList.toggle('collapsed');
    return;
  }
  const vsBtn = e.target.closest('[data-vs]');
  if (!vsBtn) return;
  e.preventDefault();
  const act = vsBtn.dataset.vs;
  if (act === 'soundscape') {
    if (typeof MMSoundscape !== 'undefined' && MMSoundscape.showModal) MMSoundscape.showModal();
  } else if (act === 'voice') {
    if (typeof toggleVoiceNav === 'function') toggleVoiceNav();
    else if (typeof voiceHelpModal === 'function') voiceHelpModal();
  } else if (act === 'a11y') {
    if (typeof a11yModal === 'function') a11yModal();
  } else if (act === 'care') {
    if (typeof beaconOfHopeModal === 'function') beaconOfHopeModal();
  } else if (act === 'help') {
    nav('#/help');
  } else if (act === 'spark') {
    nav('#/spark');
  } else if (act === 'pixelthoughts') {
    nav('#/pixelthoughts');
  }
  const sDot = $('#vs-sound-dot');
  if (sDot) sDot.classList.toggle('on', typeof MMSoundscape !== 'undefined' && MMSoundscape.isPlaying());
  const vDot = $('#vs-voice-dot');
  if (vDot) vDot.classList.toggle('on', typeof MMVoice !== 'undefined' && MMVoice.isOn());
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
    <div class="beacon-modal" style="text-align:center;padding:4px 0 2px">
      <div class="beacon-icon" style="width:48px;height:48px;margin:0 auto 8px;font-size:24px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#ffd166,#f3256b 60%,#8a2eae);box-shadow:0 6px 20px rgba(243,37,107,0.4)">
        ☀️
      </div>
      <h3 class="beacon-title" style="font-size:20px;font-weight:800;margin:0 0 2px;color:#ffffff">Beacon of Hope</h3>
      <p class="beacon-sub" style="font-size:12px;font-weight:600;color:#ffd166;letter-spacing:0.3px;margin:0 0 12px">Ithemba · Words of Strength</p>

      <!-- Main Affirmation Card View -->
      <div id="bh-view-card">
        <div class="beacon-card" id="beacon-card" style="background:rgba(255,255,255,0.07);backdrop-filter:blur(20px);border:1.5px solid rgba(255,209,102,0.3);border-radius:18px;padding:18px 16px;margin-bottom:12px;text-align:left;box-shadow:0 8px 24px rgba(0,0,0,0.4);min-height:115px">
          <h4 id="bh-title" style="font-size:15px;font-weight:700;color:#ffd166;margin:0 0 6px">${esc(affs[0].title)}</h4>
          <p id="bh-text" style="font-size:14px;line-height:1.6;color:rgba(255,255,255,0.95);margin:0 0 10px">${esc(affs[0].text)}</p>
          <div class="bh-sa" id="bh-sa" style="font-size:12px;color:#6ec1ff;background:rgba(0,0,0,0.35);padding:6px 10px;border-radius:8px;display:inline-block">🌿 <i>${esc(affs[0].sa)}</i></div>
        </div>

        <div class="beacon-nav" style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:14px">
          <button class="beacon-prev" id="bh-prev" aria-label="Previous affirmation" style="width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.1);color:#fff;font-size:16px;cursor:pointer">‹</button>
          <span style="font-size:12.5px;color:rgba(255,255,255,0.85);font-weight:700;letter-spacing:0.5px" id="bh-counter">1 of ${affs.length}</span>
          <button class="beacon-next" id="bh-next" aria-label="Next affirmation" style="width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.1);color:#fff;font-size:16px;cursor:pointer">›</button>
        </div>

        <div class="beacon-acts-row" style="display:flex;gap:10px;margin-bottom:8px">
          <button class="btn btn-primary" id="bh-read" style="flex:1">🔊 Read Aloud</button>
          <button class="btn btn-secondary" id="bh-plant-open" style="flex:1">🌱 Plant a Seed</button>
        </div>
      </div>

      <!-- Plant a Seed Form View (Clean & dedicated) -->
      <div id="bh-view-plant" style="display:none;flex-direction:column;gap:10px;text-align:left;background:rgba(255,255,255,0.07);backdrop-filter:blur(20px);border:1.5px solid #ffd166;border-radius:18px;padding:16px;margin-bottom:12px">
        <b style="font-size:13.5px;color:#ffd166">🌱 Plant an Anonymous Seed of Hope:</b>
        <textarea id="bh-seed-input" rows="3" placeholder="Write a gentle message of strength, courage or care for a peer…" style="width:100%;border-radius:10px;padding:10px;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.2);color:#fff;font-size:13px;box-sizing:border-box;resize:none;font-family:inherit"></textarea>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button class="btn btn-ghost btn-sm" id="bh-seed-cancel">Cancel</button>
          <button class="btn btn-primary btn-sm" id="bh-seed-submit" style="background:linear-gradient(135deg,#ffd166,#f3256b);color:#fff;font-weight:800">🌟 Plant Star</button>
        </div>
      </div>

      <button class="btn btn-ghost btn-block" id="bh-close" style="font-size:13px;color:rgba(255,255,255,0.7);padding:8px">Close</button>
    </div>
  `);

  function update() {
    const cur = affs[curIndex];
    m.querySelector('#bh-title').textContent = cur.title;
    m.querySelector('#bh-text').textContent = cur.text;
    m.querySelector('#bh-sa').innerHTML = `🌿 <i>${esc(cur.sa)}</i>`;
    m.querySelector('#bh-counter').textContent = `${curIndex + 1} of ${affs.length}`;
  }

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

  const cardView = m.querySelector('#bh-view-card');
  const plantView = m.querySelector('#bh-view-plant');

  m.querySelector('#bh-plant-open').onclick = () => {
    cardView.style.display = 'none';
    plantView.style.display = 'flex';
    m.querySelector('#bh-seed-input')?.focus();
  };
  m.querySelector('#bh-seed-cancel').onclick = () => {
    plantView.style.display = 'none';
    cardView.style.display = 'block';
  };
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
  try { window.MMSync?.record('risk', { phase, total: screen.total, q9: screen.q9, ticketRef: ticket.ref }); } catch (_) {}
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
        </div>
      </div>
      <h1 class="auth-title">Mobile Number Sign In</h1>
      <div class="field">${I.phone}<input id="f-phone" type="text" placeholder="Mobile Number (Test ID: 007)" autocomplete="username" /></div>
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
      <div class="auth-footer-wrap">
        <p class="auth-partners-line">
          ${MM.APP_NAME} · Creative Resilience Intervention<br/>
          ${esc(MM.PARTNERS.line)}
        </p>
        <p class="auth-ionity-line">
          <img src="./assets/branding/ionity-global-white.png" alt="IONITY GLOBAL" class="auth-io-mini" />
          Offline Design · <a href="https://www.ionity.co.za" target="_blank" rel="noopener">IONITY GLOBAL</a> · <a class="io-url" href="https://www.ionity.co.za" target="_blank" rel="noopener">www.ionity.co.za</a>
        </p>
      </div>
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
      Authorized Test Access: Number: <b>007</b> · Password: <b>password</b><br/>For live study access, contact your study facilitator.</p>
    <div class="modal-btns"><button class="btn btn-primary" onclick="closeModal()">Got it</button></div>
  `);
  $('#f-login').onclick = () => {
    const phone = $('#f-phone').value.trim();
    const pass = $('#f-pass').value.trim();
    if (!phone) { toast('Please enter mobile number or Test ID: 007'); $('#f-phone').focus(); return; }
    if (!pass) { toast('Please enter your password'); $('#f-pass').focus(); return; }

    // Strict authorized test account enforcement: 007 / password
    const isAuthorized = (phone === '007' && pass === 'password') || (phone === 'admin' && pass === 'MOJA2026') || (pass === 'MOJA2026');
    if (!isAuthorized) {
      toast('🔒 Authorized Test Access Only — Number: 007 · Password: password');
      $('#f-phone').focus();
      return;
    }
    if (!group) { toast('Select your study group — your facilitator gave you this'); return; }
    S.auth = { phone, remember: $('#f-rem').checked, signedInAt: Date.now() };
    S.group = group;
    if (!S.startedAt) S.startedAt = Date.now();
    save();
    try { window.MMSync?.record('login', { phone, group, at: Date.now() }); } catch (_) {}
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
  $('#t-yes').onclick = () => { S.consented = true; save(); nav('#/welcome'); };
};

/* ── Welcome (after Terms — "Welcome to Creative Resilience") ── */
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
  $('#w-next').onclick = () => { S.onboarded = true; save(); nav('#/demographics'); };
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

/* ── Demographics (after the welcome screen, before Home) ─── */
routes.demographics = () => {
  render(`
    ${header('Demographic Questions')}
    ${runnerHTML(MM.DEMOGRAPHICS, S.drafts.demographics, { pageLabel: 'Page 1/1' })}
  `, { theme: 'theme-demo' });
  wireRunner(MM.DEMOGRAPHICS, 'demographics', answers => {
    S.demographics = { answers, completedAt: Date.now() };
    save(); confetti();
    try { window.MMSync?.record('demographics', { answers }); } catch (_) {}
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
  if (postOpen() && !postDone()) {
    const nid = MM.POST_SURVEYS.find(id => !S.surveys.post[id]?.completedAt);
    return { icon: '🏁', label: `Complete the ${MM.SURVEYS[nid].name}`, route: '#/post', why: 'The final check-in of your 8-week journey.' };
  }
  if (hasArt() && preDone() && !allActsDone()) {
    return { icon: '🎨', label: 'Finish your art activities', route: '#/art', why: 'Complete all 8 activities to unlock your Post-Survey.' };
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
          <button class="chip chip-cta chip-spark" id="go-spark" onclick="nav('#/spark')">${I.sparkle}<span>Daily Spark${(S.sparks || []).some(s => s.day === dayKey()) ? ' ✨' : ''}</span></button>
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

      <button class="next-step" id="next-step" aria-label="Suggested next step">
        <span class="ns-emoji" style="display:inline-flex;align-items:center">${talkingFlowerSVG(40, true)}</span>
        <span class="grow">
          <small>🌸 Moja Guide suggests</small>
          <b>${esc(step.label)}</b>
          <em>${esc(step.why)}</em>
        </span>
        <span class="ns-go">›</span>
      </button>

      <!-- Jump Back In Quick Predictions (High Priority) -->
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

      <div class="tile-grid">
        ${tile(I.info, 'Instructions', '#/instructions')}
        ${tile(I.headset, 'Support Services', '#/support')}
        ${tile(I.doc, 'Pre-Survey', '#/pre', { badge: preDone() ? '✓' : `${preCount}/3`, badgeDone: preDone() })}
        ${hasArt() ? tile(I.palette, 'Art Activities', '#/art', { locked: !artOpen(), badge: artOpen() && actsDone() ? `${actsDone()}/8` : null }) : ''}
        ${hasChat() ? tile(I.chat, 'Chat', '#/chat', { locked: !chatOpen() }) : ''}
        ${tile(I.clipboardCheck, 'Post-Survey', '#/post', { locked: !postOpen(), badge: postOpen() ? (postDone() ? '✓' : `${postCount}/4`) : null, badgeDone: postDone() })}
        ${tile(I.gamepad, 'Games Hub', '#/games', { badge: '4 Games 🎮' })}
        ${tile(I.journal, 'Writer & Journal', '#/journal', { badge: S.journal?.length ? `${S.journal.length}` : 'New' })}
      </div>

      <div class="garden-wrap">
        <div class="garden-title">Your mood garden</div>
        <div class="garden-subtitle">${S.moods.length ? `${S.moods.length + 1} flowers growing with you` : 'Your first flower is already here — check in to help it grow'}</div>
        ${gardenSVG()}
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
  const todaySpark = S.sparks.find(s => s.day === dayKey());
  let currentSpark = todaySpark || pickSpark();
  const stars = S.sparks.slice(-56);
  const constellation = stars.map((s, i) => {
    const x = 20 + ((i * 37) % 280), y = 14 + ((i * 53) % 60);
    const r = 1.4 + ((i * 7) % 3) * .8;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffd166" opacity="${.45 + ((i * 13) % 5) * .12}">
      <animate attributeName="opacity" values="${.4 + ((i * 13) % 5) * .1};1;${.4 + ((i * 13) % 5) * .1}" dur="${2.2 + (i % 5) * .8}s" repeatCount="indefinite"/>
    </circle>`;
  }).join('');

  render(`
    ${header('Daily Spark ✨', { backTo: '#/home' })}
    <div class="body-pad spark-wrap">
      <svg class="spark-sky" viewBox="0 0 320 80" aria-hidden="true">${constellation}
        ${stars.length ? '' : '<text x="160" y="46" text-anchor="middle" fill="rgba(255,255,255,.45)" font-size="9.5" font-family="Poppins">your collected sparks will shine here</text>'}
      </svg>
      <div class="spark-stage ${todaySpark ? 'lit' : ''}" id="spark-stage">
        <div class="spark-halo" id="spark-halo"></div>
        <button class="spark-orb" id="spark-orb" aria-label="Tap or hold to ignite your spark">
          ${flowerSVG(70, { petal: '#fff' })}
        </button>
      </div>
      <div class="spark-bottom-wording">
        <div class="spark-hint" id="spark-hint">${todaySpark ? 'Spark is glowing ✨ Tap orb to draw another affirmation' : 'Tap or press &amp; hold the orb.<br/>Breathe in while it charges…'}</div>
        <p class="spark-count">${S.sparks.length ? `⭐ ${S.sparks.length} spark${S.sparks.length > 1 ? 's' : ''} collected on your journey` : 'Collect a spark every day — build your constellation'}</p>
      </div>
      <div class="spark-card ${todaySpark ? '' : 'hidden'}" id="spark-card">
        <div class="spark-q" id="spark-q">“${esc(currentSpark.text)}”</div>
        <div class="spark-by" id="spark-by">— ${esc(currentSpark.by)}</div>
        <div class="spark-you" id="spark-you">${esc(currentSpark.you || '')}</div>
        <div class="modal-btns" style="display:flex;flex-direction:column;gap:8px;margin-top:16px">
          <div style="display:flex;gap:8px">
            <button class="btn btn-secondary" id="spark-reignite" style="flex:1">💫 New Spark</button>
            <button class="btn btn-secondary" id="spark-beacon" style="flex:1">🌟 Beacon of Hope</button>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost" id="spark-share" style="flex:1">Share 📤</button>
            <button class="btn btn-primary" id="spark-home" style="flex:1">Carry with me ✨</button>
          </div>
        </div>
      </div>
    </div>
  `, { theme: 'theme-spark' });

  const orb = $('#spark-orb'), halo = $('#spark-halo'), hint = $('#spark-hint'), stage = $('#spark-stage');
  const cardEl = $('#spark-card');

  let isCharging = false;

  function playSparkChime() {
    try {
      const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AC) return;
      const a = new AC();
      const notes = [432, 540, 648, 864];
      notes.forEach((freq, idx) => {
        const osc = a.createOscillator();
        const g = a.createGain();
        const lp = a.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 2000;
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.001, a.currentTime + idx * 0.08);
        g.gain.linearRampToValueAtTime(0.035, a.currentTime + idx * 0.08 + 0.1);
        g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + idx * 0.08 + 0.6);
        osc.connect(lp);
        lp.connect(g);
        g.connect(a.destination);
        osc.start(a.currentTime + idx * 0.08);
        osc.stop(a.currentTime + idx * 0.08 + 0.65);
      });
    } catch { /* audio safeguard */ }
  }

  function igniteSpark(fresh = false) {
    if (fresh || !todaySpark) {
      currentSpark = pickSpark();
      const you = personalLine();
      currentSpark.you = you;
      const today = dayKey();
      const existingIdx = S.sparks.findIndex(s => s.day === today);
      if (existingIdx >= 0) {
        S.sparks[existingIdx] = { day: today, text: currentSpark.text, by: currentSpark.by, you, at: Date.now() };
      } else {
        S.sparks.push({ day: today, text: currentSpark.text, by: currentSpark.by, you, at: Date.now() });
      }
      save();
    }
    stage.classList.add('lit');
    halo.style.setProperty('--p', '1');
    playSparkChime();
    if (navigator.vibrate) navigator.vibrate([40, 80, 140]);
    confetti();
    const qEl = $('#spark-q');
    const byEl = $('#spark-by');
    const youEl = $('#spark-you');
    if (qEl) qEl.textContent = `“${currentSpark.text}”`;
    if (byEl) byEl.textContent = `— ${currentSpark.by}`;
    if (youEl) youEl.textContent = currentSpark.you || personalLine();
    hint.innerHTML = 'Today’s spark is lit ✨ Tap orb to draw another';
    cardEl.classList.remove('hidden');
    cardEl.classList.add('pop');
  }

  function startAutoCharge() {
    if (isCharging) return;
    isCharging = true;
    orb.classList.add('charging');
    hint.textContent = 'Charging your spark… breathe in…';
    const startT = performance.now();
    const duration = 650; // smooth 650ms charge

    function step(now) {
      if (!isCharging) return;
      const p = Math.min(1, (now - startT) / duration);
      halo.style.setProperty('--p', p);
      if (p >= 1) {
        isCharging = false;
        orb.classList.remove('charging');
        igniteSpark(true);
      } else {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // Pointer interactions (works on tap, click, hold)
  orb.addEventListener('pointerdown', e => {
    e.preventDefault();
    startAutoCharge();
  });

  orb.addEventListener('pointerup', () => {
    if (isCharging) {
      isCharging = false;
      orb.classList.remove('charging');
      halo.style.setProperty('--p', '1');
      igniteSpark(true);
    }
  });

  orb.addEventListener('click', e => {
    e.preventDefault();
    igniteSpark(true);
  });

  orb.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      igniteSpark(true);
    }
  });

  $('#spark-reignite')?.addEventListener('click', () => {
    startAutoCharge();
  });

  $('#spark-beacon')?.addEventListener('click', () => beaconOfHopeModal());
  $('#spark-home').onclick = () => { toast('Spark saved to your constellation ⭐'); nav('#/home'); };
  $('#spark-share').onclick = async () => {
    const msg = `“${currentSpark.text}” — ${currentSpark.by}\n\n✨ My Daily Spark from MojaMind`;
    try {
      if (navigator.share) await navigator.share({ title: 'My Daily Spark — MojaMind', text: msg });
      else { await navigator.clipboard.writeText(msg); toast('Spark copied — paste it anywhere 💫'); }
    } catch { /* cancelled */ }
  };
};

/* IONITY brand footer */
function ionityFooter() {
  return `<footer class="ionity-foot">
    <div class="io-logo-wrap">
      <img class="io-logo-img" src="./assets/branding/ionity-global-white.png" alt="IONITY GLOBAL" />
    </div>
    <div class="io-credits">
      <span>Offline Design · <a href="https://www.ionity.co.za" target="_blank" rel="noopener"><b>IONITY GLOBAL</b></a> · <a class="io-url" href="https://www.ionity.co.za" target="_blank" rel="noopener">www.ionity.co.za</a></span>
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

      <!-- Item 9: Participant Profile & Encrypted Avatar -->
      <div class="info-card" style="background:rgba(255,255,255,0.08);backdrop-filter:blur(16px);border:1.5px solid rgba(255,209,102,0.45);border-radius:20px;padding:18px;text-align:left">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:10px">
            <div id="profile-avatar-display" style="width:48px;height:48px;border-radius:50%;overflow:hidden;border:2px solid #ffd166;display:grid;place-items:center;background:rgba(51,102,255,0.25)">
              ${S.avatar?.src ? `<img src="${S.avatar.src}" alt="Profile" style="width:100%;height:100%;object-fit:cover" />` : flowerSVG(34)}
            </div>
            <div>
              <h3 style="margin:0;font-size:16px;color:#ffffff;font-weight:800">Participant Profile &amp; Avatar</h3>
              <small style="color:#ffd166;font-weight:600">Account ID: ${S.participantCertId || 'MM-PARTICIPANT-2026'}</small>
            </div>
          </div>
          <span class="spark-badge">ENCRYPTED</span>
        </div>
        <p style="font-size:12.5px;line-height:1.55;color:rgba(255,255,255,0.85);margin:0 0 14px">
          Personalize your avatar and download a verified offline credentials card to this phone.
        </p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-secondary btn-sm" id="prof-change-avatar">Change Avatar 🌸</button>
          <button class="btn btn-outline btn-sm" id="prof-download-card">Download Credentials Card 📥</button>
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

  /* Profile avatar selection & local credential card download */
  $('#prof-change-avatar')?.addEventListener('click', () => {
    const avatars = [
      { id: 'emerald', name: 'Emerald Hope', color: '#00c9a7', icon: '🌿' },
      { id: 'amber', name: 'Solar Resilience', color: '#f59e0b', icon: '🌻' },
      { id: 'sapphire', name: 'Ionity Electric', color: '#3366FF', icon: '💎' },
      { id: 'amethyst', name: 'Starlight Wisdom', color: '#8a2eae', icon: '✨' },
      { id: 'ruby', name: 'Courageous Heart', color: '#f3256b', icon: '🌺' },
    ];
    const m = modal(`
      <h3>🌸 Choose Your Avatar</h3>
      <p style="font-size:12.8px;line-height:1.6;color:#ffffff;margin:0 0 14px">
        Select an artistic emblem or upload your own photo. Your avatar is encrypted and never shared.
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px;margin-bottom:16px">
        ${avatars.map(av => `
          <button class="opt-choice" data-avid="${av.id}" style="padding:12px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px">
            <span style="font-size:30px">${av.icon}</span>
            <b style="font-size:12px;color:#fff">${esc(av.name)}</b>
          </button>
        `).join('')}
      </div>
      <input type="file" id="avatar-file-in" accept="image/*" class="hidden" />
      <div class="modal-btns" style="display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-outline btn-block" id="avatar-custom-upload">Upload Custom Photo 📷</button>
        <button class="btn btn-ghost btn-block" onclick="closeModal()">Done</button>
      </div>
    `);

    m.querySelectorAll('[data-avid]').forEach(btn => {
      btn.onclick = () => {
        const avid = btn.dataset.avid;
        const av = avatars.find(x => x.id === avid);
        S.avatar = { type: 'emblem', id: avid, name: av.name, icon: av.icon };
        save();
        confetti();
        toast(`Avatar set to ${av.name} 🌸`);
        closeModal();
        route();
      };
    });

    const fileIn = m.querySelector('#avatar-file-in');
    m.querySelector('#avatar-custom-upload')?.addEventListener('click', () => fileIn.click());
    fileIn?.addEventListener('change', e => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        S.avatar = { type: 'custom', src: ev.target.result };
        save();
        confetti();
        toast('Custom avatar encrypted and saved locally 📷✨');
        closeModal();
        route();
      };
      reader.readAsDataURL(file);
    });
  });

  $('#prof-download-card')?.addEventListener('click', async () => {
    const cvs = document.createElement('canvas');
    cvs.width = 800; cvs.height = 500;
    const ctx = cvs.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 800, 500);
    grad.addColorStop(0, '#12041d');
    grad.addColorStop(0.5, '#1e0830');
    grad.addColorStop(1, '#0c0214');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 500);

    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 760, 460);

    ctx.fillStyle = '#ffffff'; ctx.font = '700 13px Poppins, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('MOJAMIND · ON-DEVICE PARTICIPANT CREDENTIAL', 400, 60);

    ctx.fillStyle = '#ffd166'; ctx.font = '800 24px Poppins, sans-serif';
    ctx.fillText('ENCRYPTED STUDY VAULT ID', 400, 110);

    const cryptId = S.participantCertId || 'MM-PARTICIPANT-2026';
    ctx.fillStyle = '#ffffff'; ctx.font = '800 28px monospace';
    ctx.fillText(cryptId, 400, 170);

    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '500 14px Poppins, sans-serif';
    ctx.fillText(`Study Group: ${groupOf().name} · Issued: ${new Date().toLocaleDateString('en-ZA')}`, 400, 220);
    ctx.fillText('Security: WebCrypto AES-GCM 256 · PBKDF2 Zero-Knowledge Local Key', 400, 250);

    ctx.strokeStyle = 'rgba(255,215,0,0.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(100, 280); ctx.lineTo(700, 280); ctx.stroke();

    ctx.fillStyle = '#ffd700'; ctx.font = '600 13px Poppins, sans-serif';
    ctx.fillText('AUTHENTICATED BY IONITY GLOBAL (PTY) LTD · STELLENBOSCH UNIVERSITY', 400, 320);

    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px Poppins, sans-serif';
    ctx.fillText('* For personal remembrance and study verification.', 400, 360);
    ctx.fillText('Private & Confidential · www.ionity.co.za · www.ionity.today', 400, 390);

    const url = cvs.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `mojamind-credentials-${cryptId}.png`;
    a.click();
    toast('Credentials card downloaded to device 📥✨');
  });

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
    <div class="group-billboard-card">
      <div class="gb-badge-top">
        <span>📌 Study Admin Billboard</span>
        <span class="gb-pinned-pill">Admin Broadcast</span>
      </div>
      <h4 class="gb-title">Study Facilitator Noticeboard</h4>
      <div class="gb-announcement-box">
        📢 <b>Cohort Protocol Active</b>: Welcome to your MojaMind study cohort. Remember to complete your weekly check-ins, journal reflections, and creative art sessions to unlock your authenticated Stellenbosch University certificate!
      </div>
      <div class="gb-meta-grid">
        <div class="gb-meta-item">
          <small>Active Group</small>
          <b>${esc(MM.GROUPS[S.group]?.name || 'Group ' + S.group)}</b>
        </div>
        <div class="gb-meta-item">
          <small>Facilitator Line</small>
          <b>0800 000 700</b>
        </div>
        <div class="gb-meta-item">
          <small>Support Hours</small>
          <b>Mon–Fri: 08:00–17:00</b>
        </div>
        <div class="gb-meta-item">
          <small>Ethics Protocol</small>
          <b>#SU-HREC-2026</b>
        </div>
      </div>
    </div>

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
  if (!postOpen()) {
    if (!preDone()) { toast('Complete your Pre-Survey first ✨'); return nav('#/pre'); }
    toast('Finish all 8 art activities to unlock your Post-Survey 🎨'); return nav('#/art');
  }
  surveyList('post', isBack);
};

/* ── Survey runner ───────────────────────────────────────── */
routes.survey = (params) => {
  const [phase, id] = params;
  const def = MM.SURVEYS[id];
  if (!def || !['pre', 'post'].includes(phase)) return nav('#/home');
  if (phase === 'post' && !postOpen()) {
    if (!preDone()) { toast('Complete your Pre-Survey first ✨'); return nav('#/pre'); }
    toast('Finish all 8 art activities to unlock your Post-Survey 🎨'); return nav('#/art');
  }
  const rec = S.surveys[phase][id];
  render(`
    ${header(def.name, { backTo: `#/${phase}` })}
    ${rec ? completedHTML(def, phase) : runnerHTML(def, S.drafts[`${phase}:${id}`], { pageLabel: 'Page 1/1', blurb: def.blurb })}
  `, { theme: `theme-${def.theme}` });

  if (rec) return; // completed surveys are locked — no redo

  wireRunner(def, `${phase}:${id}`, answers => {
    S.surveys[phase][id] = { answers, completedAt: Date.now() };
    save(); confetti();
    try { window.MMSync?.record('survey', { phase, id, name: def.name, answers }); } catch (_) {}
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
  // Sequential unlock is a study rule, so enforce it on the route itself —
  // not only on the list card, which a typed URL bypasses. Each activity
  // opens only once the previous one has been submitted.
  if (actLocked(a) && !actState(a.id)) {
    const idx = MM.ACTIVITIES.findIndex(x => x.id === a.id);
    toast(`Complete Activity ${MM.ACTIVITIES[idx - 1].id} first to unlock this one 🌱`);
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
        const locked = !done && !started && actLocked(a);
        const hasVideo = !!MM.ACTIVITY_VIDEOS[a.id];
        return `<div class="act-card ${done ? 'done' : ''} ${locked ? 'locked' : ''}" data-id="${a.id}" data-locked="${locked}" style="animation-delay:${i * .05}s" role="button" tabindex="0" aria-disabled="${locked}">
          <span class="acttile" style="background:linear-gradient(160deg, ${c1}, ${c2})">
            <span>Activity</span><b>${a.id}</b><em>Week ${a.week}</em>
          </span>
          <span class="a-name">${esc(a.name)}${hasVideo ? `<small class="a-video">${I.video} video guides</small>` : ''}</span>
          <span class="a-status">
            ${done
              ? `<span class="st-ic" style="background:rgba(51,102,255,0.2);color:#3366FF">${I.heart(true)}</span><em>Completed</em>`
              : started
                ? `<span class="st-ic" style="background:rgba(255,209,102,0.2);color:#ffd166">${I.pencil}</span><em>In progress</em>`
                : locked
                  ? `<span class="st-ic" style="border:2px solid rgba(255,255,255,0.25);color:rgba(255,255,255,0.6)">${I.lock}</span><em>Locked</em>`
                  : `<span class="st-ic" style="border:2px solid rgba(255,255,255,0.3);color:transparent">${I.check}</span><em>Open</em>`}
          </span>
        </div>`;
      }).join('')}
    </div>
  `, { theme: 'theme-purple', backAnim: isBack });
  app.querySelectorAll('.act-card').forEach(c => c.addEventListener('click', () => {
    const aId = parseInt(c.dataset.id, 10);
    const st = actState(aId);
    if (c.dataset.locked === 'true') {
      const idx = MM.ACTIVITIES.findIndex(x => x.id === aId);
      return toast(`Complete Activity ${MM.ACTIVITIES[idx - 1].id} first to unlock this one 🌱`);
    }
    if (st?.submittedAt) {
      const nextDue = MM.ACTIVITIES.find(x => x.week <= currentWeek() && !actState(x.id)?.submittedAt);
      if (nextDue) {
        showAiGuidanceModal(
          'Activity Already Completed 🌸',
          `You have already completed and safely sealed your milestone for Activity ${aId}! Moja Guide recommends jumping to your active milestone — Week ${nextDue.week}: ${nextDue.name}.`,
          `#/art/${nextDue.id}`,
          `Go to Week ${nextDue.week} 🎨`
        );
        return;
      }
    }
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
    // Route by the option's KIND (not a magic index) so every activity —
    // including 7 & 8 — always opens the correct tool for the chosen option.
    const kind = MM.ART_OPTION_KINDS[sel]?.key;
    if (kind === 'draw') {
      nav(`#/art/${a.id}/detail/pictures`);
      setTimeout(() => openDrawPad(a), 350);
    } else if (kind === 'speak') {
      nav(`#/art/${a.id}/detail/voice`);
    } else {
      nav(`#/art/${a.id}/detail/start`);
    }
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
  try {
    if (typeof MMVoice !== 'undefined' && typeof MMVoice.pause === 'function') MMVoice.pause();
    else if (typeof MMVoice !== 'undefined' && typeof MMVoice.stop === 'function') MMVoice.stop();
  } catch (_) { /* noop */ }

  let stream = null;
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } else if (navigator.getUserMedia) {
      stream = await new Promise((res, rej) => navigator.getUserMedia({ audio: true }, res, rej));
    } else if (navigator.webkitGetUserMedia) {
      stream = await new Promise((res, rej) => navigator.webkitGetUserMedia({ audio: true }, res, rej));
    } else {
      throw new Error('Microphone API not available');
    }
  } catch (err) {
    console.warn('[MojaMind] Microphone access error:', err);
    modal(`
      <div style="text-align:left;color:#ffffff">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <span style="font-size:24px">🎙️</span>
          <h3 style="margin:0;font-size:16px;font-weight:800;color:#ffffff">Microphone Access Needed</h3>
        </div>
        <p style="font-size:13px;line-height:1.55;color:rgba(255,255,255,0.9);margin:0 0 14px">
          To record your voice notes, your browser needs microphone permission:
        </p>
        <div style="background:rgba(255,255,255,0.08);border-radius:12px;padding:12px;font-size:12.5px;line-height:1.6;margin-bottom:16px">
          1. Tap the <b>lock icon 🔒</b> or <b>site settings</b> in your browser address bar.<br>
          2. Change <b>Microphone</b> to <b>Allow</b>.<br>
          3. Reload the page and tap the record button again.
        </div>
        <button class="btn btn-primary btn-block" onclick="closeModal()">Got It 👍</button>
      </div>
    `);
    return null;
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
      (st.voice = Array.isArray(st.voice) ? st.voice : []).push({
        title: `Voice note ${st.voice.length + 1}`,
        src: reader.result,
        transcript: (cap.finalT + ' ' + cap.transcript).replace(/\s+/g, ' ').trim(),
        dur,
        at: Date.now()
      });
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

/* ── Robust Reflection Voice Dictation Engine ─────────────── */
let reflectionDictation = null; // { recog, idx, base, finalT, active, retryCount, restartTimer }

function stopReflectionDictation() {
  if (!reflectionDictation) return;
  reflectionDictation.active = false;
  clearTimeout(reflectionDictation.restartTimer);
  try { reflectionDictation.recog?.stop(); } catch { /* noop */ }
  reflectionDictation = null;
  if (typeof MMVoice !== 'undefined' && typeof MMVoice.resume === 'function') {
    MMVoice.resume();
  }
}

function toggleReflectionDictation(idx, textarea, micBtn) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    return toast('Voice dictation needs speech recognition support (Chrome, Edge or Safari) 🎤', 3000);
  }

  if (reflectionDictation && reflectionDictation.idx === idx) {
    const wasText = textarea.value;
    stopReflectionDictation();
    micBtn.classList.remove('on');
    micBtn.innerHTML = I.mic;
    scheduleReflectionNote(idx, wasText, true);
    toast('Dictation saved ✍️', 1800);
    return;
  }

  if (reflectionDictation) {
    stopReflectionDictation(); // Switch question cleanly
  }

  if (typeof MMVoice !== 'undefined' && typeof MMVoice.pause === 'function') {
    MMVoice.pause();
  }

  const existing = textarea.value.trim();
  const base = existing ? existing + (/[.!?]$/.test(existing) ? ' ' : '. ') : '';

  const state = {
    recog: null,
    idx,
    base,
    finalT: '',
    active: true,
    retryCount: 0,
    restartTimer: null,
  };
  reflectionDictation = state;

  function createAndStartRecog() {
    if (!state.active) return;
    try {
      if (state.recog) {
        try { state.recog.stop(); } catch { /* noop */ }
      }
      const recog = new SR();
      state.recog = recog;
      recog.continuous = true;
      recog.interimResults = true;
      // Use user's browser locale or fallback
      recog.lang = navigator.language || 'en-ZA';

      recog.onstart = () => {
        if (!state.active) return;
        micBtn.classList.add('on');
        micBtn.innerHTML = I.stop;
      };

      recog.onresult = e => {
        if (!reflectionDictation || reflectionDictation.idx !== idx || !state.active) return;
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          let chunk = e.results[i][0].transcript;
          if (e.results[i].isFinal) {
            chunk = chunk
              .replace(/\s+full stop\b/gi, '.')
              .replace(/\s+period\b/gi, '.')
              .replace(/\s+comma\b/gi, ',')
              .replace(/\s+question mark\b/gi, '?')
              .replace(/\s+exclamation mark\b/gi, '!')
              .replace(/\s+new line\b/gi, '\n')
              .replace(/\s+new paragraph\b/gi, '\n\n');
            state.finalT += chunk + ' ';
          } else {
            interim += chunk;
          }
        }
        const fullText = (state.base + state.finalT + interim).replace(/\s+/g, ' ').trim();
        textarea.value = fullText;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      };

      recog.onerror = e => {
        if (!state.active) return;
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          state.active = false;
          micBtn.classList.remove('on');
          micBtn.innerHTML = I.mic;
          toast('Microphone permission is needed to dictate 🎤', 3000);
          stopReflectionDictation();
          return;
        }
        // For 'no-speech', 'audio-capture', or 'network', do NOT abort prematurely
        if (e.error === 'no-speech') {
          // Gentle silent recovery - let user pause while thinking
        }
      };

      recog.onend = () => {
        if (!state.active) {
          micBtn.classList.remove('on');
          micBtn.innerHTML = I.mic;
          return;
        }
        // Auto-reconnect seamlessly if user is still in recording mode
        clearTimeout(state.restartTimer);
        state.restartTimer = setTimeout(() => {
          if (state.active && reflectionDictation?.idx === idx) {
            createAndStartRecog();
          }
        }, 120);
      };

      recog.start();
      micBtn.classList.add('on');
      micBtn.innerHTML = I.stop;
      toast('Listening… Speak your reflection 🎙️', 1800);
    } catch (err) {
      if (state.active && state.retryCount < 3) {
        state.retryCount++;
        state.restartTimer = setTimeout(createAndStartRecog, 250);
      }
    }
  }

  createAndStartRecog();
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
  // Normalise legacy/partial records so array access can never crash.
  st.uploads = Array.isArray(st.uploads) ? st.uploads : [];
  st.voice = Array.isArray(st.voice) ? st.voice : [];
  st.reflections = st.reflections && typeof st.reflections === 'object' ? st.reflections : {};
  const locked = !!st.submittedAt; // Submitted activities are locked
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
      ${st.submittedAt ? `
        <div class="completed-art-showcase">
          <div class="showcase-badge">✓ ACTIVITY COMPLETED</div>
          <h3 style="margin:0 0 8px;font-size:16px;color:#ffffff;font-weight:800">Your Saved Creation</h3>
          ${st.uploads && st.uploads.length ? `
            <div class="showcase-img-wrap">
              <img src="${uploadSrc(st.uploads[0])}" alt="Your artwork" />
            </div>
          ` : ''}
          <div style="font-size:12.5px;color:rgba(255,255,255,0.85);line-height:1.5;margin-bottom:8px">
            <b>Submitted:</b> ${new Date(st.submittedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div style="display:flex;gap:8px;margin-top:10px">
            <button class="btn btn-outline btn-sm" onclick="nav('#/portfolio')">View Certificate 📜</button>
            <button class="btn btn-ghost btn-sm" onclick="nav('#/art/${a.id}/detail/pictures')">View Artwork 🎨</button>
          </div>
        </div>
      ` : ''}
      ${st.option === 1 ? `
        <div class="card" style="padding:14px;background:linear-gradient(135deg, rgba(243,37,107,0.25), rgba(138,46,174,0.3));border:1.5px solid #f3256b;border-radius:18px;display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;box-shadow:0 6px 20px rgba(243,37,107,0.3)">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:28px">🎨</span>
            <div>
              <b style="font-size:14px;color:#fff;display:block">Option 2: Digital Painting Mode</b>
              <small style="color:rgba(255,255,255,0.9)">Draw and paint your picture directly on screen</small>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" id="quick-draw-btn" style="padding:8px 16px;font-weight:800;border-radius:10px;box-shadow:0 4px 14px rgba(243,37,107,0.4)">Open Pad 🖌️</button>
        </div>
      ` : ''}
      <!-- Item 11: 4-Step Uniform Activity Journey Cards -->
      <div class="activity-steps-grid">
        <div class="act-step-card">
          <div class="act-step-header">
            <span class="act-step-num">STEP 1</span>
            <span class="act-step-icon">🎬</span>
          </div>
          <h4>Reflect &amp; Ground</h4>
          <p>Watch guided clip and center your mind.</p>
        </div>
        <div class="act-step-card">
          <div class="act-step-header">
            <span class="act-step-num">STEP 2</span>
            <span class="act-step-icon">🎨</span>
          </div>
          <h4>Create Art</h4>
          <p>Draw on pad or snap physical craft photos.</p>
        </div>
        <div class="act-step-card">
          <div class="act-step-header">
            <span class="act-step-num">STEP 3</span>
            <span class="act-step-icon">🎙️</span>
          </div>
          <h4>Speak &amp; Write</h4>
          <p>Voice note or text reflection with AI feedback.</p>
        </div>
        <div class="act-step-card">
          <div class="act-step-header">
            <span class="act-step-num">STEP 4</span>
            <span class="act-step-icon">🌟</span>
          </div>
          <h4>Seal &amp; Save</h4>
          <p>Lock your milestone into your AES-256 vault.</p>
        </div>
      </div>
      <div class="info-card">
        <div style="display:flex;flex-direction:column;gap:14px">
          ${a.startHere.map(([b, t]) => `
            <div class="step-li"><span class="pen">${I.pencil}</span><p><b>${esc(b)}</b> ${esc(t)}</p></div>`).join('')}
        </div>
        <button class="video-btn" id="play-video"><span class="play">${I.play}</span>${videoOpts ? `Watch: Option ${st.option + 1} inspiration video` : 'Play Video'}</button>
      </div>
      <div class="act-foot-btns" style="padding:0">
        <button class="btn btn-primary" data-go="${st.option === 1 ? 'pictures' : 'materials'}" style="min-width:150px">Start</button>
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
        <div class="voice-note" style="background:rgba(255,255,255,0.06);border:1.5px solid rgba(51,102,255,0.35);border-radius:18px;padding:14px;margin-bottom:12px;box-shadow:0 4px 14px rgba(0,0,0,0.3)">
          <div class="vn-head" style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
              <span class="vn-ic" style="color:#ffd166">${I.mic}</span>
              <b class="vn-title" style="font-size:13.5px;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(v.title || `Voice note ${i + 1}`)}</b>
              <button class="btn btn-ghost btn-xs vn-rename" data-vrename="${i}" title="Rename voice note" style="padding:2px 7px;font-size:11px;border-radius:6px;border:1px solid rgba(255,209,102,0.4);color:#ffd166">✏️ Rename</button>
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              <small style="font-size:11px;color:rgba(255,255,255,0.7)">${v.dur ? `${Math.floor(v.dur / 60)}:${String(v.dur % 60).padStart(2, '0')} · ` : ''}${new Date(v.at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</small>
              <button class="del vn-del" data-vdel="${i}" aria-label="Delete voice note">${I.x}</button>
            </div>
          </div>
          <audio controls preload="metadata" src="${v.src}" style="width:100%;margin-bottom:6px"></audio>
          ${v.transcript ? `
            <div class="vn-transcript" style="background:rgba(0,0,0,0.25);border-radius:10px;padding:10px;margin-top:6px">
              <small style="color:#93c5fd;font-weight:700;display:block;margin-bottom:4px">${I.sparkle} AI transcript (read on this device)</small>
              <p style="margin:0 0 8px;font-size:12.5px;color:rgba(255,255,255,0.9)">${esc(v.transcript)}</p>
              <button class="btn btn-ghost btn-sm vn-use" data-vuse="${i}">Use in reflections ✍️</button>
            </div>` : '<p class="vn-none" style="font-size:12px;color:rgba(255,255,255,0.6);margin:4px 0 0">No transcript captured for this note.</p>'}
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
                <textarea id="rq${i}" data-r="${i}" ${locked ? 'readonly style="opacity:0.85"' : ''} placeholder="Your reflection… (no right or wrong)">${esc(st.reflections[i] || '')}</textarea>
                ${canDictate && !locked ? `<button class="refl-mic" data-dictate="${i}" aria-label="Speak this reflection instead of typing" title="Speak your answer">${I.mic}</button>` : ''}
              </div>
              <div class="refl-note hidden" data-note="${i}" aria-live="polite"></div>
            </div>`).join('')}
        </div>
      </div>
      <div class="act-foot-btns" style="padding:0">
        <button class="btn btn-primary" id="submit-refl" ${locked ? 'disabled style="opacity:0.6"' : ''} style="min-width:150px">${locked ? '✓ Completed & Locked' : 'Submit'}</button>
      </div>`;
  }

  render(`
    ${header(a.name, { backTo: '#/art' })}
    <div class="body-pad" style="gap:12px">
      <div class="hero-card" style="padding:13px 16px">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
          <p class="lead" style="margin:0">Option ${st.option + 1} — ${kind.emoji} ${esc(kind.name)}</p>
        </div>
        ${locked ? `<p class="locked-strip">${I.lock} Completed &amp; Submitted ${new Date(st.submittedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })} — responses are locked.</p>` : ''}
      </div>
      <div class="tabs-bar" role="tablist">
        ${tabs.map(([k, lbl]) => `<button class="tab-link ${tab === k ? 'active' : ''}" role="tab" aria-selected="${tab === k}" data-tab="${k}">${lbl}</button>`).join('')}
      </div>
      ${body}
    </div>
  `, { theme: 'theme-purple' });

  app.querySelectorAll('.tab-link').forEach(t => t.addEventListener('click', () => nav(`#/art/${a.id}/detail/${t.dataset.tab}`)));
  app.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => nav(`#/art/${a.id}/detail/${b.dataset.go}`)));

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
  $('#quick-draw-btn')?.addEventListener('click', () => openDrawPad(a));
  $('#upload-btn')?.addEventListener('click', () => $('#file-in').click());
  $('#file-in')?.addEventListener('change', async e => {
    const files = [...e.target.files].slice(0, 6);
    toast(`Moja Vision is looking at your picture${files.length > 1 ? 's' : ''}…`, 1800);
    let last = null;
    for (const f of files) {
      const url = await shrinkImage(f);
      const vision = await MMVision.read(url);
      last = vision;
      (st.uploads = Array.isArray(st.uploads) ? st.uploads : []).push({
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

  /* Voice note rename wiring */
  app.querySelectorAll('[data-vrename]').forEach(b => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const idx = +b.dataset.vrename;
    const curr = st.voice[idx]?.title || `Voice note ${idx + 1}`;
    const m = modal(`
      <div style="text-align:left;color:#ffffff">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <span style="font-size:22px">✏️</span>
          <h3 style="margin:0;font-size:16px;font-weight:800;color:#ffffff">Rename Voice Note</h3>
        </div>
        <p style="font-size:12.5px;color:rgba(255,255,255,0.85);margin:0 0 12px">
          Give your voice recording a meaningful title or description:
        </p>
        <input type="text" id="rename-vn-input" value="${esc(curr)}" maxlength="60" style="width:100%;box-sizing:border-box;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,0.1);border:1.5px solid #3366FF;color:#fff;font-size:14px;outline:none;margin-bottom:16px" placeholder="e.g. My Morning Reflection" />
        <div class="modal-btns" style="display:flex;gap:8px">
          <button class="btn btn-primary" id="save-rename-btn" style="flex:1">Save Title 💾</button>
          <button class="btn btn-ghost" id="cancel-rename-btn" style="flex:0 0 90px">Cancel</button>
        </div>
      </div>
    `);
    const input = m?.querySelector('#rename-vn-input');
    input?.focus();
    input?.select();
    const doSave = () => {
      const val = (input?.value || '').trim();
      if (val && st.voice[idx]) {
        st.voice[idx].title = val;
        save();
        toast('Voice note renamed ✍️');
        closeModal();
        artDetail(a, 'voice');
      } else {
        closeModal();
      }
    };
    m?.querySelector('#save-rename-btn')?.addEventListener('click', doSave);
    m?.querySelector('#cancel-rename-btn')?.addEventListener('click', () => closeModal());
    input?.addEventListener('keydown', ev => { if (ev.key === 'Enter') doSave(); });
  }));

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
      try { window.MMSync?.record('activity', { id: a.id, name: a.name, option: st.option, reflections: st.reflections, uploads: (st.uploads || []).length, voice: (st.voice || []).length }); } catch (_) {}
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
async function openDrawPad(a) {
  await ensureModule('MMDraw', './js/draw.js?v=2.8.2');
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
      (st.uploads = Array.isArray(st.uploads) ? st.uploads : []).push({
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

/** Moja Vision 3.0 — On-Device Neural Art Psychology & Vision Tensor Mirror. */
function visionModal(vision) {
  const arch = vision.archetype || {
    title: 'The Harmonious Creator',
    badge: '🌟 INNER BALANCE',
    icon: '🎨',
    headline: 'Balanced Creative Expression & Grounded Alignment',
  };

  const words = (vision.words && vision.words.length)
    ? `<div class="vision-words">
        <small>🔤 Words &amp; Intentions in Your Art</small>
        <p>${vision.words.slice(0, 6).map(w => `“${esc(w)}”`).join(' · ')}</p>
      </div>`
    : '';

  const symbols = (vision.symbols && vision.symbols.length)
    ? `<div class="vision-words" style="margin-top:6px">
        <small>✨ Resilience Touchstones</small>
        <p style="font-size:20px">${vision.symbols.slice(0, 8).join('  ')}</p>
      </div>`
    : '';

  const energies = vision.energies || { vitality: 45, serenity: 40, growth: 35, transcendence: 30 };
  const prompts = vision.reflectionPrompts || [
    'What emotion or memory felt most alive while choosing these colors?',
    'Which part of this artwork gives you the strongest sense of strength?',
  ];

  modal(`
    <div class="vision-modal-advanced">
      <div class="vision-hero-banner">
        <span class="vision-mark-icon">${arch.icon || '✨'}</span>
        <div class="vision-hero-title">
          <span class="vision-badge-pill">${esc(arch.badge || '🌟 RESILIENCE MIRROR')}</span>
          <h3>${esc(arch.title || 'Moja Vision')}</h3>
          <small>${esc(arch.headline || 'On-Device Neural Art Psychology')}</small>
        </div>
      </div>

      <div class="vision-palette-bar">
        <small class="vision-section-label">🎨 Extracted Chromatic Spectrum</small>
        <div class="colour-palette big">
          ${(vision.palette || []).map(c => `<span style="--swatch:${c}" title="${c}"></span>`).join('')}
        </div>
      </div>

      <div class="vision-feedback-card">
        <small class="vision-section-label">🧠 Psychological &amp; Emotional Mirror</small>
        <div class="vision-text-body">
          ${(vision.feedback || '').split('\n\n').map(p => `<p>${esc(p)}</p>`).join('')}
        </div>
      </div>

      <!-- Neural Energy Meters -->
      <div class="vision-energies-card">
        <small class="vision-section-label">⚡ Emotional Frequency Dynamics</small>
        <div class="vision-meter-grid">
          <div class="vision-meter-row">
            <span>☀️ Vitality &amp; Courage</span>
            <div class="v-bar"><div class="v-fill" style="width:${energies.vitality}%;background:linear-gradient(90deg,#f58220,#ffd166)"></div></div>
            <b>${energies.vitality}%</b>
          </div>
          <div class="vision-meter-row">
            <span>🌊 Serenity &amp; Clarity</span>
            <div class="v-bar"><div class="v-fill" style="width:${energies.serenity}%;background:linear-gradient(90deg,#3f6ad8,#00d2ff)"></div></div>
            <b>${energies.serenity}%</b>
          </div>
          <div class="vision-meter-row">
            <span>🌿 Growth &amp; Renewal</span>
            <div class="v-bar"><div class="v-fill" style="width:${energies.growth}%;background:linear-gradient(90deg,#00a651,#34c759)"></div></div>
            <b>${energies.growth}%</b>
          </div>
          <div class="vision-meter-row">
            <span>💜 Transcendence &amp; Identity</span>
            <div class="v-bar"><div class="v-fill" style="width:${energies.transcendence}%;background:linear-gradient(90deg,#8a2eae,#f3256b)"></div></div>
            <b>${energies.transcendence}%</b>
          </div>
        </div>
      </div>

      ${words}
      ${symbols}

      <!-- Socratic Reflection Prompts -->
      <div class="vision-prompts-card">
        <small class="vision-section-label">🌱 Guided Growth Questions</small>
        <ul class="vision-prompts-list">
          ${prompts.map(pr => `<li>${esc(pr)}</li>`).join('')}
        </ul>
      </div>

      <small class="vision-foot">100% on-device local neural tensor analysis · Private &amp; confidential</small>

      <div class="modal-btns vision-action-btns">
        <button class="btn btn-secondary" id="vision-read-aloud-btn">🔊 Read Aloud</button>
        <button class="btn btn-accent" id="vision-journal-btn" onclick="closeModal();nav('#/journal')">📖 Reflect in Journal</button>
        <button class="btn btn-primary" onclick="closeModal()">Close ✨</button>
      </div>
    </div>
  `);

  // Wire up audio read aloud
  document.getElementById('vision-read-aloud-btn')?.addEventListener('click', () => {
    const speechText = `${arch.title}. ${arch.headline}. ${vision.feedback.replace(/\n\n/g, ' ')}`;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(speechText);
      u.rate = 0.95;
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
      toast('Reading Moja Vision aloud 🔊', 2000);
    } else {
      toast('Speech synthesis is not supported on this browser', 2000);
    }
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
  const adminBand = S.adminMode ? `
        <div class="admin-band">
          <span>🎓 <b>Facilitator mode</b>${pendingCount ? ` · ${pendingCount} handover${pendingCount > 1 ? 's' : ''} waiting` : ' · all caught up'}</span>
          <span style="display:flex;gap:10px">
            <button class="link" id="adm-inbox">📥 All messages</button>
            <button class="link" id="adm-exit">Exit</button>
          </span>
        </div>` : '';
  const tabs = `
      <div class="seg" role="tablist">
        <button class="${scope === 'group' ? 'active' : ''}" data-scope="group" role="tab">Group</button>
        <button class="${scope === 'individual' ? 'active' : ''}" data-scope="individual" role="tab">Individual</button>
      </div>`;

  let body;
  if (scope === 'group') {
    /* GROUP = one broadcast/announcements channel. Only the facilitator (admin)
       can post events & encouragement; participants read only. */
    if (!S.chat.group || Array.isArray(S.chat.group)) S.chat.group = {};
    const msgs = Array.isArray(S.chat.group.broadcast) ? S.chat.group.broadcast : [];
    S.chatRead['group:broadcast'] = Date.now(); save();
    const fmt = ts => new Date(ts).toLocaleString('en-ZA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const feed = msgs.length
      ? msgs.map(m => `<div class="bubble them" style="max-width:100%"><p>${esc(m.text)}</p><span class="meta"><b>📣 Facilitator</b> | ${fmt(m.at)}</span></div>`).join('')
      : `<div class="info-card"><p class="empty-note">No announcements yet. Your facilitator will post study events, reminders and encouragement here. 📣</p></div>`;
    body = `
      <p style="color:rgba(255,255,255,.85);font-size:12.4px;margin:0 2px 8px;line-height:1.55">📣 Announcements &amp; events from your facilitator. This is a broadcast channel — only facilitators can post. For questions, use the <b>Individual</b> tab.</p>
      <div class="chat-scroll" id="grp-feed" style="max-height:52dvh">${feed}</div>
      ${S.adminMode
        ? `<div class="chat-input-bar"><input id="grp-in" placeholder="Post an announcement to the whole group…" autocomplete="off" maxlength="600" /><button class="send adm" id="grp-send" aria-label="Broadcast to group">${I.send}</button></div>`
        : `<div class="chat-readonly-note">📣 Only your facilitator can post here. Use the <a href="#/chat/individual">Individual</a> tab to reply privately.</div>`}`;
  } else {
    body = `
      <p style="color:rgba(255,255,255,.85);font-size:12.4px;margin:0 2px;line-height:1.55">A private line between you and your facilitator for each activity.</p>
      ${MM.ACTIVITIES.map((a, i) => {
        const msgs = S.chat.individual[a.id] || [];
        const last = msgs[msgs.length - 1];
        const readKey = `individual:${a.id}`;
        const unread = msgs.filter(m2 => m2.who !== 'me' && m2.at > (S.chatRead[readKey] || 0)).length;
        const handover = pendingHandover('individual', a.id);
        const [c1, c2] = MM.ACT_COLORS[i % MM.ACT_COLORS.length];
        return `<div class="chan-card" data-open="${a.id}" style="animation-delay:${i * .05}s" role="button" tabindex="0">
          <span class="ch-ic" style="background:linear-gradient(140deg, ${c1}, ${c2})">${a.id}</span>
          <h4>${esc(a.name)}${handover && S.adminMode ? '<span class="handover-flag">🙋 handover requested</span>' : ''}${last ? `<span class="last">${esc(last.who === 'me' ? 'You: ' : last.who === 'guide' ? 'Moja Guide: ' : last.who === 'sys' ? '' : 'Facilitator: ')}${esc(last.text)}</span>` : `<span class="last">Say hello 👋</span>`}</h4>
          ${unread ? `<span class="unread">${unread}</span>` : ''}
        </div>`;
      }).join('')}`;
  }

  render(`
    ${header('Chat', { backTo: '#/home' })}
    <div class="body-pad">
      ${adminBand}
      ${tabs}
      ${body}
      ${S.adminMode ? '' : `<button class="fac-link" id="fac-access">🎓 Facilitator access</button>`}
    </div>
  `, { theme: 'theme-purple', backAnim: isBack });

  app.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => chatChannels(b.dataset.scope, false)));
  app.querySelectorAll('.chan-card').forEach(c => c.addEventListener('click', () => nav(`#/chat/individual/${c.dataset.open}`)));
  $('#fac-access')?.addEventListener('click', adminLoginModal);
  $('#adm-inbox')?.addEventListener('click', () => nav('#/inbox'));
  $('#adm-exit')?.addEventListener('click', () => { S.adminMode = false; save(); toast('Facilitator mode off'); route(); });

  // Group broadcast composer (facilitator only)
  const grpSend = $('#grp-send');
  if (grpSend) {
    const doSend = () => {
      const inp = $('#grp-in'); const text = inp.value.trim(); if (!text) return;
      if (!S.chat.group || Array.isArray(S.chat.group)) S.chat.group = {};
      if (!Array.isArray(S.chat.group.broadcast)) S.chat.group.broadcast = [];
      S.chat.group.broadcast.push({ who: 'fac', text, at: Date.now() });
      S.chatRead['group:broadcast'] = Date.now(); save();
      try { window.MMSync?.sendMessage('group', 'broadcast', text, 'facilitator'); } catch (_) {}
      inp.value = '';
      chatChannels('group', false);
    };
    grpSend.onclick = doSend;
    $('#grp-in')?.addEventListener('keydown', e => { if (e.key === 'Enter') doSend(); });
  }
}

/* ── Admin Inbox — all participants' messages (facilitator only) ─
   Reads from the cloud backend (MMSync). Shows a live, timestamped
   stream grouped by participant so the facilitator can monitor and
   reply. Requires MM.SYNC.enabled + a hosted API (see BACKEND_AZURE.md);
   shows a clear setup notice when the backend is not configured. */
routes.inbox = (_, isBack) => {
  if (!S.adminMode) { toast('Facilitator access required 🎓'); return nav('#/chat'); }
  const st = (window.MMSync && MMSync.status && MMSync.status()) || { enabled: false, pending: 0 };
  render(`
    ${header('All Messages 📥', { backTo: '#/chat' })}
    <div class="body-pad">
      <div class="admin-band"><span>🎓 <b>Facilitator inbox</b> · every participant</span><button class="link" id="inbox-refresh">↻ Refresh</button></div>
      ${!st.enabled ? `
        <div class="info-card">
          <h3>Backend not connected yet</h3>
          <p style="font-size:12.8px;line-height:1.6;color:rgba(255,255,255,.85)">
            To see messages from every participant on one screen, connect the hosted study database:
            set <code>MM.SYNC.enabled = true</code> and <code>MM.SYNC.base</code> in <code>js/data.js</code>
            to your Azure API. Full steps are in <b>BACKEND_AZURE.md</b>. Until then, each device keeps its
            own chat locally and this inbox stays empty.
          </p>
        </div>` : `<div id="inbox-list"><div class="info-card"><p class="empty-note">Loading messages…</p></div></div>`}
    </div>
  `, { theme: 'theme-purple', backAnim: isBack });

  const renderList = (msgs) => {
    const host = $('#inbox-list'); if (!host) return;
    if (!msgs.length) { host.innerHTML = `<div class="info-card"><p class="empty-note">No messages yet.</p></div>`; return; }
    // Group by participant, newest group first
    const byP = {};
    msgs.forEach(m => { const p = m.participant || m.payload?.participant || 'Unknown'; (byP[p] = byP[p] || []).push(m); });
    host.innerHTML = Object.entries(byP).map(([pid, list]) => {
      list.sort((a, b) => new Date(a.at) - new Date(b.at));
      const rows = list.map(m => {
        const pl = m.payload || m; const who = pl.who || m.who || 'participant';
        const when = new Date(m.at || pl.at).toLocaleString('en-ZA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
        return `<div class="bubble ${who === 'facilitator' ? 'me' : 'them'}"><p>${esc(pl.text || '')}</p><span class="meta"><b>${esc(who)}</b> · ${pl.scope || ''}${pl.actId ? ' · #' + pl.actId : ''} | ${when}</span></div>`;
      }).join('');
      return `<div class="info-card" style="margin-bottom:12px"><h3 style="font-size:13.5px">👤 ${esc(pid)} · Group ${esc(String(list[0].group ?? '—'))}</h3><div class="chat-scroll" style="max-height:none;padding:0">${rows}</div></div>`;
    }).join('');
  };

  const load = async () => {
    if (!st.enabled) return;
    const res = await MMSync.pullMessages();
    if (!res.ok) { const h = $('#inbox-list'); if (h) h.innerHTML = `<div class="info-card"><p class="empty-note">Could not reach the server${res.offline ? ' — you are offline' : ''}. Tap ↻ to retry.</p></div>`; return; }
    renderList((res.messages || []).filter(m => (m.type === 'message') || m.text || m.payload?.text));
  };
  $('#inbox-refresh')?.addEventListener('click', load);
  load();
};

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
        ? `Welcome all to the ${a.name} group room! Your facilitator will share announcements and encouragement here. To ask something, use the Individual tab. 🎨`
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
      ${scope === 'group' && !S.adminMode ? '' : `
      <div class="chat-prompts-strip" role="toolbar" aria-label="Suggested quick questions">
        <button class="chat-prompt-pill" data-q="🌸 How do I get started with ${esc(a.name)}?">🌸 How do I start?</button>
        <button class="chat-prompt-pill" data-q="✨ Can you give me feedback on my artwork?">✨ Artwork feedback</button>
        <button class="chat-prompt-pill" data-q="🌱 What materials do I need for this?">🌱 What do I need?</button>
        <button class="chat-prompt-pill" data-q="💜 I am feeling a bit stuck on reflections.">💜 Need reflection tip</button>
        <button class="chat-prompt-pill" data-q="🌟 Feeling proud of completing this week!">🌟 Celebrate progress</button>
      </div>`}
      ${scope === 'group' && !S.adminMode
        ? `<div class="chat-readonly-note">📣 This is a facilitator announcement room — only your facilitator can post here. To ask a question, use the <a href="#/chat/individual/${actId}">Individual</a> tab.</div>`
        : `<div class="chat-input-bar">
        <input id="chat-in" placeholder="${S.adminMode ? (scope === 'group' ? 'Broadcast to the group…' : 'Reply as Facilitator…') : 'Ask on-device AI or tap a prompt…'}" autocomplete="off" maxlength="600" />
        <button class="send ${S.adminMode ? 'adm' : ''}" id="chat-send" aria-label="Send">${I.send}</button>
      </div>`}
    </div>
  `, { theme: 'theme-purple' });
  const canPost = scope !== 'group' || S.adminMode;

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
      try { window.MMSync?.sendMessage(scope, actId, text, 'facilitator'); } catch (_) {}
      inp.value = '';
      return;
    }

    pushMsg({ who: 'me', text, at: Date.now() });
    try { window.MMSync?.sendMessage(scope, actId, text, 'participant'); } catch (_) {}
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
  const sendBtn = $('#chat-send');
  if (sendBtn) sendBtn.onclick = sendMsg;
  $('#chat-in')?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
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
    },
    merge: {
      title: '🌌 How to Play: Moja Merge',
      subtitle: 'Physics Drop & Merge Alchemy · 10 Evolution Tiers',
      route: '#/gamemerge',
      btnText: 'Drop & Merge 🌌',
      items: [
        { icon: '🌰', title: 'Aim & Drop', desc: 'Slide your finger or mouse across the top aim line and release to drop your element.' },
        { icon: '🌸', title: 'Merge Identical Tiers', desc: 'When two matching elements collide, they merge into the next bigger tier (Seed → Dew → Sprout → Blossom → Sunflower → Crystal → Heart → Star → Sun → Cosmic Bloom!).' },
        { icon: '🔥', title: 'Combo Multipliers', desc: 'Chain multiple merges within 1.8 seconds to trigger escalating combo score bonuses!' },
        { icon: '🌬️', title: 'Wind Gust & ⚡ Spark Zap', desc: 'Use Wind Gust to shake stuck items or Spark Zap to vaporize any 1 piece.' },
        { icon: '⚠️', title: 'Avoid Overflow', desc: 'Keep items below the top danger line. Crossing the line for 3.2 seconds ends the round.' },
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

/* ── Moja Meadow Lazy Route Loader ─────────────────────────── */
routes.game = async () => {
  await ensureModule('MMGame', './js/game.js?v=2.8.2');
  if (typeof MMGame !== 'undefined' && routes.game) {
    routes.game();
  }
};

routes.games = () => {
  render(`
    ${header('Games & Resilience Hub 🎮', { backTo: '#/home' })}
    <div class="body-pad" style="gap:16px">
      <div class="hero-card games-hero">
        <span class="spark-badge">RELAX &amp; PLAY</span>
        <h2 class="hdr-glare">Choose Your Resilience Game</h2>
        <p class="lead">Take a mindful pause between study activities. Drop and merge cosmic blossoms, cultivate your meadow, soar in 3D as a cheerful bumblebee, or pop bubbles in harmonic serenity!</p>
      </div>

      <div class="game-hub-grid">
        <!-- Game 1: Moja Merge Physics Alchemy (NEW TRENDING GAME) -->
        <div class="game-card">
          <div class="game-card-head">
            <span class="game-badge" style="background:linear-gradient(135deg,#ec4899,#a855f7);color:#fff">TRENDING PHYSICS DROP</span>
            <span class="game-icon">🌌</span>
          </div>
          <h3>Moja Merge: Cosmic Bloom</h3>
          <p>Drop and merge seeds, blossoms, crystals, and stars with realistic 2D bounce physics. Conquer the 1-minute challenge across 5 cosmic dimensions!</p>
          <div class="game-stats-row">
            <span class="chip" style="background:rgba(236,72,153,0.2);border-color:rgba(236,72,153,0.4);color:#ffd700">🌌 <b>Dim ${S.gameMerge?.level || 1}/5</b></span>
            <span class="chip">🏆 High: <b>${S.gameMerge?.highScore || 0}</b> pts</span>
            <span class="chip">⏳ <b>1:00</b></span>
            <span class="chip">🌸 <b>10 Tiers</b></span>
            <span class="chip">🌬️ <b>Wind</b></span>
          </div>
          <div class="game-card-actions">
            <button class="btn btn-how-to" onclick="showGameHowToModal('merge')">📖 How to Play</button>
            <button class="btn btn-primary" style="background:linear-gradient(135deg,#ec4899,#3366ff);color:#fff" onclick="nav('#/gamemerge')">Play Moja Merge 🌌</button>
          </div>
        </div>

        <!-- Game 2: Moja Meadow 2D -->
        <div class="game-card">
          <div class="game-card-head">
            <span class="game-badge">4 SEASONS BOTANICAL</span>
            <span class="game-icon">🌸</span>
          </div>
          <h3>Moja Meadow</h3>
          <p>Nourish diverse flowers across 5 sanctuary levels and 4 changing seasons, summon refreshing rain showers, and catch falling Rain Stars.</p>
          <div class="game-stats-row">
            <span class="chip" style="background:rgba(51,102,255,0.2);border-color:rgba(51,102,255,0.4);color:#6ec1ff">🌸 <b>Lvl ${S.game?.level || 1}/5</b></span>
            <span class="chip">🌸 <b>${S.game?.blooms || 0}</b> Blooms</span>
            <span class="chip">🌟 <b>${S.game?.megaBlooms || 0}</b> Sky Blooms</span>
            <span class="chip">⭐ <b>${S.game?.rainStars || 0}</b> Rain Stars</span>
          </div>
          <div class="game-card-actions">
            <button class="btn btn-how-to" onclick="showGameHowToModal('meadow')">📖 How to Play</button>
            <button class="btn btn-primary" onclick="nav('#/game')">Play Moja Meadow 🌸</button>
          </div>
        </div>

        <!-- Game 3: Moja Bee 3D -->
        <div class="game-card">
          <div class="game-card-head">
            <span class="game-badge" style="background:linear-gradient(135deg,#ffb703,#e02043);color:#fff">3D SUNRAY FLIGHT</span>
            <span class="game-icon">🐝</span>
          </div>
          <h3>Moja Bee 3D: Sunray Flight</h3>
          <p>Fly your happy bumblebee across 5 altitude levels, sunny 3D skies, and mountain valleys. Collect Sunrays &amp; Pollen for supersonic Honey Rush!</p>
          <div class="game-stats-row">
            <span class="chip" style="background:rgba(255,183,3,0.2);border-color:rgba(255,183,3,0.4);color:#ffd700">🐝 <b>Lvl ${S.game3d?.level || 1}/5</b></span>
            <span class="chip">🏆 High: <b>${S.game3d?.highScore || 0}</b> pts</span>
            <span class="chip">☀️ <b>${S.game3d?.sunrays || 0}</b> Sunrays</span>
            <span class="chip">🍯 <b>${S.game3d?.pollen || 0}</b> Pollen</span>
          </div>
          <div class="game-card-actions">
            <button class="btn btn-how-to" onclick="showGameHowToModal('game3d')">📖 How to Play</button>
            <button class="btn btn-primary" style="background:linear-gradient(135deg,#ffb703,#f3256b);color:#fff" onclick="nav('#/game3d')">Fly Moja Bee 3D 🐝</button>
          </div>
        </div>

        <!-- Game 4: Moja Pop Bubble Odyssey -->
        <div class="game-card">
          <div class="game-card-head">
            <span class="game-badge" style="background:linear-gradient(135deg,#8a2eae,#3366ff);color:#fff">BUBBLE SHOOTER</span>
            <span class="game-icon">🫧</span>
          </div>
          <h3>Moja Pop: Bubble Odyssey</h3>
          <p>Aim with laser reflections across 5 constellation levels. Enjoy 1 emergency reset push back, 432Hz pop chimes, and mega avalanches!</p>
          <div class="game-stats-row">
            <span class="chip" style="background:rgba(138,46,174,0.2);border-color:rgba(138,46,174,0.4);color:#ec4899">🫧 <b>Lvl ${S.gameBubble?.level || 1}/5</b></span>
            <span class="chip">🏆 High: <b>${S.gameBubble?.highScore || 0}</b> pts</span>
            <span class="chip">🫧 <b>${S.gameBubble?.bubblesPopped || 0}</b> Popped</span>
            <span class="chip">❤️ <b>3 Lives</b></span>
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

/* ── Moja Merge: Cosmic Bloom Screen ─────────────────────────── */
routes.gamemerge = async () => {
  await ensureModule('MMMerge', './js/merge.js?v=3.1.0');
  render(`
    ${header('Moja Merge: Cosmic Bloom 🌌🌸', { backTo: '#/games' })}
    <div class="body-pad merge-pad">
      <div class="meadow-hud merge-hud">
        <span class="hud-chip" style="background:rgba(236,72,153,0.18);border-color:rgba(236,72,153,0.4)">🌌 <b>Dim ${S.gameMerge?.level || 1}/5</b></span>
        <span class="hud-chip">🏆 Score: <b id="merge-score">0</b></span>
        <span class="hud-chip">⭐ High: <b id="merge-high">${S.gameMerge?.highScore || 0}</b></span>
        <span class="hud-chip timer-chip" title="1-Minute Challenge">⏳ <span id="merge-timer">1:00</span></span>
        <span class="hud-chip next-chip" title="Next upcoming element">Next: <span id="merge-next-icon" style="font-size:16px;margin:0 4px">🌱</span> <b id="merge-next-name" style="font-size:11.5px">Sprout</b></span>
      </div>

      <div class="merge-frame">
        <canvas id="merge-canvas" aria-label="Moja Merge Physics Drop Canvas"></canvas>
        <div class="merge-controls-overlay">
          <button class="merge-action-btn" id="merge-wind-btn" title="Shake / Nudge the board">🌬️ Wind Gust</button>
          <button class="merge-action-btn" id="merge-zap-btn" title="Vaporize 1 item">⚡ Spark Zap</button>
          <button class="merge-action-btn" id="merge-restart-btn" title="Restart Game">🔄 Reset</button>
        </div>
      </div>

      <div class="merge-actions" style="display:flex;gap:8px;margin-top:8px">
        <button class="btn btn-outline btn-block" onclick="nav('#/games')">🎮 All Games Hub</button>
        <button class="btn btn-secondary btn-block" onclick="showGameHowToModal('merge')">📖 How to Play</button>
      </div>

      <p class="meadow-hint" style="text-align:center">
        <b>Touch &amp; drag across top</b> to aim · <b>Tap/release to drop</b> · Race the <b>1-Min Timer ⏳</b> to advance dimensions and forge the <b>🌌 Cosmic Bloom (1000 pts)</b>!
      </p>
    </div>
  `);

  $('#merge-wind-btn')?.addEventListener('click', () => MMMerge?.triggerWind?.());
  $('#merge-zap-btn')?.addEventListener('click', () => MMMerge?.toggleZapMode?.());
  $('#merge-restart-btn')?.addEventListener('click', () => MMMerge?.resetGame?.());

  if (typeof MMMerge !== 'undefined') MMMerge.mount();
};
routes.merge = routes.gamemerge;

/* ── Moja Bee 3D Screen ────────────────────────────────────── */
routes.game3d = async () => {
  await ensureModule('MMGame3D', './js/game3d.js?v=2.8.2');
  render(`
    ${header('Moja Bee 3D 🐝🌻', { backTo: '#/games' })}
    <div class="body-pad orbit-pad">
      <div class="meadow-hud orbit-hud">
        <span class="hud-chip" style="background:rgba(255,183,3,0.18);border-color:rgba(255,183,3,0.4)">🐝 <b>Lvl ${S.game3d?.level || 1}/5</b></span>
        <span class="hud-chip">🏆 <b id="orbit-score">0</b></span>
        <span class="hud-chip">⭐ High: <b id="orbit-high">${S.game3d?.highScore || 0}</b></span>
        <span class="hud-chip">☀️ <b id="orbit-sunrays">0</b></span>
        <span class="hud-chip">🍯 <b id="orbit-pollen">0</b></span>
        <span class="hud-chip timer-chip" title="2-Minute Flight Challenge">⏳ <span id="orbit-timer">2:00</span></span>
        <span class="hud-chip">📏 <span id="orbit-dist">0m</span></span>
      </div>
      <div class="orbit-frame">
        <canvas id="orbit-canvas" aria-label="Moja Bee 3D Sunray Flight"></canvas>
        <div class="orbit-controls-overlay">
          <div class="orbit-dpad">
            <button class="dpad-btn dpad-up" id="bee-up" aria-label="Fly Up">▲</button>
            <div class="dpad-row">
              <button class="dpad-btn dpad-left" id="bee-left" aria-label="Steer Left">◀</button>
              <button class="dpad-btn dpad-down" id="bee-down" aria-label="Fly Down">▼</button>
              <button class="dpad-btn dpad-right" id="bee-right" aria-label="Steer Right">▶</button>
            </div>
          </div>
          <button class="orbit-boost-btn" id="orbit-boost" style="background:linear-gradient(135deg,#ffb703,#e02043);border-color:#ffe066" title="Honey Rush Boost">⚡ HONEY RUSH</button>
        </div>
      </div>
      <div class="orbit-actions" style="display:flex;gap:8px;margin-top:8px">
        <button class="btn btn-outline btn-block" onclick="nav('#/games')">🎮 All Games Hub</button>
        <button class="btn btn-secondary btn-block" onclick="nav('#/gamebubble')">🫧 Play Moja Pop</button>
      </div>
      <p class="meadow-hint" style="text-align:center">
        <b>Touch &amp; drag anywhere or use D-Pad</b> to steer bumblebee · Collect <b>☀️ Sunrays (+10)</b> · Gather <b>🍯 Pollen (+25 &amp; Rush!)</b> · Storm clouds cause a dizzy wobble slowdown!
      </p>
    </div>
  `);

  $('#orbit-boost')?.addEventListener('click', () => MMGame3D?.triggerBoost?.());
  $('#bee-up')?.addEventListener('click', () => MMGame3D?.steer?.(0, -45));
  $('#bee-down')?.addEventListener('click', () => MMGame3D?.steer?.(0, 45));
  $('#bee-left')?.addEventListener('click', () => MMGame3D?.steer?.(-50, 0));
  $('#bee-right')?.addEventListener('click', () => MMGame3D?.steer?.(50, 0));

  if (typeof MMGame3D !== 'undefined') MMGame3D.mount();
};

/* ── Moja Pop Bubble Odyssey Screen ────────────────────────── */
routes.gamebubble = async () => {
  await ensureModule('MMBubble', './js/bubble.js?v=2.8.2');
  render(`
    ${header('Moja Pop: Bubble Odyssey 🫧✨', { backTo: '#/games' })}
    <div class="body-pad bubble-pad">
      <div class="meadow-hud bubble-hud">
        <span class="hud-chip" style="background:rgba(138,46,174,0.18);border-color:rgba(138,46,174,0.4)">🫧 <b>Lvl ${S.gameBubble?.level || 1}/5</b></span>
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
    MMBubble?.swapBubbles?.();
  });

  if (typeof MMBubble !== 'undefined') MMBubble.mount();
};

/* ── Writer / Note Space & Journal 📖✍️ ─────────────────────── */
routes.journal = async (args = []) => {
  await ensureModule('MMJournal', './js/journal.js?v=2.8.2');
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
        <div class="card journal-card" style="text-align:left;display:flex;flex-direction:column;gap:16px;padding:20px;background:rgba(255,255,255,0.08);backdrop-filter:blur(16px);border:1.6px solid rgba(51,102,255,0.45);border-radius:22px;box-shadow:0 10px 32px rgba(0,0,0,0.45)">
          
          <!-- Inspiration Spark Card with Shuffler Dropdown -->
          <div class="journal-prompts-bar" style="display:flex;flex-direction:column;gap:8px;background:rgba(0,0,0,0.32);padding:12px 14px;border-radius:14px;border:1.2px solid rgba(255,209,102,0.4)">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
              <span class="j-prompt-lbl" style="font-size:12.5px;font-weight:800;color:#ffd166;display:flex;align-items:center;gap:5px">💡 Inspiration Spark</span>
              <button class="btn btn-ghost btn-sm" id="j-shuffle-prompt" style="padding:4px 10px;font-size:11.5px;font-weight:700;color:#ffd166;border:1px solid rgba(255,209,102,0.4);border-radius:8px">🔀 Shuffle Prompt</button>
            </div>
            <div class="j-prompt-box" id="j-prompt-text" style="font-size:13px;color:rgba(255,255,255,0.95);line-height:1.5;font-style:italic;transition:opacity 0.2s ease">${esc(pick(MM.JOURNAL_PROMPTS))}</div>
          </div>

          <!-- Note Title -->
          <div class="field" style="margin:0">
            <input type="text" id="j-title" placeholder="Note Title or Thought Headline…" value="${esc(draft.title || '')}" maxlength="100" style="width:100%;font-size:15px;font-weight:700;color:#ffffff;background:rgba(0,0,0,0.35);border:1.5px solid rgba(255,255,255,0.22);border-radius:14px;padding:12px 16px;box-sizing:border-box" />
          </div>

          <!-- Harmonious Meta Selectors Row: Quick Tag & Current Mood Dropdowns -->
          <div class="j-meta-selectors-row" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px">
            <div class="j-select-group" style="display:flex;flex-direction:column;gap:5px">
              <label for="j-tag-select" style="font-size:11px;font-weight:800;letter-spacing:0.5px;color:#ffd166;text-transform:uppercase">🏷️ Quick Tag</label>
              <select id="j-tag-select" class="j-glass-select">
                <option value="">(Select a tag…)</option>
                <option value="💭 Thought">💭 Thought</option>
                <option value="🌸 Gratitude">🌸 Gratitude</option>
                <option value="🎯 Goal">🎯 Goal</option>
                <option value="💡 Idea">💡 Idea</option>
                <option value="🌿 Healing">🌿 Healing</option>
                <option value="📝 Todo">📝 Todo</option>
                <option value="❤️ Heart">❤️ Heart</option>
              </select>
            </div>

            <div class="j-select-group" style="display:flex;flex-direction:column;gap:5px">
              <label for="j-mood-select" style="font-size:11px;font-weight:800;letter-spacing:0.5px;color:#ffd166;text-transform:uppercase">🎭 Current Mood</label>
              <select id="j-mood-select" class="j-glass-select">
                <option value="🌟 Hopeful" ${selectedMood === '🌟 Hopeful' ? 'selected' : ''}>🌟 Hopeful</option>
                <option value="😌 Peaceful" ${selectedMood === '😌 Peaceful' ? 'selected' : ''}>😌 Peaceful</option>
                <option value="😊 Joyful" ${selectedMood === '😊 Joyful' ? 'selected' : ''}>😊 Joyful</option>
                <option value="😐 Neutral" ${selectedMood === '😐 Neutral' ? 'selected' : ''}>😐 Neutral</option>
                <option value="🌱 Reflective" ${selectedMood === '🌱 Reflective' ? 'selected' : ''}>🌱 Reflective</option>
                <option value="🌧️ Tough Day" ${selectedMood === '🌧️ Tough Day' ? 'selected' : ''}>🌧️ Tough Day</option>
                <option value="🔥 Determined" ${selectedMood === '🔥 Determined' ? 'selected' : ''}>🔥 Determined</option>
              </select>
            </div>
          </div>

          <!-- Formatting Toolbar -->
          <div class="j-format-bar" style="display:flex;gap:6px;background:rgba(0,0,0,0.32);padding:7px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.15);align-items:center;flex-wrap:wrap">
            <button class="btn-fmt" data-fmt="bold" title="Bold Text" style="background:rgba(255,255,255,0.1);border:0;color:#fff;font-weight:800;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:12px"><b>B</b></button>
            <button class="btn-fmt" data-fmt="italic" title="Italic Text" style="background:rgba(255,255,255,0.1);border:0;color:#fff;font-style:italic;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:12px"><i>I</i></button>
            <button class="btn-fmt" data-fmt="bullet" title="Bullet List" style="background:rgba(255,255,255,0.1);border:0;color:#fff;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:12px">• List</button>
            <button class="btn-fmt" data-fmt="todo" title="Checkbox Task" style="background:rgba(255,255,255,0.1);border:0;color:#fff;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:12px">☑ Task</button>
            <button class="btn-fmt" data-fmt="quote" title="Quote" style="background:rgba(255,255,255,0.1);border:0;color:#fff;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:12px">“ ” Quote</button>
            <button class="btn-fmt" data-fmt="spark" title="Insert Spark Prompt" style="background:rgba(255,209,102,0.22);border:1px solid #ffd166;color:#ffd166;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:12px;margin-left:auto;font-weight:700">✨ Add Spark</button>
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

    $('#j-mood-select')?.addEventListener('change', e => {
      selectedMood = e.target.value;
      updateCounts();
    });

    $('#j-tag-select')?.addEventListener('change', e => {
      const tag = e.target.value;
      if (tag && titleEl) {
        if (!titleEl.value.includes(tag)) {
          titleEl.value = tag + (titleEl.value ? ' — ' + titleEl.value : '');
          updateCounts();
        }
      }
    });

    $('#j-shuffle-prompt')?.addEventListener('click', () => {
      const p = pick(MM.JOURNAL_PROMPTS);
      const el = $('#j-prompt-text');
      if (el) {
        el.style.opacity = '0';
        setTimeout(() => {
          el.textContent = p;
          el.style.opacity = '1';
        }, 150);
      }
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
    $('#j-draw-btn')?.addEventListener('click', async () => {
      await ensureModule('MMDraw', './js/draw.js?v=2.8.2');
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
routes.portfolio = async () => {
  await ensureModule('MMPortfolio', './js/portfolio.js?v=2.8.2');
  if (typeof MMPortfolio !== 'undefined') {
    MMPortfolio.showPortfolioModal();
  }
};

/* ── Pixel Thoughts: Cosmic Thought Release Route ───────────── */
routes.pixelthoughts = async () => {
  await ensureModule('MMPixelThoughts', './js/pixelthoughts.js?v=2.8.2');
  if (typeof MMPixelThoughts !== 'undefined') {
    MMPixelThoughts.mount();
  }
};
routes.exercises = routes.pixelthoughts;

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
