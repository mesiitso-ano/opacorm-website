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
  navLinksList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinksList.classList.remove('open'));
  });

  // Scroll, swipe et clavier désactivés — navigation par boutons uniquement.
});
