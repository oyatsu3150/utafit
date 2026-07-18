import { describe, expect, it } from "vitest";
import { compareNotes, getRangeWidth, isNoteInRange, noteToNumber } from "@/lib/notes";

describe("音名変換", () => {
  it("指定された順序で連続した数値へ変換する", () => {
    expect(noteToNumber("lowG")).toBe(0);
    expect(noteToNumber("mid1A")).toBe(1);
    expect(noteToNumber("hiG")).toBe(21);
  });

  it("未対応の音名を静かに誤比較せずエラーにする", () => {
    expect(() => noteToNumber("C4")).toThrow("未対応の音名");
  });
});

describe("音域比較", () => {
  it("範囲の両端を含めて判定する", () => {
    expect(isNoteInRange("mid1A", "mid1A", "hiA")).toBe(true);
    expect(isNoteInRange("hiA", "mid1A", "hiA")).toBe(true);
    expect(isNoteInRange("hiB", "mid1A", "hiA")).toBe(false);
  });

  it("音名の大小と音域幅を返す", () => {
    expect(compareNotes("hiA", "mid2G")).toBeGreaterThan(0);
    expect(getRangeWidth("mid1A", "hiA")).toBe(14);
  });
});
