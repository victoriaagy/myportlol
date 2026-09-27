/* ============================================================
   app.js — sign-in, pages, Spotify data, Messenger, moodboard
   All personal content comes from js/config.js
   ============================================================ */

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
};
const session = {
  get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  del(k) { try { sessionStorage.removeItem(k); } catch (e) { /* ignore */ } },
};
const LINKS = CONFIG.links;
const LINK_META = {
  linkedin: { label: 'LinkedIn', icon: 'in' },
  github: { label: 'GitHub', icon: 'GH' },
  email: { label: 'Email', icon: '@' },
  spotify: { label: 'Spotify', icon: '♫' },
  pinterest: { label: 'Pinterest', icon: 'P' },
  resume: { label: 'Résumé', icon: '📄' },
};
const activeLinks = () => Object.keys(LINK_META).filter((k) => LINKS[k]);
const linkHref = (k) => (k === 'email' ? `mailto:${LINKS.email}` : LINKS[k]);

let toastTimer = null;
function toast(html, ms = 3800) {
  const t = $('#toast');
  $('#toast-body').innerHTML = html;
  t.hidden = false;
  t.classList.remove('show');
  void t.offsetWidth;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.remove('show'); setTimeout(() => (t.hidden = true), 400); }, ms);
}
function shake(node, cls = 'shake') {
  node.classList.remove(cls);
  void node.offsetWidth;
  node.classList.add(cls);
}
function timeAgo(iso) {
  const mins = Math.round((Date.now() - new Date(iso)) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

/* ---------- photo, clocks ---------- */
$$('.js-profile-photo').forEach((img) => { img.src = CONFIG.profilePhoto; });

function tickClocks() {
  const now = new Date();
  $('#task-clock').textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  $('#timestamp').textContent = `${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}
tickClocks();
setInterval(tickClocks, 15000);
$('#year').textContent = new Date().getFullYear();

/* ============================================================
   STATUS (the visitor's Messenger status)
   ============================================================ */
const STATUS_TEXT = { available: 'Available', busy: 'Busy', away: 'Away', offline: 'Appear offline' };
let myStatus = store.get('status') || 'available';

function setStatus(status, remember = true) {
  myStatus = status;
  if (remember && $('#remember-me').checked) store.set('status', status);
  $$('.status-picker .status-dot').forEach((d) => (d.className = `status-dot ${status}`));
  $$('.status-picker .status-label').forEach((l) => (l.textContent = STATUS_TEXT[status]));
  $$('#login-screen .avatar-frame, .js-status-frame').forEach((f) => {
    f.className = f.className.replace(/status-\w+/, `status-${status}`);
  });
  $$('.js-status-paren').forEach((t) => (t.textContent = `(${STATUS_TEXT[status]})`));
}
function bindStatusMenu(button, menu) {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
    button.setAttribute('aria-expanded', String(!menu.hidden));
  });
  menu.addEventListener('click', (e) => {
    const li = e.target.closest('[data-status]');
    if (!li) return;
    setStatus(li.dataset.status);
    menu.hidden = true;
  });
  document.addEventListener('click', () => { menu.hidden = true; });
}
bindStatusMenu($('#status-picker'), $('#status-menu'));
bindStatusMenu($('#me-status-btn'), $('#me-status-menu'));
setStatus(myStatus, false);

/* ============================================================
   SPOTIFY DATA
   ============================================================ */
let music = { nowPlaying: null, recent: [], picks: [] };
let visitorTrack = null; // what the iPod is playing on this page
let visitorPlaying = false;

function parsePick(p) {
  const m = /track[/:]([A-Za-z0-9]+)/.exec(p.url || p.uri || '');
  return m ? { id: m[1], uri: `spotify:track:${m[1]}`, title: p.title, artist: p.artist, art: p.art || '', url: p.url } : null;
}

async function loadSpotify() {
  await null; // let the rest of app.js finish setting up first
  const picks = (CONFIG.spotify.picks || []).map(parsePick).filter(Boolean);
  let data = null;
  if (location.protocol.startsWith('http') && CONFIG.spotify.apiUrl) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6000);
      const res = await fetch(CONFIG.spotify.apiUrl, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok && (res.headers.get('content-type') || '').includes('json')) data = await res.json();
    } catch (e) { /* not deployed with the API yet: use picks or demo songs */ }
  }
  music = { nowPlaying: (data && data.nowPlaying) || null, recent: (data && data.recent) || [], picks };
  IPod.setLibrary(music);
  renderMusicBits();
}
const spotifyPromise = loadSpotify();

/** The track to feature: what Victoria is playing now, else her latest. */
function featuredTrack() {
  if (music.nowPlaying) return { t: music.nowPlaying, label: music.nowPlaying.isPlaying ? 'Victoria is listening now' : 'Victoria paused', live: music.nowPlaying.isPlaying };
  if (music.recent[0]) return { t: music.recent[0], label: `Victoria played this ${timeAgo(music.recent[0].playedAt)}` };
  if (music.picks[0]) return { t: music.picks[0], label: "Victoria's pick" };
  return null;
}

function renderMusicBits() {
  const f = featuredTrack();
  // login window "personal message"
  const loginNow = $('#login-now');
  if (f) { loginNow.hidden = false; loginNow.textContent = `♫ ${f.t.title} - ${f.t.artist}`; }
  // Messenger ad + Victoria's buddy line
  $('#ad-big').textContent = f && f.live ? 'LISTENING NOW' : 'RECENTLY PLAYED';
  renderBuddies();
  renderNowCard();
  renderArtists();
  buildHeadlines();
}

function renderNowCard() {
  const art = $('#now-art');
  let t;
  let label;
  let live = false;
  if (visitorTrack) {
    t = visitorTrack;
    label = visitorPlaying ? 'Now playing on this page' : 'Paused';
  } else {
    const f = featuredTrack();
    if (f) ({ t, label, live } = f);
  }
  if (!t) {
    const first = IPod.tracks[0];
    $('#now-label').textContent = "On Victoria's iPod";
    $('#now-title').textContent = first ? first.title : 'Open the iPod to start listening';
    $('#now-artist').textContent = first ? `${first.artist} · connect Spotify to show real listening` : '';
    art.innerHTML = '<span>♫</span>';
  } else {
    $('#now-label').innerHTML = `${live ? '<i class="live-dot"></i>' : ''}${esc(label)}`;
    $('#now-title').textContent = t.title;
    $('#now-artist').textContent = t.artist;
    art.innerHTML = t.art ? `<img src="${esc(t.art)}" alt="">` : '<span>♫</span>';
  }
  $('#now-play').textContent = visitorTrack && visitorPlaying ? 'Pause' : 'Play';
}
$('#now-play').addEventListener('click', () => {
  if (visitorTrack) { IPod.togglePlay(); return; }
  const f = featuredTrack();
  if (f) IPod.playUri(f.t.uri); else IPod.play(0);
});

function renderArtists() {
  const html = CONFIG.favoriteArtists.map((a) => {
    const href = a.url || `https://open.spotify.com/search/${encodeURIComponent(a.name)}`;
    const inLibrary = IPod.tracks.some((t) => t.kind === 'spotify' && t.artist.toLowerCase().includes(a.name.toLowerCase()));
    return `<span class="artist-chip">
        <a href="${esc(href)}" target="_blank" rel="noopener">${esc(a.name)}</a>
        ${inLibrary ? `<button class="artist-play" data-artist="${esc(a.name)}" aria-label="Play ${esc(a.name)} on the iPod">▶</button>` : ''}
      </span>`;
  }).join('');
  $$('.artist-row').forEach((row) => (row.innerHTML = `<span class="artist-label">Favorite artists</span>${html}`));
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('.artist-play');
  if (!b) return;
  const name = b.dataset.artist.toLowerCase();
  const i = IPod.tracks.findIndex((t) => t.artist.toLowerCase().includes(name));
  if (i >= 0) { IPod.play(i); showPage('ipod'); }
});

