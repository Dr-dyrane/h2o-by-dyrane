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
import { useEffect, useState, type ReactNode } from "react";
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

const getTopLanguages = (project: Project, count = 3) =>
    project.github_stats.languages.slice(0, count).map(cleanCopy);

const getProblemSummary = (project: Project) => {
    const summary = cleanCopy(project.challenge);
    return summary || getFirstSentence(project.description);
};

const getSolutionSummary = (project: Project) => cleanCopy(project.architecture);

const getValueSummary = (project: Project) => cleanCopy(project.proposal);

const getProofSummary = (project: Project) => {
    const stack = formatList(getTopLanguages(project));
    const baseProof = project.github_stats.stars
        ? `${project.github_stats.commits.toLocaleString()} commits, ${project.github_stats.stars} public stars, and a live deployment`
        : `${project.github_stats.commits.toLocaleString()} commits and a live deployment`;

    return stack ? `${baseProof}. Built with ${stack}.` : `${baseProof}.`;
};

type CaseStudyDetails = NonNullable<Project["caseStudy"]>;

const fallbackCaseStudyByCategory: Record<Project["category"], Pick<CaseStudyDetails, "users" | "surfaces">> = {
    "Logistics Engine": {
        users: "Operations teams coordinating work across moving parts",
        surfaces: "Operational dashboard and task-driven web workflows",
    },
    "Intelligence Bridge": {
        users: "Teams packaging AI or automation into real decisions",
        surfaces: "Structured intake, output, and decision-support workflows",
    },
    "Modernized UX": {
        users: "Buyers or users deciding whether to trust the product",
        surfaces: "Marketing, product presentation, and conversion flows",
    },
};

const getCaseStudy = (project: Project): CaseStudyDetails => {
    if (project.caseStudy) {
        return project.caseStudy;
    }

    const fallback = fallbackCaseStudyByCategory[project.category];

    return {
        role: "Product strategy, design, and implementation",
        users: fallback.users,
        surfaces: fallback.surfaces,
        constraints: [
            getFirstSentence(project.challenge),
            "The product had to stay understandable while handling technical complexity.",
            "The final output needed to ship as a real product, not a concept."
        ],
        decisions: [
            {
                title: "Clarify the main user decision",
                detail: getProblemSummary(project),
            },
            {
                title: "Structure the workflow around that decision",
                detail: getSolutionSummary(project),
            },
            {
                title: "Tie the product back to business value",
                detail: getValueSummary(project),
            },
        ],
        proofPoints: [getProofSummary(project)],
        outcomes: [
            {
                label: "Status",
                value: "Live",
                detail: "Presented as a working product, not just design exploration.",
            },
            {
                label: "Build depth",
                value: formatCommitCount(project.github_stats.commits),
                detail: "Commit history shows real iteration across the product.",
            },
            {
                label: "Outcome",
                value: "Clearer delivery",
                detail: "The product was shaped to make the value easier to understand and act on.",
            },
        ],
    };
};

const formatCommitCount = (commits: number) =>
    commits >= 1000 ? `${(commits / 1000).toFixed(commits >= 10000 ? 0 : 1)}k` : `${commits}`;

const OverlayCard = ({
    eyebrow,
    children,
    accent,
}: {
    eyebrow: string;
    children: ReactNode;
    accent?: string;
}) => (
    <div
        className="squircle-nav p-5 surface-card"
        style={accent ? { boxShadow: `inset 0 1px 0 0 ${accent}22` } : undefined}
    >
        <div
            className="mb-3 text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--text-ghost)]"
            style={accent ? { color: accent } : undefined}
        >
            {eyebrow}
        </div>
        {children}
    </div>
);

