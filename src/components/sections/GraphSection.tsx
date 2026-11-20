"use client";

import { motion, type Variants } from "framer-motion";
import { Sparkles } from "lucide-react";
import TechStackGraph from "@/components/TechStackGraph";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: i * 0.1 },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export default function GraphSection() {
  return (
    <section id="graph" className="relative mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32 bg-slate-50/60">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mb-10"
      >
        <motion.div className="flex items-center gap-3 mb-4" variants={fadeUp} custom={0}>
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
            Explore Connections
          </span>
          <span className="h-px flex-1 max-w-24 bg-gradient-to-r from-emerald-400/60 to-transparent" />
        </motion.div>

        <motion.h2
          className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4"
          variants={fadeUp}
          custom={1}
        >
          Skill &{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
            Project Graph
          </span>
        </motion.h2>

        <motion.div className="glow-line w-24 mb-6" variants={fadeUp} custom={2} />

        <motion.p
          className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl"
          variants={fadeUp}
          custom={3}
        >
          Hover over any node to see its connections. Click on a project node to view details.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-200/60"
      >
        <TechStackGraph />
      </motion.div>
    </section>
  );
}
