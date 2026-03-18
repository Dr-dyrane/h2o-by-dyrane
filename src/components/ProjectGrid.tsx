
import { useState, useEffect, useRef } from "react";
import { Project, projects } from "@/data/projects";
import { ArrowUpRight, Globe, Loader2, GitBranch } from "lucide-react";

interface ProjectGridProps {
    onProjectSelect: (project: Project) => void;
}

const categoryColor: Record<Project["category"], { text: string; bg: string; glow: string }> = {
    "Logistics Engine":    { text: "text-[var(--cat-logistics)]",    bg: "bg-[var(--cat-logistics-bg)]",    glow: "var(--cat-logistics-bg)"   },
    "Intelligence Bridge": { text: "text-[var(--cat-intelligence)]",  bg: "bg-[var(--cat-intelligence-bg)]", glow: "var(--cat-intelligence-bg)" },
    "Modernized UX":       { text: "text-[var(--cat-ux)]",           bg: "bg-[var(--cat-ux-bg)]",           glow: "var(--cat-ux-bg)"          },
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
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const url = `https://api.microlink.io?url=https://${project.link}&screenshot=true&meta=false&embed=screenshot.url`;
    const { text, glow } = categoryColor[project.category];

    return (
        <div className="relative w-full aspect-[16/10] squircle overflow-hidden"
            style={{ boxShadow: `0 32px 80px -8px ${glow}, 0 8px 32px rgba(0,0,0,0.4)` }}>
            {/* Loading state */}
            {!loaded && !error && (
                <div className="absolute inset-0 glass-ultra-thin flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className={`w-6 h-6 animate-spin ${text}`} />
                        <span className="text-[var(--text-dim)] text-[11px] font-mono uppercase tracking-widest">
                            Loading Preview
                        </span>
                    </div>
                </div>
            )}

            {/* Fallback */}
            {error && (
                <div className="absolute inset-0 glass-ultra-thin flex items-center justify-center">
                    <div className="text-center">
                        <Globe className={`w-8 h-8 mx-auto mb-2 ${text} opacity-50`} />
                        <span className="text-[var(--text-dim)] text-[11px] font-mono">{project.link}</span>
                    </div>
                </div>
            )}

            {!error && (
                <img
                    src={url}
                    alt={`${project.title} live preview`}
                    className={`w-full h-full object-cover object-top transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                />
            )}
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
                transition-all duration-700
                ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
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
                    <span className="text-[var(--text-ghost)] text-[11px] font-mono tabular-nums">
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
                <div className="squircle-nav p-4 glass-ultra-thin" style={{ boxShadow: `inset 0 0 40px ${glow}` }}>
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
                        <span key={lang} className="squircle-chip px-2.5 py-1 glass-ultra-thin text-[var(--text-dim)] text-[11px] font-mono">
                            {lang}
                        </span>
                    ))}
                    <span className="text-[var(--text-ghost)] text-[11px] font-mono ml-1">
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
                            hover:shadow-[0_0_24px_${glow}]
                            hover:scale-105
                        `}
                    >
                        <GitBranch size={13} />
                        Full Case Study
                        <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
        <div className="max-w-7xl mx-auto px-6 py-24 space-y-40">
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
                        <div className="mb-20 max-w-2xl">
                            <p className="text-[var(--text-dim)] text-[11px] font-mono uppercase tracking-[0.2em] mb-3">
                                {category.id}
                            </p>
                            <h2 className="text-5xl md:text-6xl font-light text-[var(--text)] tracking-tighter mb-4">
                                {category.label.split(" ")[0]}{" "}
                                <span className="text-[var(--text-ghost)]">
                                    {category.label.split(" ").slice(1).join(" ")}
                                </span>
                            </h2>
                            <p className="text-[var(--text-dim)] text-base font-light">
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
