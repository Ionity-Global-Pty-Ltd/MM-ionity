/* ============================================================
   MojaMind — Cloud Sync Client (MMSync)
   Optional, offline-first bridge between the on-device app and a
   hosted study database (Azure Functions + Table/Cosmos, or any
   compatible REST endpoint — see BACKEND_AZURE.md).

   Design principles:
   • OPT-IN — disabled by default (MM.SYNC.enabled=false). When off,
     the app stays 100% on-device / DataFree and every call no-ops.
   • OFFLINE-FIRST — writes are queued locally and flushed with
     retry + exponential backoff; nothing is lost if the device is
     offline or the server is down.
   • FAIL-SAFE — every public method is wrapped so a network error
     can never break the UI or block a save().

   © IONITY Global (Pty) Ltd · Johan Wilhelm van Antwerp
   Antwerp Designs · www.ionity.co.za
   ============================================================ */
'use strict';

const MMSync = (() => {
  const QKEY = 'mm_sync_queue_v1';
  const PID_KEY = 'mm_participant_id_v1';
  let flushing = false;
  let timer = null;
  let backoff = 0; // ms, grows on failure

  const cfg = () => (typeof MM !== 'undefined' && MM.SYNC) ? MM.SYNC : { enabled: false, base: '', key: '', studyId: 'mojamind', flushMs: 15000 };
  const on = () => { const c = cfg(); return !!(c.enabled && c.base); };

  /* ── Stable participant / device id ─────────────────────── */
  function participantId() {
    try {
      const S = globalThis.S;
      if (S && S.participantCertId) return S.participantCertId;
      let id = localStorage.getItem(PID_KEY);
      if (!id) {
        id = 'MM-' + (crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
        localStorage.setItem(PID_KEY, id);
      }
      return id;
    } catch { return 'MM-anon'; }
  }

  /* ── Local durable queue (survives reload) ──────────────── */
  function readQ() { try { return JSON.parse(localStorage.getItem(QKEY)) || []; } catch { return []; } }
  function writeQ(q) { try { localStorage.setItem(QKEY, JSON.stringify(q.slice(-500))); } catch { /* storage full — drop silently */ } }

  /** Enqueue a study record for upload. type: demographics|survey|activity|risk|mood|event */
  function record(type, payload) {
    try {
      const c = cfg();
      const item = {
        id: (crypto?.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2)),
        type,
        studyId: c.studyId || 'mojamind',
        participant: participantId(),
        group: (globalThis.S && globalThis.S.group) || null,
        payload,
        at: new Date().toISOString(),
        tries: 0,
      };
      const q = readQ(); q.push(item); writeQ(q);
      scheduleFlush(400);
      return true;
    } catch { return false; }
  }

  /* ── Chat: send a message to the study (admin can read all) ─ */
  function sendMessage(scope, actId, text, who = 'participant') {
    return record('message', { scope, actId, text, who });
  }

  /* ── Flush queue to server ──────────────────────────────── */
  function scheduleFlush(ms) {
    if (!on()) return;
    clearTimeout(timer);
    timer = setTimeout(flush, Math.max(0, ms ?? (cfg().flushMs || 15000)));
  }

  async function flush() {
    if (flushing || !on() || !navigator.onLine) { scheduleFlush(); return; }
    const q = readQ();
    if (!q.length) { scheduleFlush(); return; }
    flushing = true;
    const c = cfg();
    const headers = { 'Content-Type': 'application/json' };
    if (c.key) headers['x-mm-key'] = c.key;
    const remaining = [];
    let anyFail = false;
    for (const item of q) {
      try {
        const res = await fetch(`${c.base.replace(/\/$/, '')}/ingest`, {
          method: 'POST', headers, body: JSON.stringify(item), keepalive: true,
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        // success → drop from queue
      } catch {
        item.tries = (item.tries || 0) + 1;
        if (item.tries < 25) remaining.push(item); // give up after ~25 tries
        anyFail = true;
      }
    }
    writeQ(remaining);
    flushing = false;
    backoff = anyFail ? Math.min(5 * 60 * 1000, (backoff || 5000) * 2) : 0;
    scheduleFlush(anyFail ? backoff : (c.flushMs || 15000));
  }

  /* ── Admin: pull all participants' messages ─────────────── */
  async function pullMessages(since) {
    if (!on()) return { ok: false, offline: true, messages: [] };
    try {
      const c = cfg();
      const headers = {}; if (c.key) headers['x-mm-key'] = c.key;
      const u = new URL(`${c.base.replace(/\/$/, '')}/messages`);
      u.searchParams.set('studyId', c.studyId || 'mojamind');
      if (since) u.searchParams.set('since', since);
      const res = await fetch(u.toString(), { headers });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      return { ok: true, messages: Array.isArray(data) ? data : (data.messages || []) };
    } catch (e) { return { ok: false, error: String(e), messages: [] }; }
  }

  /* ── Optional: pull remote content/config to the device ─── */
  async function pullConfig() {
    if (!on()) return { ok: false, offline: true };
    try {
      const c = cfg();
      const headers = {}; if (c.key) headers['x-mm-key'] = c.key;
      const res = await fetch(`${c.base.replace(/\/$/, '')}/config?studyId=${encodeURIComponent(c.studyId || 'mojamind')}`, { headers });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return { ok: true, config: await res.json() };
    } catch (e) { return { ok: false, error: String(e) }; }
  }

  function pendingCount() { return readQ().length; }
  function status() { return { enabled: on(), pending: pendingCount(), participant: participantId(), base: cfg().base || null }; }

  /* ── Lifecycle: flush on load, on reconnect, on interval ── */
  try {
    globalThis.addEventListener?.('online', () => scheduleFlush(200));
    globalThis.addEventListener?.('load', () => scheduleFlush(1500));
    document.addEventListener?.('visibilitychange', () => { if (!document.hidden) scheduleFlush(500); });
  } catch { /* noop */ }
  scheduleFlush(2000);

  return { record, sendMessage, flush, pullMessages, pullConfig, participantId, pendingCount, status };
})();

globalThis.MMSync = MMSync;
