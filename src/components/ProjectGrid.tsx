import { useState, useEffect } from "react";
import type { Project } from "@/data/projects";
import { projects } from "@/data/projects";
import {
  ArrowUpRight,
  ExternalLink,
  GitCommit,
  Globe,
  Star,
} from "@/components/icons/lucide";

interface ProjectGridProps {
  onProjectSelect: (project: Project) => void;
}

type CategoryMeta = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  proof: string;
  signals: string[];
  featuredTitle: string;
  accent: string;
  accentBg: string;
};

type FeaturedStory = {
  label: string;
  audience: string;
  summary: string;
  clientNeed: string;
  previewLines: [string, string, string];
  outcomes: string[];
};

const categoryMeta: Record<Project["category"], CategoryMeta> = {
  "Logistics Engine": {
    id: "logistics-engine",
    eyebrow: "When timing and coordination matter",
    title: "Use software that keeps live operations clear and coordinated.",
    description:
      "These projects are for teams that need dispatch, routing, tracking, or real-time visibility without operational confusion.",
    proof: "Best fit when delays, handoffs, and blind spots are costing the team time, confidence, or customer trust.",
    signals: ["Real-time visibility", "Dispatch clarity", "Operational confidence"],
    featuredTitle: "iVisit Ecosystem",
    accent: "var(--cat-logistics)",
    accentBg: "var(--cat-logistics-bg)",
  },
  "Intelligence Bridge": {
    id: "intelligence-bridge",
    eyebrow: "When AI needs to do real work",
    title: "Turn complex reasoning into tools your team can actually use.",
    description:
      "These products package AI and automation into clear workflows instead of making users deal with model complexity.",
    proof: "Best fit when you need smarter workflows, triage, or decision support that still feels human and trustworthy.",
    signals: ["Usable AI", "Clear workflows", "Decision support"],
    featuredTitle: "Dr. Dyrane",
    accent: "var(--cat-intelligence)",
    accentBg: "var(--cat-intelligence-bg)",
  },
  "Modernized UX": {
    id: "modernized-ux",
    eyebrow: "When the product is good but the presentation is weak",
    title: "Make the experience clearer, stronger, and easier to trust.",
    description:
      "These projects focus on positioning, conversion, and interface polish so the product feels credible before the sales call.",
    proof: "Best fit when the product exists, but the presentation is not yet helping the business sell, convert, or reassure.",
    signals: ["Trust signals", "Clear positioning", "Stronger conversion path"],
    featuredTitle: "House of Prax",
    accent: "var(--cat-ux)",
    accentBg: "var(--cat-ux-bg)",
  },
};

const categoryOrder: Project["category"][] = [
  "Logistics Engine",
  "Intelligence Bridge",
  "Modernized UX",
];

const featuredStories: Record<string, FeaturedStory> = {
  "iVisit Ecosystem": {
    label: "Emergency dispatch platform",
    audience: "Operations and response teams",
    summary:
      "A real-time dispatch product that keeps ambulance teams, routing, and hospital visibility in sync.",
    clientNeed:
      "Best when coordination is breaking down across the control room, field team, and receiving location.",
    previewLines: ["Live dispatch", "Route visibility", "Cleaner handoffs"],
    outcomes: ["Operational clarity", "Faster coordination", "Live system visibility"],
  },
  "Dr. Dyrane": {
    label: "Clinical AI triage engine",
    audience: "Health products using AI",
    summary:
      "Structured symptom intake and clinical reasoning packaged into a product people can actually use and trust.",
    clientNeed:
      "Best when AI needs to support real decisions without feeling vague, unsafe, or hard to trust.",
    previewLines: ["Structured intake", "Clinical logic", "Safer triage"],
    outcomes: ["Usable intelligence", "Safer escalation", "Decision support"],
  },
  "House of Prax": {
    label: "E-commerce storefront",
    audience: "Consumer and wellness brands",
    summary:
      "A commerce experience designed to make product quality, trust, and buying intent feel obvious.",
    clientNeed:
      "Best when the product is strong but the storefront is not doing enough to position or convert it.",
    previewLines: ["Product clarity", "Brand trust", "Cleaner buying flow"],
    outcomes: ["Stronger positioning", "Clearer product story", "Conversion support"],
  },
};

