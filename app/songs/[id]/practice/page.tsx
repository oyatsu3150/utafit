import { notFound } from "next/navigation";
import { PracticeMode } from "@/components/practice-mode";
import { getAnnotationsForLine, getLinesForSong, getSectionsForSong } from "@/data/lyrics";
import { getSongById, songs } from "@/data/songs";

export function generateStaticParams() {
  return songs.filter((song) => song.lyricsStatus === "available").map((song) => ({ id: song.id }));
}

export default async function PracticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const song = getSongById(id);
  if (!song || song.lyricsStatus !== "available") notFound();
  const lines = getLinesForSong(song.id);
  const annotations = lines.flatMap((line) => getAnnotationsForLine(line.id));
  return <main><PracticeMode song={song} lines={lines} annotations={annotations} sections={getSectionsForSong(song.id)} /></main>;
}
