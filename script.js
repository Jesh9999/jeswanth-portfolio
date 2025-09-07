// Zoox-inspired: pinning, split headline, parallax, particles, marquee, magnetic, tilt
(() => {
  const root = document.documentElement;
  const menuBtn = document.querySelector('.menu');
  const navMenu = document.getElementById('navmenu');
  const progress = document.getElementById('progress');
  const cursor = document.getElementById('cursor');

  // Mobile nav
  menuBtn?.addEventListener('click', () => {
    const expanded = navMenu.getAttribute('aria-expanded') === 'true';
    navMenu.setAttribute('aria-expanded', String(!expanded));
    menuBtn.setAttribute('aria-expanded', String(!expanded));
  });

  // Cursor glow follows mouse
  window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Progress bar
  const onScroll = () => {
    const st = window.scrollY || document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progress.style.width = (st / h * 100) + '%';
  };
  window.addEventListener('scroll', onScroll); onScroll();

  // Magnetic buttons shimmer
  document.querySelectorAll('.magnet').forEach(btn => {
    const rect = () => btn.getBoundingClientRect();
    btn.addEventListener('mousemove', (e) => {
      const r = rect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      btn.style.setProperty('--x', x + '%');
      btn.style.setProperty('--y', y + '%');
      const dx = (x - 50) / 50, dy = (y - 50) / 50;
      btn.style.transform = `translate(${dx * 4}px, ${dy * 4}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0,0)');
  });

  // Particles canvas (lightweight)
  const cv = document.getElementById('particles');
  const ctx = cv.getContext('2d');
  function resize(){ cv.width = window.innerWidth; cv.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();
  const P = Array.from({length: 80}, () => ({
    x: Math.random()*cv.width, y: Math.random()*cv.height,
    vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4,
  }));
  function tick(){
    ctx.clearRect(0,0,cv.width,cv.height);
    for (const p of P){
      p.x += p.vx; p.y += p.vy;
      if (p.x<0||p.x>cv.width) p.vx*=-1;
      if (p.y<0||p.y>cv.height) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,255,183,0.7)'; ctx.fill();
    }
    requestAnimationFrame(tick);
  } tick();

  // Smooth scrolling (Lenis)
  try {
    const lenis = new Lenis({ lerp: 0.12, smoothTouch: false });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  } catch(e){}

  // GSAP enhancements
  if (window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);

    // Split headline words
    const split = document.querySelector('.split');
    if (split){
      // Skip splitting when headline contains markup (e.g., accent spans)
      if (!split.innerHTML.includes('<span')){
        const words = split.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
        split.innerHTML = words;
      }
      gsap.from(split.querySelectorAll('.w'), { opacity:0, y:22, duration:0.8, ease:'power3.out', stagger:0.06 });
    }

    // Pinned Stories with image swap
    const stories = document.querySelectorAll('.story');
  /* add spacer after stories */
  const storiesSection = document.getElementById('stories');
  if (storiesSection && !document.getElementById('stories-spacer')){
    const spacer = document.createElement('div'); spacer.id='stories-spacer';
    spacer.style.height = '20vh'; storiesSection.appendChild(spacer);
  }
    const imgEl = document.getElementById('story-image');
    
    // set initial story image
    if (imgEl && stories.length){
      imgEl.src = stories[0].dataset.img;
    }
    
    stories.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el, start: 'top 70%', end: 'bottom 30%',
        start: 'top 65%', end: 'bottom 35%', onEnter: () => imgEl.src = el.dataset.img,
        onEnterBack: () => imgEl.src = el.dataset.img,
      });
      gsap.from(el, { opacity:0, y:18, duration:0.8, ease:'power2.out',
        scrollTrigger:{ trigger: el, start:'top 80%' } });
    });

    // Tilt3D on cards (hover)
    document.querySelectorAll('.tilt3d').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotateX: y * -6, rotateY: x * 8, duration:0.3, ease:'power2.out' });
      });
      card.addEventListener('mouseleave', () => gsap.to(card, { rotateX:0, rotateY:0, duration:0.5, ease:'power3.out' }));
    });
  }
})();
/* nav active tracker */
(function(){
  const hdr = document.querySelector('.hdr');
  const links = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const ids = links.map(a => a.getAttribute('href').slice(1));
  const secs = ids.map(id => document.getElementById(id)).filter(Boolean);

  const onS = () => {
    if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 10);
    const y = window.scrollY + 140; // offset for sticky header
    let active = null;
    for (const s of secs){
      const r = s.getBoundingClientRect();
      const top = s.offsetTop, h = s.offsetHeight;
      if (y >= top && y < top + h){ active = s.id; break; }
    }
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + active));
  };
  window.addEventListener('scroll', onS, {passive:true});
  window.addEventListener('resize', onS);
  onS();
})();

/* metrics count-up */
(function(){
  const nums = document.querySelectorAll('.hero__metrics .num');
  if (!nums.length) return;
  const fmt = (n) => {
    if (n >= 1_000_000) return (n/1_000_000).toFixed(1)+'M';
    if (n >= 1_000) return (n/1_000).toFixed(1)+'k';
    return Math.floor(n).toString();
  };
  const animate = (el) => {
    const target = +el.getAttribute('data-target') || 0;
    const dur = 1200;
    const start = performance.now();
    const from = 0;
    const step = (t)=>{
      const p = Math.min(1, (t-start)/dur);
      el.textContent = target >= 1000 ? fmt(from + p*target) : Math.round(from + p*target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, {threshold:.6});
  nums.forEach(n=>io.observe(n));
})();

/* ===== Animation Upgrades JS ===== */

// 3) Stories highlight on scroll
(function(){
  const stories = document.querySelectorAll('#stories .story');
  if (!stories.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      e.target.classList.toggle('is-active', e.intersectionRatio > .6);
    });
  },{threshold:[0,.6,1]});
  stories.forEach(s=>io.observe(s));
})();

// 5) Project reveal choreography
(function(){
  const cards = document.querySelectorAll('#work .portfolio__content');
  if (!cards.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(({isIntersecting,target})=>{
      if (isIntersecting){ target.style.setProperty('--reveal', 1); io.unobserve(target); }
    });
  },{threshold:.3});
  cards.forEach(c=>io.observe(c));
})();

// 7) Magnetic CTAs
(function(){
  const btns = document.querySelectorAll('.cta a, .cta button');
  const r = 16;
  btns.forEach(btn=>{
    btn.addEventListener('mousemove', e=>{
      const b = btn.getBoundingClientRect();
      const x = (e.clientX - (b.left + b.width/2)) / r;
      const y = (e.clientY - (b.top + b.height/2)) / r;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', ()=>btn.style.transform = '');
  });
})();

// 9) Progress bar
(function(){
  const pb = document.querySelector('.progressbar') || (()=>{ const d=document.createElement('div'); d.className='progressbar'; document.body.appendChild(d); return d; })();
  const onscroll = ()=>{
    const p = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
    pb.style.transform = `scaleX(${Math.max(0,Math.min(1,p))})`;
  };
  window.addEventListener('scroll', onscroll, {passive:true});
  onscroll();
})();
