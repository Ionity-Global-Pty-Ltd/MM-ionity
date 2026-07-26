# 🌸 MojoMind — Creative Resilience

**An 8-week creative resilience intervention, as a beautiful offline-first PWA.**

MojoMind guides participants through a research-backed creative resilience journey:
validated mental-health check-ins, weekly art activities, facilitated chat, and
always-available crisis support — all wrapped in the signature MojoMind
purple-and-pink experience.

> Crafted with ❤ by **IONITY GLOBAL (PTY) LTD** · [www.ionity.co.za](https://www.ionity.co.za) · MojoMind branding and content preserved as-is.

**Live:** [https://www.hellion.solutions](https://www.hellion.solutions) (GitHub Pages, custom domain; `hellion.solutions` redirects here)

---

## ✨ The journey (exact app pathing)

```
Sign In → Terms & Conditions → Welcome → Demographic Questions → Home
Home ├── Instructions
     ├── Support Services
     ├── Pre-Survey  ──► Mental Health (PHQ-9 + GAD-7)
     │                   Lifestyle Management (MARS-5 + Stigma-5)
     │                   Personal Wellbeing (BRS + CAGE-AID)
     ├── Art Activities (unlocks after Pre-Survey) ──► 8 weekly activities
     │        └── 5 creative options each → Start Here | Materials | Pictures | Reflections
     ├── Chat (Group / Individual, per activity)
     └── Post-Survey ──► all of the above + App Usability Survey
Help Now (crisis support + guided 4·6·7 breathing) is one tap away on every screen.
```

## 💜 Feature highlights

| | |
|---|---|
| 📱 **True PWA** | Installable, offline-first service worker, app shortcuts |
| 🧠 **Validated instruments** | PHQ-9, GAD-7, MARS-5, Stigma-5, BRS, CAGE-AID, usability |
| 🌼 **Mood garden** | Daily mood check-ins grow a living flower garden with streaks |
| 🎨 **8 art activities** | Options for art, writing, voice, nature & digital creation |
| 📸 **Visual diary** | Photo uploads (stored locally, auto-compressed) + reflections |
| 💬 **Chat** | Group & individual facilitator channels per activity |
| 🫁 **Help Now** | Crisis steps, tap-to-call helplines, animated breathing coach |
| ♿ **Accessible** | ARIA roles, keyboard navigation, reduced-motion support |
| 🔒 **Private by design** | All data stays on-device in `localStorage` |

## 🚀 Run it

No build step. Serve the folder with any static server:

```bash
npx serve .
# or
python -m http.server 8080
```

Then open `http://localhost:8080`. Install it from your browser's
"Add to Home Screen / Install app" prompt for the full experience.

### Demo notes
- Sign in with any valid-looking mobile number + any password.
- The Pre-Survey unlocks Art Activities, Chat and the Post-Survey.
- Weekly activity unlocks are simulated from your sign-up date; completed
  surveys can be redone via the "Redo survey (demo)" button.

## 🗂 Structure

```
index.html            app shell
css/app.css           design system (video-accurate palette)
js/data.js            all study content & instruments (verbatim)
js/app.js             router, state, screens, PWA glue
sw.js                 offline-first service worker
manifest.webmanifest  PWA manifest + shortcuts
icons/                generated brand icons
tools/make-icons.ps1  icon generator
```

---

© 2026 IONITY GLOBAL (PTY) LTD. All rights reserved.
MojoMind™ and the MojoMind flower are used as provided in the source materials.
