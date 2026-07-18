import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  GitBranch,
  Lightbulb,
  Mic2,
  Search,
  ShieldCheck,
  Sparkles,
  TestTube2,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "制作レポート",
  description: "UtaFitを企画・設計・実装するまでに考えたことをまとめた制作ブログ。",
};

const decisions = [
  {
    icon: Lightbulb,
    title: "点数よりも、理由を見せる",
    text: "おすすめをブラックボックスにせず、音域・難易度・好み・練習目標の内訳と理由を表示する設計にしました。納得して曲を選べることを優先しています。",
  },
  {
    icon: ShieldCheck,
    title: "権利と精度を曖昧にしない",
    text: "実在曲の歌詞は掲載せず、歌詞注釈は架空曲だけで体験できる形にしました。音域などもサンプル値であることを各画面に明示しています。",
  },
  {
    icon: GitBranch,
    title: "将来の拡張を先に分ける",
    text: "検索・推薦・注釈計算を画面から分離し、将来データベースへ移行しても計算部分を再利用できる構成にしました。今回はMVPの範囲を守っています。",
  },
];

const learnings = [
  "要件を機能の一覧にせず、利用者が迷う場面へ置き換えて考えること",
  "URLに検索条件を残すと、再読み込みや共有にも強い画面になること",
  "複雑な表示ほど、先にデータ構造と純粋関数を決めると実装しやすいこと",
  "AIの提案をそのまま採用せず、テストと実際の画面で確かめること",
];

