"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  useInView,
} from "framer-motion";

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ParallaxProps {
  children: string;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const skewX = useTransform(smoothVelocity, [-2000, 2000], [8, -8]);

  return (
    <div className="relative m-0 flex overflow-hidden whitespace-nowrap leading-none tracking-[-0.06em]">
      <motion.div
        className="flex items-center whitespace-nowrap text-[10rem] font-light uppercase text-[var(--text)] mix-blend-plus-lighter md:text-[15rem] lg:text-[20rem]"
        style={{ x, skewX }}
      >
        <span className="block pr-12 md:pr-24">{children}</span>
        <span className="block pr-12 md:pr-24">{children}</span>
        <span className="block pr-12 md:pr-24">{children}</span>
        <span className="block pr-12 md:pr-24">{children}</span>
      </motion.div>
    </div>
  );
}

const MarqueeHeader = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <div ref={ref} className="w-full px-6 md:px-12 lg:px-24">
      <h2 className="flex select-none flex-col text-[14vw] font-light leading-[0.8] tracking-tighter sm:text-[12vw] md:text-[10vw]">
        <span className="word-clip">
          <motion.span
            className="inline-block text-transparent mix-blend-plus-lighter"
            style={{ WebkitTextStroke: "1px var(--text-dim)" }}
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            What we
          </motion.span>
        </span>

        <span className="word-clip ml-[4vw]">
          <motion.span
            className="inline-block text-[var(--text)]"
            style={{ textShadow: "0 0 80px rgba(255,255,255,0.08)" }}
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            build.
          </motion.span>
        </span>
      </h2>
    </div>
  );
};

const ServicesMarquee = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--surface)] pt-20 pb-8 md:pt-32">
      <div className="sticky top-20 z-20 mb-8 md:mb-12">
        <MarqueeHeader />
      </div>

      <div className="relative z-10 mt-8 flex flex-col gap-0 md:-space-y-16 md:mt-16">
        <ParallaxText baseVelocity={-2}>Logistics Engine</ParallaxText>
        <ParallaxText baseVelocity={2}>Intelligence Bridge</ParallaxText>
        <ParallaxText baseVelocity={-2}>Modernized UX</ParallaxText>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[var(--surface)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[var(--surface)] to-transparent" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 z-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[var(--cat-intelligence-bg)] opacity-30 blur-[120px] mix-blend-overlay" />
    </section>
  );
};

export default ServicesMarquee;
