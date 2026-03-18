import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface CommandCenterProps {
    visible?: boolean;
}

export const CommandCenter = ({ visible = true }: CommandCenterProps) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed hidden md:block bottom-8 left-0 w-full z-50 px-6"
                >
                    {/* Glass bar — Liquid Glass regular tier */}
                    <div className="max-w-7xl mx-auto">
                        <div className="
                            squircle-nav
                            flex items-center justify-between
                            px-5 py-3
                            glass-ultra
                            shadow-[0_8px_32px_rgba(0,0,0,0.18)]
                        ">
                            {/* Brand Identity */}
                            <div className="flex items-center gap-3">
                                {/* Wordmark accent bar — squircle-chip proportioned */}
                                <div className="w-[3px] h-6 bg-[var(--text)] squircle-pill opacity-90" />
                                <span className="text-[var(--text)] text-base tracking-tight font-semibold">
                                    Dyrane{" "}
                                    <span className="text-[var(--text-dim)] font-normal">
                                        Intelligence Collective
                                    </span>
                                </span>
                            </div>

                            {/* Nav + Status */}
                            <div className="flex items-center gap-5">
                                <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[var(--text-muted)]">
                                    <a
                                        href="#logistics-engine"
                                        className="hover:text-[var(--text)] transition-colors duration-200"
                                    >
                                        Logistics
                                    </a>
                                    <a
                                        href="#intelligence-bridge"
                                        className="hover:text-[var(--text)] transition-colors duration-200"
                                    >
                                        Intelligence
                                    </a>
                                    <a
                                        href="#modernized-ux"
                                        className="hover:text-[var(--text)] transition-colors duration-200"
                                    >
                                        UX
                                    </a>
                                </nav>

                                {/* Hire Me CTA */}
                                <a
                                    href="mailto:hello@dyrane.tech?subject=Project%20Inquiry"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        hidden sm:inline-flex items-center gap-1.5
                                        px-4 py-1.5 squircle-pill
                                        bg-[var(--cta-bg)] text-[var(--cta-text)]
                                        text-[13px] font-medium
                                        hover:opacity-90 transition-all duration-300
                                        hover:shadow-[0_0_20px_var(--glow-color)]
                                    "
                                >
                                    Hire Me <ArrowUpRight size={13} />
                                </a>

                                {/* Live status pill */}
                                <div className="flex items-center gap-2 px-3 py-1.5 squircle-pill glass-ultra-thin">
                                    <div className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full squircle-pill bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex squircle-pill h-1.5 w-1.5 bg-emerald-500" />
                                    </div>
                                    <span className="hidden lg:block text-[11px] text-emerald-400/90 font-mono tracking-widest uppercase">
                                        Online
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
