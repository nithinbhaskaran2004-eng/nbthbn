import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { House, UserRound, FolderGit2, Mail } from "lucide-react";
import "./NavDock.css";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: House },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "about", label: "About", icon: UserRound },
  { id: "contact", label: "Contact", icon: Mail },
];

const BASE_SIZE = 44;
const MAX_SIZE = 68;

function DockIcon({ item, mouseX, isActive, onNavigate }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const Icon = item.icon;

  /* distance from the pointer to the centre of this icon */
  const distance = useTransform(mouseX, (pointerX) => {
    if (pointerX === Infinity) return -Infinity;

    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return -Infinity;

    return pointerX - bounds.x - bounds.width / 2;
  });

  const sizeSync = useTransform(
    distance,
    [-120, 0, 120],
    [BASE_SIZE, MAX_SIZE, BASE_SIZE],
  );

  const size = useSpring(sizeSync, {
    mass: 0.1,
    stiffness: 170,
    damping: 15,
  });

  /* hover glow follows the pointer inside the icon */
  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      className={`nav-dock-item${isActive ? " is-active" : ""}`}
      style={{ width: reduceMotion ? BASE_SIZE : size, height: reduceMotion ? BASE_SIZE : size }}
      aria-current={isActive ? "page" : undefined}
      aria-label={item.label}
      onClick={() => onNavigate(item.id)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={handlePointerMove}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <span className="nav-dock-icon">
        <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
      </span>

      <span className="nav-dock-active-dot" aria-hidden="true" />

      <AnimatePresence>
        {hovered && (
          <motion.span
            className="nav-dock-tooltip"
            aria-hidden="true"
            style={{ x: "-50%" }}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.94 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function NavDock({ active, onNavigate }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <nav
      className="nav-dock"
      aria-label="Primary"
      onPointerMove={(event) => mouseX.set(event.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
    >
      <span className="nav-dock-glow" aria-hidden="true" />

      {NAV_ITEMS.map((item) => (
        <DockIcon
          key={item.id}
          item={item}
          mouseX={mouseX}
          isActive={item.id === "home" ? !active : active === item.id}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
