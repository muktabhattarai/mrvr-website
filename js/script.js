/* Marshyangdi River View Resort — script.js (vanilla JS) */
'use strict';

/* ---- CONFIG: edit contact details, social links and booking endpoint here ---- */
const RESORT = {
  name: 'Marshyangdi River View Resort',
  logo: 'photos/logo.png', // put your logo file here (PNG/SVG, transparent background)
  address: 'Yampa Dhab( Prithivi Highway),Bandipur-5, Tanahun, Nepal',
  phone: '+977 9856041201',
  email: 'info@marshyangdiresort.com',
  // Footer "View on Google Maps" link. For the exact pin: open your resort in Google Maps,
  // tap Share > Copy link, and paste it here in place of the search link below.
  map: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Marshyangdi River View Resort, Yampa Dhab, Bandipur, Tanahun, Nepal'),
  // Footer "Follow" links. Paste your full page links. Leave a value as '' to hide that link.
  social: {
    facebook: 'https://www.facebook.com/',   // TODO: replace with your Facebook page link
    tiktok: 'https://www.tiktok.com/@marshyangdi3?_r=1&_t=ZS-9B8qPGttn5M', 
    tripadvisor: '',                          // optional: your TripAdvisor page link
  },
  bookingEndpoint: null, // e.g. '/api/bookings' once a backend exists
};
const NAV = [['index.html', 'Home'], ['rooms.html', 'Rooms'], ['events.html', 'Events'], ['book-now.html', 'Book Now']];
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---- Shared header & footer (edit once, applies to all 4 pages) ---- */
function renderChrome() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const links = NAV.map(([h, t], i) =>
    `<li><a href="${h}"${h === page ? ' aria-current="page"' : ''}${i === 3 ? ' class="cta"' : ''}>${t}</a></li>`).join('');
  $('#site-header').innerHTML = `<header class="site-header"><div class="wrap nav">
    <a class="logo" href="index.html" aria-label="${RESORT.name} home"><img class="logo-img" src="${RESORT.logo}" alt=""><span>Marshyangdi<small>River View Resort</small></span></a>
    <button class="burger" aria-label="Toggle menu" aria-expanded="false" aria-controls="menu"><span></span><span></span><span></span></button>
    <nav aria-label="Main"><ul class="menu" id="menu">${links}</ul></nav></div></header>`;
  const foot = NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('');
  const pin = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor" style="display:inline-block;vertical-align:-2px;margin-right:.4rem"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>';
  const social = [['Facebook', RESORT.social.facebook], ['Tiktok', RESORT.social.tiktok], ['TripAdvisor', RESORT.social.tripadvisor]]
    .filter(([, url]) => url)
    .map(([n, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${n} (opens in a new tab)">${n}</a></li>`).join('');
  $('#site-footer').innerHTML = `<footer class="footer"><div class="wrap"><div class="fgrid">
    <div><div class="logo">${RESORT.name}</div><p>A peaceful riverside retreat where the Marshyangdi flows beneath the mountains.</p></div>
    <div><h3>Explore</h3><ul>${foot}</ul></div>
    <div><h3>Contact</h3><ul><li>${RESORT.address}</li><li><a href="${RESORT.map}" target="_blank" rel="noopener noreferrer" aria-label="View ${RESORT.name} on Google Maps (opens in a new tab)">${pin}View on Google Maps</a></li><li><a href="tel:${RESORT.phone.replace(/\s/g, '')}">${RESORT.phone}</a></li><li><a href="mailto:${RESORT.email}">${RESORT.email}</a></li></ul></div>
    <div><h3>Follow</h3><ul>${social}</ul></div>
    </div><div class="copy"><span>© ${new Date().getFullYear()} ${RESORT.name}. All rights reserved.</span><span>Nepal</span></div></div></footer>`;
}

/* ---- Header: sticky style + mobile menu ---- */
function initNav() {
  const header = $('.site-header'), burger = $('.burger'), menu = $('#menu');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 60);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  const set = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : ''; };
  burger.addEventListener('click', () => set(!menu.classList.contains('open')));
  menu.addEventListener('click', e => e.target.closest('a') && set(false));
  addEventListener('keydown', e => e.key === 'Escape' && set(false));
}

/* ---- Hero slideshow ---- */
function initHero() {
  const hero = $('.hero[data-slider]'); if (!hero) return;
  const slides = $$('.slide', hero), dots = $('.dots', hero), count = $('.count', hero);
  const DELAY = 7000; let i = 0, timer;
  slides.forEach((_, n) => { const b = document.createElement('button'); b.className = 'dot'; b.setAttribute('aria-label', `Show slide ${n + 1}`); b.onclick = () => { go(n); restart(); }; dots.append(b); });
  const go = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    $$('.dot', dots).forEach((d, k) => d.setAttribute('aria-current', k === i));
    count.innerHTML = `${String(i + 1).padStart(2, '0')} <span>/ ${String(slides.length).padStart(2, '0')}</span>`;
  };
  const restart = () => { clearInterval(timer); if (!matchMedia('(prefers-reduced-motion:reduce)').matches) timer = setInterval(() => go(i + 1), DELAY); };
  $('.prev', hero).onclick = () => { go(i - 1); restart(); };
  $('.next', hero).onclick = () => { go(i + 1); restart(); };
  hero.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') $('.prev', hero).click(); if (e.key === 'ArrowRight') $('.next', hero).click(); });
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : restart());
  // subtle parallax on scroll
  addEventListener('scroll', () => { if (scrollY < innerHeight) hero.style.setProperty('--py', `${scrollY * .12}px`); }, { passive: true });
  go(0); restart();
}

