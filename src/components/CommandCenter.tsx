
import { ArrowUpRight } from "lucide-react";

export const CommandCenter = () => {
    return (
        <div className="fixed top-0 left-0 w-full z-50 px-6 py-4 bg-[var(--surface)]/5 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Brand Identity */}
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-[var(--text)] rounded-sm opacity-90" />
                    <h1 className="text-[var(--text)] font-sans text-lg tracking-tight font-medium">
                        Dyrane <span className="text-[var(--text-dim)]">Intelligence Collective</span>
                    </h1>
                </div>

                {/* Navigation & Status */}
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-muted)]">
                        <a href="#logistics-engine" className="hover:text-[var(--text)] transition-colors cursor-pointer">
                            iVisit Ecosystem
                        </a>
                        <a href="#intelligence-bridge" className="hover:text-[var(--text)] transition-colors cursor-pointer">
                            Intelligence Bridges
                        </a>
                        <a href="#modernized-ux" className="hover:text-[var(--text)] transition-colors cursor-pointer">
                            Modernized UX
                        </a>
                    </div>

                    {/* CTA Button */}
                    <a
                        href="mailto:hello@dyrane.tech?subject=Project%20Inquiry"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--cta-bg)] text-[var(--cta-text)] text-sm font-medium rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105"
                    >
                        Hire Me <ArrowUpRight size={14} />
                    </a>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-card)] backdrop-blur-md">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="hidden lg:block text-xs text-emerald-400/90 font-mono tracking-wide uppercase">
                            Online
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
