import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface AutoScrollRenderProps {
  image: string;
  height?: string;
  speed?: number;
  className?: string;
}

export const AutoScrollRender: React.FC<AutoScrollRenderProps> = ({
  image,
  height = "400px",
  speed = 0.2,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden squircle-panel bg-[var(--surface-elevated)] ${className}`}
      style={{ height }}
    >
      <motion.div
        style={{ y }}
        className="w-full"
      >
        <img
          src={image}
          alt="Interface Preview"
          className="w-full object-cover shadow-2xl"
          loading="lazy"
        />
      </motion.div>
      
      {/* Glossy overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-inherit" />
    </div>
  );
};
