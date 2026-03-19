import {
  Suspense,
  lazy,
  useState,
} from "react";
import type { Project } from "@/data/projects";
import { Navbar } from "@/pages/Navbar";
import Footer from "@/pages/Footer";
import { ProjectGrid } from "@/components/ProjectGrid";
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
  },
  {
    label: "For teams using AI",
    title: "A tool that makes intelligence feel usable.",
    description: "Structured workflows that turn complex reasoning into something people can trust and act on.",
  },
  {
    label: "For premium brands",
    title: "An experience that builds trust faster.",
    description: "Clear product presentation, stronger visual positioning, and a cleaner path to conversion.",
  },
];

const proofStrip = [
  { value: "Premium", label: "experiences that feel credible from the first screen" },
  { value: "Useful", label: "AI and operations products people can actually use" },
  { value: "Fast", label: "production-minded builds without unnecessary weight" },
  { value: "End-to-end", label: "strategy, design, and implementation in one workflow" },
];

const services = [
  {
    title: "Custom Websites and Product Surfaces",
    description:
      "For brands and products that need to look premium, explain value fast, and convert with less friction.",
  },
  {
    title: "Internal Tools and Dashboards",
    description:
      "For teams losing time to messy workflows, weak visibility, or tools that make simple tasks feel harder than they should.",
  },
  {
    title: "AI Workflow Systems",
    description:
      "For companies that want AI to support real decisions, triage, or automation without making users wrestle with the technology.",
  },
  {
    title: "UX Redesigns",
    description:
      "For products that already work, but do not yet feel clear, trustworthy, or strong enough to sell themselves.",
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
      "Turn the system into fast front-end architecture, durable components, and production-ready implementation.",
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

      <div className="fixed inset-0 z-0 pointer-events-none contain-strict" aria-hidden="true">
        <div className="absolute left-[-10%] top-[-20%] h-[50%] w-[50%] rounded-full bg-[var(--cat-ux-bg)] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-[var(--cat-ux-bg)] opacity-60 blur-[120px]" />
      </div>

      <main className="relative z-10 pt-[calc(4.75rem+env(safe-area-inset-top))] pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pt-32 md:pb-20">
        <section className="mx-auto mb-16 max-w-7xl px-4 md:mb-20 md:px-6">
          <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
            <div>
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--cat-ux)]">
                For teams that need clarity, trust, and speed
              </p>
              <h1 className="mb-6 max-w-4xl text-4xl font-light tracking-tighter text-[var(--text)] sm:text-5xl md:text-6xl xl:text-7xl">
                I build premium websites, AI tools, and custom platforms that
                make your business easier to understand and easier to trust.
              </h1>
              <p className="mb-10 max-w-2xl text-lg font-light leading-relaxed text-[var(--text-muted)] sm:text-xl md:text-[1.4rem] xl:text-2xl">
                If you need a stronger digital first impression, a cleaner
                internal tool, or an AI workflow people will actually use, this
                is the kind of work I do.
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

              <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-[var(--text-muted)]">
                Everything here is shaped to answer the questions clients care
                about first: what you do, why it matters, and whether it feels
                strong enough to trust with real work.
              </p>
            </div>

            <div className="relative overflow-hidden squircle-panel surface-panel p-6 md:p-8">
              <div className="absolute right-[-4rem] top-[-2rem] h-36 w-36 rounded-full bg-[var(--cat-ux-bg)] blur-3xl" />
              <div className="absolute bottom-[-3rem] left-[-1rem] h-32 w-32 rounded-full bg-[var(--cat-ux-bg)] blur-3xl" />

              <div className="relative">
                <p className="mb-6 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--cat-ux)]">
                  What clients usually come for
                </p>
                <div className="space-y-4">
                  {heroShowcase.map((item) => (
                    <div
                      key={item.title}
                      className="squircle-nav surface-card p-4 md:p-5"
                    >
                      <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--text-ghost)]">
                        {item.label}
                      </p>
                      <h2 className="mb-2 text-2xl font-medium tracking-tight text-[var(--text)]">
                        {item.title}
                      </h2>
                      <p className="text-sm font-light leading-relaxed text-[var(--text-muted)] md:text-base">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm font-light leading-relaxed text-[var(--text-muted)]">
                  The goal is simple: make the right person understand the value
                  quickly, feel the quality immediately, and know where to go next.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mb-16 max-w-7xl px-4 md:mb-20 md:px-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {proofStrip.map((item) => (
              <div
                key={item.value}
                className="squircle-nav surface-card p-5 md:p-6"
              >
                <div className="mb-2 text-2xl font-light tracking-tight text-[var(--text)]">
                  {item.value}
                </div>
                <div className="text-sm font-light leading-relaxed text-[var(--text-muted)]">
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
              >
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
            {processSteps.map((item) => (
              <article
                key={item.step}
                className="squircle-panel surface-card p-6"
              >
                <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--cat-ux)]">
                  Step {item.step}
                </p>
                <h3 className="mb-3 text-xl font-medium tracking-tight text-[var(--text)]">
                  {item.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-[var(--text-muted)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="featured-work"
          className="mx-auto max-w-7xl scroll-mt-28 px-4 md:px-6"
        >
          <div className="max-w-3xl space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--cat-ux)]">
              Featured Work
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
