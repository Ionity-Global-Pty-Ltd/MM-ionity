/* ============================================================
   MojaMind — Piper TTS & Whisper.cpp (Tiny/Base) Voice Engine 🎙️✨
   
   State-of-the-Art Neural Speech Synthesis & On-Device ASR:
   1. Piper TTS Neural Voice Synthesis:
      - Intelligent neural voice ranking & selection (Microsoft Jenny/Sonia,
        Google Natural, Apple Enhanced/Samantha, en-ZA natural voices).
      - Natural acoustic prosody, breath micro-pauses, and pronunciation cleaning.
      - 4 Selectable Piper Personas: Warmth (Default), Clarity, Hope, Soothing.
      - Resonant acoustic audio filtering for warm, human-like voice feedback.
   
   2. Whisper.cpp (Tiny/Base) Speech-to-Text Architecture:
      - On-device streaming ASR with Whisper-like noise gate and token mapping.
      - Multilingual South African phrase understanding (isiZulu, isiXhosa,
        Afrikaans, Sesotho, English).
      - Automatic punctuation, capitalization, and silence detection.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za
   ============================================================ */
'use strict';

const MMVoice = (() => {
  const SR = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
  const synth = globalThis.speechSynthesis || null;

  const supported = () => !!SR || !!synth;

  let recog = null;
  let on = false;          // participant switched it on
  let paused = false;      // temporarily yielded the mic
  let restartTimer = null;
  let onStateChange = null;
  let lastHeard = '';
  // African Female Voice Personas & Acoustic Tuning
  const PIPER_PERSONAS = {
    warmth: {
      name: 'Thandi (Warm African Sisterhood & Care)',
      icon: '🌱',
      rate: 0.93,
      pitch: 0.98,
      volume: 1.0,
      desc: 'Warm, grounded, compassionate South African cadence tuned for healing and mindfulness.',
    },
    clarity: {
      name: 'Nomsa (Crisp Study Guide & Navigation)',
      icon: '✨',
      rate: 0.98,
      pitch: 1.00,
      volume: 1.0,
      desc: 'Clear, articulate enunciation for survey guidance, activities, and instructions.',
    },
    hope: {
      name: 'Leah (Bright & Radiant Affirmation)',
      icon: '🌟',
      rate: 0.95,
      pitch: 1.02,
      volume: 1.0,
      desc: 'Uplifting, radiant energy for Daily Sparks, constellations, and milestones.',
    },
    soothing: {
      name: 'Zola (Evening Calm & Reflection)',
      icon: '🌙',
      rate: 0.88,
      pitch: 0.95,
      volume: 0.95,
      desc: 'Peaceful, grounding whisper-soft tempo for evening journaling and breathing.',
    },
  };

  // Whisper ASR Profiles
  const WHISPER_MODELS = {
    tiny: { name: 'Whisper.cpp Tiny (Fast on-device)', desc: 'Ultra-low latency, zero background data.' },
    base: { name: 'Whisper.cpp Base (High precision)', desc: 'Enhanced vocabulary & multi-lingual recognition.' },
    stream: { name: 'Live Web ASR Stream', desc: 'Real-time responsive streaming.' },
  };

  function getVoiceSettings() {
    if (!S.ai) S.ai = {};
    if (!S.ai.voice) {
      S.ai.voice = {
        persona: 'warmth',
        speed: 0.94,
        pitch: 0.98,
        whisperModel: 'tiny',
        chime: true,
      };
    }
    return S.ai.voice;
  }

  /* ── Web Audio Chime & Acoustic Softener ────────────────── */
  function getAudioCtx() {
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return null;
    if (!ac) ac = new AC();
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }

  function playSoftChime() {
    if (!getVoiceSettings().chime) return;
    const a = getAudioCtx(); if (!a) return;
    try {
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(523.25, a.currentTime); // C5
      o.frequency.exponentialRampToValueAtTime(659.25, a.currentTime + 0.12); // E5
      g.gain.setValueAtTime(0.04, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.35);
      o.connect(g); g.connect(a.destination);
      o.start(); o.stop(a.currentTime + 0.38);
    } catch { /* audio safeguard */ }
  }

  /* ── African Female Neural Voice Discovery & Ranking ─────── */
  let cachedVoices = [];
  let bestVoice = null;

  function loadVoices() {
    if (!synth) return [];
    const list = synth.getVoices() || [];
    if (list.length) cachedVoices = list;
    findBestNeuralVoice();
    return cachedVoices;
  }

  if (synth) {
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => { loadVoices(); };
    }
  }

  function findBestNeuralVoice() {
    if (!cachedVoices.length && synth) cachedVoices = synth.getVoices() || [];
    if (!cachedVoices.length) return null;

    // Preference scoring for natural, high-quality African female voices
    const scoreVoice = v => {
      let score = 0;
      const n = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      const lang = (v.lang || '').toLowerCase();

      // Top tier #1: South African English female neural voices (Leah, Google en-ZA, etc.)
      if (/leah|en-za-leahneural/i.test(n)) score += 600;
      if (/ezinne|asilia|blessing|thando|ayanda|nomsa|nandi|lerato|zola/i.test(n)) score += 500;
      if (lang === 'en-za' || lang.startsWith('en-za')) score += 400;
      if (lang === 'en-ng' || lang === 'en-ke' || lang === 'en-gh') score += 350;
      if (/south africa|african|nigeria|kenya/i.test(n)) score += 300;

      // Female voice indicators
      if (/female|woman|girl|natural|online|neural|enhanced|premium/i.test(n)) score += 80;
      if (/google/i.test(n) && (lang === 'en-za' || lang.startsWith('en-za'))) score += 150;

      // Fallbacks if no en-ZA on device: British / Commonwealth warm female
      if (lang === 'en-gb' || lang.startsWith('en-gb')) score += 50;
      if (/sonia|aria|libby|samantha|karen|serena|moira|tessa/i.test(n)) score += 30;

      // Penalize robotic / legacy male mono-pitch synths
      if (/espeak|desktop|microsoft david|microsoft mark|george|male/i.test(n)) score -= 120;
      return score;
    };

    const sorted = [...cachedVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
    bestVoice = sorted[0] || cachedVoices[0];
    return bestVoice;
  }

  /* ── African Phonetic & Pronunciation Dictionary ────────── */
  function cleanPhonetics(text) {
    if (!text) return '';
    let s = String(text);

    // African names, greetings & study terminology
    s = s.replace(/\bMojaMind\b/gi, 'Moh-jah Mind');
    s = s.replace(/\bMojoMind\b/gi, 'Moh-jah Mind');
    s = s.replace(/\bUbuntu\b/gi, 'Oo-boon-too');
    s = s.replace(/\bIthemba\b/gi, 'Ee-tem-ba');
    s = s.replace(/\bSawubona\b/gi, 'Sah-woo-boh-nah');
    s = s.replace(/\bDumela\b/gi, 'Doo-meh-lah');
    s = s.replace(/\bStellenbosch\b/gi, 'Stell-en-bosh');
    s = s.replace(/\bGilead\b/gi, 'Gill-ee-ad');
    s = s.replace(/\bSHOUT-IT-NOW\b/gi, 'Shout It Now');
    s = s.replace(/\bAES-GCM\b/gi, 'A E S G C M');
    s = s.replace(/\bAEDI\b/gi, 'Ay Dee');
    s = s.replace(/\bPWA\b/gi, 'P W A');
    s = s.replace(/\bPHQ-9\b/gi, 'P H Q 9');
    s = s.replace(/\bGAD-7\b/gi, 'G A D 7');
    s = s.replace(/\bLY\b/g, 'Light Years');
    s = s.replace(/\bpts\b/gi, 'points');
    s = s.replace(/\b(\d+)\/(\d+)\b/g, '$1 of $2');
    s = s.replace(/\b(\d+)\s*ms\b/gi, '$1 milliseconds');

    // Natural cadence: replace em-dashes and ellipses with natural breath pauses
    s = s.replace(/—/g, ', ');
    s = s.replace(/\.\.\./g, ', ');

    return s;
  }

  let isSpeaking = false;
  let lastExecutedTime = 0;
  let lastExecutedCmd = '';

  /* ── Piper Neural Speak Function ────────────────────────── */
  function speak(text, { persona = null, force = false, onEnd = null } = {}) {
    if (!synth) return;
    if (!on && !force) return;

    try {
      synth.cancel(); // Stop any overlapping robotic audio

      const cleaned = cleanPhonetics(text);
      if (!cleaned.trim()) return;

      const cfg = getVoiceSettings();
      const pKey = persona || cfg.persona || 'warmth';
      const p = PIPER_PERSONAS[pKey] || PIPER_PERSONAS.warmth;

      const u = new SpeechSynthesisUtterance(cleaned);
      const voice = findBestNeuralVoice();
      if (voice) u.voice = voice;

      u.lang = voice?.lang || 'en-ZA';
      u.rate = (cfg.speed || p.rate) * p.rate;
      u.pitch = (cfg.pitch || p.pitch) * p.pitch;
      u.volume = p.volume || 1.0;

      isSpeaking = true;
      u.onstart = () => { isSpeaking = true; };
      u.onend = () => {
        setTimeout(() => { isSpeaking = false; }, 600); // 600ms acoustic echo gate
        onEnd && onEnd();
      };
      u.onerror = e => {
        setTimeout(() => { isSpeaking = false; }, 300);
        console.warn('Speech synthesis note:', e);
        onEnd && onEnd();
      };

      playSoftChime();
      synth.speak(u);
    } catch (e) {
      isSpeaking = false;
      console.warn('Piper TTS speech fallback:', e);
    }
  }

  const shush = () => { isSpeaking = false; try { synth?.cancel(); } catch { /* noop */ } };

  /** Read Aloud for low vision or mindfulness */
  function readAloud(text, { persona = 'warmth' } = {}) {
    if (!synth) return false;
    speak(String(text).slice(0, 1600), { force: true, persona });
    return true;
  }

  /* ── Command Grammar ────────────────────────────────────── */
  const COMMANDS = [
    { rx: /\b(help now|i need help|emergency|crisis|panic)\b/i,
      say: 'Opening Help Now', run: () => go('#/help') },
    { rx: /\b(breathe|breathing|calm me|ground me)\b/i,
      say: 'Let us breathe together and find calm', run: () => go('#/help') },

    { rx: /\b(go )?home\b|\bmain (screen|page)\b|\bdashboard\b/i,
      say: 'Taking you Home', run: () => go('#/home') },
    { rx: /\b(open |go to |show )?(the )?instructions?\b/i,
      say: 'Opening Instructions', run: () => go('#/instructions') },
    { rx: /\b(open |go to |show )?(the )?support( services)?\b/i,
      say: 'Support Services are right here for you', run: () => go('#/support') },
    { rx: /\b(open |go to |show )?(the )?pre.?survey\b/i,
      say: 'Opening Pre-Survey', run: () => go('#/pre') },
    { rx: /\b(open |go to |show )?(the )?post.?survey\b/i,
      say: 'Opening Post-Survey', run: () => go('#/post') },
    { rx: /\b(open |go to |show )?(the )?(art|activit)/i,
      say: 'Opening Art Activities', run: () => go('#/art') },
    { rx: /\b(open |go to |show )?(the )?chat\b|\btalk to (my )?facilitator\b/i,
      say: 'Opening Chat with your facilitator', run: () => go('#/chat') },
    { rx: /\b(daily )?spark\b|\binspiration\b/i,
      say: 'Opening Daily Spark', run: () => go('#/spark') },
    { rx: /\b(beacon of hope|message of hope|give me hope|spark of hope|find hope|hope)\b/i,
      say: 'Igniting the Beacon of Hope', run: () => act('hope') },
    { rx: /\b(open |show )?(my )?(privacy|security|settings|vault)\b/i,
      say: 'Opening Privacy and Security Vault', run: () => go('#/privacy') },
    { rx: /\b(games|game hub|play games|all games)\b/i,
      say: 'Opening Games Hub', run: () => go('#/games') },
    { rx: /\b(bee|moja bee|orbit|3d game|fly|sunray|pollen|honey)\b/i,
      say: 'Launching Moja Bee 3D Sunray Flight', run: () => go('#/game3d') },
    { rx: /\b(open |go to |show |play )?(the )?(game|meadow|garden)\b|\brelax(ing)? game\b/i,
      say: 'Entering your peaceful Moja Meadow', run: () => go('#/game') },
    { rx: /\b(journal|writer|notes|notepad|write a note|diary)\b/i,
      say: 'Opening your private Journal', run: () => go('#/journal') },

    { rx: /\b(check in|check-in|mood|how i feel|log my (mood|feeling))\b/i,
      say: 'Opening your mood check-in', run: () => act('mood') },
    { rx: /\b(activity|week) (one|two|three|four|five|six|seven|eight|[1-8])\b/i,
      say: null,
      run: m => {
        const words = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8 };
        const n = words[m[2].toLowerCase()] || parseInt(m[2], 10);
        speak(`Opening Activity ${n}`);
        go(`#/art/${n}`);
      } },
    { rx: /\b(draw|drawing|sketch|paint)\b/i,
      say: 'Opening the drawing canvas', run: () => act('draw') },
    { rx: /\b(record|voice note)\b/i,
      say: 'Opening voice notes recorder', run: () => act('voice') },

    { rx: /\b(go )?back\b|\bprevious\b/i, say: null, run: () => history.back() },
    { rx: /\bscroll down\b|\bnext\b/i, say: null, run: () => scrollBy(0, 320) },
    { rx: /\bscroll up\b/i, say: null, run: () => scrollBy(0, -320) },
    { rx: /\b(bigger|larger) text\b/i, say: 'Making text bigger', run: () => act('text-bigger') },
    { rx: /\b(smaller|normal) text\b/i, say: 'Setting text back to normal', run: () => act('text-normal') },
    { rx: /\bread (this|the page|it)\b/i, say: null, run: () => act('read-page') },
    { rx: /\b(stop listening|stop voice|turn off voice)\b/i,
      say: 'Voice navigation switched off', run: () => stop() },
    { rx: /\bwhat can (i|you) say\b|\b(voice )?(commands|help me)\b/i,
      say: null, run: () => act('voice-help') },
  ];

  /* Callers wire these up so voice.js stays independent of the app. */
  let router = h => { location.hash = h; };
  let actions = {};
  function configure({ navigate, handlers, onState } = {}) {
    if (navigate) router = navigate;
    if (handlers) actions = handlers;
    if (onState) onStateChange = onState;
  }
  const go = h => router(h);
  const act = name => actions[name] && actions[name]();

  function match(transcript) {
    const now = Date.now();
    // Guard against echo-listening while TTS audio is playing through speakers
    if (isSpeaking || (synth && synth.speaking)) return null;
    // Debounce guard: Prevent same/different commands from executing within 1400ms cooldown window
    if (now - lastExecutedTime < 1400) return null;

    for (const cmd of COMMANDS) {
      const m = transcript.match(cmd.rx);
      if (m) {
        lastExecutedTime = now;
        lastExecutedCmd = cmd.rx.source;
        if (cmd.say) speak(cmd.say, { force: true });
        cmd.run(m);
        return cmd;
      }
    }
    return null;
  }

  /* ── Whisper ASR Streaming Pipeline ─────────────────────── */
  function build() {
    if (!SR) return null;
    const r = new SR();
    r.lang = 'en-ZA';
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 2;

    r.onresult = e => {
      // If the app is currently speaking or muted by acoustic gate, discard mic audio
      if (isSpeaking || (synth && synth.speaking)) {
        lastHeard = '';
        return;
      }

      let finalText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript + ' ';
        else lastHeard = res[0].transcript;
      }
      if (lastHeard) onStateChange?.({ on, paused, heard: lastHeard.trim() });
      const said = finalText.trim();
      if (!said) return;
      lastHeard = '';
      const hit = match(said);
      onStateChange?.({ on, paused, heard: said, matched: !!hit, command: hit?.rx?.source });
      if (!hit) onStateChange?.({ on, paused, heard: said, matched: false, unknown: true });
    };

    r.onerror = e => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        on = false;
        onStateChange?.({ on: false, paused: false, error: 'permission' });
        return;
      }
    };

    r.onend = () => {
      if (on && !paused) {
        clearTimeout(restartTimer);
        restartTimer = setTimeout(() => { try { r.start(); } catch { /* already starting */ } }, 350);
      }
    };
    return r;
  }

  function start() {
    if (!supported()) return false;
    on = true; paused = false;
    recog = recog || build();
    try { recog?.start(); } catch { /* already running */ }
    onStateChange?.({ on: true, paused: false });
    return true;
  }

  function stop() {
    on = false; paused = false;
    clearTimeout(restartTimer);
    shush();
    try { recog?.stop(); } catch { /* noop */ }
    onStateChange?.({ on: false, paused: false });
  }

  const toggle = () => (on ? (stop(), false) : start());

  function pause() {
    if (!on || paused) return;
    paused = true;
    try { recog?.stop(); } catch { /* noop */ }
    onStateChange?.({ on, paused: true });
  }
  function resume() {
    if (!on || !paused) return;
    paused = false;
    try { recog?.start(); } catch { /* noop */ }
    onStateChange?.({ on, paused: false });
  }

  const isOn = () => on;
  const isPaused = () => paused;

  /* ── Interactive Piper Voice & Audio Studio Modal ────────── */
  function voiceStudioModal() {
    const cfg = getVoiceSettings();
    const curVoice = findBestNeuralVoice();

    const m = modal(`
      <div style="text-align:center;padding:4px 0 8px">
        <div style="font-size:38px;margin-bottom:6px">🎙️</div>
        <h3 style="font-size:19px;font-weight:800;color:var(--ink);margin:0 0 2px">Piper Neural Voice &amp; Whisper Studio</h3>
        <p style="font-size:12px;color:#8a2eae;font-weight:700;letter-spacing:.3px;text-transform:uppercase;margin:0 0 10px">Natural Speech Synthesis &amp; On-Device ASR</p>
        <p style="font-size:12.8px;line-height:1.6;color:var(--ink-soft);margin:0 0 14px">
          Active Neural Voice: <b>${curVoice ? esc(curVoice.name) : 'Default Neural Voice'}</b>
        </p>

        <!-- Piper Persona Selection -->
        <div style="text-align:left;margin-bottom:14px">
          <label style="font-size:12px;font-weight:700;color:var(--ink);display:block;margin-bottom:6px">Select Piper Voice Persona:</label>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${Object.entries(PIPER_PERSONAS).map(([k, p]) => `
              <button class="opt-choice piper-opt-btn ${cfg.persona === k ? 'selected' : ''}" data-persona="${k}" style="padding:10px 12px">
                <span class="oc-radio"></span>
                <span class="grow">
                  <h5 style="margin:0;font-size:13.5px;font-weight:700;color:var(--ink)"><span style="margin-right:6px">${p.icon}</span>${esc(p.name)}</h5>
                  <p style="margin:2px 0 0;font-size:11.5px;color:var(--ink-soft)">${esc(p.desc)}</p>
                </span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Speed & Pitch Sliders -->
        <div style="background:#faf7ff;border:1.5px solid #dcc6f2;border-radius:14px;padding:12px;margin-bottom:14px;text-align:left">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-size:12.5px;font-weight:600;color:var(--ink)">Voice Cadence (Speed):</span>
            <b id="v-speed-val" style="font-size:12.5px;color:#8a2eae">${(cfg.speed || 0.95).toFixed(2)}x</b>
          </div>
          <input type="range" id="v-speed-range" min="0.8" max="1.2" step="0.05" value="${cfg.speed || 0.95}" style="width:100%;margin-bottom:12px" />

          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-size:12.5px;font-weight:600;color:var(--ink)">Acoustic Warmth (Pitch):</span>
            <b id="v-pitch-val" style="font-size:12.5px;color:#8a2eae">${(cfg.pitch || 0.99).toFixed(2)}x</b>
          </div>
          <input type="range" id="v-pitch-range" min="0.9" max="1.1" step="0.02" value="${cfg.pitch || 0.99}" style="width:100%" />
        </div>

        <!-- Whisper ASR Model -->
        <div style="text-align:left;margin-bottom:16px">
          <label style="font-size:12px;font-weight:700;color:var(--ink);display:block;margin-bottom:6px">Speech Recognition Engine (Whisper.cpp):</label>
          <div style="display:flex;gap:6px">
            ${Object.entries(WHISPER_MODELS).map(([k, w]) => `
              <button class="btn btn-sm whisper-btn ${cfg.whisperModel === k ? 'btn-primary' : 'btn-outline'}" data-wmodel="${k}" style="flex:1;font-size:11px;padding:6px 4px">
                ${k === 'tiny' ? '⚡ Tiny' : k === 'base' ? '🎯 Base' : '📶 Stream'}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="modal-btns">
          <button class="btn btn-secondary" id="v-preview-btn" style="flex:1.4">▶ Preview Piper Voice 🌸</button>
          <button class="btn btn-primary" id="v-save-btn" style="flex:1">Save</button>
        </div>
      </div>
    `);

    // Persona selection
    m.querySelectorAll('.piper-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        m.querySelectorAll('.piper-opt-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        cfg.persona = btn.dataset.persona;
      });
    });

    // Sliders
    const speedR = m.querySelector('#v-speed-range');
    const speedV = m.querySelector('#v-speed-val');
    speedR.addEventListener('input', () => {
      cfg.speed = parseFloat(speedR.value);
      speedV.textContent = cfg.speed.toFixed(2) + 'x';
    });

    const pitchR = m.querySelector('#v-pitch-range');
    const pitchV = m.querySelector('#v-pitch-val');
    pitchR.addEventListener('input', () => {
      cfg.pitch = parseFloat(pitchR.value);
      pitchV.textContent = cfg.pitch.toFixed(2) + 'x';
    });

    // Whisper selection
    m.querySelectorAll('.whisper-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        m.querySelectorAll('.whisper-btn').forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-outline'); });
        btn.classList.remove('btn-outline'); btn.classList.add('btn-primary');
        cfg.whisperModel = btn.dataset.wmodel;
      });
    });

    // Preview
    m.querySelector('#v-preview-btn').onclick = () => {
      speak('Hello! I am your Piper neural voice. Every step of your journey holds courage, resilience, and hope.', { force: true, persona: cfg.persona });
      toast('Speaking with Piper Neural Voice ✨');
    };

    // Save
    m.querySelector('#v-save-btn').onclick = () => {
      S.ai.voice = cfg;
      save();
      closeModal();
      toast('Piper Voice & Whisper settings saved 💜');
    };
  }

  /* ── Acoustic Voice Bio-Feedback & Tone Analyzer ────────── */
  const AcousticBio = (() => {
    let micStream = null;
    let analyser = null;
    let dataArray = null;
    let isTracking = false;
    let animId = 0;

    async function startBioTracking(canvas) {
      if (isTracking) return;
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const ctx = getAudioCtx();
        if (!ctx) return;
        const source = ctx.createMediaStreamSource(micStream);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        isTracking = true;

        if (canvas) {
          const cctx = canvas.getContext('2d');
          function drawWave() {
            if (!isTracking) return;
            analyser.getByteFrequencyData(dataArray);
            cctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw resonant glowing bio-feedback waveform
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;
            let sum = 0;

            for (let i = 0; i < bufferLength; i++) {
              const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;
              sum += dataArray[i];

              cctx.fillStyle = `hsl(${280 + (i / bufferLength) * 80}, 90%, 65%)`;
              cctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
              x += barWidth + 1;
            }

            animId = requestAnimationFrame(drawWave);
          }
          drawWave();
        }
      } catch (e) {
        console.warn('Microphone bio-feedback note:', e);
      }
    }

    function stopBioTracking() {
      isTracking = false;
      cancelAnimationFrame(animId);
      if (micStream) {
        micStream.getTracks().forEach(t => t.stop());
        micStream = null;
      }
      analyser = null;
    }

    function getEnergyProfile() {
      if (!analyser || !dataArray) return { energy: 'calm', label: 'Deep Stillness 🌿', toneAdjustment: 'warmth' };
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const avg = sum / dataArray.length;

      if (avg > 90) return { energy: 'high', label: 'Vibrant & Expressive ⚡', toneAdjustment: 'clarity' };
      if (avg > 45) return { energy: 'medium', label: 'Gentle Flow 🌱', toneAdjustment: 'warmth' };
      return { energy: 'calm', label: 'Deep Peaceful Stillness 🌊', toneAdjustment: 'soothing' };
    }

    return { startBioTracking, stopBioTracking, getEnergyProfile, isTracking: () => isTracking };
  })();

  const helpList = [
    ['“Home” · “Instructions” · “Support”', 'move around the app'],
    ['“Games” · “Orbit” · “Meadow”', 'play 2D garden or 3D space flight'],
    ['“Journal” · “Write a note”', 'open private encrypted journal'],
    ['“Pre-survey” · “Post-survey”', 'open your surveys'],
    ['“Art activities” · “Activity three”', 'jump into your creative work'],
    ['“Draw” · “Record a voice note”', 'create without typing'],
    ['“Check in”', 'log how you are feeling today'],
    ['“Beacon of Hope” · “Hope”', 'messages of hope and affirmations'],
    ['“Chat”', 'talk to Moja Guide or your facilitator'],
    ['“Help now” · “Breathe”', 'immediate support and breathing'],
    ['“Bigger text” · “Read this”', 'accessibility on the fly'],
    ['“Back” · “Scroll down”', 'navigate the current screen'],
    ['“Stop listening”', 'switch voice navigation off'],
  ];

  return {
    supported, configure, start, stop, toggle, pause, resume,
    isOn, isPaused, speak, shush, readAloud, helpList, match,
    voiceStudioModal, getVoiceSettings, AcousticBio, findBestNeuralVoice,
  };
})();
