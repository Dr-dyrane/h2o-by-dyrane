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
          className="fixed left-1/2 top-6 z-50 w-fit -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={entryTransition}
        >
          <div className="flex items-center gap-2 rounded-full bg-[var(--surface-glass)] px-3 py-2 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
            <a
              href="#hero"
              className="px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--text)]/80 transition-colors duration-300 hover:text-[var(--text)]"
              aria-label="Back to top"
            >
              Dyrane
            </a>

            <div className="h-4 w-px bg-white/15" />

            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={activeSection === link.sectionId ? "page" : undefined}
                  className={`group relative rounded-full px-3 py-1.5 text-[13px] font-light transition-colors duration-300 ${
                    activeSection === link.sectionId
                      ? "text-[var(--text)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0.5 left-3 right-3 h-px origin-left bg-[var(--cat-ux)] transition-transform duration-300 ${
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
              className="flex items-center"
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
