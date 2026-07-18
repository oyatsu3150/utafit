"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ChevronRight, Layers3, Music, Sparkles, X } from "lucide-react";
import { primaryLegendTechniques, techniqueDefinitions } from "@/data/techniques";
import { buildAnnotatedSegments } from "@/lib/annotations";
import type { LyricAnnotation, LyricLine, SongSection, VocalTechnique } from "@/types/song";

type DisplayMode = "all" | "voice" | "pitch" | "breath" | "caution";
const voiceTechniques = new Set<VocalTechnique>(["chest", "head", "falsetto", "mix", "whisper", "edge", "belt"]);

const displayModes: { id: DisplayMode; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "voice", label: "発声方法" },
  { id: "pitch", label: "音高" },
  { id: "breath", label: "ブレス" },
  { id: "caution", label: "注意点" },
];

function filterAnnotations(annotations: LyricAnnotation[], mode: DisplayMode) {
  if (mode === "all") return annotations;
  if (mode === "pitch") return annotations.filter((annotation) => annotation.noteName);
  if (mode === "breath") return annotations.filter((annotation) => annotation.techniques.includes("breath"));
  if (mode === "caution") return annotations.filter((annotation) => annotation.techniques.includes("caution") || annotation.caution);
  return annotations.filter((annotation) => annotation.techniques.some((technique) => voiceTechniques.has(technique)));
}

