"use client";

import { motion } from "framer-motion";
import cn from "classnames";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-black/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

const WaterBottleBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Five different elegant shapes */}
            <ElegantShape className="top-10 left-1/5" width={450} height={120} rotate={15} delay={0} />
            <ElegantShape className="top-1/3 right-10" width={350} height={90} rotate={-10} delay={0.2} gradient="from-black/[0.06]" />
            <ElegantShape className="bottom-10 left-1/2" width={400} height={100} rotate={20} delay={0.4} />
            <ElegantShape className="top-1/2 right-1/4" width={300} height={80} rotate={-15} delay={0.6} gradient="from-black/[0.05]" />
            <ElegantShape className="bottom-5 right-1/3" width={500} height={130} rotate={25} delay={0.8} />
        </div>
    );
};

export default WaterBottleBackground;
