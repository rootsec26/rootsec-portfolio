"use client";

export default function LocalStats() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      <div className="min-w-[220px] rounded-xl border border-slate-200 bg-white/90 p-4 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="live-dot-ping-1" />
            <span className="live-dot-ping-2" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">
            Local Admin View
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Total Visits</span>
            <span className="font-mono text-sm font-medium text-slate-700">
              47
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Unique Visits</span>
            <span className="font-mono text-sm font-medium text-emerald-600">
              23
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Pages / Visit</span>
            <span className="font-mono text-sm font-medium text-slate-700">
              3.2
            </span>
          </div>
        </div>

        <div className="mt-3 border-t border-slate-100 pt-2.5">
          <p className="text-[10px] text-slate-400">
            Dev only · localhost:3000
          </p>
        </div>
      </div>
    </div>
  );
}