/* ---- Scroll reveal ---- */
function initReveal() {
  const els = $$('.rv');
  if (!('IntersectionObserver' in window)) return els.forEach(e => e.classList.add('in'));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15, rootMargin: '0px 0px -40px' });
  els.forEach(e => io.observe(e));
}

/* ---- Missing-image fallback (keeps the gradient placeholder visible) ---- */
function initImages() {
  $$('img').forEach(img => {
    const bad = () => img.classList.add('broken');
    img.addEventListener('error', bad); if (img.complete && !img.naturalWidth) bad();
  });
}

/* ---- Gallery lightbox ---- */
function initLightbox() {
  const items = $$('.gallery img'); if (!items.length) return;
  const lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML = '<button class="x" aria-label="Close">×</button><button class="p" aria-label="Previous">‹</button><img alt=""><button class="n" aria-label="Next">›</button>';
  document.body.append(lb);
  const big = $('img', lb); let k = 0, last;
  const show = n => { k = (n + items.length) % items.length; big.src = items[k].currentSrc || items[k].src; big.alt = items[k].alt; };
  const open = n => { last = document.activeElement; show(n); lb.classList.add('open'); document.body.style.overflow = 'hidden'; $('.x', lb).focus(); };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; last && last.focus(); };
  items.forEach((im, n) => { const box = im.parentElement; box.tabIndex = 0; box.setAttribute('role', 'button'); box.setAttribute('aria-label', `Open photo: ${im.alt}`);
    box.onclick = () => open(n); box.onkeydown = e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open(n)); });
  $('.x', lb).onclick = close; $('.p', lb).onclick = () => show(k - 1); $('.n', lb).onclick = () => show(k + 1);
  lb.onclick = e => e.target === lb && close();
  addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(k - 1); if (e.key === 'ArrowRight') show(k + 1); });
}

/* ---- Booking form ---- */
async function submitBooking(data) {
  // Backend hook: set RESORT.bookingEndpoint and this will POST JSON. Until then it only simulates a short delay.
  if (RESORT.bookingEndpoint) {
    const r = await fetch(RESORT.bookingEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error('Request failed');
    return r.json();
  }
  await new Promise(r => setTimeout(r, 700));
  return { ok: true };
}

function initBooking() {
  const form = $('#booking-form'); if (!form) return;
  const today = new Date().toISOString().split('T')[0];
  form.checkin.min = today; form.checkout.min = today;
  const pre = new URLSearchParams(location.search).get('room'); if (pre) form.room.value = pre;
  const rules = {
    name: v => v.trim().length >= 2 || 'Please enter your full name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    phone: v => /^\+?[\d\s\-()]{7,18}$/.test(v) || 'Enter a valid phone number.',
    checkin: v => (v && v >= today) || 'Choose a check-in date from today onward.',
    checkout: v => (v && v > form.checkin.value) || 'Check-out must be after check-in.',
    guests: v => (+v >= 1 && +v <= 12) || 'Enter between 1 and 12 guests.',
    room: v => !!v || 'Please select a room type.',
  };
  const check = f => { const r = rules[f.name]; if (!r) return true; const res = r(f.value); const ok = res === true;
    f.setAttribute('aria-invalid', !ok); $(`#${f.name}-err`).textContent = ok ? '' : res; return ok; };
  $$('input,select', form).forEach(f => f.addEventListener('blur', () => check(f)));
  form.checkin.addEventListener('change', () => { form.checkout.min = form.checkin.value || today; });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const bad = Object.keys(rules).map(n => form[n]).filter(f => !check(f));
    if (bad.length) return bad[0].focus();
    const btn = $('button[type=submit]', form); btn.disabled = true; btn.textContent = 'Sending…';
    const data = Object.fromEntries(new FormData(form));
    try {
      await submitBooking(data);
      const box = $('#booking-result');
      box.innerHTML = `<div class="confirm" tabindex="-1"><h2>Thank you, ${data.name.split(' ')[0].replace(/[<>&"]/g, '')}.</h2>
        <p class="lead" style="margin:auto">Your booking request has been received. Our reservations team will contact you at the email or phone provided to confirm availability and details.</p>
        <dl><dt>Room</dt><dd>${data.room.replace(/[<>&"]/g, '')}</dd><dt>Check-in</dt><dd>${data.checkin}</dd><dt>Check-out</dt><dd>${data.checkout}</dd><dt>Guests</dt><dd>${data.guests}</dd></dl>
        <p><a class="btn line" href="index.html">Back to Home</a></p></div>`;
      form.hidden = true; box.hidden = false; $('.confirm', box).focus(); box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) { btn.disabled = false; btn.textContent = 'Request Booking'; $('#form-err').textContent = 'Something went wrong. Please try again or call us.'; }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderChrome(); initNav(); initHero(); initReveal(); initLightbox(); initBooking(); initImages();
});

/* ---- Hero video switcher: change SECONDS to set how long each clip shows ---- */
document.addEventListener('DOMContentLoaded', () => {
  const vids = [...document.querySelectorAll('.hero .hv')];
  if (vids.length < 2) return;
  const SECONDS = 3;
  let i = 0;
  vids.forEach(v => { v.muted = true; v.volume = 0; });
  vids[0].play().catch(() => {});
  setInterval(() => {
    const cur = vids[i], next = vids[(i + 1) % vids.length];
    next.currentTime = 0;
    next.play().catch(() => {});
    next.classList.add('active');
    cur.classList.remove('active');
    setTimeout(() => cur.pause(), 1400);
    i = (i + 1) % vids.length;
  }, SECONDS * 1000);
});