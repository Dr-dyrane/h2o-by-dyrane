
import { ArrowUpRight } from "lucide-react";

export const CommandCenter = () => {
    return (
        <div className="fixed top-0 left-0 w-full z-50 px-6 py-4 bg-[#0D0D0D]/5 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Brand Identity */}
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-white/90 rounded-sm" />
                    <h1 className="text-white font-sans text-lg tracking-tight font-medium">
                        Dyrane <span className="text-white/40">Intelligence Collective</span>
                    </h1>
                </div>

                {/* Navigation & Status */}
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
                        <a href="#logistics-engine" className="hover:text-white transition-colors cursor-pointer">
                            iVisit Ecosystem
                        </a>
                        <a href="#intelligence-bridge" className="hover:text-white transition-colors cursor-pointer">
                            Intelligence Bridges
                        </a>
                        <a href="#modernized-ux" className="hover:text-white transition-colors cursor-pointer">
                            Modernized UX
                        </a>
                    </div>

                    {/* CTA Button */}
                    <a
                        href="https://wa.me/19517284218?text=Hi%20Dr.%20Dyrane,%20I'm%20interested%20in%20working%20with%20you!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105"
                    >
                        Hire Me <ArrowUpRight size={14} />
                    </a>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border-white/5">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-xs text-emerald-400/90 font-mono tracking-wide uppercase">
                            Online
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
