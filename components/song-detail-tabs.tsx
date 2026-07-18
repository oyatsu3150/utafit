"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Dumbbell, Gauge, Mic2, Music2, Sparkles } from "lucide-react";
import Link from "next/link";
import { AnnotatedLyrics } from "@/components/annotated-lyrics";
import { LevelMeter } from "@/components/level-meter";
import { SongCard } from "@/components/song-card";
import { formatRangeWidth, getRangeWidth } from "@/lib/notes";
import type { LyricAnnotation, LyricLine, Song, SongSection } from "@/types/song";

type TabId = "basic" | "singing" | "range" | "difficult" | "practice" | "similar";
const tabs: { id: TabId; label: string }[] = [
  { id: "basic", label: "基本情報" },
  { id: "singing", label: "歌い方" },
  { id: "range", label: "音域" },
  { id: "difficult", label: "難しい部分" },
  { id: "practice", label: "練習方法" },
  { id: "similar", label: "似ている曲" },
];

export function SongDetailTabs({ song, sections, lines, annotations, similarSongs, initialTab = "basic" }: { song: Song; sections: SongSection[]; lines: LyricLine[]; annotations: LyricAnnotation[]; similarSongs: Song[]; initialTab?: TabId }) {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  return (
    <div>
      <div className="sticky top-[68px] z-30 -mx-3 overflow-x-auto border-y border-[var(--line)] bg-[rgba(251,250,247,0.94)] px-3 py-3 backdrop-blur-lg sm:mx-0 sm:rounded-2xl sm:border sm:bg-white sm:px-4">
        <div className="flex min-w-max gap-1" role="tablist" aria-label="曲詳細の表示切り替え">
          {tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${activeTab === tab.id ? "bg-[var(--ink)] text-white" : "text-[#69635c] hover:bg-[#f4f1ec] hover:text-[var(--ink)]"}`}>{tab.label}</button>)}
        </div>
      </div>

      <div className="mt-7">
        {activeTab === "basic" && <BasicTab song={song} />}
        {activeTab === "singing" && (song.lyricsStatus === "available" ? <AnnotatedLyrics sections={sections} lines={lines} annotations={annotations} /> : <RightsReview song={song} />)}
        {activeTab === "range" && <RangeTab song={song} sections={sections} />}
        {activeTab === "difficult" && <DifficultTab song={song} sections={sections} />}
        {activeTab === "practice" && <PracticeTab song={song} canPractice={song.lyricsStatus === "available"} />}
        {activeTab === "similar" && <SimilarTab songs={similarSongs} artists={song.similarArtists} />}
      </div>
    </div>
  );
}

function BasicTab({ song }: { song: Song }) {
  const metrics = [
    ["高音の多さ", song.highNoteFrequency], ["裏声の多さ", song.falsettoFrequency], ["ロングトーン", song.longToneDifficulty],
    ["息継ぎの難しさ", song.breathingDifficulty], ["リズムの難しさ", song.rhythmDifficulty], ["カラオケの歌いやすさ", song.karaokeEase],
  ] as const;
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-6"><p className="eyebrow">Overview</p><h2 className="mt-3 text-2xl font-black">この曲の特徴</h2><p className="mt-4 leading-8 text-[var(--muted)]">{song.description}</p><div className="mt-6 flex flex-wrap gap-2">{[...song.moods, ...song.genres].map((item) => <span key={item} className="rounded-full border border-[var(--line)] bg-[#fbfaf7] px-3 py-1.5 text-xs font-black">{item}</span>)}</div><div className="mt-7 border-t border-dashed border-[var(--line)] pt-6"><h3 className="text-sm font-black">歌うときのコツ</h3><ul className="mt-3 space-y-3">{song.singingTips.map((tip) => <li key={tip} className="flex gap-3 text-sm font-semibold leading-6"><Sparkles className="mt-0.5 shrink-0 text-[var(--accent)]" size={16} />{tip}</li>)}</ul></div></section>
      <section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Difficulty map</p><h2 className="mt-3 text-2xl font-black">歌唱指標</h2></div><Gauge className="text-[var(--accent)]" size={25} /></div><div className="mt-7 grid gap-4 sm:grid-cols-2">{metrics.map(([label, value]) => <div key={label} className="rounded-2xl bg-[#f7f5f1] p-4"><p className="text-xs font-bold text-[var(--muted)]">{label}</p><div className="mt-3"><LevelMeter value={value} /></div></div>)}</div></section>
    </div>
  );
}

function RangeTab({ song, sections }: { song: Song; sections: SongSection[] }) {
  const width = getRangeWidth(song.lowestNote, song.highestNote);
  return <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"><section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-6"><p className="eyebrow">Vocal range</p><h2 className="mt-3 text-2xl font-black">全体音域</h2><div className="mt-7 rounded-2xl bg-[#f7f5f1] p-5"><div className="flex items-end justify-between"><div><p className="text-xs font-bold text-[var(--muted)]">最低音</p><p className="mt-1 text-2xl font-black">{song.lowestNote}</p></div><div className="text-center"><p className="text-xs font-bold text-[var(--muted)]">音域幅</p><p className="mt-1 text-sm font-black">{formatRangeWidth(width)}</p></div><div className="text-right"><p className="text-xs font-bold text-[var(--muted)]">最高音</p><p className="mt-1 text-2xl font-black text-[var(--accent-dark)]">{song.highestNote}</p></div></div><div className="range-track mt-5 h-3 rounded-full" /></div><dl className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-[var(--line)] p-4"><dt className="text-xs font-bold text-[var(--muted)]">地声最高音</dt><dd className="mt-1 text-xl font-black">{song.highestChestNote}</dd></div><div className="rounded-2xl border border-[var(--line)] p-4"><dt className="text-xs font-bold text-[var(--muted)]">裏声最高音</dt><dd className="mt-1 text-xl font-black">{song.highestFalsettoNote ?? "—"}</dd></div></dl></section><section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-6"><p className="eyebrow">By section</p><h2 className="mt-3 text-2xl font-black">セクション別</h2>{sections.length ? <div className="mt-6 space-y-3">{sections.map((section) => <div key={section.id} className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f5f1] p-4"><div><p className="font-black">{section.name}</p><p className="mt-1 text-xs text-[var(--muted)]">難易度 {section.difficulty}/5</p></div><p className="text-sm font-black tabular-nums">{section.lowestNote} <span className="mx-1 text-[#aaa39a]">→</span> {section.highestNote}</p></div>)}</div> : <p className="mt-5 text-sm leading-7 text-[var(--muted)]">セクション別分析は、権利確認済みデータを登録した曲から順次追加します。</p>}</section></div>;
}

function DifficultTab({ song, sections }: { song: Song; sections: SongSection[] }) {
  return <div className="grid gap-6 lg:grid-cols-2"><section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-6"><div className="flex gap-3"><AlertCircle className="shrink-0 text-[var(--accent)]" /><div><p className="eyebrow">Hard points</p><h2 className="mt-2 text-2xl font-black">難しい部分</h2></div></div><ul className="mt-6 space-y-3">{song.difficultPoints.map((point) => <li key={point} className="rounded-2xl bg-[#f7f5f1] p-4 text-sm font-semibold leading-6">{point}</li>)}</ul></section><section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-6"><p className="eyebrow">Section focus</p><h2 className="mt-3 text-2xl font-black">難しいフレーズ</h2>{sections.length ? <div className="mt-6 space-y-4">{sections.filter((section) => section.difficultPhrases.length).map((section) => <div key={section.id} className="border-b border-dashed border-[var(--line)] pb-4"><p className="text-xs font-black text-[var(--accent-dark)]">{section.name}</p><p className="mt-2 font-bold">{section.difficultPhrases.join("、")}</p></div>)}</div> : <p className="mt-5 text-sm text-[var(--muted)]">詳細なフレーズ分析は準備中です。</p>}</section></div>;
}

function PracticeTab({ song, canPractice }: { song: Song; canPractice: boolean }) {
  return <section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-7 sm:p-10"><div className="mx-auto max-w-2xl text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-dark)]"><Dumbbell size={24} /></span><h2 className="display-title mt-5 text-3xl">1行ずつ、迷わず練習</h2><p className="mt-4 leading-7 text-[var(--muted)]">前後の歌詞、音高、技法、ブレス、初心者向けの代替方法を1画面にまとめます。練習済みの状態はこの端末内に保存されます。</p>{canPractice ? <Link href={`/songs/${song.id}/practice`} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-black text-white">練習モードを始める<ArrowRight size={17} /></Link> : <p className="mt-7 rounded-2xl bg-[#f7f5f1] p-4 text-sm font-bold text-[var(--muted)]">この曲は歌詞の権利確認中のため、練習モードを表示できません。</p>}</div></section>;
}

function SimilarTab({ songs, artists }: { songs: Song[]; artists: string[] }) {
  return <div><section className="rounded-[1.5rem] border border-[var(--line)] bg-white p-6"><p className="eyebrow">Similar artists</p><h2 className="mt-3 text-2xl font-black">似ているアーティスト</h2><div className="mt-5 flex flex-wrap gap-2">{artists.map((artist) => <span key={artist} className="rounded-full bg-[#f2efe9] px-4 py-2 text-sm font-black">{artist}</span>)}</div></section><div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{songs.map((song) => <SongCard key={song.id} song={song} />)}</div></div>;
}

function RightsReview({ song }: { song: Song }) {
  return <section className="rounded-[1.5rem] border border-[#ead8b6] bg-[#fffaf0] p-7 sm:p-10"><div className="mx-auto max-w-2xl text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-[#8a641c]"><Music2 size={25} /></span><h2 className="mt-5 text-2xl font-black">歌詞データは権利確認中です</h2><p className="mt-4 leading-7 text-[#715b31]">「{song.title}」は実在曲のため、許諾のない歌詞をMVPへ登録していません。歌い方表示は、架空曲「夜明けのキャンバス」で安全にお試しいただけます。</p><Link href="/songs/yoake-no-canvas?tab=singing" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-black text-white"><Mic2 size={17} />架空曲の歌い方デモへ</Link></div></section>;
}
