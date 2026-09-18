# Solo Leveling — Gamified Habit & Quest Tracker

A habit and task tracker that turns daily discipline into a game, inspired by the "System" interface from the *Solo Leveling* manhwa. Complete quests to earn XP and credits, build login streaks for XP multipliers, track habits on heatmaps, and spend earned credits on rewards you define yourself.

**Live app:** https://solo-leveling-system-pied.vercel.app
**Backend repo:** https://github.com/PrabhandhV/solo-leveling-server

> First load may take ~30 seconds while the free-tier backend wakes from sleep. You'll need to register an account — each user gets their own data.

---

## Why I built it

Most to-do apps have no stakes. Nothing happens if you skip a task, so whether you finish something comes down to how you feel in the moment. This one has consequences: streaks break, missed days cost XP, and rewards have to be earned before they can be claimed.

---

## Features

- **Daily login streak** — consecutive logins raise your XP multiplier; missed days reset the streak and deduct XP
- **Quests** — create tasks with difficulty, time windows, XP and credit values; completing one awards both and archives it to a task log
- **Focus timer** — Pomodoro / short break / long break with real countdown
- **Habits** — set multi-day goals with win/loss XP stakes, tracked on weekday-aligned heatmaps
- **Reward centre** — define your own rewards and spend earned credits on them
- **Statistics** — radar chart of six player stats
- **Per-user accounts** — every user's quests, habits, and progress are their own

---

## Tech stack

**Frontend**
- React 19 (function components and hooks)
- Vite
- React Router for client-side routing
- Context API for shared state (auth and player data in separate contexts)
- Recharts for the statistics radar chart
- Plain CSS with custom properties as design tokens — no framework

**Backend** (see [the server repo](https://github.com/PrabhandhV/solo-leveling-server))
- Node.js + Express REST API
- MongoDB Atlas with Mongoose
- JWT authentication, bcrypt password hashing

**Deployment**
- Frontend on Vercel, backend on Render, database on MongoDB Atlas

---

## Architecture notes

**State management evolved as the app grew.** It began with local `useState`, moved to lifted state once siblings needed to share, and became Context once pages became separate routes — completing a quest on `/quests` had to update XP shown on `/`, and those routes are siblings with no prop path between them.

**Two contexts, deliberately split.** `AuthContext` holds the session (token, user, login/register/logout). `PlayerContext` holds game state and fetches per-user data whenever the token changes. Keeping them separate means auth concerns don't re-render on every XP change, and the player provider can cleanly react to a login.

**A single API layer.** Every component talks to `src/api/client.js` rather than calling `fetch` directly. That module attaches the JWT, checks `response.ok` (since `fetch` doesn't reject on HTTP errors), and clears the session on a 401. When the backend moved from a mock server to Express, no component changed.

**Derived state over stored state.** The XP multiplier, quest completion percentage, remaining-quest list, and milestone reward are all computed during render rather than stored, so they can't drift out of sync with the data they come from.

---

## Running locally

Requires Node.js and a running instance of [the backend](https://github.com/PrabhandhV/solo-leveling-server).

```bash
git clone https://github.com/PrabhandhV/solo-leveling-system.git
cd solo-leveling-system
npm install
```

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:3001
```

Then:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Project structure

```
src/
  api/client.js          HTTP layer — auth headers, error handling
  context/
    AuthContext.jsx      session state
    PlayerContext.jsx    game state + data fetching
  utils/
    streakTracker.js     pure date functions
    id.js
  components/
    Auth/                login and registration
    Splash/
    Dashboard/           player, statistics, system panel
    PlayerProfile/
    Statistics/
    SystemPanel/
    SystemLog/           navigation hub
    PageNav/             reusable cross-page nav
    QuestsPage/          quests, focus timer, rewards, task log
    HabitsPage/          habit goals and heatmaps
```

Components are grouped by role rather than feature, each in its own folder with a co-located stylesheet.

---

## Known limitations

Things I'm aware of and would address next:

- **XP and credit calculations run client-side.** The server trusts the values it's sent, so a determined user could manipulate them via devtools. Moving that logic server-side is the correct fix.
- **No password reset.** Would need single-use, time-limited tokens sent by email.
- **Profile photos are stored as base64 strings**, which bloats documents. Real implementations upload to object storage and store a URL.
- **`toISOString()` uses UTC**, so "today" can be miscalculated by a day for users near midnight in some timezones.
- **Optimistic updates don't roll back** on request failure — they surface an error instead.
- **No automated tests.** The pure date utilities would be the sensible place to start.
- **Awakening and Gates pages** are designed but not yet built.

---

## Acknowledgements

Visual design inspired by the *Solo Leveling* manhwa's System interface. Built as a personal learning project.