const formatCommits = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(".0", "")}k+`;
  }

  return count.toString();
};

const getProjectUrl = (project: Project) => `https://${project.link}`;

const getArchiveBlurb = (project: Project) => {
  const firstSentence = project.description.split(". ")[0]?.trim() ?? project.description;
  const normalized = firstSentence.endsWith(".")
    ? firstSentence
    : `${firstSentence}.`;

  return normalized.length > 112 ? `${normalized.slice(0, 109).trimEnd()}...` : normalized;
};

// ─── Live screenshot component ────────────────────────────────────────────────
// Uses thum.io (free, no key) to fetch a real screenshot of the live project.
// Falls back to the CSS composition if the image fails to load.

const LogisticsVisual = () => (
  <div className="relative flex h-full min-h-[14rem] flex-col gap-2 overflow-hidden rounded-2xl bg-[var(--surface-elevated)] p-4">
    <div className="mb-1 flex items-center justify-between">
      <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-[var(--cat-logistics)]">Live Dispatch</span>
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--cat-logistics)] opacity-90" style={{ boxShadow: "0 0 6px var(--cat-logistics)" }} />
        <span className="text-[9px] font-mono text-[var(--text-ghost)]">4 active</span>
      </span>
    </div>
    {[
      { id: "U-04", status: "En Route", pct: 72, active: true },
      { id: "U-11", status: "Dispatched", pct: 38, active: false },
      { id: "U-07", status: "On Scene", pct: 91, active: false },
      { id: "U-02", status: "Standby", pct: 12, active: false },
    ].map((row) => (
      <div key={row.id} className="squircle-chip surface-chip px-3 py-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-mono font-medium text-[var(--text)]">{row.id}</span>
          <span className="text-[9px] font-mono text-[var(--text-ghost)]">{row.status}</span>
        </div>
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-[var(--surface-stroke)]">
          <div className="h-full rounded-full bg-[var(--cat-logistics)]" style={{ width: `${row.pct}%`, opacity: row.active ? 1 : 0.45 }} />
        </div>
      </div>
    ))}
  </div>
);

const IntelligenceVisual = () => (
  <div className="relative flex h-full min-h-[14rem] flex-col gap-2 overflow-hidden rounded-2xl bg-[var(--surface-elevated)] p-4">
    <span className="mb-1 text-[9px] font-mono uppercase tracking-[0.16em] text-[var(--cat-intelligence)]">Clinical Reasoning</span>
    {[
      { step: "S", label: "Subjective", detail: "Chest pain 7/10, onset 2h ago", done: true },
      { step: "O", label: "Objective", detail: "HR 112, BP 145/92, SpO₂ 97%", done: true },
      { step: "A", label: "Assessment", detail: "DDx narrowing → ACS P>88%", active: true },
      { step: "P", label: "Plan", detail: "Awaiting...", done: false },
    ].map((item) => (
      <div
        key={item.step}
        className="flex items-start gap-3 squircle-chip px-3 py-2.5"
        style={{
          background: item.active ? "var(--surface-elevated-strong)" : "var(--surface-elevated)",
          opacity: item.done || item.active ? 1 : 0.35,
        }}
      >
        <span className="mt-0.5 text-[10px] font-mono font-medium text-[var(--cat-intelligence)]">{item.step}</span>
        <div className="min-w-0">
          <p className="text-[9px] font-mono uppercase tracking-[0.12em] text-[var(--text-ghost)]">{item.label}</p>
          <p className="truncate text-[11px] font-light text-[var(--text-muted)]">{item.detail}</p>
        </div>
        {item.done && <div className="ml-auto mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--cat-intelligence)] opacity-70" />}
      </div>
    ))}
  </div>
);

