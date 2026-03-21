import type { Project } from "@/data/projects";
import { cleanCopy, formatList, getFirstSentence } from "@/utils/content";

export const formatCommitCountBadge = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(".0", "")}k+`;
  }

  return count.toString();
};

export const formatCommitCountMetric = (commits: number) =>
  commits >= 1000 ? `${(commits / 1000).toFixed(commits >= 10000 ? 0 : 1)}k` : `${commits}`;

export const getProjectUrl = (project: Project) => `https://${project.link}`;

export const getArchiveBlurb = (project: Project) => {
  const firstSentence = project.description.split(". ")[0]?.trim() ?? project.description;
  const normalized = firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;

  return normalized.length > 112 ? `${normalized.slice(0, 109).trimEnd()}...` : normalized;
};

export const getTopLanguages = (project: Project, count = 3) =>
  project.github_stats.languages.slice(0, count).map(cleanCopy);

export const getProblemSummary = (project: Project) => {
  const summary = cleanCopy(project.challenge);
  return summary || getFirstSentence(project.description);
};

export const getSolutionSummary = (project: Project) => cleanCopy(project.architecture);

export const getValueSummary = (project: Project) => cleanCopy(project.proposal);

export const getProofSummary = (project: Project) => {
  const stack = formatList(getTopLanguages(project));
  const baseProof = project.github_stats.stars
    ? `${project.github_stats.commits.toLocaleString()} commits, ${project.github_stats.stars} public stars, and a live deployment`
    : `${project.github_stats.commits.toLocaleString()} commits and a live deployment`;

  return stack ? `${baseProof}. Built with ${stack}.` : `${baseProof}.`;
};
