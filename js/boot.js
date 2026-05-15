// Boot — wires the 3D scene, Parsley chatbot, and interactive widgets
// onto the existing static page. Runs after script.js has set up the
// classic UI (nav, BA compare, reveal, form validation).

import { mountParsley } from './parsley.js';
import { mountReviews, mountEstimator, mountThemeToggle, mountBookingCalendar } from './widgets.js';

// ---- Theme toggle ----
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) mountThemeToggle(themeBtn);

// ---- Booking calendar bounds ----
mountBookingCalendar(document.getElementById('bookingDate'));

// ---- Reviews + estimator ----
const reviewsRoot = document.getElementById('reviewsRoot');
if (reviewsRoot) mountReviews(reviewsRoot);
const estimatorRoot = document.getElementById('estimatorRoot');
if (estimatorRoot) mountEstimator(estimatorRoot);

// ---- Parsley chatbot ----
const parsleyRoot = document.getElementById('parsleyRoot');
if (parsleyRoot) {
  mountParsley(parsleyRoot);
  const shortcut = document.getElementById('parsleyFabShortcut');
  if (shortcut) {
    shortcut.addEventListener('click', () => {
      const btn = parsleyRoot.querySelector('.parsley-fab');
      if (btn) btn.click();
    });
  }
}

// ---- Contact form — extend existing submit to use mailto fallback ----
// (script.js already validates; we add a mailto handoff so messages
// actually reach Niki on a static host.)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    // Let script.js validate first; if it added the .err class, bail.
    const status = document.getElementById('formStatus');
    if (status && status.classList.contains('err')) return;
    setTimeout(() => {
      const data = new FormData(form);
      const subject = encodeURIComponent(`Quote request — ${data.get('service') || 'Garden'}`);
      const body = encodeURIComponent(
        `Name: ${data.get('name') || ''}\n` +
        `Email: ${data.get('email') || ''}\n` +
        `Phone: ${data.get('phone') || ''}\n` +
        `Service: ${data.get('service') || ''}\n` +
        `Preferred date: ${data.get('bookingDate') || '(any)'}\n\n` +
        `${data.get('message') || ''}`
      );
      // Opens user's mail client with everything pre-filled. Swap this
      // line for a Formspree fetch() to send without the user's client.
      window.location.href = `mailto:nikishomegardens@gmail.com?subject=${subject}&body=${body}`;
    }, 50);
  });
}

// ---- 3D scene (lazy, gracefully degrades) ----
const mount = document.getElementById('scene3d');
if (mount) {
  (async () => {
    try {
      const mod = await import('../3d/scene.js');
      if (!mod.canRun3D()) throw new Error('no-webgl-or-reduced-motion');
      mod.mountScene(mount, { lowPower: mod.isLowPower() });
      const hint = document.querySelector('.scene3d-hint');
      if (hint) hint.classList.add('is-visible');
      const loading = mount.querySelector('.scene3d-loading');
      if (loading) loading.remove();
    } catch (err) {
      // Fallback: show the original photo slider
      mount.hidden = true;
      const slider = document.getElementById('slider');
      if (slider) slider.hidden = false;
      const hint = document.querySelector('.scene3d-hint');
      if (hint) hint.remove();
    }
  })();
}
