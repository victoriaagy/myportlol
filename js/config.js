/* ============================================================
   config.js — everything personal lives here. Edit freely.
   ============================================================ */
const CONFIG = {
  name: 'Victoria Agyare',
  school: 'Georgia State University',
  gradDate: 'May 2028',
  location: 'Atlanta, GA',

  profilePhoto: 'assets/profile.jpg',
  aboutPhoto: 'assets/about.jpg', // the Polaroid on the About page

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
  ],

  hobbies: [
    { icon: '🎧', label: 'Music on repeat', text: 'Malcolm Todd, The Marías and Radiohead are always in rotation. My iPod shows what I\'ve actually been playing.' },
    { icon: '📌', label: 'Pinterest', text: 'I can scroll Pinterest for hours: outfits, room ideas, anime edits. Some of it ends up on my moodboard.' },
    { icon: '🛍️', label: 'Vinted finds', text: 'Most of my free time goes to hunting for clothes on Vinted.' },
    { icon: '💤', label: 'Naps', text: 'A good nap is part of the routine. Try Nap mode in the menu bar.' },
    { icon: '⚔️', label: 'Anime', text: 'Attack on Titan, Death Note and Jujutsu Kaisen are my favorites.' },
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
          { src: 'assets/nyc/5-28th-street.jpg', caption: '28th Street subway station' },
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

  spotify: {
    // The serverless function in /api/spotify.js (see README → "Connect Spotify").
    apiUrl: '/api/spotify',
    // Optional: songs to use if the API isn't set up yet. Paste Spotify track links:
    // { title: 'Song', artist: 'Artist', url: 'https://open.spotify.com/track/...' },
    picks: [
    ],
  },

  // Pinterest-style moodboard. Put images in assets/pins/ and list them here.
  // Pins without an image show as a colored tile.
  boards: ['Fits', 'Aesthetic', 'Anime', 'Music', 'Campus'],
  pins: [
    { title: 'Vinted finds', board: 'Fits', colors: ['#6f8fb8', '#c7d6ea'], h: 300 },
    { title: 'Soft pink mornings', board: 'Aesthetic', colors: ['#ffd6e8', '#ffeef5'], h: 260 },
    { title: 'Survey Corps', board: 'Anime', colors: ['#5b7a3a', '#9fb87a'], h: 340 },
    { title: 'Vinyl corner', board: 'Music', colors: ['#2b2b2b', '#7a6a5a'], h: 220 },
    { title: 'Downtown Atlanta', board: 'Campus', colors: ['#0039a6', '#7fa6ec'], h: 300 },
    { title: 'Nap spot', board: 'Aesthetic', colors: ['#c9d8ff', '#f3f0ff'], h: 200 },
    { title: 'Gojo', board: 'Anime', colors: ['#3b2a78', '#b99bff'], h: 280 },
    { title: 'The Marías on vinyl', board: 'Music', colors: ['#8a1d2c', '#e07a86'], h: 320 },
    { title: 'Study desk', board: 'Campus', colors: ['#e9dcc7', '#fff7ea'], h: 240 },
    { title: 'Vintage tee', board: 'Fits', colors: ['#b8a07a', '#efe3cc'], h: 250 },
    { title: 'Death Note', board: 'Anime', colors: ['#050505', '#555555'], h: 230 },
    { title: 'Golden hour', board: 'Aesthetic', colors: ['#ffb46b', '#ffe3b8'], h: 330 },
    { title: 'In Rainbows', board: 'Music', colors: ['#f2a93b', '#6fb3ee'], h: 260 },
    { title: 'Layered fit', board: 'Fits', colors: ['#3d3a36', '#a39a8e'], h: 330 },
    { title: 'Library nights', board: 'Campus', colors: ['#1d2a3a', '#58718f'], h: 210 },
  ],

  anime: [
    { title: 'Attack on Titan', theme: 'aot', tag: 'All-time favorite', status: 'Completed',
      facts: ['Wit Studio / MAPPA', '2013–2023', 'Action · Dark fantasy'],
      favorite: '', // e.g. 'Levi'
      note: '' },   // e.g. why you love it
    { title: 'Death Note', theme: 'dn', tag: 'Classic', status: 'Completed',
      facts: ['Madhouse', '2006–2007 · 37 episodes', 'Psychological thriller'],
      favorite: '', note: '' },
    { title: 'Jujutsu Kaisen', theme: 'jjk', tag: 'Currently watching', status: 'Watching',
      facts: ['MAPPA', '2020–present', 'Action · Supernatural'],
      favorite: '', note: '' },
  ],
};
