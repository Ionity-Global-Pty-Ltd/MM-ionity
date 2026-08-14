/* ============================================================
   MojaMind — Interactive Cinematic Video Studio & Player 🎬✨
   A breathtaking, handcrafted animated video clip engine for every
   study activity (Activities 1–8), Pre/Post Surveys, and Daily Spark.
   
   Features:
   - 8 Dedicated Handcrafted Animated Story Clips:
     • Act 1 (Self-Portrait): Canvas painting, color aura & mirror of soul.
     • Act 2 (My Safe Space): Cozy sanctuary, warm lantern, rain on window.
     • Act 3 (My Family): Sunset savanna, glowing roots of kinship & love.
     • Act 4 (Community): Ubuntu circle of unity, colorful shared village.
     • Act 5 (Resilience): Resilient sprout bursting through stone into sun.
     • Act 6 (Future Dreams): Starry galaxy with ascending paper lanterns.
     • Act 7 (Gratitude): Hand radiating glowing golden hearts & blooms.
     • Act 8 (Transformation): Radiant chrysalis to soaring butterfly.
   - 4-Chapter Cinematic Structure with live chapter skip controls.
   - Real-time animated talking facilitator avatar with speech visemes.
   - 432Hz harmonic pentatonic synth chords & soothing ambient soundscapes.
   - Closed captions (subtitles), interactive scrubber, PIP mini-widget.
   - High-visibility Ionity glassmorphism styling (#1A1A1A, #3366FF, #ffd166).
   
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
  let totalDurationMs = 32000; // 32s video walkthrough
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

  /* ── Segment Video Scripts & Rich Story Data ─────────────── */
  function getSegmentScript(key, opts = {}) {
    if (typeof key === 'number' || (opts.actId != null)) {
      const id = typeof key === 'number' ? key : opts.actId;
      const act = MM.ACTIVITIES.find(x => x.id === id) || MM.ACTIVITIES[0];
      const optIdx = opts.option != null ? opts.option : 0;
      const kind = MM.ART_OPTION_KINDS[optIdx] || MM.ART_OPTION_KINDS[0];

      const specificDetails = {
        1: {
          tagline: 'Reflecting Your True Colors',
          sceneTitle: 'The Mirror of Self-Kindness',
          themeColor: '#f3256b',
          accentColor: '#ffd166',
          narrations: [
            `Welcome to Self-Portrait. Take a slow, gentle breath. This is your safe creative canvas.`,
            `You chose ${kind.name}. Look into your inner world with kindness and see your vibrant strength.`,
            `Use colors, words, or natural elements that capture your unique energy today.`,
            `There are no mistakes in art—only honest, beautiful self-expression.`,
          ],
        },
        2: {
          tagline: 'Creating Your Inner Sanctuary',
          sceneTitle: 'The Peaceful Haven',
          themeColor: '#3366ff',
          accentColor: '#6ec1ff',
          narrations: [
            `Welcome to My Safe Space. Breathe in calm; let go of stress.`,
            `You chose ${kind.name}. Visualize a place where you feel protected, warm, and deeply at peace.`,
            `Whether it is a cozy room, a quiet spot in nature, or an imaginary haven, bring it to life.`,
            `This sanctuary is always within you, ready to offer comfort whenever you need it.`,
          ],
        },
        3: {
          tagline: 'Connecting Our Roots & Hearts',
          sceneTitle: 'The Tree of Kinship & Love',
          themeColor: '#8a2eae',
          accentColor: '#ffbe0b',
          narrations: [
            `Welcome to My Family. Every family story is a rich tapestry of love, lessons, and memory.`,
            `You chose ${kind.name}. Think about the people, elders, ancestors, or chosen family who shape you.`,
            `Represent each bond through colors, symbols, words, or natural stones and leaves.`,
            `Family is love that connects us across time and space. Celebrate your roots today.`,
          ],
        },
        4: {
          tagline: 'The Spirit of Ubuntu',
          sceneTitle: 'Circles of Community & Unity',
          themeColor: '#00a651',
          accentColor: '#ffd700',
          narrations: [
            `Welcome to Community & Belonging. "I am because we are"—the timeless wisdom of Ubuntu.`,
            `You chose ${kind.name}. Picture the neighborhood, friends, and shared spaces that support you.`,
            `Show the vibrant rhythm of your community through shared symbols, street art, or stories.`,
            `When we uplift each other, our entire community grows stronger and more resilient.`,
          ],
        },
        5: {
          tagline: 'Growing Through Adversity',
          sceneTitle: 'The Resilient Seedling',
          themeColor: '#f58220',
          accentColor: '#ffd166',
          narrations: [
            `Welcome to Overcoming Obstacles. Even the strongest tree bends in the wind before rising taller.`,
            `You chose ${kind.name}. Think of a challenge you faced and the courage that carried you through.`,
            `Capture that transition from shadow into warm golden sunlight.`,
            `You are stronger than any storm. Your resilience is your superpower.`,
          ],
        },
        6: {
          tagline: 'Reaching for the Stars',
          sceneTitle: 'The Sky of Future Hopes',
          themeColor: '#3f6ad8',
          accentColor: '#06d6a0',
          narrations: [
            `Welcome to Hopes & Future Dreams. What does your brightest future look like?`,
            `You chose ${kind.name}. Send your aspirations high into the starlit sky like glowing lanterns.`,
            `Express the goals, passions, and dreams you carry in your heart.`,
            `Every great achievement begins with the courage to imagine what is possible.`,
          ],
        },
        7: {
          tagline: 'The Ripple of a Grateful Heart',
          sceneTitle: 'The Garden of Gratitude',
          themeColor: '#ff758f',
          accentColor: '#ffd700',
          narrations: [
            `Welcome to Gratitude & Kindness. Gratitude turns what we have into more than enough.`,
            `You chose ${kind.name}. Notice the small gifts, warm smiles, and moments that bring peace.`,
            `Let your creation radiate ripples of appreciation outward like water ripples.`,
            `A grateful mind is a peaceful sanctuary. Thank you for your radiant spirit.`,
          ],
        },
        8: {
          tagline: 'Celebrating Your 8-Week Journey',
          sceneTitle: 'The Soaring Butterfly',
          themeColor: '#00a651',
          accentColor: '#f3256b',
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
        themeColor: '#8a2eae',
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
        title: `Activity ${act.id}: ${act.name}`,
        subtitle: `Option ${optIdx + 1} — ${kind.emoji} ${kind.name}`,
        tagline: specificDetails.tagline,
        sceneTitle: specificDetails.sceneTitle,
        about: act.about,
        steps: act.startHere.map(([b, t]) => `${b} ${t}`),
        materials: act.materials.join(' · '),
        proverb: pick(MM.SPARKS)?.text || 'However long the night, the dawn will break.',
        themeColor: specificDetails.themeColor,
        accentColor: specificDetails.accentColor,
        narrations: specificDetails.narrations,
      };
    }

    if (key === 'pre') {
      return {
        id: 'pre',
        title: 'Pre-Survey Video Guide',
        subtitle: 'Mental Health, Lifestyle & Wellbeing Check-in',
        tagline: 'Your Confidential Starting Point',
        sceneTitle: 'The Pathway of Discovery',
        about: 'A private initial check-in to understand where you are starting from.',
        steps: ['Complete 3 short sections', 'Answer honestly at your own pace', 'Unlocks your 8-week journey'],
        materials: 'Your smartphone · Private quiet space',
        proverb: 'Every journey begins with a single honest step.',
        themeColor: '#8a2eae',
        accentColor: '#3366ff',
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
        title: 'Post-Survey Video Guide',
        subtitle: 'Celebrating Your Growth & Experience',
        tagline: 'Honoring Your Transformation',
        sceneTitle: 'The Horizon of Accomplishment',
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
          'You have achieved something extraordinary for your mind and spirit.',
        ],
      };
    }

    return {
      id: 'general',
      title: 'Creative Resilience Walkthrough',
      subtitle: 'Mindful Art & Self-Expression',
      tagline: 'A Safe Space to Express Yourself',
      sceneTitle: 'The Creative Spark',
      about: 'A safe, gentle space to express yourself and nurture resilience.',
      steps: ['Breathe in deeply', 'Choose your creative medium', 'Reflect on what you create'],
      materials: 'Your phone, paper, voice or natural materials',
      proverb: 'Creativity is the voice of the heart.',
      themeColor: '#f3256b',
      accentColor: '#ffbe0b',
      narrations: [
        'Welcome to Creative Resilience. A mindful pause in your day.',
        'Explore drawing, writing, speaking, and games designed for your wellbeing.',
        'There is no right or wrong here—just your unique, authentic voice.',
        'Take a gentle breath and enjoy creating something meaningful.',
      ],
    };
  }

  /* ── Talking Facilitator Avatar with Speech Visemes ──────── */
  function drawNarratorAvatar(ctx, x, y, scale, ts, isSpeaking) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const bob = Math.sin(ts / 500) * 3;
    ctx.translate(0, bob);

    // Glowing Aura
    const auraGrad = ctx.createRadialGradient(0, 0, 16, 0, 0, 56);
    auraGrad.addColorStop(0, 'rgba(255, 209, 102, 0.4)');
    auraGrad.addColorStop(0.6, 'rgba(51, 102, 255, 0.25)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 56, 0, Math.PI * 2);
    ctx.fill();

    // Headwrap (Back Layer)
    ctx.fillStyle = '#4c1d95';
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

    // Radiant Cheeks
    ctx.fillStyle = 'rgba(243, 37, 107, 0.28)';
    ctx.beginPath();
    ctx.arc(-14, 4, 7, 0, Math.PI * 2);
    ctx.arc(14, 4, 7, 0, Math.PI * 2);
    ctx.fill();

    // Beaded Headwrap Band
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
      ctx.beginPath(); ctx.arc(-10, -3, 5, 0.1, Math.PI - 0.1); ctx.stroke();
      ctx.beginPath(); ctx.arc(10, -3, 5, 0.1, Math.PI - 0.1); ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.ellipse(-10, -4, 5, 4, 0, 0, Math.PI * 2);
      ctx.ellipse(10, -4, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupils & Specular Glint
      ctx.fillStyle = '#3a1f10';
      ctx.beginPath(); ctx.arc(-10, -4, 2.6, 0, Math.PI * 2); ctx.arc(10, -4, 2.6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-11, -5.5, 1.2, 0, Math.PI * 2); ctx.arc(9, -5.5, 1.2, 0, Math.PI * 2); ctx.fill();
    }

    // Cute Nose
    ctx.strokeStyle = 'rgba(74, 33, 10, 0.6)';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(0, 4, 2.5, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();

    // Animated Speech Visemes / Mouth
    let speechOpen = 0;
    if (isSpeaking) {
      const s1 = Math.sin(ts / 90) * 0.5 + 0.5;
      const s2 = Math.cos(ts / 200) * 0.3;
      speechOpen = Math.min(1, Math.max(0, s1 + s2));
    }

    const mouthCenterY = 15;
    const mouthW = 14 + speechOpen * 6;
    const mouthOpenH = speechOpen * 8;

    if (speechOpen > 0.15) {
      ctx.fillStyle = '#5c1020';
      ctx.beginPath();
      ctx.ellipse(0, mouthCenterY, mouthW / 2, mouthOpenH / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.rect(-mouthW / 3, mouthCenterY - mouthOpenH / 2, (mouthW * 2) / 3, mouthOpenH * 0.35);
      ctx.fill();
    }

    // Lips
    ctx.fillStyle = '#b33951';
    ctx.beginPath();
    ctx.moveTo(-mouthW / 2, mouthCenterY);
    ctx.quadraticCurveTo(0, mouthCenterY - 2.5 - speechOpen * 1.2, mouthW / 2, mouthCenterY);
    ctx.quadraticCurveTo(0, mouthCenterY + 3 + mouthOpenH / 2, -mouthW / 2, mouthCenterY);
    ctx.fill();

    ctx.restore();
  }

  /* ── 8 Dedicated Handcrafted Animated Story Scene Clips ───── */

  // Clip 1: Self-Portrait (Painting Canvas & Aura of Soul)
  function drawActivity1Clip(ctx, W, H, chProg, ts, script) {
    const cx = W * 0.44, cy = H * 0.46;
    ctx.save();

    // Glowing Aura Rings
    for (let r = 3; r >= 1; r--) {
      ctx.strokeStyle = `rgba(243, 37, 107, ${0.25 / r})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 60 + r * 25 + Math.sin(ts / 400 + r) * 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Canvas Frame
    ctx.fillStyle = '#26123a';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cx - 70, cy - 85, 140, 170, 16);
    ctx.fill();
    ctx.stroke();

    // Animated Painted Self-Portrait Silhouette
    const strokeProg = Math.min(1, chProg * 1.5);
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath();
    ctx.arc(cx, cy - 25, 30 * strokeProg, 0, Math.PI * 2);
    ctx.fill();

    // Shoulders
    ctx.fillStyle = '#f3256b';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 38, 48 * strokeProg, 32 * strokeProg, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dynamic Paintbrush Painting in Real-Time
    const brushX = cx + Math.cos(ts / 300) * 45;
    const brushY = cy + Math.sin(ts / 250) * 45;
    ctx.save();
    ctx.translate(brushX, brushY);
    ctx.rotate(0.4);
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(-4, -30, 8, 30);
    ctx.fillStyle = '#f3256b';
    ctx.beginPath(); ctx.ellipse(0, 0, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // Clip 2: My Safe Space (Cozy Sanctuary, Lantern, Rain Window)
  function drawActivity2Clip(ctx, W, H, chProg, ts, script) {
    const cx = W * 0.44, cy = H * 0.46;
    ctx.save();

    // Cozy Window Frame
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#3366ff';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(cx - 90, cy - 80, 180, 140, 14);
    ctx.fill();
    ctx.stroke();

    // Window Panes & Raindrops
    ctx.strokeStyle = 'rgba(110, 193, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 80); ctx.lineTo(cx, cy + 60);
    ctx.moveTo(cx - 90, cy - 10); ctx.lineTo(cx + 90, cy - 10);
    ctx.stroke();

    // Window Raindrops sliding
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 8; i++) {
      const rx = cx - 75 + i * 20;
      const ry = cy - 70 + ((ts * 0.05 + i * 25) % 120);
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + 1, ry + 8); ctx.stroke();
    }

    // Glowing Warm Lantern
    const lanX = cx + 55, lanY = cy + 30;
    const lanGlow = ctx.createRadialGradient(lanX, lanY, 4, lanX, lanY, 50);
    lanGlow.addColorStop(0, 'rgba(255, 209, 102, 0.85)');
    lanGlow.addColorStop(0.6, 'rgba(255, 158, 0, 0.35)');
    lanGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = lanGlow;
    ctx.beginPath(); ctx.arc(lanX, lanY, 50, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#ffd166';
    ctx.fillRect(lanX - 8, lanY - 14, 16, 24);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(lanX, lanY - 2, 4 + Math.sin(ts / 150) * 1.5, 0, Math.PI * 2); ctx.fill();

    // Calming Tea Cup with Steam
    const cupX = cx - 45, cupY = cy + 45;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(cupX - 12, cupY - 10, 24, 20, 4); ctx.fill();
    // Steam
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(cupX - 4, cupY - 12);
    ctx.quadraticCurveTo(cupX - 8 + Math.sin(ts / 200) * 4, cupY - 24, cupX - 4, cupY - 32);
    ctx.moveTo(cupX + 4, cupY - 12);
    ctx.quadraticCurveTo(cupX + 8 + Math.sin(ts / 200) * 4, cupY - 24, cupX + 4, cupY - 32);
    ctx.stroke();

    ctx.restore();
  }

  // Clip 3: My Family (Savanna Sunset, Acacia Tree & Connected Kinship Hearts)
  function drawActivity3Clip(ctx, W, H, chProg, ts, script) {
    const cx = W * 0.44, cy = H * 0.48;
    ctx.save();

    // Sunset Glow
    const sunGrad = ctx.createRadialGradient(cx, cy + 10, 10, cx, cy + 10, 110);
    sunGrad.addColorStop(0, '#ffd166');
    sunGrad.addColorStop(0.4, '#f58220');
    sunGrad.addColorStop(0.8, '#8a2eae');
    sunGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath(); ctx.arc(cx, cy + 10, 110, 0, Math.PI * 2); ctx.fill();

    // Acacia Family Tree of Life Trunk
    ctx.fillStyle = '#1c0d2e';
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy + 60);
    ctx.lineTo(cx - 16, cy);
    ctx.quadraticCurveTo(cx - 50, cy - 40, cx - 75, cy - 50);
    ctx.quadraticCurveTo(cx, cy - 30, cx + 75, cy - 50);
    ctx.lineTo(cx + 8, cy + 60);
    ctx.closePath();
    ctx.fill();

    // Canopy Foliage
    ctx.beginPath();
    ctx.ellipse(cx - 45, cy - 55, 42, 14, -0.1, 0, Math.PI * 2);
    ctx.ellipse(cx + 45, cy - 55, 42, 14, 0.1, 0, Math.PI * 2);
    ctx.ellipse(cx, cy - 65, 48, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Animated Connected Family Hearts on Branches
    const heartNodes = [
      { x: cx - 45, y: cy - 55, col: '#f3256b' },
      { x: cx + 45, y: cy - 55, col: '#ffd166' },
      { x: cx, y: cy - 65, col: '#00a651' },
      { x: cx - 20, y: cy - 35, col: '#3366ff' },
      { x: cx + 20, y: cy - 35, col: '#ff758f' },
    ];

    for (let i = 0; i < heartNodes.length; i++) {
      const hn = heartNodes[i];
      const pulse = Math.sin(ts / 300 + i) * 3;
      ctx.fillStyle = hn.col;
      ctx.shadowColor = hn.col;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(hn.x, hn.y, 8 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Holding Hands Silhouette Below
    ctx.fillStyle = '#ffd166';
    ctx.font = '700 12px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🤝 United in Love & Roots', cx, cy + 78);

    ctx.restore();
  }

  // Clip 4: Community (Ubuntu Unity Circle & Vibrant Shared Homes)
  function drawActivity4Clip(ctx, W, H, chProg, ts, script) {
    const cx = W * 0.44, cy = H * 0.46;
    ctx.save();

    // Ubuntu Unity Circle of Hands
    const handCount = 8;
    for (let i = 0; i < handCount; i++) {
      const a = (i / handCount) * Math.PI * 2 + ts * 0.001;
      const hx = cx + Math.cos(a) * 55;
      const hy = cy + Math.sin(a) * 55;

      ctx.strokeStyle = 'rgba(0, 166, 81, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(hx, hy); ctx.stroke();

      ctx.fillStyle = ['#00a651', '#f58220', '#ffd700', '#3366ff'][i % 4];
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(hx, hy, 10, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Central Ubuntu Heart
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f3256b';
    ctx.font = '16px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🤝', cx, cy + 5);

    ctx.fillStyle = '#06d6a0';
    ctx.font = '700 12.5px Poppins, sans-serif';
    ctx.fillText('Ubuntu: I am because we are', cx, cy + 85);

    ctx.restore();
  }

  // Clip 5: Resilience & Overcoming Obstacles (Sprout Breaking Stone into Sunlight)
  function drawActivity5Clip(ctx, W, H, chProg, ts, script) {
    const cx = W * 0.44, cy = H * 0.48;
    ctx.save();

    // Dark Rock / Stone Base
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 50, 70, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fissure in Rock with Golden Light
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 50);
    ctx.lineTo(cx - 8, cy + 30);
    ctx.lineTo(cx + 4, cy + 10);
    ctx.lineTo(cx, cy);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Resilient Growing Green Sprout
    const growProg = Math.min(1, chProg * 1.4);
    const stemH = 65 * growProg;

    ctx.strokeStyle = '#38b000';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy + 10);
    ctx.quadraticCurveTo(cx + Math.sin(ts / 300) * 4, cy - stemH * 0.5, cx, cy - stemH);
    ctx.stroke();

    // Blooming Flower Crown on Top
    if (growProg > 0.4) {
      const topY = cy - stemH;
      ctx.save();
      ctx.translate(cx, topY);
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#ffbe0b';
      for (let k = 0; k < 6; k++) {
        ctx.save(); ctx.rotate(k * Math.PI / 3 + ts * 0.002);
        ctx.beginPath(); ctx.ellipse(0, -12, 6, 12, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = '#f3256b';
      ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  // Clip 6: Future Dreams (Starlit Cosmos & Ascending Wish Lanterns)
  function drawActivity6Clip(ctx, W, H, chProg, ts, script) {
    const cx = W * 0.44, cy = H * 0.46;
    ctx.save();

    // Cosmic Starfield
    for (let i = 0; i < 20; i++) {
      const sx = (cx - 100 + i * 16) % W;
      const sy = (cy - 80 + ((i * 23) % 150));
      const spark = Math.sin(ts / 200 + i) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${spark})`;
      ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill();
    }

    // Ascending Glowing Paper Lanterns
    for (let k = 0; k < 4; k++) {
      const lx = cx - 50 + k * 35;
      const ly = cy + 40 - ((ts * 0.04 + k * 45) % 140);
      const glow = ctx.createRadialGradient(lx, ly, 2, lx, ly, 26);
      glow.addColorStop(0, 'rgba(255, 209, 102, 0.9)');
      glow.addColorStop(0.5, 'rgba(255, 158, 0, 0.4)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(lx, ly, 26, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#ffd166';
      ctx.beginPath(); ctx.roundRect(lx - 8, ly - 10, 16, 20, 4); ctx.fill();
    }

    ctx.fillStyle = '#6ec1ff';
    ctx.font = '700 13px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Dare to Dream Big', cx, cy + 85);

    ctx.restore();
  }

  // Clip 7: Gratitude (Rippling Golden Hearts & Blooming Bouquet)
  function drawActivity7Clip(ctx, W, H, chProg, ts, script) {
    const cx = W * 0.44, cy = H * 0.46;
    ctx.save();

    // Expanding Radiance Ripples
    for (let r = 3; r >= 1; r--) {
      const rad = 25 + r * 28 + ((ts * 0.04) % 30);
      ctx.strokeStyle = `rgba(255, 117, 143, ${Math.max(0, 0.8 - rad / 120)})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();
    }

    // Golden Central Heart
    const pulse = Math.sin(ts / 220) * 4;
    ctx.fillStyle = '#f3256b';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 20;
    ctx.font = `${38 + pulse}px Poppins, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('💖', cx, cy + 14);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffd166';
    ctx.font = '700 12.5px Poppins, sans-serif';
    ctx.fillText('Gratitude Multiplies Joy 🌸', cx, cy + 80);

    ctx.restore();
  }

  // Clip 8: Transformation (Chrysalis to Magnificent Soaring Butterfly)
  function drawActivity8Clip(ctx, W, H, chProg, ts, script) {
    const cx = W * 0.44, cy = H * 0.44;
    ctx.save();

    const wingFlap = Math.sin(ts / 90) * 0.85;

    // Soaring Wings
    ctx.save();
    ctx.translate(cx, cy);

    // Left Wing (Emerald & Gold)
    ctx.save();
    ctx.scale(wingFlap, 1);
    ctx.fillStyle = '#06d6a0';
    ctx.shadowColor = '#06d6a0';
    ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.ellipse(-32, -18, 30, 22, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.ellipse(-24, 15, 22, 16, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // Right Wing
    ctx.save();
    ctx.scale(wingFlap, 1);
    ctx.fillStyle = '#06d6a0';
    ctx.shadowColor = '#06d6a0';
    ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.ellipse(32, -18, 30, 22, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.ellipse(24, 15, 22, 16, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // Butterfly Body
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#1c1917';
    ctx.beginPath(); ctx.ellipse(0, 0, 7, 28, 0, 0, Math.PI * 2); ctx.fill();

    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 13px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🦋 Soar With Your Full Strength', cx, cy + 85);

    ctx.restore();
  }

  // Pre-Survey & General Clips
  function drawGenericClip(ctx, W, H, chProg, ts, script) {
    const cx = W * 0.44, cy = H * 0.46;
    ctx.save();

    // Relaxing 432Hz Breathing Sphere
    const breath = Math.sin(ts / 600) * 16;
    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 65 + breath);
    grad.addColorStop(0, '#ffd166');
    grad.addColorStop(0.5, script.themeColor || '#8a2eae');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, 65 + breath, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 13.5px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Breath In · Create Freely', cx, cy + 80);

    ctx.restore();
  }

  /* ── Themed Motion Canvas Video Renderer ─────────────────── */
  function renderFrame(ts, script) {
    if (!activeCtx || !activeCanvas) return;
    const ctx = activeCtx;
    const W = activeCanvas.width, H = activeCanvas.height;
    const progress = Math.min(1, currentMs / totalDurationMs);

    ctx.clearRect(0, 0, W, H);

    // Dynamic Cosmic Deep Navy/Violet Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0c0418');
    bgGrad.addColorStop(0.5, '#1b0933');
    bgGrad.addColorStop(1, '#080211');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Floating Ambient Light Orbs
    for (let i = 0; i < 6; i++) {
      const ox = (W * 0.15 + (i * W * 0.16) + Math.sin(ts / 1200 + i) * 30) % W;
      const oy = (H * 0.3 + Math.cos(ts / 1400 + i * 2) * 40) % H;
      const rad = 60 + Math.sin(ts / 800 + i) * 20;
      const orbGrad = ctx.createRadialGradient(ox, oy, 2, ox, oy, rad);
      orbGrad.addColorStop(0, i % 2 === 0 ? 'rgba(255,215,0,0.14)' : 'rgba(51,102,255,0.12)');
      orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath(); ctx.arc(ox, oy, rad, 0, Math.PI * 2); ctx.fill();
    }

    // ── Chapter Switching (4 Distinct Acts) ──
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

    // Draw Talking Facilitator Avatar in the scene
    const isSpeaking = isPlaying && !isMuted;
    drawNarratorAvatar(ctx, W * 0.86, H * 0.30, 0.88, ts, isSpeaking);

    // Render Dedicated Scene Content
    if (chapterIndex === 0) {
      // ── CHAPTER 1: Mindful Welcome & Grounding ──
      const pulse = Math.sin(ts / 400) * 10;
      ctx.strokeStyle = script.themeColor || '#8a2eae';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(W * 0.44, H * 0.38, 52 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 21px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(script.title, W * 0.44, H * 0.65);

      ctx.fillStyle = '#ffd166';
      ctx.font = '600 13.5px Poppins, sans-serif';
      ctx.fillText(script.subtitle, W * 0.44, H * 0.74);

      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = '400 12px Poppins, sans-serif';
      ctx.fillText('Take a gentle breath · Your creative space begins', W * 0.44, H * 0.83);

    } else if (chapterIndex === 1) {
      // ── CHAPTER 2: Dedicated Handcrafted Animated Story Clip! ──
      ctx.fillStyle = '#ffd700';
      ctx.font = '800 17px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(script.sceneTitle || '✨ Creative Demonstration', W * 0.44, H * 0.16);

      // Render the specific animated clip for this activity
      if (script.id === 1) drawActivity1Clip(ctx, W, H, chProg, ts, script);
      else if (script.id === 2) drawActivity2Clip(ctx, W, H, chProg, ts, script);
      else if (script.id === 3) drawActivity3Clip(ctx, W, H, chProg, ts, script);
      else if (script.id === 4) drawActivity4Clip(ctx, W, H, chProg, ts, script);
      else if (script.id === 5) drawActivity5Clip(ctx, W, H, chProg, ts, script);
      else if (script.id === 6) drawActivity6Clip(ctx, W, H, chProg, ts, script);
      else if (script.id === 7) drawActivity7Clip(ctx, W, H, chProg, ts, script);
      else if (script.id === 8) drawActivity8Clip(ctx, W, H, chProg, ts, script);
      else drawGenericClip(ctx, W, H, chProg, ts, script);

    } else if (chapterIndex === 2) {
      // ── CHAPTER 3: Step-by-Step Creation Guidance ──
      ctx.fillStyle = '#6ec1ff';
      ctx.font = '800 17px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📋 Simple Steps to Follow', W * 0.44, H * 0.18);

      const step1 = script.steps[0] || '1. Pick what resonates most with you.';
      const step2 = script.steps[1] || '2. Draw, write, or record freely.';
      const step3 = script.steps[2] || '3. Reflect on your creation in the app.';

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 13px Poppins, sans-serif';
      ctx.fillText(step1, W * 0.44, H * 0.38);
      ctx.fillText(step2, W * 0.44, H * 0.52);
      ctx.fillText(step3, W * 0.44, H * 0.66);

      ctx.fillStyle = '#ffd166';
      ctx.font = '500 11.5px Poppins, sans-serif';
      ctx.fillText(`Materials: ${script.materials}`, W * 0.44, H * 0.80);

    } else {
      // ── CHAPTER 4: African Wisdom Proverb & Encouragement ──
      ctx.fillStyle = '#ffd700';
      ctx.font = '700 24px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌟', W * 0.44, H * 0.24);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic 600 14px Poppins, sans-serif';
      ctx.fillText(`“${script.proverb}”`, W * 0.44, H * 0.46);

      ctx.fillStyle = '#ffd166';
      ctx.font = '800 14.5px Poppins, sans-serif';
      ctx.fillText('You are ready to create! 🌱✨', W * 0.44, H * 0.66);

      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      ctx.font = '400 12px Poppins, sans-serif';
      ctx.fillText('Tap "Start Creating" below to draw on screen or upload.', W * 0.44, H * 0.77);
    }

    // Top Header Badge
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.roundRect(14, 14, 155, 24, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 11px Poppins, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🎬 PART ${chapterIndex + 1}/4`, 26, 30);

    // Live Subtitles Caption Bar at Bottom
    const currentNarration = script.narrations[chapterIndex] || script.narrations[0];
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, H - 36, W, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = '500 11.5px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentNarration, W / 2, H - 16);

    // Progress Bar
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(0, H - 6, W, 6);
    ctx.fillStyle = script.accentColor || '#ffd700';
    ctx.fillRect(0, H - 6, W * progress, 6);
  }

  /* ── Open Video Modal with Full Player Controls ──────────── */
  function playVideoModal(key, opts = {}) {
    const script = getSegmentScript(key, opts);
    currentSegment = script;
    currentMs = 0;
    isPlaying = true;
    isMuted = false;

    removeFloatingWidget();

    // Voice Narration
    if (typeof MMVoice !== 'undefined' && MMVoice.supported()) {
      MMVoice.speak(script.narrations[0], { persona: 'warmth', force: true });
    }

    const m = modal(`
      <div class="video-modal-wrap" style="color:#ffffff">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span style="font-weight:800;font-size:14.5px;color:#ffffff;text-align:left">${esc(script.title)}</span>
          <span style="font-size:11.5px;font-weight:700;color:#ffd166">🎬 Animated Video Guide</span>
        </div>
        
        <div class="video-stage-frame" id="vid-stage-frame" style="position:relative;border-radius:16px;overflow:hidden;border:1.5px solid rgba(51,102,255,0.5);box-shadow:0 8px 30px rgba(0,0,0,0.5)">
          <div class="video-top-tools" style="position:absolute;top:10px;right:10px;display:flex;gap:6px;z-index:10">
            <button class="btn-vid-top" id="vid-minimize-btn" title="Minimize to Corner Picture-in-Picture" style="background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:8px;padding:4px 8px;cursor:pointer">🗕</button>
            <button class="btn-vid-top" id="vid-fullscreen-btn" title="Toggle Fullscreen" style="background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:8px;padding:4px 8px;cursor:pointer">⛶</button>
          </div>
          <canvas id="motion-video-canvas" width="640" height="360" style="width:100%;height:auto;aspect-ratio:16/9;display:block"></canvas>
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
          ${esc(script.subtitle)} · Handcrafted animated video with soothing 432Hz soundscape
        </p>

        <div class="modal-btns" style="display:flex;gap:8px">
          <button class="btn btn-primary" id="vid-start-btn" style="flex:1">Start Activity 🎨</button>
          <button class="btn btn-ghost" onclick="closeModal()" style="flex:0 0 100px">Close</button>
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
      if (typeof MMVoice !== 'undefined' && MMVoice.supported()) MMVoice.speak(script.narrations[0], { persona: 'warmth', force: true });
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
    wrap.style.cssText = 'position:fixed;bottom:20px;right:20px;width:280px;background:rgba(26,26,26,0.95);border:1.5px solid rgba(51,102,255,0.6);border-radius:14px;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.6);z-index:999;backdrop-filter:blur(16px)';
    wrap.innerHTML = `
      <div class="vfw-canvas-wrap">
        <canvas id="vfw-canvas" width="400" height="225" style="width:100%;height:auto;display:block"></canvas>
      </div>
      <div class="vfw-bar" style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:rgba(0,0,0,0.6)">
        <span class="vfw-title" style="font-size:11px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:160px">${esc(script.title)}</span>
        <div class="vfw-btns" style="display:flex;gap:4px">
          <button class="vfw-btn" id="vfw-play-btn" style="background:transparent;border:0;color:#fff;cursor:pointer">${isPlaying ? '⏸' : '▶'}</button>
          <button class="vfw-btn" id="vfw-max-btn" title="Maximize Video" style="background:transparent;border:0;color:#fff;cursor:pointer">🗖</button>
          <button class="vfw-btn" id="vfw-close-btn" title="Close" style="background:transparent;border:0;color:#fff;cursor:pointer">✕</button>
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
