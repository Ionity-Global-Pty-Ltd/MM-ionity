/* POST /api/ingest — store one study record (idempotent upsert).
   Body: { id, type, studyId, participant, group, payload, at }
   Auth: header x-mm-key must equal MM_WRITE_KEY.
   © Ionity (Pty) Ltd */
'use strict';
const { table, cors, keyOk } = require('../shared/table');

module.exports = async function (context, req) {
  const headers = cors();
  if (req.method === 'OPTIONS') { context.res = { status: 204, headers }; return; }

  if (!keyOk(req, 'MM_WRITE_KEY')) {
    context.res = { status: 401, headers, body: { ok: false, error: 'unauthorized' } };
    return;
  }

  const t = req.body || {};
  if (!t.id || !t.type) {
    context.res = { status: 400, headers, body: { ok: false, error: 'id and type required' } };
    return;
  }

  const studyId = String(t.studyId || 'mojamind');
  const type = String(t.type);
  try {
    const client = await table();
    await client.upsertEntity({
      partitionKey: `${studyId}:${type}`,
      rowKey: String(t.id),                       // idempotent — retries won't duplicate
      participant: t.participant ? String(t.participant) : null,
      group: (t.group ?? null),
      at: t.at || new Date().toISOString(),
      data: JSON.stringify(t.payload || {}),
    }, 'Merge');
    context.res = { status: 200, headers, body: { ok: true } };
  } catch (e) {
    context.log.error('ingest failed', e);
    context.res = { status: 500, headers, body: { ok: false, error: 'store failed' } };
  }
};
