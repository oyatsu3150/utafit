import type { LyricAnnotation, LyricLine, SongSection, VocalTechnique } from "@/types/song";

export const songSections: SongSection[] = [
  { id: "yoake-verse-a", songId: "yoake-no-canvas", type: "verseA", name: "Aメロ", order: 1, startTimeMs: 12000, endTimeMs: 42000, difficulty: 2, highestNote: "mid2E", lowestNote: "mid1C", primaryTechniques: ["whisper", "chest", "breath"], singingPoints: ["音量を抑え、子音を強く当てすぎない", "2行をひと息で急がず、指定位置で短く吸う"], difficultPhrases: ["名前のない息を描く"], breathPositions: ["朝に／名前のない"], practiceMethods: ["まず小声で朗読する", "4拍で息を吐き切らない練習をする"] },
  { id: "yoake-verse-b", songId: "yoake-no-canvas", type: "verseB", name: "Bメロ", order: 2, startTimeMs: 43000, endTimeMs: 65000, difficulty: 3, highestNote: "mid2G", lowestNote: "mid1E", primaryTechniques: ["connect", "volumeUp", "mix"], singingPoints: ["母音をつないでサビへ向かう", "声量より先に響きを上へ移す"], difficultPhrases: ["ほどけない夜も連れて"], breathPositions: ["夜も／連れて"], practiceMethods: ["母音だけでレガート練習", "半音下げてミックスの位置を確認"] },
  { id: "yoake-chorus", songId: "yoake-no-canvas", type: "chorus", name: "サビ", order: 3, startTimeMs: 66000, endTimeMs: 98000, difficulty: 4, highestNote: "hiC", lowestNote: "mid2A", primaryTechniques: ["mix", "longTone", "vibrato", "volumeUp"], singingPoints: ["高音を押し上げず、母音を縦にまとめる", "ロングトーンの後半だけ薄くビブラートを加える"], difficultPhrases: ["朝の光を抱いて"], breathPositions: ["ひらく／朝の光を"], practiceMethods: ["ロングトーンを4拍から練習", "ミックス部分を『ねい』の発音で確認"] },
  { id: "yoake-bridge", songId: "yoake-no-canvas", type: "bridge", name: "ブリッジ", order: 4, startTimeMs: 99000, endTimeMs: 121000, difficulty: 3, highestNote: "hiA", lowestNote: "mid1G", primaryTechniques: ["head", "volumeDown", "fall"], singingPoints: ["一度声量を落としてラスサビとの対比を作る"], difficultPhrases: ["静けさに預けよう"], breathPositions: ["痛みは／静けさに"], practiceMethods: ["息だけでフレーズの流れを確認"] },
  { id: "yoake-last-chorus", songId: "yoake-no-canvas", type: "lastChorus", name: "ラスサビ", order: 5, startTimeMs: 122000, endTimeMs: 158000, difficulty: 4, highestNote: "hiC", lowestNote: "mid2A", primaryTechniques: ["mix", "belt", "longTone", "vibrato"], singingPoints: ["強さは喉ではなく息と響きで作る", "最後の音まで姿勢を崩さない"], difficultPhrases: ["明日を描いてゆく"], breathPositions: ["何度でも／明日を"], practiceMethods: ["サビ単体で3回までに区切る", "最後に原曲想定キーへ戻す"] },
];

export const lyricLines: LyricLine[] = [
  { id: "yoake-line-1", songId: "yoake-no-canvas", sectionId: "yoake-verse-a", order: 1, text: "まだ白い朝に　名前のない息を描く", readingText: "まだしろいあさになまえのないいきをえがく", startTimeMs: 12000, endTimeMs: 26000 },
  { id: "yoake-line-2", songId: "yoake-no-canvas", sectionId: "yoake-verse-a", order: 2, text: "窓辺の風が　小さな背中を押した", readingText: "まどべのかぜがちいさなせなかをおした", startTimeMs: 27000, endTimeMs: 42000 },
  { id: "yoake-line-3", songId: "yoake-no-canvas", sectionId: "yoake-verse-b", order: 3, text: "ほどけない夜も　この声に連れて", readingText: "ほどけないよるもこのこえにつれて", startTimeMs: 43000, endTimeMs: 54000 },
  { id: "yoake-line-4", songId: "yoake-no-canvas", sectionId: "yoake-verse-b", order: 4, text: "一歩ずつ色を重ねよう", readingText: "いっぽずついろをかさねよう", startTimeMs: 55000, endTimeMs: 65000 },
  { id: "yoake-line-5", songId: "yoake-no-canvas", sectionId: "yoake-chorus", order: 5, text: "こころをひらく　朝の光を抱いて", readingText: "こころをひらくあさのひかりをだいて", startTimeMs: 66000, endTimeMs: 82000 },
  { id: "yoake-line-6", songId: "yoake-no-canvas", sectionId: "yoake-chorus", order: 6, text: "昨日より自由な空へ", readingText: "きのうよりじゆうなそらへ", startTimeMs: 83000, endTimeMs: 98000 },
  { id: "yoake-line-7", songId: "yoake-no-canvas", sectionId: "yoake-bridge", order: 7, text: "痛みは静けさに預けよう", readingText: "いたみはしずけさにあずけよう", startTimeMs: 99000, endTimeMs: 121000 },
  { id: "yoake-line-8", songId: "yoake-no-canvas", sectionId: "yoake-last-chorus", order: 8, text: "何度でも光を集めて", readingText: "なんどでもひかりをあつめて", startTimeMs: 122000, endTimeMs: 138000 },
  { id: "yoake-line-9", songId: "yoake-no-canvas", sectionId: "yoake-last-chorus", order: 9, text: "明日を描いてゆく", readingText: "あしたをえがいてゆく", startTimeMs: 139000, endTimeMs: 158000 },
];

