/* GET /api/config?studyId= — server-driven config the device can pull
   (feature flags, week-unlock dates, announcements). Public read.
   Stored as a single row PartitionKey='<studyId>:config', RowKey='current'.
   © Ionity (Pty) Ltd */
'use strict';
const { table, cors } = require('../shared/table');

module.exports = async function (context, req) {
  const headers = cors();
  if (req.method === 'OPTIONS') { context.res = { status: 204, headers }; return; }

  const studyId = String((req.query && req.query.studyId) || 'mojamind');
  try {
    const client = await table();
    let cfg = {};
    try {
      const row = await client.getEntity(`${studyId}:config`, 'current');
      cfg = JSON.parse(row.data || '{}');
    } catch (_) { /* no config set yet */ }
    context.res = { status: 200, headers, body: cfg };
  } catch (e) {
    context.log.error('config failed', e);
    context.res = { status: 200, headers, body: {} };
  }
};
