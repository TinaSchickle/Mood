# 🌸 Mood Tracker

A small, private daily tracker. Two tabs:

- **Track** — log any of these each day (everything is optional):
  - Mood (overall) — *negative / neutral / positive*, and you can **+ add** your own options
  - Mood (detailed) — happy / irritable / sad
  - Energy level — no / low / neutral / high energy
  - Bloating — no / little / medium / a lot
  - Belly — flat / little belly / korea kugel
  - Stuhlgang — soft / normal / hard
  - Fighting with Pascal — no / light / strong
  - Sex — no / yes / self
  - **Period** — tick "start of new period" and the cycle day counts up automatically from 1
- **Dashboard** — one diagram each for Energy, Bloating, Belly, Mood (overall),
  Fighting with Pascal and Sex. Days with no value are drawn at the neutral
  baseline with a **red dot** so gaps are obvious.

Data is stored locally in your browser (`localStorage`). Use **Export / Import**
(top right) to back it up or move it to another device.

## Develop

```bash
npm install
npm run dev
```

## Deploy

Pushing to `main` builds and publishes to GitHub Pages automatically
(`.github/workflows/deploy.yml`). Live at
https://tinaschickle.github.io/Mood/

## Tech

Vite · React · Tailwind CSS · plain-SVG charts (no chart library).
