import type { Project } from "@/data/projects";
import { cleanCopy, formatList, getFirstSentence } from "@/utils/content";

/**
 * Formats commit counts for compact badge display.
 *
 * @param count Raw commit count.
 * @returns Human-friendly badge text such as `320` or `1.2k+`.
 */
export const formatCommitCountBadge = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(".0", "")}k+`;
  }

  return count.toString();
};

/**
 * Formats commit counts for metric cards where the `+` suffix is not needed.
 *
 * @param commits Raw commit count.
 * @returns Metric-friendly commit text.
 */
export const formatCommitCountMetric = (commits: number) =>
  commits >= 1000 ? `${(commits / 1000).toFixed(commits >= 10000 ? 0 : 1)}k` : `${commits}`;

/**
 * Resolves the public HTTPS URL for a project.
 *
 * @param project Project record from the dataset.
 * @returns Public project URL.
 */
export const getProjectUrl = (project: Project) => `https://${project.link}`;

/**
 * Produces a short single-sentence blurb for archive cards.
 *
 * @param project Project record from the dataset.
 * @returns Trimmed description suitable for compact cards.
 */
export const getArchiveBlurb = (project: Project) => {
  const firstSentence = project.description.split(". ")[0]?.trim() ?? project.description;
  const normalized = firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;

  return normalized.length > 112 ? `${normalized.slice(0, 109).trimEnd()}...` : normalized;
};

/**
 * Returns the top languages or technologies listed for a project.
 *
 * @param project Project record from the dataset.
 * @param count Maximum number of labels to return.
 * @returns Cleaned language labels.
 */
export const getTopLanguages = (project: Project, count = 3) =>
  project.github_stats.languages.slice(0, count).map(cleanCopy);

/**
 * Normalizes the challenge statement used in case studies.
 *
 * @param project Project record from the dataset.
 * @returns Problem summary with a sentence fallback.
 */
export const getProblemSummary = (project: Project) => {
  const summary = cleanCopy(project.challenge);
  return summary || getFirstSentence(project.description);
};

/**
 * Normalizes the architecture or solution statement used in case studies.
 */
export const getSolutionSummary = (project: Project) => cleanCopy(project.architecture);

/**
 * Normalizes the value proposition for a project.
 */
export const getValueSummary = (project: Project) => cleanCopy(project.proposal);

/**
 * Builds a compact proof statement combining commits, stars, deployment, and stack.
 *
 * @param project Project record from the dataset.
 * @returns Display-ready proof copy for overlays and summaries.
 */
export const getProofSummary = (project: Project) => {
  const stack = formatList(getTopLanguages(project));
  const baseProof = project.github_stats.stars
    ? `${project.github_stats.commits.toLocaleString()} commits, ${project.github_stats.stars} public stars, and a live deployment`
    : `${project.github_stats.commits.toLocaleString()} commits and a live deployment`;

  return stack ? `${baseProof}. Built with ${stack}.` : `${baseProof}.`;
};
