const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());
app.use(express.static('public'));
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/post', (req, res) => {
  const { name, offers, wants } = req.body;

  const data = fs.readFileSync('data/users.json', 'utf-8');
  const users = JSON.parse(data);

  const newUser = { id: Date.now(), name, offers, wants };
  users.push(newUser);

  fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));

  res.status(201).json(newUser);
});

app.get('/api/matches/:userId', (req, res) => {
  const userId = Number(req.params.userId);

  const data = fs.readFileSync('data/users.json', 'utf-8');
  const users = JSON.parse(data);

  const me = users.find(u => u.id === userId);

  if (!me) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const matches = users.filter(u =>
    u.id !== me.id &&
    u.offers.toLowerCase().includes(me.wants.toLowerCase())
  );

  res.json({ me, matches });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});