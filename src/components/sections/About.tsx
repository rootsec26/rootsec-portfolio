"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";
import { useRef, useSyncExternalStore } from "react";
import { GraduationCap, MapPin, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Single showcase photo card ─── */

interface PhotoCardProps {
  src: string;
  alt: string;
  priority?: boolean;
  side: "left" | "right";
  floatDelay: number;
  parallax: MotionValue<number>;
  badge?: { text: string; className: string; floatClass: string };
}

function PhotoCard({
  src,
  alt,
  priority,
  side,
  floatDelay,
  parallax,
  badge,
}: PhotoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  /* 3D tilt */
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), {
    stiffness: 180,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), {
    stiffness: 180,
    damping: 20,
  });
  const glareX = useTransform(mx, (v) => `${v * 100}%`);
  const glareY = useTransform(my, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.55) 0%, rgba(16,185,129,0.12) 35%, transparent 65%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const handleMouseLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const fromX = side === "left" ? -90 : 90;
  const baseRotate = side === "left" ? -4 : 4;
  const y = useTransform(parallax, [0, 1], side === "left" ? [0, -36] : [0, -60]);

  return (
    <motion.div style={{ y }} className="relative">
      {/* idle float wrapper — second card offset in phase */}
      <motion.div
        animate={{ y: reduceMotion ? 0 : [0, -12, 0] }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        }}
      >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{
          opacity: 0,
          x: fromX,
          rotate: baseRotate * 2,
          filter: "blur(14px)",
        }}
        whileInView={{
          opacity: 1,
          x: 0,
          rotate: baseRotate,
          filter: "blur(0px)",
        }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        whileHover={{
          scale: 1.05,
          rotate: 0,
          boxShadow:
            "0 30px 70px -20px rgba(16,185,129,0.4), 0 12px 30px -12px rgba(15,23,42,0.25)",
        }}
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformPerspective: 900,
        }}
        className="group relative rounded-3xl border-4 border-white bg-white p-2.5 shadow-[0_20px_50px_-18px_rgba(16,185,129,0.35),0_10px_28px_-12px_rgba(15,23,42,0.18)] cursor-pointer"
      >
        {/* emerald glow ring on hover */}
        <div className="pointer-events-none absolute -inset-1.5 rounded-[1.6rem] border-2 border-emerald-400/0 shadow-[0_0_40px_rgba(16,185,129,0.35)] transition-all duration-500 group-hover:border-emerald-400/50 group-hover:shadow-[0_0_60px_rgba(16,185,129,0.45)]" />

        {/* image frame */}
        <div className="relative aspect-[3/4] w-56 sm:w-64 md:w-72 overflow-hidden rounded-2xl bg-slate-100">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 288px"
              className="object-cover"
            />
          </motion.div>

          {/* shine sweep */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full"
            whileHover={{ x: ["-100%", "200%"] }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
          {/* soft inner vignette */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_40px_rgba(15,23,42,0.08)]" />
        </div>

        {/* glare follows cursor */}
        {!reduceMotion && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: glareBg }}
          />
        )}

        {/* floating badge */}
        {badge && (
          <div
            className={`absolute -top-4 ${side === "left" ? "-left-4" : "-right-4"} z-10`}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: floatDelay,
              }}
              className={`float-badge ${badge.floatClass} rounded-xl border border-white bg-white/95 px-3.5 py-2 shadow-lg shadow-slate-900/10 backdrop-blur ${badge.className}`}
            >
              {badge.text}
            </motion.div>
          </div>
        )}
      </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Showcase section ─── */

export default function About() {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: showcaseRef,
    offset: ["start end", "end start"],
  });

  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
      {/* soft section background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-50/60 rounded-full blur-3xl" />
      </div>

      <SectionHeading
        icon={GraduationCap}
        label="About Me"
        title={
          <>
            A student building{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              real products
            </span>
          </>
        }
        description="AI student at Assiut National University passionate about turning ideas into fast, accessible, full-stack web experiences."
      />

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Bio */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Hi, I&apos;m Ashraf — nice to meet you.
            </h3>
            <p className="text-slate-600 leading-relaxed">
              I&apos;m an AI student and full-stack developer focused on the
              intersection of intelligent systems and beautiful interfaces. I
              ship production-ready Next.js apps, integrate AI features into
              real products, and obsess over the details that make software
              feel effortless.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="space-y-3"
          >
            {[
              "Currently studying AI at Assiut National University",
              "Shipping full-stack platforms with Next.js, React & Supabase",
              "Exploring LLM integrations and modern AI tooling",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-slate-600">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="flex items-center gap-2 text-sm text-slate-500"
          >
            <MapPin className="w-4 h-4 text-emerald-500" />
            Assiut, Egypt
          </motion.div>
        </div>

        {/* Photo showcase */}
        <div ref={showcaseRef} className="relative">
          {/* decorative gradient blob */}
          <div className="pointer-events-none absolute -inset-8">
            <div className="blob-drift absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-emerald-300/30 via-teal-200/25 to-transparent blur-3xl" />
          </div>

          {/* rotating dashed circle */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] md:w-[480px] md:h-[480px]">
            <div className="spin-slow absolute inset-0 rounded-full border-2 border-dashed border-emerald-300/50" />
            <div className="spin-slow-reverse absolute inset-6 rounded-full border border-dashed border-teal-300/40" />
          </div>

          {/* floating badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="float-badge absolute top-2 left-0 z-20 hidden sm:block"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              AI Student
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="float-badge-delayed absolute top-[38%] -right-2 z-20 hidden sm:block"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Full-Stack Dev
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="float-badge-slow absolute bottom-4 left-2 z-20 hidden sm:block"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Next.js
            </span>
          </motion.div>

          {/* overlapping photo cards */}
          <div className="relative flex items-center justify-center py-10">
            <PhotoCard
              src="/images/ashraf-1.jpeg"
              alt="Ashraf Omar portrait"
              priority
              side="left"
              floatDelay={0}
              parallax={scrollYProgress}
              badge={{
                text: "Ashraf Omar",
                className: "text-slate-800",
                floatClass: "float-badge",
              }}
            />
            <div className="relative -ml-16 md:-ml-20 z-10">
              <PhotoCard
                src="/images/ashraf-2.jpeg"
                alt="Ashraf Omar at work"
                side="right"
                floatDelay={2.5}
                parallax={scrollYProgress}
                badge={{
                  text: "Building in public",
                  className: "text-emerald-700",
                  floatClass: "float-badge-delayed",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