export function AnnotatedLyrics({ sections, lines, annotations }: { sections: SongSection[]; lines: LyricLine[]; annotations: LyricAnnotation[] }) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("all");
  const [selectedAnnotations, setSelectedAnnotations] = useState<LyricAnnotation[]>([]);

  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];
  const activeLines = useMemo(() => lines.filter((line) => line.sectionId === activeSection?.id), [activeSection?.id, lines]);

  if (!activeSection) return null;

  return (
    <div>
      <div className="rounded-[1.4rem] border border-[var(--line)] bg-[#f8f6f2] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black text-[var(--muted)]">表示する情報</p>
            <div className="mt-2 flex flex-wrap gap-2" role="tablist" aria-label="歌詞注釈の表示切り替え">
              {displayModes.map((mode) => (
                <button key={mode.id} type="button" role="tab" aria-selected={displayMode === mode.id} onClick={() => setDisplayMode(mode.id)} className={`rounded-full px-3 py-2 text-xs font-black transition ${displayMode === mode.id ? "bg-[var(--ink)] text-white" : "border border-[var(--line)] bg-white text-[#5d5851] hover:border-[var(--ink)]"}`}>{mode.label}</button>
              ))}
            </div>
          </div>
          <p className="flex max-w-md items-start gap-2 text-xs font-semibold leading-5 text-[var(--muted)]"><Layers3 className="mt-0.5 shrink-0 text-[var(--accent)]" size={16} />色に加えて、略号・下線・二重線で技法と重なりを表しています。</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div className="flex min-w-max gap-2" role="tablist" aria-label="曲のセクション">
          {sections.map((section) => (
            <button key={section.id} type="button" role="tab" aria-selected={activeSection.id === section.id} onClick={() => { setActiveSectionId(section.id); setSelectedAnnotations([]); }} className={`rounded-full px-4 py-2.5 text-sm font-black transition ${activeSection.id === section.id ? "bg-[var(--accent)] text-white" : "border border-[var(--line)] bg-white hover:border-[var(--ink)]"}`}>{section.name}<span className="ml-2 text-[10px] opacity-75">Lv.{section.difficulty}</span></button>
          ))}
        </div>
      </div>

      <section className="mt-4 rounded-[1.5rem] border border-[var(--line)] bg-white p-5 sm:p-7" aria-label={`${activeSection.name}の情報`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="eyebrow">Section {String(activeSection.order).padStart(2, "0")}</p><h3 className="mt-2 text-2xl font-black">{activeSection.name}</h3><p className="mt-2 text-sm text-[var(--muted)]">{activeSection.lowestNote} — {activeSection.highestNote} ・ 難易度 {activeSection.difficulty}/5</p></div>
          <div className="flex flex-wrap gap-2">{activeSection.primaryTechniques.map((technique) => { const definition = techniqueDefinitions[technique]; return <span key={technique} className="rounded-full px-3 py-1.5 text-xs font-black" style={{ color: definition.color, background: definition.background, border: `1px solid ${definition.border}` }}>{definition.marker} {definition.label}</span>; })}</div>
        </div>
        <div className="mt-5 grid gap-4 border-t border-dashed border-[var(--line)] pt-5 sm:grid-cols-2">
          <InfoList title="歌唱ポイント" items={activeSection.singingPoints} />
          <InfoList title="練習方法" items={activeSection.practiceMethods} />
        </div>
      </section>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-white px-5 py-7 sm:px-8 sm:py-9">
          <div className="flex items-center gap-2 text-xs font-black text-[var(--muted)]"><Sparkles size={15} className="text-[var(--accent)]" />色のついた言葉をクリックすると解説が開きます</div>
          <div className="mt-7 space-y-7">
            {activeLines.map((line) => {
              const lineAnnotations = annotations.filter((annotation) => annotation.lyricLineId === line.id && annotation.status !== "hidden");
              const segments = buildAnnotatedSegments(line.text, lineAnnotations);
              return (
                <div key={line.id} className="flex gap-3 sm:gap-5">
                  <span className="mt-2 min-w-6 text-right text-[10px] font-black tabular-nums text-[#aaa39a]">{String(line.order).padStart(2, "0")}</span>
                  <p className="min-w-0 text-xl font-bold leading-[2.25] tracking-[0.025em] sm:text-2xl">
                    {segments.map((segment) => {
                      const visible = filterAnnotations(segment.annotations, displayMode);
                      if (visible.length === 0) return <span key={`${line.id}-${segment.startIndex}`}>{segment.text}</span>;
                      const techniques = [...new Set(visible.flatMap((annotation) => annotation.techniques))];
                      const primary = techniqueDefinitions[techniques[0] ?? "other"];
                      const label = techniques.slice(0, 3).map((technique) => techniqueDefinitions[technique].shortLabel).join("・");
                      return (
                        <button
                          key={`${line.id}-${segment.startIndex}`}
                          type="button"
                          className="annotation-segment inline"
                          data-overlap={visible.length > 1 || techniques.length > 1}
                          style={{ color: primary.color, background: primary.background, borderColor: primary.border }}
                          onClick={() => setSelectedAnnotations(visible)}
                          aria-label={`${segment.text}：${techniques.map((technique) => techniqueDefinitions[technique].label).join("、")}`}
                        >
                          {segment.text}<sup className="ml-1 align-top text-[8px] font-black sm:text-[9px]">{label}</sup>
                        </button>
                      );
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <AnnotationDetails annotations={selectedAnnotations} onClose={() => setSelectedAnnotations([])} />
      </div>

      <section className="mt-6 rounded-[1.4rem] border border-[var(--line)] bg-white p-5" aria-label="歌唱技法の凡例">
        <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-black">凡例</p><p className="mt-1 text-xs text-[var(--muted)]">色だけでなく記号と名称でも判別できます。</p></div><Music size={18} className="text-[var(--accent)]" /></div>
        <div className="mt-4 flex flex-wrap gap-2">
          {primaryLegendTechniques.map((technique) => { const definition = techniqueDefinitions[technique]; return <span key={technique} className="rounded-lg px-3 py-2 text-xs font-black" style={{ color: definition.color, background: definition.background, border: `1px solid ${definition.border}` }}>{definition.marker} {definition.label}</span>; })}
        </div>
      </section>
    </div>
  );
}

function AnnotationDetails({ annotations, onClose }: { annotations: LyricAnnotation[]; onClose: () => void }) {
  if (annotations.length === 0) {
    return <aside className="sticky top-24 rounded-[1.5rem] border border-dashed border-[#d9d3cb] bg-[#f8f6f2] p-6 text-center"><ChevronRight className="mx-auto text-[#aaa39a]" size={24} /><p className="mt-4 text-sm font-black">歌詞を選んでください</p><p className="mt-2 text-xs leading-5 text-[var(--muted)]">歌い方の理由、コツ、注意点、初心者向けの代替方法をここに表示します。</p></aside>;
  }

  return (
    <aside className="sticky top-24 max-h-[calc(100svh-7rem)] overflow-y-auto rounded-[1.5rem] border border-[var(--line)] bg-[var(--ink)] p-5 text-white shadow-2xl">
      <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/55">Singing note</p><h3 className="mt-2 text-lg font-black">この部分の歌い方</h3></div><button type="button" onClick={onClose} aria-label="解説を閉じる" className="grid size-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"><X size={17} /></button></div>
      <div className="mt-5 space-y-4">
        {annotations.map((annotation) => (
          <div key={annotation.id} className="rounded-2xl bg-white p-4 text-[var(--ink)]">
            <div className="flex flex-wrap gap-1.5">{annotation.techniques.map((technique) => { const definition = techniqueDefinitions[technique]; return <span key={technique} className="rounded-full px-2.5 py-1 text-[10px] font-black" style={{ color: definition.color, background: definition.background }}>{definition.marker} {definition.label}</span>; })}</div>
            <dl className="mt-4 space-y-3 text-xs leading-5">
              {(annotation.noteName || annotation.recommendedRegister) && <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#f5f2ed] p-3"><div><dt className="font-bold text-[var(--muted)]">音高</dt><dd className="mt-1 font-black">{annotation.noteName ?? "—"}</dd></div><div><dt className="font-bold text-[var(--muted)]">推奨声区</dt><dd className="mt-1 font-black">{annotation.recommendedRegister ?? "技法ラベル参照"}</dd></div></div>}
              <DetailRow label="使う理由" value={annotation.reason} />
              <DetailRow label="歌うコツ" value={annotation.singingTip} />
              <DetailRow label="短い説明" value={annotation.referenceDescription} />
              <DetailRow label="原曲での歌い方" value={annotation.originalStyle} />
              {annotation.caution && <div className="rounded-xl border border-[#ead38b] bg-[#fff9df] p-3 text-[#66500a]"><dt className="flex items-center gap-1.5 font-black"><AlertTriangle size={14} />発声上の注意</dt><dd className="mt-1">{annotation.caution}</dd></div>}
              <DetailRow label="初心者向け代替" value={annotation.beginnerAlternative} />
              {annotation.difficulty && <div><dt className="font-bold text-[var(--muted)]">難易度</dt><dd className="mt-1 font-black">{annotation.difficulty}/5</dd></div>}
            </dl>
          </div>
        ))}
      </div>
    </aside>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return <div><dt className="font-bold text-[var(--muted)]">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>;
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return <div><p className="text-xs font-black text-[var(--muted)]">{title}</p><ul className="mt-2 space-y-2">{items.map((item) => <li key={item} className="flex gap-2 text-sm font-semibold leading-6"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />{item}</li>)}</ul></div>;
}
