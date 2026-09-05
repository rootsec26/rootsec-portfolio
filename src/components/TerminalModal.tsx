"use client";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Command Definitions ─── */

const COMMANDS = [
  "help",
  "whoami",
  "skills",
  "projects",
  "contact",
  "clear",
  "gui",
  "exit",
] as const;

type Command = (typeof COMMANDS)[number];

interface TerminalLine {
  id: number;
  type: "input" | "output";
  text: string;
  html?: boolean;
}

/* ─── Output Renderers ─── */

function renderHelp(): TerminalLine[] {
  return [
    { id: Date.now(), type: "output", text: "" },
    {
      id: Date.now() + 1,
      type: "output",
      text: "Available commands:",
    },
    { id: Date.now() + 2, type: "output", text: "" },
    { id: Date.now() + 3, type: "output", text: "  help        Show this help message" },
    { id: Date.now() + 4, type: "output", text: "  whoami      About rootsec (Ashraf Omar)" },
    { id: Date.now() + 5, type: "output", text: "  skills      Technical stack & tools" },
    { id: Date.now() + 6, type: "output", text: "  projects    Key projects & work" },
    { id: Date.now() + 7, type: "output", text: "  contact     Email & WhatsApp" },
    { id: Date.now() + 8, type: "output", text: "  clear       Clear the terminal" },
    { id: Date.now() + 9, type: "output", text: "  gui         Return to GUI mode" },
    { id: Date.now() + 10, type: "output", text: "" },
    { id: Date.now() + 11, type: "output", text: "  Tip: Use ↑/↓ to cycle history, Tab to autocomplete" },
    { id: Date.now() + 12, type: "output", text: "" },
  ];
}

function renderWhoami(): TerminalLine[] {
  return [
    { id: Date.now(), type: "output", text: "" },
    {
      id: Date.now() + 1,
      type: "output",
      text: '  ██████╗ ██╗  ██╗ █████╗ ███████╗    ███████╗██╗  ██╗███████╗',
      html: true,
    },
    {
      id: Date.now() + 2,
      type: "output",
      text: '  ██╔══██╗██║  ██║██╔══██╗██╔════╝    ██╔════╝╚██╗██╔╝██╔════╝',
      html: true,
    },
    {
      id: Date.now() + 3,
      type: "output",
      text: '  ██████╔╝███████║███████║███████╗    █████╗   ╚███╔╝ █████╗  ',
      html: true,
    },
    {
      id: Date.now() + 4,
      type: "output",
      text: '  ██╔═══╝ ██╔══██║██╔══██║╚════██║    ██╔══╝   ██╔██╗ ██╔══╝  ',
      html: true,
    },
    {
      id: Date.now() + 5,
      type: "output",
      text: '  ██║     ██║  ██║██║  ██║███████║    ███████╗██╔╝ ██╗███████╗',
      html: true,
    },
    {
      id: Date.now() + 6,
      type: "output",
      text: '  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚══════╝',
      html: true,
    },
    { id: Date.now() + 7, type: "output", text: "" },
    { id: Date.now() + 8, type: "output", text: "  Name:    Ashraf Omar (أشرف عمر)" },
    { id: Date.now() + 9, type: "output", text: "  Role:    AI Student & Full-Stack Developer" },
    { id: Date.now() + 10, type: "output", text: "  Uni:     Faculty of Computers & AI — Assiut National University" },
    { id: Date.now() + 11, type: "output", text: "  Focus:   Building ultra-fast, accessible web applications" },
    { id: Date.now() + 12, type: "output", text: "  Stack:   Next.js · React · TypeScript · Python · Supabase" },
    { id: Date.now() + 13, type: "output", text: "" },
  ];
}

