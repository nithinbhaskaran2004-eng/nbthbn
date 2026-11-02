import { useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Play,
  X,
} from "lucide-react";
import ModalCards from "../components/ModalCards";
import { projectFolders } from "../data/portfolio";
import "./ProjectsPage.css";

const pad = (value) => String(value).padStart(2, "0");

/* each scrap ships with a matching poster frame in public/videos */
const posterFor = (src) => src.replace(/\.mp4$/i, ".jpg");

function FolderCover({ folder }) {
  const [failed, setFailed] = useState(false);
  const previewRef = useRef(null);
  const preview = folder.videos[0];

  const startPreview = () => {
    const node = previewRef.current;
    if (!node || failed) return;

    node.play().catch(() => {
      /* autoplay can be blocked — the cover gradient still reads fine */
    });
  };

  const stopPreview = () => {
    const node = previewRef.current;
    if (!node) return;

    node.pause();
    node.currentTime = 0;
    /* reset back to the poster frame */
    node.load();
  };

  return (
    <span className={`folder-cover${preview?.portrait ? " is-portrait" : ""}`}>
      {!failed && preview && (
        <video
          ref={previewRef}
          src={preview.src}
          poster={posterFor(preview.src)}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onMouseEnter={startPreview}
          onMouseLeave={stopPreview}
          onError={() => setFailed(true)}
        />
      )}

      <span className="folder-cover-wash" aria-hidden="true" />
      <span className="folder-cover-lines" aria-hidden="true" />

      <span className="folder-index" aria-hidden="true">
        {folder.index}
      </span>

      <span className="folder-open" aria-hidden="true">
        <ArrowUpRight size={17} strokeWidth={2} />
      </span>
    </span>
  );
}

