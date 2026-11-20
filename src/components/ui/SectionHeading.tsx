"use client";

import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

interface SectionHeadingProps {
  icon?: LucideIcon;
  label: string;
  title: React.ReactNode;
  description?: string;
}

export default function SectionHeading({
  icon: Icon,
  label,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <motion.div
      className="mb-14 md:mb-16"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.div className="flex items-center gap-3 mb-4" variants={item}>
        {Icon && <Icon className="w-5 h-5 text-emerald-500" />}
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
          {label}
        </span>
        <span className="h-px flex-1 max-w-24 bg-gradient-to-r from-emerald-400/60 to-transparent" />
      </motion.div>

      <motion.h2
        className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4"
        variants={item}
      >
        {title}
      </motion.h2>

      <motion.div className="glow-line w-24 mb-6" variants={item} />

      {description && (
        <motion.p
          className="text-slate-600 max-w-xl text-base md:text-lg leading-relaxed"
          variants={item}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
