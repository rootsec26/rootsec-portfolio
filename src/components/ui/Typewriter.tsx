"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  /** Static text typed once, character by character. */
  text?: string;
  /** Rotating phrases cycled after `text` (or immediately) — type, hold, delete, next. */
  phrases?: readonly string[];
  /** Prefix shown before each rotating phrase (e.g. "Currently exploring: "). */
  prefix?: string;
  /** ms per character. Default 28. */
  speed?: number;
  /** Delay before typing starts. Default 0. */
  startDelay?: number;
  /** Called once the static `text` finishes typing. */
  onDone?: () => void;
  className?: string;
  cursorClassName?: string;
}

export default function Typewriter({
  text = "",
  phrases,
  prefix = "",
  speed = 28,
  startDelay = 0,
  onDone,
  className,
  cursorClassName,
}: TypewriterProps) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    let doneNotified = false;

    const schedule = (fn: () => void, ms: number) => {
      timer = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    let stage: "text" | "loop" = text ? "text" : "loop";
    let charIndex = 0;
    let phraseIndex = 0;
    let current = "";
    let deleting = false;

    const tick = () => {
      if (cancelled) return;

      if (stage === "text") {
        if (charIndex < text.length) {
          charIndex += 1;
          setDisplay(text.slice(0, charIndex));
          schedule(tick, speed);
        } else {
          if (!doneNotified) {
            doneNotified = true;
            onDone?.();
          }
          if (phrases && phrases.length > 0) {
            stage = "loop";
            current = "";
            schedule(tick, 500);
          }
        }
        return;
      }

      /* Rotating phrase stage */
      const phrase = phrases?.[phraseIndex] ?? "";
      const full = prefix + phrase;
      if (!deleting) {
        if (current.length < full.length) {
          current = full.slice(0, current.length + 1);
          setDisplay(current);
          schedule(tick, speed);
        } else {
          schedule(() => {
            deleting = true;
            tick();
          }, 2000);
        }
      } else {
        if (current.length > prefix.length) {
          current = current.slice(0, -1);
          setDisplay(current);
          schedule(tick, Math.max(12, speed / 2));
        } else {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % Math.max(1, phrases?.length ?? 1);
          schedule(tick, 350);
        }
      }
    };

    schedule(tick, startDelay);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, phrases, prefix, speed, startDelay]);

  const ariaText =
    text +
    (prefix && phrases?.length ? ` ${prefix}${phrases.join(", ")}` : "");

  return (
    <span className={className} aria-label={ariaText.trim() || undefined}>
      <span aria-hidden="true">{display}</span>
      <span
        aria-hidden="true"
        className={`ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-emerald-500 ${cursorClassName ?? ""}`}
      />
    </span>
  );
}
