import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Play, X } from "lucide-react";
import { videos } from "../data/portfolio";

const EASE = [0.22, 1, 0.36, 1];

function VideoCard({ video, index, onOpen }) {
  const [failed, setFailed] = useState(false);
  const previewRef = useRef(null);

  const startPreview = () => {
    const node = previewRef.current;
    if (!node) return;

    node.play().catch(() => {
      /* autoplay can be blocked — the click opens the full player anyway */
    });
  };

  const stopPreview = () => {
    const node = previewRef.current;
    if (!node) return;

    node.pause();
    node.currentTime = 0;
  };

  return (
    <motion.button
      type="button"
      className={`video-card${failed ? " is-missing" : ""}`}
      aria-label={failed ? `${video.title} — video missing` : `Play ${video.title}`}
      aria-disabled={failed || undefined}
      onClick={() => {
        if (failed) return;

        stopPreview();
        onOpen(video);
      }}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onFocus={startPreview}
      onBlur={stopPreview}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.06 * index, ease: EASE }}
    >
      <div className="video-thumb">
        {failed ? (
          <div className="video-fallback">
            <span className="video-fallback-title">Video not found</span>
            <code>{video.src}</code>
            <span className="video-fallback-hint">
              Drop the file into <code>public{video.src}</code>
            </span>
          </div>
        ) : (
          <>
            <video
              ref={previewRef}
              src={video.src}
              muted
              loop
              playsInline
              preload="metadata"
              tabIndex={-1}
              onError={() => setFailed(true)}
            />

            <span className="video-scrim" aria-hidden="true" />

            <span className="video-play" aria-hidden="true">
              <Play size={18} fill="currentColor" strokeWidth={0} />
            </span>

            <span className="video-duration-note" aria-hidden="true">
              Hover to preview
            </span>
          </>
        )}
      </div>

      <div className="video-meta">
        <div className="video-meta-top">
          <h3 className="video-title">{video.title}</h3>
          <span className="video-year">{video.year}</span>
        </div>

        <p className="video-desc">{video.description}</p>

        <div className="video-tags">
          {video.tags.map((tag) => (
            <span className="video-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

function VideoLightbox({ video, onClose }) {
  /* capture-phase Escape so closing the video does not also close the page */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      event.stopImmediatePropagation();
      onClose();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onClose]);

  /* keep the page behind the lightbox from scrolling */
  useEffect(() => {
    const body = document.querySelector(".page-body");
    if (!body) return;

    const previous = body.style.overflowY;
    body.style.overflowY = "hidden";

    return () => {
      body.style.overflowY = previous;
    };
  }, []);

  return createPortal(
    <motion.div
      className="video-lightbox"
      data-video-lightbox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${video.title} player`}
    >
      <motion.div
        className="video-lightbox-inner"
        initial={{ opacity: 0, y: 26, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.985 }}
        transition={{ duration: 0.35, ease: EASE }}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="video-lightbox-header">
          <div>
            <span className="page-eyebrow">
              // {video.year} · {video.tags[0]}
            </span>
            <h3 className="video-lightbox-title">{video.title}</h3>
          </div>

          <button
            type="button"
            className="page-close"
            onClick={onClose}
            aria-label="Close video"
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </header>

        <div className="video-player">
          <video
            key={video.id}
            src={video.src}
            controls
            autoPlay
            playsInline
            preload="auto"
          />
        </div>

        <footer className="video-lightbox-footer">
          <p>{video.description}</p>

          <div className="video-tags">
            {video.tags.map((tag) => (
              <span className="video-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </footer>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export default function ProjectsPage() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <>
      <p className="page-lede">
        Edits, reels and motion pieces I&apos;ve cut. Hover a card for a silent
        preview, click to watch with sound.
      </p>

      <div className="videos-grid">
        {videos.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            index={index}
            onOpen={setActiveVideo}
          />
        ))}
      </div>

      <AnimatePresence>
        {activeVideo && (
          <VideoLightbox
            key={activeVideo.id}
            video={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
