/* ============================================================
   config.js — everything personal lives here. Edit freely.
   ============================================================ */
const CONFIG = {
  name: 'Victoria Agyare',
  nickname: 'Tori', // what people call you; used in the casual spots
  school: 'Georgia State University',
  gradDate: 'May 2028',
  location: 'Atlanta, GA',

  profilePhoto: 'assets/profile.jpg', // small avatar: sign-in window + Messenger
  homePhoto: 'assets/home.jpg',    // big photo on the home page
  aboutPhoto: 'assets/about.jpg', // the Polaroid on the About page
  nightPhoto: '', // optional: a different home page photo while Nap mode is on
  // Your Messenger personal message (shown when you're not playing anything on Spotify)
  personalMessage: "i think i'm pretty cool, ngl",

  // Leave a link empty ('') to hide it everywhere on the site.
  links: {
    email: 'victoriaaehi@gmail.com', // the Messenger chat + contact form send here
    linkedin: 'https://www.linkedin.com/in/victoriaagyare',
    github: 'https://github.com/victoriaagy',
    spotify: '',   // e.g. 'https://open.spotify.com/user/your-id'
    pinterest: '', // e.g. 'https://www.pinterest.com/your-handle'
    resume: '',    // e.g. 'assets/resume.pdf' (tip: remove your phone number from the public copy)
  },

  degree: 'B.S. in Computer Science',
  gpa: '3.97 / 4.3', // set to '' to hide

  // Shown on the About + iPod pages. Links open a Spotify search unless you paste the artist's page.
  favoriteArtists: [
    { name: 'Malcolm Todd', url: '' },
    { name: 'The Marías', url: '' },
    { name: 'Radiohead', url: '' },
    { name: '2hollis', url: '' },
    { name: 'Rommulas', url: '' },
  ],

  hobbies: [
    { icon: '🧋', label: 'Boba', text: 'New York turned me into a boba person. Tiger brown sugar milk tea from Glaze Tea is the current favorite (see the Boba board on my Pins page).' },
    { icon: '🎧', label: 'Music', text: 'Malcolm Todd, The Marías, Radiohead, 2hollis and Rommulas are always in rotation. My iPod shows what I\'ve actually been playing.' },
    { icon: '📌', label: 'Pinterest', text: 'I can scroll Pinterest for hours: outfits, room ideas, anime edits. Some of it ends up on my moodboard.' },
    { icon: '🛍️', label: 'Vinted finds', text: 'Most of my free time goes to hunting for clothes on Vinted.' },
    { icon: '💤', label: 'Naps', text: 'A good nap is part of the routine. Try Nap mode in the menu bar.' },
    { icon: '⚔️', label: 'Anime', text: 'Attack on Titan (Eren is my favorite), Death Note, Jujutsu Kaisen, The Apothecary Diaries, Haikyuu!!, Your Lie in April and Erased. See the Anime tab.' },
    { icon: '🌅', label: 'Nature & sunsets', text: 'I love nature a lot, and I will always stop to take a picture of a good sunset. My favorites are on the Sunsets and Nature boards on my Pins page.' },
    { icon: '🍏', label: 'Apple', text: 'I love Apple: the old iPods, the Aqua buttons, the whole look. That\'s why this site is styled like apple.com in the early 2000s.' },
    { icon: '💻', label: 'Building', text: 'I build full-stack web apps with React, Next.js, Flask and Node.' },
  ],

  skills: {
    Languages: ['Python', 'JavaScript', 'Java', 'C', 'TypeScript', 'SQL', 'HTML', 'CSS'],
    'Frameworks & Libraries': ['React', 'Node.js', 'Next.js', 'Flask', 'Tailwind CSS', 'Prisma'],
    Databases: ['PostgreSQL', 'MySQL', 'Supabase'],
    'Developer Tools': ['Git', 'GitHub', 'VS Code', 'Figma', 'Trello', 'Vercel'],
  },

  experience: [
    { org: 'Sponsors for Educational Opportunity (SEO)', short: 'SEO', role: 'Tech Developer Intern', dates: 'May 2026 – July 2026', icon: '🗽',
      bullets: [
        'Completed 300+ hours of software engineering training in data structures, algorithms and full-stack web development through SEO\'s competitive Tech Developer program.',
        'Developed a full-stack web application with HTML, CSS, JavaScript, Flask and MySQL, building responsive frontend features on a Scrum team.',
        'Integrated REST APIs and authenticated workflows, using GitHub for version control and testing to cut post-deployment bug tickets by 20%.',
      ],
      // Photos live in assets/nyc/. Add more by appending { src, caption }.
      gallery: {
        title: 'SEO Tech Developer <tech devcon> · New York City',
        photos: [
          { src: 'assets/nyc/1-flight.jpg', caption: 'Flying ATL → Dallas → New York' },
          { src: 'assets/nyc/2-devcon.jpg', caption: 'SEO Tech Developer <tech devcon>' },
          { src: 'assets/nyc/3-badge.jpg', caption: 'My devcon badge: Tech Developer Student' },
          { src: 'assets/nyc/4-midtown.jpg', caption: 'Walking through Midtown Manhattan' },
          { src: 'assets/nyc/5-library.jpg', caption: 'New York Public Library' },
          { src: 'assets/nyc/6-flags.jpg', caption: 'Midtown at dusk' },
          { src: 'assets/nyc/7-i-love-ny.jpg', caption: 'I ❤ NY, on the sidewalk' },
          { src: 'assets/nyc/8-28th-street.jpg', caption: '28th Street subway station' },
          // Videos: an .mp4 (plus an optional .webm with the same name) and a poster image for the thumbnail
          { video: 'assets/nyc/9-statue-of-liberty.mp4', src: 'assets/nyc/9-statue-of-liberty-poster.jpg', caption: 'The Statue of Liberty at night, from the water' },
        ],
      } },
    { org: 'Management Leadership for Tomorrow (MLT)', short: 'MLT', role: 'Career Prep Tech Fellow', dates: 'March 2026 – Present', icon: '🎓',
      bullets: [
        'Selected for a competitive 18-month career development program with technical coaching, mentorship and professional development for emerging technology leaders.',
        'Engage with partner organizations including LinkedIn, Bloomberg and Deloitte through networking, career preparation and industry programming.',
      ] },
    { org: 'Programming Club at Georgia State University', short: 'Programming Club', role: 'Executive Board Member, Community Coordinator', dates: 'May 2026 – Present', icon: '👩🏾‍💻',
      bullets: [
        'Lead growth and engagement by organizing 10+ technical workshops, industry panels and wellness programs, raising member retention by 30% in a community of 75+ women in computer science.',
      ] },
    { org: 'RISE in Computing', short: 'RISE', role: 'Committee Member', dates: 'September 2025 – April 2026', icon: '🏅',
      bullets: [
        'Received the Outstanding Growth and Achievement Award and the Program Completion Award among a cohort of 50 students.',
        'Took part in 15+ technical workshops on software development and research, collaborating on coding projects and outreach to mentor and retain women in computer science.',
      ] },
  ],

  projects: [
    { name: 'Quest', badge: '1st Place · Cox Track', date: 'March 2026', art: 'art-gold',
      summary: 'A hackathon app that plans personalized multi-stop adventures from your preferences and location.',
      bullets: [
        'Interactive React frontend that captures preferences and geolocation, backed by Node.js, generating 50+ custom multi-stop itineraries.',
        'Google Maps API for dynamic routes and Gemini API recommendations across 5+ waypoints per trip.',
      ],
      tags: ['React', 'Node.js', 'Google Maps API', 'Gemini API'], link: '' },
    { name: 'Kindred', badge: '', date: 'July 2026', art: 'art-pink',
      summary: 'A social app with real-time messaging and secure user profiles.',
      bullets: [
        'Responsive Next.js + Tailwind CSS interfaces on a Supabase and Prisma backend managing profile data for 100+ test users.',
        'Real-time messaging with the Stream Chat API, with delivery latency consistently under 250 ms.',
      ],
      tags: ['Next.js', 'Tailwind CSS', 'Supabase', 'Prisma', 'Stream Chat'], link: '' },
    { name: 'Groundtruth', badge: '', date: 'July 2026', art: 'art-blue',
      summary: 'A data dashboard with an AI chat assistant for quick insights.',
      bullets: [
        'Next.js frontend that visualizes 500+ daily data points from public REST APIs with interactive trend cards and comparison views.',
        'AI chat interface powered by the Groq API, returning answers in under 1.5 seconds per query.',
      ],
      tags: ['Next.js', 'REST APIs', 'Groq API'], link: '' },
    { name: 'This Portfolio', badge: '', date: '2026', art: 'art-green',
      summary: 'A retro Messenger + early-2000s Apple portfolio with an iPod that plays my Spotify.',
      bullets: [
        'Vanilla HTML, CSS and JavaScript with a click-wheel iPod driven by the Spotify iFrame API.',
        'Serverless function on Vercel that reads my recently played songs from the Spotify Web API.',
      ],
      tags: ['JavaScript', 'HTML', 'CSS', 'Spotify API', 'Vercel'], link: 'https://github.com/victoriaagy/myportlol' },
  ],

  // Plays when a visitor clicks "Sign in". startAt is in seconds (68 = 1:08, where the
  // second half starts). Visitors not logged in to Spotify hear Spotify's 30-second preview instead.
  themeSong: {
    title: 'Lovebird', artist: 'Malcolm Todd',
    url: 'https://open.spotify.com/track/27K5vumkmzbBAjw3JMbcJ2',
    startAt: 68,
    playOnSignIn: true,
  },

  spotify: {
    // The serverless function in /api/spotify.js (see README → "Connect Spotify").
    apiUrl: '/api/spotify',
    // "Victoria's Picks" on the iPod. They play in this order after the theme song.
    // startAt (seconds) makes a song begin partway through, e.g. 95 = 1:35.
    picks: [
      { title: 'back & forth', artist: 'nate sib, 2hollis', url: 'https://open.spotify.com/track/6LK6tRsPgSZ3yKpY5zxrAw' },
      { title: 'The Peace', artist: 'underscores', url: 'https://open.spotify.com/track/6BnKiSuM1mWELxeRpyVufi' },
      { title: 'I Know You', artist: 'Faye Webster', url: 'https://open.spotify.com/track/71BWZa1liIRyUiuJ3MB66o' },
      // starts at the chorus, "erase me from here and set me free" (1:43)
      { title: 'homesick', artist: 'wave to earth', url: 'https://open.spotify.com/track/3pGoYGGOTvThnFcJpBh293', startAt: 103 },
      { title: 'Go Slowly', artist: 'Radiohead', url: 'https://open.spotify.com/track/6yiSyupeI7KYdBZKJdnIUO' },
      { title: 'Young Lion', artist: 'Sade', url: 'https://open.spotify.com/track/4RE2d0lbKxbndeTy73eu4d' },
    ],
  },

  // Pinterest-style moodboard. Put images in assets/pins/ and list them here, e.g.
  //   { src: 'assets/pins/my-fit.jpg', title: 'Vinted find', board: 'Fits' },
  // Boards only appear once they have at least one pin.
  boards: ['Me', 'Sunsets', 'Nature', 'Boba', 'Fits', 'Anime', 'Music', 'Mood'],
  pins: [
    { src: 'assets/pins/sunset-street.jpg', title: 'That sky', board: 'Sunsets' },
    { src: 'assets/pins/boba-glaze.jpg', title: 'Tiger brown sugar milk tea', board: 'Boba' },
    { src: 'assets/pins/nature-fall-downtown.jpg', title: 'Fall colors downtown', board: 'Nature' },
    { src: 'assets/pins/meme-whole-point.jpg', title: 'Almost forgot this is the whole point ❤️', board: 'Mood' },
    { src: 'assets/pins/sunset-plane.jpg', title: 'Sunset from the window seat', board: 'Sunsets', ratio: 0.75 }, // ratio = height / width, for landscape photos
    { src: 'assets/pins/nature-summer-tree.jpg', title: 'Big tree, summer day', board: 'Nature' },
    { src: 'assets/pins/sunset-moon-palms.jpg', title: 'Moon over the palms', board: 'Sunsets' },
    { src: 'assets/pins/nature-rainbow.jpg', title: 'Rainbow after the rain', board: 'Nature' },
    { src: 'assets/pins/boba-mixue.jpg', title: 'Pearl milk tea from Mixue', board: 'Boba' },
    { src: 'assets/pins/boba-bubble-milk-tea.jpg', title: 'Bubble milk tea, 70% sweet', board: 'Boba' },
    { src: 'assets/pins/boba-tiger.jpg', title: 'Glaze Tea, round two', board: 'Boba' },
    { src: 'assets/pins/nature-late-fall.jpg', title: 'Late fall', board: 'Nature' },
    { src: 'assets/pins/sunset-silhouettes.jpg', title: 'Tree silhouettes at dusk', board: 'Sunsets', ratio: 0.75 },
  ],

  // Cover art loads from AniList (https://anilist.co) using `search`.
  // To use your own image instead, add  cover: 'assets/anime/name.jpg'  to a show.
  anime: [
    { title: 'Attack on Titan', search: 'Shingeki no Kyojin', cover: 'assets/anime/attack-on-titan.jpg', theme: 'aot', tag: 'All-time favorite', status: 'Watching',
      facts: ['Wit Studio / MAPPA', '2013–2023', 'Action · Dark fantasy'],
      favorite: 'Eren',
      note: 'Fun fact: I haven\'t watched the finale yet.' },
    { title: 'Death Note', search: 'Death Note', cover: 'assets/anime/death-note.jpg', theme: 'dn', tag: 'Classic', status: 'Completed',
      facts: ['Madhouse', '2006–2007 · 37 episodes', 'Psychological thriller'],
      favorite: '', note: '' },
    { title: 'Jujutsu Kaisen', search: 'Jujutsu Kaisen', cover: 'assets/anime/jujutsu-kaisen.jpg', theme: 'jjk', tag: 'Currently watching', status: 'Watching',
      facts: ['MAPPA', '2020–present', 'Action · Supernatural'],
      favorite: '', note: '' },
    { title: 'The Apothecary Diaries', search: 'Kusuriya no Hitorigoto', cover: 'assets/anime/apothecary-diaries.jpg', theme: 'ad', tag: 'Palace mysteries', status: '',
      facts: ['TOHO animation Studio / OLM', '2023–present', 'Mystery · Historical drama'],
      favorite: '', note: '' },
    { title: 'Haikyuu!!', search: 'Haikyuu!!', cover: 'assets/anime/haikyuu.jpg', theme: 'hq', tag: 'Volleyball', status: '',
      facts: ['Production I.G', '2014–2020', 'Sports'],
      favorite: '', note: '' },
    { title: 'Your Lie in April', search: 'Shigatsu wa Kimi no Uso', cover: 'assets/anime/your-lie-in-april.jpg', theme: 'lie', tag: 'Music & heartbreak', status: '',
      facts: ['A-1 Pictures', '2014–2015 · 22 episodes', 'Drama · Music'],
      favorite: '', note: '' },
    { title: 'Erased', search: 'Boku dake ga Inai Machi', cover: 'assets/anime/erased.jpg', theme: 'erased', tag: 'Time-travel thriller', status: '',
      facts: ['A-1 Pictures', '2016 · 12 episodes', 'Mystery · Thriller'],
      favorite: '', note: '' },
  ],
};
