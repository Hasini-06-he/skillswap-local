let currentUserId = null;

const postform = document.getElementById('postForm');
const postStatus = document.getElementById('postStatus');
const findMatchesBtn = document.getElementById('findMatchesBtn');
const matchResults = document.getElementById('matchResults');

postform.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const offers = document.getElementById('offers').value;
    const wants = document.getElementById('wants').value;

    const res = await fetch('/api/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, offers, wants })
    });

    const newUser = await res.json();
    currentUserId = newUser.id;

    postStatus.textContent = `Posted! You're now listed as ${newUser.name}.`;
    findMatchesBtn.disabled = false;
    postform.reset();
});

findMatchesBtn.addEventListener('click', async () => {
  const res = await fetch(`/api/matches/${currentUserId}`);
  const data = await res.json();

  if (data.matches.length === 0) {
    matchResults.innerHTML = '<p>No matches yet.</p>';
    return;
  }

  matchResults.innerHTML = data.matches
    .map(m => `<p><strong>${m.name}</strong> can teach you ${m.offers}</p>`)
    .join('');
});