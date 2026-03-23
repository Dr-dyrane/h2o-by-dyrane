"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const processSteps = [
  {
    step: "01",
    title: "Discovery & Blueprint",
    description:
      "Deep dive into your business logic. We define the exact problem, the ideal state, and the fastest path between them.",
    accent: "var(--cat-logistics)",
  },
  {
    step: "02",
    title: "Design & Prototype",
    description:
      "Visual direction and interactive prototypes. Liquid glass aesthetics and cinematic pacing applied to your core workflows.",
    accent: "var(--cat-intelligence)",
  },
  {
    step: "03",
    title: "Development & Handoff",
    description:
      "Production-ready engineering using React, Tailwind, and Framer Motion. Built to scale, designed to impress.",
    accent: "var(--cat-ux)",
  },
];

const StaggerWords = ({
  text,
  className,
  baseDelay = 0,
  stagger = 0.08,
  inView,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  stagger?: number;
  inView: boolean;
}) => {
  const words = text.split(" ");

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="word-clip mr-[0.22em] last:mr-0">
          <motion.span
            className="inline-block"
            initial={{ y: 40, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{
              duration: 0.7,
              delay: baseDelay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

const StepPanel = ({
  step,
  index,
}: {
  step: (typeof processSteps)[0];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.6 });

  return (
    <div
      ref={ref}
      className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden border-t border-white/5"
      style={{
        zIndex: index + 10,
        backgroundColor: "var(--surface-alt)",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.24 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{
          background: `radial-gradient(circle at 50% 120%, ${step.accent}, transparent 70%)`,
        }}
      />

      <div className="relative flex h-full w-full max-w-7xl flex-col items-center gap-12 px-6 md:flex-row md:gap-24 md:px-12 lg:px-24">
        <div className="relative flex h-1/2 w-full items-center justify-center md:h-full md:w-1/2 md:justify-start">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12rem] font-light leading-none tracking-tighter mix-blend-plus-lighter md:text-[20rem] lg:text-[28rem]"
            style={{
              color: "transparent",
              WebkitTextStroke: `2px ${step.accent}`,
              textShadow: `0 0 80px ${step.accent}22`,
            }}
          >
            {step.step}
          </motion.span>
        </div>

        <div className="relative z-10 flex h-1/2 w-full items-center justify-center pb-16 md:h-full md:w-1/2 md:justify-start md:pb-0">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={inView ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: step.accent }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: step.accent }}>
                Phase {step.step}
              </p>
            </motion.div>

            <h3 className="mb-6 text-balance text-4xl font-light tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
              <StaggerWords text={step.title} baseDelay={0.32} stagger={0.08} inView={inView} />
            </h3>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.75, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md text-balance text-lg font-light leading-relaxed text-[var(--text-muted)] md:text-xl"
            >
              {step.description}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcessSteps = () => {
  return (
    <section id="process" className="relative flex w-full flex-col bg-[var(--surface-alt)]">
      {processSteps.map((step, index) => (
        <StepPanel key={step.step} step={step} index={index} />
      ))}
    </section>
  );
};

export default ProcessSteps;
