/* ============================================================
   iPod.js — a working 1st-gen iPod (2001)
   Plays Victoria's Spotify songs through Spotify's official
   embed player (iFrame API), and falls back to built-in
   chiptunes (Chiptune.js) when Spotify isn't connected yet.
   ============================================================ */

const DEMO_SONGS = [
  { title: 'Wall Maria Sunset', artist: 'Chiptune Demo', gen: { seed: 104, bpm: 150, root: 69, scale: 'minor', progression: [0, 5, 2, 6], lead: 'square', rest: 0.2, busyKick: true } },
  { title: 'Notebook Theory', artist: 'Chiptune Demo', gen: { seed: 31, bpm: 104, root: 62, scale: 'harmonic', progression: [0, 3, 4, 0], lead: 'triangle', rest: 0.35 } },
  { title: 'Domain Expansion', artist: 'Chiptune Demo', gen: { seed: 777, bpm: 172, root: 64, scale: 'minor', progression: [0, 6, 5, 4], lead: 'sawtooth', rest: 0.15, busyKick: true } },
  { title: 'Peachtree St. Nights', artist: 'Chiptune Demo', gen: { seed: 2028, bpm: 118, root: 65, scale: 'major', progression: [0, 4, 5, 3], lead: 'square', rest: 0.3 } },
];

/* ---------- Spotify embed backend ---------- */
const SpotifyEmbed = (() => {
  let controller = null;
  let readyPromise = null;
  let onUpdate = () => {};
  let state = { paused: true, position: 0, duration: 0, buffering: false };
  let currentUri = null;

  function load(host, firstUri) {
    if (readyPromise) return readyPromise;
    readyPromise = new Promise((resolve, reject) => {
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        IFrameAPI.createController(host, { uri: firstUri, width: '100%', height: 80 }, (c) => {
          controller = c;
          currentUri = firstUri;
          c.addListener('playback_update', (e) => {
            const d = e.data || {};
            const prev = state;
            state = { paused: !!d.isPaused, position: (d.position || 0) / 1000, duration: (d.duration || 0) / 1000, buffering: !!d.isBuffering };
            // jump to the start time once playback begins, if the full song is available
            // (logged-out visitors only get a 30s preview, which can't be skipped into)
            if (pendingSeek !== null && !state.paused && state.duration > 0) {
              if (state.duration > pendingSeek + 5) c.seek(pendingSeek);
              pendingSeek = null;
            }
            onUpdate(state, prev);
          });
          resolve(c);
        });
      };
      const s = document.createElement('script');
      s.src = 'https://open.spotify.com/embed/iframe-api/v1';
      s.async = true;
      s.onerror = () => reject(new Error('Spotify player failed to load'));
      document.head.append(s);
    });
    return readyPromise;
  }

  function waitForReady(c) {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      c.addListener('ready', finish);
      setTimeout(finish, 1500);
    });
  }

  let pendingSeek = null;

  async function play(uri, startAt = 0) {
    const c = await readyPromise;
    if (uri !== currentUri || startAt > 0) {
      currentUri = uri;
      state = { paused: true, position: 0, duration: 0, buffering: true };
      const ready = waitForReady(c);
      c.loadUri(uri, false, startAt);
      await ready;
    }
    pendingSeek = startAt > 0 ? startAt : null;
    c.play();
  }

  return {
    load,
    play,
    pause() { if (controller && !state.paused) controller.togglePlay(); },
    resume() { if (controller) controller.resume(); },
    seek(sec) { if (controller) controller.seek(Math.max(0, sec)); },
    set onUpdate(fn) { onUpdate = fn; },
    get state() { return state; },
    get ready() { return !!controller; },
  };
})();

