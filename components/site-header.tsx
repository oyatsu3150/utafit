import { Headphones, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/songs", label: "曲を探す", icon: Search },
  { href: "/recommend", label: "音域から診断", icon: SlidersHorizontal },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(251,250,247,0.9)] backdrop-blur-xl">
      <div className="page-shell flex min-h-17 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 rounded-xl font-black tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-[var(--ink)] text-white">
            <Headphones aria-hidden="true" size={19} strokeWidth={2.4} />
          </span>
          <span className="text-lg">UtaFit</span>
          <span className="hidden rounded-full bg-[var(--accent-soft)] px-2 py-1 text-[10px] font-black text-[var(--accent-dark)] sm:inline">MVP</span>
        </Link>

        <nav aria-label="メインナビゲーション" className="flex items-center gap-1 sm:gap-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold text-[#514d47] transition hover:bg-white hover:text-[var(--ink)] sm:px-4"
            >
              <Icon aria-hidden="true" size={17} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
