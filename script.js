/* ===== YOUNGMBA — ENHANCED SCRIPT ===== */

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) { func.apply(this, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
  };
}

function initScrollAnimations() {
  const selectors = '.animate-on-scroll, .animate-scale-in, .animate-slide-left, .animate-slide-right, .stagger-children, .animate-heading-reveal, .animate-tilt-in, .animate-bounce-in, .animate-counter-pop, .animate-icon-float, .animate-blur-reveal';
  const els = document.querySelectorAll(selectors);
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('animated'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.04, rootMargin: '0px 0px 0px 0px' });
  els.forEach((el) => observer.observe(el));
  const footer = document.querySelector('.site-footer');
  if (footer) {
    const fo = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); fo.unobserve(e.target); } });
    }, { threshold: 0.05 });
    fo.observe(footer);
  }
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter'));
        const suffix = el.getAttribute('data-suffix') || '';
        const start = performance.now();
        function update(now) {
          const p = Math.min((now - start) / 1600, 1);
          el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
          if (p < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => observer.observe(el));
}

function initHeroParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const container = document.createElement('div');
  container.style.cssText = 'position:absolute;inset:0;z-index:5;pointer-events:none;overflow:hidden;';
  hero.appendChild(container);
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 5 + 1;
    const x = Math.random() * 100;
    const dur = Math.random() * 12 + 7;
    const delay = Math.random() * 6;
    const hue = [260, 160, 340][Math.floor(Math.random() * 3)];
    p.style.cssText = 'position:absolute;bottom:-10px;left:'+x+'%;width:'+size+'px;height:'+size+'px;background:hsla('+hue+',70%,70%,0.25);border-radius:50%;animation:particle-drift '+dur+'s linear '+delay+'s infinite;';
    container.appendChild(p);
  }
}

function initHeaderScroll() {
  // Header scroll state is managed by initSectionNav
  // This function kept for compatibility
}

function initMobileNav() {
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.mobile-nav');
  const iconOpen = document.querySelector('.hamburger .icon-menu');
  const iconClose = document.querySelector('.hamburger .icon-close');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    if (iconOpen) iconOpen.style.display = isOpen ? 'none' : 'block';
    if (iconClose) iconClose.style.display = isOpen ? 'block' : 'none';
  });
  nav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      if (iconOpen) iconOpen.style.display = 'block';
      if (iconClose) iconClose.style.display = 'none';
    });
  });
}

function initRotatingWords() {
  const words = document.querySelectorAll('.rotating-word');
  if (words.length < 2) return;
  const gradients = [
    'linear-gradient(135deg,#a78bfa,#e879f9)',
    'linear-gradient(135deg,#34d399,#22d3ee)',
    'linear-gradient(135deg,#f97316,#ef4444)',
    'linear-gradient(135deg,#60a5fa,#a78bfa)',
    'linear-gradient(135deg,#f472b6,#fb923c)',
    'linear-gradient(135deg,#facc15,#f97316)',
    'linear-gradient(135deg,#22d3ee,#60a5fa)',
    'linear-gradient(135deg,#fb923c,#facc15)',
    'linear-gradient(135deg,#34d399,#a78bfa)',
    'linear-gradient(135deg,#ef4444,#f472b6)',
  ];
  function paint(el, idx) {
    const gi = (idx * 2 + 3) % gradients.length;
    el.style.backgroundImage = gradients[gi];
    el.style.webkitBackgroundClip = 'text';
    el.style.backgroundClip = 'text';
    el.style.webkitTextFillColor = 'transparent';
    el.style.color = 'transparent';
  }
  let current = 0;
  words[0].classList.remove('enter');
  words[0].classList.add('active');
  paint(words[0], 0);
  setInterval(() => {
    const prev = current;
    current = (current + 1) % words.length;
    words[prev].classList.remove('active');
    words[prev].classList.add('exit');
    words[current].classList.remove('enter');
    words[current].classList.add('active');
    paint(words[current], current);
    setTimeout(() => {
      words[prev].classList.remove('exit');
      words[prev].classList.add('enter');
      words[prev].style.cssText = '';
    }, 420);
  }, 1900);
}

