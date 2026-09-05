"use client";

import { useRef, useCallback } from "react";

interface BorderBeamProps {
  color?: string;
  size?: number;
  duration?: number;
}

export default function BorderBeam({
  color = "rgba(52, 211, 153, 0.6)",
  size = 200,
  duration = 3,
}: BorderBeamProps) {
  const beamRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const parent = beamRef.current?.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const angle = Math.atan2(y - centerY, x - centerX);
      const degrees = (angle * 180) / Math.PI + 90;

      beamRef.current?.style.setProperty(
        "--beam-angle",
        `${degrees}deg`
      );
    },
    []
  );

  return (
    <div
      ref={beamRef}
      className="border-beam pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
      onMouseMove={handleMouseMove}
      style={{
        "--beam-color": color,
        "--beam-size": `${size}px`,
        "--beam-duration": `${duration}s`,
        "--beam-angle": "0deg",
      } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}
