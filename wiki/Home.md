# 🌸 MojaMind — Comprehensive Documentation Wiki

Welcome to the central technical documentation and clinical protocol guide for **MojaMind (MM-ionity)**, an 8-week offline-first Creative Resilience Intervention Progressive Web App.

---

## 🌟 Collaboration & Governance

* **Research & Clinical Leadership:** [Stellenbosch University](https://www.sun.ac.za/) & [SHOUT-IT-NOW](https://shoutitnow.org/)
* **Sponsorship:** Made possible through grant support from [Gilead Sciences](https://www.gilead.com/)
* **System Architecture & Lead Engineering:**  
  **Johan Wilhelm van Antwerp** — *Solutionist of Antwerp Designs & Ecosystems Engineer*  
  [IONITY Global (Pty) Ltd](https://www.ionity.co.za) · [www.ionity.today](https://www.ionity.today)

---

## 📚 Complete Wiki Navigation

| Section | Description | Key Modules |
| :--- | :--- | :--- |
| 🏗️ [**Architecture & PWA Capabilities**](Architecture-and-PWA.md) | Offline caching lifecycle, PWA manifest, low-power adaptive rendering, and zero-build stack. | `sw.js`, `manifest.webmanifest`, `index.html` |
| 📋 [**Validated Instruments & Study Protocols**](Validated-Instruments-and-Protocols.md) | Full 21-survey protocol, PHQ-9, GAD-7, MARS-5, Stigma-5, BRS-6, CAGE-AID, MAUQ-18, and clinical risk triggers. | `js/data.js`, `js/app.js` |
| 🎨 [**Creative Interventions & Curriculum**](Creative-Interventions-and-Curriculum.md) | 8-week weekly art activities and all 7 expression modalities (Beat Studio, Draw Studio, Write-It-Out, Voice, etc.). | `js/draw.js`, `js/beat.js`, `js/voice.js` |
| 🧠 [**On-Device AI & NLP Engines**](AI-and-NLP-Engines.md) | On-device MobileBERT sentiment engine, Moja Guide Nano-SLM, distress detection, and voice transcription. | `js/nlp.js`, `js/llm.js`, `js/voice.js` |
| 🎮 [**Interactive Engines, Soundscapes & 3D Games**](Interactive-Engines-and-Games.md) | Moja Meadow 2D Zen Garden, Moja Bee 3D Sunray Flight, Moja Pop Bubble Engine, 432Hz Soundscapes, and Box Breathing. | `js/game.js`, `js/game3d.js`, `js/bubble.js`, `js/soundscape.js` |
| 🔐 [**Security & WebCrypto AES-GCM Vault**](Security-and-WebCrypto-Vault.md) | Client-side 256-bit AES-GCM encryption, PBKDF2 PIN key derivation, zero-knowledge privacy, and POPIA compliance. | `js/vault.js` |
| ☁️ [**Backend, Sync & Facilitator Portal**](Backend-and-Sync.md) | Opt-in Azure Functions sync, offline retry queue, and Facilitator Admin Inbox for broadcast and 1:1 chat. | `js/sync.js`, `server/` |
| ♿ [**Ionity Design System & Accessibility**](Accessibility-and-Aesthetics.md) | Ionity brand tokens (`#1A1A1A`, `#3366FF`, `#FFFFFF`), 8-bit retro accents, WCAG 2.1 AA, and low-literacy features. | `css/app.css` |

---

## 🎯 Project Vision & Design Philosophy

1. **Zero-Friction Offline First**: Designed for young people across South Africa and the wider continent with unpredictable connectivity and limited mobile data.
2. **Clinical Rigor & Safety**: Validated psychometric assessment with immediate automated risk flagging and ethical human-in-the-loop referral pathways.
3. **Multi-Modal Creative Expression**: Freedom to paint, write, speak, sculpt with nature, capture photography, or compose music without prescriptive rules.
4. **Data Privacy by Default**: Zero personal journal entries or voice recordings are uploaded to the cloud unless explicit opt-in study telemetry is enabled.

---

*© 2026 IONITY Global (Pty) Ltd — Building Tomorrow, Today. Anything is Possible with God.*