const IPod = (() => {
  const VISIBLE_ROWS = 6;
  const audio = new Audio();
  audio.preload = 'auto';

  let tracks = [];
  let lists = { recent: [], picks: [], demo: [] }; // arrays of indexes into tracks
  let liveIndex = -1; // track Victoria is playing on Spotify right now
  let el = {};
  let stack = [];
  let current = -1;
  let shuffle = false;
  let repeat = 'All';
  let clicker = true;
  let backlight = 'Timer';
  let lightTimer = null;
  let overlayTimer = null;
  let overlay = null; // 'volume' | 'scrub'
  let loading = false;
  let onChange = () => {};

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (s) => {
    if (!isFinite(s) || s < 0) s = 0;
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };
  const track = () => tracks[current];
  const isSpotify = (t = track()) => t && t.kind === 'spotify';

  /* ---------- unified playback state ---------- */
  const paused = () => (isSpotify() ? SpotifyEmbed.state.paused : audio.paused);
  const position = () => (isSpotify() ? SpotifyEmbed.state.position : audio.currentTime);
  const duration = () => {
    if (isSpotify()) return SpotifyEmbed.state.duration || (track().durationMs || 0) / 1000;
    return audio.duration;
  };

  /* ---------- library ---------- */
  function setLibrary({ recent = [], picks = [], nowPlaying = null } = {}) {
    const prevUri = current >= 0 && tracks[current] ? tracks[current].uri : null;
    const wasOnNowPlaying = stack.length > 0 && top().type === 'now';
    tracks = [];
    lists = { recent: [], picks: [], demo: [] };
    liveIndex = -1;
    const add = (t) => { tracks.push(t); return tracks.length - 1; };
    const ids = new Map();
    const addSpotify = (t) => {
      if (ids.has(t.uri)) {
        const i = ids.get(t.uri);
        if (t.startAt !== undefined) tracks[i].startAt = t.startAt;
        return i;
      }
      const i = add({ kind: 'spotify', ...t });
      ids.set(t.uri, i);
      return i;
    };
    if (nowPlaying) liveIndex = addSpotify(nowPlaying);
    recent.forEach((t) => lists.recent.push(addSpotify(t)));
    picks.forEach((t) => lists.picks.push(addSpotify(t)));
    if (!tracks.length) DEMO_SONGS.forEach((t) => lists.demo.push(add({ kind: 'audio', ...t })));

    // keep whatever is already playing when the library refreshes
    current = prevUri ? tracks.findIndex((t) => t.uri === prevUri) : -1;
    stack = [mainMenu()];
    if (current >= 0 && wasOnNowPlaying) stack.push({ type: 'now', title: 'Now Playing' });
    if (tracks.some((t) => t.kind === 'spotify')) {
      el.dock.hidden = false;
      el.dockNote.textContent = 'Press Play to start listening. Your visit begins quietly.';
    } else {
      el.dock.hidden = true;
    }
    render();
    emit();
  }

  function ensureUrl(t) {
    if (t.url) return Promise.resolve(t.url);
    if (!t.pending) t.pending = Chiptune.render(t.gen).then((u) => (t.url = u));
    return t.pending;
  }

  async function play(index) {
    if (!tracks.length) return;
    const prevWasSpotify = isSpotify();
    current = (index + tracks.length) % tracks.length;
    const t = track();
    goNowPlaying();
    loading = true;
    render();
    try {
      if (t.kind === 'spotify') {
        audio.pause();
        await SpotifyEmbed.load(el.embed, t.uri);
        await SpotifyEmbed.play(t.uri, t.startAt || 0);
      } else {
        if (prevWasSpotify) SpotifyEmbed.pause();
        const url = await ensureUrl(t);
        if (track() !== t) return;
        audio.src = url;
        await audio.play();
      }
    } catch (err) {
      console.warn('iPod could not play', t, err);
    }
    loading = false;
    render();
    emit();
  }

  function togglePlay() {
    if (current < 0) { play(liveIndex >= 0 ? liveIndex : 0); return; }
    if (isSpotify()) {
      if (paused()) SpotifyEmbed.resume(); else SpotifyEmbed.pause();
    } else if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
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
    if (auto && repeat === 'Off' && current === tracks.length - 1) return;
    play(current + 1);
  }
  function prev() {
    if (current < 0) return play(tracks.length - 1);
    if (position() > 3) { seekTo(0); return; }
    play(current - 1);
  }
  function seekTo(sec) {
    if (isSpotify()) SpotifyEmbed.seek(sec);
    else audio.currentTime = sec;
  }

  function emit() {
    onChange(current >= 0 ? track() : null, current >= 0 && !paused());
  }

  /* ---------- menus ---------- */
  const listScreen = (title, items) => ({ type: 'list', title, items, sel: 0, top: 0 });
  const songList = (title, idxs) => listScreen(title, () => idxs.map((i) => ({ label: tracks[i].title, track: i, onSelect: () => play(i) })));

  const artistsMenu = () => listScreen('Artists', () => {
    const artists = [...new Set(tracks.map((t) => t.artist))].sort((a, b) => a.localeCompare(b));
    return artists.map((a) => ({
      label: a, arrow: true,
      onSelect: () => push(songList(a, tracks.map((t, i) => (t.artist === a ? i : -1)).filter((i) => i >= 0))),
    }));
  });

  const settingsMenu = () => listScreen('Settings', () => [
    { label: `Shuffle: ${shuffle ? 'Songs' : 'Off'}`, onSelect: () => { shuffle = !shuffle; } },
    { label: `Repeat: ${repeat}`, onSelect: () => { repeat = { Off: 'All', All: 'One', One: 'Off' }[repeat]; } },
    { label: `Backlight: ${backlight}`, onSelect: () => { backlight = { Off: 'Timer', Timer: 'Always', Always: 'Off' }[backlight]; wake(); } },
    { label: `Clicker: ${clicker ? 'On' : 'Off'}`, onSelect: () => { clicker = !clicker; } },
  ]);

  const aboutMenu = () => listScreen('About', () => [
    { label: "Tori's iPod" },
    { label: `Songs: ${tracks.length}` },
    { label: lists.demo.length ? 'Source: Demo' : 'Source: Spotify' },
    { label: 'Georgia State' },
    { label: 'Class of 2028' },
  ]);

  const mainMenu = () => listScreen('iPod', () => {
    const items = [];
    if (liveIndex >= 0) items.push({ label: 'Listening Now', live: true, onSelect: () => play(liveIndex) });
    if (lists.recent.length) items.push({ label: 'Recently Played', arrow: true, onSelect: () => push(songList('Recently Played', lists.recent)) });
    if (lists.picks.length) items.push({ label: "Tori's Picks", arrow: true, onSelect: () => push(songList("Tori's Picks", lists.picks)) });
    items.push(
      { label: 'Songs', arrow: true, onSelect: () => push(songList('Songs', tracks.map((_, i) => i))) },
      { label: 'Artists', arrow: true, onSelect: () => push(artistsMenu()) },
      { label: 'Shuffle Songs', onSelect: () => { shuffle = true; play(randomIndex()); } },
      { label: 'Now Playing', arrow: true, onSelect: () => (current >= 0 ? goNowPlaying() : play(liveIndex >= 0 ? liveIndex : 0)) },
      { label: 'Settings', arrow: true, onSelect: () => push(settingsMenu()) },
      { label: 'About', arrow: true, onSelect: () => push(aboutMenu()) },
    );
    return items;
  });

  const top = () => stack[stack.length - 1];
  function push(screen) { stack.push(screen); render(); }
  function goNowPlaying() {
    if (top().type !== 'now') stack.push({ type: 'now', title: 'Now Playing' });
    render();
  }
  function menu() { if (stack.length > 1) stack.pop(); render(); }
  function select() {
    const s = top();
    if (s.type !== 'list') { togglePlay(); return; }
    const item = s.items()[s.sel];
    if (item && item.onSelect) item.onSelect();
    render();
  }
  function showOverlay(kind) {
    overlay = kind;
    clearTimeout(overlayTimer);
    overlayTimer = setTimeout(() => { overlay = null; render(); }, 1500);
  }
  function scroll(dir) {
    const s = top();
    tick();
    if (s.type === 'now') {
      if (current < 0) return;
      if (isSpotify()) {
        // Spotify's embed has no volume control, so the wheel scrubs instead
        seekTo(Math.max(0, Math.min(duration() - 1, position() + dir * 5)));
        showOverlay('scrub');
      } else {
        audio.volume = Math.max(0, Math.min(1, Math.round((audio.volume + dir * 0.05) * 100) / 100));
        showOverlay('volume');
      }
      render();
      return;
    }
    const n = s.items().length;
    s.sel = Math.max(0, Math.min(n - 1, s.sel + dir));
    render();
  }

  /* ---------- rendering ---------- */
  function render() {
    if (!el.content || !stack.length) return;
    const s = top();
    el.title.textContent = s.title;
    el.indicator.textContent = current >= 0 ? (paused() ? '❚❚' : '▶') : '';

    if (s.type === 'list') {
      const items = s.items();
      if (s.sel >= items.length) s.sel = Math.max(0, items.length - 1);
      if (s.sel < s.top) s.top = s.sel;
      if (s.sel >= s.top + VISIBLE_ROWS) s.top = s.sel - VISIBLE_ROWS + 1;
      const rows = items.slice(s.top, s.top + VISIBLE_ROWS).map((it, i) => {
        const idx = s.top + i;
        const playing = it.track !== undefined && it.track === current && !paused();
        return `<div class="ipod-row${idx === s.sel ? ' sel' : ''}" data-idx="${idx}">
            <span class="ipod-row-label">${playing ? '♪ ' : ''}${it.live ? '<i class="live-dot"></i>' : ''}${esc(it.label)}</span>${it.arrow ? '<b>›</b>' : ''}
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

    const t = track();
    if (!t) { el.content.innerHTML = '<div class="ipod-now"><p>No song selected</p></div>'; return; }
    const dur = duration();
    const pos = position();
    const pct = isFinite(dur) && dur > 0 ? (pos / dur) * 100 : 0;
    let meter;
    if (overlay === 'volume') {
      meter = `<div class="ipod-volume"><span>🔈</span><div class="ipod-bar"><span style="width:${audio.volume * 100}%"></span></div><span>🔊</span></div>`;
    } else {
      meter = `<div class="ipod-bar${overlay === 'scrub' ? ' scrub' : ''}"><span style="width:${pct}%"></span></div>
         <div class="ipod-times"><span>${fmt(pos)}</span><span>-${fmt((dur || 0) - pos)}</span></div>`;
    }
    el.content.innerHTML = `
      <div class="ipod-now${t.art ? ' has-art' : ''}">
        <p class="ipod-count">${current + 1} of ${tracks.length}</p>
        <div class="ipod-now-main">
          ${t.art ? `<img class="ipod-art" src="${esc(t.art)}" alt="">` : ''}
          <div class="ipod-now-text">
            <p class="ipod-song"><span>${esc(t.title)}</span></p>
            <p class="ipod-artist">${loading ? 'Loading…' : esc(t.artist)}</p>
          </div>
        </div>
        ${meter}
      </div>`;
    const song = el.content.querySelector('.ipod-song');
    if (song.firstElementChild.scrollWidth > song.clientWidth) song.classList.add('marquee');
  }

  function updateProgress() {
    if (!stack.length || top().type !== 'now' || overlay === 'volume') return;
    const bar = el.content.querySelector('.ipod-bar span');
    const times = el.content.querySelectorAll('.ipod-times span');
    if (!bar || times.length < 2) return;
    const dur = duration();
    const pos = position();
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
    wheel.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      if (moved >= 10) return;
      tick();
      const a = downAngle;
      if (a > -135 && a < -45) menu();
      else if (a >= -45 && a <= 45) next();
      else if (a > 45 && a < 135) togglePlay();
      else prev();
    });
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
      top().sel = Number(row.dataset.idx);
      tick();
      select();
    });
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
      dock: document.getElementById('spotify-dock'),
      dockNote: document.getElementById('spotify-note'),
      embed: document.getElementById('spotify-embed'),
    };
    audio.volume = 0.7;

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', render);
    audio.addEventListener('play', () => { render(); emit(); });
    audio.addEventListener('pause', () => { render(); emit(); });
    audio.addEventListener('ended', () => next(true));

    SpotifyEmbed.onUpdate = (s, prevState) => {
      if (!isSpotify()) return;
      if (s.paused !== prevState.paused) { render(); emit(); }
      else updateProgress();
      // the embed pauses and rewinds when a song finishes
      const finished = !prevState.paused && s.paused && prevState.duration > 0
        && (s.position === 0 || s.duration - s.position < 1.5) && prevState.position > 1;
      if (finished) next(true);
    };

    bindWheel();
    setLibrary();
  }

  function warmUp() {
    (async () => {
      for (const i of lists.demo) {
        try { await ensureUrl(tracks[i]); } catch (e) { /* rendered on play instead */ }
      }
    })();
  }

  function playUri(uri) {
    const i = tracks.findIndex((t) => t.uri === uri);
    if (i >= 0) play(i);
  }

  function pause() {
    audio.pause();
    SpotifyEmbed.pause();
  }

  return { init, setLibrary, warmUp, play, playUri, pause, togglePlay, next, prev, get tracks() { return tracks; } };
})();
