/* ============================================================
   MojaMind — Moja Bee 3D: Sunray Flight 🐝🌻✨
   Next-Generation High-Fidelity 3D Interactive Flight Adventure.
   
   Visual & Engine Features:
   - High-definition 3D bumblebee with velvety fur gradients,
     translucent iridescent double wings, glossy expressive eyes,
     and flexible bobbing antennae.
   - Volumetric atmospheric sky with rotating sunbeam shafts,
     radiant solar corona, and drifting layered clouds.
   - 3-Layer parallax mountain vistas (Far Alpine, Mid Ridge, Foothills).
   - Rolling 3D meadow terrain with wind-swayed sunflowers, lavenders,
     poppies, and a sparkling winding crystal river with wave caustics.
   - 3D Rotating Sunray Crystals with gyroscopic energy rings.
   - 3D Hexagonal Pollen Honeycomb Pods with floating amber auras.
   - 3D Billowy Volumetric Storm Thunderclouds with electric lightning.
   - Fluttering 3D Butterflies with flapping wing physics.
   - Supersonic Honey Rush with golden warp tunnel speed lines.
   - 2-Minute Flight Challenge HUD with Ionity transparent glassmorphism.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za
   ============================================================ */
'use strict';

const MMGame3D = (() => {
  let canvas = null, ctx = null, W = 0, H = 0, dpr = 1;
  let raf = 0, last = 0, t = 0, mounted = false;
  let ac = null;

  // 3D Flight Session State
  const MISSION_MS = 120000; // 2-Minute Flight Challenge (120s)
  let sessionStart = 0;
  let missionCompleted = false;

  let player = {
    x: 0, y: 0, z: 0,
    vx: 0, vy: 0, vz: 9.5,
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

  let skyParticles = []; // Atmospheric sun dust, pollen grains, dandelion fluff
  let clouds = [];       // High-altitude drifting clouds
  let objects = [];      // 3D Sunrays, Pollen Blossoms, Storm Clouds
  let groundFlowers = []; // 3D Sunflowers, lavenders, poppies on meadow floor
  let butterflies = [];  // 3D Passing fluttering butterflies
  let particles = [];    // Trail particles & pickup bursts
  let speedLines = [];   // Honey Rush warp speed lines
  let popups = [];       // Floating score & status popups
  let pointer = { active: false, startX: 0, startY: 0, curX: 0, curY: 0 };

  const G3 = () => {
    if (!S.game3d) S.game3d = { highScore: 0, pollen: 0, sunrays: 0, sound: false, bestDistance: 0, crashes: 0, totalFlights: 0 };
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

  function playTone(freq, dur = 0.25, type = 'sine', vol = 0.05) {
    const a = audio(); if (!a) return;
    try {
      const o = a.createOscillator(), g = a.createGain(), lp = a.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1900;
      o.type = type; o.frequency.setValueAtTime(freq, a.currentTime);
      g.gain.setValueAtTime(Math.min(vol, 0.06), a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
      o.connect(lp); lp.connect(g); g.connect(a.destination);
      o.start(); o.stop(a.currentTime + dur + 0.05);
    } catch { /* audio safeguard */ }
  }

  function sunraySound() {
    [523.25, 659.26, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.35, 'triangle', 0.05), i * 55);
    });
  }

  function pollenSound() {
    [440.0, 554.37, 659.26, 880.0].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.45, 'sine', 0.06), i * 70);
    });
  }

  function butterflyJoySound() {
    [659.26, 880.0, 1174.66, 1318.5].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.3, 'sine', 0.04), i * 45);
    });
  }

  function crashSound() {
    const a = audio(); if (!a) return;
    try {
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(200, a.currentTime);
      o.frequency.exponentialRampToValueAtTime(80, a.currentTime + 0.3);
      g.gain.setValueAtTime(0.06, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.3);
      o.connect(g); g.connect(a.destination);
      o.start(); o.stop(a.currentTime + 0.35);
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
  const FOV = 380;
  function project(x, y, z) {
    const relZ = z - player.z;
    if (relZ <= 4) return null; // behind camera
    const scale = FOV / relZ;
    const px = (x - player.x) * scale + W / 2;
    const py = (y - player.y) * scale + H / 2;
    return { x: px, y: py, scale, relZ };
  }

  /* ── 3D World Generation ────────────────────────────────── */
  function init3DWorld() {
    // 1) Sky dust & floating pollen
    skyParticles = [];
    for (let i = 0; i < 280; i++) {
      skyParticles.push({
        x: rnd(-800, 800),
        y: rnd(-450, 200),
        z: rnd(20, 2400),
        r: rnd(1.5, 4.2),
        color: ['#ffd166', '#fff3b0', '#ffffff', '#6ec1ff', '#ffb703'][Math.floor(rnd(0, 5))],
        driftSpeed: rnd(0.001, 0.003),
      });
    }

    // 2) High altitude cirrus / cumulus clouds
    clouds = [];
    for (let i = 0; i < 14; i++) {
      clouds.push({
        x: rnd(-1200, 1200),
        y: rnd(-420, -180),
        z: rnd(400, 3200),
        width: rnd(220, 480),
        height: rnd(60, 140),
        opacity: rnd(0.35, 0.75),
      });
    }

    // 3) Meadow floor flowers
    groundFlowers = [];
    const flowerTypes = ['sunflower', 'lavender', 'poppy', 'daisy'];
    for (let i = 0; i < 160; i++) {
      groundFlowers.push({
        x: rnd(-800, 800),
        y: rnd(220, 340),
        z: rnd(50, 2600),
        type: flowerTypes[Math.floor(rnd(0, flowerTypes.length))],
        size: rnd(24, 46),
        swayOffset: rnd(0, Math.PI * 2),
      });
    }

    // 4) 3D Passing butterflies
    butterflies = [];
    const butterflyThemes = [
      { wingA: '#3366FF', wingB: '#6ec1ff', name: 'Morpho Blue' },
      { wingA: '#f3256b', wingB: '#ff758f', name: 'Ruby Sunset' },
      { wingA: '#ffd166', wingB: '#ffb703', name: 'Golden Monarch' },
      { wingA: '#8a2eae', wingB: '#c76ad8', name: 'Amethyst Flutter' },
    ];
    for (let i = 0; i < 16; i++) {
      butterflies.push({
        x: rnd(-450, 450),
        y: rnd(-120, 200),
        z: rnd(200, 2500),
        size: rnd(24, 38),
        theme: butterflyThemes[Math.floor(rnd(0, butterflyThemes.length))],
        vx: rnd(-0.6, 0.6),
        vy: rnd(-0.4, 0.4),
        wingPhase: rnd(0, Math.PI * 2),
      });
    }

    // 5) Active 3D Objects in flight corridor
    objects = [];
    for (let z = 200; z < 3200; z += 130) {
      spawn3DObject(z);
    }
  }

  function spawn3DObject(zPos) {
    const typeRoll = Math.random();
    let type = 'sunray';
    if (typeRoll < 0.52) type = 'sunray';
    else if (typeRoll < 0.82) type = 'pollen';
    else type = 'storm';

    objects.push({
      x: rnd(-360, 360),
      y: rnd(-200, 210),
      z: zPos,
      type,
      rot: rnd(0, Math.PI * 2),
      size: type === 'storm' ? rnd(70, 100) : type === 'pollen' ? rnd(32, 44) : rnd(30, 42),
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
    player.boostUntil = Date.now() + 5200;
    player.vz = 18.0;
    boostSound();
    buzz([30, 80, 140]);
    addPopup(W / 2, H * 0.38, '⚡ SUPERSONIC HONEY RUSH! 🍯', '#ffd700');
    toast('⚡ Supersonic Honey Rush activated! 2x Speed & Score!', 2400);

    for (let i = 0; i < 36; i++) {
      particles.push({
        x: W / 2 + rnd(-60, 60),
        y: H * 0.74 + rnd(-40, 40),
        vx: rnd(-3, 3),
        vy: rnd(2, 7),
        color: ['#ffd700', '#ffb703', '#6ec1ff', '#ffffff'][Math.floor(rnd(0, 4))],
        life: 1,
        decay: 0.025,
        r: rnd(3, 8),
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
    const remaining = Math.max(0, MISSION_MS - elapsed);
    const tEl = $('#orbit-timer');
    if (tEl) tEl.textContent = fmtClock(remaining);

    if (remaining <= 0 && !missionCompleted) {
      missionCompleted = true;
      celebrate2MinComplete();
    }

    // 2) Boost State & Crash State
    if (player.boosting && now > player.boostUntil) {
      player.boosting = false;
      player.vz = 9.5;
    }
    if (player.crashed && now > player.crashUntil) {
      player.crashed = false;
      player.vz = player.boosting ? 18.0 : 9.5;
    }

    // 3) Smooth Steering & Aerodynamic Flight Physics
    player.x += (player.targetX - player.x) * 0.16;
    player.y += (player.targetY - player.y) * 0.16;

    player.roll = (player.targetX - player.x) * -0.004;
    player.pitch = (player.targetY - player.y) * 0.0045;
    player.wingPhase += player.boosting ? 0.42 : player.crashed ? 0.08 : 0.26;

    if (player.crashed) {
      player.dizzyAngle += 0.14;
    }

    // Forward Flight Movement
    player.z += player.vz;
    player.distanceMeters = Math.floor(player.z / 10);

    // Continuous Wing Sparkle Particles
    if (Math.random() < (player.boosting ? 0.85 : 0.45)) {
      const cx = W / 2, cy = H * 0.74;
      particles.push({
        x: cx + rnd(-24, 24),
        y: cy + rnd(10, 28),
        vx: rnd(-1.5, 1.5) - player.roll * 8,
        vy: rnd(2, 6),
        color: player.boosting ? '#ffd700' : '#ffea79',
        life: 1,
        decay: player.boosting ? 0.03 : 0.045,
        r: rnd(2, 5),
      });
    }

    // 4) Update 3D World Elements
    // Clouds recycle
    for (const c of clouds) {
      if (c.z < player.z + 100) {
        c.z = player.z + 3200 + rnd(0, 400);
        c.x = rnd(-1200, 1200);
      }
    }

    // Sky particles recycle
    for (const sp of skyParticles) {
      if (sp.z < player.z + 20) {
        sp.z = player.z + 2400 + rnd(0, 300);
        sp.x = rnd(-800, 800);
        sp.y = rnd(-450, 200);
      }
    }

    // Ground flowers recycle
    for (const fl of groundFlowers) {
      if (fl.z < player.z + 30) {
        fl.z = player.z + 2600 + rnd(0, 300);
        fl.x = rnd(-800, 800);
        fl.y = rnd(220, 340);
      }
    }

    // Butterflies update & recycle
    for (const bf of butterflies) {
      bf.x += bf.vx;
      bf.y += bf.vy + Math.sin(t * 0.004) * 0.3;
      bf.wingPhase += 0.22;
      if (bf.z < player.z + 20) {
        bf.z = player.z + 2500 + rnd(0, 400);
        bf.x = rnd(-450, 450);
        bf.y = rnd(-120, 200);
      }

      // Check gentle butterfly encounter
      const dz = Math.abs(bf.z - player.z);
      if (dz < 45 && Math.hypot(bf.x - player.x, bf.y - player.y) < 45) {
        butterflyJoySound();
        addPopup(W / 2, H * 0.5, `🌸 Joy +15! (${bf.theme.name})`, bf.theme.wingA);
        player.score += 15;
        bf.z = player.z + 2600; // gentle pass
      }
    }

    // 3D Objects update & collision detection
    for (const obj of objects) {
      obj.rot += 0.035;
      obj.pulse += 0.045;

      const dz = obj.z - player.z;

      // Recycle passed objects
      if (dz < -60) {
        obj.z = player.z + 3000 + rnd(0, 300);
        obj.x = rnd(-360, 360);
        obj.y = rnd(-200, 210);
        obj.collected = false;
      }

      // Hit-test
      if (!obj.collected && dz > 5 && dz < 55) {
        const dist2D = Math.hypot(obj.x - player.x, obj.y - player.y);
        const colRadius = obj.type === 'storm' ? 52 : 36;

        if (dist2D < colRadius) {
          obj.collected = true;

          if (obj.type === 'sunray') {
            // Sunray crystal collected
            player.sunrays++;
            const pts = player.boosting ? 20 : 10;
            player.score += pts;
            G3().sunrays = (G3().sunrays || 0) + 1;
            sunraySound();
            buzz(40);
            spawnPickupBurst(obj.x, obj.y, obj.z, '#ffd166');
            addPopup(W / 2, H * 0.45, `+${pts} ☀️ Sunray!`, '#ffd166');

          } else if (obj.type === 'pollen') {
            // Pollen blossom collected
            player.pollen++;
            const pts = player.boosting ? 50 : 25;
            player.score += pts;
            G3().pollen = (G3().pollen || 0) + 1;
            pollenSound();
            buzz([50, 40, 60]);
            spawnPickupBurst(obj.x, obj.y, obj.z, '#ff9e00');
            addPopup(W / 2, H * 0.45, `+${pts} 🍯 Pollen Harvest!`, '#ff9e00');

            // Collect 3 pollen to trigger automatic Honey Rush
            if (player.pollen % 3 === 0) {
              triggerBoost();
            }

          } else if (obj.type === 'storm') {
            // Hit Storm Cloud: cause dizzy slowdown wobble
            if (!player.boosting) {
              player.crashed = true;
              player.crashUntil = now + 2400;
              player.vz = 4.2;
              G3().crashes = (G3().crashes || 0) + 1;
              crashSound();
              buzz([120, 80, 120]);
              spawnPickupBurst(obj.x, obj.y, obj.z, '#a78bfa');
              addPopup(W / 2, H * 0.45, '⛈️ Storm Cloud Wobble! -5', '#f43f5e');
              player.score = Math.max(0, player.score - 5);
            } else {
              // Smashed through storm with Supersonic Honey Rush!
              player.score += 30;
              addPopup(W / 2, H * 0.45, '⚡ STORM PIERCED! +30', '#38bdf8');
              spawnPickupBurst(obj.x, obj.y, obj.z, '#38bdf8');
            }
          }
        }
      }
    }

    // Update Particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
    }
    particles = particles.filter(p => p.life > 0);

    // Update Popups
    for (const pp of popups) {
      pp.y += pp.vy;
      pp.life -= 0.024;
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
    for (let i = 0; i < 28; i++) {
      const a = rnd(0, Math.PI * 2), sp = rnd(2.5, 7.5);
      particles.push({
        x: p.x, y: p.y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        color,
        life: 1,
        decay: rnd(0.02, 0.045),
        r: rnd(3, 6.5),
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

  /* ── High-End 3D Scene Rendering Pipeline ────────────────── */
  function render3DScene() {
    ctx.clearRect(0, 0, W, H);

    // 1) Multi-Stop Atmospheric Gradient Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.72);
    skyGrad.addColorStop(0, '#0d2b63');     // Deep azure zenith
    skyGrad.addColorStop(0.35, '#2563eb');  // Radiant royal sky
    skyGrad.addColorStop(0.65, '#60a5fa');  // Luminous morning cyan
    skyGrad.addColorStop(0.88, '#fde68a');  // Warm sunlit horizon
    skyGrad.addColorStop(1, '#ffedd5');     // Horizon mist
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // 2) Volumetric Sun & Rotating God Rays
    drawRadiantSunAndBeams();

    // 3) Layered High-Altitude Cirrus Clouds
    drawHighClouds();

    // 4) 3-Tier Distant Mountain Ranges
    drawMountainVistas();

    // 5) 3D Rolling Meadow Terrain & Sparkling Winding River
    drawMeadowAndRiver();

    // 6) 3D Sky Dust & Dandelion Fluff
    drawSkyDust();

    // 7) 3D Ground Flowers (Sunflowers, Lavenders, Poppies)
    drawGroundFlowers();

    // 8) 3D Passing Fluttering Butterflies
    for (const bf of butterflies) drawButterfly(bf);

    // 9) 3D Interactive Collectibles & Storm Obstacles (Z-Sorted)
    const sortedObjects = [...objects].filter(o => o.z > player.z + 4).sort((a, b) => b.z - a.z);

    for (const obj of sortedObjects) {
      if (obj.collected) continue;
      const p = project(obj.x, obj.y, obj.z);
      if (!p) continue;

      ctx.save();
      ctx.translate(p.x, p.y);

      if (obj.type === 'sunray') {
        draw3DSunrayPrism(obj, p.scale);
      } else if (obj.type === 'pollen') {
        draw3DPollenPod(obj, p.scale);
      } else {
        draw3DStormCloud(obj, p.scale);
      }

      ctx.restore();
    }

    // 10) Supersonic Honey Rush Warp Speed Lines
    if (player.boosting) {
      drawHoneyRushWarpLines();
    }

    // 11) High-Definition 3D Bumblebee Character (Foreground)
    drawPlayerBee();

    // 12) Particle FX & Floating 3D Popups
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
      ctx.font = '800 15px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.65)';
      ctx.shadowBlur = 8;
      ctx.fillText(pp.text, pp.x, pp.y);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }

  /* ── 1) Volumetric Sun & Rotating God Rays ───────────────── */
  function drawRadiantSunAndBeams() {
    const sunX = W * 0.74 - player.roll * 50;
    const sunY = H * 0.22 - player.pitch * 40;

    ctx.save();
    // Rotating Sunbeam God Rays
    const beamCount = 12;
    const rot = t * 0.0008;
    for (let i = 0; i < beamCount; i++) {
      const a = (i / beamCount) * Math.PI * 2 + rot;
      const beamGrad = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 480);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      beamGrad.addColorStop(0.3, 'rgba(255, 235, 150, 0.2)');
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.arc(sunX, sunY, 480, a - 0.12, a + 0.12);
      ctx.closePath();
      ctx.fill();
    }

    // Radiant Solar Corona
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 240);
    sunGlow.addColorStop(0, '#ffffff');
    sunGlow.addColorStop(0.2, '#fff7b2');
    sunGlow.addColorStop(0.5, 'rgba(254, 215, 64, 0.55)');
    sunGlow.addColorStop(0.8, 'rgba(251, 146, 60, 0.2)');
    sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 240, 0, Math.PI * 2);
    ctx.fill();

    // Solar Core
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  /* ── 2) Layered High-Altitude Cirrus Clouds ──────────────── */
  function drawHighClouds() {
    ctx.save();
    for (const c of clouds) {
      const p = project(c.x, c.y, c.z);
      if (!p) continue;
      const w = c.width * p.scale * 0.14;
      const h = c.height * p.scale * 0.14;
      if (w < 6) continue;

      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.6, c.opacity * p.scale * 0.25)})`;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, w, h, 0, 0, Math.PI * 2);
      ctx.ellipse(p.x - w * 0.35, p.y + h * 0.15, w * 0.65, h * 0.75, 0, 0, Math.PI * 2);
      ctx.ellipse(p.x + w * 0.35, p.y + h * 0.1, w * 0.7, h * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* ── 3) 3-Tier Distant Mountain Vistas ───────────────────── */
  function drawMountainVistas() {
    const horizonY = H * 0.52 + (player.pitch * 40);
    ctx.save();

    // Far Alpine Peaks (Misty Blue)
    ctx.fillStyle = 'rgba(74, 96, 142, 0.45)';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(W * 0.12, horizonY - 62);
    ctx.lineTo(W * 0.28, horizonY - 24);
    ctx.lineTo(W * 0.46, horizonY - 78);
    ctx.lineTo(W * 0.64, horizonY - 32);
    ctx.lineTo(W * 0.82, horizonY - 92);
    ctx.lineTo(W * 0.94, horizonY - 45);
    ctx.lineTo(W, horizonY);
    ctx.closePath();
    ctx.fill();

    // Mid Purple Ridge with Evergreen Silhouettes
    ctx.fillStyle = 'rgba(67, 56, 96, 0.65)';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(W * 0.08, horizonY - 38);
    ctx.lineTo(W * 0.22, horizonY - 12);
    ctx.lineTo(W * 0.38, horizonY - 52);
    ctx.lineTo(W * 0.58, horizonY - 18);
    ctx.lineTo(W * 0.76, horizonY - 48);
    ctx.lineTo(W * 0.9, horizonY - 15);
    ctx.lineTo(W, horizonY);
    ctx.closePath();
    ctx.fill();

    // Near Sunlit Foothills (Lush Greenery)
    ctx.fillStyle = 'rgba(45, 106, 79, 0.85)';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.quadraticCurveTo(W * 0.25, horizonY - 24, W * 0.5, horizonY);
    ctx.quadraticCurveTo(W * 0.75, horizonY - 28, W, horizonY);
    ctx.lineTo(W, horizonY + 10);
    ctx.lineTo(0, horizonY + 10);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /* ── 4) 3D Meadow Terrain & Sparkling Winding River ──────── */
  function drawMeadowAndRiver() {
    const horizonY = H * 0.52 + (player.pitch * 40);

    // Rolling Green Meadow Gradient Floor
    const meadowGrad = ctx.createLinearGradient(0, horizonY, 0, H);
    meadowGrad.addColorStop(0, '#40916c');
    meadowGrad.addColorStop(0.3, '#2d6a4f');
    meadowGrad.addColorStop(0.7, '#1b4332');
    meadowGrad.addColorStop(1, '#081c15');
    ctx.fillStyle = meadowGrad;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    // 3D Perspective Grid Bands on Meadow
    ctx.save();
    ctx.strokeStyle = 'rgba(116, 198, 157, 0.15)';
    ctx.lineWidth = 1.2;
    for (let d = 1; d <= 12; d++) {
      const zRel = d * 180;
      const pL = project(-800, 320, player.z + zRel);
      const pR = project(800, 320, player.z + zRel);
      if (pL && pR) {
        ctx.beginPath();
        ctx.moveTo(0, pL.y);
        ctx.lineTo(W, pR.y);
        ctx.stroke();
      }
    }
    ctx.restore();

    // 3D Winding River
    const steps = 18;
    const riverLeft = [];
    const riverRight = [];

    for (let i = steps; i >= 1; i--) {
      const zRel = i * 110 + 20;
      const z = player.z + zRel;
      const curve = Math.sin((z - player.z) * 0.0028 + t * 0.001) * 190;
      const riverWidth = Math.max(16, (1 - (i / steps)) * 160 + 22);

      const pL = project(curve - riverWidth, 310, z);
      const pR = project(curve + riverWidth, 310, z);
      if (pL && pR) {
        riverLeft.push(pL);
        riverRight.push(pR);
      }
    }

    if (riverLeft.length > 2) {
      ctx.save();
      // River Water Gradient (Clear Cyan to Deep River Blue)
      const waterGrad = ctx.createLinearGradient(0, horizonY, 0, H);
      waterGrad.addColorStop(0, '#38bdf8');
      waterGrad.addColorStop(0.4, '#0284c7');
      waterGrad.addColorStop(0.8, '#0369a1');
      waterGrad.addColorStop(1, '#0c4a6e');

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

      // River Shore Edges
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < riverLeft.length; i++) {
        if (i === 0) ctx.moveTo(riverLeft[i].x, riverLeft[i].y);
        else ctx.lineTo(riverLeft[i].x, riverLeft[i].y);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i < riverRight.length; i++) {
        if (i === 0) ctx.moveTo(riverRight[i].x, riverRight[i].y);
        else ctx.lineTo(riverRight[i].x, riverRight[i].y);
      }
      ctx.stroke();

      // Sparkling River Sun Glints & Wave Caustics
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.lineWidth = 1.8;
      for (let i = 0; i < riverLeft.length - 1; i += 2) {
        const midX = (riverLeft[i].x + riverRight[i].x) / 2;
        const midY = (riverLeft[i].y + riverRight[i].y) / 2;
        const shimmer = Math.sin(t * 0.007 + i * 1.5) * 16;
        ctx.beginPath();
        ctx.moveTo(midX - 16 + shimmer, midY);
        ctx.lineTo(midX + 16 + shimmer, midY);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  /* ── 5) 3D Sky Dust & Dandelion Fluff ────────────────────── */
  function drawSkyDust() {
    ctx.save();
    for (const sp of skyParticles) {
      const p = project(sp.x, sp.y, sp.z);
      if (!p) continue;
      const sz = Math.max(0.9, sp.r * p.scale * 0.12);
      ctx.fillStyle = sp.color;
      ctx.globalAlpha = Math.min(0.85, p.scale * 0.28);
      ctx.beginPath();
      ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* ── 6) 3D Ground Flowers ────────────────────────────────── */
  function drawGroundFlowers() {
    const sorted = [...groundFlowers].filter(f => f.z > player.z + 5).sort((a, b) => b.z - a.z);

    for (const fl of sorted) {
      const p = project(fl.x, fl.y, fl.z);
      if (!p) continue;

      const sz = fl.size * p.scale * 0.13;
      if (sz < 2.5) continue;

      const sway = Math.sin(t * 0.0035 + fl.swayOffset) * (sz * 0.35);

      ctx.save();
      ctx.translate(p.x, p.y);

      // Green Stalk
      ctx.strokeStyle = '#2d6a4f';
      ctx.lineWidth = Math.max(1.2, sz * 0.18);
      ctx.beginPath();
      ctx.moveTo(0, sz * 0.85);
      ctx.quadraticCurveTo(sway * 0.5, sz * 0.45, sway, 0);
      ctx.stroke();

      ctx.translate(sway, 0);

      if (fl.type === 'sunflower') {
        // Majestic Sunflower with layered petals
        ctx.fillStyle = '#ffb703';
        for (let k = 0; k < 10; k++) {
          ctx.save(); ctx.rotate((k / 10) * Math.PI * 2);
          ctx.beginPath(); ctx.ellipse(0, -sz * 0.55, sz * 0.18, sz * 0.42, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = '#fb8500';
        for (let k = 0; k < 8; k++) {
          ctx.save(); ctx.rotate((k / 8) * Math.PI * 2 + 0.2);
          ctx.beginPath(); ctx.ellipse(0, -sz * 0.42, sz * 0.15, sz * 0.32, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        // Seed Center
        ctx.fillStyle = '#582f0e';
        ctx.beginPath(); ctx.arc(0, 0, sz * 0.34, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#7f4f24';
        ctx.beginPath(); ctx.arc(0, 0, sz * 0.22, 0, Math.PI * 2); ctx.fill();

      } else if (fl.type === 'lavender') {
        // Purple Lavender Spire
        ctx.fillStyle = '#9333ea';
        for (let k = 0; k < 6; k++) {
          ctx.beginPath(); ctx.arc(rnd(-1, 1), -k * (sz * 0.26), sz * 0.22, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#c084fc';
        for (let k = 0; k < 5; k++) {
          ctx.beginPath(); ctx.arc(rnd(-1, 1), -k * (sz * 0.26) - 2, sz * 0.14, 0, Math.PI * 2); ctx.fill();
        }

      } else if (fl.type === 'poppy') {
        // Scarlet Poppy
        ctx.fillStyle = '#f43f5e';
        for (let k = 0; k < 4; k++) {
          ctx.save(); ctx.rotate(k * Math.PI / 2);
          ctx.beginPath(); ctx.ellipse(0, -sz * 0.48, sz * 0.38, sz * 0.42, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath(); ctx.arc(0, 0, sz * 0.22, 0, Math.PI * 2); ctx.fill();

      } else {
        // White Star Daisy
        ctx.fillStyle = '#ffffff';
        for (let k = 0; k < 8; k++) {
          ctx.save(); ctx.rotate(k * Math.PI / 4);
          ctx.beginPath(); ctx.ellipse(0, -sz * 0.5, sz * 0.16, sz * 0.38, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.arc(0, 0, sz * 0.25, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore();
    }
  }

  /* ── 7) 3D Passing Butterfly Renderer ───────────────────── */
  function drawButterfly(bf) {
    const p = project(bf.x, bf.y, bf.z);
    if (!p) return;

    const sz = bf.size * p.scale * 0.12;
    if (sz < 3) return;

    const wingFlap = Math.sin(bf.wingPhase * 18);

    ctx.save();
    ctx.translate(p.x, p.y);

    // Butterfly Body
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, 0, sz * 0.14, sz * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.scale(wingFlap, 1);

    // Left Wings
    ctx.fillStyle = bf.theme.wingA;
    ctx.beginPath();
    ctx.ellipse(-sz * 0.65, -sz * 0.35, sz * 0.65, sz * 0.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bf.theme.wingB;
    ctx.beginPath();
    ctx.ellipse(-sz * 0.5, sz * 0.3, sz * 0.48, sz * 0.38, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Right Wings
    ctx.fillStyle = bf.theme.wingA;
    ctx.beginPath();
    ctx.ellipse(sz * 0.65, -sz * 0.35, sz * 0.65, sz * 0.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bf.theme.wingB;
    ctx.beginPath();
    ctx.ellipse(sz * 0.5, sz * 0.3, sz * 0.48, sz * 0.38, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  /* ── 8) 3D Sunray Crystal Prism ─────────────────────────── */
  function draw3DSunrayPrism(obj, scale) {
    const sz = obj.size * scale * 0.16;
    ctx.rotate(obj.rot);

    // Radiant Gold Corona Glow
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 28;

    // Outer Gyro Energy Ring 1
    ctx.strokeStyle = 'rgba(255, 235, 120, 0.85)';
    ctx.lineWidth = Math.max(1.6, sz * 0.08);
    ctx.beginPath();
    ctx.arc(0, 0, sz * 1.2, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Counter-Rotating Gyro Ring 2
    ctx.save();
    ctx.rotate(-obj.rot * 2);
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.65)';
    ctx.lineWidth = Math.max(1.2, sz * 0.06);
    ctx.beginPath();
    ctx.ellipse(0, 0, sz * 0.95, sz * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 8-Pointed Faceted Crystal Star
    for (let k = 0; k < 8; k++) {
      const a1 = (k / 8) * Math.PI * 2;
      const a2 = ((k + 0.5) / 8) * Math.PI * 2;
      const a3 = ((k + 1) / 8) * Math.PI * 2;
      const rOut = sz;
      const rIn = sz * 0.45;

      // Facet 1 (Left slope)
      ctx.fillStyle = k % 2 === 0 ? '#fde047' : '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a1) * rOut, Math.sin(a1) * rOut);
      ctx.lineTo(Math.cos(a2) * rIn, Math.sin(a2) * rIn);
      ctx.closePath();
      ctx.fill();

      // Facet 2 (Right slope)
      ctx.fillStyle = k % 2 === 0 ? '#fef08a' : '#d97706';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a2) * rIn, Math.sin(a2) * rIn);
      ctx.lineTo(Math.cos(a3) * rOut, Math.sin(a3) * rOut);
      ctx.closePath();
      ctx.fill();
    }

    // Pure White Brilliant Radiant Core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, sz * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /* ── 9) 3D Pollen Honeycomb Blossom Pod ─────────────────── */
  function draw3DPollenPod(obj, scale) {
    const sz = obj.size * scale * 0.16;
    ctx.rotate(Math.sin(obj.pulse) * 0.18);

    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 28;

    // Glowing Amber Extruded Hexagon Base
    const hexGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, sz);
    hexGrad.addColorStop(0, '#fef08a');
    hexGrad.addColorStop(0.4, '#f59e0b');
    hexGrad.addColorStop(0.85, '#d97706');
    hexGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = hexGrad;
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.8;

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
    ctx.stroke();

    // Inner Honeycomb Cell Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * (sz * 0.85), Math.sin(a) * (sz * 0.85));
      ctx.stroke();
    }

    // Inner Honey Nectar Core
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.arc(0, 0, sz * 0.42, 0, Math.PI * 2);
    ctx.fill();

    // Specular Light Glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-sz * 0.22, -sz * 0.22, sz * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /* ── 10) 3D Volumetric Storm Thundercloud ────────────────── */
  function draw3DStormCloud(obj, scale) {
    const sz = obj.size * scale * 0.16;
    ctx.shadowColor = '#4c1d95';
    ctx.shadowBlur = 26;

    // Multi-Layered Billowy Volumetric Storm Cloud Lobes
    const cloudGrad = ctx.createRadialGradient(0, -sz * 0.2, 4, 0, 0, sz * 1.1);
    cloudGrad.addColorStop(0, '#475569');
    cloudGrad.addColorStop(0.4, '#312e81');
    cloudGrad.addColorStop(0.85, '#1e1b4b');
    cloudGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = cloudGrad;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = Math.max(1.8, sz * 0.08);

    ctx.beginPath();
    ctx.arc(-sz * 0.58, 0, sz * 0.52, 0, Math.PI * 2);
    ctx.arc(0, -sz * 0.42, sz * 0.65, 0, Math.PI * 2);
    ctx.arc(sz * 0.58, 0, sz * 0.52, 0, Math.PI * 2);
    ctx.arc(-sz * 0.28, sz * 0.32, sz * 0.48, 0, Math.PI * 2);
    ctx.arc(sz * 0.28, sz * 0.32, sz * 0.48, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Internal Crackling Electric Lightning Discharge
    if (Math.sin(t * 0.015 + obj.pulse) > 0.35) {
      ctx.fillStyle = '#38bdf8';
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2.4;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 20;

      ctx.beginPath();
      ctx.moveTo(-sz * 0.14, -sz * 0.35);
      ctx.lineTo(sz * 0.18, -sz * 0.05);
      ctx.lineTo(-sz * 0.06, 0.04);
      ctx.lineTo(sz * 0.14, sz * 0.45);
      ctx.lineTo(-sz * 0.02, sz * 0.18);
      ctx.lineTo(-sz * 0.16, sz * 0.22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }

  /* ── 11) Supersonic Honey Rush Warp Speed Lines ──────────── */
  function drawHoneyRushWarpLines() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.75)';
    ctx.lineWidth = 2.4;
    const cx = W / 2, cy = H * 0.74;

    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2 + t * 0.003;
      const rInner = rnd(70, 130);
      const rOuter = rnd(240, 420);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * rInner, cy + Math.sin(a) * rInner);
      ctx.lineTo(cx + Math.cos(a) * rOuter, cy + Math.sin(a) * rOuter);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ── 12) High-Definition 3D Animated Bumblebee ───────────── */
  function drawPlayerBee() {
    const cx = W / 2, cy = H * 0.74;
    ctx.save();
    ctx.translate(cx, cy);

    // Roll & pitch flight banking
    const totalRoll = player.roll * 1.8 + (player.crashed ? Math.sin(player.dizzyAngle) * 0.55 : 0);
    const totalPitch = player.pitch * 1.5 + (player.crashed ? Math.cos(player.dizzyAngle) * 0.4 : 0);
    ctx.rotate(totalRoll);
    ctx.translate(0, totalPitch * 22);

    // 0) Golden Honey Aura when boosting or normal flight
    if (player.boosting) {
      ctx.save();
      const auraPulse = Math.sin(t * 0.02) * 6;
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 32 + auraPulse;
      ctx.fillStyle = 'rgba(255, 215, 0, 0.28)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 36 + auraPulse, 42 + auraPulse, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 1) Iridescent High-Fidelity Double Wings (Forewing & Hindwing)
    const wingFlap = Math.sin(player.wingPhase * 18) * 0.94;
    ctx.save();

    // Wing Shadows on Body
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.beginPath();
    ctx.ellipse(-10 * Math.abs(wingFlap), 2, 14 * Math.abs(wingFlap), 8, 0, 0, Math.PI * 2);
    ctx.ellipse(10 * Math.abs(wingFlap), 2, 14 * Math.abs(wingFlap), 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Left Wings
    ctx.save();
    ctx.translate(-14, -8);
    ctx.scale(wingFlap, 1);
    // Left Forewing
    const wingGradL = ctx.createLinearGradient(0, 0, -28, -24);
    wingGradL.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    wingGradL.addColorStop(0.35, 'rgba(186, 230, 253, 0.85)');
    wingGradL.addColorStop(0.7, 'rgba(199, 210, 254, 0.7)');
    wingGradL.addColorStop(1, 'rgba(254, 240, 138, 0.55)');
    ctx.fillStyle = wingGradL;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.95)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(-20, -18, 22, 11, -0.42, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // Left Forewing Vein Filigree
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.8)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.quadraticCurveTo(-14, -12, -32, -22);
    ctx.moveTo(-12, -10); ctx.lineTo(-24, -8);
    ctx.moveTo(-18, -14); ctx.lineTo(-26, -26);
    ctx.stroke();

    // Left Hindwing (Smaller)
    ctx.fillStyle = 'rgba(224, 242, 254, 0.75)';
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.85)';
    ctx.beginPath();
    ctx.ellipse(-14, -4, 15, 8, 0.2, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.restore();

    // Right Wings
    ctx.save();
    ctx.translate(14, -8);
    ctx.scale(wingFlap, 1);
    // Right Forewing
    const wingGradR = ctx.createLinearGradient(0, 0, 28, -24);
    wingGradR.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    wingGradR.addColorStop(0.35, 'rgba(186, 230, 253, 0.85)');
    wingGradR.addColorStop(0.7, 'rgba(199, 210, 254, 0.7)');
    wingGradR.addColorStop(1, 'rgba(254, 240, 138, 0.55)');
    ctx.fillStyle = wingGradR;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.95)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(20, -18, 22, 11, 0.42, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // Right Forewing Vein Filigree
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.8)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.quadraticCurveTo(14, -12, 32, -22);
    ctx.moveTo(12, -10); ctx.lineTo(24, -8);
    ctx.moveTo(18, -14); ctx.lineTo(26, -26);
    ctx.stroke();

    // Right Hindwing (Smaller)
    ctx.fillStyle = 'rgba(224, 242, 254, 0.75)';
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.85)';
    ctx.beginPath();
    ctx.ellipse(14, -4, 15, 8, -0.2, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.restore();

    ctx.restore();

    // 2) Plump Fuzzy 3D Bumblebee Body (Abdomen & Thorax)
    ctx.shadowColor = player.boosting ? '#f59e0b' : 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = player.boosting ? 28 : 14;

    // Golden Amber Base Body Spherical Shading
    const bodyGrad = ctx.createRadialGradient(-6, -10, 4, 0, 2, 30);
    bodyGrad.addColorStop(0, '#fef9c3');  // Specular top highlight
    bodyGrad.addColorStop(0.25, '#fde047');
    bodyGrad.addColorStop(0.55, '#eab308');
    bodyGrad.addColorStop(0.82, '#b45309');
    bodyGrad.addColorStop(1, '#451a03');    // Deep underside shadow
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 2, 23, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Velvet Obsidian Fur Stripes with 3D Spherical Curvature
    ctx.fillStyle = '#0f172a';
    // Stripe 1 (Upper)
    ctx.beginPath();
    ctx.ellipse(0, -6, 22.4, 5.8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Stripe 2 (Lower)
    ctx.beginPath();
    ctx.ellipse(0, 10, 21.6, 5.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Velvet Fur Texture Stippling
    ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
    for (let s = 0; s < 12; s++) {
      const a = (s / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 20.5, 2 + Math.sin(a) * 26, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cute Stinger with Metallic Glint
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-4, 30); ctx.lineTo(0, 37); ctx.lineTo(4, 30);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0.8, 33, 0.8, 0, Math.PI * 2); ctx.fill();

    // Plush Fuzzy Thorax (Golden collar)
    const thoraxGrad = ctx.createRadialGradient(-3, -16, 2, 0, -14, 18);
    thoraxGrad.addColorStop(0, '#fef08a');
    thoraxGrad.addColorStop(0.6, '#ca8a04');
    thoraxGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = thoraxGrad;
    ctx.beginPath();
    ctx.ellipse(0, -14, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3) Cute Bee Head & Face
    const headGrad = ctx.createRadialGradient(-4, -26, 2, 0, -24, 16);
    headGrad.addColorStop(0, '#1e293b');
    headGrad.addColorStop(0.6, '#0f172a');
    headGrad.addColorStop(1, '#020617');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.arc(0, -24, 15.5, 0, Math.PI * 2);
    ctx.fill();

    // Flexible Antennae with Golden Bobs
    const antWave = Math.sin(t * 0.008) * 2;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-6, -34); ctx.quadraticCurveTo(-14 + antWave, -47, -18, -44);
    ctx.moveTo(6, -34); ctx.quadraticCurveTo(14 + antWave, -47, 18, -44);
    ctx.stroke();

    // Glowing Golden Antenna Bulbs
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(-18, -44, 3.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(18, -44, 3.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-19, -45, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(17, -45, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Eyes
    if (!player.crashed) {
      // Big Glossy Anime Eyes with Depth
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(-6.5, -25, 5, 7, -0.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(6.5, -25, 5, 7, 0.1, 0, Math.PI * 2); ctx.fill();

      // Deep Iris Gradient (Navy to Obsidian)
      const irisGrad = ctx.createLinearGradient(0, -30, 0, -20);
      irisGrad.addColorStop(0, '#1e3a8a');
      irisGrad.addColorStop(1, '#020617');
      ctx.fillStyle = irisGrad;
      ctx.beginPath(); ctx.ellipse(-6, -25, 3.4, 4.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(6, -25, 3.4, 4.8, 0, 0, Math.PI * 2); ctx.fill();

      // Primary Specular Catchlights (Large)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-7.4, -27.2, 1.6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(4.6, -27.2, 1.6, 0, Math.PI * 2); ctx.fill();

      // Secondary Specular Catchlights (Tiny sparkle)
      ctx.beginPath(); ctx.arc(-4.8, -23.2, 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7.2, -23.2, 0.9, 0, Math.PI * 2); ctx.fill();

      // Cute Rosy Blushing Cheeks
      ctx.fillStyle = 'rgba(251, 113, 133, 0.75)';
      ctx.beginPath(); ctx.ellipse(-10.5, -19, 3.2, 2.2, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(10.5, -19, 3.2, 2.2, -0.2, 0, Math.PI * 2); ctx.fill();

      // Cute Smile
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, -20, 3, 0.2, Math.PI - 0.2);
      ctx.stroke();

    } else {
      // Dizzy X Eyes
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(-10, -28); ctx.lineTo(-3, -21);
      ctx.moveTo(-3, -28); ctx.lineTo(-10, -21);
      ctx.moveTo(3, -28); ctx.lineTo(10, -21);
      ctx.moveTo(10, -28); ctx.lineTo(3, -21);
      ctx.stroke();
    }

    ctx.restore();
  }

  const BEE_LEVELS = [
    { level: 1, name: 'Sunlit Valley', icon: '🐝', targetScore: 100, serenityBonus: 25, badge: '☀️ Sunray Scout', context: 'Gliding peacefully above gentle rolling hills. Your focus takes flight with calm buoyancy.' },
    { level: 2, name: 'Sparkling River Canyon', icon: '🌊', targetScore: 250, serenityBonus: 40, badge: '🌊 Canyon Navigator', context: 'Navigating winding rivers and canyon updrafts. Agility and steady control guide every turn.' },
    { level: 3, name: 'Lavender Mist Peaks', icon: '🏔️', targetScore: 450, serenityBonus: 60, badge: '🏔️ Mountain Soarer', context: 'Soaring past mountain crags through blooming alpine flora. High perspective brings clarity.' },
    { level: 4, name: 'Sunset Horizon', icon: '🌅', targetScore: 700, serenityBonus: 85, badge: '⚡ Honey Rush Ace', context: 'Rushing through golden dusk skies with radiant warp lines. Speed and grace in perfect harmony.' },
    { level: 5, name: 'Starlight Aurora Flight', icon: '🌌', targetScore: 1000, serenityBonus: 120, badge: '🌌 Cosmic Aviator', context: 'You have conquered the skies! Fluttering among glowing cosmic auroras and eternal starlight.' },
  ];

  /* ── 2-Minute Flight Celebration & Level Progression Modal ─ */
  function celebrate2MinComplete() {
    confetti();
    buzz([40, 100, 180]);
    if (player.score > (G3().highScore || 0)) {
      G3().highScore = player.score;
    }
    G3().level = G3().level || 1;
    const curLvlIdx = Math.min(BEE_LEVELS.length - 1, G3().level - 1);
    const curLvl = BEE_LEVELS[curLvlIdx];
    const leveledUp = G3().level < BEE_LEVELS.length;
    if (leveledUp) {
      G3().level++;
    }
    const nextLvl = BEE_LEVELS[Math.min(BEE_LEVELS.length - 1, G3().level - 1)];

    const serenityReward = curLvl.serenityBonus + Math.floor(player.score / 35);
    S.game.serenity = (S.game.serenity || 0) + serenityReward;
    save();

    modal(`
      <div style="text-align:center;padding:14px 6px;color:#ffffff">
        <div style="font-size:48px;margin-bottom:6px">${curLvl.icon}✨</div>
        <div style="display:inline-block;background:linear-gradient(135deg,#ffb703,#f3256b);color:#fff;font-weight:800;font-size:11px;padding:3px 12px;border-radius:999px;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">
          ${curLvl.badge} · LEVEL ${curLvl.level} COMPLETE!
        </div>
        <h3 style="font-size:21px;font-weight:800;color:#ffd700;margin:0 0 6px">${curLvl.name} Mastered</h3>
        <p style="font-size:13.5px;line-height:1.6;color:rgba(255,255,255,0.9);margin:6px 0 14px;font-style:italic">
          “${curLvl.context}”
        </p>

        <div style="background:rgba(255,255,255,0.08);backdrop-filter:blur(16px);border:1.5px solid rgba(51,102,255,0.45);border-radius:18px;padding:16px;margin-bottom:16px;text-align:left">
          <div style="display:flex;justify-content:space-between;font-size:14px;padding:4px 0;color:rgba(255,255,255,0.92)"><span>🏆 Flight Score:</span><b style="color:#ffd700;font-size:16px">${player.score} pts</b></div>
          <div style="display:flex;justify-content:space-between;font-size:14px;padding:4px 0;color:rgba(255,255,255,0.92)"><span>⭐ All-Time High:</span><b style="color:#6ec1ff">${G3().highScore} pts</b></div>
          <div style="display:flex;justify-content:space-between;font-size:14px;padding:4px 0;color:rgba(255,255,255,0.92)"><span>☀️ Sunrays Harvested:</span><b style="color:#ffffff">${player.sunrays}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:14px;padding:4px 0;color:rgba(255,255,255,0.92)"><span>🍯 Pollen Nectar Pods:</span><b style="color:#ffffff">${player.pollen}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:14px;padding:4px 0;color:#6ec1ff;border-top:1px dashed rgba(255,255,255,0.18);margin-top:6px;padding-top:8px"><span>💜 Resilience Serenity Earned:</span><b>+${serenityReward} Serenity</b></div>
        </div>

        <div class="modal-btns" style="display:flex;flex-direction:column;gap:8px">
          ${leveledUp ? `<button class="btn btn-primary btn-block" id="orbit-advance" style="background:linear-gradient(135deg,#ffb703,#f3256b);color:#fff;font-weight:800;font-size:14px">Fly Level ${nextLvl.level}: ${nextLvl.name} 🚀</button>` : ''}
          <button class="btn ${leveledUp ? 'btn-ghost' : 'btn-primary'} btn-block" id="orbit-continue">Fly Again 🐝</button>
          <button class="btn btn-ghost btn-block" onclick="closeModal()">Back to Games Hub</button>
        </div>
      </div>
    `);

    $('#orbit-advance')?.addEventListener('click', () => {
      sessionStart = Date.now();
      missionCompleted = false;
      player.sunrays = 0;
      player.pollen = 0;
      player.score = 0;
      player.distanceMeters = 0;
      player.z = 0;
      closeModal();
      toast(`Level ${nextLvl.level}: ${nextLvl.name} Unlocked! 🐝`);
    });

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

  function steer(dx, dy) {
    player.targetX = Math.max(-380, Math.min(380, player.targetX + dx));
    player.targetY = Math.max(-210, Math.min(210, player.targetY + dy));
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
    player.targetX = 0; player.targetY = 0;
    player.vx = 0; player.vy = 0; player.vz = 9.5;
    player.sunrays = 0; player.pollen = 0; player.score = 0;
    player.boosting = false; player.crashed = false;
    particles = []; popups = [];

    init3DWorld();
    resize();
    updateHUD();

    function updatePointerPos(clientX, clientY) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((clientY - rect.top) / rect.height) * 2 - 1;
      player.targetX = Math.max(-380, Math.min(380, nx * 380));
      player.targetY = Math.max(-210, Math.min(210, (ny - 0.1) * 230));
    }

    const onPointerDown = e => {
      pointer.active = true;
      try { canvas.setPointerCapture(e.pointerId); } catch {}
      updatePointerPos(e.clientX, e.clientY);
    };

    const onPointerMove = e => {
      if (pointer.active || e.pointerType === 'mouse') {
        updatePointerPos(e.clientX, e.clientY);
      }
    };

    const onPointerUp = e => {
      pointer.active = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch {}
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    const onKey = e => {
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) { e.preventDefault(); steer(-40, 0); }
      if (['ArrowRight', 'd', 'D'].includes(e.key)) { e.preventDefault(); steer(40, 0); }
      if (['ArrowUp', 'w', 'W'].includes(e.key)) { e.preventDefault(); steer(0, -35); }
      if (['ArrowDown', 's', 'S'].includes(e.key)) { e.preventDefault(); steer(0, 35); }
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); triggerBoost(); }
    };
    window.addEventListener('keydown', onKey);
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

  return { mount, stop, triggerBoost, steer, getHighScore: () => G3().highScore || 0 };
})();
