/* ============================================================
   MojaMind — Moja Bee 3D: Sunray Flight 🐝🌻✨
   A breathtaking interactive 3D flight adventure.
   
   Guide your cheerful resilience bee through sunny skies, collect
   glowing 3D Sunrays and Pollen Nectar pods, dodge storm clouds,
   and experience realistic crash wobble & slowdown physics.
   
   Persistent High-Scores, all-time sunray & pollen counters,
   dynamic 3D bee wing animation, and ambient synth audio.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.today
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
    vx: 0, vy: 0, vz: 8.5,
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
  let popups = [];       // Floating score & status popups
  let pointer = { active: false, startX: 0, startY: 0, curX: 0, curY: 0 };

  const G3 = () => {
    if (!S.game3d) S.game3d = { highScore: 0, pollen: 0, sunrays: 0, sound: true, bestDistance: 0, crashes: 0, totalFlights: 0 };
    return S.game3d;
  };

  const rnd = (a, b) => a + Math.random() * (b - a);
  const calm = () => motionReduced();

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
    [329.63, 440.0, 523.25, 659.26].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.3, 'sine', 0.08), i * 50);
    });
  }

  function buzz(ms) {
    try { navigator.vibrate && navigator.vibrate(ms); } catch { /* no haptics */ }
  }

  /* ── 3D Perspective Projection Matrix ───────────────────── */
  const FOV = 340;
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
    for (let i = 0; i < 280; i++) {
      skyParticles.push({
        x: rnd(-900, 900),
        y: rnd(-700, 700),
        z: rnd(20, 1900),
        r: rnd(1.2, 3.5),
        color: Math.random() < 0.45 ? '#ffd166' : Math.random() < 0.3 ? '#ffffff' : '#ffbe0b',
        fluff: Math.random() < 0.25,
      });
    }

    objects = [];
    for (let i = 0; i < 36; i++) {
      spawn3DObject(i * 110 + 180);
    }

    // 3D Meadow Floor Flowers
    groundFlowers = [];
    const flowerTypes = ['sunflower', 'lavender', 'poppy', 'daisy', 'rose'];
    for (let i = 0; i < 70; i++) {
      groundFlowers.push({
        x: rnd(-650, 650),
        y: rnd(280, 360), // Meadow terrain elevation
        z: rnd(50, 2000),
        type: flowerTypes[Math.floor(Math.random() * flowerTypes.length)],
        size: rnd(18, 38),
        swayOffset: rnd(0, Math.PI * 2),
        hue: rnd(0, 360),
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
    for (let i = 0; i < 14; i++) {
      butterflies.push({
        x: rnd(-420, 420),
        y: rnd(-160, 240),
        z: rnd(100, 1900),
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
    // 50% Sunrays, 30% Pollen Blossom, 20% Storm Cloud / Thorn
    const roll = Math.random();
    const type = roll < 0.50 ? 'sunray' : roll < 0.78 ? 'pollen' : 'cloud';
    objects.push({
      type,
      x: rnd(-340, 340),
      y: rnd(-250, 250),
      z: zPos,
      rotX: rnd(0, Math.PI * 2),
      rotY: rnd(0, Math.PI * 2),
      rotZ: rnd(0, Math.PI * 2),
      spin: rnd(0.02, 0.045),
      size: type === 'cloud' ? 58 : type === 'pollen' ? 32 : 28,
      collected: false,
    });
  }

  /* ── Floating Popups ────────────────────────────────────── */
  function addPopup(x, y, text, color = '#ffd166') {
    popups.push({ x, y, text, color, life: 1, vy: -1.35 });
  }

  /* ── High-Score Persistence Engine ──────────────────────── */
  function recordScore() {
    const g = G3();
    if (player.score > (g.highScore || 0)) {
      g.highScore = player.score;
      save();
    }
    if (player.distanceMeters > (g.bestDistance || 0)) {
      g.bestDistance = Math.round(player.distanceMeters);
      save();
    }
  }

  function finalizeSessionStats() {
    const g = G3();
    g.sunrays = (g.sunrays || 0) + player.sunrays;
    g.pollen = (g.pollen || 0) + player.pollen;
    g.totalFlights = (g.totalFlights || 0) + 1;
    recordScore();
    save();
  }

  /* ── Main 3D Render & Physics Loop ──────────────────────── */
  function frame(ts) {
    if (!mounted) return;
    const dt = Math.min(50, ts - last || 16);
    last = ts;
    t += dt;
    const now = Date.now();

    // 1) Mission 3-Minute Timer
    const elapsed = now - sessionStart;
    const timeLeft = Math.max(0, MISSION_MS - elapsed);
    const timeEl = $('#orbit-timer');
    if (timeEl) timeEl.textContent = fmtClock(timeLeft);

    if (timeLeft <= 0 && !missionCompleted) {
      missionCompleted = true;
      celebrateMissionComplete();
    }

    // 2) Boost & Crash Recovery States
    if (player.boosting && now > player.boostUntil) {
      player.boosting = false;
    }
    if (player.crashed && now > player.crashUntil) {
      player.crashed = false;
      addPopup(W / 2, H * 0.72, '✨ Recovered! Buzzing forward!', '#00a651');
    }

    // 3) Speed & Physics: Normal (8.5) -> Boost (16.0) -> Crash Slowdown (2.6)
    let forwardSpeed = 8.5;
    if (player.boosting) forwardSpeed = 16.0;
    if (player.crashed) forwardSpeed = 2.6; // Stumble slowdown!

    player.z += forwardSpeed;
    player.distanceMeters += forwardSpeed * 0.12;
    player.wingPhase += (player.boosting ? 0.32 : player.crashed ? 0.08 : 0.18) * (dt / 16);

    // Smooth steering toward target
    const ease = player.crashed ? 0.04 : 0.085;
    player.x += (player.targetX - player.x) * ease;
    player.y += (player.targetY - player.y) * ease;
    player.roll = (player.targetX - player.x) * 0.0028;
    player.pitch = (player.targetY - player.y) * 0.0028;

    if (player.crashed) {
      player.dizzyAngle += 0.22;
    } else {
      player.dizzyAngle *= 0.9;
    }

    // 4) Update Sky particles
    for (const s of skyParticles) {
      if (s.z < player.z + 10) {
        s.z = player.z + 1900;
        s.x = rnd(-900, 900) + player.x;
        s.y = rnd(-700, 700) + player.y;
      }
    }

    // 5) Object recycling & Collision detection
    for (const obj of objects) {
      if (obj.z < player.z - 50) {
        obj.z = player.z + rnd(1400, 1850);
        obj.x = rnd(-340, 340) + player.x;
        obj.y = rnd(-250, 250) + player.y;
        obj.collected = false;
      }

      // 3D rotation
      obj.rotY += obj.spin;
      obj.rotZ += obj.spin * 0.6;

      // Collision checks with bee
      if (!obj.collected && Math.abs(obj.z - player.z) < 32) {
        const dist = Math.hypot(obj.x - player.x, obj.y - player.y);

        if (obj.type === 'sunray' && dist < 46) {
          // Collect Sunray (+10 pts)
          obj.collected = true;
          player.score += 10;
          player.sunrays++;
          sunraySound();
          buzz(15);
          spawnPollenBurst(obj.x, obj.y, obj.z, '#ffd166', 22);
          const p = project(obj.x, obj.y, obj.z);
          if (p) addPopup(p.x, p.y, '+10 ☀️ Sunray!', '#ffd166');
          toast('Sunray caught! +10 ☀️', 1400);
          recordScore();
          updateHUD();

        } else if (obj.type === 'pollen' && dist < 52) {
          // Collect Pollen Blossom (+15 pts & Nectar Boost)
          obj.collected = true;
          player.score += 15;
          player.pollen++;
          player.boosting = true;
          player.boostUntil = now + 2400; // 2.4s honey rush
          pollenSound();
          buzz([20, 50, 20]);
          spawnPollenBurst(obj.x, obj.y, obj.z, '#ff9e00', 30);
          const p = project(obj.x, obj.y, obj.z);
          if (p) addPopup(p.x, p.y, '+15 🍯 Honey Rush Boost!', '#ff9e00');
          toast('Pollen Blossom! Honey Rush active 🍯🚀', 1800);
          recordScore();
          updateHUD();

        } else if (obj.type === 'cloud' && dist < 50) {
          // Crash into Storm Cloud / Thorn -> Wobble Slowdown!
          if (!player.crashed) {
            obj.collected = true;
            player.crashed = true;
            player.crashUntil = now + 1800; // 1.8s slowdown stumble
            player.score = Math.max(0, player.score - 2);
            G3().crashes = (G3().crashes || 0) + 1;
            crashSound();
            buzz([40, 90, 40]);
            spawnPollenBurst(obj.x, obj.y, obj.z, '#8a2eae', 20);
            const p = project(obj.x, obj.y, obj.z);
            if (p) addPopup(p.x, p.y, '💫 Bump! Slowed down!', '#e02043');
            toast('Ouch! Bee stumbled on a cloud · Slowing down 💫', 2200);
            recordScore();
            updateHUD();
          }
        }
      }
    }

    // 5b) Update Ground Flowers
    for (const fl of groundFlowers) {
      if (fl.z < player.z - 60) {
        fl.z = player.z + rnd(1800, 2150);
        fl.x = rnd(-650, 650) + player.x;
        fl.y = rnd(280, 360) + (player.y * 0.1);
      }
    }

    // 5c) Update Passing Butterflies
    for (const bf of butterflies) {
      bf.wingPhase += 0.28;
      bf.x += Math.sin(t * 0.002 + bf.phase) * 1.3 + bf.vx;
      bf.y += Math.cos(t * 0.003 + bf.phase) * 0.85 + bf.vy;
      bf.z += bf.vz;

      if (bf.z < player.z - 60) {
        bf.z = player.z + rnd(1400, 1900);
        bf.x = rnd(-420, 420) + player.x;
        bf.y = rnd(-160, 240) + player.y;
        bf.greeted = false;
      }

      // Friendly proximity check with cheerful resilience bonus (+5 pts)
      if (!bf.greeted && Math.abs(bf.z - player.z) < 38) {
        const dist = Math.hypot(bf.x - player.x, bf.y - player.y);
        if (dist < 48) {
          bf.greeted = true;
          player.score += 5;
          butterflyJoySound();
          buzz(12);
          spawnPollenBurst(bf.x, bf.y, bf.z, bf.theme.wingB, 16);
          const p = project(bf.x, bf.y, bf.z);
          if (p) addPopup(p.x, p.y, `+5 🦋 ${bf.theme.name}!`, bf.theme.wingA);
          toast(`Flutter! Met a ${bf.theme.name} 🦋 +5`, 1400);
          recordScore();
          updateHUD();
        }
      }
    }

    // 6) Pollen dust flight trail
    if (Math.random() < 0.85) {
      particles.push({
        x: player.x + rnd(-10, 10),
        y: player.y + 12,
        z: player.z - 12,
        vx: rnd(-0.6, 0.6),
        vy: rnd(0.4, 1.2),
        vz: -rnd(2, 4),
        color: player.boosting ? '#ff9e00' : '#ffd166',
        life: 1,
        decay: player.boosting ? 0.035 : 0.024,
        r: rnd(2, player.boosting ? 5.5 : 3.8),
      });
    }

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.z += p.vz;
      p.life -= p.decay;
    }
    particles = particles.filter(p => p.life > 0);

    // Popups update
    for (const pp of popups) {
      pp.y += pp.vy;
      pp.life -= 0.022;
    }
    popups = popups.filter(pp => pp.life > 0);

    // 7) DRAW 3D SCENE
    render3D();

    raf = requestAnimationFrame(frame);
  }

  function spawnPollenBurst(x, y, z, color, count) {
    for (let i = 0; i < count; i++) {
      const a = rnd(0, Math.PI * 2), pitch = rnd(-Math.PI / 2, Math.PI / 2);
      const sp = rnd(2, 6.5);
      particles.push({
        x, y, z,
        vx: Math.cos(a) * Math.cos(pitch) * sp,
        vy: Math.sin(pitch) * sp,
        vz: Math.sin(a) * Math.cos(pitch) * sp,
        color,
        life: 1,
        decay: rnd(0.018, 0.038),
        r: rnd(2.5, 5.5),
      });
    }
  }

  function render3D() {
    ctx.clearRect(0, 0, W, H);

    // 1) Sunny Summer Sky Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#5ea8ff');   // Sunny blue zenith
    bgGrad.addColorStop(0.52, '#a3d8ff'); // Horizon light
    bgGrad.addColorStop(0.72, '#ffdf9e'); // Golden sunlight warmth
    bgGrad.addColorStop(1, '#ffc470');   // Golden floral horizon
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Soft Sun Radiance in distance
    const sunGrad = ctx.createRadialGradient(W * 0.5, H * 0.28, 10, W * 0.5, H * 0.28, W * 0.65);
    sunGrad.addColorStop(0, 'rgba(255,255,255,0.75)');
    sunGrad.addColorStop(0.2, 'rgba(255,230,140,0.45)');
    sunGrad.addColorStop(1, 'rgba(255,200,80,0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, W, H);

    // 2) 3D Meadow Valley Floor & Sparkling Winding River
    drawMeadowAndRiver();

    // 3) 3D Meadow Floor Flowers
    drawGroundFlowers();

    // Draw Sky Particles (Sun glints & floating dandelion seeds)
    for (const s of skyParticles) {
      const p = project(s.x, s.y, s.z);
      if (!p) continue;
      const size = s.r * p.scale * 0.05;
      const alpha = Math.min(1, Math.max(0.15, 1 - p.relZ / 1900));

      ctx.fillStyle = s.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.8, size), 0, Math.PI * 2);
      ctx.fill();

      // Honey Rush speed streaks
      if (player.boosting) {
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = size * 0.8;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - (p.x - W / 2) * 0.12, p.y - (p.y - H / 2) * 0.12);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // Draw 3D Pollen Trail Particles
    for (const part of particles) {
      const p = project(part.x, part.y, part.z);
      if (!p) continue;
      ctx.fillStyle = part.color;
      ctx.globalAlpha = Math.max(0, part.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1.2, part.r * p.scale * 0.08), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 4) Sort 3D Objects & Butterflies by distance (Z-depth sorting)
    const renderList = [
      ...objects.filter(o => o.z > player.z + 5 && !o.collected).map(o => ({ kind: 'object', item: o, z: o.z })),
      ...butterflies.filter(b => b.z > player.z + 5).map(b => ({ kind: 'butterfly', item: b, z: b.z }))
    ].sort((a, b) => b.z - a.z);

    for (const entry of renderList) {
      if (entry.kind === 'butterfly') {
        drawButterfly(entry.item);
        continue;
      }

      const obj = entry.item;
      const p = project(obj.x, obj.y, obj.z);
      if (!p) continue;

      ctx.save();
      ctx.translate(p.x, p.y);

      if (obj.type === 'sunray') {
        // 3D Spinning Golden Sunray Starburst
        const sz = obj.size * p.scale * 0.11;
        ctx.rotate(obj.rotZ);
        ctx.fillStyle = '#ffb703';
        ctx.shadowColor = '#ffd166';
        ctx.shadowBlur = 16 * p.scale * 0.05;

        // Radiating 8-point sunray star
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a1 = (i / 8) * Math.PI * 2;
          const a2 = ((i + 0.5) / 8) * Math.PI * 2;
          const rOuter = sz;
          const rInner = sz * 0.45;
          if (i === 0) ctx.moveTo(Math.cos(a1) * rOuter, Math.sin(a1) * rOuter);
          else ctx.lineTo(Math.cos(a1) * rOuter, Math.sin(a1) * rOuter);
          ctx.lineTo(Math.cos(a2) * rInner, Math.sin(a2) * rInner);
        }
        ctx.closePath();
        ctx.fill();

        // Inner glowing core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, sz * 0.35, 0, Math.PI * 2);
        ctx.fill();

      } else if (obj.type === 'pollen') {
        // 3D Glowing Pollen Blossom Pod
        const sz = obj.size * p.scale * 0.12;
        ctx.rotate(obj.rotY);
        ctx.fillStyle = '#ff8500';
        ctx.shadowColor = '#ffb703';
        ctx.shadowBlur = 20 * p.scale * 0.05;

        // Flower Petals
        for (let k = 0; k < 6; k++) {
          ctx.save();
          ctx.rotate(k * Math.PI / 3 + obj.rotX);
          ctx.fillStyle = k % 2 === 0 ? '#ffb703' : '#ffd000';
          ctx.beginPath();
          ctx.ellipse(0, -sz * 0.65, sz * 0.35, sz * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Golden Nectar Center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, sz * 0.4, 0, Math.PI * 2);
        ctx.fill();

      } else if (obj.type === 'cloud') {
        // 3D Storm Cloud / Thorn Obstacle
        const sz = obj.size * p.scale * 0.11;
        ctx.fillStyle = '#5c4d68';
        ctx.strokeStyle = '#3d3049';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#2b1b38';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(-sz * 0.5, 0, sz * 0.45, 0, Math.PI * 2);
        ctx.arc(0, -sz * 0.3, sz * 0.55, 0, Math.PI * 2);
        ctx.arc(sz * 0.5, 0, sz * 0.45, 0, Math.PI * 2);
        ctx.arc(0, sz * 0.25, sz * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Mini lightning spark
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.moveTo(-sz * 0.1, -sz * 0.2);
        ctx.lineTo(sz * 0.1, 0);
        ctx.lineTo(-sz * 0.05, 0.05);
        ctx.lineTo(sz * 0.1, sz * 0.3);
        ctx.lineTo(-sz * 0.1, sz * 0.1);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    // 5) Draw The Cheerful 3D Animated Bumblebee (Foreground)
    drawPlayerBee();

    // 6) Draw Floating Score & Status Popups
    for (const pp of popups) {
      ctx.globalAlpha = Math.max(0, pp.life);
      ctx.fillStyle = pp.color;
      ctx.font = '700 13.5px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 4;
      ctx.fillText(pp.text, pp.x, pp.y);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }

  /* ── 3D Meadow Terrain & Sparkling Winding River ────────── */
  function drawMeadowAndRiver() {
    const horizonY = H * 0.55 + (player.pitch * 35);

    // Rolling Green Meadow Floor
    const meadowGrad = ctx.createLinearGradient(0, horizonY, 0, H);
    meadowGrad.addColorStop(0, '#52b788');   // Distant sunlit meadow
    meadowGrad.addColorStop(0.35, '#40916c'); // Emerald lush grass
    meadowGrad.addColorStop(0.75, '#2d6a4f'); // Deep green foliage
    meadowGrad.addColorStop(1, '#1b4332');    // Foreground rich earth
    ctx.fillStyle = meadowGrad;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    // 3D Winding River
    const steps = 14;
    const riverLeft = [];
    const riverRight = [];

    for (let i = steps; i >= 1; i--) {
      const zRel = i * 110 + 20;
      const z = player.z + zRel;
      const curve = Math.sin((z - player.z) * 0.003 + t * 0.001) * 160;
      const riverWidth = Math.max(14, (1 - (i / steps)) * 140 + 16);

      const pL = project(curve - riverWidth, 310, z);
      const pR = project(curve + riverWidth, 310, z);
      if (pL && pR) {
        riverLeft.push(pL);
        riverRight.push(pR);
      }
    }

    if (riverLeft.length > 2) {
      // River Water Polygon
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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < riverLeft.length - 1; i += 2) {
        const midX = (riverLeft[i].x + riverRight[i].x) / 2;
        const midY = (riverLeft[i].y + riverRight[i].y) / 2;
        const shimmer = Math.sin(t * 0.006 + i) * 12;
        ctx.beginPath();
        ctx.moveTo(midX - 10 + shimmer, midY);
        ctx.lineTo(midX + 10 + shimmer, midY);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  /* ── 3D Ground Flowers Renderer ─────────────────────────── */
  function drawGroundFlowers() {
    const sortedFlowers = [...groundFlowers].filter(f => f.z > player.z + 5).sort((a, b) => b.z - a.z);

    for (const fl of sortedFlowers) {
      const p = project(fl.x, fl.y, fl.z);
      if (!p) continue;

      const sz = fl.size * p.scale * 0.12;
      if (sz < 2) continue;

      const sway = Math.sin(t * 0.003 + fl.swayOffset) * (sz * 0.3);

      ctx.save();
      ctx.translate(p.x, p.y);

      // Green Flower Stem
      ctx.strokeStyle = '#2d6a4f';
      ctx.lineWidth = Math.max(1, sz * 0.18);
      ctx.beginPath();
      ctx.moveTo(0, sz * 0.8);
      ctx.quadraticCurveTo(sway * 0.5, sz * 0.4, sway, 0);
      ctx.stroke();

      // Flower Blossom Head
      ctx.translate(sway, 0);

      if (fl.type === 'sunflower') {
        // Bright Sunflower Petals
        ctx.fillStyle = '#ffd166';
        for (let k = 0; k < 8; k++) {
          ctx.save();
          ctx.rotate(k * Math.PI / 4);
          ctx.beginPath();
          ctx.ellipse(0, -sz * 0.55, sz * 0.22, sz * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // Chocolate Center
        ctx.fillStyle = '#6b3e0e';
        ctx.beginPath();
        ctx.arc(0, 0, sz * 0.35, 0, Math.PI * 2);
        ctx.fill();

      } else if (fl.type === 'lavender') {
        // Purple Lavender Spike
        ctx.fillStyle = '#8a2eae';
        for (let k = 0; k < 5; k++) {
          ctx.beginPath();
          ctx.arc(rnd(-1, 1), -k * (sz * 0.28), sz * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (fl.type === 'poppy') {
        // Vibrant Red Poppy
        ctx.fillStyle = '#f3256b';
        for (let k = 0; k < 4; k++) {
          ctx.save();
          ctx.rotate(k * Math.PI / 2);
          ctx.beginPath();
          ctx.ellipse(0, -sz * 0.45, sz * 0.35, sz * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(0, 0, sz * 0.2, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // Daisy / Wildflower
        ctx.fillStyle = '#ffffff';
        for (let k = 0; k < 6; k++) {
          ctx.save();
          ctx.rotate(k * Math.PI / 3);
          ctx.beginPath();
          ctx.ellipse(0, -sz * 0.45, sz * 0.18, sz * 0.35, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.arc(0, 0, sz * 0.22, 0, Math.PI * 2);
        ctx.fill();
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

    // Slender Butterfly Body
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(0, 0, sz * 0.15, sz * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Antennae
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-1, -sz * 0.5);
    ctx.quadraticCurveTo(-sz * 0.3, -sz * 0.9, -sz * 0.4, -sz * 0.8);
    ctx.moveTo(1, -sz * 0.5);
    ctx.quadraticCurveTo(sz * 0.3, -sz * 0.9, sz * 0.4, -sz * 0.8);
    ctx.stroke();

    // Wings (Flapping in 3D)
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

    // Wing Spots
    ctx.fillStyle = bf.theme.spot;
    ctx.beginPath();
    ctx.arc(-sz * 0.7, -sz * 0.35, sz * 0.12, 0, Math.PI * 2);
    ctx.arc(-sz * 0.5, sz * 0.35, sz * 0.09, 0, Math.PI * 2);
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

    // Wing Spots
    ctx.fillStyle = bf.theme.spot;
    ctx.beginPath();
    ctx.arc(sz * 0.7, -sz * 0.35, sz * 0.12, 0, Math.PI * 2);
    ctx.arc(sz * 0.5, sz * 0.35, sz * 0.09, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  /* ── 3D Animated Bumblebee Renderer ─────────────────────── */
  function drawPlayerBee() {
    const cx = W / 2, cy = H * 0.75;
    ctx.save();
    ctx.translate(cx, cy);

    // Apply flight tilt roll & crash stumble wobble
    const totalRoll = player.roll * 1.6 + (player.crashed ? Math.sin(player.dizzyAngle) * 0.45 : 0);
    const totalPitch = player.pitch * 1.4 + (player.crashed ? Math.cos(player.dizzyAngle) * 0.3 : 0);
    ctx.rotate(totalRoll);
    ctx.translate(0, totalPitch * 20);

    // 1) Translucent Fluttering Wings
    const wingFlap = Math.sin(player.wingPhase * 14) * 0.85;
    ctx.save();
    ctx.fillStyle = 'rgba(230, 245, 255, 0.72)';
    ctx.strokeStyle = 'rgba(180, 220, 255, 0.9)';
    ctx.lineWidth = 1.4;

    // Left Wing
    ctx.save();
    ctx.translate(-10, -8);
    ctx.scale(wingFlap, 1);
    ctx.beginPath();
    ctx.ellipse(-14, -12, 16, 8, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Right Wing
    ctx.save();
    ctx.translate(10, -8);
    ctx.scale(wingFlap, 1);
    ctx.beginPath();
    ctx.ellipse(14, -12, 16, 8, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();

    // 2) Plump Striped Bumblebee Body
    ctx.shadowColor = player.boosting ? '#ff9e00' : 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = player.boosting ? 20 : 8;

    // Golden Yellow Base Body
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Velvet Black Stripes
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(0, -6, 17.5, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 6, 17.5, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute Tail Stinger
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.moveTo(-3, 23);
    ctx.lineTo(0, 28);
    ctx.lineTo(3, 23);
    ctx.closePath();
    ctx.fill();

    // 3) Cute Bee Face & Big Curious Eyes
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(0, -18, 12, 0, Math.PI * 2);
    ctx.fill();

    // Big Shiny Cartoon Eyes
    if (!player.crashed) {
      // Normal Happy Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(-5, -20, 3.8, 5, -0.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(5, -20, 3.8, 5, 0.1, 0, Math.PI * 2); ctx.fill();

      // Eye pupils
      ctx.fillStyle = '#111827';
      ctx.beginPath(); ctx.arc(-4.5, -20, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(4.5, -20, 2.2, 0, Math.PI * 2); ctx.fill();

      // Eye glimmer
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-5.5, -21.5, 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(3.5, -21.5, 0.9, 0, Math.PI * 2); ctx.fill();

      // Rosy Cheeks
      ctx.fillStyle = '#ff758f';
      ctx.beginPath(); ctx.arc(-8, -15, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -15, 2.2, 0, Math.PI * 2); ctx.fill();
    } else {
      // Dizzy Stumble Eyes (X eyes when crashed)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-7, -22); ctx.lineTo(-3, -18);
      ctx.moveTo(-3, -22); ctx.lineTo(-7, -18);
      ctx.moveTo(3, -22); ctx.lineTo(7, -18);
      ctx.moveTo(7, -22); ctx.lineTo(3, -18);
      ctx.stroke();
    }

    // Antennae
    const antSway = Math.sin(t / 120) * 1.5;
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    // Left Antenna
    ctx.beginPath();
    ctx.moveTo(-4, -28);
    ctx.quadraticCurveTo(-10 + antSway, -36, -12 + antSway, -35);
    ctx.stroke();
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath(); ctx.arc(-12 + antSway, -35, 2.2, 0, Math.PI * 2); ctx.fill();

    // Right Antenna
    ctx.beginPath();
    ctx.moveTo(4, -28);
    ctx.quadraticCurveTo(10 - antSway, -36, 12 - antSway, -35);
    ctx.stroke();
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath(); ctx.arc(12 - antSway, -35, 2.2, 0, Math.PI * 2); ctx.fill();

    // 4) Dizzy Stars Orbiting Head when Crashed
    if (player.crashed) {
      for (let k = 0; k < 3; k++) {
        const starAng = player.dizzyAngle * 1.8 + (k * Math.PI * 2) / 3;
        const sx = Math.cos(starAng) * 22;
        const sy = -28 + Math.sin(starAng) * 7;
        ctx.fillStyle = '#ffd166';
        ctx.font = '14px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💫', sx, sy);
      }
    }

    ctx.restore();
  }

  /* ── Input Handlers ─────────────────────────────────────── */
  function onPointerDown(e) {
    pointer.active = true;
    pointer.startX = e.clientX;
    pointer.startY = e.clientY;
    updateTarget(e.clientX, e.clientY);
  }

  function onPointerMove(e) {
    if (!pointer.active) return;
    updateTarget(e.clientX, e.clientY);
  }

  function onPointerUp() {
    pointer.active = false;
  }

  function updateTarget(cx, cy) {
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const relX = (cx - r.left) / r.width - 0.5;
    const relY = (cy - r.top) / r.height - 0.5;
    player.targetX = relX * 420;
    player.targetY = relY * 320;
  }

  function updateHUD() {
    const sEl = $('#orbit-score'); if (sEl) sEl.textContent = player.score;
    const hEl = $('#orbit-high'); if (hEl) hEl.textContent = G3().highScore || player.score;
    const cEl = $('#orbit-sunrays'); if (cEl) cEl.textContent = player.sunrays;
    const gEl = $('#orbit-pollen'); if (gEl) gEl.textContent = player.pollen;
    const lEl = $('#orbit-dist'); if (lEl) lEl.textContent = Math.round(player.distanceMeters) + 'm';
  }

  function celebrateMissionComplete() {
    finalizeSessionStats();
    confetti();
    buzz([30, 60, 100]);
    S.game.serenity = (S.game.serenity || 0) + 25;
    save();

    const isNewHigh = player.score >= (G3().highScore || 0);

    modal(`
      <div style="text-align:center;padding:12px 4px">
        <div style="font-size:46px;margin-bottom:8px">🐝🌻</div>
        <h3 style="font-size:20px;font-weight:800;color:var(--ink)">2-Minute Sunray Flight Complete!</h3>
        ${isNewHigh ? `<div style="display:inline-block;background:linear-gradient(135deg,#ffd166,#f3256b);color:#fff;font-weight:800;font-size:11px;padding:3px 10px;border-radius:999px;margin-bottom:8px">🏆 NEW HIGH SCORE!</div>` : ''}
        <p style="font-size:13.5px;line-height:1.6;color:var(--ink-soft);margin:6px 0 14px">
          Your happy bumblebee gathered <b>${player.sunrays} Sunrays</b> and <b>${player.pollen} Pollen Nectar pods</b>!
        </p>
        <div style="background:#faf7ff;border:1.5px solid #dcc6f2;border-radius:14px;padding:12px;margin-bottom:16px;text-align:left">
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>🏆 Session Score:</span><b>${player.score} pts</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>⭐ All-Time High Score:</span><b style="color:#8a2eae">${G3().highScore} pts</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>📏 Distance Flown:</span><b>${Math.round(player.distanceMeters)} meters</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:#8a2eae"><span>💜 Serenity Award:</span><b>+25 Serenity &amp; Hope</b></div>
        </div>
        <div class="modal-btns">
          <button class="btn btn-primary" id="orbit-continue">Keep Flying 🐝</button>
          <button class="btn btn-ghost" onclick="closeModal()">Back to Games</button>
        </div>
      </div>
    `);

    $('#orbit-continue')?.addEventListener('click', () => {
      sessionStart = Date.now();
      missionCompleted = false;
      closeModal();
      toast('Buzzing onward into the sunshine ✨🌻');
    });
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
    canvas = $('#orbit-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    mounted = true;

    sessionStart = Date.now();
    missionCompleted = false;

    // Countdown Timer starts @ 2:00 and goes down
    const timeEl = $('#orbit-timer');
    if (timeEl) timeEl.textContent = '2:00';

    player = {
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 8.5,
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

    init3DWorld();
    resize();
    updateHUD();

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', resize);

    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (!mounted && !canvas) return;
    finalizeSessionStats();
    mounted = false;
    cancelAnimationFrame(raf);
    if (canvas) {
      canvas.removeEventListener('pointerdown', onPointerDown);
    }
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('resize', resize);
    canvas = null;
    ctx = null;
    skyParticles = [];
    objects = [];
    particles = [];
    popups = [];
  }

  function triggerBoost() {
    if (!mounted) return;
    player.boosting = true;
    player.boostUntil = Date.now() + 2200;
    boostSound();
    buzz(25);
    addPopup(W / 2, H * 0.72, '⚡ Honey Rush!', '#ff9e00');
  }

  return { mount, stop, triggerBoost, getHighScore: () => G3().highScore || 0 };
})();
