"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Send, X } from "lucide-react";
import GithubIcon from "@/components/GithubIcon";
import Typewriter from "@/components/ui/Typewriter";
import { PROFILE, SPOTLIGHT } from "@/data/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const chipContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.9 } },
};
const chipItem = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

function scrollToId(id: string) {
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, 80);
}

function SpotlightDialog({ onClose }: { onClose: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const leaveTimer = useRef<number | undefined>(undefined);
  const [introDone, setIntroDone] = useState(false);
  const reduced = useReducedMotion();

  const layoutTransition = reduced
    ? { duration: 0.3, ease: EASE }
    : { type: "spring" as const, stiffness: 220, damping: 26 };

  /* Scroll lock, ESC, focus trap, focus restore */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60);

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = contentRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  useEffect(
    () => () => {
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    },
    []
  );

  /* Delayed close when pointer leaves the expanded content area */
  const scheduleClose = useCallback(() => {
    leaveTimer.current = window.setTimeout(onClose, 300);
  }, [onClose]);
  const cancelScheduledClose = useCallback(() => {
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
  }, []);

  const goTo = (id: string) => {
    onClose();
    scrollToId(id);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="About Ashraf Omar"
      className="fixed inset-0 z-50 bg-white/40 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {/* Soft emerald radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18),transparent_65%)]" />

      <div className="relative z-10 flex h-full items-center justify-center overflow-y-auto p-4 sm:p-6 lg:p-10">
        <div
          ref={contentRef}
          onMouseLeave={scheduleClose}
          onMouseEnter={cancelScheduledClose}
          className="relative flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-12 my-auto"
        >
          {/* ── Photo (shared layout with hero thumb) ── */}
          <motion.div
            layoutId="profile-photo"
            transition={layoutTransition}
            className="relative aspect-[3/4] h-[42vh] max-h-[420px] w-auto max-w-[80vw] flex-shrink-0 lg:h-[85vh] lg:max-h-none lg:w-auto lg:max-w-[34rem]"
            style={{ borderRadius: "2rem" }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-[0_40px_90px_-25px_rgba(16,185,129,0.5),0_15px_40px_-15px_rgba(15,23,42,0.25)]">
              <Image
                src="/images/ashraf-1.jpeg"
                alt="Ashraf Omar — AI Student & Full-Stack Developer"
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 544px"
                className="object-cover"
              />
              {/* glare sweep on open */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                initial={{ x: "-120%" }}
                animate={{ x: "120%" }}
                transition={{ delay: 0.55, duration: 1, ease: "easeInOut" }}
              />
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_0_60px_rgba(15,23,42,0.06)]" />
            </div>
          </motion.div>

          {/* ── Glass info card ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
            className="relative w-full max-w-xl flex-1 rounded-3xl border border-white bg-white/70 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl md:p-10"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2">
              About Me
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              Ashraf{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Omar
              </span>
            </h2>

            <Typewriter
              text={SPOTLIGHT.aboutText}
              speed={28}
              startDelay={400}
              onDone={() => setIntroDone(true)}
              className="block text-slate-600 text-sm md:text-base leading-relaxed min-h-[7.5rem]"
            />

            {introDone && (
              <Typewriter
                prefix={SPOTLIGHT.exploringPrefix}
                phrases={SPOTLIGHT.exploringPhrases}
                speed={45}
                startDelay={300}
                className="mt-2 block text-sm text-slate-500 min-h-[1.5rem]"
              />
            )}

            {/* Skill chips — staggered */}
            <motion.div
              className="mt-6 flex flex-wrap gap-2"
              variants={chipContainer}
              initial="hidden"
              animate="show"
            >
              {SPOTLIGHT.skillChips.map((chip) => (
                <motion.span
                  key={chip}
                  variants={chipItem}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                >
                  {chip}
                </motion.span>
              ))}
            </motion.div>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => goTo("contact")}
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              >
                Contact Me
                <Send className="w-4 h-4" />
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => goTo("work")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50"
              >
                View Projects
              </button>

              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                title="GitHub"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 bg-white/80 text-slate-500 transition-all duration-300 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>

            {/* Status line */}
            <p className="mt-6 inline-flex items-center gap-2 text-xs text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="live-dot-ping-1" />
                <span className="live-dot-ping-2" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {SPOTLIGHT.status}
            </p>
          </motion.div>

          {/* Close button */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close profile spotlight"
            className="absolute -top-2 right-2 z-30 inline-flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 bg-white text-slate-500 shadow-lg transition-all duration-300 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 sm:-top-4 sm:right-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface ProfileSpotlightProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileSpotlight({ open, onClose }: ProfileSpotlightProps) {
  return (
    <AnimatePresence>
      {open && <SpotlightDialog key="profile-spotlight" onClose={onClose} />}
    </AnimatePresence>
  );
}
