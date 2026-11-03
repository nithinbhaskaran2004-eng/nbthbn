/**
 * Like counter storage.
 *
 * The site is static, so a real shared count needs a tiny backend.
 * Set VITE_LIKES_ENDPOINT to enable it:
 *
 *   GET  <endpoint>            -> { "count": 42 }
 *   POST <endpoint> {delta:1}  -> { "count": 43 }   (delta is 1 or -1)
 *
 * Without it, likes are kept in the visitor's localStorage so the button
 * still works locally — the count just isn't shared between devices.
 */

const ENDPOINT = (import.meta.env.VITE_LIKES_ENDPOINT ?? "").replace(/\/+$/, "");
const STORAGE_KEY = "nbthbn:likes";

export const likesAreLive = Boolean(ENDPOINT);

function readLocal() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, liked: false };

    const parsed = JSON.parse(raw);
    return {
      count: Number.isFinite(parsed?.count) ? Math.max(0, parsed.count) : 0,
      liked: Boolean(parsed?.liked),
    };
  } catch {
    return { count: 0, liked: false };
  }
}

function writeLocal(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage blocked — nothing we can do */
  }
}

async function request(url, options) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    ...options,
  });

  if (!response.ok) throw new Error(`Likes request failed: ${response.status}`);

  const data = await response.json();
  const count = Number(data?.count);

  if (!Number.isFinite(count)) throw new Error("Likes response missing count");

  return count;
}

export async function loadLikes() {
  const local = readLocal();

  if (!ENDPOINT) return { ...local, live: false };

  try {
    const count = await request(ENDPOINT);
    return { count, liked: local.liked, live: true };
  } catch {
    return { ...local, live: false };
  }
}

export async function refreshLikeCount() {
  if (!ENDPOINT) return null;

  try {
    return await request(ENDPOINT);
  } catch {
    return null;
  }
}

export async function persistLike(liked, count) {
  writeLocal({ liked, count });

  if (!ENDPOINT) return;

  try {
    await request(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ liked, delta: liked ? 1 : -1 }),
    });
  } catch {
    /* keep the optimistic UI; local storage still remembers the choice */
  }
}
