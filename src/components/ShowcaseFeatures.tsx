import React from "react";
import * as LucideIcons from "@/components/icons/lucide";
import { motion } from "framer-motion";

interface FeaturePoint {
  icon: string;
  label: string;
  detail: string;
}

interface ShowcaseFeaturesProps {
  points: FeaturePoint[];
  className?: string;
  accentColor?: string;
}

export const ShowcaseFeatures: React.FC<ShowcaseFeaturesProps> = ({ 
  points, 
  className = "",
  accentColor = "var(--cat-ux)"
}) => {
  return (
    <div className={`grid gap-3 ${className}`}>
      {points.map((point, idx) => {
        const Icon = (LucideIcons as any)[point.icon] || LucideIcons.Code;
        return (
          <motion.div
            key={point.label}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            viewport={{ once: true }}
            className="group flex items-start gap-4 squircle-panel surface-glass p-4 backdrop-blur-md transition-all duration-300 hover:bg-[var(--surface-elevated-strong)]"
          >
            <div 
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-elevated)] transition-transform duration-300 group-hover:scale-110"
              style={{ color: accentColor }}
            >
              <Icon size={18} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--text-ghost)]">
                {point.label}
              </p>
              <p className="text-sm font-light leading-relaxed text-[var(--text-muted)]">
                {point.detail}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
