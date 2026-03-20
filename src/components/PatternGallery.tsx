import React from "react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { UITeardown } from "./UITeardown";
import { AutoScrollRender } from "./AutoScrollRender";
import { ArrowUpRight } from "@/components/icons/lucide";

export const PatternGallery: React.FC = () => {
  const featuredShowcase = projects
    .filter((p) => p.showcase && p.showcase.length > 0)
    .flatMap((p) => p.showcase || []);

  if (featuredShowcase.length === 0) return null;

  return (
    <section id="patterns" className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--cat-ux)]">
            Engineering Depth & Visual Surfaces
          </p>
          <h2 className="text-4xl font-light tracking-tight text-[var(--text)] md:text-5xl lg:text-6xl">
            Pattern explorations and layout surfaces.
          </h2>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-1">
        {featuredShowcase.map((item) => (
          <div
            key={item.id}
            className="group relative grid gap-8 overflow-hidden squircle-panel surface-panel p-6 md:p-10 lg:grid-cols-[1fr_0.8fr]"
          >
            {/* Visual Viewport */}
            <div className="relative order-2 lg:order-1">
               <AutoScrollRender 
                image={item.mobileImage.light} 
                height="min(600px, 60vh)" 
                className="shadow-2xl ring-1 ring-white/10"
              />
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-col justify-center gap-6 order-1 lg:order-2">
              <div className="space-y-4">
                <h3 className="text-3xl font-light tracking-tight text-[var(--text)] md:text-4xl">
                  {item.title}
                </h3>
                <p className="text-lg font-light leading-relaxed text-[var(--text-muted)]">
                  {item.description}
                </p>
              </div>

              <UITeardown 
                points={item.features} 
                className="mt-4"
              />

              <div className="mt-8">
                <button className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text)] transition-colors duration-200">
                  <span>View Implementation</span>
                  <ArrowUpRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
            
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--cat-ux-bg)] blur-[100px] opacity-20 transition-opacity duration-700 group-hover:opacity-40" />
          </div>
        ))}
      </div>
    </section>
  );
};
