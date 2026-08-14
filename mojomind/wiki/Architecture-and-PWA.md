# 🏗️ Architecture & PWA Guide

## Overview
MojaMind is built with Vanilla HTML5, CSS3, and ES6+ JavaScript, designed with zero build-step dependencies for rapid local debugging, high performance, and offline reliability.

### Key Components
- **`index.html`**: Host shell, Web Manifest link, and script loader.
- **`css/app.css`**: Core design system, glassmorphism tokens, and accessibility modes.
- **`sw.js`**: Cache-first offline Service Worker storing all core assets, scripts, and vector artwork.
- **`manifest.webmanifest`**: Standalone PWA manifest with maskable app icons, theme colors, and quick shortcuts.

### Offline Operation
Once loaded or installed via "Add to Home Screen", MojaMind operates fully without an active internet connection. Media assets like video guides are streamed on-demand, while critical vector graphics, soundscapes, and survey instruments are permanently accessible offline.
