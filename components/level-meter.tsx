import type { FiveLevel } from "@/types/song";

export function LevelMeter({ value, label }: { value: FiveLevel; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label={`${label ?? "レベル"} ${value}/5`}>
      <span className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((level) => (
          <span
            key={level}
            className={`h-1.5 w-3 rounded-full ${level <= value ? "bg-[var(--accent)]" : "bg-[#ded9d2]"}`}
          />
        ))}
      </span>
      <span className="text-xs font-black tabular-nums">{value}/5</span>
    </span>
  );
}