function renderSkills(): TerminalLine[] {
  return [
    { id: Date.now(), type: "output", text: "" },
    { id: Date.now() + 1, type: "output", text: "  ┌─────────────────────────────────────────────┐" },
    { id: Date.now() + 2, type: "output", text: "  │           TECHNICAL SKILL MATRIX            │" },
    { id: Date.now() + 3, type: "output", text: "  ├─────────────────────────────────────────────┤" },
    { id: Date.now() + 4, type: "output", text: "  │                                             │" },
    { id: Date.now() + 5, type: "output", text: "  │  FRONTEND                                   │" },
    { id: Date.now() + 6, type: "output", text: "  │    ▸ Next.js 16       ████████████░░  85%   │" },
    { id: Date.now() + 7, type: "output", text: "  │    ▸ React 19         ████████████░░  85%   │" },
    { id: Date.now() + 8, type: "output", text: "  │    ▸ TypeScript       █████████████░  90%   │" },
    { id: Date.now() + 9, type: "output", text: "  │    ▸ Tailwind CSS     █████████████░  90%   │" },
    { id: Date.now() + 10, type: "output", text: "  │    ▸ JavaScript       ██████████████  95%   │" },
    { id: Date.now() + 11, type: "output", text: "  │                                             │" },
    { id: Date.now() + 12, type: "output", text: "  │  BACKEND & BAAS                             │" },
    { id: Date.now() + 13, type: "output", text: "  │    ▸ Supabase         ████████████░░  85%   │" },
    { id: Date.now() + 14, type: "output", text: "  │    ▸ Node.js          ██████████░░░░  75%   │" },
    { id: Date.now() + 15, type: "output", text: "  │    ▸ Express          █████████░░░░░  70%   │" },
    { id: Date.now() + 16, type: "output", text: "  │    ▸ Python           ██████████░░░░  75%   │" },
    { id: Date.now() + 17, type: "output", text: "  │                                             │" },
    { id: Date.now() + 18, type: "output", text: "  │  TOOLS & DEVOPS                             │" },
    { id: Date.now() + 19, type: "output", text: "  │    ▸ Git & GitHub     █████████████░  90%   │" },
    { id: Date.now() + 20, type: "output", text: "  │    ▸ Vercel           ████████████░░  85%   │" },
    { id: Date.now() + 21, type: "output", text: "  │    ▸ Cloudinary       █████████░░░░░  70%   │" },
    { id: Date.now() + 22, type: "output", text: "  │                                             │" },
    { id: Date.now() + 23, type: "output", text: "  │  INTERESTS                                  │" },
    { id: Date.now() + 24, type: "output", text: "  │    ▸ AI / Machine Learning                  │" },
    { id: Date.now() + 25, type: "output", text: "  │    ▸ Cybersecurity                         │" },
    { id: Date.now() + 26, type: "output", text: "  │    ▸ System Design                         │" },
    { id: Date.now() + 27, type: "output", text: "  │                                             │" },
    { id: Date.now() + 28, type: "output", text: "  └─────────────────────────────────────────────┘" },
    { id: Date.now() + 29, type: "output", text: "" },
  ];
}

function renderProjects(): TerminalLine[] {
  return [
    { id: Date.now(), type: "output", text: "" },
    { id: Date.now() + 1, type: "output", text: "  ┌─── PROJECTS ───────────────────────────────────┐" },
    { id: Date.now() + 2, type: "output", text: "" },
    { id: Date.now() + 3, type: "output", text: "  [1] Al-Nazer Educational Platform" },
    { id: Date.now() + 4, type: "output", text: "      Full-Stack E-Learning Ecosystem" },
    { id: Date.now() + 5, type: "output", text: "      A full-stack e-learning platform for high school students" },
    { id: Date.now() + 6, type: "output", text: "      featuring video management, interactive quizzes, and" },
    { id: Date.now() + 7, type: "output", text: "      real-time dashboards." },
    { id: Date.now() + 8, type: "output", text: "      Stack: Next.js · React · Tailwind · Supabase · Cloudinary" },
    {
      id: Date.now() + 9,
      type: "output",
      text: '      Link:  <a href="https://elnazer.vercel.app/" target="_blank" rel="noopener noreferrer" class="terminal-link">https://elnazer.vercel.app/</a>',
      html: true,
    },
    { id: Date.now() + 10, type: "output", text: "" },
    { id: Date.now() + 11, type: "output", text: "  [2] Madar-X" },
    { id: Date.now() + 12, type: "output", text: "      Full-Stack Platform" },
    { id: Date.now() + 13, type: "output", text: "      A comprehensive full-stack application built with" },
    { id: Date.now() + 14, type: "output", text: "      modern web technologies." },
    { id: Date.now() + 15, type: "output", text: "      Stack: Next.js · React · TypeScript · Supabase" },
    { id: Date.now() + 16, type: "output", text: "" },
    { id: Date.now() + 17, type: "output", text: "  └─────────────────────────────────────────────────┘" },
    { id: Date.now() + 18, type: "output", text: "" },
  ];
}

