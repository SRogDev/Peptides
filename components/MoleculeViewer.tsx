"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import type { CaAtom } from "@/lib/melittin-ca";

function residueColor(residue: string): string {
  const hydrophobic = ["ALA", "VAL", "ILE", "LEU", "MET", "PHE", "TRP", "PRO", "GLY"];
  const positive = ["LYS", "ARG"];
  const negative = ["ASP", "GLU"];
  if (positive.includes(residue)) return "#c8a86b";
  if (negative.includes(residue)) return "#8fa3b8";
  if (hydrophobic.includes(residue)) return "#d9d9d4";
  return "#9a9a94";
}

export default function MoleculeViewer({ atoms }: { atoms: CaAtom[] }) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [showTrace, setShowTrace] = useState(true);
  const points = useMemo(
    () => atoms.map((a) => [a.x, a.y, a.z] as [number, number, number]),
    [atoms],
  );

  return (
    <div>
      <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-neutral-800 bg-[#101214]">
        <Canvas camera={{ position: [0, 4, 46], fov: 42 }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[10, 10, 10]} intensity={1.2} />
          <directionalLight position={[-10, -5, -10]} intensity={0.4} />
          {showTrace && <Line points={points} color="#6f6f6a" lineWidth={1.5} />}
          {atoms.map((a) => (
            <mesh key={a.position} position={[a.x, a.y, a.z]}>
              <sphereGeometry args={[a.position === 1 || a.position === atoms.length ? 1.15 : 0.85, 24, 24]} />
              <meshStandardMaterial color={residueColor(a.residue)} metalness={0.35} roughness={0.4} />
            </mesh>
          ))}
          <OrbitControls autoRotate={autoRotate} autoRotateSpeed={1.2} enablePan />
        </Canvas>
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[11px] tracking-wide text-neutral-300">
          REAL STRUCTURE · PDB 2MLT · CHAIN A · Cα TRACE
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setAutoRotate((v) => !v)}
          className="min-h-[44px] cursor-pointer rounded-full border border-neutral-300 bg-white px-4 text-sm text-neutral-800 transition hover:bg-neutral-100"
        >
          {autoRotate ? "Stop rotation" : "Auto-rotate"}
        </button>
        <button
          type="button"
          onClick={() => setShowTrace((v) => !v)}
          className="min-h-[44px] cursor-pointer rounded-full border border-neutral-300 bg-white px-4 text-sm text-neutral-800 transition hover:bg-neutral-100"
        >
          {showTrace ? "Hide backbone trace" : "Show backbone trace"}
        </button>
        <span className="text-xs text-neutral-500">
          Drag to orbit · scroll to zoom · right-drag to pan. Larger spheres mark the N- and C-termini.
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500">
        Colour: silver = hydrophobic / Gly / Pro · warm grey-gold = positively charged (Lys, Arg) ·
        blue-grey = negatively charged (Asp, Glu) · mid-grey = polar uncharged. This is a backbone
        trace only; side chains are not shown.
      </p>
    </div>
  );
}
