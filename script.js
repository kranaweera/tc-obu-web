// ===== Abstract Background — Particle Network + Floating Orbs =====
const canvas = document.getElementById('abstractBg');
const ctx = canvas.getContext('2d');
let mouseX = -1000, mouseY = -1000;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

// --- Particles ---
const PARTICLE_COUNT = 60;
const CONNECTION_DIST = 150;
const MOUSE_DIST = 200;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 2 + 0.5;
    this.baseOpacity = Math.random() * 0.4 + 0.15;
    const r = Math.random();
    if (r < 0.55) this.color = [212, 160, 23];
    else if (r < 0.85) this.color = [80, 110, 190];
    else this.color = [200, 80, 70];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.baseOpacity})`;
    ctx.fill();
  }
}

const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECTION_DIST) {
        const opacity = (1 - dist / CONNECTION_DIST) * 0.08;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(212, 160, 23, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    const mdx = particles[i].x - mouseX;
    const mdy = particles[i].y - mouseY;
    const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
    if (mDist < MOUSE_DIST) {
      const opacity = (1 - mDist / MOUSE_DIST) * 0.2;
      ctx.beginPath();
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mouseX, mouseY);
      ctx.strokeStyle = `rgba(240, 192, 64, ${opacity})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }
}

// --- Large floating ambient orbs ---
class Orb {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 250 + 120;
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = (Math.random() - 0.5) * 0.15;
    this.phase = Math.random() * Math.PI * 2;
    const colors = [
      [212, 160, 23],
      [30, 50, 120],
      [180, 50, 40],
      [20, 30, 80],
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.phase += 0.003;
    if (this.x < -this.radius) this.x = canvas.width + this.radius;
    if (this.x > canvas.width + this.radius) this.x = -this.radius;
    if (this.y < -this.radius) this.y = canvas.height + this.radius;
    if (this.y > canvas.height + this.radius) this.y = -this.radius;
  }

  draw() {
    const opacity = 0.02 + Math.sin(this.phase) * 0.01;
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${Math.max(0.005, opacity)})`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

const orbs = Array.from({ length: 6 }, () => new Orb());

function animateBg() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  orbs.forEach(o => { o.update(); o.draw(); });
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateBg);
}
animateBg();

// ===== Navbar =====
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active nav link — only on main page (hash links)
  if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
});

// ===== Mobile Nav =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ===== Smooth Scroll (only for hash links) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== Slideshow (only if present) =====
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('slideDots');

if (slides.length > 0 && dotsContainer) {
  let currentSlide = 0;
  let slideInterval;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('slide-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slide-dot');

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  const slideNextBtn = document.getElementById('slideNext');
  const slidePrevBtn = document.getElementById('slidePrev');

  if (slideNextBtn) {
    slideNextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
  }
  if (slidePrevBtn) {
    slidePrevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
  }

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  }

  slideInterval = setInterval(nextSlide, 5000);
}

// ===== Gallery Lightbox (only if present) =====
const lightbox = document.getElementById('lightbox');
const galleryItems = document.querySelectorAll('.gallery-item');

if (lightbox && galleryItems.length > 0) {
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  let lightboxIndex = 0;

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      lightboxIndex = i;
      openLightbox(item);
    });
  });

  function openLightbox(item) {
    const img = item.querySelector('img');
    const caption = item.getAttribute('data-caption');
    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.getElementById('lightboxPrev').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(galleryItems[lightboxIndex]);
  });

  document.getElementById('lightboxNext').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % galleryItems.length;
    openLightbox(galleryItems[lightboxIndex]);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
  });
}

// ===== Timeline Animation =====
const timelineItems = document.querySelectorAll('.timeline-item');

if (timelineItems.length > 0) {
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  timelineItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.15}s`;
    timelineObserver.observe(item);
  });
}

// ===== Scroll Reveal =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.card, .event-card, .gallery-item, .about-text, .about-image, .contact-info, .contact-form, .benefit, .membership-text, .team-card, .sub-committee-card, .history-note-card').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Stagger card animations
document.querySelectorAll('.cards-grid, .team-grid, .team-grid-2, .team-grid-4, .sub-committees-grid').forEach(grid => {
  grid.querySelectorAll('.card, .team-card, .sub-committee-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });
});

document.querySelectorAll('.events-grid').forEach(grid => {
  grid.querySelectorAll('.event-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });
});

// ===== Contact Form =====
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Message Sent!';
  btn.style.background = '#27ae60';
  btn.style.borderColor = '#27ae60';
  btn.style.color = '#fff';
  e.target.reset();
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.style.color = '';
  }, 3000);
}
