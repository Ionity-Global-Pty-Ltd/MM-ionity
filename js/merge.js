/* ============================================================
   MojaMind — Moja Merge: Cosmic Bloom 🌌🌸 (Trending Physics Drop Game)
   A hyper-satisfying, full-featured on-device 2D physics merge game:
   - 10 Evolution Tiers: Seed 🌰 -> Dew 💧 -> Sprout 🌱 -> Blossom 🌸 -> Sunflower 🌻 -> Crystal 💎 -> Heart 💜 -> Star 🌟 -> Sun ☀️ -> Cosmic Bloom 🌌
   - High-precision circle-circle collision physics with elasticity, dampening & squish.
   - Interactive drop aim line with touch/drag/keyboard controls.
   - 432Hz harmonic scale Web Audio synth drop & merge chimes.
   - Combo streaks, particle shockwaves & floating score text.
   - 🌬️ Wind Gust (Nudge) & ⚡ Spark Zap resilience power-ups.
   - High score tracking & celebratory milestone fireworks.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za
   ============================================================ */
'use strict';

const MMMerge = (() => {
  // 10 Evolution Tiers
  const TIERS = [
    { tier: 0, name: 'Hope Seed',      emoji: '🌰', radius: 18, pts: 2,   color: '#a0522d', glow: 'rgba(160,82,45,0.6)' },
    { tier: 1, name: 'Dew Drop',       emoji: '💧', radius: 25, pts: 4,   color: '#00d2ff', glow: 'rgba(0,210,255,0.65)' },
    { tier: 2, name: 'Green Sprout',   emoji: '🌱', radius: 33, pts: 8,   color: '#34c759', glow: 'rgba(52,199,89,0.65)' },
    { tier: 3, name: 'Cherry Blossom', emoji: '🌸', radius: 43, pts: 16,  color: '#f472b6', glow: 'rgba(244,114,182,0.7)' },
    { tier: 4, name: 'Sunflower',      emoji: '🌻', radius: 54, pts: 32,  color: '#ffd166', glow: 'rgba(255,209,102,0.75)' },
    { tier: 5, name: 'Crystal Prism',  emoji: '💎', radius: 67, pts: 64,  color: '#38bdf8', glow: 'rgba(56,189,248,0.8)' },
    { tier: 6, name: 'Resilience Heart',emoji:'💜', radius: 81, pts: 128, color: '#a855f7', glow: 'rgba(168,85,247,0.85)' },
    { tier: 7, name: 'Golden Star',    emoji: '🌟', radius: 96, pts: 256, color: '#ffd700', glow: 'rgba(255,215,0,0.9)' },
    { tier: 8, name: 'Radiant Sun',    emoji: '☀️', radius: 112, pts: 512, color: '#ff6b35', glow: 'rgba(255,107,53,0.95)' },
    { tier: 9, name: 'Cosmic Bloom',   emoji: '🌌', radius: 130, pts: 1000, color: '#ec4899', glow: 'rgba(236,72,153,1)' },
  ];

  const DANGER_Y = 88; // Top overflow danger line
  const MISSION_MS = 60 * 1000; // 1-Minute timed challenge
  let canvas = null;
  let ctx = null;
  let animId = null;
  let audioCtx = null;

  // Game State
  let sessionStart = Date.now();
  let missionCompleted = false;
  let score = 0;
  let highScore = 0;
  let combo = 0;
  let lastMergeTime = 0;
  let items = []; // active physics balls
  let particles = [];
  let floatingTexts = [];
  let currentTier = 0;
  let nextTier = 0;
  let dropX = 180;
  let canDrop = true;
  let isDropping = false;
  let gameOver = false;
  let dangerTimer = 0;
  let windCooldown = 0;
  let zapActive = false;
  let totalMerges = 0;

  /* ── 432Hz Harmonic Synthesizer Sound Engine ──────────────── */
  function getAudioContext() {
    if (!audioCtx) {
      const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playSound(type, tier = 0) {
    if (S.gameMerge && S.gameMerge.sound === false) return; // respect sound mute / default off
    const ac = getAudioContext();
    if (!ac) return;
    try {
      const now = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const filter = ac.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);

      if (type === 'drop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280 + tier * 30, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.14);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'merge') {
        const notes = [432, 486, 540, 576, 648, 720, 810, 864, 972, 1080];
        const freq = notes[Math.min(notes.length - 1, tier)];
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.22);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'wind') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(260, now + 0.28);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.36);
      } else if (type === 'gameover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.45);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.46);
      }
    } catch { /* audio safeguard */ }
  }

  /* ── Random Tier Generator (Starts with small tiers 0–3) ──── */
  function randomSpawnTier() {
    const weights = [0.45, 0.32, 0.18, 0.05];
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (r <= sum) return i;
    }
    return 0;
  }

  /* ── Mount Game into Canvas ───────────────────────────────── */
  function mount() {
    canvas = document.getElementById('merge-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    // Load High Score
    if (!S.gameMerge) S.gameMerge = { highScore: 0, totalMerges: 0, maxTier: 0 };
    highScore = S.gameMerge.highScore || 0;

    resetGame();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    setupControls();
    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(gameLoop);
  }

  function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function resetGame() {
    sessionStart = Date.now();
    missionCompleted = false;
    score = 0;
    combo = 0;
    lastMergeTime = 0;
    items = [];
    particles = [];
    floatingTexts = [];
    currentTier = randomSpawnTier();
    nextTier = randomSpawnTier();
    canDrop = true;
    isDropping = false;
    gameOver = false;
    dangerTimer = 0;
    windCooldown = 0;
    zapActive = false;
    totalMerges = 0;
    updateHUD();
  }

  function updateHUD() {
    const scoreEl = document.getElementById('merge-score');
    const highEl = document.getElementById('merge-high');
    const nextPreviewEl = document.getElementById('merge-next-icon');
    const nextNameEl = document.getElementById('merge-next-name');

    if (scoreEl) scoreEl.textContent = score;
    if (highEl) highEl.textContent = Math.max(score, highScore);
    if (nextPreviewEl) nextPreviewEl.textContent = TIERS[nextTier].emoji;
    if (nextNameEl) nextNameEl.textContent = TIERS[nextTier].name;
  }

  /* ── Interactive Input Handlers ───────────────────────────── */
  function setupControls() {
    if (!canvas) return;

    const setPosition = clientX => {
      if (gameOver) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const curR = TIERS[currentTier].radius;
      dropX = Math.max(curR + 10, Math.min(rect.width - curR - 10, x));
    };

    const dropCurrent = () => {
      if (!canDrop || gameOver) return;
      if (zapActive) return; // in zap mode, clicks zap items instead

      canDrop = false;
      const curR = TIERS[currentTier].radius;
      const rect = canvas.getBoundingClientRect();
      const clampedX = Math.max(curR + 10, Math.min(rect.width - curR - 10, dropX));

      // Create new falling ball
      items.push({
        x: clampedX,
        y: 42,
        vx: 0,
        vy: 1.5,
        tier: currentTier,
        radius: curR,
        squishX: 0.85,
        squishY: 1.15,
        id: Math.random(),
      });

      playSound('drop', currentTier);

      // Advance queue
      currentTier = nextTier;
      nextTier = randomSpawnTier();
      updateHUD();

      setTimeout(() => {
        if (!gameOver) canDrop = true;
      }, 550);
    };

    // Pointer / Touch Events
    canvas.addEventListener('pointermove', e => {
      setPosition(e.clientX);
    });

    canvas.addEventListener('pointerdown', e => {
      setPosition(e.clientX);
      if (zapActive) {
        handleZapClick(e.clientX, e.clientY);
      } else {
        dropCurrent();
      }
    });

    // Keyboard controls
    window.addEventListener('keydown', e => {
      if (gameOver) return;
      const rect = canvas.getBoundingClientRect();
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        dropX = Math.max(30, dropX - 25);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        dropX = Math.min(rect.width - 30, dropX + 25);
      } else if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        dropCurrent();
      }
    });
  }

  /* ── 🌬️ Wind Gust Special Action ─────────────────────────── */
  function triggerWind() {
    if (gameOver || items.length === 0 || windCooldown > 0) return;
    playSound('wind');
    for (const it of items) {
      it.vy -= 4.5 + Math.random() * 3;
      it.vx += (Math.random() - 0.5) * 6;
      it.squishX = 1.2;
      it.squishY = 0.8;
    }
    // Particle gust
    const rect = canvas.getBoundingClientRect();
    for (let i = 0; i < 24; i++) {
      particles.push({
        x: Math.random() * rect.width,
        y: rect.height - Math.random() * 40,
        vx: (Math.random() - 0.5) * 4,
        vy: -4 - Math.random() * 5,
        color: '#00d2ff',
        radius: 3,
        alpha: 1,
      });
    }
    windCooldown = 15; // 15s cooldown
    if (typeof toast === 'function') toast('🌬️ Wind Gust shook the cosmic board!');
  }

  /* ── ⚡ Spark Zap Special Action ──────────────────────────── */
  function toggleZapMode() {
    if (gameOver || items.length === 0) return;
    zapActive = !zapActive;
    if (typeof toast === 'function') {
      toast(zapActive ? '⚡ Tap any single item on board to vaporize it!' : 'Zap mode cancelled');
    }
  }

  function handleZapClick(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;

    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      const dist = Math.hypot(it.x - cx, it.y - cy);
      if (dist <= it.radius + 8) {
        // Vaporize item
        createExplosion(it.x, it.y, '#ffd166', 20);
        playSound('merge', 8);
        items.splice(i, 1);
        zapActive = false;
        if (typeof toast === 'function') toast('⚡ Item vaporized with cosmic energy!');
        return;
      }
    }
  }

  /* ── Particle & Floating Score FX ────────────────────────── */
  function createExplosion(x, y, color, count = 16) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        color,
        radius: Math.random() * 3 + 2,
        alpha: 1,
      });
    }
  }

  function addFloatingText(text, x, y, color = '#ffd700') {
    floatingTexts.push({
      text,
      x,
      y,
      vy: -1.8,
      alpha: 1,
      color,
    });
  }

  /* ── 2D Rigid-Body Physics Step ───────────────────────────── */
  function updatePhysics(dt, width, height) {
    const gravity = 0.34;
    const bounce = 0.42;
    const friction = 0.985;

    // Apply gravity & motion
    for (const it of items) {
      it.vy += gravity;
      it.vx *= friction;
      it.x += it.vx;
      it.y += it.vy;

      // Relax squish back to 1
      it.squishX += (1 - it.squishX) * 0.12;
      it.squishY += (1 - it.squishY) * 0.12;

      // Left & Right Wall Collisions
      if (it.x - it.radius < 6) {
        it.x = 6 + it.radius;
        it.vx = -it.vx * bounce;
      } else if (it.x + it.radius > width - 6) {
        it.x = width - 6 - it.radius;
        it.vx = -it.vx * bounce;
      }

      // Floor Collision
      if (it.y + it.radius > height - 6) {
        it.y = height - 6 - it.radius;
        it.vy = -it.vy * bounce;
        if (Math.abs(it.vy) < 0.6) it.vy = 0;
      }
    }

    // Pairwise Circle-Circle Collisions & Merges
    const toRemove = new Set();
    const newItems = [];

    for (let i = 0; i < items.length; i++) {
      if (toRemove.has(i)) continue;
      const a = items[i];

      for (let j = i + 1; j < items.length; j++) {
        if (toRemove.has(j)) continue;
        const b = items[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        const minDist = a.radius + b.radius;

        if (dist < minDist && dist > 0) {
          // Identical Tier -> Merge Evolution!
          if (a.tier === b.tier && a.tier < TIERS.length - 1) {
            toRemove.add(i);
            toRemove.add(j);

            const nextT = a.tier + 1;
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            const tierInfo = TIERS[nextT];

            newItems.push({
              x: midX,
              y: midY,
              vx: (a.vx + b.vx) * 0.35,
              vy: -2.5,
              tier: nextT,
              radius: tierInfo.radius,
              squishX: 1.35,
              squishY: 0.7,
              id: Math.random(),
            });

            // Score & Combo calculation
            const now = Date.now();
            if (now - lastMergeTime < 1800) {
              combo++;
            } else {
              combo = 1;
            }
            lastMergeTime = now;

            const comboBonus = combo > 1 ? Math.round(tierInfo.pts * (1 + (combo - 1) * 0.5)) : tierInfo.pts;
            score += comboBonus;
            totalMerges++;

            if (score > highScore) {
              highScore = score;
              S.gameMerge.highScore = highScore;
              save();
            }

            playSound('merge', nextT);
            createExplosion(midX, midY, tierInfo.color, 24);
            addFloatingText(`+${comboBonus}${combo > 1 ? ` COMBO x${combo}! 🔥` : ''}`, midX, midY - 10, tierInfo.color);
            updateHUD();
            break;
          }

          // Elastic Collision Response & Positional Separation
          const overlap = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;

          const massA = a.radius;
          const massB = b.radius;
          const totalMass = massA + massB;

          a.x -= nx * overlap * (massB / totalMass);
          a.y -= ny * overlap * (massB / totalMass);
          b.x += nx * overlap * (massA / totalMass);
          b.y += ny * overlap * (massA / totalMass);

          const kx = a.vx - b.vx;
          const ky = a.vy - b.vy;
          const p = 2 * (nx * kx + ny * ky) / totalMass;

          a.vx -= p * massB * nx * bounce;
          a.vy -= p * massB * ny * bounce;
          b.vx += p * massA * nx * bounce;
          b.vy += p * massA * ny * bounce;
        }
      }
    }

    // Filter out merged items and insert new evolved items
    if (toRemove.size > 0) {
      items = items.filter((_, idx) => !toRemove.has(idx)).concat(newItems);
    }

    // Danger Line Check
    let inDanger = false;
    for (const it of items) {
      if (it.y - it.radius < DANGER_Y && Math.abs(it.vy) < 0.4 && it.y > 60) {
        inDanger = true;
        break;
      }
    }

    if (inDanger) {
      dangerTimer += dt;
      if (dangerTimer > 3.2 && !gameOver) {
        triggerGameOver();
      }
    } else {
      dangerTimer = Math.max(0, dangerTimer - dt * 2);
    }
  }

  const MERGE_LEVELS = [
    { level: 1, name: 'Terrestrial Seedbed', icon: '🌰', targetTier: 3, serenityBonus: 25, badge: '🌱 Seedling Alchemist', context: 'From humble earthy acorns and dew drops, initial sparks of hope sprout with life.' },
    { level: 2, name: 'Prism Cavern', icon: '💎', targetTier: 5, serenityBonus: 40, badge: '💎 Crystal Refractor', context: 'Merging blossoms into luminous crystalline prisms. Inner clarity reveals multifaceted strength.' },
    { level: 3, name: 'Stellar Orbit', icon: '🌟', targetTier: 7, serenityBonus: 60, badge: '🌟 Constellation Weaver', context: 'Hearts and stars intertwine across the orbital sky. Resilience becomes your guiding compass.' },
    { level: 4, name: 'Solar Flare', icon: '☀️', targetTier: 8, serenityBonus: 85, badge: '☀️ Solar Harmonizer', context: 'Radiant solar energy warms the container. Power and patience coalesce into brilliance.' },
    { level: 5, name: 'Cosmic Supernova', icon: '🌌', targetTier: 9, serenityBonus: 120, badge: '🌌 Cosmic Creator', context: 'You have forged the Ultimate Cosmic Bloom! Pure transcendental harmony and triumph.' },
  ];

  /* ── Game Over & Dimension Progression Trigger ───────────── */
  function triggerGameOver(reason = 'overflow') {
    if (gameOver) return;
    gameOver = true;
    playSound('gameover');
    if (score > highScore) {
      highScore = score;
      S.gameMerge.highScore = highScore;
    }
    S.gameMerge.level = S.gameMerge.level || 1;
    const curLvlIdx = Math.min(MERGE_LEVELS.length - 1, S.gameMerge.level - 1);
    const curLvl = MERGE_LEVELS[curLvlIdx];
    const maxT = items.reduce((max, it) => Math.max(max, it.tier), 0);
    const reachedTarget = maxT >= curLvl.targetTier;
    const leveledUp = (reachedTarget || reason === 'time_up') && S.gameMerge.level < MERGE_LEVELS.length;
    if (leveledUp) {
      S.gameMerge.level++;
    }
    const nextLvl = MERGE_LEVELS[Math.min(MERGE_LEVELS.length - 1, S.gameMerge.level - 1)];

    const serenityReward = curLvl.serenityBonus + Math.floor(score / 30);
    S.game.serenity = (S.game.serenity || 0) + serenityReward;
    save();

    const title = reason === 'time_up' ? `${curLvl.name} Mastered! ⏳✨` : `Stage Paused — Top Line Reached! ⚠️`;
    const subText = reason === 'time_up'
      ? `“${curLvl.context}”`
      : `“Take a slow breath. Every reset is a fresh opportunity to cultivate focus.”`;

    const modal = document.createElement('div');
    modal.className = 'draw-submodal-wrap';
    modal.innerHTML = `
      <div class="draw-submodal-card" style="text-align:center;max-width:380px">
        <div style="font-size:50px;margin-bottom:4px">${curLvl.icon}✨</div>
        <div style="display:inline-block;background:linear-gradient(135deg,#ec4899,#3366ff);color:#fff;font-weight:800;font-size:11px;padding:3px 12px;border-radius:999px;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">
          ${curLvl.badge} · DIMENSION ${curLvl.level} ${reason === 'time_up' || reachedTarget ? 'COMPLETE!' : 'STANDBY'}
        </div>
        <h3 style="font-size:21px;font-weight:800;color:#ffd700;margin:0 0 6px">${title}</h3>
        <p style="font-size:13.5px;line-height:1.6;color:rgba(255,255,255,0.9);margin:6px 0 14px;font-style:italic">
          ${subText}
        </p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
          <div style="background:rgba(255,255,255,0.08);padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,0.15)">
            <small style="font-size:10px;color:rgba(255,255,255,0.6);text-transform:uppercase">Final Score</small>
            <b style="display:block;font-size:18px;color:#3366ff">${score}</b>
          </div>
          <div style="background:rgba(255,255,255,0.08);padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,0.15)">
            <small style="font-size:10px;color:rgba(255,255,255,0.6);text-transform:uppercase">Best Score</small>
            <b style="display:block;font-size:18px;color:#ffd700">${highScore}</b>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.08);backdrop-filter:blur(16px);border:1.5px solid rgba(236,72,153,0.4);border-radius:14px;padding:10px;margin-bottom:14px;text-align:left">
          <div style="display:flex;justify-content:space-between;font-size:13px;color:rgba(255,255,255,0.9)"><span>🌸 Total Merges:</span><b>${totalMerges}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;color:rgba(255,255,255,0.9);margin-top:3px"><span>💎 Highest Tier Evolved:</span><b>${TIERS[maxT]?.emoji || '🌰'} ${TIERS[maxT]?.name || 'Seed'}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#6ec1ff;border-top:1px dashed rgba(255,255,255,0.15);margin-top:6px;padding-top:6px"><span>💜 Resilience Serenity:</span><b>+${serenityReward} pts</b></div>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px">
          ${leveledUp ? `<button class="btn btn-primary btn-block" id="merge-advance-btn" style="background:linear-gradient(135deg,#ec4899,#3366ff);color:#fff;font-weight:800">Enter Dimension ${nextLvl.level}: ${nextLvl.name} 🚀</button>` : ''}
          <button class="btn ${leveledUp ? 'btn-ghost' : 'btn-secondary'} btn-block" id="merge-again-btn">Play Again 🌸</button>
          <button class="btn btn-ghost btn-block" id="merge-hub-btn">Games Hub</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#merge-advance-btn')?.addEventListener('click', () => {
      modal.remove();
      resetGame();
      toast(`Dimension ${nextLvl.level}: ${nextLvl.name} Unlocked! 🌌`);
    });

    modal.querySelector('#merge-again-btn').onclick = () => {
      modal.remove();
      resetGame();
    };
    modal.querySelector('#merge-hub-btn').onclick = () => {
      modal.remove();
      if (typeof nav === 'function') nav('#/games');
    };
  }

  /* ── Main Render & Animation Loop ─────────────────────────── */
  let lastTimestamp = 0;

  function gameLoop(timestamp) {
    if (!canvas || !ctx) return;
    const dt = Math.min(0.05, (timestamp - lastTimestamp) / 1000 || 0.016);
    lastTimestamp = timestamp;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // 1-Minute Session Timer Update
    const elapsed = Date.now() - sessionStart;
    const remaining = Math.max(0, MISSION_MS - elapsed);
    const timerEl = document.getElementById('merge-timer');
    if (timerEl) {
      const s = Math.ceil(remaining / 1000);
      timerEl.textContent = `0:${String(s).padStart(2, '0')}`;
    }

    if (remaining <= 0 && !gameOver && !missionCompleted) {
      missionCompleted = true;
      triggerGameOver('time_up');
    }

    // Step physics
    if (!gameOver) {
      updatePhysics(dt, w, h);
      if (windCooldown > 0) windCooldown = Math.max(0, windCooldown - dt);
    }

    // Clear Canvas with sleek cosmic gradient
    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // Cosmic Jar Container Boundary
    ctx.fillStyle = 'rgba(18, 10, 32, 0.75)';
    ctx.fillRect(0, 0, w, h);

    // Glowing Neon Walls
    ctx.strokeStyle = 'rgba(51, 102, 255, 0.45)';
    ctx.lineWidth = 4;
    ctx.strokeRect(3, 3, w - 6, h - 6);

    // Danger Overflow Line
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([6, 6]);
    ctx.moveTo(8, DANGER_Y);
    ctx.lineTo(w - 8, DANGER_Y);
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = dangerTimer > 0 ? `rgba(237, 28, 36, ${0.4 + Math.sin(timestamp * 0.01) * 0.4})` : 'rgba(255, 255, 255, 0.18)';
    ctx.stroke();
    ctx.restore();

    // Top Aiming Guide Laser
    if (canDrop && !gameOver && !zapActive) {
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([4, 6]);
      ctx.moveTo(dropX, 42);
      ctx.lineTo(dropX, h - 10);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Dropper Piece Preview at top
      const curInfo = TIERS[currentTier];
      drawItemCircle(ctx, dropX, 42, curInfo, 1, 1);
      ctx.restore();
    }

    // Render Physics Items
    for (const it of items) {
      const tierInfo = TIERS[it.tier];
      drawItemCircle(ctx, it.x, it.y, tierInfo, it.squishX, it.squishY);
    }

    // Render Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= dt * 1.5;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Render Floating Score Text
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= dt * 1.2;
      if (ft.alpha <= 0) {
        floatingTexts.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.font = 'bold 15px "Poppins", sans-serif';
      ctx.fillStyle = ft.color;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 6;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();
    animId = requestAnimationFrame(gameLoop);
  }

  function drawItemCircle(ctx, x, y, info, squishX = 1, squishY = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(squishX, squishY);

    // Outer Glow Halo
    ctx.shadowColor = info.glow;
    ctx.shadowBlur = Math.min(18, info.radius * 0.45);

    // Base Gradient Body
    const grad = ctx.createRadialGradient(-info.radius * 0.3, -info.radius * 0.3, info.radius * 0.1, 0, 0, info.radius);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, info.color);
    grad.addColorStop(1, shadeColor(info.color, -25));

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, info.radius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle Glass Rim
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Emoji / Icon
    ctx.shadowBlur = 0;
    ctx.font = `${Math.round(info.radius * 1.05)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(info.emoji, 0, 1);

    ctx.restore();
  }

  function shadeColor(color, percent) {
    let num = parseInt(color.replace('#', ''), 16);
    if (isNaN(num)) return color;
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let B = ((num >> 8) & 0x00FF) + amt;
    let G = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 + (G < 255 ? (G < 1 ? 0 : G) : 255)).toString(16).slice(1);
  }

  function teardown() {
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    window.removeEventListener('resize', resizeCanvas);
    items = [];
    particles = [];
  }

  return { mount, teardown, resetGame, triggerWind, toggleZapMode, TIERS };
})();
