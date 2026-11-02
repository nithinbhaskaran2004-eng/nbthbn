/**
 * Single source of truth for the page content.
 * Edit this file to update the About / Projects / Contact pages
 * without touching any layout or styling code.
 */

export const profile = {
  name: "NBTHBN",
  initials: "NB",
  role: "Full-Stack Developer",
  location: "Remote · Worldwide",
  email: "hello@nbthbn.dev",
  photo: "/profile.jpg",
  availability: "Available for work",
  tagline:
    "I build fast, tactile interfaces where design and engineering meet.",
  bio: [
    "I'm a developer who cares about the details — the weight of a transition, the rhythm of a layout, and the way an interface feels under your hands.",
    "Most of my work lives somewhere between design and engineering: React front-ends, thoughtful design systems, and the occasional 3D experiment in the browser.",
  ],
  stats: [
    { value: "3+", label: "Years building" },
    { value: "24", label: "Projects shipped" },
    { value: "∞", label: "Cups of coffee" },
  ],
  stack: [
    {
      group: "Frontend",
      items: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Three.js"],
    },
    {
      group: "Backend",
      items: ["Node.js", "Express", "PostgreSQL", "REST APIs"],
    },
    {
      group: "Tooling",
      items: ["Vite", "Git", "Figma", "Motion"],
    },
  ],
  timeline: [
    {
      period: "2024 — Now",
      title: "Freelance Developer",
      place: "Independent",
      description:
        "Designing and shipping portfolio sites, dashboards and interactive experiences for small teams.",
      icon: "briefcase",
    },
    {
      period: "2023 — 2024",
      title: "Frontend Engineer",
      place: "Product studio",
      description:
        "Built component libraries and improved performance across multiple client products.",
      icon: "briefcase",
    },
    {
      period: "2021 — 2023",
      title: "Computer Science",
      place: "University",
      description:
        "Studied the fundamentals, then spent most nights building things that weren't on the syllabus.",
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
    href: "https://www.instagram.com/",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "in/nbthbn",
    href: "https://www.linkedin.com/",
  },
  {
    id: "email",
    label: "Email",
    handle: "hello@nbthbn.dev",
    href: "mailto:hello@nbthbn.dev",
  },
];
