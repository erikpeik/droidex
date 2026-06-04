# DROIDEX

A web-based tracker for the **Fortnite Star Wars Droid Tycoon** game mode. Track which droids you've collected across all tiers, and plan your next rebirth.

**Live site: [droidex.erikpeik.fi](https://droidex.erikpeik.fi/)**

## Features

- **Droid grid** — all 202 known droids across DEFAULT / GOLD / DIAMOND / RAINBOW tiers
- **Search & filters** — search by name; filter by rarity, class (WORKER / ASTROMECH / BATTLE), and collection status
- **Click to collect** — toggle droids as collected; cyan glow marks what you own
- **Rebirth tracker** — shows credit cost and required droids for each rebirth level (0→20); highlights missing droids in the grid
- **Google sign-in** — sync your collection to Firestore across devices; guest progress migrates automatically on sign-in
- **Persistent state** — guest progress saves to localStorage; signed-in progress syncs via Firestore in real time

## Data

Droid list and rebirth requirements sourced from the community spreadsheet:
<https://docs.google.com/spreadsheets/d/1otLCKSCMKICMlnefirQ8KZhh_rdZTd5Mp8h0UYFUiqg>

Droid base prices sourced from the in-game and community spreadsheet:
<https://docs.google.com/spreadsheets/d/1otLCKSCMKICMlnefirQ8KZhh_rdZTd5Mp8h0UYFUiqg/edit?gid=1248391507#gid=1248391507>

## Contributing

Found a bug or want to suggest a feature? Open an [issue](https://github.com/erikpeik/droidex/issues) or submit a [pull request](https://github.com/erikpeik/droidex/pulls) — contributions are welcome.

## Getting Started

```bash
npm install
npm run dev
```

Open <http://localhost:5173>

## Adding Droid Images

Drop a PNG into `public/droids/` named `<DROID_NAME>_<TIER>.png`:

```
public/droids/MOUSE_DEFAULT.png
public/droids/R2_RAINBOW.png
```

The card renders the image automatically and falls back to the class icon if the file is missing.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v3
- React Router v7
- Firebase (Auth + Firestore)
- Lucide React (icons)
- Firebase Hosting
