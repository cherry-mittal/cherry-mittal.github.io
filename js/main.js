/* ═══════════════════════════════════════════════════════
   CHERRY MITTAL — Portfolio JS
   Sections: Navbar | Typewriter | Canvas Particles
═══════════════════════════════════════════════════════ */

/* ───────────────────────────────────────
   NAVBAR — scroll glass + active link + hamburger
─────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  highlightActiveSection();
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('active');
  navLinksEl.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksEl.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

function highlightActiveSection() {
  const scrollPos = window.scrollY + 90;
  document.querySelectorAll('section[id]').forEach(section => {
    const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
    if (!link) return;
    const active = scrollPos >= section.offsetTop &&
                   scrollPos < section.offsetTop + section.offsetHeight;
    link.classList.toggle('active', active);
  });
}

/* ───────────────────────────────────────
   TYPEWRITER — cycling role phrases
─────────────────────────────────────── */
const roles = [
  'LLMs that understand context',
  'GenAI applications at scale',
  'intelligent NLP pipelines',
  'production ML systems',
  'Agentic AI workflows',
];

const typedEl = document.getElementById('typed-text');
let roleIdx = 0, charIdx = 0, deleting = false;

function typeWriter() {
  const word = roles[roleIdx];
  typedEl.textContent = deleting
    ? word.slice(0, charIdx - 1)
    : word.slice(0, charIdx + 1);

  deleting ? charIdx-- : charIdx++;

  let delay = deleting ? 38 : 75;

  if (!deleting && charIdx === word.length)   { delay = 2200; deleting = true; }
  else if (deleting && charIdx === 0)          { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 380; }

  setTimeout(typeWriter, delay);
}
setTimeout(typeWriter, 1100);

/* ───────────────────────────────────────
   HERO CANVAS — floating particles + connections
─────────────────────────────────────── */
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); spawnParticles(); }, { passive: true });

class Particle {
  constructor() { this.init(); }

  init() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.r  = Math.random() * 1.4 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.38;
    this.vy = (Math.random() - 0.5) * 0.38;
    this.alpha = Math.random() * 0.45 + 0.08;
    this.isGold = Math.random() > 0.65;
  }

  step() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.init();
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = this.isGold ? '#F5A623' : '#8B7355';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

let particles = [];

function spawnParticles() {
  const density = Math.floor((canvas.width * canvas.height) / 11000);
  particles = Array.from({ length: Math.min(density, 90) }, () => new Particle());
}

function drawEdges() {
  const maxDist = 130;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDist) {
        ctx.save();
        ctx.globalAlpha = (1 - d / maxDist) * 0.07;
        ctx.strokeStyle = '#F5A623';
        ctx.lineWidth   = 0.6;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.step(); p.draw(); });
  drawEdges();
  requestAnimationFrame(animate);
}

spawnParticles();
animate();

/* ───────────────────────────────────────
   PROFILE PHOTO — graceful placeholder swap
─────────────────────────────────────── */
const profilePhoto  = document.getElementById('profile-photo');
const photoPlaceholder = document.getElementById('photo-placeholder');

if (profilePhoto) {
  profilePhoto.addEventListener('load', () => {
    profilePhoto.classList.add('loaded');
    photoPlaceholder.style.display = 'none';
  });
  profilePhoto.addEventListener('error', () => {
    profilePhoto.style.display = 'none';
    photoPlaceholder.style.display = 'flex';
  });
  /* Trigger check if already cached */
  if (profilePhoto.complete && profilePhoto.naturalWidth) {
    profilePhoto.classList.add('loaded');
    photoPlaceholder.style.display = 'none';
  }
}

/* ───────────────────────────────────────
   SCROLL-REVEAL — IntersectionObserver
   Adds `.visible` to any `.reveal` element
   when it enters the viewport.
─────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ───────────────────────────────────────
   STAT COUNTER ANIMATION
   Counts up from 0 → data-target when
   the stats grid scrolls into view.
─────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1300;
  const start    = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsGridEl = document.querySelector('.stats-grid');
if (statsGridEl) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  counterObserver.observe(statsGridEl);
}

/* ───────────────────────────────────────
   CONTACT FORM — async Formspree submit
─────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
const submitBtn   = document.getElementById('form-submit-btn');

if (contactForm && submitBtn) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending…</span><i class="fas fa-spinner fa-spin"></i>';

    try {
      const res = await fetch(contactForm.action, {
        method:  'POST',
        body:    new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
        submitBtn.style.background = '#2a7a4f';
        submitBtn.style.borderColor = '#2a7a4f';
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          submitBtn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Network response not ok');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
      window.location.href = 'mailto:cherrymittal998@gmail.com';
    }
  });
}
