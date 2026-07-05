# SkillSwap Local 🔁

**Trade skills, not money.** A peer-to-peer skill exchange board where users post what they can teach and what they want to learn, and get matched with others for a fair, reciprocal skill swap.

🔗 **Live demo:** https://skillswap-local.onrender.com
🔗 **Repository:** https://github.com/Hasini-06-he/skillswap-local

## Problem

Many students want to learn new skills — coding, crochet, languages, design — but paid courses are often out of reach. At the same time, most students already have a skill of their own worth sharing. SkillSwap Local turns learning into a two-way exchange instead of one-directional, paid content consumption.

## How It Works

1. A user posts their name, what they can teach, and what they want to learn.
2. The app finds other users whose **offered skill** matches what the current user **wants to learn**.
3. Matches are shown instantly, so users can connect and arrange a swap.

## Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** Vanilla HTML, CSS, JavaScript (no framework)
- **AI:** Google Gemini API (`gemini-2.5-flash`) for automatic skill tagging
- **Storage:** JSON file-based storage (lightweight, no database needed for this scope)
- **Deployment:** Render

## Matching Logic

Matching is based on real reciprocity — a match is only shown if the other person's offered skill contains the current user's wanted skill (case-insensitive substring match). This is intentionally simple for the MVP; see "Future Improvements" below for how this could evolve.

## AI-Powered Skill Tagging

When a user posts a skill, the app calls the **Google Gemini API** (`gemini-2.5-flash`) to automatically generate 2-3 category tags for both the "offers" and "wants" fields (e.g. "Python basics" → `Programming`, `Tech`, `Beginner-Friendly`). These tags are displayed alongside matches to give users more context at a glance.

**Graceful degradation:** Gemini's free tier has a daily request quota. If the quota is exceeded, the app catches the error and simply continues without tags — posting and matching are unaffected. This was an intentional design choice so the core experience never breaks due to a third-party API limit.

## Project Structure

```
skillswap-local/
├── server.js           # Express server + API routes
├── data/
│   └── users.json       # Stores all posted skill entries
├── public/
│   ├── index.html        # Form + results UI
│   ├── style.css          # Styling
│   └── script.js           # Frontend logic (fetch calls, DOM updates)
└── package.json
```

## API Routes

| Method | Route                  | Description                                |
|--------|-------------------------|--------------------------------------------|
| GET    | `/`                     | Serves the main page                        |
| GET    | `/api/users`            | Returns all posted users                    |
| POST   | `/api/post`              | Creates a new skill swap post               |
| GET    | `/api/matches/:userId`  | Returns matches for a given user             |

## Running Locally

```bash
git clone https://github.com/Hasini-06-he/skillswap-local.git
cd skillswap-local
npm install
node server.js
```
Then open `http://localhost:3000`.

**Note:** To enable AI tag suggestions, create a `.env` file in the project root with:
```
GEMINI_API_KEY=your_key_here
```
Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Without this key, the app still works fully — it just won't generate tags.

## Future Improvements

- Tag-based matching (instead of free-text substring matching) for more accurate results
- AI-powered skill categorization — auto-suggest tags from free-text input
- User accounts and persistent profiles
- Location/campus-based filtering
- Request/accept flow instead of instant matching

## Built For

Creative Showcase Hackathon — Bootcamp Project, July 2026.