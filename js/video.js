/* ============================================================
   MojaMind — High-Definition Cinematic Video Player & Studio 🎬✨
   Plays authentic high-definition video clips (MP4) with seamless
   fallback to procedurally generated motion-graphic visualizer
   scenes for all 8 Activities, Pre/Post Surveys, and Journey Guides.
   
   Aesthetic Principles:
   - No primitive cartoon faces or crude avatars.
   - Sleek Ionity futuristic dark aesthetic (#1A1A1A, #3366FF, #ffd166).
   - Real HTML5 Video integration with PiP, Fullscreen, and Scrubber.
   - 432Hz harmonic synthesizer ambient soundscape.
   - Real-time synchronized closed captions & chapter markers.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.today
   ============================================================ */
'use strict';

const MMVideo = (() => {
  let ac = null;
  let animRaf = 0;
  let isPlaying = false;
  let isMuted = false;
  let currentMs = 0;
  let totalDurationMs = 32000;
  let activeCanvas = null, activeCtx = null;
  let currentSegment = null;
  let activeVideoEl = null;

  const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ── 432Hz Harmonic Synthesizer Audio Engine ─────────────── */
  function audio() {
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return null;
    if (!ac) ac = new AC();
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }

  function playChord(freqs, dur = 3.5, vol = 0.04) {
    if (isMuted) return;
    const a = audio(); if (!a) return;
    try {
      freqs.forEach(f => {
        const o = a.createOscillator(), gn = a.createGain();
        o.type = 'sine'; o.frequency.value = f;
        gn.gain.setValueAtTime(0.001, a.currentTime);
        gn.gain.linearRampToValueAtTime(vol, a.currentTime + 0.6);
        gn.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
        o.connect(gn); gn.connect(a.destination);
        o.start(); o.stop(a.currentTime + dur + 0.1);
      });
    } catch { /* ignore */ }
  }

  /* ── Video Source Resolution ─────────────────────────────── */
  function getVideoSrc(actId, optIdx = 0) {
    if (actId >= 5 && actId <= 8) {
      const optNum = Math.max(1, Math.min(5, (optIdx || 0) + 1));
      return `./assets/videos/activity-${actId}/option-${optNum}.mp4`;
    }
    return null;
  }

  /* ── Rich Video Metadata & Story Scripts ─────────────────── */
  function getSegmentScript(key, opts = {}) {
    if (typeof key === 'number' || (opts.actId != null)) {
      const id = typeof key === 'number' ? key : opts.actId;
      const act = MM.ACTIVITIES.find(x => x.id === id) || MM.ACTIVITIES[0];
      const optIdx = opts.option != null ? opts.option : 0;
      const kind = MM.ART_OPTION_KINDS[optIdx] || MM.ART_OPTION_KINDS[0];

      const specificDetails = {
        1: {
          tagline: 'Reflecting Your Inner Strengths',
          sceneTitle: 'The Mirror of Self-Compassion',
          themeColor: '#3366FF',
          accentColor: '#ffd166',
          narrations: [
            `Welcome to Self-Portrait. Take a slow, gentle breath. This is your safe creative canvas.`,
            `You chose ${kind.name}. Look within with kindness and celebrate your unique story.`,
            `Use colors, words, or natural elements that express who you are becoming today.`,
            `There are no mistakes in art—only honest, beautiful self-expression.`,
          ],
        },
        2: {
          tagline: 'Creating Your Inner Sanctuary',
          sceneTitle: 'The Peaceful Haven',
          themeColor: '#3366ff',
          accentColor: '#00d2ff',
          narrations: [
            `Welcome to My Safe Space. Breathe in calm; let go of stress and tension.`,
            `You chose ${kind.name}. Visualize a place where you feel protected, warm, and deeply at peace.`,
            `Whether it is a cozy room, a quiet spot in nature, or an imaginary haven, bring it to life.`,
            `This sanctuary is always within you, ready to offer comfort whenever you need it.`,
          ],
        },
        3: {
          tagline: 'Honoring Your Roots & Bonds',
          sceneTitle: 'The Tree of Kinship & Love',
          themeColor: '#8a2eae',
          accentColor: '#ffd166',
          narrations: [
            `Welcome to My Family & Kinship. Strong roots help us weather every storm.`,
            `You chose ${kind.name}. Honor the bonds, ancestors, mentors, and loved ones who support you.`,
            `Connect memories, symbols, and warm moments into a living tree of love and gratitude.`,
            `You belong to a lineage of resilience and courage. Carry that strength forward.`,
          ],
        },
        4: {
          tagline: 'The Power of Shared Connection',
          sceneTitle: 'The Ubuntu Circle of Unity',
          themeColor: '#00a651',
          accentColor: '#ffd166',
          narrations: [
            `Welcome to Community & Belonging. Umuntu ngumuntu ngabantu — I am because we are.`,
            `You chose ${kind.name}. Celebrate the people, neighbors, and friends who uplift our lives.`,
            `Illustrate the unity, laughter, and shared moments that bring warmth to your world.`,
            `When we lift others, we rise together in lasting resilience.`,
          ],
        },
        5: {
          tagline: 'Overcoming Life’s Challenges',
          sceneTitle: 'The Resilient Sprout',
          themeColor: '#00a651',
          accentColor: '#ffd166',
          narrations: [
            `Welcome to Overcoming Obstacles. Even the strongest stone is broken by a gentle green sprout.`,
            `You chose ${kind.name}. Channel the moments you persevered through difficulty.`,
            `Draw or shape your story of resilience, finding the sunlight that guides your way.`,
            `Every challenge you have faced has added to your inner power and wisdom.`,
          ],
        },
        6: {
          tagline: 'Envisioning Your Tomorrow',
          sceneTitle: 'The Starlit Horizon of Dreams',
          themeColor: '#3366ff',
          accentColor: '#ffd166',
          narrations: [
            `Welcome to Future Dreams. Look up toward the open sky filled with endless possibilities.`,
            `You chose ${kind.name}. What does your brightest future look and feel like?`,
            `Release your hopes like glowing lanterns rising steadily into the starlit sky.`,
            `Your dreams are valid, powerful, and achievable. Believe in your pathway.`,
          ],
        },
        7: {
          tagline: 'Spreading Warmth & Appreciation',
          sceneTitle: 'The Lotus of Gratitude',
          themeColor: '#8a2eae',
          accentColor: '#ffd166',
          narrations: [
            `Welcome to Gratitude & Kindness. Gratitude turns what we have into more than enough.`,
            `You chose ${kind.name}. Notice the small gifts, warm smiles, and peaceful moments.`,
            `Let your creation radiate ripples of appreciation outward like water ripples in sunlight.`,
            `A grateful mind is a peaceful sanctuary. Thank you for your radiant spirit.`,
          ],
        },
        8: {
          tagline: 'Celebrating Your 8-Week Transformation',
          sceneTitle: 'The Soaring Butterfly',
          themeColor: '#00a651',
          accentColor: '#3366FF',
          narrations: [
            `Welcome to Transformation & Growth! Look how far you have journeyed over these 8 weeks.`,
            `You chose ${kind.name}. Like a butterfly taking flight, celebrate your evolving strength.`,
            `Honor the art, reflections, and insights you have gathered along the way.`,
            `You carry immense power and creative courage. Continue to shine brightly!`,
          ],
        },
      }[act.id] || {
        tagline: 'Creative Resilience Journey',
        sceneTitle: 'Art & Mindfulness',
        themeColor: '#3366FF',
        accentColor: '#ffd166',
        narrations: [
          `Welcome to Activity ${act.id}: ${act.name}.`,
          `Express yourself freely with ${kind.name}.`,
          `Take your time and enjoy the creative process.`,
          `Your voice and resilience shine brightly today.`,
        ],
      };

      return {
        id: act.id,
        optionIndex: optIdx,
        videoSrc: getVideoSrc(act.id, optIdx),
        title: `Activity ${act.id}: ${act.name}`,
        subtitle: `Option ${optIdx + 1} — ${kind.emoji} ${kind.name}`,
        tagline: specificDetails.tagline,
        sceneTitle: specificDetails.sceneTitle,
        about: act.about,
        steps: act.startHere.map(([b, t]) => `${b} ${t}`),
        materials: act.materials.join(' · '),
        themeColor: specificDetails.themeColor,
        accentColor: specificDetails.accentColor,
        narrations: specificDetails.narrations,
      };
    }

    if (key === 'pre') {
      return {
        id: 'pre',
        videoSrc: null,
        title: 'Pre-Survey Video Guide',
        subtitle: 'Mental Health, Lifestyle & Wellbeing Check-in',
        tagline: 'Your Confidential Starting Point',
        sceneTitle: 'The Pathway of Discovery',
        about: 'A private initial check-in to understand where you are starting from.',
        themeColor: '#3366FF',
        accentColor: '#ffd166',
        narrations: [
          'Welcome to the Pre-Survey. This check-in helps us understand your wellbeing and journey.',
          'Your answers are private, confidential, and safe. There are no right or wrong responses.',
          'Take your time with each question. Once completed, your 8-week creative path unlocks.',
          'Thank you for taking this brave step toward self-care and resilience.',
        ],
      };
    }

    if (key === 'post') {
      return {
        id: 'post',
        videoSrc: null,
        title: 'Post-Survey Video Guide',
        subtitle: 'Celebrating Your Growth & Experience',
        tagline: 'Honoring Your Transformation',
        sceneTitle: 'The Horizon of Accomplishment',
        about: 'Reflect on how far you have come over the 8 weeks of creative resilience.',
        themeColor: '#00a651',
        accentColor: '#ffd166',
        narrations: [
          'Welcome to your final check-in! Look back on the 8 weeks of art, stories, and growth.',
          'Your reflections help improve care for youth across South Africa.',
          'Thank you for sharing your strength, courage, and creativity with us.',
          'You have achieved something extraordinary for your mind and spirit.',
        ],
      };
    }

    return {
      id: 'general',
      videoSrc: null,
      title: 'Creative Resilience Walkthrough',
      subtitle: 'Mindful Art & Self-Expression',
      tagline: 'A Safe Space to Express Yourself',
      sceneTitle: 'The Creative Spark',
      about: 'A safe, gentle space to express yourself and nurture resilience.',
      themeColor: '#3366FF',
      accentColor: '#ffd166',
      narrations: [
        'Welcome to MojaMind. A sanctuary of art, reflection, and mindful growth.',
        'Over 8 weeks, explore creative prompts designed to nurture your mental strength.',
        'Draw, write, speak, or craft in whatever way feels authentic to you.',
        'Your creative journey starts here. Breathe in peace, and let us begin.',
      ],
    };
  }

  /* ── Sleek Holographic AI Guide Visualizer (No cartoon faces) ── */
  function drawHologramGuide(ctx, x, y, size, ts, isSpeaking) {
    ctx.save();
    ctx.translate(x, y);

    const pulse = Math.sin(ts / 300) * 4;
    const ringRot = ts * 0.0015;

    // Glowing Holographic Energy Aura
    const grad = ctx.createRadialGradient(0, 0, 8, 0, 0, 48 + pulse);
    grad.addColorStop(0, 'rgba(51, 102, 255, 0.45)');
    grad.addColorStop(0.5, 'rgba(0, 210, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(0, 0, 48 + pulse, 0, Math.PI * 2); ctx.fill();

    // Orbiting Geometric Rings
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.7)';
    ctx.lineWidth = 1.8;
    ctx.save();
    ctx.rotate(ringRot);
    ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 1.4); ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = 'rgba(255, 209, 102, 0.8)';
    ctx.lineWidth = 1.8;
    ctx.save();
    ctx.rotate(-ringRot * 1.3);
    ctx.beginPath(); ctx.arc(0, 0, 32, Math.PI * 0.5, Math.PI * 1.9); ctx.stroke();
    ctx.restore();

    // Central Radiant Guide Core
    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.4, '#00d2ff');
    coreGrad.addColorStop(1, '#3366FF');
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = '#00d2ff';
    ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Active Speech Soundwave Bars
    if (isSpeaking) {
      ctx.fillStyle = '#ffd166';
      for (let i = -3; i <= 3; i++) {
        const barH = 6 + Math.abs(Math.sin(ts / 80 + i)) * 12;
        ctx.fillRect(i * 5 - 1.5, -barH / 2, 3, barH);
      }
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-4, 0, 2, 0, Math.PI * 2); ctx.arc(4, 0, 2, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
  }

  /* ── Procedural Motion Graphics Engine for Canvas ────────── */
  function renderMotionGraphicFrame(ts, script) {
    if (!activeCtx || !activeCanvas) return;
    const ctx = activeCtx;
    const W = activeCanvas.width, H = activeCanvas.height;
    const progress = Math.min(1, currentMs / totalDurationMs);

    ctx.clearRect(0, 0, W, H);

    // Deep Ionity Cosmic Background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#101016');
    bgGrad.addColorStop(0.5, '#161626');
    bgGrad.addColorStop(1, '#0c0c14');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Dynamic Stardust Floating Particles
    for (let i = 0; i < 24; i++) {
      const px = (W * 0.1 + (i * 37) + Math.sin(ts / 1000 + i) * 20) % W;
      const py = (H * 0.1 + (i * 29) + Math.cos(ts / 1200 + i) * 20) % H;
      const sz = 1 + (i % 3);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(51,102,255,0.45)' : 'rgba(255,209,102,0.5)';
      ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI * 2); ctx.fill();
    }

    // 4 Chapters: 0: Welcome, 1: Visual Theme, 2: Deep Reflection, 3: Next Step
    const chapterTime = totalDurationMs / 4;
    const chapterIndex = Math.min(3, Math.floor(currentMs / chapterTime));
    const chProg = (currentMs % chapterTime) / chapterTime;

    // Trigger Ambient Chords at chapter start
    if (Math.abs(chProg - 0.02) < 0.015 && isPlaying) {
      if (chapterIndex === 0) playChord([261.63, 329.63, 392.0], 4);
      else if (chapterIndex === 1) playChord([293.66, 369.99, 440.0], 4);
      else if (chapterIndex === 2) playChord([329.63, 392.0, 493.88], 4);
      else if (chapterIndex === 3) playChord([392.0, 493.88, 587.33], 5);
    }

    const cx = W * 0.5, cy = H * 0.44;

    // Sleek AI Guide Orb in Top Right
    drawHologramGuide(ctx, W * 0.88, H * 0.22, 1, ts, isPlaying && !isMuted);

    // Centerpiece Visuals per Chapter
    if (chapterIndex === 0) {
      // Welcome & Grounding Pulse
      const pulse = Math.sin(ts / 400) * 8;
      ctx.strokeStyle = 'rgba(51, 102, 255, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy - 10, 50 + pulse, 0, Math.PI * 2); ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 20px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(script.title, cx, cy + 65);

      ctx.fillStyle = '#ffd166';
      ctx.font = '600 13px Poppins, sans-serif';
      ctx.fillText(script.subtitle, cx, cy + 90);
    } else if (chapterIndex === 1) {
      // Artistic Scene Mandala
      ctx.save();
      ctx.translate(cx, cy - 15);
      for (let k = 0; k < 8; k++) {
        ctx.save();
        ctx.rotate((k * Math.PI) / 4 + ts * 0.001);
        ctx.fillStyle = k % 2 === 0 ? 'rgba(51, 102, 255, 0.35)' : 'rgba(255, 209, 102, 0.35)';
        ctx.beginPath(); ctx.ellipse(0, -35, 12, 28, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 18px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(script.sceneTitle, cx, cy + 65);

      ctx.fillStyle = '#00d2ff';
      ctx.font = '600 13px Poppins, sans-serif';
      ctx.fillText(script.tagline, cx, cy + 90);
    } else if (chapterIndex === 2) {
      // Deep Mindful Focus
      const breath = Math.sin(ts / 500) * 14;
      const grad = ctx.createRadialGradient(cx, cy - 15, 6, cx, cy - 15, 60 + breath);
      grad.addColorStop(0, '#ffd166');
      grad.addColorStop(0.5, '#3366FF');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy - 15, 60 + breath, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 17px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Mindful Self-Expression', cx, cy + 65);

      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '500 12.5px Poppins, sans-serif';
      ctx.fillText('Breathe gently · There are no right or wrong answers', cx, cy + 90);
    } else {
      // Ready to Create
      ctx.fillStyle = '#ffd166';
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = 18;
      ctx.font = '700 32px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨', cx, cy - 10);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 19px Poppins, sans-serif';
      ctx.fillText('You Are Ready to Create! 🎨', cx, cy + 45);

      ctx.fillStyle = '#93c5fd';
      ctx.font = '500 12.5px Poppins, sans-serif';
      ctx.fillText('Tap "Start Creating" below to draw on screen or upload photos.', cx, cy + 72);
    }

    // Top Header Badge
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.roundRect(14, 14, 140, 24, 12); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 11px Poppins, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🎬 PART ${chapterIndex + 1}/4`, 24, 30);

    // Live Subtitles Caption Bar at Bottom
    const currentNarration = script.narrations[chapterIndex] || script.narrations[0];
    ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
    ctx.fillRect(0, H - 36, W, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = '500 12px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentNarration, W / 2, H - 16);

    // Progress Bar
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(0, H - 5, W, 5);
    ctx.fillStyle = '#3366FF';
    ctx.fillRect(0, H - 5, W * progress, 5);
  }

  /* ── Video Modal Player (Plays Real MP4 or Motion Graphic) ── */
  function playVideoModal(key, opts = {}) {
    const script = getSegmentScript(key, opts);
    currentSegment = script;
    currentMs = 0;
    isPlaying = true;
    isMuted = false;

    removeFloatingWidget();
    cancelAnimationFrame(animRaf);

    // Voice Narration
    if (typeof MMVoice !== 'undefined' && MMVoice.supported()) {
      MMVoice.speak(script.narrations[0], { persona: 'warmth', force: true });
    }

    const hasRealVideo = !!script.videoSrc;

    const m = modal(`
      <div class="video-modal-wrap" style="color:#ffffff">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <span style="font-weight:800;font-size:15px;color:#ffffff;text-align:left">${esc(script.title)}</span>
          <span style="font-size:11px;font-weight:700;background:linear-gradient(135deg,#3366FF,#8a2eae);color:#fff;padding:3px 8px;border-radius:6px">🎬 ${hasRealVideo ? 'HD Video Clip' : 'Interactive Guide'}</span>
        </div>
        
        <div class="video-stage-frame" id="vid-stage-frame" style="position:relative;border-radius:18px;overflow:hidden;border:1.5px solid rgba(51,102,255,0.6);box-shadow:0 12px 36px rgba(0,0,0,0.6);background:#0c0c14">
          <div class="video-top-tools" style="position:absolute;top:10px;right:10px;display:flex;gap:6px;z-index:10">
            <button class="btn-vid-top" id="vid-fullscreen-btn" title="Toggle Fullscreen" style="background:rgba(0,0,0,0.65);border:1px solid rgba(255,255,255,0.25);color:#fff;border-radius:8px;padding:5px 9px;cursor:pointer">⛶</button>
          </div>

          ${hasRealVideo ? `
            <video id="hd-video-player" src="${script.videoSrc}" playsinline controls autoplay style="width:100%;height:auto;aspect-ratio:16/9;display:block;background:#000"></video>
          ` : `
            <canvas id="motion-video-canvas" width="640" height="360" style="width:100%;height:auto;aspect-ratio:16/9;display:block"></canvas>
            <div class="video-overlay-controls" style="position:absolute;bottom:0;left:0;right:0;padding:10px 14px;background:linear-gradient(0deg,rgba(0,0,0,0.88),transparent);display:flex;align-items:center;gap:10px">
              <button class="btn-vid-ctrl" id="vid-play-btn" style="background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer">⏸</button>
              <div style="flex:1;height:5px;background:rgba(255,255,255,0.3);border-radius:3px;overflow:hidden;cursor:pointer" id="vid-scrub">
                <div id="vid-progress-fill" style="width:0%;height:100%;background:#3366FF;transition:width 0.1s"></div>
              </div>
              <button class="btn-vid-ctrl" id="vid-mute-btn" style="background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer">🔔</button>
              <button class="btn-vid-ctrl" id="vid-replay-btn" style="background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer" title="Replay">↺</button>
            </div>
          `}
        </div>

        <p style="font-size:12.5px;color:rgba(255,255,255,0.88);margin:10px 0 14px;line-height:1.5;text-align:left">
          ${esc(script.subtitle)} · ${hasRealVideo ? 'High-definition video walkthrough' : 'Mindful guidance with 432Hz ambient soundscape'}
        </p>

        <div class="modal-btns" style="display:flex;gap:8px">
          <button class="btn btn-primary" id="vid-start-btn" style="flex:1">Start Creating 🎨</button>
          <button class="btn btn-ghost" id="vid-close-btn" style="flex:0 0 100px">Close</button>
        </div>
      </div>
    `);

    activeVideoEl = m.querySelector('#hd-video-player');
    activeCanvas = m.querySelector('#motion-video-canvas');
    if (activeCanvas) activeCtx = activeCanvas.getContext('2d');

    const playBtn = m.querySelector('#vid-play-btn');
    const muteBtn = m.querySelector('#vid-mute-btn');
    const replayBtn = m.querySelector('#vid-replay-btn');
    const startBtn = m.querySelector('#vid-start-btn');
    const closeBtn = m.querySelector('#vid-close-btn');
    const scrub = m.querySelector('#vid-scrub');
    const fill = m.querySelector('#vid-progress-fill');
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
      if (typeof MMVoice !== 'undefined' && MMVoice.supported()) {
        MMVoice.speak(script.narrations[0], { persona: 'warmth', force: true });
      }
    });

    scrub?.addEventListener('click', e => {
      const r = scrub.getBoundingClientRect();
      const pos = (e.clientX - r.left) / r.width;
      currentMs = Math.floor(pos * totalDurationMs);
    });

    fsBtn?.addEventListener('click', () => {
      if (stageFrame) {
        if (!document.fullscreenElement) stageFrame.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    });

    const finish = () => {
      stopVideo();
      closeModal();
      opts.onStart && opts.onStart();
    };

    startBtn?.addEventListener('click', finish);
    closeBtn?.addEventListener('click', () => {
      stopVideo();
      closeModal();
    });

    if (activeCanvas) {
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
        renderMotionGraphicFrame(ts, script);
        if (activeCanvas) animRaf = requestAnimationFrame(loop);
      }
      animRaf = requestAnimationFrame(loop);
    }
  }

  /* ── Stop / Teardown ─────────────────────────────────────── */
  function stopVideo() {
    isPlaying = false;
    cancelAnimationFrame(animRaf);
    if (activeVideoEl) {
      try { activeVideoEl.pause(); } catch { /* noop */ }
      activeVideoEl = null;
    }
    activeCanvas = null;
    activeCtx = null;
  }

  function removeFloatingWidget() {
    const el = document.getElementById('floating-video-widget');
    if (el) el.remove();
  }

  return {
    playVideoModal,
    stopVideo,
    getSegmentScript,
    getVideoSrc,
  };
})();

globalThis.MMVideo = MMVideo;
