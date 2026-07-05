const express = require('express');
const app = express();
const fs = require('fs');
require('dotenv').config();
app.use(express.json());
app.use(express.static('public'));
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

async function suggestTags(skillText) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Given this skill: "${skillText}", suggest exactly 2-3 short one-word or two-word category tags (like Programming, Design, Craft, Music, Fitness, Language). Respond ONLY with a comma-separated list, nothing else.`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    return text.split(',').map(tag => tag.trim());
  } catch (err) {
    console.log('Tag suggestion unavailable, continuing without tags.');
    return [];
  }
}

app.post('/api/post', async (req, res) => {
  const { name, offers, wants } = req.body;

  const offersTags = await suggestTags(offers);
  const wantsTags = await suggestTags(wants);

  const data = fs.readFileSync('data/users.json', 'utf-8');
  const users = JSON.parse(data);

  const newUser = { id: Date.now(), name, offers, offersTags, wants, wantsTags };
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