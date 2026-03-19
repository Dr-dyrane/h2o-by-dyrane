import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { CommandCenter } from "@/components/CommandCenter";
import { SocialSidebar } from "@/components/social-sidebar";
import { Navbar } from "@/pages/Navbar";
import Footer from "@/pages/Footer";
import { Project } from "@/data/projects";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { NoSSR } from "@/components/NoSSR";

const HeroOrb3D = lazy(() =>
  import("@/components/HeroOrb3D").then((m) => ({ default: m.HeroOrb3D }))
);

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

const TypewriterEffect = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(() => words[0]?.length ?? 0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (index >= words.length) {
      setIndex(0);
      return;
    }

    if (subIndex === words[index].length && !reverse) {
      const hold = setTimeout(() => setReverse(true), 2000);
      return () => clearTimeout(hold);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const speed = reverse ? 60 : 100;
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className="inline-flex items-baseline">
      <span>{words[index].substring(0, subIndex)}</span>
      <span className="ml-0.5 h-[0.85em] w-[2px] animate-pulse bg-current" />
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

const HeroOrbFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
    <div className="relative h-56 w-56 md:h-72 md:w-72">
      <div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute inset-5 rounded-full border border-emerald-400/20" />
      <div className="absolute inset-10 rounded-full border border-emerald-300/15" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(110,231,183,0.16)_0%,rgba(52,211,153,0.04)_45%,transparent_70%)]" />
    </div>
  </div>
);

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
  <div className="max-w-7xl mx-auto px-6 py-24 space-y-40" aria-hidden="true">
    {[
      { id: "logistics-engine", label: "Global Logistics Engines" },
      { id: "intelligence-bridge", label: "Intelligence Bridges" },
      { id: "modernized-ux", label: "Modernized Experience Layers" },
    ].map((section) => (
      <section key={section.id} id={section.id} className="scroll-mt-28">
        <div className="mb-20 max-w-2xl space-y-4">
          <div className="h-3 w-32 rounded-full bg-[var(--text-ghost)]/20" />
          <div className="h-16 max-w-xl squircle glass-ultra-thin opacity-60" />
          <div className="h-5 max-w-md rounded-full bg-[var(--text-ghost)]/15" />
        </div>
        <div className="h-80 squircle glass-ultra-thin opacity-50" />
      </section>
    ))}
  </div>
);

const ContributionGraphPlaceholder = () => (
  <div className="w-full max-w-7xl mx-auto px-6 py-20" aria-hidden="true">
    <div className="mb-8 space-y-3">
      <div className="h-3 w-36 rounded-full bg-[var(--text-ghost)]/20" />
      <div className="h-10 w-64 rounded-full bg-[var(--text-ghost)]/15" />
    </div>
    <div className="h-72 squircle glass-ultra-thin opacity-50" />
  </div>
);

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const aboutFade = useFadeIn();
  const graphFade = useFadeIn();
  const projectGridReady = useDelayedMount(300);
  const orbReady = useDelayedMount(700);
  const marqueeReady = useDelayedMount(900);
  const backgroundReady = useDelayedMount(1400);

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

      {backgroundReady ? (
        <NoSSR>
          <Suspense fallback={null}>
            <MatrixBackground />
          </Suspense>
        </NoSSR>
      ) : null}

      <div className="fixed inset-0 z-0 pointer-events-none contain-strict" aria-hidden="true">
        <div className="absolute left-[-10%] top-[-20%] h-[50%] w-[50%] rounded-full bg-emerald-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-900/10 opacity-60 blur-[120px]" />
      </div>

      <CommandCenter visible={!isOverlayOpen} />
      <SocialSidebar />

      <main className="relative z-10 pt-32 pb-24 md:pb-20">
        <div className="max-w-7xl mx-auto mb-20 px-6">
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-0">
            <div className="flex w-full flex-col md:w-1/2 md:pr-12">
              <h1 className="mb-6 min-h-[7rem] text-5xl font-light tracking-tighter font-mono md:min-h-[10rem] md:text-7xl">
                Architecting{" "}
                <span className="inline-block text-[var(--text-dim)]">
                  <TypewriterEffect
                    words={[
                      "Digital Intelligence.",
                      "Logistics Engines.",
                      "Neural Layers.",
                      "Future Systems.",
                    ]}
                  />
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
                  className="group inline-flex items-center gap-2 px-8 py-4 squircle-pill bg-[var(--cta-bg)] text-[var(--cta-text)] font-medium transition-all duration-300 hover:scale-105 hover:opacity-90 hover:shadow-[0_0_40px_var(--glow-color)]"
                >
                  Start Project
                  <ArrowUpRight
                    size={18}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
                <a
                  href="#logistics-engine"
                  className="group inline-flex items-center gap-2 px-8 py-4 squircle-pill bg-[var(--cta-secondary-bg)] text-[var(--cta-secondary-text)] font-medium transition-all duration-300 hover:bg-[var(--cta-secondary-hover)] hover:text-[var(--text)]"
                >
                  My Work
                  <ChevronDown
                    size={18}
                    className="transition-transform group-hover:translate-y-0.5"
                  />
                </a>
              </div>
            </div>

            <div className="relative h-[320px] w-full md:h-[520px] md:w-1/2">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.08)_0%,transparent_65%)] pointer-events-none" />
              <HeroOrbFallback />
              {orbReady ? (
                <NoSSR>
                  <Suspense fallback={null}>
                    <HeroOrb3D />
                  </Suspense>
                </NoSSR>
              ) : null}

              <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-ghost)]">
                  Three.js · WebGL · R3F
                </span>
              </div>
            </div>
          </div>
        </div>

        <div ref={aboutFade.ref} className={`max-w-7xl mx-auto mb-20 px-6 ${aboutFade.className}`}>
          <div className="relative overflow-hidden squircle p-8 md:p-12 glass-ultra-thin">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col items-start gap-10 md:flex-row">
              <div className="flex-shrink-0">
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden squircle glass-regular">
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
                      className="px-3 py-1 squircle-chip glass-ultra text-[11px] font-mono whitespace-nowrap text-[var(--text-dim)]"
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
