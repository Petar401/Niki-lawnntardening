// Widgets — reviews carousel, price estimator, booking calendar, theme toggle.

// ---------- Reviews carousel ----------
const REVIEWS = [
  { name: 'Sarah M., Norwich', text: '"Niki transformed our overgrown back garden in a single afternoon. Tidy, friendly, fair price — couldn\'t recommend more."' },
  { name: 'Tom & Helen', text: '"Our lawn has never looked better. Weekly visits, always on time, always a chat over the fence."' },
  { name: 'Anna P.', text: '"Hedges were a jungle. Now they look like a Country Living cover. Lovely work."' },
  { name: 'Dave L.', text: '"Booked a one-off clearance. Showed up early, took all the waste, garden looks twice the size."' },
];

export function mountReviews(root) {
  root.innerHTML = `
    <div class="reviews-track">
      ${REVIEWS.map((r) => `
        <article class="review-card">
          <blockquote><p>${r.text}</p><footer>— ${r.name}</footer></blockquote>
        </article>`).join('')}
    </div>
    <div class="reviews-dots" role="tablist" aria-label="Reviews"></div>
  `;
  const track = root.querySelector('.reviews-track');
  const dotsWrap = root.querySelector('.reviews-dots');
  const cards = root.querySelectorAll('.review-card');
  let i = 0;
  let timer = null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  cards.forEach((_, idx) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('aria-label', `Review ${idx + 1}`);
    d.addEventListener('click', () => go(idx, true));
    dotsWrap.appendChild(d);
  });

  function go(n, manual) {
    i = (n + cards.length) % cards.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    dotsWrap.querySelectorAll('button').forEach((d, di) =>
      di === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')
    );
    if (manual) restart();
  }
  function restart() {
    if (reduce) return;
    clearInterval(timer);
    timer = setInterval(() => go(i + 1), 5500);
  }
  go(0);
  restart();

  // touch swipe
  let sx = 0;
  track.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = (e.changedTouches[0]?.clientX || sx) - sx;
    if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1, true);
  });
}

// ---------- Price estimator ----------
const RATES = {
  'Lawn care':           { base: 25, perSqm: 0.08, label: 'Lawn mowing & care' },
  'Hedge trimming':      { base: 40, perSqm: 0.12, label: 'Hedge trimming' },
  'Planting & borders':  { base: 60, perSqm: 0.20, label: 'Planting & borders' },
  'Garden clearance':    { base: 120, perSqm: 0.35, label: 'Full garden clearance' },
  'Regular maintenance': { base: 30, perSqm: 0.07, label: 'Regular maintenance visit' },
};

export function estimate(service, sqm) {
  const r = RATES[service];
  if (!r || !sqm || sqm <= 0) return null;
  const low = Math.round(r.base + r.perSqm * sqm);
  const high = Math.round(low * 1.4);
  return { low, high, label: r.label };
}

export function mountEstimator(root) {
  root.innerHTML = `
    <div class="estimator-grid">
      <label>
        <span>Service</span>
        <select id="estService">
          ${Object.keys(RATES).map(k => `<option value="${k}">${RATES[k].label}</option>`).join('')}
        </select>
      </label>
      <label>
        <span>Approx. garden size (m²)</span>
        <input type="number" id="estSize" min="5" max="2000" step="5" value="80" />
      </label>
      <div class="estimator-out">
        <p class="eyebrow">Ballpark</p>
        <p class="estimator-price"><span id="estPrice">—</span></p>
        <p class="estimator-note">Final quote always free and given on site.</p>
        <button type="button" class="btn btn-lime" id="estCta">Get exact quote</button>
      </div>
    </div>
  `;
  const svc = root.querySelector('#estService');
  const size = root.querySelector('#estSize');
  const out = root.querySelector('#estPrice');
  const cta = root.querySelector('#estCta');

  function update() {
    const r = estimate(svc.value, parseFloat(size.value));
    out.textContent = r ? `£${r.low} – £${r.high}` : '—';
  }
  svc.addEventListener('change', update);
  size.addEventListener('input', update);
  update();

  cta.addEventListener('click', () => {
    const r = estimate(svc.value, parseFloat(size.value));
    const form = document.getElementById('contactForm');
    if (!form) return;
    const svcSel = form.querySelector('select[name="service"]');
    const msg = form.querySelector('textarea[name="message"]');
    if (svcSel) {
      [...svcSel.options].forEach(o => { if (o.value === svc.value || o.textContent === svc.value) svcSel.value = o.value || o.textContent; });
    }
    if (msg && r) {
      msg.value = `Hi Niki, my garden is roughly ${size.value} m². I'd like a quote for ${RATES[svc.value].label}. The estimator shows £${r.low}–£${r.high} — please confirm. Thanks!`;
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// ---------- Theme toggle ----------
export function mountThemeToggle(btn) {
  const saved = localStorage.getItem('niki-theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  function sync() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }
  sync();
  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('niki-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('niki-theme', 'dark');
    }
    sync();
  });
}

// ---------- Booking calendar (native input enhanced) ----------
export function mountBookingCalendar(input) {
  if (!input) return;
  const today = new Date();
  const max = new Date(); max.setDate(max.getDate() + 90);
  const fmt = (d) => d.toISOString().slice(0, 10);
  input.min = fmt(today);
  input.max = fmt(max);
}
