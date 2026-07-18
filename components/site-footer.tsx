import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--line)] bg-white">
      <div className="page-shell flex flex-col gap-5 py-10 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black text-[var(--ink)]">UtaFit</p>
          <p className="mt-1">自分の声で、歌を選ぶ。</p>
        </div>
        <div className="flex flex-wrap gap-5 font-bold">
          <Link className="hover:text-[var(--ink)]" href="/songs">曲一覧</Link>
          <Link className="hover:text-[var(--ink)]" href="/recommend">音域診断</Link>
          <Link className="hover:text-[var(--ink)]" href="/project-story">制作レポート</Link>
          <span>歌詞は架空データのみ掲載</span>
        </div>
      </div>
    </footer>
  );
}
