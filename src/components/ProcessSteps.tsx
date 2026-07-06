"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const processSteps = [
  {
    step: "01",
    title: "Find where trust or clarity breaks.",
    description:
      "Start with the business goal, what users are unsure about, and what needs to become obvious within the first few seconds.",
    accent: "var(--cat-logistics)",
  },
  {
    step: "02",
    title: "Reshape the workflow and message around that moment.",
    description:
      "Adjust hierarchy, interaction, and copy so the product becomes easier to scan, easier to use, and easier to believe.",
    accent: "var(--cat-intelligence)",
  },
  {
    step: "03",
    title: "Build the final version and sharpen the proof.",
    description:
      "The same pass that shapes the structure also ships the product, tightens performance, and strengthens the signals people use to decide.",
    accent: "var(--cat-ux)",
  },
];

const StaggerWords = ({
  text,
  className,
  baseDelay = 0,
  stagger = 0.08,
  inView,
  reduceMotion,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  stagger?: number;
  inView: boolean;
  reduceMotion: boolean;
}) => {
  const words = text.split(" ");

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="word-clip mr-[0.22em] last:mr-0">
          <motion.span
            className="inline-block"
            initial={reduceMotion ? false : { y: 40, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
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
  reduceMotion,
}: {
  step: (typeof processSteps)[0];
  index: number;
  reduceMotion: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const isRevealed = reduceMotion ? true : inView;

  return (
    <div
      ref={ref}
      className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden"
      style={{
        zIndex: index + 10,
        backgroundColor: "var(--surface-alt)",
      }}
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={isRevealed ? { opacity: 0.24 } : { opacity: 0 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{
          background: `radial-gradient(circle at 50% 120%, ${step.accent}, transparent 70%)`,
        }}
      />

      <div className="relative flex h-full w-full max-w-7xl flex-col items-center gap-12 px-6 md:flex-row md:gap-24 md:px-12 lg:px-24">
        <div className="relative flex h-1/2 w-full items-center justify-center md:h-full md:w-1/2 md:justify-start">
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }
            }
            className="text-[12rem] font-light leading-none tracking-tighter mix-blend-plus-lighter md:text-[20rem] lg:text-[28rem]"
            style={{
              color: `color-mix(in srgb, ${step.accent} 14%, transparent)`,
              WebkitTextStroke: `3px ${step.accent}`,
              textShadow: `0 0 80px color-mix(in srgb, ${step.accent} 22%, transparent)`,
            }}
          >
            {step.step}
          </motion.span>
        </div>

        <div className="relative z-10 flex h-1/2 w-full items-center justify-center pb-16 md:h-full md:w-1/2 md:justify-start md:pb-0">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <motion.div
              initial={reduceMotion ? false : { x: -30, opacity: 0 }}
              animate={isRevealed ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
              }
              className="mb-6 flex items-center gap-3"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: step.accent }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: step.accent }}>
                Phase {step.step}
              </p>
            </motion.div>

            <h3 className="mb-6 text-balance text-4xl font-light tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
              <StaggerWords
                text={step.title}
                baseDelay={0.32}
                stagger={0.08}
                inView={isRevealed}
                reduceMotion={reduceMotion}
              />
            </h3>

            <motion.p
              initial={reduceMotion ? false : { y: 20, opacity: 0 }}
              animate={isRevealed ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.75, delay: 0.62, ease: [0.16, 1, 0.3, 1] }
              }
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
  const reduceMotion = useReducedMotion();

  return (
    <section id="process" className="relative flex w-full flex-col bg-[var(--surface-alt)]">
      {processSteps.map((step, index) => (
        <StepPanel
          key={step.step}
          step={step}
          index={index}
          reduceMotion={Boolean(reduceMotion)}
        />
      ))}
    </section>
  );
};

export default ProcessSteps;
