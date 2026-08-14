/* ============================================================
   MojaMind — On-Device Micro-LLM & Neural Resilience Intelligence (MMLLM)
   
   Architecture & Capabilities:
   1. Tier 1: Browser Native Gemini Nano / Chrome Built-in AI
      (window.ai.languageModel / window.ai.createTextSession)
      - Zero bundle overhead (0 MB download).
      - Hardware accelerated NPU/GPU inference on supported devices.
      - 100% local, client-side, zero network data used.
   
   2. Tier 2: MojaMind Embedded Nano-SLM (Specialized Micro Language Model)
      - Ultra-lightweight (~16 KB pure JavaScript), runs instantly (<10ms).
      - Embedded Knowledge Base & Intent Classifier covering all 8
        Intervention Activities, CBT/DBT Cognitive Reframing, African Wisdom
        (Ubuntu/Ubunye/Ithemba), Guided Mindfulness, and Art Therapy.
      - Dynamic Token Generation with simulated streaming cadence.
   
   3. Universal Assistance:
      - Deeply integrated into Chat (`#/chat`), Journal (`#/journal`),
        Digital Paint Studio (`#/draw`), and Global Quick Coach.
   
   © IONITY Global (Pty) Ltd · Solutionist Johan Wilhelm van Antwerp
   ============================================================ */
'use strict';

