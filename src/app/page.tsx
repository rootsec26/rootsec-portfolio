"use client";
import { useCallback, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Hero3D from "@/components/Hero3D";
import CyberBot from "@/components/CyberBot";
import TerminalModal from "@/components/TerminalModal";
import TechStackGraph from "@/components/TechStackGraph";
import BorderBeam from "@/components/BorderBeam";
import {
  Mail,
  ExternalLink,
  Copy,
  Cloud,
  Sparkles,
  Layers,
  Layout,
  Database,
  Globe,
  Braces,
  ArrowDown,
  Send,
  GraduationCap,
} from "lucide-react";

/* ─── Animation Variants ─── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1],
      delay: i * 0.1,
    },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
      delay: i * 0.06,
    },
  }),
};

const glowLineExpand: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1], delay: 0.3 },
  },
};

/* ─── Data ─── */

const TECH_STACK = [
  {
    title: "Frontend",
    icon: Layout,
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "JavaScript"],
    accent: { from: "teal-500", color: "rgba(20,184,166,", dot: "#14b8a6" },
  },
  {
    title: "Backend & BaaS",
    icon: Database,
    items: ["Supabase", "Node.js", "Express", "Python"],
    accent: { from: "cyan-500", color: "rgba(6,182,212,", dot: "#06b6d4" },
  },
  {
    title: "Tools",
    icon: Cloud,
    items: ["Vercel", "Cloudinary", "Git & GitHub"],
    accent: { from: "blue-500", color: "rgba(59,130,246,", dot: "#3b82f6" },
  },
];

const PROJECTS = [
  {
    title: "Al-Nazer Educational Platform",
    category: "Full-Stack E-Learning Ecosystem",
    desc: "A full-stack e-learning ecosystem built for high school students featuring video management, interactive quizzes, and real-time dashboards.",
    badges: ["Next.js", "React", "Tailwind CSS", "Supabase", "Cloudinary", "Vercel"],
    url: "https://elnazer.vercel.app/",
  },
  {
    title: "Madar-X Academic Ecosystem",
    category: "Academic Management Platform",
    desc: "A modern university academic management platform designed for data simulation, course tracking, and interactive controls.",
    badges: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"],
    url: "https://madarx.vercel.app/",
  },
];

/* ─── Components ─── */

function GlowLine() {
  return (
    <motion.div
      className="glow-line w-24 mb-4 origin-left"
      variants={glowLineExpand}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    />
  );
}

function LiveBadge() {
  return (
    <span className="relative inline-flex items-center gap-1.5 rounded-full bg-emerald/[0.06] border border-emerald/20 px-3 py-1 text-[11px] font-semibold text-emerald">
      <span className="relative flex h-2 w-2">
        <span className="live-dot-ping-1" />
        <span className="live-dot-ping-2" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
      </span>
      LIVE DEMO
    </span>
  );
}

/* ─── 3D Tilt Card Component ─── */

interface Project {
  title: string;
  category: string;
  desc: string;
  badges: string[];
  url: string;
}

