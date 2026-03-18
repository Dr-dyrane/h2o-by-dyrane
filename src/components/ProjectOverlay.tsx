
import { Project } from "@/data/projects";
import { X, ArrowRight, ArrowUpRight, Github, Code, GitCommit, Star, ExternalLink, Globe, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectOverlayProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

const categoryColor: Record<string, { text: string; bg: string; }> = {
    "Logistics Engine":    { text: "text-[var(--cat-logistics)]",   bg: "bg-[var(--cat-logistics-bg)]"    },
    "Intelligence Bridge": { text: "text-[var(--cat-intelligence)]", bg: "bg-[var(--cat-intelligence-bg)]" },
    "Modernized UX":       { text: "text-[var(--cat-ux)]",          bg: "bg-[var(--cat-ux-bg)]"           },
};

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
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = "hidden";
            return () => { document.body.style.overflow = originalStyle; };
        }
    }, [isOpen]);

    if (!project || !isOpen) return null;

    const screenshotUrl = `https://api.microlink.io?url=https://${project.link}&screenshot=true&meta=false&embed=screenshot.url`;
    const { text: catText, bg: catBg } = categoryColor[project.category] ?? { text: "text-emerald-400", bg: "bg-emerald-500/10" };

    const steps = [
        { id: 1, label: "Visual Intelligence" },
        { id: 2, label: "Intelligence Architecture" },
        { id: 3, label: "Strategic Impact" }
    ];

    const handleNext = () => { if (activeStep < 3) setActiveStep(p => p + 1); };
    const handlePrev = () => { if (activeStep > 1) setActiveStep(p => p - 1); };

    // ─── MOBILE — Multiphasic Bottom Sheet ───────────────────────────────────
    if (isMobile) {
        return (
            <div className="fixed inset-0 z-[60] flex items-end justify-center">
                {/* Scrim — dark enough to signal modal depth in both modes */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Sheet — explicit dark floor + glass-thick */}
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 28, stiffness: 220 }}
                    className="relative w-full h-[92vh] bg-white/85 dark:bg-[#0D0D0D]/90 glass-thick squircle-panel overflow-hidden flex flex-col"
                    style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                >
                    {/* Drag handle */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 squircle-pill bg-[var(--text-ghost)]/30 z-50" />

                    {/* Sheet Header */}
                    <div className="px-6 pt-10 pb-4 flex items-center justify-between">
                        <div>
                            <span className={`text-[10px] font-mono tracking-[0.2em] uppercase mb-0.5 block ${catText}`}>
                                Step 0{activeStep}
                            </span>
                            <h3 className="text-lg font-semibold text-[var(--text)] tracking-tight">
                                {steps[activeStep - 1].label}
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 squircle-icon glass-ultra-thin text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Stage */}
                    <div className="flex-1 relative overflow-hidden">
                        <AnimatePresence mode="wait">

                            {/* Step 1 — Live Screenshot */}
                            {activeStep === 1 && (
                                <motion.div
                                    key="m-step1"
                                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                                    className="absolute inset-0 flex flex-col"
                                >
                                    <div className="flex-1 relative bg-black overflow-hidden">
                                        <img
                                            src={screenshotUrl}
                                            className={`w-full h-full object-cover object-top transition-all duration-700 ${imageLoaded ? 'opacity-80' : 'opacity-0'}`}
                                            onLoad={() => setImageLoaded(true)}
                                            alt={project.title}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                        <div className="absolute top-5 right-5">
                                            <a
                                                href={`https://${project.link}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className={`flex items-center gap-2 px-5 py-2.5 squircle-pill glass-regular ${catText} text-[10px] font-mono uppercase tracking-widest`}
                                            >
                                                Launch <ExternalLink size={12} />
                                            </a>
                                        </div>

                                        <div className="absolute bottom-8 left-6 right-6">
                                            <h4 className="text-3xl font-semibold text-white tracking-tighter mb-2">{project.title}</h4>
                                            <p className="text-white/70 text-base font-light leading-relaxed">{project.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2 — Architecture */}
                            {activeStep === 2 && (
                                <motion.div
                                    key="m-step2"
                                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                                    className="absolute inset-0 px-8 flex flex-col justify-center space-y-8"
                                >
                                    <p className="text-[var(--text-muted)] text-xl font-light leading-relaxed">{project.architecture}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-7 squircle-nav glass-ultra-thin">
                                            <div className={`text-4xl font-light mb-1 tracking-tighter ${catText}`}>{project.github_stats.commits}</div>
                                            <div className="text-[var(--text-ghost)] text-[10px] font-mono uppercase tracking-widest">Commits</div>
                                        </div>
                                        <div className="p-7 squircle-nav glass-ultra-thin">
                                            <div className="text-blue-400 text-4xl font-light mb-1 tracking-tighter">99.9%</div>
                                            <div className="text-[var(--text-ghost)] text-[10px] font-mono uppercase tracking-widest">Stability</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3 — Impact */}
                            {activeStep === 3 && (
                                <motion.div
                                    key="m-step3"
                                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                                    className="absolute inset-0 px-8 flex flex-col justify-center space-y-8"
                                >
                                    <div className="squircle p-7 glass-ultra-thin">
                                        <h4 className={`text-[10px] font-mono uppercase tracking-widest mb-3 ${catText}`}>Protocol Resolution</h4>
                                        <p className="text-[var(--text-muted)] text-xl font-light tracking-tight italic">"{project.proposal}"</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <a href={`https://${project.link}`} target="_blank"
                                            className="group flex items-center justify-between p-5 squircle-nav glass-ultra-thin active:scale-95 transition-all">
                                            <div>
                                                <span className={`text-[10px] font-mono uppercase tracking-widest mb-0.5 block ${catText}`}>Live Interface</span>
                                                <span className="text-[var(--text)] text-base font-medium">Deploy Intelligence</span>
                                            </div>
                                            <ArrowUpRight size={20} className={`${catText} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`} />
                                        </a>
                                        <a href={`mailto:hello@dyrane.tech?subject=Inquiry: ${project.title}`}
                                            className="group flex items-center justify-between p-5 squircle-nav glass-ultra-thin active:scale-95 transition-all">
                                            <div>
                                                <span className="text-[10px] font-mono uppercase tracking-widest mb-0.5 block text-[var(--text-ghost)]">Partner Up</span>
                                                <span className="text-[var(--text-dim)] text-base font-medium">Interface Architect</span>
                                            </div>
                                            <Globe size={20} className="text-[var(--text-ghost)] group-hover:rotate-12 transition-transform" />
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Footer */}
                    <div className="px-8 py-8 mt-auto glass-ultra-thin">
                        <div className="flex items-center justify-between">
                            {/* Progress dots */}
                            <div className="flex gap-2">
                                {steps.map(s => (
                                    <div
                                        key={s.id}
                                        className={`h-1 squircle-pill transition-all duration-500 ${activeStep === s.id ? `w-8 ${catBg.replace('/10', '/80')}` : 'w-2 bg-[var(--text-ghost)]/20'}`}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handlePrev}
                                    disabled={activeStep === 1}
                                    className={`p-3.5 squircle-icon glass-ultra-thin text-[var(--text)] transition-all ${activeStep === 1 ? 'opacity-20' : 'opacity-100 active:scale-90'}`}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={activeStep === 3}
                                    className={`px-7 py-3.5 squircle-pill bg-[var(--cta-bg)] text-[var(--cta-text)] font-semibold flex items-center gap-2 text-sm transition-all ${activeStep === 3 ? 'opacity-20' : 'opacity-100 active:scale-95'}`}
                                >
                                    Next <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ─── DESKTOP — Full Panel ─────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel — explicit dark floor + glass-thick */}
            <div className="relative w-full max-w-5xl bg-white/85 dark:bg-[#0D0D0D]/90 glass-thick squircle-panel overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh] md:h-[700px]">

                {/* Sidebar */}
                <div className="w-full md:w-72 p-5 md:p-6 flex flex-col glass-ultra-thin shrink-0 md:h-full overflow-y-auto">
                    {/* Project identity */}
                    <div className="mb-6 md:mb-8">
                        <span className={`text-[10px] font-mono tracking-[0.2em] uppercase mb-1.5 block ${catText}`}>
                            {project.category}
                        </span>
                        <h2 className="text-xl text-[var(--text)] font-semibold tracking-tight leading-tight">
                            {project.title}
                        </h2>
                    </div>

                    {/* Step navigation */}
                    <nav className="space-y-1 flex-1">
                        {steps.map((step) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(step.id)}
                                className={`w-full text-left px-4 py-3 squircle-chip text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                                    activeStep === step.id
                                        ? `text-[var(--text)] glass-ultra-thin`
                                        : "text-[var(--text-dim)] hover:text-[var(--text-muted)]"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`font-mono text-[10px] tabular-nums ${activeStep === step.id ? catText : "text-[var(--text-ghost)]"}`}>
                                        0{step.id}
                                    </span>
                                    {step.label}
                                </div>
                                {activeStep === step.id && (
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 squircle-pill ${catBg.replace('/10', '/80')}`} />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Repo stats */}
                    <div className="mt-auto">
                        <div className="squircle-nav p-4 glass-ultra-thin space-y-3">
                            <div className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider ${catText} opacity-70`}>
                                <Github size={11} /> Source Intelligence
                            </div>
                            <div className="flex items-center justify-between text-[var(--text-dim)] text-xs font-mono">
                                <span className="flex items-center gap-1.5">
                                    <GitCommit size={13} className={catText} /> {project.github_stats.commits}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Star size={13} className="text-amber-400/70" /> {project.github_stats.stars || 0}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {project.github_stats.languages.map(lang => (
                                    <span key={lang} className="squircle-chip px-2 py-0.5 glass-ultra-thin text-[9px] text-[var(--text-ghost)] font-mono uppercase tracking-wider">
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 relative h-full">
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 z-50 p-2.5 squircle-icon glass-regular text-[var(--text-dim)] hover:text-[var(--text)] transition-all duration-300"
                    >
                        <X size={17} />
                    </button>

                    <div className="absolute inset-0 p-5 md:p-8 flex flex-col overflow-y-auto scrollbar-thin">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                className="h-full flex flex-col"
                            >
                                {/* Step 1 — Screenshot */}
                                {activeStep === 1 && (
                                    <div className="flex flex-col h-full">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-xl text-[var(--text)] font-semibold tracking-tight">Visual Intelligence</h3>
                                        </div>
                                        <div className="flex-1 relative squircle overflow-hidden bg-black shrink-0 min-h-[360px] shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
                                            <img
                                                src={screenshotUrl}
                                                alt={project.title}
                                                className={`w-full h-full object-cover object-top transition-all duration-700 ${imageLoaded ? 'opacity-90' : 'opacity-0'}`}
                                                onLoad={() => setImageLoaded(true)}
                                            />
                                            {!imageLoaded && (
                                                <div className="absolute inset-0 glass-ultra-thin flex items-center justify-center">
                                                    <Loader2 className={`w-6 h-6 animate-spin ${catText}`} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                                            <div className="absolute top-5 right-5">
                                                <a
                                                    href={`https://${project.link}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className={`flex items-center gap-2 px-5 py-2.5 squircle-pill glass-regular ${catText} text-[10px] font-mono uppercase tracking-widest hover:scale-105 transition-all`}
                                                >
                                                    Launch <ExternalLink size={11} />
                                                </a>
                                            </div>

                                            <div className="absolute bottom-6 left-6 right-6">
                                                <p className="text-white/80 text-lg leading-relaxed font-light">{project.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveStep(2)}
                                            className="mt-4 self-start group flex items-center gap-2 text-[var(--text-ghost)] hover:text-[var(--text)] transition-all text-[10px] font-mono tracking-[0.2em] uppercase"
                                        >
                                            Deconstruct Architecture <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {/* Step 2 — Architecture */}
                                {activeStep === 2 && (
                                    <div className="flex flex-col justify-center h-full space-y-6">
                                        <h3 className="text-xl text-[var(--text)] font-semibold tracking-tight">Intelligence Architecture</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-center">
                                            <div className="space-y-5">
                                                <p className="text-[var(--text-muted)] text-base leading-relaxed font-light">{project.architecture}</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="squircle-nav p-5 glass-ultra-thin">
                                                        <div className={`text-3xl font-light mb-1 tracking-tighter tabular-nums ${catText}`}>
                                                            {project.github_stats.commits > 1000 ? '1.2k+' : project.github_stats.commits}
                                                        </div>
                                                        <div className="text-[var(--text-ghost)] text-[10px] font-mono tracking-widest uppercase">Core Modules</div>
                                                    </div>
                                                    <div className="squircle-nav p-5 glass-ultra-thin">
                                                        <div className="text-blue-400 text-3xl font-light mb-1 tracking-tighter">99.9%</div>
                                                        <div className="text-[var(--text-ghost)] text-[10px] font-mono tracking-widest uppercase">Uptime Target</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ambient orb — no borders */}
                                            <div className="relative aspect-square squircle glass-ultra-thin flex items-center justify-center group overflow-hidden">
                                                <div className={`absolute inset-0 opacity-10 group-hover:opacity-25 transition-opacity duration-1000 pointer-events-none blur-3xl ${catBg}`} />
                                                <Code className="w-16 h-16 md:w-20 md:h-20 text-[var(--text)] opacity-10 relative z-10 group-hover:scale-110 transition-transform duration-700" />
                                                {/* Depth rings — shadow-based, not border */}
                                                <div className="absolute inset-8 squircle shadow-[0_0_0_1px_rgba(255,255,255,0.04)] pointer-events-none" />
                                                <div className="absolute inset-16 squircle shadow-[0_0_0_1px_rgba(255,255,255,0.03)] pointer-events-none" />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveStep(3)}
                                            className="self-start group flex items-center gap-2 text-[var(--text-ghost)] hover:text-[var(--text)] transition-all text-[10px] font-mono tracking-[0.2em] uppercase"
                                        >
                                            Impact Assessment <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {/* Step 3 — Impact */}
                                {activeStep === 3 && (
                                    <div className="max-w-2xl flex flex-col pt-4 pb-8">
                                        <h3 className="text-xl text-[var(--text)] font-semibold tracking-tight mb-6">Strategic Impact</h3>
                                        <div className="space-y-4 mb-10">
                                            <div className="squircle p-7 glass-ultra-thin">
                                                <h4 className="text-[var(--text-ghost)] text-[10px] font-mono tracking-[0.2em] uppercase mb-4">The Challenge</h4>
                                                <p className="text-[var(--text-muted)] text-2xl leading-snug font-light tracking-tight">{project.challenge}</p>
                                            </div>
                                            <div className={`squircle p-7 ${catBg} glass-ultra-thin`}>
                                                <h4 className={`text-[10px] font-mono tracking-[0.2em] uppercase mb-4 ${catText}`}>The Proposal</h4>
                                                <p className="text-[var(--text-muted)] text-lg leading-relaxed font-light italic">"{project.proposal}"</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-10">
                                            <a
                                                href={`mailto:hello@dyrane.tech?subject=Intelligence Inquiry: ${project.title} Deployment`}
                                                className="group flex items-center gap-4 text-[var(--text)] hover:text-emerald-400 transition-all duration-400"
                                            >
                                                <div>
                                                    <span className={`text-[10px] font-mono uppercase tracking-widest mb-0.5 block opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0 ${catText}`}>
                                                        Request Access
                                                    </span>
                                                    <span className="text-xl font-semibold tracking-tight">Deploy Intelligence</span>
                                                </div>
                                                <div className="p-4 squircle-icon glass-thin group-hover:scale-110 transition-all duration-300">
                                                    <ArrowUpRight size={22} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </div>
                                            </a>

                                            {/* Depth separator — shadow not border */}
                                            <div className="hidden sm:block h-10 w-px bg-gradient-to-b from-transparent via-[var(--text-ghost)]/20 to-transparent" />

                                            <a
                                                href={`https://${project.link}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="group flex items-center gap-4 text-[var(--text-dim)] hover:text-[var(--text)] transition-all duration-400"
                                            >
                                                <div>
                                                    <span className="text-[10px] font-mono uppercase tracking-widest mb-0.5 block opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0 text-[var(--text-ghost)]">
                                                        Visit Interface
                                                    </span>
                                                    <span className="text-xl font-semibold tracking-tight">Full System</span>
                                                </div>
                                                <div className="p-4 squircle-icon glass-thin group-hover:scale-110 transition-all duration-300">
                                                    <Globe size={22} className="group-hover:rotate-12 transition-transform duration-400" />
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
