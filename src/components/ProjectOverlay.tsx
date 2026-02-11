
import { Project } from "@/data/projects";
import { X, ArrowRight, Github, Code, GitCommit, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface ProjectOverlayProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProjectOverlay = ({ project, isOpen, onClose }: ProjectOverlayProps) => {
    const [activeStep, setActiveStep] = useState(1);

    useEffect(() => {
        if (isOpen) {
            setActiveStep(1);
        }
    }, [isOpen]);

    if (!project || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            {/* Content Container */}
            <div className="relative w-full max-w-4xl bg-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-glide">

                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
                    <div>
                        <span className="text-emerald-400 text-xs font-mono tracking-wider uppercase mb-1 block">
                            {project.category} Module
                        </span>
                        <h2 className="text-3xl text-white font-medium tracking-tight">
                            {project.title}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-[600px]">
                    {/* Navigation Sidebar */}
                    <div className="w-full md:w-64 p-6 border-r border-white/5 bg-white/[0.01]">
                        <div className="space-y-2">
                            {[
                                { id: 1, label: "The Challenge" },
                                { id: 2, label: "Intelligence Architecture" },
                                { id: 3, label: "Engagement Proposal" }
                            ].map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveStep(step.id)}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeStep === step.id
                                            ? "bg-white/10 text-white"
                                            : "text-white/40 hover:text-white/70 hover:bg-white/5"
                                        }`}
                                >
                                    0{step.id} — {step.label}
                                </button>
                            ))}
                        </div>

                        {/* GitHub Stats Mini-Widget */}
                        <div className="mt-auto pt-8">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                                <div className="flex items-center gap-2 text-white/70 text-xs font-mono uppercase">
                                    <Github size={12} /> Live Repository
                                </div>
                                <div className="flex items-center justify-between text-white/40 text-xs">
                                    <span className="flex items-center gap-1">
                                        <GitCommit size={12} /> {project.github_stats.commits}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star size={12} /> {project.github_stats.stars || 0}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {project.github_stats.languages.map(lang => (
                                        <span key={lang} className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] text-white/50 border border-white/5">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-8 md:p-12 overflow-y-auto relative">

                        {/* Step 1: Challenge */}
                        <div className={`transition-all duration-500 absolute inset-0 p-8 md:p-12 ${activeStep === 1 ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 z-0 pointer-events-none'}`}>
                            <h3 className="text-xl text-white/90 mb-6 font-light">
                                The Business Challenge
                            </h3>
                            <p className="text-white/60 text-lg leading-relaxed max-w-2xl">
                                {project.challenge}
                            </p>
                            <button
                                onClick={() => setActiveStep(2)}
                                className="mt-12 group flex items-center gap-3 text-white/80 hover:text-white transition-colors text-sm font-medium"
                            >
                                Explore Architecture <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Step 2: Architecture */}
                        <div className={`transition-all duration-500 absolute inset-0 p-8 md:p-12 ${activeStep === 2 ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 z-0 pointer-events-none'}`}>
                            <h3 className="text-xl text-white/90 mb-6 font-light">
                                Engineering The Solution
                            </h3>
                            <p className="text-white/60 text-lg leading-relaxed max-w-2xl mb-8">
                                {project.architecture}
                            </p>

                            <div className="grid grid-cols-2 gap-4 max-w-lg mb-8">
                                <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                                    <div className="text-emerald-400 text-2xl font-light mb-1">
                                        {project.github_stats.commits > 1000 ? '1k+' : project.github_stats.commits}
                                    </div>
                                    <div className="text-white/40 text-xs uppercase tracking-wider">
                                        Core Commits
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                                    <div className="text-blue-400 text-2xl font-light mb-1">
                                        100%
                                    </div>
                                    <div className="text-white/40 text-xs uppercase tracking-wider">
                                        Uptime Target
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setActiveStep(3)}
                                className="mt-4 group flex items-center gap-3 text-white/80 hover:text-white transition-colors text-sm font-medium"
                            >
                                View Engagement Proposal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Step 3: Proposal */}
                        <div className={`transition-all duration-500 absolute inset-0 p-8 md:p-12 ${activeStep === 3 ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 z-0 pointer-events-none'}`}>
                            <div className="h-full flex flex-col justify-center max-w-xl">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 text-white">
                                    <Code size={20} />
                                </div>
                                <h3 className="text-2xl text-white mb-4">
                                    Deploy This Intelligence
                                </h3>
                                <p className="text-white/60 text-lg leading-relaxed mb-8">
                                    {project.proposal}
                                </p>

                                <div className="flex flex-col gap-4">
                                    <a
                                        href={`mailto:hello@dyrane.com?subject=Inquiry: ${project.title} Implementation`}
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
                                    >
                                        Contact for Similar Build
                                    </a>
                                    <a
                                        href={`https://${project.link}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 text-white/80 font-medium rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        Visit Live Project
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
