import { describe, expect, it } from "vitest";
import { buildAnnotatedSegments, isValidAnnotationRange } from "@/lib/annotations";
import type { LyricAnnotation } from "@/types/song";

const base = (id: string, startIndex: number, endIndex: number): LyricAnnotation => ({ id, lyricLineId: "line", startIndex, endIndex, techniques: ["chest"] });

describe("注釈範囲", () => {
  it("startIndexを含みendIndexを含まない範囲として検証する", () => {
    expect(isValidAnnotationRange("あいうえお", base("a", 1, 3))).toBe(true);
    expect(isValidAnnotationRange("あいうえお", base("b", 3, 3))).toBe(false);
    expect(isValidAnnotationRange("あいうえお", base("c", 0, 6))).toBe(false);
  });

  it("重なる注釈を境界で分割して同じ区間へ保持する", () => {
    const segments = buildAnnotatedSegments("朝の光を抱いて", [base("wide", 2, 5), { ...base("narrow", 2, 4), techniques: ["mix", "longTone"] }]);
    const overlapping = segments.find((segment) => segment.startIndex === 2 && segment.endIndex === 4);
    expect(overlapping?.text).toBe("光を");
    expect(overlapping?.annotations.map((annotation) => annotation.id)).toEqual(["wide", "narrow"]);
  });
});
