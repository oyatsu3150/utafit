"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Eye, Save, Sparkles } from "lucide-react";
import { techniqueDefinitions } from "@/data/techniques";
import { buildAnnotatedSegments, isValidAnnotationRange } from "@/lib/annotations";
import { NOTE_NAMES } from "@/lib/notes";
import type { FiveLevel, LyricAnnotation, LyricLine, Song, SongSection, VocalTechnique } from "@/types/song";

const techniqueIds = Object.keys(techniqueDefinitions) as VocalTechnique[];

export function AdminAnnotationEditor({ song, lines, sections, initialAnnotations }: { song: Song; lines: LyricLine[]; sections: SongSection[]; initialAnnotations: LyricAnnotation[] }) {
  const [selectedLineId, setSelectedLineId] = useState(lines[0]?.id ?? "");
  const [selection, setSelection] = useState({ startIndex: 0, endIndex: 0 });
  const [selectedTechniques, setSelectedTechniques] = useState<VocalTechnique[]>(["chest"]);
  const [noteName, setNoteName] = useState<string>("mid2A");
  const [difficulty, setDifficulty] = useState<FiveLevel>(3);
  const [reason, setReason] = useState("");
  const [singingTip, setSingingTip] = useState("");
  const [caution, setCaution] = useState("");
  const [beginnerAlternative, setBeginnerAlternative] = useState("");
  const [annotations, setAnnotations] = useState(initialAnnotations);
  const [saveMessage, setSaveMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const line = lines.find((item) => item.id === selectedLineId) ?? lines[0];
  const section = sections.find((item) => item.id === line?.sectionId);
  const lineAnnotations = useMemo(() => annotations.filter((annotation) => annotation.lyricLineId === line?.id), [annotations, line?.id]);
  const selectedText = line?.text.slice(selection.startIndex, selection.endIndex) ?? "";

  function captureSelection() {
    const element = textareaRef.current;
    if (!element) return;
    setSelection({ startIndex: element.selectionStart, endIndex: element.selectionEnd });
  }

  function toggleTechnique(technique: VocalTechnique) {
    setSelectedTechniques((current) => current.includes(technique) ? current.filter((item) => item !== technique) : [...current, technique]);
  }

  function addAnnotation() {
    if (!line || !selectedTechniques.length) return;
    const candidate: LyricAnnotation = { id: `local-${Date.now()}`, lyricLineId: line.id, startIndex: selection.startIndex, endIndex: selection.endIndex, techniques: selectedTechniques, noteName, difficulty, reason: reason || undefined, singingTip: singingTip || undefined, caution: caution || undefined, beginnerAlternative: beginnerAlternative || undefined, status: "draft" };
    if (!isValidAnnotationRange(line.text, candidate)) { setSaveMessage("先に歌詞の一部を選択してください。"); return; }
    setAnnotations((current) => [...current, candidate]);
    setSaveMessage(`「${selectedText}」へ下書き注釈を追加しました。`);
  }

  function saveDrafts() {
    window.localStorage.setItem(`utafit-admin-annotations-${song.id}`, JSON.stringify(annotations));
    setSaveMessage("この端末に下書きを保存しました。データベースへの保存はPhase 2で接続します。");
  }

  function publishLocalDrafts() {
    setAnnotations((current) => current.map((annotation) => annotation.status === "draft" ? { ...annotation, status: "approved" } : annotation));
    setSaveMessage("ローカルプレビュー上で公開状態にしました。本番公開は管理者認証導入後に有効化します。");
  }

  if (!line) return null;

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
      <div className="space-y-6">
        <section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Step 1</p><h2 className="mt-2 text-xl font-black">歌詞の行と範囲を選ぶ</h2></div><label className="grid gap-1.5 text-xs font-black">歌詞行<select value={selectedLineId} onChange={(event) => { setSelectedLineId(event.target.value); setSelection({ startIndex: 0, endIndex: 0 }); }} className="min-h-11 rounded-xl border border-[var(--line)] bg-[#fbfaf7] px-3 text-sm font-bold">{lines.map((item) => <option key={item.id} value={item.id}>{sections.find((candidate) => candidate.id === item.sectionId)?.name} / {item.text}</option>)}</select></label></div>
          <p className="mt-5 text-xs font-bold text-[var(--muted)]">下の歌詞をマウスでドラッグ、またはスマートフォンで長押しして選択してください。</p>
          <textarea ref={textareaRef} readOnly value={line.text} onSelect={captureSelection} onMouseUp={captureSelection} onTouchEnd={captureSelection} className="mt-3 min-h-32 w-full resize-none rounded-2xl border-2 border-dashed border-[#d7d0c7] bg-[#fbfaf7] p-5 text-xl font-black leading-9 selection:bg-[#ffd0c5] focus:border-[var(--accent)] sm:text-2xl" aria-label="注釈対象を選択する歌詞" />
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs"><span className="rounded-full bg-[#f2efe9] px-3 py-1.5 font-black">範囲 {selection.startIndex}〜{selection.endIndex}</span><span className="font-bold text-[var(--muted)]">選択中：<strong className="text-[var(--accent-dark)]">{selectedText || "未選択"}</strong></span></div>
        </section>

        <section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-5 sm:p-7">
          <p className="eyebrow">Step 2</p><h2 className="mt-2 text-xl font-black">歌唱方法を設定する</h2><p className="mt-2 text-xs font-bold text-[var(--muted)]">複数選択できます。技法一覧はデータ定義から増減できます。</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{techniqueIds.map((technique) => { const definition = techniqueDefinitions[technique]; const checked = selectedTechniques.includes(technique); return <label key={technique} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-3 text-xs font-black ${checked ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)]"}`}><input type="checkbox" checked={checked} onChange={() => toggleTechnique(technique)} className="size-4 accent-[var(--accent)]" /><span style={{ color: definition.color }}>{definition.marker} {definition.label}</span></label>; })}</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2"><FieldSelect label="音高" value={noteName} onChange={setNoteName} options={NOTE_NAMES.map((note) => ({ value: note, label: note }))} /><FieldSelect label="難易度" value={String(difficulty)} onChange={(value) => setDifficulty(Number(value) as FiveLevel)} options={[1, 2, 3, 4, 5].map((level) => ({ value: String(level), label: `${level}/5` }))} /><TextField label="この歌い方を使う理由" value={reason} onChange={setReason} /><TextField label="歌うときのコツ" value={singingTip} onChange={setSingingTip} /><TextField label="発声上の注意" value={caution} onChange={setCaution} /><TextField label="初心者向けの代替方法" value={beginnerAlternative} onChange={setBeginnerAlternative} /></div>
          <button type="button" onClick={addAnnotation} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-black text-white"><Sparkles size={17} />選択範囲へ注釈を追加</button>
        </section>
      </div>

      <aside className="space-y-5 xl:sticky xl:top-24">
        <section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">Preview</p><h2 className="mt-2 text-lg font-black">表示プレビュー</h2></div><Eye size={19} className="text-[var(--accent)]" /></div><p className="mt-1 text-xs font-bold text-[var(--muted)]">{section?.name}</p><p className="mt-5 text-xl font-black leading-[2.2]">{buildAnnotatedSegments(line.text, lineAnnotations).map((segment) => { if (!segment.annotations.length) return <span key={segment.startIndex}>{segment.text}</span>; const techniques = [...new Set(segment.annotations.flatMap((annotation) => annotation.techniques))]; const primary = techniqueDefinitions[techniques[0]]; return <span key={segment.startIndex} className="mx-0.5 rounded border-b-4 border-double px-1 py-0.5" style={{ color: primary.color, background: primary.background, borderColor: primary.border }}>{segment.text}<sup className="ml-1 align-top text-[8px]">{techniques.slice(0, 2).map((technique) => techniqueDefinitions[technique].shortLabel).join("・")}</sup></span>; })}</p><p className="mt-5 text-xs font-bold text-[var(--muted)]">この行の注釈：{lineAnnotations.length}件</p></section>
        <section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-5"><div className="grid gap-3"><button type="button" onClick={saveDrafts} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--line)] text-sm font-black"><Save size={17} />下書き保存</button><button type="button" onClick={publishLocalDrafts} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--ink)] text-sm font-black text-white"><Check size={17} />ローカル公開</button></div>{saveMessage && <p role="status" className="mt-4 rounded-xl bg-[#f7f5f1] p-3 text-xs font-semibold leading-5">{saveMessage}</p>}<div className="mt-5 border-t border-dashed border-[var(--line)] pt-4"><p className="flex items-center gap-2 text-xs font-black text-[var(--muted)]"><Sparkles size={14} />AI候補</p><p className="mt-2 text-xs leading-5 text-[var(--muted)]">Phase 4で候補の承認・却下を追加します。AI候補は承認されるまでユーザー画面へ出しません。</p></div></section>
      </aside>
    </div>
  );
}

function FieldSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) { return <label className="grid gap-2 text-xs font-black"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded-xl border border-[var(--line)] bg-[#fbfaf7] px-3 text-sm font-bold">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>; }
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="grid gap-2 text-xs font-black"><span>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="resize-y rounded-xl border border-[var(--line)] bg-[#fbfaf7] p-3 text-sm font-semibold" /></label>; }
