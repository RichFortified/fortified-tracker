const express = require('express');
const path = require('path');
const { init } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/members', require('./routes/members'));
app.use('/api/sessions', require('./routes/sessions'));

init().then(() => {
  app.listen(PORT, () => {
    console.log(`Fortified Tracker running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialise database:', err);
  process.exit(1);
});
