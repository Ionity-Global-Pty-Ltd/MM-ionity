# MojaMind — Recommendations & Roadmap

**Author:** Johan Wilhelm van Antwerp · Ionity (Pty) Ltd / AEDI · 2026-08-16

A prioritised list of what to do next — AI integrations, performance, UX, and study-integrity items — after this session's fixes.

---

## A. AI integrations (you asked to expand these)

The app already ships strong **on-device** AI (Moja Guide micro-LLM, MobileBERT sentiment, Moja Vision colour psychology, speech-to-text). Recommended additions, cheapest/safest first:

1. **Optional cloud LLM bridge for chat** — when a participant asks something the on-device model can't answer, fall back to a hosted model (Azure OpenAI, in South Africa North for POPIA). Keep it *opt-in* like `MMSync`; on-device stays the default so the app remains DataFree. **High value, moderate effort.**
2. **AI distress flagging on artwork** (meeting doc idea) — extend Moja Vision so dark/low-mood colour signatures raise a soft flag that emails/queues a facilitator alert (reuse the existing risk-ticket + `MMSync` `risk` channel). **High value — clinical safety.**
3. **AI voice-note summariser** — you already transcribe voice; add a one-line on-device summary + sentiment per note so facilitators skim faster. **Medium.**
4. **Adaptive Daily Spark / prompts** — pick journal prompts and activity nudges from the participant's recent mood/engagement (the recommender already exists — feed it sentiment). **Medium, low risk.**
5. **Admin AI triage in the inbox** — auto-rank incoming messages by urgency (crisis words, negative sentiment) so facilitators see the ones that matter first. Builds on the new inbox + NLP. **Medium.**
6. **AI colour/prompt coaching in the Digital Art Studio** — live, encouraging feedback while drawing (extends Moja Vision). **Nice-to-have.**

---

## B. Performance — "load 1–2 pages at a time"

Done this session: service worker no longer pre-downloads the whole app; heavy modules lazy-load. Next, to cut the initial parse further:

1. **Split `js/app.js` (~290 KB) into route chunks.** It's one monolith parsed at boot. Extract screen groups (onboarding, surveys, art, chat, games, journal, profile) into files loaded on first visit via the existing `ensureModule()`. **Biggest remaining win; needs care + live testing.**
2. **Defer non-critical CSS** — `app.css` is ~178 KB; split the games/art-studio styling into a lazily-injected sheet.
3. **Route-level DOM is already single-page** (each route replaces `#app`), so only one screen is in the DOM at a time — good. Add teardown for canvas/audio when leaving games (some timers keep running).
4. **Cap device-pixel-ratio** in the meadow/3D games on low-end phones (detect `deviceMemory`/`hardwareConcurrency`) to stop frame drops.

---

## C. Data & study integrity
1. **Wire the Azure backend** (see `BACKEND_AZURE.md`) so pre/post/activity/risk/chat data is centralised — currently on-device only.
2. **Admin inbox is in** (facilitator → 📥 All Messages); it needs the backend live to populate.
3. **Server-driven week unlock dates** via `MMSync.pullConfig()` so the study team controls the schedule without redeploys.
4. **Right-to-erasure** endpoint for POPIA requests.

---

## D. Remaining QA / UX (from the docs)
1. **Home side-tab redesign** — move Games/Journal/secondary sections into a collapsible edge "bookmark" rail (the main outstanding UI ask).
2. **Wire Activity 5–8 option videos** from the media pack into the activity screens (`assets/videos/`, streamed — not committed to git).
3. **Terms "read more"** content pass; **Welcome** headline colour token.
4. **Swap in final logo assets** (Stellenbosch + Gilead + SHOUT) at real resolution.
5. **Certificate of completion** — confirm with Stellenbosch, keep or remove.

---

## E. Housekeeping
- Keep the 2.9 GB media zip **out of git** (`.gitignore` now covers `*.zip`); host videos on a CDN or Azure Blob and reference by URL.
- Consider trimming the duplicate `mojomind/` tree once you confirm only the root is deployed.

*© 2026 Ionity (Pty) Ltd — Building Tomorrow, Today.*
