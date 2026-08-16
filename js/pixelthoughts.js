/* ============================================================
   MojaMind — Pixel Thoughts: Cosmic Thought Release 🧘✨
   60-Second Interactive Mindfulness & Emotional Release Engine.
   
   Inspired by mindful space meditation:
   - Type in a troubling thought or stressful worry.
   - Watch the thought star gently breathe, shrink, and dissolve
     into the infinite cosmos over 60 peaceful seconds.
   - Real-time 432Hz procedural harmonic meditation tones.
   - On-demand lifecycle: zero background overhead when idle.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za · www.ionity.today
   ============================================================ */
'use strict';

const MMPixelThoughts = (() => {
  let canvas = null, ctx = null, W = 0, H = 0, dpr = 1;
  let raf = 0, startTime = 0, isRunning = false;
  let ac = null, masterGain = null;
  let userThought = '';
  const TOTAL_DURATION_SEC = 60;

  const PHRASES = [
    { at: 0, text: 'Take a deep breath in… and gently release.' },
    { at: 6, text: 'Observe this thought as a tiny point of light.' },
    { at: 13, text: 'In the vast expanse of time and space…' },
    { at: 20, text: 'Does this thought have to control your peace right now?' },
    { at: 28, text: 'It is just a fleeting thought, passing like a cloud.' },
    { at: 36, text: 'Watch as it gently shrinks and dissolves into cosmic starlight.' },
    { at: 45, text: 'The universe is wide and filled with possibilities.' },
    { at: 52, text: 'You are grounded. You are safe. You are resilient.' },
    { at: 58, text: 'Peace is within you right now. 🌸' },
  ];

  let stars = [];

  function initStars() {
    stars = [];
    for (let i = 0; i < 140; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1600,
        z: Math.random() * 1000 + 1,
        size: Math.random() * 2 + 0.8,
        color: ['#ffffff', '#6ec1ff', '#ffd166', '#fbc9e4'][Math.floor(Math.random() * 4)],
        twinkle: Math.random() * Math.PI * 2,
      });
    }
  }

  /* ── 432Hz Ambient Meditation Chime Engine ───────────────── */
  function getAudio() {
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return null;
    if (!ac) {
      ac = new AC();
      masterGain = ac.createGain();
      masterGain.gain.setValueAtTime(0.10, ac.currentTime);
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(1800, ac.currentTime);
      masterGain.connect(lp);
      lp.connect(ac.destination);
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }

  function playChimeChord(freqs = [432, 540, 648], dur = 4.5) {
    const a = getAudio();
    if (!a) return;
    try {
      const now = a.currentTime;
      freqs.forEach((f, i) => {
        const osc = a.createOscillator();
        const g = a.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.1);
        g.gain.setValueAtTime(0.001, now + i * 0.1);
        g.gain.linearRampToValueAtTime(0.045 / freqs.length, now + i * 0.1 + 1.2);
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now + i * 0.1);
        osc.stop(now + dur + 0.5);
      });
    } catch { /* audio safeguard */ }
  }

  /* ── Animation & Drawing Loop ────────────────────────────── */
  function frame(ts) {
    if (!isRunning || !ctx || !canvas) return;
    const now = Date.now();
    const elapsedSec = (now - startTime) / 1000;
    const progress = Math.min(1, elapsedSec / TOTAL_DURATION_SEC);

    ctx.clearRect(0, 0, W, H);

    // Deep Cosmic Background
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, Math.max(W, H) * 0.8);
    bgGrad.addColorStop(0, '#160829');
    bgGrad.addColorStop(0.5, '#0d0319');
    bgGrad.addColorStop(1, '#05010a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Starfield
    ctx.save();
    ctx.translate(W / 2, H / 2);
    for (const s of stars) {
      s.twinkle += 0.03;
      const alpha = 0.4 + Math.sin(s.twinkle) * 0.35;
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
      ctx.beginPath();
      ctx.arc(s.x * 0.5, s.y * 0.5, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;

    // Current Mindful Guidance Phrase
    let currentPhrase = PHRASES[0].text;
    for (const p of PHRASES) {
      if (elapsedSec >= p.at) currentPhrase = p.text;
    }

    const phraseEl = document.getElementById('pt-phrase');
    if (phraseEl && phraseEl.textContent !== currentPhrase) {
      phraseEl.style.opacity = '0';
      phraseEl.style.transform = 'translateY(6px)';
      setTimeout(() => {
        if (phraseEl) {
          phraseEl.textContent = currentPhrase;
          phraseEl.style.opacity = '1';
          phraseEl.style.transform = 'none';
        }
      }, 300);
      // Play harmonic chime every major phrase transition
      playChimeChord([432, 540, 648], 4.5);
    }

    // Shrinking Thought Orb / Star
    const maxRadius = Math.min(W * 0.36, 120);
    const minRadius = 4;
    // Non-linear ease-out shrink
    const currentRadius = Math.max(minRadius, maxRadius * Math.pow(1 - progress, 1.4));
    const pulse = Math.sin(elapsedSec * 2.2) * (currentRadius * 0.08);
    const r = Math.max(minRadius, currentRadius + pulse);

    const cx = W / 2;
    const cy = H * 0.46;

    if (progress < 0.99) {
      // Outer Cosmic Halo
      const haloGrad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 2.2);
      haloGrad.addColorStop(0, 'rgba(255, 209, 102, 0.45)');
      haloGrad.addColorStop(0.5, 'rgba(51, 102, 255, 0.25)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Main Radiant Star Core
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.4, '#ffd166');
      coreGrad.addColorStop(0.8, '#f3256b');
      coreGrad.addColorStop(1, '#3366FF');
      ctx.fillStyle = coreGrad;
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = Math.min(25, r * 0.8);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Text inside the orb (fades out as orb becomes small)
      const textAlpha = Math.max(0, (1 - progress * 1.8));
      if (textAlpha > 0.05 && r > 28) {
        ctx.fillStyle = `rgba(26, 6, 42, ${textAlpha * 0.95})`;
        ctx.font = `700 ${Math.max(10, Math.min(13, r * 0.22))}px Poppins, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Wrap text to fit inside orb
        const maxTextW = r * 1.6;
        const words = userThought.split(' ');
        let line = '', lines = [];
        for (const w of words) {
          const test = line + (line ? ' ' : '') + w;
          if (ctx.measureText(test).width > maxTextW && line) {
            lines.push(line);
            line = w;
          } else {
            line = test;
          }
        }
        if (line) lines.push(line);

        const lineH = Math.max(11, r * 0.26);
        const startY = cy - ((lines.length - 1) * lineH) / 2;
        lines.slice(0, 3).forEach((l, i) => {
          ctx.fillText(l, cx, startY + i * lineH);
        });
      }
    } else {
      // Completed Cosmic Starlight Sparkle Burst
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00d2ff';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Progress Bar on bottom
    const pBar = document.getElementById('pt-bar-fill');
    if (pBar) pBar.style.width = `${Math.round(progress * 100)}%`;

    const pTimer = document.getElementById('pt-timer');
    if (pTimer) {
      const rem = Math.max(0, Math.ceil(TOTAL_DURATION_SEC - elapsedSec));
      pTimer.textContent = `${rem}s`;
    }

    if (progress >= 1) {
      isRunning = false;
      setTimeout(showCompletion, 700);
      return;
    }

    raf = requestAnimationFrame(frame);
  }

  function resize() {
    if (!canvas) return;
    dpr = Math.min(2, globalThis.devicePixelRatio || 1);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function startSession(thought) {
    userThought = (thought || 'A stressful worry').trim();
    const stage = document.getElementById('pt-stage');
    const inputCard = document.getElementById('pt-input-card');
    if (inputCard) inputCard.classList.add('hidden');
    if (stage) stage.classList.remove('hidden');

    canvas = document.getElementById('pt-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    initStars();

    startTime = Date.now();
    isRunning = true;
    playChimeChord([432, 540, 648, 720], 5.0);

    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  function showCompletion() {
    stop();
    if (typeof confetti === 'function') confetti();
    if (typeof S !== 'undefined') {
      if (!S.game) S.game = {};
      S.game.serenity = (S.game.serenity || 0) + 10;
      if (typeof save === 'function') save();
    }

    if (typeof modal === 'function') {
      modal(`
        <div style="text-align:center;padding:14px 6px;color:#ffffff">
          <div style="font-size:46px;margin-bottom:8px">🌌✨</div>
          <span class="spark-badge" style="margin-bottom:8px">COSMIC RELEASE COMPLETE</span>
          <h3 style="font-size:20px;font-weight:800;color:#ffffff;margin:8px 0 6px">Your Thought Has Dissolved</h3>
          <p style="font-size:13.5px;line-height:1.6;color:rgba(255,255,255,0.9);margin:0 0 16px">
            In the grand tapestry of life and the universe, this thought has surrendered its weight. You are centered and grounded.
          </p>
          <div style="background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,209,102,0.4);border-radius:16px;padding:12px;margin-bottom:18px;text-align:center">
            <span style="font-size:14px;color:#ffd700;font-weight:700">💜 +10 Serenity Points Earned</span>
          </div>
          <div class="modal-btns" style="display:flex;flex-direction:column;gap:8px">
            <button class="btn btn-primary btn-block" onclick="closeModal();nav('#/home')">Return to Home 🏡</button>
            <button class="btn btn-ghost btn-block" onclick="closeModal();MMPixelThoughts.mount()">Release Another Thought ✨</button>
          </div>
        </div>
      `);
    }
  }

  function stop() {
    isRunning = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    canvas = null;
    ctx = null;
  }

  function renderScreen() {
    return `
      ${typeof header === 'function' ? header('Cosmic Thought Release 🧘', { backTo: '#/home' }) : ''}
      <div class="body-pad" style="gap:14px;text-align:center">
        <!-- Input Card Phase -->
        <div id="pt-input-card" class="hero-card" style="background:linear-gradient(135deg,rgba(40,12,65,0.95),rgba(15,3,28,0.98));border:1.6px solid rgba(255,209,102,0.45);padding:22px 18px">
          <span class="spark-badge" style="margin-bottom:8px">60-SECOND MINDFULNESS</span>
          <h2 style="font-size:20px;margin:6px 0 8px;color:#ffffff">What is on your mind right now?</h2>
          <p style="font-size:13px;line-height:1.6;color:rgba(255,255,255,0.85);margin:0 0 16px">
            Place a worry, stressful thought, or fear into the cosmic star. For the next 60 seconds, watch it surrender its size to the infinite universe.
          </p>
          <div class="field" style="margin-bottom:14px">
            <input type="text" id="pt-thought-input" placeholder="Type what is troubling you…" maxlength="80" autocomplete="off" style="color:#ffffff;font-size:14px" />
          </div>
          <button class="btn btn-primary btn-block" id="pt-start-btn" style="background:linear-gradient(135deg,#3366FF,#8a2eae);color:#fff;font-weight:800;font-size:14.5px">
            Release to the Universe ✨
          </button>
        </div>

        <!-- Interactive 60-Second Space Stage -->
        <div id="pt-stage" class="hidden" style="position:relative;width:100%;height:480px;border-radius:24px;overflow:hidden;border:1.6px solid rgba(255,209,102,0.45);box-shadow:0 12px 36px rgba(0,0,0,0.65)">
          <canvas id="pt-canvas" style="width:100%;height:100%;display:block"></canvas>
          <div id="pt-phrase-wrap" style="position:absolute;top:24px;left:16px;right:16px;text-align:center;pointer-events:none">
            <p id="pt-phrase" style="font-size:15px;font-weight:700;color:#ffffff;text-shadow:0 2px 10px rgba(0,0,0,0.8);line-height:1.5;transition:all 0.3s ease;margin:0">
              Take a deep breath in… and gently release.
            </p>
          </div>
          <!-- Bottom Timer & Progress -->
          <div style="position:absolute;bottom:16px;left:20px;right:20px;display:flex;flex-direction:column;gap:6px;pointer-events:none">
            <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:rgba(255,255,255,0.85)">
              <span>🧘 Mindful Breathing</span>
              <span id="pt-timer">60s</span>
            </div>
            <div style="height:6px;background:rgba(255,255,255,0.18);border-radius:99px;overflow:hidden">
              <div id="pt-bar-fill" style="height:100%;width:0%;background:linear-gradient(90deg,#3366FF,#ffd700);transition:width 0.3s linear"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function mount() {
    stop();
    if (typeof render === 'function') {
      render(renderScreen(), { theme: 'theme-purple' });
    }

    const startBtn = document.getElementById('pt-start-btn');
    const thoughtIn = document.getElementById('pt-thought-input');

    thoughtIn?.focus();
    thoughtIn?.addEventListener('keydown', e => {
      if (e.key === 'Enter') startBtn?.click();
    });

    startBtn?.addEventListener('click', () => {
      const val = thoughtIn?.value.trim();
      if (!val) {
        if (typeof toast === 'function') toast('Please type a thought or worry first 🌸');
        return;
      }
      startSession(val);
    });

    window.addEventListener('resize', resize);
  }

  return { mount, stop, renderScreen };
})();
