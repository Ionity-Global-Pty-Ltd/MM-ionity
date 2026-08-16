/* ============================================================
   MojaMind — Moja Meadow 🌸🌱🌧️
   A compassionate, peaceful interactive garden game with rich
   botanical visuals, 4 dynamic seasons, rain weather, and diverse flowers.
 
   - 4 Dynamic Seasons: 🌸 Spring, ☀️ Summer, 🍂 Autumn, ❄️ Winter
     (Auto-cycles smoothly every 45s & interactive Season selector button).
   - Dynamic Weather System: 🌧️ Rain / Showers / Snow Flurries with rain clouds,
     water ripples, falling Rain Stars (⭐ +5 Serenity), and post-rain rainbows.
   - 8 Distinct Botanical Flower Species: 🌼 Daisy, 🌷 Tulip, 🌻 Sunflower,
     🌹 Rose, 🪻 Lavender, 🌸 Pompom, 🌺 Orchid, and ✨ Hope Starflower.
   - Organic, balanced flower sizing ranging from delicate blooms to Giant Sky Blooms.
   - Tap flowers & stems to water them; neglected flowers gently shrink until refreshed!
   - Care for all creatures: worms (💧 +3), ants (💧 +2), butterflies (🦋 +5/+10).
   - Reaching the upper sky yields Giant Sky Bloom (+50 🌟).
   - 2-Minute Session Countdown Challenge with Ionity glassmorphism HUD.
 
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za
   ============================================================ */
'use strict';

