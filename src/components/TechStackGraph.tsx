"use client";
import { useState, useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  type NodeMouseHandler,
  BackgroundVariant,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  X,
  Code2,
  Server,
  BrainCircuit,
  Shield,
  RotateCcw,
  Sparkles,
} from "lucide-react";

/* ─── Node Data ─── */

interface RootData extends Record<string, unknown> {
  kind: "root";
  label: string;
}

interface CategoryData extends Record<string, unknown> {
  kind: "category";
  label: string;
  icon: typeof Code2;
  color: string;
  glowColor: string;
}

interface SkillData extends Record<string, unknown> {
  kind: "skill";
  label: string;
  category: string;
  color: string;
}

interface ProjectData extends Record<string, unknown> {
  kind: "project";
  label: string;
  category: string;
  desc: string;
  badges: string[];
  url: string;
  color: string;
}

type CustomNodeData = RootData | CategoryData | SkillData | ProjectData;

/* ─── Graph Data ─── */

const INITIAL_NODES: Node[] = [
  // ── Root ──
  {
    id: "root",
    type: "rootNode",
    position: { x: 0, y: 0 },
    data: { kind: "root", label: "rootsec" } satisfies RootData,
  },

  // ── Categories ──
  {
    id: "cat-frontend",
    type: "categoryNode",
    position: { x: -420, y: -200 },
    data: { kind: "category", label: "Frontend", icon: Code2, color: "#38bdf8", glowColor: "rgba(56,189,248," } satisfies CategoryData,
  },
  {
    id: "cat-backend",
    type: "categoryNode",
    position: { x: 420, y: -200 },
    data: { kind: "category", label: "Backend & Data", icon: Server, color: "#34d399", glowColor: "rgba(52,211,153," } satisfies CategoryData,
  },
  {
    id: "cat-ai",
    type: "categoryNode",
    position: { x: 420, y: 200 },
    data: { kind: "category", label: "AI Infrastructure", icon: BrainCircuit, color: "#a78bfa", glowColor: "rgba(167,139,250," } satisfies CategoryData,
  },
  {
    id: "cat-security",
    type: "categoryNode",
    position: { x: -420, y: 200 },
    data: { kind: "category", label: "Cybersecurity", icon: Shield, color: "#f472b6", glowColor: "rgba(244,114,182," } satisfies CategoryData,
  },

  // ── Frontend Skills ──
  {
    id: "skill-nextjs",
    type: "skillNode",
    position: { x: -680, y: -320 },
    data: { kind: "skill", label: "Next.js", category: "cat-frontend", color: "#38bdf8" } satisfies SkillData,
  },
  {
    id: "skill-react",
    type: "skillNode",
    position: { x: -780, y: -200 },
    data: { kind: "skill", label: "React", category: "cat-frontend", color: "#38bdf8" } satisfies SkillData,
  },
  {
    id: "skill-typescript",
    type: "skillNode",
    position: { x: -680, y: -80 },
    data: { kind: "skill", label: "TypeScript", category: "cat-frontend", color: "#38bdf8" } satisfies SkillData,
  },
  {
    id: "skill-tailwind",
    type: "skillNode",
    position: { x: -560, y: -320 },
    data: { kind: "skill", label: "Tailwind CSS", category: "cat-frontend", color: "#38bdf8" } satisfies SkillData,
  },

  // ── Backend Skills ──
  {
    id: "skill-python",
    type: "skillNode",
    position: { x: 680, y: -320 },
    data: { kind: "skill", label: "Python", category: "cat-backend", color: "#34d399" } satisfies SkillData,
  },
  {
    id: "skill-supabase",
    type: "skillNode",
    position: { x: 780, y: -200 },
    data: { kind: "skill", label: "Supabase", category: "cat-backend", color: "#34d399" } satisfies SkillData,
  },
  {
    id: "skill-nodejs",
    type: "skillNode",
    position: { x: 680, y: -80 },
    data: { kind: "skill", label: "Express / Node.js", category: "cat-backend", color: "#34d399" } satisfies SkillData,
  },
  {
    id: "skill-sql",
    type: "skillNode",
    position: { x: 560, y: -320 },
    data: { kind: "skill", label: "SQL / Access", category: "cat-backend", color: "#34d399" } satisfies SkillData,
  },

  // ── AI Skills ──
  {
    id: "skill-cv",
    type: "skillNode",
    position: { x: 680, y: 80 },
    data: { kind: "skill", label: "Computer Vision", category: "cat-ai", color: "#a78bfa" } satisfies SkillData,
  },
  {
    id: "skill-opencv",
    type: "skillNode",
    position: { x: 780, y: 200 },
    data: { kind: "skill", label: "OpenCV", category: "cat-ai", color: "#a78bfa" } satisfies SkillData,
  },
  {
    id: "skill-model",
    type: "skillNode",
    position: { x: 680, y: 320 },
    data: { kind: "skill", label: "Model Architecture", category: "cat-ai", color: "#a78bfa" } satisfies SkillData,
  },

  // ── Cybersecurity Skills ──
  {
    id: "skill-network",
    type: "skillNode",
    position: { x: -680, y: 80 },
    data: { kind: "skill", label: "Network Security", category: "cat-security", color: "#f472b6" } satisfies SkillData,
  },
  {
    id: "skill-pentest",
    type: "skillNode",
    position: { x: -780, y: 200 },
    data: { kind: "skill", label: "Pen Testing Tools", category: "cat-security", color: "#f472b6" } satisfies SkillData,
  },

  // ── Projects ──
  {
    id: "proj-alnazer",
    type: "projectNode",
    position: { x: -900, y: -500 },
    data: {
      kind: "project",
      label: "Al-Nazer",
      category: "Full-Stack E-Learning",
      desc: "Full-stack e-learning ecosystem for high school students with video management, interactive quizzes, and real-time dashboards.",
      badges: ["Next.js", "React", "Tailwind CSS", "Supabase"],
      url: "https://elnazer.vercel.app/",
      color: "#fbbf24",
    } satisfies ProjectData,
  },
  {
    id: "proj-madarx",
    type: "projectNode",
    position: { x: 900, y: -500 },
    data: {
      kind: "project",
      label: "Madar-X",
      category: "Academic Platform",
      desc: "University academic management platform for data simulation, course tracking, and interactive controls.",
      badges: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
      url: "https://madarx.vercel.app/",
      color: "#fbbf24",
    } satisfies ProjectData,
  },
];

