"use client";

import { useCallback, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ExternalLink,
  Eye,
  Layers,
  Sparkles,
} from "lucide-react";
import BorderBeam from "@/components/BorderBeam";
import GithubIcon from "@/components/GithubIcon";
import RootCoreCard from "@/components/RootCoreCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { PROJECTS, type PortfolioProject } from "@/data/projects";

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
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE, delay: i * 0.06 },
  }),
};

function LiveBadge() {
  return (
    <span className="relative inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-700">
      <span className="relative flex h-2 w-2">
        <span className="live-dot-ping-1" />
        <span className="live-dot-ping-2" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      LIVE DEMO
    </span>
  );
}

/* ─── 3D Tilt Project Card ─── */

function ProjectTiltCard({
  proj,
  index,
  onPreview,
}: {
  proj: PortfolioProject;
  index: number;
  onPreview: (proj: PortfolioProject) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

      const glare = card.querySelector<HTMLElement>(".tilt-card-glare");
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(16,185,129,0.14) 0%, rgba(20,184,166,0.06) 35%, transparent 65%)`;
        glare.style.opacity = "1";
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
    const glare = card.querySelector<HTMLElement>(".tilt-card-glare");
    if (glare) glare.style.opacity = "0";
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="tilt-card-3d group relative rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/60 hover:border-emerald-400/60 hover:shadow-xl hover:shadow-emerald-500/10 overflow-hidden transition-[border-color,box-shadow] duration-500"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={fadeUp}
      custom={index}
      style={{ transformStyle: "preserve-3d" }}
    >
      <BorderBeam color="rgba(16, 185, 129, 0.5)" duration={4} />
      <div className="tilt-card-glare" />

      {/* Browser-style header — click opens live preview */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Preview ${proj.title}`}
        onClick={() => onPreview(proj)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPreview(proj);
          }
        }}
        className="tilt-depth-1 group/mockup cursor-pointer select-none bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-3 transition-colors hover:bg-slate-100"
      >
        <div className="flex items-center gap-1.5">
          <span className="traffic-light bg-[#ff5f56]" />
          <span className="traffic-light bg-[#ffbd2e]" />
          <span className="traffic-light bg-[#27c93f]" />
        </div>
        <div className="flex-1 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-medium truncate">
            <span className="relative flex h-1.5 w-1.5">
              <span className="live-dot-ping-1" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {new URL(proj.url).hostname}
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 opacity-0 transition-opacity duration-300 group-hover/mockup:opacity-100">
          <Eye className="w-3 h-3" />
          Preview
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-8 md:p-10" style={{ transformStyle: "preserve-3d" }}>
        <div className="flex items-start justify-between mb-4 tilt-depth-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-500"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 leading-snug">
                {proj.title}
              </h3>
              <p className="text-[12px] text-teal-600 font-medium mt-0.5">
                {proj.category}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 tilt-depth-2">
          <LiveBadge />
        </div>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 tilt-depth-2">
          {proj.desc}
        </p>

        <motion.div
          className="flex flex-wrap gap-2 mb-8 tilt-depth-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {proj.badges.map((badge, j) => (
            <motion.span
              key={badge}
              className="badge-pill rounded-full px-3 py-1 text-[11px] md:text-xs font-medium"
              variants={scaleIn}
              custom={j}
              whileHover={{
                scale: 1.08,
                borderColor: "rgba(16, 185, 129, 0.6)",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.15)",
                color: "#0f172a",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {badge}
            </motion.span>
          ))}
        </motion.div>

        <div className="flex flex-wrap items-center gap-3 tilt-depth-4">
          <motion.button
            type="button"
            onClick={() => onPreview(proj)}
            className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow duration-300"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Quick View
            <Eye className="w-4 h-4" />
          </motion.button>

          <motion.a
            href={proj.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Source Code"
            title="View Source Code"
            className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100 transition-colors duration-300"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <GithubIcon className="w-4 h-4 flex-shrink-0" />
            Code
          </motion.a>

          <motion.a
            href={proj.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-colors duration-300"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Visit Live Platform
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Section ─── */

interface WorkProps {
  onPreview: (proj: PortfolioProject) => void;
}

export default function Work({ onPreview }: WorkProps) {
  return (
    <section id="work" className="relative mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32 bg-slate-50/60">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="glow-blob ambient-float w-[500px] h-[500px] bg-emerald-200/20 -top-40 right-0" />
      </div>

      <div className="relative">
        <SectionHeading
          icon={Layers}
          label="Featured Work"
          title={
            <>
              Selected{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                Projects
              </span>
            </>
          }
          description="Real-world platforms designed for performance, accessibility, and seamless user experience."
        />

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {PROJECTS.map((proj, i) => (
            <ProjectTiltCard
              key={proj.title}
              proj={proj}
              index={i}
              onPreview={onPreview}
            />
          ))}
          <motion.div variants={fadeUp} custom={PROJECTS.length} className="h-full">
            <RootCoreCard />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
