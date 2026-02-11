
import { Project, projects } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";

interface ProjectGridProps {
    onProjectSelect: (project: Project) => void;
}

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
                            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tighter">
                                {category.label.split(" ")[0]}{" "}
                                <span className="text-white/30">
                                    {category.label.split(" ").slice(1).join(" ")}
                                </span>
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent mb-2" />
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categoryProjects.map((project) => (
                                <div
                                    key={project.title}
                                    onClick={() => onProjectSelect(project)}
                                    className="group relative h-[320px] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 ease-dyrane cursor-pointer overflow-hidden rounded-xl border border-white/5 hover:border-white/10"
                                >
                                    {/* Default State */}
                                    <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full transition-transform duration-500 group-hover:-translate-y-4">
                                        <div className="text-white/40 text-xs font-mono mb-2 uppercase tracking-widest">
                                            {project.github_stats.languages[0]}
                                        </div>
                                        <h3 className="text-2xl text-white font-medium mb-3">
                                            {project.title}
                                        </h3>
                                        <p className="text-white/60 leading-relaxed line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Hover State - Strategic Impact */}
                                    <div className="absolute inset-0 bg-dyrane-glass backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-center">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                            <h4 className="text-emerald-400 text-xs font-mono uppercase tracking-widest mb-3">
                                                Strategic Impact
                                            </h4>
                                            <p className="text-white/90 text-lg leading-relaxed mb-6 font-light">
                                                {project.proposal.split('.')[0]}.
                                            </p>
                                            <div className="inline-flex items-center gap-2 text-white text-sm font-medium">
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
