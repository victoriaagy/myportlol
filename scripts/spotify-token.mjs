#!/usr/bin/env node
/* One-time helper: gets a Spotify refresh token for /api/spotify.
 *
 *   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-token.mjs
 *
 * In your Spotify app settings, add this Redirect URI first:
 *   http://127.0.0.1:8888/callback
 * Then open the printed link, approve, and copy the refresh token it prints.
 */
import http from 'node:http';

const id = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET;
if (!id || !secret) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.');
  process.exit(1);
}

const REDIRECT = 'http://127.0.0.1:8888/callback';
const SCOPES = 'user-read-recently-played user-read-currently-playing';
const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  client_id: id, response_type: 'code', redirect_uri: REDIRECT, scope: SCOPES,
})}`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== '/callback') { res.writeHead(404).end(); return; }
  const code = url.searchParams.get('code');
  if (!code) { res.end(`Spotify returned: ${url.searchParams.get('error')}`); return; }

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT }),
  });
  const data = await tokenRes.json();
  if (!data.refresh_token) {
    res.end('Could not get a refresh token. Check the terminal.');
    console.error(data);
  } else {
    res.end('Done! Go back to your terminal.');
    console.log('\nSPOTIFY_REFRESH_TOKEN=' + data.refresh_token + '\n');
    console.log('Add that as an environment variable in Vercel (keep it secret).');
  }
  server.close();
});

server.listen(8888, '127.0.0.1', () => {
  console.log('Open this link in your browser and approve access:\n\n' + authUrl + '\n');
});
