import { noteToNumber } from "@/lib/notes";
import { normalizeSearchText } from "@/lib/text-search";
import type { FiveLevel, Song } from "@/types/song";

export type MetricBand = "low" | "medium" | "high";
export type TempoBand = "slow" | "medium" | "fast";
export type SongSort =
  | "recommended"
  | "difficulty-asc"
  | "difficulty-desc"
  | "highest-note-asc"
  | "highest-note-desc"
  | "bpm-asc"
  | "bpm-desc";

export type SongFilters = {
  query?: string;
  lowestNoteMin?: string;
  highestNoteMax?: string;
  highestChestNoteMax?: string;
  highestFalsettoNoteMax?: string;
  maxDifficulty?: FiveLevel;
  genderCategory?: Song["genderCategory"];
  tempo?: TempoBand;
  highNoteFrequency?: MetricBand;
  falsettoFrequency?: MetricBand;
  longToneDifficulty?: MetricBand;
  rhythmDifficulty?: MetricBand;
  mood?: string;
};

function matchesMetricBand(value: FiveLevel, band?: MetricBand): boolean {
  if (!band) return true;
  if (band === "low") return value <= 2;
  if (band === "medium") return value === 3;
  return value >= 4;
}

function matchesTempo(bpm: number, tempo?: TempoBand): boolean {
  if (!tempo) return true;
  if (tempo === "slow") return bpm <= 100;
  if (tempo === "medium") return bpm > 100 && bpm < 140;
  return bpm >= 140;
}

function getSearchableText(song: Song): string {
  return normalizeSearchText(
    [
      song.title,
      song.artist,
      song.description,
      ...song.features,
      ...song.moods,
      ...song.genres,
      ...song.singingTips,
      ...song.difficultPoints,
      ...song.similarArtists,
    ].join(" "),
  );
}

/** 曲データだけを受け取り、UIに依存せず絞り込みます。 */
export function filterSongs(songList: Song[], filters: SongFilters): Song[] {
  const normalizedQuery = normalizeSearchText(filters.query ?? "");

  return songList.filter((song) => {
    if (normalizedQuery && !getSearchableText(song).includes(normalizedQuery)) return false;
    if (
      filters.lowestNoteMin &&
      noteToNumber(song.lowestNote) < noteToNumber(filters.lowestNoteMin)
    ) return false;
    if (
      filters.highestNoteMax &&
      noteToNumber(song.highestNote) > noteToNumber(filters.highestNoteMax)
    ) return false;
    if (
      filters.highestChestNoteMax &&
      noteToNumber(song.highestChestNote) > noteToNumber(filters.highestChestNoteMax)
    ) return false;
    if (
      filters.highestFalsettoNoteMax &&
      song.highestFalsettoNote &&
      noteToNumber(song.highestFalsettoNote) > noteToNumber(filters.highestFalsettoNoteMax)
    ) return false;
    if (filters.maxDifficulty && song.difficulty > filters.maxDifficulty) return false;
    if (filters.genderCategory && song.genderCategory !== filters.genderCategory) return false;
    if (!matchesTempo(song.bpm, filters.tempo)) return false;
    if (!matchesMetricBand(song.highNoteFrequency, filters.highNoteFrequency)) return false;
    if (!matchesMetricBand(song.falsettoFrequency, filters.falsettoFrequency)) return false;
    if (!matchesMetricBand(song.longToneDifficulty, filters.longToneDifficulty)) return false;
    if (!matchesMetricBand(song.rhythmDifficulty, filters.rhythmDifficulty)) return false;
    if (filters.mood && !song.moods.includes(filters.mood)) return false;
    return true;
  });
}

export function sortSongs(songList: Song[], sort: SongSort): Song[] {
  const sorted = [...songList];
  const recommendedValue = (song: Song) =>
    song.karaokeEase * 3 - song.difficulty + (song.lyricsStatus === "available" ? 2 : 0);

  return sorted.sort((left, right) => {
    if (sort === "difficulty-asc") return left.difficulty - right.difficulty;
    if (sort === "difficulty-desc") return right.difficulty - left.difficulty;
    if (sort === "highest-note-asc") return noteToNumber(left.highestNote) - noteToNumber(right.highestNote);
    if (sort === "highest-note-desc") return noteToNumber(right.highestNote) - noteToNumber(left.highestNote);
    if (sort === "bpm-asc") return left.bpm - right.bpm;
    if (sort === "bpm-desc") return right.bpm - left.bpm;
    return recommendedValue(right) - recommendedValue(left);
  });
}

export function searchAndSortSongs(
  songList: Song[],
  filters: SongFilters,
  sort: SongSort = "recommended",
): Song[] {
  return sortSongs(filterSongs(songList, filters), sort);
}
