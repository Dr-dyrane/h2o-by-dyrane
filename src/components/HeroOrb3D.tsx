import { useUI } from "@/context/UIContext";

const motionStyle = (prefersReducedMotion: boolean, animation: string) =>
    prefersReducedMotion ? undefined : { animation };

export const HeroOrb3D = () => {
    const { isMobile, prefersReducedMotion } = useUI();
    const sizeClass = isMobile
        ? "h-56 w-56"
        : "h-72 w-72 md:h-[24rem] md:w-[24rem]";

    return (
        <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none will-gpu"
            aria-hidden="true"
        >
            <div
                className={`relative ${sizeClass}`}
                style={motionStyle(prefersReducedMotion, "orb-float 16s ease-in-out infinite")}
            >
                <div className="absolute inset-[-8%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,rgba(122,169,151,0.08)_34%,rgba(122,169,151,0.03)_62%,transparent_78%)] blur-3xl" />

                <div
                    className="absolute inset-0 rounded-full border border-white/10"
                    style={motionStyle(prefersReducedMotion, "orb-spin 24s linear infinite")}
                />

                <div
                    className="absolute inset-[10%]"
                    style={motionStyle(prefersReducedMotion, "orb-spin-reverse 20s linear infinite")}
                >
                    <div className="h-full w-full rounded-full border border-emerald-200/15 [transform:rotate(65deg)_scaleX(1.06)_scaleY(0.88)]" />
                </div>

                <div
                    className="absolute inset-[18%]"
                    style={motionStyle(prefersReducedMotion, "orb-spin 18s linear infinite")}
                >
                    <div className="h-full w-full rounded-full border border-[#9fb8b0]/20 [transform:rotate(-28deg)_scaleX(0.84)_scaleY(1.08)]" />
                </div>

                <div
                    className="absolute inset-[14%] rounded-full border border-white/8 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.22)_0%,rgba(185,212,202,0.16)_22%,rgba(122,169,151,0.10)_46%,rgba(122,169,151,0.04)_66%,transparent_84%)] shadow-[0_0_60px_rgba(122,169,151,0.12)]"
                    style={motionStyle(prefersReducedMotion, "orb-breathe 8s ease-in-out infinite")}
                />

                <div
                    className="absolute inset-[28%] rounded-full border border-white/8 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_55%,transparent_78%)]"
                    style={motionStyle(prefersReducedMotion, "orb-breathe 6s ease-in-out infinite reverse")}
                />
            </div>
        </div>
    );
};
