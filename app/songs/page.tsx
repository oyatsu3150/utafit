import { Suspense } from "react";
import { SongsExplorer } from "@/components/songs-explorer";
import { moods, songs } from "@/data/songs";

export const metadata = { title: "曲を探す" };

export default function SongsPage() {
  return (
    <main>
      <Suspense fallback={<div className="page-shell py-20 text-sm font-bold text-[var(--muted)]">曲を読み込んでいます…</div>}>
        <SongsExplorer songs={songs} moods={moods} />
      </Suspense>
    </main>
  );
}
