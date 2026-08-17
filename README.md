# 🌸 MojaMind — Creative Resilience (MM-ionity)

<div align="center">

[![Deploy MojaMind PWA to GitHub Pages](https://github.com/Ionity-Global-Pty-Ltd/MM-ionity/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Ionity-Global-Pty-Ltd/MM-ionity/actions/workflows/deploy-pages.yml)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20First-5c1680?style=for-the-badge&logo=pwa&logoColor=white)](https://ionity-global-pty-ltd.github.io/MM-ionity/)
[![Version](https://img.shields.io/badge/Version-3.4.0-ffd166?style=for-the-badge&logo=semver&logoColor=black)](CHANGELOG.md)
[![Crafted By Ionity](https://img.shields.io/badge/Engineered%20By-IONITY%20GLOBAL-3366FF?style=for-the-badge&logo=google-cloud&logoColor=white)](https://www.ionity.co.za)
[![Research Partner](https://img.shields.io/badge/Research%20Partner-STELLENBOSCH%20UNIVERSITY-801b2a?style=for-the-badge)](https://www.sun.ac.za)
[![Implementation Partner](https://img.shields.io/badge/Partner-SHOUT--IT--NOW-00a896?style=for-the-badge)](https://shoutitnow.org)
[![Sponsorship](https://img.shields.io/badge/Made%20Possible%20By-GILEAD-e63946?style=for-the-badge)](https://www.gilead.com)
[![License](https://img.shields.io/badge/License-SEE%20LICENSE-ee2b63?style=for-the-badge)](LICENSE.md)

**An 8-Week Offline-First Creative Resilience Intervention Progressive Web App.**  
Powered by **SHOUT-IT-NOW** and **Stellenbosch University**, made possible by **Gilead Sciences**.  
Engineered & Architected by **IONITY Global (Pty) Ltd** · Solutionist: **Johan Wilhelm van Antwerp**.

[🌐 Live App](https://ionity-global-pty-ltd.github.io/MM-ionity/) · [📖 Repository Wiki](wiki/Home.md) · [📝 Changelog](CHANGELOG.md) · [💼 Antwerp Designs](https://www.ionity.today)

</div>

---

## 🌟 Executive Overview

**MojaMind** is an evidence-based digital mental health intervention designed for youth in low-resource and bandwidth-constrained settings across Southern Africa. Operating 100% on-device by default with zero mandatory cloud dependencies, MojaMind blends validated clinical psychological instruments, expressive multi-modal art therapies, on-device neural natural language processing, client-side AES-256 encrypted journaling, and somatic mindfulness games.

---

## ✨ Core Features & Technical Highlights

| Module | Technical Implementation | Description |
| :--- | :--- | :--- |
| 📱 **Zero-Build PWA Shell** | `sw.js`, `manifest.webmanifest`, Vanilla ES6+ | Instant load, complete offline caching, installable on Android / iOS / Desktop with zero bundler friction. |
| 🧠 **On-Device Micro-AI & NLP** | `js/nlp.js`, `js/llm.js` | 25M-parameter MobileBERT sentiment analyzer and Moja Guide Nano-SLM for real-time cognitive coaching and distress triage with zero data consumption. |
| 📋 **21-Survey Clinical Protocol** | `js/data.js`, `js/app.js` | Full pre- and post-intervention assessment batteries (PHQ-9, GAD-7, MARS-5, Stigma-5, BRS-6, CAGE-AID-4, MAUQ-18) with real-time suicide screening and social worker crisis escalation. |
| 🎨 **8-Week Art & Creation Studio** | `js/draw.js`, `js/beat.js`, `js/voice.js` | 7 creative modalities per activity: Physical Art, Digital Canvas, Write-It-Out Notepad, Voice Notes (with speech-to-text), Nature, Digital Collage, and Beat Studio synthesizer. |
| 🔒 **WebCrypto AES-256 Vault** | `js/vault.js` | Client-side zero-knowledge encrypted storage using hardware-backed WebCrypto (`crypto.subtle`) with PBKDF2 key derivation (100,000 iterations). |
| 🌸 **Moja Meadow 2D Zen Garden** | `js/game.js` | Procedural Day/Night cycle mindfulness garden with persistent state, fireflies, and toggleable pentatonic chimes. |
| 🐝 **Moja Bee 3D: Sunray Flight** | `js/game3d.js` | Hardware-accelerated 3D flight canvas engine over sunflower valleys and winding rivers. |
| 🫧 **Moja Pop & Soundscapes** | `js/bubble.js`, `js/soundscape.js` | Somatic bubble-popping de-escalation engine paired with 432Hz procedural nature sound synthesis. |
| 🫁 **Help Now Box Breathing** | `js/app.js`, `css/app.css` | Rhythmic 4-4-4-4 visual and haptic breathing pacer with countdown timers for immediate panic/anxiety reduction. |
| 👥 **3-Cohort Study Gating** | `js/data.js`, `js/app.js` | Protocol-compliant feature gating: **Group 1** (Surveys & Support), **Group 2** (Surveys, Support & Art), **Group 3** (Full Experience with 1:1 Facilitator Chat). |
| 📥 **Facilitator Admin Portal** | `js/sync.js`, `server/` | Optional secure cloud sync bridge to Azure Functions with a central Facilitator Admin Inbox for cohort monitoring and broadcast announcements. |
| 🪫 **Low-Power Budget Mode** | `css/app.css`, `js/app.js` | Adaptive GPU/RAM detection for budget devices (≤4GB RAM / Save-Data) automatically disables expensive backdrop-blurs, tap particles, and heavy animations. |

---

## 🗺️ Complete User Journey & Screen Hierarchy

```text
Opening Splash Screen (Stellenbosch University · SHOUT-IT-NOW · Gilead)
   │
   └── 📱 Mobile Number Sign-In (MojaMind Branded Auth)
         │
         └── 📜 Terms & Conditions (Explicit Protocol Consent · "Accept")
               │
               └── 📊 Demographic Survey (16 Questions: Age, Gender, Grades R-12/Matric, Region, Living Conditions)
                     │
                     └── 🌟 Welcome Screen (Intervention Overview · Data Voucher & Incentive Details)
                           │
                           └── 🏠 MojaMind Intervention Home
                                 │
                                 ├── 📋 Pre-Survey Battery (3 Modules: Mental Health, Lifestyle, Personal Wellbeing)
                                 │     └── 🚨 Automated PHQ-9 Risk Screening (Score ≥20 or Q9=3 → Social Worker Alert)
                                 │
                                 ├── 🎨 8 Weekly Art Activities (Unlocked upon Pre-Survey Completion)
                                 │     ├── Week 1: Self-Portrait
                                 │     ├── Week 2: My Safe Space
                                 │     ├── Week 3: My Family
                                 │     ├── Week 4: My Journey
                                 │     ├── Week 5: My Homestead
                                 │     ├── Week 6: Vision Board
                                 │     ├── Week 7: Letter to Myself
                                 │     └── Week 8: My Song of Strength
                                 │           │
                                 │           └── 🛠️ 7 Expression Options per Week:
                                 │                 1. 🎨 Physical Artwork (Photo Upload & Color Psychology)
                                 │                 2. 🖌️ Digital Canvas (Brushes, Glow, Stickers, Export)
                                 │                 3. ✍️ Write-It-Out Notepad (Multi-Tab Autosave)
                                 │                 4. 🎤 Speak Up (Voice Recording & Speech-to-Text)
                                 │                 5. 🌿 Use Nature (Environmental Art Submission)
                                 │                 6. 📱 Get Digital (Photo & Collage)
                                 │                 7. 🥁 Make Music (Interactive Beat Studio Synthesizer)
                                 │
                                 ├── 💬 Facilitator Chat (Group 3: Broadcast Feed + 1:1 Private Facilitator Chat + Moja Guide AI)
                                 ├── 🌸 Daily Mood Garden (Single Daily Check-In Limit with Streak Tracking)
                                 ├── 🎮 Games & Mindfulness Hub (Moja Meadow 2D, Sunray Flight 3D, Serenity Bubble Pop)
                                 ├── 🎧 432Hz Ambient Soundscapes (Rain, Ocean, Forest, Wind procedurally synthesized)
                                 ├── 🫁 Help Now (4-4-4-4 Box Breathing Countdown + Emergency Helplines)
                                 ├── 🆘 Support Services (Separate Channels for IT Technical Support & Social Work)
                                 ├── 🔒 WebCrypto Encrypted Journal (PBKDF2 PIN Protected Zero-Knowledge Vault)
                                 └── 🎓 Post-Survey Battery & Journey Certificate (Unlocks after 8 Activities)
```

---

## 📊 Validated Clinical Survey Battery (21 Survey Suite)

The study protocol enforces 21 distinct survey modules across the three study groups:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRE-SURVEY (3 Modules)                          │
├─────────────────────────┬──────────────────────┬───────────────────────┤
│ Mental Health (16 Qs)   │ Lifestyle (10 Qs)    │ Wellbeing (10 Qs)     │
│ • PHQ-9 (9 items)       │ • MARS-5 (5 items)   │ • BRS (6 items)       │
│ • GAD-7 (7 items)       │ • Stigma-5 (5 items) │ • CAGE-AID (4 items)  │
└─────────────────────────┴──────────────────────┴───────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                        POST-SURVEY (4 Modules)                         │
├─────────────────────────┬──────────────────────┬───────────────────────┼─────────────────────────┤
│ Mental Health (16 Qs)   │ Lifestyle (10 Qs)    │ Wellbeing (10 Qs)     │ Usability (18 Qs)       │
│ • PHQ-9 (9 items)       │ • MARS-5 (5 items)   │ • BRS (6 items)       │ • MAUQ Usability scale  │
│ • GAD-7 (7 items)       │ • Stigma-5 (5 items) │ • CAGE-AID (4 items)  │                         │
└─────────────────────────┴──────────────────────┴───────────────────────┴─────────────────────────┘
```

### Clinical Risk Scoring Matrix
* **PHQ-9 Sum Score 20–27**: Classifies potential severe depression.
* **PHQ-9 Question 9 = 3 ("Nearly every day")**: Triggers suicide risk flag.
* **Action**: Immediately displays a supportive referral modal:  
  > *"Your responses suggest that you may be experiencing some challenges, and we would like to offer additional support. A social worker will contact you to offer assistance."*  
  Automatically logs a high-priority confidential social worker care ticket in the facilitator stream.

---

## 🎨 Ionity Design System & Aesthetics

* **Color Palette**:
  * Background: `#1A1A1A` (Deep Obsidian)
  * Primary Accent: `#3366FF` (Ion Electric Cobalt)
  * High-Contrast Text: `#FFFFFF` (Pure White)
  * Secondary Accents: `#00A896` (SHOUT Teal), `#801B2A` (Stellenbosch Maroon), `#FFD166` (Sunburst Gold)
* **Visual Structure**:
  * Structured geometric card grids with 1px border precision.
  * Subtle glassmorphism with GPU-conscious fallbacks for low-end hardware.
  * 8-bit retro accents in mini-games and gamification milestone badges.
  * Full WCAG 2.1 AA accessibility (ARIA roles, live regions, scalable typography, reduced-motion queries).

---

## 🚀 Running Locally

MojaMind has **zero build dependencies** and runs directly in any modern browser:

```bash
# Clone the repository
git clone https://github.com/Ionity-Global-Pty-Ltd/MM-ionity.git
cd MM-ionity

# Option 1: Run with Python 3
python -m http.server 8123

# Option 2: Run with Node npx
npx serve . -l 8123
```

Navigate to `http://localhost:8123` in your browser.

---

## 📂 Project Structure

```text
MM-ionity/
├── assets/                  # High-res branding, partner logos, audio samples, video assets
│   ├── branding/            # MojaMind, SHOUT-IT-NOW & Ionity vector/raster logos
│   └── partners/            # Stellenbosch University & Gilead official marks
├── css/
│   └── app.css              # Core Design System, Ionity palette, dark tokens, animations
├── js/
│   ├── app.js               # Application router, view controllers, state management
│   ├── beat.js              # Option 7 Beat Studio drum machine & synthesizer engine
│   ├── bubble.js            # Moja Pop serenity bubble de-escalation engine
│   ├── data.js              # Survey definitions, 8-week curriculum, copy & study groups
│   ├── draw.js              # Digital Art Studio canvas, color psychology & notepad
│   ├── game.js              # Moja Meadow 2D Zen Garden
│   ├── game3d.js            # Moja Bee 3D Sunray Flight engine
│   ├── llm.js               # Moja Guide Nano-SLM on-device inference
│   ├── nlp.js               # MobileBERT sentiment engine & distress detector
│   ├── portfolio.js         # Certificate generator & journey summary
│   ├── soundscape.js        # 432Hz procedural Web Audio soundscape generator
│   ├── sync.js              # Opt-in Azure cloud sync & offline retry queue
│   ├── vault.js             # WebCrypto AES-GCM 256-bit PBKDF2 encrypted vault
│   ├── video.js             # Interactive avatar narrator & video guides
│   └── voice.js             # Speech recognition & voice note recorder
├── server/                  # Serverless Azure Functions backend (optional sync)
├── wiki/                    # Comprehensive repository technical documentation
├── index.html               # Main PWA application entry point
├── manifest.webmanifest     # Standalone PWA installation manifest
├── sw.js                    # Cache-first offline Service Worker
├── CHANGELOG.md             # Detailed version history and release notes
├── LICENSE.md               # Software licensing information
└── README.md                # Project documentation (this file)
```

---

## 📜 Authors & Acknowledgements

* **Architecture & Lead Engineering:**  
  **Johan Wilhelm van Antwerp**  
  *Solutionist of Antwerp Designs & Ecosystems Engineer*  
  **IONITY Global (Pty) Ltd** · [www.ionity.co.za](https://www.ionity.co.za) · [www.ionity.today](https://www.ionity.today)
* **Research & Clinical Leadership:**  
  **Stellenbosch University** & **SHOUT-IT-NOW**
* **Sponsorship:**  
  Made possible through generous grant support from **Gilead Sciences**.

---

*© 2026 IONITY Global (Pty) Ltd — Building Tomorrow, Today. Anything is Possible with God.*
