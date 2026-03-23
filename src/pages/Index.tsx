import {
  Suspense,
  lazy,
  useState,
} from "react";
import type { Project } from "@/data/projects";
import { projects } from "@/data/projects";
import Footer from "@/pages/Footer";
import { ShowcaseSection } from "@/components/ShowcaseSection";
import { FloatingNav } from "@/components/FloatingNav";
import {
  buildProofStrip,
} from "@/content/homepage";
import { ArrowUpRight } from "@/components/icons/lucide";
import { HeroSerious } from "@/components/HeroSerious";
import ServicesMarquee from "@/components/ServicesMarquee";
import ProcessSteps from "@/components/ProcessSteps";

const ProjectOverlay = lazy(() =>
  import("@/components/ProjectOverlay").then((m) => ({
    default: m.ProjectOverlay,
  }))
);

// Real data: summed from projects.ts
const totalCommits = projects.reduce((sum, p) => sum + p.github_stats.commits, 0);

/**
 * Homepage route composing the portfolio narrative, proof, and project exploration flows.
 */
const Index = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

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
      <FloatingNav />

      <main id="main-content" className="relative z-10 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pb-20">
        <HeroSerious />
        
        <section className="w-full border-y border-[var(--surface-stroke)] bg-[var(--surface-alt)]/30 py-12 md:py-20">
          <div className="flex flex-wrap items-center justify-around gap-12 px-6 md:px-12 lg:px-24">
            {proofStrip.map((item) => {
              return (
                <div
                  key={item.value}
                  className="group relative flex flex-col items-center text-center md:items-start md:text-left"
                >
                  {/* Subtle accent glow behind numbers for depth */}
                  <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-[var(--cat-ux-bg)] blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-40" />
                  
                  <div className="relative text-6xl font-light tracking-[-0.08em] text-[var(--text)] sm:text-7xl md:text-8xl lg:text-9xl">
                    {item.value}
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-ghost)] transition-colors duration-300 group-hover:text-[var(--cat-ux)]">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* <div id="featured-work" className="scroll-mt-28 w-full"></div> */}

        {/* <ProjectGrid onProjectSelect={handleProjectSelect} /> */}

        <ShowcaseSection onProjectSelect={handleProjectSelect} />

        <ServicesMarquee />
        
        <ProcessSteps />

        {/* ── MASSIVE FINAL CTA ────────────────── */}
        <section
          id="contact"
          className="relative w-full pb-32 pt-24 md:pb-48 md:pt-40 bg-[var(--surface)] flex flex-col items-center justify-center text-center overflow-hidden"
        >
          {/* Subtle background glow pulsing behind the massive text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-[var(--cat-ux-bg)] opacity-30 blur-[120px] pointer-events-none mix-blend-screen" />
          
          <div className="relative z-10 flex flex-col items-center px-6">
            <h2 className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-light leading-[0.85] tracking-tighter select-none mb-16">
              <span className="block text-[var(--text-ghost)] mix-blend-plus-lighter" style={{ WebkitTextStroke: "1px var(--text-dim)", color: "transparent" }}>Tell me what</span>
              <span className="block text-[var(--text)]" style={{ textShadow: "0 0 60px rgba(255,255,255,0.1)" }}>needs to ship.</span>
            </h2>
            
            <a
              href="mailto:hello@dyrane.tech?subject=Project%20Inquiry"
              className="group relative inline-flex items-center justify-center gap-4 md:gap-6 text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-700"
            >
              <span>hello@dyrane.tech</span>
              <ArrowUpRight
                strokeWidth={1.5}
                className="w-10 h-10 md:w-16 md:h-16 transition-transform duration-700 group-hover:translate-x-3 group-hover:-translate-y-3 opacity-30 group-hover:opacity-100"
                style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
              />
              <div
                className="absolute -bottom-4 md:-bottom-8 left-0 h-[2px] w-0 bg-[var(--text)] transition-all duration-700 group-hover:w-full opacity-60"
                style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
              />
            </a>
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
