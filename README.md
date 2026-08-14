# 🌸 MojaMind — Creative Resilience (MM-ionity)

<div align="center">

[![Deploy MojaMind PWA to GitHub Pages](https://github.com/Ionity-Global-Pty-Ltd/MM-ionity/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Ionity-Global-Pty-Ltd/MM-ionity/actions/workflows/deploy-pages.yml)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20First-5c1680?style=for-the-badge&logo=pwa&logoColor=white)](https://ionity-global-pty-ltd.github.io/MM-ionity/)
[![Version](https://img.shields.io/badge/Version-2.6.2-ffd166?style=for-the-badge&logo=semver&logoColor=black)](CHANGELOG.md)
[![Crafted By Ionity](https://img.shields.io/badge/Engineered%20By-IONITY%20GLOBAL-3366FF?style=for-the-badge&logo=google-cloud&logoColor=white)](https://www.ionity.today)
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
| 🧠 **Validated Instruments** | PHQ-9, GAD-7, MARS-5, Stigma-5, BRS, CAGE-AID, and Usability Survey batteries with real-time crisis escalation routing. |
| 🐝 **3D Sunray Flight** | Built-in hardware-accelerated 3D flight engine (`js/game3d.js`) over sunflower meadows and winding rivers. |
| 🌸 **Moja Meadow & Pop** | 2D Zen gardening mini-game (`js/game.js`) and Serenity Bubble Odyssey (`js/bubble.js`). |
| 🎨 **Moja Vision 2.0 & Art Studio** | On-device drawing canvas (`js/draw.js`) with art psychology and color insight analysis. |
| 🔒 **WebCrypto Vault** | Client-side AES-GCM 256-bit encrypted journal (`js/vault.js`) with PBKDF2 PIN locking. |
| 🎙️ **Voice Navigation & Soundscapes** | Hands-free voice commands (`js/voice.js`) and 432Hz procedural nature soundscape generator (`js/soundscape.js`). |
| 🎓 **Journey Portfolio** | Cryptographic resilience certificate and creative journey export (`js/portfolio.js`). |

---

## 🗺️ Exact User Journey

```text
Splash (SHOUT · Stellenbosch · Gilead)
   └── Sign In (Mobile Number)
         └── Terms & Conditions (Accept)
               └── Demographics
                     └── Welcome
                           └── Home
                                ├── Instructions & Support Services
                                ├── Pre-Survey (PHQ-9, GAD-7, MARS-5, Stigma-5, BRS, CAGE-AID)
                                ├── 8 Weekly Art Activities (Draw / Voice / Picture / Reflect)
                                ├── Facilitator & Group Chat
                                ├── Games Hub (Moja Meadow 2D, Moja Bee 3D, Moja Pop)
                                ├── Encrypted Writer & Journal
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

## 📜 Authors & Acknowledgements

* **Engineering & Architecture:** Johan Wilhelm van Antwerp — Solutionist of Antwerp Designs & Ecosystems Engineer · [IONITY Global (Pty) Ltd](https://www.ionity.today)
* **Partners:** SHOUT-IT-NOW & Stellenbosch University
* **Sponsorship:** Gilead Sciences

© 2026 IONITY GLOBAL (PTY) LTD. All rights reserved.