const UXVisual = () => (
  <div className="relative flex h-full min-h-[14rem] flex-col gap-3 overflow-hidden rounded-2xl bg-[var(--surface-elevated)] p-4">
    <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-[var(--cat-ux)]">Product Surface</span>
    <div className="squircle-panel surface-card flex items-center gap-3 px-4 py-3">
      <div className="h-7 w-7 shrink-0 rounded-lg bg-[var(--cat-ux)] opacity-80" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2 w-24 rounded-full bg-[var(--text)] opacity-80" />
        <div className="h-1.5 w-16 rounded-full bg-[var(--text-ghost)] opacity-60" />
      </div>
      <div className="squircle-pill px-2.5 py-1 text-[9px] font-mono font-medium text-[var(--cta-text)]" style={{ background: "var(--cta-bg)" }}>Buy</div>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "Offer", value: "Clear" },
        { label: "Trust", value: "Visible" },
        { label: "Action", value: "Direct" },
      ].map((signal) => (
        <div key={signal.label} className="squircle-chip surface-chip p-2.5 text-center">
          <div className="text-sm font-light tracking-tight text-[var(--text)]">{signal.value}</div>
          <div className="mt-1 text-[8px] font-mono uppercase tracking-[0.1em] text-[var(--text-ghost)]">{signal.label}</div>
        </div>
      ))}
    </div>
    <div className="space-y-1.5 px-1">
      <div className="h-1.5 w-full rounded-full bg-[var(--surface-stroke)]" />
      <div className="h-1.5 w-4/5 rounded-full bg-[var(--surface-stroke)]" />
      <div className="h-1.5 w-3/5 rounded-full bg-[var(--surface-stroke)]" />
    </div>
  </div>
);

const CATEGORY_FALLBACK: Record<Project["category"], React.FC> = {
  "Logistics Engine": LogisticsVisual,
  "Intelligence Bridge": IntelligenceVisual,
  "Modernized UX": UXVisual,
};

