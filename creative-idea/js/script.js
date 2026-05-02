/* Creative Idea Agency — Main Script v2 */
(function () {
  'use strict';

  /* ── Helpers ── */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ════════════════════════════════
     LANGUAGE SYSTEM
  ════════════════════════════════ */
  let lang = localStorage.getItem('ci-lang') || 'en';

  function applyLang(l) {
    lang = l;
    const isAr = l === 'ar';
    const root = $('#html-root');
    root.setAttribute('lang', l);
    root.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    document.body.classList.toggle('lang-ar', isAr);

    $$('[data-en]').forEach(el => {
      const val = isAr ? el.dataset.ar : el.dataset.en;
      if (val === undefined) return;
      if (el.tagName === 'TITLE') { document.title = val; return; }
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.placeholder = val; return; }
      if (el.tagName === 'OPTION') { el.textContent = val; return; }
      el.innerHTML = val;
    });

    /* select options */
    $$('select option[data-en]').forEach(o => {
      o.textContent = isAr ? o.dataset.ar : o.dataset.en;
    });

    /* lang button */
    const enLabel = $('#lang-toggle .lang-label-en');
    const arLabel = $('#lang-toggle .lang-label-ar');
    if (enLabel) enLabel.style.display = isAr ? 'inline' : 'none';
    if (arLabel) arLabel.style.display = isAr ? 'none' : 'inline';

    localStorage.setItem('ci-lang', l);
  }

  $('#lang-toggle')?.addEventListener('click', () => applyLang(lang === 'en' ? 'ar' : 'en'));

  /* ════════════════════════════════
     SCROLL PROGRESS BAR
  ════════════════════════════════ */
  const progressBar = $('#scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }

  /* ════════════════════════════════
     NAVBAR
  ════════════════════════════════ */
  const navbar = $('#navbar');
  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  /* Hamburger */
  const burger = $('#hamburger');
  const navLinks = $('#nav-links');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks?.classList.toggle('open');
    document.body.style.overflow = navLinks?.classList.contains('open') ? 'hidden' : '';
  });
  $$('#nav-links a').forEach(a => a.addEventListener('click', () => {
    burger?.classList.remove('open');
    navLinks?.classList.remove('open');
    document.body.style.overflow = '';
  }));

  /* ════════════════════════════════
     BACK TO TOP
  ════════════════════════════════ */
  const btt = $('#back-to-top');
  function updateBTT() {
    btt?.classList.toggle('visible', window.scrollY > 400);
  }
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ════════════════════════════════
     SMOOTH SCROLL
  ════════════════════════════════ */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ════════════════════════════════
     ACTIVE NAV
  ════════════════════════════════ */
  const sections = $$('section[id]');
  const navAs = $$('.nav-links a[href^="#"]');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAs.forEach(a => a.classList.remove('active'));
        navAs.find(a => a.getAttribute('href') === '#' + e.target.id)?.classList.add('active');
      }
    });
  }, { threshold: 0.35, rootMargin: '-80px 0px 0px 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  /* ════════════════════════════════
     SCROLL REVEAL
  ════════════════════════════════ */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ════════════════════════════════
     COUNTER ANIMATION
  ════════════════════════════════ */
  function animNum(el, target, dur = 1800) {
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const t = parseInt(e.target.dataset.target, 10);
        animNum(e.target, t);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  $$('[data-target]').forEach(el => counterObs.observe(el));

  /* ════════════════════════════════
     HERO BAR FILL
  ════════════════════════════════ */
  const barFill = $('.hcard-bar-fill');
  if (barFill) {
    const barObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => { barFill.style.width = '85%'; }, 300);
        barObs.disconnect();
      }
    }, { threshold: 0.5 });
    barObs.observe(barFill);
  }

  /* ════════════════════════════════
     CANVAS PARTICLES
  ════════════════════════════════ */
  const canvas = $('#particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function Particle() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.life = Math.random();
      this.dLife = (Math.random() * 0.003 + 0.001) * (Math.random() < 0.5 ? 1 : -1);
      const colors = ['#C9A84C', '#6C63FF', '#EC4899', '#10B981', '#F0C060'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      this.life += this.dLife;
      if (this.life <= 0 || this.life >= 1) this.dLife *= -1;
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    };

    Particle.prototype.draw = function () {
      ctx.globalAlpha = this.life * 0.6;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    };

    function init() {
      resize();
      particles = Array.from({ length: 60 }, () => new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = '#C9A84C';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.globalAlpha = 0.06 * (1 - dist / 120);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      particles.forEach(p => { p.update(); p.draw(); });
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => { resize(); });
    init();
    animate();
  }

  /* ════════════════════════════════
     CONTACT FORM
  ════════════════════════════════ */
  const form = $('#contact-form');
  const success = $('#cf-success');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#cf-name', form).value.trim();
    const email = $('#cf-email', form).value.trim();
    const msg = $('#cf-message', form).value.trim();

    const invalids = [
      !name && $('#cf-name', form),
      !email && $('#cf-email', form),
      !msg && $('#cf-message', form)
    ].filter(Boolean);

    if (invalids.length) {
      invalids.forEach(el => {
        el.style.borderColor = '#EF4444';
        el.style.animation = 'shake .4s ease';
        setTimeout(() => { el.style.borderColor = ''; el.style.animation = ''; }, 600);
      });
      return;
    }

    const btn = form.querySelector('.cf-submit');
    const orig = btn.textContent;
    btn.textContent = lang === 'ar' ? 'جارى الإرسال...' : 'Sending…';
    btn.disabled = true;
    btn.style.opacity = '.7';

    setTimeout(() => {
      form.reset();
      btn.textContent = orig;
      btn.disabled = false;
      btn.style.opacity = '';
      if (success) { success.classList.add('show'); setTimeout(() => success.classList.remove('show'), 6000); }
    }, 1400);
  });

  /* ════════════════════════════════
     SCROLL HANDLER
  ════════════════════════════════ */
  function onScroll() {
    updateProgress();
    updateNavbar();
    updateBTT();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ════════════════════════════════
     INJECT EXTRA CSS
  ════════════════════════════════ */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
  `;
  document.head.appendChild(style);

  /* ════════════════════════════════
     INIT
  ════════════════════════════════ */
  applyLang(lang);
  updateNavbar();
  updateBTT();

})();
