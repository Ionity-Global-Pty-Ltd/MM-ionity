/* ============================================================
   MojaMind — Procedural Nature & 432Hz Soundscapes Generator
   Zero-Bandwidth, 100% on-device Web Audio ambient sound engine.
   
   Generates real-time calming natural soundscapes:
   - 432Hz Natural Harmony Chords (tuned to pentatonic resonance)
   - Gentle Summer Meadow Breeze
   - Peaceful Stream & Rainfall
   - Warm Ambient Drone & Tibetan Singing Bowl harmonics
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za
   ============================================================ */
'use strict';

const MMSoundscape = (() => {
  let ac = null;
  let isPlaying = false;
  let currentPreset = '432hz';
  let masterGain = null;
  let activeNodes = [];
  let chordInterval = null;

  const PRESETS = {
    '432hz': {
      name: '432Hz Harmony',
      icon: '✨',
      desc: 'Natural resonance harmonic chords for focus and deep peace.',
      freqs: [432, 486, 540, 648, 720], // 432Hz Pentatonic
    },
    'meadow': {
      name: 'Meadow Breeze',
      icon: '🍃',
      desc: 'Gentle wind rustling through sunlit savannah grass.',
      freqs: [216, 324, 432],
    },
    'stream': {
      name: 'River & Rainfall',
      icon: '🌊',
      desc: 'Peaceful water stream and soft rhythmic summer shower.',
      freqs: [288, 384, 576],
    },
    'bowl': {
      name: 'Tibetan Sing Bowl',
      icon: '🧘',
      desc: 'Warm soothing acoustic overtones with binaural pulsing.',
      freqs: [108, 216, 432, 864],
    },
  };

  function getAudioContext() {
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return null;
    if (!ac) {
      ac = new AC();
      masterGain = ac.createGain();
      masterGain.gain.setValueAtTime(0.35, ac.currentTime);
      masterGain.connect(ac.destination);
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }

  function createNoiseBuffer(ctx, duration = 3) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter algorithm
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  function start(presetKey = '432hz') {
    const ctx = getAudioContext();
    if (!ctx) return false;

    stop();
    currentPreset = presetKey;
    isPlaying = true;
    const preset = PRESETS[presetKey] || PRESETS['432hz'];

    // 1) Procedural Ambient Noise layer for Wind / Water
    if (presetKey === 'meadow' || presetKey === 'stream') {
      try {
        const noiseBuf = createNoiseBuffer(ctx);
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuf;
        noiseSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = presetKey === 'stream' ? 'bandpass' : 'lowpass';
        filter.frequency.setValueAtTime(presetKey === 'stream' ? 450 : 260, ctx.currentTime);

        // Slow LFO for breeze modulation
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
        lfoGain.gain.setValueAtTime(140, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(presetKey === 'stream' ? 0.28 : 0.22, ctx.currentTime + 2.5);

        noiseSource.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);

        noiseSource.start();
        lfo.start();
        activeNodes.push(noiseSource, lfo, filter, noiseGain);
      } catch (e) {
        console.warn('Noise layer note:', e);
      }
    }

    // 2) Harmonic 432Hz Sine / Triangle Chord Progression
    const freqs = preset.freqs;
    let chordIdx = 0;

    function playChord() {
      if (!isPlaying) return;
      const baseF = freqs[chordIdx % freqs.length];
      const harmonyF = freqs[(chordIdx + 2) % freqs.length] || baseF * 1.5;
      const subF = baseF / 2;

      [subF, baseF, harmonyF].forEach((f, idx) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          // Subtle binaural beating (0.5Hz detune)
          if (idx === 1 && presetKey === 'bowl') {
            osc.frequency.setValueAtTime(f + 0.5, ctx.currentTime);
          }

          const vol = idx === 0 ? 0.12 : 0.08;
          gain.gain.setValueAtTime(0.0001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + 3.5);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 9.5);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start();
          osc.stop(ctx.currentTime + 9.8);
          activeNodes.push(osc, gain);
        } catch { /* oscillator safeguard */ }
      });

      chordIdx++;
    }

    playChord();
    chordInterval = setInterval(playChord, 8000);
    return true;
  }

  function stop() {
    isPlaying = false;
    clearInterval(chordInterval);
    chordInterval = null;

    if (ac && masterGain) {
      try {
        masterGain.gain.setValueAtTime(masterGain.gain.value, ac.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.5);
      } catch { /* ignore */ }
    }

    setTimeout(() => {
      activeNodes.forEach(node => {
        try { if (node.stop) node.stop(); if (node.disconnect) node.disconnect(); } catch { /* ignore */ }
      });
      activeNodes = [];
      if (ac && masterGain) {
        masterGain.gain.setValueAtTime(0.35, ac.currentTime);
      }
    }, 600);
  }

  function setVolume(v) {
    const val = Math.max(0, Math.min(1, v));
    if (ac && masterGain) {
      masterGain.gain.setValueAtTime(val * 0.6, ac.currentTime);
    }
  }

  function toggle(presetKey = '432hz') {
    if (isPlaying && currentPreset === presetKey) {
      stop();
      return false;
    } else {
      start(presetKey);
      return true;
    }
  }

  function soundscapeBarHTML() {
    return `
      <div class="soundscape-bar" id="soundscape-bar">
        <div class="sc-info">
          <span class="sc-icon">${PRESETS[currentPreset]?.icon || '✨'}</span>
          <span class="sc-title">${PRESETS[currentPreset]?.name || '432Hz Harmony'}</span>
          <span class="sc-status ${isPlaying ? 'live' : ''}">${isPlaying ? 'Playing Ambient Audio' : 'Paused'}</span>
        </div>
        <div class="sc-controls">
          ${Object.entries(PRESETS).map(([k, v]) => `
            <button class="sc-btn ${currentPreset === k && isPlaying ? 'active' : ''}" data-sc="${k}" title="${v.name}">
              ${v.icon} <span>${v.name.split(' ')[0]}</span>
            </button>
          `).join('')}
          <button class="sc-toggle ${isPlaying ? 'on' : ''}" id="sc-toggle-btn">
            ${isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>
      </div>
    `;
  }

  function wireEvents(container = document) {
    container.querySelectorAll('[data-sc]').forEach(b => {
      b.addEventListener('click', () => {
        const key = b.dataset.sc;
        start(key);
        wireUpdate(container);
      });
    });
    container.querySelector('#sc-toggle-btn')?.addEventListener('click', () => {
      toggle(currentPreset);
      wireUpdate(container);
    });
  }

  function wireUpdate(container = document) {
    const iconEl = container.querySelector('.sc-icon');
    const titleEl = container.querySelector('.sc-title');
    const statusEl = container.querySelector('.sc-status');
    const toggleBtn = container.querySelector('#sc-toggle-btn');
    if (iconEl) iconEl.textContent = PRESETS[currentPreset]?.icon || '✨';
    if (titleEl) titleEl.textContent = PRESETS[currentPreset]?.name || '432Hz Harmony';
    if (statusEl) {
      statusEl.textContent = isPlaying ? 'Playing Ambient Audio' : 'Paused';
      statusEl.classList.toggle('live', isPlaying);
    }
    if (toggleBtn) {
      toggleBtn.textContent = isPlaying ? '⏸ Pause' : '▶ Play';
      toggleBtn.classList.toggle('on', isPlaying);
    }
    container.querySelectorAll('[data-sc]').forEach(b => {
      b.classList.toggle('active', b.dataset.sc === currentPreset && isPlaying);
    });
  }

  return {
    PRESETS,
    start,
    stop,
    toggle,
    setVolume,
    isPlaying: () => isPlaying,
    currentPreset: () => currentPreset,
    soundscapeBarHTML,
    wireEvents,
  };
})();
