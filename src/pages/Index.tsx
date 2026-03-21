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
import { ArrowUpRight, ChevronDown, Code, Globe, Layers, Zap } from "@/components/icons/lucide";
import {
  siClaude,
  siDribbble,
  siExpo,
  siFigma,
  siGoogledocs,
  siGoogleauthenticator,
  siHostinger,
  siMiro,
  siNotion,
  siNextdotjs,
  siPinterest,
  siRadixui,
  siResend,
  siSupabase,
  siTailwindcss,
  siTrello,
  siTypescript,
  siVercel,
  siVite,
  siNodedotjs,
} from "simple-icons";

const ProjectOverlay = lazy(() =>
  import("@/components/ProjectOverlay").then((m) => ({
    default: m.ProjectOverlay,
  }))
);

const heroShowcase = [
  {
    label: "For operations teams",
    title: "Software that keeps live work clear.",
    description: "Dispatch, routing, and live visibility designed to reduce handoff friction.",
    accent: "var(--cat-logistics)",
    accentBg: "var(--cat-logistics-bg)",
  },
  {
    label: "For AI products",
    title: "AI that feels structured and trustworthy.",
    description: "Complex reasoning turned into workflows people can understand and act on.",
    accent: "var(--cat-intelligence)",
    accentBg: "var(--cat-intelligence-bg)",
  },
  {
    label: "For product-led brands",
    title: "Interfaces that help buyers trust faster.",
    description: "Clear positioning, stronger product presentation, and a cleaner path to action.",
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
    label: "commits across shipped portfolio work",
  },
  {
    value: "3 lanes",
    label: "operations, AI workflows, and product UX",
  },
  {
    value: "1 workflow",
    label: "strategy, design, and implementation stay aligned",
  },
];

const services = [
  {
    title: "Custom Websites and Product Surfaces",
    description:
      "Marketing sites, landing pages, and product surfaces built so the message, interaction, and implementation stay aligned.",
    accent: "var(--cat-ux)",
    accentBg: "var(--cat-ux-bg)",
  },
  {
    title: "Internal Tools and Dashboards",
    description:
      "Operational software shaped around decisions, handoffs, and visibility instead of raw database structure.",
    accent: "var(--cat-logistics)",
    accentBg: "var(--cat-logistics-bg)",
  },
  {
    title: "AI Workflow Systems",
    description:
      "AI packaged into a workflow your team can follow, with the model doing the reasoning and the interface carrying the clarity.",
    accent: "var(--cat-intelligence)",
    accentBg: "var(--cat-intelligence-bg)",
  },
  {
    title: "UX Redesigns",
    description:
      "Focused redesigns for products that already work but are losing trust, clarity, or momentum in the interface.",
    accent: "var(--cat-ux)",
    accentBg: "var(--cat-ux-bg)",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Find where trust or clarity breaks.",
    description:
      "Start with the business goal, what users are unsure about, and what needs to become obvious within the first few seconds.",
  },
  {
    step: "02",
    title: "Reshape the workflow and message around that moment.",
    description:
      "Adjust hierarchy, interaction, and copy so the product becomes easier to scan, easier to use, and easier to believe.",
  },
  {
    step: "03",
    title: "Build the final version and sharpen the proof.",
    description:
      "The same pass that shapes the structure also ships the product, tightens performance, and strengthens the signals people use to decide.",
  },
];

type HiringTool = {
  label: string;
  logo: {
    path?: string;
    hex: string;
    glyph?: string;
    fillRule?: "evenodd" | "nonzero";
    clipRule?: "evenodd" | "nonzero";
  };
};

type HiringStage = {
  title: string;
  heading: string;
  description: string;
  tools: HiringTool[];
  accent: string;
  icon: typeof Layers;
};

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const hiringFlow: HiringStage[] = [
  {
    title: "Direction",
    heading: "Product direction",
    description:
      "Frame the product, define the audience, map the workflow, and get the thinking aligned before design or code starts.",
    tools: [
      { label: "Pinterest", logo: siPinterest },
      { label: "Miro", logo: siMiro },
      { label: "Notion", logo: siNotion },
      { label: "Google Docs", logo: siGoogledocs },
      { label: "Trello", logo: siTrello },
      { label: "Claude", logo: siClaude },
    ],
    accent: "var(--cat-logistics)",
    icon: Layers,
  },
  {
    title: "Design",
    heading: "Interface design",
    description:
      "Turn the strategy into interface systems, component decisions, visual hierarchy, and product surfaces people can actually scan.",
    tools: [
      { label: "Figma", logo: siFigma },
      {
        label: "ChatGPT",
        logo: {
          hex: "101010",
          fillRule: "evenodd",
          path: "M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z",
        },
      },
      { label: "Dribbble", logo: siDribbble },
      { label: "Mobbin", logo: { hex: "111111", glyph: "MB" } },
      { label: "Radix UI", logo: siRadixui },
      { label: "Tailwind", logo: siTailwindcss },
    ],
    accent: "var(--cat-intelligence)",
    icon: Zap,
  },
  {
    title: "Build",
    heading: "Frontend build",
    description:
      "Move from specification to real product code, with implementation decisions that preserve the clarity established in design.",
    tools: [
      { label: "Next.js", logo: siNextdotjs },
      { label: "TypeScript", logo: siTypescript },
      { label: "Node.js", logo: siNodedotjs },
      { label: "Vite", logo: siVite },
      { label: "Expo", logo: siExpo },
      {
        label: "OpenAI Codex",
        logo: {
          hex: "101010",
          fillRule: "evenodd",
          clipRule: "evenodd",
          path: "M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z",
        },
      },
    ],
    accent: "var(--cat-ux)",
    icon: Code,
  },
  {
    title: "Ship",
    heading: "Production ship",
    description:
      "Choose the practical production stack for deployment, domains, auth, email, and data without turning infrastructure into the story.",
    tools: [
      { label: "Vercel", logo: siVercel },
      { label: "Hostinger", logo: siHostinger },
      { label: "Resend", logo: siResend },
      { label: "Google Auth", logo: siGoogleauthenticator },
      { label: "Supabase", logo: siSupabase },
      { label: "AWS", logo: { hex: "FF9900", glyph: "AWS" } },
    ],
    accent: "var(--cat-logistics)",
    icon: Globe,
  },
];

