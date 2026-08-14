/* ============================================================
   MojaMind — Interactive Themed Segment Video Player & Studio 🎬✨
   A uniform, beautiful motion video engine for every study segment
   and art activity (Activities 1–8, Pre/Post Surveys, Daily Spark).
   
   Features:
   - Plays local .mp4 videos when available.
   - High-fidelity Themed Motion Canvas Generator fallback:
     - 4-Chapter Cinematic Visual Walkthrough with animated art strokes.
     - Dynamic audio soundscape with soothing ambient chords.
     - Real-time Piper Neural TTS voice narration.
     - Interactive controls: Play, Pause, Scrub Bar, Replay, Fullscreen, Mute.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za
   ============================================================ */
'use strict';

const MMVideo = (() => {
  let ac = null;
  let animRaf = 0;
  let isPlaying = false;
  let isMuted = false;
  let currentMs = 0;
  let totalDurationMs = 32000; // 32s walkthrough video
  let activeCanvas = null, activeCtx = null;
  let currentSegment = null;

  const pick = arr => (arr && arr.length ? arr[Math.floor(Math.random() * arr.length)] : null);
  const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ── Audio Chords & Ambient Soundscape ──────────────────── */
  function audio() {
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return null;
    if (!ac) ac = new AC();
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }

  function playChord(freqs, dur = 3.5, vol = 0.05) {
    if (isMuted) return;
    const a = audio(); if (!a) return;
    try {
      freqs.forEach(f => {
        const o = a.createOscillator(), gn = a.createGain();
        o.type = 'sine'; o.frequency.value = f;
        gn.gain.setValueAtTime(0.001, a.currentTime);
        gn.gain.linearRampToValueAtTime(vol, a.currentTime + 0.8);
        gn.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
        o.connect(gn); gn.connect(a.destination);
        o.start(); o.stop(a.currentTime + dur + 0.1);
      });
    } catch { /* ignore */ }
  }

  /* ── Segment Video Scripts & Metadata ────────────────────── */
  function getSegmentScript(key, opts = {}) {
    if (typeof key === 'number' || (opts.actId != null)) {
      const id = typeof key === 'number' ? key : opts.actId;
      const act = MM.ACTIVITIES.find(x => x.id === id) || MM.ACTIVITIES[0];
      const optIdx = opts.option != null ? opts.option : 0;
      const kind = MM.ART_OPTION_KINDS[optIdx] || MM.ART_OPTION_KINDS[0];

      return {
        title: `Activity ${act.id}: ${act.name}`,
        subtitle: `Option ${optIdx + 1} — ${kind.emoji} ${kind.name}`,
        about: act.about,
        steps: act.startHere.map(([b, t]) => `${b} ${t}`),
        materials: act.materials.join(' · '),
        proverb: pick(MM.SPARKS)?.text || 'However long the night, the dawn will break.',
        themeColor: MM.ACT_COLORS[(act.id - 1) % MM.ACT_COLORS.length][0],
        accentColor: MM.ACT_COLORS[(act.id - 1) % MM.ACT_COLORS.length][1],
        narrations: [
          `Welcome to Activity ${act.id}: ${act.name}. Take a gentle breath. This is your safe creative space.`,
          `This week, you chose ${kind.name}. Express yourself freely with colours, words, shapes, or sounds.`,
          `Suggested materials include ${act.materials.slice(0, 2).join(' and ')}. Remember, there are no mistakes here.`,
          `When you are ready, save your creation. Your voice and resilience shine brightly today.`,
        ],
      };
    }

    if (key === 'pre') {
      return {
        title: 'Pre-Survey Guide',
        subtitle: 'Mental Health, Lifestyle & Wellbeing Check-in',
        about: 'A confidential initial check-in to understand where you are starting from.',
        steps: ['Complete 3 short sections', 'Answer honestly at your own pace', 'Unlocks your 8-week journey'],
        materials: 'Your smartphone · Private quiet space',
        proverb: 'Every journey begins with a single honest step.',
        themeColor: '#8a2eae',
        accentColor: '#3366ff',
        narrations: [
          'Welcome to the Pre-Survey. This check-in helps us understand your wellbeing and journey.',
          'Your answers are private, confidential, and safe. There are no right or wrong responses.',
          'Take your time with each question. Once completed, your 8-week creative path unlocks.',
        ],
      };
    }

    if (key === 'post') {
      return {
        title: 'Post-Survey Guide',
        subtitle: 'Celebrating Your Growth & Experience',
        about: 'Reflect on how far you have come over the 8 weeks of creative resilience.',
        steps: ['Reflect on your 8-week journey', 'Share your feedback and app experience', 'Receive completion recognition'],
        materials: 'Your reflections and experience',
        proverb: 'Look back with gratitude; look forward with hope.',
        themeColor: '#00a651',
        accentColor: '#ffd700',
        narrations: [
          'Welcome to your final check-in! Look back on the 8 weeks of art, stories, and growth.',
          'Your reflections help improve care for youth across South Africa.',
          'Thank you for sharing your strength, courage, and creativity with us.',
        ],
      };
    }

    return {
      title: 'Creative Resilience Walkthrough',
      subtitle: 'Mindful Art & Self-Expression',
      about: 'A safe, gentle space to express yourself and nurture resilience.',
      steps: ['Breathe in deeply', 'Choose your creative medium', 'Reflect on what you create'],
      materials: 'Your phone, paper, voice or natural materials',
      proverb: 'Creativity is the voice of the heart.',
      themeColor: '#f3256b',
      accentColor: '#ffbe0b',
      narrations: [
        'Welcome to Creative Resilience. A mindful pause in your day.',
        'Explore drawing, writing, speaking, and games designed for your wellbeing.',
      ],
    };
  }

  /* ── Talking Narrator Avatar with Real Lip Movements & Visemes ── */
  function drawNarratorAvatar(ctx, x, y, scale, ts, isSpeaking) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Gentle floating bob
    const bob = Math.sin(ts / 500) * 3;
    ctx.translate(0, bob);

    // Glowing Aura
    const auraGrad = ctx.createRadialGradient(0, 0, 16, 0, 0, 54);
    auraGrad.addColorStop(0, 'rgba(255, 209, 102, 0.4)');
    auraGrad.addColorStop(0.6, 'rgba(243, 37, 107, 0.2)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 54, 0, Math.PI * 2);
    ctx.fill();

    // Beaded Headwrap / Crown (Back Layer)
    ctx.fillStyle = '#6d28a8';
    ctx.beginPath();
    ctx.arc(0, -6, 32, Math.PI, Math.PI * 2);
    ctx.fill();

    // Face / Head
    const skinGrad = ctx.createLinearGradient(0, -30, 0, 30);
    skinGrad.addColorStop(0, '#a86532');
    skinGrad.addColorStop(1, '#8b4d1f');
    ctx.fillStyle = skinGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cheeks Soft Radiant Glow
    ctx.fillStyle = 'rgba(243, 37, 107, 0.28)';
    ctx.beginPath();
    ctx.arc(-14, 4, 7, 0, Math.PI * 2);
    ctx.arc(14, 4, 7, 0, Math.PI * 2);
    ctx.fill();

    // Beaded Pattern Across Headwrap (Front Band)
    const beadColors = ['#00a651', '#f58220', '#ffd700', '#f3256b', '#3366ff'];
    for (let b = -5; b <= 5; b++) {
      const bx = b * 5;
      const by = -24 + Math.sin(b * 0.4) * 3;
      ctx.fillStyle = beadColors[Math.abs(b) % beadColors.length];
      ctx.beginPath();
      ctx.arc(bx, by, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eyes with Natural Blinking
    const blinkCycle = ts % 3600;
    const isBlinking = blinkCycle < 140;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#2b103e';
    ctx.lineWidth = 1.6;

    if (isBlinking) {
      // Closed smiling eye lines
      ctx.beginPath();
      ctx.arc(-10, -3, 5, 0.1, Math.PI - 0.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(10, -3, 5, 0.1, Math.PI - 0.1);
      ctx.stroke();
    } else {
      // Open warm eyes
      ctx.beginPath();
      ctx.ellipse(-10, -4, 5, 4, 0, 0, Math.PI * 2);
      ctx.ellipse(10, -4, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Irises & Eye Sparkle
      ctx.fillStyle = '#3a1f10';
      ctx.beginPath();
      ctx.arc(-10, -4, 2.6, 0, Math.PI * 2);
      ctx.arc(10, -4, 2.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-11, -5.5, 1.2, 0, Math.PI * 2);
      ctx.arc(9, -5.5, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eyebrows
    ctx.strokeStyle = '#42210b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(-10, -11, 7, 0.9 * Math.PI, 1.8 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(10, -11, 7, 1.2 * Math.PI, 2.1 * Math.PI);
    ctx.stroke();

    // Cute Nose
    ctx.strokeStyle = 'rgba(74, 33, 10, 0.6)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 4, 2.5, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // ── REAL ANIMATED LIPS & SPEECH VISEMES ──
    let speechOpen = 0;
    if (isSpeaking) {
      const syl1 = Math.sin(ts / 90) * 0.5 + 0.5;
      const syl2 = Math.cos(ts / 210) * 0.3;
      const syl3 = Math.sin(ts / 55) * 0.2;
      speechOpen = Math.min(1, Math.max(0, syl1 + syl2 + syl3));
    }

    const mouthCenterY = 15;
    const mouthW = 14 + speechOpen * 6;
    const mouthOpenH = speechOpen * 8;

    if (speechOpen > 0.15) {
      // Open mouth interior
      ctx.fillStyle = '#5c1020';
      ctx.beginPath();
      ctx.ellipse(0, mouthCenterY, mouthW / 2, mouthOpenH / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Top teeth line
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.rect(-mouthW / 3, mouthCenterY - mouthOpenH / 2, (mouthW * 2) / 3, mouthOpenH * 0.35);
      ctx.fill();

      // Tongue
      ctx.fillStyle = '#d85a6a';
      ctx.beginPath();
      ctx.ellipse(0, mouthCenterY + mouthOpenH * 0.25, mouthW * 0.3, mouthOpenH * 0.25, 0, 0, Math.PI);
      ctx.fill();
    }

    // Upper Lip (Cupid's Bow)
    ctx.fillStyle = '#b33951';
    ctx.beginPath();
    ctx.moveTo(-mouthW / 2, mouthCenterY);
    ctx.quadraticCurveTo(-mouthW / 4, mouthCenterY - 2.5 - speechOpen * 1.5, 0, mouthCenterY - 1.5 - speechOpen * 1.2);
    ctx.quadraticCurveTo(mouthW / 4, mouthCenterY - 2.5 - speechOpen * 1.5, mouthW / 2, mouthCenterY);
    ctx.quadraticCurveTo(0, mouthCenterY - speechOpen * 0.8, -mouthW / 2, mouthCenterY);
    ctx.fill();

    // Lower Lip (Full Curve)
    ctx.fillStyle = '#c9425d';
    ctx.beginPath();
    ctx.moveTo(-mouthW / 2, mouthCenterY);
    ctx.quadraticCurveTo(0, mouthCenterY + 3 + mouthOpenH / 2, mouthW / 2, mouthCenterY);
    ctx.quadraticCurveTo(0, mouthCenterY + mouthOpenH * 0.4, -mouthW / 2, mouthCenterY);
    ctx.fill();

    // Lip highlight gloss
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, mouthCenterY + 2 + mouthOpenH * 0.35, mouthW * 0.25, 1, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /* ── Themed Motion Canvas Video Renderer ─────────────────── */
  function renderFrame(ts, script) {
    if (!activeCtx || !activeCanvas) return;
    const ctx = activeCtx;
    const W = activeCanvas.width, H = activeCanvas.height;
    const progress = Math.min(1, currentMs / totalDurationMs);

    ctx.clearRect(0, 0, W, H);

    // Dynamic Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#120824');
    bgGrad.addColorStop(0.5, '#200e3b');
    bgGrad.addColorStop(1, '#0b0416');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Floating Ambient Light Orbs
    for (let i = 0; i < 6; i++) {
      const ox = (W * 0.2 + (i * W * 0.16) + Math.sin(ts / 1200 + i) * 30) % W;
      const oy = (H * 0.3 + Math.cos(ts / 1400 + i * 2) * 40) % H;
      const rad = 60 + Math.sin(ts / 800 + i) * 20;
      const orbGrad = ctx.createRadialGradient(ox, oy, 2, ox, oy, rad);
      orbGrad.addColorStop(0, i % 2 === 0 ? 'rgba(255,215,0,0.18)' : 'rgba(243,37,107,0.15)');
      orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath(); ctx.arc(ox, oy, rad, 0, Math.PI * 2); ctx.fill();
    }

    // ── Chapter Switching ──
    const chapterTime = totalDurationMs / 4;
    const chapterIndex = Math.min(3, Math.floor(currentMs / chapterTime));
    const chProg = (currentMs % chapterTime) / chapterTime;

    // Trigger Audio Chords at chapter boundaries
    if (Math.abs(chProg - 0.02) < 0.015 && isPlaying) {
      if (chapterIndex === 0) playChord([261.63, 329.63, 392.0], 4);
      else if (chapterIndex === 1) playChord([293.66, 369.99, 440.0], 4);
      else if (chapterIndex === 2) playChord([329.63, 392.0, 493.88], 4);
      else if (chapterIndex === 3) playChord([392.0, 493.88, 587.33, 783.99], 5);
    }

    // Draw Talking Narrator Avatar in the scene
    const isSpeaking = isPlaying && !isMuted;
    drawNarratorAvatar(ctx, W * 0.85, H * 0.28, 0.85, ts, isSpeaking);

    if (chapterIndex === 0) {
      // ── CHAPTER 1: Intro & Mindful Grounding ──
      const pulse = Math.sin(ts / 400) * 10;
      ctx.strokeStyle = script.themeColor || '#8a2eae';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(W * 0.44, H * 0.38, 50 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 22px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(script.title, W * 0.44, H * 0.65);

      ctx.fillStyle = '#ffd166';
      ctx.font = '600 14px Poppins, sans-serif';
      ctx.fillText(script.subtitle, W * 0.44, H * 0.74);

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '400 12.5px Poppins, sans-serif';
      ctx.fillText('Take a deep breath · Your creative journey begins', W * 0.44, H * 0.82);

    } else if (chapterIndex === 1) {
      // ── CHAPTER 2: Creative Technique Demonstration ──
      ctx.fillStyle = '#ffd700';
      ctx.font = '700 18px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ Creative Inspiration & Technique', W * 0.44, H * 0.22);

      // Animated dynamic brushstrokes forming artwork
      const strokeCount = Math.min(6, Math.floor(chProg * 8));
      for (let s = 0; s < strokeCount; s++) {
        const sx = W * 0.20 + (s * W * 0.09);
        const sy = H * 0.48 + Math.sin(s * 1.5 + ts / 600) * 26;
        ctx.strokeStyle = s % 2 === 0 ? script.themeColor : script.accentColor;
        ctx.lineWidth = 12 - s * 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 34, sy - 22);
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '500 13.5px Poppins, sans-serif';
      ctx.fillText(script.about, W * 0.44, H * 0.74);

    } else if (chapterIndex === 2) {
      // ── CHAPTER 3: Step-by-Step Guidance ──
      ctx.fillStyle = '#6ec1ff';
      ctx.font = '700 18px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📋 Simple Steps to Follow', W * 0.44, H * 0.20);

      const step1 = script.steps[0] || '1. Pick what resonates most with you.';
      const step2 = script.steps[1] || '2. Draw, write, or record freely.';
      const step3 = script.steps[2] || '3. Reflect on your creation in the app.';

      ctx.fillStyle = '#ffffff';
      ctx.font = '500 13px Poppins, sans-serif';
      ctx.fillText(step1, W * 0.44, H * 0.40);
      ctx.fillText(step2, W * 0.44, H * 0.54);
      ctx.fillText(step3, W * 0.44, H * 0.68);

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '400 11.5px Poppins, sans-serif';
      ctx.fillText(`Materials: ${script.materials}`, W * 0.44, H * 0.82);

    } else {
      // ── CHAPTER 4: African Wisdom Proverb & Encouragement ──
      ctx.fillStyle = '#ffd700';
      ctx.font = '700 24px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌟', W * 0.44, H * 0.26);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic 600 15px Poppins, sans-serif';
      ctx.fillText(`“${script.proverb}”`, W * 0.44, H * 0.48);

      ctx.fillStyle = '#ffd166';
      ctx.font = '700 14px Poppins, sans-serif';
      ctx.fillText('You are ready to create! 🌱✨', W * 0.44, H * 0.68);

      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = '400 12px Poppins, sans-serif';
      ctx.fillText('Tap "Start Creating" below to draw on screen or upload a photo.', W * 0.44, H * 0.78);
    }

    // Top Header Badge
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath();
    ctx.roundRect(14, 14, 150, 24, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 11px Poppins, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🎬 PART ${chapterIndex + 1}/4`, 26, 30);

    // Bottom Video Progress Bar
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(0, H - 6, W, 6);
    ctx.fillStyle = script.accentColor || '#ffd700';
    ctx.fillRect(0, H - 6, W * progress, 6);
  }

  /* ── Open Video Modal with Maximize/Minimize Controls ─────── */
  function playVideoModal(key, opts = {}) {
    const script = getSegmentScript(key, opts);
    currentSegment = script;
    currentMs = 0;
    isPlaying = true;
    isMuted = false;

    // Remove any existing floating widget
    removeFloatingWidget();

    // Speak initial narration via Piper Voice if supported
    if (MMVoice.supported()) {
      MMVoice.speak(script.narrations[0], { persona: 'warmth', force: true });
    }

    const m = modal(`
      <div class="video-modal-wrap">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span style="font-weight:800;font-size:14.5px;color:#ffffff;text-align:left">${esc(script.title)}</span>
          <span style="font-size:12px;font-weight:700;color:#ffd166">🎬 Walkthrough Video</span>
        </div>
        
        <div class="video-stage-frame" id="vid-stage-frame">
          <div class="video-top-tools">
            <button class="btn-vid-top" id="vid-minimize-btn" title="Minimize to Corner Picture-in-Picture">🗕</button>
            <button class="btn-vid-top" id="vid-fullscreen-btn" title="Toggle Fullscreen">⛶</button>
          </div>
          <canvas id="motion-video-canvas" width="640" height="360" style="width:100%;height:100%;display:block"></canvas>
          <div class="video-overlay-controls" style="position:absolute;bottom:0;left:0;right:0;padding:10px 14px;background:linear-gradient(0deg,rgba(0,0,0,0.88),transparent);display:flex;align-items:center;gap:10px">
            <button class="btn-vid-ctrl" id="vid-play-btn" style="background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer">⏸</button>
            <div style="flex:1;height:5px;background:rgba(255,255,255,0.3);border-radius:3px;overflow:hidden;cursor:pointer" id="vid-scrub">
              <div id="vid-progress-fill" style="width:0%;height:100%;background:#ffd700;transition:width 0.1s"></div>
            </div>
            <button class="btn-vid-ctrl" id="vid-mute-btn" style="background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer">🔔</button>
            <button class="btn-vid-ctrl" id="vid-replay-btn" style="background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer" title="Replay">↺</button>
          </div>
        </div>

        <p style="font-size:12.5px;color:rgba(255,255,255,0.85);margin:10px 0 14px;line-height:1.5">
          ${esc(script.subtitle)} · Interactive narrated video with Moja Guide
        </p>

        <div class="modal-btns">
          <button class="btn btn-primary" id="vid-start-btn">Start Activity 🎨</button>
          <button class="btn btn-ghost" onclick="closeModal()">Close Video</button>
        </div>
      </div>
    `);

    activeCanvas = m.querySelector('#motion-video-canvas');
    if (activeCanvas) activeCtx = activeCanvas.getContext('2d');

    const playBtn = m.querySelector('#vid-play-btn');
    const muteBtn = m.querySelector('#vid-mute-btn');
    const replayBtn = m.querySelector('#vid-replay-btn');
    const startBtn = m.querySelector('#vid-start-btn');
    const scrub = m.querySelector('#vid-scrub');
    const fill = m.querySelector('#vid-progress-fill');
    const minBtn = m.querySelector('#vid-minimize-btn');
    const fsBtn = m.querySelector('#vid-fullscreen-btn');
    const stageFrame = m.querySelector('#vid-stage-frame');

    playBtn?.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.textContent = isPlaying ? '⏸' : '▶';
    });

    muteBtn?.addEventListener('click', () => {
      isMuted = !isMuted;
      muteBtn.textContent = isMuted ? '🔕' : '🔔';
    });

    replayBtn?.addEventListener('click', () => {
      currentMs = 0;
      isPlaying = true;
      if (playBtn) playBtn.textContent = '⏸';
      if (MMVoice.supported()) MMVoice.speak(script.narrations[0], { persona: 'warmth', force: true });
    });

    scrub?.addEventListener('click', e => {
      const r = scrub.getBoundingClientRect();
      const pos = (e.clientX - r.left) / r.width;
      currentMs = Math.floor(pos * totalDurationMs);
    });

    minBtn?.addEventListener('click', () => {
      closeModal();
      showFloatingWidget(key, opts);
    });

    fsBtn?.addEventListener('click', () => {
      if (stageFrame) {
        if (!document.fullscreenElement) stageFrame.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    });

    startBtn?.addEventListener('click', () => {
      stopVideo();
      closeModal();
      opts.onStart && opts.onStart();
    });

    let lastTs = performance.now();
    function loop(ts) {
      const dt = ts - lastTs;
      lastTs = ts;
      if (isPlaying) {
        currentMs += dt;
        if (currentMs >= totalDurationMs) {
          currentMs = totalDurationMs;
          isPlaying = false;
          if (playBtn) playBtn.textContent = '▶';
        }
      }
      if (fill) fill.style.width = `${(currentMs / totalDurationMs) * 100}%`;
      renderFrame(ts, script);
      if (activeCanvas) animRaf = requestAnimationFrame(loop);
    }
    animRaf = requestAnimationFrame(loop);
  }

  /* ── Floating Mini Player (Picture-in-Picture) ───────────── */
  function showFloatingWidget(key, opts = {}) {
    removeFloatingWidget();
    const script = currentSegment || getSegmentScript(key, opts);
    const wrap = document.createElement('div');
    wrap.className = 'video-floating-widget';
    wrap.id = 'floating-video-widget';
    wrap.innerHTML = `
      <div class="vfw-canvas-wrap">
        <canvas id="vfw-canvas" width="400" height="225"></canvas>
      </div>
      <div class="vfw-bar">
        <span class="vfw-title">${esc(script.title)}</span>
        <div class="vfw-btns">
          <button class="vfw-btn" id="vfw-play-btn">${isPlaying ? '⏸' : '▶'}</button>
          <button class="vfw-btn" id="vfw-max-btn" title="Maximize Video">🗖</button>
          <button class="vfw-btn" id="vfw-close-btn" title="Close">✕</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    activeCanvas = wrap.querySelector('#vfw-canvas');
    if (activeCanvas) activeCtx = activeCanvas.getContext('2d');

    wrap.querySelector('#vfw-play-btn')?.addEventListener('click', () => {
      isPlaying = !isPlaying;
      wrap.querySelector('#vfw-play-btn').textContent = isPlaying ? '⏸' : '▶';
    });

    wrap.querySelector('#vfw-max-btn')?.addEventListener('click', () => {
      removeFloatingWidget();
      playVideoModal(key, opts);
    });

    wrap.querySelector('#vfw-close-btn')?.addEventListener('click', () => {
      stopVideo();
      removeFloatingWidget();
    });

    let lastTs = performance.now();
    function floatLoop(ts) {
      const dt = ts - lastTs;
      lastTs = ts;
      if (isPlaying) {
        currentMs += dt;
        if (currentMs >= totalDurationMs) {
          currentMs = totalDurationMs;
          isPlaying = false;
          const pb = wrap.querySelector('#vfw-play-btn');
          if (pb) pb.textContent = '▶';
        }
      }
      renderFrame(ts, script);
      if (activeCanvas) animRaf = requestAnimationFrame(floatLoop);
    }
    animRaf = requestAnimationFrame(floatLoop);
  }

  function removeFloatingWidget() {
    const el = document.getElementById('floating-video-widget');
    if (el) el.remove();
  }

  function stopVideo() {
    cancelAnimationFrame(animRaf);
    activeCanvas = null;
    activeCtx = null;
    isPlaying = false;
    currentMs = 0;
    removeFloatingWidget();
  }

  return { playVideoModal, showFloatingWidget, stopVideo, getSegmentScript };
})();
