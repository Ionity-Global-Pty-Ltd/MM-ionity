/* ============================================================
   MojaMind — Beat & Rhythm Studio (MMBeat) 🥁
   A 16-step, 9-track drum & sound sequencer. All sound is
   synthesised live with the Web Audio API — ZERO audio samples,
   so it adds no asset weight. Each line has a number and its own
   loudness slider. The pattern is analysed (tempo, energy,
   density, groove) into gentle reflective feedback.
   © IONITY Global (Pty) Ltd · Johan Wilhelm van Antwerp
   ============================================================ */
'use strict';

const MMBeat = (() => {
  const STEPS = 16;
  /* 9 synthesised voices — percussion, bass, string & odd sounds. */
  const TRACKS = [
    { id: 'kick',    name: 'Kick',    c: '#f3256b', vol: 0.90 },
    { id: 'snare',   name: 'Snare',   c: '#ffd166', vol: 0.80 },
    { id: 'hat',     name: 'Hi-Hat',  c: '#43b0a8', vol: 0.55 },
    { id: 'clap',    name: 'Clap',    c: '#8a2eae', vol: 0.70 },
    { id: 'tom',     name: 'Tom',     c: '#ff8c42', vol: 0.80 },
    { id: 'bass',    name: 'Bass',    c: '#5a5fbf', vol: 0.75 },
    { id: 'string',  name: 'String',  c: '#4bd0c0', vol: 0.70 },
    { id: 'cowbell', name: 'Cowbell', c: '#c0e030', vol: 0.55 },
    { id: 'zap',     name: 'Zap',     c: '#ff5db1', vol: 0.60 },
  ];
  let actx = null, playTimer = null, playing = false, curStep = 0;

  function ac() {
    const A = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!A) return null;
    if (!actx) actx = new A();
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function noise(t, dur, freq, type, vol, v = 1) {
    const a = ac(); if (!a) return;
    const buf = a.createBuffer(1, Math.max(1, a.sampleRate * dur), a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = a.createBufferSource(); s.buffer = buf;
    const f = a.createBiquadFilter(); f.type = type; f.frequency.value = freq;
    const g = a.createGain(); g.gain.setValueAtTime(vol * v, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(a.destination); s.start(t); s.stop(t + dur);
  }
  function tone(t, dur, f0, f1, type, vol, v = 1, filterHz) {
    const a = ac(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    g.gain.setValueAtTime(vol * v, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    let last = g;
    if (filterHz) { const flt = a.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = filterHz; o.connect(flt); flt.connect(g); }
    else { o.connect(g); }
    last.connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  const voices = {
    kick(t, v = 1) { tone(t, 0.18, 155, 50, 'sine', 0.9, v); },
    snare(t, v = 1) { noise(t, 0.2, 1800, 'highpass', 0.5, v); tone(t, 0.12, 180, 180, 'triangle', 0.35, v); },
    hat(t, v = 1) { noise(t, 0.05, 9000, 'highpass', 0.3, v); },
    clap(t, v = 1) { [0, 0.012, 0.024].forEach(o => noise(t + o, 0.11, 1200, 'bandpass', 0.42, v)); },
    tom(t, v = 1) { tone(t, 0.22, 260, 90, 'triangle', 0.7, v); },
    bass(t, v = 1) { tone(t, 0.26, 72, 68, 'square', 0.5, v, 480); },
    string(t, v = 1) { tone(t, 0.5, 330, 320, 'sawtooth', 0.42, v, 2200); },
    cowbell(t, v = 1) { tone(t, 0.14, 540, 540, 'square', 0.3, v); tone(t, 0.14, 800, 800, 'square', 0.24, v); },
    zap(t, v = 1) { tone(t, 0.16, 1200, 180, 'sine', 0.5, v); },
  };

  function open(host, { onSave, onClose } = {}) {
    let tempo = 92;
    const grid = TRACKS.map(() => new Array(STEPS).fill(false));
    const vols = TRACKS.map(t => t.vol);          // per-line loudness 0..1

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
              <div class="beat-side" style="--c:${tr.c}">
                <span class="beat-lbl"><span class="beat-num">${r + 1}</span>${tr.name}</span>
                <input class="beat-vol" type="range" min="0" max="100" value="${Math.round(tr.vol * 100)}"
                       data-r="${r}" aria-label="${tr.name} loudness" title="${tr.name} loudness" />
              </div>
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
        <p class="beat-hint" id="beat-analysis">Add a few beats, set each line's loudness, press Play, then Save when it feels like you. 💜</p>
      </div>`;

    const $ = sel => host.querySelector(sel);
    const cells = [...host.querySelectorAll('.beat-cell')];
    cells.forEach(c => c.addEventListener('click', () => {
      const r = +c.dataset.r, s = +c.dataset.s;
      grid[r][s] = !grid[r][s];
      c.classList.toggle('on', grid[r][s]);
      if (grid[r][s]) { try { voices[TRACKS[r].id](ac().currentTime, vols[r]); } catch (_) {} }
    }));

    /* per-line loudness sliders */
    host.querySelectorAll('.beat-vol').forEach(sl => sl.addEventListener('input', e => {
      const r = +e.target.dataset.r;
      vols[r] = (+e.target.value) / 100;
      try { voices[TRACKS[r].id](ac().currentTime, vols[r]); } catch (_) {}   // preview at new volume
    }));

    const playBtn = $('[data-b="play"]');
    function stepInterval() { return (60 / tempo) / 4 * 1000; } // 16th notes
    function tick() {
      const a = ac(); const t = a ? a.currentTime : 0;
      TRACKS.forEach((tr, r) => { if (grid[r][curStep]) { try { voices[tr.id](t, vols[r]); } catch (_) {} } });
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
      const usedLines = grid.filter(row => row.some(Boolean)).length;
      const energy = density < 0.14 ? 'calm and spacious' : density < 0.32 ? 'steady and grounded' : 'bold and driving';
      const feel = groove > 0.55 ? 'playful, syncopated groove' : 'strong, on-the-beat pulse';
      const layers = usedLines >= 5 ? 'a rich, layered' : usedLines >= 3 ? 'a balanced' : 'a focused';
      const feedback = `Your rhythm is ${energy}, with ${layers} sound and a ${feel}. ${kicks >= 4 ? 'A firm heartbeat of kicks anchors it' : 'Gentle low beats give it room to breathe'} — ${usedLines} instruments, ${tempo} BPM. There is no wrong rhythm; this one is yours. 🥁`;
      return { hits, lines: usedLines, density: +density.toFixed(2), tempo, groove: +groove.toFixed(2), feedback };
    }

    /* ── Render the pattern to a small PNG so it saves & displays ── */
    function renderPNG() {
      const cw = 520, pad = 8, cols = STEPS, rows = TRACKS.length;
      const rowH = 20, top = 30, ch = top + rows * rowH + pad;
      const cvs = document.createElement('canvas'); cvs.width = cw; cvs.height = ch;
      const x = cvs.getContext('2d');
      x.fillStyle = '#160427'; x.fillRect(0, 0, cw, ch);
      x.fillStyle = '#fff'; x.font = 'bold 15px Poppins, sans-serif'; x.fillText('My Rhythm — MojaMind 🥁', pad, 20);
      const gx = 70, gw = (cw - gx - pad) / cols;
      TRACKS.forEach((tr, r) => {
        const py = top + r * rowH;
        x.fillStyle = tr.c; x.font = 'bold 11px Poppins, sans-serif';
        x.fillText(`${r + 1} ${tr.name}`, pad, py + rowH - 6);
        for (let s = 0; s < cols; s++) {
          const px = gx + s * gw;
          x.fillStyle = grid[r][s] ? tr.c : 'rgba(255,255,255,0.06)';
          x.globalAlpha = grid[r][s] ? (0.4 + vols[r] * 0.6) : 1;   // loudness shown as brightness
          x.fillRect(px + 1, py + 2, gw - 2, rowH - 4);
          x.globalAlpha = 1;
        }
      });
      return cvs.toDataURL('image/png');
    }

    $('[data-b="save"]').addEventListener('click', () => {
      const hits = grid.flat().filter(Boolean).length;
      if (!hits) { try { if (typeof toast === 'function') toast('Tap a few squares to make a beat first 🥁'); } catch (_) {} return; }
      stop();
      const analysis = analyse();
      onSave && onSave(renderPNG(), { pattern: grid, volumes: vols, ...analysis });
    });

    return { stop };
  }

  return { open };
})();

globalThis.MMBeat = MMBeat;
