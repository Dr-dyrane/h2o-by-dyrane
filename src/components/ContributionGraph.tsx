import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Simple seeded random for deterministic contribution data
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export const ContributionGraph = () => {
    const weeks = 52;
    const days = 7;

    const getIntensity = (seed: number) => {
        const rand = seededRandom(seed);
        if (rand > 0.9) return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]";
        if (rand > 0.7) return "bg-emerald-500/80";
        if (rand > 0.4) return "bg-emerald-600/40";
        return "bg-[var(--surface-card)]";
    };

    const getCommitCount = (seed: number) =>
        Math.floor(seededRandom(seed + 999) * 15);

    const stats = [
        { label: "Total Contributions", value: "4,285" },
        { label: "Current Streak",      value: "14 Days" },
        { label: "Code Review Rate",    value: "98%" },
        { label: "System Uptime",       value: "99.99%" },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1.5 w-1.5 squircle-pill bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-400 text-[11px] font-mono uppercase tracking-[0.15em]">
                            Velocity Matrix
                        </span>
                    </div>
                    <h2 className="text-3xl text-[var(--text)] font-light tracking-tight">Engineering DNA</h2>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 text-[11px] text-[var(--text-dim)] font-mono">
                    <span>Less</span>
                    <div className="flex gap-1">
                        {[
                            "bg-[var(--surface-card)]",
                            "bg-emerald-600/40",
                            "bg-emerald-500/80",
                            "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]",
                        ].map((cls, i) => (
                            <div key={i} className={`w-2.5 h-2.5 squircle-chip ${cls}`} />
                        ))}
                    </div>
                    <span>More</span>
                </div>
            </div>

            {/* Graph */}
            <div className="w-full overflow-x-auto pb-4 squircle p-5 glass-ultra-thin">
                <div className="min-w-[800px] flex gap-1">
                    {Array.from({ length: weeks }).map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {Array.from({ length: days }).map((_, dayIndex) => {
                                const seed = weekIndex * 7 + dayIndex + 42;
                                return (
                                    <Tooltip key={`${weekIndex}-${dayIndex}`}>
                                        <TooltipTrigger asChild>
                                            <div
                                                className={`w-3 h-3 squircle-chip transition-all duration-300 hover:scale-125 hover:z-10 cursor-crosshair ${getIntensity(seed)}`}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="squircle-chip bg-[var(--surface-card)] text-[var(--text)] text-xs text-center p-2">
                                            <p className="text-[var(--text-dim)] text-[10px] mb-0.5">Intelligence Deployed</p>
                                            <p className="font-mono text-emerald-400">{getCommitCount(seed)} Commits</p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats — depth-separated, no border */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map(stat => (
                    <div key={stat.label} className="squircle-nav p-4 glass-ultra-thin">
                        <div className="text-2xl text-[var(--text)] font-light tracking-tight tabular-nums">
                            {stat.value}
                        </div>
                        <div className="text-[var(--text-dim)] text-[10px] uppercase tracking-[0.12em] font-mono mt-1.5">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
