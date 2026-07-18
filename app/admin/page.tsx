import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AdminAccessMessage } from "@/components/admin-access-message";
import { songs } from "@/data/songs";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const { preview } = await searchParams;
  if (!(process.env.NODE_ENV === "development" && preview === "1")) return <AdminAccessMessage />;
  const editableSongs = songs.filter((song) => song.lyricsStatus === "available");
  return <main className="page-shell py-12 sm:py-16"><div className="flex items-start gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-dark)]"><ShieldCheck size={22} /></span><div><p className="eyebrow">Local admin preview</p><h1 className="display-title mt-2 text-4xl sm:text-5xl">歌唱注釈を管理</h1><p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">ローカル開発専用の簡易画面です。実際の公開・ユーザー管理はSupabase連携後に有効化します。</p></div></div><div className="mt-9 grid gap-4">{editableSongs.map((song) => <Link key={song.id} href={`/admin/songs/${song.id}/annotations?preview=1`} className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-[var(--line)] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"><div><p className="font-black">{song.title}</p><p className="mt-1 text-sm font-semibold text-[var(--muted)]">{song.artist} ・ 歌詞注釈を編集</p></div><ArrowRight size={19} /></Link>)}</div></main>;
}
