"use client";

import { motion, type Variants } from "framer-motion";
import { Copy, Mail, Send } from "lucide-react";
import { useCallback } from "react";
import BorderBeam from "@/components/BorderBeam";
import CyberBot from "@/components/CyberBot";
import { PROFILE } from "@/data/site";

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

export default function Contact() {
  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      // ignore
    }
  }, []);

  return (
    <footer id="contact" className="relative mx-auto max-w-6xl px-6 md:px-10 pt-10 pb-12">
      <motion.div
        className="contact-card group relative rounded-3xl overflow-hidden"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <BorderBeam color="rgba(16, 185, 129, 0.45)" duration={5} size={250} />

        {/* Ambient backlighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-200/30 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-teal-200/25 blur-[100px]" />
        </div>

        <div className="relative z-10 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 md:p-12 lg:p-14 shadow-2xl shadow-slate-200/60">
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center">
            {/* 3D Robot Canvas */}
            <motion.div
              className="w-full lg:w-2/5 h-[300px] lg:h-[380px] flex-shrink-0 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-100/70 via-transparent to-teal-100/60 blur-xl" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-b from-slate-50 to-white">
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
                <motion.div className="mb-5" variants={fadeUp} custom={0}>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Get in Touch
                  </span>
                </motion.div>

                <motion.h2
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-[1.1]"
                  variants={fadeUp}
                  custom={1}
                >
                  Let&apos;s build something
                  <br />
                  <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
                    exceptional.
                  </span>
                </motion.h2>

                <motion.p
                  className="text-slate-600 text-base md:text-lg leading-relaxed max-w-lg mb-8"
                  variants={fadeUp}
                  custom={2}
                >
                  Open for collaborations, contract work, and ambitious product
                  ideas. Let&apos;s turn your vision into reality.
                </motion.p>

                <motion.div
                  className="flex flex-wrap items-center gap-3"
                  variants={fadeUp}
                  custom={3}
                >
                  <motion.a
                    href={`mailto:${PROFILE.email}`}
                    className="btn-shimmer group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow duration-300"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Mail className="w-4 h-4" />
                    {PROFILE.email}
                  </motion.a>

                  <motion.a
                    href={PROFILE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="btn-shimmer inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </motion.a>

                  <motion.button
                    onClick={handleCopyEmail}
                    aria-label="Copy email"
                    title="Copy email"
                    className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
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
        className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <p>&copy; {new Date().getFullYear()} {PROFILE.handle}. Designed with precision.</p>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          rootsec on GitHub
        </a>
      </motion.div>
    </footer>
  );
}