export default function ProjectStoryPage() {
  return (
    <main>
      <article>
        <header className="border-b border-[var(--line)] bg-white">
          <div className="page-shell py-14 sm:py-20">
            <div className="max-w-4xl">
              <p className="eyebrow">Project story</p>
              <h1 className="display-title mt-4 text-4xl leading-[1.12] sm:text-6xl">
                声に合う曲を、<br className="hidden sm:block" />
                <span className="text-[var(--accent)]">納得して選べる</span>サービスを作る。
              </h1>
              <p className="mt-7 max-w-3xl text-base font-medium leading-8 text-[var(--muted)] sm:text-lg">
                これは、歌唱支援Webアプリ「UtaFit」を企画し、設計し、実装するまでに考えたことをまとめた制作記録です。
              </p>
              <p className="mt-7 rounded-2xl border border-[#ffd4ca] bg-[var(--accent-soft)] px-5 py-4 text-sm font-black leading-7 text-[var(--accent-dark)]">
                「2026年 実践のためのWebプログラミングのレポート課題です」
              </p>
            </div>
          </div>
        </header>

        <section className="page-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="eyebrow">01 — Theme</p>
              <h2 className="display-title mt-3 text-3xl sm:text-5xl">何を作ったのか</h2>
            </div>
            <div className="space-y-5 text-[15px] font-medium leading-8 text-[#514d47] sm:text-base">
              <p>
                カラオケで曲を選ぶとき、知っている曲かどうかだけで決めると、実際には高すぎたり、裏声への切り替えが多かったりして歌いにくいことがあります。そこで、曲名に加えて「自分の安定音域」「声区」「難易度」「練習したいこと」から選べるサービスを考えました。
              </p>
              <p>
                UtaFitでは、曲検索、100点満点の相性診断、曲ごとの歌唱指標、歌詞上の歌い方注釈、1行ずつ進める練習モードをひとつの流れで試せます。
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              [Search, "探す", "音域・難易度・テンポなど12種類の条件で絞り込み"],
              [Sparkles, "診断する", "入力した音域と好みから相性と理由を計算"],
              [Mic2, "練習する", "歌い方の注釈を見ながら1フレーズずつ進行"],
            ].map(([Icon, title, text]) => {
              const ItemIcon = Icon as typeof Search;
              return (
                <section key={String(title)} className="card-shadow rounded-[1.5rem] border border-[var(--line)] bg-white p-6">
                  <span className="grid size-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-dark)]">
                    <ItemIcon aria-hidden="true" size={20} />
                  </span>
                  <h3 className="mt-5 text-lg font-black">{String(title)}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-[var(--muted)]">{String(text)}</p>
                </section>
              );
            })}
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-white py-16 sm:py-20">
          <div className="page-shell">
            <div className="max-w-3xl">
              <p className="eyebrow">02 — Design</p>
              <h2 className="display-title mt-3 text-3xl sm:text-5xl">設計で大切にした3つのこと</h2>
              <p className="mt-5 leading-7 text-[var(--muted)]">機能を増やすことよりも、安心して判断できることを基準にしました。</p>
            </div>
            <div className="mt-9 grid gap-5 lg:grid-cols-3">
              {decisions.map(({ icon: Icon, title, text }, index) => (
                <section key={title} className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--paper)] p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <Icon aria-hidden="true" className="text-[var(--accent)]" size={23} />
                    <span className="text-xs font-black text-[#aaa39a]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-black">{title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-[var(--muted)]">{text}</p>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <section>
              <p className="eyebrow">03 — Challenge</p>
              <h2 className="display-title mt-3 text-3xl sm:text-5xl">難しかったところ</h2>
              <div className="mt-7 space-y-5">
                <div className="rounded-[1.5rem] border border-[var(--line)] bg-white p-6">
                  <p className="flex items-center gap-2 text-sm font-black"><Database size={18} className="text-[var(--accent)]" />重なる歌詞注釈</p>
                  <p className="mt-3 text-sm font-medium leading-7 text-[var(--muted)]">同じ文字に複数の歌唱技法が重なる場合、単純に色を付けるだけでは情報が欠けます。注釈の開始・終了位置を境界として歌詞を分割し、同じ区間に複数注釈を持たせる計算を独立させました。</p>
                </div>
                <div className="rounded-[1.5rem] border border-[var(--line)] bg-white p-6">
                  <p className="flex items-center gap-2 text-sm font-black"><TestTube2 size={18} className="text-[var(--accent)]" />推薦の納得感</p>
                  <p className="mt-3 text-sm font-medium leading-7 text-[var(--muted)]">ただ高得点を出すのではなく、音域35点、難易度20点、ジャンル10点などに分け、最大4件の理由を返すルールベース関数にしました。結果をテストしやすいことも利点です。</p>
                </div>
              </div>
            </section>

            <section>
              <p className="eyebrow">04 — AI collaboration</p>
              <h2 className="display-title mt-3 text-3xl sm:text-5xl">AIとの役割分担</h2>
              <div className="mt-7 rounded-[1.7rem] bg-[var(--ink)] p-6 text-white sm:p-8">
                <Bot aria-hidden="true" className="text-[#ff8a74]" size={28} />
                <p className="mt-5 text-base font-black leading-8">AIには、要件整理、実装案の比較、コードのたたき台、テスト観点の洗い出しを手伝ってもらいました。</p>
                <p className="mt-4 text-sm font-medium leading-7 text-[#d6d2cc]">一方で、テーマ、機能の優先順位、著作権への配慮、MVPの境界、画面で伝える言葉は人が判断する部分として扱いました。出力は自動テストと本番ビルドで確認し、事実と違う説明を残さないようにしました。</p>
              </div>
            </section>
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-[var(--accent-soft)] py-16 sm:py-20">
          <div className="page-shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="eyebrow">05 — Learning</p>
              <h2 className="display-title mt-3 text-3xl sm:text-5xl">学びと感想</h2>
            </div>
            <div>
              <ul className="space-y-4">
                {learnings.map((learning) => (
                  <li key={learning} className="flex gap-3 rounded-2xl bg-white/75 p-4 text-sm font-bold leading-6">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--accent-dark)]" size={18} />
                    {learning}
                  </li>
                ))}
              </ul>
              <p className="mt-7 text-[15px] font-medium leading-8 text-[#514d47]">
                実装を終えて、プログラミングは画面を作る作業だけではなく、「どの情報なら信頼できるか」「何を今回は作らないか」を決める作業だと感じました。生成AIを使うほど、設計意図を言葉にし、確かめる力が重要になると思います。
              </p>
            </div>
          </div>
        </section>

        <section className="page-shell py-16 text-center sm:py-20">
          <p className="eyebrow">Try the product</p>
          <h2 className="display-title mt-3 text-3xl sm:text-5xl">実際に、自分の声から探してみる</h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/recommend" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-black text-white transition hover:bg-[var(--accent-dark)]">
              音域から診断する<ArrowRight size={17} />
            </Link>
            <Link href="/songs/yoake-no-canvas?tab=singing" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white px-6 text-sm font-black transition hover:border-[var(--ink)]">
              歌い方デモを見る
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
