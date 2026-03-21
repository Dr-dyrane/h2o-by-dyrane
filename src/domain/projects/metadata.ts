import type { Project, ProjectCaseStudy } from "@/data/projects";

/**
 * Supported project categories derived from the project dataset.
 */
export type ProjectCategory = Project["category"];

/**
 * Section-level metadata used to present each project category on the homepage.
 */
export type CategoryMeta = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  proof: string;
  signals: string[];
  featuredTitle: string;
  accent: string;
  accentBg: string;
};

/**
 * Copy and proof framing for flagship projects.
 */
export type FeaturedStory = {
  label: string;
  audience: string;
  summary: string;
  clientNeed: string;
  previewLines: [string, string, string];
  outcomes: string[];
};

/**
 * Convenience mapping for category-driven color tokens.
 */
export type CategoryColor = {
  text: string;
  accentBg: string;
  accent: string;
};

/**
 * Homepage category framing, labels, and accents.
 */
export const categoryMeta: Record<ProjectCategory, CategoryMeta> = {
  "Logistics Engine": {
    id: "logistics-engine",
    eyebrow: "When timing and coordination matter",
    title: "Use software that keeps live operations clear and coordinated.",
    description:
      "These projects are for teams that need dispatch, routing, tracking, or real-time visibility without operational confusion.",
    proof:
      "Best fit when delays, handoffs, and blind spots are costing the team time, confidence, or customer trust.",
    signals: ["Real-time visibility", "Dispatch clarity", "Operational confidence"],
    featuredTitle: "iVisit Ecosystem",
    accent: "var(--cat-logistics)",
    accentBg: "var(--cat-logistics-bg)",
  },
  "Intelligence Bridge": {
    id: "intelligence-bridge",
    eyebrow: "When AI needs to do real work",
    title: "Turn complex reasoning into tools your team can actually use.",
    description:
      "These products package AI and automation into clear workflows instead of making users deal with model complexity.",
    proof:
      "Best fit when you need smarter workflows, triage, or decision support that still feels human and trustworthy.",
    signals: ["Usable AI", "Clear workflows", "Decision support"],
    featuredTitle: "Dr. Dyrane",
    accent: "var(--cat-intelligence)",
    accentBg: "var(--cat-intelligence-bg)",
  },
  "Modernized UX": {
    id: "modernized-ux",
    eyebrow: "When the product is good but the presentation is weak",
    title: "Make the experience clearer, stronger, and easier to trust.",
    description:
      "These projects focus on positioning, conversion, and interface polish so the product feels credible before the sales call.",
    proof:
      "Best fit when the product exists, but the presentation is not yet helping the business sell, convert, or reassure.",
    signals: ["Trust signals", "Clear positioning", "Stronger conversion path"],
    featuredTitle: "House of Prax",
    accent: "var(--cat-ux)",
    accentBg: "var(--cat-ux-bg)",
  },
};

/**
 * Display order for the three homepage project categories.
 */
export const categoryOrder: ProjectCategory[] = [
  "Logistics Engine",
  "Intelligence Bridge",
  "Modernized UX",
];

/**
 * Hand-authored story framing for flagship projects.
 */
export const featuredStories: Record<string, FeaturedStory> = {
  "iVisit Ecosystem": {
    label: "Emergency dispatch platform",
    audience: "Operations and response teams",
    summary:
      "A real-time dispatch product that keeps ambulance teams, routing, and hospital visibility in sync.",
    clientNeed:
      "Best when coordination is breaking down across the control room, field team, and receiving location.",
    previewLines: ["Live dispatch", "Route visibility", "Cleaner handoffs"],
    outcomes: ["Operational clarity", "Faster coordination", "Live system visibility"],
  },
  "Dr. Dyrane": {
    label: "Clinical AI triage engine",
    audience: "Health products using AI",
    summary:
      "Structured symptom intake and clinical reasoning packaged into a product people can actually use and trust.",
    clientNeed:
      "Best when AI needs to support real decisions without feeling vague, unsafe, or hard to trust.",
    previewLines: ["Structured intake", "Clinical logic", "Safer triage"],
    outcomes: ["Usable intelligence", "Safer escalation", "Decision support"],
  },
  "House of Prax": {
    label: "E-commerce storefront",
    audience: "Consumer and wellness brands",
    summary:
      "A commerce experience designed to make product quality, trust, and buying intent feel obvious.",
    clientNeed:
      "Best when the product is strong but the storefront is not doing enough to position or convert it.",
    previewLines: ["Product clarity", "Brand trust", "Cleaner buying flow"],
    outcomes: ["Stronger positioning", "Clearer product story", "Conversion support"],
  },
};

/**
 * Color token helpers keyed by project category.
 */
export const categoryColor: Record<ProjectCategory, CategoryColor> = {
  "Logistics Engine": {
    text: "text-[var(--cat-logistics)]",
    accentBg: "bg-[var(--cat-logistics-bg)]",
    accent: "var(--cat-logistics)",
  },
  "Intelligence Bridge": {
    text: "text-[var(--cat-intelligence)]",
    accentBg: "bg-[var(--cat-intelligence-bg)]",
    accent: "var(--cat-intelligence)",
  },
  "Modernized UX": {
    text: "text-[var(--cat-ux)]",
    accentBg: "bg-[var(--cat-ux-bg)]",
    accent: "var(--cat-ux)",
  },
};

/**
 * Fallback case-study metadata used when a project does not define a full case study.
 */
export const fallbackCaseStudyByCategory: Record<
  ProjectCategory,
  Pick<ProjectCaseStudy, "users" | "surfaces">
> = {
  "Logistics Engine": {
    users: "Operations teams coordinating work across moving parts",
    surfaces: "Operational dashboard and task-driven web workflows",
  },
  "Intelligence Bridge": {
    users: "Teams packaging AI or automation into real decisions",
    surfaces: "Structured intake, output, and decision-support workflows",
  },
  "Modernized UX": {
    users: "Buyers or users deciding whether to trust the product",
    surfaces: "Marketing, product presentation, and conversion flows",
  },
};
