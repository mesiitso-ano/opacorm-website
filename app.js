// ─── Page order ────────────────────────────────────────────────────────
const SECTIONS = ['hero', 'about', 'products', 'contact'];
let current = 0;
let isAnimating = false;

// ─── Go to a section by id or index ────────────────────────────────────
function goTo(target) {
  const idx = typeof target === 'number'
    ? target
    : SECTIONS.indexOf(target);

  if (idx < 0 || idx >= SECTIONS.length || idx === current || isAnimating) return;

  isAnimating = true;
  const direction = idx > current ? 'up' : 'down';

  const pages = document.querySelectorAll('.page');
  const dots  = document.querySelectorAll('.dot');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Exit current
  pages[current].classList.remove('active');
  pages[current].classList.add(direction === 'up' ? 'exit-up' : 'exit-down');

  // Enter next
  current = idx;
  pages[current].classList.remove('exit-up', 'exit-down');
  pages[current].classList.add('active');

  // Sync dots
  dots.forEach((d, i) => d.classList.toggle('active', i === current));

  // Sync nav links
  navLinks.forEach(a => {
    a.classList.toggle('active', a.dataset.section === SECTIONS[current]);
  });

  setTimeout(() => {
    // Clean exit classes on old pages
    pages.forEach((p, i) => {
      if (i !== current) p.classList.remove('exit-up', 'exit-down');
    });
    isAnimating = false;
  }, 400);
}

// ─── Init ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Activate hero
  document.querySelectorAll('.page')[0].classList.add('active');
  document.querySelectorAll('.dot')[0].classList.add('active');

  // ── data-goto buttons ──
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      goTo(el.dataset.goto);
    });
  });

  // ── Nav links with data-section ──
  document.querySelectorAll('[data-section]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      goTo(el.dataset.section);
    });
  });

  // ── Mobile menu toggle ──
  const navToggle = document.getElementById('navToggle');
  const navLinksList = document.querySelector('.nav-links');
  navToggle.addEventListener('click', () => {
    navLinksList.classList.toggle('open');
  });
  // Close on nav link click (mobile)
  navLinksList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinksList.classList.remove('open'));
  });

  // ── Mouse wheel ──
  let wheelCooldown = false;
  window.addEventListener('wheel', e => {
    if (wheelCooldown || isAnimating) return;
    wheelCooldown = true;
    setTimeout(() => { wheelCooldown = false; }, 800);

    if (e.deltaY > 0) goTo(current + 1);
    else goTo(current - 1);
  }, { passive: true });

  // ── Touch swipe ──
  let touchStartY = 0;
  window.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', e => {
    const delta = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(delta) < 50) return;
    if (delta > 0) goTo(current + 1);
    else goTo(current - 1);
  }, { passive: true });

  // ── Keyboard arrows ──
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(current + 1);
    if (e.key === 'ArrowUp'   || e.key === 'PageUp')   goTo(current - 1);
  });
});
