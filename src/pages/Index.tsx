import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Navbar } from "@/pages/Navbar";
import Footer from "@/pages/Footer";
import { Project } from "@/data/projects";
import { ArrowUpRight, ChevronDown } from "@/components/icons/lucide";
import { NoSSR } from "@/components/NoSSR";
import { HeroOrb3D } from "@/components/HeroOrb3D";
import { useUI } from "@/context/UIContext";

const MatrixBackground = lazy(() =>
  import("@/components/MatrixBackground").then((m) => ({ default: m.MatrixBackground }))
);

const ProjectGrid = lazy(() =>
  import("@/components/ProjectGrid").then((m) => ({ default: m.ProjectGrid }))
);

const ProjectOverlay = lazy(() =>
  import("@/components/ProjectOverlay").then((m) => ({ default: m.ProjectOverlay }))
);

const ContributionGraph = lazy(() =>
  import("@/components/ContributionGraph").then((m) => ({ default: m.ContributionGraph }))
);

const TechMarquee = lazy(() =>
  import("@/components/TechMarquee").then((m) => ({ default: m.TechMarquee }))
);

const RotatingDescriptor = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const maxChars = Math.max(...words.map((word) => word.length));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [words.length]);

  return (
    <span
      className="relative inline-grid align-baseline"
      style={{ minWidth: `${maxChars}ch` }}
      aria-hidden="true"
    >
      {words.map((word, wordIndex) => (
        <span
          key={word}
          className={`col-start-1 row-start-1 transition-all duration-700 ${
            wordIndex === index ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          }`}
        >
          {word}
        </span>
      ))}
    </span>
  );
};

const useFadeIn = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    visible,
    className: `transition-all duration-700 ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`,
  };
};

const useDelayedMount = (delay: number) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setMounted(true), delay);
    return () => window.clearTimeout(timeout);
  }, [delay]);

  return mounted;
};

const StaticPortrait = () => (
  <img
    src="/me-portrait-160.jpg"
    srcSet="/me-portrait-160.jpg 160w, /me-portrait-320.jpg 320w"
    sizes="96px"
    alt="Portrait of Alexander Dyrane"
    className="h-full w-full object-cover"
    width={320}
    height={320}
    loading="lazy"
    decoding="async"
  />
);

const ProjectGridPlaceholder = () => (
  <div className="max-w-7xl mx-auto px-4 py-20 md:px-6 md:py-24 space-y-32 md:space-y-40" aria-hidden="true">
    {[
      { id: "logistics-engine", label: "Global Logistics Engines" },
      { id: "intelligence-bridge", label: "Intelligence Bridges" },
      { id: "modernized-ux", label: "Modernized Experience Layers" },
    ].map((section) => (
      <section key={section.id} id={section.id} className="scroll-mt-28">
        <div className="mb-20 max-w-2xl space-y-4">
          <div className="h-3 w-32 rounded-full bg-[var(--text-ghost)]/20" />
          <div className="h-16 max-w-xl squircle surface-panel opacity-60" />
          <div className="h-5 max-w-md rounded-full bg-[var(--text-ghost)]/15" />
        </div>
        <div className="h-80 squircle surface-panel opacity-50" />
      </section>
    ))}
  </div>
);

const ContributionGraphPlaceholder = () => (
  <div className="w-full max-w-7xl mx-auto px-4 py-16 md:px-6 md:py-20" aria-hidden="true">
    <div className="mb-8 space-y-3">
      <div className="h-3 w-36 rounded-full bg-[var(--text-ghost)]/20" />
      <div className="h-10 w-64 rounded-full bg-[var(--text-ghost)]/15" />
    </div>
    <div className="h-72 squircle surface-panel opacity-50" />
  </div>
);

