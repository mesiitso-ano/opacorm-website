// Page navigation
const SECTIONS = ['hero', 'about', 'products', 'contact'];
let current = 0, isAnimating = false;

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
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  btns.forEach(b => b.classList.toggle('active', b.dataset.goto === SECTIONS[current]));
  document.querySelectorAll('.app-panel').forEach(p => p.classList.remove('open'));
  setTimeout(() => {
    pages.forEach((p, i) => { if (i !== current) p.classList.remove('exit-up', 'exit-down'); });
    isAnimating = false;
  }, 400);
}

function startOrb() {
  const canvas = document.getElementById('orbCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const R = 14, N = 140;
  let angle = 0;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const pts = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const tr = pts.map(p => {
      const x = p.x * cos - p.z * sin;
      const z = p.x * sin + p.z * cos;
      return { x, y: p.y, z };
    }).sort((a, b) => a.z - b.z);
    for (const p of tr) {
      const sx = W / 2 + p.x * R;
      const sy = H / 2 - p.y * R;
      const t = (p.z + 1) / 2;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.5 + t * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(10,10,10,' + (0.12 + t * 0.88).toFixed(2) + ')';
      ctx.fill();
    }
    angle += 0.014;
    requestAnimationFrame(draw);
  }
  draw();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.page')[0].classList.add('active');
  document.querySelectorAll('.dot')[0].classList.add('active');
  const fb = document.querySelector('.nav-btn[data-goto=hero]');
  if (fb) fb.classList.add('active');

  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); goTo(el.dataset.goto); });
  });

  const toggle = document.getElementById('navToggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  document.querySelectorAll('.app-icon-wrap:not(.muted)').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const panel = document.getElementById('panel-' + wrap.dataset.app);
      if (!panel) return;
      const open = panel.classList.contains('open');
      document.querySelectorAll('.app-panel').forEach(p => p.classList.remove('open'));
      document.querySelectorAll('.panel-overlay').forEach(o => o.classList.remove('open'));
      if (!open) {
        panel.classList.add('open');
        // Positionner le panel à côté de l'icône
        const rect = wrap.getBoundingClientRect();
        const panelW = 480;
        const margin = 16;
        let left = rect.right + margin;
        let top  = rect.top;
        // Si ça dépasse à droite, on place à gauche
        if (left + panelW > window.innerWidth - margin) {
          left = rect.left - panelW - margin;
        }
        // Si ça dépasse en bas, on remonte
        if (top + panel.offsetHeight > window.innerHeight - margin) {
          top = window.innerHeight - panel.offsetHeight - margin;
        }
        if (top < 70) top = 70;
        panel.style.left = left + 'px';
        panel.style.top  = top  + 'px';
        panel.style.transform = 'none';

        const overlay = document.getElementById('overlay-' + wrap.dataset.app);
        if (overlay) overlay.classList.add('open');
      }
    });
  });

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.close;
      const panel = document.getElementById('panel-' + id);
      const overlay = document.getElementById('overlay-' + id);
      if (panel) panel.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    });
  });

  startOrb();
});