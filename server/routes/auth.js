const express = require('express');
const { Resend } = require('resend');
const { pool } = require('../db');

const router = express.Router();
const resend  = new Resend(process.env.RESEND_API_KEY);
const FROM    = process.env.FROM_EMAIL || 'noreply@tracker.fortifiedgym.com';
const COOKIE  = 'session';

// POST /api/auth/request-login  { email }
router.post('/request-login', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const result = await pool.query(
    'SELECT id, name, email FROM members WHERE LOWER(email) = $1',
    [email]
  );

  const member = result.rows[0];
  if (!member) {
    return res.status(404).json({ error: 'Email not found' });
  }

  const code      = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await pool.query(
    'INSERT INTO tokens (email, token, expires_at) VALUES ($1, $2, $3)',
    [member.email, code, expiresAt]
  );

  await resend.emails.send({
    from: FROM,
    to:   member.email,
    subject: 'Your Fortified Tracker code',
    html: `
      <p>Hi ${member.name},</p>
      <p>Your login code is:</p>
      <h2 style="letter-spacing: 8px; font-size: 36px;">${code}</h2>
      <p>Enter this code in the Fortified Tracker to log in. It expires in 15 minutes.</p>
      <p>If you didn't request this, you can ignore this email.</p>
      <p>— Fortified</p>
    `,
  });

  res.json({ message: 'Code sent' });
});

// POST /api/auth/verify-code  { email, code }
router.post('/verify-code', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const code  = (req.body.code  || '').trim();
  if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

  const result = await pool.query(
    'SELECT * FROM tokens WHERE LOWER(email) = $1 AND token = $2',
    [email, code]
  );

  const row = result.rows[0];
  if (!row || row.used || new Date(row.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired code' });
  }

  await pool.query('UPDATE tokens SET used = TRUE WHERE id = $1', [row.id]);

  const memberResult = await pool.query(
    'SELECT id, name FROM members WHERE LOWER(email) = $1',
    [email]
  );
  const member = memberResult.rows[0];
  if (!member) return res.status(404).json({ error: 'Member not found' });

  res.cookie(COOKIE, JSON.stringify({ name: member.name, memberId: member.id }), {
    signed:   true,
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   90 * 24 * 60 * 60 * 1000,
  });

  res.json({ name: member.name, memberId: Number(member.id) });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const val = req.signedCookies[COOKIE];
  if (!val) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const data = JSON.parse(val);
    res.json({ name: data.name, memberId: Number(data.memberId) });
  } catch {
    res.status(401).json({ error: 'Invalid session' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE);
  res.json({ ok: true });
});

module.exports = router;
