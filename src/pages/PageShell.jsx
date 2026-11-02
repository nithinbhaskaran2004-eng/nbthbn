import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import "./Pages.css";

const EASE = [0.22, 1, 0.36, 1];

/* direction > 0 = moving forward (scrolling down / next section) */
const overlayVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.26, ease: "easeIn" } },
};

const panelVariants = {
  enter: (direction) => ({
    opacity: 0,
    y: direction >= 0 ? 64 : -64,
    scale: 0.975,
  }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
  exit: (direction) => ({
    opacity: 0,
    y: direction >= 0 ? -48 : 48,
    scale: 0.985,
    transition: { duration: 0.24, ease: "easeIn" },
  }),
};

export default function PageShell({ label, title, direction = 1, onClose, children }) {
  const closeRef = useRef(null);

  /* Escape closes the panel + move focus into the dialog */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 200);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [onClose]);

  return (
    <motion.div
      className="page-overlay"
      variants={overlayVariants}
      initial="enter"
      animate="center"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="page-panel"
        role="dialog"
        aria-labelledby="page-title"
        custom={direction}
        variants={panelVariants}
        initial="enter"
        animate="center"
        exit="exit"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="page-panel-glow" aria-hidden="true" />

        <header className="page-header">
          <div className="page-heading">
            <span className="page-eyebrow">// {label}</span>
            <h2 className="page-title" id="page-title">
              {title}
            </h2>
          </div>

          <button
            ref={closeRef}
            type="button"
            className="page-close"
            onClick={onClose}
            aria-label="Close panel"
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </header>

        <div className="page-body">{children}</div>
      </motion.div>
    </motion.div>
  );
}
