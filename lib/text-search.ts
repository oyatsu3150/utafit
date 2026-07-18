import type { LyricLine } from "@/types/song";

/** 表記ゆれを吸収するため、検索前に文字種・空白・記号をそろえます。 */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[ァ-ヶ]/g, (character) =>
      String.fromCharCode(character.charCodeAt(0) - 0x60),
    )
    .toLocaleLowerCase("ja-JP")
    .replace(/[\p{P}\p{S}\s]/gu, "");
}

export function levenshteinDistance(left: string, right: string): number {
  const matrix = Array.from({ length: left.length + 1 }, () =>
    Array<number>(right.length + 1).fill(0),
  );

  for (let index = 0; index <= left.length; index += 1) matrix[index][0] = index;
  for (let index = 0; index <= right.length; index += 1) matrix[0][index] = index;

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      matrix[leftIndex][rightIndex] = Math.min(
        matrix[leftIndex - 1][rightIndex] + 1,
        matrix[leftIndex][rightIndex - 1] + 1,
        matrix[leftIndex - 1][rightIndex - 1] + substitutionCost,
      );
    }
  }

  return matrix[left.length][right.length];
}

export function includesApproximate(
  source: string,
  query: string,
  maximumDistance = 1,
): boolean {
  const normalizedSource = normalizeSearchText(source);
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  if (normalizedSource.includes(normalizedQuery)) return true;

  const minimumLength = Math.max(1, normalizedQuery.length - maximumDistance);
  const maximumLength = normalizedQuery.length + maximumDistance;

  for (let length = minimumLength; length <= maximumLength; length += 1) {
    for (let start = 0; start + length <= normalizedSource.length; start += 1) {
      if (
        levenshteinDistance(
          normalizedSource.slice(start, start + length),
          normalizedQuery,
        ) <= maximumDistance
      ) {
        return true;
      }
    }
  }

  return false;
}

export type LyricSearchMatch = {
  line: LyricLine;
  excerpt: string;
  matchedBy: "text" | "reading";
};

/** UIや将来の全文検索基盤から独立した、ローカル歌詞検索サービスです。 */
export function searchLyricLines(lines: LyricLine[], query: string): LyricSearchMatch[] {
  if (!normalizeSearchText(query)) return [];

  const matches: LyricSearchMatch[] = [];
  for (const line of lines) {
    if (includesApproximate(line.text, query)) {
      matches.push({ line, excerpt: line.text, matchedBy: "text" });
    } else if (line.readingText && includesApproximate(line.readingText, query)) {
      matches.push({ line, excerpt: line.text, matchedBy: "reading" });
    }
  }
  return matches;
}
