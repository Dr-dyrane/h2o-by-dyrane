
import { Project } from "@/data/projects";
import { X, ArrowRight, Github, Code, GitCommit, Star, ExternalLink, Globe } from "lucide-react";
import { useEffect, useState } from "react";

interface ProjectOverlayProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProjectOverlay = ({ project, isOpen, onClose }: ProjectOverlayProps) => {
    const [activeStep, setActiveStep] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setActiveStep(1);
            setImageLoaded(false);
        }
    }, [isOpen]);

    if (!project || !isOpen) return null;

    const screenshotUrl = `https://api.microlink.io?url=https://${project.link}&screenshot=true&meta=false&embed=screenshot.url`;

    const steps = [
        { id: 1, label: "Visual Intelligence" },
        { id: 2, label: "Intelligence Architecture" },
        { id: 3, label: "Strategic Impact" }
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop with Rule 20: Transparent layers & Soft blur */}
            <div
                className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-3xl animate-fade-in"
                onClick={onClose}
            />

            {/* Content Container - Rule 21: Depth Over Color. Rule 20: Glass, not gloss. */}
            <div className="relative w-full max-w-5xl bg-[var(--surface-glass)] backdrop-blur-[80px] rounded-[3rem] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.05)] dark:shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.05)] animate-glide flex flex-col md:flex-row h-[700px]">

                {/* Navigation Sidebar - Rule 2: Best Default Wins */}
                <div className="w-full md:w-72 p-8 flex flex-col bg-white/[0.02] dark:bg-black/40 shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.03)]">
                    <div className="mb-12">
                        <span className="text-emerald-500 dark:text-emerald-400 text-[10px] font-mono tracking-[0.2em] uppercase mb-2 block opacity-80">
                            {project.category}
                        </span>
                        <h2 className="text-2xl text-[var(--text)] font-medium tracking-tight leading-tight">
                            {project.title}
                        </h2>
                    </div>

                    <nav className="space-y-1 flex-1">
                        {steps.map((step) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(step.id)}
                                className={`w-full text-left px-5 py-4 rounded-3xl text-sm font-medium transition-all duration-500 group relative overflow-hidden ${activeStep === step.id
                                        ? "text-[var(--text)] bg-[var(--surface-card-hover)] shadow-[0_8px_32px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                                        : "text-[var(--text-dim)] hover:text-[var(--text-muted)] hover:bg-[var(--surface-card)]"
                                    }`}
                            >
                                <div className="relative z-10 flex items-center gap-3">
                                    <span className={`font-mono text-[10px] ${activeStep === step.id ? "text-emerald-500" : "text-[var(--text-ghost)]"}`}>
                                        0{step.id}
                                    </span>
                                    {step.label}
                                </div>
                                {activeStep === step.id && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-500 dark:bg-emerald-400 rounded-full blur-[1px]" />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Repository Context - Rule 16: Reveal on Hover / Silence by default */}
                    <div className="mt-auto space-y-6">
                        <div className="p-6 rounded-[2rem] bg-[var(--surface-card)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] space-y-4">
                            <div className="flex items-center gap-2 text-[var(--text-ghost)] text-[10px] font-mono uppercase tracking-wider">
                                <Github size={12} /> Source Intelligence
                            </div>
                            <div className="flex items-center justify-between text-[var(--text-dim)] text-xs">
                                <span className="flex items-center gap-1.5">
                                    <GitCommit size={14} className="text-emerald-500/60" /> {project.github_stats.commits}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Star size={14} className="text-amber-500/60" /> {project.github_stats.stars || 0}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {project.github_stats.languages.map(lang => (
                                    <span key={lang} className="px-2.5 py-1 rounded-xl bg-[var(--surface-card-hover)] text-[9px] text-[var(--text-ghost)] font-mono uppercase tracking-wider">
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area - Rule 3: Reveal Gradually */}
                <div className="flex-1 relative overflow-hidden">

                    {/* Floating Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 z-50 p-3 bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)] rounded-full transition-all duration-500 text-[var(--text-dim)] hover:text-[var(--text)] shadow-[0_8px_32px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-xl"
                    >
                        <X size={20} />
                    </button>

                    {/* Step 1: Visual Intelligence (Snapshot First) */}
                    <div className={`absolute inset-0 p-12 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeStep === 1 ? 'opacity-100 translate-y-0 scale-100 visible' : 'opacity-0 translate-y-12 scale-95 invisible'
                        }`}>
                        <div className="mb-8 flex items-center justify-between">
                            <h3 className="text-2xl text-[var(--text)] font-light tracking-tight">
                                Visual Intelligence
                            </h3>
                            <div className="flex gap-3">
                                <a
                                    href={`https://${project.link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)] transition-all active:scale-95"
                                >
                                    Launch <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>

                        <div className="flex-1 relative group cursor-pointer rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] bg-black/60">
                            <img
                                src={screenshotUrl}
                                alt={project.title}
                                className={`w-full h-full object-cover object-top transition-all duration-1000 ${imageLoaded ? 'opacity-90 scale-100' : 'opacity-0 scale-105'
                                    }`}
                                onLoad={() => setImageLoaded(true)}
                            />
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-card)]">
                                    <div className="w-10 h-10 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

                            <div className="absolute bottom-10 left-10 right-10 text-white">
                                <p className="text-white/80 text-xl leading-relaxed max-w-2xl font-light">
                                    {project.description}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setActiveStep(2)}
                            className="mt-8 self-start group flex items-center gap-3 text-[var(--text-ghost)] hover:text-[var(--text)] transition-all text-[10px] font-mono tracking-[0.2em] uppercase"
                        >
                            Deconstruct Architecture <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Step 2: Architecture */}
                    <div className={`absolute inset-0 p-12 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeStep === 2 ? 'opacity-100 translate-y-0 scale-100 visible' : 'opacity-0 translate-y-12 scale-95 invisible'
                        }`}>
                        <h3 className="text-2xl text-[var(--text)] font-light tracking-tight mb-8">
                            Intelligence Architecture
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1 items-center">
                            <div className="space-y-8">
                                <p className="text-[var(--text-muted)] text-lg leading-relaxed font-light">
                                    {project.architecture}
                                </p>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-8 rounded-[2.5rem] bg-[var(--surface-card)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] group hover:bg-[var(--surface-card-hover)] transition-all duration-500">
                                        <div className="text-emerald-500 dark:text-emerald-400 text-4xl font-light mb-2 tracking-tighter">
                                            {project.github_stats.commits > 1000 ? '1.2k+' : project.github_stats.commits}
                                        </div>
                                        <div className="text-[var(--text-ghost)] text-[10px] font-mono tracking-[0.2em] uppercase">
                                            Core Modules
                                        </div>
                                    </div>
                                    <div className="p-8 rounded-[2.5rem] bg-[var(--surface-card)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] group hover:bg-[var(--surface-card-hover)] transition-all duration-500">
                                        <div className="text-blue-500 dark:text-blue-400 text-4xl font-light mb-2 tracking-tighter">
                                            99.9%
                                        </div>
                                        <div className="text-[var(--text-ghost)] text-[10px] font-mono tracking-[0.2em] uppercase">
                                            Uptime Target
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative aspect-square rounded-[4rem] overflow-hidden bg-[var(--surface-card)] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] p-12 flex items-center justify-center group overflow-hidden">
                                <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-1000">
                                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--emerald-500)_0%,transparent_70%)] blur-3xl animate-pulse" />
                                </div>
                                <Code className="w-32 h-32 text-[var(--text)] opacity-5 relative z-10 transition-transform duration-1000 group-hover:scale-110" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-4/5 h-4/5 border border-[var(--text)] opacity-5 rounded-full animate-[ping_8s_infinite]" />
                                    <div className="absolute w-2/3 h-2/3 border border-[var(--text)] opacity-10 rounded-full animate-[pulse_4s_infinite]" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setActiveStep(3)}
                            className="mt-8 self-start group flex items-center gap-3 text-[var(--text-ghost)] hover:text-[var(--text)] transition-all text-[10px] font-mono tracking-[0.2em] uppercase"
                        >
                            Impact Assessment <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Step 3: Strategic Impact (Challenge + Proposal) */}
                    <div className={`absolute inset-0 p-12 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${activeStep === 3 ? 'opacity-100 translate-y-0 scale-100 visible' : 'opacity-0 translate-y-12 scale-95 invisible'
                        }`}>
                        <div className="max-w-3xl flex-1 flex flex-col justify-center">
                            <h3 className="text-2xl text-[var(--text)] font-light tracking-tight mb-12">
                                Strategic Impact
                            </h3>

                            <div className="space-y-12 mb-16">
                                <div className="relative p-8 rounded-[2.5rem] bg-[var(--surface-card)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                                    <h4 className="text-[var(--text-ghost)] text-[10px] font-mono tracking-[0.2em] uppercase mb-4">
                                        The Challenge
                                    </h4>
                                    <p className="text-[var(--text-muted)] text-2xl leading-relaxed font-light tracking-tight">
                                        {project.challenge}
                                    </p>
                                </div>

                                <div className="relative p-8 rounded-[2.5rem] bg-emerald-500/[0.02] shadow-[inset_0_0_0_1px_rgba(16,185,129,0.05)]">
                                    <h4 className="text-emerald-500 text-[10px] font-mono tracking-[0.2em] uppercase mb-4">
                                        The Proposal
                                    </h4>
                                    <p className="text-[var(--text-muted)] text-xl leading-relaxed font-light italic">
                                        "{project.proposal}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <a
                                    href={`mailto:hello@dyrane.tech?subject=Intelligence Inquiry: ${project.title} Deployment`}
                                    className="flex-1 py-6 bg-[var(--cta-bg)] text-[var(--cta-text)] font-semibold rounded-[2rem] hover:opacity-90 shadow-[0_16px_32px_rgba(0,0,0,0.1)] transition-all text-center flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    Deploy Intelligence
                                </a>
                                <a
                                    href={`https://${project.link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-6 bg-[var(--cta-secondary-bg)] text-[var(--cta-secondary-text)] font-medium rounded-[2rem] hover:bg-[var(--cta-secondary-hover)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] transition-all text-center flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    Visit Project <Globe size={18} />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