IPod.init({
  onChange(track, playing) {
    visitorTrack = track;
    visitorPlaying = playing;
    const psm = $('#me-psm');
    if (track && playing) { psm.textContent = `♫ ${track.title} - ${track.artist}`; psm.classList.add('music'); }
    else { psm.textContent = document.body.classList.contains('nap') ? '💤 Napping' : "Viewing Victoria's portfolio"; psm.classList.remove('music'); }
    renderNowCard();
    const np = $('#profile-soundtrack');
    if (np) np.textContent = track ? `${track.title} - ${track.artist}${playing ? '' : ' (paused)'}` : 'Nothing playing';
  },
});

/* ============================================================
   SIGN IN
   ============================================================ */
const loginScreen = $('#login-screen');
const loginWindow = $('#login-window');
const site = $('#site');
let signInTimer = null;

function toggleLoginWindow(show) {
  loginWindow.classList.toggle('minimized', !show);
  $('#task-messenger').classList.toggle('active', show);
}
$('#login-min').addEventListener('click', () => toggleLoginWindow(false));
$('#login-close').addEventListener('click', () => toggleLoginWindow(false));
$('#login-max').addEventListener('click', () => loginWindow.classList.toggle('maximized'));
$('#task-messenger').addEventListener('click', () => toggleLoginWindow(loginWindow.classList.contains('minimized')));
toggleLoginWindow(true);

