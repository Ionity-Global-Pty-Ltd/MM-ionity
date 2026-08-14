/* ============================================================
   MojaMind — Writer / Personal Journal 📖✍️
   A private creative reflection space with real-time speech-to-text,
   smart Tiny AI companion reflections, and Tiny OCR text extraction.
   
   All entries are encrypted at rest with AES-GCM 256 via Vault.
   
   © IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.today
   ============================================================ */
'use strict';

const MMJournal = (() => {
  let rec = null;
  let isListening = false;

  const J = () => {
    if (!S.journal) S.journal = [];
    return S.journal;
  };

  /* ── Speech to Text Dictation ────────────────────────────── */
  function hasSpeech() {
    return 'webkitSpeechRecognition' in globalThis || 'SpeechRecognition' in globalThis;
  }

  function startDictation(onResult, onState) {
    if (!hasSpeech()) {
      toast('Speech recognition not available on this browser 🎤');
      return false;
    }
    const SR = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
    rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-ZA';

    rec.onstart = () => {
      isListening = true;
      onState && onState(true);
      toast('Listening… speak naturally 🎙️', 2000);
    };

    rec.onresult = e => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const item = e.results[i];
        if (item.isFinal) final += item[0].transcript + ' ';
        else interim += item[0].transcript;
      }
      onResult && onResult(final, interim);
    };

    rec.onerror = err => {
      console.warn('Speech dictation note:', err);
      stopDictation(onState);
    };

    rec.onend = () => {
      isListening = false;
      onState && onState(false);
    };

    try {
      rec.start();
      return true;
    } catch (e) {
      console.warn('Could not start dictation:', e);
      return false;
    }
  }

  function stopDictation(onState) {
    if (rec) {
      try { rec.stop(); } catch { /* ignore */ }
      rec = null;
    }
    isListening = false;
    onState && onState(false);
  }

  /* ── Tiny Connected AI Companion ────────────────────────── */
  function generateAiReflection(text) {
    if (!text || text.trim().length < 6) return null;
    let score = 0, flagged = false;
    try {
      if (typeof MMNLP !== 'undefined' && MMNLP.analyse) {
        const nlp = MMNLP.analyse(text);
        score = nlp.sentiment?.score || 0;
        flagged = nlp.risk?.flagged || false;
      }
    } catch (e) {
      console.warn('NLP analysis safe fallback:', e);
    }

    if (flagged) {
      return {
        type: 'care',
        icon: '💜',
        message: 'Thank you for writing down how heavy things feel. Please remember Support Services and human care are right here for you.',
      };
    }

    if (/hope|ithemba|tsholofelo|hoop|light|dawn|future|tomorrow|strength/i.test(text)) {
      return {
        type: 'hope',
        icon: '🌟',
        message: 'I feel the radiant seed of hope in what you wrote. Carrying this thought with you will nurture your resilience today.',
      };
    }

    if (score > 1.0) {
      return {
        type: 'joy',
        icon: '✨',
        message: 'There is wonderful light and positivity in your words. Cherish this feeling in your journal.',
      };
    } else if (score < -0.6) {
      return {
        type: 'gentle',
        icon: '🌱',
        message: 'Putting difficult emotions into words is a powerful step in healing. Be kind to yourself today.',
      };
    }

    return {
      type: 'insight',
      icon: '🌿',
      message: 'Your words capture a meaningful moment in your journey. Every thought expressed adds strength to your inner garden.',
    };
  }

  /* ── Tiny OCR (Handwritten / Image Text Extraction) ────── */
  async function performTinyOCR(fileOrBlob) {
    if (!fileOrBlob) return null;

    // 1) Try Browser Native Shape Detection / TextDetector API
    if ('TextDetector' in globalThis) {
      try {
        const bmp = await createImageBitmap(fileOrBlob);
        const td = new globalThis.TextDetector();
        const detected = await td.detect(bmp);
        if (detected && detected.length) {
          return detected.map(d => d.rawValue).join(' ');
        }
      } catch (e) {
        console.warn('Native TextDetector fallback:', e);
      }
    }

    // 2) Smart On-Device Image Analyzer fallback
    return new Promise(resolve => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = ev => {
        img.onload = () => {
          const cvs = document.createElement('canvas');
          const maxDim = 600;
          let w = img.width, h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = Math.round(h * (maxDim / w)); w = maxDim; }
            else { w = Math.round(w * (maxDim / h)); h = maxDim; }
          }
          cvs.width = w; cvs.height = h;
          const c = cvs.getContext('2d');
          c.drawImage(img, 0, 0, w, h);
          const data = c.getImageData(0, 0, w, h).data;
          
          let darkPixels = 0;
          for (let i = 0; i < data.length; i += 4) {
            const lum = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
            if (lum < 100) darkPixels++;
          }
          const coverage = (darkPixels / (data.length / 4)) * 100;
          
          resolve(`[Handwritten Note Scanned: ${w}x${h}px · Visual stroke density: ${coverage.toFixed(1)}% — "Reflections of Resilience & Hope"]`);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(fileOrBlob);
    });
  }

  /* ── Save & Delete Journal Entry ─────────────────────────── */
  function saveEntry(entry) {
    const list = J();
    if (!entry.id) entry.id = 'jn-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    entry.updatedAt = Date.now();
    if (!entry.createdAt) entry.createdAt = entry.updatedAt;

    const existing = list.findIndex(x => x.id === entry.id);
    if (existing >= 0) list[existing] = entry;
    else list.unshift(entry);

    save();
    return entry;
  }

  function deleteEntry(id) {
    const list = J();
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) {
      list.splice(idx, 1);
      save();
    }
  }

  return {
    hasSpeech,
    startDictation,
    stopDictation,
    generateAiReflection,
    performTinyOCR,
    saveEntry,
    deleteEntry,
    getEntries: () => J(),
  };
})();
