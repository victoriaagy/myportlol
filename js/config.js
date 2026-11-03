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
  homePhoto: 'assets/home-portrait.jpg',    // big photo on the home page
  aboutPhoto: 'assets/home-portrait.jpg', // the Polaroid on the About page
  nightPhoto: '', // optional: a different home page photo while Nap mode is on
  // Your Messenger personal message (shown when you're not playing anything on Spotify)
  personalMessage: "i think i'm pretty cool, ngl",

  // Web3Forms access key: messages from the Messenger chat and Contact form are
  // emailed to you (web3forms.com). It only allows sending *to* your inbox, so it's
  // safe to have in the page. Leave '' to fall back to opening the visitor's email app.
  messageKey: '8a83ce84-804e-40bd-a5b5-617b90035e20',

  // Leave a link empty ('') to hide it everywhere on the site.
  links: {
    email: 'victoriaaehi@gmail.com', // shown only on the Contact page
    linkedin: 'https://www.linkedin.com/in/victoriaagyare',
    github: 'https://github.com/victoriaagy',
    spotify: '',   // e.g. 'https://open.spotify.com/user/your-id'
    pinterest: '', // e.g. 'https://www.pinterest.com/your-handle'
    resume: '',    // e.g. 'assets/resume.pdf' (tip: remove your phone number from the public copy)
  },

  degree: 'B.S. in Computer Science',
  gpa: '3.97 / 4.0', // set to '' to hide

  // Shown on the About + iPod pages. Links open a Spotify search unless you paste the artist's page.
  favoriteArtists: [
    { name: 'Malcolm Todd', url: '' },
    { name: 'The Marías', url: '' },
    { name: 'Radiohead', url: '' },
    { name: '2hollis', url: '' },
    { name: 'Rommulas', url: '' },
  ],

  hobbies: [
    { icon: '🛒', label: 'Buying stuff I don’t need', text: "Most of the time you’ll catch me buying a new digicam or a Smiski lol." },
    { icon: '🧋', label: 'Boba', text: "New York turned me into a boba person. My favorite right now is the tiger brown sugar milk tea from Glaze Tea." },
    { icon: '🎧', label: 'Music', text: "Malcolm Todd, The Marías, Radiohead, 2hollis and Rommulas are always in rotation. You can listen on the iPod tab." },
    { icon: '📌', label: 'Pinterest', text: "I can scroll Pinterest for hours. Mostly outfits, room ideas, and anime edits." },
    { icon: '🛍️', label: 'Vinted finds', text: "Usually on Vinted looking for clothes." },
    { icon: '💤', label: 'Naps', text: "I love a good nap. There’s a Nap button on the little iPhone too." },
    { icon: '⚔️', label: 'Anime', text: "Attack on Titan (Eren is my favorite), Death Note, Jujutsu Kaisen, The Apothecary Diaries, Haikyuu!!, Your Lie in April and Erased." },
    { icon: '🌅', label: 'Nature & sunsets', text: "I love being outside, and I’ll always stop to take a sunset picture. Some of them are in my camera roll." },
    { icon: '🍏', label: 'Apple', text: "I’ve loved Apple since I was a kid. The old iPods and early-2000s look inspired this portfolio." },
    { icon: '💻', label: 'Building', text: "I build apps with React, Next.js, Flask and Node. Making them look good is my favorite part." },
  ],

  skills: {
    "Languages": [
      "Python",
      "TypeScript",
      "JavaScript",
      "Java",
      "C",
      "C++",
      "SQL",
      "HTML",
      "CSS"
    ],
    "Frameworks & Libraries": [
      "React",
      "Node.js",
      "Next.js",
      "Flask",
      "Tailwind CSS",
      "Prisma"
    ],
    "Databases": [
      "PostgreSQL",
      "MySQL",
      "Supabase"
    ],
    "Developer Tools": [
      "Git",
      "GitHub",
      "VS Code",
      "Figma",
      "Trello",
      "Vercel"
    ]
  },

  experience: [
    {
      "org": "Sponsors for Educational Opportunity (SEO)",
      "short": "SEO",
      "role": "Tech Developer Intern",
      "dates": "May 2026 – July 2026",
      "icon": "🗽",
      "bullets": [
        "Spent 300+ hours learning data structures, algorithm optimization, and full-stack web development.",
        "Built a full-stack app with REST APIs and secure user workflows. Server-side validation helped reduce bug tickets after deployment by 20%.",
        "Built reusable React components with hooks and Context API and connected them to backend services, helping the team ship features 15% faster."
      ],
      "gallery": {
        "title": "SEO Tech Developer <tech devcon> · New York City",
        "photos": [
          {
            "src": "assets/nyc/1-flight.jpg",
            "caption": "Flying ATL → Dallas → New York"
          },
          {
            "src": "assets/nyc/2-devcon.jpg",
            "caption": "SEO Tech Developer <tech devcon>"
          },
          {
            "src": "assets/nyc/3-badge.jpg",
            "caption": "My devcon badge: Tech Developer Student"
          },
          {
            "src": "assets/nyc/4-midtown.jpg",
            "caption": "Walking through Midtown Manhattan"
          },
          {
            "src": "assets/nyc/5-library.jpg",
            "caption": "New York Public Library"
          },
          {
            "src": "assets/nyc/6-flags.jpg",
            "caption": "Midtown at dusk"
          },
          {
            "src": "assets/nyc/7-i-love-ny.jpg",
            "caption": "I ❤ NY, on the sidewalk"
          },
          {
            "src": "assets/nyc/8-28th-street.jpg",
            "caption": "28th Street subway station"
          },
          {
            "video": "assets/nyc/9-statue-of-liberty.mp4",
            "src": "assets/nyc/9-statue-of-liberty-poster.jpg",
            "caption": "The Statue of Liberty at night, from the water"
          }
        ]
      }
    },
    {
      "org": "Programming Club at Georgia State University (progsu)",
      "short": "Programming Club",
      "role": "Executive Board Member & Community Coordinator",
      "dates": "May 2026 – Present",
      "icon": "👩🏾‍💻",
      "bullets": [
        "Helped organize Hacklanta II, a 36-hour hackathon with 1,000+ student attendees. I worked on event logistics and technical workshops.",
        "Promoted the club across multiple channels, helping increase active member engagement by 40% across the CS department."
      ],
      "gallery": {
        "title": "Behind the scenes at Hacklanta II · October 2026",
        "photos": [
          {
            "src": "assets/hacklanta/organizing-team.jpg",
            "video": "assets/hacklanta/organizing-team.mp4",
            "caption": "hacklanta group pic!! (spot me lol)"
          },
          {
            "src": "assets/hacklanta/staff-badges.jpg",
            "caption": "coolest staff badges ever"
          },
          {
            "src": "assets/hacklanta/community.jpg",
            "caption": "helped run progirls tabling with cool bracelets"
          },
          {
            "src": "assets/hacklanta/ceremony.jpg",
            "caption": "A full house at the ceremony"
          },
          {
            "src": "assets/hacklanta/closing-ceremony.jpg",
            "caption": "Ready for the closing ceremony"
          }
        ]
      }
    },
    {
      "org": "Management Leadership for Tomorrow (MLT)",
      "short": "MLT",
      "role": "Career Prep Tech Fellow",
      "dates": "March 2026 – Present",
      "icon": "🎓",
      "bullets": [
        "Selected for an 18-month career prep program with technical coaching, mentorship, and professional development.",
        "Take part in networking and career prep with partner organizations including LinkedIn, Bloomberg, and Deloitte."
      ]
    },
    {
      "org": "SEO Career",
      "short": "SEO EDGE",
      "role": "SEO EDGE Participant",
      "dates": "August 2026 – Present",
      "icon": "💼",
      "bullets": [
        "Work on interview prep and core business concepts through coaching for internship recruiting.",
        "Take industry-specific training to build my technical skills and learn more about the roles I’m interested in."
      ]
    },
    {
      "org": "RISE in Computing",
      "short": "RISE",
      "role": "Committee Member",
      "dates": "September 2025 – April 2026",
      "icon": "🏅",
      "bullets": [
        "Received the Outstanding Growth and Achievement Award and the Program Completion Award in a cohort of 50 students.",
        "Attended 15+ software development and research workshops, worked on coding projects, and helped with outreach and mentoring for women in CS."
      ]
    }
  ],

  projects: [
    {
      "name": "Quest",
      "gallery": [{"src":"assets/projects/quest-home.png","caption":"Quest · your boredom slayer"},{"src":"assets/projects/quest-mission.png","caption":"Quest · choose your time and activities to plan an adventure"}],
      "badge": "1st Place · Social Good Track",
      "date": "March 2026",
      "art": "art-gold",
      "summary": "An app for when you want to go out but don’t know what to do. It plans a multi-stop trip in under two minutes.",
      "bullets": [
        "Built a React (Vite) frontend for a travel-routing platform, winning 1st place in the Social Good track at Hacklanta I.",
        "Created an interactive itinerary timeline and location-aware routes using the Google Maps JavaScript, Places and Geocoding APIs with a Node.js backend for 3–5 customized stops."
      ],
      "tags": [
        "React",
        "Vite",
        "Node.js",
        "Google Maps API"
      ],
      "link": ""
    },
    {
      "name": "Kindred",
      "gallery": [{"src":"assets/projects/kindred-home.png","caption":"Kindred · meet people at your own pace"},{"src":"assets/projects/kindred-how-it-works.png","caption":"Kindred · from shared interests to building confidence"}],
      "badge": "",
      "date": "July 2026",
      "art": "art-pink",
      "summary": "A place to practice meeting people at your own pace, with live chat and games.",
      "bullets": [
        "Built responsive, accessible interfaces with Next.js 16 and Tailwind CSS.",
        "Used Supabase Realtime (PostgreSQL) to keep chat and games in sync, with message latency under 50 ms for 20+ users at once.",
        "Used React Hook Form and Zod to manage the onboarding forms and check inputs before submission."
      ],
      "tags": [
        "Next.js",
        "Tailwind CSS",
        "Supabase",
        "PostgreSQL",
        "React Hook Form",
        "Zod"
      ],
      "link": ""
    },
    {
      "name": "Groundtruth",
      "gallery": [{"src":"assets/projects/groundtruth-home.png","caption":"Groundtruth · global progress beyond the headlines"}],
      "badge": "",
      "date": "July 2026",
      "art": "art-blue",
      "summary": "A dashboard for looking at global progress, with a 3D globe and a chat where you can ask about the data.",
      "bullets": [
        "Used Next.js and React Server Components to reduce initial page load times by 30%.",
        "Built a dynamic 3D globe and trend visualizations with data from OWID and GDELT public REST APIs.",
        "Added a chat using the Groq API (Llama 3) so users can ask about the data and get answers in under 1.5 seconds."
      ],
      "tags": [
        "Next.js",
        "React",
        "REST APIs",
        "Groq API"
      ],
      "link": ""
    },
    {
      "name": "This Portfolio",
      "badge": "",
      "date": "2026",
      "art": "art-green",
      "summary": "My take on early-2000s Apple, with an iPod for my music and a camera roll for everything else.",
      "bullets": [
        "Vanilla HTML, CSS and JavaScript with an Aqua desktop and click-wheel iPod driven by the Spotify iFrame API.",
        "Serverless function on Vercel that reads my recently played songs from the Spotify Web API."
      ],
      "tags": [
        "JavaScript",
        "HTML",
        "CSS",
        "Spotify API",
        "Vercel"
      ],
      "link": "https://github.com/victoriaagy/myportlol"
    }
  ],

  // Plays when a visitor clicks "Sign in". startAt is in seconds (68 = 1:08, where the
  // second half starts). Visitors not logged in to Spotify hear Spotify's 30-second preview instead.
  themeSong: {
    title: 'Lovebird', artist: 'Malcolm Todd',
    url: 'https://open.spotify.com/track/27K5vumkmzbBAjw3JMbcJ2',
    startAt: 68,
    playOnSignIn: false,
  },

  spotify: {
    // The serverless function in /api/spotify.js (see README → "Connect Spotify").
    apiUrl: '/api/spotify',
    // "Victoria's Picks" on the iPod. They play in this order after the theme song.
    // startAt (seconds) makes a song begin partway through, e.g. 95 = 1:35.
    picks: [
      {"title":"Back To You","artist":"Not For Radio","url":"https://open.spotify.com/track/47rCs1JJXC6AG20WKbyOUR"},
      {"title":"Please Do Not Lean","artist":"Daniel Caesar, BADBADNOTGOOD","url":"https://open.spotify.com/track/0BYuy4jQEMJzyo6rySSQpC","startAt":120},
      {"title":"X's & O's","artist":"Malcolm Todd","url":"https://open.spotify.com/track/6uODtGnQWkgxFFEwPgd2LZ"},
      {"title":"the feeling","artist":"Steve Lacy","url":"https://open.spotify.com/track/3SoarlzPEiF7NgSeGsh44S"},
      {"title":"show you me","artist":"Steve Lacy","url":"https://open.spotify.com/track/4f50UTC41M2Ah5itifSGE5"},
      {"title":"Powerlines","artist":"beabadoobee, Brendan Yates","url":"https://open.spotify.com/track/7uvsxYvJwAGTdxMNJrgtbQ"},
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
    { src: 'assets/pins/hacklanta-nash-sweeya.jpg', title: 'big presi nash, sweeyaa & me!!', board: 'Me', ratio: 0.66625 },
    { src: 'assets/pins/natural-aegyo.jpg', title: 'a little aegyo for the camera lol', board: 'Me', ratio: 0.66625 },
    { src: 'assets/pins/sunset-street.jpg', title: 'That sky', board: 'Sunsets' },
    { src: 'assets/pins/boba-glaze.jpg', title: 'Tiger brown sugar milk tea', board: 'Boba' },
    { src: 'assets/pins/nature-fall-downtown.jpg', title: 'Fall colors downtown', board: 'Nature' },
    { src: 'assets/pins/meme-whole-point.jpg', title: 'Almost forgot this is the whole point ❤️', board: 'Mood' },
    { src: 'assets/pins/sunset-plane.jpg', title: 'your usual window seat pic', board: 'Sunsets', ratio: 0.75 }, // ratio = height / width, for landscape photos
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
