/* ============================================================
   app.js — sign-in flow, page router, Messenger buddy list & chat
   ============================================================ */

/* ✎ YOUR STUFF — edit these */
const PROFILE_PHOTO = 'assets/profile.svg'; // e.g. 'assets/profile.jpg' once you add your photo
const SOCIAL_LINKS = {
  linkedin: '', // e.g. 'https://www.linkedin.com/in/your-handle'
  github: '',   // e.g. 'https://github.com/your-handle'
  email: '',    // e.g. 'you@example.com'
  resume: '',   // e.g. 'assets/resume.pdf'
};

const HEADLINES = [
  'Victoria Agyare named Georgia State Class of 2028.',
  'iPod now shipping: original chiptunes preloaded.',
  'Local student survives Attack on Titan finale, still emotional.',
  'L confirms: 97% chance you should hire Victoria.',
  'Gojo reviews portfolio: "Honestly? Pretty strong."',
  'New projects coming soon to Made4Victoria.',
];

const CONTACTS = [
  { group: 'Survey Corps', name: 'Eren Yeager', status: 'busy', icon: '⚔️', psm: 'Tatakae. Tatakae.',
    replies: ["I'll keep moving forward. You should check Victoria's projects tab.", 'Have you listened to "Wall Maria Sunset" on her iPod? It goes hard.', 'Freedom is... a good portfolio.', "Busy right now. Fighting. You know how it is."] },
  { group: 'Survey Corps', name: 'Levi', status: 'away', icon: '🧹', psm: 'cleaning. do not disturb.',
    replies: ['Tch. This site is surprisingly clean.', "Give it your best and don't regret it. That goes for your internship offer to Victoria.", "I'm away. Try again after I finish dusting."] },
  { group: 'Survey Corps', name: 'Armin Arlert', status: 'available', icon: '🌊', psm: 'thinking about the ocean',
    replies: ["I did the math. Victoria is a strong hire.", 'Someday I want to see the ocean. Today I want to see the Anime tab.', 'Did you try spinning the iPod wheel? It really works!'] },
  { group: 'Task Force', name: 'L', status: 'available', icon: '🍰', psm: 'probability you hire Victoria: 97%',
    replies: ['The probability that you enjoy this site is currently 97%.', 'I am sitting like this because it improves my reasoning ability by 40%.', 'May I have some cake? ...Also, have you seen her projects?', "I've reviewed the evidence. Victoria graduates May 2028."] },
  { group: 'Task Force', name: 'Ryuk', status: 'available', icon: '🍎', psm: 'this site has SO many apples',
    replies: ['Hyuk hyuk. Humans are so interesting.', 'Got any apples? This whole site looks like an apple store.', "I'm just here to watch. And eat apples."] },
  { group: 'Task Force', name: 'Light Yagami', status: 'offline', icon: '📓', psm: 'just as planned',
    replies: ['...', 'Everything is going according to plan.'] },
  { group: 'Jujutsu High', name: 'Gojo Satoru', status: 'available', icon: '🕶️', psm: 'the strongest (it me)',
    replies: ["Don't worry, I'm the strongest. But Victoria's portfolio is a close second.", 'Domain Expansion: Infinite Scroll.', 'Nah, I\'d hire.', 'Have you tried nudging someone? It\'s very fun.'] },
  { group: 'Jujutsu High', name: 'Itadori Yuji', status: 'available', icon: '🍜', psm: 'movie night anyone??',
    replies: ["Yo!! This site is so cool.", 'Want to watch a movie after? I\'ll bring snacks.', 'Victoria has great music taste btw.'] },
  { group: 'Jujutsu High', name: 'Nobara Kugisaki', status: 'busy', icon: '🔨', psm: 'shopping in Tokyo, brb',
    replies: ['Cute site. Very my aesthetic.', "Busy. Unless you're offering to go shopping."] },
  { group: 'Georgia State', name: 'Pounce', status: 'available', icon: '🐾', psm: 'Go Panthers! 🐾',
    replies: ['ROAR! Go Panthers!', 'Victoria is repping GSU until May 2028 and beyond.', 'Downtown Atlanta says hi.'] },
];

const STATUS_TEXT = { available: 'Available', busy: 'Busy', away: 'Away', offline: 'Appear offline' };

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
};
const session = {
  get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  del(k) { try { sessionStorage.removeItem(k); } catch (e) { /* ignore */ } },
};

let myStatus = 'available';
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

function shake(node) {
  node.classList.remove('shake');
  void node.offsetWidth;
  node.classList.add('shake');
}

/* ---------- profile photo ---------- */
$$('.js-profile-photo').forEach((img) => {
  img.src = PROFILE_PHOTO;
  img.addEventListener('error', () => { if (!img.src.endsWith('profile.svg')) img.src = 'assets/profile.svg'; }, { once: true });
});

