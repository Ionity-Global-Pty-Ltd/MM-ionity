# 🧠 On-Device AI & NLP Engines

## 📌 Philosophy: Privacy-First, Zero-Data AI

MojaMind’s artificial intelligence runs **100% locally on the participant's device**, adhering to POPIA and GDPR standards. No user reflections, journal text, voice recordings, or chat inputs are transmitted to third-party AI APIs.

---

## 🛠️ Integrated AI Architectures

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ON-DEVICE AI INFERENCE PIPELINE                      │
├──────────────────────────┬─────────────────────────┬───────────────────┤
│ 1. MobileBERT Sentiment  │ 2. Moja Guide Nano-SLM  │ 3. Voice Engine   │
│ • 25M Parameter Embeddings│ • On-Device Cognitive   │ • In-Browser Web  │
│ • Real-time Valence /    │   Coaching & Triage     │   Speech Recog    │
│   Arousal Analysis       │ • Intent Classification │ • Real-Time STT   │
│ • Distress Triggering    │ • Facilitator Handover  │   Transcription   │
└──────────────────────────┴─────────────────────────┴───────────────────┘
```

---

## 🔬 Engine Specifications

### 1. MobileBERT Sentiment & Distress Classifier (`js/nlp.js`)
* **Quantized Vector Architecture**: Compact embedded neural model (~25M parameters equivalent) optimized for low-latency browser execution.
* **Psychological Valence & Arousal Scoring**: Evaluates user journal entries, mood notes, and chat messages on a continuous spectrum from $-1.0$ (distressed) to $+1.0$ (thriving).
* **Automated Facilitator Escalation**: If sentiment trends persistently into acute distress patterns, the engine raises a soft alert for facilitator check-in.

### 2. Moja Guide Nano-SLM (`js/llm.js`)
* **Cognitive Resilience Agent**: Provides contextual guidance, creative prompts, and empathetic listening during chat interactions.
* **Intent Recognition**:
  * `coping_strategy`: Offers breathing exercises, grounding techniques, or mini-games.
  * `activity_guidance`: Clarifies instructions for the current week's art activity.
  * `crisis_intent`: Immediately triggers emergency helpline overlays and social worker referral routing.
* **Human-in-the-Loop Handover**: The participant can request a human facilitator at any point during chat, seamlessly pausing AI responses and queuing the thread in the Facilitator Admin Inbox.

### 3. Voice Transcription & Speech-to-Text (`js/voice.js`)
* **Web Speech API Integration**: Leverages hardware-accelerated on-device speech recognition engines.
* **Multi-Dialect Readiness**: Supports South African English (`en-ZA`), with architecture extensible to African languages (isiZulu, isiXhosa, Afrikaans, Sesotho).
* **Zero Audio Upload**: Audio waveforms are processed in volatile memory for transcription; raw audio is only saved locally if the user chooses to store their voice note.

---

*© 2026 IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp*
