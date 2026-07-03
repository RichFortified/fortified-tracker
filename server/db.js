const { createClient } = require('@libsql/client');
const path = require('path');
const fs = require('fs');

const DB_URL = process.env.DATABASE_URL || 'file:/data/fortified.db';

console.log(`Database path: ${DB_URL}`);

// Ensure the parent directory exists — required when Railway mounts a volume at /data
if (DB_URL.startsWith('file:')) {
  try {
    fs.mkdirSync(path.dirname(DB_URL.slice(5)), { recursive: true });
  } catch (e) {
    console.warn(`Warning: could not create database directory: ${e.message}`);
  }
}

const db = createClient({ url: DB_URL });

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
