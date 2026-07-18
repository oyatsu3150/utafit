import type { FiveLevel, Song } from "@/types/song";

export const SAMPLE_DATA_NOTICE =
  "表示中の音域・BPM・難易度はMVPの動作確認用サンプル値です。正確な楽曲分析データではありません。";

type SongSeed = Pick<
  Song,
  | "id"
  | "title"
  | "artist"
  | "genderCategory"
  | "lowestNote"
  | "highestNote"
  | "highestChestNote"
  | "highestFalsettoNote"
  | "bpm"
  | "difficulty"
  | "highNoteFrequency"
  | "falsettoFrequency"
  | "longToneDifficulty"
  | "breathingDifficulty"
  | "rhythmDifficulty"
  | "karaokeEase"
  | "moods"
  | "genres"
> &
  Partial<
    Pick<
      Song,
      | "features"
      | "description"
      | "singingTips"
      | "difficultPoints"
      | "similarSongIds"
      | "similarArtists"
      | "thumbnailTone"
      | "isFictional"
      | "lyricsStatus"
    >
  >;

function createSong(seed: SongSeed): Song {
  return {
    features: ["カラオケ", "歌唱練習"],
    description: "音域やリズム、声区の切り替えを確認しながら練習できるサンプル曲データです。",
    singingTips: ["無理に原曲キーへ合わせず、安定するキーから練習する", "歌詞を話すように読んでからメロディーへつなげる"],
    difficultPoints: ["高音へ入る直前の息の量", "フレーズ終わりまで音程を保つ部分"],
    similarSongIds: [],
    similarArtists: [],
    thumbnailTone: "coral",
    lyricsStatus: "rights-review",
    ...seed,
  };
}

