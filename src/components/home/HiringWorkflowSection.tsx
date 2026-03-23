import { useState } from "react";
import { Code, Globe, Layers, Zap } from "@/components/icons/lucide";
import { hiringFlow, type HiringStageId, type HiringTool } from "@/content/homepage";

/**
 * Converts a six-digit hex string into an rgba() color string.
 */
const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const stageIcons: Record<HiringStageId, typeof Layers> = {
  direction: Layers,
  design: Zap,
  build: Code,
  ship: Globe,
};

/**
 * Compact color utility for turning simple-icon hex values into translucent badge backgrounds.
 */
const HiringToolBadge = ({ tool }: { tool: HiringTool }) => (
  <div className="flex items-center gap-2 squircle-chip surface-chip px-3 py-2.5">
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
      style={{
        background: hexToRgba(tool.logo.hex, 0.12),
        color: `#${tool.logo.hex}`,
      }}
    >
      {tool.logo.path ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path
            clipRule={tool.logo.clipRule}
            d={tool.logo.path}
            fillRule={tool.logo.fillRule}
          />
        </svg>
      ) : tool.logo.glyph ? (
        <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.08em]">
          {tool.logo.glyph}
        </span>
      ) : null}
    </div>
    <span className="min-w-0 text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--text-dim)]">
      {tool.label}
    </span>
  </div>
);

/**
 * Interactive workflow section that explains end-to-end ownership for hiring teams.
 */
export const HiringWorkflowSection = () => {
  const [activeHiringStage, setActiveHiringStage] = useState(0);
  const currentHiringStage = hiringFlow[activeHiringStage];
  const CurrentHiringIcon = stageIcons[currentHiringStage.id];

  return (
    <section className="w-full px-6 md:mb-20 md:px-6">
      <div className="relative overflow-hidden squircle-panel glass-regular p-8 md:p-8">
        <div className="pointer-events-none absolute -right-12 top-0 h-44 w-44 rounded-full bg-[var(--cat-ux-bg)] blur-[56px]" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-[var(--cat-logistics-bg)] blur-[48px]" />

        <div className="relative">
          <div className="mb-14 space-y-6">
            <p className="text-[11px] font-mono uppercase tracking-[0.4em] text-[var(--cat-ux)] opacity-80">
              Workflow
            </p>
            <h2 className="text-5xl font-light tracking-tight text-[var(--text)] sm:text-6xl md:text-7xl lg:text-8xl">
              From concept to production.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {hiringFlow.map((stage, index) => {
              const StageIcon = stageIcons[stage.id];
              const isActive = activeHiringStage === index;

              return (
                <button
                  key={stage.title}
                  type="button"
                  onClick={() => setActiveHiringStage(index)}
                  aria-pressed={isActive}
                  className="squircle-panel surface-card p-5 text-left transition-all duration-250 hover:-translate-y-0.5"
                  style={{
                    background: isActive ? hexToRgba(stage.tools[0].logo.hex, 0.08) : undefined,
                    boxShadow: isActive
                      ? `inset 0 1px 0 0 ${stage.accent}55, 0 18px 44px -32px ${stage.accent}66`
                      : `inset 0 1px 0 0 ${stage.accent}33, var(--surface-shadow-tight)`,
                    borderRadius: undefined,
                  }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center squircle-icon surface-chip"
                      style={{
                        color: stage.accent,
                        background: isActive ? hexToRgba(stage.tools[0].logo.hex, 0.12) : undefined,
                      }}
                    >
                      <StageIcon size={18} />
                    </div>
                    <div>
                      <p
                        className="text-[10px] font-mono uppercase tracking-[0.16em]"
                        style={{ color: stage.accent }}
                      >
                        0{index + 1} {stage.title}
                      </p>
                      <h3 className="text-lg font-medium tracking-tight text-[var(--text)]">
                        {stage.heading}
                      </h3>
                    </div>
                  </div>

                  <p className="line-clamp-3 text-sm font-light leading-relaxed text-[var(--text-muted)]">
                    {stage.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {stage.tools.slice(0, 3).map((tool) => (
                      <span
                        key={tool.label}
                        className="squircle-chip surface-chip px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--text-dim)]"
                      >
                        {tool.label}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div
            className="mt-6 grid gap-6 squircle-panel surface-card p-6 md:grid-cols-[0.9fr_1.1fr] md:p-7"
            style={{
              boxShadow: `inset 0 1px 0 0 ${currentHiringStage.accent}44, var(--surface-shadow-tight)`,
              borderRadius: undefined,
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center squircle-icon surface-chip"
                  style={{
                    color: currentHiringStage.accent,
                    background: hexToRgba(currentHiringStage.tools[0].logo.hex, 0.12),
                  }}
                >
                  <CurrentHiringIcon size={18} />
                </div>
                <div>
                  <p
                    className="text-[10px] font-mono uppercase tracking-[0.16em]"
                    style={{ color: currentHiringStage.accent }}
                  >
                    Active stage
                  </p>
                  <h3 className="text-2xl font-medium tracking-tight text-[var(--text)]">
                    {currentHiringStage.heading}
                  </h3>
                </div>
              </div>

              <p className="max-w-xl text-base font-light leading-relaxed text-[var(--text-muted)]">
                {currentHiringStage.description}
              </p>

              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-dim)]">
                End-to-end ownership means the tool choice stays in service of the product,
                not the other way around.
              </p>
            </div>

            <div>
              <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--text-dim)]">
                Selected stack
              </p>
              <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
                {currentHiringStage.tools.map((tool) => (
                  <HiringToolBadge
                    key={tool.label}
                    tool={tool}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
