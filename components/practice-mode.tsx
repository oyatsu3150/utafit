"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Lightbulb, RotateCcw } from "lucide-react";
import Link from "next/link";
import { techniqueDefinitions } from "@/data/techniques";
import { buildAnnotatedSegments } from "@/lib/annotations";
import type { LyricAnnotation, LyricLine, Song, SongSection } from "@/types/song";

function formatTime(milliseconds?: number) {
  if (milliseconds === undefined) return "--:--";
  const seconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function PracticeMode({ song, lines, annotations, sections }: { song: Song; lines: LyricLine[]; annotations: LyricAnnotation[]; sections: SongSection[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedLineIds, setCompletedLineIds] = useState<string[]>([]);
  const storageKey = `utafit-practice-${song.id}`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return;
      try {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) setCompletedLineIds(parsed);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  const line = lines[currentIndex];
  const lineAnnotations = useMemo(() => annotations.filter((annotation) => annotation.lyricLineId === line?.id), [annotations, line?.id]);
  const section = sections.find((item) => item.id === line?.sectionId);
  const segments = line ? buildAnnotatedSegments(line.text, lineAnnotations) : [];
  const isComplete = line ? completedLineIds.includes(line.id) : false;

  function toggleComplete() {
    if (!line) return;
    const next = isComplete ? completedLineIds.filter((id) => id !== line.id) : [...completedLineIds, line.id];
    setCompletedLineIds(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }

  if (!line) return null;

  return (
    <div className="page-shell py-7 sm:py-10">
      <div className="flex items-center justify-between gap-4">
        <Link href={`/songs/${song.id}?tab=practice`} className="inline-flex items-center gap-2 text-sm font-black text-[var(--muted)] hover:text-[var(--ink)]"><ArrowLeft size={16} />曲詳細へ</Link>
        <button type="button" onClick={() => { setCompletedLineIds([]); window.localStorage.removeItem(storageKey); }} className="inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--ink)]"><RotateCcw size={14} />進捗をリセット</button>
      </div>

      <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="eyebrow">Line practice</p><h1 className="display-title mt-2 text-3xl sm:text-5xl">{song.title}</h1><p className="mt-2 font-bold text-[var(--muted)]">{song.artist}</p></div>
        <div className="min-w-52"><div className="flex items-center justify-between text-xs font-black"><span>練習済み</span><span>{completedLineIds.length} / {lines.length}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e9e4dd]"><div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${(completedLineIds.length / lines.length) * 100}%` }} /></div></div>
      </header>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="overflow-hidden rounded-[1.7rem] border border-[var(--line)] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[#f7f5f1] px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3"><span className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-xs font-black text-white">{section?.name ?? "セクション"}</span><span className="text-xs font-black text-[var(--muted)]">Line {currentIndex + 1} / {lines.length}</span></div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]"><Clock3 size={14} />{formatTime(line.startTimeMs)} — {formatTime(line.endTimeMs)}</span>
          </div>

          <div className="px-5 py-10 sm:px-9 sm:py-14">
            {lines[currentIndex - 1] && <p className="text-sm font-semibold text-[#aaa39a]">{lines[currentIndex - 1].text}</p>}
            <p className="my-8 text-2xl font-black leading-[2.2] tracking-[0.03em] sm:text-4xl">
              {segments.map((segment) => {
                if (!segment.annotations.length) return <span key={segment.startIndex}>{segment.text}</span>;
                const techniques = [...new Set(segment.annotations.flatMap((annotation) => annotation.techniques))];
                const primary = techniqueDefinitions[techniques[0]];
                return <span key={segment.startIndex} className="mx-0.5 rounded border-b-4 border-double px-1 py-0.5" style={{ color: primary.color, background: primary.background, borderColor: primary.border }}>{segment.text}<sup className="ml-1 align-top text-[9px]">{techniques.slice(0, 2).map((technique) => techniqueDefinitions[technique].shortLabel).join("・")}</sup></span>;
              })}
            </p>
            {lines[currentIndex + 1] && <p className="text-sm font-semibold text-[#aaa39a]">次：{lines[currentIndex + 1].text}</p>}
          </div>

          <div className="flex flex-col gap-3 border-t border-[var(--line)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <button type="button" disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-35"><ArrowLeft size={17} />前のフレーズ</button>
            <button type="button" onClick={toggleComplete} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black ${isComplete ? "bg-[#eaf7ef] text-[#267044]" : "bg-[var(--accent-soft)] text-[var(--accent-dark)]"}`}>{isComplete ? <CheckCircle2 size={18} /> : <Check size={18} />}{isComplete ? "練習済み" : "練習済みにする"}</button>
            <button type="button" disabled={currentIndex === lines.length - 1} onClick={() => setCurrentIndex((index) => Math.min(lines.length - 1, index + 1))} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-35">次のフレーズ<ArrowRight size={17} /></button>
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-5"><p className="text-xs font-black text-[var(--muted)]">歌唱方法</p><div className="mt-3 flex flex-wrap gap-2">{[...new Set(lineAnnotations.flatMap((annotation) => annotation.techniques))].map((technique) => { const definition = techniqueDefinitions[technique]; return <span key={technique} className="rounded-full px-3 py-1.5 text-xs font-black" style={{ color: definition.color, background: definition.background, border: `1px solid ${definition.border}` }}>{definition.marker} {definition.label}</span>; })}</div></section>
          <section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-5"><p className="flex items-center gap-2 text-xs font-black text-[var(--muted)]"><Lightbulb size={15} className="text-[var(--accent)]" />この行のコツ</p><div className="mt-4 space-y-4">{lineAnnotations.slice(0, 3).map((annotation) => <div key={annotation.id} className="border-b border-dashed border-[var(--line)] pb-4 last:border-0 last:pb-0"><div className="flex items-center justify-between text-xs"><span className="font-black">{annotation.noteName ?? "表現"}</span><span className="font-bold text-[var(--muted)]">難易度 {annotation.difficulty ?? 1}/5</span></div>{annotation.singingTip && <p className="mt-2 text-sm font-semibold leading-6">{annotation.singingTip}</p>}{annotation.beginnerAlternative && <p className="mt-2 rounded-xl bg-[#f7f5f1] p-3 text-xs leading-5"><strong>初心者向け：</strong>{annotation.beginnerAlternative}</p>}</div>)}</div></section>
        </aside>
      </div>
    </div>
  );
}
