import type { Project } from "@/data/projects";
import {
    X,
    ArrowRight,
    ArrowUpRight,
    Github,
    Code,
    GitCommit,
    Star,
    ExternalLink,
    Globe,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "@/components/icons/lucide";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cleanCopy, getFirstSentence, formatList } from "@/utils/content";

interface ProjectOverlayProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

const categoryColor: Record<string, { text: string; accentBg: string; accent: string }> = {
    "Logistics Engine": { 
        text: "text-[var(--cat-logistics)]", 
        accentBg: "bg-[var(--cat-logistics-bg)]",
        accent: "var(--cat-logistics)"
    },
    "Intelligence Bridge": { 
        text: "text-[var(--cat-intelligence)]", 
        accentBg: "bg-[var(--cat-intelligence-bg)]",
        accent: "var(--cat-intelligence)"
    },
    "Modernized UX": { 
        text: "text-[var(--cat-ux)]", 
        accentBg: "bg-[var(--cat-ux-bg)]",
        accent: "var(--cat-ux)"
    },
};

const categoryNarratives: Record<Project["category"], { works: string; fallbackNeed: string }> = {
    "Logistics Engine": {
        works: "Built as an operations product with live system states, clear routing, and a decision surface teams can trust when timing matters.",
        fallbackNeed: "Best for teams that need clearer dispatch, routing, coordination, or visibility across moving parts.",
    },
    "Intelligence Bridge": {
        works: "Built to turn complex logic into a product people can actually use, trust, and act on without needing to understand the underlying model behavior.",
        fallbackNeed: "Best for teams that want AI or automation to support real decisions without making the experience feel vague or risky.",
    },
    "Modernized UX": {
        works: "Built to make the product easier to trust, easier to understand, and more persuasive at the moment a client decides whether to move forward.",
        fallbackNeed: "Best for products that already exist but need stronger clarity, premium positioning, or a smoother path to conversion.",
    },
};

const getTopLanguages = (project: Project, count = 3) =>
    project.github_stats.languages.slice(0, count).map(cleanCopy);

const getDeliverySummary = (project: Project) => {
    const stack = formatList(getTopLanguages(project));
    return stack
        ? `${categoryNarratives[project.category].works} Core systems include ${stack}.`
        : categoryNarratives[project.category].works;
};

const getNeedSummary = (project: Project) => {
    const summary = getFirstSentence(project.challenge);
    return summary.length <= 170
        ? summary
        : categoryNarratives[project.category].fallbackNeed;
};

