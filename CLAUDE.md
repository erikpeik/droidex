# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Type-check + production build (tsc -b && vite build)
npm run preview    # Preview the production build locally
npm run deploy     # Build and deploy to Firebase Hosting
```

There are no tests in this project.

## Environment Setup

Copy `.env.example` to `.env` and fill in the Firebase project values. All vars are prefixed `VITE_FIREBASE_*` and consumed in [src/firebase.ts](src/firebase.ts).

## Architecture

**Stack:** React 18 + TypeScript, Vite, Tailwind CSS v3, Firebase (Auth + Firestore), React Router v7.

**Data layer** ([src/data/](src/data/)) is pure static TypeScript — no fetching. `droids.ts` defines every droid with its rarity, class (type), and which tiers it appears in, plus derives `ALL_CARDS` (the flat list of `DroidCard` objects where `id = "${name}_${tier}"`). `rebirths.ts` defines the 27-level rebirth progression, each level listing required `DroidCard` ids and a credit cost.

**State management** lives entirely in [src/App.tsx](src/App.tsx): filter state (tier, rarity, class, collection status, search) and the user's collection/rebirth progress. There is no global store.

**Persistence** ([src/hooks/useTracker.ts](src/hooks/useTracker.ts)):
- Guest (unauthenticated): `localStorage` key `droidex_v1`, shape `{ collected: string[], rebirthLevel: number }`.
- Signed-in: Firestore document `users/{uid}`, same shape. On first sign-in, guest data is migrated to Firestore and localStorage is cleared.
- `useTracker` returns `collected: Set<string>` (card ids), `rebirthLevel`, and mutators. All writes are fire-and-forget `setDoc` with `merge: true`.

**Auth** ([src/hooks/useAuth.ts](src/hooks/useAuth.ts)): Google Sign-In via popup. `loading` is true until `onAuthStateChanged` fires; App renders a fullscreen splash during this time.

**Routing:** Two routes — `/` (main dex with grid + filters + rebirth panel) and `/rebirths` (full rebirth progression page).

**Images:** Droid card images are served as static assets at `public/droids/{NAME}_{TIER}.png` (spaces in names replaced with `_`). Type badge icons at `public/img/{worker,astromech,battle}.png`. All image paths use `import.meta.env.BASE_URL` as prefix. Missing images fall back gracefully — the card shows the type badge icon instead.

**Styling:** Tailwind utility classes throughout. Custom CSS classes (glow effects, rainbow animations, TV scan distortion on card hover, rebirth panel gradients) are defined in [src/index.css](src/index.css) as `@layer utilities`. The design language is dark terminal / sci-fi — black/zinc backgrounds, monospace font, cyan accents.

**Rebirth panel interaction:** Hovering the `RebirthPanel` highlights the required cards in the grid by passing `highlightedIds: Set<string>` down from App through `DroidGrid` to `DroidCard` (yellow ring). This is the primary cross-component side-effect to be aware of.
