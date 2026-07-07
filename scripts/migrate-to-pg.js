// One-time migration from SQLite (/data/fortified.db) to PostgreSQL.
// Runs automatically before server start. Safe to re-run: exits immediately
// if PostgreSQL already contains member rows.

const fs = require('fs');
const { createClient } = require('@libsql/client');
const { Pool } = require('pg');

const SQLITE_PATH = process.env.SQLITE_PATH || '/data/fortified.db';

async function run() {
  if (!fs.existsSync(SQLITE_PATH)) {
    console.log(`[migrate] No SQLite file at ${SQLITE_PATH} — nothing to migrate.`);
    return;
  }

  console.log(`[migrate] Found SQLite file at ${SQLITE_PATH}`);

  const pg = new Pool({ connectionString: process.env.DATABASE_URL });

  // Ensure schema exists before checking row counts
  await pg.query('CREATE EXTENSION IF NOT EXISTS citext');
  await pg.query(`
    CREATE TABLE IF NOT EXISTS members (
      id   SERIAL PRIMARY KEY,
      name CITEXT NOT NULL UNIQUE
    )
  `);
  await pg.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id         SERIAL PRIMARY KEY,
      member_id  INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
      lift       TEXT    NOT NULL,
      date       TEXT    NOT NULL,
      is_pb      INTEGER NOT NULL DEFAULT 0,
      comments   TEXT    NOT NULL DEFAULT '',
      logged_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pg.query(`
    CREATE TABLE IF NOT EXISTS sets (
      id         SERIAL PRIMARY KEY,
      session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      kg         REAL    NOT NULL,
      reps       INTEGER NOT NULL
    )
  `);
  await pg.query(`
    CREATE INDEX IF NOT EXISTS idx_sessions_member_lift ON sessions(member_id, lift)
  `);

  const existing = await pg.query('SELECT COUNT(*) FROM members');
  if (Number(existing.rows[0].count) > 0) {
    console.log(`[migrate] PostgreSQL already has ${existing.rows[0].count} member(s) — skipping.`);
    await pg.end();
    return;
  }

  const sqlite = createClient({ url: `file:${SQLITE_PATH}` });

  // --- Members ---
  const members = await sqlite.execute('SELECT id, name FROM members ORDER BY id');
  console.log(`[migrate] Copying ${members.rows.length} members...`);
  const memberIdMap = {};
  for (const m of members.rows) {
    const r = await pg.query(
      'INSERT INTO members (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
      [m.name]
    );
    memberIdMap[Number(m.id)] = Number(r.rows[0].id);
  }

  // --- Sessions ---
  const sessions = await sqlite.execute(
    'SELECT id, member_id, lift, date, is_pb, comments FROM sessions ORDER BY id'
  );
  console.log(`[migrate] Copying ${sessions.rows.length} sessions...`);
  const sessionIdMap = {};
  for (const s of sessions.rows) {
    const pgMemberId = memberIdMap[Number(s.member_id)];
    if (!pgMemberId) continue;
    const r = await pg.query(
      'INSERT INTO sessions (member_id, lift, date, is_pb, comments) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [pgMemberId, s.lift, s.date, Number(s.is_pb), s.comments || '']
    );
    sessionIdMap[Number(s.id)] = Number(r.rows[0].id);
  }

  // --- Sets ---
  const sets = await sqlite.execute('SELECT session_id, kg, reps FROM sets ORDER BY id');
  console.log(`[migrate] Copying ${sets.rows.length} sets...`);
  for (const st of sets.rows) {
    const pgSessionId = sessionIdMap[Number(st.session_id)];
    if (!pgSessionId) continue;
    await pg.query(
      'INSERT INTO sets (session_id, kg, reps) VALUES ($1, $2, $3)',
      [pgSessionId, Number(st.kg), Number(st.reps)]
    );
  }

  // --- Verify ---
  const pgM = await pg.query('SELECT COUNT(*) FROM members');
  const pgS = await pg.query('SELECT COUNT(*) FROM sessions');
  const pgSt = await pg.query('SELECT COUNT(*) FROM sets');
  console.log('[migrate] Migration complete:');
  console.log(`  members:  ${members.rows.length} SQLite → ${pgM.rows[0].count} PostgreSQL`);
  console.log(`  sessions: ${sessions.rows.length} SQLite → ${pgS.rows[0].count} PostgreSQL`);
  console.log(`  sets:     ${sets.rows.length} SQLite → ${pgSt.rows[0].count} PostgreSQL`);

  await pg.end();
  sqlite.close();
}

run().catch(err => {
  console.error('[migrate] FAILED:', err);
  process.exit(1);
});
