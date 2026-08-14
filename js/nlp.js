/* ============================================================
   MojaMind — on-device language understanding

   Two backends, and the app is always honest about which one
   answered:

   1. MojaLex (built in, ~12 KB, always available, zero data)
      A lexicon + n-gram scorer with negation, intensifier and
      emoji handling, tuned for South African English with
      isiZulu / isiXhosa / Afrikaans / Sesotho greetings and
      feeling words. Runs in well under a millisecond, works
      offline, and never leaves the phone.

   2. Quantized transformer (optional, opt-in, one-time
      download) — DistilBERT SST-2 int8 (~28 MB) or MobileBERT
      int8 (~25 MB) executed locally with transformers.js on
      ONNX Runtime Web. Nothing is uploaded: the model comes
      down once, is cached for offline use, and inference then
      happens on the device like MojaLex.

      A transformer of this size cannot be inlined into the
      HTML — the weights are tens of megabytes — so it is
      fetched on demand, only when the participant asks for it,
      and only over a connection they choose. On a DataFree /
      voucher plan MojaLex stays the default.

   Both backends return the same shape, so callers never care
   which one ran.
   © IONITY Global (Pty) Ltd.
   ============================================================ */
'use strict';

const MMNLP = (() => {

  /* ── MojaLex lexicon ─────────────────────────────────────
     Weights are -3 (severe distress) … +3 (strong positive).  */
  const LEX = {
    // Distress & low mood
    sad: -2, unhappy: -2, depress: -3, depressed: -3, depressing: -2, down: -1.5,
    hopeless: -3, worthless: -3, useless: -2.5, empty: -2, numb: -2, hollow: -2,
    lonely: -2.5, alone: -1.5, isolated: -2, abandoned: -2.5, rejected: -2,
    cry: -2, crying: -2, tears: -1.5, weeping: -2, hurt: -2, hurting: -2, pain: -2,
    tired: -1.5, exhausted: -2, drained: -2, weary: -1.5, sleepless: -1.5,
    heavy: -1.5, struggling: -2, struggle: -2, suffering: -2.5, broken: -2.5,
    ashamed: -2, shame: -2, guilty: -2, guilt: -2, embarrassed: -1.5,
    stigma: -2, judged: -1.8, discriminated: -2.2, rejected_by: -2,
    // Anxiety
    anxious: -2, anxiety: -2, nervous: -1.5, worried: -1.8, worry: -1.8,
    scared: -2, afraid: -2, fear: -2, terrified: -2.5, panic: -2.5, panicking: -2.5,
    stress: -1.8, stressed: -2, overwhelmed: -2.5, overwhelming: -2.2,
    restless: -1.5, tense: -1.5, dread: -2.2, uneasy: -1.5,
    // Anger / frustration
    angry: -1.8, anger: -1.8, furious: -2, irritated: -1.4, annoyed: -1.2,
    frustrated: -1.6, frustrating: -1.5, hate: -2, sick_of: -1.8, fedup: -1.8,
    // Positive
    happy: 2, glad: 1.8, joy: 2.5, joyful: 2.5, excited: 2.2, exciting: 2,
    good: 1.5, great: 2, wonderful: 2.5, amazing: 2.5, awesome: 2.5, lovely: 2,
    beautiful: 2, better: 1.5, healing: 2, healed: 2.2, hopeful: 2.5, hope: 2.4, hoping: 2.2,
    proud: 2.2, pride: 2, grateful: 2.4, thankful: 2.4, blessed: 2.2, gratitude: 2.4,
    strong: 2, stronger: 2.2, strength: 2, brave: 2.2, courage: 2.2, resilient: 2.4,
    calm: 1.8, peaceful: 2, peace: 2, relaxed: 1.8, safe: 1.8, comfortable: 1.5,
    love: 2.4, loved: 2.4, loving: 2.2, care: 1.6, cared: 1.8, supported: 2,
    enjoy: 2, enjoyed: 2, fun: 1.8, laugh: 2, laughing: 2, smile: 1.8, smiling: 1.8,
    inspired: 2.2, motivated: 2, determined: 2, confident: 2, capable: 1.8,
    faith: 2.2, believe: 2.0, light: 1.8, sunrise: 1.8, dawn: 1.8, blossom: 2.0,
    // Multilingual feeling & greeting words (SA)
    sawubona: .5, molo: .5, dumela: .5, howzit: .5, heita: .5, unjani: .3,
    ngiyabonga: 2, enkosi: 2, dankie: 2, baie: 0, lekker: 2, jammer: -1.2,
    hartseer: -2.2, bang: -2, moeg: -1.5, sterk: 2, dankbaar: 2.4, bly: 1.8,
    kwaai: 1.5, hayibo: -.5, eish: -1, shame: -.8, sharp: 1, yebo: .5,
    ithemba: 2.5, temba: 2.4, tsholofelo: 2.5, tsepiso: 2.2, hoop: 2.4,
    // Recovery / adherence context
    adherence: .5, medication: 0, treatment: 0, clinic: 0, viral: 0,
    undetectable: 2, healthy: 1.8, wellness: 1.6, recovery: 1.8, coping: 1,
    relapse: -2, defaulted: -1.8, skipped: -1.2, missed: -1,
  };

  const INTENSIFIERS = {
    very: 1.5, really: 1.45, so: 1.35, extremely: 1.8, incredibly: 1.7,
    totally: 1.5, completely: 1.6, absolutely: 1.6, super: 1.5, too: 1.35,
    always: 1.5, constantly: 1.6, deeply: 1.6, terribly: 1.7, baie: 1.5,
    slightly: .6, somewhat: .7, kinda: .7, bit: .6, little: .65, sometimes: .7,
  };

  const NEGATORS = /^(not|no|never|none|cannot|cant|can't|dont|don't|doesnt|doesn't|didnt|didn't|wont|won't|isnt|isn't|aint|ain't|nothing|nie|geen|hayi|asikho)$/i;

  const EMOJI = {
    '😊': 2, '🙂': 1.5, '😀': 2, '😃': 2, '😄': 2.2, '😁': 2, '🥰': 2.5, '😍': 2.5,
    '❤️': 2.2, '💜': 2.2, '💛': 2, '🌸': 1.6, '🌻': 1.8, '✨': 1.6, '🎉': 2.2,
    '🙏': 1.4, '💪': 2, '🔥': 1.5, '👍': 1.6, '🌈': 1.8, '☀️': 1.6,
    '😢': -2, '😭': -2.5, '😞': -2, '😔': -2, '☹️': -2, '🙁': -1.5, '😩': -2.2,
    '😫': -2.2, '😰': -2.4, '😨': -2.4, '😱': -2.5, '💔': -2.6, '😡': -2, '😠': -1.8,
  };

  /* Crisis language — deliberately high-recall. A false positive
     costs a gentle "are you okay?"; a false negative costs far more. */
  const CRISIS = [
    /\bsuicid/i, /\bkill (myself|me)\b/i, /\bend (it all|my life|it)\b/i,
    /\btake my (own )?life\b/i, /\bself.?harm/i, /\bharm (myself|me)\b/i,
    /\bhurt(ing)? myself\b/i, /\bcut(ting)? myself\b/i,
    /\bdon'?t want to (live|be here|wake up|exist)\b/i,
    /\bno (reason|point) (to|in) (liv|go)/i, /\bbetter off dead\b/i,
    /\bwant to die\b/i, /\boverdose\b/i, /\bgive up on life\b/i,
    /\bnobody would miss me\b/i, /\bworld would be better without me\b/i,
  ];

  const URGENT = [
    /\b(can'?t|cannot|can not) (cope|go on|do this|handle (it|this)|take (it|this)( anymore)?)\b/i,
    /\b(can'?t|cannot) (take|bear|carry) (it|this) (anymore|any more|any longer)\b/i,
    /\bbreaking down\b/i, /\bpanic attack\b/i, /\bfalling apart\b/i, /\brock bottom\b/i,
    /\bnothing matters\b/i, /\bgiving up\b/i, /\bat my (limit|breaking point)\b/i,
    /\bno one (cares|would care)\b/i, /\bnobody cares\b/i,
  ];

  const clean = t => String(t || '').toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^\p{L}\p{N}\s'@:.!?-]/gu, ' ');

  function tokens(text) {
    return clean(text).split(/\s+/).filter(Boolean);
  }

  /** Stem just enough to catch the common English inflections. */
  function root(w) {
    if (LEX[w] != null) return w;
    for (const suf of ['ing', 'ed', 'es', 's', 'ly']) {
      if (w.endsWith(suf)) {
        const base = w.slice(0, -suf.length);
        if (LEX[base] != null) return base;
        if (LEX[base + 'e'] != null) return base + 'e';
      }
    }
    // Prefix match for long stems: "depressing" → "depress"
    for (const k of Object.keys(LEX)) {
      if (k.length >= 5 && w.startsWith(k)) return k;
    }
    return w;
  }

  /** MojaLex sentiment: returns score in [-1, 1] plus the words that drove it. */
  function lexSentiment(text) {
    const toks = tokens(text);
    let score = 0, hits = 0;
    const drivers = [];
    for (let i = 0; i < toks.length; i++) {
      const w = root(toks[i]);
      let val = LEX[w];
      if (val == null || val === 0) continue;
      let mult = 1;
      // Look back two words for negation / intensity.
      for (let back = 1; back <= 2 && i - back >= 0; back++) {
        const prev = toks[i - back];
        if (NEGATORS.test(prev)) { mult *= -0.85; break; }
        if (INTENSIFIERS[prev] != null) mult *= INTENSIFIERS[prev];
      }
      const contribution = val * mult;
      score += contribution; hits++;
      drivers.push({ word: toks[i], value: +contribution.toFixed(2) });
    }
    for (const [emoji, val] of Object.entries(EMOJI)) {
      if (text.includes(emoji)) { score += val; hits++; drivers.push({ word: emoji, value: val }); }
    }
    if (!hits) return { score: 0, label: 'neutral', confidence: 0.2, drivers: [] };
    // Normalise by a soft length factor so long messages are not over-weighted.
    const normalised = Math.max(-1, Math.min(1, score / (3 * Math.sqrt(hits))));
    const label = normalised > .15 ? 'positive' : normalised < -.15 ? 'negative' : 'neutral';
    return {
      score: +normalised.toFixed(3),
      label,
      confidence: +Math.min(.95, .35 + Math.abs(normalised) * .6 + hits * .04).toFixed(2),
      drivers: drivers.sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 4),
    };
  }

  /** Risk triage: none | elevated | urgent | crisis. */
  function riskOf(text, sentiment) {
    if (CRISIS.some(rx => rx.test(text))) return { level: 'crisis', reason: 'crisis language' };
    if (URGENT.some(rx => rx.test(text))) return { level: 'urgent', reason: 'acute distress language' };
    if (sentiment.score <= -.55) return { level: 'elevated', reason: 'strongly negative feeling' };
    if (sentiment.score <= -.3) return { level: 'watch', reason: 'low mood' };
    return { level: 'none', reason: '' };
  }

  /* ── Optional quantized transformer backend ───────────────
     Kept entirely behind an opt-in switch: it needs a one-time
     download over the network, which participants on data
     vouchers should choose deliberately.                      */
  const MODELS = {
    mobilebert: {
      id: 'Xenova/mobilebert-uncased-finetuned-sst-2-english',
      label: 'MobileBERT Neural Engine (25M params, ~48 MB int8)',
      params: '25 Million',
      approxMB: 48,
      description: 'Task-specific on-device text processing. Powers deep sentiment analysis, entity & theme extraction (NER), and contextual question-answering over short snippets with zero cloud dependency.',
      tasks: ['Deep Sentiment Analysis', 'Resilience NER / Theme Spotting', 'Short Snippet QA', 'Cognitive Reframing'],
    },
    distilbert: {
      id: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
      label: 'DistilBERT SST-2 (66M params, ~28 MB int8)',
      params: '66 Million',
      approxMB: 28,
      description: 'Compact fast sentiment transformer for edge inference.',
      tasks: ['Sentiment Analysis'],
    },
  };
  const CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2';

  let tfPipeline = null;
  let tfLoading = null;
  let tfModelKey = null;

  const transformerReady = () => !!tfPipeline;
  const transformerInfo = () => (tfModelKey ? MODELS[tfModelKey] : null);

  /** Download + warm the quantized model. onProgress gets {status, progress}. */
  async function enableTransformer(which = 'mobilebert', onProgress) {
    if (tfPipeline && tfModelKey === which) return true;
    if (tfLoading) return tfLoading;
    const spec = MODELS[which] || MODELS.mobilebert;
    const modelKey = MODELS[which] ? which : 'mobilebert';

    tfLoading = (async () => {
      // Dynamic import keeps the library out of the critical path entirely.
      const { pipeline, env } = await import(/* webpackIgnore: true */ `${CDN}/+esm`);
      env.allowLocalModels = false;
      env.useBrowserCache = true;          // cached for offline reuse after first load
      tfPipeline = await pipeline('sentiment-analysis', spec.id, {
        dtype: 'q8',                        // int8 quantized weights
        progress_callback: p => onProgress && onProgress(p),
      });
      tfModelKey = modelKey;
      return true;
    })().catch(err => { tfPipeline = null; tfModelKey = null; throw err; })
      .finally(() => { tfLoading = null; });

    return tfLoading;
  }

  function disableTransformer() { tfPipeline = null; tfModelKey = null; }

  async function transformerSentiment(text) {
    if (!tfPipeline) return null;
    const out = await tfPipeline(text);
    const top = Array.isArray(out) ? out[0] : out;
    if (!top) return null;
    const positive = /pos/i.test(top.label);
    const signed = (positive ? 1 : -1) * top.score;
    return {
      score: +signed.toFixed(3),
      label: Math.abs(signed) < .2 ? 'neutral' : positive ? 'positive' : 'negative',
      confidence: +top.score.toFixed(2),
      drivers: [],
    };
  }

  /* ── Public analysis ─────────────────────────────────────
     Always returns instantly from MojaLex. When the optional
     transformer is loaded it refines the sentiment and the
     result reports which backend spoke.                       */
  function analyse(text) {
    const sentiment = lexSentiment(text);
    return {
      text,
      backend: 'mojalex',
      sentiment,
      risk: riskOf(text, sentiment),
      topics: topicsOf(text),
    };
  }

  async function analyseDeep(text) {
    const base = analyse(text);
    if (!tfPipeline) return base;
    try {
      const refined = await transformerSentiment(text);
      if (!refined) return base;
      // Crisis detection stays rule-based: it must never depend on a
      // model that may or may not be loaded.
      return {
        ...base,
        backend: tfModelKey,
        sentiment: { ...refined, drivers: base.sentiment.drivers },
        risk: riskOf(text, refined.score < base.sentiment.score ? refined : base.sentiment),
      };
    } catch { return base; }
  }

  /* Lightweight topic spotting for the guide's "what is this about". */
  const TOPICS = {
    medication: /medicat|pill|arv|anti.?retro|treatment|dose|adherence|clinic/i,
    family: /family|mother|father|mom|mum|dad|sister|brother|child|gogo|ouma/i,
    work: /work|job|employ|unemploy|money|income|salary|study|school|college/i,
    relationships: /partner|boyfriend|girlfriend|husband|wife|relationship|friend/i,
    stigma: /stigma|judge|discriminat|ashamed|hide|secret|disclos/i,
    art: /draw|paint|art|colour|color|creat|write|poem|song|music|sketch/i,
    hope: /hope|hopeful|ithemba|temba|tsholofelo|tsepiso|hoop|better days|faith|future|dream|dawn|light/i,
    app: /app|button|upload|screen|login|sign in|password|crash|bug|slow/i,
    sleep: /sleep|insomnia|awake|nightmare|rest|tired/i,
  };

  function topicsOf(text) {
    if (!text) return [];
    const out = [];
    for (const [k, rx] of Object.entries(TOPICS)) {
      if (rx.test(text)) out.push(k);
    }
    return out;
  }

  /* ── Resilience Themes & Constellation ────────────────── */
  const THEME_PATTERNS = {
    hope: {
      name: 'Hope & Tomorrow',
      icon: '✨',
      color: '#ffd700',
      rx: /hope|hopeful|ithemba|temba|tsholofelo|tsepiso|hoop|better days|faith|future|dream|dawn|light|sunrise/i
    },
    growth: {
      name: 'Healing & Growth',
      icon: '🌱',
      color: '#00a651',
      rx: /strength|strong|brave|courage|grow|bloom|heal|healing|resilien|overcome|power|recover/i
    },
    connection: {
      name: 'Family & Tribe',
      icon: '💜',
      color: '#8a2eae',
      rx: /family|friend|sister|brother|mother|father|mom|dad|gogo|ouma|love|together|support|community|care|hug/i
    },
    calm: {
      name: 'Inner Stillness',
      icon: '🌊',
      color: '#3366ff',
      rx: /peace|peaceful|calm|quiet|breathe|breath|safe|relax|rest|seren|gentle|still/i
    },
    gratitude: {
      name: 'Gratitude & Joy',
      icon: '☀️',
      color: '#f58220',
      rx: /thank|grateful|gratitude|bless|blessed|smile|laugh|joy|happy|appreciat|dankie|ngiyabonga|enkosi/i
    },
    expression: {
      name: 'Creative Voice',
      icon: '🎨',
      color: '#f3256b',
      rx: /art|draw|paint|sketch|colour|color|poem|write|journal|story|music|sing|creative/i
    },
  };

  function extractThemes(text) {
    if (!text) return [];
    return Object.entries(THEME_PATTERNS)
      .filter(([, def]) => def.rx.test(text))
      .map(([k, def]) => ({ key: k, name: def.name, icon: def.icon, color: def.color }));
  }

  function resilienceConstellation(entries = []) {
    const counts = {};
    for (const k of Object.keys(THEME_PATTERNS)) counts[k] = 0;

    for (const e of entries) {
      const txt = (e.body || '') + ' ' + (e.text || '') + ' ' + (e.title || '') + ' ' + (e.notes || '') + ' ' + (e.mood || '');
      const themes = extractThemes(txt);
      for (const th of themes) counts[th.key] = (counts[th.key] || 0) + 1;
    }

    return Object.entries(THEME_PATTERNS).map(([k, def]) => ({
      key: k,
      name: def.name,
      icon: def.icon,
      color: def.color,
      count: counts[k] || 0,
    }));
  }

  /* ── Micro-AI Cognitive Reframing & Empathy Engine ──────── */
  function getReframingSuggestion(text) {
    if (!text || text.length < 5) return null;
    const lower = text.toLowerCase();

    if (/failure|ruined|can'?t do anything|i am stupid|worthless|hopeless/i.test(lower)) {
      return {
        icon: '🌱',
        title: 'Compassionate Reframe',
        prompt: 'Notice the harsh judgment. Can you whisper to yourself: "I am learning, I am human, and one difficult moment does not define my worth."?',
      };
    }
    if (/always|never|everybody hates|no one cares/i.test(lower)) {
      return {
        icon: '🌊',
        title: 'Perspective Shift',
        prompt: 'Strong emotions make things feel all-or-nothing. Look for one tiny exception where someone or something showed you kindness.',
      };
    }
    if (/overwhelmed|too much|drowning|exploding/i.test(lower)) {
      return {
        icon: '🌿',
        title: 'Grounding Seed',
        prompt: 'Break the mountain into a single pebble. What is just one small thing you can do or let go of in the next 10 minutes?',
      };
    }
    if (/hope|ithemba|tsholofelo|grateful|thank/i.test(lower)) {
      return {
        icon: '✨',
        title: 'Resilience Anchor',
        prompt: 'Anchor this warm light into your memory. When storms arrive, this feeling is your compass.',
      };
    }
    return {
      icon: '💜',
      title: 'Gentle Reflection',
      prompt: 'Writing this out gives you clarity and space. Honor how much courage it takes to listen to your inner self.',
    };
  }

  const api = {
    analyse, analyseDeep, lexSentiment, riskOf, topicsOf,
    extractThemes, resilienceConstellation, getReframingSuggestion, THEME_PATTERNS,
    enableTransformer, disableTransformer, transformerReady, transformerInfo,
    MODELS,
  };
  globalThis.MMNLP = api;
  return api;
})();