$('#auto-signin').checked = store.get('autoSignin') === '1';
$('#auto-signin').addEventListener('change', (e) => (e.target.checked ? store.set('autoSignin', '1') : store.del('autoSignin')));
$('#remember-me').addEventListener('change', (e) => { if (!e.target.checked) store.del('status'); else store.set('status', myStatus); });

function startSignIn() {
  $('#login-form-view').hidden = true;
  $('#login-loading-view').hidden = false;
  const steps = ['Signing in...', 'Loading portfolio...', 'Syncing Spotify...'];
  let i = 0;
  $('#loading-text').textContent = steps[0];
  signInTimer = setInterval(() => {
    i = Math.min(i + 1, steps.length - 1);
    $('#loading-text').textContent = steps[i];
  }, 600);
  const minWait = new Promise((r) => setTimeout(r, 1800));
  Promise.all([minWait, spotifyPromise]).then(() => {
    if ($('#login-loading-view').hidden) return; // cancelled
    clearInterval(signInTimer);
    enterSite(true);
  });
}
$('#login-form').addEventListener('submit', (e) => { e.preventDefault(); startSignIn(); });
$('#cancel-signin').addEventListener('click', () => {
  clearInterval(signInTimer);
  $('#login-loading-view').hidden = true;
  $('#login-form-view').hidden = false;
});

function enterSite(animate) {
  session.set('signedIn', '1');
  if (animate) {
    Sfx.signIn();
    loginScreen.classList.add('leaving');
    setTimeout(() => { loginScreen.hidden = true; loginScreen.classList.remove('leaving'); }, 600);
  } else {
    loginScreen.hidden = true;
  }
  site.hidden = false;
  showPage(location.hash.slice(1) || 'home', false);
  if (window.innerWidth >= 1380) openBuddy(); else $('#buddy-tab').hidden = false;
  const f = featuredTrack();
  setTimeout(() => toast(`<b>Victoria Agyare</b> is online.${f ? `<br><span class="toast-psm">♫ ${esc(f.t.title)} - ${esc(f.t.artist)}</span>` : ''}`), animate ? 700 : 200);
  IPod.warmUp();
}

$('#sign-out').addEventListener('click', () => {
  session.del('signedIn');
  IPod.pause();
  site.hidden = true;
  $('#buddy-window').hidden = true;
  $('#chat-window').hidden = true;
  loginScreen.hidden = false;
  toggleLoginWindow(true);
  $('#login-loading-view').hidden = true;
  $('#login-form-view').hidden = false;
  window.scrollTo(0, 0);
});

/* ============================================================
   ROUTER
   ============================================================ */
const PAGES = ['home', 'about', 'experience', 'projects', 'ipod', 'pins', 'anime', 'contact'];
const PAGE_NAMES = { home: 'Home', about: 'About', experience: 'Experience', projects: 'Projects', ipod: 'iPod', pins: 'Pins', anime: 'Anime', contact: 'Contact' };

function showPage(name, scroll = true) {
  if (!PAGES.includes(name)) name = 'home';
  $$('.page').forEach((p) => (p.hidden = p.dataset.page !== name));
  $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.page === name));
  if (location.hash.slice(1) !== name) history.replaceState(null, '', `#${name}`);
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  if (name === 'ipod') setTimeout(() => $('#ipod').focus({ preventScroll: true }), 50);
}
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-page]');
  if (!link || link.classList.contains('page')) return;
  e.preventDefault();
  showPage(link.dataset.page);
});
window.addEventListener('hashchange', () => { if (!site.hidden) showPage(location.hash.slice(1)); });

$('#sitemap').innerHTML = PAGES.map((p) => `<a href="#${p}" data-page="${p}">${PAGE_NAMES[p]}</a>`).join(' | ');

