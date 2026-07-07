const express = require('express');
const { pool } = require('../db');
const router = express.Router();

function brzycki1RM(kg, reps) {
  if (reps === 1) return kg;
  if (reps >= 37) return null;
  return kg * (36 / (37 - reps));
}

function bestSet(sets) {
  let best = null;
  sets.forEach(s => {
    const e = brzycki1RM(Number(s.kg), Number(s.reps));
    if (e !== null && (best === null || e > best.est1rm)) {
      best = { kg: Number(s.kg), reps: Number(s.reps), est1rm: e };
    }
  });
  return best;
}

// GET /api/sessions?member_id=&lift=
router.get('/', async (req, res) => {
  const { member_id, lift } = req.query;
  if (!member_id || !lift) {
    return res.status(400).json({ error: 'member_id and lift are required' });
  }

  const sessionsResult = await pool.query(
    `SELECT id, date, is_pb, comments
     FROM sessions
     WHERE member_id = $1 AND lift = $2
     ORDER BY date DESC, logged_at DESC`,
    [member_id, lift]
  );

  const sessions = [];
  for (const row of sessionsResult.rows) {
    const setsResult = await pool.query(
      'SELECT kg, reps FROM sets WHERE session_id = $1 ORDER BY id ASC',
      [row.id]
    );
    sessions.push({
      id: Number(row.id),
      date: row.date,
      isPB: Number(row.is_pb) === 1,
      comments: row.comments || '',
      sets: setsResult.rows.map(s => ({ kg: Number(s.kg), reps: Number(s.reps) })),
    });
  }

  res.json(sessions);
});

// POST /api/sessions { member_id, lift, sets, comments, date }
router.post('/', async (req, res) => {
  const { member_id, lift, sets, comments, date } = req.body;

  if (!member_id || !lift || !Array.isArray(sets) || sets.length === 0 || !date) {
    return res.status(400).json({ error: 'member_id, lift, date, and a non-empty sets array are required' });
  }

  // Fetch all previous sets for this member+lift to determine PB
  const prevResult = await pool.query(
    `SELECT s.kg, s.reps
     FROM sets s
     JOIN sessions sess ON s.session_id = sess.id
     WHERE sess.member_id = $1 AND sess.lift = $2`,
    [member_id, lift]
  );

  const prevBest = bestSet(prevResult.rows);
  const newBest = bestSet(sets);
  const isPB = newBest !== null && (prevBest === null || newBest.est1rm > prevBest.est1rm);

  const client = await pool.connect();
  let sessionId;
  try {
    await client.query('BEGIN');

    const sessionResult = await client.query(
      'INSERT INTO sessions (member_id, lift, date, is_pb, comments) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [member_id, lift, date, isPB ? 1 : 0, comments || '']
    );
    sessionId = sessionResult.rows[0].id;

    for (const s of sets) {
      await client.query(
        'INSERT INTO sets (session_id, kg, reps) VALUES ($1, $2, $3)',
        [sessionId, s.kg, s.reps]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  res.status(201).json({ id: sessionId, isPB, bestSet: newBest });
});

module.exports = router;
