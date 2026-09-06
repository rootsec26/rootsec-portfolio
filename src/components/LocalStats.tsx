"use client";

export default function LocalStats() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      <div
        className="min-w-[220px] rounded-xl border border-white/[0.06] bg-[#0a0a0a]/90 p-4 shadow-2xl backdrop-blur-xl"
        style={{
          boxShadow:
            "0 0 0 1px rgba(52,211,153,0.08), 0 16px 64px -12px rgba(0,0,0,0.9)",
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs">🟢</span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
            Local Admin View
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/40">Total Visits</span>
            <span className="font-mono text-sm font-medium text-white/80">
              47
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/40">Unique Visits</span>
            <span className="font-mono text-sm font-medium text-emerald-400">
              23
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/40">Pages / Visit</span>
            <span className="font-mono text-sm font-medium text-white/80">
              3.2
            </span>
          </div>
        </div>

        <div className="mt-3 border-t border-white/[0.04] pt-2.5">
          <p className="text-[10px] text-white/20">
            Dev only · localhost:3000
          </p>
        </div>
      </div>
    </div>
  );
}
