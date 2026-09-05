"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

/* ─── Robot Head ─── */
function RobotHead({ mouse }: { mouse: React.RefObject<THREE.Vector2> }) {
  const headRef = useRef<THREE.Mesh>(null);
  const visorRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!headRef.current) return;
    // Smooth mouse-follow tilt
    const targetX = (mouse.current?.y ?? 0) * 0.3;
    const targetY = (mouse.current?.x ?? 0) * 0.5;
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetX, delta * 2);
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetY, delta * 2);
    // Slow auto-rotation
    headRef.current.rotation.z += delta * 0.08;
  });

  return (
    <group ref={headRef}>
      {/* Main head sphere */}
      <mesh>
        <sphereGeometry args={[1.1, 64, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.95}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Visor band */}
      <mesh ref={visorRef} position={[0, 0.05, 0.6]}>
        <boxGeometry args={[1.6, 0.28, 0.5]} />
        <meshStandardMaterial
          color="#0d1117"
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Left eye */}
      <mesh ref={eyeLeftRef} position={[-0.38, 0.08, 0.88]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#34d399"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Right eye */}
      <mesh ref={eyeRightRef} position={[0.38, 0.08, 0.88]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Eye glow halos */}
      <mesh position={[-0.38, 0.08, 0.82]}>
        <ringGeometry args={[0.12, 0.18, 32]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#34d399"
          emissiveIntensity={1.2}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.38, 0.08, 0.82]}>
        <ringGeometry args={[0.12, 0.18, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={1.2}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Antenna spike */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.02, 0.015, 0.4, 16]} />
        <meshStandardMaterial
          color="#2a2a3e"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0, 1.48, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#34d399"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Jaw line accent */}
      <mesh position={[0, -0.55, 0.5]}>
        <boxGeometry args={[1.2, 0.04, 0.6]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ─── Orbital Rings ─── */
function OrbitalRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.4;
      ring1Ref.current.rotation.z += delta * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.35;
      ring2Ref.current.rotation.x -= delta * 0.1;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.25;
      ring3Ref.current.rotation.y -= delta * 0.2;
    }
  });

  return (
    <group>
      {/* Ring 1 — Emerald */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.7, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#34d399"
          emissiveIntensity={2}
          metalness={0.8}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* Ring 2 — Cyan */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, Math.PI / 6]}>
        <torusGeometry args={[2.0, 0.012, 16, 100]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={1.8}
          metalness={0.8}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* Ring 3 — Mixed / subtle */}
      <mesh ref={ring3Ref} rotation={[Math.PI / 2.5, Math.PI / 4, 0]}>
        <torusGeometry args={[2.3, 0.008, 16, 100]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={1.2}
          metalness={0.8}
          roughness={0.25}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ─── Floating Particles ─── */
function Particles({ count = 40 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#34d399"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Scene ─── */
function Scene({ mouse }: { mouse: React.RefObject<THREE.Vector2> }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 2, 4]} color="#34d399" intensity={2} distance={12} />
      <pointLight position={[-3, -1, 3]} color="#06b6d4" intensity={1.8} distance={12} />
      <pointLight position={[0, 4, -2]} color="#8b5cf6" intensity={0.8} distance={10} />
      <spotLight
        position={[0, 5, 5]}
        angle={0.4}
        penumbra={0.8}
        color="#ffffff"
        intensity={0.6}
      />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <RobotHead mouse={mouse} />
      </Float>

      <OrbitalRings />
      <Particles />

      <Environment preset="city" environmentIntensity={0.3} />
    </>
  );
}

/* ─── Exported Canvas Component ─── */
export default function CyberBot() {
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  return (
    <div
      className="w-full h-full min-h-[280px]"
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene mouse={mouseRef} />
      </Canvas>
    </div>
  );
}
