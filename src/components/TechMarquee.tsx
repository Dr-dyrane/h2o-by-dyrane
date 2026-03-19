// ─── Tech Marquee — seamless scrolling skills strip ──────────────────────────
// Demonstrates: layout skill, CSS animation, semantic grouping
// Doubles the items array so the loop is invisible when it resets.

const TECH_STACK = [
    { label: "React",          type: "framework" },
    { label: "TypeScript",     type: "language"  },
    { label: "Three.js",       type: "3d"        },
    { label: "WebGL",          type: "3d"        },
    { label: "R3F",            type: "3d"        },
    { label: "Next.js",        type: "framework" },
    { label: "Tailwind CSS",   type: "styling"   },
    { label: "Framer Motion",  type: "animation" },
    { label: "Node.js",        type: "runtime"   },
    { label: "Supabase",       type: "data"      },
    { label: "PostgreSQL",     type: "data"      },
    { label: "Prisma",         type: "data"      },
    { label: "Python",         type: "language"  },
    { label: "FastAPI",        type: "framework" },
    { label: "Docker",         type: "infra"     },
    { label: "GitHub Actions", type: "infra"     },
    { label: "Vercel",         type: "infra"     },
    { label: "AWS",            type: "infra"     },
    { label: "Figma",          type: "design"    },
    { label: "Swift",          type: "language"  },
];

const TYPE_COLOR: Record<string, string> = {
    framework: "text-[var(--cat-ux)]",
    language:  "text-[var(--cat-logistics)]",
    "3d":      "text-violet-400 dark:text-violet-300",
    animation: "text-[var(--cat-intelligence)]",
    styling:   "text-[var(--cat-ux)]",
    runtime:   "text-[var(--cat-logistics)]",
    data:      "text-amber-600 dark:text-amber-400",
    infra:     "text-[var(--text-dim)]",
    design:    "text-pink-600 dark:text-pink-300",
};

const MarqueeRow = ({ reversed = false }: { reversed?: boolean }) => {
    // Double for seamless loop
    const items = [...TECH_STACK, ...TECH_STACK];

    return (
        <div className="overflow-hidden w-full">
            <div
                className={`flex gap-6 w-max ${
                    reversed ? "animate-marquee-reverse" : "animate-marquee"
                }`}
                style={{ willChange: "transform" }}
            >
                {items.map((tech, i) => (
                    <div
                        key={`${tech.label}-${i}`}
                        className="flex items-center gap-2 squircle-chip px-3 py-1.5 glass-ultra-thin shrink-0"
                    >
                        <span
                            className={`text-[9px] font-mono uppercase tracking-[0.15em] ${
                                TYPE_COLOR[tech.type] ?? "text-[var(--text-dim)]"
                            }`}
                        >
                            {tech.type}
                        </span>
                        <span className="text-[var(--text)] text-[11px] font-medium">
                            {tech.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TechMarquee = () => {
    return (
        <section className="w-full py-16 overflow-hidden">
            {/* Depth separator */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--text-ghost)]/15 to-transparent mb-10" />

            <div className="max-w-7xl mx-auto px-6 mb-6">
                <p className="text-[var(--text-dim)] text-[10px] font-mono uppercase tracking-[0.2em]">
                    Built with
                </p>
            </div>

            <div className="space-y-3">
                <MarqueeRow />
                <MarqueeRow reversed />
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--text-ghost)]/15 to-transparent mt-10" />
        </section>
    );
};
