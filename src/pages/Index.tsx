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
import { ArrowUpRight, ChevronDown } from "@/components/icons/lucide";

const ProjectOverlay = lazy(() =>
  import("@/components/ProjectOverlay").then((m) => ({
    default: m.ProjectOverlay,
  }))
);

const heroShowcase = [
  {
    label: "For operators",
    title: "A platform that keeps live operations clear.",
    description: "Dispatch, routing, and real-time visibility without the usual workflow friction.",
    accent: "var(--cat-logistics)",
    accentBg: "var(--cat-logistics-bg)",
  },
  {
    label: "For teams using AI",
    title: "A tool that makes intelligence feel usable.",
    description: "Structured workflows that turn complex reasoning into something people can trust and act on.",
    accent: "var(--cat-intelligence)",
    accentBg: "var(--cat-intelligence-bg)",
  },
  {
    label: "For premium brands",
    title: "An experience that builds trust faster.",
    description: "Clear product presentation, stronger visual positioning, and a cleaner path to conversion.",
    accent: "var(--cat-ux)",
    accentBg: "var(--cat-ux-bg)",
  },
];

// Real data: summed from projects.ts
const totalCommits = projects.reduce((sum, p) => sum + p.github_stats.commits, 0);
const totalProjects = projects.length;

const proofStrip = [
  {
    value: `${(totalCommits / 1000).toFixed(1).replace(".0", "")}k+`,
    label: "production commits across live deployments",
  },
  {
    value: `${totalProjects}`,
    label: "shipped products across 3 domains",
  },
  {
    value: "< 90ms",
    label: "LCP target on every project build",
  },
  {
    value: "1 team",
    label: "strategy, design, and implementation — one workflow",
  },
];

