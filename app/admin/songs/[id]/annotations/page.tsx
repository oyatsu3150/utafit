import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminAccessMessage } from "@/components/admin-access-message";
import { AdminAnnotationEditor } from "@/components/admin-annotation-editor";
import { getAnnotationsForLine, getLinesForSong, getSectionsForSong } from "@/data/lyrics";
import { getSongById } from "@/data/songs";

export default async function AnnotationAdminPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ preview?: string }> }) {
  const { preview } = await searchParams;
  if (!(process.env.NODE_ENV === "development" && preview === "1")) return <AdminAccessMessage />;
  const { id } = await params;
  const song = getSongById(id);
  if (!song || song.lyricsStatus !== "available") notFound();
  const lines = getLinesForSong(song.id);
  const annotations = lines.flatMap((line) => getAnnotationsForLine(line.id));
  return <main className="page-shell py-10"><Link href="/admin?preview=1" className="inline-flex items-center gap-2 text-sm font-black text-[var(--muted)]"><ArrowLeft size={16} />管理曲一覧へ</Link><div className="mt-6"><p className="eyebrow">Annotation editor</p><h1 className="display-title mt-2 text-4xl sm:text-5xl">{song.title}</h1><p className="mt-2 font-bold text-[var(--muted)]">歌詞を選択して、歌唱方法を付けます。</p></div><div className="mt-8"><AdminAnnotationEditor song={song} lines={lines} sections={getSectionsForSong(song.id)} initialAnnotations={annotations} /></div></main>;
}
