"use client";

import { useState } from "react";
import Link from "next/link";
import { getPeptide, PEPTIDES } from "@/lib/peptides";
import { averageHydropathy, formatSequence, netChargeAtNeutralPH } from "@/lib/sequence";

function Row({ label, a, b }: { label: string; a: string; b: string }) {
  const differs = a !== b;
  return (
    <tr className="border-t border-neutral-100">
      <th className="w-36 px-4 py-3 text-left align-top text-xs font-medium uppercase tracking-wider text-neutral-500">{label}</th>
      <td className="px-4 py-3 align-top text-sm text-neutral-900">{a}</td>
      <td className={`px-4 py-3 align-top text-sm ${differs ? "font-medium text-neutral-900" : "text-neutral-900"}`}>{b}</td>
    </tr>
  );
}

export default function Compare() {
  const [aId, setAId] = useState("oxytocin");
  const [bId, setBId] = useState("melittin");
  const a = getPeptide(aId) ?? PEPTIDES[0];
  const b = getPeptide(bId) ?? PEPTIDES[1];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Compare peptides</h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Side by side, with provenance. Calculated values are labelled as such; missing structures are
        shown as missing, not approximated.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { label: "Peptide A", value: aId, set: setAId },
          { label: "Peptide B", value: bId, set: setBId },
        ].map((sel) => (
          <div key={sel.label}>
            <label className="text-sm font-medium text-neutral-700" htmlFor={sel.label}>{sel.label}</label>
            <select
              id={sel.label}
              value={sel.value}
              onChange={(e) => sel.set(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-full border border-neutral-300 bg-white px-4 text-sm text-neutral-900"
            >
              {PEPTIDES.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-neutral-400">Property</th>
              <th className="px-4 py-3 text-left"><Link href={`/peptides/${a.id}`} className="text-sm font-semibold text-neutral-900 underline decoration-neutral-300">{a.name} →</Link></th>
              <th className="px-4 py-3 text-left"><Link href={`/peptides/${b.id}`} className="text-sm font-semibold text-neutral-900 underline decoration-neutral-300">{b.name} →</Link></th>
            </tr>
          </thead>
          <tbody>
            <Row label="Sequence" a={formatSequence(a.sequence)} b={formatSequence(b.sequence)} />
            <Row label="Length" a={`${a.sequence.length} residues`} b={`${b.sequence.length} residues`} />
            <Row label="Weight (PubChem)" a={`${a.molecularWeightDa.toFixed(1)} Da`} b={`${b.molecularWeightDa.toFixed(1)} Da`} />
            <Row label="Formula (PubChem)" a={a.formula} b={b.formula} />
            <Row label="Charge at ~pH 7 (calc.)" a={String(netChargeAtNeutralPH(a.sequence))} b={String(netChargeAtNeutralPH(b.sequence))} />
            <Row label="GRAVY (calc.)" a={String(averageHydropathy(a.sequence))} b={String(averageHydropathy(b.sequence))} />
            <Row label="Disulfide" a={a.disulfideBonds ?? "None recorded"} b={b.disulfideBonds ?? "None recorded"} />
            <Row label="Terminal modification" a={a.terminalModification ?? "None recorded"} b={b.terminalModification ?? "None recorded"} />
            <Row label="3D structure" a={a.structure.status === "included" ? `Included: PDB ${a.structure.pdbId}` : "Not bundled — see detail page"} b={b.structure.status === "included" ? `Included: PDB ${b.structure.pdbId}` : "Not bundled — see detail page"} />
            <Row label="Context" a={a.context} b={b.context} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
