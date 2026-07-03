const express = require('express');
const { db } = require('../db');
const router = express.Router();

// GET /api/members?q=search
router.get('/', async (req, res) => {
  const q = req.query.q ? `%${req.query.q}%` : '%';
  const result = await db.execute({
    sql: 'SELECT id, name FROM members WHERE name LIKE ? ORDER BY name',
    args: [q],
  });
  res.json(result.rows.map(r => ({ id: Number(r.id), name: r.name })));
});

// POST /api/members { name } — upsert: returns existing or newly created member
router.post('/', async (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'Name is required' });

  await db.execute({
    sql: 'INSERT OR IGNORE INTO members (name) VALUES (?)',
    args: [name],
  });

  const result = await db.execute({
    sql: 'SELECT id, name FROM members WHERE name = ? COLLATE NOCASE',
    args: [name],
  });

  const row = result.rows[0];
  res.json({ id: Number(row.id), name: row.name });
});

module.exports = router;