// Screenshot URL via thum.io — free, no API key, caches at edge
// Fetch real og:image via microlink JSON API (respects the site's own OG image)
const OGScreenshot = ({
  project,
}: {
  project: Project;
}) => {
  const Fallback = CATEGORY_FALLBACK[project.category];
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const [aspectRatio, setAspectRatio] = useState<string>("16/9");
  const siteUrl = getProjectUrl(project);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    setImgSrc(null);

    fetch(`https://api.microlink.io?url=${encodeURIComponent(siteUrl)}&meta=true`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const url: string | undefined = data?.data?.image?.url ?? data?.data?.screenshot?.url;
        if (url) {
          const img = new Image();
          img.onload = () => { 
            if (!cancelled) { 
              const ratio = img.width / img.height;
              setAspectRatio(ratio > 0.8 && ratio < 1.2 ? "1/1" : "16/9");
              setImgSrc(url); 
              setState("loaded"); 
            } 
          };
          img.onerror = () => { if (!cancelled) setState("error"); };
          img.src = url;
        } else {
          setState("error");
        }
      })
      .catch(() => { if (!cancelled) setState("error"); });

    return () => { cancelled = true; };
  }, [siteUrl]);

  if (state === "error") return <Fallback />;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-[var(--surface-elevated)] transition-all duration-500"
      style={{ aspectRatio }}
    >
      {/* Skeleton shimmer while loading */}
      {state === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-[var(--surface-elevated-strong)]" />
      )}

      {/* Real OG image */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={`${project.title} — live product`}
          className="h-full w-full object-contain object-top transition-opacity duration-500"
          style={{ opacity: state === "loaded" ? 1 : 0 }}
          loading="lazy"
          decoding="async"
        />
      )}

      {/* Bottom scrim */}
      <div
        className="absolute inset-x-0 bottom-0 h-16"
        style={{ background: "var(--scrim-card)" }}
      />

      {/* Live URL badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 squircle-chip bg-[var(--surface-glass)] px-2.5 py-1 backdrop-blur-sm">
        <Globe size={9} style={{ color: categoryMeta[project.category].accent }} />
        <span className="text-[9px] font-mono text-[var(--text-muted)]">{project.link}</span>
      </div>
    </div>
  );
};

const ProductPreview = ({
  project,
  meta,
  story,
}: {
  project: Project;
  meta: CategoryMeta;
  story: FeaturedStory;
}) => {
  return (
  <div className="relative overflow-hidden squircle-panel bg-[var(--surface-elevated-strong)] p-4 md:p-5">
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5" />
    <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl" style={{ background: meta.accentBg }} />
    <div className="absolute -bottom-12 left-10 h-32 w-32 rounded-full blur-3xl" style={{ background: meta.accentBg }} />

    <div className="relative flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3 squircle-chip surface-chip px-3.5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full opacity-80" style={{ background: meta.accent }} />
            <span className="h-2 w-2 rounded-full opacity-55" style={{ background: meta.accent }} />
            <span className="h-2 w-2 rounded-full opacity-35" style={{ background: meta.accent }} />
          </div>
          <span className="truncate text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-dim)]">
            {story.label}
          </span>
        </div>
        <span className="hidden text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-ghost)] sm:block">
          {project.link}
        </span>
      </div>

      <div className="grid flex-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        {/* ── Live screenshot + CSS fallback ── */}
        <div className="flex h-full flex-col gap-4 squircle-panel surface-card p-4 md:p-5">
          <OGScreenshot project={project} />
          <div className="mt-auto space-y-3">
            <p className="max-w-lg text-sm font-light leading-relaxed text-[var(--text-muted)] md:text-base">
              {story.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {story.outcomes.map((outcome) => (
                <span
                  key={outcome}
                  className="squircle-chip surface-chip px-3 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--text-dim)]"
                >
                  {outcome}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="squircle-panel surface-card p-4 md:p-5">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-ghost)]">
              Build history
            </p>
            <div className="text-3xl font-light tracking-tight text-[var(--text)]">
              {formatCommits(project.github_stats.commits)}
            </div>
            <p className="mt-2 text-sm font-light leading-relaxed text-[var(--text-muted)]">
              Commit history across the shipped product.
            </p>
          </div>

          <div className="squircle-panel surface-card p-4 md:p-5">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-ghost)]">
              Core stack
            </p>
            <div className="text-3xl font-light tracking-tight text-[var(--text)]">
              {project.github_stats.languages.length}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.github_stats.languages.slice(0, 3).map((language) => (
                <span
                  key={language}
                  className="squircle-chip surface-chip px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--text-dim)]"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          <div className="squircle-panel surface-card p-4 md:p-5">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-ghost)]">
              What teams need
            </p>
            <div className="space-y-2">
              {meta.signals.map((signal) => (
                <div
                  key={signal}
                  className="text-sm font-light leading-relaxed text-[var(--text-muted)]"
                >
                  {signal}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};


const ProjectSurface = ({
  project,
  meta,
  onProjectSelect,
}: {
  project: Project;
  meta: CategoryMeta;
  onProjectSelect: (project: Project) => void;
}) => {
  const story = featuredStories[project.title] ?? {
    label: "Featured product",
    audience: "Selected client work",
    summary: project.description,
    clientNeed: meta.proof,
    previewLines: ["Clear value", "Strong design", "Ready to ship"],
    outcomes: meta.signals,
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
      <div className="relative overflow-hidden squircle-panel surface-panel p-6 md:p-8">
        <div className="absolute right-[-4rem] top-[-3rem] h-40 w-40 rounded-full bg-[var(--cat-ux-bg)] blur-3xl" />
        <div className="absolute bottom-[-4rem] right-8 h-36 w-36 rounded-full bg-[var(--cat-ux-bg)] blur-3xl" />

        <div className="relative flex h-full flex-col">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-[0.18em]" style={{ color: meta.accent }}>
                Featured Case Study
              </p>
              <h3 className="max-w-2xl text-4xl font-light tracking-tight text-[var(--text)] md:text-5xl">
                {project.title}
              </h3>
              <p className="max-w-2xl text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
                {story.summary}
              </p>
            </div>
            <a
              href={getProjectUrl(project)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 squircle-pill surface-chip px-4 py-2 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-dim)] transition-colors duration-200 hover:text-[var(--text)] lg:inline-flex"
            >
              Open Live Site
              <ExternalLink size={13} />
            </a>
          </div>

          <ProductPreview project={project} meta={meta} story={story} />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => onProjectSelect(project)}
              className="inline-flex items-center justify-center gap-2 squircle-pill bg-[var(--cta-bg)] px-6 py-3.5 text-sm font-medium text-[var(--cta-text)] transition-colors duration-200 hover:bg-[var(--cta-hover)]"
            >
              View Case Study
              <ArrowUpRight size={16} />
            </button>
            <a
              href={getProjectUrl(project)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 squircle-pill bg-[var(--cta-secondary-bg)] px-6 py-3.5 text-sm font-medium text-[var(--cta-secondary-text)] transition-colors duration-200 hover:bg-[var(--cta-secondary-hover)] hover:text-[var(--text)]"
            >
              Open Live Site
              <Globe size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="squircle-panel surface-card p-6">
          <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--cat-ux)]">
            What it solves
          </p>
          <p className="text-base font-light leading-relaxed text-[var(--text-muted)]">
            {story.label}. {story.summary}
          </p>
        </div>

        <div className="squircle-panel surface-card p-6">
          <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--cat-ux)]">
            Best fit
          </p>
          <p className="text-base font-light leading-relaxed text-[var(--text-muted)]">
            {story.clientNeed}
          </p>
        </div>

        <div className="squircle-panel surface-card p-6">
          <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--cat-ux)]">
            Proof
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {project.github_stats.languages.map((language) => (
              <span
                key={language}
                className="squircle-chip surface-chip px-3 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-dim)]"
              >
                {language}
              </span>
            ))}
          </div>
          <div className="grid gap-3 text-sm text-[var(--text-muted)] sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <GitCommit size={14} style={{ color: meta.accent }} />
              <span>{project.github_stats.commits.toLocaleString()} commits</span>
            </div>
            {project.github_stats.stars ? (
              <div className="flex items-center gap-2">
                <Star size={14} style={{ color: meta.accent }} />
                <span>{project.github_stats.stars} public stars</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Globe size={14} style={{ color: meta.accent }} />
                <span>Live production deployment</span>
              </div>
            )}
          </div>
          <p className="mt-5 text-sm font-light leading-relaxed text-[var(--text-muted)]">
            {meta.proof}
          </p>
        </div>
      </div>
    </div>
  );
};

