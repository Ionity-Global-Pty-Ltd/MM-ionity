# 🏗️ Architecture & PWA Guide

## 📌 Architectural Overview

MojaMind is built with **Vanilla HTML5, CSS3, and modern ES6+ JavaScript**, intentionally avoiding heavy frontend frameworks (React, Angular, Vue) or complex bundlers (Webpack, Vite). This delivers:
1. **Zero-Build Deployment**: Instant editing and static hosting (e.g., GitHub Pages, Azure Static Web Apps, local Python servers).
2. **Ultra-Low Memory Footprint**: Crucial for entry-level Android devices (≤2GB–4GB RAM) common across low-resource settings.
3. **Deterministic Execution**: No framework-induced runtime overhead or black-box state reconciliation.

---

## 📱 Progressive Web App (PWA) Lifecycle

### 1. Service Worker Strategy (`sw.js`)
* **Cache-First Core Shell**: The Service Worker pre-caches all essential HTML, CSS, JavaScript logic, brand SVG vector assets, and sound synthesis algorithms on first load.
* **On-Demand Dynamic Asset Caching**: Heavier optional assets (such as 3D canvas assets, mini-games, and video guides) are fetched and cached lazily when first requested by the user.
* **Versioned Cache Busting**: The Service Worker implements cache version tags (e.g. `v3.4.0`) that automatically purge obsolete assets upon new deployments while preserving the user's encrypted local data.

### 2. Web App Manifest (`manifest.webmanifest`)
* **Standalone Display**: Configured as `"display": "standalone"`, giving the app a native full-screen shell without browser address bar clutter.
* **Maskable Adaptive Icons**: Provides standard and maskable SVG/PNG icons for Android adaptive icon rendering.
* **Color Scheme Coordination**: Matches the Ionity `#1A1A1A` background and `#3366FF` theme accent across system UI bars.

---

## 🎛️ State Management & Routing Architecture

### Centralized App State (`S` in `js/app.js`)
The application state is maintained in a single reactive state object `S` that synchronizes continuously with `localStorage` and the `WebCrypto Vault`:
* `S.user`: Mobile phone identity, study cohort ID (`group 1`, `group 2`, or `group 3`).
* `S.termsAccepted`: Timestamp of Terms & Conditions consent.
* `S.demographics`: 16 demographic survey data points.
* `S.surveys`: Map of pre- and post-intervention survey responses, scores, and completion timestamps.
* `S.activities`: Map of 8 weekly activity submissions, draft writings, color psychology insights, and attached media.
* `S.moods`: Daily mood garden entries (restricted to one per calendar day).
* `S.chat`: 1:1 Facilitator message history and group announcement broadcasts.
* `S.vault`: Encrypted journal records.

### Hash-Based Declarative Router
Navigation is handled via standard hash-routing (`#/home`, `#/pre`, `#/art/:id`, `#/post`, `#/chat`, `#/games`), enabling:
* Natural back/forward hardware button navigation on Android.
* Deep linking across distinct intervention stages.
* Intercepted route guards (e.g., redirecting to `#/demographics` if onboarding is incomplete, or blocking `#/post` until all 8 activities are submitted).

---

## 🪫 Low-Power & Budget Hardware Adaptation

To ensure smooth 60fps interaction on entry-level hardware:
1. **Device Profiling**: Detects `navigator.hardwareConcurrency ≤ 4`, `navigator.deviceMemory ≤ 4`, or `Save-Data` headers.
2. **GPU Optimization**: Drops expensive CSS `backdrop-filter: blur()`, complex box-shadow stacks, and dynamic particle bursts.
3. **Canvas Lifecycle Teardown**: Explicitly destroys WebGL, Canvas 2D, and Web Audio contexts upon route navigation to prevent GPU/RAM memory leaks.

---

*© 2026 IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp*