const MMGame = (() => {
  const COLORS = ['#00a651', '#f58220', '#ed1c24', '#2e3192', '#f3256b', '#8a2eae', '#ffd166', '#3f6ad8', '#ffd700', '#06d6a0', '#ff758f'];
  const SPECIES = ['daisy', 'tulip', 'sunflower', 'rose', 'lavender', 'pompom', 'orchid', 'lotus', 'hope', 'marigold'];
  const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
  const SEASON_NAMES = { spring: '🌸 Spring', summer: '☀️ Summer', autumn: '🍂 Autumn', winter: '❄️ Winter' };
  const PENTA = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.26, 783.99, 1046.5];
  const MAX_FLOWERS = 24;
  const GROW_MS = 24000;           // seed → bloom, unwatered
  const SEASON_MS = 30000;         // auto-transition seasons every 30s
  const CHECKPOINT_MS = 15000;     // checkpoint interval
  const MISSION_LIMIT_MS = 120000; // 2-Minute Session Countdown (120s)

  let canvas = null, ctx = null, W = 0, H = 0, dpr = 1;
  let raf = 0, last = 0, t = 0, mounted = false;
  let flowers = [], parts = [], flies = [], worms = [], ants = [], popups = [];
  let seasonalFluff = []; // Floating petals, leaves, snow crystals
  let nextFlyAt = 0, nextWormAt = 0, nextAntAt = 0;
  let nextNaturalRainAt = 0;
  let rainUntil = 0, rainbowUntil = 0, drops = [], ripples = [], rainStars = [];
  let sessionStart = 0, lastCheckpoint = 0;
  let missionCompleteSeen = false;
  let currentSeasonIndex = 0;
  let seasonStart = 0;
  let ac = null;

  const G = () => {
    if (!S.game) S.game = { blooms: 0, serenity: 0, sound: false, flowers: [], totalPlayMs: 0, wormsHydrated: 0, antsHydrated: 0, megaBlooms: 0, rainStars: 0, season: 'spring' };
    return S.game;
  };

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const calm = () => motionReduced();

  function lighten(hex, amt) {
    const h = hex.replace('#', '');
    const r = Math.min(255, parseInt(h.slice(0, 2), 16) + amt);
    const g = Math.min(255, parseInt(h.slice(2, 4), 16) + amt);
    const b = Math.min(255, parseInt(h.slice(4, 6), 16) + amt);
    return `rgb(${r},${g},${b})`;
  }

  function darken(hex, amt) {
    const h = hex.replace('#', '');
    const r = Math.max(0, parseInt(h.slice(0, 2), 16) - amt);
    const g = Math.max(0, parseInt(h.slice(2, 4), 16) - amt);
    const b = Math.max(0, parseInt(h.slice(4, 6), 16) - amt);
    return `rgb(${r},${g},${b})`;
  }

  function fmtClock(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  function addPopup(x, y, text, color = '#ffd166') {
    popups.push({ x, y, text, color, life: 1, vy: -1.35 });
  }

  /* ── Web Audio Chimes ────────────────────────────────────── */
  function audio() {
    if (!G().sound) return null;
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return null;
    if (!ac) ac = new AC();
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }

  function pluck(freq, vol = .05, dur = .5, type = 'sine') {
    const a = audio(); if (!a) return;
    try {
      const o = a.createOscillator(), gn = a.createGain(), lp = a.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1900;
      o.type = type; o.frequency.value = freq;
      gn.gain.setValueAtTime(Math.min(vol, 0.06), a.currentTime);
      gn.gain.exponentialRampToValueAtTime(.0001, a.currentTime + dur);
      o.connect(lp); lp.connect(gn); gn.connect(a.destination);
      o.start(); o.stop(a.currentTime + dur + .05);
    } catch { /* audio safeguard */ }
  }

  const tapChime     = () => pluck(pick(PENTA.slice(4)), .035, .35);
  const plantChime   = () => pluck(pick(PENTA.slice(0, 3)), .05, .45, 'triangle');
  const waterChime   = () => pluck(880, .035, .18, 'sine');
  const wormChime    = () => [440, 554.37, 659.26].forEach((f, i) => setTimeout(() => pluck(f, .04, .25, 'sine'), i * 65));
  const bloomChime   = () => { pluck(392, .05); setTimeout(() => pluck(523.25, .05), 120); };
  const megaChime    = () => [523.25, 659.26, 783.99, 1046.5].forEach((f, i) => setTimeout(() => pluck(f, .06, .5, 'sine'), i * 80));
  const flyChime     = () => [523.25, 659.26, 783.99].forEach((f, i) => setTimeout(() => pluck(f, .045), i * 90));
  const antChime     = () => pluck(1174.66, .04, .12, 'sine');
  const starChime    = () => [783.99, 1046.5, 1318.5].forEach((f, i) => setTimeout(() => pluck(f, .05, .35, 'triangle'), i * 60));
  const seasonChime  = () => [440, 659.26, 880, 1174.66].forEach((f, i) => setTimeout(() => pluck(f, .04, .45, 'sine'), i * 70));
  const buzz         = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch { /* no haptics */ } };

  function persist() {
    G().flowers = flowers.map(f => ({
      x: f.x, ci: f.ci, sp: f.sp, plantedAt: f.plantedAt,
      water: f.water, bloomed: f.bloomed, growthTier: f.growthTier || 1,
      isMega: !!f.isMega, hydration: f.hydration != null ? f.hydration : 1.0,
      lastWateredAt: f.lastWateredAt || Date.now(),
      baseScale: f.baseScale || 1.0,
    }));
    G().season = SEASONS[currentSeasonIndex];
    save();
  }

  function hud() {
    const b = $('#m-blooms'), s = $('#m-ser');
    if (b) b.textContent = G().blooms;
    if (s) s.textContent = G().serenity;
    const seasonEl = $('#m-season');
    if (seasonEl) seasonEl.textContent = SEASON_NAMES[SEASONS[currentSeasonIndex]];
  }

  function tickTimer() {
    const now = Date.now();
    if (now - lastCheckpoint >= CHECKPOINT_MS) {
      G().totalPlayMs = (G().totalPlayMs || 0) + (now - lastCheckpoint);
      lastCheckpoint = now;
      save();
    }
  }

  /* ── Season Management ───────────────────────────────────── */
  function getSeason() {
    return SEASONS[currentSeasonIndex];
  }

  function cycleSeason() {
    currentSeasonIndex = (currentSeasonIndex + 1) % SEASONS.length;
    seasonStart = Date.now();
    seasonChime();
    buzz([20, 60]);
    initSeasonalParticles();
    const name = SEASON_NAMES[getSeason()];
    toast(`Season transitioned to ${name} 🍃`, 2600);
    hud();
    persist();
  }

  function initSeasonalParticles() {
    seasonalFluff = [];
    const count = 55;
    for (let i = 0; i < count; i++) {
      seasonalFluff.push({
        x: rnd(0, W || 400),
        y: rnd(0, H || 600),
        vx: rnd(-0.6, 1.2),
        vy: rnd(0.5, 1.8),
        rot: rnd(0, Math.PI * 2),
        spin: rnd(-0.03, 0.03),
        size: rnd(3, 8),
        color: '#ffb7b2',
      });
    }
  }

  /* ── Geometry & Natural Flower Sizing Engine ──────────────── */
  const groundY = () => H * 0.85;

  function growth(f, now) {
    const base = Math.min(1, (now - f.plantedAt) / GROW_MS + (f.water || 0));
    const tierBonus = ((f.growthTier || 1) - 1) * 0.28;
    return Math.min(2.9, Math.max(0.15, base + tierBonus));
  }

  function headPos(f, now) {
    const gr = growth(f, now);
    const scale = f.baseScale || 1.0;
    const maxStemH = (H * 0.44) * Math.min(1.85, gr) * scale;
    const sway = Math.sin(t / 850 + f.ph) * 14 * Math.min(1.2, gr);
    const isWilted = (f.hydration || 0) <= 0.15;
    const droop = isWilted ? 18 : 0;
    return {
      x: f.x * W + sway,
      y: groundY() - maxStemH + droop,
      stemH: maxStemH,
      sway,
      scale,
      isWilted,
    };
  }

  /* ── Creature Spawners ───────────────────────────────────── */
  function spawnFly(now) {
    if (flies.length >= 6) return;
    const isHope = Math.random() < 0.25;
    flies.push({
      x: Math.random() < 0.5 ? -20 : W + 20,
      y: rnd(H * 0.15, groundY() - 40),
      vx: rnd(0.8, 1.8) * (Math.random() < 0.5 ? 1 : -1),
      vy: rnd(-0.5, 0.5),
      color: isHope ? '#ffd700' : pick(COLORS),
      ph: rnd(0, Math.PI * 2),
      born: now,
      isHope,
    });
  }

  function updateFlies(now, dt) {
    for (const f of flies) {
      f.x += f.vx * (dt / 16);
      f.y += Math.sin(t / 300 + f.ph) * 1.3;
      f.ph += 0.08;
    }
    flies = flies.filter(f => f.x > -60 && f.x < W + 60);
  }

  function drawFly(fl) {
    ctx.save();
    ctx.translate(fl.x, fl.y);
    const wingFlap = Math.sin(fl.ph * 2.8);

    // Butterfly Body
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(0, 0, 1.8, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.save();
    ctx.scale(wingFlap, 1);
    ctx.fillStyle = fl.color;
    ctx.shadowColor = fl.isHope ? '#ffd700' : fl.color;
    ctx.shadowBlur = fl.isHope ? 12 : 4;

    ctx.beginPath();
    ctx.ellipse(-6, -4, 6, 4.5, -0.3, 0, Math.PI * 2);
    ctx.ellipse(6, -4, 6, 4.5, 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = lighten(fl.color, 25);
    ctx.beginPath();
    ctx.ellipse(-4.5, 3, 4.5, 3.5, 0.2, 0, Math.PI * 2);
    ctx.ellipse(4.5, 3, 4.5, 3.5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  function spawnWorm(now) {
    if (worms.length >= 4) return;
    worms.push({
      x: rnd(W * 0.1, W * 0.9),
      y: groundY() + rnd(6, 18),
      ph: rnd(0, Math.PI * 2),
      born: now,
      downAt: now + rnd(5000, 9000),
      hydrated: false,
    });
  }

  function updateWorms(now) {
    worms = worms.filter(w => now < w.downAt);
  }

  function drawWorms(now) {
    for (const w of worms) {
      const up = Math.sin(t / 400 + w.ph) * 3;
      ctx.save();
      ctx.translate(w.x, w.y);
      ctx.fillStyle = w.hydrated ? '#6ec1ff' : '#e07a5f';
      ctx.beginPath();
      ctx.ellipse(0, -6 + up, 4.5, 7, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-1.5, -9 + up, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(1.5, -9 + up, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  function spawnAnt(now) {
    if (ants.length >= 5) return;
    const fromLeft = Math.random() < 0.5;
    const targetFlower = flowers.length ? pick(flowers) : null;
    ants.push({
      x: fromLeft ? -10 : W + 10,
      y: groundY() + rnd(2, 10),
      dir: fromLeft ? 1 : -1,
      speed: rnd(0.7, 1.4),
      born: now,
      hydrated: false,
      flower: targetFlower,
      stemProg: 0,
      climbing: false,
    });
  }

  function updateAnts(now, dt) {
    for (const a of ants) {
      if (a.climbing && a.flower) {
        a.stemProg += 0.005 * (dt / 16);
        if (a.stemProg > 1) { a.climbing = false; a.stemProg = 0; }
        const hp = headPos(a.flower, now);
        a.x = a.flower.x * W + Math.sin(t / 850 + a.flower.ph) * 3 * a.stemProg;
        a.y = groundY() - hp.stemH * a.stemProg;
      } else {
        a.x += a.dir * a.speed * (dt / 16);
      }
    }
    ants = ants.filter(a => a.x > -30 && a.x < W + 30);
  }

  function drawAnts(now) {
    for (const a of ants) {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.fillStyle = a.hydrated ? '#00b4d8' : '#2b1b17';
      // 3-Segment Ant Body
      ctx.beginPath(); ctx.ellipse(-3, 0, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, 0, 2, 1.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(3.5, 0, 3, 2.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  /* ── Rain, Falling Rain Stars & Weather Engine ───────────── */
  function triggerRain() {
    rainUntil = Date.now() + 22000;   // 22s rain shower
    rainbowUntil = rainUntil + 20000; // Full rainbow follows
    const season = getSeason();
    const weatherName = season === 'winter' ? 'A serene winter snow flurry sparkles over your meadow · Tap stars! ❄️⭐' :
                        season === 'spring' ? 'A gentle spring blossom shower rains down · Tap stars! 🌸⭐' :
                        season === 'autumn' ? 'An autumn golden mist showers your garden · Tap stars! 🍂⭐' :
                        'A refreshing summer rain showers your meadow · Tap stars! 🌧️⭐';
    toast(weatherName, 3500);
    pluck(329.63, 0.08, 0.8, 'sine');
  }

  function updateRain(now, dt) {
    const isRaining = now < rainUntil;
    const season = getSeason();

    // Periodic auto rain showers every ~65-80s
    if (now > nextNaturalRainAt && !isRaining) {
      triggerRain();
      nextNaturalRainAt = now + rnd(60000, 90000);
    }

    // Spawn raindrops / snowflakes
    if (isRaining && drops.length < (season === 'winter' ? 70 : 120)) {
      drops.push({
        x: rnd(0, W),
        y: -10,
        speed: season === 'winter' ? rnd(2, 4.5) : rnd(11, 16),
        len: season === 'winter' ? rnd(3, 6) : rnd(14, 24),
        isSnow: season === 'winter',
        drift: rnd(-0.8, 0.8),
      });
    }

    // Spawn falling Rain Stars (⭐ +5)
    if (isRaining && rainStars.length < 6 && Math.random() < 0.045) {
      rainStars.push({
        id: 'star-' + Math.random(),
        x: rnd(20, W - 20),
        y: -15,
        speedY: rnd(1.2, 2.4),
        speedX: rnd(-0.4, 0.4),
        rot: rnd(0, Math.PI * 2),
        spin: rnd(0.02, 0.05),
        size: rnd(14, 20),
        color: Math.random() < 0.5 ? '#ffd700' : '#6ec1ff',
        collected: false,
      });
    }

    for (const d of drops) {
      d.y += d.speed;
      d.x += d.drift || 1.2;
      if (d.y >= groundY()) {
        if (!d.isSnow) ripples.push({ x: d.x, y: groundY() + rnd(-2, 12), r: 1, maxR: rnd(5, 12), life: 1 });
      }
    }
    drops = drops.filter(d => d.y < groundY());

    for (const rp of ripples) {
      rp.r += 0.45;
      rp.life -= 0.035;
    }
    ripples = ripples.filter(rp => rp.life > 0);

    for (const st of rainStars) {
      st.y += st.speedY;
      st.x += st.speedX;
      st.rot += st.spin;
    }
    rainStars = rainStars.filter(st => !st.collected && st.y < groundY() + 20);

    // Rain continuously hydrates all flowers
    if (isRaining && Math.random() < 0.35) {
      for (const f of flowers) {
        f.hydration = 1.0;
        f.water = Math.min(2.0, (f.water || 0) + 0.015);
      }
    }
  }

  function drawRain() {
    const season = getSeason();
    const isRaining = Date.now() < rainUntil;

    // Rain Clouds in Upper Sky when Raining
    if (isRaining) {
      ctx.save();
      ctx.fillStyle = season === 'winter' ? 'rgba(219, 234, 254, 0.65)' : 'rgba(71, 85, 105, 0.55)';
      ctx.beginPath();
      ctx.arc(W * 0.25, 20, 60, 0, Math.PI * 2);
      ctx.arc(W * 0.45, 10, 80, 0, Math.PI * 2);
      ctx.arc(W * 0.7, 25, 65, 0, Math.PI * 2);
      ctx.arc(W * 0.85, 35, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Rain / Snow Streaks
    for (const d of drops) {
      if (d.isSnow) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.len * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(160, 215, 255, 0.82)';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 1.5, d.y + d.len);
        ctx.stroke();
      }
    }

    // Water Ripples
    for (const rp of ripples) {
      ctx.strokeStyle = `rgba(140, 200, 255, ${Math.max(0, rp.life * 0.85)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(rp.x, rp.y, rp.r * 1.8, rp.r * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Falling Rain Stars
    for (const st of rainStars) {
      ctx.save();
      ctx.translate(st.x, st.y);
      ctx.rotate(st.rot);
      ctx.fillStyle = st.color;
      ctx.shadowColor = st.color;
      ctx.shadowBlur = 16;

      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a1 = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 0.5) / 5) * Math.PI * 2 - Math.PI / 2;
        const rOut = st.size;
        const rIn = st.size * 0.45;
        if (i === 0) ctx.moveTo(Math.cos(a1) * rOut, Math.sin(a1) * rOut);
        else ctx.lineTo(Math.cos(a1) * rOut, Math.sin(a1) * rOut);
        ctx.lineTo(Math.cos(a2) * rIn, Math.sin(a2) * rIn);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, 0, st.size * 0.32, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    // Double Rainbow After Rain
    const now = Date.now();
    if (now >= rainUntil && now < rainbowUntil) {
      const alpha = Math.min(0.7, (rainbowUntil - now) / 6000);
      ctx.save();
      ctx.globalAlpha = alpha;
      const rainbowColors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a855f7'];
      const cx = W / 2, cy = H * 0.95;
      for (let i = 0; i < rainbowColors.length; i++) {
        ctx.strokeStyle = rainbowColors[i];
        ctx.lineWidth = 4.8;
        ctx.beginPath();
        ctx.arc(cx, cy, H * 0.65 + i * 5, Math.PI * 1.05, Math.PI * 1.95);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  /* ── Seasonal Atmospheric Particles (Drifting Fluff / Snow) ─ */
  function updateSeasonalParticles(dt) {
    for (const p of seasonalFluff) {
      p.x += p.vx + Math.sin(t * 0.002 + p.rot) * 0.4;
      p.y += p.vy;
      p.rot += p.spin;

      if (p.y > H + 10) { p.y = -10; p.x = rnd(0, W); }
      if (p.x > W + 10) p.x = -10;
      if (p.x < -10) p.x = W + 10;
    }
  }

  function drawSeasonalParticles() {
    const season = getSeason();
    ctx.save();

    for (const p of seasonalFluff) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      if (season === 'spring') {
        // Cherry Blossom Petals
        ctx.fillStyle = 'rgba(255, 183, 178, 0.85)';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.2, p.size * 0.7, 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (season === 'summer') {
        // Golden Dandelion Fluff
        ctx.fillStyle = 'rgba(255, 235, 120, 0.72)';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else if (season === 'autumn') {
        // Autumn Red/Amber Maple Leaves
        ctx.fillStyle = (Math.sin(p.rot) > 0) ? 'rgba(234, 88, 12, 0.85)' : 'rgba(220, 38, 38, 0.85)';
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.2);
        ctx.lineTo(p.size * 0.8, -p.size * 0.2);
        ctx.lineTo(p.size * 0.4, p.size * 0.8);
        ctx.lineTo(-p.size * 0.4, p.size * 0.8);
        ctx.lineTo(-p.size * 0.8, -p.size * 0.2);
        ctx.closePath();
        ctx.fill();
      } else {
        // Sparkling 6-Point Snowflakes
        ctx.fillStyle = 'rgba(240, 248, 255, 0.95)';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
    ctx.restore();
  }

  /* ── 8 Detailed Botanical Flower Species Renderers ───────── */
  function drawDaisy(R, col) {
    // 14 Slender Ray Petals with amber center
    for (let k = 0; k < 14; k++) {
      ctx.save(); ctx.rotate(k * Math.PI / 7);
      ctx.fillStyle = k % 2 === 0 ? col : lighten(col, 20);
      ctx.beginPath(); ctx.ellipse(0, -R * 0.95, R * 0.18, R * 0.92, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = '#6f3d05';
    ctx.beginPath(); ctx.arc(0, 0, R * 0.40, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath(); ctx.arc(0, 0, R * 0.26, 0, Math.PI * 2); ctx.fill();
  }

  function drawTulip(R, col) {
    const darkCol = darken(col, 20);
    const lightCol = lighten(col, 25);
    const petal = (rot, scaleX) => {
      ctx.save(); ctx.rotate(rot);
      const grad = ctx.createLinearGradient(0, 0, 0, -R * 1.1);
      grad.addColorStop(0, darkCol);
      grad.addColorStop(0.6, col);
      grad.addColorStop(1, lightCol);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.ellipse(0, -R * 0.78, R * 0.36 * scaleX, R * 0.80, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };
    petal(-0.25, 0.95); petal(0.25, 0.95); petal(0, 1.15);
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.arc(0, -R * 0.15, R * 0.20, 0, Math.PI * 2); ctx.fill();
  }

  function drawSunflower(R, col) {
    // Radiant Golden Ray Florets
    for (let k = 0; k < 16; k++) {
      ctx.save(); ctx.rotate(k * Math.PI / 8);
      ctx.fillStyle = k % 2 === 0 ? '#ffbe0b' : '#ffd166';
      ctx.beginPath(); ctx.ellipse(0, -R * 1.05, R * 0.22, R * 0.95, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    // Rich Textured Chocolate Stamen
    ctx.fillStyle = '#4a2800';
    ctx.beginPath(); ctx.arc(0, 0, R * 0.48, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd166';
    for (let j = 0; j < 8; j++) {
      const a = (j / 8) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(Math.cos(a) * R * 0.32, Math.sin(a) * R * 0.32, 1.4, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawRose(R, col) {
    // Swirling layered velvety rose petals
    const darkCol = darken(col, 30);
    const lightCol = lighten(col, 28);
    for (let ring = 2; ring >= 0; ring--) {
      const petals = ring === 2 ? 6 : ring === 1 ? 5 : 4;
      const rad = R * (0.4 + ring * 0.28);
      ctx.fillStyle = ring === 2 ? darkCol : ring === 1 ? col : lightCol;
      for (let k = 0; k < petals; k++) {
        ctx.save();
        ctx.rotate((k / petals) * Math.PI * 2 + ring * 0.35);
        ctx.beginPath();
        ctx.ellipse(0, -rad * 0.7, rad * 0.45, rad * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(0, 0, R * 0.16, 0, Math.PI * 2); ctx.fill();
  }

  function drawLavender(R, col) {
    // Tall Purple Spire Spike
    ctx.fillStyle = '#8a2eae';
    for (let k = 0; k < 6; k++) {
      const yOffset = -k * (R * 0.28);
      ctx.beginPath(); ctx.arc(-R * 0.18, yOffset, R * 0.18, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(R * 0.18, yOffset, R * 0.18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = lighten('#8a2eae', 20);
      ctx.beginPath(); ctx.arc(0, yOffset - R * 0.08, R * 0.16, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawPompom(R, col) {
    for (let ring = 0; ring < 3; ring++) {
      const petals = ring === 0 ? 8 : ring === 1 ? 12 : 16;
      const rad = R * (0.35 + ring * 0.25);
      ctx.fillStyle = ring === 2 ? lighten(col, 24) : ring === 1 ? col : darken(col, 15);
      for (let k = 0; k < petals; k++) {
        const a = (k / petals) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * rad, Math.sin(a) * rad, R * 0.22, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.arc(0, 0, R * 0.28, 0, Math.PI * 2); ctx.fill();
  }

  function drawOrchid(R, col) {
    // Exotic Winged Petals
    ctx.fillStyle = col;
    // Top Petal
    ctx.beginPath(); ctx.ellipse(0, -R * 0.85, R * 0.35, R * 0.7, 0, 0, Math.PI * 2); ctx.fill();
    // Lateral Wings
    ctx.fillStyle = lighten(col, 18);
    ctx.beginPath(); ctx.ellipse(-R * 0.7, -R * 0.2, R * 0.65, R * 0.32, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(R * 0.7, -R * 0.2, R * 0.65, R * 0.32, 0.4, 0, Math.PI * 2); ctx.fill();
    // Lip
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath(); ctx.ellipse(0, R * 0.35, R * 0.38, R * 0.45, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, R * 0.18, 0, Math.PI * 2); ctx.fill();
  }

  function drawHopeFlower(R, col) {
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 18;
    for (let k = 0; k < 8; k++) {
      ctx.save(); ctx.rotate(k * Math.PI / 4);
      const grad = ctx.createLinearGradient(0, 0, 0, -R * 1.2);
      grad.addColorStop(0, '#ff9e00');
      grad.addColorStop(0.5, '#ffd700');
      grad.addColorStop(1, '#ffffff');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.ellipse(0, -R * 0.95, R * 0.38, R * 0.95, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, R * 0.40, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.arc(0, 0, R * 0.22, 0, Math.PI * 2); ctx.fill();
  }

  function drawLotus(R, col) {
    // 3 Tiers of Graceful Lotus Petals with glowing center
    for (let ring = 2; ring >= 0; ring--) {
      const petals = ring === 2 ? 10 : ring === 1 ? 8 : 6;
      const rad = R * (0.5 + ring * 0.28);
      ctx.fillStyle = ring === 2 ? darken(col, 15) : ring === 1 ? col : lighten(col, 25);
      for (let k = 0; k < petals; k++) {
        ctx.save();
        ctx.rotate((k / petals) * Math.PI * 2 + ring * 0.25);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-rad * 0.35, -rad * 0.5, 0, -rad * 1.05);
        ctx.quadraticCurveTo(rad * 0.35, -rad * 0.5, 0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }
    // Radiant Golden Lotus Receptacle
    ctx.fillStyle = '#ffd700';
    ctx.beginPath(); ctx.arc(0, 0, R * 0.32, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b45309';
    for (let j = 0; j < 6; j++) {
      const a = (j / 6) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(Math.cos(a) * R * 0.18, Math.sin(a) * R * 0.18, 1.6, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawMarigold(R, col) {
    // Dense Ruffled Golden-Orange Marigold
    const baseCol = '#f97316';
    const goldCol = '#facc15';
    for (let layer = 0; layer < 4; layer++) {
      const petals = 12 + layer * 4;
      const rad = R * (0.4 + layer * 0.2);
      ctx.fillStyle = layer % 2 === 0 ? baseCol : goldCol;
      for (let k = 0; k < petals; k++) {
        ctx.save();
        ctx.rotate((k / petals) * Math.PI * 2 + layer * 0.3);
        ctx.beginPath();
        ctx.arc(0, -rad * 0.85, rad * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath(); ctx.arc(0, 0, R * 0.25, 0, Math.PI * 2); ctx.fill();
  }

  const MEADOW_LEVELS = [
    { level: 1, name: 'Spring Awakening', icon: '🌸', targetBlooms: 5, serenityBonus: 25, badge: '🌱 Meadow Seeder', context: 'The morning dew nourishes fresh sprouts. Mindful care roots your inner strength and creates a peaceful beginning.' },
    { level: 2, name: 'Summer Sunfire', icon: '🌻', targetBlooms: 12, serenityBonus: 40, badge: '🌻 Solar Blossom', context: 'Warm sunlight expands your garden canopy. Generosity and joyful energy radiate to all creatures.' },
    { level: 3, name: 'Autumn Harvest', icon: '🍂', targetBlooms: 20, serenityBonus: 60, badge: '🍂 Gratitude Harvester', context: 'Golden foliage drifts softly as rain stars fall. You reap courage and deep mindfulness from each experience.' },
    { level: 4, name: 'Winter Frost Bloom', icon: '❄️', targetBlooms: 28, serenityBonus: 85, badge: '❄️ Frost Conqueror', context: 'Through external winter frost, steady inner warmth and resilience thrive unshakeable.' },
    { level: 5, name: 'Cosmic Sanctuary', icon: '🌌', targetBlooms: 40, serenityBonus: 120, badge: '🌌 Master Botanist', context: 'You have achieved complete harmonic resilience! The eternal celestial meadow shines with infinite peace.' },
  ];

  /* ── 2-Minute Session Challenge & Level Progression Modal ── */
  function celebrate2MinSession() {
    confetti();
    buzz([30, 80, 120]);
    G().level = G().level || 1;
    const curLvlIdx = Math.min(MEADOW_LEVELS.length - 1, G().level - 1);
    const curLvl = MEADOW_LEVELS[curLvlIdx];
    const leveledUp = G().level < MEADOW_LEVELS.length;
    if (leveledUp) {
      G().level++;
    }
    const nextLvl = MEADOW_LEVELS[Math.min(MEADOW_LEVELS.length - 1, G().level - 1)];

    G().serenity += curLvl.serenityBonus;
    persist(); hud();

    modal(`
      <div style="text-align:center;padding:14px 6px;color:#ffffff">
        <div style="font-size:48px;margin-bottom:6px">${curLvl.icon}✨</div>
        <div style="display:inline-block;background:linear-gradient(135deg,#3366FF,#8a2eae);color:#fff;font-weight:800;font-size:11px;padding:3px 12px;border-radius:999px;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">
          ${curLvl.badge} · LEVEL ${curLvl.level} COMPLETE!
        </div>
        <h3 style="font-size:21px;font-weight:800;color:#ffd700;margin:0 0 6px">${curLvl.name} Mastered</h3>
        <p style="font-size:13.5px;line-height:1.6;color:rgba(255,255,255,0.9);margin:6px 0 14px;font-style:italic">
          “${curLvl.context}”
        </p>

        <div style="background:rgba(255,255,255,0.08);backdrop-filter:blur(16px);border:1.5px solid rgba(51,102,255,0.4);border-radius:18px;padding:14px;margin-bottom:16px;text-align:left">
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:rgba(255,255,255,0.9)"><span>🌸 Total Blooms Nourished:</span><b>${G().blooms}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:rgba(255,255,255,0.9)"><span>🌟 Giant Sky Blooms:</span><b>${G().megaBlooms || 0}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:rgba(255,255,255,0.9)"><span>⭐ Rain Stars Caught:</span><b>${G().rainStars || 0}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:rgba(255,255,255,0.9)"><span>🐛 Creatures Hydrated:</span><b>${(G().wormsHydrated || 0) + (G().antsHydrated || 0)}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:#6ec1ff;border-top:1px dashed rgba(255,255,255,0.15);margin-top:6px;padding-top:8px"><span>💜 Resilience Serenity Earned:</span><b>+${curLvl.serenityBonus} Serenity</b></div>
        </div>

        <div class="modal-btns" style="display:flex;flex-direction:column;gap:8px">
          ${leveledUp ? `<button class="btn btn-primary btn-block" id="meadow-advance" style="background:linear-gradient(135deg,#3366FF,#8a2eae);color:#fff;font-weight:800;font-size:14px">Advance to Level ${nextLvl.level}: ${nextLvl.name} 🚀</button>` : ''}
          <button class="btn ${leveledUp ? 'btn-ghost' : 'btn-primary'} btn-block" id="meadow-continue">Keep Gardening 🌸</button>
          <button class="btn btn-ghost btn-block" onclick="closeModal()">Back to Games Hub</button>
        </div>
      </div>
    `);

    $('#meadow-advance')?.addEventListener('click', () => {
      sessionStart = Date.now();
      missionCompleteSeen = false;
      closeModal();
      toast(`Level ${nextLvl.level}: ${nextLvl.name} Unlocked! 🌸`);
    });

    $('#meadow-continue')?.addEventListener('click', () => {
      sessionStart = Date.now();
      missionCompleteSeen = false;
      closeModal();
      toast('Enjoy your peaceful garden 🌿');
    });
  }

  /* ── Main Frame Loop ─────────────────────────────────────── */
  function frame(ts) {
    if (!mounted) return;
    const dt = Math.min(50, ts - last || 16);
    last = ts;
    t += dt;
    const now = Date.now();

    // Auto season cycle every SEASON_MS (45s)
    if (now - seasonStart > SEASON_MS) {
      currentSeasonIndex = (currentSeasonIndex + 1) % SEASONS.length;
      seasonStart = now;
      initSeasonalParticles();
      const name = SEASON_NAMES[getSeason()];
      toast(`Season transitioned to ${name} 🍃`, 2600);
      hud();
      persist();
    }

    // 2-Minute Countdown Challenge Timer
    const elapsed = now - sessionStart;
    const remaining = Math.max(0, MISSION_LIMIT_MS - elapsed);
    const tEl = $('#m-timer');
    if (tEl) tEl.textContent = fmtClock(remaining);

    if (remaining <= 0 && !missionCompleteSeen) {
      missionCompleteSeen = true;
      celebrate2MinSession();
    }

    tickTimer();

    // Spawners
    if (now > nextFlyAt) { spawnFly(now); nextFlyAt = now + rnd(4000, 9000); }
    if (now > nextWormAt) { spawnWorm(now); nextWormAt = now + rnd(6000, 12000); }
    if (now > nextAntAt) { spawnAnt(now); nextAntAt = now + rnd(5000, 11000); }

    updateFlies(now, dt);
    updateWorms(now);
    updateAnts(now, dt);
    updateRain(now, dt);
    updateSeasonalParticles(dt);

    // Flower Hydration & Backward Shrink Dynamics
    const isRaining = now < rainUntil;
    for (const f of flowers) {
      if (!isRaining) {
        f.hydration = Math.max(0, (f.hydration != null ? f.hydration : 1.0) - (dt / 26000));
        // If completely dry, the flower grows backwards (shrinks)!
        if (f.hydration <= 0) {
          f.water = Math.max(0, (f.water || 0) - (dt / 18000));
          if (f.water === 0 && (f.growthTier || 1) > 1) {
            f.growthTier = Math.max(1, f.growthTier - (dt / 14000));
          }
        }
      }
    }

    // Season-Specific Sky Palettes
    const season = getSeason();
    let skyTop, skyBot, grassTop, grassBot;
    if (season === 'spring') {
      skyTop = '#74c0fc'; skyBot = '#e8f4f8';
      grassTop = '#38b000'; grassBot = '#1f5f22';
    } else if (season === 'summer') {
      skyTop = '#3a86ff'; skyBot = '#cbf3f0';
      grassTop = '#2d7a46'; grassBot = '#1b4332';
    } else if (season === 'autumn') {
      skyTop = '#e07a5f'; skyBot = '#fcd5ce';
      grassTop = '#7f5539'; grassBot = '#4a2800';
    } else { // winter
      skyTop = '#1d3557'; skyBot = '#a8dadc';
      grassTop = '#457b9d'; grassBot = '#1d3557';
    }

    // Sky Render
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY());
    skyGrad.addColorStop(0, skyTop);
    skyGrad.addColorStop(1, skyBot);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, groundY());

    // Sun / Moon in sky
    ctx.save();
    if (season === 'winter') {
      // Winter Pale Moon
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = '#e2e8f0';
      ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.arc(W * 0.82, H * 0.16, 24, 0, Math.PI * 2); ctx.fill();
    } else {
      // Golden Sun
      ctx.fillStyle = '#ffd166';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.arc(W * 0.82, H * 0.16, 26, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();

    // Grass & Soil
    const gy = groundY();
    const grassGrad = ctx.createLinearGradient(0, gy - 20, 0, gy + 14);
    grassGrad.addColorStop(0, grassTop);
    grassGrad.addColorStop(1, grassBot);
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, gy - 16, W, 22);

    const soilGrad = ctx.createLinearGradient(0, gy, 0, H);
    soilGrad.addColorStop(0, '#3d2614');
    soilGrad.addColorStop(0.5, '#241408');
    soilGrad.addColorStop(1, '#120803');
    ctx.fillStyle = soilGrad;
    ctx.fillRect(0, gy, W, H - gy);

    // Soil Pebbles & Texture
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    for (let i = 0; i < 18; i++) {
      const px = (i * 53) % W;
      const py = gy + 8 + ((i * 37) % (H - gy - 12));
      ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI * 2); ctx.fill();
    }

    // Draw Seasonal Falling Petals / Snow / Leaves
    drawSeasonalParticles();

    // Draw Rainbow & Rain / Snow
    drawRain();

    // Draw Flowers
    for (const f of flowers) {
      const gr = growth(f, now);
      const hp = headPos(f, now);

      // Check if bloomed for first time
      if (!f.bloomed && gr >= 1) {
        f.bloomed = true;
        f.bloomAt = now;
        G().blooms++;
        G().serenity += 5;
        burst(hp.x, hp.y, 'petal', 14);
        bloomChime(); buzz(12);
        addPopup(hp.x, hp.y - 12, '+5 🌸 Blooming!', '#ffd166');
        persist(); hud();
      }

      // Check if reached the sky (Giant Sky Bloom)
      if (!f.isMega && (hp.y <= H * 0.22 || (f.growthTier || 1) >= 5)) {
        f.isMega = true;
        G().megaBlooms = (G().megaBlooms || 0) + 1;
        G().serenity += 25;
        G().blooms += 2;
        burst(hp.x, hp.y, 'spark', 32);
        megaChime();
        buzz([30, 70, 100]);
        addPopup(hp.x, hp.y - 24, '+50 🌟 GIANT SKY BLOOM!', '#ffd700');
        toast('Incredible! Your flower reached the sky! +50 Serenity 🌟✨', 3500);
        persist(); hud();
      }

      // Stem Base Ground Shadow
      ctx.fillStyle = 'rgba(10, 5, 2, 0.4)';
      ctx.beginPath();
      ctx.ellipse(f.x * W, gy + 2, (8 + gr * 3) * hp.scale, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Flower Stem
      const stemColor = hp.isWilted ? '#8a7a40' : f.isMega ? '#38b000' : '#4f9d44';
      ctx.strokeStyle = stemColor;
      ctx.lineWidth = Math.min(8.5, (2.8 + gr * 1.8) * hp.scale);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(f.x * W, gy);
      ctx.quadraticCurveTo(f.x * W + hp.sway * 0.5, gy - hp.stemH * 0.5, hp.x, hp.y);
      ctx.stroke();

      // Stem Leaves
      if (gr > 0.35) {
        const leafY = gy - hp.stemH * 0.45;
        const leafX = f.x * W + hp.sway * 0.4;
        const leafScale = Math.min(1.8, gr) * hp.scale;

        ctx.fillStyle = stemColor;
        ctx.beginPath();
        ctx.ellipse(leafX - 10 * hp.scale, leafY, 9 * leafScale, 4.8, hp.isWilted ? 0.2 : -0.42, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(leafX + 10 * hp.scale, leafY - 5, 9 * leafScale, 4.8, hp.isWilted ? 0.3 : 0.42, 0, Math.PI * 2);
        ctx.fill();
      }

      // Thirst indicator if dry / shrinking
      if (hp.isWilted) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 10px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.beginPath();
        ctx.roundRect(hp.x - 24, hp.y - 28, 48, 15, 6);
        ctx.fill();
        ctx.fillStyle = '#0284c7';
        ctx.fillText('💧 Thirsty!', hp.x, hp.y - 17);
        ctx.restore();
      }

      // Flower Crown
      ctx.save();
      ctx.translate(hp.x, hp.y);

      if (f.isMega) {
        const haloPulse = Math.sin(t / 200) * 4;
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 22 + haloPulse;
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.88)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, (26 + haloPulse) * hp.scale, 0, Math.PI * 2);
        ctx.stroke();
      }

      const col = COLORS[f.ci % COLORS.length];
      const sp = SPECIES[f.sp % SPECIES.length];
      const crownR = Math.min(56, (18 + (f.growthTier || 1) * 5.5) * Math.min(1.65, gr) * hp.scale);

      if (gr < 0.45) {
        // Sprout Bud
        ctx.fillStyle = hp.isWilted ? '#a39045' : '#70e000';
        ctx.beginPath(); ctx.ellipse(0, 0, 7 * hp.scale, 11 * hp.scale, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(0, -7 * hp.scale, 3.5 * hp.scale, 0, Math.PI * 2); ctx.fill();
      } else {
        if (sp === 'daisy') drawDaisy(crownR, col);
        else if (sp === 'tulip') drawTulip(crownR, col);
        else if (sp === 'sunflower') drawSunflower(crownR, col);
        else if (sp === 'rose') drawRose(crownR, col);
        else if (sp === 'lavender') drawLavender(crownR, col);
        else if (sp === 'pompom') drawPompom(crownR, col);
        else if (sp === 'orchid') drawOrchid(crownR, col);
        else if (sp === 'lotus') drawLotus(crownR, col);
        else if (sp === 'marigold') drawMarigold(crownR, col);
        else if (sp === 'hope') drawHopeFlower(crownR, col);
        else drawDaisy(crownR, col);
      }

      ctx.restore();
    }

    // Draw Worms, Ants & Butterflies
    drawWorms(now);
    drawAnts(now);
    for (const fl of flies) drawFly(fl);

    // Draw Particles
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      p.life -= p.decay;
      ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.6, p.r * p.life), 0, Math.PI * 2);
      ctx.fill();
    }
    parts = parts.filter(p => p.life > 0);

    // Draw Floating Popups
    for (const pp of popups) {
      pp.y += pp.vy;
      pp.life -= 0.022;
      ctx.globalAlpha = Math.max(0, pp.life);
      ctx.fillStyle = pp.color;
      ctx.font = '700 12.5px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(pp.text, pp.x, pp.y);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;

    raf = requestAnimationFrame(frame);
  }

  /* ── Interaction Handlers ────────────────────────────────── */
  function handlePointer(clientX, clientY) {
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const x = clientX - r.left, y = clientY - r.top;
    const now = Date.now();

    // 1) Check Rain Stars click
    for (const st of rainStars) {
      if (!st.collected && Math.hypot(st.x - x, st.y - y) < st.size * 2) {
        st.collected = true;
        G().rainStars = (G().rainStars || 0) + 1;
        G().serenity += 5;
        starChime(); buzz([15, 45]);
        burst(st.x, st.y, 'spark', 24);
        addPopup(st.x, st.y - 10, '+5 ⭐ Star Caught!', '#ffd700');
        persist(); hud();
        return;
      }
    }

    // 2) Check Thirsty Worms
    for (const w of worms) {
      if (!w.hydrated && Math.hypot(w.x - x, w.y - y) < 32) {
        w.hydrated = true;
        w.downAt = now + 1800;
        G().wormsHydrated = (G().wormsHydrated || 0) + 1;
        G().serenity += 3;
        wormChime(); buzz(16);
        burst(w.x, w.y - 8, 'drop', 14);
        addPopup(w.x, w.y - 20, '+3 💧 Worm Hydrated!', '#6ec1ff');
        toast('Given cool water to garden worm · Thriving soil! 💧🐛', 2200);
        persist(); hud();
        return;
      }
    }

    // 3) Check Ants
    for (const a of ants) {
      if (!a.hydrated && Math.hypot(a.x - x, a.y - y) < 26) {
        a.hydrated = true;
        G().antsHydrated = (G().antsHydrated || 0) + 1;
        G().serenity += 2;
        antChime(); buzz(12);
        burst(a.x, a.y, 'drop', 10);
        addPopup(a.x, a.y - 16, '+2 💧 Ant Hydrated!', '#00b4d8');
        toast('Given water dewdrop to ant · Soil aerated 🌱🐜', 2200);
        if (flowers.length) {
          const nearest = flowers.reduce((best, f) => Math.abs(f.x * W - a.x) < Math.abs(best.x * W - a.x) ? f : best, flowers[0]);
          nearest.water = Math.min(1.8, (nearest.water || 0) + 0.35);
          nearest.hydration = 1.0;
        }
        persist(); hud();
        return;
      }
    }

    // 4) Check Butterflies
    for (const fl of flies) {
      if (Math.hypot(fl.x - x, fl.y - y) < 32) {
        const pts = fl.isHope ? 10 : 5;
        G().serenity += pts;
        flyChime(); buzz(14);
        burst(fl.x, fl.y, 'spark', 18);
        addPopup(fl.x, fl.y - 16, `+${pts} 🦋 Nectar Shared!`, '#ffd700');
        persist(); hud();
        return;
      }
    }

    // 5) Check Flowers & Stems
    let hitFlower = false;
    for (const f of flowers) {
      const hp = headPos(f, now);
      const distHead = Math.hypot(hp.x - x, hp.y - y);
      const nearStem = Math.abs(hp.x - x) < 24 && y > hp.y && y < groundY() + 6;

      if (distHead < 38 || nearStem) {
        hitFlower = true;
        f.water = Math.min(2.2, (f.water || 0) + 0.3);
        f.hydration = 1.0;
        f.growthTier = Math.min(6, (f.growthTier || 1) + 0.4);
        f.lastWateredAt = now;
        waterChime(); buzz(10);
        burst(hp.x, hp.y, 'drop', 10);
        addPopup(hp.x, hp.y - 16, '💧 Watered & Growing!', '#6ec1ff');
        persist(); hud();
        break;
      }
    }

    // 6) Plant New Flower on Ground
    if (!hitFlower && y > groundY() - 35) {
      if (flowers.length >= MAX_FLOWERS) {
        const old = flowers.findIndex(f => f.bloomed && !f.isMega);
        const idx = old >= 0 ? old : 0;
        flowers.splice(idx, 1);
      }

      const speciesIndex = Math.floor(Math.random() * SPECIES.length);
      const colorIndex = Math.floor(Math.random() * COLORS.length);
      const baseScale = rnd(0.75, 1.18); // Varied delicate sizing

      flowers.push({
        x: Math.max(0.06, Math.min(0.94, x / W)),
        ci: colorIndex,
        sp: speciesIndex,
        ph: rnd(0, Math.PI * 2),
        plantedAt: now,
        water: 0.25,
        growthTier: 1,
        bloomed: false,
        hydration: 1.0,
        baseScale,
      });

      plantChime(); buzz(12);
      burst(x, groundY(), 'leaf', 10);
      addPopup(x, groundY() - 14, `🌱 Planted ${SPECIES[speciesIndex]}!`, '#70e000');
      persist(); hud();
    }
  }

  function burst(x, y, type = 'spark', count = 16) {
    for (let i = 0; i < count; i++) {
      const a = rnd(0, Math.PI * 2), sp = rnd(1, 4.5);
      parts.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1,
        life: 1,
        decay: rnd(0.02, 0.045),
        r: rnd(2, 4.5),
        c: type === 'spark' ? pick(['#ffd700', '#fff3b0', '#ffffff']) :
           type === 'drop' ? pick(['#38bdf8', '#0284c7', '#e0f2fe']) :
           pick(['#4ade80', '#22c55e', '#86efac']),
      });
    }
  }

  /* ── Lifecycle ───────────────────────────────────────────── */
  function resize() {
    if (!canvas) return;
    dpr = Math.min(2, globalThis.devicePixelRatio || 1);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function mount() {
    stop();
    canvas = $('#meadow');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    mounted = true;

    sessionStart = Date.now();
    lastCheckpoint = sessionStart;
    seasonStart = sessionStart;
    nextNaturalRainAt = sessionStart + rnd(35000, 60000);
    missionCompleteSeen = false;
    currentSeasonIndex = SEASONS.indexOf(G().season || 'spring');
    if (currentSeasonIndex < 0) currentSeasonIndex = 0;

    // Load persisted flowers
    flowers = (G().flowers || []).map(f => ({
      x: f.x, ci: f.ci, sp: f.sp != null ? f.sp : Math.floor(Math.random() * SPECIES.length),
      ph: rnd(0, Math.PI * 2),
      plantedAt: f.plantedAt || sessionStart,
      water: f.water || 0.2,
      growthTier: f.growthTier || 1,
      bloomed: !!f.bloomed,
      isMega: !!f.isMega,
      hydration: f.hydration != null ? f.hydration : 1.0,
      lastWateredAt: f.lastWateredAt || sessionStart,
      baseScale: f.baseScale || rnd(0.75, 1.15),
    }));

    // Seed default flowers if empty
    if (!flowers.length) {
      for (let i = 0; i < 6; i++) {
        flowers.push({
          x: 0.12 + i * 0.15,
          ci: i % COLORS.length,
          sp: i % SPECIES.length,
          ph: rnd(0, Math.PI * 2),
          plantedAt: sessionStart - (i * 4000),
          water: 0.35,
          growthTier: 1 + (i % 3),
          bloomed: true,
          hydration: 1.0,
          baseScale: rnd(0.8, 1.12),
        });
      }
      persist();
    }

    resize();
    initSeasonalParticles();
    hud();

    canvas.addEventListener('pointerdown', e => {
      handlePointer(e.clientX, e.clientY);
    });

    window.addEventListener('resize', resize);

    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (!mounted && !canvas) return;
    mounted = false;
    cancelAnimationFrame(raf);
    persist();
    window.removeEventListener('resize', resize);
    canvas = null; ctx = null;
    flowers = []; parts = []; flies = []; worms = []; ants = []; popups = []; drops = []; ripples = []; rainStars = [];
  }

  return { mount, stop, triggerRain, cycleSeason, getSeason };
})();

window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#/game')) MMGame.stop(); });

/* ── Moja Meadow Screen ────────────────────────────────────── */
routes.game = () => {
  render(`
    ${header('Moja Meadow 🌸🌱', { backTo: '#/games' })}
    <div class="body-pad meadow-pad">
      <div class="meadow-hud">
        <span class="hud-chip" style="background:rgba(51,102,255,0.18);border-color:rgba(51,102,255,0.4)">🌸 <b>Lvl ${S.game?.level || 1}/5</b></span>
        <span class="hud-chip" title="Flowers bloomed">🌸 <b id="m-blooms">${S.game?.blooms || 0}</b></span>
        <span class="hud-chip" title="Serenity Points">💜 <b id="m-ser">${S.game?.serenity || 0}</b></span>
        <button class="hud-chip hud-btn" id="m-season-btn" title="Cycle Season (Spring, Summer, Autumn, Winter)">🍂 <span id="m-season">🌸 Spring</span></button>
        <span class="hud-chip timer-chip" title="2-Minute Countdown Challenge">⏳ <span id="m-timer">2:00</span></span>
        <button class="hud-chip hud-btn" id="m-rain" title="Summon Rain Shower & Catch Falling Stars">🌧️ Rain</button>
        <button class="hud-chip hud-btn" id="m-sound" aria-pressed="${S.game?.sound}">${S.game?.sound ? '🔔 Sound' : '🔕 Mute'}</button>
        <button class="hud-chip hud-btn" id="m-clear">🌱 New</button>
      </div>
      <div class="meadow-frame">
        <canvas id="meadow" aria-label="Moja Meadow — tap to water flowers, hydrate creatures, and catch rain stars"></canvas>
      </div>
      <div class="meadow-actions" style="margin-top:10px;display:flex;gap:8px">
        <button class="btn btn-outline btn-block" onclick="nav('#/games')">🎮 All Games Hub</button>
        <button class="btn btn-primary btn-block" style="background:linear-gradient(135deg,#ffb703,#f3256b);color:#fff" onclick="nav('#/game3d')">🐝 Play Moja Bee 3D</button>
      </div>
      <p class="meadow-hint">
        <b>Care for all creatures</b>: Water thirsty worms (<b>💧 +3</b>) · Hydrate ants (<b>💧 +2</b>) · Offer nectar to butterflies (<b>💧 +5/+10</b>) · <b>Water flowers or they gently shrink</b> · Reach the sky for <b>Giant Sky Bloom (+50 🌟)</b> · Tap <b>🌧️ Rain</b> to shower &amp; catch <b>Rain Stars (⭐ +5)</b>!
      </p>
    </div>
  `);

  $('#m-season-btn')?.addEventListener('click', () => {
    MMGame.cycleSeason();
  });

  $('#m-rain')?.addEventListener('click', () => {
    MMGame.triggerRain();
  });

  $('#m-sound')?.addEventListener('click', () => {
    S.game.sound = !S.game.sound; save();
    const b = $('#m-sound');
    b.textContent = S.game.sound ? '🔔 Sound' : '🔕 Mute';
    b.setAttribute('aria-pressed', S.game.sound);
    toast(S.game.sound ? 'Meadow sounds on 🎵' : 'Meadow sounds off 🔕');
  });

  $('#m-clear')?.addEventListener('click', () => {
    S.game.flowers = []; save();
    MMGame.mount();
    toast('A fresh meadow awaits 🌱');
  });

  MMGame.mount();
};
