# Victoria Agyare · Retro Portfolio ✿

A 2000s-inspired portfolio: you sign in through a Messenger-style login window, then land on a portfolio styled like apple.com in 2001, with a working click-wheel iPod.

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

It also works on GitHub Pages: Settings → Pages → deploy from branch, root folder.

## Making it yours

| What | Where |
| --- | --- |
| Profile photo | Put your photo in `assets/` (e.g. `assets/profile.jpg`) and set `PROFILE_PHOTO` at the top of `js/app.js` |
| LinkedIn / GitHub / email / résumé | `SOCIAL_LINKS` in `js/app.js` (the contact form sends to the email you set) |
| Your songs on the iPod | Put `.mp3` files in `music/` and list them in `MY_SONGS` at the top of `js/ipod.js` |
| About blurb, projects | `index.html` (sections `data-page="about"` and `data-page="projects"`) |
| Hot News headlines | `HEADLINES` in `js/app.js` |
| Buddy list characters and replies | `CONTACTS` in `js/app.js` |

## What's in here

- **Sign-in screen**: avatar with a status glow, a working "Sign in as" status picker, a signing-in spinner, and a sign-in chime.
- **Portfolio**: Aqua tabs, a rotating Hot News ticker, promo boxes, an "About" page built around a spinning disc, a Projects page, anime flip cards with a poll, and a Mail-style contact form.
- **iPod**: drag around the click wheel to scroll (or use the mouse wheel or arrow keys). It has Songs, Artists, Shuffle, Now Playing (scroll to change volume), Settings (repeat, backlight, clicker), and a button to add your own songs. Five original chiptunes are generated in the browser so it plays something out of the box.
- **Messenger buddy list**: anime characters you can chat with (they reply), nudges that shake the window, winks, and an editable personal message that switches to "♫ now playing" while music is on.

Files: `index.html`, `css/style.css`, `js/app.js` (sign-in, pages, messenger), `js/ipod.js` (player), `js/chiptune.js` (song generator), `js/sfx.js` (sound effects).
