
import { useState } from "react";
import { Project, projects } from "@/data/projects";
import { ArrowUpRight, Loader2 } from "lucide-react";

interface ProjectGridProps {
    onProjectSelect: (project: Project) => void;
}

const ProjectThumbnail = ({ project }: { project: Project }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const screenshotUrl = `https://api.microlink.io?url=https://${project.link}&screenshot=true&meta=false&embed=screenshot.url`;

    return (
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {!loaded && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-card)]">
                    <Loader2 className="w-5 h-5 animate-spin text-[var(--text-dim)]" />
                </div>
            )}
            {!error && (
                <img
                    src={screenshotUrl}
                    alt={project.title}
                    className={`w-full h-full object-cover rounded-3xl object-top transition-all duration-700 ${loaded ? "opacity-0 group-hover:opacity-60 group-hover:scale-105" : "opacity-0"
                        }`}
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                />
            )}
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--gradient-mask-from)] via-[var(--gradient-mask-via)] to-transparent rounded-3xl" />
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
                        id={category.id.toLowerCase().replace(/\s+/g, '-')}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categoryProjects.map((project, index) => (
                                <div
                                    key={project.title}
                                    onClick={() => onProjectSelect(project)}
                                    className="group relative h-[320px] bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)] transition-all duration-500 ease-dyrane cursor-pointer overflow-hidden rounded-3xl"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    {/* Screenshot Thumbnail */}
                                    <ProjectThumbnail project={project} />

                                    {/* Default State */}
                                    <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full transition-transform duration-500 group-hover:-translate-y-4 z-10">
                                        <div className="text-[var(--text-dim)] text-xs font-mono mb-2 uppercase tracking-widest">
                                            {project.github_stats.languages[0]}
                                        </div>
                                        <h3 className="text-2xl text-[var(--text)] font-medium mb-3">
                                            {project.title}
                                        </h3>
                                        <p className="text-[var(--text-muted)] leading-relaxed line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Hover State - Strategic Impact */}
                                    <div className="absolute inset-0 bg-[var(--surface-glass)] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-center z-20">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                            <h4 className="text-emerald-400 text-xs font-mono uppercase tracking-widest mb-3">
                                                Strategic Impact
                                            </h4>
                                            <p className="text-[var(--text)] opacity-90 text-lg leading-relaxed mb-6 font-light">
                                                {project.proposal.split('.')[0]}.
                                            </p>
                                            <div className="inline-flex items-center gap-2 text-[var(--text)] text-sm font-medium">
                                                Deep Dive Analysis <ArrowUpRight size={16} />
                                            </div>
                                        </div>
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
