"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Grid, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* Design tokens - match globals.css emerald accent */
const ACCENT = "#34d399";
const ACCENT_DIM = "#2dd4bf";

export type FrameloopMode = "always" | "demand" | "never";

interface RootCoreSceneProps {
  lowEnd?: boolean;
  reducedMotion?: boolean;
  frameloop?: FrameloopMode;
}

/* Deterministic PRNG (same pattern as Hero3D) */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Mouse parallax rig - tilts the whole scene toward the cursor */
function ParallaxRig({
  children,
  reducedMotion,
}: {
  children: React.ReactNode;
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.x = THREE.MathUtils.damp(
      ref.current.rotation.x,
      pointer.y * 0.22,
      2.5,
      delta
    );
    ref.current.rotation.y = THREE.MathUtils.damp(
      ref.current.rotation.y,
      pointer.x * 0.3,
      2.5,
      delta
    );
  });

  return <group ref={ref}>{children}</group>;
}

/* Central glowing core - wireframe shell + emissive inner solid */
function Core({
  reducedMotion,
  hovered,
  onHoverChange,
}: {
  reducedMotion: boolean;
  hovered: boolean;
  onHoverChange: (v: boolean) => void;
}) {
  const wireRef = useRef<THREE.Mesh>(null);
  const solidRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const speed = useRef(0.55);

  useFrame((state, delta) => {
    speed.current = THREE.MathUtils.damp(
      speed.current,
      hovered ? 1.5 : 0.55,
      4,
      delta
    );

    const t = state.clock.elapsedTime;
    const breathe = reducedMotion
      ? 0
      : Math.sin(t * 1.6) * 0.05 + (hovered ? 0.1 : 0);

    if (wireRef.current) {
      wireRef.current.rotation.x += delta * 0.35 * speed.current;
      wireRef.current.rotation.y += delta * 0.55 * speed.current;
      wireRef.current.scale.setScalar(1 + breathe);
    }
    if (solidRef.current) {
      solidRef.current.rotation.y -= delta * 0.25 * speed.current;
      solidRef.current.scale.setScalar(0.55 * (1 + breathe));
    }
    if (matRef.current) {
      matRef.current.emissiveIntensity = THREE.MathUtils.damp(
        matRef.current.emissiveIntensity,
        hovered ? 2.6 : 1.35,
        5,
        delta
      );
    }
  });

  return (
    <group>
      <mesh
        ref={wireRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHoverChange(true);
        }}
        onPointerOut={() => onHoverChange(false)}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={ACCENT}
          wireframe
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={solidRef}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          ref={matRef}
          color="#04150e"
          emissive={ACCENT}
          emissiveIntensity={1.35}
          roughness={0.25}
          metalness={0.4}
        />
      </mesh>
    </group>
  );
}

/* Orbiting rings - different tilt angles and spin speeds */
const RINGS = [
  {
    radius: 1.55,
    tilt: [Math.PI / 2.4, 0, 0.3] as [number, number, number],
    speed: 0.5,
    color: ACCENT,
    opacity: 0.55,
  },
  {
    radius: 1.85,
    tilt: [Math.PI / 1.9, 0.5, -0.4] as [number, number, number],
    speed: -0.35,
    color: ACCENT_DIM,
    opacity: 0.4,
  },
  {
    radius: 2.15,
    tilt: [Math.PI / 1.6, -0.6, 0.9] as [number, number, number],
    speed: 0.22,
    color: "#6ee7b7",
    opacity: 0.28,
  },
];

