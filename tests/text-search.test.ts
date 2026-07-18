import { describe, expect, it } from "vitest";
import { lyricLines } from "@/data/lyrics";
import { includesApproximate, normalizeSearchText, searchLyricLines } from "@/lib/text-search";

describe("歌詞検索の正規化", () => {
  it("全角英数字・カタカナ・空白・記号・大文字小文字をそろえる", () => {
    expect(normalizeSearchText(" ＡＢＣ・カゼ！ ")).toBe("abcかぜ");
  });

  it("空白と記号が違っても部分一致する", () => {
    expect(includesApproximate("まだ白い朝に　名前のない息を描く", "朝に、名前")).toBe(true);
  });

  it("1文字の入力ミスを許容する", () => {
    expect(includesApproximate("ひかりをあつめて", "ひかりをあづめて")).toBe(true);
  });

  it("読み仮名から歌詞行を見つける", () => {
    const results = searchLyricLines(lyricLines, "きのうよりじゆう");
    expect(results[0]?.line.id).toBe("yoake-line-6");
  });
});
