import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

const LottieThemeToggle = lazy(() =>
  import("@/components/LottieThemeToggle").then((module) => ({
    default: module.LottieThemeToggle,
  }))
);

const navLinks = [
  { label: "Work", href: "#showcase", sectionId: "showcase" },
  { label: "Process", href: "#process", sectionId: "process" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
] as const;

export const FloatingNav = () => {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeSection, setActiveSection] = useState<(typeof navLinks)[number]["sectionId"]>("showcase");
  const scrollRafId = useRef<number | null>(null);
  const hideTimerId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionPreference = () => setReduceMotion(mediaQuery.matches);

    applyMotionPreference();
    mediaQuery.addEventListener("change", applyMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", applyMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const sectionNodes = navLinks
      .map((link) => {
        const section = window.document.getElementById(link.sectionId);
        return section ? [link.sectionId, section] : null;
      })
      .filter((entry): entry is [(typeof navLinks)[number]["sectionId"], HTMLElement] => entry !== null);

    if (sectionNodes.length === 0) {
      return;
    }

    const ratios = new Map<(typeof navLinks)[number]["sectionId"], number>();
    const computeMostVisibleSection = () => {
      let bestSection: (typeof navLinks)[number]["sectionId"] | null = null;
      let bestRatio = -1;

      for (const [sectionId, ratio] of ratios) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestSection = sectionId;
        }
      }

      if (bestSection) {
        setActiveSection((current) => (current === bestSection ? current : bestSection));
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sectionId = entry.target.id as (typeof navLinks)[number]["sectionId"];
          ratios.set(sectionId, entry.intersectionRatio);
        }
        computeMostVisibleSection();
      },
      {
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
        rootMargin: "-35% 0px -40% 0px",
      }
    );

    for (const [sectionId, node] of sectionNodes) {
      ratios.set(sectionId, 0);
      observer.observe(node);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const evaluateVisibility = () => {
      scrollRafId.current = null;
      const nextVisible = window.scrollY > window.innerHeight * 0.8;
      setIsVisible((current) => (current === nextVisible ? current : nextVisible));
    };

    const scheduleVisibilityUpdate = () => {
      if (scrollRafId.current !== null) {
        return;
      }
      scrollRafId.current = window.requestAnimationFrame(evaluateVisibility);
    };

    evaluateVisibility();
    window.addEventListener("scroll", scheduleVisibilityUpdate, { passive: true });
    window.addEventListener("resize", scheduleVisibilityUpdate);
    window.addEventListener("hashchange", scheduleVisibilityUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleVisibilityUpdate);
      window.removeEventListener("resize", scheduleVisibilityUpdate);
      window.removeEventListener("hashchange", scheduleVisibilityUpdate);
      if (scrollRafId.current !== null) {
        window.cancelAnimationFrame(scrollRafId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      if (hideTimerId.current !== null) {
        window.clearTimeout(hideTimerId.current);
        hideTimerId.current = null;
      }
      setIsRendered(true);
      return;
    }

    if (reduceMotion) {
      setIsRendered(false);
      return;
    }

    hideTimerId.current = window.setTimeout(() => {
      setIsRendered(false);
      hideTimerId.current = null;
    }, 240);
  }, [isVisible, reduceMotion]);

  useEffect(() => {
    return () => {
      if (hideTimerId.current !== null) {
        window.clearTimeout(hideTimerId.current);
      }
    };
  }, []);

  if (!isRendered) {
    return null;
  }

  return (
    <nav
      aria-label="Site navigation"
      className={`fixed left-1/2 top-[max(0.5rem,env(safe-area-inset-top))] z-50 w-fit max-w-[calc(100vw-1rem)] -translate-x-1/2 will-gpu md:top-6 ${
        reduceMotion
          ? ""
          : "transition-all duration-300 ease-out"
      } ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0 pointer-events-none"}`}
    >
      <div className="flex max-w-full items-center gap-1 rounded-full bg-[var(--surface-glass)] px-2 py-1.5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] md:gap-2 md:px-3 md:py-2">
        <a
          href="#hero"
          className="px-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text)]/80 md:px-3 md:text-[11px] md:tracking-[0.35em]"
        >
          <span className="md:hidden">Top</span>
          <span className="hidden md:inline">Dyrane</span>
        </a>

        <div className="hidden h-4 w-px bg-white/15 md:block" />

        <div className="flex items-center gap-0.5 md:gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={activeSection === link.sectionId ? "page" : undefined}
              className={`group relative whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-light md:px-3 md:py-1.5 md:text-[13px] ${
                activeSection === link.sectionId
                  ? "text-[var(--text)]"
                  : "text-[var(--text-muted)]"
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
          <Suspense
            fallback={
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={toggleTheme}
                className="h-11 w-11 rounded-2xl bg-[var(--surface-elevated)] ring-1 ring-[var(--surface-stroke)]"
              />
            }
          >
            <LottieThemeToggle
              theme={theme}
              onToggle={toggleTheme}
              isHovered={isHovered}
              isActive={theme === "dark"}
            />
          </Suspense>
        </div>
      </div>
    </nav>
  );
};
