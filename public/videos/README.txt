DROP YOUR VIDEO FILES HERE
==========================

The Projects page is folder-based. Each folder opens a grid of video cards,
and clicking a card opens the player.

Current folders (edit labels, titles and copy in src/data/portfolio.js):

  Insta Reels ..... scrap_3.mp4   (vertical, 1080 x 1920)
  Showreels ....... scrap_1.mp4   (1080 x 608)
  Motion Graphics . scrap_2.mp4   (square, 1080 x 1080)
  Commercials ..... scrap_5.mp4   (1920 x 1080)
  Short Films ..... scrap_4.mp4   (1920 x 1080)

They are referenced as /videos/<name>.mp4, so this folder maps to /videos/ on
the site. Each clip has a matching poster image (scrap_1.jpg … scrap_5.jpg)
that is shown before the video starts.

The original masters are kept in /media-source at the project root. The files
in this folder are web-optimised H.264 copies.

Adding an edit
--------------
Drop the file in this folder, then add an entry to that folder's `videos`
array in src/data/portfolio.js:

  {
    id: "reel-02",
    title: "Reel 02",
    year: "2026",
    description: "One or two lines about the cut.",
    tags: ["Vertical", "Beat Sync"],
    portrait: true,                 // optional: crops portrait thumbnails
    src: "/videos/your-file.mp4",
  }

Also add a poster next to it as /videos/your-file.jpg for the best result.

Tips
----
- Use H.264 MP4 (the most widely supported codec in browsers).
- Keep each file under ~30 MB so the page stays fast. The current five total
  about 72 MB.
- 16:9 clips fill the card thumbnails perfectly; vertical 9:16 reels still
  play correctly in the player (letterboxed on black).
- Hovering a card plays a muted preview; clicking opens the full player.
