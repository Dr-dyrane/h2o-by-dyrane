
import { useState } from "react";
import { Project, projects } from "@/data/projects";
import { ArrowUpRight, Globe, Loader2, GitBranch } from "lucide-react";

interface ProjectGridProps {
    onProjectSelect: (project: Project) => void;
}

const categoryColor: Record<Project["category"], string> = {
    "Logistics Engine": "text-blue-400 bg-blue-400/10",
    "Intelligence Bridge": "text-violet-400 bg-violet-400/10",
    "Modernized UX": "text-emerald-400 bg-emerald-400/10",
};

const ProjectThumbnail = ({ project }: { project: Project }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const screenshotUrl = `https://api.microlink.io?url=https://${project.link}&screenshot=true&meta=false&embed=screenshot.url`;

    if (error) return null;

    return (
        <div className="relative w-full h-36 overflow-hidden rounded-xl mb-4 bg-[var(--surface-card-hover)]">
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--text-dim)]" />
                </div>
            )}
            <img
                src={screenshotUrl}
                alt={project.title}
                className={`w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105 ${
                    loaded ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
            />
            {/* Subtle bottom fade for blending */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--surface-card)] to-transparent" />
        </div>
    );
};

export const ProjectGrid = ({ onProjectSelect }: ProjectGridProps) => {
    const categories = [
        { id: "Logistics Engine", label: "Global Logistics Engines" },
        { id: "Intelligence Bridge", label: "Intelligence Bridges" },
        { id: "Modernized UX", label: "Modernized Experience Layers" },
    ] as const;

    return (
        <div className="max-w-7xl mx-auto px-6 py-32 space-y-32">
            {categories.map((category) => {
                const categoryProjects = projects.filter(
                    (p) => p.category === category.id
                );

                if (categoryProjects.length === 0) return null;

                return (
                    <section
                        key={category.id}
                        id={category.id.toLowerCase().replace(/\s+/g, "-")}
                        className="relative scroll-mt-32"
                    >
                        {/* Category Header */}
                        <div className="mb-12 flex items-end gap-4">
                            <h2 className="text-4xl md:text-5xl font-light text-[var(--text)] tracking-tighter">
                                {category.label.split(" ")[0]}{" "}
                                <span className="text-[var(--text-ghost)]">
                                    {category.label.split(" ").slice(1).join(" ")}
                                </span>
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-[var(--text-dim)] to-transparent mb-2" />
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryProjects.map((project, index) => (
                                <div
                                    key={project.title}
                                    onClick={() => onProjectSelect(project)}
                                    className="group relative flex flex-col bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)] transition-all duration-300 ease-dyrane cursor-pointer rounded-2xl p-5 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 border border-transparent hover:border-[var(--text-dim)]/10"
                                    style={{ animationDelay: `${index * 80}ms` }}
                                >
                                    {/* Live screenshot preview */}
                                    <ProjectThumbnail project={project} />

                                    {/* Category + language tags */}
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <span
                                            className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${categoryColor[project.category]}`}
                                        >
                                            {project.category}
                                        </span>
                                        <span className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[var(--surface-card-hover)]">
                                            {project.github_stats.languages[0]}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-[var(--text)] mb-2 leading-snug">
                                        {project.title}
                                    </h3>

                                    {/* Description — always visible */}
                                    <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3 flex-1 mb-4">
                                        {project.description}
                                    </p>

                                    {/* Footer row */}
                                    <div className="flex items-center justify-between pt-3 border-t border-[var(--text-dim)]/10">
                                        {/* Domain */}
                                        <a
                                            href={`https://${project.link}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-dim)] hover:text-[var(--text)] transition-colors duration-200 font-mono"
                                        >
                                            <Globe size={11} />
                                            {project.link}
                                        </a>

                                        {/* Deep Dive CTA */}
                                        <button
                                            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors duration-200"
                                            onClick={() => onProjectSelect(project)}
                                        >
                                            <GitBranch size={11} />
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-0.5">
                                                Details
                                            </span>
                                            <ArrowUpRight
                                                size={13}
                                                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
};
