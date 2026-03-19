import { useState, useEffect, useRef } from "react";
import { Project, projects } from "@/data/projects";
import { ArrowUpRight, Globe, GitBranch } from "@/components/icons/lucide";

interface ProjectGridProps {
    onProjectSelect: (project: Project) => void;
}

const categoryColor: Record<Project["category"], { text: string; bg: string; glow: string }> = {
    "Logistics Engine":    { text: "text-[var(--cat-logistics)]",    bg: "surface-chip",    glow: "var(--cat-logistics-bg)"   },
    "Intelligence Bridge": { text: "text-[var(--cat-intelligence)]",  bg: "surface-chip",    glow: "var(--cat-intelligence-bg)" },
    "Modernized UX":       { text: "text-[var(--cat-ux)]",           bg: "surface-chip",    glow: "var(--cat-ux-bg)"          },
};

// ─── Intersection Observer hook for scroll reveal ─────────────────────────────
const useReveal = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.12 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return { ref, visible };
};

// ─── Live screenshot panel ─────────────────────────────────────────────────────
const ProjectScreen = ({ project }: { project: Project }) => {
    const { text, glow, bg } = categoryColor[project.category];

    return (
        <div
            className="relative w-full aspect-[16/10] squircle overflow-hidden p-6 md:p-8 surface-panel"
            style={{ boxShadow: `0 24px 64px -28px ${glow}, var(--surface-shadow)` }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_42%)]" />
            <div className="absolute inset-0 opacity-40 bg-grid-pattern" />
            <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                    <span className={`squircle-chip px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.15em] font-medium ${text} ${bg}`}>
                        {project.category}
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 squircle-chip surface-chip text-[11px] font-mono text-[var(--text-dim)]">
                        <Globe size={12} />
                        {project.link}
                    </div>
                </div>

                <div className="mt-8 max-w-[22rem]">
                    <div className="mb-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--text-dim)]">
                        Product Surface
                    </div>
                    <p className="text-3xl font-semibold tracking-tight text-[var(--text)]">
                        {project.title}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                        {project.architecture}
                    </p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                    <div className="squircle-nav p-4 surface-card">
                        <div className={`mb-1 text-2xl font-light tracking-tight ${text}`}>
                            {project.github_stats.commits.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--text-dim)]">
                            Commit Depth
                        </div>
                    </div>
                    <div className="squircle-nav p-4 surface-card">
                        <div className="mb-2 flex flex-wrap gap-1">
                            {project.github_stats.languages.slice(0, 3).map((lang) => (
                                <span
                                    key={lang}
                                    className="squircle-chip surface-chip px-2 py-1 text-[9px] font-mono uppercase tracking-[0.14em] text-[var(--text-dim)]"
                                >
                                    {lang}
                                </span>
                            ))}
                        </div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--text-dim)]">
                            Core Stack
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Single project feature row ───────────────────────────────────────────────
const ProjectFeature = ({
    project,
    index,
    onSelect,
}: {
    project: Project;
    index: number;
    onSelect: () => void;
}) => {
    const { ref, visible } = useReveal();
    const isEven = index % 2 === 0;
    const { text, bg, glow } = categoryColor[project.category];

    return (
        <div
            ref={ref}
            className={`
                flex flex-col lg:flex-row items-center gap-12 xl:gap-20
                transition-all duration-700 ease-out
                ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
        >
            {/* Screenshot — 58% width */}
            <div className="w-full lg:w-[58%] flex-shrink-0">
                <ProjectScreen project={project} />
            </div>

            {/* Copy — 42% width */}
            <div className="w-full lg:w-[42%] flex flex-col gap-5">

                {/* Category + index */}
                <div className="flex items-center gap-3">
                    <span className={`squircle-chip px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.15em] font-medium ${text} ${bg}`}>
                        {project.category}
                    </span>
                    <span className="text-[var(--text-dim)] text-[11px] font-mono tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-3xl xl:text-4xl font-semibold text-[var(--text)] tracking-tight leading-snug">
                    {project.title}
                </h3>

                {/* Description */}
                <p className="text-[var(--text-muted)] text-base leading-relaxed font-light">
                    {project.description}
                </p>

                {/* The challenge — the story */}
                <div className="squircle-nav p-4 surface-card" style={{ boxShadow: `inset 0 0 0 1px ${glow}, var(--surface-shadow-tight)` }}>
                    <p className={`text-[10px] font-mono uppercase tracking-[0.15em] mb-2 ${text}`}>
                        The Challenge
                    </p>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed font-light">
                        {project.challenge}
                    </p>
                </div>

                {/* Languages */}
                <div className="flex items-center gap-2 flex-wrap">
                    {project.github_stats.languages.map((lang) => (
                        <span key={lang} className="squircle-chip surface-chip px-2.5 py-1 text-[var(--text-dim)] text-[11px] font-mono">
                            {lang}
                        </span>
                    ))}
                    <span className="text-[var(--text-dim)] text-[11px] font-mono ml-1">
                        {project.github_stats.commits.toLocaleString()} commits
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-1">
                    <button
                        onClick={onSelect}
                        className={`
                            group inline-flex items-center gap-2
                            px-5 py-2.5 squircle-pill
                            ${bg} ${text}
                            text-sm font-medium
                            transition-all duration-300
                            hover:-translate-y-px
                        `}
                        style={{ '--hover-shadow': `0 10px 24px ${glow}` } as React.CSSProperties}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = e.currentTarget.style.getPropertyValue('--hover-shadow') || '';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '';
                        }}
                    >
                        <GitBranch size={13} />
                        Full Case Study
                        <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>

                    <a
                        href={`https://${project.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors duration-200 font-mono"
                    >
                        <Globe size={11} />
                        {project.link}
                    </a>
                </div>
            </div>
        </div>
    );
};

// ─── Main export ──────────────────────────────────────────────────────────────
export const ProjectGrid = ({ onProjectSelect }: ProjectGridProps) => {
    const categories = [
        { id: "Logistics Engine",    label: "Global Logistics Engines",      sub: "Infrastructure that moves the world" },
        { id: "Intelligence Bridge", label: "Intelligence Bridges",           sub: "Systems that translate data into decisions" },
        { id: "Modernized UX",       label: "Modernized Experience Layers",   sub: "Interfaces that earn trust at first glance" },
    ] as const;

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 md:px-6 md:py-24 space-y-32 md:space-y-40">
            {categories.map((category) => {
                const cat = projects.filter((p) => p.category === category.id);
                if (cat.length === 0) return null;

                return (
                    <section
                        key={category.id}
                        id={category.id.toLowerCase().replace(/\s+/g, "-")}
                        className="scroll-mt-28"
                    >
                        {/* Category header */}
                        <div className="mb-16 max-w-2xl md:mb-20">
                            <p className="text-[var(--text-muted)] text-[11px] font-mono uppercase tracking-[0.2em] mb-3">
                                {category.id}
                            </p>
                            <h2 className="text-5xl md:text-6xl font-light text-[var(--text)] tracking-tighter mb-4">
                                {category.label.split(" ")[0]}{" "}
                                <span className="text-[var(--text-dim)]">
                                    {category.label.split(" ").slice(1).join(" ")}
                                </span>
                            </h2>
                            <p className="text-[var(--text-muted)] text-base font-light">
                                {category.sub}
                            </p>
                        </div>

                        {/* Projects — one at a time, alternating */}
                        <div className="space-y-28">
                            {cat.map((project, index) => (
                                <ProjectFeature
                                    key={project.title}
                                    project={project}
                                    index={index}
                                    onSelect={() => onProjectSelect(project)}
                                />
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
};
