/* ============================================================
   MojaMind — Moja Pop: Serenity Bubble Odyssey 🫧✨🎯
   An immensely satisfying, physics-based Bubble Shooter game.
   
   Rules & Features:
   - 2-Minute Countdown Timer Challenge (120s) OR 3 Lives (❤️❤️❤️).
   - Once balls touch the danger zone:
     • 1st time: 1 Reset Push Back (pushes entire ceiling up safely!).
     • Subsequent times: A life is taken (💔 -1 Life).
     • At 0 lives (or time out): Immediate Restart & Celebration Popup!
   - High-precision trajectory aiming laser with wall reflections.
   - Hexagonal bubble grid snapping & match-3 pop mechanics.
   - Cascading floating cluster drop physics (Mega Avalanches!).
   - Harmonic pentatonic pop chimes & combo multipliers.
   - Special power bubbles: Hope Supernova 💣, Prism Rainbows 🌈.
   - Glassmorphism dark Ionity theme & high visibility HUD.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za
   ============================================================ */
'use strict';

const MMBubble = (() => {
  let canvas = null, ctx = null, W = 0, H = 0, dpr = 1;
  let raf = 0, last = 0, t = 0, mounted = false;
  let ac = null;

  const MISSION_MS = 120000; // 2-Minute Countdown Challenge (120s)
  const MAX_LIVES = 3;
  let sessionStart = 0;
  let gameOver = false;
  let lives = MAX_LIVES;
  let pushBackAvailable = true;
  let pushBackEffectUntil = 0;

  const COLS = 8;
  const ROWS = 11;
  const DANGER_ROW = 8; // Row index that triggers pushback or life loss
  const BUBBLE_COLORS = [
    { name: 'pink', fill: '#f3256b', glow: '#ff758f', dark: '#c2185b' },
    { name: 'gold', fill: '#ffbe0b', glow: '#ffd166', dark: '#d48b00' },
    { name: 'green', fill: '#00a651', glow: '#70e000', dark: '#007236' },
    { name: 'blue', fill: '#3366ff', glow: '#6ec1ff', dark: '#1e40af' },
    { name: 'purple', fill: '#8a2eae', glow: '#c77dff', dark: '#581c87' },
  ];

  const PENTA = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.26, 783.99, 1046.5];

  let grid = []; // 2D array [row][col] -> null or { colorIndex, type }
  let bubbleR = 20;
  let gridTop = 54;
  let cannon = { x: 0, y: 0, angle: -Math.PI / 2, curBubble: 0, nextBubble: 1 };
  let flyingBubble = null; // { x, y, vx, vy, colorIndex, type }
  let droppingBubbles = [];
  let particles = [];
  let popups = [];
  let aiming = false;
  let combo = 0;
  let missesUntilDrop = 4;
  let score = 0;
  let bubblesPoppedThisSession = 0;

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

  function pushBackSound() {
    [392.0, 523.25, 659.26, 1046.5].forEach((f, i) => {
      setTimeout(() => pluck(f, 0.18, 0.6, 'triangle'), i * 75);
    });
  }

  function lifeLostSound() {
    pluck(180, 0.2, 0.5, 'sawtooth');
    setTimeout(() => pluck(120, 0.2, 0.6, 'sawtooth'), 120);
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

  function dangerY() {
    return gridTop + bubbleR + DANGER_ROW * (bubbleR * Math.sqrt(3));
  }

  function initGrid() {
    grid = [];
    for (let r = 0; r < ROWS; r++) {
      grid[r] = [];
      const colsInRow = (r % 2 === 1) ? COLS - 1 : COLS;
      for (let c = 0; c < colsInRow; c++) {
        if (r < 4) {
          const isSpecial = Math.random() < 0.05;
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
            colorIndex: b.colorIndex,
            type: b.type,
          });
          droppedCount++;
        }
      }
    }

    if (droppedCount > 0) {
      const dropBonus = droppedCount * 25 * (combo + 1);
      score += dropBonus;
      bubblesPoppedThisSession += droppedCount;
      GB().bubblesPopped = (GB().bubblesPopped || 0) + droppedCount;
      avalancheSound();
      buzz([20, 60, 100]);
      addPopup(W / 2, H * 0.45, `💥 AVALANCHE! +${dropBonus} pts`, '#ffd700');
      toast(`Mega Avalanche! Dropped ${droppedCount} bubbles! 💥✨`, 2200);
      recordScore();
      updateHUD();
    }
  }

  /* ── Danger Zone & Reset Push Back Rules ─────────────────── */
  function checkDangerThreshold() {
    if (gameOver) return;

    let breached = false;
    for (let r = DANGER_ROW; r < ROWS; r++) {
      for (let c = 0; c < (r % 2 === 1 ? COLS - 1 : COLS); c++) {
        if (grid[r][c]) {
          breached = true;
          break;
        }
      }
      if (breached) break;
    }

    if (breached) {
      if (pushBackAvailable) {
        // 1st time: 1 Reset Push Back!
        pushBackAvailable = false;
        executePushBack();
      } else {
        // After that: A life is taken!
        takeLife();
      }
    }
  }

  function executePushBack() {
    pushBackEffectUntil = Date.now() + 1200;
    pushBackSound();
    buzz([40, 100, 160]);

    // Push grid up by 3 rows
    for (let shift = 0; shift < 3; shift++) {
      grid.shift();
      grid.push(new Array(shift % 2 === 1 ? COLS - 1 : COLS).fill(null));
    }

    // Spawn massive protective sparkles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: rnd(20, W - 20),
        y: dangerY() + rnd(-20, 20),
        vx: rnd(-2.5, 2.5),
        vy: rnd(-4, -1),
        color: '#6ec1ff',
        life: 1,
        decay: rnd(0.015, 0.03),
        r: rnd(3, 6),
      });
    }

    addPopup(W / 2, dangerY() - 20, '🛡️ RESET PUSH BACK ACTIVATED! 🛡️', '#6ec1ff');
    toast('🛡️ Reset Push Back activated! Grid pushed back up safely!', 3000);
    updateHUD();
  }

  function takeLife() {
    lives--;
    lifeLostSound();
    buzz([80, 140, 200]);

    // Spawn warning red flash particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: rnd(20, W - 20),
        y: dangerY() + rnd(-10, 10),
        vx: rnd(-3, 3),
        vy: rnd(-3, 2),
        color: '#f3256b',
        life: 1,
        decay: rnd(0.02, 0.04),
        r: rnd(3, 7),
      });
    }

    // Shift grid up 2 rows to give breathing room after losing life
    grid.shift();
    grid.shift();
    grid.push(new Array(COLS).fill(null));
    grid.push(new Array(COLS - 1).fill(null));

    if (lives <= 0) {
      lives = 0;
      updateHUD();
      triggerGameOver('out_of_lives');
    } else {
      addPopup(W / 2, dangerY() - 20, `💔 -1 LIFE! (${lives} Remaining)`, '#f3256b');
      toast(`Balls touched the danger line! 💔 Life lost (${lives} left)`, 2800);
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
          bubblesPoppedThisSession++;
        }
      }
      avalancheSound();
      buzz([30, 80]);
      addPopup(pos.x, pos.y, '💣 HOPE SUPERNOVA! +120', '#ff9e00');
      dropFloatingClusters();
      recordScore();
      updateHUD();
      checkDangerThreshold();
      return;
    }

    // Match 3 Check
    const matches = findMatches(bestR, bestC, type === 'rainbow' ? 'rainbow' : colorIndex);

    if (matches.length >= 3) {
      combo++;
      GB().combos = Math.max(GB().combos || 0, combo);
      const points = matches.length * 15 * combo;
      score += points;
      bubblesPoppedThisSession += matches.length;
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
      updateHUD();
    }

    checkDangerThreshold();
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
    toast('Ceiling lowered! Watch the danger zone ⚡', 1600);
    checkDangerThreshold();
  }

  function recordScore() {
    const gb = GB();
    if (score > (gb.highScore || 0)) {
      gb.highScore = score;
      save();
    }
  }

  function getLivesHearts() {
    let s = '';
    for (let i = 0; i < MAX_LIVES; i++) {
      s += i < lives ? '❤️' : '🖤';
    }
    return s;
  }

  function updateHUD() {
    const sEl = $('#bubble-score'); if (sEl) sEl.textContent = score;
    const hEl = $('#bubble-high'); if (hEl) hEl.textContent = GB().highScore || score;
    const cEl = $('#bubble-combo'); if (cEl) cEl.textContent = combo > 1 ? `x${combo}` : '—';
    const lEl = $('#bubble-lives'); if (lEl) lEl.innerHTML = getLivesHearts();
    const pEl = $('#bubble-pushback');
    if (pEl) {
      pEl.textContent = pushBackAvailable ? '🛡️ Push Back Ready' : '🛡️ Used';
      pEl.style.opacity = pushBackAvailable ? '1' : '0.6';
    }
  }

  /* ── Laser Aiming Guide & Trajectory Reflection ─────────── */
  function drawAimLaser() {
    if (!aiming || gameOver) return;
    const startX = cannon.x, startY = cannon.y;
    const dirX = Math.cos(cannon.angle), dirY = Math.sin(cannon.angle);

    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.88)';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 10;

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
    if (!gameOver) {
      const elapsed = now - sessionStart;
      const timeLeft = Math.max(0, MISSION_MS - elapsed);
      const timeEl = $('#bubble-timer');
      if (timeEl) timeEl.textContent = fmtClock(timeLeft);

      if (timeLeft <= 0) {
        triggerGameOver('time_up');
      }
    }

    // 2) Update Flying Bubble
    if (flyingBubble && !gameOver) {
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
    bgGrad.addColorStop(0, '#0d0419');
    bgGrad.addColorStop(0.5, '#1e0a33');
    bgGrad.addColorStop(1, '#0e0318');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Danger Zone Line
    const dy = dangerY();
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba(243, 37, 107, 0.55)';
    ctx.shadowColor = '#f3256b';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(0, dy);
    ctx.lineTo(W, dy);
    ctx.stroke();

    ctx.font = '700 10.5px Poppins, sans-serif';
    ctx.fillStyle = 'rgba(243, 37, 107, 0.85)';
    ctx.textAlign = 'right';
    ctx.fillText('⚠️ DANGER LINE', W - 10, dy - 5);
    ctx.restore();

    // Push Back Visual Wave
    if (Date.now() < pushBackEffectUntil) {
      const prog = (pushBackEffectUntil - Date.now()) / 1200;
      ctx.save();
      ctx.strokeStyle = `rgba(110, 193, 255, ${prog})`;
      ctx.lineWidth = 4;
      ctx.shadowColor = '#6ec1ff';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.moveTo(0, dy - (1 - prog) * 120);
      ctx.lineTo(W, dy - (1 - prog) * 120);
      ctx.stroke();
      ctx.restore();
    }

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
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
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
    ctx.fillStyle = '#2e124a';
    ctx.strokeStyle = '#3366ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-10, -42, 20, 42, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Base Pod Ring
    ctx.fillStyle = '#1c0830';
    ctx.strokeStyle = '#3366ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#3366ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Current Loaded Bubble
    drawGlossyBubble(0, 0, cannon.curBubble);

    // Next Bubble Preview (On the side with swap icon)
    ctx.translate(48, 4);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(0, 0, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawGlossyBubble(0, 0, cannon.nextBubble);

    // Mini Swap Hint
    ctx.fillStyle = '#ffd166';
    ctx.font = '9px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔄 SWAP', 0, 26);

    ctx.restore();
  }

  /* ── Input Handlers ─────────────────────────────────────── */
  function updateAim(clientX, clientY) {
    if (!canvas || gameOver) return;
    const r = canvas.getBoundingClientRect();
    const x = clientX - r.left, y = clientY - r.top;
    const angle = Math.atan2(y - cannon.y, x - cannon.x);
    // Limit cannon to upward angles (-170 deg to -10 deg)
    if (angle < -0.15 && angle > -Math.PI + 0.15) {
      cannon.angle = angle;
    }
  }

  function shootBubble() {
    if (flyingBubble || gameOver) return;
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
    if (gameOver) return;
    const tmp = cannon.curBubble;
    cannon.curBubble = cannon.nextBubble;
    cannon.nextBubble = tmp;
    pluck(587.33, 0.08, 0.2, 'sine');
    toast('Swapped loaded bubble 🔄', 1200);
  }

  function triggerGameOver(reason = 'time_up') {
    if (gameOver) return;
    gameOver = true;
    confetti();
    buzz([40, 100, 180]);
    recordScore();

    const isNewHigh = score >= (GB().highScore || 0);
    const serenityReward = Math.max(10, Math.floor(score / 40));
    S.game.serenity = (S.game.serenity || 0) + serenityReward;
    save();

    const title = reason === 'time_up' ? '2-Minute Challenge Complete! ⏳✨' : 'Game Over — Out of Lives! 💔';
    const subText = reason === 'time_up'
      ? `Outstanding focus! You mastered the 2-minute bubble challenge!`
      : `The bubbles reached the bottom. Reset push back was utilized and all 3 lives were tested.`;

    modal(`
      <div style="text-align:center;padding:14px 6px;color:#ffffff">
        <div style="font-size:46px;margin-bottom:8px">${reason === 'time_up' ? '🫧🏆' : '🎯✨'}</div>
        <h3 style="font-size:20px;font-weight:800;color:#ffffff;margin-bottom:6px">${title}</h3>
        ${isNewHigh && score > 0 ? `<div style="display:inline-block;background:linear-gradient(135deg,#ffd166,#f3256b);color:#fff;font-weight:800;font-size:11.5px;padding:4px 12px;border-radius:999px;margin-bottom:10px;box-shadow:0 2px 10px rgba(243,37,107,0.4)">🏆 NEW ALL-TIME HIGH SCORE!</div>` : ''}
        <p style="font-size:13.5px;line-height:1.6;color:rgba(255,255,255,0.85);margin:6px 0 16px">
          ${subText}
        </p>
        <div style="background:rgba(255,255,255,0.08);backdrop-filter:blur(16px);border:1.5px solid rgba(51,102,255,0.4);border-radius:18px;padding:14px;margin-bottom:18px;text-align:left">
          <div style="display:flex;justify-content:space-between;font-size:13.5px;padding:5px 0;color:rgba(255,255,255,0.9)"><span>🏆 Session Score:</span><b style="color:#ffd700;font-size:15px">${score} pts</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13.5px;padding:5px 0;color:rgba(255,255,255,0.9)"><span>⭐ All-Time High:</span><b style="color:#6ec1ff">${GB().highScore || score} pts</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13.5px;padding:5px 0;color:rgba(255,255,255,0.9)"><span>🫧 Bubbles Popped:</span><b style="color:#ffffff">${bubblesPoppedThisSession}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13.5px;padding:5px 0;color:rgba(255,255,255,0.9)"><span>🔥 Best Combo:</span><b style="color:#ffbe0b">x${GB().combos || 1}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13.5px;padding:5px 0;color:#6ec1ff;border-top:1px dashed rgba(255,255,255,0.15);margin-top:6px;padding-top:8px"><span>💜 Serenity Earned:</span><b>+${serenityReward} Serenity</b></div>
        </div>
        <div class="modal-btns" style="display:flex;flex-direction:column;gap:8px">
          <button class="btn btn-primary btn-block" id="bubble-restart" style="background:linear-gradient(135deg,#3366FF,#8a2eae);color:#fff;font-weight:800;font-size:14px">Play Again 🫧</button>
          <button class="btn btn-ghost btn-block" onclick="closeModal()">Back to Games Hub</button>
        </div>
      </div>
    `);

    $('#bubble-restart')?.addEventListener('click', () => {
      resetSession();
      closeModal();
      toast('Let the bubbles pop! 🫧✨');
    });
  }

  function resetSession() {
    sessionStart = Date.now();
    gameOver = false;
    lives = MAX_LIVES;
    pushBackAvailable = true;
    score = 0;
    combo = 0;
    bubblesPoppedThisSession = 0;
    missesUntilDrop = 4;
    flyingBubble = null;
    droppingBubbles = [];
    particles = [];
    popups = [];

    initGrid();
    cannon.curBubble = pickRandomColor();
    cannon.nextBubble = pickRandomColor();
    updateHUD();
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

    resetSession();
    resize();

    canvas.addEventListener('pointerdown', e => {
      if (gameOver) return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      // Tap on swap bubble button
      if (Math.hypot(x - (cannon.x + 48), y - (cannon.y + 4)) < 26) {
        swapBubbles();
        return;
      }
      aiming = true;
      updateAim(e.clientX, e.clientY);
    });

    window.addEventListener('pointermove', e => {
      if (aiming && !gameOver) updateAim(e.clientX, e.clientY);
    });

    window.addEventListener('pointerup', () => {
      if (aiming && !gameOver) {
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

  return { mount, stop, swapBubbles, resetSession, getHighScore: () => GB().highScore || 0 };
})();
