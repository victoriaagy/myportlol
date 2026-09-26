/* ============================================================
   iPod.js — a working 1st-gen iPod (2001) music player
   ============================================================ */

/* ✎ ADD YOUR OWN SONGS HERE
   Drop .mp3 files into the /music folder, then list them below.
   They'll show up first in the Songs menu. Example:
   { title: 'My Favorite Song', artist: 'Some Artist', src: 'music/my-favorite-song.mp3' },
*/
const MY_SONGS = [
];

/* Built-in original chiptunes, generated in the browser by Chiptune.js
   so the iPod always has something to play. */
const DEMO_SONGS = [
  { title: 'Wall Maria Sunset', artist: 'Victoria & the Scouts', gen: { seed: 104, bpm: 150, root: 69, scale: 'minor', progression: [0, 5, 2, 6], lead: 'square', rest: 0.2, busyKick: true } },
  { title: 'Notebook Theory', artist: 'L & the Apples', gen: { seed: 31, bpm: 104, root: 62, scale: 'harmonic', progression: [0, 3, 4, 0], lead: 'triangle', rest: 0.35 } },
  { title: 'Domain Expansion', artist: 'Cursed Energy Club', gen: { seed: 777, bpm: 172, root: 64, scale: 'minor', progression: [0, 6, 5, 4], lead: 'sawtooth', rest: 0.15, busyKick: true } },
  { title: 'Peachtree St. Nights', artist: 'Panther Pop', gen: { seed: 2028, bpm: 118, root: 65, scale: 'major', progression: [0, 4, 5, 3], lead: 'square', rest: 0.3 } },
  { title: 'Class of 2028', artist: 'Victoria Agyare', gen: { seed: 5, bpm: 132, root: 67, scale: 'major', progression: [3, 4, 2, 5], lead: 'triangle', rest: 0.25 } },
];

