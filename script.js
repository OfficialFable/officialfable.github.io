// Fable website: download links, navigation and the little animations.

// Where the installer lives. This GitHub link always serves the newest release's
// Fable-Setup.exe, so it doesn't change between versions. Every Download button uses it.
const DOWNLOAD = {
  url: 'https://github.com/OfficialFable/officialfable.github.io/releases/latest/download/Fable-Setup.exe',
  version: '0.5.0',
  size: '117 MB',
};

const $ = (sel) => document.querySelector(sel);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Toast ----

let toastTimer = null;
function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

// ---- Download buttons ----

document.querySelectorAll('[data-version]').forEach((el) => {
  el.textContent = `Free · Version ${DOWNLOAD.version} · ${DOWNLOAD.size} · Windows 10 & 11`;
});
document.querySelectorAll('[data-download]').forEach((a) => {
  if (DOWNLOAD.url) {
    a.href = DOWNLOAD.url;
    a.setAttribute('download', '');
  } else {
    a.addEventListener('click', (e) => {
      // Buttons at the top still scroll down to the download section first.
      if (a.closest('#download')) {
        e.preventDefault();
        toast('Downloads open very soon. Check back shortly!');
      }
    });
  }
});

// ---- Navigation ----

const nav = $('#nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const menu = $('#nav-menu');
const links = $('#nav-links');
menu.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
links.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    links.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }
});

// ---- Reveal sections as they scroll into view ----

const revealer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    revealer.unobserve(entry.target);
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

// Stagger items that appear together in a row.
document.querySelectorAll('.reveal').forEach((el) => {
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
  el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 70}ms`;
  revealer.observe(el);
});

// ---- Listen Together card: reactions floating up ----

const stream = $('#emoji-stream');
const EMOJIS = ['🔥', '❤️', '😂', '👏', '🎉', '😮'];
let streamTimer = null;
function spawnEmoji() {
  const el = document.createElement('span');
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  el.style.left = `${55 + Math.random() * 38}%`;
  el.style.setProperty('--dx', `${(Math.random() - 0.5) * 70}px`);
  stream.append(el);
  setTimeout(() => el.remove(), 2700);
}

// ---- Leaderboard card: your play count ticking up ----

const myPlays = $('#my-plays');
let plays = 15;
let boardTimer = null;
function addPlay() {
  plays = plays >= 20 ? 15 : plays + 1;
  myPlays.textContent = plays;
  myPlays.classList.remove('bump');
  void myPlays.offsetWidth;
  myPlays.classList.add('bump');
}

// Only animate while the cards are on screen.
if (!reduceMotion) {
  new IntersectionObserver(([entry]) => {
    clearInterval(streamTimer);
    if (entry.isIntersecting) streamTimer = setInterval(spawnEmoji, 700);
  }).observe(stream);
  new IntersectionObserver(([entry]) => {
    clearInterval(boardTimer);
    if (entry.isIntersecting) boardTimer = setInterval(addPlay, 2200);
  }).observe(myPlays);
}
