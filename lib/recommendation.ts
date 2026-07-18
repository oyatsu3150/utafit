import { noteToNumber } from "@/lib/notes";
import type { RecommendationResult, Song, UserVocalProfile } from "@/types/song";

function scoreUpperLimit(songNote: string | undefined, userNote: string | undefined, maximum: number): number {
  if (!songNote || !userNote) return 0;
  const gap = noteToNumber(userNote) - noteToNumber(songNote);
  if (gap >= 0) return maximum;
  if (gap === -1) return Math.round(maximum * 0.5);
  return 0;
}

function hasIntersection(left: string[], right: string[]): boolean {
  const normalized = new Set(right.map((value) => value.toLocaleLowerCase("ja-JP")));
  return left.some((value) => normalized.has(value.toLocaleLowerCase("ja-JP")));
}

/** 100点の内訳と、説明可能な推薦理由を返すルールベース計算です。 */
export function calculateRecommendation(
  song: Song,
  profile: UserVocalProfile,
): RecommendationResult {
  const reasons: string[] = [];
  let rangeScore = 0;

  if (profile.comfortableLowestNote) {
    const fitsLowest = noteToNumber(song.lowestNote) >= noteToNumber(profile.comfortableLowestNote);
    rangeScore += fitsLowest ? 10 : 0;
    if (fitsLowest) reasons.push(`最低音${song.lowestNote}が安定音域内です`);
  }

  const chestScore = scoreUpperLimit(
    song.highestChestNote,
    profile.comfortableHighestChestNote,
    15,
  );
  rangeScore += chestScore;
  if (chestScore === 15) reasons.push(`地声最高音${song.highestChestNote}が安定音域内です`);

  const falsettoScore = scoreUpperLimit(
    song.highestFalsettoNote,
    profile.comfortableHighestFalsettoNote,
    10,
  );
  rangeScore += falsettoScore;
  if (falsettoScore === 10 && song.highestFalsettoNote) {
    reasons.push(`裏声最高音${song.highestFalsettoNote}が安定音域内です`);
  }

  const levelDifference = Math.abs(song.difficulty - profile.singingLevel);
  const difficultyScore = Math.max(0, 20 - levelDifference * 5);
  if (difficultyScore >= 15) reasons.push("難易度が現在の歌唱レベルに近いです");

  const genreScore = hasIntersection(song.genres, profile.preferredGenres) ? 10 : 0;
  if (genreScore) reasons.push(`好みのジャンル「${song.genres.find((genre) => profile.preferredGenres.includes(genre)) ?? song.genres[0]}」と一致します`);

  const moodScore = hasIntersection(song.moods, profile.preferredMoods) ? 10 : 0;
  if (moodScore) reasons.push(`好きな雰囲気「${song.moods.find((mood) => profile.preferredMoods.includes(mood)) ?? song.moods[0]}」を含みます`);

  const artistScore = profile.favoriteArtists.some(
    (artist) => artist === song.artist || song.similarArtists.includes(artist),
  ) ? 10 : 0;
  if (artistScore) reasons.push("好きなアーティスト本人、または近いアーティストの曲です");

  const similarSongScore = profile.favoriteSongs.some(
    (songIdOrTitle) =>
      song.similarSongIds.includes(songIdOrTitle) || song.title === songIdOrTitle,
  ) ? 10 : 0;
  if (similarSongScore) reasons.push("好きな曲と雰囲気や歌唱特性が近いです");

  const matchesGoal = profile.goalTypes.some((goal) => {
    if (goal.includes("高音")) return song.highNoteFrequency >= 4;
    if (goal.includes("裏声")) return song.falsettoFrequency >= 3;
    if (goal.includes("ミックス")) return song.features.some((feature) => feature.includes("ミックス"));
    if (goal.includes("表現")) return song.longToneDifficulty >= 4 || song.moods.includes("切ない");
    if (goal.includes("リズム")) return song.rhythmDifficulty >= 3;
    if (goal.includes("自分に合う")) return rangeScore >= 25;
    return false;
  });
  const goalScore = matchesGoal ? 5 : 0;
  if (goalScore) reasons.push("登録した練習目標に合う特徴があります");

  const totalScore = Math.min(
    100,
    rangeScore + difficultyScore + genreScore + moodScore + artistScore + similarSongScore + goalScore,
  );

  return {
    songId: song.id,
    totalScore,
    rangeScore,
    difficultyScore,
    genreScore,
    moodScore,
    artistScore,
    similarSongScore,
    goalScore,
    reasons: reasons.slice(0, 4),
  };
}

export function rankRecommendations(songList: Song[], profile: UserVocalProfile): RecommendationResult[] {
  return songList
    .map((song) => calculateRecommendation(song, profile))
    .sort((left, right) => right.totalScore - left.totalScore);
}
