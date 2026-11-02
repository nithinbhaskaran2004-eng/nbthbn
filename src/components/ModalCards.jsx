import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "./ModalCards.css";

const EASE = [0.22, 1, 0.36, 1];

/* module-level stack so nested modals only close the top one */
const modalStack = [];

function getFocusable(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), video[controls], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((node) => node.offsetParent !== null);
}

/**
 * Modal Cards — a hand-built, dependency-free take on the React Bits Pro
 * component. Cards expand into a full-screen glass panel, and the panel
 * grows out of the card you clicked.
 *
 * Both the Projects folder grid and the video grid inside a folder use this,
 * which gives us nested modals (folder → video player) with a shared motion
 * language.
 */
export default function ModalCards({
  items,
  getKey,
  renderCard,
  renderModal,
  label = "Cards",
  getModalLabel,
  gridClassName = "",
  cardClassName = "",
  modalClassName = "",
  zIndex = 80,
}) {
  const [activeKey, setActiveKey] = useState(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [panelOrigin, setPanelOrigin] = useState("50% 50%");

  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const modalId = useId();
  const reduceMotion = useReducedMotion();

  const activeIndex =
    activeKey === null
      ? -1
      : items.findIndex((item) => getKey(item) === activeKey);
  const active = activeIndex >= 0 ? items[activeIndex] : null;

  const open = useCallback(
    (item, event) => {
      const rect = event.currentTarget.getBoundingClientRect();

      triggerRef.current = event.currentTarget;
      setOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      setActiveKey(getKey(item));
    },
    [getKey],
  );

  const close = useCallback(() => {
    const trigger = triggerRef.current;

    setActiveKey(null);
    window.setTimeout(() => trigger?.focus(), 0);
  }, []);

  const step = useCallback(
    (direction) => {
      setActiveKey((current) => {
        const index = items.findIndex((item) => getKey(item) === current);
        if (index === -1) return current;

        const nextIndex =
          (index + direction + items.length) % items.length;

        return getKey(items[nextIndex]);
      });
    },
    [getKey, items],
  );

  /* Escape closes only the top-most modal; Tab stays inside the panel. */
  useEffect(() => {
    if (!active) return;

    modalStack.push(modalId);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (modalStack[modalStack.length - 1] !== modalId) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        close();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = getFocusable(panelRef.current);
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);

      const stackIndex = modalStack.lastIndexOf(modalId);
      if (stackIndex !== -1) modalStack.splice(stackIndex, 1);
    };
  }, [active, close, modalId]);

  /* keep the page panel from scrolling behind the modal */
  useEffect(() => {
    if (!active) return;

    const body = document.querySelector(".page-body");
    if (!body) return;

    const previous = body.style.overflowY;
    body.style.overflowY = "hidden";

    return () => {
      body.style.overflowY = previous;
    };
  }, [active]);

  /* move focus into the panel */
  useEffect(() => {
    if (!active) return;

    const timer = window.setTimeout(() => {
      const target =
        panelRef.current?.querySelector("[data-modal-close]") ??
        panelRef.current;

      target?.focus();
    }, 140);

    return () => window.clearTimeout(timer);
  }, [active]);

  /* grow the panel out of the card that was clicked */
  useLayoutEffect(() => {
    if (!active || !panelRef.current) return;

    const rect = panelRef.current.getBoundingClientRect();

    setPanelOrigin(`${origin.x - rect.left}px ${origin.y - rect.top}px`);
  }, [active, origin]);

  return (
    <>
      <div className={`mc-grid ${gridClassName}`} aria-label={label}>
        {items.map((item, index) => (
          <motion.button
            type="button"
            key={getKey(item)}
            className={`mc-card ${cardClassName}`}
            onClick={(event) => open(item, event)}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.045 * index,
              ease: EASE,
            }}
          >
            {renderCard(item, { index })}
          </motion.button>
        ))}
      </div>

      {createPortal(
        <AnimatePresence>
          {active && (
            <motion.div
              className="mc-layer"
              style={{ zIndex }}
              data-project-modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.28,
                ease: "easeOut",
              }}
              onClick={close}
            >
              <motion.div
                ref={panelRef}
                className={`mc-panel ${modalClassName}`}
                role="dialog"
                aria-modal="true"
                aria-label={getModalLabel ? getModalLabel(active) : label}
                tabIndex={-1}
                style={{ transformOrigin: panelOrigin }}
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.92, y: 26, filter: "blur(10px)" }
                }
                animate={
                  reduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
                }
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.965, y: 14, filter: "blur(4px)" }
                }
                transition={{
                  duration: reduceMotion ? 0 : 0.48,
                  ease: EASE,
                }}
                onClick={(event) => event.stopPropagation()}
              >
                {renderModal(active, {
                  close,
                  index: activeIndex,
                  total: items.length,
                  next: () => step(1),
                  prev: () => step(-1),
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
