# Victoria Agyare · Retro Portfolio ✿

A 2000s-inspired portfolio: you sign in through a Messenger-style window, then land on a portfolio styled like apple.com in 2001. The main navigation focuses on About, Experience, and Projects, with music, photos, and anime grouped under **For fun**. A tiny Command-key charm adds a Mac-inspired wink to the home page.

Plain HTML, CSS and JavaScript, with no build step.

## Run it on your computer

1. Install [Node.js](https://nodejs.org) (the "LTS" version) if you don't have it.
2. Open Terminal in this folder and run:
   ```bash
   npm start
   ```
3. Visit **http://localhost:3000**. Press `Ctrl + C` in Terminal to stop.

Friends on the **same Wi-Fi** can open the "Network" address `serve` prints (like `http://192.168.1.23:3000`) while your laptop is on. For anyone else, deploy it (below).

## Share it online (free, about 5 minutes)

1. Go to <https://vercel.com/new> and sign in with GitHub.
2. Import the **myportlol** repository. Leave every setting as it is and click **Deploy**.
3. You get a public link like `https://myportlol.vercel.app`. Rename it under **Settings → Domains** (e.g. `tori-agyare.vercel.app`).

Every push to GitHub updates the live site automatically. The music (your picks and theme song) works right away; follow "Connect Spotify" below to also show what you've actually been listening to.

## Editing content

Almost everything personal is in **`js/config.js`**: links, bio facts, skills, experience, projects, favorite artists, hobbies, pins and anime. The "About" copy and the For fun page links are in `index.html`.

| What | How |
| --- | --- |
| NYC conference photos | Put them in `assets/nyc/` and set each `src` under `experience → gallery` in `config.js` |
| Theme song (plays on Sign in) | `themeSong` in `config.js`: Spotify link plus `startAt` in seconds |
| Moodboard pins | Put images in `assets/pins/`, then add `src: 'assets/pins/name.jpg'` to a pin (or add new ones). Pins without `src` show as color tiles |
| Pinterest / Spotify profile links | `links.pinterest`, `links.spotify` |
| Résumé | Add a PDF to `assets/` and set `links.resume`. Consider removing your phone number from the public copy first |
| Project links | `projects → link` |
| Anime details | `anime → favorite`, `note` |

## Connect Spotify (recently played + now playing)

Your Spotify login has to stay secret, so it lives in a small serverless function (`api/spotify.js`) instead of the browser.

1. Go to <https://developer.spotify.com/dashboard>, create an app, and add this Redirect URI: `http://127.0.0.1:8888/callback`. Select "Web API".
2. Copy the app's **Client ID** and **Client Secret**, then run this once on your computer (Node 18+):
   ```bash
   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-token.mjs
   ```
   Open the link it prints, click Agree, and copy the `SPOTIFY_REFRESH_TOKEN` it prints.
3. Import this repo at <https://vercel.com/new>. Under **Environment Variables**, add `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and `SPOTIFY_REFRESH_TOKEN`, then deploy.

The iPod then shows **Listening Now** and **Recently Played** (refreshed every minute) and plays songs through Spotify's official embedded player. Visitors logged in to Spotify hear full songs; everyone else hears previews.

No Vercel? Paste Spotify track links into `spotify.picks` in `config.js`. They play through the same Spotify player without the API.

## What's in here

- `index.html`: page structure
- `css/style.css`: all styling, including Nap mode
- `js/config.js`: your content
- `js/app.js`: sign-in, pages, Messenger, moodboard, projects, Spotify data
- `js/ipod.js`: the iPod and Spotify player control
- `js/chiptune.js`: demo songs generated in the browser (used before Spotify is connected)
- `js/sfx.js`: sound effects
- `api/spotify.js`: serverless Spotify endpoint
- `scripts/spotify-token.mjs`: one-time refresh token helper
