export const NOTE_NAMES = [
  "lowG",
  "mid1A",
  "mid1B",
  "mid1C",
  "mid1D",
  "mid1E",
  "mid1F",
  "mid1G",
  "mid2A",
  "mid2B",
  "mid2C",
  "mid2D",
  "mid2E",
  "mid2F",
  "mid2G",
  "hiA",
  "hiB",
  "hiC",
  "hiD",
  "hiE",
  "hiF",
  "hiG",
] as const;

export type NoteName = (typeof NOTE_NAMES)[number];

/** 音名を比較可能な連続した数値へ変換します。 */
export function noteToNumber(note: string): number {
  const index = NOTE_NAMES.indexOf(note as NoteName);
  if (index === -1) {
    throw new Error(`未対応の音名です: ${note}`);
  }
  return index;
}

export function compareNotes(left: string, right: string): number {
  return noteToNumber(left) - noteToNumber(right);
}

export function isNoteInRange(note: string, lowest: string, highest: string): boolean {
  const value = noteToNumber(note);
  return value >= noteToNumber(lowest) && value <= noteToNumber(highest);
}

export function getRangeWidth(lowest: string, highest: string): number {
  return Math.max(0, noteToNumber(highest) - noteToNumber(lowest));
}

export function formatRangeWidth(width: number): string {
  if (width < 7) return `${width}音（コンパクト）`;
  if (width < 14) return `${width}音（標準）`;
  return `${width}音（広め）`;
}
