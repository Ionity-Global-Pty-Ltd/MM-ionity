/* ============================================================
   MojaMind — Moja Bee 3D: Sunray Flight 🐝🌻✨
   A breathtaking interactive 3D flight adventure with next-gen
   visuals, realistic bumblebee physics, and dynamic skies.
   
   Features:
   - High-fidelity 3D rendered bumblebee with velvety fur shaders,
     dual iridescent wings, expressive eyes, and antenna physics.
   - Dynamic volumetric sky with radiant sun shafts, distant misty
     mountain ranges, and sparkling winding crystal river.
   - 3D meadow floor with swaying sunflowers, lavenders, poppies & roses.
   - 3D rotating Sunray star prisms and Pollen Blossom pods.
   - Supersonic Honey Rush with warp speed lines & golden wake.
   - Realistic storm cloud collision wobble & dizzy slowdown physics.
   - 2-Minute Flight Challenge with Ionity glassmorphism HUD.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za
   ============================================================ */
'use strict';

const MMGame3D = (() => {
  let canvas = null, ctx = null, W = 0, H = 0, dpr = 1;
  let raf = 0, last = 0, t = 0, mounted = false;
  let ac = null;
  let beeHumNode = null, beeHumGain = null;

  // 3D Game Constants & Session State
  const MISSION_MS = 120000; // 2-Minute Flight Challenge (120s)
  let sessionStart = 0;
  let missionCompleted = false;

  let player = {
    x: 0, y: 0, z: 0,
    vx: 0, vy: 0, vz: 9.0,
    pitch: 0, yaw: 0, roll: 0,
    targetX: 0, targetY: 0,
    boosting: false,
    boostUntil: 0,
    crashed: false,
    crashUntil: 0,
    dizzyAngle: 0,
    score: 0,
    sunrays: 0,
    pollen: 0,
    distanceMeters: 0,
    wingPhase: 0,
  };

  let skyParticles = []; // Sun glints, floating dandelion fluff, pollen dust
  let objects = [];      // 3D Sunrays, Pollen Blossoms, Storm Clouds
  let groundFlowers = []; // 3D Sunflowers, lavenders, poppies on meadow floor
  let butterflies = [];  // 3D Passing fluttering butterflies
  let particles = [];    // Trail particles & pickup bursts
  let speedLines = [];   // Honey Rush warp speed lines
  let popups = [];       // Floating score & status popups
  let pointer = { active: false, startX: 0, startY: 0, curX: 0, curY: 0 };

  const G3 = () => {
    if (!S.game3d) S.game3d = { highScore: 0, pollen: 0, sunrays: 0, sound: true, bestDistance: 0, crashes: 0, totalFlights: 0 };
    return S.game3d;
  };

  const rnd = (a, b) => a + Math.random() * (b - a);

  function fmtClock(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  /* ── Web Audio Synthesizer: Bee Buzz & Melodic Chimes ───── */
  function audio() {
    if (!G3().sound) return null;
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return null;
    if (!ac) ac = new AC();
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }

  function playTone(freq, dur = 0.25, type = 'sine', vol = 0.08) {
    const a = audio(); if (!a) return;
    try {
      const o = a.createOscillator(), g = a.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, a.currentTime);
      g.gain.setValueAtTime(vol, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
      o.connect(g); g.connect(a.destination);
      o.start(); o.stop(a.currentTime + dur + 0.05);
    } catch { /* audio safeguard */ }
  }

  function sunraySound() {
    [523.25, 659.26, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.4, 'triangle', 0.09), i * 55);
    });
  }

  function pollenSound() {
    [440.0, 554.37, 659.26, 880.0].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.55, 'sine', 0.11), i * 70);
    });
  }

  function butterflyJoySound() {
    [659.26, 880.0, 1174.66, 1318.5].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.35, 'sine', 0.07), i * 45);
    });
  }

  function crashSound() {
    const a = audio(); if (!a) return;
    try {
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(260, a.currentTime);
      o.frequency.exponentialRampToValueAtTime(90, a.currentTime + 0.45);
      g.gain.setValueAtTime(0.12, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.45);
      o.connect(g); g.connect(a.destination);
      o.start(); o.stop(a.currentTime + 0.5);
    } catch { /* ignore */ }
  }

  function boostSound() {
    [329.63, 440.0, 523.25, 659.26, 880.0].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.35, 'sine', 0.09), i * 45);
    });
  }

  function buzz(ms) {
    try { navigator.vibrate && navigator.vibrate(ms); } catch { /* no haptics */ }
  }

  /* ── 3D Perspective Projection Matrix ───────────────────── */
  const FOV = 360;
  function project(x, y, z) {
    const relZ = z - player.z;
    if (relZ <= 5) return null; // behind camera
    const scale = FOV / relZ;
    const px = (x - player.x) * scale + W / 2;
    const py = (y - player.y) * scale + H / 2;
    return { x: px, y: py, scale, relZ };
  }

  /* ── 3D World Generation: Sunrays, Pollen, Flowers & River ── */
  function init3DWorld() {
    skyParticles = [];
    for (let i = 0; i < 300; i++) {
      skyParticles.push({
        x: rnd(-1000, 1000),
        y: rnd(-800, 700),
        z: rnd(20, 2200),
        r: rnd(1.2, 3.8),
        color: Math.random() < 0.45 ? '#ffd166' : Math.random() < 0.3 ? '#ffffff' : '#ffbe0b',
        fluff: Math.random() < 0.25,
      });
    }

    objects = [];
    for (let i = 0; i < 40; i++) {
      spawn3DObject(i * 110 + 180);
    }

    // 3D Meadow Floor Flowers
    groundFlowers = [];
    const flowerTypes = ['sunflower', 'lavender', 'poppy', 'daisy', 'rose', 'tulip'];
    for (let i = 0; i < 80; i++) {
      groundFlowers.push({
        x: rnd(-700, 700),
        y: rnd(280, 360),
        z: rnd(50, 2200),
        type: flowerTypes[Math.floor(Math.random() * flowerTypes.length)],
        size: rnd(18, 38),
        swayOffset: rnd(0, Math.PI * 2),
      });
    }

    // 3D Passing Butterflies
    butterflies = [];
    const bfColors = [
      { name: 'Monarch Orange', wingA: '#ff5400', wingB: '#ffbe0b', spot: '#ffffff' },
      { name: 'Morpho Blue', wingA: '#00b4d8', wingB: '#7209b7', spot: '#90e0ef' },
      { name: 'Lavender Fairy', wingA: '#f72585', wingB: '#b5179e', spot: '#ffd166' },
      { name: 'Emerald Swallowtail', wingA: '#06d6a0', wingB: '#118ab2', spot: '#ffffff' },
    ];
    for (let i = 0; i < 16; i++) {
      butterflies.push({
        x: rnd(-450, 450),
        y: rnd(-160, 240),
        z: rnd(100, 2000),
        vx: rnd(-0.6, 0.6),
        vy: rnd(-0.4, 0.4),
        theme: bfColors[i % bfColors.length],
        size: rnd(16, 26),
        wingPhase: rnd(0, Math.PI * 2),
        phase: rnd(0, Math.PI * 2),
        greeted: false,
      });
    }
  }

  function spawn3DObject(zPos) {
    const typeRoll = Math.random();
    let type = 'sunray';
    if (typeRoll < 0.50) type = 'sunray';
    else if (typeRoll < 0.80) type = 'pollen';
    else type = 'storm';

    objects.push({
      x: rnd(-360, 360),
      y: rnd(-200, 220),
      z: zPos,
      type,
      rot: rnd(0, Math.PI * 2),
      size: type === 'storm' ? rnd(65, 95) : type === 'pollen' ? rnd(32, 42) : rnd(28, 38),
      collected: false,
      pulse: rnd(0, Math.PI * 2),
    });
  }

  function addPopup(x, y, text, color = '#ffd166') {
    popups.push({ x, y, text, color, life: 1, vy: -1.35 });
  }

  function triggerBoost() {
    if (player.crashed) return;
    player.boosting = true;
    player.boostUntil = Date.now() + 5000;
    player.vz = 17.0;
    boostSound();
    buzz([30, 80, 140]);
    addPopup(W / 2, H * 0.4, '⚡ SUPERSONIC HONEY RUSH! 🍯', '#ffbe0b');
    toast('⚡ Supersonic Honey Rush activated! 2x Speed & Score!', 2400);

    // Spawn speed burst particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: W / 2 + rnd(-60, 60),
        y: H * 0.75 + rnd(-40, 40),
        vx: rnd(-2, 2),
        vy: rnd(2, 6),
        color: '#ffd700',
        life: 1,
        decay: 0.03,
        r: rnd(3, 7),
      });
    }
  }

  /* ── 3D Frame Update Loop ────────────────────────────────── */
  function frame(ts) {
    if (!mounted) return;
    const dt = Math.min(50, ts - last || 16);
    last = ts;
    t += dt;
    const now = Date.now();

    // 1) 2-Minute Mission Timer
    const elapsed = now - sessionStart;
    const timeLeft = Math.max(0, MISSION_MS - elapsed);
    const timeEl = $('#orbit-timer');
    if (timeEl) timeEl.textContent = fmtClock(timeLeft);

    if (timeLeft <= 0 && !missionCompleted) {
      missionCompleted = true;
      celebrate2MinComplete();
    }

    // 2) Boost & Crash Timers
    if (player.boosting && now > player.boostUntil) {
      player.boosting = false;
      player.vz = 9.0;
    }

    if (player.crashed) {
      player.dizzyAngle += dt * 0.015;
      if (now > player.crashUntil) {
        player.crashed = false;
        player.vz = player.boosting ? 17.0 : 9.0;
      }
    }

    // 3) Player Flight Motion & Smooth Steering Tracking
    if (pointer.active) {
      const dx = pointer.curX - pointer.startX;
      const dy = pointer.curY - pointer.startY;
      player.targetX = (dx / (W * 0.35)) * 360;
      player.targetY = (dy / (H * 0.35)) * 220;
    } else {
      player.targetX *= 0.94;
      player.targetY *= 0.94;
    }

    // Smooth lerp steering
    player.x += (player.targetX - player.x) * 0.12;
    player.y += (player.targetY - player.y) * 0.12;
    player.z += player.vz * (dt / 16);

    player.roll = (player.targetX - player.x) * 0.0022;
    player.pitch = (player.targetY - player.y) * 0.0018;
    player.wingPhase += dt * (player.boosting ? 0.08 : 0.045);

    player.distanceMeters = Math.floor(player.z * 0.25);
    player.score = player.sunrays * 10 + player.pollen * 25 + Math.floor(player.distanceMeters * 0.5);

    // 4) Update 3D Objects & Spawning
    for (const obj of objects) {
      obj.rot += dt * 0.002;
      obj.pulse += dt * 0.005;

      // Collision checks with bee
      if (!obj.collected && Math.abs(obj.z - player.z) < 35) {
        const dist2D = Math.hypot(obj.x - player.x, obj.y - player.y);

        if (obj.type === 'sunray' && dist2D < 48) {
          obj.collected = true;
          player.sunrays++;
          G3().sunrays = (G3().sunrays || 0) + 1;
          sunraySound(); buzz(12);
          const p = project(obj.x, obj.y, obj.z);
          if (p) addPopup(p.x, p.y, '+10 ☀️ Sunray!', '#ffd700');
          spawnPickupBurst(obj.x, obj.y, obj.z, '#ffd700');
        } else if (obj.type === 'pollen' && dist2D < 52) {
          obj.collected = true;
          player.pollen++;
          G3().pollen = (G3().pollen || 0) + 1;
          pollenSound(); buzz([15, 45]);
          const p = project(obj.x, obj.y, obj.z);
          if (p) addPopup(p.x, p.y, '+25 🍯 Nectar Pod!', '#ffbe0b');
          spawnPickupBurst(obj.x, obj.y, obj.z, '#ff9e00');
          if (player.pollen % 3 === 0) triggerBoost();
        } else if (obj.type === 'storm' && dist2D < 65 && !player.crashed) {
          obj.collected = true;
          player.crashed = true;
          player.crashUntil = now + 2400;
          player.vz = 3.5;
          G3().crashes = (G3().crashes || 0) + 1;
          crashSound(); buzz([40, 100, 180]);
          const p = project(obj.x, obj.y, obj.z);
          if (p) addPopup(p.x, p.y, '⛈️ CLOUD SLOWDOWN!', '#ff4d6d');
          toast('Storm cloud wobble! Shake off the dizziness 🐝🌀', 2000);
        }
      }
    }

    // Recycle objects ahead of player
    objects = objects.filter(o => o.z > player.z - 30);
    while (objects.length < 40) {
      const maxZ = objects.reduce((m, o) => Math.max(m, o.z), player.z);
      spawn3DObject(maxZ + rnd(80, 130));
    }

    // Recycle ground flowers
    for (const fl of groundFlowers) {
      if (fl.z < player.z - 50) {
        fl.z += 2200;
        fl.x = rnd(-700, 700);
      }
    }

    // Recycle sky particles
    for (const sp of skyParticles) {
      if (sp.z < player.z - 20) {
        sp.z += 2200;
        sp.x = rnd(-1000, 1000);
        sp.y = rnd(-800, 700);
      }
    }

    // Update 3D butterflies
    for (const bf of butterflies) {
      bf.wingPhase += dt * 0.015;
      bf.x += bf.vx;
      bf.y += bf.vy + Math.sin(t * 0.003 + bf.phase) * 0.5;
      if (bf.z < player.z - 50) {
        bf.z += 2000;
        bf.x = rnd(-450, 450);
        bf.greeted = false;
      }
      if (!bf.greeted && Math.abs(bf.z - player.z) < 40 && Math.hypot(bf.x - player.x, bf.y - player.y) < 60) {
        bf.greeted = true;
        butterflyJoySound(); buzz(10);
        const p = project(bf.x, bf.y, bf.z);
        if (p) addPopup(p.x, p.y, '🦋 Joy Companion! +5', '#ff758f');
      }
    }

    // Update Particles & Speed Lines
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      p.life -= p.decay;
    }
    particles = particles.filter(p => p.life > 0);

    for (const pp of popups) {
      pp.y += pp.vy;
      pp.life -= 0.022;
    }
    popups = popups.filter(pp => pp.life > 0);

    // Update HUD
    updateHUD();

    // 5) DRAW 3D SCENE
    render3DScene();

    raf = requestAnimationFrame(frame);
  }

  function spawnPickupBurst(x, y, z, color) {
    const p = project(x, y, z);
    if (!p) return;
    for (let i = 0; i < 24; i++) {
      const a = rnd(0, Math.PI * 2), sp = rnd(2, 6);
      particles.push({
        x: p.x, y: p.y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        color,
        life: 1,
        decay: rnd(0.02, 0.04),
        r: rnd(2.5, 5.5),
      });
    }
  }

  function updateHUD() {
    const sEl = $('#orbit-score'); if (sEl) sEl.textContent = player.score;
    const hEl = $('#orbit-high'); if (hEl) hEl.textContent = Math.max(player.score, G3().highScore || 0);
    const rEl = $('#orbit-sunrays'); if (rEl) rEl.textContent = player.sunrays;
    const pEl = $('#orbit-pollen'); if (pEl) pEl.textContent = player.pollen;
    const dEl = $('#orbit-dist'); if (dEl) dEl.textContent = `${player.distanceMeters}m`;
  }

  /* ── 3D Scene Rendering Engine ───────────────────────────── */
  function render3DScene() {
    ctx.clearRect(0, 0, W, H);

    // 1) Volumetric Gradient Sky (Daylight Azure to Warm Sunbeam Gold)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.7);
    skyGrad.addColorStop(0, '#2b7fff');
    skyGrad.addColorStop(0.45, '#6eb1ff');
    skyGrad.addColorStop(0.75, '#ffe5b4');
    skyGrad.addColorStop(1, '#ffeedb');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Radiant Sun Flare & Sunbeams
    const sunX = W * 0.72 - player.roll * 40;
    const sunY = H * 0.22 - player.pitch * 30;

    const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 220);
    sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    sunGlow.addColorStop(0.2, 'rgba(255, 225, 120, 0.65)');
    sunGlow.addColorStop(0.6, 'rgba(255, 180, 60, 0.25)');
    sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath(); ctx.arc(sunX, sunY, 220, 0, Math.PI * 2); ctx.fill();

    // 2) Distant Misty Mountain Peaks
    drawDistantMountains();

    // 3) 3D Meadow Terrain & Sparkling Winding River
    drawMeadowAndRiver();

    // 4) 3D Sky Dust, Sun Glints & Dandelion Fluff
    drawSkyDust();

    // 5) 3D Meadow Ground Flowers
    drawGroundFlowers();

    // 6) 3D Passing Fluttering Butterflies
    for (const bf of butterflies) drawButterfly(bf);

    // 7) 3D Interactive Collectibles & Obstacles
    const sortedObjects = [...objects].filter(o => o.z > player.z + 5).sort((a, b) => b.z - a.z);

    for (const obj of sortedObjects) {
      if (obj.collected) continue;
      const p = project(obj.x, obj.y, obj.z);
      if (!p) continue;

      ctx.save();
      ctx.translate(p.x, p.y);

      if (obj.type === 'sunray') {
        // 3D Rotating Sunray Prism Crystal
        const sz = obj.size * p.scale * 0.12;
        ctx.rotate(obj.rot);

        // Radiant Outer Glow Halo
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 18;

        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        for (let k = 0; k < 8; k++) {
          const a1 = (k / 8) * Math.PI * 2;
          const a2 = ((k + 0.5) / 8) * Math.PI * 2;
          const rOut = sz;
          const rIn = sz * 0.45;
          if (k === 0) ctx.moveTo(Math.cos(a1) * rOut, Math.sin(a1) * rOut);
          else ctx.lineTo(Math.cos(a1) * rOut, Math.sin(a1) * rOut);
          ctx.lineTo(Math.cos(a2) * rIn, Math.sin(a2) * rIn);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(0, 0, sz * 0.32, 0, Math.PI * 2); ctx.fill();

      } else if (obj.type === 'pollen') {
        // 3D Glowing Pollen Honeycomb Pod
        const sz = obj.size * p.scale * 0.12;
        ctx.shadowColor = '#ff9e00';
        ctx.shadowBlur = 22;

        ctx.fillStyle = '#ffbe0b';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const px = Math.cos(a) * sz;
          const py = Math.sin(a) * sz;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff5400';
        ctx.beginPath(); ctx.arc(0, 0, sz * 0.38, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(-sz * 0.2, -sz * 0.2, sz * 0.15, 0, Math.PI * 2); ctx.fill();

      } else {
        // 3D Storm Cloud with Animated Internal Lightning
        const sz = obj.size * p.scale * 0.13;
        ctx.fillStyle = '#4a3b56';
        ctx.strokeStyle = '#2b1e36';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#1c0f26';
        ctx.shadowBlur = 14;

        ctx.beginPath();
        ctx.arc(-sz * 0.5, 0, sz * 0.45, 0, Math.PI * 2);
        ctx.arc(0, -sz * 0.32, sz * 0.55, 0, Math.PI * 2);
        ctx.arc(sz * 0.5, 0, sz * 0.45, 0, Math.PI * 2);
        ctx.arc(0, sz * 0.25, sz * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Mini lightning flash
        if (Math.sin(t * 0.01 + obj.pulse) > 0.6) {
          ctx.fillStyle = '#ffd166';
          ctx.shadowColor = '#ffd166';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(-sz * 0.1, -sz * 0.2);
          ctx.lineTo(sz * 0.1, 0);
          ctx.lineTo(-sz * 0.05, 0.05);
          ctx.lineTo(sz * 0.1, sz * 0.3);
          ctx.lineTo(-sz * 0.1, sz * 0.1);
          ctx.closePath();
          ctx.fill();
        }
      }

      ctx.restore();
    }

    // 8) Supersonic Honey Rush Warp Speed Lines
    if (player.boosting) {
      drawHoneyRushWarpLines();
    }

    // 9) Draw The High-Fidelity 3D Animated Bumblebee (Foreground)
    drawPlayerBee();

    // 10) Draw Particles & Floating Score Popups
    for (const p of particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.8, p.r * p.life), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (const pp of popups) {
      ctx.globalAlpha = Math.max(0, pp.life);
      ctx.fillStyle = pp.color;
      ctx.font = '800 14px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 6;
      ctx.fillText(pp.text, pp.x, pp.y);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }

  /* ── Distant Misty Mountain Peaks ────────────────────────── */
  function drawDistantMountains() {
    const horizonY = H * 0.52 + (player.pitch * 35);
    ctx.save();
    ctx.fillStyle = 'rgba(100, 149, 237, 0.35)';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(W * 0.2, horizonY - 45);
    ctx.lineTo(W * 0.45, horizonY - 15);
    ctx.lineTo(W * 0.7, horizonY - 60);
    ctx.lineTo(W * 0.9, horizonY - 25);
    ctx.lineTo(W, horizonY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /* ── 3D Meadow Terrain & Sparkling Winding River ────────── */
  function drawMeadowAndRiver() {
    const horizonY = H * 0.52 + (player.pitch * 35);

    // Rolling Green Meadow Floor
    const meadowGrad = ctx.createLinearGradient(0, horizonY, 0, H);
    meadowGrad.addColorStop(0, '#52b788');
    meadowGrad.addColorStop(0.35, '#40916c');
    meadowGrad.addColorStop(0.75, '#2d6a4f');
    meadowGrad.addColorStop(1, '#1b4332');
    ctx.fillStyle = meadowGrad;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    // 3D Winding River
    const steps = 15;
    const riverLeft = [];
    const riverRight = [];

    for (let i = steps; i >= 1; i--) {
      const zRel = i * 110 + 20;
      const z = player.z + zRel;
      const curve = Math.sin((z - player.z) * 0.003 + t * 0.001) * 170;
      const riverWidth = Math.max(14, (1 - (i / steps)) * 145 + 18);

      const pL = project(curve - riverWidth, 310, z);
      const pR = project(curve + riverWidth, 310, z);
      if (pL && pR) {
        riverLeft.push(pL);
        riverRight.push(pR);
      }
    }

    if (riverLeft.length > 2) {
      ctx.save();
      const waterGrad = ctx.createLinearGradient(0, horizonY, 0, H);
      waterGrad.addColorStop(0, '#00b4d8');
      waterGrad.addColorStop(0.5, '#0077b6');
      waterGrad.addColorStop(1, '#023e8a');

      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.moveTo(riverLeft[0].x, riverLeft[0].y);
      for (let i = 1; i < riverLeft.length; i++) {
        ctx.lineTo(riverLeft[i].x, riverLeft[i].y);
      }
      for (let i = riverRight.length - 1; i >= 0; i--) {
        ctx.lineTo(riverRight[i].x, riverRight[i].y);
      }
      ctx.closePath();
      ctx.fill();

      // Sparkling River Sun Glints & Wave Ripples
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.6;
      for (let i = 0; i < riverLeft.length - 1; i += 2) {
        const midX = (riverLeft[i].x + riverRight[i].x) / 2;
        const midY = (riverLeft[i].y + riverRight[i].y) / 2;
        const shimmer = Math.sin(t * 0.006 + i) * 14;
        ctx.beginPath();
        ctx.moveTo(midX - 12 + shimmer, midY);
        ctx.lineTo(midX + 12 + shimmer, midY);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  /* ── 3D Sky Dust & Dandelion Fluff ───────────────────────── */
  function drawSkyDust() {
    ctx.save();
    for (const sp of skyParticles) {
      const p = project(sp.x, sp.y, sp.z);
      if (!p) continue;
      const sz = Math.max(0.8, sp.r * p.scale * 0.12);
      ctx.fillStyle = sp.color;
      ctx.globalAlpha = Math.min(0.85, p.scale * 0.25);
      ctx.beginPath();
      ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* ── 3D Ground Flowers ───────────────────────────────────── */
  function drawGroundFlowers() {
    const sorted = [...groundFlowers].filter(f => f.z > player.z + 5).sort((a, b) => b.z - a.z);

    for (const fl of sorted) {
      const p = project(fl.x, fl.y, fl.z);
      if (!p) continue;

      const sz = fl.size * p.scale * 0.12;
      if (sz < 2) continue;

      const sway = Math.sin(t * 0.003 + fl.swayOffset) * (sz * 0.3);

      ctx.save();
      ctx.translate(p.x, p.y);

      // Green Stem
      ctx.strokeStyle = '#2d6a4f';
      ctx.lineWidth = Math.max(1, sz * 0.18);
      ctx.beginPath();
      ctx.moveTo(0, sz * 0.8);
      ctx.quadraticCurveTo(sway * 0.5, sz * 0.4, sway, 0);
      ctx.stroke();

      ctx.translate(sway, 0);

      if (fl.type === 'sunflower') {
        ctx.fillStyle = '#ffd166';
        for (let k = 0; k < 8; k++) {
          ctx.save(); ctx.rotate(k * Math.PI / 4);
          ctx.beginPath(); ctx.ellipse(0, -sz * 0.55, sz * 0.22, sz * 0.4, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = '#6b3e0e';
        ctx.beginPath(); ctx.arc(0, 0, sz * 0.35, 0, Math.PI * 2); ctx.fill();
      } else if (fl.type === 'lavender') {
        ctx.fillStyle = '#8a2eae';
        for (let k = 0; k < 5; k++) {
          ctx.beginPath(); ctx.arc(rnd(-1, 1), -k * (sz * 0.28), sz * 0.2, 0, Math.PI * 2); ctx.fill();
        }
      } else if (fl.type === 'poppy') {
        ctx.fillStyle = '#f3256b';
        for (let k = 0; k < 4; k++) {
          ctx.save(); ctx.rotate(k * Math.PI / 2);
          ctx.beginPath(); ctx.ellipse(0, -sz * 0.45, sz * 0.35, sz * 0.4, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = '#1c1917';
        ctx.beginPath(); ctx.arc(0, 0, sz * 0.2, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = '#ffffff';
        for (let k = 0; k < 6; k++) {
          ctx.save(); ctx.rotate(k * Math.PI / 3);
          ctx.beginPath(); ctx.ellipse(0, -sz * 0.45, sz * 0.18, sz * 0.35, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = '#ffd166';
        ctx.beginPath(); ctx.arc(0, 0, sz * 0.22, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore();
    }
  }

  /* ── 3D Passing Butterfly Renderer ──────────────────────── */
  function drawButterfly(bf) {
    const p = project(bf.x, bf.y, bf.z);
    if (!p) return;

    const sz = bf.size * p.scale * 0.11;
    if (sz < 3) return;

    const wingFlap = Math.sin(bf.wingPhase * 16);

    ctx.save();
    ctx.translate(p.x, p.y);

    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(0, 0, sz * 0.15, sz * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.scale(wingFlap, 1);

    // Left Wings
    ctx.fillStyle = bf.theme.wingA;
    ctx.beginPath();
    ctx.ellipse(-sz * 0.65, -sz * 0.35, sz * 0.6, sz * 0.45, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bf.theme.wingB;
    ctx.beginPath();
    ctx.ellipse(-sz * 0.5, sz * 0.3, sz * 0.45, sz * 0.35, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Right Wings
    ctx.fillStyle = bf.theme.wingA;
    ctx.beginPath();
    ctx.ellipse(sz * 0.65, -sz * 0.35, sz * 0.6, sz * 0.45, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bf.theme.wingB;
    ctx.beginPath();
    ctx.ellipse(sz * 0.5, sz * 0.3, sz * 0.45, sz * 0.35, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  /* ── Supersonic Honey Rush Warp Speed Lines ──────────────── */
  function drawHoneyRushWarpLines() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
    ctx.lineWidth = 2.2;
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2 + t * 0.002;
      const rInner = rnd(60, 110);
      const rOuter = rnd(220, 360);
      const cx = W / 2, cy = H * 0.72;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * rInner, cy + Math.sin(a) * rInner);
      ctx.lineTo(cx + Math.cos(a) * rOuter, cy + Math.sin(a) * rOuter);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ── 3D High-Fidelity Animated Bumblebee Renderer ────────── */
  function drawPlayerBee() {
    const cx = W / 2, cy = H * 0.74;
    ctx.save();
    ctx.translate(cx, cy);

    // Roll & pitch flight banking
    const totalRoll = player.roll * 1.6 + (player.crashed ? Math.sin(player.dizzyAngle) * 0.45 : 0);
    const totalPitch = player.pitch * 1.4 + (player.crashed ? Math.cos(player.dizzyAngle) * 0.3 : 0);
    ctx.rotate(totalRoll);
    ctx.translate(0, totalPitch * 20);

    // 1) Translucent Iridescent Wings with Fluttering Oscillations
    const wingFlap = Math.sin(player.wingPhase * 16) * 0.88;
    ctx.save();
    ctx.fillStyle = 'rgba(235, 248, 255, 0.75)';
    ctx.strokeStyle = 'rgba(180, 225, 255, 0.95)';
    ctx.lineWidth = 1.5;

    // Left Wing
    ctx.save();
    ctx.translate(-11, -9);
    ctx.scale(wingFlap, 1);
    ctx.beginPath();
    ctx.ellipse(-16, -14, 18, 9, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Wing Vein
    ctx.strokeStyle = 'rgba(140, 190, 255, 0.7)';
    ctx.beginPath(); ctx.moveTo(-2, -2); ctx.lineTo(-24, -18); ctx.stroke();
    ctx.restore();

    // Right Wing
    ctx.save();
    ctx.translate(11, -9);
    ctx.scale(wingFlap, 1);
    ctx.beginPath();
    ctx.ellipse(16, -14, 18, 9, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Wing Vein
    ctx.strokeStyle = 'rgba(140, 190, 255, 0.7)';
    ctx.beginPath(); ctx.moveTo(2, -2); ctx.lineTo(24, -18); ctx.stroke();
    ctx.restore();
    ctx.restore();

    // 2) Plump Fuzzy Bumblebee Body with Layered Shading
    ctx.shadowColor = player.boosting ? '#ff9e00' : 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = player.boosting ? 24 : 10;

    // Golden Amber Base Body
    const bodyGrad = ctx.createRadialGradient(-4, -6, 2, 0, 0, 24);
    bodyGrad.addColorStop(0, '#fff3b0');
    bodyGrad.addColorStop(0.35, '#ffbe0b');
    bodyGrad.addColorStop(0.85, '#fb8500');
    bodyGrad.addColorStop(1, '#9e2a2b');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 19, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Velvet Black Fur Stripes
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(0, -6, 18.5, 4.8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 6, 18.5, 4.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stinger
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.moveTo(-3, 24);
    ctx.lineTo(0, 29);
    ctx.lineTo(3, 24);
    ctx.closePath();
    ctx.fill();

    // 3) Cute Bee Face & Eyes
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(0, -18, 13, 0, Math.PI * 2);
    ctx.fill();

    // Antennae with bobs
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-5, -28); ctx.quadraticCurveTo(-12, -38, -14, -36);
    ctx.moveTo(5, -28); ctx.quadraticCurveTo(12, -38, 14, -36);
    ctx.stroke();
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath(); ctx.arc(-14, -36, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(14, -36, 2.5, 0, Math.PI * 2); ctx.fill();

    // Eyes
    if (!player.crashed) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(-5.5, -20, 4, 5.5, -0.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(5.5, -20, 4, 5.5, 0.1, 0, Math.PI * 2); ctx.fill();

      // Pupils
      ctx.fillStyle = '#111827';
      ctx.beginPath(); ctx.arc(-5, -20, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(5, -20, 2.4, 0, Math.PI * 2); ctx.fill();

      // Specular Glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-6, -21.5, 1.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(4, -21.5, 1.1, 0, Math.PI * 2); ctx.fill();

      // Rosy Cheeks
      ctx.fillStyle = '#ff758f';
      ctx.beginPath(); ctx.arc(-9, -15, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(9, -15, 2.5, 0, Math.PI * 2); ctx.fill();
    } else {
      // Dizzy X Eyes
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, -22); ctx.lineTo(-3, -17);
      ctx.moveTo(-3, -22); ctx.lineTo(-8, -17);
      ctx.moveTo(3, -22); ctx.lineTo(8, -17);
      ctx.moveTo(8, -22); ctx.lineTo(3, -17);
      ctx.stroke();
    }

    ctx.restore();
  }

  /* ── 2-Minute Flight Celebration Modal ───────────────────── */
  function celebrate2MinComplete() {
    confetti();
    buzz([40, 100, 180]);
    if (player.score > (G3().highScore || 0)) {
      G3().highScore = player.score;
    }
    const serenityReward = Math.max(15, Math.floor(player.score / 25));
    S.game.serenity = (S.game.serenity || 0) + serenityReward;
    save();

    modal(`
      <div style="text-align:center;padding:14px 6px;color:#ffffff">
        <div style="font-size:46px;margin-bottom:8px">🐝✨</div>
        <h3 style="font-size:20px;font-weight:800;color:#ffffff;margin-bottom:6px">2-Minute Flight Complete!</h3>
        <p style="font-size:13.5px;line-height:1.6;color:rgba(255,255,255,0.85);margin:6px 0 16px">
          Your happy bumblebee gathered <b>${player.sunrays} Sunrays</b> and <b>${player.pollen} Pollen Nectar pods</b> over <b>${player.distanceMeters}m</b>!
        </p>
        <div style="background:rgba(255,255,255,0.08);backdrop-filter:blur(16px);border:1.5px solid rgba(51,102,255,0.4);border-radius:18px;padding:14px;margin-bottom:18px;text-align:left">
          <div style="display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:rgba(255,255,255,0.9)"><span>🏆 Flight Score:</span><b style="color:#ffd700;font-size:15px">${player.score} pts</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:rgba(255,255,255,0.9)"><span>⭐ High Score:</span><b style="color:#6ec1ff">${G3().highScore} pts</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:rgba(255,255,255,0.9)"><span>☀️ Sunrays:</span><b style="color:#ffffff">${player.sunrays}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:rgba(255,255,255,0.9)"><span>🍯 Pollen Blossom:</span><b style="color:#ffffff">${player.pollen}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:#6ec1ff;border-top:1px dashed rgba(255,255,255,0.15);margin-top:6px;padding-top:8px"><span>💜 Serenity Earned:</span><b>+${serenityReward} Serenity</b></div>
        </div>
        <div class="modal-btns" style="display:flex;flex-direction:column;gap:8px">
          <button class="btn btn-primary btn-block" id="orbit-continue" style="background:linear-gradient(135deg,#3366FF,#8a2eae);color:#fff;font-weight:800;font-size:14px">Fly Again 🐝</button>
          <button class="btn btn-ghost btn-block" onclick="closeModal()">Back to Games Hub</button>
        </div>
      </div>
    `);

    $('#orbit-continue')?.addEventListener('click', () => {
      sessionStart = Date.now();
      missionCompleted = false;
      player.sunrays = 0;
      player.pollen = 0;
      player.score = 0;
      player.distanceMeters = 0;
      player.z = 0;
      closeModal();
      toast('Take flight, cheerful bumblebee! 🐝🌻');
    });
  }

  /* ── Lifecycle & Interaction ─────────────────────────────── */
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
    canvas = $('#orbit-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    mounted = true;

    sessionStart = Date.now();
    missionCompleted = false;
    player.x = 0; player.y = 0; player.z = 0;
    player.vx = 0; player.vy = 0; player.vz = 9.0;
    player.sunrays = 0; player.pollen = 0; player.score = 0;
    player.boosting = false; player.crashed = false;
    particles = []; popups = [];

    init3DWorld();
    resize();
    updateHUD();

    canvas.addEventListener('pointerdown', e => {
      pointer.active = true;
      pointer.startX = e.clientX;
      pointer.startY = e.clientY;
      pointer.curX = e.clientX;
      pointer.curY = e.clientY;
    });

    window.addEventListener('pointermove', e => {
      if (pointer.active) {
        pointer.curX = e.clientX;
        pointer.curY = e.clientY;
      }
    });

    window.addEventListener('pointerup', () => {
      pointer.active = false;
    });

    window.addEventListener('resize', resize);

    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (!mounted && !canvas) return;
    mounted = false;
    cancelAnimationFrame(raf);
    if (player.score > (G3().highScore || 0)) {
      G3().highScore = player.score;
      save();
    }
    window.removeEventListener('resize', resize);
    canvas = null; ctx = null;
    objects = []; groundFlowers = []; butterflies = []; skyParticles = []; particles = []; popups = [];
  }

  return { mount, stop, triggerBoost, getHighScore: () => G3().highScore || 0 };
})();