const INITIAL_EDGES: Edge[] = [
  // Root → Categories
  { id: "e-root-fe", source: "root", target: "cat-frontend", animated: true, style: { stroke: "#38bdf8", strokeWidth: 2 } },
  { id: "e-root-be", source: "root", target: "cat-backend", animated: true, style: { stroke: "#34d399", strokeWidth: 2 } },
  { id: "e-root-ai", source: "root", target: "cat-ai", animated: true, style: { stroke: "#a78bfa", strokeWidth: 2 } },
  { id: "e-root-sec", source: "root", target: "cat-security", animated: true, style: { stroke: "#f472b6", strokeWidth: 2 } },

  // Frontend → Skills
  { id: "e-fe-nextjs", source: "cat-frontend", target: "skill-nextjs", style: { stroke: "#38bdf8", strokeWidth: 1.5 } },
  { id: "e-fe-react", source: "cat-frontend", target: "skill-react", style: { stroke: "#38bdf8", strokeWidth: 1.5 } },
  { id: "e-fe-ts", source: "cat-frontend", target: "skill-typescript", style: { stroke: "#38bdf8", strokeWidth: 1.5 } },
  { id: "e-fe-tw", source: "cat-frontend", target: "skill-tailwind", style: { stroke: "#38bdf8", strokeWidth: 1.5 } },

  // Backend → Skills
  { id: "e-be-py", source: "cat-backend", target: "skill-python", style: { stroke: "#34d399", strokeWidth: 1.5 } },
  { id: "e-be-sup", source: "cat-backend", target: "skill-supabase", style: { stroke: "#34d399", strokeWidth: 1.5 } },
  { id: "e-be-node", source: "cat-backend", target: "skill-nodejs", style: { stroke: "#34d399", strokeWidth: 1.5 } },
  { id: "e-be-sql", source: "cat-backend", target: "skill-sql", style: { stroke: "#34d399", strokeWidth: 1.5 } },

  // AI → Skills
  { id: "e-ai-cv", source: "cat-ai", target: "skill-cv", style: { stroke: "#a78bfa", strokeWidth: 1.5 } },
  { id: "e-ai-opencv", source: "cat-ai", target: "skill-opencv", style: { stroke: "#a78bfa", strokeWidth: 1.5 } },
  { id: "e-ai-model", source: "cat-ai", target: "skill-model", style: { stroke: "#a78bfa", strokeWidth: 1.5 } },

  // Security → Skills
  { id: "e-sec-net", source: "cat-security", target: "skill-network", style: { stroke: "#f472b6", strokeWidth: 1.5 } },
  { id: "e-sec-pent", source: "cat-security", target: "skill-pentest", style: { stroke: "#f472b6", strokeWidth: 1.5 } },

  // Projects → Skills
  { id: "e-proj1-nextjs", source: "proj-alnazer", target: "skill-nextjs", style: { stroke: "#fbbf24", strokeWidth: 1, strokeDasharray: "6 3" } },
  { id: "e-proj1-react", source: "proj-alnazer", target: "skill-react", style: { stroke: "#fbbf24", strokeWidth: 1, strokeDasharray: "6 3" } },
  { id: "e-proj1-tw", source: "proj-alnazer", target: "skill-tailwind", style: { stroke: "#fbbf24", strokeWidth: 1, strokeDasharray: "6 3" } },
  { id: "e-proj1-sup", source: "proj-alnazer", target: "skill-supabase", style: { stroke: "#fbbf24", strokeWidth: 1, strokeDasharray: "6 3" } },

  { id: "e-proj2-nextjs", source: "proj-madarx", target: "skill-nextjs", style: { stroke: "#fbbf24", strokeWidth: 1, strokeDasharray: "6 3" } },
  { id: "e-proj2-ts", source: "proj-madarx", target: "skill-typescript", style: { stroke: "#fbbf24", strokeWidth: 1, strokeDasharray: "6 3" } },
  { id: "e-proj2-tw", source: "proj-madarx", target: "skill-tailwind", style: { stroke: "#fbbf24", strokeWidth: 1, strokeDasharray: "6 3" } },
  { id: "e-proj2-sup", source: "proj-madarx", target: "skill-supabase", style: { stroke: "#fbbf24", strokeWidth: 1, strokeDasharray: "6 3" } },
];