/* ---------- hot news ---------- */
let headlines = [];
let headlineIdx = 0;
function buildHeadlines() {
  const f = featuredTrack();
  headlines = [
    { text: '1st place: Quest wins the Cox track at the hackathon.', page: 'projects' },
    { text: 'Victoria completes the SEO Tech Developer program, Summer 2026.', page: 'experience' },
    ...(f ? [{ text: `${f.live ? 'Now playing' : 'Recently played'}: ${f.t.title} by ${f.t.artist}.`, page: 'ipod' }] : []),
    { text: 'Selected as an MLT Career Prep Tech Fellow.', page: 'experience' },
    { text: 'New builds: Kindred and Groundtruth.', page: 'projects' },
    { text: 'Programming Club at GSU: now on the executive board.', page: 'experience' },
  ];
}
function nextHeadline() {
  if (!headlines.length) buildHeadlines();
  const el = $('#hotnews-text');
  const h = headlines[headlineIdx++ % headlines.length];
  el.textContent = h.text;
  el.dataset.page = h.page;
  shake(el, 'fade');
}
buildHeadlines();
nextHeadline();
setInterval(nextHeadline, 5000);

/* ============================================================
   ABOUT
   ============================================================ */
const orbit = $('#orbit');
CONFIG.hobbies.slice(0, 6).forEach((h, i) => {
  const b = document.createElement('button');
  b.className = `orbit-item o${i + 1}`;
  b.innerHTML = `<span class="o-icon">${h.icon}</span>${esc(h.label)}`;
  b.addEventListener('click', () => {
    $$('.orbit-item').forEach((o) => o.classList.toggle('picked', o === b));
    const bubble = $('#fact-bubble');
    bubble.textContent = h.text;
    shake(bubble, 'pop');
  });
  orbit.append(b);
});

function renderProfiler() {
  const edu = [
    ['School', CONFIG.school],
    ['Degree', CONFIG.degree],
    ['Graduation', CONFIG.gradDate],
    ...(CONFIG.gpa ? [['GPA', CONFIG.gpa]] : []),
    ['Location', CONFIG.location],
  ];
  const row = ([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`;
  let html = `<details open><summary>Education</summary><table class="specs">${edu.map(row).join('')}</table></details>`;
  Object.entries(CONFIG.skills).forEach(([cat, list]) => {
    html += `<details><summary>${esc(cat)} <small>(${list.length})</small></summary>
      <div class="skill-chips">${list.map((s) => `<button class="skill-chip" data-skill="${esc(s)}">${esc(s)}</button>`).join('')}</div></details>`;
  });
  html += `<details><summary>Right now</summary><table class="specs">
      <tr><th>Soundtrack</th><td id="profile-soundtrack">Nothing playing</td></tr>
      <tr><th>Watching</th><td>${esc((CONFIG.anime.find((a) => a.status === 'Watching') || CONFIG.anime[0]).title)}</td></tr>
    </table></details>`;
  $('#profiler').innerHTML = html;
}
renderProfiler();
// clicking a skill jumps to projects that use it
$('#profiler').addEventListener('click', (e) => {
  const chip = e.target.closest('.skill-chip');
  if (!chip) return;
  const skill = chip.dataset.skill;
  const used = CONFIG.projects.some((p) => p.tags.includes(skill));
  if (used) { setProjectFilter(skill); showPage('projects'); }
  else { shake(chip); toast(`${esc(skill)}: used in coursework and my SEO internship.`); }
});

/* ============================================================
   EXPERIENCE (Finder window)
   ============================================================ */
let expIndex = 0;
function renderExperience() {
  const side = $('#finder-side');
  side.innerHTML = CONFIG.experience.map((x, i) =>
    `<li><button role="tab" aria-selected="${i === expIndex}" class="${i === expIndex ? 'sel' : ''}" data-i="${i}">
      <span class="f-icon">${x.icon}</span><span>${esc(x.short)}</span></button></li>`).join('');
  const x = CONFIG.experience[expIndex];
  $('#finder-title').textContent = x.short;
  let html = `<div class="exp-head"><span class="exp-icon">${x.icon}</span><div>
      <h2>${esc(x.org)}</h2><p class="exp-role">${esc(x.role)}</p><p class="exp-dates">${esc(x.dates)}</p></div></div>
      <ul class="exp-bullets">${x.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`;
  if (x.gallery && x.gallery.photos.length) {
    html += `<h3 class="gallery-title">📷 ${esc(x.gallery.title)}</h3><div class="gallery">${x.gallery.photos.map((p, i) =>
      `<button class="photo" data-i="${i}">${p.src ? `<img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy">` : '<span class="photo-ph"></span>'}
        <span class="photo-cap">${esc(p.caption)}</span></button>`).join('')}</div>`;
  }
  $('#finder-pane').innerHTML = html;
}
$('#finder-side').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-i]');
  if (!b) return;
  expIndex = Number(b.dataset.i);
  renderExperience();
});
$('#finder-side').addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  e.preventDefault();
  expIndex = (expIndex + (e.key === 'ArrowDown' ? 1 : -1) + CONFIG.experience.length) % CONFIG.experience.length;
  renderExperience();
  $(`#finder-side button[data-i="${expIndex}"]`).focus();
});
$('#finder-pane').addEventListener('click', (e) => {
  const p = e.target.closest('.photo');
  if (!p) return;
  const photos = CONFIG.experience[expIndex].gallery.photos;
  Lightbox.open(photos.map((ph) => ({ src: ph.src, caption: ph.caption, colors: ['#1d2a3a', '#c9a86a'] })), Number(p.dataset.i));
});
renderExperience();