const realSongSeeds: SongSeed[] = [
  { id: "kaiju-no-hanauta", title: "怪獣の花唄", artist: "Vaundy", genderCategory: "male", lowestNote: "mid1D", highestNote: "hiC", highestChestNote: "hiB", highestFalsettoNote: "hiC", bpm: 150, difficulty: 4, highNoteFrequency: 5, falsettoFrequency: 2, longToneDifficulty: 4, breathingDifficulty: 4, rhythmDifficulty: 3, karaokeEase: 3, moods: ["熱い", "爽快", "エモーショナル"], genres: ["J-POP", "ロック"], features: ["高音が多い", "サビが力強い", "ロングトーン"], similarSongIds: ["ao-to-natsu", "sayonara-elegy"], similarArtists: ["優里", "菅田将暉"], thumbnailTone: "coral" },
  { id: "ao-to-natsu", title: "青と夏", artist: "Mrs. GREEN APPLE", genderCategory: "male", lowestNote: "mid1E", highestNote: "hiD", highestChestNote: "hiC", highestFalsettoNote: "hiD", bpm: 185, difficulty: 5, highNoteFrequency: 5, falsettoFrequency: 3, longToneDifficulty: 3, breathingDifficulty: 4, rhythmDifficulty: 4, karaokeEase: 2, moods: ["爽快", "青春", "明るい"], genres: ["J-POP", "ロック"], features: ["アップテンポ", "高音練習", "疾走感"], similarSongIds: ["lilac", "kaiju-no-hanauta"], similarArtists: ["sumika", "Official髭男dism"], thumbnailTone: "sky" },
  { id: "lilac", title: "ライラック", artist: "Mrs. GREEN APPLE", genderCategory: "male", lowestNote: "mid1E", highestNote: "hiE", highestChestNote: "hiC", highestFalsettoNote: "hiE", bpm: 150, difficulty: 5, highNoteFrequency: 5, falsettoFrequency: 4, longToneDifficulty: 3, breathingDifficulty: 5, rhythmDifficulty: 5, karaokeEase: 1, moods: ["青春", "華やか", "前向き"], genres: ["J-POP", "ロック"], features: ["細かなリズム", "声区切り替え", "高音練習"], similarSongIds: ["ao-to-natsu", "que-sera-sera"], similarArtists: ["Official髭男dism", "sumika"], thumbnailTone: "violet" },
  { id: "que-sera-sera", title: "ケセラセラ", artist: "Mrs. GREEN APPLE", genderCategory: "male", lowestNote: "mid1D", highestNote: "hiE", highestChestNote: "hiC", highestFalsettoNote: "hiE", bpm: 127, difficulty: 5, highNoteFrequency: 5, falsettoFrequency: 4, longToneDifficulty: 4, breathingDifficulty: 5, rhythmDifficulty: 4, karaokeEase: 1, moods: ["壮大", "前向き", "ドラマチック"], genres: ["J-POP"], features: ["強弱が大きい", "ミックスボイス練習", "表現力"], similarSongIds: ["lilac", "subtitle"], similarArtists: ["Official髭男dism", "back number"], thumbnailTone: "amber" },
  { id: "tenbyo-no-uta", title: "点描の唄", artist: "Mrs. GREEN APPLE feat. 井上苑子", genderCategory: "mixed", lowestNote: "mid1G", highestNote: "hiE", highestChestNote: "hiC", highestFalsettoNote: "hiE", bpm: 76, difficulty: 4, highNoteFrequency: 4, falsettoFrequency: 4, longToneDifficulty: 5, breathingDifficulty: 3, rhythmDifficulty: 2, karaokeEase: 3, moods: ["切ない", "優しい", "ロマンチック"], genres: ["J-POP", "バラード"], features: ["デュエット", "ロングトーン", "ハーモニー"], similarSongIds: ["dry-flower", "subtitle"], similarArtists: ["井上苑子", "Official髭男dism"], thumbnailTone: "rose" },
  { id: "silhouette", title: "シルエット", artist: "KANA-BOON", genderCategory: "male", lowestNote: "mid1C", highestNote: "hiB", highestChestNote: "hiB", highestFalsettoNote: "hiB", bpm: 183, difficulty: 4, highNoteFrequency: 4, falsettoFrequency: 1, longToneDifficulty: 2, breathingDifficulty: 4, rhythmDifficulty: 3, karaokeEase: 3, moods: ["疾走感", "熱い", "青春"], genres: ["ロック"], features: ["地声中心", "アップテンポ", "バンドサウンド"], similarSongIds: ["chiisana-koi-no-uta", "ao-to-natsu"], similarArtists: ["ASIAN KUNG-FU GENERATION", "BLUE ENCOUNT"], thumbnailTone: "ink" },
  { id: "takane-no-hanakosan", title: "高嶺の花子さん", artist: "back number", genderCategory: "male", lowestNote: "mid1C", highestNote: "hiC", highestChestNote: "hiB", highestFalsettoNote: "hiC", bpm: 137, difficulty: 4, highNoteFrequency: 4, falsettoFrequency: 3, longToneDifficulty: 3, breathingDifficulty: 4, rhythmDifficulty: 3, karaokeEase: 3, moods: ["切ない", "爽快", "恋愛"], genres: ["J-POP", "ロック"], features: ["サビで高音", "言葉数が多い", "切ない表現"], similarSongIds: ["suiheisen", "dry-flower"], similarArtists: ["優里", "Saucy Dog"], thumbnailTone: "mint" },
  { id: "dry-flower", title: "ドライフラワー", artist: "優里", genderCategory: "male", lowestNote: "mid1B", highestNote: "hiC", highestChestNote: "hiB", highestFalsettoNote: "hiC", bpm: 74, difficulty: 3, highNoteFrequency: 3, falsettoFrequency: 3, longToneDifficulty: 4, breathingDifficulty: 3, rhythmDifficulty: 2, karaokeEase: 4, moods: ["切ない", "落ち着く", "恋愛"], genres: ["J-POP", "バラード"], features: ["語りかける歌い方", "抑揚", "ロングトーン"], similarSongIds: ["betelgeuse", "neko"], similarArtists: ["back number", "Saucy Dog"], thumbnailTone: "sand" },
  { id: "betelgeuse", title: "ベテルギウス", artist: "優里", genderCategory: "male", lowestNote: "mid1C", highestNote: "hiC", highestChestNote: "hiB", highestFalsettoNote: "hiC", bpm: 96, difficulty: 4, highNoteFrequency: 4, falsettoFrequency: 3, longToneDifficulty: 5, breathingDifficulty: 4, rhythmDifficulty: 2, karaokeEase: 3, moods: ["壮大", "切ない", "温かい"], genres: ["J-POP", "バラード"], features: ["ロングトーン", "声量変化", "サビが壮大"], similarSongIds: ["dry-flower", "suiheisen"], similarArtists: ["back number", "Novelbright"], thumbnailTone: "navy" },
  { id: "suiheisen", title: "水平線", artist: "back number", genderCategory: "male", lowestNote: "mid1C", highestNote: "hiB", highestChestNote: "hiA", highestFalsettoNote: "hiB", bpm: 74, difficulty: 3, highNoteFrequency: 3, falsettoFrequency: 3, longToneDifficulty: 4, breathingDifficulty: 3, rhythmDifficulty: 2, karaokeEase: 4, moods: ["優しい", "希望", "切ない"], genres: ["J-POP", "バラード"], features: ["ゆったり", "語尾の表現", "息継ぎ練習"], similarSongIds: ["kanade", "dry-flower"], similarArtists: ["優里", "スキマスイッチ"], thumbnailTone: "sky" },
  { id: "neko", title: "猫", artist: "DISH//", genderCategory: "male", lowestNote: "mid1B", highestNote: "hiB", highestChestNote: "hiA", highestFalsettoNote: "hiB", bpm: 77, difficulty: 3, highNoteFrequency: 3, falsettoFrequency: 3, longToneDifficulty: 4, breathingDifficulty: 3, rhythmDifficulty: 2, karaokeEase: 4, moods: ["切ない", "温かい", "夕暮れ"], genres: ["J-POP", "バラード"], features: ["柔らかな高音", "感情表現", "ミドルテンポ"], similarSongIds: ["dry-flower", "sayonara-elegy"], similarArtists: ["あいみょん", "優里"], thumbnailTone: "sunset" },
  { id: "citrus", title: "CITRUS", artist: "Da-iCE", genderCategory: "male", lowestNote: "mid1D", highestNote: "hiE", highestChestNote: "hiC", highestFalsettoNote: "hiE", bpm: 86, difficulty: 5, highNoteFrequency: 5, falsettoFrequency: 4, longToneDifficulty: 5, breathingDifficulty: 4, rhythmDifficulty: 4, karaokeEase: 1, moods: ["ドラマチック", "切ない", "力強い"], genres: ["J-POP", "ダンス"], features: ["ハイトーン", "声区切り替え", "表現力"], similarSongIds: ["pretender", "subtitle"], similarArtists: ["Official髭男dism", "Nissy"], thumbnailTone: "citrus" },
  { id: "pretender", title: "Pretender", artist: "Official髭男dism", genderCategory: "male", lowestNote: "mid1D", highestNote: "hiD", highestChestNote: "hiC", highestFalsettoNote: "hiD", bpm: 92, difficulty: 5, highNoteFrequency: 5, falsettoFrequency: 4, longToneDifficulty: 4, breathingDifficulty: 4, rhythmDifficulty: 4, karaokeEase: 2, moods: ["切ない", "都会的", "恋愛"], genres: ["J-POP", "ピアノポップ"], features: ["高音が連続", "細かなリズム", "ミックスボイス練習"], similarSongIds: ["subtitle", "citrus"], similarArtists: ["Mrs. GREEN APPLE", "Omoinotake"], thumbnailTone: "wine" },
  { id: "subtitle", title: "Subtitle", artist: "Official髭男dism", genderCategory: "male", lowestNote: "mid1D", highestNote: "hiD", highestChestNote: "hiB", highestFalsettoNote: "hiD", bpm: 104, difficulty: 5, highNoteFrequency: 5, falsettoFrequency: 4, longToneDifficulty: 4, breathingDifficulty: 5, rhythmDifficulty: 5, karaokeEase: 1, moods: ["冬", "切ない", "ドラマチック"], genres: ["J-POP", "バラード"], features: ["言葉数が多い", "高音が連続", "息継ぎが難しい"], similarSongIds: ["pretender", "tenbyo-no-uta"], similarArtists: ["Mrs. GREEN APPLE", "back number"], thumbnailTone: "ice" },
  { id: "lemon", title: "Lemon", artist: "米津玄師", genderCategory: "male", lowestNote: "mid1B", highestNote: "hiB", highestChestNote: "hiA", highestFalsettoNote: "hiB", bpm: 87, difficulty: 3, highNoteFrequency: 3, falsettoFrequency: 3, longToneDifficulty: 3, breathingDifficulty: 3, rhythmDifficulty: 3, karaokeEase: 4, moods: ["切ない", "静か", "叙情的"], genres: ["J-POP"], features: ["独特なリズム", "語尾の表現", "中音域中心"], similarSongIds: ["neko", "kanade"], similarArtists: ["菅田将暉", "星野源"], thumbnailTone: "lemon" },
  { id: "kanade", title: "奏", artist: "スキマスイッチ", genderCategory: "male", lowestNote: "mid1A", highestNote: "hiA", highestChestNote: "mid2G", highestFalsettoNote: "hiA", bpm: 72, difficulty: 2, highNoteFrequency: 2, falsettoFrequency: 2, longToneDifficulty: 4, breathingDifficulty: 2, rhythmDifficulty: 2, karaokeEase: 5, moods: ["優しい", "切ない", "卒業"], genres: ["J-POP", "バラード"], features: ["ゆったり", "初心者向け", "ロングトーン"], similarSongIds: ["suiheisen", "cherry"], similarArtists: ["秦基博", "back number"], thumbnailTone: "sage" },
  { id: "chiisana-koi-no-uta", title: "小さな恋のうた", artist: "MONGOL800", genderCategory: "male", lowestNote: "mid1C", highestNote: "hiB", highestChestNote: "hiB", highestFalsettoNote: "hiB", bpm: 116, difficulty: 3, highNoteFrequency: 4, falsettoFrequency: 1, longToneDifficulty: 3, breathingDifficulty: 4, rhythmDifficulty: 2, karaokeEase: 4, moods: ["青春", "熱い", "明るい"], genres: ["ロック", "パンク"], features: ["地声中心", "みんなで歌える", "声量"], similarSongIds: ["silhouette", "ao-to-natsu"], similarArtists: ["HY", "ロードオブメジャー"], thumbnailTone: "sun" },
  { id: "cherry", title: "チェリー", artist: "スピッツ", genderCategory: "male", lowestNote: "mid1A", highestNote: "hiA", highestChestNote: "mid2G", highestFalsettoNote: "hiA", bpm: 97, difficulty: 2, highNoteFrequency: 2, falsettoFrequency: 2, longToneDifficulty: 2, breathingDifficulty: 2, rhythmDifficulty: 2, karaokeEase: 5, moods: ["優しい", "春", "爽やか"], genres: ["J-POP", "ロック"], features: ["初心者向け", "中音域中心", "軽やか"], similarSongIds: ["kanade", "shin-takarajima"], similarArtists: ["Mr.Children", "スキマスイッチ"], thumbnailTone: "cherry" },
  { id: "shin-takarajima", title: "新宝島", artist: "サカナクション", genderCategory: "male", lowestNote: "mid1B", highestNote: "hiA", highestChestNote: "hiA", highestFalsettoNote: "hiA", bpm: 158, difficulty: 3, highNoteFrequency: 2, falsettoFrequency: 1, longToneDifficulty: 1, breathingDifficulty: 3, rhythmDifficulty: 4, karaokeEase: 4, moods: ["都会的", "楽しい", "ダンサブル"], genres: ["ロック", "ダンス"], features: ["リズム練習", "中音域中心", "アップテンポ"], similarSongIds: ["cherry", "silhouette"], similarArtists: ["星野源", "フレデリック"], thumbnailTone: "aqua" },
  { id: "sayonara-elegy", title: "さよならエレジー", artist: "菅田将暉", genderCategory: "male", lowestNote: "mid1B", highestNote: "hiB", highestChestNote: "hiA", highestFalsettoNote: "hiB", bpm: 155, difficulty: 3, highNoteFrequency: 3, falsettoFrequency: 2, longToneDifficulty: 2, breathingDifficulty: 3, rhythmDifficulty: 3, karaokeEase: 4, moods: ["熱い", "切ない", "ロック"], genres: ["J-POP", "ロック"], features: ["ハスキーな表現", "地声中心", "疾走感"], similarSongIds: ["kaiju-no-hanauta", "neko"], similarArtists: ["Vaundy", "あいみょん"], thumbnailTone: "brick" },
];