/* ---------- clocks ---------- */
function tickClocks() {
  const now = new Date();
  $('#task-clock').textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const ts = $('#timestamp');
  if (ts) {
    ts.textContent = `${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }
}
tickClocks();
setInterval(tickClocks, 15000);
$('#year').textContent = new Date().getFullYear();

/* ---------- toasts on [data-toast] links ---------- */
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-toast]');
  if (!a) return;
  e.preventDefault();
  toast(a.dataset.toast);
});

/* ---------- status (shared by login + buddy list) ---------- */
function setStatus(status) {
  myStatus = status;
  $$('.status-picker .status-dot').forEach((d) => (d.className = `status-dot ${status}`));
  $$('.status-picker .status-label').forEach((l) => (l.textContent = STATUS_TEXT[status]));
  $$('.avatar-frame').forEach((f) => {
    if (f.closest('.chat-window')) return;
    f.className = f.className.replace(/status-\w+/, `status-${status}`);
  });
  $$('.js-status-dot').forEach((d) => (d.className = `status-dot ${status} js-status-dot`));
  $$('.js-status-text').forEach((t) => (t.textContent = STATUS_TEXT[status]));
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

/* ============================================================
   SIGN IN
   ============================================================ */
const loginScreen = $('#login-screen');
const loginWindow = $('#login-window');
const site = $('#site');
let signInTimer = null;

$$('#login-window [data-joke]').forEach((b) => b.addEventListener('click', () => {
  const msg = { min: "Can't minimize. The portfolio is too good.", max: 'Already at maximum cuteness.', close: 'Nice try! Sign in to see the portfolio ✿' }[b.dataset.joke];
  Sfx.error();
  shake(loginWindow);
  toast(msg);
}));

$('#login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!$('#login-pass').value) {
    Sfx.error();
    shake(loginWindow);
    toast('Type any password. Seriously, anything works.');
    return;
  }
  $('#login-form-view').hidden = true;
  $('#login-loading-view').hidden = false;
  const steps = ['Signing in...', 'Loading portfolio...', 'Charging the iPod...', 'Almost there...'];
  let i = 0;
  $('#loading-text').textContent = steps[0];
  signInTimer = setInterval(() => {
    i++;
    if (i < steps.length) { $('#loading-text').textContent = steps[i]; return; }
    clearInterval(signInTimer);
    enterSite(true);
  }, 650);
});

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
  setTimeout(() => toast(`<b>Victoria Agyare</b> has just signed in.<br><span class="toast-psm">Welcome to my portfolio ✿</span>`), animate ? 700 : 200);
  IPod.warmUp();
}

$('#sign-out').addEventListener('click', (e) => {
  e.preventDefault();
  session.del('signedIn');
  IPod.pause();
  site.hidden = true;
  $('#buddy-window').hidden = true;
  $('#chat-window').hidden = true;
  loginScreen.hidden = false;
  $('#login-loading-view').hidden = true;
  $('#login-form-view').hidden = false;
  window.scrollTo(0, 0);
});

/* ============================================================
   ROUTER (tabs)
   ============================================================ */
const PAGES = ['home', 'about', 'projects', 'ipod', 'anime', 'contact'];

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
  if (!link || link.closest('.page-exempt')) return;
  e.preventDefault();
  showPage(link.dataset.page);
});
window.addEventListener('hashchange', () => { if (!site.hidden) showPage(location.hash.slice(1)); });

/* ---------- hot news ticker ---------- */
let headline = 0;
function nextHeadline() {
  const el = $('#hotnews-text');
  el.classList.remove('fade');
  void el.offsetWidth;
  el.textContent = HEADLINES[headline++ % HEADLINES.length];
  el.classList.add('fade');
}
nextHeadline();
setInterval(nextHeadline, 4500);

/* ---------- about: orbit facts ---------- */
$$('.orbit-item').forEach((b) => b.addEventListener('click', () => {
  $$('.orbit-item').forEach((o) => o.classList.toggle('picked', o === b));
  const bubble = $('#fact-bubble');
  bubble.textContent = b.dataset.fact;
  shake(bubble);
}));

/* ---------- anime: flip cards + poll ---------- */
$$('.icard').forEach((c) => c.addEventListener('click', () => c.classList.toggle('flipped')));

function renderPoll() {
  let votes = {};
  try { votes = JSON.parse(store.get('poll') || '{}'); } catch (e) { votes = {}; }
  const mine = store.get('pollMine');
  if (!mine) return;
  const replies = { Levi: "Humanity's strongest. Solid pick.", L: 'Big brain choice. L approves (97%).', Gojo: 'Nah, you\'d win. Great pick.' };
  $('#poll-result').textContent = `You picked ${mine}. ${replies[mine]}`;
  $$('#poll [data-vote]').forEach((b) => b.classList.toggle('aqua-blue', b.dataset.vote === mine));
}
$$('#poll [data-vote]').forEach((b) => b.addEventListener('click', () => {
  store.set('pollMine', b.dataset.vote);
  renderPoll();
}));
renderPoll();

/* ---------- links ---------- */
function openLink(key) {
  const url = SOCIAL_LINKS[key];
  if (!url) { toast(`Add your ${key} link in <code>SOCIAL_LINKS</code> (js/app.js) ✎`); return; }
  if (key === 'email') location.href = `mailto:${url}`;
  else window.open(url, '_blank', 'noopener');
}
$$('[data-link]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); openLink(a.dataset.link); }));
$('#world-select').addEventListener('change', (e) => { if (e.target.value) openLink(e.target.value); e.target.value = ''; });

$('#contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!SOCIAL_LINKS.email) { toast('Add your email in <code>SOCIAL_LINKS</code> (js/app.js) so this can send ✎'); return; }
  const subject = encodeURIComponent($('#c-subject').value);
  const body = encodeURIComponent(`${$('#c-msg').value}\n\n— ${$('#c-name').value}`);
  location.href = `mailto:${SOCIAL_LINKS.email}?subject=${subject}&body=${body}`;
});

/* ---------- search ---------- */
$('#site-search').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $('#search-input').value.toLowerCase().trim();
  if (!q) return;
  const map = [
    [/music|ipod|song|playlist|listen/, 'ipod'],
    [/anime|titan|aot|death|note|jujutsu|jjk|gojo|levi|eren|\bl\b/, 'anime'],
    [/project|work|code|build|portfolio/, 'projects'],
    [/gsu|georgia|school|about|2028|grad|victoria/, 'about'],
    [/contact|email|hire|link|resume/, 'contact'],
  ];
  const hit = map.find(([re]) => re.test(q));
  if (hit) showPage(hit[1]);
  else toast(`No results for "${q.replace(/[<>&]/g, '')}". Try: music, anime, projects, gsu`);
});

/* ============================================================
   iPod wiring
   ============================================================ */
IPod.init({
  onChange(track, playing) {
    const psm = $('#me-psm');
    if (track && playing) {
      psm.innerHTML = '';
      psm.append('♫ ', track.title, ' — ', track.artist);
      psm.classList.add('music');
      $('#spec-nowplaying').textContent = `${track.title} (${track.artist})`;
    } else {
      psm.textContent = store.get('psm') || '<Share a quick message>';
      psm.classList.remove('music');
      $('#spec-nowplaying').textContent = track ? `Paused: ${track.title}` : 'Paused';
    }
  },
});
$('#ipod-file').addEventListener('change', (e) => {
  const n = IPod.addFiles(e.target.files);
  if (n) toast(`Added ${n} song${n > 1 ? 's' : ''} to the iPod ♫<br><span class="toast-psm">They're only on this device, so add files to /music to keep them.</span>`);
  e.target.value = '';
});

