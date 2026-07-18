import { ArrowRight, Mic2, ScanSearch, Sparkles } from "lucide-react";
import Link from "next/link";
import { DataNotice } from "@/components/data-notice";
import { SongCard } from "@/components/song-card";
import { songs } from "@/data/songs";

const recommended = ["yoake-no-canvas", "kanade", "cherry"].map((id) => songs.find((song) => song.id === id)).filter((song) => song !== undefined);

export default function HomePage() {
  return (
    <main>
      <section className="page-shell grid min-h-[calc(100svh-68px)] items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <p className="eyebrow">Find your singable song</p>
          <h1 className="display-title mt-5 max-w-4xl text-[clamp(3rem,8vw,6.8rem)] leading-[0.94]">
            自分の声で、<br /><span className="text-[var(--accent)]">歌を選ぶ。</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base font-medium leading-8 text-[var(--muted)] sm:text-lg">
            曲名だけでなく、最高音・地声・裏声・難易度から検索。さらに、歌詞のどこでどんな声を使うかまで見える歌唱ナビです。
          </p>

          <form action="/songs" className="card-shadow mt-9 flex max-w-2xl items-center gap-3 rounded-[1.35rem] border border-[var(--line)] bg-white p-2.5">
            <ScanSearch aria-hidden="true" className="ml-3 shrink-0 text-[var(--accent)]" size={23} />
            <label className="sr-only" htmlFor="home-search">曲名・アーティスト・雰囲気で検索</label>
            <input id="home-search" name="q" className="min-w-0 flex-1 bg-transparent px-1 py-3 text-base font-semibold placeholder:text-[#9a958e] focus:outline-none" placeholder="曲名・アーティスト・雰囲気で検索" />
            <button className="min-h-12 shrink-0 rounded-2xl bg-[var(--ink)] px-5 text-sm font-black text-white transition hover:bg-[var(--accent-dark)]" type="submit">探す</button>
          </form>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/recommend" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-black text-white transition hover:bg-[var(--accent-dark)]">
              <Mic2 aria-hidden="true" size={18} />音域から診断する<ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link href="/songs/yoake-no-canvas?tab=singing" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 text-sm font-black transition hover:border-[var(--ink)]">
              <Sparkles aria-hidden="true" size={18} />歌い方デモを見る
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[31rem] lg:justify-self-end">
          <div className="absolute -inset-6 -z-10 rotate-3 rounded-[3rem] bg-[var(--accent-soft)]" />
          <div className="card-shadow overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div><p className="eyebrow">Singing map</p><h2 className="mt-2 text-xl font-black">歌詞の上に、歌い方が見える</h2></div>
              <span className="grid size-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-dark)]"><Sparkles size={21} /></span>
            </div>
            <div className="mt-7 space-y-5 rounded-2xl bg-[#f7f5f1] p-5 text-xl font-bold leading-[2.2] sm:text-2xl">
              <p><span className="rounded border-b-2 border-[#63b89e] bg-[#ebfbf5] px-1 text-[#18765d]">まだ白い<sup className="ml-1 text-[9px]">W・裏</sup></span> 朝に <span className="rounded border-b-2 border-[#7faac7] bg-[#eef6fb] px-1 text-[#385f7d]">息を描く<sup className="ml-1 text-[9px]">連</sup></span></p>
              <p>朝の <span className="rounded border-b-4 border-double border-[#a980d4] bg-[#f6efff] px-1 text-[#6a3ba1]">光を<sup className="ml-1 text-[9px]">M・長・!</sup></span> 抱いて</p>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-black">
              <div className="rounded-xl bg-[#fff0ed] p-3 text-[#9f2d24]">● 地声</div>
              <div className="rounded-xl bg-[#edf5ff] p-3 text-[#245a9f]">○ 裏声</div>
              <div className="rounded-xl bg-[#f6efff] p-3 text-[#6a3ba1]">◆ ミックス</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white py-20">
        <div className="page-shell">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="eyebrow">Start here</p><h2 className="display-title mt-3 text-4xl sm:text-5xl">まず試したい3曲</h2></div>
            <Link href="/songs" className="inline-flex items-center gap-2 text-sm font-black text-[var(--accent-dark)]">全{songs.length}曲を見る<ArrowRight size={17} /></Link>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recommended.map((song) => <SongCard key={song.id} song={song} />)}
          </div>
          <div className="mt-7"><DataNotice /></div>
        </div>
      </section>
    </main>
  );
}
