import { LockKeyhole } from "lucide-react";
import Link from "next/link";

export function AdminAccessMessage() {
  return <main className="page-shell grid min-h-[62svh] place-items-center py-20 text-center"><div className="max-w-lg"><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#f2efe9]"><LockKeyhole size={27} /></span><p className="eyebrow mt-6">Admin only</p><h1 className="display-title mt-3 text-4xl">管理者ログインが必要です</h1><p className="mt-4 leading-7 text-[var(--muted)]">一般ユーザーは管理画面を開けません。Phase 2でSupabase Authと管理者ロールを接続します。ローカル開発時だけ、READMEに記載したプレビューURLで編集画面を確認できます。</p><Link href="/" className="mt-7 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-black text-white">ホームへ戻る</Link></div></main>;
}
