
import { Project } from "@/data/projects";
import { X, ArrowRight, ArrowUpRight, Github, Code, GitCommit, Star, ExternalLink, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectOverlayProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProjectOverlay = ({ project, isOpen, onClose }: ProjectOverlayProps) => {
    const [activeStep, setActiveStep] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setActiveStep(1);
            setImageLoaded(false);

            // Lock body scroll
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    if (!project || !isOpen) return null;

    const screenshotUrl = `https://api.microlink.io?url=https://${project.link}&screenshot=true&meta=false&embed=screenshot.url`;

    const steps = [
        { id: 1, label: "Visual Intelligence" },
        { id: 2, label: "Intelligence Architecture" },
        { id: 3, label: "Strategic Impact" }
    ];

    const handleNext = () => { if (activeStep < 3) setActiveStep(prev => prev + 1); };
    const handlePrev = () => { if (activeStep > 1) setActiveStep(prev => prev - 1); };

    // --- MOBILE VIEW (Multiphasic Bottom Sheet) ---
    if (isMobile) {
        return (
            <div className="fixed inset-0 z-[60] flex items-end justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/10 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* h-[92vh] Multiphasic Sheet */}
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative w-full h-[92vh] bg-white/40 dark:bg-[#0D0D0D]/40 backdrop-blur-sm rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden"
                >
                    {/* Handle */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-black/10 dark:bg-white/10 rounded-full z-50" />

                    {/* Progress Header */}
                    <div className="px-6 pt-10 pb-4 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-emerald-500 text-[10px] font-mono tracking-widest uppercase mb-0.5">Step 0{activeStep}</span>
                            <h3 className="text-lg font-medium text-[var(--text)]">{steps[activeStep - 1].label}</h3>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full bg-black/5 dark:bg-white/5 text-[var(--text-dim)]"><X size={18} /></button>
                    </div>

                    {/* Stage Area */}
                    <div className="flex-1 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Snapshot Mode (Edge to Edge) */}
                            {activeStep === 1 && (
                                <motion.div
                                    key="m-step1"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    className="absolute inset-0 flex flex-col"
                                >
                                    <div className="flex-1 relative group bg-black overflow-hidden">
                                        <img
                                            src={screenshotUrl}
                                            className={`w-full h-full object-cover object-top transition-all duration-1000 ${imageLoaded ? 'opacity-80' : 'opacity-0 scale-105'}`}
                                            onLoad={() => setImageLoaded(true)}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.3)_0%,transparent_50%)]" />

                                        {/* Parity with Desktop: Top-Right Cinematic Launch Button */}
                                        <div className="absolute top-6 right-6">
                                            <a
                                                href={`https://${project.link}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 backdrop-blur-sm rounded-full text-[10px] font-mono uppercase tracking-widest transition-all active:scale-95 shadow-2xl"
                                            >
                                                Launch <ExternalLink size={14} />
                                            </a>
                                        </div>

                                        <div className="absolute bottom-10 left-6 right-6 text-white flex flex-col items-center sm:items-start pointer-events-none">
                                            <h4 className="text-4xl font-light mb-4 tracking-tighter leading-none">{project.title}</h4>
                                            <p className="text-white/70 text-lg font-light leading-relaxed max-w-2xl text-center sm:text-left">{project.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Architecture */}
                            {activeStep === 2 && (
                                <motion.div
                                    key="m-step2"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    className="absolute inset-0 px-8 flex flex-col justify-center"
                                >
                                    <div className="space-y-12">
                                        <p className="text-[var(--text-muted)] text-xl font-light leading-relaxed tracking-tight">{project.architecture}</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-8 rounded-[2rem] bg-black/5 dark:bg-white/5">
                                                <div className="text-emerald-500 text-4xl font-light mb-1">{project.github_stats.commits}</div>
                                                <div className="text-[var(--text-ghost)] text-[10px] font-mono uppercase tracking-widest">Commits</div>
                                            </div>
                                            <div className="p-8 rounded-[2rem] bg-black/5 dark:bg-white/5">
                                                <div className="text-blue-500 text-4xl font-light mb-1">99.9%</div>
                                                <div className="text-[var(--text-ghost)] text-[10px] font-mono uppercase tracking-widest">Stability</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Impact */}
                            {activeStep === 3 && (
                                <motion.div
                                    key="m-step3"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    className="absolute inset-0 px-8 flex flex-col justify-center"
                                >
                                    <div className="space-y-10">
                                        <div className="p-8 rounded-[2.5rem] bg-black/5 dark:bg-white/5">
                                            <h4 className="text-[var(--text-ghost)] text-[10px] font-mono uppercase mb-4 tracking-widest">Protocol Resolution</h4>
                                            <p className="text-[var(--text-muted)] text-2xl font-light tracking-tight italic">"{project.proposal}"</p>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <a href={`https://${project.link}`} target="_blank" className="group flex items-center justify-between p-6 rounded-[2rem] bg-black/5 dark:bg-white/5 active:scale-95 transition-all">
                                                <div className="flex flex-col">
                                                    <span className="text-emerald-500 text-[10px] font-mono uppercase tracking-widest mb-1">Live Interface</span>
                                                    <span className="text-[var(--text)] text-lg font-medium">Deploy Intelligence</span>
                                                </div>
                                                <ArrowUpRight size={24} className="text-emerald-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </a>
                                            <a href={`mailto:hello@dyrane.tech?subject=Inquiry: ${project.title}`} className="group flex items-center justify-between p-6 rounded-[2rem] bg-black/5 dark:bg-white/5 active:scale-95 transition-all">
                                                <div className="flex flex-col">
                                                    <span className="text-[var(--text-ghost)] text-[10px] font-mono uppercase tracking-widest mb-1">Human Logic</span>
                                                    <span className="text-[var(--text-dim)] text-lg font-medium">Interface Architect</span>
                                                </div>
                                                <Globe size={24} className="text-[var(--text-ghost)] group-hover:rotate-12 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Progress Navigation */}
                    <div className="px-8 py-10 mt-auto backdrop-blur-3xl">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                {steps.map(s => (
                                    <div key={s.id} className={`h-1 rounded-full transition-all duration-500 ${activeStep === s.id ? 'w-8 bg-emerald-500' : 'w-2 bg-black/10 dark:bg-white/10'}`} />
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handlePrev} disabled={activeStep === 1} className={`p-4 rounded-full bg-black/5 dark:bg-white/5 ${activeStep === 1 ? 'opacity-20' : 'opacity-100 active:scale-90'}`}><ChevronLeft size={22} /></button>
                                <button onClick={handleNext} disabled={activeStep === 3} className={`px-8 py-4 bg-[var(--cta-bg)] text-[var(--cta-text)] font-semibold rounded-full flex items-center gap-2 ${activeStep === 3 ? 'opacity-20' : 'opacity-100 active:scale-95 shadow-lg'}`}>Next <ChevronRight size={18} /></button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- DESKTOP VIEW (Preserving Original Design Canon) ---
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop - Rule 20: Glass, not gloss */}
            <div
                className="absolute inset-0 bg-black/10 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Content Container - Rule 33: No visual debt. Original solid/high-opacity look. */}
            <div className="relative w-full max-w-5xl bg-white/40 dark:bg-[#0D0D0D]/40 rounded-[1.5rem] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.5)] animate-glide flex flex-col md:flex-row h-full max-h-[90vh] md:h-[700px] backdrop-blur-sm">

                {/* Navigation Sidebar - Rule 2: Best Default Wins */}
                <div className="w-full md:w-72 p-4 md:p-6 flex flex-col bg-black/5 dark:bg-black/40 overflow-y-auto shrink-0 md:h-full scrollbar-thin">
                    <div className="mb-4 md:mb-8">
                        <span className="text-emerald-500 dark:text-emerald-400 text-[10px] font-mono tracking-[0.2em] uppercase mb-2 block opacity-80">
                            {project.category}
                        </span>
                        <h2 className="text-xl text-[var(--text)] font-medium tracking-tight leading-tight">
                            {project.title}
                        </h2>
                    </div>

                    <nav className="space-y-1 flex-1">
                        {steps.map((step) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(step.id)}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-500 group relative overflow-hidden ${activeStep === step.id
                                    ? "text-[var(--text)] bg-black/5 dark:bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
                                    : "text-[var(--text-dim)] hover:text-[var(--text-muted)] hover:bg-black/[0.03] dark:hover:bg-white/5"
                                    }`}
                            >
                                <div className="relative z-10 flex items-center gap-3">
                                    <span className={`font-mono text-[10px] ${activeStep === step.id ? "text-emerald-500" : "text-[var(--text-ghost)]"}`}>
                                        0{step.id}
                                    </span>
                                    {step.label}
                                </div>
                                {activeStep === step.id && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-500 dark:bg-emerald-400 rounded-full" />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Repository Context - Rule 16 Check */}
                    <div className="mt-auto space-y-4">
                        <div className="p-4 rounded-[1.5rem] bg-black/5 dark:bg-black/40 space-y-3">
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
                            <div className="flex flex-wrap gap-1">
                                {project.github_stats.languages.map(lang => (
                                    <span key={lang} className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/[0.05] text-[9px] text-[var(--text-ghost)] font-mono uppercase tracking-wider">
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area - Rule 3: Reveal Gradually */}
                <div className="flex-1 relative h-full">

                    {/* Floating Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2.5 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-full transition-all duration-500 text-[var(--text-dim)] hover:text-[var(--text)] shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
                    >
                        <X size={18} />
                    </button>

                    <div className="absolute inset-0 p-4 md:p-8 flex flex-col overflow-y-auto scrollbar-thin">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                className="h-full flex flex-col"
                            >
                                {activeStep === 1 && (
                                    <div className="flex flex-col h-full">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-xl text-[var(--text)] font-light tracking-tight">Visual Intelligence</h3>
                                        </div>
                                        <div className="flex-1 relative group cursor-pointer rounded-[1.25rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-black/60 shrink-0 min-h-[360px]">
                                            <img
                                                src={screenshotUrl}
                                                alt={project.title}
                                                className={`w-full h-full object-cover object-top transition-all duration-1000 ${imageLoaded ? 'opacity-90 scale-100' : 'opacity-0 scale-105'
                                                    }`}
                                                onLoad={() => setImageLoaded(true)}
                                            />
                                            {!imageLoaded && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-card)]">
                                                    <div className="w-8 h-8 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.4)_0%,transparent_50%)]" />

                                            <div className="absolute top-6 right-6">
                                                <a
                                                    href={`https://${project.link}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 backdrop-blur-sm rounded-full text-[10px] font-mono uppercase tracking-widest transition-all active:scale-95 shadow-xl"
                                                >
                                                    Launch <ExternalLink size={12} />
                                                </a>
                                            </div>

                                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                                <p className="text-white/80 text-lg leading-relaxed max-w-xl font-light">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveStep(2)}
                                            className="mt-4 self-start group flex items-center gap-3 text-[var(--text-ghost)] hover:text-[var(--text)] transition-all text-[10px] font-mono tracking-[0.2em] uppercase"
                                        >
                                            Deconstruct Architecture <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {activeStep === 2 && (
                                    <div className="flex flex-col justify-center h-full space-y-6">
                                        <h3 className="text-xl text-[var(--text)] font-light tracking-tight mb-4">Intelligence Architecture</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-center">
                                            <div className="space-y-6">
                                                <p className="text-[var(--text-muted)] text-base leading-relaxed font-light">{project.architecture}</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-5 rounded-[1.5rem] bg-white/5 dark:bg-white/[0.02] transition-all duration-500">
                                                        <div className="text-emerald-500 dark:text-emerald-400 text-3xl font-light mb-1 tracking-tighter">
                                                            {project.github_stats.commits > 1000 ? '1.2k+' : project.github_stats.commits}
                                                        </div>
                                                        <div className="text-[var(--text-ghost)] text-[10px] font-mono tracking-[0.2em] uppercase">Core Modules</div>
                                                    </div>
                                                    <div className="p-5 rounded-[1.5rem] bg-black/5 dark:bg-black/40 transition-all duration-500">
                                                        <div className="text-blue-500 dark:text-blue-400 text-3xl font-light mb-1 tracking-tighter">99.9%</div>
                                                        <div className="text-[var(--text-ghost)] text-[10px] font-mono uppercase tracking-widest">Uptime Target</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative aspect-square rounded-[1.5rem] md:rounded-[2.5rem] bg-black/5 dark:bg-black/20 p-4 md:p-8 flex items-center justify-center group overflow-hidden shadow-2xl">
                                                <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-1000">
                                                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--emerald-500)_0%,transparent_70%)] blur-2xl animate-pulse" />
                                                </div>
                                                <Code className="w-16 h-16 md:w-24 md:h-24 text-[var(--text)] opacity-10 relative z-10 transition-transform duration-1000 group-hover:scale-110" />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="w-4/5 h-4/5 border border-emerald-500/10 opacity-20 rounded-full animate-[ping_8s_infinite]" />
                                                    <div className="absolute w-2/3 h-2/3 border border-blue-500/10 opacity-10 rounded-full animate-[pulse_4s_infinite]" />
                                                    <div className="absolute w-1/2 h-1/2 border border-[var(--text)] opacity-5 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveStep(3)}
                                            className="mt-4 self-start group flex items-center gap-3 text-[var(--text-ghost)] hover:text-[var(--text)] transition-all text-[10px] font-mono tracking-[0.2em] uppercase"
                                        >
                                            Impact Assessment <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {activeStep === 3 && (
                                    <div className="max-w-2xl flex flex-col pt-4 pb-8">
                                        <h3 className="text-xl text-[var(--text)] font-light tracking-tight mb-6">Strategic Impact</h3>
                                        <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                                            <div className="relative p-6 rounded-[2rem] bg-black/5 dark:bg-black/40">
                                                <h4 className="text-[var(--text-ghost)] text-[10px] font-mono tracking-[0.2em] uppercase mb-4">The Challenge</h4>
                                                <p className="text-[var(--text-muted)] text-2xl leading-snug font-light tracking-tight">{project.challenge}</p>
                                            </div>
                                            <div className="relative p-6 rounded-[2rem] bg-emerald-500/[0.04]">
                                                <h4 className="text-emerald-500 text-[10px] font-mono tracking-[0.2em] uppercase mb-4">The Proposal</h4>
                                                <p className="text-[var(--text-muted)] text-lg leading-relaxed font-light italic">"{project.proposal}"</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center gap-12">
                                            <a
                                                href={`mailto:hello@dyrane.tech?subject=Intelligence Inquiry: ${project.title} Deployment`}
                                                className="group flex items-center gap-4 text-[var(--text)] hover:text-emerald-500 transition-all duration-500"
                                            >
                                                <div className="flex flex-col items-start">
                                                    <span className="text-emerald-500 text-[10px] font-mono uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">Request Access</span>
                                                    <span className="text-xl font-medium tracking-tight">Deploy Intelligence</span>
                                                </div>
                                                <div className="p-4 rounded-full bg-black/5 dark:bg-white/5 group-hover:bg-emerald-500/10 transition-colors">
                                                    <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </div>
                                            </a>

                                            <div className="h-8 w-px bg-black/10 dark:bg-white/10 hidden sm:block" />

                                            <a
                                                href={`https://${project.link}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center gap-4 text-[var(--text-dim)] hover:text-[var(--text)] transition-all duration-500"
                                            >
                                                <div className="flex flex-col items-start">
                                                    <span className="text-[var(--text-ghost)] text-[10px] font-mono uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">Visit Interface</span>
                                                    <span className="text-xl font-medium tracking-tight">Full System</span>
                                                </div>
                                                <div className="p-4 rounded-full bg-black/5 dark:bg-white/5 group-hover:bg-white/10 transition-colors">
                                                    <Globe size={24} className="group-hover:rotate-12 transition-transform" />
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
