# 🧠 On-Device AI, NLP & African Neural Voice Engines

## 📌 Philosophy: Privacy-First, Culturally-Grounded, Zero-Data AI

MojaMind’s artificial intelligence and speech synthesis run **100% locally on the participant's device**, adhering strictly to POPIA and GDPR standards. No user reflections, journal entries, voice recordings, or chat inputs are transmitted to third-party AI APIs.

---

## 🛠️ Integrated AI Architectures

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ON-DEVICE AI & SPEECH PIPELINE                       │
├──────────────────────────┬─────────────────────────┬───────────────────┤
│ 1. MobileBERT Sentiment  │ 2. Moja Guide Nano-SLM  │ 3. African Voice  │
│ • 25M Parameter Neural   │ • On-Device Cognitive   │ • Black African   │
│   Valence/Arousal Model  │   Coaching & Triage     │   Female Personas │
│ • Distress Triggering &  │ • Intent Classification │ • Neural en-ZA/NG │
│   Facilitator Soft-Alert │ • Facilitator Handover  │ • Whisper ASR STT │
└──────────────────────────┴─────────────────────────┴───────────────────┘
```

---

## 🎙️ Black African Female Voice Engine (`js/voice.js`)

The speech synthesis architecture is specifically tuned to prioritize **natural, warm Black African female voices** across all supported platforms (Android Chrome, iOS Safari, desktop Edge/Chrome, etc.).

### 1. The 4 African Female Personas

| Persona | Name & Character | Voice Parameters | Best Use Case |
| :--- | :--- | :--- | :--- |
| 🌱 **Thandi** *(Default)* | **Warm African Sisterhood & Care** | `Rate: 0.93`, `Pitch: 0.98`, `Warmth` | Default app voice. Grounded, maternal, empathetic cadence tuned for trauma-informed care and mindfulness. |
| ✨ **Nomsa** | **Crisp Study Guide & Navigation** | `Rate: 0.98`, `Pitch: 1.00`, `Clarity` | Clear, articulate enunciation for survey walkthroughs, instructions, and onboarding. |
| 🌟 **Leah** | **Bright & Radiant Affirmation** | `Rate: 0.95`, `Pitch: 1.02`, `Hope` | Uplifting, energetic tone for Daily Sparks, constellation unlocks, and milestone celebrations. |
| 🌙 **Zola** | **Evening Calm & Reflection** | `Rate: 0.88`, `Pitch: 0.95`, `Soothing` | Whisper-soft, peaceful tempo for evening journaling and 4-4-4-4 box breathing exercises. |

---

### 2. Intelligent Neural Voice Discovery & Priority Ranking

When synthesizing speech, `findBestNeuralVoice()` dynamically scans the device's installed Web Speech synthesis voices using a specialized scoring hierarchy:

1. **Tier 1 (Highest Priority — 600 pts)**: South African English (`en-ZA`) female neural voices (e.g. `Microsoft LeahNeural`, `Google English (South Africa) Female`).
2. **Tier 2 (African Regional Female Voices — 500 pts)**: Regional African female neural models (`en-NG Ezinne`, `en-KE Asilia`, `Blessing`, `Thando`, `Ayanda`, `Nomsa`, `Nandi`, `Lerato`, `Zola`).
3. **Tier 3 (Locale Match — 400 pts)**: Any system voice declaring `en-ZA` / `en-NG` / `en-KE` / `en-GH`.
4. **Tier 4 (Fallback Commonwealth Female)**: Warm British / Commonwealth female neural voices with tuned pitch and cadence modifiers.
5. **Penalized Voices**: Robotic, monotone, legacy male synths (`eSpeak`, `Desktop`, `Microsoft David`) are heavily penalized to avoid cold, robotic delivery.

---

### 3. African Phonetics & Cultural Pronunciation Dictionary

To ensure words of indigenous and local South African heritage are spoken with natural resonance and respect, `cleanPhonetics()` automatically converts text prior to speech synthesis:

* `MojaMind` / `MojoMind` ➔ *"Moh-jah Mind"*
* `Ubuntu` ➔ *"Oo-boon-too"*
* `Ithemba` ➔ *"Ee-tem-ba"*
* `Sawubona` ➔ *"Sah-woo-boh-nah"*
* `Dumela` ➔ *"Doo-meh-lah"*
* `Stellenbosch` ➔ *"Stell-en-bosh"*
* `Gilead` ➔ *"Gill-ee-ad"*
* `SHOUT-IT-NOW` ➔ *"Shout It Now"*
* Em-dashes (`—`) & ellipses (`...`) ➔ Converted to natural human breath pauses (`, `).

---

## 🔬 Cognitive AI & Distress Engines

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
