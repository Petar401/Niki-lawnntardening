(function () {
  'use strict';

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
    let paused = false;

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
    function next() { if (!paused) go(index + 1); }
    function prev() { go(index - 1); }
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, 6000);
    }

    nextBtn.addEventListener('click', () => { go(index + 1); restart(); });
    prevBtn.addEventListener('click', () => { prev(); restart(); });

    // Pause on hover for desktop accessibility
    const sliderEl = document.getElementById('slider');
    if (sliderEl) {
      sliderEl.addEventListener('mouseenter', () => paused = true);
      sliderEl.addEventListener('mouseleave', () => paused = false);
    }

    go(0);
    restart();
  }

  // ---- Animated counter (hero stats) ----
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toString();
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toString();
      };
      requestAnimationFrame(tick);
    };
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => counterObs.observe(el));
  }

  // ---- FAQ Accordion (smooth, with icon rotation) ----
  document.querySelectorAll('.faq-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panelId = btn.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      btn.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        panel.setAttribute('hidden', '');
      } else {
        panel.removeAttribute('hidden');
      }
    });
  });

  // ---- Before / After comparison slider ----
  document.querySelectorAll('[data-ba]').forEach((ba) => {
    const handle = ba.querySelector('[data-ba-handle]');
    if (!handle) return;

    let dragging = false;

    const setPos = (clientX) => {
      const rect = ba.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      ba.style.setProperty('--pos', pct + '%');
      handle.setAttribute('aria-valuenow', Math.round(pct));
    };

    const onDown = (e) => {
      dragging = true;
      ba.classList.add('is-dragging');
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
    };
    const onUp = () => {
      dragging = false;
      ba.classList.remove('is-dragging');
    };

    handle.addEventListener('mousedown', onDown);
    handle.addEventListener('touchstart', onDown, { passive: false });
    ba.addEventListener('mousedown', onDown);
    ba.addEventListener('touchstart', onDown, { passive: false });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    handle.addEventListener('keydown', (e) => {
      const current = parseFloat(handle.getAttribute('aria-valuenow') || '50');
      let next = current;
      if (e.key === 'ArrowLeft')  next = Math.max(0, current - 5);
      if (e.key === 'ArrowRight') next = Math.min(100, current + 5);
      if (e.key === 'Home') next = 0;
      if (e.key === 'End')  next = 100;
      if (next !== current) {
        ba.style.setProperty('--pos', next + '%');
        handle.setAttribute('aria-valuenow', Math.round(next));
        e.preventDefault();
      }
    });
  });

  // ---- Testimonial carousel ----
  const tTrack = document.getElementById('testimonialTrack');
  const tDots = document.getElementById('tDots');
  const tPrev = document.getElementById('tPrev');
  const tNext = document.getElementById('tNext');
  if (tTrack && tDots && tPrev && tNext) {
    const items = tTrack.querySelectorAll('.testimonial');
    let tIndex = 0;
    let tTimer;

    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => tGo(i, true));
      tDots.appendChild(dot);
    });

    function tGo(i, manual) {
      tIndex = (i + items.length) % items.length;
      tTrack.style.transform = `translateX(-${tIndex * 100}%)`;
      tDots.querySelectorAll('button').forEach((d, di) => {
        if (di === tIndex) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
      if (manual) tRestart();
    }
    function tRestart() {
      clearInterval(tTimer);
      tTimer = setInterval(() => tGo(tIndex + 1), 7000);
    }
    tPrev.addEventListener('click', () => tGo(tIndex - 1, true));
    tNext.addEventListener('click', () => tGo(tIndex + 1, true));

    // Swipe support
    let touchStartX = 0;
    tTrack.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    tTrack.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) tGo(tIndex + (dx < 0 ? 1 : -1), true);
    });

    tGo(0);
    tRestart();
  }

  // ---- Scroll reveal ----
  const revealTargets = document.querySelectorAll(
    '.collection, .about-img, .about-grid > div, .process-step, .price-card, .offer > div, .offer-card, .faq-item, .contact-form, .contact-list, .post, .section-head, .stats, .newsletter, .testimonial-slider, .ba'
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

  // ---- Site search (in-page suggestions) ----
  const searchInput = document.getElementById('siteSearch');
  const suggBox = document.getElementById('searchSuggestions');
  if (searchInput && suggBox) {
    const items = [
      { label: 'Lawn care', tag: 'Service', href: '#services' },
      { label: 'Hedge trimming', tag: 'Service', href: '#services' },
      { label: 'Planting & borders', tag: 'Service', href: '#services' },
      { label: 'Garden clearance', tag: 'Service', href: '#services' },
      { label: 'Regular maintenance', tag: 'Service', href: '#services' },
      { label: 'Green waste removal', tag: 'Service', href: '#services' },
      { label: 'Pricing', tag: 'Section', href: '#pricing' },
      { label: 'How it works', tag: 'Section', href: '#process' },
      { label: 'Before & after gallery', tag: 'Section', href: '#gallery' },
      { label: 'About Nikis', tag: 'Section', href: '#about' },
      { label: 'Blog & articles', tag: 'Section', href: '#blog' },
      { label: 'What areas do you cover?', tag: 'FAQ', href: '#faq' },
      { label: 'Are you insured?', tag: 'FAQ', href: '#faq' },
      { label: 'How do I pay?', tag: 'FAQ', href: '#faq' },
      { label: 'Contact us / get a quote', tag: 'Section', href: '#contact' },
      { label: 'WhatsApp us', tag: 'Contact', href: 'https://wa.me/447843818290' },
      { label: 'Call 07843 818290', tag: 'Contact', href: 'tel:+447843818290' }
    ];

    const render = (q) => {
      const query = q.trim().toLowerCase();
      suggBox.innerHTML = '';
      if (!query) { suggBox.classList.remove('open'); return; }
      const matches = items
        .filter((it) => it.label.toLowerCase().includes(query) || it.tag.toLowerCase().includes(query))
        .slice(0, 6);
      if (!matches.length) { suggBox.classList.remove('open'); return; }
      matches.forEach((m) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.innerHTML = `<span>${m.label}</span><span class="sugg-tag">${m.tag}</span>`;
        li.addEventListener('mousedown', (e) => {
          e.preventDefault();
          window.location.href = m.href;
          searchInput.value = '';
          suggBox.classList.remove('open');
        });
        suggBox.appendChild(li);
      });
      suggBox.classList.add('open');
    };

    searchInput.addEventListener('input', (e) => render(e.target.value));
    searchInput.addEventListener('focus', (e) => render(e.target.value));
    searchInput.addEventListener('blur', () => {
      setTimeout(() => suggBox.classList.remove('open'), 120);
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { searchInput.value = ''; suggBox.classList.remove('open'); }
      if (e.key === 'Enter') {
        const first = suggBox.querySelector('li');
        if (first) first.dispatchEvent(new MouseEvent('mousedown'));
      }
    });
  }

  // ---- Contact form validation ----
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form && status) {
    const setInvalid = (field, isInvalid) => {
      if (isInvalid) field.classList.add('invalid');
      else field.classList.remove('invalid');
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      const fields = {
        name: form.querySelector('[name="name"]'),
        email: form.querySelector('[name="email"]'),
        service: form.querySelector('[name="service"]'),
        message: form.querySelector('[name="message"]')
      };
      const values = Object.fromEntries(
        Object.entries(fields).map(([k, el]) => [k, (el.value || '').trim()])
      );

      let firstInvalid = null;
      Object.entries(fields).forEach(([k, el]) => {
        const empty = !values[k];
        setInvalid(el, empty);
        if (empty && !firstInvalid) firstInvalid = el;
      });

      if (firstInvalid) {
        status.classList.add('err');
        status.textContent = 'Please fill in the required fields.';
        firstInvalid.focus();
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        setInvalid(fields.email, true);
        status.classList.add('err');
        status.textContent = 'Please enter a valid email address.';
        fields.email.focus();
        return;
      }

      status.classList.add('ok');
      status.textContent = `Thanks, ${values.name.split(' ')[0]}! We'll be in touch within 48 hours.`;
      form.reset();
      Object.values(fields).forEach((f) => setInvalid(f, false));
    });

    // Clear invalid state as user types
    form.querySelectorAll('input, select, textarea').forEach((el) => {
      el.addEventListener('input', () => setInvalid(el, false));
      el.addEventListener('change', () => setInvalid(el, false));
    });
  }

  // ---- Newsletter form ----
  const newsForm = document.getElementById('newsletterForm');
  const newsStatus = document.getElementById('newsStatus');
  if (newsForm && newsStatus) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsStatus.className = 'form-status';
      const email = (newsForm.email.value || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newsStatus.classList.add('err');
        newsStatus.textContent = 'Please enter a valid email address.';
        return;
      }
      newsStatus.classList.add('ok');
      newsStatus.textContent = 'Subscribed! Watch out for our next seasonal email.';
      newsForm.reset();
    });
  }

  // ---- Back to top ----
  const backTop = document.getElementById('backToTop');
  if (backTop) {
    const onScroll = () => {
      if (window.scrollY > 600) backTop.removeAttribute('hidden');
      else backTop.setAttribute('hidden', '');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
