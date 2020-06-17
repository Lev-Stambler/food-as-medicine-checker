import logger from './Logger';

/**
 * Get the paragraphs which are either above the {@code scoreCutOff} and only have {@code maxParagraphs}
 * @param arr - an array sorted in descending order
 * @param scoreAccessor - the key to access the score
 * @param scoreCutOff - minimum score required
 */
export function getTopScoringParagraphs<T>(
  arr: T[],
  scoreAccessor: string,
  scoreCutOff = 10,
  maxParagraphs = 8
): T[] {
  const byCutOff = arr.filter((item) => item[scoreAccessor] >= scoreCutOff);
  if (byCutOff.length > maxParagraphs) {
    return byCutOff.slice(0, maxParagraphs);
  }
  return byCutOff;
}