function renderContact(): TerminalLine[] {
  return [
    { id: Date.now(), type: "output", text: "" },
    { id: Date.now() + 1, type: "output", text: "  ┌─── CONTACT ────────────────────────────────────┐" },
    { id: Date.now() + 2, type: "output", text: "" },
    {
      id: Date.now() + 3,
      type: "output",
      text: '    Email:    <a href="mailto:rootsec68@gmail.com" class="terminal-link">rootsec68@gmail.com</a>',
      html: true,
    },
    {
      id: Date.now() + 4,
      type: "output",
      text: '    WhatsApp: <a href="https://wa.me/201065592701" target="_blank" rel="noopener noreferrer" class="terminal-link">+201065592701</a>',
      html: true,
    },
    { id: Date.now() + 5, type: "output", text: "" },
    { id: Date.now() + 6, type: "output", text: "  └─────────────────────────────────────────────────┘" },
    { id: Date.now() + 7, type: "output", text: "" },
  ];
}

/* ─── Typing Animation Hook ─── */

function useTypingAnimation(text: string, speed = 18): string {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) {
      setDone(true);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}

/* ─── Boot Sequence Lines ─── */

const BOOT_LINES = [
  "rootsec@portfolio:~$ initializing secure connection...",
  "[  OK  ] firewall rules loaded",
  "[  OK  ] encryption module active",
  "[  OK  ] terminal session started",
  "",
  "Welcome to rootsec's portfolio terminal.",
  'Type "help" for available commands.',
  "",
];

