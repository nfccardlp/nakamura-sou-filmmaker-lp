/* FILM LEADER OPENING */
const opening = document.getElementById('opening');
const opNum = document.getElementById('opNum');
const opSkip = document.getElementById('opSkip');
const opTc = document.getElementById('opTc');
let countVal = 3;
let countInterval;

function fmtTimecode(ms) {
  const h = String(Math.floor(ms/3600000)).padStart(2,'0');
  const m = String(Math.floor((ms%3600000)/60000)).padStart(2,'0');
  const s = String(Math.floor((ms%60000)/1000)).padStart(2,'0');
  const f = String(Math.floor((ms%1000)/41.67)).padStart(2,'0');
  return `${h}:${m}:${s}:${f}`;
}
const tcStart = Date.now();
const tcInterval = setInterval(() => { opTc.textContent = fmtTimecode(Date.now()-tcStart); }, 42);

function animateNum() { opNum.style.animation='none'; opNum.offsetHeight; opNum.style.animation=''; }

countInterval = setInterval(() => {
  countVal--;
  if (countVal <= 0) {
    clearInterval(countInterval);
    opNum.textContent = 'ACTION';
    opNum.style.fontSize = 'clamp(60px,12vw,120px)';
    opNum.style.color = '#CC0022';
    animateNum();
    setTimeout(closeOpening, 800);
  } else {
    opNum.textContent = countVal;
    animateNum();
  }
}, 900);

function closeOpening() {
  clearInterval(tcInterval); clearInterval(countInterval);
  opening.classList.add('flash');
  setTimeout(() => opening.classList.add('hidden'), 200);
}
opSkip.addEventListener('click', closeOpening);

/* CUSTOM CURSOR */
const cursor = document.getElementById('cursor');
let mx = window.innerWidth/2, my = window.innerHeight/2;
let cx = mx, cy = my;
const LAG = 0.12;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
function tickCursor() { cx+=(mx-cx)*LAG; cy+=(my-cy)*LAG; cursor.style.left=cx+'px'; cursor.style.top=cy+'px'; requestAnimationFrame(tickCursor); }
tickCursor();
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform='translate(-50%,-50%) scale(1.6)');
  el.addEventListener('mouseleave', () => cursor.style.transform='translate(-50%,-50%) scale(1)');
});

/* NAV */
const nav = document.getElementById('nav');
const navHam = document.getElementById('navHam');
const mobMenu = document.getElementById('mobMenu');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));
navHam.addEventListener('click', () => mobMenu.classList.toggle('open'));
document.querySelectorAll('.mm-link').forEach(l => l.addEventListener('click', () => mobMenu.classList.remove('open')));

/* HERO PARALLAX ON MOUSEMOVE */
const heroGrid = document.getElementById('heroGrid');
if (heroGrid) {
  document.addEventListener('mousemove', e => {
    const rx = (e.clientX/window.innerWidth-.5)*10;
    const ry = (e.clientY/window.innerHeight-.5)*10;
    heroGrid.style.transform = `translate(${rx*.4}px,${ry*.3}px)`;
  });
}

/* TIMECODE */
const heroTc = document.getElementById('heroTc');
let frame = 0;
setInterval(() => {
  frame++;
  const fps=24,h=String(Math.floor(frame/(fps*3600))).padStart(2,'0'),
    m=String(Math.floor((frame%(fps*3600))/(fps*60))).padStart(2,'0'),
    s=String(Math.floor((frame%(fps*60))/fps)).padStart(2,'0'),
    f=String(frame%fps).padStart(2,'0');
  if(heroTc) heroTc.textContent=`${h}:${m}:${s}:${f}`;
}, 1000/24);

/* TEXT SCRAMBLE */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
const scrambleMap = new WeakMap();
function scramble(el) {
  const original = el.dataset.original || el.textContent;
  if (!el.dataset.original) el.dataset.original = original;
  if (scrambleMap.has(el)) clearInterval(scrambleMap.get(el));
  let iter = 0; const max = original.length*3;
  const id = setInterval(() => {
    el.textContent = original.split('').map((ch,i) => {
      if(ch===' ') return ' ';
      if(i < Math.floor(iter/3)) return original[i];
      return CHARS[Math.floor(Math.random()*CHARS.length)];
    }).join('');
    iter++;
    if(iter>=max){clearInterval(id);scrambleMap.delete(el);el.textContent=original;}
  }, 30);
  scrambleMap.set(el,id);
}
document.querySelectorAll('[data-scramble]').forEach(el => el.addEventListener('mouseenter', () => scramble(el)));

/* MAGNETIC BUTTONS */
document.querySelectorAll('.mag-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r=btn.getBoundingClientRect();
    const dx=(e.clientX-r.left-r.width/2)*.3;
    const dy=(e.clientY-r.top-r.height/2)*.3;
    btn.style.transform=`translate(${dx}px,${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform='translate(0,0)');
});

/* SCROLL: PARALLAX + HORIZONTAL DRIFT */
let rafPending = false, lastSY = 0;
function applyScrollFX() {
  const y = lastSY;
  document.querySelectorAll('[data-py]').forEach(el => {
    el.style.transform = `translateY(${y * parseFloat(el.dataset.py)}px)`;
  });
  document.querySelectorAll('[data-drift]').forEach(el => {
    el.style.transform = `translateX(${y * parseFloat(el.dataset.drift)}px)`;
  });
  rafPending = false;
}
window.addEventListener('scroll', () => {
  lastSY = window.scrollY;
  if (!rafPending) { rafPending=true; requestAnimationFrame(applyScrollFX); }
}, { passive:true });

/* INTERSECTION OBSERVERS */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('revealed');obs.unobserve(e.target);} });
}, {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

const wkObs = new IntersectionObserver(entries => {
  entries.forEach((e,i) => { if(e.isIntersecting){setTimeout(()=>e.target.classList.add('revealed'),i*80);wkObs.unobserve(e.target);} });
}, {threshold:.08});
document.querySelectorAll('.reveal-wk').forEach(el => wkObs.observe(el));

const sObs = new IntersectionObserver(entries => {
  entries.forEach((e,i) => { if(e.isIntersecting){setTimeout(()=>e.target.classList.add('revealed'),i*120);sObs.unobserve(e.target);} });
}, {threshold:.08});
document.querySelectorAll('.reveal-s').forEach(el => sObs.observe(el));

/* STATS COUNTER */
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){animateCounter(e.target);statObs.unobserve(e.target);} });
}, {threshold:.5});
document.querySelectorAll('.sb-num[data-target]').forEach(el => statObs.observe(el));
function animateCounter(el) {
  const target=parseInt(el.dataset.target,10), dur=1800, start=performance.now();
  function tick(now){
    const p=Math.min((now-start)/dur,1), ease=1-Math.pow(1-p,3);
    el.textContent=Math.round(ease*target);
    if(p<1) requestAnimationFrame(tick);
    else el.textContent=target+(target>=50?'+':'');
  }
  requestAnimationFrame(tick);
}
