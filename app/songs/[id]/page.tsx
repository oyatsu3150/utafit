import { ArrowLeft, Clock3, Mic2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DataNotice } from "@/components/data-notice";
import { LevelMeter } from "@/components/level-meter";
import { SongDetailTabs } from "@/components/song-detail-tabs";
import { getAnnotationsForLine, getLinesForSong, getSectionsForSong } from "@/data/lyrics";
import { getSongById, songs } from "@/data/songs";

export function generateStaticParams() {
  return songs.map((song) => ({ id: song.id }));
}

export default async function SongDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { id } = await params;
  const { tab } = await searchParams;
  const song = getSongById(id);
  if (!song) notFound();

  const lines = getLinesForSong(song.id);
  const sections = getSectionsForSong(song.id);
  const annotations = lines.flatMap((line) => getAnnotationsForLine(line.id));
  const similarSongs = song.similarSongIds.map((similarId) => getSongById(similarId)).filter((item) => item !== undefined);
  const validTabs = new Set(["basic", "singing", "range", "difficult", "practice", "similar"]);
  const initialTab = validTabs.has(tab ?? "") ? tab as "basic" | "singing" | "range" | "difficult" | "practice" | "similar" : "basic";

  return (
    <main className="page-shell py-9 sm:py-12">
      <Link href="/songs" className="inline-flex items-center gap-2 rounded-full text-sm font-black text-[var(--muted)] hover:text-[var(--ink)]"><ArrowLeft size={16} />曲一覧へ戻る</Link>
      <section className="mt-6 grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <div className={`soft-grid relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-gradient-to-br ${song.isFictional ? "from-[#5a61b8] via-[#e78c9f] to-[#ffc66d]" : "from-[#2f3034] to-[#8b8680]"}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          <div className="absolute inset-x-7 bottom-7 flex items-end justify-between text-white"><Mic2 size={35} /><span className="rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-xs font-black backdrop-blur-sm">{song.isFictional ? "架空曲・注釈あり" : "サンプル分析"}</span></div>
        </div>
        <div className="pb-2"><p className="eyebrow">Song profile</p><h1 className="display-title mt-3 text-4xl leading-tight sm:text-6xl">{song.title}</h1><p className="mt-3 text-lg font-bold text-[var(--muted)]">{song.artist}</p><div className="mt-6 flex flex-wrap items-center gap-3"><span className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-black text-white">難易度 <LevelMeter value={song.difficulty} /></span><span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-black"><Clock3 size={14} />{song.bpm} BPM</span>{song.moods.map((mood) => <span key={mood} className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-black">{mood}</span>)}</div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["最低音", song.lowestNote], ["地声最高", song.highestChestNote], ["裏声最高", song.highestFalsettoNote ?? "—"], ["最高音", song.highestNote]].map(([label, value]) => <div key={label} className="rounded-2xl border border-[var(--line)] bg-white p-4"><p className="text-[10px] font-bold text-[var(--muted)]">{label}</p><p className="mt-1 text-lg font-black">{value}</p></div>)}</div></div>
      </section>
      <div className="mt-7"><DataNotice compact /></div>
      <div className="mt-7"><SongDetailTabs song={song} sections={sections} lines={lines} annotations={annotations} similarSongs={similarSongs} initialTab={initialTab} /></div>
    </main>
  );
}
