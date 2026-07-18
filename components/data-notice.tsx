import { Info } from "lucide-react";
import { SAMPLE_DATA_NOTICE } from "@/data/songs";

export function DataNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex gap-2.5 rounded-2xl border border-[#ead8b6] bg-[#fffaf0] text-[#6f5424] ${compact ? "p-3 text-xs" : "p-4 text-sm"}`}>
      <Info aria-hidden="true" className="mt-0.5 shrink-0" size={compact ? 15 : 18} />
      <p className="leading-relaxed"><strong>サンプルデータ：</strong>{SAMPLE_DATA_NOTICE}</p>
    </div>
  );
}
