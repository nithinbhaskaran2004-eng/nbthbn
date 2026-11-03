
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import Lanyard from "./components/Lanyard";
import ColorBends from "./components/ColorBends";
import NavDock from "./components/NavDock";
import Preloader from "./components/Preloader";
import PageShell from "./pages/PageShell";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";
import "./App.css";

const PAGES = {
  about: { label: "About", title: "About Me", Component: AboutPage },
  projects: { label: "Projects", title: "Edits & Motion", Component: ProjectsPage },
  contact: { label: "Contact", title: "Get In Touch", Component: ContactPage },
};

const PAGE_SEQUENCE = ["home", "about", "projects", "contact"];

function pageFromHash() {
  const id = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  return PAGES[id] ? id : null;
}

const INTRO_KEY = "nbthbn:intro";

/* the intro plays once per browser session.
   append ?intro to the URL to replay it */
function introAlreadyPlayed() {
  try {
    if (new URLSearchParams(window.location.search).has("intro")) return false;

    return window.sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

function App() {
  const [activePage, setActivePage] = useState(pageFromHash);
  const [direction, setDirection] = useState(1);
  const [introDone, setIntroDone] = useState(introAlreadyPlayed);

  const finishIntro = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* storage can be blocked — the intro just replays next visit */
    }

    setIntroDone(true);
  }, []);

  /* keep the overlay in sync with the URL hash (deep links + back button) */
  useEffect(() => {
    const syncFromHash = () => setActivePage(pageFromHash());

    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const closePage = useCallback(() => {
    if (pageFromHash()) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }

    setDirection(-1);
    setActivePage(null);
  }, []);

  const navigate = useCallback(
    (id) => {
      if (id === "home") {
        closePage();
        return;
      }

      if (!PAGES[id]) return;

      const from = PAGE_SEQUENCE.indexOf(activePage ?? "home");
      const to = PAGE_SEQUENCE.indexOf(id);

      setDirection(to >= from ? 1 : -1);

      if (window.location.hash !== `#${id}`) {
        window.location.hash = id;
      }

      setActivePage(id);
    },
    [activePage, closePage],
  );

  /* scroll / trackpad to move between sections */
  useEffect(() => {
    /* how much wheel travel is needed before the page changes
       (~3 mouse-wheel notches, or a deliberate trackpad swipe) */
    const WHEEL_THRESHOLD = 240;
    /* a pause longer than this clears the built-up travel */
    const WHEEL_RESET_GAP = 300;
    /* ignore the inertia tail right after a page change */
    const WHEEL_COOLDOWN = 1200;

    let accumulated = 0;
    let lastWheelAt = 0;
    let lockedUntil = 0;

    /* some browsers report lines or pages instead of pixels */
    const normalizeDelta = (event) => {
      if (event.deltaMode === 1) return event.deltaY * 16;
      if (event.deltaMode === 2) return event.deltaY * 100;
      return event.deltaY;
    };

    const canScrollInside = (element, deltaY) => {
      if (!element) return false;

      const max = element.scrollHeight - element.clientHeight;
      if (max <= 2) return false;

      return deltaY > 0 ? element.scrollTop < max - 1 : element.scrollTop > 1;
    };

    const handleWheel = (event) => {
      if (!introDone) return;
      if (event.ctrlKey) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      const now = Date.now();
      if (now < lockedUntil) return;

      /* never hijack scrolling inside an open project modal or player */
      if (document.querySelector("[data-project-modal]")) return;

      /* scrolling the panel body counts as reading, not as a page change */
      if (canScrollInside(document.querySelector(".page-body"), event.deltaY)) {
        accumulated = 0;
        return;
      }

      const delta = normalizeDelta(event);

      if (now - lastWheelAt > WHEEL_RESET_GAP) accumulated = 0;
      lastWheelAt = now;

      accumulated += delta;

      if (Math.abs(accumulated) < WHEEL_THRESHOLD) return;

      const currentIndex = PAGE_SEQUENCE.indexOf(activePage ?? "home");
      const nextIndex = currentIndex + (accumulated > 0 ? 1 : -1);
      const nextPage = PAGE_SEQUENCE[nextIndex];

      accumulated = 0;
      lockedUntil = now + WHEEL_COOLDOWN;

      if (!nextPage) return;

      navigate(nextPage);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activePage, introDone, navigate]);

  const page = activePage ? PAGES[activePage] : null;
  const PageComponent = page?.Component;

  return (
    <>
      <main className="portfolio">
        {/* Background */}
        <div className="background">
          <ColorBends
            colors={["#6D28D9", "#A855F7", "#C084FC"]}
            rotation={91}
            speed={0.31}
            scale={1}
            frequency={1}
            warpStrength={1}
            mouseInfluence={1}
            noise={0.31}
            parallax={0.5}
            iterations={1}
            intensity={0.6}
            bandWidth={6}
            transparent
            autoRotate={0}
          />
        </div>

        {/* Center Lanyard */}
        <div className="lanyard-container">
          <Lanyard
            frontImage="/card-front.png"
            backImage="/card-back.png"
            backText="I turn imagination into evidence. If you can imagine it, I can make it visible."
            imageFit="cover"
            cardColor="#581C87"
            orientation="portrait"
            finish="glossy"
            cornerRadius={0.4}
            size={0.45}
            anchor="center"
            strapLength={0.4}
            strapColor="#111111"
            strapWidth={0.9}
            metal="silver"
            gravity={1.15}
            damping={0.55}
            elasticity={0.5}
            breeze={0.5}
            interactive
            intro
          />
        </div>

        {/* Name - Top Left */}
        <div className="brand-name">NBTHBN</div>

        {/* Resume Logo - Top Right */}
        <a
          href="/resume.pdf"
          download="Resume.pdf"
          className="resume-logo"
          aria-label="Download resume"
        >
          <span className="resume-logo-symbol">//</span>
          <span className="resume-logo-label">DOWNLOAD RESUME</span>
        </a>
      </main>

      {/* Bottom-center navigation — sits above the page overlays */}
      <NavDock active={activePage} onNavigate={navigate} />

      {/* Translucent page panels */}
      <AnimatePresence mode="wait" custom={direction}>
        {page && (
          <PageShell
            key={activePage}
            label={page.label}
            title={page.title}
            direction={direction}
            onClose={closePage}
          >
            <PageComponent />
          </PageShell>
        )}
      </AnimatePresence>

      {/* Intro — runs once per session, then unmounts */}
      {!introDone && <Preloader onDone={finishIntro} />}
    </>
  );
}

export default App;