function initFAQ() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const item = btn.closest('.faq-item');
    if (!item) return;
    item.classList.toggle('open');
  });
}

/* Pricing toggle: Monthly = default (more expensive), toggle right = Annual (save ~30%) */
function initPricingToggle() {
  const toggles = document.querySelectorAll('.toggle-switch');
  if (!toggles.length) return;
  const monthly = document.querySelectorAll('.price-monthly');
  const annual  = document.querySelectorAll('.price-annual');
  const savings = document.querySelectorAll('.annual-savings');

  function setAnnual(yes) {
    toggles.forEach(t => t.classList.toggle('active', yes));
    monthly.forEach(el => { el.style.display = yes ? 'none' : 'block'; });
    annual.forEach(el  => { el.style.display = yes ? 'block' : 'none'; });
    savings.forEach(el => { el.style.display = yes ? 'inline-flex' : 'none'; });
    document.querySelectorAll('#lbl-monthly').forEach(l => l.classList.toggle('active', !yes));
    document.querySelectorAll('#lbl-annual').forEach(l => l.classList.toggle('active', yes));
  }

  // Default: annual (save ~30%)
  setAnnual(true);

  toggles.forEach(t => {
    t.addEventListener('click', () => setAnnual(!t.classList.contains('active')));
    t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') t.click(); });
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Message Sent!';
    btn.disabled = true;
    form.reset();
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
  });
}

function initEnrollForm() {
  const form = document.getElementById('enroll-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('enroll-form-section').style.display = 'none';
    document.getElementById('enroll-success').style.display = 'flex';
  });
}

function initParallaxScroll() {
  const hero = document.querySelector('.hero-bg');
  if (!hero) return;
  window.addEventListener('scroll', throttle(() => {
    const s = window.scrollY;
    if (s < window.innerHeight) hero.style.transform = 'translateY(' + (s * 0.28) + 'px)';
  }, 16), { passive: true });
}

function initHeroGlow() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const glow = document.createElement('div');
  glow.style.cssText = 'position:absolute;width:450px;height:450px;border-radius:50%;background:radial-gradient(circle,hsla(260,70%,60%,0.12),transparent 70%);pointer-events:none;z-index:6;transition:transform 0.25s ease-out,opacity 0.3s;opacity:0;';
  hero.appendChild(glow);
  hero.addEventListener('mousemove', throttle((e) => {
    const rect = hero.getBoundingClientRect();
    glow.style.transform = 'translate('+(e.clientX-rect.left-225)+'px,'+(e.clientY-rect.top-225)+'px)';
    glow.style.opacity = '1';
  }, 40));
  hero.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}

function initAboutCounters() {
  const stats = document.querySelectorAll('.about-stat');
  if (!stats.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-value'));
        const suffix = el.getAttribute('data-suffix') || '';
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / 1800, 1);
          el.textContent = Math.floor((1 - Math.pow(1-p,4)) * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach((el) => observer.observe(el));
}

function initCardTilt() {}

function initSubPageParticles() {
  const main = document.querySelector('.page-hero');
  if (!main) return;
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;';
  document.body.appendChild(container);
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const dur = Math.random() * 15 + 10;
    const delay = Math.random() * 8;
    const hue = Math.random() > 0.5 ? '260' : '160';
    p.style.cssText = 'position:absolute;bottom:-10px;left:'+x+'%;width:'+size+'px;height:'+size+'px;background:hsla('+hue+',70%,70%,0.12);border-radius:50%;animation:particle-drift '+dur+'s linear '+delay+'s infinite;';
    container.appendChild(p);
  }
}

function initSubPageInteractions() {
  if (!document.querySelector('.page-hero')) return;
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('mousemove', throttle((e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    }, 50));
  });
}

