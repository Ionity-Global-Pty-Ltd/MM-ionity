/* ============================================================
   MojaMind — Beat & Rhythm Studio (MMBeat) 🥁
   A tiny 16-step drum sequencer. All sound is synthesised live
   with the Web Audio API — ZERO audio samples, so it adds no
   asset weight. Users build a rhythm, play it, and it's analysed
   (tempo, energy, density, groove) into gentle reflective feedback.
   © IONITY Global (Pty) Ltd · Johan Wilhelm van Antwerp
   ============================================================ */
'use strict';

const MMBeat = (() => {
  const STEPS = 16;
  const TRACKS = [
    { id: 'kick',  name: 'Kick',  c: '#f3256b' },
    { id: 'snare', name: 'Snare', c: '#ffd166' },
    { id: 'hat',   name: 'Hi-Hat', c: '#43b0a8' },
    { id: 'clap',  name: 'Clap',  c: '#8a2eae' },
  ];
  let actx = null, playTimer = null, playing = false, curStep = 0;

  function ac() {
    const A = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!A) return null;
    if (!actx) actx = new A();
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function noise(t, dur, freq, type, vol) {
    const a = ac(); if (!a) return;
    const buf = a.createBuffer(1, Math.max(1, a.sampleRate * dur), a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = a.createBufferSource(); s.buffer = buf;
    const f = a.createBiquadFilter(); f.type = type; f.frequency.value = freq;
    const g = a.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(a.destination); s.start(t); s.stop(t + dur);
  }
  const voices = {
    kick(t) { const a = ac(); if (!a) return; const o = a.createOscillator(), g = a.createGain();
      o.frequency.setValueAtTime(155, t); o.frequency.exponentialRampToValueAtTime(50, t + 0.12);
      g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.17);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + 0.19); },
    snare(t) { noise(t, 0.2, 1800, 'highpass', 0.5); const a = ac(); if (!a) return;
      const o = a.createOscillator(), g = a.createGain(); o.type = 'triangle'; o.frequency.value = 180;
      g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + 0.12); },
    hat(t) { noise(t, 0.05, 9000, 'highpass', 0.3); },
    clap(t) { noise(t, 0.12, 1200, 'bandpass', 0.5); },
  };

  function open(host, { onSave, onClose } = {}) {
    let tempo = 92;
    const grid = TRACKS.map(() => new Array(STEPS).fill(false));

    host.innerHTML = `
      <div class="beat-wrap">
        <div class="beat-bar">
          <button class="draw-btn-icon" data-b="close" aria-label="Close">✕</button>
          <div class="beat-title"><b>Beat &amp; Rhythm Studio</b><small>Tap the squares · build your song of strength 🥁</small></div>
          <button class="draw-save" data-b="save">💾 Save Beat</button>
        </div>
        <div class="beat-grid">
          ${TRACKS.map((tr, r) => `
            <div class="beat-row">
              <span class="beat-lbl" style="--c:${tr.c}">${tr.name}</span>
              <div class="beat-cells">
                ${Array.from({ length: STEPS }, (_, s) => `<button class="beat-cell${s % 4 === 0 ? ' beat-accent' : ''}" data-r="${r}" data-s="${s}" style="--c:${tr.c}"></button>`).join('')}
              </div>
            </div>`).join('')}
        </div>
        <div class="beat-controls">
          <button class="btn btn-primary" data-b="play">▶ Play</button>
          <label class="beat-tempo">Tempo <input type="range" min="60" max="160" value="${tempo}" data-b="tempo" /> <b data-b="bpm">${tempo}</b> BPM</label>
          <button class="btn btn-ghost" data-b="clear">Clear</button>
        </div>
        <p class="beat-hint" id="beat-analysis">Add a few beats, press Play, then Save when it feels like you. 💜</p>
      </div>`;

    const $ = sel => host.querySelector(sel);
    const cells = [...host.querySelectorAll('.beat-cell')];
    cells.forEach(c => c.addEventListener('click', () => {
      const r = +c.dataset.r, s = +c.dataset.s;
      grid[r][s] = !grid[r][s];
      c.classList.toggle('on', grid[r][s]);
      if (grid[r][s]) { try { voices[TRACKS[r].id](ac().currentTime); } catch (_) {} }
    }));

    const playBtn = $('[data-b="play"]');
    function stepInterval() { return (60 / tempo) / 4 * 1000; } // 16th notes
    function tick() {
      const a = ac(); const t = a ? a.currentTime : 0;
      TRACKS.forEach((tr, r) => { if (grid[r][curStep]) { try { voices[tr.id](t); } catch (_) {} } });
      host.querySelectorAll('.beat-cell.playhead').forEach(c => c.classList.remove('playhead'));
      host.querySelectorAll(`.beat-cell[data-s="${curStep}"]`).forEach(c => c.classList.add('playhead'));
      curStep = (curStep + 1) % STEPS;
    }
    function play() { if (playing) return stop(); ac(); playing = true; curStep = 0; playBtn.textContent = '⏸ Stop'; tick(); playTimer = setInterval(tick, stepInterval()); }
    function stop() { playing = false; clearInterval(playTimer); playBtn.textContent = '▶ Play'; host.querySelectorAll('.beat-cell.playhead').forEach(c => c.classList.remove('playhead')); }
    playBtn.addEventListener('click', play);

    $('[data-b="tempo"]').addEventListener('input', e => { tempo = +e.target.value; $('[data-b="bpm"]').textContent = tempo; if (playing) { clearInterval(playTimer); playTimer = setInterval(tick, stepInterval()); } });
    $('[data-b="clear"]').addEventListener('click', () => { grid.forEach(row => row.fill(false)); cells.forEach(c => c.classList.remove('on')); });
    $('[data-b="close"]').addEventListener('click', () => { stop(); onClose && onClose(); });

    /* ── Rhythm analysis → gentle reflective feedback ────────── */
    function analyse() {
      const hits = grid.flat().filter(Boolean).length;
      const density = hits / (STEPS * TRACKS.length);
      const kicks = grid[0].filter(Boolean).length;
      const offbeat = grid.flat().filter((v, i) => v && (i % 4 !== 0)).length;
      const groove = hits ? offbeat / hits : 0; // syncopation share
      const energy = density < 0.18 ? 'calm and spacious' : density < 0.4 ? 'steady and grounded' : 'bold and driving';
      const feel = groove > 0.55 ? 'playful, syncopated groove' : 'strong, on-the-beat pulse';
      const feedback = `Your rhythm is ${energy}, with a ${feel}. ${kicks >= 4 ? 'A firm heartbeat of kicks anchors it' : 'Gentle low beats give it room to breathe'} — ${tempo} BPM. There is no wrong rhythm; this one is yours. 🥁`;
      return { hits, density: +density.toFixed(2), tempo, groove: +groove.toFixed(2), feedback };
    }

    /* ── Render the pattern to a small PNG so it saves & displays ── */
    function renderPNG() {
      const cw = 480, ch = 200, pad = 8, cols = STEPS, rows = TRACKS.length;
      const cvs = document.createElement('canvas'); cvs.width = cw; cvs.height = ch;
      const x = cvs.getContext('2d');
      x.fillStyle = '#160427'; x.fillRect(0, 0, cw, ch);
      const gw = (cw - pad * 2) / cols, gh = (ch - pad * 2 - 24) / rows;
      x.fillStyle = '#fff'; x.font = 'bold 15px Poppins, sans-serif'; x.fillText('My Rhythm — MojaMind 🥁', pad, 18);
      TRACKS.forEach((tr, r) => {
        for (let s = 0; s < cols; s++) {
          const px = pad + s * gw, py = 26 + pad + r * gh;
          x.fillStyle = grid[r][s] ? tr.c : 'rgba(255,255,255,0.06)';
          x.fillRect(px + 1, py + 1, gw - 2, gh - 2);
        }
      });
      return cvs.toDataURL('image/png');
    }

    $('[data-b="save"]').addEventListener('click', () => {
      const hits = grid.flat().filter(Boolean).length;
      if (!hits) { try { if (typeof toast === 'function') toast('Tap a few squares to make a beat first 🥁'); } catch (_) {} return; }
      stop();
      const analysis = analyse();
      onSave && onSave(renderPNG(), { pattern: grid, ...analysis });
    });

    return { stop };
  }

  return { open };
})();

globalThis.MMBeat = MMBeat;