function OrbitRings({ reducedMotion }: { reducedMotion: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    refs.current.forEach((m, i) => {
      if (m) m.rotation.z += delta * RINGS[i].speed;
    });
  });

  return (
    <group>
      {RINGS.map((r, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          rotation={r.tilt}
        >
          <torusGeometry args={[r.radius, 0.006, 8, 160]} />
          <meshBasicMaterial
            color={r.color}
            transparent
            opacity={r.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* Orbiting tech labels rendered as camera-facing HTML pills */
const LABELS = [
  { text: "Next.js", angle: 0, y: 0.9, radius: 2.7 },
  { text: "React", angle: Math.PI / 3, y: -0.4, radius: 2.9 },
  { text: "TypeScript", angle: (2 * Math.PI) / 3, y: 0.6, radius: 2.6 },
  { text: "Tailwind", angle: Math.PI, y: -0.8, radius: 2.8 },
  { text: "Supabase", angle: (4 * Math.PI) / 3, y: 0.3, radius: 2.7 },
  { text: "Vercel", angle: (5 * Math.PI) / 3, y: -0.6, radius: 2.9 },
];

function OrbitLabels({
  reducedMotion,
  lowEnd,
}: {
  reducedMotion: boolean;
  lowEnd: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const labels = lowEnd ? LABELS.slice(0, 3) : LABELS;

  useFrame((_, delta) => {
    if (group.current && !reducedMotion) {
      group.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={group}>
      {labels.map((l) => (
        <group
          key={l.text}
          position={[
            Math.cos(l.angle) * l.radius,
            l.y,
            Math.sin(l.angle) * l.radius,
          ]}
        >
          <Html center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
            <span className="inline-flex items-center whitespace-nowrap rounded-full border border-emerald-200 bg-white/85 px-2.5 py-1 text-[10px] font-medium text-emerald-700 shadow-sm backdrop-blur-md">
              {l.text}
            </span>
          </Html>
        </group>
      ))}
    </group>
  );
}

/* Particle field: floating nodes connected by faint lines */
function Network({ lowEnd }: { lowEnd: boolean }) {
  const { positions, edges } = useMemo(() => {
    const rand = mulberry32(0x3c0de);
    const count = lowEnd ? 22 : 42;
    const pos = new Float32Array(count * 3);
    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const r = 2.0 + rand() * 1.6;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.8;
      const z = r * Math.cos(phi);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      nodes.push(new THREE.Vector3(x, y, z));
    }

    const edgeList: [number, number][] = [];
    const maxEdges = lowEnd ? 26 : 55;
    for (let i = 0; i < count && edgeList.length < maxEdges; i++) {
      const nearest = nodes
        .map((n, j) => ({ j, d: n.distanceTo(nodes[i]) }))
        .filter((e) => e.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const { j } of nearest) {
        if (nodes[i].distanceTo(nodes[j]) < 1.4) {
          edgeList.push([i, j]);
        }
      }
    }

    const edgeArr = new Float32Array(edgeList.length * 6);
    edgeList.forEach(([a, b], k) => {
      edgeArr[k * 6] = nodes[a].x;
      edgeArr[k * 6 + 1] = nodes[a].y;
      edgeArr[k * 6 + 2] = nodes[a].z;
      edgeArr[k * 6 + 3] = nodes[b].x;
      edgeArr[k * 6 + 4] = nodes[b].y;
      edgeArr[k * 6 + 5] = nodes[b].z;
    });

    return { positions: pos, edges: edgeArr };
  }, [lowEnd]);

  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={ACCENT}
          size={lowEnd ? 0.045 : 0.035}
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edges, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={ACCENT}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

/* Faint reflective grid floor + radial glow under the core */
function Floor() {
  return (
    <group position={[0, -2.1, 0]}>
      <Grid
        args={[12, 12]}
        cellSize={0.45}
        cellThickness={0.5}
        cellColor="#134e3a"
        sectionSize={2.2}
        sectionThickness={1}
        sectionColor={ACCENT_DIM}
        fadeDistance={11}
        fadeStrength={2.5}
        infiniteGrid
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[2.4, 64]} />
        <meshBasicMaterial
          color={ACCENT}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* Scene root */
export default function RootCoreScene({
  lowEnd = false,
  reducedMotion = false,
  frameloop = "always",
}: RootCoreSceneProps) {
  const [hovered, setHovered] = useState(false);

  const dpr: [number, number] = lowEnd ? [1, 1.25] : [1, 1.5];
  const particleCount = lowEnd ? 18 : 45;

  return (
    <Canvas
      frameloop={frameloop}
      dpr={dpr}
      gl={{
        antialias: !lowEnd,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0.4, 4.6], fov: 42 }}
    >
      <ambientLight intensity={0.5} />
      <pointLight
        position={[3.5, 3, 3.5]}
        intensity={lowEnd ? 30 : 55}
        distance={12}
        color={ACCENT}
      />
      <pointLight position={[-4, -1, -3]} intensity={12} color="#0e7490" />

      <ParallaxRig reducedMotion={reducedMotion}>
        <Core
          reducedMotion={reducedMotion}
          hovered={hovered}
          onHoverChange={setHovered}
        />
        <OrbitRings reducedMotion={reducedMotion} />
        <OrbitLabels reducedMotion={reducedMotion} lowEnd={lowEnd} />
        <Network lowEnd={lowEnd} />
        <Sparkles
          count={particleCount}
          scale={[7, 4.5, 7]}
          size={lowEnd ? 1.6 : 2.2}
          speed={reducedMotion ? 0 : 0.22}
          color={ACCENT}
          opacity={0.45}
        />
        <Floor />
      </ParallaxRig>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reducedMotion && !lowEnd}
        autoRotateSpeed={0.9}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.7}
      />

      {!lowEnd && !reducedMotion && (
        <EffectComposer>
          <Bloom
            intensity={hovered ? 0.95 : 0.55}
            luminanceThreshold={0.12}
            luminanceSmoothing={0.25}
            mipmapBlur
            radius={0.7}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
