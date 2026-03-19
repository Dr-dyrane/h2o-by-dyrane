/**
 * Robust content sanitization and formatting utility for the ultimate portfolio.
 * Handles encoding issues, sentence truncation, and business-focused formatting.
 */

export const cleanCopy = (value: string): string => {
  if (!value) return "";
  
  return value
    .replace(/â€”/g, "—")
    .replace(/â†’/g, "->")
    .replace(/Â·/g, "·")
    .replace(/â€™/g, "'")
    .replace(/â€œ|â€ /g, '"')
    .replace(/\s+/g, " ")
    .replace(/\.{2,}/g, "...") // Fix repeated dots
    .trim();
};

export const getFirstSentence = (value: string): string => {
  const cleaned = cleanCopy(value);
  const match = cleaned.match(/^.+?[.!?](?=\s|$)/);
  return match ? match[0].trim() : cleaned;
};

export const formatList = (items: string[]): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

export const truncate = (value: string, length: number): string => {
  const cleaned = cleanCopy(value);
  if (cleaned.length <= length) return cleaned;
  return `${cleaned.slice(0, length - 3).trimEnd()}...`;
};