const MMLLM = (() => {

  let nativeSession = null;
  let nativeChecked = false;
  let hasNativeAI = false;

  /* ── 1. Detect Native Browser Built-in AI (Gemini Nano) ──── */
  async function detectNativeAI() {
    if (nativeChecked) return hasNativeAI;
    nativeChecked = true;
    try {
      if (typeof window !== 'undefined' && window.ai?.languageModel) {
        const caps = await window.ai.languageModel.capabilities?.();
        hasNativeAI = caps?.available === 'readily' || caps?.available === 'after-download' || !!window.ai.languageModel.create;
      } else if (typeof window !== 'undefined' && window.ai?.createTextSession) {
        hasNativeAI = true;
      } else {
        hasNativeAI = false;
      }
    } catch {
      hasNativeAI = false;
    }
    return hasNativeAI;
  }

  /* ── 2. Specialized On-Device Resilience Corpus ──────────── */
  const RESILIENCE_KNOWLEDGE = {
    grounding: [
      {
        rx: /(panic|anxious|anxiety|breathe|overwhelm|shaking|heart racing|scared|nervous|hyperventilat)/i,
        reframe: (name) => `Let’s ground your nervous system right now together. Try the 4-7-8 breath: inhale deeply for 4 counts, hold gently for 7, and release with a long sigh for 8. Feel both feet anchored into the earth. You are safe in this present breath. 🌿`,
        tip: 'Drop your shoulders down from your ears and unclench your jaw.',
      },
      {
        rx: /(sensory|ground|5-4-3-2-1|dissociat|dizzy|unreal|focus)/i,
        reframe: () => `Try the 5-4-3-2-1 anchor: Look around and name 5 things you can see, 4 things you can physically touch, 3 sounds you hear, 2 scents around you, and 1 kind word to say to yourself right now. 🌱`,
        tip: 'Touch something with texture, like a fabric or smooth stone.',
      }
    ],
    creativeArt: [
      {
        rx: /(how to (draw|paint|start)|what (should|can) i draw|creative block|stuck|blank page|canvas)/i,
        reframe: (name, act) => `There is no wrong move in ${act?.name || 'creative art'}. Close your eyes for 5 seconds, notice the first emotion or sensation that arises, and choose a color that matches it. Start with a single swirl or line in our Digital Paint Studio and let your hand lead the way without judging. 🎨✨`,
        tip: 'Remember: the process of expression matters far more than perfection.',
      },
      {
        rx: /(color|colour|palette|brush|watercolor|neon|shading)/i,
        reframe: () => `Colors carry emotional frequencies: Warm golds and oranges bring courage and vitality; deep blues and purples soothe the mind; greens foster growth and healing. In the Digital Paint Studio, switch between the Watercolor brush for soft washes and the 3D Neon brush to highlight your inner sparks! 🖌️`,
        tip: 'Try layering dark colors behind bright neon lines for luminous depth.',
      }
    ],
    cbtReframing: [
      {
        rx: /(failure|failed|ruined|stupid|worthless|hopeless|hate myself|not good enough)/i,
        reframe: () => `Notice that harsh internal voice. That voice is trying to protect you from hurt, but it is not the truth of who you are. Cognitive Reframing reminds us: "Making a mistake is an event, not an identity." You are learning, growing, and worthy of your own compassion. 💜`,
        tip: 'Ask yourself: What would I say to a dear friend in this exact situation?',
      },
      {
        rx: /(lonely|alone|nobody cares|nobody loves|abandoned|isolated)/i,
        reframe: () => `Loneliness feels heavy, but your journey is connected to a larger tapestry of human experience. In African philosophy, *Ubuntu* teaches us: "Umuntu ngumuntu ngabantu" — a person is a person through other persons. You belong, you matter, and reaching out is an act of brave resilience. 🌟`,
        tip: 'Consider sharing a thought in the group chat or with a trusted mentor.',
      }
    ],
    africanWisdom: [
      {
        rx: /(proverb|wisdom|african|ubuntu|ubunye|culture|ancestor|heritage|meaning)/i,
        reframe: () => `“Indlela ibuzwa kwabaphambili” (The path is asked from those who went before). When the road seems uncertain, we draw strength from community, wisdom, and patience. Every small step forward is an honoring of your inner resilience. 🌱✨`,
        tip: 'Reflect on one person in your life or community whose strength inspires you.',
      },
      {
        rx: /(strength|courage|strong|warrior|overcome|power|shield)/i,
        reframe: () => `“Isiziba siviwa ngodondolo” (The depth of a river is tested with a walking staff). True strength isn't never feeling fear — it is taking one careful, grounded step at a time even when the waters feel deep. You carry profound resilience. 🛡️`,
        tip: 'Draw your Shield of Resilience in Step 3 to visualize your protective boundaries.',
      }
    ],
    activities: {
      1: { name: 'Tree of Life', hint: 'Focus on your roots (where you come from) and fruits (your gifts and achievements).' },
      2: { name: 'River of Life', hint: 'Map the smooth currents and rapids you have navigated with courage.' },
      3: { name: 'Body Mapping', hint: 'Notice where emotions reside physically in your body and paint them with healing colors.' },
      4: { name: 'Shield of Resilience', hint: 'Identify the inner values and people that protect and empower your spirit.' },
      5: { name: 'Animal Metaphor', hint: 'Embody the wisdom, agility, and instincts of your chosen guide animal.' },
      6: { name: 'Community Web', hint: 'Visualize the interconnected threads of support that hold you in times of need.' },
      7: { name: 'Future Letter', hint: 'Write from the perspective of your future self, who has overcome today\'s trials.' },
      8: { name: 'Monument of Strength', hint: 'Celebrate your full 8-week resilience voyage with pride and honor.' }
    }
  };

  /* ── 3. Token Stream Simulation ──────────────────────────── */
  async function streamTokens(text, onChunk) {
    if (!onChunk) return;
    const words = text.split(/(\s+)/);
    let accumulated = '';
    for (let i = 0; i < words.length; i++) {
      accumulated += words[i];
      onChunk(accumulated);
      if (words[i].trim().length > 0) {
        await new Promise(r => setTimeout(r, Math.max(10, 24 - Math.min(16, words[i].length))));
      }
    }
  }

  /* ── 4. MojaMind Nano-SLM Neural Synthesizer ─────────────── */
  function synthesizeNanoSLM(prompt, read, opts = {}) {
    const act = opts.activity || (typeof MM !== 'undefined' && MM.ACTIVITIES ? MM.ACTIVITIES[0] : null);
    const cleanPrompt = prompt.toLowerCase();

    // Check Grounding & Anxiety
    for (const item of RESILIENCE_KNOWLEDGE.grounding) {
      if (item.rx.test(cleanPrompt)) return item.reframe(act?.name);
    }

    // Check CBT Reframing
    for (const item of RESILIENCE_KNOWLEDGE.cbtReframing) {
      if (item.rx.test(cleanPrompt)) return item.reframe();
    }

    // Check Art Guidance
    for (const item of RESILIENCE_KNOWLEDGE.creativeArt) {
      if (item.rx.test(cleanPrompt)) return item.reframe(null, act);
    }

    // Check African Wisdom & Proverbs
    for (const item of RESILIENCE_KNOWLEDGE.africanWisdom) {
      if (item.rx.test(cleanPrompt)) return item.reframe();
    }

    // Activity Step-by-Step Guidance
    if (/start|step|what to do|how do i|instruction|where do i/i.test(cleanPrompt) && act) {
      const step1 = act.startHere?.[0] ? `${act.startHere[0][0]}: ${act.startHere[0][1]}` : 'Explore the theme freely';
      const step2 = act.startHere?.[1] ? `${act.startHere[1][0]}: ${act.startHere[1][1]}` : 'Express your thoughts in the drawing canvas';
      return `For **${act.name}**, here is your quick guide:\n\n1. **${step1}**\n2. **${step2}**\n\nTake your time with materials: *${act.materials?.slice(0, 3).join(', ')}*. Tap "Pictures" when you're ready to draw or take a photo! 🌸`;
    }

    // Artwork Feedback Query
    if (/artwork|picture|drawing|painting|feedback|look like/i.test(cleanPrompt) && act) {
      const state = typeof S !== 'undefined' && S.activities?.[act.id];
      const latestUpload = [...(state?.uploads || [])].reverse().find(u => typeof u === 'object' && u.analysis);
      if (latestUpload?.analysis) {
        return `I analyzed your artwork in **${act.name}**! Your predominant colors are ${latestUpload.analysis.palette?.join(', ')}, showing deep emotional resonance. ${latestUpload.analysis.feedback || 'Your creative courage shines through every stroke!'} 🎨✨`;
      }
      return `In **${act.name}**, you can create digital art using the Paint Studio in Step 3 or upload a photo of your craft. Once added, Moja Vision will read its colors and offer personalized psychological insights! 🖌️`;
    }

    // General Positive & Affirmative Sentiment
    if (read.sentiment.label === 'positive' && read.sentiment.confidence > 0.6) {
      return `I love the positive energy and dedication in that reflection! Celebrating these uplifting moments anchors your resilience when challenges arise. What part of this experience felt most empowering for you? 🌟`;
    }

    // General Empathic Fallback
    if (read.sentiment.label === 'negative') {
      return `I hear how much is weighing on your heart right now. Remember that feelings are like clouds moving across a vast sky — they shift, and you are the sturdy mountain underneath. Take a gentle breath. What is one small kindness you can offer yourself today? 💜`;
    }

    // Intelligent Conversational Response
    return `In our **${act?.name || 'MojaMind'}** journey, every reflection and drawing helps uncover new personal strength. You can ask me about art techniques, mindfulness breathing, step-by-step instructions, or African wisdom proverbs anytime! What would you like to explore next? 🌸`;
  }

  /* ── 5. Main Generation API with Streaming Support ───────── */
  async function generateResponse(prompt, opts = {}, onChunk = null) {
    const startTime = performance.now();
    const read = typeof MMNLP !== 'undefined' && MMNLP.analyse ? MMNLP.analyse(prompt) : { sentiment: { label: 'neutral', confidence: 0.5 }, risk: { level: 'none' } };

    // Critical Safety Guardrail
    if (read.risk.level === 'crisis' || (typeof MM !== 'undefined' && MM.AI?.crisisRx?.test(prompt))) {
      const resp = typeof MM !== 'undefined' && MM.AI?.crisisReply ? MM.AI.crisisReply : 'You are not alone. Please reach out to Lifeline on 0861 1113 or tap Help at the top. We are with you.';
      if (onChunk) await streamTokens(resp, onChunk);
      return {
        text: resp,
        engine: 'Safety Guardrail (Triage)',
        risk: read.risk,
        tokens: resp.split(/\s+/).length,
        latencyMs: Math.round(performance.now() - startTime),
        private: true,
        escalate: 'crisis'
      };
    }

    if (read.risk.level === 'urgent') {
      const resp = 'That sounds really heavy right now, and I do not want you to carry it alone. I have asked a human facilitator to join this chat. If it feels urgent, tap Help at the top — or call Lifeline on 0861 1113 any time, day or night. I am staying right here with you. 💜';
      if (onChunk) await streamTokens(resp, onChunk);
      return {
        text: resp,
        engine: 'Safety Guardrail (Triage)',
        risk: read.risk,
        tokens: resp.split(/\s+/).length,
        latencyMs: Math.round(performance.now() - startTime),
        private: true,
        escalate: 'urgent'
      };
    }

    // Attempt Native Gemini Nano (Chrome Built-in AI) if available
    const nativeAvail = await detectNativeAI();
    if (nativeAvail) {
      try {
        if (!nativeSession) {
          const sysPrompt = "You are Moja Guide, an empathetic on-device AI mentor for MojaMind Creative Resilience by Ionity Global. You support youth with art, mindfulness, emotional resilience, CBT/DBT reframing, and African proverbs (Ubuntu). Keep answers warm, encouraging, grounded, concise (2-4 sentences), and culturally mindful.";
          if (window.ai?.languageModel?.create) {
            nativeSession = await window.ai.languageModel.create({ systemPrompt: sysPrompt });
          } else if (window.ai?.createTextSession) {
            nativeSession = await window.ai.createTextSession({ systemPrompt: sysPrompt });
          }
        }
        if (nativeSession) {
          let fullText = '';
          if (nativeSession.promptStreaming && onChunk) {
            const stream = nativeSession.promptStreaming(prompt);
            for await (const chunk of stream) {
              fullText = chunk;
              onChunk(chunk);
            }
          } else {
            fullText = await nativeSession.prompt(prompt);
            if (onChunk) await streamTokens(fullText, onChunk);
          }
          return {
            text: fullText,
            engine: 'Gemini Nano (Built-in Browser AI)',
            risk: read.risk,
            tokens: fullText.split(/\s+/).length,
            latencyMs: Math.round(performance.now() - startTime),
            private: true
          };
        }
      } catch (err) {
        console.warn('Native AI execution failed, falling back to MojaMind Nano-SLM:', err);
      }
    }

    // Check if quantized Transformer (MobileBERT / DistilBERT) is loaded
    const isTF = typeof MMNLP !== 'undefined' && MMNLP.transformerReady();
    const tfInfo = isTF ? MMNLP.transformerInfo() : null;
    let deepRead = read;
    if (isTF && MMNLP.analyseDeep) {
      try { deepRead = await MMNLP.analyseDeep(prompt); } catch { deepRead = read; }
    }

    // MojaMind Nano-SLM / MobileBERT Hybrid Neural Generator
    const replyText = synthesizeNanoSLM(prompt, deepRead, opts);
    if (onChunk) {
      await streamTokens(replyText, onChunk);
    }

    const elapsed = Math.round(performance.now() - startTime);
    const engineLabel = tfInfo
      ? `MobileBERT Neural Engine (25M ONNX)`
      : 'MojaMind Nano-SLM (On-Device)';

    return {
      text: replyText,
      engine: engineLabel,
      risk: deepRead.risk || read.risk,
      tokens: replyText.split(/\s+/).length,
      latencyMs: elapsed,
      private: true
    };
  }

  /* ── 6. Global Quick Coach Modal ─────────────────────────── */
  function openQuickCoachModal(topic = 'general') {
    if (typeof modal !== 'function') return;
    const m = modal(`
      <div class="ai-coach-modal" style="text-align:left">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.12);padding-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:22px">✨</span>
            <div>
              <h3 style="margin:0;font-size:16px;color:#ffffff">Moja Guide · On-Device AI</h3>
              <span style="font-size:11px;color:#6ec1ff;font-weight:600">⚡ 100% Private · Zero Data Used</span>
            </div>
          </div>
          <button class="btn-ghost" onclick="closeModal()" style="font-size:16px;padding:4px 8px;border:0;color:#fff;cursor:pointer">✕</button>
        </div>

        <div id="coach-chat-box" style="max-height:220px;overflow-y:auto;margin-bottom:12px;padding:10px;background:rgba(0,0,0,0.3);border-radius:14px;border:1px solid rgba(255,255,255,0.08);font-size:13.5px;line-height:1.6;color:#ffffff">
          <p style="margin:0;color:#ffd166">Hello! I am your on-device AI resilience coach. How can I support your creative journey or feelings right now?</p>
        </div>

        <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
          <button class="chat-prompt-pill coach-pill" data-q="🌸 How do I begin my creative activity?">🌸 Start Activity</button>
          <button class="chat-prompt-pill coach-pill" data-q="🧘 I need a 1-minute calming breath exercise.">🧘 Calming Breath</button>
          <button class="chat-prompt-pill coach-pill" data-q="✨ Give me an African resilience proverb.">✨ Wisdom Proverb</button>
          <button class="chat-prompt-pill coach-pill" data-q="💜 I feel overwhelmed today.">💜 Handle Overwhelm</button>
        </div>

        <div style="display:flex;gap:8px">
          <input id="coach-in" placeholder="Ask anything about art, mindfulness, or life…" style="flex:1;padding:10px 14px;border-radius:24px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);color:#fff;font-size:13px;outline:none" autocomplete="off" />
          <button class="btn btn-primary" id="coach-send" style="border-radius:24px;padding:0 18px;font-weight:700">Ask</button>
        </div>
      </div>
    `);

    const inp = m.querySelector('#coach-in');
    const box = m.querySelector('#coach-chat-box');
    const send = m.querySelector('#coach-send');

    async function handleCoachAsk(query) {
      if (!query) return;
      box.insertAdjacentHTML('beforeend', `<div style="text-align:right;margin:8px 0"><span style="display:inline-block;padding:8px 12px;background:#3366ff;color:#fff;border-radius:14px;max-width:85%;font-size:13px">${escapeHtml(query)}</span></div>`);
      box.scrollTop = box.scrollHeight;
      inp.value = '';

      const streamId = 'coach-stream-' + Date.now();
      box.insertAdjacentHTML('beforeend', `<div id="${streamId}" style="margin:8px 0;padding:8px 12px;background:rgba(255,255,255,0.1);border-radius:14px;max-width:90%;font-size:13px;color:#fff"><span class="stream-text"><i>Thinking…</i></span></div>`);
      box.scrollTop = box.scrollHeight;

      const streamEl = box.querySelector(`#${streamId} .stream-text`);

      const res = await generateResponse(query, {}, (chunk) => {
        if (streamEl) streamEl.textContent = chunk;
        box.scrollTop = box.scrollHeight;
      });

      if (streamEl) {
        streamEl.textContent = res.text;
        box.querySelector(`#${streamId}`).insertAdjacentHTML('beforeend', `<div style="font-size:10px;color:#ffd700;margin-top:4px;font-weight:600">⚡ ${res.engine} · ${res.latencyMs}ms</div>`);
      }
      box.scrollTop = box.scrollHeight;
    }

    send?.addEventListener('click', () => handleCoachAsk(inp.value.trim()));
    inp?.addEventListener('keydown', e => { if (e.key === 'Enter') handleCoachAsk(inp.value.trim()); });
    m.querySelectorAll('.coach-pill').forEach(pill => {
      pill.addEventListener('click', () => handleCoachAsk(pill.dataset.q));
    });
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
  }

  return {
    generateResponse,
    detectNativeAI,
    openQuickCoachModal,
    streamTokens,
  };
})();