/* ============================================================
   BUDDY LIST
   ============================================================ */
const buddyWindow = $('#buddy-window');
const collapsed = new Set();

function renderBuddies() {
  const q = $('#buddy-filter').value.toLowerCase();
  const list = CONTACTS.filter((c) => c.name.toLowerCase().includes(q));
  const groups = {};
  list.forEach((c) => {
    const g = c.status === 'offline' ? 'Offline' : c.group;
    (groups[g] = groups[g] || []).push(c);
  });
  const order = [...new Set(CONTACTS.map((c) => c.group)), 'Offline'].filter((g) => groups[g]);
  const box = $('#buddy-list');
  box.innerHTML = '';
  order.forEach((g) => {
    const all = CONTACTS.filter((c) => c.group === g);
    const online = all.filter((c) => c.status !== 'offline').length;
    const head = document.createElement('button');
    head.className = `buddy-group${collapsed.has(g) ? ' collapsed' : ''}`;
    head.textContent = g === 'Offline' ? `Offline (${groups[g].length})` : `${g} (${online}/${all.length})`;
    head.addEventListener('click', () => { collapsed.has(g) ? collapsed.delete(g) : collapsed.add(g); renderBuddies(); });
    box.append(head);
    if (collapsed.has(g)) return;
    groups[g].forEach((c) => {
      const row = document.createElement('button');
      row.className = 'buddy-row';
      row.innerHTML = '<span class="status-dot"></span><span class="buddy-name"></span><span class="buddy-psm"></span>';
      row.firstChild.classList.add(c.status);
      row.querySelector('.buddy-name').textContent = c.name;
      row.querySelector('.buddy-psm').textContent = `\u00a0- ${c.psm}`;
      row.addEventListener('click', () => openChat(c));
      box.append(row);
    });
  });
}
$('#buddy-filter').addEventListener('input', renderBuddies);
renderBuddies();