const ArchiveCard = ({
  project,
  onProjectSelect,
}: {
  project: Project;
  onProjectSelect: (project: Project) => void;
}) => (
  <article className="flex h-full flex-col justify-between gap-5 squircle-panel surface-card p-5">
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--text-ghost)]">
          {formatCommits(project.github_stats.commits)} commits
        </span>
        <a
          href={getProjectUrl(project)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--text-ghost)] transition-colors duration-200 hover:text-[var(--text)]"
          aria-label={`Visit ${project.title}`}
        >
          <ExternalLink size={16} />
        </a>
      </div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-lg font-medium tracking-tight text-[var(--text)] md:text-xl">
          {project.title}
        </h4>
      </div>
      <p className="mb-4 text-sm font-light leading-relaxed text-[var(--text-muted)]">
        {getArchiveBlurb(project)}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.github_stats.languages.slice(0, 3).map((language) => (
          <span
            key={language}
            className="squircle-chip surface-chip px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--text-dim)]"
          >
            {language}
          </span>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onProjectSelect(project)}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-dim)] transition-colors duration-200 hover:text-[var(--text)]"
        >
          Case Study
          <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  </article>
);

export const ProjectGrid = ({ onProjectSelect }: ProjectGridProps) => {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6 md:pb-20 md:pt-10">
        <div className="space-y-20 md:space-y-24">
          {categoryOrder.map((category) => {
            const meta = categoryMeta[category];
            const categoryProjects = projects.filter(
              (project) => project.category === category
            );
            const featuredProject = categoryProjects.find(
              (project) => project.title === meta.featuredTitle
            ) || categoryProjects[0];

            if (!featuredProject) {
              return null;
            }

            const archiveProjects = categoryProjects.filter(
              (project) => project.title !== featuredProject.title
            );

            return (
              <section
                key={category}
                id={meta.id}
                className="scroll-mt-28 pt-8 md:pt-10"
              >
                <div className="mb-8 max-w-3xl space-y-3">
                  <p className="text-[11px] font-mono uppercase tracking-[0.18em]" style={{ color: meta.accent }}>
                    {meta.eyebrow}
                  </p>
                  <h3 className="text-3xl font-light tracking-tight text-[var(--text)] md:text-4xl">
                    {meta.title}
                  </h3>
                  <p className="text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
                    {meta.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {meta.signals.map((signal) => (
                      <span
                        key={signal}
                        className="squircle-chip surface-chip px-3 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--text-dim)]"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>

                <ProjectSurface
                  project={featuredProject}
                  meta={meta}
                  onProjectSelect={onProjectSelect}
                />

                {archiveProjects.length > 0 ? (
                  <div className="mt-6">
                    <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-ghost)]">
                        More Work
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        More examples in the same category.
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {archiveProjects.map((project) => (
                        <ArchiveCard
                          key={project.title}
                          project={project}
                          onProjectSelect={onProjectSelect}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
};
