
(function () {
  const html = document.documentElement;

  
  const saved = localStorage.getItem('jp-theme') || 'dark';
  html.setAttribute('data-theme', saved);

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('jp-theme', next);
    });
  }
})();


window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('done');
  }, 1600);
});


const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
});


const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}


const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


let counted = false;
const statsBoard = document.querySelector('.stats-board');
if (statsBoard) {
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
  countObs.observe(statsBoard);
}


const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').replace('#', '');
    a.style.color = href === current ? 'var(--text)' : '';
  });
});


const internForm = document.getElementById('internForm');
if (internForm) {
  internForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const msg = document.getElementById('formMsg');
    msg.className = 'fstatus';
    msg.textContent = 'Submitting...';

    const data = {
      name:    document.getElementById('iName').value,
      email:   document.getElementById('iEmail').value,
      phone:   document.getElementById('iPhone').value,
      track:   document.getElementById('iTrack').value,
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
        msg.textContent = "✅ Application submitted! We'll contact you soon.";
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
}


const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const msg = document.getElementById('contactMsg');
    msg.className = 'fstatus';
    msg.textContent = 'Sending...';

    const data = {
      name:    document.getElementById('cName').value,
      email:   document.getElementById('cEmail').value,
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
        msg.textContent = "✅ Message sent! We'll respond shortly.";
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
}
