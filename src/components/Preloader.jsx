import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./Preloader.css";

const EASE = [0.22, 1, 0.36, 1];
const CURTAIN_EASE = [0.7, 0, 0.2, 1];

const WORD = "NBTHBN";

const statusFor = (value) => {
  if (value < 32) return "Initialising";
  if (value < 68) return "Compiling edits";
  if (value < 100) return "Rendering frames";
  return "Ready";
};

/**
 * Full-screen intro.
 *
 * Two glowing slashes (the NBTHBN "//" mark) draw in over a violet grid,
 * a counter runs to 100, then the screen splits like a shutter and lifts
 * away to reveal the hero. Click or press a key to skip.
 */
export default function Preloader({ onDone }) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const finishedRef = useRef(false);

  /* run the counter up to 100, then start the exit */
  useEffect(() => {
    const duration = reduceMotion ? 450 : 1950;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);

      setProgress(Math.round(eased * 100));

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setExiting(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  /* tell the app once the shutter has fully opened */
  useEffect(() => {
    if (!exiting) return undefined;

    const timer = window.setTimeout(
      () => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        onDone?.();
      },
      reduceMotion ? 260 : 1150,
    );

    return () => window.clearTimeout(timer);
  }, [exiting, onDone, reduceMotion]);

  const skip = useCallback(() => {
    setExiting(true);
  }, []);

  /* any key or tap jumps straight to the reveal */
  useEffect(() => {
    if (exiting) return undefined;

    const handleKey = (event) => {
      if (["Escape", "Enter", " ", "Spacebar"].includes(event.key)) {
        skip();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [exiting, skip]);

  const contentExit = {
    opacity: 0,
    y: -12,
    filter: "blur(8px)",
    transition: { duration: reduceMotion ? 0.1 : 0.3, ease: "easeIn" },
  };

  return (
    <motion.div
      className="preloader"
      role="status"
      aria-label="Loading NBTHBN portfolio"
      onPointerDown={skip}
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      {/* shutter panels that lift away on exit */}
      <motion.div
        className="preloader-curtain preloader-curtain--top"
        animate={
          exiting
            ? reduceMotion
              ? { opacity: 0 }
              : { y: "-101%" }
            : { y: "0%" }
        }
        transition={{
          duration: reduceMotion ? 0.2 : 0.9,
          ease: CURTAIN_EASE,
          delay: exiting && !reduceMotion ? 0.1 : 0,
        }}
      />

      <motion.div
        className="preloader-curtain preloader-curtain--bottom"
        animate={
          exiting
            ? reduceMotion
              ? { opacity: 0 }
              : { y: "101%" }
            : { y: "0%" }
        }
        transition={{
          duration: reduceMotion ? 0.2 : 0.9,
          ease: CURTAIN_EASE,
          delay: exiting && !reduceMotion ? 0.1 : 0,
        }}
      />

      {/* grid, bloom, vignette */}
      <motion.div
        className="preloader-veil"
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.15 : 0.35, ease: "easeOut" }}
      >
        <span className="preloader-bloom" aria-hidden="true" />
        <span className="preloader-scan" aria-hidden="true" />
      </motion.div>

      {/* corner labels */}
      <motion.div
        className="preloader-top"
        animate={exiting ? contentExit : { opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span>// NBTHBN</span>
        <span>Portfolio — 2026</span>
      </motion.div>

      <motion.div
        className="preloader-content"
        animate={exiting ? contentExit : { opacity: 1 }}
      >
        <div className="preloader-mark">
          <span className="preloader-slash-wrap">
            <motion.span
              className="preloader-slash"
              initial={reduceMotion ? false : { scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.85, delay: 0.05, ease: EASE }}
            />
          </span>

          <span className="preloader-slash-wrap">
            <motion.span
              className="preloader-slash"
              initial={reduceMotion ? false : { scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
            />
          </span>
        </div>

        <div className="preloader-lockup">
          <motion.span
            className="preloader-word"
            initial={reduceMotion ? false : { letterSpacing: "0.08em" }}
            animate={{ letterSpacing: "0.42em" }}
            transition={{ duration: reduceMotion ? 0 : 1.4, ease: EASE }}
          >
            {WORD.split("").map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                className="preloader-letter"
                initial={
                  reduceMotion ? false : { opacity: 0, y: 16, filter: "blur(8px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + index * 0.05,
                  ease: EASE,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>

          <motion.span
            className="preloader-tag"
            initial={reduceMotion ? false : { opacity: 0, letterSpacing: "0.14em" }}
            animate={{ opacity: 1, letterSpacing: "0.34em" }}
            transition={{ duration: 1.1, delay: 0.62, ease: EASE }}
          >
            // Edits &amp; Motion
          </motion.span>
        </div>
      </motion.div>

      {/* status + counter */}
      <motion.div
        className="preloader-hud"
        animate={exiting ? contentExit : { opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="preloader-status">
          <span className="preloader-status-dot" aria-hidden="true" />
          <span>{statusFor(progress)}</span>
        </div>

        <div className="preloader-count" aria-hidden="true">
          {String(progress).padStart(3, "0")}
          <span className="preloader-count-unit">%</span>
        </div>
      </motion.div>

      <motion.span
        className="preloader-hint"
        initial={{ opacity: 0 }}
        animate={
          exiting
            ? { opacity: 0, transition: { duration: 0.2, delay: 0 } }
            : { opacity: 0.75, transition: { duration: 0.6, delay: 0.85 } }
        }
      >
        Click or press a key to skip
      </motion.span>

      <div className="preloader-progress" aria-hidden="true">
        <motion.span
          style={{ scaleX: progress / 100 }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
}
