/* Shared helpers for the MojaMind study API.
   © Ionity (Pty) Ltd — Johan Wilhelm van Antwerp */
'use strict';
const { TableClient } = require('@azure/data-tables');

const TABLE = process.env.MM_TABLE || 'mojamind';
let _client = null;

/** Lazily create (and ensure) the Table Storage client. */
async function table() {
  if (_client) return _client;
  const conn = process.env.STORAGE_CONN;
  if (!conn) throw new Error('STORAGE_CONN not configured');
  _client = TableClient.fromConnectionString(conn, TABLE, { allowInsecureConnection: /UseDevelopmentStorage/.test(conn) });
  try { await _client.createTable(); } catch (_) { /* already exists */ }
  return _client;
}

const cors = () => ({
  'Access-Control-Allow-Origin': process.env.CORS_ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-mm-key',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
});

/** Constant-time-ish key check. */
function keyOk(req, envName) {
  const expected = process.env[envName];
  if (!expected) return false;
  const got = (req.headers && (req.headers['x-mm-key'] || req.headers['X-MM-KEY'])) || '';
  return got === expected;
}

module.exports = { table, cors, keyOk, TABLE };