const IPod = (() => {
  const VISIBLE_ROWS = 6;
  const tracks = [...MY_SONGS, ...DEMO_SONGS].map((t) => ({ ...t }));
  const audio = new Audio();
  audio.preload = 'auto';

  let el = {};
  let stack = [];
  let current = -1;
  let shuffle = false;
  let repeat = 'All'; // Off | All | One
  let clicker = true;
  let backlight = 'Timer'; // Off | Timer | Always
  let lightTimer = null;
  let volumeTimer = null;
  let showVolume = false;
  let loading = false;
  let onChange = () => {};

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (s) => {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  /* ---------- audio ---------- */
  function ensureUrl(track) {
    if (track.url) return Promise.resolve(track.url);
    if (track.src) { track.url = track.src; return Promise.resolve(track.url); }
    if (!track.pending) {
      track.pending = Chiptune.render(track.gen).then((u) => (track.url = u));
    }
    return track.pending;
  }

  async function play(index) {
    if (!tracks.length) return;
    current = (index + tracks.length) % tracks.length;
    const track = tracks[current];
    goNowPlaying();
    if (!track.url) { loading = true; render(); }
    try {
      const url = await ensureUrl(track);
      if (tracks[current] !== track) return; // user skipped while loading
      loading = false;
      audio.src = url;
      await audio.play();
    } catch (err) {
      loading = false;
      console.warn('iPod could not play', track, err);
    }
    render();
    emit();
  }

  function togglePlay() {
    if (current < 0) { play(shuffle ? randomIndex() : 0); return; }
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
  }
  const randomIndex = () => {
    if (tracks.length < 2) return 0;
    let i;
    do { i = Math.floor(Math.random() * tracks.length); } while (i === current);
    return i;
  };
  function next(auto = false) {
    if (current < 0) return play(0);
    if (auto && repeat === 'One') return play(current);
    if (shuffle) return play(randomIndex());
    if (auto && repeat === 'Off' && current === tracks.length - 1) { audio.pause(); emit(); render(); return; }
    play(current + 1);
  }
  function prev() {
    if (current < 0) return play(tracks.length - 1);
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    play(current - 1);
  }

  function emit() {
    onChange(current >= 0 ? tracks[current] : null, !audio.paused);
  }

  /* ---------- menus ---------- */
  function listScreen(title, itemsFn) {
    return { type: 'list', title, items: itemsFn, sel: 0, top: 0 };
  }

  const songsMenu = () => listScreen('Songs', () =>
    tracks.map((t, i) => ({ label: t.title, onSelect: () => play(i) })));

  const artistsMenu = () => listScreen('Artists', () => {
    const artists = [...new Set(tracks.map((t) => t.artist))];
    return artists.map((a) => ({
      label: a, arrow: true,
      onSelect: () => push(listScreen(a, () => tracks
        .map((t, i) => ({ t, i }))
        .filter(({ t }) => t.artist === a)
        .map(({ t, i }) => ({ label: t.title, onSelect: () => play(i) })))),
    }));
  });

  const settingsMenu = () => listScreen('Settings', () => [
    { label: `Shuffle: ${shuffle ? 'Songs' : 'Off'}`, onSelect: () => { shuffle = !shuffle; } },
    { label: `Repeat: ${repeat}`, onSelect: () => { repeat = { Off: 'All', All: 'One', One: 'Off' }[repeat]; } },
    { label: `Backlight: ${backlight}`, onSelect: () => { backlight = { Off: 'Timer', Timer: 'Always', Always: 'Off' }[backlight]; wake(); } },
    { label: `Clicker: ${clicker ? 'On' : 'Off'}`, onSelect: () => { clicker = !clicker; } },
  ]);

  const aboutMenu = () => listScreen('About', () => [
    { label: "Victoria's iPod" },
    { label: `Songs: ${tracks.length}` },
    { label: 'Owner: V. Agyare' },
    { label: 'Georgia State' },
    { label: 'Class of 2028' },
    { label: 'Capacity: ∞ vibes' },
  ]);

  const mainMenu = () => listScreen('iPod', () => [
    { label: 'Songs', arrow: true, onSelect: () => push(songsMenu()) },
    { label: 'Artists', arrow: true, onSelect: () => push(artistsMenu()) },
    { label: 'Shuffle Songs', onSelect: () => { shuffle = true; play(randomIndex()); } },
    { label: 'Now Playing', arrow: true, onSelect: () => (current >= 0 ? goNowPlaying() : play(0)) },
    { label: 'Settings', arrow: true, onSelect: () => push(settingsMenu()) },
    { label: 'About', arrow: true, onSelect: () => push(aboutMenu()) },
    { label: 'Add Songs…', onSelect: () => el.file && el.file.click() },
  ]);

  function push(screen) { stack.push(screen); render(); }
  function goNowPlaying() {
    if (top().type !== 'now') stack.push({ type: 'now', title: 'Now Playing' });
    render();
  }
  const top = () => stack[stack.length - 1];

  function menu() {
    if (stack.length > 1) stack.pop();
    render();
  }
  function select() {
    const s = top();
    if (s.type !== 'list') { togglePlay(); return; }
    const item = s.items()[s.sel];
    if (item && item.onSelect) item.onSelect();
    render();
  }
  function scroll(dir) {
    const s = top();
    tick();
    if (s.type === 'now') {
      audio.volume = Math.max(0, Math.min(1, Math.round((audio.volume + dir * 0.05) * 100) / 100));
      showVolume = true;
      clearTimeout(volumeTimer);
      volumeTimer = setTimeout(() => { showVolume = false; render(); }, 1500);
      render();
      return;
    }
    const n = s.items().length;
    s.sel = Math.max(0, Math.min(n - 1, s.sel + dir));
    render();
  }

  /* ---------- rendering ---------- */
  function render() {
    const s = top();
    el.title.textContent = s.title;
    el.indicator.textContent = current >= 0 ? (audio.paused ? '❚❚' : '▶') : '';

    if (s.type === 'list') {
      const items = s.items();
      if (s.sel < s.top) s.top = s.sel;
      if (s.sel >= s.top + VISIBLE_ROWS) s.top = s.sel - VISIBLE_ROWS + 1;
      const rows = items.slice(s.top, s.top + VISIBLE_ROWS).map((it, i) => {
        const idx = s.top + i;
        const playing = s.title === 'Songs' && idx === current && !audio.paused;
        return `<div class="ipod-row${idx === s.sel ? ' sel' : ''}" data-idx="${idx}">
            <span class="ipod-row-label">${playing ? '♪ ' : ''}${esc(it.label)}</span>${it.arrow ? '<b>›</b>' : ''}
          </div>`;
      }).join('');
      let bar = '';
      if (items.length > VISIBLE_ROWS) {
        const h = (VISIBLE_ROWS / items.length) * 100;
        const t = (s.top / items.length) * 100;
        bar = `<div class="ipod-scrollbar"><span style="height:${h}%;top:${t}%"></span></div>`;
      }
      el.content.innerHTML = `<div class="ipod-list${bar ? ' has-bar' : ''}">${rows}</div>${bar}`;
      return;
    }

    // Now Playing
    const t = tracks[current];
    if (!t) { el.content.innerHTML = '<div class="ipod-now"><p>No song selected</p></div>'; return; }
    const dur = audio.duration;
    const pos = audio.currentTime;
    const pct = isFinite(dur) && dur > 0 ? (pos / dur) * 100 : 0;
    const meter = showVolume
      ? `<div class="ipod-volume"><span>🔈</span><div class="ipod-bar"><span style="width:${audio.volume * 100}%"></span></div><span>🔊</span></div>`
      : `<div class="ipod-bar"><span style="width:${pct}%"></span></div>
         <div class="ipod-times"><span>${fmt(pos)}</span><span>-${fmt((dur || 0) - pos)}</span></div>`;
    el.content.innerHTML = `
      <div class="ipod-now">
        <p class="ipod-count">${current + 1} of ${tracks.length}</p>
        <p class="ipod-song"><span>${esc(t.title)}</span></p>
        <p class="ipod-artist">${loading ? 'Loading…' : esc(t.artist)}</p>
        ${meter}
      </div>`;
    const song = el.content.querySelector('.ipod-song');
    const span = song.firstElementChild;
    if (span.scrollWidth > song.clientWidth) song.classList.add('marquee');
  }

  // cheap progress-only redraw while playing
  function updateProgress() {
    if (top().type !== 'now' || showVolume) return;
    const bar = el.content.querySelector('.ipod-bar span');
    const times = el.content.querySelectorAll('.ipod-times span');
    if (!bar || times.length < 2) return;
    const dur = audio.duration;
    const pos = audio.currentTime;
    bar.style.width = `${isFinite(dur) && dur > 0 ? (pos / dur) * 100 : 0}%`;
    times[0].textContent = fmt(pos);
    times[1].textContent = `-${fmt((dur || 0) - pos)}`;
  }

  function tick() { if (clicker) Sfx.click(); wake(); }
  function wake() {
    clearTimeout(lightTimer);
    el.screen.classList.toggle('lit', backlight !== 'Off');
    if (backlight === 'Timer') lightTimer = setTimeout(() => el.screen.classList.remove('lit'), 5000);
  }

  /* ---------- click wheel input ---------- */
  function bindWheel() {
    const wheel = el.wheel;
    const STEP = 22; // degrees of rotation per scroll step
    let dragging = false;
    let last = 0;
    let acc = 0;
    let moved = 0;
    let downAngle = 0;

    const angleOf = (e) => {
      const r = wheel.getBoundingClientRect();
      return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
    };

    wheel.addEventListener('pointerdown', (e) => {
      if (e.target === el.center) return;
      dragging = true;
      last = downAngle = angleOf(e);
      acc = 0;
      moved = 0;
      wheel.setPointerCapture(e.pointerId);
      el.ipod.focus({ preventScroll: true });
    });
    wheel.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const a = angleOf(e);
      let d = a - last;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      last = a;
      acc += d;
      moved += Math.abs(d);
      while (acc >= STEP) { scroll(1); acc -= STEP; }
      while (acc <= -STEP) { scroll(-1); acc += STEP; }
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      if (moved < 10) {
        tick();
        const a = downAngle;
        if (a > -135 && a < -45) menu();
        else if (a >= -45 && a <= 45) next();
        else if (a > 45 && a < 135) togglePlay();
        else prev();
      }
    };
    wheel.addEventListener('pointerup', end);
    wheel.addEventListener('pointercancel', () => { dragging = false; });

    el.center.addEventListener('click', () => { tick(); select(); });

    el.ipod.addEventListener('wheel', (e) => {
      e.preventDefault();
      scroll(e.deltaY > 0 ? 1 : -1);
    }, { passive: false });

    el.ipod.addEventListener('keydown', (e) => {
      const keys = {
        ArrowDown: () => scroll(1), ArrowUp: () => scroll(-1),
        ArrowRight: () => { tick(); next(); }, ArrowLeft: () => { tick(); prev(); },
        Enter: () => { tick(); select(); }, Escape: () => { tick(); menu(); }, Backspace: () => { tick(); menu(); },
        ' ': () => { tick(); togglePlay(); },
      };
      if (keys[e.key]) { e.preventDefault(); keys[e.key](); }
    });

    // tapping a row selects it directly (handy on phones)
    el.content.addEventListener('click', (e) => {
      const row = e.target.closest('.ipod-row');
      if (!row) return;
      const s = top();
      s.sel = Number(row.dataset.idx);
      tick();
      select();
    });
  }

  function addFiles(files) {
    const added = [];
    [...files].forEach((f) => {
      if (!f.type.startsWith('audio')) return;
      const t = { title: f.name.replace(/\.[^.]+$/, ''), artist: 'Added by you', url: URL.createObjectURL(f) };
      tracks.push(t);
      added.push(t);
    });
    render();
    return added.length;
  }

  function init(opts = {}) {
    onChange = opts.onChange || onChange;
    el = {
      ipod: document.getElementById('ipod'),
      screen: document.getElementById('ipod-screen'),
      content: document.getElementById('ipod-content'),
      title: document.getElementById('ipod-screen-title'),
      indicator: document.getElementById('ipod-play-indicator'),
      wheel: document.getElementById('wheel'),
      center: document.getElementById('wheel-center'),
      file: document.getElementById('ipod-file'),
    };
    audio.volume = 0.7;
    stack = [mainMenu()];

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', render);
    audio.addEventListener('play', () => { render(); emit(); });
    audio.addEventListener('pause', () => { render(); emit(); });
    audio.addEventListener('ended', () => next(true));

    bindWheel();
    render();
  }

  // Pre-render the generated songs in the background so playback is instant.
  async function warmUp() {
    for (const t of tracks) {
      if (t.gen) {
        try { await ensureUrl(t); } catch (e) { /* rendered lazily on play instead */ }
      }
    }
  }

  return { init, warmUp, addFiles, togglePlay, pause: () => audio.pause(), next, prev, play, get tracks() { return tracks; } };
})();
