"use client";

import { useEffect, useState, useTransition } from "react";
import { ChevronDown, ListFilter, LoaderCircle, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataNotice } from "@/components/data-notice";
import { SongCard } from "@/components/song-card";
import { NOTE_NAMES } from "@/lib/notes";
import { searchAndSortSongs, type MetricBand, type SongFilters, type SongSort, type TempoBand } from "@/lib/song-search";
import type { FiveLevel, Song } from "@/types/song";

const sortOptions: { value: SongSort; label: string }[] = [
  { value: "recommended", label: "おすすめ順" },
  { value: "difficulty-asc", label: "難易度が低い順" },
  { value: "difficulty-desc", label: "難易度が高い順" },
  { value: "highest-note-asc", label: "最高音が低い順" },
  { value: "highest-note-desc", label: "最高音が高い順" },
  { value: "bpm-asc", label: "テンポが遅い順" },
  { value: "bpm-desc", label: "テンポが速い順" },
];

const bandOptions = [
  { value: "", label: "指定しない" },
  { value: "low", label: "少ない（1〜2）" },
  { value: "medium", label: "ふつう（3）" },
  { value: "high", label: "多い（4〜5）" },
];

type ParameterKey =
  | "q"
  | "lowest"
  | "highest"
  | "chest"
  | "falsetto"
  | "difficulty"
  | "gender"
  | "tempo"
  | "highs"
  | "falsettos"
  | "longtones"
  | "rhythm"
  | "mood"
  | "sort";

