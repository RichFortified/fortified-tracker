const express = require('express');
const { pool } = require('../db');
const router = express.Router();

// GET /api/members?q=search
router.get('/', async (req, res) => {
  const q = req.query.q ? `%${req.query.q}%` : '%';
  const result = await pool.query(
    'SELECT id, name FROM members WHERE name LIKE $1 ORDER BY name',
    [q]
  );
  res.json(result.rows.map(r => ({ id: Number(r.id), name: r.name })));
});

// POST /api/members { name } — upsert: returns existing or newly created member
router.post('/', async (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'Name is required' });

  await pool.query(
    'INSERT INTO members (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
    [name]
  );

  const result = await pool.query(
    'SELECT id, name FROM members WHERE name = $1',
    [name]
  );

  const row = result.rows[0];
  res.json({ id: Number(row.id), name: row.name });
});

module.exports = router;
