# Niki's Lawn & Gardening — 3D Live-Experience Website

A modern, mobile-friendly website for Nikis Lawn & Garden Services
(Norwich, UK). Static-only, no build step — drops straight onto GitHub
Pages or any static host.

**Highlights**

- Interactive 3D garden hero (Three.js) with stylized hedges, planters,
  drifting seasonal particles, and orbit/pinch controls.
- Auto-degrades on phones, low-power devices, and `prefers-reduced-motion`
  to the original photo slider — no broken state.
- **Parsley** chatbot (scripted, AI-ready hook) for instant answers on
  prices, services, areas covered, and bookings.
- Floating Facebook / Call / WhatsApp / Parsley action buttons.
- Reviews carousel, ballpark price estimator, before/after photo
  comparison, booking date picker, dark/light theme toggle.
- Contact form → `mailto:` fallback (swap for Formspree in one line).
- `LocalBusiness` JSON-LD + Open Graph for rich link previews and SEO.

## Run locally

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy to GitHub Pages

1. Push to `main`.
2. Repo → Settings → Pages → Source: `Deploy from a branch` → Branch:
   `main` / `/ (root)` → Save.
3. Wait ~1 minute, then visit
   `https://<your-username>.github.io/Niki-lawnandgardening/`.

The `.nojekyll` file at the repo root tells Pages to serve all files
and folders as-is — leave it in place.

## Structure

- `index.html` — markup, content, JSON-LD schema, Open Graph
- `styles.css` — design tokens, layout, dark theme, responsive rules
- `script.js` — classic UI (mobile nav, BA-compare, scroll reveal, form
  validation)
- `js/boot.js` — wires the 3D scene, Parsley, and widgets
- `js/parsley.js` — scripted chatbot + `Parsley.ask()` API hook
- `js/widgets.js` — reviews carousel, price estimator, theme toggle,
  booking calendar
- `3d/scene.js` — Three.js garden scene (lazy-loaded ES module)
- `images/` — real before/after photos

## Customize

- **Contact details** live in `index.html` (header, contact section,
  footer, FAB stack, rail) and in the JSON-LD block.
- **Brand colors / fonts / spacing** are CSS custom properties at the top
  of `styles.css`. Dark mode is a single `[data-theme="dark"]` block
  further down the same file.
- **Parsley answers**: edit the `KB` array at the top of `js/parsley.js`.
- **Pricing bands**: edit the `RATES` object in `js/widgets.js`.

## Wiring real form delivery

The form currently opens the visitor's mail client pre-filled to
`nikishomegardens@gmail.com`. To send without the user's mail client,
sign up for [Formspree](https://formspree.io/) and replace the
`window.location.href = …` line in `js/boot.js` with a `fetch()` POST
to your Formspree endpoint.

## Wiring Parsley to a real AI backend

`js/parsley.js` exposes `Parsley.ask(text) → Promise<{reply, action?}>`.
To upgrade from scripted to AI-powered (e.g. Claude API), replace the
body of `Parsley.ask` with:

```js
ask(text) {
  return fetch('/api/parsley', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  }).then(r => r.json());
}
```

…then host a small serverless function (Vercel / Cloudflare Workers /
Netlify Functions) that calls the Anthropic API with your key. The UI,
suggestions, and conversation persistence stay exactly the same.
