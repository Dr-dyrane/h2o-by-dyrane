import {
  Suspense,
  lazy,
  useEffect,
  useState,
} from "react";
import type { Project } from "@/data/projects";
import { projects } from "@/data/projects";
import { Navbar } from "@/pages/Navbar";
import Footer from "@/pages/Footer";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ShowcaseSection } from "@/components/ShowcaseSection";
import { ContributionGraph } from "@/components/ContributionGraph";
import { HiringWorkflowSection } from "@/components/home/HiringWorkflowSection";
import {
  buildProofStrip,
  heroShowcase,
  processSteps,
  services,
} from "@/content/homepage";
import { ArrowUpRight, ChevronDown } from "@/components/icons/lucide";

const ProjectOverlay = lazy(() =>
  import("@/components/ProjectOverlay").then((m) => ({
    default: m.ProjectOverlay,
  }))
);

// Real data: summed from projects.ts
const totalCommits = projects.reduce((sum, p) => sum + p.github_stats.commits, 0);
const totalProjects = projects.length;

/**
 * Homepage route composing the portfolio narrative, proof, and project exploration flows.
 */
const Index = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [activeShowcase, setActiveShowcase] = useState(0);

  // Kinetic hero panel: rotate every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveShowcase((prev) => (prev + 1) % heroShowcase.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Opens the project overlay for the selected project card.
   */
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsOverlayOpen(true);
  };

  /**
   * Closes the project overlay and clears the selected project after the exit animation.
   */
  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    window.setTimeout(() => setSelectedProject(null), 500);
  };
  const proofStrip = buildProofStrip(totalCommits);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--surface)] font-sans text-[var(--text)] selection:bg-[var(--cat-ux-bg)] selection:text-[var(--text)] transition-colors duration-300">
      <Navbar />

      <main id="main-content" className="relative z-10 pt-[calc(4.75rem+env(safe-area-inset-top))] pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pt-32 md:pb-20">
        <section className="mx-auto mb-16 max-w-7xl px-4 md:mb-20 md:px-6">
          <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
            <div>
              <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--cat-ux)]">
                Alexander Dyrane | Solo product engineer for complex products
              </p>
              <h1 className="mb-6 max-w-4xl text-4xl font-light tracking-tighter text-[var(--text)] sm:text-5xl md:text-6xl xl:text-7xl">
                I design and build product websites, internal tools, and AI
                workflows that make complex businesses easier to understand and easier to trust.
              </h1>
              <p className="mb-10 max-w-2xl text-lg font-light leading-relaxed text-[var(--text-muted)] sm:text-xl md:text-[1.35rem] xl:text-[1.55rem]">
                I design and build for operations, clinical AI, fintech, and commerce,
                turning products that are harder to explain, sell, or use than they should be
                into something clearer and easier to trust.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#featured-work"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4 squircle-pill bg-[var(--cta-bg)] text-[var(--cta-text)] font-medium transition-colors duration-200 hover:bg-[var(--cta-hover)]"
                >
                  View Case Studies
                  <ChevronDown
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-y-0.5"
                  />
                </a>
                <a
                  href="mailto:hello@dyrane.tech?subject=Project%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4 squircle-pill bg-[var(--cta-secondary-bg)] text-[var(--cta-secondary-text)] font-medium transition-colors duration-200 hover:bg-[var(--cta-secondary-hover)] hover:text-[var(--text)]"
                >
                  Start a Project
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden squircle-panel surface-panel p-6 md:p-8">
              {/* Typographic anchor — large background number for spatial depth */}
              <div
                className="pointer-events-none absolute -bottom-4 -right-4 select-none font-light leading-none tracking-tighter text-[var(--cat-ux)]"
                style={{ fontSize: "clamp(7rem, 15vw, 11rem)", opacity: 0.07 }}
                aria-hidden="true"
              >
                {totalProjects}+
              </div>

              <div className="absolute right-[-4rem] top-[-2rem] h-36 w-36 rounded-full bg-[var(--cat-ux-bg)] blur-3xl" />
              <div className="absolute bottom-[-3rem] left-[-1rem] h-32 w-32 rounded-full bg-[var(--cat-ux-bg)] blur-3xl" />

              <div className="relative">
                <p className="mb-6 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--cat-ux)]">
                  Where the work usually starts
                </p>

                {/* Kinetic showcase — all 3 cards present, inactive ones dim */}
                <div className="space-y-3">
                  {heroShowcase.map((item, i) => {
                    const isActive = i === activeShowcase;
                    return (
                      <button
                        key={item.title}
                        onClick={() => setActiveShowcase(i)}
                        className="w-full text-left squircle-nav p-4 md:p-5"
                        style={{
                          opacity: isActive ? 1 : 0.3,
                          background: isActive
                            ? "var(--surface-elevated-strong)"
                            : "var(--surface-elevated)",
                          boxShadow: isActive
                            ? `inset 0 1px 0 0 ${item.accent}44, var(--surface-shadow-tight)`
                            : "none",
                          transition: "opacity 300ms ease, background 300ms ease, box-shadow 300ms ease",
                        }}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: item.accent }}
                          />
                          <p className="text-[10px] font-mono uppercase tracking-[0.16em]" style={{ color: item.accent }}>
                            {item.label}
                          </p>
                        </div>
                        <h2 className="mb-2 text-xl font-medium tracking-tight text-[var(--text)] md:text-2xl">
                          {item.title}
                        </h2>
                        <div
                          style={{
                            maxHeight: isActive ? "5rem" : "0px",
                            opacity: isActive ? 1 : 0,
                            overflow: "hidden",
                            transition: "max-height 300ms ease, opacity 300ms ease",
                          }}
                        >
                          <p className="text-sm font-light leading-relaxed text-[var(--text-muted)] md:text-base">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mx-auto mb-16 max-w-7xl px-4 md:mb-20 md:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {proofStrip.map((item, index) => {
              const isFeaturedCard = index === proofStrip.length - 1;

              return (
              <div
                key={item.value}
                className={`squircle-nav surface-card group relative overflow-hidden p-5 md:p-7 ${
                  isFeaturedCard ? "col-span-2 text-center md:col-span-1 md:text-left" : ""
                }`}
              >
                {/* Accent rule */}
                <div className={`mb-4 h-px w-8 bg-[var(--cat-ux)] opacity-60 ${isFeaturedCard ? "mx-auto md:mx-0" : ""}`} />
                <div className="text-4xl font-light tracking-tight text-[var(--text)] md:text-5xl">
                  {item.value}
                </div>
                <div className="mt-3 text-[13px] font-light leading-relaxed text-[var(--text-muted)]">
                  {item.label}
                </div>
              </div>
            )})}
          </div>
        </section>

        <section
          id="featured-work"
          className="mx-auto mb-8 max-w-7xl scroll-mt-28 px-4 md:mb-10 md:px-6"
        >
          <div className="mb-10 max-w-3xl space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] bg-gradient-to-r from-[var(--cat-logistics)] via-[var(--cat-intelligence)] to-[var(--cat-ux)] bg-clip-text text-transparent">
              Case Studies
            </p>
            <h2 className="text-4xl font-light tracking-tight text-[var(--text)] md:text-5xl">
              Work that shows how I solve clarity problems.
            </h2>
            <p className="text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
              Three lanes, three kinds of products, and a faster read on what I build.
            </p>
          </div>
        </section>

        <ProjectGrid onProjectSelect={handleProjectSelect} />

        <ShowcaseSection onProjectSelect={handleProjectSelect} />

        <section
          id="services"
          className="mx-auto mb-16 max-w-7xl scroll-mt-28 px-4 md:mb-20 md:px-6"
        >
          <div className="mb-10 max-w-3xl space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--cat-ux)]">
              Services
            </p>
            <h2 className="text-4xl font-light tracking-tight text-[var(--text)] md:text-5xl">
              What I build most often.
            </h2>
            <p className="text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
              The main categories of work people usually hire me for.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.title}
                className="squircle-panel surface-panel p-6 md:p-7"
                style={{ 
                  boxShadow: `inset 0 1px 0 0 ${service.accent}33, var(--surface-shadow-tight)`,
                  borderRadius: undefined 
                }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: service.accent }} />
                  <span className="text-[10px] font-mono uppercase tracking-[0.14em]" style={{ color: service.accent }}>
                    {service.accent === "var(--cat-logistics)" ? "Operations" :
                     service.accent === "var(--cat-intelligence)" ? "AI Systems" : "Design"}
                  </span>
                </div>
                <h3 className="mb-3 text-2xl font-medium tracking-tight text-[var(--text)]">
                  {service.title}
                </h3>
                <p className="text-base font-light leading-relaxed text-[var(--text-muted)]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="how-i-work"
          className="mx-auto mb-16 max-w-7xl scroll-mt-28 px-4 md:mb-20 md:px-6"
        >
          <div className="mb-10 max-w-3xl space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--cat-ux)]">
              Process
            </p>
            <h2 className="text-4xl font-light tracking-tight text-[var(--text)] md:text-5xl">
              How the work gets clearer.
            </h2>
            <p className="text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
              The goal is to make the product easier to understand, easier to use, and easier to trust.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {processSteps.map((item, idx) => {
              const colors = ["var(--cat-logistics)", "var(--cat-intelligence)", "var(--cat-ux)"];
              const accent = colors[idx % colors.length];
              return (
                <article
                  key={item.step}
                  className="squircle-panel surface-card p-6"
                  style={{ 
                    boxShadow: `inset 0 1px 0 0 ${accent}33, var(--surface-shadow-tight)`,
                    borderRadius: undefined 
                  }}
                >
                  <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.18em]" style={{ color: accent }}>
                    Step {item.step}
                  </p>
                  <h3 className="mb-3 text-xl font-medium tracking-tight text-[var(--text)]">
                    {item.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-[var(--text-muted)]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="engineering-dna" className="scroll-mt-28">
          <ContributionGraph />
        </section>

        {/* ── Closing CTA — moment of decision before footer ────────────────── */}
        <HiringWorkflowSection />

        <section className="mx-auto mb-0 max-w-7xl px-4 pb-20 pt-16 md:px-6 md:pb-28 md:pt-24">
          <div className="relative overflow-hidden squircle-panel surface-panel px-8 py-14 md:px-16 md:py-20">
            {/* Background accent blobs */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[var(--cat-ux-bg)] blur-[60px]" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-[var(--cat-ux-bg)] blur-[60px] opacity-60" />

            <div className="relative flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--cat-ux)]">
                  Ready when you are
                </p>
                <h2 className="mb-4 text-3xl font-light tracking-tight text-[var(--text)] md:text-4xl xl:text-5xl">
                  Tell me what the product is, where people get stuck, and what needs to ship next.
                </h2>
                <p className="text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
                  That is enough context to start.
                </p>
              </div>

              <a
                href="mailto:hello@dyrane.tech?subject=Project%20Inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex shrink-0 items-center justify-center gap-2 px-7 py-4 squircle-pill bg-[var(--cta-bg)] text-[var(--cta-text)] font-medium transition-colors duration-200 hover:bg-[var(--cta-hover)]"
              >
                Start a Project
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </section>
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
