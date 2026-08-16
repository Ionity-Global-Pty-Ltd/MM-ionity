/* GET /api/messages?studyId=&since= — all participants' chat messages.
   ADMIN ONLY: header x-mm-key must equal MM_ADMIN_KEY (never shipped in app).
   Returns: [{ id, participant, group, at, payload:{scope,actId,text,who} }]
   © Ionity (Pty) Ltd */
'use strict';
const { table, cors, keyOk } = require('../shared/table');

module.exports = async function (context, req) {
  const headers = cors();
  if (req.method === 'OPTIONS') { context.res = { status: 204, headers }; return; }

  if (!keyOk(req, 'MM_ADMIN_KEY')) {
    context.res = { status: 401, headers, body: { ok: false, error: 'admin key required' } };
    return;
  }

  const studyId = String((req.query && req.query.studyId) || 'mojamind');
  const since = req.query && req.query.since ? new Date(req.query.since) : null;
  try {
    const client = await table();
    const pk = `${studyId}:message`;
    const out = [];
    const iter = client.listEntities({ queryOptions: { filter: `PartitionKey eq '${pk.replace(/'/g, "''")}'` } });
    for await (const e of iter) {
      if (since && e.at && new Date(e.at) < since) continue;
      let payload = {};
      try { payload = JSON.parse(e.data || '{}'); } catch (_) {}
      out.push({ id: e.rowKey, participant: e.participant, group: e.group ?? null, at: e.at, payload });
    }
    out.sort((a, b) => new Date(a.at) - new Date(b.at));
    context.res = { status: 200, headers, body: out };
  } catch (e) {
    context.log.error('messages failed', e);
    context.res = { status: 500, headers, body: { ok: false, error: 'read failed' } };
  }
};