/* ─── Main Component ─── */

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TerminalModal({ isOpen, onClose }: TerminalModalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [bootComplete, setBoot] = useState(false);
  const [tabSuggestions, setTabSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineIdCounter = useRef(0);

  const nextId = useCallback(() => ++lineIdCounter.current, []);

  /* ── Focus input on open ── */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  /* ── Auto-scroll ── */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, bootComplete]);

  /* ── Boot sequence ── */
  useEffect(() => {
    if (!isOpen) return;
    setLines([]);
    setInput("");
    setHistory([]);
    setHistoryIndex(-1);
    setBoot(false);
    lineIdCounter.current = 0;

    let i = 0;
    const timer = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((prev) => [...prev, { id: nextId(), type: "output", text: BOOT_LINES[i] }]);
        i++;
      } else {
        clearInterval(timer);
        setBoot(true);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [isOpen, nextId]);

  /* ── Submit command ── */
  const submitCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      const promptLine: TerminalLine = {
        id: nextId(),
        type: "input",
        text: `rootsec@portfolio:~$ ${trimmed}`,
      };

      if (!trimmed) {
        setLines((prev) => [...prev, promptLine]);
        return;
      }

      setHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      const command = trimmed.toLowerCase() as Command;
      let output: TerminalLine[] = [];

      switch (command) {
        case "help":
          output = renderHelp();
          break;
        case "whoami":
          output = renderWhoami();
          break;
        case "skills":
          output = renderSkills();
          break;
        case "projects":
          output = renderProjects();
          break;
        case "contact":
          output = renderContact();
          break;
        case "clear":
          setLines([]);
          setInput("");
          return;
        case "gui":
        case "exit":
          onClose();
          return;
        default:
          output = [
            { id: nextId(), type: "output", text: "" },
            {
              id: nextId(),
              type: "output",
              text: `bash: ${trimmed}: command not found. Type "help" for available commands.`,
            },
            { id: nextId(), type: "output", text: "" },
          ];
      }

      setLines((prev) => [...prev, promptLine, ...output]);
      setInput("");
    },
    [onClose, nextId]
  );

  /* ── Tab auto-complete ── */
  const handleTabComplete = useCallback(() => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    const matches = COMMANDS.filter((c) => c.startsWith(trimmed));

    if (matches.length === 1) {
      setInput(matches[0]);
      setShowSuggestions(false);
      setTabSuggestions([]);
    } else if (matches.length > 1) {
      setTabSuggestions(matches);
      setShowSuggestions(true);
    }
  }, [input]);

  /* ── Keyboard handler ── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setShowSuggestions(false);
        setTabSuggestions([]);
        submitCommand(input);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length === 0) return;
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        handleTabComplete();
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setLines([]);
      } else {
        setShowSuggestions(false);
      }
    },
    [input, history, historyIndex, submitCommand, handleTabComplete]
  );

  /* ── Click to focus ── */
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  /* ── Memoized line renderer ── */
  const renderedLines = useMemo(
    () =>
      lines.map((line) => (
        <div key={line.id} className="terminal-line">
          {line.html ? (
            <span dangerouslySetInnerHTML={{ __html: line.text }} />
          ) : (
            <span>{line.text}</span>
          )}
        </div>
      )),
    [lines]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#050505]/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Terminal Window */}
          <motion.div
            className="terminal-window relative w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            onClick={handleContainerClick}
          >
            {/* Title Bar */}
            <div className="terminal-titlebar flex items-center gap-3 px-4 py-3 bg-[#0a0f0a] border-b border-[#00ff66]/10">
              {/* Traffic lights */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4040] transition-colors"
                  aria-label="Close terminal"
                />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[11px] font-mono text-[#00ff66]/50 tracking-widest uppercase">
                  rootsec@portfolio — bash
                </span>
              </div>
              <div className="w-16" />
            </div>

            {/* Terminal Body */}
            <div
              ref={scrollRef}
              className="terminal-body flex-1 overflow-y-auto p-5 md:p-6 font-mono text-sm leading-relaxed"
            >
              {renderedLines}

              {/* Boot typing animation */}
              {!bootComplete && lines.length === 0 && <BootAnimation />}

              {/* Input line */}
              {bootComplete && (
                <div className="terminal-input-line flex items-center">
                  <span className="terminal-prompt text-[#00ff66] mr-2 whitespace-nowrap select-none">
                    rootsec@portfolio:~${" "}
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setShowSuggestions(false);
                    }}
                    onKeyDown={handleKeyDown}
                    className="terminal-input flex-1 bg-transparent outline-none text-[#00ff66] caret-[#00ff66] font-mono text-sm"
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                    aria-label="Terminal input"
                  />
                </div>
              )}

              {/* Tab suggestions */}
              {showSuggestions && tabSuggestions.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-3 pl-2">
                  {tabSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setInput(s);
                        setShowSuggestions(false);
                        inputRef.current?.focus();
                      }}
                      className="text-[#00ff66]/70 hover:text-[#00ff66] font-mono text-sm transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Bar */}
            <div className="terminal-statusbar flex items-center justify-between px-4 py-1.5 bg-[#0a0f0a] border-t border-[#00ff66]/10 text-[10px] font-mono text-[#00ff66]/30">
              <span>rootsec@portfolio v1.0</span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                SECURE SESSION
              </span>
              <span>UTF-8 · LF</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Boot Animation Component ─── */

function BootAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => {
        if (s >= BOOT_LINES.length - 1) {
          clearInterval(timer);
          return s;
        }
        return s + 1;
      });
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {BOOT_LINES.slice(0, step + 1).map((line, i) => (
        <div key={i} className="terminal-line">
          <span>{line}</span>
        </div>
      ))}
    </div>
  );
}