function ProjectTiltCard({ proj, index }: { proj: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      targetRef.current = { rotateX, rotateY, glareX, glareY };

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;

      const glare = card.querySelector<HTMLElement>(".tilt-card-glare");
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(52,211,153,0.15) 0%, rgba(16,185,129,0.06) 30%, transparent 65%)`;
        glare.style.opacity = "1";
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";

    const glare = card.querySelector<HTMLElement>(".tilt-card-glare");
    if (glare) {
      glare.style.opacity = "0";
    }
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="tilt-card-3d group relative rounded-2xl bg-neutral-950/80 backdrop-blur-2xl border border-emerald-500/20 hover:border-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.15)] overflow-hidden transition-[border-color,box-shadow] duration-500"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={fadeUp}
      custom={index}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Border Beam Animation */}
      <BorderBeam color="rgba(52, 211, 153, 0.5)" duration={4} />

      {/* Holographic glare overlay */}
      <div className="tilt-card-glare" />

      {/* macOS-style dark window header */}
      <div className="tilt-depth-1 bg-[#0a0a0a] border-b border-white/[0.06] px-4 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="traffic-light bg-[#ff5f56]" />
          <span className="traffic-light bg-[#ffbd2e]" />
          <span className="traffic-light bg-[#27c93f]" />
        </div>
        <div className="flex-1 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium truncate">
            <span className="relative flex h-1.5 w-1.5">
              <span className="live-dot-ping-1" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
            </span>
            {new URL(proj.url).hostname}
          </span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-8 md:p-10" style={{ transformStyle: "preserve-3d" }}>
        <div className="flex items-start justify-between mb-4 tilt-depth-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald/15 to-accent/5 border border-white/[0.05] flex items-center justify-center text-emerald"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-neutral-300 bg-clip-text text-transparent leading-snug">
                {proj.title}
              </h3>
              <p className="text-[12px] text-teal-400/70 font-medium mt-0.5">
                {proj.category}
              </p>
            </div>
          </div>
        </div>

        {/* Live Badge */}
        <div className="mb-5 tilt-depth-2">
          <LiveBadge />
        </div>

        <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6 tilt-depth-2">
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
              className="badge-pill rounded-full px-3 py-1 text-[11px] md:text-xs font-medium text-slate-400"
              variants={scaleIn}
              custom={j}
              whileHover={{
                scale: 1.08,
                borderColor: "rgba(52, 211, 153, 0.6)",
                boxShadow: "0 0 16px rgba(52, 211, 153, 0.12)",
                color: "#ffffff",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {badge}
            </motion.span>
          ))}
        </motion.div>

        <motion.a
          href={proj.url}
          target="_blank"
          rel="noopener noreferrer"
          className="tilt-depth-4 btn-shimmer inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald/10 to-accent/10 border border-emerald/20 px-5 py-2.5 text-sm font-semibold text-emerald group-hover:border-emerald/40 group-hover:shadow-[0_0_24px_rgba(52,211,153,0.15)] transition-all duration-300"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          Visit Live Platform
          <ExternalLink className="w-4 h-4" />
        </motion.a>
      </div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("rootsec68@gmail.com");
    } catch {
      // ignore
    }
  }, []);

  /* ── Scroll detection for header ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Keyboard shortcut: Ctrl+` to open terminal ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "`" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* ─── Floating Header ─── */}
      <header className={`site-header group ${scrolled ? "scrolled" : ""}`}>
        {/* Border Beam Animation */}
        <BorderBeam color="rgba(52, 211, 153, 0.3)" duration={6} size={150} />
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <a href="#" className="text-sm font-bold tracking-tight text-white/80 hover:text-white transition-colors">
            rootsec<span className="text-emerald-400">.</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-xs text-neutral-500">
            <a href="#work" className="hover:text-white transition-colors">Work</a>
            <a href="#stack" className="hover:text-white transition-colors">Stack</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
          <button
            onClick={() => setTerminalOpen(true)}
            className="terminal-toggle-btn"
            aria-label="Open terminal mode"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <span className="hidden sm:inline">&gt;_ Terminal</span>
            <span className="sm:hidden">&gt;_</span>
          </button>
        </div>
      </header>
      {/* ─── Ambient Floating Glow Blobs ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="glow-blob ambient-float w-[600px] h-[600px] bg-emerald/[0.06] -top-[200px] -left-[200px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 3, ease: "easeOut" }}
        />
        <motion.div
          className="glow-blob ambient-float-delayed w-[500px] h-[500px] bg-accent/[0.04] top-[30%] -right-[150px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
        />
        <motion.div
          className="glow-blob ambient-float-slow w-[400px] h-[400px] bg-emerald/[0.035] bottom-[10%] -left-[100px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 3, ease: "easeOut", delay: 1 }}
        />
      </div>

      {/* ─── Subtle Grid on Black ─── */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-30 grid-pattern" />

      <main className="relative z-10">
        {/* HERO SECTION */}
        <Hero3D />

        {/* ─── PROFILE OVERLAY ─── */}
        <section className="relative mx-auto max-w-5xl px-6 md:px-10 -mt-8 md:-mt-4 pb-16 md:pb-24">
          {/* Ambient glow behind profile */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
          </div>

          <motion.div
            className="relative z-10 text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Status Badge */}
            <motion.div className="flex justify-center mb-6" variants={fadeUp} custom={0}>
              <span className="hero-profile-badge inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.08] px-4 py-2 text-[12px] font-semibold tracking-wide text-emerald-400/90">
                <span className="relative flex h-2 w-2">
                  <span className="live-dot-ping-1" />
                  <span className="live-dot-ping-2" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                AI Student & Full-Stack Developer
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-3"
              variants={fadeUp}
              custom={1}
            >
              <span className="bg-gradient-to-r from-white via-slate-200 to-teal-400 bg-clip-text text-transparent">
                Ashraf Omar
              </span>
            </motion.h1>

            {/* Arabic Name */}
            <motion.p
              className="text-lg md:text-xl text-neutral-500 font-medium mb-6 tracking-wide"
              dir="rtl"
              variants={fadeUp}
              custom={1.5}
            >
              أشرف عمر
            </motion.p>

            {/* University */}
            <motion.div className="flex justify-center mb-4" variants={fadeUp} custom={2}>
              <div className="inline-flex items-center gap-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] px-5 py-2.5">
                <GraduationCap className="w-4 h-4 text-teal-400/80 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-300 leading-tight">
                    Faculty of Computers & Artificial Intelligence
                  </p>
                  <p className="text-[11px] text-neutral-500 leading-tight">
                    Assiut National University
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Arabic University Subtext */}
            <motion.p
              className="text-[13px] text-neutral-600 mb-8"
              dir="rtl"
              variants={fadeUp}
              custom={2.5}
            >
              طالب بكلية الحاسبات والذكاء الاصطناعي - جامعة أسيوط الأهلية
            </motion.p>

            {/* Short Pitch */}
            <motion.p
              className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
              variants={fadeUp}
              custom={3}
            >
              Specializing in building modern, full-stack web platforms,
              <span className="text-slate-200 font-medium"> Next.js applications</span>, and
              <span className="text-teal-400/90 font-medium"> AI integrations</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              variants={fadeUp}
              custom={4}
            >
              <motion.a
                href="#work"
                className="btn-shimmer group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-semibold text-black shadow-[0_0_24px_rgba(52,211,153,0.25)] hover:shadow-[0_0_40px_rgba(52,211,153,0.4)] transition-shadow duration-300"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Explore Projects
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </motion.a>

              <motion.a
                href="#contact"
                className="btn-shimmer inline-flex items-center gap-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] px-7 py-3.5 text-sm font-medium text-slate-300 hover:text-white hover:border-white/[0.16] hover:bg-white/[0.06] transition-all duration-300"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Contact Me
                <Send className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </motion.div>
        </section>

        {/* ─── AI AVATAR SHOWCASE ─── */}
        <section className="w-full relative min-h-[500px] flex items-center justify-center overflow-hidden my-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="absolute inset-0"
          >
            <Image
              src="/photo_ai.png"
              alt="AI Generated Avatar"
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute bottom-8 text-sm text-slate-500 tracking-wide z-20"
          >
            Crafting the future with AI
          </motion.p>
        </section>

        {/* ─── SELECTED PROJECTS ─── */}
        <section id="work" className="mx-auto max-w-6xl px-6 md:px-10 py-28 md:py-36">
          {/* Section Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="flex items-center gap-3 mb-4" variants={fadeUp} custom={0}>
              <Layers className="w-5 h-5 text-emerald" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted">
                Featured Work
              </span>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
              variants={fadeUp}
              custom={1}
            >
              <span className="bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
                Selected Projects
              </span>
            </motion.h2>

            <GlowLine />

            <motion.p
              className="text-text-secondary max-w-xl mb-16 text-base md:text-lg leading-relaxed"
              variants={fadeUp}
              custom={2}
            >
              Real-world platforms designed for performance, accessibility, and seamless user experience.
            </motion.p>
          </motion.div>

          {/* Project Cards */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {PROJECTS.map((proj, i) => (
              <ProjectTiltCard key={proj.title} proj={proj} index={i} />
            ))}
          </motion.div>
        </section>

        {/* ─── TECH STACK ─── */}
        <section id="stack" className="relative mx-auto max-w-6xl px-6 md:px-10 py-28 md:py-36">
          {/* Section ambient drift */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="tech-section-glow absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[160px]" />
            <div className="tech-section-glow absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/[0.025] rounded-full blur-[140px]" style={{ animationDelay: "-7s" }} />
          </div>

          {/* Section Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10"
          >
            <motion.div className="flex items-center gap-3 mb-5" variants={fadeUp} custom={0}>
              <span className="tech-badge-glow inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-400/90">
                <Braces className="w-3.5 h-3.5" />
                Tech Stack
              </span>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
              variants={fadeUp}
              custom={1}
            >
              <span className="bg-gradient-to-r from-white via-teal-50/80 to-teal-400/60 bg-clip-text text-transparent">
                Tools & Technologies
              </span>
            </motion.h2>

            <GlowLine />

            <motion.p
              className="text-text-secondary max-w-xl mb-16 text-base md:text-lg leading-relaxed"
              variants={fadeUp}
              custom={2}
            >
              A curated set of modern technologies I use to build scalable, high-performance applications.
            </motion.p>
          </motion.div>

          {/* Tech Cards Grid */}
          <motion.div
            className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {TECH_STACK.map((cat, i) => (
              <motion.div
                key={cat.title}
                className="tech-card group relative rounded-2xl overflow-hidden"
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
              >
                {/* Card glow border on hover */}
                <div
                  className="tech-card-glow absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${cat.accent.color}0.2), transparent 60%)`,
                  }}
                />

                {/* Card body */}
                <div className="relative h-full bg-neutral-950/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 md:p-10 group-hover:border-white/[0.14] transition-colors duration-500">
                  {/* Top accent gradient bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${cat.accent.color}0.35), transparent)`,
                    }}
                  />

                  {/* Corner ambient glow */}
                  <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `${cat.accent.color}0.12)` }}
                  />

                  <div className="relative z-10">
                    {/* Icon + Title */}
                    <div className="flex items-center gap-3.5 mb-7">
                      <motion.div
                        className="w-11 h-11 rounded-xl border border-white/[0.06] flex items-center justify-center shadow-inner shadow-black/40"
                        style={{
                          background: `linear-gradient(135deg, ${cat.accent.color}0.1), ${cat.accent.color}0.03)`,
                          color: cat.accent.dot,
                        }}
                        whileHover={{ scale: 1.12, rotate: -6 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <cat.icon className="w-5 h-5" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary tracking-tight">
                          {cat.title}
                        </h3>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          {cat.items.length} technologies
                        </p>
                      </div>
                    </div>

                    {/* Tech Pills */}
                    <motion.div
                      className="flex flex-wrap gap-2"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {cat.items.map((item, j) => (
                        <motion.span
                          key={item}
                          className="tech-pill inline-flex items-center gap-1.5 rounded-full bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 text-[12px] font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-300"
                          variants={scaleIn}
                          custom={j}
                          whileHover={{
                            scale: 1.05,
                            borderColor: `${cat.accent.color}0.5)`,
                            boxShadow: `0 0 14px ${cat.accent.color}0.1)`,
                            color: "#ffffff",
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: cat.accent.dot, boxShadow: `0 0 6px ${cat.accent.color}0.4)` }}
                          />
                          {item}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── INTERACTIVE TECH GRAPH ─── */}
        <section id="graph" className="relative mx-auto max-w-6xl px-6 md:px-10 py-16 md:py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10"
          >
            <motion.div className="flex items-center gap-3 mb-4" variants={fadeUp} custom={0}>
              <Sparkles className="w-5 h-5 text-[#00ff66]" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted">
                Explore Connections
              </span>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
              variants={fadeUp}
              custom={1}
            >
              <span className="bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
                Skill & Project Graph
              </span>
            </motion.h2>

            <motion.p
              className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl"
              variants={fadeUp}
              custom={2}
            >
              Hover over any node to see its connections. Click on a project node to view details.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <TechStackGraph />
          </motion.div>
        </section>

        {/* ─── CONTACT / FOOTER ─── */}
        <footer id="contact" className="mx-auto max-w-6xl px-6 md:px-10 pt-10 pb-12">
          <motion.div
            className="contact-card group relative rounded-3xl overflow-hidden"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Border Beam Animation */}
            <BorderBeam color="rgba(52, 211, 153, 0.4)" duration={5} size={250} />

            {/* Ambient backlighting */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.06] blur-[140px]" />
              <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-cyan-500/[0.05] blur-[120px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-r from-emerald-500/[0.04] via-cyan-500/[0.03] to-transparent blur-[100px]" />
            </div>

            {/* Card body */}
            <div className="relative z-10 bg-neutral-950/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 md:p-12 lg:p-14">
              {/* Top accent line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

              <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center">
                {/* 3D Robot Canvas */}
                <motion.div
                  className="w-full lg:w-2/5 h-[300px] lg:h-[380px] flex-shrink-0 relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  {/* Canvas glow backdrop */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/[0.05] via-transparent to-cyan-500/[0.05] blur-xl" />
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/[0.04]">
                    <CyberBot />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {/* Glowing label */}
                    <motion.div className="mb-5" variants={fadeUp} custom={0}>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400/90">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Get in Touch
                      </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                      className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-[1.1]"
                      variants={fadeUp}
                      custom={1}
                    >
                      <span className="bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
                        Let&apos;s build something
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                        exceptional.
                      </span>
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                      className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg mb-8"
                      variants={fadeUp}
                      custom={2}
                    >
                      Open for collaborations, contract work, and ambitious product ideas.
                      Let&apos;s turn your vision into reality.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                      className="flex flex-wrap items-center gap-3"
                      variants={fadeUp}
                      custom={3}
                    >
                      {/* Primary CTA — Email */}
                      <motion.a
                        href="mailto:rootsec68@gmail.com"
                        className="btn-shimmer group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_0_24px_rgba(52,211,153,0.3)] hover:shadow-[0_0_40px_rgba(52,211,153,0.45)] transition-shadow duration-300"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <Mail className="w-4 h-4" />
                        rootsec68@gmail.com
                      </motion.a>

                      {/* GitHub — temporarily hidden
                      <motion.a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.08] px-5 py-3 text-sm font-medium text-slate-300 hover:text-white hover:border-white/[0.16] hover:bg-white/[0.06] transition-all duration-300"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <Globe className="w-4 h-4" />
                        GitHub
                      </motion.a>
                      */}

                      {/* WhatsApp */}
                      <motion.a
                        href="https://wa.me/201065592701"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.08] px-5 py-3 text-sm font-medium text-slate-300 hover:text-white hover:border-white/[0.16] hover:bg-white/[0.06] transition-all duration-300"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </motion.a>

                      {/* Copy icon */}
                      <motion.button
                        onClick={handleCopyEmail}
                        aria-label="Copy email"
                        title="Copy email"
                        className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.16] hover:bg-white/[0.06] transition-all duration-300"
                        whileHover={{ scale: 1.08, rotate: 10 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Copy className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer bar */}
          <motion.div
            className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p>&copy; {new Date().getFullYear()} rootsec. Designed with precision.</p>
          </motion.div>
        </footer>
      </main>

      {/* ─── Terminal / Hacker Mode ─── */}
      <TerminalModal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </div>
  );
}
