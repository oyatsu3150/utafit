import { describe, expect, it } from "vitest";
import { songs } from "@/data/songs";
import { filterSongs, sortSongs } from "@/lib/song-search";

describe("曲の絞り込み", () => {
  it("曲名・アーティスト・雰囲気を検索する", () => {
    expect(filterSongs(songs, { query: "Vaundy" }).map((song) => song.id)).toContain("kaiju-no-hanauta");
    expect(filterSongs(songs, { query: "透明感" }).map((song) => song.id)).toContain("yoake-no-canvas");
  });

  it("音名を数値比較して最高音と難易度を絞り込む", () => {
    const results = filterSongs(songs, { highestNoteMax: "hiA", maxDifficulty: 2 });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((song) => ["kanade", "cherry"].includes(song.id))).toBe(true);
  });

  it("複数条件を同時に適用する", () => {
    const results = filterSongs(songs, { genderCategory: "male", tempo: "fast", highNoteFrequency: "high" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((song) => song.genderCategory === "male" && song.bpm >= 140 && song.highNoteFrequency >= 4)).toBe(true);
  });
});

describe("並び替え", () => {
  it("最高音が低い順に並べる", () => {
    const results = sortSongs(songs, "highest-note-asc");
    expect(results[0].highestNote).toBe("hiA");
  });
});
