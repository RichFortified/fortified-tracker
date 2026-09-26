const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const { init }     = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/members',  require('./routes/members'));
app.use('/api/sessions', require('./routes/sessions'));

// Redirect magic links so the SPA loads before the JS picks up the token
app.get('/auth', (req, res) => {
  const token = req.query.token || '';
  res.redirect('/?token=' + encodeURIComponent(token));
});

// Serve index.html for any other non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

init().then(() => {
  app.listen(PORT, () => {
    console.log(`Fortified Tracker running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialise database:', err);
  process.exit(1);
});