/* ─── Helper: get connected node IDs ─── */

function getConnectedIds(nodeId: string, edges: Edge[]): Set<string> {
  const connected = new Set<string>([nodeId]);
  for (const edge of edges) {
    if (edge.source === nodeId) connected.add(edge.target);
    if (edge.target === nodeId) connected.add(edge.source);
  }
  return connected;
}

/* ─── Custom Node Components ─── */

function RootNode({ data }: { data: CustomNodeData }) {
  if (data.kind !== "root") return null;
  return (
    <div className="graph-root-node">
      <Handle type="source" position={Position.Top} className="graph-handle" />
      <Handle type="source" position={Position.Right} className="graph-handle" />
      <Handle type="source" position={Position.Bottom} className="graph-handle" />
      <Handle type="source" position={Position.Left} className="graph-handle" />
      <Sparkles className="w-4 h-4 text-[#00ff66] mb-1" />
      <span className="text-[#00ff66] font-mono font-bold text-sm tracking-wider">{data.label}</span>
    </div>
  );
}

function CategoryNode({ data }: { data: CustomNodeData }) {
  if (data.kind !== "category") return null;
  const Icon = data.icon;
  return (
    <div
      className="graph-category-node"
      style={{ borderColor: `${data.color}40`, boxShadow: `0 0 24px ${data.glowColor}0.15)` }}
    >
      <Handle type="target" position={Position.Top} className="graph-handle" />
      <Handle type="target" position={Position.Right} className="graph-handle" />
      <Handle type="target" position={Position.Bottom} className="graph-handle" />
      <Handle type="target" position={Position.Left} className="graph-handle" />
      <Handle type="source" position={Position.Top} className="graph-handle" />
      <Handle type="source" position={Position.Right} className="graph-handle" />
      <Handle type="source" position={Position.Bottom} className="graph-handle" />
      <Handle type="source" position={Position.Left} className="graph-handle" />
      <Icon className="w-4 h-4 mb-1.5" style={{ color: data.color }} />
      <span className="text-xs font-semibold" style={{ color: data.color }}>{data.label}</span>
    </div>
  );
}

function SkillNode({ data }: { data: CustomNodeData }) {
  if (data.kind !== "skill") return null;
  return (
    <div
      className="graph-skill-node"
      style={{ borderColor: `${data.color}30` }}
    >
      <Handle type="target" position={Position.Top} className="graph-handle" />
      <Handle type="target" position={Position.Right} className="graph-handle" />
      <Handle type="target" position={Position.Bottom} className="graph-handle" />
      <Handle type="target" position={Position.Left} className="graph-handle" />
      <Handle type="source" position={Position.Top} className="graph-handle" />
      <Handle type="source" position={Position.Right} className="graph-handle" />
      <Handle type="source" position={Position.Bottom} className="graph-handle" />
      <Handle type="source" position={Position.Left} className="graph-handle" />
      <span className="text-[11px] font-medium text-slate-300">{data.label}</span>
    </div>
  );
}

function ProjectNode({ data, id }: { data: CustomNodeData; id: string }) {
  if (data.kind !== "project") return null;
  return (
    <div className="graph-project-node" id={`node-${id}`}>
      <Handle type="target" position={Position.Top} className="graph-handle" />
      <Handle type="target" position={Position.Right} className="graph-handle" />
      <Handle type="target" position={Position.Bottom} className="graph-handle" />
      <Handle type="target" position={Position.Left} className="graph-handle" />
      <ExternalLink className="w-3.5 h-3.5 mb-1" style={{ color: data.color }} />
      <span className="text-xs font-bold" style={{ color: data.color }}>{data.label}</span>
      <span className="text-[9px] text-neutral-500 mt-0.5">{data.category}</span>
    </div>
  );
}

