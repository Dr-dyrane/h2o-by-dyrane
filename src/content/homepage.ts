/**
 * Rotating hero card content shown in the homepage introduction.
 */
export type HeroShowcaseItem = {
  label: string;
  title: string;
  description: string;
  accent: string;
  accentBg: string;
};

/**
 * Service categories promoted on the homepage.
 */
export type ServiceItem = {
  title: string;
  description: string;
  accent: string;
  accentBg: string;
};

/**
 * High-level workflow step used in the "How I work" section.
 */
export type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

/**
 * Hero showcase entries cycled through in the landing panel.
 */
export const heroShowcase: HeroShowcaseItem[] = [
  {
    label: "For operations teams",
    title: "Software that keeps live work clear.",
    description: "Dispatch, routing, and live visibility designed to reduce handoff friction.",
    accent: "var(--cat-logistics)",
    accentBg: "var(--cat-logistics-bg)",
  },
  {
    label: "For AI products",
    title: "AI that feels structured and trustworthy.",
    description: "Complex reasoning turned into workflows people can understand and act on.",
    accent: "var(--cat-intelligence)",
    accentBg: "var(--cat-intelligence-bg)",
  },
  {
    label: "For product-led brands",
    title: "Interfaces that help buyers trust faster.",
    description: "Clear positioning, stronger product presentation, and a cleaner path to action.",
    accent: "var(--cat-ux)",
    accentBg: "var(--cat-ux-bg)",
  },
];

/**
 * Builds the compact proof strip shown beneath the hero using the latest commit total.
 *
 * @param totalCommits Aggregate commit count across the portfolio dataset.
 * @returns Display-ready proof cards for the homepage.
 */
export const buildProofStrip = (totalCommits: number) => [
  {
    value: `${(totalCommits / 1000).toFixed(1).replace(".0", "")}k+`,
    label: "commits across shipped portfolio work",
  },
  {
    value: "3 lanes",
    label: "operations, AI workflows, and product UX",
  },
  {
    value: "1 workflow",
    label: "strategy, design, and implementation stay aligned",
  },
];

/**
 * Primary services offered on the homepage.
 */
export const services: ServiceItem[] = [
  {
    title: "Custom Websites and Product Surfaces",
    description:
      "Marketing sites, landing pages, and product surfaces built so the message, interaction, and implementation stay aligned.",
    accent: "var(--cat-ux)",
    accentBg: "var(--cat-ux-bg)",
  },
  {
    title: "Internal Tools and Dashboards",
    description:
      "Operational software shaped around decisions, handoffs, and visibility instead of raw database structure.",
    accent: "var(--cat-logistics)",
    accentBg: "var(--cat-logistics-bg)",
  },
  {
    title: "AI Workflow Systems",
    description:
      "AI packaged into a workflow your team can follow, with the model doing the reasoning and the interface carrying the clarity.",
    accent: "var(--cat-intelligence)",
    accentBg: "var(--cat-intelligence-bg)",
  },
  {
    title: "UX Redesigns",
    description:
      "Focused redesigns for products that already work but are losing trust, clarity, or momentum in the interface.",
    accent: "var(--cat-ux)",
    accentBg: "var(--cat-ux-bg)",
  },
];

/**
 * Three-step summary of the delivery process.
 */
export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Find where trust or clarity breaks.",
    description:
      "Start with the business goal, what users are unsure about, and what needs to become obvious within the first few seconds.",
  },
  {
    step: "02",
    title: "Reshape the workflow and message around that moment.",
    description:
      "Adjust hierarchy, interaction, and copy so the product becomes easier to scan, easier to use, and easier to believe.",
  },
  {
    step: "03",
    title: "Build the final version and sharpen the proof.",
    description:
      "The same pass that shapes the structure also ships the product, tightens performance, and strengthens the signals people use to decide.",
  },
];
