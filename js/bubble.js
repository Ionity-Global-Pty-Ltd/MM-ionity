/* ============================================================
   MojaMind — Moja Pop: Serenity Bubble Odyssey 🫧✨🎯
   An immensely satisfying, physics-based Bubble Shooter game.
   
   Features:
   - High-precision trajectory aiming laser with wall reflections.
   - Hexagonal bubble grid snapping & match-3 pop mechanics.
   - Cascading floating cluster drop physics (Mega Avalanches!).
   - Harmonic pentatonic pop chimes & combo multipliers.
   - Special power bubbles: Hope Bombs 💣, Prism Rainbows 🌈, Sunray Lasers ⚡.
   - 2-Minute Countdown Timer Challenge with persistent High Scores.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.today
   ============================================================ */
'use strict';

const MMBubble = (() => {
  let canvas = null, ctx = null, W = 0, H = 0, dpr = 1;
  let raf = 0, last = 0, t = 0, mounted = false;
  let ac = null;

  const MISSION_MS = 120000; // 2-Minute Countdown Challenge (120s)
  let sessionStart = 0;
  let missionCompleted = false;

  const COLS = 8;
  const ROWS = 12;
  const BUBBLE_COLORS = [
    { name: 'pink', fill: '#f3256b', glow: '#ff758f', dark: '#c2185b' },
    { name: 'gold', fill: '#ffbe0b', glow: '#ffd166', dark: '#d48b00' },
    { name: 'green', fill: '#00a651', glow: '#70e000', dark: '#007236' },
    { name: 'blue', fill: '#3366ff', glow: '#6ec1ff', dark: '#1e40af' },
    { name: 'purple', fill: '#8a2eae', glow: '#c77dff', dark: '#581c87' },
  ];

  const PENTA = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.26, 783.99, 1046.5];

  let grid = []; // 2D array [row][col] -> null or { colorIndex, type, r, popping, dropVy }
  let bubbleR = 20;
  let gridTop = 60;
  let cannon = { x: 0, y: 0, angle: -Math.PI / 2, curBubble: 0, nextBubble: 1 };
  let flyingBubble = null; // { x, y, vx, vy, colorIndex, type }
  let droppingBubbles = [];
  let particles = [];
  let popups = [];
  let aiming = false;
  let aimPos = { x: 0, y: 0 };
  let combo = 0;
  let missesUntilDrop = 4;
  let score = 0;

  const GB = () => {
    if (!S.gameBubble) S.gameBubble = { highScore: 0, bubblesPopped: 0, combos: 0, totalGames: 0, sound: true };
    return S.gameBubble;
  };

  const rnd = (a, b) => a + Math.random() * (b - a);

  function fmtClock(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  /* ── Web Audio Chimes ────────────────────────────────────── */
  function audio() {
    if (!GB().sound) return null;
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return null;
    if (!ac) ac = new AC();
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }

  function pluck(freq, vol = .1, dur = .4, type = 'sine') {
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

  function popSound(pitchIndex = 0) {
    const baseFreq = PENTA[Math.min(PENTA.length - 1, pitchIndex + 3)];
    pluck(baseFreq, 0.12, 0.35, 'triangle');
    setTimeout(() => pluck(baseFreq * 1.5, 0.08, 0.25, 'sine'), 40);
  }

  function launchSound() {
    pluck(180, 0.08, 0.18, 'sawtooth');
  }

  function avalancheSound() {
    [523.25, 659.26, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => pluck(f, 0.15, 0.5, 'sine'), i * 65);
    });
  }

  function buzz(ms) {
    try { navigator.vibrate && navigator.vibrate(ms); } catch { /* no haptics */ }
  }

  function addPopup(x, y, text, color = '#ffd166') {
    popups.push({ x, y, text, color, life: 1, vy: -1.4 });
  }

  /* ── Grid Geometry (Hexagonal Offset) ────────────────────── */
  function getBubbleCenter(r, c) {
    const rowOffset = (r % 2 === 1) ? bubbleR : 0;
    const x = bubbleR + c * (bubbleR * 2) + rowOffset;
    const y = gridTop + bubbleR + r * (bubbleR * Math.sqrt(3));
    return { x, y };
  }

  function initGrid() {
    grid = [];
    for (let r = 0; r < ROWS; r++) {
      grid[r] = [];
      const colsInRow = (r % 2 === 1) ? COLS - 1 : COLS;
      for (let c = 0; c < colsInRow; c++) {
        if (r < 5) {
          const isSpecial = Math.random() < 0.04;
          const specialType = Math.random() < 0.5 ? 'bomb' : 'rainbow';
          grid[r][c] = {
            colorIndex: Math.floor(Math.random() * BUBBLE_COLORS.length),
            type: isSpecial ? specialType : 'normal',
          };
        } else {
          grid[r][c] = null;
        }
      }
    }
  }

  function pickRandomColor() {
    // Pick color that still exists on the board
    const available = new Set();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < grid[r]?.length; c++) {
        if (grid[r][c] && grid[r][c].type === 'normal') available.add(grid[r][c].colorIndex);
      }
    }
    const arr = Array.from(available);
    if (arr.length) return arr[Math.floor(Math.random() * arr.length)];
    return Math.floor(Math.random() * BUBBLE_COLORS.length);
  }

  /* ── Particles & Explosion Bursts ────────────────────────── */
  function spawnBubbleBurst(x, y, color, count = 16) {
    for (let i = 0; i < count; i++) {
      const a = rnd(0, Math.PI * 2), sp = rnd(1.5, 5.5);
      particles.push({
        x, y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - rnd(0.5, 1.8),
        color,
        life: 1,
        decay: rnd(0.02, 0.04),
        r: rnd(2, 5),
      });
    }
  }

  /* ── Match 3 & Flood Fill Physics ────────────────────────── */
  function getNeighbors(r, c) {
    const isOdd = (r % 2 === 1);
    const neighbors = [];
    const offsets = isOdd ? [
      [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]
    ] : [
      [-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]
    ];

    for (const [dr, dc] of offsets) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < (nr % 2 === 1 ? COLS - 1 : COLS)) {
        neighbors.push({ r: nr, c: nc });
      }
    }
    return neighbors;
  }

  function findMatches(startR, startC, targetColor) {
    const matched = [];
    const visited = Array.from({ length: ROWS }, () => []);
    const queue = [{ r: startR, c: startC }];
    visited[startR][startC] = true;

    while (queue.length) {
      const { r, c } = queue.shift();
      const b = grid[r][c];
      if (!b) continue;

      if (b.colorIndex === targetColor || b.type === 'rainbow' || targetColor === 'rainbow') {
        matched.push({ r, c });
        for (const n of getNeighbors(r, c)) {
          if (!visited[n.r][n.c] && grid[n.r][n.c]) {
            visited[n.r][n.c] = true;
            queue.push(n);
          }
        }
      }
    }
    return matched;
  }

  function dropFloatingClusters() {
    // Find all bubbles connected to the top ceiling
    const connected = Array.from({ length: ROWS }, () => []);
    const queue = [];

    // Root nodes: row 0
    for (let c = 0; c < COLS; c++) {
      if (grid[0][c]) {
        connected[0][c] = true;
        queue.push({ r: 0, c });
      }
    }

    while (queue.length) {
      const { r, c } = queue.shift();
      for (const n of getNeighbors(r, c)) {
        if (!connected[n.r][n.c] && grid[n.r][n.c]) {
          connected[n.r][n.c] = true;
          queue.push(n);
        }
      }
    }

    // Any bubble NOT connected drops into score buckets!
    let droppedCount = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < (r % 2 === 1 ? COLS - 1 : COLS); c++) {
        if (grid[r][c] && !connected[r][c]) {
          const b = grid[r][c];
          grid[r][c] = null;
          const pos = getBubbleCenter(r, c);
          droppingBubbles.push({
            x: pos.x, y: pos.y,
            vx: rnd(-1.5, 1.5), vy: rnd(-1, 1),
            color: BUBBLE_COLORS[b.colorIndex % BUBBLE_COLORS.length].fill,
            type: b.type,
          });
          droppedCount++;
        }
      }
    }

    if (droppedCount > 0) {
      const dropBonus = droppedCount * 25 * (combo + 1);
      score += dropBonus;
      GB().bubblesPopped = (GB().bubblesPopped || 0) + droppedCount;
      avalancheSound();
      buzz([20, 60, 100]);
      addPopup(W / 2, H * 0.45, `💥 AVALANCHE! +${dropBonus} pts`, '#ffd700');
      toast(`Mega Avalanche! Dropped ${droppedCount} bubbles! 💥✨`, 2200);
      recordScore();
      updateHUD();
    }
  }

  function snapAndCheck(x, y, colorIndex, type) {
    // Find closest valid grid slot
    let bestDist = Infinity;
    let bestR = 0, bestC = 0;

    for (let r = 0; r < ROWS; r++) {
      const maxC = (r % 2 === 1) ? COLS - 1 : COLS;
      for (let c = 0; c < maxC; c++) {
        if (!grid[r][c]) {
          const pos = getBubbleCenter(r, c);
          const d = Math.hypot(pos.x - x, pos.y - y);
          if (d < bestDist) {
            bestDist = d;
            bestR = r; bestC = c;
          }
        }
      }
    }

    // Place bubble
    grid[bestR][bestC] = { colorIndex, type };
    const pos = getBubbleCenter(bestR, bestC);

    // Check Special Bomb Powerup
    if (type === 'bomb') {
      const exploded = [{ r: bestR, c: bestC }, ...getNeighbors(bestR, bestC)];
      for (const ex of exploded) {
        if (grid[ex.r][ex.c]) {
          const p = getBubbleCenter(ex.r, ex.c);
          spawnBubbleBurst(p.x, p.y, '#ffd166', 20);
          grid[ex.r][ex.c] = null;
          score += 20;
        }
      }
      avalancheSound();
      buzz([30, 80]);
      addPopup(pos.x, pos.y, '💣 HOPE SUPERNOVA! +120', '#ff9e00');
      dropFloatingClusters();
      recordScore();
      updateHUD();
      return;
    }

    // Match 3 Check
    const matches = findMatches(bestR, bestC, type === 'rainbow' ? 'rainbow' : colorIndex);

    if (matches.length >= 3) {
      combo++;
      GB().combos = Math.max(GB().combos || 0, combo);
      const points = matches.length * 15 * combo;
      score += points;
      GB().bubblesPopped = (GB().bubblesPopped || 0) + matches.length;

      for (let i = 0; i < matches.length; i++) {
        const m = matches[i];
        const p = getBubbleCenter(m.r, m.c);
        const col = BUBBLE_COLORS[grid[m.r][m.c].colorIndex % BUBBLE_COLORS.length].glow;
        grid[m.r][m.c] = null;
        setTimeout(() => {
          spawnBubbleBurst(p.x, p.y, col, 14);
          popSound(i);
        }, i * 35);
      }

      buzz(18);
      addPopup(pos.x, pos.y, `+${points} pts ${combo > 1 ? `Combo x${combo}!` : 'Match!'}`, '#ffd166');
      dropFloatingClusters();
      recordScore();
      updateHUD();
    } else {
      combo = 0;
      missesUntilDrop--;
      if (missesUntilDrop <= 0) {
        missesUntilDrop = 4;
        shiftGridDown();
      }
    }
  }

  function shiftGridDown() {
    // Shift all rows down 1 and add new random top row
    const newTop = [];
    for (let c = 0; c < COLS; c++) {
      newTop.push({
        colorIndex: Math.floor(Math.random() * BUBBLE_COLORS.length),
        type: Math.random() < 0.05 ? 'bomb' : 'normal',
      });
    }
    grid.unshift(newTop);
    grid.pop();
    toast('Ceiling lowered! Stay sharp ⚡', 1800);
  }

  function recordScore() {
    const gb = GB();
    if (score > (gb.highScore || 0)) {
      gb.highScore = score;
      save();
    }
  }

  function updateHUD() {
    const sEl = $('#bubble-score'); if (sEl) sEl.textContent = score;
    const hEl = $('#bubble-high'); if (hEl) hEl.textContent = GB().highScore || score;
    const cEl = $('#bubble-combo'); if (cEl) cEl.textContent = combo > 1 ? `x${combo}` : '—';
  }

  /* ── Laser Aiming Guide & Trajectory Reflection ─────────── */
  function drawAimLaser() {
    if (!aiming) return;
    const startX = cannon.x, startY = cannon.y;
    const dirX = Math.cos(cannon.angle), dirY = Math.sin(cannon.angle);

    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.85)';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 8;

    let curX = startX, curY = startY;
    let vx = dirX, vy = dirY;
    ctx.beginPath();
    ctx.moveTo(curX, curY);

    for (let step = 0; step < 400; step++) {
      curX += vx * 2.5;
      curY += vy * 2.5;

      // Wall bounce
      if (curX <= bubbleR) {
        curX = bubbleR;
        vx = -vx;
        ctx.lineTo(curX, curY);
      } else if (curX >= W - bubbleR) {
        curX = W - bubbleR;
        vx = -vx;
        ctx.lineTo(curX, curY);
      }

      // Stop if hit ceiling or existing bubble
      if (curY <= gridTop + bubbleR) {
        ctx.lineTo(curX, curY);
        break;
      }

      // Check bubble collision
      let hit = false;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < (r % 2 === 1 ? COLS - 1 : COLS); c++) {
          if (grid[r][c]) {
            const p = getBubbleCenter(r, c);
            if (Math.hypot(p.x - curX, p.y - curY) < bubbleR * 1.8) {
              hit = true; break;
            }
          }
        }
        if (hit) break;
      }
      if (hit) {
        ctx.lineTo(curX, curY);
        break;
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  /* ── Render Loop ─────────────────────────────────────────── */
  function frame(ts) {
    if (!mounted) return;
    const dt = Math.min(50, ts - last || 16);
    last = ts;
    t += dt;
    const now = Date.now();

    // 1) 2-Minute Mission Timer
    const elapsed = now - sessionStart;
    const timeLeft = Math.max(0, MISSION_MS - elapsed);
    const timeEl = $('#bubble-timer');
    if (timeEl) timeEl.textContent = fmtClock(timeLeft);

    if (timeLeft <= 0 && !missionCompleted) {
      missionCompleted = true;
      celebrate2MinComplete();
    }

    // 2) Update Flying Bubble
    if (flyingBubble) {
      flyingBubble.x += flyingBubble.vx;
      flyingBubble.y += flyingBubble.vy;

      // Left & right wall bounce
      if (flyingBubble.x <= bubbleR) {
        flyingBubble.x = bubbleR;
        flyingBubble.vx = -flyingBubble.vx;
      } else if (flyingBubble.x >= W - bubbleR) {
        flyingBubble.x = W - bubbleR;
        flyingBubble.vx = -flyingBubble.vx;
      }

      // Check collision with ceiling
      let collided = false;
      if (flyingBubble.y <= gridTop + bubbleR) {
        collided = true;
      }

      // Check collision with other bubbles
      if (!collided) {
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < (r % 2 === 1 ? COLS - 1 : COLS); c++) {
            if (grid[r][c]) {
              const p = getBubbleCenter(r, c);
              if (Math.hypot(p.x - flyingBubble.x, p.y - flyingBubble.y) < bubbleR * 1.75) {
                collided = true; break;
              }
            }
          }
          if (collided) break;
        }
      }

      if (collided) {
        snapAndCheck(flyingBubble.x, flyingBubble.y, flyingBubble.colorIndex, flyingBubble.type);
        flyingBubble = null;

        // Load Next Bubble
        cannon.curBubble = cannon.nextBubble;
        cannon.nextBubble = pickRandomColor();
      }
    }

    // 3) Update Dropping Avalanches
    for (const db of droppingBubbles) {
      db.vy += 0.45;
      db.x += db.vx;
      db.y += db.vy;
    }
    droppingBubbles = droppingBubbles.filter(db => db.y < H + 40);

    // 4) Update Particles & Popups
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.18;
      p.life -= p.decay;
    }
    particles = particles.filter(p => p.life > 0);

    for (const pp of popups) {
      pp.y += pp.vy;
      pp.life -= 0.022;
    }
    popups = popups.filter(pp => pp.life > 0);

    // 5) DRAW SCENE
    renderScene();

    raf = requestAnimationFrame(frame);
  }

  function renderScene() {
    ctx.clearRect(0, 0, W, H);

    // Cosmic Arcade Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#0f051d');
    bgGrad.addColorStop(0.5, '#240b3b');
    bgGrad.addColorStop(1, '#130424');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Draw Aiming Laser
    drawAimLaser();

    // Draw Grid Bubbles
    for (let r = 0; r < ROWS; r++) {
      const maxC = (r % 2 === 1) ? COLS - 1 : COLS;
      for (let c = 0; c < maxC; c++) {
        if (grid[r][c]) {
          const p = getBubbleCenter(r, c);
          drawGlossyBubble(p.x, p.y, grid[r][c].colorIndex, grid[r][c].type);
        }
      }
    }

    // Draw Dropping Avalanches
    for (const db of droppingBubbles) {
      drawGlossyBubble(db.x, db.y, db.colorIndex || 0, db.type);
    }

    // Draw Flying Bubble
    if (flyingBubble) {
      drawGlossyBubble(flyingBubble.x, flyingBubble.y, flyingBubble.colorIndex, flyingBubble.type);
    }

    // Draw Cannon Launcher
    drawCannon();

    // Draw Particles
    for (const p of particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.8, p.r * p.life), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Draw Popups
    for (const pp of popups) {
      ctx.globalAlpha = Math.max(0, pp.life);
      ctx.fillStyle = pp.color;
      ctx.font = '800 13.5px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 6;
      ctx.fillText(pp.text, pp.x, pp.y);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }

  function drawGlossyBubble(x, y, colorIndex, type = 'normal') {
    const col = BUBBLE_COLORS[colorIndex % BUBBLE_COLORS.length];
    ctx.save();
    ctx.translate(x, y);

    // Glow Aura
    ctx.shadowColor = col.glow;
    ctx.shadowBlur = 12;

    // Outer Bubble Gradient
    const radGrad = ctx.createRadialGradient(-bubbleR * 0.35, -bubbleR * 0.35, 2, 0, 0, bubbleR);
    radGrad.addColorStop(0, '#ffffff');
    radGrad.addColorStop(0.3, col.glow);
    radGrad.addColorStop(0.8, col.fill);
    radGrad.addColorStop(1, col.dark);
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(0, 0, bubbleR - 1, 0, Math.PI * 2);
    ctx.fill();

    // Gloss Glint Highlight
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.beginPath();
    ctx.ellipse(-bubbleR * 0.32, -bubbleR * 0.35, bubbleR * 0.35, bubbleR * 0.18, -0.6, 0, Math.PI * 2);
    ctx.fill();

    // Special Icons
    if (type === 'bomb') {
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💣', 0, 5);
    } else if (type === 'rainbow') {
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌈', 0, 5);
    }

    ctx.restore();
  }

  function drawCannon() {
    const cx = cannon.x, cy = cannon.y;
    ctx.save();
    ctx.translate(cx, cy);

    // Cannon Barrel
    ctx.save();
    ctx.rotate(cannon.angle + Math.PI / 2);
    ctx.fillStyle = '#3f1f63';
    ctx.strokeStyle = '#dcc6f2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-10, -42, 20, 42, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Base Pod Ring
    ctx.fillStyle = '#2b123d';
    ctx.strokeStyle = '#8a2eae';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Current Loaded Bubble
    drawGlossyBubble(0, 0, cannon.curBubble);

    // Next Bubble Preview (On the side)
    ctx.translate(46, 6);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
    drawGlossyBubble(0, 0, cannon.nextBubble);

    ctx.restore();
  }

  /* ── Input Handlers ─────────────────────────────────────── */
  function updateAim(clientX, clientY) {
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const x = clientX - r.left, y = clientY - r.top;
    const angle = Math.atan2(y - cannon.y, x - cannon.x);
    // Limit cannon to upward angles (-170 deg to -10 deg)
    if (angle < -0.15 && angle > -Math.PI + 0.15) {
      cannon.angle = angle;
    }
  }

  function shootBubble() {
    if (flyingBubble) return;
    const speed = 14;
    flyingBubble = {
      x: cannon.x,
      y: cannon.y,
      vx: Math.cos(cannon.angle) * speed,
      vy: Math.sin(cannon.angle) * speed,
      colorIndex: cannon.curBubble,
      type: 'normal',
    };
    launchSound();
    buzz(12);
  }

  function swapBubbles() {
    const tmp = cannon.curBubble;
    cannon.curBubble = cannon.nextBubble;
    cannon.nextBubble = tmp;
    pluck(587.33, 0.08, 0.2, 'sine');
    toast('Swapped loaded bubble 🔄', 1200);
  }

  function celebrate2MinComplete() {
    confetti();
    buzz([30, 80, 120]);
    S.game.serenity = (S.game.serenity || 0) + 25;
    recordScore();
    save();

    const isNewHigh = score >= (GB().highScore || 0);

    modal(`
      <div style="text-align:center;padding:12px 4px">
        <div style="font-size:46px;margin-bottom:8px">🫧✨</div>
        <h3 style="font-size:20px;font-weight:800;color:var(--ink)">2-Minute Bubble Challenge Complete!</h3>
        ${isNewHigh ? `<div style="display:inline-block;background:linear-gradient(135deg,#ffd166,#f3256b);color:#fff;font-weight:800;font-size:11px;padding:3px 10px;border-radius:999px;margin-bottom:8px">🏆 NEW HIGH SCORE!</div>` : ''}
        <p style="font-size:13.5px;line-height:1.6;color:var(--ink-soft);margin:6px 0 14px">
          You popped <b>${GB().bubblesPopped || 0} Bubbles</b> and achieved <b>${score} Points</b>!
        </p>
        <div style="background:#faf7ff;border:1.5px solid #dcc6f2;border-radius:14px;padding:12px;margin-bottom:16px;text-align:left">
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>🏆 Session Score:</span><b>${score} pts</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>⭐ All-Time High:</span><b style="color:#8a2eae">${GB().highScore} pts</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>🔥 Best Combo:</span><b>x${GB().combos || 1}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:#8a2eae"><span>💜 Serenity Award:</span><b>+25 Serenity &amp; Hope</b></div>
        </div>
        <div class="modal-btns">
          <button class="btn btn-primary" id="bubble-continue">Play Again 🫧</button>
          <button class="btn btn-ghost" onclick="closeModal()">Back to Games</button>
        </div>
      </div>
    `);

    $('#bubble-continue')?.addEventListener('click', () => {
      sessionStart = Date.now();
      missionCompleted = false;
      score = 0;
      initGrid();
      closeModal();
      toast('Let the bubbles pop! 🫧✨');
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

    bubbleR = Math.floor(W / (COLS * 2.05));
    cannon.x = W / 2;
    cannon.y = H - 38;
  }

  function mount() {
    stop();
    canvas = $('#bubble-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    mounted = true;

    sessionStart = Date.now();
    missionCompleted = false;
    score = 0;
    combo = 0;
    flyingBubble = null;
    droppingBubbles = [];
    particles = [];
    popups = [];

    // Initialize 2:00 timer display immediately
    const tEl = $('#bubble-timer');
    if (tEl) tEl.textContent = '2:00';

    resize();
    initGrid();
    cannon.curBubble = pickRandomColor();
    cannon.nextBubble = pickRandomColor();
    updateHUD();

    canvas.addEventListener('pointerdown', e => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      // Tap on swap bubble button
      if (Math.hypot(x - (cannon.x + 46), y - (cannon.y + 6)) < 26) {
        swapBubbles();
        return;
      }
      aiming = true;
      updateAim(e.clientX, e.clientY);
    });

    window.addEventListener('pointermove', e => {
      if (aiming) updateAim(e.clientX, e.clientY);
    });

    window.addEventListener('pointerup', () => {
      if (aiming) {
        aiming = false;
        shootBubble();
      }
    });

    window.addEventListener('resize', resize);

    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (!mounted && !canvas) return;
    mounted = false;
    cancelAnimationFrame(raf);
    recordScore();
    window.removeEventListener('resize', resize);
    canvas = null; ctx = null;
    grid = [];
    particles = [];
    popups = [];
  }

  return { mount, stop, swapBubbles, getHighScore: () => GB().highScore || 0 };
})();
