export type FiveLevel = 1 | 2 | 3 | 4 | 5;

export type VocalTechnique =
  | "chest"
  | "head"
  | "falsetto"
  | "mix"
  | "whisper"
  | "edge"
  | "belt"
  | "breath"
  | "accent"
  | "longTone"
  | "vibrato"
  | "scoop"
  | "fall"
  | "kobushi"
  | "volumeUp"
  | "volumeDown"
  | "connect"
  | "cut"
  | "caution"
  | "other";

export type Song = {
  id: string;
  title: string;
  artist: string;
  genderCategory: "male" | "female" | "mixed";
  lowestNote: string;
  highestNote: string;
  highestChestNote: string;
  highestFalsettoNote?: string;
  bpm: number;
  difficulty: FiveLevel;
  highNoteFrequency: FiveLevel;
  falsettoFrequency: FiveLevel;
  longToneDifficulty: FiveLevel;
  breathingDifficulty: FiveLevel;
  rhythmDifficulty: FiveLevel;
  karaokeEase: FiveLevel;
  moods: string[];
  genres: string[];
  features: string[];
  description: string;
  singingTips: string[];
  difficultPoints: string[];
  similarSongIds: string[];
  similarArtists: string[];
  thumbnailTone: string;
  isFictional?: boolean;
  lyricsStatus: "available" | "rights-review";
};

export type SongSectionType =
  | "intro"
  | "verseA"
  | "verseB"
  | "verseC"
  | "chorus"
  | "verse2A"
  | "verse2B"
  | "chorus2"
  | "interlude"
  | "bridge"
  | "lastChorus"
  | "outro"
  | "other";

export type SongSection = {
  id: string;
  songId: string;
  type: SongSectionType;
  name: string;
  order: number;
  startTimeMs?: number;
  endTimeMs?: number;
  difficulty: FiveLevel;
  highestNote: string;
  lowestNote: string;
  primaryTechniques: VocalTechnique[];
  singingPoints: string[];
  difficultPhrases: string[];
  breathPositions: string[];
  practiceMethods: string[];
};

export type LyricLine = {
  id: string;
  songId: string;
  sectionId: string;
  order: number;
  text: string;
  startTimeMs?: number;
  endTimeMs?: number;
  readingText?: string;
};

export type LyricAnnotation = {
  id: string;
  lyricLineId: string;
  /** startIndex is inclusive and endIndex is exclusive. */
  startIndex: number;
  endIndex: number;
  techniques: VocalTechnique[];
  noteName?: string;
  octave?: number;
  difficulty?: FiveLevel;
  reason?: string;
  singingTip?: string;
  caution?: string;
  referenceDescription?: string;
  recommendedRegister?: string;
  originalStyle?: string;
  beginnerAlternative?: string;
  startTimeMs?: number;
  endTimeMs?: number;
  status?: "draft" | "ai-candidate" | "approved" | "hidden";
};

export type UserVocalProfile = {
  userId: string;
  displayName?: string;
  voiceType?: string;
  comfortableLowestNote?: string;
  comfortableHighestChestNote?: string;
  comfortableHighestMixNote?: string;
  comfortableHighestFalsettoNote?: string;
  maximumLowestNote?: string;
  maximumHighestNote?: string;
  singingLevel: number;
  preferredGenres: string[];
  preferredMoods: string[];
  favoriteArtists: string[];
  favoriteSongs: string[];
  dislikedGenres: string[];
  goalTypes: string[];
};

export type RecommendationResult = {
  songId: string;
  totalScore: number;
  rangeScore: number;
  difficultyScore: number;
  genreScore: number;
  moodScore: number;
  artistScore: number;
  similarSongScore: number;
  goalScore: number;
  reasons: string[];
};
