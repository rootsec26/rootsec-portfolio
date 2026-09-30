"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  Check,
  Copy,
  CornerDownLeft,
  ExternalLink,
  Lock,
  Monitor,
  RotateCw,
  ShieldCheck,
  Smartphone,
  SquareArrowOutUpRight,
  TriangleAlert,
  X,
} from "lucide-react";

/* ─── Preview Data Contract ─── */

export interface PreviewProject {
  title: string;
  category: string;
  url: string;
  previewType: "iframe";
  /** Human-readable summary rendered by the fallback branding header. */
  desc?: string;
  /** Stack chips rendered by the fallback branding header. */
  badges?: string[];
  /** Static visual preview shown inside the frame (also used by the fallback). */
  mockupImage?: string | null;
  /** Alias accepted for `mockupImage`. */
  imagePreview?: string | null;
}

type DeviceMode = "desktop" | "mobile";

/**
 * checking   — probing the remote site for X-Frame-Options / frame-ancestors
 * embeddable — no framing restrictions found, the live frame may mount
 * blocked    — the site refuses in-page embedding, render the fallback
 * unknown    — probe inconclusive, mount the frame behind a load watchdog
 */
type FramePolicy = "checking" | "embeddable" | "blocked" | "unknown";

interface FrameGuardResponse {
  status: Exclude<FramePolicy, "checking">;
  reason: string;
}

interface ProjectPreviewModalProps {
  project: PreviewProject | null;
  onClose: () => void;
}

interface PreviewBrowserProps {
  project: PreviewProject;
  onClose: () => void;
}

interface FallbackProps {
  project: PreviewProject;
  url: string;
  hostname: string;
  reason: string;
  onReload: () => void;
}

/** Framing-policy probe deadline — also the watchdog for an unknown policy. */
const GUARD_TIMEOUT = 3000;
/** Watchdog applied once embedding is confirmed to be allowed. */
const LOAD_TIMEOUT = 8000;

/* ─── Helpers ─── */

function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withProtocol).toString();
  } catch {
    return null;
  }
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function mockupOf(project: PreviewProject): string | null {
  const source = project.mockupImage ?? project.imagePreview ?? null;
  const trimmed = source?.trim();
  return trimmed ? trimmed : null;
}

/* ─── Modal Shell — backdrop, window chrome, keyboard/scroll handling ─── */

