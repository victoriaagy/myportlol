/* ============================================================
   /api/spotify — serverless function (Vercel)
   Returns Victoria's currently-playing track + recently played
   tracks from Spotify. Secrets stay on the server as env vars:
     SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
   Get the refresh token once with: node scripts/spotify-token.mjs
   ============================================================ */

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API = 'https://api.spotify.com/v1';

async function getAccessToken() {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) throw Object.assign(new Error('Spotify env vars are not set'), { status: 501 });
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
  });
  if (!res.ok) throw Object.assign(new Error(`Token request failed (${res.status})`), { status: 502 });
  return (await res.json()).access_token;
}

function simplify(track) {
  if (!track || track.type !== 'track') return null;
  const images = (track.album && track.album.images) || [];
  // Spotify lists images largest first; pick a ~300px one.
  const art = (images.find((i) => i.width && i.width <= 320) || images[0] || {}).url || '';
  return {
    id: track.id,
    uri: track.uri,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    album: track.album ? track.album.name : '',
    art,
    durationMs: track.duration_ms,
    url: track.external_urls ? track.external_urls.spotify : '',
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const token = await getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };

    const [nowRes, recentRes] = await Promise.all([
      fetch(`${API}/me/player/currently-playing`, { headers }),
      fetch(`${API}/me/player/recently-played?limit=50`, { headers }),
    ]);

    let nowPlaying = null;
    if (nowRes.status === 200) {
      const now = await nowRes.json();
      const t = simplify(now.item);
      if (t) nowPlaying = { ...t, isPlaying: Boolean(now.is_playing) };
    }

    const recent = [];
    if (recentRes.ok) {
      const seen = new Set();
      for (const item of (await recentRes.json()).items || []) {
        const t = simplify(item.track);
        if (!t || seen.has(t.id)) continue;
        seen.add(t.id);
        recent.push({ ...t, playedAt: item.played_at });
      }
    }

    // Cache at the edge for a minute so the site stays fast and within rate limits.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json({ nowPlaying, recent: recent.slice(0, 30) });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
