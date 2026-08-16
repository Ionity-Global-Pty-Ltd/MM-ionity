# 🌸 MojaMind — Creative Resilience (MM-ionity)

<div align="center">

[![Deploy MojaMind PWA to GitHub Pages](https://github.com/Ionity-Global-Pty-Ltd/MM-ionity/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Ionity-Global-Pty-Ltd/MM-ionity/actions/workflows/deploy-pages.yml)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20First-5c1680?style=for-the-badge&logo=pwa&logoColor=white)](https://ionity-global-pty-ltd.github.io/MM-ionity/)
[![Version](https://img.shields.io/badge/Version-3.3.0-ffd166?style=for-the-badge&logo=semver&logoColor=black)](CHANGELOG.md)
[![Crafted By Ionity](https://img.shields.io/badge/Engineered%20By-IONITY%20GLOBAL-3366FF?style=for-the-badge&logo=google-cloud&logoColor=white)](https://www.ionity.co.za)
[![Partner](https://img.shields.io/badge/Research%20Partner-STELLENBOSCH%20UNIVERSITY-801b2a?style=for-the-badge)](https://www.sun.ac.za)
[![License](https://img.shields.io/badge/License-SEE%20LICENSE-ee2b63?style=for-the-badge)](LICENSE.md)

**An 8-week offline-first creative resilience intervention PWA.**
Designed and engineered for **SHOUT-IT-NOW** and **Stellenbosch University**, made possible by **Gilead Sciences**.

[🌐 Live Deployment](https://ionity-global-pty-ltd.github.io/MM-ionity/) · [📖 Repository Wiki](wiki/Home.md) · [📝 Changelog](CHANGELOG.md)

</div>

---

## ✨ Features & Architecture

| Module | Description |
| :--- | :--- |
| 📱 **Offline-First PWA** | Fast, installable app shell with zero build step and complete offline Service Worker caching. |
| 🧠 **MobileBERT & Nano-SLM AI** | On-device 25M parameter MobileBERT Neural Engine (`js/nlp.js`) and embedded MojaMind Nano-SLM (`js/llm.js`) for streaming cognitive guidance and resilience theme spotting with zero cloud dependencies. |
| 📋 **Validated Instruments** | PHQ-9, GAD-7, MARS-5, Stigma-5, BRS, CAGE-AID, and Usability Survey batteries with real-time crisis escalation routing. |
| 🐝 **3D Sunray Flight** | Built-in hardware-accelerated 3D flight engine (`js/game3d.js`) over sunflower meadows and winding rivers. |
| 🌸 **Moja Meadow & Pop** | 2D Zen gardening mini-game (`js/game.js`) and Serenity Bubble Odyssey (`js/bubble.js`). |
| 🎨 **Moja Vision 2.0 & Art Studio** | On-device digital drawing board with brush/color picker, physical photo upload, and art psychology color insights (`js/draw.js`). |
| 🔒 **WebCrypto Vault** | Client-side AES-GCM 256-bit encrypted journal (`js/vault.js`) with PBKDF2 PIN locking. |
| 🎙️ **Voice Navigation & Soundscapes** | Hands-free voice commands (`js/voice.js`) and 432Hz procedural nature soundscape generator (`js/soundscape.js`). |
| 🎬 **Narrator Video Walkthrough** | Interactive talking avatar with real-time lip-synced visemes, playback scrub bar, and Picture-in-Picture floating mini-player (`js/video.js`). |
| 🎓 **Journey Portfolio** | Cryptographic resilience certificate and creative journey export (`js/portfolio.js`). |
| ☁️ **Optional Cloud Sync** | Off by default (stays DataFree). When enabled, streams survey/activity/chat data to a hosted study DB with offline retry (`js/sync.js`). See [`BACKEND_AZURE.md`](BACKEND_AZURE.md). |
| 📥 **Facilitator Inbox** | Admin login opens an All-Messages inbox reading every participant's chat from the backend; group chat is broadcast-only, individual chat is private 1:1. |
| 🪫 **Low-Power Mode** | Auto-detects budget phones / Save-Data / reduced-motion and drops backdrop-blur, heavy shadows and particle effects for smooth performance on inexpensive devices. |

---

## 🗺️ Exact User Journey

```text
Splash (SHOUT · Stellenbosch · Gilead)
   └── Sign In (Mobile Number)
         └── Terms & Conditions (Accept)
               └── Welcome
                     └── Demographics
                           └── Home
                                ├── Instructions & Support Services
                                ├── Pre-Survey (PHQ-9, GAD-7, MARS-5, Stigma-5, BRS, CAGE-AID)
                                ├── 8 Weekly Art Activities (Draw / Voice / Picture / Reflect)
                                ├── Facilitator & Group Chat (Streaming Nano-SLM Guidance)
                                ├── Games Hub (Moja Meadow 2D, Moja Bee 3D, Moja Pop)
                                ├── Encrypted Writer & Journal (Speech-to-Text & Tiny OCR)
                                └── Post-Survey & Journey Certificate
```

---

## 🚀 Run Locally

No build step required. Run with any static server:

```bash
# Python 3
python -m http.server 8123

# Or via npx
npx serve . -l 8123
```

Then open `http://localhost:8123` in any modern browser.

---

## 🪫 Performance on low-end devices

Most participants use inexpensive, low-RAM Android phones on limited data, so the app is tuned for that:

* **Lean install** — the Service Worker pre-caches only the app shell; heavy modules (games, 3D, drawing, video) load on demand the first time they're opened.
* **Auto low-power mode** — on ≤4 GB RAM / ≤4 cores / Save-Data / reduced-motion, the app removes backdrop-blur and heavy shadows (the main GPU cost on budget phones), disables tap-particle effects, minimises confetti, and hides ambient animation.
* **Storage-safe** — saves degrade gracefully if device storage is full, and artwork can always be exported to the device.

*Planned next:* split the ~290 KB `app.js` into route chunks so each screen parses only what it needs — see [`RECOMMENDATIONS.md`](RECOMMENDATIONS.md).

---

## 📜 Authors & Acknowledgements

* **Engineering & Architecture:** Johan Wilhelm van Antwerp — Solutionist of Antwerp Designs & Ecosystems Engineer · [IONITY Global (Pty) Ltd](https://www.ionity.co.za)
* **Partners:** SHOUT-IT-NOW & Stellenbosch University
* **Sponsorship:** Gilead Sciences

© 2026 IONITY GLOBAL (PTY) LTD. All rights reserved.
[www.ionity.co.za](https://www.ionity.co.za)
