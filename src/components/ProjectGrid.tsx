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
    eyebrow: "If your business runs on timing",
    title: "Use software that keeps live operations clear and coordinated.",
    description:
      "These projects are for teams that need dispatch, routing, tracking, or real-time visibility without operational confusion.",
    proof: "Best fit when delays, handoffs, and blind spots are costing you money or trust.",
    signals: ["Real-time visibility", "Dispatch clarity", "Operational confidence"],
    featuredTitle: "iVisit Ecosystem",
  },
  "Intelligence Bridge": {
    id: "intelligence-bridge",
    eyebrow: "If you want AI to be useful",
    title: "Turn complex reasoning into tools your team can actually use.",
    description:
      "These products package AI and automation into clear workflows instead of making users deal with model complexity.",
    proof: "Best fit when you need smarter workflows, triage, or decision support that still feels human and trustworthy.",
    signals: ["Usable AI", "Clear workflows", "Decision support"],
    featuredTitle: "Dr. Dyrane",
  },
  "Modernized UX": {
    id: "modernized-ux",
    eyebrow: "If your product needs to feel premium",
    title: "Make the experience clearer, stronger, and easier to trust.",
    description:
      "These projects focus on positioning, conversion, and interface polish so the product feels credible before the sales call.",
    proof: "Best fit when the product exists, but the presentation is not yet doing the business any favors.",
    signals: ["Premium trust", "Clear conversion", "Stronger positioning"],
    featuredTitle: "House of Prax",
  },
};

const categoryOrder: Project["category"][] = [
  "Logistics Engine",
  "Intelligence Bridge",
  "Modernized UX",
];

const featuredStories: Record<string, FeaturedStory> = {
  "iVisit Ecosystem": {
    label: "Emergency response platform",
    audience: "Emergency and mobility teams",
    summary:
      "Built for dispatch, routing, and hospital coordination when operational latency has real cost.",
    clientNeed:
      "Best when your team needs one operational surface instead of fragmented calls, handoffs, and blind spots.",
    previewLines: ["Dispatch clarity", "Route control", "Live response"],
    outcomes: ["Real-time dispatch", "Routing visibility", "Faster coordination"],
  },
  "Dr. Dyrane": {
    label: "Clinical AI triage engine",
    audience: "Health products using AI",
    summary:
      "Structured symptom intake and clinical reasoning packaged into a product people can actually use.",
    clientNeed:
      "Best when AI needs to support real decisions without feeling vague, unsafe, or hard to trust.",
    previewLines: ["Structured intake", "Clinical logic", "Safer triage"],
    outcomes: ["Usable intelligence", "Safer escalation", "Decision support"],
  },
  "House of Prax": {
    label: "Premium commerce storefront",
    audience: "Premium health brands",
    summary:
      "A high-intent storefront designed to make a health brand feel credible, elevated, and conversion-ready.",
    clientNeed:
      "Best when the product is strong but the digital surface is not doing enough to justify premium positioning.",
    previewLines: ["Stronger trust", "Premium feel", "Cleaner conversion"],
    outcomes: ["Premium positioning", "Brand clarity", "Conversion-ready UX"],
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

const ProductPreview = ({
  project,
  meta,
  story,
}: {
  project: Project;
  meta: CategoryMeta;
  story: FeaturedStory;
}) => (
  <div className="relative overflow-hidden squircle-panel bg-[var(--surface-elevated-strong)] p-4 md:p-5">
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5" />
    <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[var(--cat-ux-bg)] blur-3xl" />
    <div className="absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-[var(--cat-ux-bg)] blur-3xl" />

    <div className="relative flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3 squircle-chip surface-chip px-3.5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--cat-ux)]/80" />
            <span className="h-2 w-2 rounded-full bg-[var(--cat-ux)]/55" />
            <span className="h-2 w-2 rounded-full bg-[var(--cat-ux)]/35" />
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
        <div className="flex min-h-[19rem] flex-col justify-between squircle-panel surface-card p-5 md:min-h-[22rem] md:p-6">
          <div>
            <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--cat-ux)]">
              {story.audience}
            </p>
            <div className="space-y-1.5">
              {story.previewLines.map((line) => (
                <div
                  key={line}
                  className="text-3xl font-light tracking-tight text-[var(--text)] md:text-5xl"
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
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
              Build depth
            </p>
            <div className="text-3xl font-light tracking-tight text-[var(--text)]">
              {formatCommits(project.github_stats.commits)}
            </div>
            <p className="mt-2 text-sm font-light leading-relaxed text-[var(--text-muted)]">
              Production commits across the underlying system.
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
              Fit signals
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
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--cat-ux)]">
                Featured Example
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
              Live Site
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
              Visit Product
              <Globe size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="squircle-panel surface-card p-6">
          <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--cat-ux)]">
            What it is
          </p>
          <p className="text-base font-light leading-relaxed text-[var(--text-muted)]">
            {story.label}. {story.summary}
          </p>
        </div>

        <div className="squircle-panel surface-card p-6">
          <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--cat-ux)]">
            Best when
          </p>
          <p className="text-base font-light leading-relaxed text-[var(--text-muted)]">
            {story.clientNeed}
          </p>
        </div>

        <div className="squircle-panel surface-card p-6">
          <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--cat-ux)]">
            Why it feels credible
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
              <GitCommit size={14} className="text-[var(--cat-ux)]" />
              <span>{project.github_stats.commits.toLocaleString()} commits</span>
            </div>
            {project.github_stats.stars ? (
              <div className="flex items-center gap-2">
                <Star size={14} className="text-[var(--cat-ux)]" />
                <span>{project.github_stats.stars} public stars</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-[var(--cat-ux)]" />
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
          Details
          <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  </article>
);

export const ProjectGrid = ({ onProjectSelect }: ProjectGridProps) => {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-6 md:pb-24 md:pt-12">
        <div className="space-y-24 md:space-y-28">
          {categoryOrder.map((category) => {
            const meta = categoryMeta[category];
            const categoryProjects = projects.filter(
              (project) => project.category === category
            );
            const featuredProject = categoryProjects.find(
              (project) => project.title === meta.featuredTitle
            );

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
                className="scroll-mt-28 pt-10 md:pt-12"
              >
                <div className="mb-10 max-w-3xl space-y-3">
                  <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--cat-ux)]">
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
                  <div className="mt-8">
                    <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-ghost)]">
                        More Examples
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        Extra work in the same lane, for faster scanning.
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