/* ============================================================
   PROJECTS
   ============================================================ */
let projectFilter = 'All';
function setProjectFilter(tag) {
  projectFilter = tag;
  renderProjects();
}
function renderProjects() {
  const counts = {};
  CONFIG.projects.forEach((p) => p.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
  // show technologies shared by 2+ projects; any tag on a card can still be clicked
  const common = Object.keys(counts).filter((t) => counts[t] > 1).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  const tags = ['All', ...common, ...(projectFilter !== 'All' && !common.includes(projectFilter) ? [projectFilter] : [])];
  $('#project-filters').innerHTML = tags.map((t) =>
    `<button class="chip${t === projectFilter ? ' on' : ''}" data-tag="${esc(t)}">${esc(t)}</button>`).join('');
  $('#project-grid').innerHTML = CONFIG.projects.map((p, i) => {
    const show = projectFilter === 'All' || p.tags.includes(projectFilter);
    return `<article class="product${show ? '' : ' dim'}" data-i="${i}">
      <div class="product-art ${esc(p.art)}"><span class="garamond">${esc(p.name)}</span>${p.badge ? `<span class="ribbon">${esc(p.badge)}</span>` : ''}</div>
      <p class="product-date">${esc(p.date)}</p>
      <p class="product-sum">${esc(p.summary)}</p>
      <ul class="product-more" hidden>${p.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      <p class="tags">${p.tags.map((t) => `<button data-tag="${esc(t)}">${esc(t)}</button>`).join('')}</p>
      <div class="product-actions">
        <button class="aqua-btn js-more" aria-expanded="false">Details</button>
        ${p.link ? `<a class="aqua-btn aqua-blue" href="${esc(p.link)}" target="_blank" rel="noopener">View</a>` : ''}
      </div>
    </article>`;
  }).join('');
}
document.addEventListener('click', (e) => {
  const tagBtn = e.target.closest('#project-filters [data-tag], #project-grid .tags [data-tag]');
  if (tagBtn) { setProjectFilter(tagBtn.dataset.tag === projectFilter ? 'All' : tagBtn.dataset.tag); return; }
  const more = e.target.closest('.js-more');
  if (more) {
    const card = more.closest('.product');
    const list = $('.product-more', card);
    list.hidden = !list.hidden;
    more.textContent = list.hidden ? 'Details' : 'Less';
    more.setAttribute('aria-expanded', String(!list.hidden));
    card.classList.toggle('open', !list.hidden);
  }
});
renderProjects();

/* ============================================================
   PINS (moodboard)
   ============================================================ */
let board = 'All';
let pinOrder = CONFIG.pins.map((_, i) => i);
let saved = new Set();
try { saved = new Set(JSON.parse(store.get('savedPins') || '[]')); } catch (e) { /* ignore */ }

function renderPins() {
  $('#board-filters').innerHTML = ['All', ...CONFIG.boards, 'Saved'].map((b) =>
    `<button class="chip${b === board ? ' on' : ''}" data-board="${esc(b)}">${esc(b)}</button>`).join('');
  const visible = pinOrder.filter((i) => {
    const p = CONFIG.pins[i];
    return board === 'All' || (board === 'Saved' ? saved.has(p.title) : p.board === board);
  });
  $('#masonry').innerHTML = visible.length ? visible.map((i) => {
    const p = CONFIG.pins[i];
    const media = p.src
      ? `<img src="${esc(p.src)}" alt="${esc(p.title)}" loading="lazy">`
      : `<span class="pin-tile" style="height:${p.h || 240}px;background:linear-gradient(160deg,${p.colors[0]},${p.colors[1]})"></span>`;
    return `<figure class="pin" data-i="${i}">
      <button class="pin-open" aria-label="Open ${esc(p.title)}">${media}</button>
      <button class="pin-save${saved.has(p.title) ? ' on' : ''}" aria-label="Save ${esc(p.title)}" aria-pressed="${saved.has(p.title)}">♥</button>
      <figcaption>${esc(p.title)}<small>${esc(p.board)}</small></figcaption>
    </figure>`;
  }).join('') : '<p class="empty">Nothing saved yet. Tap ♥ on a pin to save it.</p>';
  $('#saved-count').textContent = saved.size ? `${saved.size} saved` : '';
}
$('#board-filters').addEventListener('click', (e) => {
  const b = e.target.closest('[data-board]');
  if (b) { board = b.dataset.board; renderPins(); }
});
$('#masonry').addEventListener('click', (e) => {
  const fig = e.target.closest('.pin');
  if (!fig) return;
  const i = Number(fig.dataset.i);
  const p = CONFIG.pins[i];
  if (e.target.closest('.pin-save')) {
    saved.has(p.title) ? saved.delete(p.title) : saved.add(p.title);
    store.set('savedPins', JSON.stringify([...saved]));
    renderPins();
    return;
  }
  const list = $$('.pin', $('#masonry')).map((f) => CONFIG.pins[Number(f.dataset.i)]);
  Lightbox.open(list.map((q) => ({ src: q.src, caption: `${q.title} · ${q.board}`, colors: q.colors })), list.indexOf(p));
});
$('#pins-shuffle').addEventListener('click', () => {
  for (let i = pinOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pinOrder[i], pinOrder[j]] = [pinOrder[j], pinOrder[i]];
  }
  renderPins();
  $$('.pin').forEach((p, i) => { p.style.animationDelay = `${i * 30}ms`; p.classList.add('drop'); });
});
if (LINKS.pinterest) { $('#pinterest-link').href = LINKS.pinterest; $('#pinterest-link').hidden = false; }
renderPins();

