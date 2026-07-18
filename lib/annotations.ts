import type { LyricAnnotation } from "@/types/song";

export type AnnotatedSegment = {
  startIndex: number;
  endIndex: number;
  text: string;
  annotations: LyricAnnotation[];
};

export function isValidAnnotationRange(
  text: string,
  annotation: Pick<LyricAnnotation, "startIndex" | "endIndex">,
): boolean {
  return (
    Number.isInteger(annotation.startIndex) &&
    Number.isInteger(annotation.endIndex) &&
    annotation.startIndex >= 0 &&
    annotation.endIndex <= text.length &&
    annotation.startIndex < annotation.endIndex
  );
}

/** 注釈の開始・終了位置で文字列を分割し、重なった注釈を同じ区間にまとめます。 */
export function buildAnnotatedSegments(
  text: string,
  annotations: LyricAnnotation[],
): AnnotatedSegment[] {
  const validAnnotations = annotations.filter((annotation) =>
    isValidAnnotationRange(text, annotation),
  );
  const boundaries = new Set<number>([0, text.length]);

  for (const annotation of validAnnotations) {
    boundaries.add(annotation.startIndex);
    boundaries.add(annotation.endIndex);
  }

  const orderedBoundaries = [...boundaries].sort((left, right) => left - right);
  const segments: AnnotatedSegment[] = [];

  for (let index = 0; index < orderedBoundaries.length - 1; index += 1) {
    const startIndex = orderedBoundaries[index];
    const endIndex = orderedBoundaries[index + 1];
    segments.push({
      startIndex,
      endIndex,
      text: text.slice(startIndex, endIndex),
      annotations: validAnnotations.filter(
        (annotation) =>
          annotation.startIndex <= startIndex && annotation.endIndex >= endIndex,
      ),
    });
  }

  return segments;
}
