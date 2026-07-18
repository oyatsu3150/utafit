"use client";

import { useMemo, useState } from "react";
import { ArrowDown, Mic2, Sparkles } from "lucide-react";
import { SongCard } from "@/components/song-card";
import { genres, moods } from "@/data/songs";
import { NOTE_NAMES } from "@/lib/notes";
import { rankRecommendations } from "@/lib/recommendation";
import type { FiveLevel, Song, UserVocalProfile } from "@/types/song";

const goals = ["カラオケで高得点を取りたい", "高音を出したい", "裏声を強くしたい", "ミックスボイスを練習したい", "表現力を上げたい", "リズム感を上げたい", "音程を安定させたい", "自分に合う曲を知りたい"];

export function RecommendationForm({ songs }: { songs: Song[] }) {
  const [profile, setProfile] = useState<UserVocalProfile>({ userId: "anonymous", voiceType: "tenor", comfortableLowestNote: "mid1A", comfortableHighestChestNote: "hiA", comfortableHighestFalsettoNote: "hiC", singingLevel: 3, preferredGenres: ["J-POP"], preferredMoods: ["優しい"], favoriteArtists: [], favoriteSongs: [], dislikedGenres: [], goalTypes: ["自分に合う曲を知りたい"] });
  const [favoriteArtistInput, setFavoriteArtistInput] = useState("");
  const [hasDiagnosed, setHasDiagnosed] = useState(false);
  const rankings = useMemo(() => rankRecommendations(songs, { ...profile, favoriteArtists: favoriteArtistInput.trim() ? [favoriteArtistInput.trim()] : [] }), [favoriteArtistInput, profile, songs]);

  function toggleArray(field: "preferredGenres" | "preferredMoods" | "goalTypes", value: string) {
    setProfile((current) => ({ ...current, [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value] }));
  }

  return (
    <div className="page-shell py-12 sm:py-16">
      <div className="max-w-3xl"><p className="eyebrow">Voice match</p><h1 className="display-title mt-3 text-4xl sm:text-6xl">あなたの音域から診断</h1><p className="mt-5 leading-7 text-[var(--muted)]">安定して出せる音を基準に、音域35点・難易度20点など合計100点で相性を計算します。無理に出せる最高音ではなく、繰り返し歌える音を選んでください。</p></div>
      <form onSubmit={(event) => { event.preventDefault(); setHasDiagnosed(true); window.setTimeout(() => document.getElementById("recommend-results")?.scrollIntoView({ behavior: "smooth" }), 50); }} className="mt-9 rounded-[1.7rem] border border-[var(--line)] bg-white p-5 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField label="性別・声域タイプ" value={profile.voiceType ?? ""} onChange={(value) => setProfile((current) => ({ ...current, voiceType: value }))} options={[{ value: "bass", label: "低め（バス）" }, { value: "baritone", label: "やや低め（バリトン）" }, { value: "tenor", label: "やや高め（テノール）" }, { value: "alto", label: "低め（アルト）" }, { value: "soprano", label: "高め（ソプラノ）" }, { value: "unsure", label: "わからない" }]} />
          <SelectField label="安定して出せる最低音" value={profile.comfortableLowestNote ?? ""} onChange={(value) => setProfile((current) => ({ ...current, comfortableLowestNote: value }))} options={NOTE_NAMES.map((note) => ({ value: note, label: note }))} />
          <SelectField label="地声で安定する最高音" value={profile.comfortableHighestChestNote ?? ""} onChange={(value) => setProfile((current) => ({ ...current, comfortableHighestChestNote: value }))} options={NOTE_NAMES.map((note) => ({ value: note, label: note }))} />
          <SelectField label="裏声で安定する最高音" value={profile.comfortableHighestFalsettoNote ?? ""} onChange={(value) => setProfile((current) => ({ ...current, comfortableHighestFalsettoNote: value }))} options={NOTE_NAMES.map((note) => ({ value: note, label: note }))} />
        </div>
        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <label className="grid gap-2 text-xs font-black text-[#4f4a44]"><span>歌唱レベル：{profile.singingLevel}/5</span><input type="range" min="1" max="5" step="1" value={profile.singingLevel} onChange={(event) => setProfile((current) => ({ ...current, singingLevel: Number(event.target.value) as FiveLevel }))} className="accent-[var(--accent)]" /><span className="flex justify-between font-semibold text-[var(--muted)]"><span>初心者</span><span>経験者</span></span></label>
          <label className="grid gap-2 text-xs font-black text-[#4f4a44]"><span>好きなアーティスト</span><input value={favoriteArtistInput} onChange={(event) => setFavoriteArtistInput(event.target.value)} className="min-h-12 rounded-xl border border-[var(--line)] bg-[#fbfaf7] px-4 text-sm font-bold focus:bg-white" placeholder="例：back number" /></label>
        </div>
        <ChoiceGroup title="好きなジャンル" items={genres} selected={profile.preferredGenres} onToggle={(value) => toggleArray("preferredGenres", value)} />
        <ChoiceGroup title="好きな曲調" items={moods.slice(0, 14)} selected={profile.preferredMoods} onToggle={(value) => toggleArray("preferredMoods", value)} />
        <ChoiceGroup title="練習目標" items={goals} selected={profile.goalTypes} onToggle={(value) => toggleArray("goalTypes", value)} />
        <button type="submit" className="mt-8 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 text-sm font-black text-white transition hover:bg-[var(--accent-dark)] sm:w-auto"><Mic2 size={18} />おすすめを計算する<ArrowDown size={17} /></button>
      </form>

      {hasDiagnosed && <section id="recommend-results" className="scroll-mt-24 pt-16"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Your matches</p><h2 className="display-title mt-3 text-4xl sm:text-5xl">相性のよい曲</h2></div><p className="flex items-center gap-2 text-sm font-black text-[var(--accent-dark)]"><Sparkles size={17} />理由も確認できます</p></div><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{rankings.slice(0, 6).map((result) => { const song = songs.find((item) => item.id === result.songId); return song ? <SongCard key={song.id} song={song} score={result.totalScore} reasons={result.reasons} /> : null; })}</div></section>}
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return <label className="grid gap-2 text-xs font-black text-[#4f4a44]"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 rounded-xl border border-[var(--line)] bg-[#fbfaf7] px-3 text-sm font-bold focus:bg-white">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function ChoiceGroup({ title, items, selected, onToggle }: { title: string; items: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return <fieldset className="mt-7"><legend className="text-xs font-black text-[#4f4a44]">{title}</legend><div className="mt-3 flex flex-wrap gap-2">{items.map((item) => <button key={item} type="button" aria-pressed={selected.includes(item)} onClick={() => onToggle(item)} className={`rounded-full border px-3.5 py-2 text-xs font-black transition ${selected.includes(item) ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-dark)]" : "border-[var(--line)] bg-white text-[#68625b] hover:border-[var(--ink)]"}`}>{item}</button>)}</div></fieldset>;
}