const MetricCard = ({
    label,
    value,
    detail,
    accentClass,
}: {
    label: string;
    value: string;
    detail: string;
    accentClass: string;
}) => (
    <div className="squircle-nav p-5 surface-card">
        <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--text-ghost)]">
            {label}
        </div>
        <div className={`text-2xl font-light tracking-tight ${accentClass}`}>{value}</div>
        <p className="mt-3 text-sm font-light leading-relaxed text-[var(--text-muted)]">{detail}</p>
    </div>
);

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
    const problemSummary = getProblemSummary(project);
    const solutionSummary = getSolutionSummary(project);
    const valueSummary = getValueSummary(project);
    const proofSummary = getProofSummary(project);
    const caseStudy = getCaseStudy(project);
    const topLanguages = getTopLanguages(project);
    const secondarySignal = project.github_stats.stars
        ? { label: "Stars", value: `${project.github_stats.stars}`, icon: Star }
        : { label: "Status", value: "Live", icon: Globe };
    const SecondarySignalIcon = secondarySignal.icon;
    const mailSubject = `Project Inquiry: ${project.title}`;

    const steps = [
        { id: 1, label: "Problem" },
        { id: 2, label: "Solution" },
        { id: 3, label: "Proof" }
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
                                                Open Live Site <ExternalLink size={12} />
                                            </a>
                                        </div>

                                        <div className="absolute bottom-8 left-6 right-6">
                                            <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
                                                The problem
                                            </p>
                                            <h4 className="text-3xl font-semibold text-white tracking-tighter mb-2">{project.title}</h4>
                                            <p className="text-white/70 text-base font-light leading-relaxed">{problemSummary}</p>
                                            <p className="mt-3 text-sm font-light leading-relaxed text-white/55">{cleanedDescription}</p>
                                            <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.18em] text-white/45">
                                                Role
                                            </p>
                                            <p className="text-sm font-light leading-relaxed text-white/60">{caseStudy.role}</p>
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
                                    className="absolute inset-0 overflow-y-auto px-5 py-2 pb-8"
                                >
                                    <div className="space-y-6">
                                        <p className="text-[var(--text-muted)] text-xl font-light leading-relaxed">{solutionSummary}</p>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="p-5 squircle-nav surface-card">
                                                <div className="mb-1 text-[10px] font-mono uppercase tracking-widest text-[var(--text-ghost)]">Role</div>
                                                <div className="text-sm font-light leading-relaxed text-[var(--text-muted)]">{caseStudy.role}</div>
                                            </div>
                                            <div className="p-5 squircle-nav surface-card">
                                                <div className="mb-1 text-[10px] font-mono uppercase tracking-widest text-[var(--text-ghost)]">Users</div>
                                                <div className="text-sm font-light leading-relaxed text-[var(--text-muted)]">{caseStudy.users}</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-7 squircle-nav surface-card">
                                                <div className={`text-4xl font-light mb-1 tracking-tighter ${catText}`}>{formatCommitCount(project.github_stats.commits)}</div>
                                                <div className="text-[var(--text-ghost)] text-[10px] font-mono uppercase tracking-widest">Build History</div>
                                            </div>
                                            <div className="p-7 squircle-nav surface-card">
                                                <div className={`text-4xl font-light mb-1 tracking-tighter ${catText}`}>{project.github_stats.languages.length}</div>
                                                <div className="text-[var(--text-ghost)] text-[10px] font-mono uppercase tracking-widest">Core Tools</div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {caseStudy.decisions.map((decision) => (
                                                <div key={decision.title} className="p-5 squircle-nav surface-card">
                                                    <div className="mb-2 text-[10px] font-mono uppercase tracking-widest text-[var(--text-ghost)]">
                                                        {decision.title}
                                                    </div>
                                                    <div className="text-sm font-light leading-relaxed text-[var(--text-muted)]">
                                                        {decision.detail}
                                                    </div>
                                                </div>
                                            ))}
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
                                    className="absolute inset-0 overflow-y-auto px-5 py-2 pb-8"
                                >
                                    <div className="space-y-6">
                                        <div className="squircle p-7 surface-card">
                                            <h4 className="text-[10px] font-mono uppercase tracking-widest mb-3 text-[var(--text-ghost)]">Proof summary</h4>
                                            <p className="text-[var(--text-muted)] text-xl font-light leading-relaxed">{proofSummary}</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {caseStudy.outcomes.map((outcome) => (
                                                <div key={outcome.label} className="p-5 squircle-nav surface-card">
                                                    <div className="mb-1 text-[10px] font-mono uppercase tracking-widest text-[var(--text-ghost)]">{outcome.label}</div>
                                                    <div className={`text-xl font-light tracking-tight ${catText}`}>{outcome.value}</div>
                                                    <div className="mt-2 text-sm font-light leading-relaxed text-[var(--text-muted)]">{outcome.detail}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`squircle p-7 surface-card`}>
                                            <h4 className={`text-[10px] font-mono uppercase tracking-widest mb-3 ${catText}`}>Evidence</h4>
                                            <div className="space-y-3">
                                                {caseStudy.proofPoints.map((point) => (
                                                    <p key={point} className="text-sm font-light leading-relaxed text-[var(--text-muted)]">
                                                        {point}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={`squircle p-7 surface-card`}>
                                            <h4 className={`text-[10px] font-mono uppercase tracking-widest mb-3 ${catText}`}>Business value</h4>
                                            <p className="text-[var(--text-muted)] text-lg font-light leading-relaxed">
                                                {valueSummary}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex flex-col gap-3">
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
                                                <span className="text-[var(--text-dim)] text-base font-medium">Start a Project</span>
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
                                <Github size={11} /> Proof
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
                                            <h3 className="text-xl text-[var(--text)] font-semibold tracking-tight">Problem</h3>
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
                                                    Open Live Site <ExternalLink size={11} />
                                                </a>
                                            </div>

                                            <div className="absolute bottom-6 left-6 right-6">
                                                <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">The problem</p>
                                                <p className="text-white/80 text-lg leading-relaxed font-light">{problemSummary}</p>
                                                <p className="mt-3 text-sm leading-relaxed font-light text-white/55">{cleanedDescription}</p>
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <span className="squircle-chip bg-white/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-white/70">
                                                        {caseStudy.role}
                                                    </span>
                                                    <span className="squircle-chip bg-white/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-white/70">
                                                        {caseStudy.surfaces}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveStep(2)}
                                            className="mt-4 self-start group flex items-center gap-2 text-[var(--text-ghost)] hover:text-[var(--text)] transition-colors duration-200 text-[10px] font-mono tracking-[0.2em] uppercase"
                                        >
                                            See The Solution <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {/* Step 2 — Architecture */}
                                {activeStep === 2 && (
                                    <div className="flex flex-col justify-center h-full space-y-6">
                                        <h3 className="text-xl text-[var(--text)] font-semibold tracking-tight">Solution</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-center">
                                            <div className="space-y-5">
                                                <p className="text-[var(--text-muted)] text-base leading-relaxed font-light">{solutionSummary}</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="squircle-nav p-5 surface-card">
                                                        <div className={`text-3xl font-light mb-1 tracking-tighter tabular-nums ${catText}`}>
                                                            {formatCommitCount(project.github_stats.commits)}
                                                        </div>
                                                        <div className="text-[var(--text-ghost)] text-[10px] font-mono tracking-widest uppercase">Build History</div>
                                                    </div>
                                                    <div className="squircle-nav p-5 surface-card">
                                                        <div className={`text-3xl font-light mb-1 tracking-tighter ${catText}`}>{project.github_stats.languages.length}</div>
                                                        <div className="text-[var(--text-ghost)] text-[10px] font-mono tracking-widest uppercase">Core Tools</div>
                                                    </div>
                                                </div>
                                                <div className="grid gap-4">
                                                    <OverlayCard eyebrow="Role">
                                                        <p className="text-sm font-light leading-relaxed text-[var(--text-muted)]">
                                                            {caseStudy.role}
                                                        </p>
                                                    </OverlayCard>
                                                    <OverlayCard eyebrow="Users">
                                                        <p className="text-sm font-light leading-relaxed text-[var(--text-muted)]">
                                                            {caseStudy.users}
                                                        </p>
                                                    </OverlayCard>
                                                    <OverlayCard eyebrow="Constraints" accent={catAccent}>
                                                        <div className="space-y-3">
                                                            {caseStudy.constraints.map((constraint) => (
                                                                <p key={constraint} className="text-sm font-light leading-relaxed text-[var(--text-muted)]">
                                                                    {constraint}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </OverlayCard>
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
                                            See The Proof <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                {/* Step 3 — Impact */}
                                {activeStep === 3 && (
                                    <div className="max-w-2xl flex flex-col pt-4 pb-8">
                                        <h3 className="text-xl text-[var(--text)] font-semibold tracking-tight mb-6">Proof</h3>
                                        <div className="space-y-4 mb-10">
                                            <div className="squircle p-7 surface-card">
                                                <h4 className="text-[var(--text-ghost)] text-[10px] font-mono tracking-[0.2em] uppercase mb-4">Proof summary</h4>
                                                <p className="text-[var(--text-muted)] text-2xl leading-snug font-light tracking-tight">{proofSummary}</p>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-3">
                                                {caseStudy.outcomes.map((outcome) => (
                                                    <MetricCard
                                                        key={outcome.label}
                                                        label={outcome.label}
                                                        value={outcome.value}
                                                        detail={outcome.detail}
                                                        accentClass={catText}
                                                    />
                                                ))}
                                            </div>
                                            <div className="squircle p-8 surface-card" style={{ boxShadow: `inset 0 1px 0 0 ${catAccent}22` }}>
                                                <h4 className={`text-[10px] font-mono tracking-[0.2em] uppercase mb-4 ${catText}`}>Evidence</h4>
                                                <div className="space-y-3">
                                                    {caseStudy.proofPoints.map((point) => (
                                                        <p key={point} className="text-sm font-light leading-relaxed text-[var(--text-muted)]">
                                                            {point}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="squircle p-8 surface-card" style={{ boxShadow: `inset 0 1px 0 0 ${catAccent}22` }}>
                                                <h4 className={`text-[10px] font-mono tracking-[0.2em] uppercase mb-4 ${catText}`}>Business value</h4>
                                                <p className="text-[var(--text-muted)] text-xl leading-relaxed font-light">
                                                    {valueSummary}
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
                                                        Next Step
                                                    </span>
                                                    <span className="text-xl font-semibold tracking-tight">Start a Project</span>
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
                                                        Live Product
                                                    </span>
                                                    <span className="text-xl font-semibold tracking-tight">Open Live Site</span>
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
