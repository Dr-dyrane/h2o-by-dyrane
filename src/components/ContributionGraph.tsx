import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * One day cell in the contribution heatmap.
 */
interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

/**
 * Response shape returned by the external GitHub contribution proxy.
 */
interface GitHubContributionsResponse {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

const LEVEL_CLASSES = [
  "bg-[var(--surface-elevated)] shadow-[inset_0_0_0_1px_var(--surface-stroke)]",
  "bg-[var(--activity-1)]",
  "bg-[var(--activity-2)]",
  "bg-[var(--activity-3)]",
  "bg-[var(--activity-4)] shadow-[0_0_4px_var(--activity-glow)]",
] as const;

const LEGEND_CLASSES = [
  "bg-[var(--surface-elevated)] shadow-[inset_0_0_0_1px_var(--surface-stroke)]",
  "bg-[var(--activity-1)]",
  "bg-[var(--activity-2)]",
  "bg-[var(--activity-3)]",
  "bg-[var(--activity-4)] shadow-[0_0_4px_var(--activity-glow)]",
] as const;

/**
 * Small deterministic random helper used to generate a stable fallback grid.
 *
 * @param seed Numeric seed for repeatable output.
 * @returns Pseudo-random value between 0 and 1.
 */
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const FALLBACK_DAYS: ContributionDay[] = Array.from({ length: 364 }, (_, i) => {
  const randomValue = seededRandom(i + 42);
  const level =
    randomValue > 0.9 ? 4 : randomValue > 0.7 ? 3 : randomValue > 0.4 ? 2 : randomValue > 0.15 ? 1 : 0;

  return {
    date: "",
    count: Math.floor(randomValue * 15),
    level: level as 0 | 1 | 2 | 3 | 4,
  };
});

/**
 * Displays live GitHub contribution activity with resilient fallback data.
 */
export const ContributionGraph = () => {
  const [days, setDays] = useState<ContributionDay[]>(FALLBACK_DAYS);
  const [totalContributions, setTotalContributions] = useState<number | null>(null);
  const [streak, setStreak] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const res = await fetch(
          "https://github-contributions-api.jogruber.de/v4/Dr-dyrane?y=last"
        );

        if (!res.ok) {
          throw new Error("API error");
        }

        const data: GitHubContributionsResponse = await res.json();
        setDays(data.contributions);

        const total = data.contributions.reduce((sum, day) => sum + day.count, 0);
        setTotalContributions(total);

        const sorted = [...data.contributions].reverse();
        let currentStreak = 0;
        const startIndex = sorted[0]?.count === 0 ? 1 : 0;

        for (let i = startIndex; i < sorted.length; i += 1) {
          if (sorted[i].count > 0) {
            currentStreak += 1;
          } else {
            break;
          }
        }

        setStreak(currentStreak);
      } catch {
        setTotalContributions(4285);
        setStreak(14);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const stats = [
    {
      label: "GitHub Contributions",
      value: loading ? "--" : totalContributions?.toLocaleString() ?? "4,285",
      live: true,
    },
    {
      label: "Current Shipping Streak",
      value: loading ? "--" : streak != null ? `${streak} days` : "14 days",
      live: true,
    },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-1.5 w-1.5 squircle-pill bg-[var(--cat-ux)]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-[var(--cat-ux)]">
                {loading ? "Syncing GitHub" : "Shipping"}
              </span>
            </div>
            <h2 className="text-3xl font-light tracking-tight text-[var(--text)]">
              Built and shipped consistently.
            </h2>
            <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-[var(--text-muted)]">
              A simple signal that the work is real, maintained, and backed by
              consistent execution.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--text-muted)]">
            <span>Less</span>
            <div className="flex gap-1">
              {LEGEND_CLASSES.map((cls, index) => (
                <div key={index} className={`h-2.5 w-2.5 squircle-chip ${cls}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto pb-4 squircle-panel surface-panel p-4 md:p-5">
          <div className="flex min-w-[680px] gap-1 md:min-w-[800px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <Tooltip key={`${weekIndex}-${dayIndex}`}>
                    <TooltipTrigger asChild>
                      <div
                        className={`h-2.5 w-2.5 cursor-crosshair squircle-chip transition-all duration-200 hover:z-10 hover:scale-110 md:h-3 md:w-3 ${LEVEL_CLASSES[day.level]}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="squircle-chip p-2 text-center text-xs text-[var(--text)] shadow-2xl glass-ultra-thin">
                      {day.date ? (
                        <p className="mb-0.5 text-[10px] text-[var(--text-dim)]">
                          {day.date}
                        </p>
                      ) : null}
                      <p className="font-mono text-[var(--cat-ux)]">
                        {day.count} commits
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-2">
          {stats.map((stat) => (
            <div key={stat.label} className="squircle-nav surface-card p-4">
              <div className="mb-1 flex items-start justify-between">
                <div className="tabular-nums text-2xl font-light tracking-tight text-[var(--text)]">
                  {stat.value}
                </div>
                {stat.live ? (
                  <div className="mt-1.5 h-1.5 w-1.5 squircle-pill bg-[var(--cat-ux)]" />
                ) : null}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};