function FolderCard({ folder }) {
  const count = folder.videos.length;
  const label = `${pad(count)} ${count === 1 ? "edit" : "edits"}`;

  return (
    <span
      className="folder-card-inner"
      style={{ "--folder-accent": folder.accent }}
    >
      <span className="folder-tab" aria-hidden="true" />

      <span className="folder-shell">
        <FolderCover folder={folder} />

        <span className="folder-info">
          <span className="folder-kicker">// {folder.kicker}</span>
          <span className="folder-name">{folder.label}</span>
          <span className="folder-desc">{folder.description}</span>

          <span className="folder-foot">
            <span>{label}</span>

            <span className="folder-cta">
              Open folder
              <ChevronRight size={13} strokeWidth={2.2} aria-hidden="true" />
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}

function VideoCardBody({ video }) {
  const [failed, setFailed] = useState(false);
  const previewRef = useRef(null);

  const startPreview = () => {
    const node = previewRef.current;
    if (!node || failed) return;

    node.play().catch(() => {
      /* autoplay can be blocked — the card still opens on click */
    });
  };

  const stopPreview = () => {
    const node = previewRef.current;
    if (!node) return;

    node.pause();
    node.currentTime = 0;
    /* reset back to the poster frame */
    node.load();
  };

  return (
    <>
      <span
        className={`pf-video-cover${failed ? " is-missing" : ""}${
          video.portrait ? " is-portrait" : ""
        }`}
      >
        {failed ? (
          <span className="pf-video-fallback">
            <span>Add {video.src}</span>
          </span>
        ) : (
          <video
            ref={previewRef}
            src={video.src}
            poster={posterFor(video.src)}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onMouseEnter={startPreview}
            onMouseLeave={stopPreview}
            onError={() => setFailed(true)}
          />
        )}

        <span className="pf-video-scrim" aria-hidden="true" />
        <span className="pf-video-grain" aria-hidden="true" />

        <span className="pf-video-top">
          <span className="pf-video-year">{video.year}</span>
          <span className="pf-video-index">// {video.id}</span>
        </span>

        <span className="pf-video-play" aria-hidden="true">
          <Play size={19} fill="currentColor" strokeWidth={0} />
        </span>

        <span className="pf-video-heading">
          <span className="pf-video-eyebrow">// Select to play</span>
          <span className="pf-video-title">{video.title}</span>
        </span>
      </span>

      <span className="pf-video-meta">
        <span className="pf-video-desc">{video.description}</span>

        <span className="pf-video-tags">
          {video.tags.map((tag) => (
            <span className="pf-video-tag" key={tag}>
              {tag}
            </span>
          ))}
        </span>
      </span>
    </>
  );
}

function PlayerStage({ video }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="pf-player-stage">
        <div className="pf-player-fallback">
          <span className="pf-player-fallback-title">Video not found</span>
          <code>{video.src}</code>
          <span>
            Drop the file into <code>public{video.src}</code>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="pf-player-stage">
      <video
        key={video.id}
        src={video.src}
        poster={posterFor(video.src)}
        controls
        autoPlay
        playsInline
        preload="auto"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function VideoModalBody({ video, folder, close, index, total, next, prev }) {
  return (
    <div className="pf-player" style={{ "--folder-accent": folder.accent }}>
      <header className="pf-player-header">
        <div className="pf-player-heading">
          <span className="page-eyebrow">
            // {folder.label} / {pad(index + 1)}
          </span>
          <h3 className="pf-player-title">{video.title}</h3>
        </div>

        <div className="pf-player-actions">
          {total > 1 && (
            <>
              <button
                type="button"
                className="pf-player-nav"
                onClick={prev}
                aria-label="Previous edit"
              >
                <ChevronLeft size={17} strokeWidth={2} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="pf-player-nav"
                onClick={next}
                aria-label="Next edit"
              >
                <ChevronRight size={17} strokeWidth={2} aria-hidden="true" />
              </button>
            </>
          )}

          <button
            type="button"
            className="mc-close"
            data-modal-close
            onClick={close}
            aria-label="Close player"
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </header>

      <PlayerStage key={video.id} video={video} />

      <footer className="pf-player-footer">
        <p>{video.description}</p>

        <div className="pf-video-tags">
          {video.tags.map((tag) => (
            <span className="pf-video-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}

function FolderModal({ folder, close }) {
  const count = folder.videos.length;

  return (
    <div className="pf-modal" style={{ "--folder-accent": folder.accent }}>
      <header className="pf-modal-header">
        <div className="pf-modal-heading">
          <span className="page-eyebrow">
            // Projects / {folder.index} · {folder.kicker}
          </span>
          <h3 className="pf-modal-title">{folder.label}</h3>
          <p className="pf-modal-desc">{folder.description}</p>
        </div>

        <button
          type="button"
          className="mc-close"
          data-modal-close
          onClick={close}
          aria-label={`Close ${folder.label} folder`}
        >
          <X size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </header>

      <div className="pf-modal-body">
        <div className="pf-folder-bar">
          <span className="pf-folder-count">
            {pad(count)} {count === 1 ? "edit" : "edits"}
          </span>
          <span className="pf-folder-hint">Select an edit to play</span>
        </div>

        <ModalCards
          items={folder.videos}
          getKey={(video) => video.id}
          label={`${folder.label} edits`}
          getModalLabel={(video) => video.title}
          gridClassName="pf-video-grid"
          cardClassName="pf-video-card"
          modalClassName="mc-panel--player"
          zIndex={95}
          renderCard={(video) => <VideoCardBody video={video} />}
          renderModal={(video, helpers) => (
            <VideoModalBody video={video} folder={folder} {...helpers} />
          )}
        />
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const totalEdits = projectFolders.reduce(
    (sum, folder) => sum + folder.videos.length,
    0,
  );

  return (
    <>
      <div className="pf-intro">
        <p className="page-lede">
          A working archive of edits, reels and motion pieces. Open a folder to
          browse the cuts, then pick one to play.
        </p>

        <span className="pf-intro-hint">
          // {pad(projectFolders.length)} folders · {pad(totalEdits)} edits
        </span>
      </div>

      <ModalCards
        items={projectFolders}
        getKey={(folder) => folder.id}
        label="Project folders"
        getModalLabel={(folder) => folder.label}
        gridClassName="folder-grid"
        cardClassName="folder-card"
        modalClassName="pf-folder-modal"
        zIndex={80}
        renderCard={(folder) => <FolderCard folder={folder} />}
        renderModal={(folder, { close }) => (
          <FolderModal folder={folder} close={close} />
        )}
      />
    </>
  );
}
