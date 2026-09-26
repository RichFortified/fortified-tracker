const express = require('express');
const crypto  = require('crypto');
const { Resend } = require('resend');
const { pool } = require('../db');

const router  = express.Router();
const resend  = new Resend(process.env.RESEND_API_KEY);
const FROM    = process.env.FROM_EMAIL || 'noreply@tracker.fortifiedgym.com';
const APP_URL = process.env.APP_URL    || 'https://fortified-tracker-v2-production.up.railway.app';
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
    return res.status(404).json({ error: 'No account found with that email address' });
  }

  const token     = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await pool.query(
    'INSERT INTO tokens (email, token, expires_at) VALUES ($1, $2, $3)',
    [member.email, token, expiresAt]
  );

  const link = `${APP_URL}/auth?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to:   member.email,
    subject: 'Your Fortified Tracker login link',
    html: `
      <p>Hi ${member.name},</p>
      <p>Click the link below to sign in to Fortified Tracker. It expires in 15 minutes.</p>
      <p><a href="${link}">${link}</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  });

  res.json({ ok: true });
});

// GET /api/auth/verify?token=xxx
router.get('/verify', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token required' });

  const result = await pool.query(
    'SELECT * FROM tokens WHERE token = $1',
    [token]
  );

  const row = result.rows[0];
  if (!row)                       return res.status(401).json({ error: 'Invalid token' });
  if (row.used)                   return res.status(401).json({ error: 'Token already used' });
  if (new Date(row.expires_at) < new Date()) return res.status(401).json({ error: 'Token expired' });

  await pool.query('UPDATE tokens SET used = TRUE WHERE id = $1', [row.id]);

  const memberResult = await pool.query(
    'SELECT id, name FROM members WHERE email = $1',
    [row.email]
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
