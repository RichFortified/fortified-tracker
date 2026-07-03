const { createClient } = require('@libsql/client');
const path = require('path');

const db = createClient({
  url: `file:${path.join(__dirname, '..', 'fortified.db')}`,
});

async function init() {
  await db.executeMultiple(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS members (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE COLLATE NOCASE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id  INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
      lift       TEXT    NOT NULL,
      date       TEXT    NOT NULL,
      is_pb      INTEGER NOT NULL DEFAULT 0,
      comments   TEXT    NOT NULL DEFAULT '',
      logged_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sets (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      kg         REAL    NOT NULL,
      reps       INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_member_lift ON sessions(member_id, lift);
  `);
}

module.exports = { db, init };
