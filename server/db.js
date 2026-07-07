const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function init() {
  await pool.query('CREATE EXTENSION IF NOT EXISTS citext');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS members (
      id   SERIAL PRIMARY KEY,
      name CITEXT NOT NULL UNIQUE
    )
  `);
  await pool.query(`
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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sets (
      id         SERIAL PRIMARY KEY,
      session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      kg         REAL    NOT NULL,
      reps       INTEGER NOT NULL
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_sessions_member_lift ON sessions(member_id, lift)
  `);
}

module.exports = { pool, init };