const Index = () => {
  const { isMobile, isLowPower, prefersReducedMotion } = useUI();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const aboutFade = useFadeIn();
  const graphFade = useFadeIn();
  const projectGridReady = useDelayedMount(300);
  const marqueeReady = useDelayedMount(900);
  const backgroundReady = useDelayedMount(1400);
  const shouldRenderMatrixBackground =
    backgroundReady && !isMobile && !isLowPower && !prefersReducedMotion;

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setTimeout(() => setSelectedProject(null), 500);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--surface)] font-sans text-[var(--text)] selection:bg-emerald-500/30 selection:text-emerald-200 transition-colors duration-300">
      <Navbar />

      {shouldRenderMatrixBackground ? (
        <NoSSR>
          <Suspense fallback={null}>
            <MatrixBackground />
          </Suspense>
        </NoSSR>
      ) : null}

      <div className="fixed inset-0 z-0 pointer-events-none contain-strict" aria-hidden="true">
        <div className="absolute left-[-10%] top-[-20%] h-[50%] w-[50%] rounded-full bg-emerald-900/6 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-900/6 opacity-50 blur-[120px]" />
      </div>

      <main className="relative z-10 pt-[calc(4.75rem+env(safe-area-inset-top))] pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pt-32 md:pb-20">
        <div className="max-w-7xl mx-auto mb-16 px-4 md:mb-20 md:px-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-0">
            <div className="flex w-full flex-col md:w-1/2 md:pr-12">
              <h1 className="mb-6 min-h-[7rem] text-5xl font-light tracking-tighter font-mono md:min-h-[10rem] md:text-7xl">
                Architecting{" "}
                <span className="inline-block text-[var(--text-dim)]">
                  <RotatingDescriptor
                    words={[
                      "Digital Intelligence.",
                      "Logistics Engines.",
                      "Neural Layers.",
                      "Future Systems.",
                    ]}
                  />
                  <span className="sr-only">Digital Intelligence.</span>
                </span>
              </h1>
              <p className="mb-12 max-w-xl font-sans text-xl font-light leading-relaxed text-[var(--text-muted)] md:text-2xl">
                A collective of proprietary infrastructure, logistics engines, and
                high-fidelity interfaces built for the next generation of the web.
              </p>

              <div className="flex flex-row items-start gap-2 sm:gap-4">
                <a
                  href="mailto:hello@dyrane.tech?subject=Project%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 md:px-8 md:py-4 squircle-pill bg-[var(--cta-bg)] text-[var(--cta-text)] font-medium transition-colors duration-200 hover:bg-[var(--cta-hover)]"
                >
                  Start Project
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </a>
                <a
                  href="#logistics-engine"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 md:px-8 md:py-4 squircle-pill bg-[var(--cta-secondary-bg)] text-[var(--cta-secondary-text)] font-medium transition-colors duration-200 hover:bg-[var(--cta-secondary-hover)] hover:text-[var(--text)]"
                >
                  My Work
                  <ChevronDown
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-y-0.5"
                  />
                </a>
              </div>
            </div>

            <div className="relative h-[320px] w-full md:h-[520px] md:w-1/2">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,rgba(52,211,153,0.03)_60%,transparent_72%)] pointer-events-none" />
              <HeroOrb3D />

              <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-ghost)]">
                  Ambient orb · motion-safe
                </span>
              </div>
            </div>
          </div>
        </div>

        <div ref={aboutFade.ref} className={`max-w-7xl mx-auto mb-16 px-4 md:mb-20 md:px-6 ${aboutFade.className}`}>
          <div className="relative overflow-hidden squircle surface-panel p-6 md:p-12">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-500/4 blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col items-start gap-10 md:flex-row">
              <div className="flex-shrink-0">
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden squircle surface-card">
                  <StaticPortrait />
                  <div className="absolute inset-0 pointer-events-none squircle shadow-[inset_0_0_0_1px_rgba(52,211,153,0.1)]" />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="mb-1 text-2xl font-semibold tracking-tight text-[var(--text)]">
                    Alexander Dyrane
                  </h2>
                  <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-[var(--cat-ux)]">
                    Systems Architect · Full-Stack Engineer · Human Interface Engineer
                  </p>
                </div>
                <p className="max-w-2xl text-lg font-light leading-relaxed text-[var(--text-muted)]">
                  I design and engineer production-grade systems spanning real-time
                  logistics infrastructure, AI-powered platforms, and high-fidelity
                  interfaces built to Apple Human Interface Guidelines. Every project
                  is live, maintained, and serving real users. I write in TypeScript,
                  Python, and Swift, and build in 3D.
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {[
                    "TypeScript",
                    "React",
                    "Next.js",
                    "Swift",
                    "Three.js / R3F",
                    "Node.js",
                    "Python",
                    "PostgreSQL",
                    "Supabase",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 squircle-chip surface-chip text-[11px] font-mono whitespace-nowrap text-[var(--text-muted)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section
          id="engineering-dna"
          ref={graphFade.ref}
          className={`scroll-mt-28 ${graphFade.className}`}
        >
          {graphFade.visible ? (
            <Suspense fallback={<ContributionGraphPlaceholder />}>
              <ContributionGraph />
            </Suspense>
          ) : (
            <ContributionGraphPlaceholder />
          )}
        </section>

        {projectGridReady ? (
          <Suspense fallback={<ProjectGridPlaceholder />}>
            <ProjectGrid onProjectSelect={handleProjectSelect} />
          </Suspense>
        ) : (
          <ProjectGridPlaceholder />
        )}

        {marqueeReady ? (
          <Suspense fallback={null}>
            <TechMarquee />
          </Suspense>
        ) : null}
      </main>

      <Footer />

      {selectedProject ? (
        <Suspense fallback={null}>
          <ProjectOverlay
            project={selectedProject}
            isOpen={isOverlayOpen}
            onClose={handleCloseOverlay}
          />
        </Suspense>
      ) : null}
    </div>
  );
};

export default Index;