type AnnotationSeed = Omit<LyricAnnotation, "id" | "startIndex" | "endIndex"> & { fragment: string };
const lineMap = new Map(lyricLines.map((line) => [line.id, line]));

function createAnnotation(seed: AnnotationSeed, index: number): LyricAnnotation {
  const line = lineMap.get(seed.lyricLineId);
  if (!line) throw new Error(`歌詞行が見つかりません: ${seed.lyricLineId}`);
  const startIndex = line.text.indexOf(seed.fragment);
  if (startIndex === -1) throw new Error(`注釈対象が見つかりません: ${seed.fragment}`);
  const { fragment, ...annotation } = seed;
  return { ...annotation, id: `annotation-${index + 1}`, startIndex, endIndex: startIndex + fragment.length };
}

const annotationSeeds: AnnotationSeed[] = [
  { lyricLineId: "yoake-line-1", fragment: "まだ白い", techniques: ["whisper", "head"], noteName: "mid1E", octave: 3, difficulty: 2, reason: "曲の始まりに余白を作り、朝の静けさを表現するため。", singingTip: "息を先に流し、その上へ細い声を置きます。", caution: "息だけにならないよう、語頭に小さな芯を残します。", referenceDescription: "近い距離で語りかけるような軽い発声。", recommendedRegister: "裏声寄りの軽い中声区", originalStyle: "架空の原曲想定では、息を多く含む裏声で始めます。", beginnerAlternative: "小さな地声で、音量を一定に保って歌っても構いません。", status: "approved" },
  { lyricLineId: "yoake-line-1", fragment: "朝に", techniques: ["breath", "cut"], difficulty: 1, reason: "次の長いフレーズへ備えるため。", singingTip: "『に』を短く切り、口を閉じずに素早く吸います。", beginnerAlternative: "朝に、の後で一度完全に止めて吸ってください。", status: "approved" },
  { lyricLineId: "yoake-line-1", fragment: "息を描く", techniques: ["connect", "volumeUp"], noteName: "mid2E", difficulty: 3, reason: "Bメロへ向かう流れを作るため。", singingTip: "母音をつなぎ、最後だけ少し前へ響かせます。", caution: "声量を上げるときも喉を押さないでください。", beginnerAlternative: "音量は変えず、言葉だけを滑らかにつなぎます。", status: "approved" },
  { lyricLineId: "yoake-line-3", fragment: "ほどけない夜も", techniques: ["chest", "accent"], noteName: "mid2D", difficulty: 3, reason: "言葉の決意を明確にするため。", singingTip: "『ほ』と『よ』の子音を少しだけ強くします。", beginnerAlternative: "太字の語頭だけ明瞭に発音します。", status: "approved" },
  { lyricLineId: "yoake-line-3", fragment: "この声に連れて", techniques: ["connect", "mix", "volumeUp"], noteName: "mid2G", difficulty: 4, reason: "サビの高い響きへ滑らかに移るため。", singingTip: "声量ではなく、鼻の奥へ響きを移す感覚で歌います。", caution: "『こえ』で顎を上げないでください。", beginnerAlternative: "半音から全音下げて、地声と裏声の境目を確認します。", status: "approved" },
  { lyricLineId: "yoake-line-5", fragment: "こころをひらく", techniques: ["chest", "volumeUp"], noteName: "mid2G", difficulty: 3, reason: "サビの入口をはっきり示すため。", singingTip: "最初から最大音量にせず、フレーズ内で徐々に広げます。", beginnerAlternative: "中くらいの声量で一定に歌います。", status: "approved" },
  { lyricLineId: "yoake-line-5", fragment: "朝の光を", techniques: ["volumeUp"], noteName: "hiA", difficulty: 3, reason: "メロディーの頂点へ向かう方向を示すため。", singingTip: "口の奥を縦に保ち、母音を明るくします。", status: "approved" },
  { lyricLineId: "yoake-line-5", fragment: "光を", techniques: ["mix", "longTone", "caution"], noteName: "hiC", octave: 5, difficulty: 4, reason: "曲の象徴となる高音を、強さと透明感の両方で聴かせるため。", singingTip: "『か』で押さず、『り』の母音へ響きを集めて伸ばします。", caution: "喉が締まる場合はすぐにキーを下げ、連続練習を避けます。", referenceDescription: "ミックスで入ってまっすぐ伸ばす高音。", recommendedRegister: "裏声寄りのミックス", originalStyle: "架空の原曲想定では、後半だけ細いビブラートを加えます。", beginnerAlternative: "裏声に置き換え、ロングトーンを2拍に短くします。", status: "approved" },
  { lyricLineId: "yoake-line-5", fragment: "抱いて", techniques: ["fall", "volumeDown"], noteName: "mid2E", difficulty: 2, reason: "次の行へ向けて余韻を残すため。", singingTip: "語尾だけ自然に音程と音量を下げます。", beginnerAlternative: "音程は下げず、音量だけ小さくします。", status: "approved" },
  { lyricLineId: "yoake-line-6", fragment: "自由な空へ", techniques: ["head", "longTone", "vibrato"], noteName: "hiB", difficulty: 4, reason: "解放感を柔らかく表現するため。", singingTip: "伸ばし始めはまっすぐ、後半だけ小さく揺らします。", caution: "ビブラートを顎で作らないでください。", beginnerAlternative: "裏声でまっすぐ2拍伸ばします。", status: "approved" },
  { lyricLineId: "yoake-line-7", fragment: "静けさに", techniques: ["head", "volumeDown"], noteName: "mid2E", difficulty: 2, reason: "ラスサビ前に音量と質感の対比を作るため。", singingTip: "息の流れは止めず、声の芯だけを細くします。", beginnerAlternative: "小さな地声でも構いません。", status: "approved" },
  { lyricLineId: "yoake-line-7", fragment: "預けよう", techniques: ["fall", "breath"], noteName: "mid1G", difficulty: 2, reason: "フレーズを落ち着かせ、次の大きな吸気へつなぐため。", singingTip: "語尾を落とした直後に静かに吸います。", status: "approved" },
  { lyricLineId: "yoake-line-8", fragment: "何度でも", techniques: ["chest", "accent"], noteName: "mid2E", difficulty: 3, reason: "ラスサビの意志を言葉で伝えるため。", singingTip: "『な』を強くしすぎず、拍の頭を揃えます。", beginnerAlternative: "リズムだけを手拍子で確認してから歌います。", status: "approved" },
  { lyricLineId: "yoake-line-8", fragment: "光を集めて", techniques: ["mix", "connect", "volumeUp"], noteName: "hiA", difficulty: 4, reason: "最後の最高音へ向けてエネルギーを保つため。", singingTip: "母音を途切れさせず、一息で前へ運びます。", caution: "息が不足する場合は『光を』の前で短く吸います。", beginnerAlternative: "『光を』の前に追加ブレスを入れます。", status: "approved" },
  { lyricLineId: "yoake-line-9", fragment: "明日を描いて", techniques: ["belt", "mix", "longTone", "caution"], noteName: "hiC", difficulty: 5, reason: "曲の最後の到達点を力強く示すため。", singingTip: "下腹部の支えを保ち、母音を狭めすぎないようにします。", caution: "ベルティングは痛みや枯れを感じたら中止してください。", referenceDescription: "明るいミックスを土台にした強い高音。", recommendedRegister: "地声寄りのミックス", originalStyle: "架空の原曲想定では、芯を残したミックスで4拍伸ばします。", beginnerAlternative: "裏声へ置き換えるか、キーを2つ下げて歌います。", status: "approved" },
  { lyricLineId: "yoake-line-9", fragment: "ゆく", techniques: ["vibrato", "volumeDown"], noteName: "hiA", difficulty: 3, reason: "緊張を解いて余韻を作るため。", singingTip: "最後の1拍だけ自然に揺らし、音量を落とします。", beginnerAlternative: "揺らさず、まっすぐ小さく終えます。", status: "approved" },
];

export const lyricAnnotations: LyricAnnotation[] = annotationSeeds.map(createAnnotation);

export function getSectionsForSong(songId: string): SongSection[] {
  return songSections.filter((section) => section.songId === songId).sort((a, b) => a.order - b.order);
}

export function getLinesForSong(songId: string): LyricLine[] {
  return lyricLines.filter((line) => line.songId === songId).sort((a, b) => a.order - b.order);
}

export function getAnnotationsForLine(lineId: string): LyricAnnotation[] {
  return lyricAnnotations.filter((annotation) => annotation.lyricLineId === lineId);
}

export function getTechniqueUsageForSong(songId: string): VocalTechnique[] {
  const lineIds = new Set(getLinesForSong(songId).map((line) => line.id));
  return [...new Set(lyricAnnotations.filter((annotation) => lineIds.has(annotation.lyricLineId)).flatMap((annotation) => annotation.techniques))];
}
