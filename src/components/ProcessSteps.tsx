"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

const ProcessSteps = () => {
  return (
    <section className="relative flex flex-col w-full bg-[var(--surface-alt)]">
      {processSteps.map((step, index) => (
        <div
          key={step.step}
          className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden border-t border-white/5"
          style={{
            zIndex: index + 10,
            backgroundColor: "var(--surface-alt)",
          }}
        >
          {/* Dynamic background lighting specific to this step's accent color */}
          <div 
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 120%, ${step.accent}, transparent 70%)`
            }}
          />

          <div className="relative w-full max-w-7xl px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-12 md:gap-24 h-full">
            
            {/* Left: Massive Typography */}
            <div className="relative w-full md:w-1/2 flex justify-center md:justify-start items-center h-1/2 md:h-full">
              <span 
                className="text-[12rem] md:text-[20rem] lg:text-[28rem] font-light leading-none tracking-tighter mix-blend-plus-lighter"
                style={{ 
                  color: "transparent",
                  WebkitTextStroke: `2px ${step.accent}`,
                  textShadow: `0 0 60px ${step.accent}33`
                }}
              >
                {step.step}
              </span>
            </div>

            {/* Right: Content details */}
            <div className="relative w-full md:w-1/2 flex items-center justify-center md:justify-start h-1/2 md:h-full z-10 pb-16 md:pb-0">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-2 w-2 rounded-full" style={{ background: step.accent }} />
                  <p className="text-[11px] font-mono uppercase tracking-[0.4em]" style={{ color: step.accent }}>
                    Phase {step.step}
                  </p>
                </div>
                
                <h3 className="mb-6 text-4xl font-light tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl text-balance">
                  {step.title}
                </h3>
                
                <p className="max-w-md text-lg md:text-xl font-light leading-relaxed text-[var(--text-muted)] text-balance">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProcessSteps;
