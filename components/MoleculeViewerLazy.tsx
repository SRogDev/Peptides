"use client";

import dynamic from "next/dynamic";

const MoleculeViewer = dynamic(() => import("@/components/MoleculeViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-2xl border border-neutral-800 bg-[#101214] text-sm text-neutral-400">
      Loading 3D viewer…
    </div>
  ),
});

export default MoleculeViewer;
