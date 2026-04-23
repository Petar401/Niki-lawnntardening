# Niki's Lawn & Gardening — Website

A lightweight, responsive single-page website for a lawn care and gardening
business. Built with plain HTML, CSS, and a small bit of vanilla JavaScript —
no build step required.

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Structure

- `index.html` — markup and content
- `styles.css` — design tokens, layout, responsive rules
- `script.js` — mobile nav, scroll reveal, contact form validation

## Customize

- Brand name, phone, email, and hours live in `index.html` (header, contact, footer).
- Colors, fonts, and spacing are defined as CSS custom properties at the top of `styles.css`.
- Service cards and gallery tiles are plain HTML — swap text and background
  images in `index.html` / `styles.css` to match your brand photography.
