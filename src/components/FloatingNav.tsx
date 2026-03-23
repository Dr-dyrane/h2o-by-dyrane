import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { LottieThemeToggle } from "@/components/LottieThemeToggle";

const navLinks = [
  { label: "Work", href: "#showcase", sectionId: "showcase" },
  { label: "Process", href: "#process", sectionId: "process" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
] as const;

const entryTransition = {
  type: "spring",
  stiffness: 300,
  damping: 26,
  mass: 0.75,
} as const;

export const FloatingNav = () => {
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<(typeof navLinks)[number]["sectionId"]>("showcase");

  const updateActiveSection = () => {
    if (typeof window === "undefined") {
      return;
    }

    const probeY = window.innerHeight * 0.35;
    let nextActive: (typeof navLinks)[number]["sectionId"] | null = null;
    let fallbackActive: (typeof navLinks)[number]["sectionId"] = navLinks[0].sectionId;
    let fallbackDistance = Number.POSITIVE_INFINITY;

    for (const link of navLinks) {
      const section = window.document.getElementById(link.sectionId);

      if (!section) {
        continue;
      }

      const rect = section.getBoundingClientRect();
      const distanceFromProbe = Math.abs(rect.top - probeY);

      if (distanceFromProbe < fallbackDistance) {
        fallbackDistance = distanceFromProbe;
        fallbackActive = link.sectionId;
      }

      if (rect.top <= probeY && rect.bottom >= probeY) {
        nextActive = link.sectionId;
        break;
      }
    }

    const resolved = nextActive ?? fallbackActive;
    setActiveSection((current) => (current === resolved ? current : resolved));
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (typeof window === "undefined") {
      return;
    }
    const nextVisible = latest > window.innerHeight * 0.8;
    setIsVisible((current) => (current === nextVisible ? current : nextVisible));
    updateActiveSection();
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const evaluate = () => {
      setIsVisible(scrollY.get() > window.innerHeight * 0.8);
      updateActiveSection();
    };

    evaluate();
    window.addEventListener("resize", evaluate);
    window.addEventListener("hashchange", evaluate);

    return () => {
      window.removeEventListener("resize", evaluate);
      window.removeEventListener("hashchange", evaluate);
    };
  }, [scrollY]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.nav
          aria-label="Site navigation"
          className="fixed left-1/2 top-[max(0.5rem,env(safe-area-inset-top))] z-50 w-fit max-w-[calc(100vw-1rem)] -translate-x-1/2 md:top-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={entryTransition}
        >
          <div className="flex max-w-full items-center gap-1 rounded-full bg-[var(--surface-glass)] px-2 py-1.5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] md:gap-2 md:px-3 md:py-2">
            <a
              href="#hero"
              className="px-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text)]/80 transition-colors duration-300 hover:text-[var(--text)] md:px-3 md:text-[11px] md:tracking-[0.35em]"
              aria-label="Back to top"
            >
              <span className="hidden md:inline">Dyrane</span>
            </a>

            <div className="hidden h-4 w-px bg-white/15 md:block" />

            <div className="flex items-center gap-0.5 md:gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={activeSection === link.sectionId ? "page" : undefined}
                  className={`group relative whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-light transition-colors duration-300 md:px-3 md:py-1.5 md:text-[13px] ${
                    activeSection === link.sectionId
                      ? "text-[var(--text)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0.5 left-2 right-2 h-px origin-left bg-[var(--cat-ux)] transition-transform duration-300 md:left-3 md:right-3 ${
                      activeSection === link.sectionId ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              ))}
            </div>

            <div className="h-4 w-px bg-white/15" />

            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex origin-right items-center scale-90 md:scale-100"
            >
              <LottieThemeToggle
                theme={theme}
                onToggle={toggleTheme}
                isHovered={isHovered}
                isActive={theme === "dark"}
              />
            </div>
          </div>
        </motion.nav>
      ) : null}
    </AnimatePresence>
  );
};
