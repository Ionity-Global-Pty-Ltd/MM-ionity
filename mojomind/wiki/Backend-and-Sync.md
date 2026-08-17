# ☁️ Backend, Sync & Facilitator Portal

## 📌 Architecture: Opt-In Cloud Sync (`js/sync.js` & `server/`)

MojaMind is 100% functional offline and on-device by default. When deployed as part of an institutional research trial, an optional cloud sync module (`MMSync`) can be enabled to aggregate anonymized research data and empower facilitators.

---

## 🏗️ Serverless Azure Architecture

```
┌─────────────────┐       HTTPS POST / Stream       ┌────────────────────────┐
│                 │ ──────────────────────────────> │ Azure Functions        │
│ MojaMind Client │ <────────────────────────────── │ (Serverless REST API)  │
│ (Offline Queue) │       200 OK / Risk Ack         └───────────┬────────────┘
└─────────────────┘                                             │
                                                                ▼
                                                    ┌────────────────────────┐
                                                    │ Azure Cosmos DB / SQL  │
                                                    │ (South Africa North)   │
                                                    └───────────┬────────────┘
                                                                │
                                                                ▼
                                                    ┌────────────────────────┐
                                                    │ Facilitator Admin      │
                                                    │ Live Inbox & Triage    │
                                                    └────────────────────────┘
```

---

## 📡 MMSync Queue & Offline Retry Mechanism

1. **Local Persistent Outbox**:
   * Outgoing survey submissions, activity milestones, and chat messages are written first to an indexed outbox queue in local storage.
2. **Exponential Backoff & Reconnection**:
   * If network connectivity is lost, items remain safely queued. When connectivity returns (`window.addEventListener('online')`), `MMSync` flushes pending batches with automatic exponential backoff.
3. **Data Anonymization**:
   * Research survey telemetry is decoupled from personally identifiable mobile numbers, using random study participant tokens (`p-uuid`).

---

## 📥 Facilitator Admin Portal & Broadcast Hub

When an administrator logs in with study credentials (`S.adminMode = true`):
* **All-Messages Facilitator Inbox**: Displays live, timestamped chat streams from all participants in Group 3, grouped by cohort.
* **Group Broadcast Channel**: Enables facilitators to post pinned announcements, weekly reminders, and encouragement to the entire cohort simultaneously.
* **Risk Triage Dashboard**: Flags participants triggering the PHQ-9 $\ge 20$ / Q9=3 risk screening threshold with immediate case notes and resolution tracking.

---

*© 2026 IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp*
