import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell grid min-h-[62svh] place-items-center py-20 text-center">
      <div>
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-dark)]"><SearchX size={28} /></span>
        <p className="eyebrow mt-6">404 / Not found</p>
        <h1 className="display-title mt-3 text-4xl">曲が見つかりませんでした</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-[var(--muted)]">URLが違うか、曲データがまだ登録されていない可能性があります。</p>
        <Link href="/songs" className="mt-7 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-black text-white">曲一覧へ戻る</Link>
      </div>
    </main>
  );
}