/* ─── Project Preview Modal ─── */

interface ProjectPreviewProps {
  project: ProjectData | null;
  onClose: () => void;
}

function ProjectPreview({ project, onClose }: ProjectPreviewProps) {
  if (!project) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9990] flex items-center justify-end p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <motion.div
          className="relative w-full max-w-md bg-[#0f172a] border border-white/[0.08] rounded-2xl p-6 shadow-2xl z-10"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#fbbf24]">Project</span>
            <h3 className="text-xl font-bold text-white mt-1">{project.label}</h3>
            <p className="text-sm text-neutral-400 mt-0.5">{project.category}</p>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed mb-5">{project.desc}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.badges.map((b) => (
              <span
                key={b}
                className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300"
              >
                {b}
              </span>
            ))}
          </div>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fbbf24]/10 border border-[#fbbf24]/20 text-[#fbbf24] text-sm font-medium hover:bg-[#fbbf24]/20 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Main Component ─── */

export default function TechStackGraph() {
  const [nodes] = useState(INITIAL_NODES);
  const [edges] = useState(INITIAL_EDGES);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rfInstance = useRef<any>(null);

  /* ── Compute highlighted set ── */
  const highlightedSet = useMemo(() => {
    if (!hoveredId) return null;
    return getConnectedIds(hoveredId, edges);
  }, [hoveredId, edges]);

  /* ── Derive visual node states ── */
  const displayNodes = useMemo(() => {
    return nodes.map((node) => {
      if (!highlightedSet) {
        return { ...node, style: { ...node.style, opacity: 1 }, className: "" };
      }
      const isConnected = highlightedSet.has(node.id);
      return {
        ...node,
        style: { ...node.style, opacity: isConnected ? 1 : 0.12 },
        className: isConnected ? "graph-node-highlighted" : "graph-node-dimmed",
      };
    });
  }, [nodes, highlightedSet]);

  const displayEdges = useMemo(() => {
    return edges.map((edge) => {
      if (!highlightedSet) {
        return { ...edge, style: { ...edge.style, opacity: 0.6 } };
      }
      const isConn = highlightedSet.has(edge.source) && highlightedSet.has(edge.target);
      return {
        ...edge,
        style: {
          ...edge.style,
          opacity: isConn ? 1 : 0.04,
          strokeWidth: isConn ? ((edge.style?.strokeWidth as number) || 1.5) + 0.5 : (edge.style?.strokeWidth as number) || 1.5,
        },
      };
    });
  }, [edges, highlightedSet]);

  /* ── Event handlers ── */
  const onNodeMouseEnter: NodeMouseHandler = useCallback((_, node) => {
    setHoveredId(node.id);
  }, []);

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setHoveredId(null);
  }, []);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    const d = node.data as CustomNodeData;
    if (d.kind === "project") {
      setSelectedProject(d);
    }
  }, []);

  const resetView = useCallback(() => {
    rfInstance.current?.fitView({ padding: 0.2, duration: 500 });
    setHoveredId(null);
  }, []);

  /* ── Node types (memoized) ── */
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      rootNode: RootNode as never,
      categoryNode: CategoryNode as never,
      skillNode: SkillNode as never,
      projectNode: ProjectNode as never,
    }),
    []
  );

  return (
    <div className="relative w-full h-[600px] md:h-[700px] rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0a0f1a]">
      {/* Ambient backdrop glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#00ff66]/[0.03] blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[#38bdf8]/[0.02] blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#a78bfa]/[0.02] blur-[100px]" />
      </div>

      {/* Label */}
      <div className="absolute top-4 left-5 z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#00ff66]/80">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
          Interactive Graph
        </span>
      </div>

      {/* Hint */}
      <div className="absolute top-4 right-5 z-10 pointer-events-none">
        <span className="text-[10px] text-neutral-600 font-mono">
          hover nodes to explore · click projects for details
        </span>
      </div>

      {/* Reset View Button */}
      <button
        onClick={resetView}
        className="absolute bottom-5 right-5 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[10px] font-medium text-neutral-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200"
      >
        <RotateCcw className="w-3 h-3" />
        Reset View
      </button>

      {/* React Flow */}
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodeClick={onNodeClick}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onInit={(instance: any) => { rfInstance.current = instance; }}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.15}
        maxZoom={2}
        defaultEdgeOptions={{ type: "smoothstep" }}
        proOptions={{ hideAttribution: true }}
        className="graph-canvas"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255,255,255,0.03)"
        />
        <Controls
          showInteractive={false}
          className="graph-controls"
        />
      </ReactFlow>

      {/* Project Preview Modal */}
      {selectedProject && (
        <ProjectPreview
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