/* ---------- lightbox ---------- */
const Lightbox = (() => {
  let items = [];
  let idx = 0;
  const box = $('#lightbox');
  function show() {
    const it = items[idx];
    $('#lb-media').innerHTML = it.src
      ? `<img src="${esc(it.src)}" alt="${esc(it.caption)}">`
      : `<span class="lb-ph" style="background:linear-gradient(160deg,${it.colors[0]},${it.colors[1]})"></span>`;
    $('#lb-caption').textContent = `${it.caption}  (${idx + 1}/${items.length})`;
  }
  function open(list, i) { items = list; idx = Math.max(0, i); box.hidden = false; show(); $('#lb-close').focus(); }
  function close() { box.hidden = true; }
  function step(d) { idx = (idx + d + items.length) % items.length; show(); }
  $('#lb-close').addEventListener('click', close);
  $('#lb-prev').addEventListener('click', () => step(-1));
  $('#lb-next').addEventListener('click', () => step(1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  return { open };
})();

/* ============================================================
   ANIME
   ============================================================ */
$('#anime-grid').innerHTML = CONFIG.anime.map((a) => {
  const emblem = {
    aot: '<span class="icard-emblem aot-emblem" aria-hidden="true"><span></span><span></span></span>',
    dn: '<span class="icard-emblem dn-emblem" aria-hidden="true">DEATH<br>NOTE</span>',
    jjk: '<span class="icard-emblem jjk-emblem" aria-hidden="true"><span></span></span>',
  }[a.theme] || '<span class="icard-emblem"></span>';
  return `<button class="icard" data-theme="${esc(a.theme)}" aria-label="${esc(a.title)}: flip for details">
    <span class="icard-inner">
      <span class="icard-front">${emblem}
        <span class="garamond icard-title">${esc(a.title)}</span>
        <span class="icard-tag">${esc(a.tag)}</span>
      </span>
      <span class="icard-back">
        <span class="icard-row"><b>Status</b> ${esc(a.status)}</span>
        ${a.facts.map((f) => `<span class="icard-row">${esc(f)}</span>`).join('')}
        ${a.favorite ? `<span class="icard-row"><b>Favorite character</b> ${esc(a.favorite)}</span>` : ''}
        ${a.note ? `<span class="icard-quote">${esc(a.note)}</span>` : ''}
      </span>
    </span>
  </button>`;
}).join('');
$('#anime-grid').addEventListener('click', (e) => {
  const c = e.target.closest('.icard');
  if (c) c.classList.toggle('flipped');
});

/* ============================================================
   CONTACT + LINKS
   ============================================================ */
function mailto(subject, body) {
  if (!LINKS.email) return false;
  location.href = `mailto:${LINKS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return true;
}
$('#contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  mailto($('#c-subject').value, `${$('#c-msg').value}\n\n- ${$('#c-name').value}`);
});

$('#link-list').innerHTML = activeLinks().map((k) =>
  `<li><a href="${esc(linkHref(k))}" ${k === 'email' ? '' : 'target="_blank" rel="noopener"'}>${LINK_META[k].label}</a>${k === 'email' ? ` <small>${esc(LINKS.email)}</small>` : ''}</li>`).join('');
$('#world-select').insertAdjacentHTML('beforeend', activeLinks().map((k) => `<option value="${k}">${LINK_META[k].label}</option>`).join(''));
$('#world-select').addEventListener('change', (e) => {
  const k = e.target.value;
  e.target.value = '';
  if (!k) return;
  if (k === 'email') location.href = linkHref(k); else window.open(linkHref(k), '_blank', 'noopener');
});

/* ---------- search ---------- */
$('#site-search').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $('#search-input').value.toLowerCase().trim();
  if (!q) return;
  const skill = Object.values(CONFIG.skills).flat().concat(CONFIG.projects.flatMap((p) => p.tags))
    .find((s) => s.toLowerCase() === q);
  if (skill && CONFIG.projects.some((p) => p.tags.includes(skill))) { setProjectFilter(skill); showPage('projects'); return; }
  const project = CONFIG.projects.find((p) => p.name.toLowerCase().includes(q));
  if (project) { setProjectFilter('All'); showPage('projects'); return; }
  const map = [
    [/resume|résumé|cv/, LINKS.resume ? 'resume' : 'experience'],
    [/experience|intern|seo|mlt|nyc|rise|club|job|work/, 'experience'],
    [/music|ipod|song|spotify|listen|marías|marias|radiohead|malcolm/, 'ipod'],
    [/pin|pinterest|mood|fit|vinted|outfit/, 'pins'],
    [/anime|titan|aot|death note|jujutsu|jjk/, 'anime'],
    [/project|hackathon|quest|kindred|groundtruth|code|build/, 'projects'],
    [/gsu|georgia|school|about|2028|skill|gpa|victoria/, 'about'],
    [/contact|email|hire|linkedin|github/, 'contact'],
  ];
  const hit = map.find(([re]) => re.test(q));
  if (!hit) { toast(`No results for "${esc(q)}". Try: projects, experience, music, anime.`); return; }
  if (hit[1] === 'resume') window.open(LINKS.resume, '_blank', 'noopener');
  else showPage(hit[1]);
});

/* ============================================================
   MESSENGER: buddy list + conversation
   ============================================================ */
const buddyWindow = $('#buddy-window');
const collapsed = new Set();

function renderBuddies() {
  const f = featuredTrack();
  const vPsm = f ? `♫ ${f.t.title} - ${f.t.artist}` : `${CONFIG.degree} · ${CONFIG.school}`;
  const groups = [
    { name: 'Victoria (1/1)', key: 'v', rows: [{ kind: 'chat', name: 'Victoria Agyare', psm: vPsm, status: 'available' }] },
    { name: `Find Victoria (${activeLinks().length})`, key: 'links', rows: activeLinks().map((k) => ({ kind: 'link', key: k, name: LINK_META[k].label, psm: k === 'email' ? LINKS.email : '' })) },
  ];
  const box = $('#buddy-list');
  box.innerHTML = '';
  groups.forEach((g) => {
    const head = document.createElement('button');
    head.className = `buddy-group${collapsed.has(g.key) ? ' collapsed' : ''}`;
    head.textContent = g.name;
    head.addEventListener('click', () => { collapsed.has(g.key) ? collapsed.delete(g.key) : collapsed.add(g.key); renderBuddies(); });
    box.append(head);
    if (collapsed.has(g.key)) return;
    g.rows.forEach((r) => {
      const row = document.createElement(r.kind === 'link' ? 'a' : 'button');
      row.className = 'buddy-row';
      if (r.kind === 'link') {
        row.href = linkHref(r.key);
        if (r.key !== 'email') { row.target = '_blank'; row.rel = 'noopener'; }
        row.innerHTML = `<span class="link-icon">${LINK_META[r.key].icon}</span><span class="buddy-name"></span><span class="buddy-psm"></span>`;
      } else {
        row.innerHTML = '<span class="status-dot available"></span><span class="buddy-name"></span><span class="buddy-psm"></span>';
        row.addEventListener('click', openChat);
      }
      row.querySelector('.buddy-name').textContent = r.name;
      row.querySelector('.buddy-psm').textContent = r.psm ? ` - ${r.psm}` : '';
      box.append(row);
    });
  });
}

function openBuddy() { buddyWindow.hidden = false; $('#buddy-tab').hidden = true; }
function closeBuddy() { buddyWindow.hidden = true; $('#buddy-tab').hidden = false; }
$('#open-messenger').addEventListener('click', () => (buddyWindow.hidden ? openBuddy() : closeBuddy()));
$('#buddy-tab').addEventListener('click', openBuddy);
$('#buddy-min').addEventListener('click', closeBuddy);
$('#buddy-close').addEventListener('click', closeBuddy);

const chatWindow = $('#chat-window');
function addLine(who, text, cls = '') {
  const log = $('#chat-log');
  const p = document.createElement('div');
  p.className = `chat-line ${cls}`;
  if (who) {
    const b = document.createElement('div');
    b.className = 'chat-who';
    b.textContent = `${who} says:`;
    p.append(b);
  }
  const t = document.createElement('div');
  t.className = 'chat-text';
  t.textContent = text;
  p.append(t);
  log.append(p);
  log.scrollTop = log.scrollHeight;
}
function openChat() {
  const f = featuredTrack();
  $('#chat-psm').textContent = f ? `♫ ${f.t.title} - ${f.t.artist}` : `${CONFIG.degree} · ${CONFIG.school}`;
  if (!$('#chat-log').children.length) {
    addLine('', 'Write Victoria a message. When you press Send, it opens in your email app so she gets it directly.', 'system');
  }
  chatWindow.hidden = false;
  $('#chat-text').focus();
}
$('#chat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const v = $('#chat-text').value.trim();
  if (!v) return;
  addLine('You', v, 'me');
  $('#chat-text').value = '';
  Sfx.message();
  if (mailto('Hi Victoria! (from your portfolio)', v)) addLine('', 'Opening your email app...', 'system');
});
$('#chat-text').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#chat-form').requestSubmit(); }
});
$('#chat-nudge').addEventListener('click', () => {
  addLine('', 'You have just sent a nudge.', 'system');
  Sfx.nudge();
  shake(chatWindow, 'nudge');
});
$('#chat-wink').addEventListener('click', () => {
  const winks = ['🌸', '🎧', '💿', '✨', '🦋'];
  const w = winks[Math.floor(Math.random() * winks.length)];
  addLine('', `You sent a wink: ${w}`, 'system');
  const big = document.createElement('div');
  big.className = 'wink-burst';
  big.textContent = w;
  chatWindow.append(big);
  setTimeout(() => big.remove(), 1600);
});
$('#chat-close').addEventListener('click', () => { chatWindow.hidden = true; });

/* ---------- draggable windows ---------- */
$$('[data-drag]').forEach((bar) => {
  const win = document.getElementById(bar.dataset.drag);
  let sx, sy, ox, oy, dragging = false;
  bar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || window.innerWidth <= 700) return;
    dragging = true;
    const r = win.getBoundingClientRect();
    sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top;
    bar.setPointerCapture(e.pointerId);
  });
  bar.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    win.style.left = `${Math.max(0, Math.min(window.innerWidth - 80, ox + e.clientX - sx))}px`;
    win.style.top = `${Math.max(0, Math.min(window.innerHeight - 40, oy + e.clientY - sy))}px`;
    win.style.right = 'auto';
    win.style.bottom = 'auto';
  });
  bar.addEventListener('pointerup', () => { dragging = false; });
});

/* ============================================================
   NAP MODE (night theme)
   ============================================================ */
let statusBeforeNap = null;
function setNap(on, announce = true) {
  document.body.classList.toggle('nap', on);
  $('#nap-toggle').setAttribute('aria-pressed', String(on));
  $('#nap-toggle').textContent = on ? '☀ Wake up' : '☾ Nap mode';
  if (on) { statusBeforeNap = myStatus; setStatus('away', false); }
  else if (statusBeforeNap) { setStatus(statusBeforeNap, false); statusBeforeNap = null; }
  if (!visitorPlaying) $('#me-psm').textContent = on ? '💤 Napping' : "Viewing Victoria's portfolio";
  on ? store.set('nap', '1') : store.del('nap');
  if (announce) toast(on ? 'Nap mode on. Your status is set to Away.' : 'Welcome back. Your status is Available again.', 2500);
}
$('#nap-toggle').addEventListener('click', () => setNap(!document.body.classList.contains('nap')));
if (store.get('nap')) setNap(true, false);

/* ---------- restore session / auto sign-in ---------- */
if (session.get('signedIn')) enterSite(false);
else if (store.get('autoSignin') === '1') startSignIn();
