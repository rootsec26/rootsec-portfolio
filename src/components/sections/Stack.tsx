"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Braces } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import TechTile from "@/components/ui/TechTile";
import {
  SKILL_CATEGORIES,
  SECURITY_GROUPS,
  SECURITY_ICON,
  SECURITY_NOTE,
  SECURITY_TITLE,
  SECURITY_BADGE,
  type SkillCategory,
} from "@/data/skills";

const EASE = [0.22, 1, 0.36, 1] as const;

type FilterId = "all" | SkillCategory["id"] | "security";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "tools", label: "Tools" },
  { id: "security", label: "Security" },
];

const categoryVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -14,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const tileGridVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.15 },
  },
};

function CategoryBlock({ cat }: { cat: SkillCategory }) {
  return (
    <motion.div
      layout
      variants={categoryVariants}
      initial="hidden"
      whileInView="show"
      exit="exit"
      viewport={{ once: true, margin: "-60px" }}
      className="relative"
    >
      {/* Header */}
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
          {cat.tag}
        </p>
        <div className="mt-1 flex items-baseline gap-3">
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
            {cat.title}
          </h3>
          <span className="text-[11px] font-medium text-slate-400">
            {cat.items.length} technologies
          </span>
        </div>
        <div className="glow-line w-20 mt-3" />
      </div>

      {/* Tiles */}
      <motion.div
        className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6"
        variants={tileGridVariants}
      >
        {cat.items.map((item, i) => (
          <TechTile key={item.name} item={item} index={i} />
        ))}
      </motion.div>
    </motion.div>
  );
}

function SecurityBlock() {
  const Icon = SECURITY_ICON;
  return (
    <motion.div
      layout
      variants={categoryVariants}
      initial="hidden"
      whileInView="show"
      exit="exit"
      viewport={{ once: true, margin: "-60px" }}
      className="relative lg:col-span-2"
    >
      <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-lg shadow-slate-200/60 backdrop-blur sm:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-500">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
                {SECURITY_TITLE}
              </h3>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                {SECURITY_BADGE}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
              {SECURITY_GROUPS.reduce((n, g) => n + g.items.length, 0)} tools
            </p>
          </div>
          <div className="ml-auto hidden h-px flex-1 bg-gradient-to-r from-emerald-300/50 to-transparent sm:block" />
        </div>

        {/* Groups */}
        <motion.div
          className="grid gap-6 md:grid-cols-3"
          variants={tileGridVariants}
        >
          {SECURITY_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {group.title}
              </p>
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
                {group.items.map((item, i) => (
                  <TechTile key={item.name} item={item} index={i} />
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        <p className="mt-6 text-[11px] italic text-slate-400">
          {SECURITY_NOTE}
        </p>
      </div>
    </motion.div>
  );
}

export default function Stack() {
  const [filter, setFilter] = useState<FilterId>("all");

  const visibleCategories = SKILL_CATEGORIES.filter(
    (c) => filter === "all" || c.id === filter
  );
  const showSecurity = filter === "all" || filter === "security";

  return (
    <section id="stack" className="relative mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="tech-section-glow absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[140px]" />
        <div className="tech-section-glow absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-[120px]" style={{ animationDelay: "-7s" }} />
      </div>

      <div className="relative">
        <SectionHeading
          icon={Braces}
          label="Tech Stack"
          title={
            <>
              Tools &{" "}
              <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">
                Technologies
              </span>
            </>
          }
          description="A curated set of modern technologies I use to build scalable, high-performance applications."
        />

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter skills by category"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                  active
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                    : "border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </motion.div>

        {/* Category grid */}
        <motion.div layout className="grid gap-x-10 gap-y-14 lg:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleCategories.map((cat) => (
              <CategoryBlock key={cat.id} cat={cat} />
            ))}
            {showSecurity && <SecurityBlock key="security" />}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