function openBuddy() {
  buddyWindow.hidden = false;
  $('#buddy-tab').hidden = true;
}
$('#open-messenger').addEventListener('click', (e) => { e.preventDefault(); openBuddy(); });
$('#buddy-tab').addEventListener('click', openBuddy);
$('#buddy-min').addEventListener('click', () => { buddyWindow.hidden = true; $('#buddy-tab').hidden = false; });
$('#buddy-close').addEventListener('click', () => { buddyWindow.hidden = true; $('#buddy-tab').hidden = false; });
$('.buddy-ad').addEventListener('click', () => showPage('ipod'));

// editable personal message
const psm = $('#me-psm');
if (store.get('psm')) psm.textContent = store.get('psm');
psm.addEventListener('click', () => {
  if (psm.classList.contains('music')) return;
  const input = document.createElement('input');
  input.className = 'psm-input';
  input.maxLength = 60;
  input.value = store.get('psm') || '';
  input.placeholder = 'Share a quick message';
  psm.replaceWith(input);
  input.focus();
  const done = () => {
    const v = input.value.trim();
    store.set('psm', v);
    psm.textContent = v || '<Share a quick message>';
    input.replaceWith(psm);
  };
  input.addEventListener('blur', done);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') input.blur(); });
});

/* ============================================================
   CHAT
   ============================================================ */
const chatWindow = $('#chat-window');
let chatWith = null;
let replyTimer = null;

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

function openChat(c) {
  chatWith = c;
  clearTimeout(replyTimer);
  $('#chat-title').textContent = `${c.name} - Conversation`;
  $('#chat-name').textContent = `${c.name} (${STATUS_TEXT[c.status]})`;
  $('#chat-psm').textContent = c.psm;
  $('#chat-avatar').textContent = c.icon;
  $('#chat-avatar').className = `chat-avatar status-${c.status}`;
  $('#chat-log').innerHTML = '';
  if (c.status === 'offline') addLine('', `${c.name} appears to be offline. Messages will be delivered when they sign in.`, 'system');
  else if (c.status !== 'available') addLine('', `${c.name} may not reply because their status is set to ${STATUS_TEXT[c.status]}.`, 'system');
  chatWindow.hidden = false;
  if (window.innerWidth <= 700) chatWindow.style.cssText = '';
  $('#chat-text').focus();
}

function reply() {
  const c = chatWith;
  if (!c || c.status === 'offline') return;
  addLine('', `${c.name} is typing...`, 'system typing');
  replyTimer = setTimeout(() => {
    $$('.typing', $('#chat-log')).forEach((n) => n.remove());
    addLine(c.name, c.replies[Math.floor(Math.random() * c.replies.length)], 'them');
    Sfx.message();
  }, 900 + Math.random() * 900);
}

$('#chat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const v = $('#chat-text').value.trim();
  if (!v) return;
  addLine('Victoria', v, 'me');
  $('#chat-text').value = '';
  clearTimeout(replyTimer);
  reply();
});
$('#chat-text').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#chat-form').requestSubmit(); }
});
$('#chat-nudge').addEventListener('click', () => {
  addLine('', 'You have just sent a nudge.', 'system');
  Sfx.nudge();
  chatWindow.classList.remove('nudge');
  void chatWindow.offsetWidth;
  chatWindow.classList.add('nudge');
  clearTimeout(replyTimer);
  reply();
});
$('#chat-wink').addEventListener('click', () => {
  const winks = ['💋', '🌸', '🎧', '🍎', '⚡'];
  const w = winks[Math.floor(Math.random() * winks.length)];
  addLine('', `You sent a wink: ${w}`, 'system');
  const big = document.createElement('div');
  big.className = 'wink-burst';
  big.textContent = w;
  chatWindow.append(big);
  setTimeout(() => big.remove(), 1600);
});
$('#chat-close').addEventListener('click', () => { chatWindow.hidden = true; clearTimeout(replyTimer); });

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
    const x = Math.max(0, Math.min(window.innerWidth - 80, ox + e.clientX - sx));
    const y = Math.max(0, Math.min(window.innerHeight - 40, oy + e.clientY - sy));
    win.style.left = `${x}px`;
    win.style.top = `${y}px`;
    win.style.right = 'auto';
    win.style.bottom = 'auto';
  });
  bar.addEventListener('pointerup', () => { dragging = false; });
});

/* ---------- restore session ---------- */
if (session.get('signedIn')) enterSite(false);