const fictionalSong = createSong({
  id: "yoake-no-canvas",
  title: "夜明けのキャンバス",
  artist: "Lumen Note",
  genderCategory: "mixed",
  lowestNote: "mid1C",
  highestNote: "hiC",
  highestChestNote: "hiA",
  highestFalsettoNote: "hiC",
  bpm: 92,
  difficulty: 3,
  highNoteFrequency: 3,
  falsettoFrequency: 3,
  longToneDifficulty: 4,
  breathingDifficulty: 3,
  rhythmDifficulty: 2,
  karaokeEase: 4,
  moods: ["希望", "透明感", "朝"],
  genres: ["J-POP", "バラード"],
  features: ["架空曲", "歌唱注釈デモ", "ミックスボイス", "ウィスパー"],
  description: "歌詞注釈と練習モードを安全に体験するため、このMVP専用に作成した架空の曲です。",
  singingTips: ["Aメロは息を急に使い切らず、言葉の輪郭を小さく保つ", "サビは地声からミックスへ段階的に響きを移す"],
  difficultPoints: ["サビ冒頭の声量アップとミックスの重なり", "ロングトーン中に音程を保ったままビブラートへ移る部分"],
  similarSongIds: ["suiheisen", "kanade"],
  similarArtists: ["Luminous Days", "Aster"],
  thumbnailTone: "dawn",
  isFictional: true,
  lyricsStatus: "available",
});

export const songs: Song[] = [fictionalSong, ...realSongSeeds.map(createSong)];

export const moods = [...new Set(songs.flatMap((song) => song.moods))].sort();
export const genres = [...new Set(songs.flatMap((song) => song.genres))].sort();

export function getSongById(id: string): Song | undefined {
  return songs.find((song) => song.id === id);
}

export function getFiveLevelLabel(level: FiveLevel): string {
  return ["", "とても少ない", "少ない", "ふつう", "多い", "とても多い"][level];
}
