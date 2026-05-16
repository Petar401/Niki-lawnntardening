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

See `TASKS.md`. Currently completed: Phase 1 (Audit), Phase 2 (Foundation), Phase 3 (Design System), Phase 4 (Content), Phase 5 (3D Scene), Phase 6 (Page Sections), Phase 7 (Forms), Phase 8 (Performance), Phase 9 (Accessibility).

## How the quote form sends enquiries

The form chooses a delivery path at runtime:

1. If `VITE_FORM_ENDPOINT` is set, the form POSTs JSON to that URL and then redirects to `/thanks` on success. Compatible with Formspree, Resend, Netlify Forms, your own endpoint, or anything that accepts a JSON body.
2. Otherwise, if `site.contact.email` has been replaced (it ships as `__PLACEHOLDER__`), the form opens the visitor's mail client with everything pre-filled (`mailto:` fallback).
3. If neither is configured, the form validates as normal and shows a friendly "not yet configured — please call or email us directly" message instead of failing silently.

## Replacing the project photos

The project photos in `public/images/projects/` are real customer work but the original JPEGs from the owner had "BEFORE" / "AFTER" overlay text burned into the top and bottom edges. We cropped them with `scripts/crop-project-photos.mjs`. If you replace any of these files with a new photo that also has burned-in labels, drop the new file in place and re-run:

```bash
node scripts/crop-project-photos.mjs
```

If your replacement photos are clean (no overlays), skip the cropping script.

After cropping (or if you supply already-clean photos), regenerate the AVIF + WebP variants used by the slider:

```bash
node scripts/build-image-variants.mjs
```

That produces `<stem>-800.avif`, `<stem>-800.webp`, `<stem>-1200.avif`, `<stem>-1200.webp` next to each `<stem>.jpg`. The site picks the smallest format the browser supports at the right size automatically.

## Launch checklist — content the owner must replace before going live

The site ships with clearly-marked placeholders in `src/content/site.ts`. Every value below must be replaced before the site goes to a live domain.

| Where | Field | Default |
| --- | --- | --- |
| `src/content/site.ts` | `contact.phone` | `__PLACEHOLDER__` — real customer-facing phone |
| `src/content/site.ts` | `contact.phoneHref` | `__PLACEHOLDER__` — `tel:+...` URL |
| `src/content/site.ts` | `contact.email` | `__PLACEHOLDER__` — real customer-facing email |
| `src/content/site.ts` | `contact.serviceArea` | `__PLACEHOLDER__` — e.g. `"Bath and surrounding villages"` |
| `src/content/site.ts` | `contact.addressLine` | `__PLACEHOLDER__` — optional postal address line |
| `src/content/site.ts` | `social.instagram` / `social.facebook` | `__PLACEHOLDER__` — full URLs or remove from footer |
| `src/content/site.ts` | `trust[].value` | `12+` / `180+` / `5★` — confirm or correct |
| `src/content/site.ts` | `flags.testimonialsAreIllustrative` | `true` — set to `false` once real, attributable testimonials replace `src/content/testimonials.ts` |
| `src/content/site.ts` | `flags.showTestimonials` | `true` — set to `false` to hide the testimonials section entirely |
| `src/content/testimonials.ts` | all entries | Three illustrative quotes — replace with real customer quotes (with names &amp; permission) |
| `src/content/projects.ts` | `lawn-restoration-illustrative`, `planting-plan-illustrative` | Two illustrative entries — replace with real project pairs and photos when available |
| `.env` (production) | `VITE_FORM_ENDPOINT` | Empty falls back to a `mailto:` link; set to a real form endpoint (Formspree, Resend, your own) before launch |
| `.env` (production) | `VITE_SITE_URL` | Canonical URL once a domain is chosen |
| `.env` (production) | `VITE_PUBLIC_PHONE`, `VITE_PUBLIC_EMAIL` | Optional duplicates for SEO &amp; structured data |