const HiringToolBadge = ({ tool }: { tool: HiringTool }) => (
  <div className="flex items-center gap-2 squircle-chip surface-chip px-3 py-2.5">
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
      style={{
        background: hexToRgba(tool.logo.hex, 0.12),
        color: `#${tool.logo.hex}`,
      }}
    >
      {tool.logo.path ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path
            clipRule={tool.logo.clipRule}
            d={tool.logo.path}
            fillRule={tool.logo.fillRule}
          />
        </svg>
      ) : tool.logo.glyph ? (
        <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.08em]">
          {tool.logo.glyph}
        </span>
      ) : null}
    </div>
    <span className="min-w-0 text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--text-dim)]">
      {tool.label}
    </span>
  </div>
);

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [activeShowcase, setActiveShowcase] = useState(0);
  const [activeHiringStage, setActiveHiringStage] = useState(0);

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

  const currentHiringStage = hiringFlow[activeHiringStage];
  const CurrentHiringIcon = currentHiringStage.icon;

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
        <section className="mx-auto mb-16 max-w-7xl px-4 md:mb-20 md:px-6">
          <div className="relative overflow-hidden squircle-panel surface-panel p-6 md:p-8">
            <div className="pointer-events-none absolute -right-12 top-0 h-44 w-44 rounded-full bg-[var(--cat-ux-bg)] blur-[56px]" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-[var(--cat-logistics-bg)] blur-[48px]" />

            <div className="relative">
              <div className="mb-10 max-w-3xl space-y-4">
                <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--cat-ux)]">
                  For Hiring Teams
                </p>
                <h2 className="text-4xl font-light tracking-tight text-[var(--text)] md:text-5xl">
                  A clear view of how products move from concept to production.
                </h2>
                <p className="text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
                  One workflow across product direction, interface systems, frontend implementation,
                  and launch quality, with the stack choices that support it.
                </p>
                <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-dim)]">
                  Tap a stage to reveal the stack and handoff.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {hiringFlow.map((stage, index) => {
                  const StageIcon = stage.icon;
                  const isActive = activeHiringStage === index;

                  return (
                    <button
                      key={stage.title}
                      type="button"
                      onClick={() => setActiveHiringStage(index)}
                      aria-pressed={isActive}
                      className="squircle-panel surface-card p-5 text-left transition-all duration-250 hover:-translate-y-0.5"
                      style={{
                        background: isActive ? hexToRgba(stage.tools[0].logo.hex, 0.08) : undefined,
                        boxShadow: isActive
                          ? `inset 0 1px 0 0 ${stage.accent}55, 0 18px 44px -32px ${stage.accent}66`
                          : `inset 0 1px 0 0 ${stage.accent}33, var(--surface-shadow-tight)`,
                        borderRadius: undefined,
                      }}
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center squircle-icon surface-chip"
                          style={{
                            color: stage.accent,
                            background: isActive ? hexToRgba(stage.tools[0].logo.hex, 0.12) : undefined,
                          }}
                        >
                          <StageIcon size={18} />
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-mono uppercase tracking-[0.16em]"
                            style={{ color: stage.accent }}
                          >
                            0{index + 1} {stage.title}
                          </p>
                          <h3 className="text-lg font-medium tracking-tight text-[var(--text)]">
                            {stage.heading}
                          </h3>
                        </div>
                      </div>

                      <p className="line-clamp-3 text-sm font-light leading-relaxed text-[var(--text-muted)]">
                        {stage.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {stage.tools.slice(0, 3).map((tool) => (
                          <span
                            key={tool.label}
                            className="squircle-chip surface-chip px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--text-dim)]"
                          >
                            {tool.label}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div
                className="mt-6 grid gap-6 squircle-panel surface-card p-6 md:grid-cols-[0.9fr_1.1fr] md:p-7"
                style={{
                  boxShadow: `inset 0 1px 0 0 ${currentHiringStage.accent}44, var(--surface-shadow-tight)`,
                  borderRadius: undefined,
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center squircle-icon surface-chip"
                      style={{
                        color: currentHiringStage.accent,
                        background: hexToRgba(currentHiringStage.tools[0].logo.hex, 0.12),
                      }}
                    >
                      <CurrentHiringIcon size={18} />
                    </div>
                    <div>
                      <p
                        className="text-[10px] font-mono uppercase tracking-[0.16em]"
                        style={{ color: currentHiringStage.accent }}
                      >
                        Active stage
                      </p>
                      <h3 className="text-2xl font-medium tracking-tight text-[var(--text)]">
                        {currentHiringStage.heading}
                      </h3>
                    </div>
                  </div>

                  <p className="max-w-xl text-base font-light leading-relaxed text-[var(--text-muted)]">
                    {currentHiringStage.description}
                  </p>

                  <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-dim)]">
                    End-to-end ownership means the tool choice stays in service of the product,
                    not the other way around.
                  </p>
                </div>

                <div>
                  <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--text-dim)]">
                    Selected stack
                  </p>
                  <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
                    {currentHiringStage.tools.map((tool) => (
                      <HiringToolBadge
                        key={tool.label}
                        tool={tool}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
    </>
  </div>
);
};

export default Index;
