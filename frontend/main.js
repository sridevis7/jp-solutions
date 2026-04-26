// ====== PRELOADER ======
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('done');
  }, 1600);
});

// ====== NAVBAR ======
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ====== HAMBURGER ======
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ====== SCROLL REVEAL ======
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ====== COUNTER ANIMATION ======
let counted = false;
const countObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    document.querySelectorAll('.sb-num').forEach(el => {
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 40);
    });
  }
}, { threshold: 0.5 });
const statsBoard = document.querySelector('.stats-board');
if (statsBoard) countObs.observe(statsBoard);

// ====== ACTIVE NAV LINK ======
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').replace('#', '');
    if (href === current) {
      a.style.color = 'var(--text)';
      a.style.setProperty('--after-w', '100%');
    } else {
      a.style.color = '';
    }
  });
});

// ====== INTERNSHIP FORM ======
document.getElementById('internForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  msg.className = 'fstatus';
  msg.textContent = 'Submitting...';
  const data = {
    name: document.getElementById('iName').value,
    email: document.getElementById('iEmail').value,
    phone: document.getElementById('iPhone').value,
    track: document.getElementById('iTrack').value,
    college: document.getElementById('iCollege').value,
    message: document.getElementById('iMessage').value
  };
  try {
    const res = await fetch('http://localhost:5000/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      msg.textContent = '✅ Application submitted! We\'ll contact you soon.';
      this.reset();
    } else {
      msg.className = 'fstatus error';
      msg.textContent = '❌ ' + (result.message || 'Something went wrong.');
    }
  } catch {
    msg.className = 'fstatus error';
    msg.textContent = '⚠️ Cannot connect to server. Make sure backend is running on port 5000.';
  }
});

// ====== CONTACT FORM ======
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const msg = document.getElementById('contactMsg');
  msg.className = 'fstatus';
  msg.textContent = 'Sending...';
  const data = {
    name: document.getElementById('cName').value,
    email: document.getElementById('cEmail').value,
    subject: document.getElementById('cSubject').value,
    message: document.getElementById('cMessage').value
  };
  try {
    const res = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      msg.textContent = '✅ Message sent! We\'ll respond shortly.';
      this.reset();
    } else {
      msg.className = 'fstatus error';
      msg.textContent = '❌ ' + (result.message || 'Something went wrong.');
    }
  } catch {
    msg.className = 'fstatus error';
    msg.textContent = '⚠️ Cannot connect to server. Make sure backend is running on port 5000.';
  }
});