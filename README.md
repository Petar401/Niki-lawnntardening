# Niki Lawn &amp; Gardening

Marketing site for a friendly, expert local garden design, lawn care, and seasonal-maintenance service.

This repository is being built out in phases — see `PROJECT_AUDIT.md`, `IMPLEMENTATION_PLAN.md`, and `TASKS.md` for the strategy and progress.

---

## Tech stack

- Vite 5
- React 18 + TypeScript (strict)
- Tailwind CSS 3 + a brand `tokens.css` layer
- three.js + @react-three/fiber + @react-three/drei (hero 3D scene; added in Phase 5)
- framer-motion (restrained; added where needed)
- self-hosted fonts via `@fontsource/fraunces` (display) + `@fontsource/inter` (UI)

## Requirements

- Node `>= 22` (see `.nvmrc`)
- npm `>= 10`

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Command            | What it does                                       |
| ------------------ | -------------------------------------------------- |
| `npm run dev`      | Vite dev server with HMR                           |
| `npm run build`    | Type-check then produce a static `dist/` bundle    |
| `npm run preview`  | Serve the production build locally                 |
| `npm run typecheck`| Run `tsc -b --noEmit`                              |
| `npm run lint`     | Run ESLint (no warnings allowed)                   |
| `npm run format`   | Format all source with Prettier                    |

## Project layout

```
src/
  main.tsx            # entry
  App.tsx             # page composition
  styles/
    tokens.css        # brand tokens (colors, radii, shadows, motion)
    globals.css       # Tailwind layers + base resets
  components/         # primitives, nav, sections, three, forms (added in later phases)
  content/            # typed content modules (added in Phase 4)
  hooks/
  lib/
public/
  favicon.svg
  images/             # project gallery photos (added in Phase 6)
```

## Build &amp; deploy

```bash
npm run build
```

Produces a fully static `dist/` directory deployable to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static host. No server runtime is required.

## Phase status

See `TASKS.md`. Currently completed: Phase 1 (Audit) and Phase 2 (Foundation).
