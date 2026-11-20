"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, GraduationCap, MousePointerClick, Send, Sparkles } from "lucide-react";
import { PROFILE, ROLES } from "@/data/site";
import ProfileSpotlight from "@/components/sections/ProfileSpotlight";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Rotating typed role under the name */
function TypedRole() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const role = ROLES[index];
    const speed = deleting ? 35 : 70;

    const timer = setTimeout(() => {
      if (!deleting) {
        if (text.length < role.length) {
          setText(role.slice(0, text.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1600);
        }
      } else {
        if (text.length > 0) {
          setText(role.slice(0, text.length - 1));
        } else {
          setDeleting(false);
          setIndex((i) => (i + 1) % ROLES.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, deleting, index]);

  return (
    <span className="inline-flex items-center gap-2 text-lg md:text-2xl font-semibold text-slate-600 min-h-[2rem]">
      <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0" />
      <span>
        {text}
        <span className="inline-block w-[2px] h-[1.1em] ml-0.5 bg-emerald-500 align-middle animate-pulse" />
      </span>
    </span>
  );
}

function subscribeHoverCapability(onChange: () => void) {
  const mq = window.matchMedia("(hover: hover)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export default function Hero() {
  const [spotOpen, setSpotOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const canHover = useSyncExternalStore(
    subscribeHoverCapability,
    () => window.matchMedia("(hover: hover)").matches,
    () => true
  );

  const scheduleOpen = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => {
      setSpotOpen(true);
      setHintVisible(false);
    }, 250);
  };
  const cancelOpen = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
  };
  const openNow = () => {
    cancelOpen();
    setSpotOpen(true);
    setHintVisible(false);
  };

  useEffect(() => () => cancelOpen(), []);

  return (
    <section id="top" className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Soft background: light gradient + grid + emerald blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 via-white to-white" />
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div className="glow-blob ambient-float w-[560px] h-[560px] bg-emerald-300/25 -top-40 -left-40" />
        <div className="glow-blob ambient-float-delayed w-[480px] h-[480px] bg-teal-200/25 top-[35%] -right-40" />
        <div className="glow-blob ambient-float-slow w-[420px] h-[420px] bg-emerald-200/20 bottom-0 left-[15%]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 pt-32 pb-24">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-8 items-center">
          {/* ── Text column ── */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mb-6"
            >
              <span className="hero-profile-badge inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2 text-[12px] font-semibold tracking-wide text-emerald-600 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="live-dot-ping-1" />
                  <span className="live-dot-ping-2" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Available for opportunities
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02] text-slate-900 mb-2"
            >
              {PROFILE.firstName}
              <br />
              <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                {PROFILE.lastName}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
              className="mb-5"
            >
              <TypedRole />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              className="flex justify-center lg:justify-start mb-6"
            >
              <div className="inline-flex items-center gap-2.5 rounded-xl bg-white border border-slate-200 px-5 py-2.5 shadow-sm">
                <GraduationCap className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700 leading-tight">
                    Faculty of Computers & Artificial Intelligence
                  </p>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Assiut National University
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
              className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed mb-10 lg:mx-0 mx-auto"
            >
              I build modern, full-stack web platforms —{" "}
              <span className="text-slate-900 font-medium">Next.js applications</span>{" "}
              and <span className="text-emerald-600 font-medium">AI integrations</span> —
              focused on performance, accessibility, and craft.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <motion.a
                href="#work"
                className="btn-shimmer group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow duration-300"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Explore Projects
                <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </motion.a>

              <motion.a
                href="#contact"
                className="btn-shimmer inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/80 px-7 py-3.5 text-sm font-medium text-slate-700 hover:border-emerald-400/60 hover:text-emerald-700 hover:bg-emerald-50/60 transition-all duration-300"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Contact Me
                <Send className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </div>

          {/* ── Photo column (hover to expand spotlight) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            className="flex justify-center mt-2 lg:mt-0"
          >
            <div
              ref={photoRef}
              role="button"
              tabIndex={0}
              aria-label="View Ashraf Omar's profile spotlight"
              aria-haspopup="dialog"
              onMouseEnter={scheduleOpen}
              onMouseLeave={cancelOpen}
              onFocus={scheduleOpen}
              onBlur={cancelOpen}
              onClick={openNow}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openNow();
                }
              }}
              className="relative cursor-pointer rounded-[2rem] outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/50 transition-opacity duration-300"
              style={{ opacity: spotOpen ? 0 : 1 }}
            >
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald-200/40 to-teal-200/30 blur-2xl" />
              <div className="rotate-[-3deg]">
                <motion.div
                  layoutId="profile-photo"
                  className="relative w-56 h-72 sm:w-64 sm:h-80 lg:w-72 lg:h-96 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl shadow-emerald-900/15"
                >
                  <Image
                    src="/images/ashraf-1.jpeg"
                    alt="Ashraf Omar — AI Student & Full-Stack Developer"
                    fill
                    priority
                    sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
                    className="object-cover"
                  />
                </motion.div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl border border-slate-200 shadow-lg px-4 py-2.5 float-badge">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Building the future
                </p>
                <p className="text-xs font-semibold text-slate-800">with AI</p>
              </div>

              {/* Hover hint pill — fades after first interaction */}
              <AnimatePresence>
                {hintVisible && !spotOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                    className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                  >
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-white/95 px-3.5 py-1.5 text-[11px] font-semibold text-slate-600 shadow-md backdrop-blur">
                      <MousePointerClick className="w-3.5 h-3.5 text-emerald-500" />
                      {canHover ? "Hover to see more" : "Tap to see more"}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator — fixed clear of content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-slate-300 flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2.5 rounded-full bg-emerald-500/70"
          />
        </motion.div>
      </motion.div>

      {/* ── Hover-to-expand profile spotlight ── */}
      <ProfileSpotlight open={spotOpen} onClose={() => setSpotOpen(false)} />
    </section>
  );
}
