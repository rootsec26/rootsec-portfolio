"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { SkillItem } from "@/data/skills";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Deterministic pseudo-random phase per tile name for idle float */
function seedOf(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

const tileVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
  hover: (color: string) => ({
    y: -6,
    scale: 1.08,
    borderColor: color,
    boxShadow: `0 16px 32px -12px ${color}66, 0 4px 14px -6px ${color}40`,
    transition: { type: "spring", stiffness: 400, damping: 20 },
  }),
};

const iconVariants: Variants = {
  hover: (tilt: number) => ({
    rotate: tilt,
    transition: { type: "spring", stiffness: 400, damping: 12 },
  }),
};

interface TechTileProps {
  item: SkillItem;
  index: number;
}

export default function TechTile({ item, index }: TechTileProps) {
  const reduced = useReducedMotion();
  const seed = seedOf(item.name);
  const tilt = index % 2 === 0 ? 6 : -6;
  const floatDuration = 4.5 + (seed % 30) / 10;
  const floatDelay = (seed % 40) / 10;

  return (
    <motion.div
      variants={tileVariants}
      custom={item.color}
      whileHover="hover"
      role="img"
      aria-label={item.name}
      tabIndex={0}
      className="group relative flex w-full cursor-default flex-col items-center gap-1.5 rounded-2xl border bg-white px-2 py-3.5 shadow-sm outline-none transition-shadow sm:px-3 sm:py-4 focus-visible:ring-2 focus-visible:ring-emerald-400"
      style={{
        borderColor: "#E2E8F0",
        backgroundColor: `${item.color}0F`,
      }}
    >
      {/* Icon chip — outer floats, inner tilts on hover */}
      <motion.span
        animate={reduced ? undefined : { y: [0, -3, 0] }}
        transition={
          reduced
            ? undefined
            : {
                duration: floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: floatDelay,
              }
        }
        className="flex"
      >
        <motion.span
          variants={iconVariants}
          custom={tilt}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-white shadow-sm sm:h-16 sm:w-16"
          style={{
            borderColor: `${item.color}40`,
            backgroundColor: `${item.color}14`,
          }}
        >
          <item.icon size={26} color={item.color} className="shrink-0" />
        </motion.span>
      </motion.span>

      {/* Name */}
      <span className="text-center text-[10px] font-medium leading-tight text-slate-600 sm:text-[11px]">
        {item.name}
      </span>

      {/* Tooltip */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {item.name}
      </span>
    </motion.div>
  );
}
