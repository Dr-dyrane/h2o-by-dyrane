"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { projects } from "@/data/projects";
import {
  categoryMeta,
  categoryOrder,
  featuredStories,
  type CategoryMeta,
  type FeaturedStory,
} from "@/domain/projects/metadata";
import {
  formatCommitCountBadge,
  getArchiveBlurb,
  getProjectUrl,
} from "@/domain/projects/helpers";
import {
  ArrowUpRight,
  ExternalLink,
  GitCommit,
  Globe,
  Star,
} from "@/components/icons/lucide";

/**
 * Interaction contract for opening a selected project in the overlay.
 */
interface ProjectGridProps {
  onProjectSelect: (project: Project) => void;
}

// ─── Live screenshot component ────────────────────────────────────────────────
// Uses thum.io (free, no key) to fetch a real screenshot of the live project.
// Falls back to the CSS composition if the image fails to load.

/**
 * Stylized fallback visual for logistics and operations projects.
 */
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

/**
 * Stylized fallback visual for AI and clinical workflow projects.
 */
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

/**
 * Stylized fallback visual for product marketing and UX projects.
 */
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
/**
 * Supercharged 3D Immersive Screenshot Display
 * Treats the 2D image as a volumetric object floating in space.
 */
const OGScreenshot = ({ project }: { project: Project }) => {
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

  // Framer Motion 3D values based on mouse position
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // When hovered, the image tracks the mouse strongly
    setRotateX((y - centerY) / 6);
    setRotateY((centerX - x) / 6);
  };

  const handleMouseEnter = () => setIsHovered(true);
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  if (state === "error") return <Fallback />;

  return (
    <div 
      className="group relative w-full h-full flex items-center justify-center p-4 md:p-12"
      style={{ perspective: "2000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full max-w-4xl mx-auto rounded-xl"
        style={{ 
          aspectRatio, 
          transformStyle: "preserve-3d" 
        }}
        // Resting state: floating back in space, slightly tilted
        // Hover state: floating up towards camera, tracking mouse
        initial={{ rotateX: 10, rotateY: -10, translateZ: -100, scale: 0.95 }}
        whileInView={{ rotateX: 10, rotateY: -10, translateZ: -100, scale: 0.95 }}
        viewport={{ once: false, margin: "-100px" }}
        animate={{ 
          rotateX: isHovered ? rotateX : 5, 
          rotateY: isHovered ? rotateY : -8, 
          translateZ: isHovered ? 50 : 0,
          scale: isHovered ? 1.05 : 0.98
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 1.5 }}
      >
        {/* Deep 3D Shadow Plate behind the image */}
        <div 
          className="absolute inset-0 bg-black/40 blur-3xl rounded-xl transition-all duration-700 pointer-events-none"
          style={{ transform: "translateZ(-80px)", opacity: isHovered ? 0.8 : 0.3 }}
        />

        {/* The actual "glass slab" containing the image */}
        <div 
          className="relative w-full h-full rounded-xl overflow-hidden bg-[var(--surface-elevated)] ring-1 ring-white/10"
          style={{ transformStyle: "preserve-3d" }}
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
              className="h-full w-full object-contain object-top transition-all duration-700 pointer-events-none"
              style={{ 
                opacity: state === "loaded" ? 1 : 0,
                filter: isHovered ? "brightness(1.05) contrast(1.05)" : "brightness(0.9) contrast(1.0)"
              }}
              loading="lazy"
              decoding="async"
            />
          )}

          {/* Intense sweeping specular highlight across the glass */}
          <motion.div 
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0"
            animate={{ 
              opacity: isHovered ? 0.8 : 0,
              background: `radial-gradient(circle at ${50 + rotateY * 2}% ${50 + rotateX * 2}%, rgba(255,255,255,0.6) 0%, transparent 60%)`
            }}
          />

          {/* Bottom scrim to ground URL badge */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none bg-gradient-to-t from-[var(--surface-elevated-strong)] to-transparent opacity-80"
          />
        </div>

        {/* 3D Floating Elements (Rendered OUTSIDE the hidden-overflow glass slab, but INSIDE the 3D rotating parent) */}
        
        {/* Floating URL badge popping violently out of the screen */}
        <motion.div 
          className="absolute bottom-6 left-6 flex items-center gap-2 squircle-chip surface-chip px-3 py-1.5 backdrop-blur-md shadow-2xl pointer-events-none"
          animate={{ z: isHovered ? 120 : 40 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          <Globe size={10} style={{ color: categoryMeta[project.category].accent }} />
          <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--text)]">{project.title.split(' ')[0]} URL</span>
        </motion.div>

        {/* Decorative structural frame lines mapping depth */}
        <motion.div 
          className="absolute -top-4 -right-4 w-12 h-12 border-t border-r border-[var(--text-dim)] pointer-events-none opacity-30"
          animate={{ z: isHovered ? -50 : -20 }}
        />
        <motion.div 
          className="absolute -bottom-4 -left-4 w-12 h-12 border-b border-l border-[var(--text-dim)] pointer-events-none opacity-30"
          animate={{ z: isHovered ? -50 : -20 }}
        />
      </motion.div>
    </div>
  );
};

