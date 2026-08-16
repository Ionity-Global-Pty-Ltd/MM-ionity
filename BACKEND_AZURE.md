# MojaMind — Hosted Backend (Azure) Spec & API Contract

**Author:** Johan Wilhelm van Antwerp · Ionity (Pty) Ltd / AEDI
**Status:** Draft v1.0 · 2026-08-16 · CONFIDENTIAL
**Scope:** Where participant data goes, how the device syncs, and how the admin inbox reads every participant's messages.

---

## 1. What the app already does (client side)

The PWA is **offline-first and opt-in**. `js/sync.js` (`MMSync`) queues every study input locally and flushes it to your API with retry + backoff. Nothing is sent until you switch it on.

Turn it on in `js/data.js`:

```js
MM.SYNC = {
  enabled: true,
  base: 'https://mojamind-api.azurewebsites.net/api',  // your Function App
  key:  '<public-write-token>',    // optional; write-only, safe to ship
  studyId: 'creative-resilience-2026',
  flushMs: 15000,
};
```

Records emitted automatically: `demographics`, `survey`, `activity`, `risk`, `message`. Each is small JSON — this is a low-volume study, so cost is negligible.

---

## 2. Recommended architecture (cheapest that fits)

| Concern | Recommendation | Why |
|---|---|---|
| Compute/API | **Azure Functions** (Consumption plan, HTTP triggers) | Pay-per-call, scales to zero, ideal for ~115–200 participants |
| Database | **Azure Table Storage** (or **Cosmos DB serverless** if you want richer queries) | Table Storage is the cheapest durable store; more than enough for this data volume |
| Static hosting | Keep the PWA on **GitHub Pages** (already live at ionity.art) **or** move to **Azure Static Web Apps** (bundles Functions + auth for free tier) | SWA is the tidiest all-in-one; GitHub Pages + standalone Functions also works |
| Region | **South Africa North** | POPIA data residency — keep participant data in-country |
| Secrets | Function keys / **Azure Key Vault**; admin read behind **Entra ID** or a separate admin key | Never ship the admin/read key in the app |

> Fastest path: **Azure Static Web Apps** with the managed Functions API — one deploy, free tier covers this study, and it gives you built-in auth for the admin side.

---

## 3. API contract (what `MMSync` calls)

Base = `MM.SYNC.base`. All requests JSON. Optional header `x-mm-key: <token>`.

### 3.1 `POST /ingest` — one study record
Body:
```json
{
  "id": "uuid",
  "type": "demographics | survey | activity | risk | message",
  "studyId": "creative-resilience-2026",
  "participant": "MM-xxxx",
  "group": 1,
  "payload": { "...type-specific..." },
  "at": "2026-08-16T02:30:00.000Z"
}
```
Return **200/201** on success (any 2xx clears it from the device queue). Non-2xx → device retries later. **Idempotency:** upsert on `id` so retries don't duplicate.

Payloads:
- `demographics` → `{ answers: {age, gender, region, province, grade, ...} }`
- `survey` → `{ phase: "pre"|"post", id, name, answers: { q1:0..3, ... } }`
- `activity` → `{ id, name, option, reflections, uploads:Number, voice:Number }`
- `risk` → `{ phase, total, q9, ticketRef }`  *(PHQ-9 screen — route to social worker)*
- `message` → `{ scope: "group"|"individual", actId, text, who: "participant"|"facilitator" }`

### 3.2 `GET /messages?studyId=&since=` — admin inbox
Returns an array of `message` records (optionally newer than `since` ISO time):
```json
[{ "id":"...", "participant":"MM-xxxx", "group":2, "at":"...",
   "payload": { "scope":"individual", "actId":3, "text":"Hi", "who":"participant" } }]
```
The in-app **All Messages** inbox (facilitator mode → 📥) groups these by participant. **Protect this endpoint** (admin key / Entra ID) — it exposes participant messages.

### 3.3 `GET /config?studyId=` — optional
Return any server-driven config/content the device should pick up (feature flags, week-unlock dates, announcements). `MMSync.pullConfig()` is ready for it.

---

## 4. Minimal Azure Function (Table Storage) — `ingest`

```js
// POST /api/ingest
const { TableClient } = require("@azure/data-tables");
module.exports = async function (context, req) {
  const t = req.body || {};
  if (!t.id || !t.type) return { status: 400, body: "bad record" };
  const client = TableClient.fromConnectionString(process.env.STORAGE_CONN, "mojamind");
  await client.upsertEntity({
    partitionKey: `${t.studyId}:${t.type}`,
    rowKey: t.id,                         // idempotent
    participant: t.participant, group: t.group ?? null,
    at: t.at, data: JSON.stringify(t.payload || {})
  }, "Merge");
  return { status: 200, body: { ok: true } };
};
```
`messages` = same table, query `PartitionKey eq '<studyId>:message'`, project `data`.

---

## 5. Security & POPIA checklist
- TLS everywhere (Azure default). Table Storage is **encrypted at rest** by default.
- Participant IDs are anonymised (`MM-<uuid>`), not names.
- Consent is captured in-app (Terms → Accept) before any data is created.
- Write token (`key`) is **write-only**; the read/admin endpoint uses a **separate** secret never shipped to devices.
- Keep data in **South Africa North**. Add a retention/erasure function for right-to-deletion requests.

---

## 6. Go-live steps
1. Create Function App + Storage (or a Static Web App) in **South Africa North**.
2. Deploy `ingest`, `messages`, (optional `config`).
3. Put the write token behind a function key; guard `messages` with an admin key/Entra ID.
4. Set `MM.SYNC.enabled=true` + `base` + `key` in `js/data.js`, redeploy the PWA.
5. Test: complete a survey on a device → confirm a row appears → open facilitator **All Messages**.

*© 2026 Ionity (Pty) Ltd — MojaMind Creative Resilience.*
