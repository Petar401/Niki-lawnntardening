# TASKS — Niki Lawn & Gardening

Phased checklist. Each task is small and individually verifiable. Tick items as they are completed. Defer items only with a written reason.

Legend: `[ ]` todo · `[x]` done · `[~]` deferred (note why)

---

## Phase 1 — Audit (this commit)

- [x] Inventory repository (files, history, dependencies)
- [x] Inspect existing assets (4 before/after photos)
- [x] Identify business positioning from real-world signal
- [x] Write `PROJECT_AUDIT.md`
- [x] Write `IMPLEMENTATION_PLAN.md`
- [x] Write `TASKS.md`
- [ ] **Gate:** wait for owner confirmation before starting Phase 2

---

## Phase 2 — Foundation

- [x] Initialize Vite + React + TypeScript project (in place; no `npx create` blowaway of the repo root)
- [x] Add `.gitignore`, `.editorconfig`, `.nvmrc`, `.prettierrc.json`
- [x] Install Tailwind CSS, PostCSS, autoprefixer
- [x] Install ESLint + `@typescript-eslint` + `eslint-plugin-jsx-a11y` + Prettier
- [x] Install `@fontsource/fraunces`, `@fontsource/inter`
- [x] Install `lucide-react`, `framer-motion`
- [x] Install `three`, `@react-three/fiber`, `@react-three/drei`
- [x] Configure `tsconfig.json` (project refs) + `tsconfig.app.json` (strict, `@/*` alias) + `tsconfig.node.json`
- [x] Configure `vite.config.ts` with `@/` resolver
- [x] Configure `tailwind.config.ts` to consume CSS-variable tokens
- [x] Write `index.html` with meta, viewport, theme color, favicon link
- [x] Add `src/main.tsx`, `src/App.tsx` placeholder + `src/vite-env.d.ts`
- [x] Bootstrap `src/styles/tokens.css` (brand) and `src/styles/globals.css` (Tailwind layers + base resets) — full design-system fill in Phase 3
- [x] **Gate:** `npm run build` passes (143 KB JS / 46 KB gzip + 19 KB CSS / 4 KB gzip); `npm run typecheck` passes; `npm run lint` passes

## Phase 3 — Design System

- [ ] Author `src/styles/tokens.css` (colors, type scale, spacing, radii, shadows, motion)
- [ ] Author `src/styles/globals.css` (tailwind layers, base resets, focus-visible)
- [ ] Build `Container`
- [ ] Build `Button` (primary, secondary, ghost; sm, md, lg; supports `as="a"`)
- [ ] Build `SectionHeading` (eyebrow + title + lede)
- [ ] Build `Card` (default, interactive)
- [ ] Build `Tag`
- [ ] Build `Icon` wrapper around lucide-react
- [ ] Internal `/dev/styleguide` page that renders every primitive
- [ ] **Gate:** styleguide passes visual review at 320/768/1280; AA contrast verified for all token combinations

## Phase 4 — Content

- [ ] `src/content/site.ts` — brand, tagline, contact placeholders, flags
- [ ] `src/content/services.ts` — 6 services with name/description/icon
- [ ] `src/content/projects.ts` — 2 real entries (real photos) + 2 placeholder
- [ ] `src/content/faqs.ts` — 8 honest entries
- [ ] `src/content/testimonials.ts` — 3 placeholders, flagged
- [ ] Copy review pass: no fluff, no lorem ipsum, specific gardening language
- [ ] **Gate:** every placeholder is documented in `README.md` launch checklist

## Phase 5 — 3D Scene

- [ ] Build `src/components/three/GardenScene.tsx` with planter, shrubs, tree, slab, brick edge, sky, contact shadow
- [ ] Idle camera motion + damped pointer parallax
- [ ] `useReducedMotion()` hook + WebGL detection
- [ ] Static poster fallback (PNG generated from scene or hand-drawn SVG)
- [ ] Lazy-load scene with Suspense + skeleton
- [ ] Pause animation when offscreen
- [ ] **Gate:** scene boots in < 800ms; idle CPU < 5%; no scroll jank; reduced-motion respected

## Phase 6 — Sections

- [ ] `Header` (logo wordmark, nav, primary CTA, mobile drawer with focus trap)
- [ ] `Hero` (headline, sub, CTAs, trust strip, 3D embed)
- [ ] `Services` (6 cards, hover lift, anchor IDs)
- [ ] `Projects` with `BeforeAfterSlider` component, 4 entries
- [ ] `Process` (4-step timeline; vertical on mobile, horizontal on desktop)
- [ ] `Testimonials` (3 cards; section hidden when `placeholderTestimonials: false`)
- [ ] `FAQ` (accessible accordion; only one open at a time)
- [ ] `Contact` (`QuoteForm`)
- [ ] `Footer`
- [ ] **Gate:** every section renders at 320/768/1024/1440/1920; no horizontal scroll; tab order sensible

## Phase 7 — Forms

- [ ] `QuoteForm` controlled fields with validation
- [ ] Honeypot + time-to-submit anti-spam
- [ ] `VITE_FORM_ENDPOINT` integration + `mailto:` fallback
- [ ] `/thanks` confirmation route
- [ ] **Gate:** keyboard-only happy path + error path both pass

## Phase 8 — Performance

- [ ] Convert 4 photos to WebP at 800w + 1600w (keep originals)
- [ ] `<picture>` + `srcset` for all photos
- [ ] Preload Fraunces 700 and Inter 400
- [ ] Code-split: 3D bundle, framer-motion features, gallery slider
- [ ] Verify no layout shift on hero
- [ ] **Gate:** mobile Lighthouse Performance ≥ 90

## Phase 9 — Accessibility

- [ ] `eslint-plugin-jsx-a11y` clean
- [ ] Keyboard pass (Tab/Shift+Tab/Enter/Esc)
- [ ] Focus-visible styles on every interactive
- [ ] Color contrast ≥ AA across all surfaces
- [ ] 3D canvas alt-text + `role="img"`
- [ ] Form errors with `aria-describedby` and `aria-invalid`
- [ ] **Gate:** axe DevTools — zero critical/serious

## Phase 10 — SEO

- [ ] `<title>` + `<meta description>`
- [ ] Open Graph + Twitter Card meta
- [ ] LocalBusiness JSON-LD with placeholders
- [ ] `robots.txt`, `sitemap.xml`
- [ ] Canonical URL placeholder via env
- [ ] **Gate:** Rich Results Test validates JSON-LD shape

## Phase 11 — Deployment Readiness

- [ ] `.env.example` listing `VITE_FORM_ENDPOINT`, `VITE_SITE_URL`, `VITE_PUBLIC_PHONE`, `VITE_PUBLIC_EMAIL`
- [ ] `vercel.json` (default) + Netlify equivalent documented in README
- [ ] `npm run build && npm run preview` clean run
- [ ] Bundle size report committed (or referenced in README)
- [ ] **Gate:** dist/ runs locally with no console errors

## Phase 12 — QA

- [ ] Desktop pass: Chromium, Firefox, WebKit
- [ ] Mobile pass at 320, 360, 390, 414, 768
- [ ] Reduced-motion preference test
- [ ] Slow 3G throttle test (hero usable, 3D lazy)
- [ ] Form happy path + validation path
- [ ] 404 route exists and is on-brand
- [ ] **Gate:** every QA item checked or explicitly deferred

---

## Deferred / explicitly out of scope

- [~] CMS integration — content lives in typed files; no CMS planned for v1.
- [~] Blog — not in brief.
- [~] Multi-language — single-locale launch.
- [~] Server analytics — left to owner choice at deploy.
