/* ============================================================
   MojaMind — High-Definition Cinematic Video Studio & Player 🎬✨
   Bespoke, gentle, long-form therapeutic video guides for
   Activities 1–8, Pre/Post Surveys, and Creative Resilience Studio.
   
   Aesthetic Principles:
   - Deep Ionity Obsidian Dark Aesthetic (#1A1A1A, #101016, #3366FF, #ffd166).
   - 60fps Handcrafted Procedural Motion Graphics per Activity.
   - 432Hz / Solfeggio Harmonic Synthesizer Soundscapes.
   - Synchronized gentle voice narration, chapter markers & live captions.
   - Seamless toggle between Cinematic Motion Studio & MP4 video clips.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.today · www.ionity.co.za
   ============================================================ */
'use strict';

const MMVideo = (() => {
  let ac = null;
  let animRaf = 0;
  let isPlaying = false;
  let isMuted = false;
  let currentMs = 0;
  const TOTAL_DURATION_MS = 50000; // 50 seconds (10s per chapter, 5 mindful stages)
  let activeCanvas = null, activeCtx = null;
  let currentSegment = null;
  let activeVideoEl = null;
  let lastSpokenChapter = -1;

  const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ── 432Hz Solfeggio Harmonic Synthesizer Engine ─────────────── */
  function audio() {
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return null;
    if (!ac) ac = new AC();
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }

  function playHarmonicChord(freqs, dur = 5.0, vol = 0.045) {
    if (isMuted) return;
    const a = audio(); if (!a) return;
    try {
      freqs.forEach((f, idx) => {
        const o = a.createOscillator();
        const gn = a.createGain();
        // Subtle stereo panning if supported
        const pan = a.createStereoPanner ? a.createStereoPanner() : null;
        if (pan) pan.pan.value = (idx % 2 === 0 ? -0.3 : 0.3);

        o.type = idx === 0 ? 'sine' : 'triangle';
        o.frequency.setValueAtTime(f, a.currentTime);
        // Micro pitch-drift for organic analog warmth
        o.frequency.linearRampToValueAtTime(f + (Math.random() * 0.4 - 0.2), a.currentTime + dur);

        gn.gain.setValueAtTime(0.0001, a.currentTime);
        gn.gain.linearRampToValueAtTime(vol * (1 / (idx + 1)), a.currentTime + 1.2);
        gn.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);

        if (pan) {
          o.connect(gn);
          gn.connect(pan);
          pan.connect(a.destination);
        } else {
          o.connect(gn);
          gn.connect(a.destination);
        }

        o.start();
        o.stop(a.currentTime + dur + 0.15);
      });
    } catch { /* ignore audio errors on locked devices */ }
  }

  /* ── Video Source Resolution (Local MP4 Clustered Storage) ──── */
  function getVideoSrc(actId, optIdx = 0) {
    if (actId >= 1 && actId <= 8) {
      const optNum = Math.max(1, Math.min(5, (optIdx || 0) + 1));
      return `./assets/videos/activity-${actId}/option-${optNum}.mp4`;
    }
    return null;
  }

  /* ── 5-Chapter Therapeutic Narrations & Scripts for Activities 1–8 ── */
  function getSegmentScript(key, opts = {}) {
    if (typeof key === 'number' || (opts.actId != null)) {
      const id = typeof key === 'number' ? key : opts.actId;
      const act = (typeof MM !== 'undefined' && MM.ACTIVITIES) ? (MM.ACTIVITIES.find(x => x.id === id) || MM.ACTIVITIES[0]) : { id: 1, name: 'Self-Portrait', about: 'Express who you are.' };
      const optIdx = opts.option != null ? opts.option : 0;
      const kinds = (typeof MM !== 'undefined' && MM.ART_OPTION_KINDS) ? MM.ART_OPTION_KINDS : [
        { key: 'physical', emoji: '🎨', name: 'Physical Artwork' },
        { key: 'digital_draw', emoji: '🖌️', name: 'Draw on Device' },
        { key: 'write', emoji: '✍️', name: 'Write It Out' },
        { key: 'voice', emoji: '🎙️', name: 'Speak Up' },
        { key: 'nature', emoji: '🌿', name: 'Use Nature' },
        { key: 'digital', emoji: '📱', name: 'Get Digital (Photo & Collage)' }
      ];
      const kind = kinds[optIdx] || kinds[0];

      const specificData = {
        1: {
          tagline: 'Reflecting Your Inner Strengths & True Self',
          sceneTitle: 'The Mirror of Self-Compassion',
          themeColor: '#3366FF',
          accentColor: '#ffd166',
          solfeggioChord: [528.0, 264.0, 396.0, 792.0], // 528Hz Transformation & Love
          narrations: [
            `Welcome to Self-Portrait. Take a slow, gentle breath. Relax your shoulders and settle into this peaceful space.`,
            `Gaze into the mirror of your heart with kindness. You are so much more than what the world sees on the surface.`,
            `You chose ${kind.name}. Use your chosen colors, words, sounds, or elements to reflect your unique journey and spirit.`,
            `There are no rules, no grades, and no mistakes in art. Every line and thought is an honest part of your resilience.`,
            `You are ready to create. Trust your inner voice, take your time, and enjoy expressing who you are today.`
          ]
        },
        2: {
          tagline: 'Cultivating Your Inner Sanctuary of Peace',
          sceneTitle: 'The Sanctuary of Tranquility',
          themeColor: '#3366FF',
          accentColor: '#00d2ff',
          solfeggioChord: [432.0, 216.0, 324.0, 648.0], // 432Hz Natural Harmony & Safety
          narrations: [
            `Welcome to My Safe Space. Inhale peace and calm… gently exhale any tension or worries from your day.`,
            `Visualize a sanctuary where you feel completely protected, warm, and deeply at peace—real or imaginary.`,
            `You chose ${kind.name}. Bring the sights, sounds, textures, and comfort of your haven into tangible form.`,
            `Remember, this safe space is not just on the screen—it is a refuge you carry within your mind at all times.`,
            `Step into your sanctuary now. Let your creativity flow freely and build your haven with love.`
          ]
        },
        3: {
          tagline: 'Honoring Your Roots, Ancestors & Mentors',
          sceneTitle: 'The Living Tree of Kinship',
          themeColor: '#8a2eae',
          accentColor: '#ffd166',
          solfeggioChord: [639.0, 319.5, 426.0, 852.0], // 639Hz Heart Connection & Kinship
          narrations: [
            `Welcome to Family & Kinship. Take a grounding breath and feel the strength of those who walked before you.`,
            `Like a mighty baobab tree with deep roots, your story is intertwined with mentors, loved ones, and ancestral courage.`,
            `You chose ${kind.name}. Honor the memories, wisdom, gratitude, and bonds that give you courage when times are hard.`,
            `Even in complex relationships, your roots remind you that you are connected, worthy, and never truly alone.`,
            `Begin your creation. Celebrate the branches of support that help you rise tall and strong.`
          ]
        },
        4: {
          tagline: 'The Power of Shared Connection & Ubuntu',
          sceneTitle: 'The Ubuntu Circle of Shared Light',
          themeColor: '#00a651',
          accentColor: '#ffd166',
          solfeggioChord: [639.0, 741.0, 370.5, 555.0], // 741Hz Intuitive Expression & Ubuntu
          narrations: [
            `Welcome to Community & Belonging. Umuntu ngumuntu ngabantu—a person is a person through other persons.`,
            `Feel the warmth of the Ubuntu circle around you. When one of us rises, our entire community grows stronger.`,
            `You chose ${kind.name}. Express the laughter, friendships, shared dreams, and communal strength that brighten your life.`,
            `Your voice and presence matter deeply to those around you. You are an essential part of the tapestry of life.`,
            `Create your tribute to connection. Let your artwork celebrate the unity that holds us all together.`
          ]
        },
        5: {
          tagline: 'Finding Light & Courage in Hard Times',
          sceneTitle: 'The Resilient Sprout & Stone',
          themeColor: '#00a651',
          accentColor: '#3366FF',
          solfeggioChord: [417.0, 208.5, 528.0, 625.5], // 417Hz Breaking Obstacles & Facilitating Change
          narrations: [
            `Welcome to Overcoming Obstacles. Place a hand over your heart and honor the courage that brought you here.`,
            `Even through solid rock, a tiny green sprout finds a way toward sunlight. Your spirit possesses that same unbreakable resilience.`,
            `You chose ${kind.name}. Express the challenges you have faced and the inner sunlight that guided you through the dark.`,
            `Every obstacle you have encountered has added depth, wisdom, and compassionate strength to your character.`,
            `Channel your courage into your artwork now. You are stronger than any storm you will ever meet.`
          ]
        },
        6: {
          tagline: 'Illuminating Your Pathway Forward',
          sceneTitle: 'The Starlit Horizon of Tomorrow',
          themeColor: '#3366FF',
          accentColor: '#ffd166',
          solfeggioChord: [852.0, 426.0, 639.0, 963.0], // 852Hz Clear Vision & Spiritual Intuition
          narrations: [
            `Welcome to Future Dreams. Look up toward the open twilight sky filled with endless possibilities and stars.`,
            `Allow yourself to dream without limits. What does your brightest, most fulfilling future look, sound, and feel like?`,
            `You chose ${kind.name}. Cast your hopes like glowing golden lanterns rising steadily and confidently into the night.`,
            `Your goals, aspirations, and visions are valid, powerful, and within reach. Walk forward with belief.`,
            `Begin your creation. Paint the horizon of your tomorrow with radiant optimism and courage.`
          ]
        },
        7: {
          tagline: 'Radiating Warmth, Kindness & Appreciation',
          sceneTitle: 'The Sacred Blooming Lotus of Thanks',
          themeColor: '#8a2eae',
          accentColor: '#ffd166',
          solfeggioChord: [528.0, 963.0, 432.0, 648.0], // 528Hz & 963Hz Deep Gratitude & High Frequency
          narrations: [
            `Welcome to Gratitude & Kindness. Take a deep, appreciative breath and notice the gift of this quiet moment.`,
            `Gratitude turns what little we have into abundance. Like a blooming lotus, appreciation opens our hearts to peace.`,
            `You chose ${kind.name}. Honor the small blessings, a warm smile, a friendly word, or a quiet victory from your week.`,
            `When you send kindness and thanks into the world, it ripples outward and returns to you in unexpected ways.`,
            `Express your gratitude now. Let your art radiate warmth, appreciation, and gentle light.`
          ]
        },
        8: {
          tagline: 'Honoring Your 8-Week Metamorphosis & Courage',
          sceneTitle: 'The Soaring Butterfly of Transformation',
          themeColor: '#00a651',
          accentColor: '#3366FF',
          solfeggioChord: [963.0, 528.0, 720.0, 432.0], // 963Hz Crown Fulfillment & Transformation
          narrations: [
            `Welcome to Transformation & Growth! Pause and look back at the incredible journey you have traveled over these 8 weeks.`,
            `Like a caterpillar emerging from its chrysalis into a magnificent butterfly, you have expanded your creative wings.`,
            `You chose ${kind.name}. Celebrate your growth, the emotions you processed, and the resilient strength you now carry.`,
            `This is not the end of your story—it is the beginning of a lifetime of creative courage, mindful peace, and self-belief.`,
            `Create your final masterpiece with pride. Soar freely, celebrate yourself, and keep shining brightly!`
          ]
        }
      }[act.id] || {
        tagline: 'Creative Resilience Journey',
        sceneTitle: 'Art & Mindfulness',
        themeColor: '#3366FF',
        accentColor: '#ffd166',
        solfeggioChord: [432.0, 528.0, 639.0],
        narrations: [
          `Welcome to Activity ${act.id}: ${act.name}. Take a slow, relaxing breath.`,
          `Explore the theme of this week with an open, curious heart.`,
          `You chose ${kind.name}. Create freely and in your own unique way.`,
          `There are no right or wrong answers—only your authentic voice.`,
          `You are ready. Enjoy the creative process and let your light shine.`
        ]
      };

      return {
        id: act.id,
        isActivity: true,
        optionIndex: optIdx,
        videoSrc: getVideoSrc(act.id, optIdx),
        title: `Activity ${act.id}: ${act.name}`,
        subtitle: `Option ${optIdx + 1} — ${kind.emoji} ${kind.name}`,
        tagline: specificData.tagline,
        sceneTitle: specificData.sceneTitle,
        themeColor: specificData.themeColor,
        accentColor: specificData.accentColor,
        solfeggioChord: specificData.solfeggioChord,
        narrations: specificData.narrations
      };
    }

    if (key === 'pre') {
      return {
        id: 'pre',
        isActivity: false,
        videoSrc: null,
        title: 'Pre-Survey Video Guide',
        subtitle: 'Mental Health, Lifestyle & Wellbeing Check-in',
        tagline: 'Your Confidential Starting Point',
        sceneTitle: 'The Compass of Self-Discovery',
        themeColor: '#3366FF',
        accentColor: '#ffd166',
        solfeggioChord: [432.0, 528.0, 396.0],
        narrations: [
          'Welcome to the MojaMind Pre-Survey. Take a deep, gentle breath and give yourself this quiet moment.',
          'This initial check-in helps us understand where you are starting from in your emotional wellbeing and lifestyle.',
          'Every answer is completely private, confidential, and safe with AES-256 encryption. There are no right or wrong answers.',
          'Take your time with each question. Once completed, your full 8-week creative resilience pathway unlocks.',
          'Thank you for your courage in taking this brave step for your mind and spirit. Let us begin.'
        ]
      };
    }

    if (key === 'post') {
      return {
        id: 'post',
        isActivity: false,
        videoSrc: null,
        title: 'Post-Survey Video Guide',
        subtitle: 'Celebrating Your 8-Week Transformation',
        tagline: 'Honoring Your Accomplishment & Insights',
        sceneTitle: 'The Horizon of Fulfillment',
        themeColor: '#00a651',
        accentColor: '#ffd166',
        solfeggioChord: [528.0, 963.0, 741.0],
        narrations: [
          'Welcome to your final Milestone Check-in! Look back with pride on the 8 weeks of art, stories, and growth.',
          'Your reflections help prove the power of creative resilience and improve youth care across South Africa.',
          'Reflect honestly on how your mood, coping skills, and self-expression have evolved through this journey.',
          'Your dedication to self-care is a victory worth celebrating today and in all the days to come.',
          'Thank you for sharing your strength, creativity, and courage with us. Let us complete your journey.'
        ]
      };
    }

    return {
      id: 'general',
      isActivity: false,
      videoSrc: null,
      title: 'Creative Resilience Studio Walkthrough',
      subtitle: 'Mindful Art, Voice & Self-Expression',
      tagline: 'A Safe Sanctuary to Express Yourself',
      sceneTitle: 'The Creative Spark & Infinite Canvas',
      themeColor: '#3366FF',
      accentColor: '#ffd166',
      solfeggioChord: [432.0, 528.0, 639.0],
      narrations: [
        'Welcome to the MojaMind Creative Studio—a safe sanctuary designed for your self-expression and mental peace.',
        'Over 8 weeks, explore engaging weekly themes crafted to nurture your resilience and inner strength.',
        'Draw on the digital pad, snap physical photos, record voice notes, or write poetry in whatever style feels authentic to you.',
        'Your creations are stored in your secure private vault with AI-powered supportive feedback and reflection tips.',
        'Breathe in calm, trust your creative spirit, and let your imagination unfold freely.'
      ]
    };
  }

  /* ── Bespoke 60fps Procedural Animation Engine per Activity ─── */

  // Universal Cosmic Background with Starfield
  function drawCosmicBackground(ctx, W, H, ts) {
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0a0a12');
    bgGrad.addColorStop(0.5, '#121220');
    bgGrad.addColorStop(1, '#08080e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Drifting star dust
    for (let i = 0; i < 32; i++) {
      const px = (W * 0.05 + (i * 47) + Math.sin(ts / 1200 + i * 1.5) * 15) % W;
      const py = (H * 0.05 + (i * 31) + Math.cos(ts / 1400 + i * 1.2) * 15) % H;
      const sz = 0.8 + (i % 3) * 0.7;
      const alpha = 0.3 + Math.sin(ts / 600 + i) * 0.25;
      ctx.fillStyle = i % 2 === 0 ? `rgba(51,102,255,${alpha})` : `rgba(255,209,102,${alpha * 0.9})`;
      ctx.beginPath();
      ctx.arc(px, py, sz, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Chapter 1 Universal Mindfulness Breathing Aura
  function drawBreathingAura(ctx, cx, cy, ts, color1, color2) {
    const breath = Math.sin(ts / 650); // ~4.1s breath cycle
    const radius = 54 + breath * 18;
    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, radius + 25);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, color1 || '#3366FF');
    grad.addColorStop(0.7, color2 || '#ffd166');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.save();
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 25, 0, Math.PI * 2);
    ctx.fill();

    // Concentric rippling breath rings
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `${color2 || '#ffd166'}88`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
    ctx.stroke();

    // Text guide
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 13px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(breath > 0 ? 'Breathe In Peace 🌿' : 'Breathe Out Tension ✨', cx, cy + radius + 32);
    ctx.restore();
  }

  // Activity 1: The Mirror of Self-Compassion
  function drawMirrorOfCompassion(ctx, cx, cy, ts) {
    ctx.save();
    ctx.translate(cx, cy - 10);
    const pulse = Math.sin(ts / 500) * 4;

    // Outer Oval Golden Mirror Frame
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.85)';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.ellipse(0, 0, 48 + pulse, 68 + pulse, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Inner Radiant Reflection Pool
    const mirrorGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 60);
    mirrorGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
    mirrorGrad.addColorStop(0.4, 'rgba(51, 102, 255, 0.45)');
    mirrorGrad.addColorStop(0.8, 'rgba(138, 46, 174, 0.3)');
    mirrorGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = mirrorGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 44 + pulse, 64 + pulse, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shimmering reflection aura petals
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3 + ts * 0.0008;
      const rx = Math.cos(ang) * 32;
      const ry = Math.sin(ang) * 42;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(0, 210, 255, 0.4)' : 'rgba(255, 209, 102, 0.45)';
      ctx.beginPath();
      ctx.arc(rx, ry, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Activity 2: The Sanctuary of Tranquility
  function drawSanctuaryDome(ctx, cx, cy, ts) {
    ctx.save();
    ctx.translate(cx, cy - 5);

    // Glowing Geodesic Protective Dome
    const domeGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 75);
    domeGrad.addColorStop(0, 'rgba(0, 210, 255, 0.25)');
    domeGrad.addColorStop(0.7, 'rgba(51, 102, 255, 0.45)');
    domeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = domeGrad;
    ctx.beginPath();
    ctx.arc(0, 10, 70, Math.PI, 0);
    ctx.fill();

    // Dome Arch Lines
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 10, 70, Math.PI, 0);
    ctx.stroke();

    for (let r = 50; r >= 20; r -= 15) {
      ctx.strokeStyle = 'rgba(51, 102, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 10, r, Math.PI, 0);
      ctx.stroke();
    }

    // Peaceful central hearth flame
    const flameH = 14 + Math.sin(ts / 200) * 4;
    ctx.fillStyle = '#ffd166';
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(0, 6, 8, flameH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Calming ocean waves below
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.6)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let x = -80; x <= 80; x += 10) {
      const y = 14 + Math.sin((x + ts * 0.05) / 14) * 4;
      if (x === -80) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Activity 3: The Living Tree of Kinship
  function drawKinshipTree(ctx, cx, cy, ts) {
    ctx.save();
    ctx.translate(cx, cy + 20);

    // Glowing Trunk
    ctx.strokeStyle = '#8a2eae';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(0, -25);
    ctx.stroke();

    // Fractal Branches with Glowing Kinship Nodes
    function branch(x, y, len, angle, depth) {
      if (depth === 0) {
        // Glowing leaf node
        ctx.fillStyle = '#ffd166';
        ctx.shadowColor = '#ffd166';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        return;
      }
      const sway = Math.sin(ts / 800 + depth) * 0.08;
      const x2 = x + Math.sin(angle + sway) * len;
      const y2 = y - Math.cos(angle + sway) * len;

      ctx.strokeStyle = depth === 2 ? 'rgba(138, 46, 174, 0.8)' : 'rgba(51, 102, 255, 0.8)';
      ctx.lineWidth = depth * 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      branch(x2, y2, len * 0.72, angle - 0.45, depth - 1);
      branch(x2, y2, len * 0.72, angle + 0.45, depth - 1);
    }

    branch(0, -25, 28, 0, 3);

    // Deep Root Network
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 15); ctx.lineTo(-24, 30);
    ctx.moveTo(0, 15); ctx.lineTo(24, 30);
    ctx.moveTo(0, 15); ctx.lineTo(0, 34);
    ctx.stroke();
    ctx.restore();
  }

  // Activity 4: The Ubuntu Circle of Shared Light
  function drawUbuntuCircle(ctx, cx, cy, ts) {
    ctx.save();
    ctx.translate(cx, cy - 10);
    const rot = ts * 0.001;

    // Interconnected Harmonious Rings
    for (let k = 0; k < 6; k++) {
      const ang = (k * Math.PI) / 3 + rot;
      const px = Math.cos(ang) * 36;
      const py = Math.sin(ang) * 36;

      ctx.strokeStyle = k % 2 === 0 ? 'rgba(0, 166, 81, 0.75)' : 'rgba(255, 209, 102, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 22, 0, Math.PI * 2);
      ctx.stroke();

      // Connecting constellation line to center
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(px, py);
      ctx.stroke();
    }

    // Central Ubuntu Heart Flame
    const heartPulse = Math.sin(ts / 300) * 3;
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 18 + heartPulse);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#00a651');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 18 + heartPulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Activity 5: The Resilient Sprout & Stone
  function drawResilientSprout(ctx, cx, cy, ts) {
    ctx.save();
    ctx.translate(cx, cy);

    // Bedrock Cleft
    ctx.fillStyle = '#222230';
    ctx.beginPath();
    ctx.moveTo(-60, 30);
    ctx.lineTo(-12, 10);
    ctx.lineTo(-18, 40);
    ctx.lineTo(-60, 40);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(60, 30);
    ctx.lineTo(12, 10);
    ctx.lineTo(18, 40);
    ctx.lineTo(60, 40);
    ctx.fill();

    // Emerging Bioluminescent Sprout
    const grow = Math.min(1, (ts % 8000) / 4000);
    const stemH = 22 + Math.sin(ts / 500) * 3;

    ctx.strokeStyle = '#00a651';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.quadraticCurveTo(Math.sin(ts / 600) * 6, 0, 0, -stemH);
    ctx.stroke();

    // Twin Unfurling Emerald Leaves
    ctx.fillStyle = '#00e676';
    ctx.shadowColor = '#00e676';
    ctx.shadowBlur = 12;

    ctx.save();
    ctx.translate(0, -stemH);
    ctx.beginPath();
    ctx.ellipse(-14, -4, 12, 6, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(14, -4, 12, 6, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.shadowBlur = 0;

    // Ascending Sunray
    const sunGrad = ctx.createLinearGradient(0, -60, 0, 20);
    sunGrad.addColorStop(0, 'rgba(255, 209, 102, 0.45)');
    sunGrad.addColorStop(1, 'rgba(255, 209, 102, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.moveTo(-28, -60);
    ctx.lineTo(28, -60);
    ctx.lineTo(8, 20);
    ctx.lineTo(-8, 20);
    ctx.fill();
    ctx.restore();
  }

  // Activity 6: The Starlit Horizon & Wishing Lanterns
  function drawStarlitLanterns(ctx, cx, cy, ts) {
    ctx.save();
    ctx.translate(cx, cy - 10);

    // Twilight Mountain Horizon
    ctx.fillStyle = '#141424';
    ctx.beginPath();
    ctx.moveTo(-90, 45);
    ctx.lineTo(-30, 15);
    ctx.lineTo(20, 32);
    ctx.lineTo(90, 10);
    ctx.lineTo(90, 50);
    ctx.lineTo(-90, 50);
    ctx.fill();

    // Shooting Star Trail
    const starProg = (ts % 3000) / 3000;
    const sx = -70 + starProg * 140;
    const sy = -55 + starProg * 40;
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx - 18, sy - 5);
    ctx.lineTo(sx, sy);
    ctx.stroke();

    // Rising Golden Wish Lanterns
    for (let i = 0; i < 4; i++) {
      const lProg = ((ts + i * 2200) % 7000) / 7000;
      const lx = (i - 1.5) * 32 + Math.sin(ts / 800 + i) * 6;
      const ly = 35 - lProg * 80;
      const lScale = 1 - lProg * 0.35;

      ctx.save();
      ctx.translate(lx, ly);
      ctx.scale(lScale, lScale);
      ctx.fillStyle = '#ffd166';
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.roundRect(-7, -10, 14, 18, 3);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // Activity 7: The Sacred Blooming Lotus of Gratitude
  function drawBloomingLotus(ctx, cx, cy, ts) {
    ctx.save();
    ctx.translate(cx, cy - 5);

    // Concentric Ripples of Kindness
    for (let r = 1; r <= 3; r++) {
      const ripProg = ((ts + r * 1400) % 4000) / 4000;
      ctx.strokeStyle = `rgba(255, 209, 102, ${0.6 * (1 - ripProg)})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(0, 24, ripProg * 75, ripProg * 24, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Blooming Multi-Layered Lotus Petals
    const bloom = 0.7 + Math.sin(ts / 600) * 0.15;
    const petalColors = ['#8a2eae', '#3366FF', '#ffd166'];

    for (let layer = 0; layer < 3; layer++) {
      const numPetals = 6 + layer * 2;
      ctx.fillStyle = petalColors[layer];
      ctx.globalAlpha = 0.55 + layer * 0.2;

      for (let p = 0; p < numPetals; p++) {
        const ang = (p * Math.PI * 2) / numPetals + (layer * 0.3);
        ctx.save();
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.ellipse(0, -22 * bloom - layer * 4, 7, 18 * bloom, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Glowing Lotus Core Pearl
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // Activity 8: The Soaring Butterfly of Transformation
  function drawTransformationButterfly(ctx, cx, cy, ts) {
    ctx.save();
    const ascend = Math.sin(ts / 900) * 12;
    ctx.translate(cx, cy - 10 + ascend);

    const flap = Math.abs(Math.sin(ts / 180)); // Rapid fluttering wing scale
    const wingGrad = ctx.createLinearGradient(-35, -30, 35, 30);
    wingGrad.addColorStop(0, '#00a651');
    wingGrad.addColorStop(0.5, '#3366FF');
    wingGrad.addColorStop(1, '#ffd166');

    // Left Wings
    ctx.save();
    ctx.scale(flap, 1);
    ctx.fillStyle = wingGrad;
    ctx.shadowColor = '#3366FF';
    ctx.shadowBlur = 14;

    // Forewing
    ctx.beginPath();
    ctx.ellipse(-26, -14, 22, 14, -0.4, 0, Math.PI * 2);
    ctx.fill();
    // Hindwing
    ctx.beginPath();
    ctx.ellipse(-18, 12, 14, 10, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Right Wings
    ctx.beginPath();
    ctx.ellipse(26, -14, 22, 14, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(18, 12, 14, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Central Butterfly Body & Antennae
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, 3, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -14); ctx.quadraticCurveTo(-6, -22, -10, -20);
    ctx.moveTo(0, -14); ctx.quadraticCurveTo(6, -22, 10, -20);
    ctx.stroke();

    // Ascending Shimmer Trail
    for (let t = 0; t < 5; t++) {
      const tx = Math.sin(ts / 200 + t) * 12;
      const ty = 24 + t * 9;
      ctx.fillStyle = `rgba(255, 209, 102, ${0.7 - t * 0.12})`;
      ctx.beginPath();
      ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Pre / Post Surveys Guide Animation
  function drawSurveyGuideDiscovery(ctx, cx, cy, ts, isPost) {
    ctx.save();
    ctx.translate(cx, cy - 10);
    const rot = ts * 0.0012;

    // Rotating Compass of Discovery
    ctx.strokeStyle = isPost ? 'rgba(0, 166, 81, 0.8)' : 'rgba(51, 102, 255, 0.8)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.rotate(rot);
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 1.5);
    ctx.stroke();
    ctx.restore();

    // Center Milestone Star / Diamond
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(14, 0);
    ctx.lineTo(0, 18);
    ctx.lineTo(-14, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // General Creative Studio Walkthrough
  function drawGeneralStudioCanvas(ctx, cx, cy, ts) {
    ctx.save();
    ctx.translate(cx, cy - 10);
    const rot = ts * 0.001;

    // Infinite Creative Spiral of Tools
    for (let i = 0; i < 5; i++) {
      const ang = (i * Math.PI * 2) / 5 + rot;
      const px = Math.cos(ang) * 44;
      const py = Math.sin(ang) * 44;

      const colors = ['#3366FF', '#f3256b', '#00a651', '#ffd166', '#8a2eae'];
      ctx.fillStyle = colors[i % colors.length];
      ctx.shadowColor = colors[i % colors.length];
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Central Glowing Palette Core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#101016';
    ctx.font = '700 14px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎨', 0, 1);
    ctx.restore();
  }

  /* ── Master Procedural Motion Graphic Frame Renderer ──────── */
  function renderMotionGraphicFrame(ts, script) {
    if (!activeCtx || !activeCanvas) return;
    const ctx = activeCtx;
    const W = activeCanvas.width, H = activeCanvas.height;
    const progress = Math.min(1, currentMs / TOTAL_DURATION_MS);

    ctx.clearRect(0, 0, W, H);

    // Deep Cosmic Stardust Backdrop
    drawCosmicBackground(ctx, W, H, ts);

    // 5 Structured Mindful Chapters (10s each, total 50s)
    const chapterTime = TOTAL_DURATION_MS / 5;
    const chapterIndex = Math.min(4, Math.floor(currentMs / chapterTime));
    const chProg = (currentMs % chapterTime) / chapterTime;

    // Play chapter soundscapes & trigger synchronized speech
    if (chapterIndex !== lastSpokenChapter && isPlaying) {
      lastSpokenChapter = chapterIndex;
      if (script.solfeggioChord) {
        const chord = script.solfeggioChord.map(f => f * (1 + chapterIndex * 0.05));
        playHarmonicChord(chord, 6.5);
      }
      if (!isMuted && typeof MMVoice !== 'undefined' && MMVoice.supported()) {
        const line = script.narrations[chapterIndex] || script.narrations[0];
        MMVoice.speak(line, { persona: 'warmth', rate: 0.92, force: true });
      }
    }

    const cx = W * 0.5, cy = H * 0.44;

    // Render Scene by Chapter
    if (chapterIndex === 0) {
      // Chapter 1: Centering & Breathwork
      drawBreathingAura(ctx, cx, cy, ts, script.themeColor, script.accentColor);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 18px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(script.title, cx, cy + 85);
      ctx.fillStyle = script.accentColor || '#ffd166';
      ctx.font = '600 12.5px Poppins, sans-serif';
      ctx.fillText(script.subtitle, cx, cy + 106);
    } else if (chapterIndex === 1 || chapterIndex === 2) {
      // Chapter 2 & 3: Bespoke Activity Theme Artwork & Modality
      if (script.id === 1) drawMirrorOfCompassion(ctx, cx, cy, ts);
      else if (script.id === 2) drawSanctuaryDome(ctx, cx, cy, ts);
      else if (script.id === 3) drawKinshipTree(ctx, cx, cy, ts);
      else if (script.id === 4) drawUbuntuCircle(ctx, cx, cy, ts);
      else if (script.id === 5) drawResilientSprout(ctx, cx, cy, ts);
      else if (script.id === 6) drawStarlitLanterns(ctx, cx, cy, ts);
      else if (script.id === 7) drawBloomingLotus(ctx, cx, cy, ts);
      else if (script.id === 8) drawTransformationButterfly(ctx, cx, cy, ts);
      else if (script.id === 'pre') drawSurveyGuideDiscovery(ctx, cx, cy, ts, false);
      else if (script.id === 'post') drawSurveyGuideDiscovery(ctx, cx, cy, ts, true);
      else drawGeneralStudioCanvas(ctx, cx, cy, ts);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 17px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(chapterIndex === 1 ? script.sceneTitle : script.subtitle, cx, cy + 78);
      ctx.fillStyle = script.accentColor || '#00d2ff';
      ctx.font = '600 12px Poppins, sans-serif';
      ctx.fillText(script.tagline, cx, cy + 98);
    } else if (chapterIndex === 3) {
      // Chapter 4: Emotional Freedom & Non-Judgment
      drawBreathingAura(ctx, cx, cy, ts, script.accentColor, script.themeColor);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 17px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Your Safe Canvas · No Mistakes ✨', cx, cy + 85);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '500 12px Poppins, sans-serif';
      ctx.fillText('Express your honest truth with freedom and courage', cx, cy + 106);
    } else {
      // Chapter 5: Ready to Create Climax
      ctx.fillStyle = '#ffd166';
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = 20;
      ctx.font = '700 34px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎨', cx, cy - 10);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 19px Poppins, sans-serif';
      ctx.fillText('You Are Ready to Create! ✨', cx, cy + 45);
      ctx.fillStyle = '#93c5fd';
      ctx.font = '500 12.5px Poppins, sans-serif';
      ctx.fillText('Tap "Start Creating" below to open your canvas.', cx, cy + 70);
    }

    // Top Header Badge
    const chapterNames = ['1. Ground & Center', '2. The Metaphor', '3. Creative Style', '4. Mindful Freedom', '5. Begin Journey'];
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    ctx.roundRect(14, 14, 160, 24, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(51,102,255,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(14, 14, 160, 24, 12);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 10.5px Poppins, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🎬 PART ${chapterIndex + 1}/5 · ${chapterNames[chapterIndex]}`, 22, 29);

    // Live Subtitles Caption Bar at Bottom
    const currentNarration = script.narrations[chapterIndex] || script.narrations[0];
    ctx.fillStyle = 'rgba(10, 10, 18, 0.92)';
    ctx.fillRect(0, H - 42, W, 36);
    ctx.strokeStyle = 'rgba(51,102,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H - 42);
    ctx.lineTo(W, H - 42);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 11.5px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentNarration, W / 2, H - 19);

    // Smooth Progress Bar
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(0, H - 5, W, 5);
    ctx.fillStyle = script.themeColor || '#3366FF';
    ctx.fillRect(0, H - 5, W * progress, 5);
  }

  /* ── Interactive Video Modal Player ────────────────────────── */
  function playVideoModal(key, opts = {}) {
    const script = getSegmentScript(key, opts);
    currentSegment = script;
    currentMs = 0;
    lastSpokenChapter = -1;
    isPlaying = true;
    isMuted = false;

    removeFloatingWidget();
    try { cancelAnimationFrame(animRaf); } catch (_) {}

    const hasRealVideo = !!script.videoSrc;
    // Video-first: when a real MP4 clip exists we play it FIRST, then auto-advance
    // into the 432Hz Motion Studio explanation when it ends. With no clip
    // (pre/post/general guides) we open straight into the Studio.
    let useMotionStudio = !hasRealVideo;

    const m = modal(`
      <div class="video-modal-wrap" style="color:#ffffff">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div>
            <span style="font-weight:800;font-size:15px;color:#ffffff;display:block;text-align:left">${esc(script.title)}</span>
            <small style="font-size:11.5px;color:rgba(255,255,255,0.7);text-align:left;display:block">${esc(script.subtitle)}</small>
          </div>
          <div style="display:flex;gap:6px;align-items:center">
            ${hasRealVideo ? `
              <button class="btn btn-ghost btn-xs" id="vid-mode-toggle" style="font-size:11px;border:1px solid rgba(51,102,255,0.6);padding:3px 8px;border-radius:6px">
                🔄 Switch to Studio
              </button>
            ` : ''}
            <span style="font-size:11px;font-weight:700;background:linear-gradient(135deg,#3366FF,#8a2eae);color:#fff;padding:3px 8px;border-radius:6px">
              ✨ 432Hz Studio
            </span>
          </div>
        </div>
        
        <div class="video-stage-frame" id="vid-stage-frame" style="position:relative;border-radius:18px;overflow:hidden;border:1.5px solid rgba(51,102,255,0.6);box-shadow:0 14px 40px rgba(0,0,0,0.7);background:#0c0c14">
          <div class="video-top-tools" style="position:absolute;top:10px;right:10px;display:flex;gap:6px;z-index:10">
            <button class="btn-vid-top" id="vid-fullscreen-btn" title="Toggle Fullscreen" style="background:rgba(0,0,0,0.65);border:1px solid rgba(255,255,255,0.25);color:#fff;border-radius:8px;padding:5px 9px;cursor:pointer">⛶</button>
          </div>

          <div id="vid-container" style="width:100%;height:auto;aspect-ratio:16/9;position:relative">
            <canvas id="motion-video-canvas" width="640" height="360" style="width:100%;height:auto;aspect-ratio:16/9;display:${hasRealVideo ? 'none' : 'block'}"></canvas>
            <video id="hd-video-player" src="${script.videoSrc || ''}" playsinline controls preload="${hasRealVideo ? 'auto' : 'none'}" style="width:100%;height:auto;aspect-ratio:16/9;display:${hasRealVideo ? 'block' : 'none'};background:#000"></video>
          </div>

          <div class="video-overlay-controls" style="position:absolute;bottom:0;left:0;right:0;padding:8px 14px;background:linear-gradient(0deg,rgba(0,0,0,0.92),transparent);display:flex;align-items:center;gap:10px;z-index:10">
            <button class="btn-vid-ctrl" id="vid-play-btn" style="background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer">⏸</button>
            
            <div style="flex:1;height:6px;background:rgba(255,255,255,0.25);border-radius:3px;overflow:hidden;cursor:pointer" id="vid-scrub">
              <div id="vid-progress-fill" style="width:0%;height:100%;background:linear-gradient(90deg, #3366FF, #ffd166);transition:width 0.1s"></div>
            </div>

            <button class="btn-vid-ctrl" id="vid-mute-btn" style="background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer" title="Toggle Sound">🔔</button>
            <button class="btn-vid-ctrl" id="vid-replay-btn" style="background:transparent;border:0;color:#fff;font-size:16px;cursor:pointer" title="Replay">↺</button>
          </div>
        </div>

        <!-- 5-Stage Chapter Markers for Easy Skipping -->
        <div style="display:flex;gap:4px;margin:10px 0 14px;justify-content:space-between">
          <button class="btn-ch-dot" data-ch="0" style="flex:1;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:10px;padding:4px 2px;border-radius:6px;cursor:pointer">1. Ground</button>
          <button class="btn-ch-dot" data-ch="1" style="flex:1;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:10px;padding:4px 2px;border-radius:6px;cursor:pointer">2. Metaphor</button>
          <button class="btn-ch-dot" data-ch="2" style="flex:1;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:10px;padding:4px 2px;border-radius:6px;cursor:pointer">3. Modality</button>
          <button class="btn-ch-dot" data-ch="3" style="flex:1;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:10px;padding:4px 2px;border-radius:6px;cursor:pointer">4. Freedom</button>
          <button class="btn-ch-dot" data-ch="4" style="flex:1;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:10px;padding:4px 2px;border-radius:6px;cursor:pointer">5. Create</button>
        </div>

        <div class="modal-btns" style="display:flex;gap:8px">
          <button class="btn btn-primary" id="vid-start-btn" style="flex:1;font-weight:800;background:linear-gradient(135deg,#3366FF,#254EDB);box-shadow:0 4px 16px rgba(51,102,255,0.4)">Start Creating 🎨</button>
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
    const modeToggle = m.querySelector('#vid-mode-toggle');

    // ── Video-first flow helpers ─────────────────────────────────
    // Show the animated 432Hz explanation studio (optionally restart it).
    function showStudio(restart = true) {
      useMotionStudio = true;
      if (activeCanvas) activeCanvas.style.display = 'block';
      if (activeVideoEl) { try { activeVideoEl.pause(); } catch (_) {} activeVideoEl.style.display = 'none'; }
      if (modeToggle) modeToggle.textContent = '🔄 Switch to Clip';
      if (restart) { currentMs = 0; lastSpokenChapter = -1; }
      isPlaying = true;
      if (playBtn) playBtn.textContent = '⏸';
    }
    // Show the real MP4 clip and play it from the start.
    function showClip() {
      useMotionStudio = false;
      if (typeof MMVoice !== 'undefined' && MMVoice.stop) { try { MMVoice.stop(); } catch (_) {} }
      if (activeCanvas) activeCanvas.style.display = 'none';
      if (activeVideoEl) {
        activeVideoEl.style.display = 'block';
        try { activeVideoEl.currentTime = 0; } catch (_) {}
        activeVideoEl.play().catch(() => {});
      }
      if (modeToggle) modeToggle.textContent = '🔄 Switch to Studio';
      isPlaying = false; // studio timeline is paused while the real clip plays
      if (playBtn) playBtn.textContent = '⏸';
    }

    modeToggle?.addEventListener('click', () => {
      if (useMotionStudio) showClip();
      else showStudio(true);
    });

    // When the real clip finishes, roll straight into the explanation studio.
    activeVideoEl?.addEventListener('ended', () => { if (!useMotionStudio) showStudio(true); });
    // If the clip cannot load or play, fall back to the studio explanation.
    activeVideoEl?.addEventListener('error', () => { if (!useMotionStudio) showStudio(true); });

    playBtn?.addEventListener('click', () => {
      // In clip mode the play button controls the real <video> element.
      if (!useMotionStudio && activeVideoEl) {
        if (activeVideoEl.paused) { activeVideoEl.play().catch(() => {}); playBtn.textContent = '⏸'; }
        else { activeVideoEl.pause(); playBtn.textContent = '▶'; }
        return;
      }
      isPlaying = !isPlaying;
      playBtn.textContent = isPlaying ? '⏸' : '▶';
      if (!isPlaying && typeof MMVoice !== 'undefined' && MMVoice.stop) MMVoice.stop();
    });

    muteBtn?.addEventListener('click', () => {
      isMuted = !isMuted;
      muteBtn.textContent = isMuted ? '🔕' : '🔔';
      if (isMuted && typeof MMVoice !== 'undefined' && MMVoice.stop) MMVoice.stop();
    });

    replayBtn?.addEventListener('click', () => {
      currentMs = 0;
      lastSpokenChapter = -1;
      isPlaying = true;
      if (playBtn) playBtn.textContent = '⏸';
    });

    scrub?.addEventListener('click', e => {
      const r = scrub.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      currentMs = Math.floor(pos * TOTAL_DURATION_MS);
      lastSpokenChapter = -1; // re-trigger voice for current chapter
    });

    m.querySelectorAll('.btn-ch-dot').forEach(btn => {
      btn.addEventListener('click', () => {
        const ch = parseInt(btn.dataset.ch, 10) || 0;
        if (!useMotionStudio) showStudio(false); // leave the clip, jump into the explanation
        currentMs = ch * (TOTAL_DURATION_MS / 5);
        lastSpokenChapter = -1;
        isPlaying = true;
        if (playBtn) playBtn.textContent = '⏸';
      });
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

    // Kick off the experience: real clip first (it auto-advances to the studio
    // when it ends). With no clip, the motion-studio timeline is already running.
    if (hasRealVideo && activeVideoEl) {
      try { activeVideoEl.currentTime = 0; } catch (_) {}
      activeVideoEl.play().catch(() => {});
      isPlaying = false; // studio timeline stays paused behind the clip
      if (playBtn) playBtn.textContent = '⏸';
    }

    if (activeCanvas) {
      // Budget phones: throttle frame-rate and shrink the backing buffer so the
      // motion studio can't overheat, freeze or crash the device. Each frame is
      // wrapped so a single bad draw can never take the whole app down, and the
      // loop self-terminates the moment the modal/canvas leaves the DOM.
      const lowPow = !!globalThis.MM_LOWPOWER;
      const frameInterval = lowPow ? 55 : 33; // ~18fps low-power / ~30fps otherwise
      if (lowPow) { try { activeCanvas.width = 400; activeCanvas.height = 225; } catch (_) {} }
      let lastTs = performance.now();
      let lastDraw = 0;
      function loop(ts) {
        if (!activeCanvas || !document.body.contains(activeCanvas)) { animRaf = 0; return; }
        const dt = ts - lastTs;
        lastTs = ts;
        if (isPlaying && useMotionStudio) {
          currentMs += dt;
          if (currentMs >= TOTAL_DURATION_MS) {
            currentMs = TOTAL_DURATION_MS;
            isPlaying = false;
            if (playBtn) playBtn.textContent = '▶';
          }
        }
        if (ts - lastDraw >= frameInterval) {
          lastDraw = ts;
          if (fill && useMotionStudio) fill.style.width = `${(currentMs / TOTAL_DURATION_MS) * 100}%`;
          if (useMotionStudio) { try { renderMotionGraphicFrame(ts, script); } catch (_) { /* skip bad frame, keep app alive */ } }
        }
        animRaf = requestAnimationFrame(loop);
      }
      animRaf = requestAnimationFrame(loop);
    }
  }

  /* ── Teardown & Stop ─────────────────────────────────────── */
  function stopVideo() {
    isPlaying = false;
    cancelAnimationFrame(animRaf);
    if (activeVideoEl) {
      try { activeVideoEl.pause(); } catch { /* noop */ }
      activeVideoEl = null;
    }
    if (typeof MMVoice !== 'undefined' && MMVoice.stop) {
      try { MMVoice.stop(); } catch { /* noop */ }
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
