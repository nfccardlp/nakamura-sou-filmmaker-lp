/* =====================
   FILM LEADER OPENING
   ===================== */
const opening = document.getElementById('opening');
const opNum = document.getElementById('opNum');
const opSkip = document.getElementById('opSkip');
const opTc = document.getElementById('opTc');

let countVal = 3;
let countInterval;

function fmtTimecode(ms) {
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  const f = String(Math.floor((ms % 1000) / 41.67)).padStart(2, '0');
  return `${h}:${m}:${s}:${f}`;
}

const tcStart = Date.now();
const tcInterval = setInterval(() => {
  opTc.textContent = fmtTimecode(Date.now() - tcStart);
}, 42);

function animateNum() {
  opNum.style.animation = 'none';
  opNum.offsetHeight; // reflow
  opNum.style.animation = '';
}

countInterval = setInterval(() => {
  countVal--;
  if (countVal <= 0) {
    clearInterval(countInterval);
    opNum.textContent = 'ACTION';
    opNum.style.fontSize = 'clamp(60px, 12vw, 120px)';
    opNum.style.color = 'var(--red, #CC0022)';
    animateNum();
    setTimeout(closeOpening, 800);
  } else {
    opNum.textContent = countVal;
    animateNum();
  }
}, 900);

function closeOpening() {
  clearInterval(tcInterval);
  clearInterval(countInterval);
  opening.classList.add('flash');
  setTimeout(() => {
    opening.classList.add('hidden');
  }, 200);
}

opSkip.addEventListener('click', closeOpening);

/* =====================
   CUSTOM CURSOR
   ===================== */
const cursor = document.getElementById('cursor');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let cx = mx, cy = my;
const LAG = 0.12;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
});

function tickCursor() {
  cx += (mx - cx) * LAG;
  cy += (my - cy) * LAG;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(tickCursor);
}
tickCursor();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(1.6)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
});

/* =====================
   NAVIGATION
   ===================== */
const nav = document.getElementById('nav');
const navHam = document.getElementById('navHam');
const mobMenu = document.getElementById('mobMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

navHam.addEventListener('click', () => {
  mobMenu.classList.toggle('open');
});

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => mobMenu.classList.remove('open'));
});

/* =====================
   HERO PARALLAX
   ===================== */
const heroGrid = document.getElementById('heroGrid');
if (heroGrid) {
  document.addEventListener('mousemove', (e) => {
    const rx = (e.clientX / window.innerWidth - 0.5) * 10;
    const ry = (e.clientY / window.innerHeight - 0.5) * 10;
    heroGrid.style.transform = `translate(${rx * 0.4}px, ${ry * 0.3}px)`;
  });
}

/* =====================
   TIMECODE TICKERS
   ===================== */
const heroTc = document.getElementById('heroTc');
const arTc = document.getElementById('arTc');
let frame = 0;

setInterval(() => {
  frame++;
  const totalFrames = frame;
  const fps = 24;
  const h = String(Math.floor(totalFrames / (fps * 3600))).padStart(2, '0');
  const m = String(Math.floor((totalFrames % (fps * 3600)) / (fps * 60))).padStart(2, '0');
  const s = String(Math.floor((totalFrames % (fps * 60)) / fps)).padStart(2, '0');
  const f = String(totalFrames % fps).padStart(2, '0');
  const tc = `${h}:${m}:${s}:${f}`;
  if (heroTc) heroTc.textContent = tc;
}, 1000 / 24);

/* =====================
   TEXT SCRAMBLE
   ===================== */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
const scrambleMap = new WeakMap();

function scramble(el) {
  const original = el.dataset.original || el.textContent;
  if (!el.dataset.original) el.dataset.original = original;

  if (scrambleMap.has(el)) {
    clearInterval(scrambleMap.get(el));
  }

  let iteration = 0;
  const max = original.length * 3;
  const id = setInterval(() => {
    el.textContent = original.split('').map((char, i) => {
      if (char === ' ') return ' ';
      if (i < Math.floor(iteration / 3)) return original[i];
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');
    iteration++;
    if (iteration >= max) {
      clearInterval(id);
      scrambleMap.delete(el);
      el.textContent = original;
    }
  }, 30);
  scrambleMap.set(el, id);
}

document.querySelectorAll('[data-scramble]').forEach(el => {
  el.addEventListener('mouseenter', () => scramble(el));
});

/* =====================
   MAGNETIC BUTTONS
   ===================== */
document.querySelectorAll('.mag-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.3;
    const dy = (e.clientY - cy) * 0.3;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
  });
});

/* =====================
   INTERSECTION OBSERVER
   ===================== */
const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

const wkObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('revealed'), i * 80);
      wkObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-wk').forEach(el => wkObs.observe(el));

const sObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('revealed'), i * 100);
      sObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-s').forEach(el => sObs.observe(el));

/* =====================
   STATS COUNTER
   ===================== */
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.sb-num[data-target]').forEach(el => statObs.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + (target >= 50 ? '+' : '');
  }
  requestAnimationFrame(tick);
}