/**
 * Split preview surface combining the live screenshot with summary and proof cards.
 */
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
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/5 pointer-events-none" />
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl pointer-events-none" style={{ background: meta.accentBg }} />
      <div className="absolute -bottom-12 left-10 h-32 w-32 rounded-full blur-3xl pointer-events-none" style={{ background: meta.accentBg }} />

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
              {formatCommitCountBadge(project.github_stats.commits)}
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


/**
 * Flagship project surface used for the featured story in each category lane.
 */
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

/**
 * Compact archive card for secondary projects within a category.
 */
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
          {formatCommitCountBadge(project.github_stats.commits)} commits
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

/**
 * Main case-study grid with massive typographic navigation and 3D skewing.
 */
export const ProjectGrid = ({ onProjectSelect }: ProjectGridProps) => {
  const [activeCategory, setActiveCategory] = useState<Project["category"]>(categoryOrder[0]);

  // Derive the currently active content
  const meta = categoryMeta[activeCategory];
  const categoryProjects = projects.filter((p) => p.category === activeCategory);
  const featuredProject = categoryProjects.find((p) => p.title === meta.featuredTitle) || categoryProjects[0];
  const archiveProjects = categoryProjects.filter((p) => p.title !== featuredProject?.title);

  return (
    <section className="min-h-screen">
      {/* ── Sticky Dual-Column Layout (Desktop) / Vertical Stack (Mobile) ── */}
      <div className="flex flex-col lg:flex-row lg:min-h-screen">
        
        {/* ── Left Column: Sticky Category Navigation (Desktop Only) ── */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:w-[45%] lg:overflow-y-auto lg:px-6 lg:py-20 xl:px-12 xl:py-24">
          <div className="flex min-h-[70vh] flex-col justify-center lg:min-h-full">
            <div className="max-w-3xl xl:max-w-4xl">
              {categoryOrder.map((category) => {
                const catMeta = categoryMeta[category];
                const isActive = activeCategory === category;
                
                return (
                  <motion.div
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className="group relative cursor-pointer select-none py-2"
                    style={{ perspective: "1500px" }}
                  >
                    {/* 3D Skewing Container */}
                    <motion.div
                      className="inline-flex flex-col"
                      initial={false}
                      animate={{
                        color: isActive ? "var(--text)" : "var(--text-ghost)",
                      }}
                      whileHover={{ 
                        x: 20,
                        color: isActive ? "var(--text)" : "var(--text-muted)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="flex items-baseline gap-4 md:gap-8">
                        {/* Small number/eyebrow */}
                        <span 
                          className="text-xs md:text-sm font-mono tracking-[0.2em] transition-opacity duration-300"
                          style={{ 
                            color: catMeta.accent,
                            opacity: isActive ? 1 : 0, 
                            transform: "translateZ(30px)" 
                          }}
                        >
                          {catMeta.eyebrow}
                        </span>
                        
                        {/* Massive Display Title */}
                        <h2 
                          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-[-0.04em] leading-[0.9]"
                          style={{ transform: "translateZ(10px)" }}
                        >
                          {category.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                          ))}
                        </h2>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right Column: Scrolling Content ── */}
        <div className="lg:w-[55%] lg:overflow-y-auto">
          {/* Mobile Category Navigation (Hidden on Desktop) */}
          <div className="lg:hidden px-6 py-12 md:px-12 md:py-16">
            <div className="max-w-7xl">
              {categoryOrder.map((category) => {
                const catMeta = categoryMeta[category];
                const isActive = activeCategory === category;
                
                return (
                  <motion.div
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className="group relative cursor-pointer select-none py-2"
                    style={{ perspective: "1500px" }}
                  >
                    <motion.div
                      className="inline-flex flex-col"
                      initial={false}
                      animate={{
                        color: isActive ? "var(--text)" : "var(--text-ghost)",
                      }}
                      whileHover={{ 
                        x: 20,
                        color: isActive ? "var(--text)" : "var(--text-muted)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="flex items-baseline gap-4 md:gap-8">
                        <span 
                          className="text-xs md:text-sm font-mono tracking-[0.2em] transition-opacity duration-300"
                          style={{ 
                            color: catMeta.accent,
                            opacity: isActive ? 1 : 0, 
                            transform: "translateZ(30px)" 
                          }}
                        >
                          {catMeta.eyebrow}
                        </span>
                        
                        <h2 
                          className="text-6xl sm:text-7xl md:text-8xl font-light tracking-[-0.04em] leading-[0.9]"
                          style={{ transform: "translateZ(10px)" }}
                        >
                          {category.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                          ))}
                        </h2>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Active Category Content */}
          <div className="w-full px-6 pb-16 md:px-6 md:pb-20 lg:px-12 xl:px-16">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-16 md:space-y-20 pt-8 lg:pt-16"
            >
              {/* Active Category Header summary */}
              <div className="max-w-3xl space-y-6">
                <h3 className="text-3xl font-light tracking-tight text-[var(--text)] sm:text-4xl">
                  {meta.title}
                </h3>
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

              {featuredProject && (
                <ProjectSurface
                  project={featuredProject}
                  meta={meta}
                  onProjectSelect={onProjectSelect}
                />
              )}

                          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
