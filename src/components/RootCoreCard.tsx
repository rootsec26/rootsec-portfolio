"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import BorderBeam from "@/components/BorderBeam";
import type { FrameloopMode } from "@/components/three/RootCoreScene";

/* 3D scene is client-only - heavy chunk loaded on demand */
const RootCoreScene = dynamic(() => import("@/components/three/RootCoreScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-teal-500/[0.03]" />
  ),
});

const MONO = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" } as const;

export default function RootCoreCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [lowEnd, setLowEnd] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  /* Render the WebGL loop only while the card is on screen */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05, rootMargin: "120px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Capability detection - client-side only, deferred to avoid SSR mismatch */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const cores = navigator.hardwareConcurrency ?? 8;
      const mem = (navigator as Navigator & { deviceMemory?: number })
        .deviceMemory;
      const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      setLowEnd(cores <= 4 || (mem !== undefined && mem < 4) || mobile);
      setReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    });

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const frameloop: FrameloopMode = inView ? "always" : "demand";

  return (
    <div
      ref={cardRef}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 hover:border-emerald-400/60 hover:shadow-xl hover:shadow-emerald-500/10 backdrop-blur transition-[border-color,box-shadow] duration-500"
    >
      <BorderBeam color="rgba(52, 211, 153, 0.5)" duration={4} />

      {/* macOS-style window header */}
      <div className="flex select-none items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="traffic-light bg-[#ff5f56]" />
          <span className="traffic-light bg-[#ffbd2e]" />
          <span className="traffic-light bg-[#27c93f]" />
        </div>
        <div className="flex-1 text-center">
          <span className="inline-flex items-center gap-1.5 truncate text-[11px] font-medium text-slate-500">
            <span className="relative flex h-1.5 w-1.5">
              <span className="live-dot-ping-1" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
            </span>
            rootsec.core/3d
          </span>
        </div>
        <span className="w-10" aria-hidden="true" />
      </div>

      {/* 3D viewport */}
      <div className="relative min-h-[300px] flex-1 sm:min-h-[340px]">
        <RootCoreScene
          lowEnd={lowEnd}
          reducedMotion={reducedMotion}
          frameloop={frameloop}
        />

        {/* Terminal-style caption */}
        <div
          className="pointer-events-none absolute bottom-3 left-4 z-10 text-[10px] leading-relaxed text-emerald-600"
          style={MONO}
        >
          <span className="text-emerald-500">&gt;</span> root@core:~$ rendering
          stack
          <span className="ml-1 inline-block h-3 w-[7px] translate-y-[2px] animate-pulse bg-emerald-400/80" />
        </div>
      </div>
    </div>
  );
}
