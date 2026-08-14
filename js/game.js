/* ============================================================
   MojaMind — Moja Meadow 🌸🌱🌧️
   A compassionate, peaceful interactive garden game with rich
   botanical visuals and generous sky room to grow.
 
   - 3-Minute Session Countdown starting @ 3:00 and counting down.
   - We NEVER harm creatures: we give water and nourishment!
   - Tap thirsty worms to give cool dewdrops (**+3 💧 Worm Hydrated**).
   - Offer sweet nectar to butterflies (**+5 🦋** or **+10 🌟**).
   - Hydrate garden ants (**+2 💧 Ant Hydrated**) as they carry seeds.
   - Tap flowers & stems repeatedly to water them, growing taller & larger!
   - Reach high into the sky for the **Giant Sky Bloom (+50 🌟 BONUS)**!
   - If unwatered, flowers dry out and grow backwards (shrink) until refreshed!
   - Tap **🌧️ Rain** for summer showers: all flowers drink & grow automatically!
   - Catch glowing **Rain Stars (⭐ +5)** falling during the rain shower!
 
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.today
   ============================================================ */
'use strict';

const MMGame = (() => {
  const COLORS = ['#00a651', '#f58220', '#ed1c24', '#2e3192', '#f3256b', '#8a2eae', '#ffd166', '#3f6ad8', '#ffd700'];
  const SPECIES = ['bloom', 'daisy', 'tulip', 'pompom', 'hope'];
  const PENTA = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.26];
  const MAX_FLOWERS = 18;
  const GROW_MS = 36000;           // seed → bloom, unwatered
  const DAY_MS = 180000;           // full day/night cycle
  const CHECKPOINT_MS = 15000;     // checkpoint interval
  const MISSION_LIMIT_MS = 120000; // 2-Minute Session Countdown (120s)

  let canvas = null, ctx = null, W = 0, H = 0, dpr = 1;
  let raf = 0, last = 0, t = 0, mounted = false;
  let flowers = [], parts = [], flies = [], worms = [], ants = [], popups = [];
  let stars = [], bugs = [], shooters = [];
  let nextFlyAt = 0, nextWormAt = 0, nextAntAt = 0;
  let rainUntil = 0, rainbowUntil = 0, nextRainAt = 0, drops = [], ripples = [], rainStars = [];
  let sessionStart = 0, lastCheckpoint = 0;
  let missionCompleteSeen = false;
  let ac = null;

  const G = () => {
    if (!S.game) S.game = { blooms: 0, serenity: 0, sound: true, flowers: [], totalPlayMs: 0, wormsHydrated: 0, antsHydrated: 0, megaBlooms: 0, rainStars: 0 };
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

  function fmtLifetime(ms) {
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return 'just started';
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
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

  function pluck(freq, vol = .1, dur = .6, type = 'triangle') {
    const a = audio(); if (!a) return;
    try {
      const o = a.createOscillator(), gn = a.createGain();
      o.type = type; o.frequency.value = freq;
      gn.gain.setValueAtTime(vol, a.currentTime);
      gn.gain.exponentialRampToValueAtTime(.0001, a.currentTime + dur);
      o.connect(gn); gn.connect(a.destination);
      o.start(); o.stop(a.currentTime + dur + .05);
    } catch { /* audio safeguard */ }
  }

  const tapChime     = () => pluck(pick(PENTA.slice(4)), .06, .4);
  const plantChime   = () => pluck(pick(PENTA.slice(0, 3)), .1, .5);
  const waterChime   = () => pluck(880, .06, .22, 'sine');
  const wormChime    = () => [440, 554.37, 659.26].forEach((f, i) => setTimeout(() => pluck(f, .07, .3, 'sine'), i * 65));
  const bloomChime   = () => { pluck(392, .1); setTimeout(() => pluck(523.25, .1), 120); };
  const megaChime    = () => [523.25, 659.26, 783.99, 1046.5].forEach((f, i) => setTimeout(() => pluck(f, .12, .6, 'sine'), i * 80));
  const flyChime     = () => [523.25, 659.26, 783.99].forEach((f, i) => setTimeout(() => pluck(f, .09), i * 90));
  const antChime     = () => pluck(1174.66, .08, .15, 'sine');
  const starChime    = () => [783.99, 1046.5, 1318.5].forEach((f, i) => setTimeout(() => pluck(f, .1, .4, 'triangle'), i * 60));
  const buzz         = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch { /* no haptics */ } };

  /* ── Persistence ─────────────────────────────────────────── */
  function persist() {
    G().flowers = flowers.map(f => ({
      x: f.x, ci: f.ci, sp: f.sp, plantedAt: f.plantedAt,
      water: f.water, bloomed: f.bloomed, growthTier: f.growthTier || 1,
      isMega: !!f.isMega, hydration: f.hydration != null ? f.hydration : 1.0,
      lastWateredAt: f.lastWateredAt || Date.now(),
    }));
    save();
  }

  function hud() {
    const b = $('#m-blooms'), s = $('#m-ser');
    if (b) b.textContent = G().blooms;
    if (s) s.textContent = G().serenity;
  }

  function tickTimer() {
    const now = Date.now();
    if (now - lastCheckpoint >= CHECKPOINT_MS) {
      G().totalPlayMs = (G().totalPlayMs || 0) + (now - lastCheckpoint);
      lastCheckpoint = now;
      save();
    }
    const lEl = $('#m-lifetime'); if (lEl) lEl.textContent = fmtLifetime((G().totalPlayMs || 0) + (now - lastCheckpoint));
  }

  /* ── Geometry & Generous Space Growth Engine ─────────────── */
  // Ground lowered to 85% to give generous headroom for massive sky growth!
  const groundY = () => H * 0.85;

  function growth(f, now) {
    const base = Math.min(1, (now - f.plantedAt) / GROW_MS + (f.water || 0));
    const tierBonus = ((f.growthTier || 1) - 1) * 0.32;
    return Math.min(3.2, Math.max(0.15, base + tierBonus));
  }

  function headPos(f, now) {
    const gr = growth(f, now);
    const baseHeight = H * 0.18;
    const maxHeight = H * 0.68; // Flowers reach up to 68% of the tall canvas!
    const stemH = Math.min(maxHeight, baseHeight * (0.35 + 0.95 * gr));
    const isWilted = (f.hydration || 1.0) < 0.25;
    const wiltTilt = isWilted ? Math.sin(t / 600) * 8 : 0;
    const sway = (calm() ? 0 : Math.sin(t / 850 + f.ph) * (4 + gr * 2.5)) + wiltTilt;
    return { x: f.x * W + sway, y: groundY() - stemH + (isWilted ? 14 : 0), stemH, sway, gr, isWilted };
  }

  /* ── Particles & Bursts ──────────────────────────────────── */
  function burst(x, y, kind, n) {
    const count = calm() ? Math.ceil(n / 2) : n;
    for (let i = 0; i < count; i++) {
      const a = rnd(0, Math.PI * 2), sp = rnd(.4, 2.5);
      parts.push({
        x, y, kind,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (kind === 'petal' ? 1.2 : kind === 'spark' ? .8 : kind === 'heart' ? 1.0 : -.6),
        life: 1, decay: rnd(.012, .028),
        c: kind === 'drop' ? '#6ec1ff' : kind === 'puff' ? '#cbb7dd' : kind === 'leaf' ? '#70e000' : kind === 'heart' ? '#ff4d6d' : pick(COLORS),
        r: kind === 'drop' ? rnd(1.5, 3.4) : kind === 'heart' ? rnd(3, 5) : rnd(2, 4.5),
        rot: rnd(0, Math.PI * 2),
      });
    }
  }

  /* ── Butterflies ─────────────────────────────────────────── */
  function spawnFly(now) {
    const bloomed = flowers.filter(f => f.bloomed);
    if (!bloomed.length || flies.length >= 3) return;
    const target = pick(bloomed);
    const isHope = Math.random() < 0.28;
    flies.push({
      x: Math.random() < .5 ? -20 : W + 20, y: rnd(H * .12, H * .45),
      target, state: 'in', restUntil: 0, flap: rnd(0, 9),
      isHope,
      c: isHope ? '#ffd700' : pick(['#f3256b', '#f58220', '#ffd166', '#ffffff']),
    });
  }

  function updateFlies(now, dt) {
    for (const fl of flies) {
      const hp = headPos(fl.target, now);
      if (fl.state === 'in') {
        const tx = hp.x + 12, ty = hp.y - 14;
        fl.x += (tx - fl.x) * Math.min(1, dt / 700);
        fl.y += (ty - fl.y) * Math.min(1, dt / 700) + (calm() ? 0 : Math.sin(t / 300 + fl.flap) * .8);
        if (Math.abs(tx - fl.x) < 6 && Math.abs(ty - fl.y) < 6) { fl.state = 'rest'; fl.restUntil = now + rnd(4000, 7000); }
      } else if (fl.state === 'rest') {
        fl.x = hp.x + 12; fl.y = hp.y - 14;
        if (now > fl.restUntil) { fl.state = 'away'; }
      } else {
        fl.y -= dt * .06; fl.x += Math.sin(t / 400 + fl.flap) * .8;
      }
    }
    flies = flies.filter(fl => fl.state !== 'away' || fl.y > -30);
  }

  function drawFly(fl) {
    const wing = Math.sin(t / 90 + fl.flap) * .7 + .3;
    ctx.save();
    ctx.translate(fl.x, fl.y);
    ctx.fillStyle = fl.c;
    ctx.globalAlpha = .95;
    if (fl.isHope) {
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 10;
    }
    ctx.save(); ctx.scale(wing, 1); ctx.beginPath(); ctx.ellipse(-5, 0, 6, 4.4, -.4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.scale(wing, 1); ctx.beginPath(); ctx.ellipse(5, 0, 6, 4.4, .4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#2b2140'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(0, 5); ctx.stroke();
    ctx.restore();
  }

  /* ── Garden Worms — Thirsty Soil Friends ─────────────────── */
  function spawnWorm(now) {
    if (worms.length >= 2) return;
    const wx = rnd(0.08, 0.92) * W;
    const wy = groundY() + rnd(8, 22);
    worms.push({
      id: 'w-' + Math.random(),
      x: wx,
      y: wy,
      upAt: now,
      downAt: now + rnd(4200, 6500),
      hydrated: false,
      hydrateAt: 0,
      wiggle: rnd(0, 9),
      bubbleText: '💧 Water please!',
    });
  }

  function updateWorms(now) {
    for (const w of worms) {
      if (now > w.downAt && !w.hydrated) {
        w.hydrated = true;
        w.hydrateAt = now - 600;
      }
    }
    worms = worms.filter(w => !w.hydrated || (now - w.hydrateAt < 600));
  }

  function drawWorms(now) {
    for (const w of worms) {
      if (w.hydrated) {
        const prog = Math.min(1, (now - w.hydrateAt) / 600);
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - prog);
        ctx.fillStyle = '#6ec1ff';
        ctx.beginPath();
        ctx.ellipse(w.x, w.y, 14 * (1 + prog * 0.5), 6 * (1 + prog * 0.5), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        continue;
      }

      const age = now - w.upAt;
      const h = Math.min(22, age * 0.045);
      const wig = Math.sin(t / 140 + w.wiggle) * 4;

      ctx.save();
      ctx.fillStyle = '#221105';
      ctx.beginPath(); ctx.ellipse(w.x, w.y, 9, 4.5, 0, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = '#ff758f';
      ctx.lineWidth = 6.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(w.x, w.y);
      ctx.quadraticCurveTo(w.x + wig, w.y - h * 0.5, w.x + wig * 0.6, w.y - h);
      ctx.stroke();

      ctx.fillStyle = '#ff4d6d';
      ctx.beginPath(); ctx.arc(w.x + wig * 0.6, w.y - h, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(w.x + wig * 0.6 - 1.5, w.y - h - 1, 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(w.x + wig * 0.6 + 1.5, w.y - h - 1, 1.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(w.x + wig * 0.6 - 1.5, w.y - h - 1, 0.7, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(w.x + wig * 0.6 + 1.5, w.y - h - 1, 0.7, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 10.5px Poppins, sans-serif';
      ctx.textAlign = 'center';
      const tw = ctx.measureText(w.bubbleText).width + 12;
      ctx.beginPath();
      ctx.roundRect(w.x + wig * 0.6 - tw / 2, w.y - h - 22, tw, 16, 8);
      ctx.fill();
      ctx.fillStyle = '#0284c7';
      ctx.fillText(w.bubbleText, w.x + wig * 0.6, w.y - h - 10);
      ctx.restore();
    }
  }

  /* ── Garden Ants — Busy Little Friends ───────────────────── */
  function spawnAnt(now) {
    if (ants.length >= 4) return;
    const climbing = Math.random() < 0.4 && flowers.filter(f => f.bloomed).length > 0;
    const targetFlower = climbing ? pick(flowers.filter(f => f.bloomed)) : null;

    ants.push({
      id: 'ant-' + Math.random(),
      x: climbing ? targetFlower.x * W : (Math.random() < 0.5 ? -15 : W + 15),
      y: groundY() + rnd(2, 14),
      dir: Math.random() < 0.5 ? 1 : -1,
      speed: rnd(0.45, 0.85),
      climbing,
      flower: targetFlower,
      stemProg: 0,
      hasLeaf: Math.random() < 0.5,
      hydrated: false,
      hydrateAt: 0,
      spin: 0,
    });
  }

  function updateAnts(now, dt) {
    for (const a of ants) {
      if (a.hydrated) {
        a.spin += 0.28;
        continue;
      }

      if (a.climbing && a.flower) {
        a.stemProg += (dt / 1000) * 0.18;
        if (a.stemProg > 0.95) a.climbing = false;
        const hp = headPos(a.flower, now);
        a.x = a.flower.x * W + Math.sin(t / 850 + a.flower.ph) * 4 * a.stemProg;
        a.y = groundY() - hp.stemH * a.stemProg;
      } else {
        a.x += a.dir * a.speed * (dt / 16);
      }
    }

    ants = ants.filter(a => {
      if (a.hydrated && now - a.hydrateAt > 1200) return false;
      return a.x > -40 && a.x < W + 40;
    });
  }

  function drawAnts(now) {
    for (const a of ants) {
      ctx.save();
      ctx.translate(a.x, a.y);
      if (a.hydrated) ctx.rotate(a.spin);
      else if (a.climbing) ctx.rotate(-Math.PI / 2);
      else if (a.dir < 0) ctx.scale(-1, 1);

      const legWalk = Math.sin(t / 60) * 3;
      ctx.strokeStyle = '#2b1b17';
      ctx.lineWidth = 1.2;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 3, 0);
        ctx.lineTo(i * 3 + 2, 4 + (i % 2 === 0 ? legWalk : -legWalk));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i * 3, 0);
        ctx.lineTo(i * 3 + 2, -4 + (i % 2 === 0 ? -legWalk : legWalk));
        ctx.stroke();
      }

      ctx.fillStyle = '#3a2016';
      ctx.beginPath(); ctx.ellipse(-5, 0, 3.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, 0, 2.2, 1.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4a281c';
      ctx.beginPath(); ctx.ellipse(4.5, 0, 2.4, 2.0, 0, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = '#2b1b17';
      ctx.lineWidth = 1.0;
      ctx.beginPath(); ctx.moveTo(6, -1); ctx.lineTo(9, -3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(6, 1); ctx.lineTo(9, 3); ctx.stroke();

      if (a.hasLeaf) {
        ctx.fillStyle = '#70e000';
        ctx.beginPath(); ctx.ellipse(3, -5, 3.5, 1.8, -0.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#6ec1ff';
        ctx.beginPath(); ctx.arc(4.5, -6, 1.2, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore();
    }
  }

  /* ── Rain, Falling Rain Stars & Rainbow ──────────────────── */
  function triggerRain() {
    rainUntil = Date.now() + 18000;   // 18s rain shower
    rainbowUntil = rainUntil + 18000; // Rainbow follows!
    toast('A gentle summer rain showers your meadow · Tap falling stars! 🌧️⭐', 3400);
    pluck(329.63, 0.08, 0.8, 'sine');
  }

  function updateRain(now, dt) {
    const isRaining = now < rainUntil;

    if (isRaining && drops.length < 90) {
      drops.push({
        x: rnd(0, W),
        y: -10,
        speed: rnd(9, 14),
        len: rnd(12, 20),
      });
    }

    if (isRaining && rainStars.length < 5 && Math.random() < 0.035) {
      rainStars.push({
        id: 'star-' + Math.random(),
        x: rnd(20, W - 20),
        y: -15,
        speedY: rnd(1.2, 2.2),
        speedX: rnd(-0.4, 0.4),
        rot: rnd(0, Math.PI * 2),
        spin: rnd(0.02, 0.05),
        size: rnd(12, 17),
        color: Math.random() < 0.5 ? '#ffd700' : '#6ec1ff',
        collected: false,
      });
    }

    for (const d of drops) {
      d.y += d.speed;
      d.x += 1.2;
      if (d.y >= groundY()) {
        ripples.push({ x: d.x, y: groundY() + rnd(-2, 12), r: 1, maxR: rnd(5, 10), life: 1 });
      }
    }
    drops = drops.filter(d => d.y < groundY());

    for (const rp of ripples) {
      rp.r += 0.4;
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
        f.water = Math.min(1.6, (f.water || 0) + 0.01);
      }
    }
  }

  function drawRain() {
    ctx.strokeStyle = 'rgba(160, 210, 255, 0.75)';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    for (const d of drops) {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + 1.5, d.y + d.len);
      ctx.stroke();
    }

    for (const rp of ripples) {
      ctx.strokeStyle = `rgba(140, 200, 255, ${Math.max(0, rp.life * 0.8)})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(rp.x, rp.y, rp.r * 1.6, rp.r * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (const st of rainStars) {
      ctx.save();
      ctx.translate(st.x, st.y);
      ctx.rotate(st.rot);
      ctx.fillStyle = st.color;
      ctx.shadowColor = st.color;
      ctx.shadowBlur = 14;

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
      ctx.beginPath(); ctx.arc(0, 0, st.size * 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    const now = Date.now();
    if (now >= rainUntil && now < rainbowUntil) {
      const alpha = Math.min(0.65, (rainbowUntil - now) / 6000);
      ctx.save();
      ctx.globalAlpha = alpha;
      const rainbowColors = ['#e02043', '#f58220', '#ffd166', '#00a651', '#3f6ad8', '#8a2eae'];
      const cx = W / 2, cy = H * 0.95;
      for (let i = 0; i < rainbowColors.length; i++) {
        ctx.strokeStyle = rainbowColors[i];
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.arc(cx, cy, H * 0.65 + i * 4.8, Math.PI * 1.05, Math.PI * 1.95);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  /* ── Enhanced Botanical Flower Renderers ─────────────────── */
  function drawBloom(R, col) {
    const darkCol = darken(col, 25);
    const lightCol = lighten(col, 30);
    // 6 Lush Overlapping Velvety Petals
    for (let k = 0; k < 6; k++) {
      ctx.save(); ctx.rotate(k * Math.PI / 3);
      const radGrad = ctx.createRadialGradient(0, -R * 0.5, 2, 0, -R * 0.8, R);
      radGrad.addColorStop(0, lightCol);
      radGrad.addColorStop(0.7, col);
      radGrad.addColorStop(1, darkCol);
      ctx.fillStyle = radGrad;
      ctx.beginPath(); ctx.ellipse(0, -R * .95, R * .52, R * .92, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    // Golden Stamen Disc & Pollen Specks
    ctx.fillStyle = '#ffb703';
    ctx.beginPath(); ctx.arc(0, 0, R * .44, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, R * .20, 0, Math.PI * 2); ctx.fill();
    // Dewdrop glint
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath(); ctx.arc(-R * 0.35, -R * 0.6, 2.2, 0, Math.PI * 2); ctx.fill();
  }

  function drawDaisy(R, col) {
    // 16 Detailed Slender Ray Florets
    for (let k = 0; k < 16; k++) {
      ctx.save(); ctx.rotate(k * Math.PI / 8);
      ctx.fillStyle = k % 2 === 0 ? col : lighten(col, 18);
      ctx.beginPath(); ctx.ellipse(0, -R * 1.05, R * .20, R * 1.0, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    // Rich Textured Amber Core
    ctx.fillStyle = '#6f3d05';
    ctx.beginPath(); ctx.arc(0, 0, R * .44, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffbe0b';
    for (let j = 0; j < 8; j++) {
      const a = (j / 8) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(Math.cos(a) * R * 0.28, Math.sin(a) * R * 0.28, 1.6, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawTulip(R, col) {
    const darkCol = darken(col, 20);
    const lightCol = lighten(col, 25);
    const petal = (rot, scaleX) => {
      ctx.save(); ctx.rotate(rot);
      const grad = ctx.createLinearGradient(0, 0, 0, -R * 1.2);
      grad.addColorStop(0, darkCol);
      grad.addColorStop(0.6, col);
      grad.addColorStop(1, lightCol);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.ellipse(0, -R * .82, R * .38 * scaleX, R * .84, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };
    petal(-.28, 0.95); petal(.28, 0.95); petal(0, 1.15); // Layered Cup
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.arc(0, -R * 0.15, R * 0.22, 0, Math.PI * 2); ctx.fill();
  }

  function drawPompom(R, col) {
    for (let ring = 0; ring < 3; ring++) {
      const petals = ring === 0 ? 8 : ring === 1 ? 14 : 20;
      const rad = R * (.38 + ring * .28);
      ctx.fillStyle = ring === 2 ? lighten(col, 24) : ring === 1 ? col : darken(col, 15);
      for (let k = 0; k < petals; k++) {
        const a = (k / petals) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * rad, Math.sin(a) * rad, R * .24, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.arc(0, 0, R * .32, 0, Math.PI * 2); ctx.fill();
  }

  function drawHopeFlower(R, col) {
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 20;
    // Radiant Star Petals
    for (let k = 0; k < 8; k++) {
      ctx.save(); ctx.rotate(k * Math.PI / 4);
      const grad = ctx.createLinearGradient(0, 0, 0, -R * 1.3);
      grad.addColorStop(0, '#ff9e00');
      grad.addColorStop(0.5, '#ffd700');
      grad.addColorStop(1, '#ffffff');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.ellipse(0, -R * 1.08, R * .44, R * 1.05, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, R * .46, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.arc(0, 0, R * .24, 0, Math.PI * 2); ctx.fill();
  }

  /* ── 2-Minute Session Challenge Celebration ──────────────── */
  function celebrate2MinSession() {
    confetti();
    buzz([30, 80, 120]);
    G().serenity += 25;
    persist(); hud();

    modal(`
      <div style="text-align:center;padding:12px 4px">
        <div style="font-size:46px;margin-bottom:8px">🌸✨</div>
        <h3 style="font-size:20px;font-weight:800;color:var(--ink)">2-Minute Meadow Retreat Complete!</h3>
        <p style="font-size:13.5px;line-height:1.6;color:var(--ink-soft);margin:6px 0 14px">
          You spent 2 peaceful minutes caring for nature, hydrating creatures, and helping flowers reach the sky.
        </p>
        <div style="background:#faf7ff;border:1.5px solid #dcc6f2;border-radius:14px;padding:12px;margin-bottom:16px;text-align:left">
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>🌸 Blooms Nourished:</span><b>${G().blooms}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>🌟 Giant Sky Blooms:</span><b>${G().megaBlooms || 0}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>⭐ Rain Stars Caught:</span><b>${G().rainStars || 0}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>🐛 Worms Hydrated:</span><b>${G().wormsHydrated || 0}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>🐜 Ants Hydrated:</span><b>${G().antsHydrated || 0}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:#8a2eae"><span>💜 Serenity Award:</span><b>+25 Serenity &amp; Hope</b></div>
        </div>
        <div class="modal-btns">
          <button class="btn btn-primary" id="meadow-continue">Keep Relaxing 🌸</button>
          <button class="btn btn-ghost" onclick="closeModal()">Back to Games</button>
        </div>
      </div>
    `);

    $('#meadow-continue')?.addEventListener('click', () => {
      sessionStart = Date.now();
      missionCompleteSeen = false;
      closeModal();
      toast('Enjoy your peaceful meadow 🌿');
    });
  }

  /* ── Main Frame Loop ─────────────────────────────────────── */
  function frame(ts) {
    if (!mounted) return;
    const dt = Math.min(50, ts - last || 16);
    last = ts;
    t += dt;
    const now = Date.now();

    // 2-Minute Countdown Challenge Timer (Starts @ 2:00 and goes down!)
    const elapsed = now - sessionStart;
    const timeLeft = Math.max(0, MISSION_LIMIT_MS - elapsed);
    const timerEl = $('#m-timer');
    if (timerEl) timerEl.textContent = fmtClock(timeLeft);

    if (timeLeft <= 0 && !missionCompleteSeen) {
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

    // Flower Hydration & Backward Shrink Dynamics
    const isRaining = now < rainUntil;
    for (const f of flowers) {
      if (!isRaining) {
        f.hydration = Math.max(0, (f.hydration != null ? f.hydration : 1.0) - (dt / 24000));
        // If completely dry, the flower grows backwards (shrinks)!
        if (f.hydration <= 0) {
          f.water = Math.max(0, (f.water || 0) - (dt / 16000));
          if (f.water === 0 && (f.growthTier || 1) > 1) {
            f.growthTier = Math.max(1, f.growthTier - (dt / 12000));
          }
        }
      }
    }

    // Sky Day/Night Cycle Gradient
    const dayProg = (now % DAY_MS) / DAY_MS;
    const sunAlt = Math.sin(dayProg * Math.PI * 2);
    let skyTop, skyBot;
    if (sunAlt > 0.2) {
      skyTop = '#6bb5ff'; skyBot = '#d4edff'; // Daytime
    } else if (sunAlt > -0.2) {
      skyTop = '#e07a5f'; skyBot = '#f4a261'; // Sunset
    } else {
      skyTop = '#0d1b2a'; skyBot = '#1b263b'; // Night
    }

    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY());
    skyGrad.addColorStop(0, skyTop);
    skyGrad.addColorStop(1, skyBot);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, groundY());

    // Layered Rich Ground Soil Bed (Ground @ 85% H)
    const gy = groundY();
    const soilGrad = ctx.createLinearGradient(0, gy, 0, H);
    soilGrad.addColorStop(0, '#2d7a46');    // Vibrant top grass
    soilGrad.addColorStop(0.08, '#1e5e34'); // Dark loamy sub-turf
    soilGrad.addColorStop(0.35, '#3d2413'); // Rich humus soil
    soilGrad.addColorStop(1, '#1b0e06');    // Deep earth
    ctx.fillStyle = soilGrad;
    ctx.fillRect(0, gy, W, H - gy);

    // Soil Pebbles & Root Flecks
    ctx.fillStyle = '#4a2c16';
    for (let i = 0; i < 18; i++) {
      const px = (i * 53) % W;
      const py = gy + 8 + ((i * 37) % (H - gy - 12));
      ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI * 2); ctx.fill();
    }

    // Draw Rainbow & Rain
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
        burst(hp.x, hp.y, 'petal', 16);
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
        burst(hp.x, hp.y, 'spark', 36);
        megaChime();
        buzz([30, 70, 100]);
        addPopup(hp.x, hp.y - 24, '+50 🌟 GIANT SKY BLOOM!', '#ffd700');
        toast('Incredible! Your flower grew to the sky! +50 Serenity 🌟✨', 3500);
        persist(); hud();
      }

      // Stem Base Ground Shadow & Root Node
      ctx.fillStyle = 'rgba(10, 5, 2, 0.45)';
      ctx.beginPath();
      ctx.ellipse(f.x * W, gy + 2, 10 + gr * 4, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Flower Stem with chlorophyll gradient
      const stemColor = hp.isWilted ? '#8a7a40' : f.isMega ? '#38b000' : '#4f9d44';
      ctx.strokeStyle = stemColor;
      ctx.lineWidth = Math.min(9.5, 3.4 + gr * 2.0);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(f.x * W, gy);
      ctx.quadraticCurveTo(f.x * W + hp.sway * 0.5, gy - hp.stemH * 0.5, hp.x, hp.y);
      ctx.stroke();

      // Detailed Stem Leaves with central vein
      if (gr > 0.35) {
        const leafY = gy - hp.stemH * 0.45;
        const leafX = f.x * W + hp.sway * 0.4;
        const leafScale = Math.min(2.0, gr);

        // Left Leaf
        ctx.fillStyle = stemColor;
        ctx.beginPath();
        ctx.ellipse(leafX - 12, leafY, 11 * leafScale, 5.5, hp.isWilted ? 0.2 : -0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = lighten(stemColor, 30);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(leafX - 3, leafY);
        ctx.lineTo(leafX - 18, leafY - 4);
        ctx.stroke();

        // Right Leaf
        ctx.fillStyle = stemColor;
        ctx.beginPath();
        ctx.ellipse(leafX + 12, leafY - 6, 11 * leafScale, 5.5, hp.isWilted ? 0.3 : 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(leafX + 3, leafY - 6);
        ctx.lineTo(leafX + 18, leafY - 10);
        ctx.stroke();
      }

      // Thirst indicator if dry / shrinking backward
      if (hp.isWilted) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 10.5px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.beginPath();
        ctx.roundRect(hp.x - 26, hp.y - 30, 52, 16, 8);
        ctx.fill();
        ctx.fillStyle = '#0284c7';
        ctx.fillText('💧 Thirsty!', hp.x, hp.y - 18);
        ctx.restore();
      }

      // Flower Head / Crown
      ctx.save();
      ctx.translate(hp.x, hp.y);

      // Mega Golden Halo Corona
      if (f.isMega) {
        const haloPulse = Math.sin(t / 200) * 5;
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 26 + haloPulse;
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.88)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 32 + haloPulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      const col = COLORS[f.ci % COLORS.length];
      const sp = SPECIES[f.sp % SPECIES.length];
      const crownR = Math.min(38, (13 + (f.growthTier || 1) * 4.8) * Math.min(1.7, gr));

      if (gr < 0.45) {
        // Sprout / Delicate Calyx Bud
        ctx.fillStyle = hp.isWilted ? '#a39045' : '#70e000';
        ctx.beginPath(); ctx.ellipse(0, 0, 6, 9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(0, -6, 3, 0, Math.PI * 2); ctx.fill();
      } else {
        if (sp === 'daisy') drawDaisy(crownR, col);
        else if (sp === 'tulip') drawTulip(crownR, col);
        else if (sp === 'pompom') drawPompom(crownR, col);
        else if (sp === 'hope') drawHopeFlower(crownR, col);
        else drawBloom(crownR, col);
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
      ctx.font = '700 13px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 5;
      ctx.fillText(pp.text, pp.x, pp.y);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;

    raf = requestAnimationFrame(frame);
  }

  /* ── Input Handlers ─────────────────────────────────────── */
  function onPointer(e) {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const now = Date.now();

    // 1) Catch a Falling Rain Star?
    for (const st of rainStars) {
      if (st.collected) continue;
      if (Math.hypot(st.x - x, st.y - y) < 28) {
        st.collected = true;
        G().serenity += 5;
        G().rainStars = (G().rainStars || 0) + 1;
        burst(st.x, st.y, 'spark', 24);
        starChime(); buzz([15, 40]);
        addPopup(st.x, st.y - 14, '+5 ⭐ Rain Star Caught!', '#ffd700');
        toast('Captured a sparkling Rain Star! +5 serenity ⭐✨', 2000);
        persist(); hud();
        return;
      }
    }

    // 2) Hydrate a Thirsty Worm?
    for (const w of worms) {
      if (w.hydrated) continue;
      if (Math.hypot(w.x - x, w.y - y) < 34 || (Math.abs(w.x - x) < 24 && y > w.y - 30 && y < w.y + 18)) {
        w.hydrated = true;
        w.hydrateAt = now;
        G().serenity += 3;
        G().wormsHydrated = (G().wormsHydrated || 0) + 1;
        burst(w.x, w.y - 8, 'drop', 16);
        burst(w.x, w.y - 12, 'heart', 4);
        wormChime(); buzz([15, 35, 15]);
        addPopup(w.x, w.y - 20, '💧 +3 Worm Hydrated!', '#6ec1ff');
        toast('You quenched the worm’s thirst with cool water! +3 serenity 💧🐛', 2200);
        persist(); hud();
        return;
      }
    }

    // 3) Hydrate a Busy Garden Ant?
    for (const a of ants) {
      if (a.hydrated) continue;
      if (Math.hypot(a.x - x, a.y - y) < 26) {
        a.hydrated = true;
        a.hydrateAt = now;
        G().serenity += 2;
        G().antsHydrated = (G().antsHydrated || 0) + 1;
        burst(a.x, a.y - 4, 'drop', 10);
        burst(a.x, a.y - 6, 'leaf', 8);
        antChime(); buzz([10, 30]);
        addPopup(a.x, a.y - 16, '💧 +2 Ant Hydrated!', '#70e000');
        toast('Given water dewdrop to ant · It fertilised the nearest flower 🌱🐜', 2200);

        if (flowers.length) {
          const nearest = flowers.reduce((best, f) => Math.abs(f.x * W - a.x) < Math.abs(best.x * W - a.x) ? f : best, flowers[0]);
          nearest.hydration = 1.0;
          nearest.water = (nearest.water || 0) + 0.20;
          nearest.growthTier = (nearest.growthTier || 1) + 1;
        }

        persist(); hud();
        return;
      }
    }

    // 4) Offer Dewdrop Nectar to Butterfly?
    for (const fl of flies) {
      if (fl.state === 'away') continue;
      if (Math.hypot(fl.x - x, fl.y - y) < 32) {
        fl.state = 'away';
        const addSer = fl.isHope ? 10 : 5;
        G().serenity += addSer;
        burst(fl.x, fl.y, 'drop', 12);
        burst(fl.x, fl.y, 'spark', fl.isHope ? 20 : 14);
        addPopup(fl.x, fl.y - 12, fl.isHope ? '🌟 +10 Hope Nectar!' : '💧 +5 Butterfly Nectar!', fl.isHope ? '#ffd700' : '#6ec1ff');
        flyChime(); buzz(fl.isHope ? [20, 60, 20] : [12, 40, 12]);
        toast(fl.isHope ? 'Golden Hope Butterfly enjoyed your nectar · +10 serenity 🌟' : 'Butterfly nourished with sweet dewdrop · +5 serenity 🦋', 2400);
        persist(); hud();
        return;
      }
    }

    // 5) Water Any Flower (Tapping waters it, raises hydration & prevents shrinking backward!)
    for (const f of flowers) {
      const hp = headPos(f, now);
      const isStemHit = Math.abs(f.x * W - x) < 24 && y >= hp.y && y <= groundY();
      const isHeadHit = Math.hypot(hp.x - x, hp.y - y) < 42;

      if (isHeadHit || isStemHit) {
        f.hydration = 1.0;
        f.lastWateredAt = now;
        f.water = (f.water || 0) + 0.22;
        f.growthTier = (f.growthTier || 1) + 1;
        G().serenity += 1;
        burst(hp.x, hp.y - 6, 'drop', 12);
        waterChime(); buzz(10);
        addPopup(hp.x, hp.y - 16, '🌱 Watered & Growing!', '#00a651');
        persist(); hud();
        return;
      }
    }

    // 6) Plant on the Grass Ground
    if (y > groundY() - 26) {
      if (flowers.length >= MAX_FLOWERS) {
        const old = flowers.findIndex(f => f.bloomed && !f.isMega);
        const idx = old >= 0 ? old : 0;
        const gone = flowers.splice(idx, 1)[0];
        burst(gone.x * W, groundY() - 10, 'puff', 10);
      }
      const isHope = Math.random() < 0.22;
      flowers.push({
        x: Math.min(.96, Math.max(.04, x / W)),
        ci: isHope ? COLORS.indexOf('#ffd700') : Math.floor(Math.random() * (COLORS.length - 1)),
        sp: isHope ? SPECIES.indexOf('hope') : Math.floor(Math.random() * (SPECIES.length - 1)),
        plantedAt: Date.now(), water: 0.1, bloomed: false, growthTier: 1, isMega: false,
        hydration: 1.0, lastWateredAt: Date.now(),
        ph: rnd(0, 9),
      });
      burst(x, groundY() - 4, 'spark', isHope ? 14 : 7);
      plantChime(); buzz(10);
      if (isHope) toast('You planted a rare Hope seed 🌱✨', 2200);
      persist();
      return;
    }

    // 7) Anywhere else: gentle dewdrop sparkle chime
    burst(x, y, 'drop', 5);
    tapChime();
  }

  /* ── Lifecycle ───────────────────────────────────────────── */
  function resize() {
    if (!canvas) return;
    dpr = Math.min(2, globalThis.devicePixelRatio || 1);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function mount() {
    stop();
    canvas = $('#meadow');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    mounted = true;

    // Countdown Timer starts @ 2:00 (120,000 ms) and goes down
    sessionStart = Date.now();
    lastCheckpoint = sessionStart;
    missionCompleteSeen = false;

    // Set initial 2:00 display immediately on mount
    const timerEl = $('#m-timer');
    if (timerEl) timerEl.textContent = '2:00';

    // Load persisted flowers
    flowers = (G().flowers || []).map(f => ({
      x: f.x, ci: f.ci, sp: f.sp, plantedAt: f.plantedAt || Date.now(),
      water: f.water || 0, bloomed: f.bloomed || false,
      growthTier: f.growthTier || 1, isMega: !!f.isMega,
      hydration: f.hydration != null ? f.hydration : 1.0,
      lastWateredAt: f.lastWateredAt || Date.now(),
      ph: rnd(0, 9),
    }));

    if (!flowers.length) {
      // Starter flowers nicely spaced
      for (let i = 0; i < 4; i++) {
        flowers.push({
          x: 0.16 + i * 0.23,
          ci: i, sp: i % SPECIES.length,
          plantedAt: Date.now() - GROW_MS,
          water: 0.5, bloomed: true, growthTier: 1, isMega: false,
          hydration: 1.0, lastWateredAt: Date.now(),
          ph: rnd(0, 9),
        });
      }
      persist();
    }

    nextFlyAt = Date.now() + 4000;
    nextWormAt = Date.now() + 6000;
    nextAntAt = Date.now() + 3000;
    resize();
    hud();

    canvas.addEventListener('pointerdown', onPointer);
    window.addEventListener('resize', resize);
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (!mounted && !canvas) return;
    mounted = false;
    cancelAnimationFrame(raf);
    if (sessionStart) {
      G().totalPlayMs = (G().totalPlayMs || 0) + (Date.now() - lastCheckpoint);
      save();
    }
    if (canvas) canvas.removeEventListener('pointerdown', onPointer);
    window.removeEventListener('resize', resize);
    canvas = null; ctx = null;
    flowers = []; parts = []; flies = []; worms = []; ants = []; popups = []; drops = []; ripples = []; rainStars = [];
  }

  return { mount, stop, triggerRain };
})();

window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#/game')) MMGame.stop(); });

/* ── Moja Meadow Screen ────────────────────────────────────── */
routes.game = () => {
  render(`
    ${header('Moja Meadow 🌸', { backTo: '#/games' })}
    <div class="body-pad meadow-pad">
      <div class="meadow-hud">
        <span class="hud-chip" title="Flowers bloomed">🌸 <b id="m-blooms">${S.game.blooms}</b></span>
        <span class="hud-chip" title="Serenity Points">💜 <b id="m-ser">${S.game.serenity}</b></span>
        <span class="hud-chip timer-chip" title="2-Minute Countdown Challenge">⏳ <span id="m-timer">2:00</span></span>
        <button class="hud-chip hud-btn" id="m-rain" title="Summon Summer Rain & Catch Falling Stars">🌧️ Rain</button>
        <button class="hud-chip hud-btn" id="m-sound" aria-pressed="${S.game.sound}">${S.game.sound ? '🔔 Sound' : '🔕 Mute'}</button>
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
        <b>We care for all creatures</b>: Give water to thirsty worms (<b>💧 +3</b>) · Hydrate ants (<b>💧 +2</b>) · Offer nectar to butterflies (<b>💧 +5 / +10</b>) · <b>Water flowers regularly or they grow backwards (shrink)</b> · Reach the sky for <b>Giant Sky Bloom (+50 🌟)</b> · Tap <b>🌧️ Rain</b> &amp; catch falling <b>Rain Stars (⭐ +5)</b>!
      </p>
    </div>
  `);

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
