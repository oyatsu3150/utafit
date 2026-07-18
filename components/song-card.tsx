import { ArrowUpRight, Gauge, Mic2, Music2 } from "lucide-react";
import Link from "next/link";
import { LevelMeter } from "@/components/level-meter";
import type { Song } from "@/types/song";

const toneClasses: Record<string, string> = {
  coral: "from-[#ff8b75] to-[#ffce8f]",
  sky: "from-[#78c8e8] to-[#c8f0e8]",
  violet: "from-[#9c84dd] to-[#f1b8d5]",
  amber: "from-[#e6a54a] to-[#ffe0a4]",
  rose: "from-[#c77a92] to-[#f1cbd5]",
  ink: "from-[#333947] to-[#8e9bad]",
  mint: "from-[#6fbca0] to-[#cce9c4]",
  sand: "from-[#b69778] to-[#ead5b9]",
  navy: "from-[#263f68] to-[#738cb6]",
  sunset: "from-[#f4845f] to-[#f7c46c]",
  citrus: "from-[#e9a62b] to-[#f5db61]",
  wine: "from-[#8b4059] to-[#df8794]",
  ice: "from-[#8ebad4] to-[#e2ecf2]",
  lemon: "from-[#d9bd3d] to-[#f5e99a]",
  sage: "from-[#789b72] to-[#cdd9af]",
  sun: "from-[#ee7d3f] to-[#f6cc54]",
  cherry: "from-[#d36d7b] to-[#f4c1bd]",
  aqua: "from-[#358c94] to-[#a8dad8]",
  brick: "from-[#a94f3d] to-[#df967a]",
  dawn: "from-[#5a61b8] via-[#e78c9f] to-[#ffc66d]",
};

export function SongCard({ song, score, reasons }: { song: Song; score?: number; reasons?: string[] }) {
  return (
    <article className="group overflow-hidden rounded-[1.4rem] border border-[var(--line)] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(45,39,32,0.11)]">
      <div className="p-3">
        <div className={`relative aspect-[16/9] overflow-hidden rounded-[1rem] bg-gradient-to-br ${toneClasses[song.thumbnailTone] ?? toneClasses.coral}`}>
          <div className="soft-grid absolute inset-0 opacity-35" />
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-white">
            <Music2 aria-hidden="true" className="drop-shadow" size={30} />
            <div className="rounded-full border border-white/35 bg-black/20 px-3 py-1.5 text-xs font-black backdrop-blur-sm">
              {song.isFictional ? "架空曲・注釈デモ" : "サンプル分析"}
            </div>
          </div>
          {score !== undefined && (
            <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-sm font-black text-[var(--accent-dark)] shadow-sm">
              おすすめ {score}点
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 pt-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black tracking-tight">{song.title}</h3>
            <p className="mt-1 truncate text-sm font-semibold text-[var(--muted)]">{song.artist}</p>
          </div>
          <Link
            href={`/songs/${song.id}`}
            aria-label={`${song.title}の詳細を見る`}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[#fbfaf7] transition group-hover:border-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-white"
          >
            <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-[#f7f5f1] p-3 text-center">
          <div><dt className="text-[10px] font-bold text-[var(--muted)]">最低音</dt><dd className="mt-1 text-sm font-black">{song.lowestNote}</dd></div>
          <div><dt className="text-[10px] font-bold text-[var(--muted)]">地声最高</dt><dd className="mt-1 text-sm font-black text-[var(--accent-dark)]">{song.highestChestNote}</dd></div>
          <div><dt className="text-[10px] font-bold text-[var(--muted)]">最高音</dt><dd className="mt-1 text-sm font-black">{song.highestNote}</dd></div>
        </dl>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5 font-bold"><Gauge aria-hidden="true" size={15} />{song.bpm} BPM</span>
          <span className="flex items-center gap-1.5 font-bold"><Mic2 aria-hidden="true" size={15} />難易度 <LevelMeter value={song.difficulty} /></span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {song.moods.slice(0, 3).map((mood) => (
            <span key={mood} className="rounded-full border border-[var(--line)] px-2.5 py-1 text-[11px] font-bold text-[#5c5750]">{mood}</span>
          ))}
        </div>

        {reasons?.[0] && (
          <p className="mt-4 border-t border-dashed border-[var(--line)] pt-3 text-xs font-semibold leading-relaxed text-[#5f5a54]">
            <span className="font-black text-[var(--accent-dark)]">おすすめ理由：</span>{reasons[0]}
          </p>
        )}
      </div>
    </article>
  );
}