const formatCommitCount = (commits: number) =>
    commits >= 1000 ? `${(commits / 1000).toFixed(commits >= 10000 ? 0 : 1)}k` : `${commits}`;

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
    const { text: catText, accentBg: catAccentBg, accent: catAccent } = categoryColor[project.category] ?? {
        text: "text-[var(--cat-ux)]",
        accentBg: "bg-[var(--cat-ux-bg)]",
        accent: "var(--cat-ux)"
    };
    const cleanedDescription = cleanCopy(project.description);
    const deliverySummary = getDeliverySummary(project);
    const needSummary = getNeedSummary(project);
    const directionSummary = cleanCopy(project.proposal);
    const topLanguages = getTopLanguages(project);
    const secondarySignal = project.github_stats.stars
        ? { label: "Stars", value: `${project.github_stats.stars}`, icon: Star }
        : { label: "Status", value: "Live", icon: Globe };
    const SecondarySignalIcon = secondarySignal.icon;
    const mailSubject = `Project Inquiry: ${project.title}`;

    const steps = [
        { id: 1, label: "Product Overview" },
        { id: 2, label: "How It Works" },
        { id: 3, label: "Business Fit" }
    ];

    const handleNext = () => { if (activeStep < 3) setActiveStep(p => p + 1); };
    const handlePrev = () => { if (activeStep > 1) setActiveStep(p => p - 1); };

    // ─── MOBILE — Multiphasic Bottom Sheet ───────────────────────────────────
    if (isMobile) {
        return (
            <div className="fixed inset-0 z-[60] flex items-end justify-center safe-x safe-bottom">
                {/* Scrim — dark enough to signal modal depth in both modes */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Sheet — vibrancy-powered Liquid Glass */}
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex w-full max-w-xl flex-col overflow-hidden squircle-panel glass-regular overscroll-contain"
                    style={{
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        height: "min(92dvh, calc(100dvh - max(env(safe-area-inset-top), 0.75rem) - 0.5rem))",
                        maxHeight: "calc(100dvh - max(env(safe-area-inset-top), 0.75rem) - 0.5rem)",
                    }}
                >
                    {/* Drag handle */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 squircle-pill bg-[var(--text-ghost)]/30 z-50" />

                    {/* Sheet Header */}
                    <div className="px-5 pt-7 pb-4 flex items-center justify-between">
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
                    <div className="relative flex-1 overflow-hidden">
                        <AnimatePresence mode="wait">

                            {/* Step 1 — Live Screenshot */}
                            {activeStep === 1 && (
                                <motion.div
                                    key="m-step1"
                                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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
                                                className={`flex items-center gap-2 px-5 py-2.5 squircle-pill surface-chip ${catText} text-[10px] font-mono uppercase tracking-widest`}
                                            >
                                                View Live Site <ExternalLink size={12} />
                                            </a>
                                        </div>

                                        <div className="absolute bottom-8 left-6 right-6">
                                            <h4 className="text-3xl font-semibold text-white tracking-tighter mb-2">{project.title}</h4>
                                            <p className="text-white/70 text-base font-light leading-relaxed">{cleanedDescription}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2 — Architecture */}
                            {activeStep === 2 && (
                                <motion.div
                                    key="m-step2"
                                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute inset-0 px-5 flex flex-col justify-center space-y-7"
                                >
                                    <p className="text-[var(--text-muted)] text-xl font-light leading-relaxed">{deliverySummary}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-7 squircle-nav surface-card">
                                            <div className={`text-4xl font-light mb-1 tracking-tighter ${catText}`}>{formatCommitCount(project.github_stats.commits)}</div>
                                            <div className="text-[var(--text-ghost)] text-[10px] font-mono uppercase tracking-widest">Build Depth</div>
                                        </div>
                                        <div className="p-7 squircle-nav surface-card">
                                            <div className={`text-4xl font-light mb-1 tracking-tighter ${catText}`}>{project.github_stats.languages.length}</div>
                                            <div className="text-[var(--text-ghost)] text-[10px] font-mono uppercase tracking-widest">Core Systems</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3 — Impact */}
                            {activeStep === 3 && (
                                <motion.div
                                    key="m-step3"
                                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute inset-0 px-5 flex flex-col justify-center space-y-7"
                                >
                                    <div className="squircle p-7 surface-card">
                                        <h4 className="text-[10px] font-mono uppercase tracking-widest mb-3 text-[var(--text-ghost)]">Best When</h4>
                                        <p className="text-[var(--text-muted)] text-xl font-light leading-relaxed">{needSummary}</p>
                                    </div>
                                    <div className={`squircle p-7 surface-card`}>
                                        <h4 className={`text-[10px] font-mono uppercase tracking-widest mb-3 ${catText}`}>Recommended Direction</h4>
                                        <p className="text-[var(--text-muted)] text-xl font-light tracking-tight italic">
                                            "{directionSummary}"
                                        </p>
                                        <div className="mt-4 h-px w-full" style={{ background: `${catAccent}22` }} />
                                        <p className="mt-4 text-[11px] font-mono text-[var(--text-ghost)] leading-relaxed uppercase tracking-wider">
                                            Strategically built to solve the core business friction.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <a href={`https://${project.link}`} target="_blank"
                                            className="group flex items-center justify-between p-5 squircle-nav surface-card transition-colors duration-200">
                                            <div>
                                                <span className={`text-[10px] font-mono uppercase tracking-widest mb-0.5 block ${catText}`}>Live Product</span>
                                                <span className="text-[var(--text)] text-base font-medium">Open Live Site</span>
                                            </div>
                                            <ArrowUpRight size={20} className={`${catText} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`} />
                                        </a>
                                        <a href={`mailto:hello@dyrane.tech?subject=${encodeURIComponent(mailSubject)}`}
                                            className="group flex items-center justify-between p-5 squircle-nav surface-card transition-colors duration-200">
                                            <div>
                                                <span className="text-[10px] font-mono uppercase tracking-widest mb-0.5 block text-[var(--text-ghost)]">Next Step</span>
                                                <span className="text-[var(--text-dim)] text-base font-medium">Start a Conversation</span>
                                            </div>
                                            <Globe size={20} className="text-[var(--text-ghost)] group-hover:rotate-12 transition-transform" />
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Footer */}
                    <div 
                        className="mt-auto bg-[var(--surface-elevated)]/88 px-5 py-5"
                        style={{ boxShadow: `inset 0 1px 0 0 ${catAccent}22` }}
                    >
                        <div className="flex items-center justify-between">
                            {/* Progress dots */}
                            <div className="flex gap-2">
                                {steps.map(s => (
                                    <div
                                        key={s.id}
                                        className={`h-1 squircle-pill transition-all duration-500 ${activeStep === s.id ? `w-8 ${catAccentBg}` : 'w-2 bg-[var(--text-ghost)]/20'}`}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handlePrev}
                                    disabled={activeStep === 1}
                                    className={`p-3.5 squircle-icon glass-ultra-thin text-[var(--text)] transition-opacity duration-200 ${activeStep === 1 ? 'opacity-20' : 'opacity-100'}`}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={activeStep === 3}
                                    className={`px-7 py-3.5 squircle-pill bg-[var(--cta-bg)] text-[var(--cta-text)] font-semibold flex items-center gap-2 text-sm transition-colors duration-200 ${activeStep === 3 ? 'opacity-20' : 'opacity-100 hover:bg-[var(--cta-hover)]'}`}
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

            {/* Panel — vibrancy-powered Liquid Glass */}
            <div className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden squircle-panel glass-regular md:h-[700px] md:flex-row">

                {/* Sidebar */}
                <div 
                    className="flex w-full shrink-0 flex-col overflow-y-auto p-5 md:h-full md:w-72 md:p-6"
                    style={{ 
                        boxShadow: isMobile ? `inset 0 -1px 0 0 ${catAccent}22` : `inset -1px 0 0 0 ${catAccent}22`
                    }}
                >
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
                                className={`w-full text-left px-4 py-3 squircle-chip text-sm font-medium transition-all duration-300 relative overflow-hidden ${activeStep === step.id
                                    ? `text-[var(--text)] surface-chip`
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
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 squircle-pill ${catAccentBg}`} />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Repo stats */}
                    <div className="mt-auto">
                        <div className="squircle-nav p-4 surface-card space-y-3">
                            <div className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider ${catText} opacity-70`}>
                                <Github size={11} /> Delivery Signals
                            </div>
                            <div className="flex items-center justify-between text-[var(--text-dim)] text-xs font-mono">
                                <span className="flex items-center gap-1.5">
                                    <GitCommit size={13} className={catText} /> {formatCommitCount(project.github_stats.commits)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <SecondarySignalIcon size={13} className={catText} /> {secondarySignal.value}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {topLanguages.map(lang => (
                                    <span key={lang} className="squircle-chip surface-chip px-2 py-0.5 text-[9px] text-[var(--text-ghost)] font-mono uppercase tracking-wider">
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
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full flex flex-col"
                            >
                                {/* Step 1 — Screenshot */}
                                {activeStep === 1 && (
                                    <div className="flex flex-col h-full">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-xl text-[var(--text)] font-semibold tracking-tight">Product Overview</h3>
                                        </div>
                                        <div className="flex-1 relative squircle overflow-hidden bg-black shrink-0 min-h-[360px] shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
                                            <img
                                                src={screenshotUrl}
                                                alt={project.title}
                                                className={`w-full h-full object-cover object-top transition-all duration-700 ${imageLoaded ? 'opacity-90' : 'opacity-0'}`}
                                                onLoad={() => setImageLoaded(true)}
                                            />
                                            {!imageLoaded && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-elevated)]/75">
                                                    <Loader2 className={`w-6 h-6 animate-spin ${catText}`} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                                            <div className="absolute top-5 right-5">
                                                <a
                                                    href={`https://${project.link}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className={`flex items-center gap-2 px-5 py-2.5 squircle-pill surface-chip ${catText} text-[10px] font-mono uppercase tracking-widest transition-colors duration-200`}
                                                >
                                                    View Live Site <ExternalLink size={11} />
                                                </a>
                                            </div>

                                            <div className="absolute bottom-6 left-6 right-6">
                                                <p className="text-white/80 text-lg leading-relaxed font-light">{cleanedDescription}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveStep(2)}
                                            className="mt-4 self-start group flex items-center gap-2 text-[var(--text-ghost)] hover:text-[var(--text)] transition-colors duration-200 text-[10px] font-mono tracking-[0.2em] uppercase"
                                        >
                                            See How It Works <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {/* Step 2 — Architecture */}
                                {activeStep === 2 && (
                                    <div className="flex flex-col justify-center h-full space-y-6">
                                        <h3 className="text-xl text-[var(--text)] font-semibold tracking-tight">How It Works</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-center">
                                            <div className="space-y-5">
                                                <p className="text-[var(--text-muted)] text-base leading-relaxed font-light">{deliverySummary}</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="squircle-nav p-5 surface-card">
                                                        <div className={`text-3xl font-light mb-1 tracking-tighter tabular-nums ${catText}`}>
                                                            {formatCommitCount(project.github_stats.commits)}
                                                        </div>
                                                        <div className="text-[var(--text-ghost)] text-[10px] font-mono tracking-widest uppercase">Build Depth</div>
                                                    </div>
                                                    <div className="squircle-nav p-5 surface-card">
                                                        <div className={`text-3xl font-light mb-1 tracking-tighter ${catText}`}>{project.github_stats.languages.length}</div>
                                                        <div className="text-[var(--text-ghost)] text-[10px] font-mono tracking-widest uppercase">Core Systems</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ambient orb — no borders */}
                                            <div className="relative aspect-square squircle surface-card flex items-center justify-center group overflow-hidden">
                                                <div className={`absolute inset-0 opacity-[0.08] group-hover:opacity-[0.16] transition-opacity duration-700 pointer-events-none blur-3xl ${catAccentBg}`} />
                                                <Code className="w-16 h-16 md:w-20 md:h-20 text-[var(--text)] opacity-10 relative z-10 transition-opacity duration-500 group-hover:opacity-20" />
                                                {/* Depth rings — shadow-based, not border */}
                                                <div className="absolute inset-8 squircle shadow-[0_0_0_1px_rgba(255,255,255,0.04)] pointer-events-none" />
                                                <div className="absolute inset-16 squircle shadow-[0_0_0_1px_rgba(255,255,255,0.03)] pointer-events-none" />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveStep(3)}
                                            className="self-start group flex items-center gap-2 text-[var(--text-ghost)] hover:text-[var(--text)] transition-colors duration-200 text-[10px] font-mono tracking-[0.2em] uppercase"
                                        >
                                            See Business Fit <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {/* Step 3 — Impact */}
                                {activeStep === 3 && (
                                    <div className="max-w-2xl flex flex-col pt-4 pb-8">
                                        <h3 className="text-xl text-[var(--text)] font-semibold tracking-tight mb-6">Business Fit</h3>
                                        <div className="space-y-4 mb-10">
                                            <div className="squircle p-7 surface-card">
                                                <h4 className="text-[var(--text-ghost)] text-[10px] font-mono tracking-[0.2em] uppercase mb-4">Best When</h4>
                                                <p className="text-[var(--text-muted)] text-2xl leading-snug font-light tracking-tight">{needSummary}</p>
                                            </div>
                                            <div className="squircle p-8 surface-card" style={{ boxShadow: `inset 0 1px 0 0 ${catAccent}22` }}>
                                                <h4 className={`text-[10px] font-mono tracking-[0.2em] uppercase mb-4 ${catText}`}>Recommended Direction</h4>
                                                <p className="text-[var(--text-muted)] text-xl leading-relaxed font-light italic">
                                                    "{directionSummary}"
                                                </p>
                                                <div className="mt-6 h-px w-full" style={{ background: `${catAccent}11` }} />
                                                <p className="mt-4 text-[12px] font-mono text-[var(--text-ghost)] uppercase tracking-widest">
                                                    Engineering rationale: This architecture specifically addresses the {project.category.toLowerCase()} performance bottlenecks.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-10">
                                            <a
                                                href={`mailto:hello@dyrane.tech?subject=${encodeURIComponent(mailSubject)}`}
                                                className="group flex items-center gap-4 text-[var(--text)] transition-colors duration-200 hover:text-[var(--text)]"
                                            >
                                                <div>
                                                    <span className={`text-[10px] font-mono uppercase tracking-widest mb-0.5 block opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0 ${catText}`}>
                                                        Start a Conversation
                                                    </span>
                                                    <span className="text-xl font-semibold tracking-tight">Discuss This Kind of Project</span>
                                                </div>
                                                <div className="p-4 squircle-icon surface-chip transition-colors duration-200">
                                                    <ArrowUpRight size={22} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                                </div>
                                            </a>

                                            {/* Depth separator — shadow not border */}
                                            <div className="hidden sm:block h-10 w-px bg-gradient-to-b from-transparent via-[var(--text-ghost)]/20 to-transparent" />

                                            <a
                                                href={`https://${project.link}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="group flex items-center gap-4 text-[var(--text-dim)] hover:text-[var(--text)] transition-colors duration-200"
                                            >
                                                <div>
                                                    <span className="text-[10px] font-mono uppercase tracking-widest mb-0.5 block opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0 text-[var(--text-ghost)]">
                                                        Visit Live Site
                                                    </span>
                                                    <span className="text-xl font-semibold tracking-tight">Open Live Product</span>
                                                </div>
                                                <div className="p-4 squircle-icon surface-chip transition-colors duration-200">
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
