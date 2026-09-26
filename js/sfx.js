/* ============================================================
   Sfx.js — tiny synthesized sound effects (no audio files needed)
   ============================================================ */
const Sfx = (() => {
  let ctx = null;
  let muted = false;
  const getCtx = () => {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  function blip(freq, start, dur, type = 'sine', vol = 0.15) {
    const c = getCtx();
    if (!c || muted) return;
    const t = c.currentTime + start;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  return {
    // iPod click wheel tick
    click() { blip(2400, 0, 0.018, 'square', 0.04); },
    // bright "someone signed in" chime
    signIn() {
      [659.25, 830.61, 987.77, 1318.51].forEach((f, i) => blip(f, i * 0.09, 0.5, 'sine', 0.12));
    },
    // new message pop
    message() { blip(880, 0, 0.12, 'triangle', 0.15); blip(1320, 0.08, 0.2, 'triangle', 0.12); },
    // nudge buzz
    nudge() {
      for (let i = 0; i < 6; i++) blip(i % 2 ? 110 : 90, i * 0.07, 0.07, 'sawtooth', 0.08);
    },
    error() { blip(220, 0, 0.18, 'square', 0.06); blip(180, 0.12, 0.2, 'square', 0.06); },
    setMuted(m) { muted = m; },
    get muted() { return muted; },
  };
})();