function initSubPageCounters() {
  const stats = document.querySelectorAll('.stat-animate');
  if (!stats.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('animated'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  stats.forEach((el) => observer.observe(el));
}

/* Vision section better stagger animation */
function initVisionStagger() {
  const items = document.querySelectorAll('.vision-item');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    let delay = 0;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('animated'), delay);
        delay += 160;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
  items.forEach(el => observer.observe(el));
}

/* FAQ links underline animation */
function initFAQLinks() {
  document.querySelectorAll('.faq-answer a').forEach(link => {
    link.style.color = 'var(--primary)';
    link.style.position = 'relative';
    link.style.display = 'inline-block';
    link.style.transition = 'color 0.2s';
    link.style.textDecoration = 'none';
    if (!link.classList.contains('btn')) {
      link.style.borderBottom = '1px solid transparent';
      link.style.transition = 'color 0.25s, border-color 0.25s';
      link.addEventListener('mouseenter', () => {
        link.style.color = 'var(--accent)';
        link.style.borderBottom = '1px solid var(--accent)';
      });
      link.addEventListener('mouseleave', () => {
        link.style.color = 'var(--primary)';
        link.style.borderBottom = '1px solid transparent';
      });
    }
  });
}

function initNonCritical() {
  initHeroParticles();
  initHeroGlow();
  initCardTilt();
  initSubPageParticles();
  initSubPageInteractions();
  initAboutCounters();
  initSubPageCounters();
  initVisionStagger();
  initFAQLinks();
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCounters();
  initHeaderScroll();
  initMobileNav();
  initRotatingWords();
  initParallaxScroll();
  initFAQ();
  initPricingToggle();
  initContactForm();
  initEnrollForm();
  initFloatEnroll();
  initSectionNav();
  initLazySections();
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => initNonCritical(), { timeout: 2000 });
  } else {
    setTimeout(initNonCritical, 100);
  }
});

/* ================================================================
   FLOATING ENROLL BUTTON
   ================================================================ */
function initFloatEnroll() {
  const btn = document.getElementById('float-enroll');
  if (!btn) return;
  const hero = document.querySelector('.hero');
  const update = () => {
    const threshold = hero ? hero.offsetHeight * 0.6 : 300;
    btn.classList.toggle('visible', window.scrollY > threshold);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ================================================================
   SECTION NAV DOTS
   ================================================================ */
function initSectionNav() {
  const nav     = document.getElementById('section-nav');
  const header  = document.querySelector('.site-header');
  if (!nav && !header) return;

  const sidebarDots = nav ? Array.from(nav.querySelectorAll('.snav-dot')) : [];
  const headerDots  = Array.from(document.querySelectorAll('.header-dots-nav .snav-dot'));
  const allDotGroups = [sidebarDots, headerDots].filter(g => g.length);

  const sections = sidebarDots.length
    ? sidebarDots.map(d => document.querySelector(d.getAttribute('href')))
    : headerDots.map(d => document.querySelector(d.getAttribute('href')));

  const hero = document.querySelector('.hero');

  const update = () => {
    const scrollY = window.scrollY;
    const mid = scrollY + window.innerHeight * 0.4;
    const heroH = hero ? hero.offsetHeight : 300;

    // Sidebar nav visibility
    if (nav) nav.classList.toggle('visible', scrollY > heroH * 0.8);

    // Mini header on mobile
    if (header) {
      header.classList.toggle('scrolled', scrollY > 20);
      header.classList.toggle('scrolled-mini', scrollY > 80);
    }

    // Active dot
    let active = 0;
    sections.forEach((s, i) => { if (s && s.offsetTop <= mid) active = i; });
    allDotGroups.forEach(group => {
      group.forEach((d, i) => d.classList.toggle('active', i === active));
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ================================================================
   LAZY SECTION LOADER
   ================================================================ */
function initLazySections() {
  const sections = document.querySelectorAll('.lazy-section');
  if (!sections.length) return;

  sections.forEach(s => s.classList.add('lazy-hidden'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.remove('lazy-hidden');
        e.target.classList.add('lazy-revealed');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });

  sections.forEach(s => io.observe(s));
}