export function SongsExplorer({ songs, moods }: { songs: Song[]; moods: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const timer = window.setTimeout(() => setLocalQuery(searchParams.get("q") ?? ""), 0);
    return () => window.clearTimeout(timer);
  }, [searchParams]);

  function updateParameter(key: ParameterKey, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }));
  }

  function updateQuery(value: string) {
    setLocalQuery(value);
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set("q", value);
    else next.delete("q");
    startTransition(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }));
  }

  const filters: SongFilters = {
    query: localQuery,
    lowestNoteMin: searchParams.get("lowest") ?? undefined,
    highestNoteMax: searchParams.get("highest") ?? undefined,
    highestChestNoteMax: searchParams.get("chest") ?? undefined,
    highestFalsettoNoteMax: searchParams.get("falsetto") ?? undefined,
    maxDifficulty: searchParams.get("difficulty") ? Number(searchParams.get("difficulty")) as FiveLevel : undefined,
    genderCategory: searchParams.get("gender") as SongFilters["genderCategory"] ?? undefined,
    tempo: searchParams.get("tempo") as TempoBand ?? undefined,
    highNoteFrequency: searchParams.get("highs") as MetricBand ?? undefined,
    falsettoFrequency: searchParams.get("falsettos") as MetricBand ?? undefined,
    longToneDifficulty: searchParams.get("longtones") as MetricBand ?? undefined,
    rhythmDifficulty: searchParams.get("rhythm") as MetricBand ?? undefined,
    mood: searchParams.get("mood") ?? undefined,
  };
  const sort = (searchParams.get("sort") ?? "recommended") as SongSort;
  const results = searchAndSortSongs(songs, filters, sort);

  const activeFilters = [
    ["lowest", filters.lowestNoteMin ? `最低音 ${filters.lowestNoteMin}以上` : ""],
    ["highest", filters.highestNoteMax ? `最高音 ${filters.highestNoteMax}以下` : ""],
    ["chest", filters.highestChestNoteMax ? `地声 ${filters.highestChestNoteMax}以下` : ""],
    ["falsetto", filters.highestFalsettoNoteMax ? `裏声 ${filters.highestFalsettoNoteMax}以下` : ""],
    ["difficulty", filters.maxDifficulty ? `難易度 ${filters.maxDifficulty}以下` : ""],
    ["gender", filters.genderCategory ? ({ male: "男性曲", female: "女性曲", mixed: "混声曲" }[filters.genderCategory]) : ""],
    ["tempo", filters.tempo ? ({ slow: "ゆっくり", medium: "ミドル", fast: "速い" }[filters.tempo]) : ""],
    ["highs", filters.highNoteFrequency ? `高音 ${filters.highNoteFrequency}` : ""],
    ["falsettos", filters.falsettoFrequency ? `裏声 ${filters.falsettoFrequency}` : ""],
    ["longtones", filters.longToneDifficulty ? `ロングトーン ${filters.longToneDifficulty}` : ""],
    ["rhythm", filters.rhythmDifficulty ? `リズム ${filters.rhythmDifficulty}` : ""],
    ["mood", filters.mood ? `雰囲気 ${filters.mood}` : ""],
  ].filter((item): item is [ParameterKey, string] => Boolean(item[1]));

  function resetAll() {
    setLocalQuery("");
    startTransition(() => router.replace(pathname, { scroll: false }));
  }

  return (
    <div className="page-shell py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="eyebrow">Song finder</p>
        <h1 className="display-title mt-3 text-4xl sm:text-6xl">歌いやすさから曲を探す</h1>
        <p className="mt-5 leading-7 text-[var(--muted)]">曲名だけでなく、自分が安定して出せる音・声区・難易度で絞り込めます。条件はURLに残るため、更新しても維持されます。</p>
      </div>

      <div className="card-shadow mt-8 rounded-[1.5rem] border border-[var(--line)] bg-white p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <Search aria-hidden="true" className="ml-2 shrink-0 text-[var(--accent)]" size={22} />
          <label htmlFor="song-search" className="sr-only">曲を検索</label>
          <input
            id="song-search"
            value={localQuery}
            onChange={(event) => updateQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent py-3 text-base font-semibold placeholder:text-[#9a958e] focus:outline-none"
            placeholder="曲名、アーティスト、特徴、雰囲気を入力"
          />
          {localQuery && <button type="button" onClick={() => updateQuery("")} className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-[#f3f0eb]" aria-label="検索語を消す"><X size={18} /></button>}
          {isPending && <LoaderCircle aria-label="検索結果を更新中" className="animate-spin text-[var(--accent)]" size={20} />}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-sm font-black transition hover:border-[var(--ink)]">
          <SlidersHorizontal size={17} />絞り込み{activeFilters.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-[var(--accent)] text-[10px] text-white">{activeFilters.length}</span>}<ChevronDown size={15} className={`transition ${filtersOpen ? "rotate-180" : ""}`} />
        </button>
        {(activeFilters.length > 0 || localQuery) && <button type="button" onClick={resetAll} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold text-[var(--muted)] hover:bg-white hover:text-[var(--ink)]"><RotateCcw size={15} />すべてリセット</button>}
      </div>

      {filtersOpen && (
        <section className="mt-4 rounded-[1.5rem] border border-[var(--line)] bg-white p-5 sm:p-7" aria-label="絞り込み条件">
          <div className="flex items-center justify-between"><div><p className="text-sm font-black">絞り込み条件</p><p className="mt-1 text-xs text-[var(--muted)]">「以下」は、その音を超えない曲を探します。</p></div><ListFilter size={20} className="text-[var(--accent)]" /></div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect label="最低音（この音以上）" value={filters.lowestNoteMin ?? ""} onChange={(value) => updateParameter("lowest", value)} options={[{ value: "", label: "指定しない" }, ...NOTE_NAMES.map((note) => ({ value: note, label: note }))]} />
            <FilterSelect label="最高音（この音以下）" value={filters.highestNoteMax ?? ""} onChange={(value) => updateParameter("highest", value)} options={[{ value: "", label: "指定しない" }, ...NOTE_NAMES.map((note) => ({ value: note, label: note }))]} />
            <FilterSelect label="地声最高音（以下）" value={filters.highestChestNoteMax ?? ""} onChange={(value) => updateParameter("chest", value)} options={[{ value: "", label: "指定しない" }, ...NOTE_NAMES.map((note) => ({ value: note, label: note }))]} />
            <FilterSelect label="裏声最高音（以下）" value={filters.highestFalsettoNoteMax ?? ""} onChange={(value) => updateParameter("falsetto", value)} options={[{ value: "", label: "指定しない" }, ...NOTE_NAMES.map((note) => ({ value: note, label: note }))]} />
            <FilterSelect label="難易度" value={filters.maxDifficulty ? String(filters.maxDifficulty) : ""} onChange={(value) => updateParameter("difficulty", value)} options={[{ value: "", label: "指定しない" }, ...[1, 2, 3, 4, 5].map((level) => ({ value: String(level), label: `${level}以下` }))]} />
            <FilterSelect label="男女カテゴリ" value={filters.genderCategory ?? ""} onChange={(value) => updateParameter("gender", value)} options={[{ value: "", label: "指定しない" }, { value: "male", label: "男性曲" }, { value: "female", label: "女性曲" }, { value: "mixed", label: "混声曲" }]} />
            <FilterSelect label="テンポ" value={filters.tempo ?? ""} onChange={(value) => updateParameter("tempo", value)} options={[{ value: "", label: "指定しない" }, { value: "slow", label: "ゆっくり（〜100）" }, { value: "medium", label: "ミドル（101〜139）" }, { value: "fast", label: "速い（140〜）" }]} />
            <FilterSelect label="高音の多さ" value={filters.highNoteFrequency ?? ""} onChange={(value) => updateParameter("highs", value)} options={bandOptions} />
            <FilterSelect label="裏声の多さ" value={filters.falsettoFrequency ?? ""} onChange={(value) => updateParameter("falsettos", value)} options={bandOptions} />
            <FilterSelect label="ロングトーン" value={filters.longToneDifficulty ?? ""} onChange={(value) => updateParameter("longtones", value)} options={bandOptions} />
            <FilterSelect label="リズム難易度" value={filters.rhythmDifficulty ?? ""} onChange={(value) => updateParameter("rhythm", value)} options={bandOptions} />
            <FilterSelect label="曲の雰囲気" value={filters.mood ?? ""} onChange={(value) => updateParameter("mood", value)} options={[{ value: "", label: "指定しない" }, ...moods.map((mood) => ({ value: mood, label: mood }))]} />
          </div>
        </section>
      )}

      {activeFilters.length > 0 && <div className="mt-4 flex flex-wrap gap-2" aria-label="選択中の条件">{activeFilters.map(([key, label]) => <button key={key} type="button" onClick={() => updateParameter(key, "")} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-black text-[var(--accent-dark)]">{label}<X size={13} /></button>)}</div>}

      <div className="mt-10 flex flex-col gap-4 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold text-[var(--muted)]">検索結果</p><p className="mt-1 text-2xl font-black">{results.length}<span className="ml-1 text-sm text-[var(--muted)]">曲</span></p></div>
        <FilterSelect compact label="並び替え" value={sort} onChange={(value) => updateParameter("sort", value)} options={sortOptions} />
      </div>

      <div className="mt-7"><DataNotice compact /></div>

      {results.length > 0 ? (
        <div className={`mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3 ${isPending ? "opacity-60" : ""}`} aria-live="polite">
          {results.map((song) => <SongCard key={song.id} song={song} />)}
        </div>
      ) : (
        <div className="mt-7 rounded-[1.5rem] border border-dashed border-[#d6d0c8] bg-white px-6 py-16 text-center">
          <Search className="mx-auto text-[#aaa39a]" size={32} />
          <h2 className="mt-5 text-xl font-black">条件に合う曲がありません</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">最高音や難易度の条件をひとつずつ外すと見つかりやすくなります。</p>
          <button type="button" onClick={resetAll} className="mt-6 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-black text-white">条件をリセット</button>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, compact = false }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; compact?: boolean }) {
  return (
    <label className={`grid gap-2 text-xs font-black text-[#4f4a44] ${compact ? "sm:min-w-60" : ""}`}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfaf7] px-3 text-sm font-bold text-[var(--ink)] focus:border-[var(--focus)] focus:bg-white">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
