// ─── Thinking Orb — sphère en points ───────────────────────────────────
(function() {
  const canvas = document.getElementById('orbCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const R = 13;       // rayon de la sphère
  const N = 120;      // nombre de points
  let angle = 0;

  // Génération des points sur la sphère (distribution de Fibonacci)
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const cos = Math.cos(angle), sin = Math.sin(angle);

    // Trier par z pour le rendu (arrière → avant)
    const transformed = pts.map(p => {
      const x = p.x * cos - p.z * sin;
      const z = p.x * sin + p.z * cos;
      return { x, y: p.y, z };
    }).sort((a, b) => a.z - b.z);

    for (const p of transformed) {
      const sx = W / 2 + p.x * R;
      const sy = H / 2 - p.y * R;
      // Points à l'avant plus grands et opaques
      const t = (p.z + 1) / 2; // 0 = arrière, 1 = avant
      const size = 0.6 + t * 1.2;
      const alpha = 0.15 + t * 0.75;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10,10,10,${alpha})`;
      ctx.fill();
    }

    angle += 0.012;
    requestAnimationFrame(draw);
  }
  draw();
})();
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
