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

  // We have 4 identical spans, each taking up 25% of the massive flex row.
  // We wrap between -25% and 0%.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const directionFactor = useRef<number>(1);
  
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Change scroll direction based on scroll velocity direction
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    // Multiply by velocity factor to speed it up on scroll
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    
    baseX.set(baseX.get() + moveBy);
  });

  // Skew effect based on scroll velocity
  const skewX = useTransform(smoothVelocity, [-2000, 2000], [8, -8]);

  return (
    <div className="relative flex m-0 overflow-hidden whitespace-nowrap flex-nowrap leading-none tracking-[-0.06em]">
      <motion.div
        className="flex whitespace-nowrap flex-nowrap items-center text-[10rem] md:text-[15rem] lg:text-[20rem] font-light text-[var(--text)] uppercase mix-blend-plus-lighter"
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

const ServicesMarquee = () => {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[var(--surface)]">
      {/* Subtle indicator for the section */}
      <div className="absolute top-10 left-6 md:left-12 lg:left-24 z-10 w-[calc(100%-3rem)] max-w-7xl">
        <p className="text-[11px] font-mono uppercase tracking-[0.4em] text-[var(--cat-ux)] opacity-80 mb-6">
          Focus Areas
        </p>
      </div>

      <div className="flex flex-col gap-0 md:-space-y-16">
        <ParallaxText baseVelocity={-2}>Logistics Engine</ParallaxText>
        <ParallaxText baseVelocity={2}>Intelligence Bridge</ParallaxText>
        <ParallaxText baseVelocity={-2}>Modernized UX</ParallaxText>
      </div>
      
      {/* Fade out edges to blend with background */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--surface)] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--surface)] to-transparent z-10" />
      
      {/* Central gradient bloom behind the marquee */}
      <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[var(--cat-intelligence-bg)] blur-[120px] mix-blend-overlay opacity-30 z-0" />
    </section>
  );
};

export default ServicesMarquee;
