// ─── Thinking Orb — sphère en points ───────────────────────────────────
(function () {
  const canvas = document.getElementById('orbCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const R = 14;
  const N = 140;
  let angle = 0;

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
    const transformed = pts.map(p => {
      const x = p.x * cos - p.z * sin;
      const z = p.x * sin + p.z * cos;
      return { x, y: p.y, z };
    }).sort((a, b) => a.z - b.z);

    for (const p of transformed) {
      const sx = W / 2 + p.x * R;
      const sy = H / 2 - p.y * R;
      const t = (p.z + 1) / 2;
      const size  = 0.5 + t * 1.3;
      const alpha = 0.1  + t * 0.85;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10,10,10,${alpha.toFixed(2)})`;
      ctx.fill();
    }
    angle += 0.014;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── Page navigation ────────────────────────────────────────────────────
const SECTIONS = ['hero', 'about', 'products', 'contact'];
let current = 0;
let isAnimating = false;

function goTo(target) {
  const idx = typeof target === 'number' ? target : SECTIONS.indexOf(target);
  if (idx < 0 || idx >= SECTIONS.length || idx === current || isAnimating) return;

  isAnimating = true;
  const dir = idx > current ? 'up' : 'down';
  const pages = document.querySelectorAll('.page');
  const dots  = document.querySelectorAll('.dot');
  const btns  = document.querySelectorAll('.nav-btn');

  pages[current].classList.remove('active');
  pages[current].classList.add(dir === 'up' ? 'exit-up' : 'exit-down');

  current = idx;
  pages[current].classList.remove('exit-up', 'exit-down');
  pages[current].classList.add('active');

  // Sync dots
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  // Sync nav buttons
  btns.forEach(b => b.classList.toggle('active', b.dataset.goto === SECTIONS[current]));

  // Ferme les panneaux produit quand on change de page
  document.querySelectorAll('.app-panel').forEach(p => p.classList.remove('open'));

  setTimeout(() => {
    pages.forEach((p, i) => { if (i !== current) p.classList.remove('exit-up', 'exit-down'); });
    isAnimating = false;
  }, 400);
}

// ─── Init ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // État initial
  document.querySelectorAll('.page')[0].classList.add('active');
  document.querySelectorAll('.dot')[0].classList.add('active');
  const firstBtn = document.querySelector('.nav-btn[data-goto="hero"]');
  if (firstBtn) firstBtn.classList.add('active');

  // Boutons data-goto
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); goTo(el.dataset.goto); });
  });

  // Mobile menu
  const toggle = document.getElementById('navToggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // ── Panneaux produit ──
  document.querySelectorAll('.app-icon-wrap:not(.muted)').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const app = wrap.dataset.app;
      const panel = document.getElementById('panel-' + app);
      if (!panel) return;
      const isOpen = panel.classList.contains('open');
      // Ferme tous
      document.querySelectorAll('.app-panel').forEach(p => p.classList.remove('open'));
      // Ouvre si c'était fermé
      if (!isOpen) panel.classList.add('open');
    });
  });

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const panel = document.getElementById('panel-' + btn.dataset.close);
      if (panel) panel.classList.remove('open');
    });
  });
});
