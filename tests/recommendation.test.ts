import { describe, expect, it } from "vitest";
import { getSongById } from "@/data/songs";
import { calculateRecommendation } from "@/lib/recommendation";
import type { UserVocalProfile } from "@/types/song";

const profile: UserVocalProfile = { userId: "test", comfortableLowestNote: "mid1A", comfortableHighestChestNote: "hiA", comfortableHighestFalsettoNote: "hiC", singingLevel: 2, preferredGenres: ["J-POP"], preferredMoods: ["優しい"], favoriteArtists: ["スキマスイッチ"], favoriteSongs: [], dislikedGenres: [], goalTypes: ["自分に合う曲を知りたい"] };

describe("おすすめスコア", () => {
  it("内訳の合計が100点以内でtotalScoreと一致する", () => {
    const song = getSongById("kanade");
    expect(song).toBeDefined();
    const result = calculateRecommendation(song!, profile);
    const total = result.rangeScore + result.difficultyScore + result.genreScore + result.moodScore + result.artistScore + result.similarSongScore + result.goalScore;
    expect(result.totalScore).toBe(total);
    expect(result.totalScore).toBeLessThanOrEqual(100);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("音域外の高音曲より音域内の曲を高く評価する", () => {
    const easy = getSongById("kanade");
    const hard = getSongById("lilac");
    expect(calculateRecommendation(easy!, profile).rangeScore).toBeGreaterThan(calculateRecommendation(hard!, profile).rangeScore);
  });
});
