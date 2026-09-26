/* ============================================================
   Chiptune.js
   Tiny procedural 8-bit song generator. Each "song" is composed
   from a seed + chord progression, rendered offline with the
   Web Audio API, and handed back as a WAV blob URL so the iPod
   can play it through a normal <audio> element.
   All melodies are generated, so they're original (no copyright).
   ============================================================ */
const Chiptune = (() => {
  const SR = 22050;

  const SCALES = {
    major:    [0, 2, 4, 5, 7, 9, 11],
    minor:    [0, 2, 3, 5, 7, 8, 10],
    harmonic: [0, 2, 3, 5, 7, 8, 11],
  };

  // Small seeded RNG so a song always sounds the same.
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function degToMidi(root, scale, deg) {
    const oct = Math.floor(deg / 7);
    const i = ((deg % 7) + 7) % 7;
    return root + scale[i] + 12 * oct;
  }

  // Build one 4-bar melodic phrase (8 eighth-note slots per bar).
  function composePhrase(song, rng) {
    const notes = [];
    let cur = song.progression[0] + 7;
    let last = null;
    for (let bar = 0; bar < 4; bar++) {
      const chord = song.progression[bar % song.progression.length];
      for (let step = 0; step < 8; step++) {
        const slot = bar * 8 + step;
        if (step % 2 === 1 && rng() < song.rest) { last = null; continue; }
        if (last && step % 2 === 1 && rng() < 0.3) { last.len += 1; continue; }
        if (step % 4 === 0) {
          // strong beat: land on a chord tone near the current note
          const tones = [0, 2, 4, 7].map((t) => chord + t + 7);
          tones.sort((a, b) => Math.abs(a - cur) - Math.abs(b - cur));
          cur = tones[rng() < 0.7 ? 0 : 1];
        } else {
          const moves = [-1, 1, -2, 2, 1, -1, 0, 3];
          cur += moves[Math.floor(rng() * moves.length)];
        }
        cur = Math.max(4, Math.min(15, cur));
        last = { deg: cur, start: slot, len: 1 };
        notes.push(last);
      }
    }
    // resolve the final note to the tonic-ish
    if (notes.length) notes[notes.length - 1].len += 1;
    return notes;
  }

  async function render(song) {
    const rng = mulberry32(song.seed);
    const scale = SCALES[song.scale];
    const eighth = 60 / song.bpm / 2;
    const phraseLen = 32 * eighth;

    const A = composePhrase(song, rng);
    const B = composePhrase(song, rng);
    // intro, A, A, B, A, B, A, outro
    const form = ['intro', 'A', 'A', 'B', 'A', 'B', 'A'];
    const total = form.length * phraseLen + 2.5;

    const ctx = new OfflineAudioContext(1, Math.ceil(total * SR), SR);
    const master = ctx.createGain();
    master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);

    // shared white noise buffer for drums
    const noise = ctx.createBuffer(1, SR, SR);
    const nd = noise.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    function tone(type, freq, t, dur, vol) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.005);
      g.gain.setValueAtTime(vol, t + Math.max(0.01, dur - 0.04));
      g.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + dur + 0.01);
    }
    function kick(t) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.setValueAtTime(160, t);
      o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
      g.gain.setValueAtTime(0.5, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      o.connect(g).connect(master);
      o.start(t); o.stop(t + 0.16);
    }
    function noiseHit(t, dur, vol, hp) {
      const s = ctx.createBufferSource();
      s.buffer = noise;
      const f = ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = hp;
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      s.connect(f).connect(g).connect(master);
      s.start(t, Math.random() * 0.5); s.stop(t + dur);
    }

    form.forEach((section, si) => {
      const t0 = si * phraseLen;
      const phrase = section === 'A' ? A : section === 'B' ? B : null;

      for (let bar = 0; bar < 4; bar++) {
        const chord = song.progression[bar % song.progression.length];
        const bt = t0 + bar * 8 * eighth;
        // bass: octave-bouncing eighths
        const bassRoot = degToMidi(song.root - 24, scale, chord);
        for (let s = 0; s < 8; s++) {
          const m = s % 2 === 0 ? bassRoot : bassRoot + 12;
          tone('triangle', midiToFreq(m), bt + s * eighth, eighth * 0.9, 0.28);
        }
        // arpeggio sparkle in B sections
        if (section === 'B') {
          const arp = [0, 2, 4, 7, 4, 2, 0, 2];
          arp.forEach((d, s) => tone('square', midiToFreq(degToMidi(song.root + 12, scale, chord + d)), bt + s * eighth, eighth * 0.5, 0.025));
        }
        // drums
        for (let s = 0; s < 8; s++) {
          const t = bt + s * eighth;
          if (s === 0 || s === 4 || (song.busyKick && s === 5)) kick(t);
          if (s === 2 || s === 6) noiseHit(t, 0.12, 0.22, 1500);
          noiseHit(t, 0.03, s % 2 ? 0.05 : 0.08, 7000);
        }
      }
      if (phrase) {
        phrase.forEach((n) => {
          const f = midiToFreq(degToMidi(song.root, scale, n.deg));
          tone(song.lead, f, t0 + n.start * eighth, n.len * eighth * 0.92, 0.07);
        });
      }
    });

    // outro: final chord ring-out
    const end = form.length * phraseLen;
    [0, 2, 4].forEach((d) => tone(song.lead, midiToFreq(degToMidi(song.root, scale, d)), end, 2, 0.05));
    tone('triangle', midiToFreq(song.root - 24), end, 2, 0.28);

    const buffer = await ctx.startRendering();
    return URL.createObjectURL(toWav(buffer));
  }

  function toWav(buffer) {
    const data = buffer.getChannelData(0);
    const len = data.length;
    const view = new DataView(new ArrayBuffer(44 + len * 2));
    const str = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
    str(0, 'RIFF'); view.setUint32(4, 36 + len * 2, true); str(8, 'WAVE');
    str(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, 1, true); view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true); view.setUint16(32, 2, true);
    view.setUint16(34, 16, true); str(36, 'data'); view.setUint32(40, len * 2, true);
    for (let i = 0; i < len; i++) {
      const s = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Blob([view], { type: 'audio/wav' });
  }

  return { render };
})();
