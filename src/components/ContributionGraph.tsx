import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const ContributionGraph = () => {
    // Generate mock contribution data (52 weeks x 7 days)
    const weeks = 52;
    const days = 7;

    const getIntensity = () => {
        const rand = Math.random();
        if (rand > 0.9) return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"; // High
        if (rand > 0.7) return "bg-emerald-500/80"; // Medium
        if (rand > 0.4) return "bg-emerald-600/40"; // Low
        return "bg-white/5"; // None
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-20 border-b border-white/5">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest">
                            Velocity Matrix
                        </span>
                    </div>
                    <h2 className="text-3xl text-white font-light">Engineering DNA</h2>
                </div>

                <div className="flex items-center gap-4 text-xs text-white/40 font-mono">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-sm bg-white/5" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600/40" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80" />
                        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="w-full overflow-x-auto pb-4 scrollbar-thin">
                <div className="min-w-[800px] flex gap-1">
                    {Array.from({ length: weeks }).map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {Array.from({ length: days }).map((_, dayIndex) => {
                                const intensityClass = getIntensity();
                                return (
                                    <Tooltip key={`${weekIndex}-${dayIndex}`}>
                                        <TooltipTrigger asChild>
                                            <div
                                                className={`w-3 h-3 rounded-[2px] transition-all duration-300 hover:scale-125 hover:z-10 cursor-crosshair ${intensityClass}`}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-dyrane-black border border-white/10 text-white/90 text-xs text-center p-2 mb-2">
                                            <p>Intelligence Deployed</p>
                                            <p className="font-mono text-emerald-400">
                                                {Math.floor(Math.random() * 15)} Commits
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                    {[
                        { label: "Total Contributions", value: "4,285" },
                        { label: "Current Streak", value: "14 Days" },
                        { label: "Code Review Rate", value: "98%" },
                        { label: "System Uptime", value: "99.99%" },
                    ].map(stat => (
                        <div key={stat.label}>
                            <div className="text-2xl text-white font-light tracking-tight">{stat.value}</div>
                            <div className="text-white/40 text-xs uppercase tracking-wider mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
