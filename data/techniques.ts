import type { VocalTechnique } from "@/types/song";

export type TechniqueDefinition = {
  id: VocalTechnique;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  background: string;
  border: string;
  marker: string;
};

/** 技法の追加・名称変更・配色変更をUIから切り離した一覧です。 */
export const techniqueDefinitions: Record<VocalTechnique, TechniqueDefinition> = {
  chest: { id: "chest", label: "地声", shortLabel: "地", description: "話し声に近い芯のある声区", color: "#9f2d24", background: "#fff0ed", border: "#e97d72", marker: "●" },
  head: { id: "head", label: "裏声", shortLabel: "裏", description: "頭部に響きを集める軽い声区", color: "#245a9f", background: "#edf5ff", border: "#72a7e9", marker: "○" },
  falsetto: { id: "falsetto", label: "ファルセット", shortLabel: "F", description: "息を含ませた柔らかな裏声", color: "#1f6b92", background: "#eaf8ff", border: "#62b7de", marker: "◌" },
  mix: { id: "mix", label: "ミックスボイス", shortLabel: "M", description: "地声と裏声の響きを滑らかにつなぐ発声", color: "#6a3ba1", background: "#f6efff", border: "#a980d4", marker: "◆" },
  whisper: { id: "whisper", label: "ウィスパー", shortLabel: "W", description: "息を多めに混ぜた繊細な声", color: "#18765d", background: "#ebfbf5", border: "#63b89e", marker: "≈" },
  edge: { id: "edge", label: "エッジボイス", shortLabel: "E", description: "声帯の閉鎖を感じる粒立った発声", color: "#663f32", background: "#f8f1ed", border: "#b08a78", marker: "≋" },
  belt: { id: "belt", label: "ベルティング", shortLabel: "B", description: "明るく強い響きで高音を押し出す発声", color: "#a52a45", background: "#fff0f4", border: "#dd7891", marker: "▲" },
  breath: { id: "breath", label: "ブレス", shortLabel: "息", description: "次のフレーズに備える吸気位置", color: "#116b83", background: "#e8f9fd", border: "#63bfd2", marker: "↙" },
  accent: { id: "accent", label: "アクセント", shortLabel: "強", description: "言葉の頭や拍を際立たせる", color: "#8a4f00", background: "#fff8e6", border: "#e0ad4f", marker: "_" },
  longTone: { id: "longTone", label: "ロングトーン", shortLabel: "長", description: "音程と息を保って伸ばす", color: "#385f7d", background: "#eef6fb", border: "#7faac7", marker: "―" },
  vibrato: { id: "vibrato", label: "ビブラート", shortLabel: "V", description: "伸ばす音を一定の周期で揺らす", color: "#7b4173", background: "#fbf0f8", border: "#bd7bb3", marker: "〰" },
  scoop: { id: "scoop", label: "しゃくり", shortLabel: "↑", description: "低い音から目的の音へ滑らかに上げる", color: "#536c1c", background: "#f4fae9", border: "#9ab55e", marker: "↗" },
  fall: { id: "fall", label: "フォール", shortLabel: "↓", description: "語尾の音程を自然に落とす", color: "#6f571e", background: "#fbf6e9", border: "#b9a164", marker: "↘" },
  kobushi: { id: "kobushi", label: "こぶし", shortLabel: "こ", description: "短く複数の音を往復する装飾", color: "#765029", background: "#faf3e9", border: "#b68c5f", marker: "∞" },
  volumeUp: { id: "volumeUp", label: "声量アップ", shortLabel: "+", description: "フレーズの流れに沿って声量を上げる", color: "#963a23", background: "#fff2eb", border: "#d8896e", marker: "+" },
  volumeDown: { id: "volumeDown", label: "声量ダウン", shortLabel: "−", description: "語尾へ向けて声量を絞る", color: "#32617b", background: "#eef7fb", border: "#82aec3", marker: "−" },
  connect: { id: "connect", label: "音をつなぐ", shortLabel: "連", description: "母音と子音を途切れさせずにつなぐ", color: "#35664c", background: "#edf8f2", border: "#7faf93", marker: "⌒" },
  cut: { id: "cut", label: "音を切る", shortLabel: "切", description: "語尾や休符で音を明確に止める", color: "#644f71", background: "#f6f1f8", border: "#9e89aa", marker: "｜" },
  caution: { id: "caution", label: "注意点", shortLabel: "!", description: "喉や息の使い方に注意が必要", color: "#785b00", background: "#fff8d9", border: "#d6b84e", marker: "!" },
  other: { id: "other", label: "その他", shortLabel: "他", description: "上記以外の表現メモ", color: "#4b5563", background: "#f3f4f6", border: "#9ca3af", marker: "•" },
};

export const primaryLegendTechniques: VocalTechnique[] = [
  "chest",
  "head",
  "mix",
  "whisper",
  "breath",
  "accent",
  "longTone",
  "caution",
];