const services = [
  {
    title: "Custom Websites and Product Surfaces",
    description:
      "Design and engineering handled together — so what ships looks exactly like what was decided, not a degraded version of it.",
    accent: "var(--cat-ux)",
    accentBg: "var(--cat-ux-bg)",
  },
  {
    title: "Internal Tools and Dashboards",
    description:
      "Rebuilt around how decisions actually get made — not around how the data happened to be stored.",
    accent: "var(--cat-logistics)",
    accentBg: "var(--cat-logistics-bg)",
  },
  {
    title: "AI Workflow Systems",
    description:
      "AI packaged into a structure your team can follow. The model does the reasoning. Users see the output, not the complexity.",
    accent: "var(--cat-intelligence)",
    accentBg: "var(--cat-intelligence-bg)",
  },
  {
    title: "UX Redesigns",
    description:
      "Start where the product is losing the user — then work backward. The goal is fewer hesitations, not a new color palette.",
    accent: "var(--cat-ux)",
    accentBg: "var(--cat-ux-bg)",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Understand what your product needs to communicate.",
    description:
      "Start with the business goal, what users are unsure about, and what needs to be clear within the first few seconds.",
  },
  {
    step: "02",
    title: "Design the experience around your customer.",
    description:
      "Shape the hierarchy, motion, and presentation so the product feels premium without becoming harder to understand.",
  },
  {
    step: "03",
    title: "Build it to ship cleanly.",
    description:
      "The design becomes a working product — fast, stable, and ready for real users. No handoff friction, no translation loss.",
  },
  {
    step: "04",
    title: "Polish the details people actually notice.",
    description:
      "Refine load behavior, copy, motion, and trust signals so the experience starts selling before the conversation does.",
  },
];

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

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    window.setTimeout(() => setSelectedProject(null), 500);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--surface)] font-sans text-[var(--text)] selection:bg-[var(--cat-ux-bg)] selection:text-[var(--text)] transition-colors duration-300">
      <Navbar />

      <>
        <div className="fixed inset-0 z-0 pointer-events-none contain-strict" aria-hidden="true">
        <div 
          className="ambient-blob-a absolute left-[-10%] top-[-20%] h-[50%] w-[50%] rounded-full blur-[100px] transition-all duration-1000 opacity-100 ambient-glow" 
          style={{ 
            '--active-accent': heroShowcase[activeShowcase].accent 
          } as React.CSSProperties}
        />
        <div 
          className="ambient-blob-b absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full blur-[100px] transition-all duration-1000 opacity-100 ambient-glow" 
          style={{ 
            '--active-accent': heroShowcase[activeShowcase].accent,
            animationDelay: "1s"
          } as React.CSSProperties}
        />
      </div>

      <main id="main-content" className="relative z-10 pt-[calc(4.75rem+env(safe-area-inset-top))] pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pt-32 md:pb-20">
        <section className="mx-auto mb-16 max-w-7xl px-4 md:mb-20 md:px-6">
          <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
            <div>
              <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--cat-ux)]">
                Alexander Dyrane · Engineering premium systems with design discipline
              </p>
              {/* Identity line — author voice before value proposition */}
              <p className="mb-5 max-w-xl text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
                I've built for emergency dispatch, financial rails, and clinical AI.
                The constant: it has to make sense in the first 3 seconds.
              </p>
              <h1 className="mb-6 max-w-4xl text-4xl font-light tracking-tighter text-[var(--text)] sm:text-5xl md:text-6xl xl:text-7xl">
                I build premium websites, AI tools, and custom platforms that
                make your business easier to understand and easier to trust.
              </h1>
              <p className="mb-10 max-w-2xl text-lg font-light leading-relaxed text-[var(--text-muted)] sm:text-xl md:text-[1.4rem] xl:text-2xl">
                Most clients arrive with the same problem: the product is real,
                but it doesn't feel real yet to the people who need to trust it.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:hello@dyrane.tech?subject=Project%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4 squircle-pill bg-[var(--cta-bg)] text-[var(--cta-text)] font-medium transition-colors duration-200 hover:bg-[var(--cta-hover)]"
                >
                  Start a Project
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </a>
                <a
                  href="#featured-work"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4 squircle-pill bg-[var(--cta-secondary-bg)] text-[var(--cta-secondary-text)] font-medium transition-colors duration-200 hover:bg-[var(--cta-secondary-hover)] hover:text-[var(--text)]"
                >
                  See Selected Work
                  <ChevronDown
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-y-0.5"
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
                  What clients usually come for
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
        
        <ShowcaseSection onProjectSelect={handleProjectSelect} />

        <section className="mx-auto mb-16 max-w-7xl px-4 md:mb-20 md:px-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {proofStrip.map((item) => (
              <div
                key={item.value}
                className="squircle-nav surface-card group relative overflow-hidden p-5 md:p-7"
              >
                {/* Accent rule */}
                <div className="mb-4 h-px w-8 bg-[var(--cat-ux)] opacity-60" />
                <div className="text-4xl font-light tracking-tight text-[var(--text)] md:text-5xl">
                  {item.value}
                </div>
                <div className="mt-3 text-[13px] font-light leading-relaxed text-[var(--text-muted)]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="services"
          className="mx-auto mb-16 max-w-7xl scroll-mt-28 px-4 md:mb-20 md:px-6"
        >
          <div className="mb-10 max-w-3xl space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--cat-ux)]">
              Services
            </p>
            <h2 className="text-4xl font-light tracking-tight text-[var(--text)] md:text-5xl">
              What you can hire me to do.
            </h2>
            <p className="text-lg font-light leading-relaxed text-[var(--text-muted)]">
              If you are paying for this kind of work, these are the outcomes
              the portfolio is built to make obvious.
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
              What working together should feel like.
            </h2>
            <p className="text-lg font-light leading-relaxed text-[var(--text-muted)]">
              The point is not to hand you a pretty interface. The point is to
              give you something clearer, stronger, and more useful to your business.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

        <section
          id="featured-work"
          className="mx-auto max-w-7xl scroll-mt-28 px-4 md:px-6"
        >
          <div className="max-w-3xl space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] bg-gradient-to-r from-[var(--cat-logistics)] via-[var(--cat-intelligence)] to-[var(--cat-ux)] bg-clip-text text-transparent">
              Selected Work
            </p>
            <h2 className="text-4xl font-light tracking-tight text-[var(--text)] md:text-5xl">
              Work that shows the kinds of problems I solve.
            </h2>
            <p className="text-lg font-light leading-relaxed text-[var(--text-muted)]">
              You should not have to guess what I do. These examples map
              directly to common client needs: operational clarity, usable AI,
              and premium product presentation.
            </p>
          </div>
        </section>

        <ProjectGrid onProjectSelect={handleProjectSelect} />

        <section id="engineering-dna" className="scroll-mt-28">
          <ContributionGraph />
        </section>

        {/* ── Closing CTA — moment of decision before footer ────────────────── */}
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
                  Good work starts with a clear conversation.
                </h2>
                <p className="text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
                  If you know what you need, or just have a problem worth solving,
                  that's enough to start.
                </p>
                <p className="mt-3 text-sm font-light text-[var(--text-ghost)]">
                  Usually responds within 24 hours.
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
    </>
  </div>
);
};

export default Index;
