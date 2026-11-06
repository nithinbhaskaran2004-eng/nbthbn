/**
 * Single source of truth for the page content.
 * Edit this file to update the About / Projects / Contact pages
 * without touching any layout or styling code.
 */

export const profile = {
  name: "NITHIN BHASKARAN",
  initials: "NB",
  role: "Video Editor",
  cardRole: "Video Editor",
  location: "Remote · Worldwide",
  email: "nbthbn.media@gmail.com",
  photo: "/card-front.png",
  availability: "Available for work",
  tagline:
    "I'm not just an editor — I'm your creative brand partner.",
  bio: [
    "I'm not just an editor. I'm your creative brand partner.",
    "I'm a video editor obsessed with the **little things** that make a video **hit differently**.",
    "The **cut** that lands perfectly. The **sound** that changes everything. The **frame** that makes you **stop scrolling**.",
    "I work across **short-form content**, **cinematic edits**, **motion graphics**, and **visual storytelling**, turning raw footage and rough ideas into **something worth watching**.",
  ],
  stats: [
    { value: "1+", label: "Years editing" },
    { value: "30+", label: "Projects and counting" },
    { value: "∞", label: "Creative possibilities" },
  ],
  stack: [
    "DaVinci Resolve",
    "Adobe Premiere Pro",
    "Color Grading",
    "Sound Design",
    "Motion Graphics",
    "AI Video Generation",
  ],
  timeline: [
    {
      period: "2025 — Now",
      title: "Freelance Video Editor",
      place: "Independent",
      description:
        "Editing videos for creators and brands, specializing in short-form content, cinematic storytelling, motion graphics, sound design, and AI-assisted visual production.",
      icon: "briefcase",
    },
    {
      period: "2024 — 2025",
      title: "Creative Video Editor",
      place: "Creative Projects & Startups",
      description:
        "Created Instagram reels, promotional videos, explainers, motion graphics, typography animations, posters, and branded visual content for startups.",
      icon: "sparkles",
    },
    {
      period: "2022 — 2026",
      title: "Engineering Student",
      place: "New Horizon College of Engineering",
      description:
        "Built a technical foundation while editing and producing content for college fests and events — real deadlines, real teams, and a crash course in how things work in a formal environment.",
      icon: "graduation",
    },
  ],
};

/**
 * Project folders shown on the Projects page.
 *
 * Each folder opens a full-screen panel of video cards; clicking a card
 * opens the player. To add an edit, drop the file in public/videos and add
 * an entry to the folder's `videos` array. Folder labels, titles and copy
 * below are placeholders — rename them freely.
 */
export const projectFolders = [
  {
    id: "insta-reels",
    index: "01",
    label: "Insta Reels",
    kicker: "Vertical / Social",
    description:
      "Short-form vertical cuts built for the feed — tight pacing, punch-ins and cuts on the beat.",
    accent: "#c084fc",
    videos: [
      {
        id: "reel-01",
        title: "Reel 01",
        year: "2026",
        description:
          "A vertical edit cut for the feed — movement, clean pacing and a cut on the beat.",
        tags: ["Vertical", "Beat Sync", "Short Form"],
        portrait: true,
        src: "/videos/scrap_3.mp4",
      },
    ],
  },
  {
    id: "showreels",
    index: "02",
    label: "Showreels",
    kicker: "Selected Work",
    description:
      "A tighter cut of selected work — graded, sound-designed and paced like a trailer.",
    accent: "#a855f7",
    videos: [
      {
        id: "showreel-01",
        title: "Showreel 01",
        year: "2026",
        description:
          "Highlights from recent edits — mixed media, type and photography cut into one reel.",
        tags: ["Showreel", "Mixed Media", "Color Grade"],
        src: "/videos/scrap_1.mp4",
      },
    ],
  },
  {
    id: "motion-graphics",
    index: "03",
    label: "Motion Graphics",
    kicker: "Type / Shape / Motion",
    description:
      "Kinetic type, shape systems and transitions — movement studies built frame by frame.",
    accent: "#8b5cf6",
    videos: [
      {
        id: "motion-01",
        title: "Kinetic Type 01",
        year: "2026",
        description:
          "A kinetic type study built around scale, blur and hard cuts — every word on the beat.",
        tags: ["Motion", "Kinetic Type", "VFX"],
        src: "/videos/scrap_2.mp4",
      },
    ],
  },
  {
    id: "commercials",
    index: "04",
    label: "Commercials",
    kicker: "Brand / Product",
    description:
      "Product-led spots cut for social and broadcast, with clean pacing and a warm grade.",
    accent: "#7c3aed",
    videos: [
      {
        id: "commercial-01",
        title: "Product Spot 01",
        year: "2026",
        description:
          "A short product spot built from clean type, a cold blue grade and precise transitions.",
        tags: ["Commercial", "Product", "Grade"],
        src: "/videos/scrap_5.mp4",
      },
    ],
  },
  {
    id: "short-films",
    index: "05",
    label: "Short Films",
    kicker: "Narrative / Cinematic",
    description:
      "Character-led cuts with a cinematic grade — quiet moments, held frames and a story underneath.",
    accent: "#d8b4fe",
    videos: [
      {
        id: "short-film-01",
        title: "Short Film 01",
        year: "2026",
        description:
          "A black-and-white narrative short — held frames and a quiet, observational cut.",
        tags: ["Narrative", "Black & White", "Cinematic"],
        src: "/videos/scrap_4.mp4",
      },
    ],
  },
];

export const socials = [
  {
    id: "instagram",
    label: "Instagram",
    handle: "@nbthbn",
    href: "https://www.instagram.com/nbthbn/",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "in/nbthbn",
    href: "https://www.linkedin.com/in/nbthbn",
  },
  {
    id: "email",
    label: "Email",
    handle: "nbthbn.media@gmail.com",
    href: "mailto:nbthbn.media@gmail.com",
  },
];
