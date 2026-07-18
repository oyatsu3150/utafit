export default function Loading() {
  return (
    <main className="page-shell py-16" aria-busy="true" aria-label="読み込み中">
      <div className="h-4 w-28 animate-pulse rounded bg-[#e8e3dc]" />
      <div className="mt-5 h-12 max-w-xl animate-pulse rounded-xl bg-[#e8e3dc]" />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-96 animate-pulse rounded-[1.4rem] bg-[#ece8e1]" />)}
      </div>
    </main>
  );
}
