(function () {
  // ---- Mobile nav ----
  const navToggle = document.getElementById('navToggle');
  const topnav = document.querySelector('.topnav');
  if (navToggle && topnav) {
    navToggle.addEventListener('click', () => {
      const open = topnav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    topnav.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', () => {
        topnav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // ---- Footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Hero carousel ----
  const slidesWrap = document.getElementById('slides');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const dotsWrap = document.getElementById('dots');

  if (slidesWrap && prevBtn && nextBtn && dotsWrap) {
    const slides = slidesWrap.querySelectorAll('.slide');
    let index = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => go(i, true));
      dotsWrap.appendChild(dot);
    });

    function go(i, manual) {
      index = (i + slides.length) % slides.length;
      slidesWrap.style.transform = `translateX(-${index * 100}%)`;
      dotsWrap.querySelectorAll('button').forEach((d, di) => {
        if (di === index) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
      if (manual) restart();
    }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, 6000);
    }

    nextBtn.addEventListener('click', () => { next(); restart(); });
    prevBtn.addEventListener('click', () => { prev(); restart(); });

    go(0);
    restart();
  }

  // ---- Scroll reveal ----
  const revealTargets = document.querySelectorAll(
    '.collection, .about-img, .about-grid > div, .tile, .offer > div, .offer-card, .faq details, .contact-form, .contact-list, .post, .section-head'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('in'));
  }

  // ---- Contact form validation ----
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const service = (data.get('service') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      if (!name || !email || !service || !message) {
        status.classList.add('err');
        status.textContent = 'Please fill in the required fields.';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.classList.add('err');
        status.textContent = 'Please enter a valid email address.';
        return;
      }

      status.classList.add('ok');
      status.textContent = `Thanks, ${name.split(' ')[0]}! We'll be in touch soon.`;
      form.reset();
    });
  }
})();