export default function ProjectPreviewModal({
  project,
  onClose,
}: ProjectPreviewModalProps) {
  /* ── Escape to close + lock background scroll ── */
  useEffect(() => {
    if (!project) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="project-preview-modal"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* ── Backdrop ── */}
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Browser Window ── */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} preview`}
            className="preview-window relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <PreviewBrowser
              key={project.url}
              project={project}
              onClose={onClose}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Fallback — dark high-tech layout for embed-blocked sites ─── */

function FallbackView({
  project,
  url,
  hostname,
  reason,
  onReload,
}: FallbackProps) {
  const mockup = mockupOf(project);
  const badges = project.badges ?? [];

  return (
    <motion.div
      key="fallback"
      className="absolute inset-0 z-30 overflow-y-auto bg-[#050607]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ambient high-tech backdrop */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-70" />
      <div className="pointer-events-none absolute -top-28 left-1/2 h-64 w-[560px] max-w-full -translate-x-1/2 rounded-full bg-emerald/[0.08] blur-[90px]" />

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center gap-6 px-5 py-8 sm:px-8 sm:py-10">
        {/* ── Fallback notice tag ── */}
        <div className="flex items-center gap-2 self-start rounded-full border border-amber-400/25 bg-amber-400/[0.07] px-3.5 py-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200/90">
            External Live Preview Protected
          </span>
        </div>

        {/* ── Project branding header ── */}
        <header className="flex flex-col gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald/70">
            {project.category}
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {project.title}
          </h2>
          {project.desc && (
            <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
              {project.desc}
            </p>
          )}
          {badges.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <li
                  key={badge}
                  className="badge-pill rounded-full px-3 py-1 text-[11px] font-medium text-slate-400"
                >
                  {badge}
                </li>
              ))}
            </ul>
          )}
        </header>

        {/* ── Static mockup preview with live-link overlay ── */}
        {mockup && (
          <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/[0.09] bg-black shadow-[0_30px_80px_-40px_rgba(0,0,0,0.95)]">
            <Image
              src={mockup}
              alt={`${project.title} mockup preview`}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

            <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-300 backdrop-blur">
              static mockup
            </span>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-end justify-center p-5"
              aria-label={`Open ${project.title} live site in a new tab`}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald/40 bg-emerald/15 px-4 py-2 text-xs font-bold text-emerald shadow-[0_0_28px_rgba(52,211,153,0.25)] backdrop-blur transition-colors hover:border-emerald/70 hover:bg-emerald/25">
                Open Live Site
                <SquareArrowOutUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        )}

        {/* ── Action buttons ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shimmer inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald to-teal-400 px-6 py-3 text-sm font-bold text-black transition-shadow duration-300 hover:shadow-[0_0_36px_rgba(52,211,153,0.4)]"
          >
            Launch Live Site
            <SquareArrowOutUpRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={onReload}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-6 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
          >
            Try Reloading
            <RotateCw className="h-4 w-4" />
          </button>
        </div>

        {/* ── Technical note ── */}
        <p className="flex items-start gap-2 font-mono text-[11px] leading-relaxed text-neutral-500">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400/70" />
          <span>
            <span className="text-slate-400">{hostname}</span> {reason}
          </span>
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Browser Chrome + Live Frame ─── */

function PreviewBrowser({ project, onClose }: PreviewBrowserProps) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [activeUrl, setActiveUrl] = useState(project.url);
  const [address, setAddress] = useState(project.url);
  const [policy, setPolicy] = useState<FramePolicy>("checking");
  const [policyReason, setPolicyReason] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [copied, setCopied] = useState(false);
  const [frameKey, setFrameKey] = useState(0);

  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const blocked = policy === "blocked" || iframeError || timedOut;
  const frameAllowed = policy === "embeddable" || policy === "unknown";
  const waiting = !blocked && !isLoaded;

  /* ── 1. Smart framing-policy probe (X-Frame-Options / frame-ancestors) ──
     State resets live in `resetAttempt` (event handlers); this effect only
     performs the async probe so renders stay cascade-free. */
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const deadline = setTimeout(() => controller.abort(), GUARD_TIMEOUT);

    (async () => {
      try {
        const response = await fetch(
          `/api/frame-guard?url=${encodeURIComponent(activeUrl)}`,
          { signal: controller.signal, cache: "no-store" }
        );
        if (!response.ok) throw new Error("frame-guard unavailable");
        const data = (await response.json()) as FrameGuardResponse;
        if (cancelled) return;
        setPolicy(data.status ?? "unknown");
        setPolicyReason(data.reason ?? "");
      } catch {
        if (cancelled) return;
        setPolicy("unknown");
        setPolicyReason(
          "refuses in-page embedding, so the live frame could not be verified."
        );
      } finally {
        clearTimeout(deadline);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(deadline);
    };
  }, [activeUrl, frameKey]);

  /* ── 2. Load watchdog — mirrors a blocked frame that never fires onLoad ── */
  useEffect(() => {
    if (blocked || isLoaded || !frameAllowed) return;
    const timeout = policy === "embeddable" ? LOAD_TIMEOUT : GUARD_TIMEOUT;
    const timer = setTimeout(() => {
      setTimedOut(true);
      setIsLoaded(false);
    }, timeout);
    return () => clearTimeout(timer);
  }, [blocked, isLoaded, frameAllowed, policy, activeUrl, frameKey]);

  /* ── Clear pending copy feedback on unmount ── */
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    []
  );

  const resetAttempt = useCallback(() => {
    setPolicy("checking");
    setPolicyReason("");
    setIsLoaded(false);
    setIframeError(false);
    setTimedOut(false);
  }, []);

  const handleReload = useCallback(() => {
    resetAttempt();
    setFrameKey((k) => k + 1);
  }, [resetAttempt]);

  const navigateTo = useCallback(
    (raw: string) => {
      const next = normalizeUrl(raw);
      if (!next) return false;
      setActiveUrl(next);
      setAddress(next);
      resetAttempt();
      setFrameKey((k) => k + 1);
      return true;
    },
    [resetAttempt]
  );

  const handleAddressKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (!navigateTo(address)) setAddress(activeUrl);
      e.currentTarget.blur();
    },
    [address, activeUrl, navigateTo]
  );

  const handleCopy = useCallback(async () => {
    if (!activeUrl) return;
    try {
      await navigator.clipboard.writeText(activeUrl);
    } catch {
      // clipboard unavailable — feedback still shown for UX parity
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  }, [activeUrl]);

  const handleIframeLoad = useCallback(() => {
    setIsLoaded(true);
    setIframeError(false);
    setTimedOut(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsLoaded(false);
    setIframeError(true);
    setTimedOut(false);
  }, []);

  const hostname = hostnameOf(activeUrl);
  const frameSrc = `${activeUrl}::${frameKey}`;
  const mockup = mockupOf(project);
  const fallbackReason =
    policyReason ||
    "refuses in-page embedding via X-Frame-Options / frame-ancestors.";

  return (
    <>
      {/* ── Top Browser Bar ── */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#0b0b0b] px-3 py-2.5 sm:gap-3 sm:px-4">
        {/* Window controls */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="traffic-light cursor-pointer bg-[#ff5f56] hover:brightness-125"
          />
          <span className="traffic-light bg-[#ffbd2e]" />
          <span className="traffic-light bg-[#27c93f]" />
        </div>

        {/* Tab / title */}
        <div className="hidden max-w-[210px] items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 md:flex">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="live-dot-ping-1" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
          </span>
          <span className="truncate text-[11px] font-medium text-slate-300">
            {project.title}
          </span>
        </div>

        {/* Device toggle */}
        <div className="flex shrink-0 items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.03] p-1">
          {(["desktop", "mobile"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setDevice(mode)}
              aria-pressed={device === mode}
              aria-label={`${mode} viewport`}
              className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                device === mode
                  ? "text-emerald"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {device === mode && (
                <motion.span
                  layoutId="preview-device-pill"
                  className="absolute inset-0 rounded-full border border-emerald/30 bg-emerald/10"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {mode === "desktop" ? (
                  <Monitor className="h-3.5 w-3.5" />
                ) : (
                  <Smartphone className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">
                  {mode === "desktop" ? "Desktop" : "Mobile"}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Address bar */}
        <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/[0.07] bg-black/60 px-2.5 transition-colors focus-within:border-emerald/40">
          <Lock className="h-3.5 w-3.5 shrink-0 text-emerald/60" />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleAddressKeyDown}
            onBlur={() => setAddress(activeUrl)}
            spellCheck={false}
            autoComplete="off"
            aria-label="Preview address"
            className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-slate-400 outline-none selection:bg-emerald/25"
          />
          <CornerDownLeft className="hidden h-3 w-3 shrink-0 text-neutral-600 sm:block" />
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy link"
            title="Copy link"
            className={`shrink-0 transition-colors ${
              copied ? "text-emerald" : "text-neutral-500 hover:text-white"
            }`}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* External link + close */}
        <a
          href={activeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open in new tab"
          title="Open in new tab"
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-neutral-400 transition-colors hover:border-emerald/30 hover:text-emerald sm:flex"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-neutral-400 transition-colors hover:border-white/20 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Main Frame Container ── */}
      <div className="relative flex min-h-0 flex-1 items-stretch justify-center overflow-hidden bg-[#070707] p-0 sm:p-5">
        {/* Ambient frame grid */}
        <div className="pointer-events-none absolute inset-0 opacity-60 grid-pattern" />

        <div
          className={`preview-frame relative z-10 h-full overflow-hidden border border-white/[0.08] bg-black transition-[width,border-radius] duration-500 ease-[cubic-bezier(0.25,0.4,0.25,1)] ${
            device === "mobile"
              ? "w-[375px] max-w-full rounded-[26px] shadow-[0_0_50px_rgba(52,211,153,0.10),0_30px_90px_-30px_rgba(0,0,0,0.9)]"
              : "w-full rounded-xl shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9)]"
          }`}
        >
          {/* Live iframe — only mounted when embedding is permitted and unblocked */}
          {frameAllowed && !blocked && (
            <iframe
              key={frameSrc}
              src={activeUrl}
              title={`${project.title} — live preview`}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              referrerPolicy="no-referrer-when-downgrade"
              allow="clipboard-write; fullscreen; picture-in-picture; camera; microphone; payment"
              className="h-full w-full border-0 bg-white"
            />
          )}

          {/* Checking / loading state */}
          <AnimatePresence>
            {waiting && (
              <motion.div
                key="loading"
                className="absolute inset-0 z-20 overflow-hidden bg-[#050505]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {mockup && (
                  <Image
                    src={mockup}
                    alt=""
                    fill
                    unoptimized
                    sizes="100vw"
                    className="object-cover object-top opacity-25"
                  />
                )}
                <div className="absolute inset-0 bg-[#050505]/80" />
                <div className="relative flex h-full flex-col items-center justify-center gap-4">
                  <span className="preview-spinner h-11 w-11" />
                  <p className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-emerald/70 sm:text-[11px]">
                    {policy === "checking"
                      ? `scanning embed policy · ${hostname}`
                      : `connecting · ${hostname}`}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* X-Frame-Options / embed fallback */}
          <AnimatePresence>
            {blocked && (
              <FallbackView
                key="fallback"
                project={project}
                url={activeUrl}
                hostname={hostname}
                reason={fallbackReason}
                onReload={handleReload}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] bg-[#0a0a0a] px-4 py-2 font-mono text-[10px]">
        <span className="flex min-w-0 items-center gap-2 text-neutral-500">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="live-dot-ping-1" />
            <span className="live-dot-ping-2" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
          </span>
          <span className="truncate">{project.title}</span>
          <span className="hidden shrink-0 text-neutral-600 sm:inline">
            · {hostname}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-3 text-neutral-500">
          <button
            type="button"
            onClick={handleReload}
            className="flex items-center gap-1 transition-colors hover:text-emerald"
          >
            <RotateCw className="h-3 w-3" />
            Reload
          </button>
          <span className="hidden text-neutral-600 sm:inline">
            {device === "mobile" ? "375px viewport" : "100% viewport"}
          </span>
          {blocked ? (
            <span className="flex items-center gap-1 text-amber-400/80">
              <ShieldCheck className="h-3 w-3" />
              PROTECTED
            </span>
          ) : isLoaded ? (
            <span className="flex items-center gap-1 text-emerald/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald/50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald/70" />
              CONNECTING
            </span>
          )}
        </span>
      </div>
    </>
  );
}
