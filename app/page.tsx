"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PEPTIDES, searchPeptides } from "@/lib/peptides";
import { averageHydropathy, formatSequence, netChargeAtNeutralPH } from "@/lib/sequence";

export default function Home() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchPeptides(query), [query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
          Computational biology · First step
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl">
          Peptides, examined
          <span className="block text-neutral-400">with scientific precision.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
          A curated exploration of real peptides: their sequences, measured properties, one genuine
          3D structure, and the literature behind them. What is unknown is shown as unknown — never
          filled in with a plausible guess.
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-gradient-to-br from-white via-[#f4f4f2] to-[#e8e8e5] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900">One real structure, in 3D</p>
            <p className="mt-1 text-sm text-neutral-600">
              Melittin, PDB 2MLT — X-ray, 2.0 Å. Open it to orbit a genuine experimental backbone trace.
            </p>
          </div>
          <Link
            href="/peptides/melittin"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-neutral-900 px-5 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            View melittin in 3D →
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <label className="sr-only" htmlFor="peptide-search">Search peptides</label>
        <input
          id="peptide-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, code or sequence fragment… e.g. oxytocin, CYIQ, melittin"
          className="min-h-[52px] w-full rounded-full border border-neutral-300 bg-white px-5 text-base text-neutral-900 outline-none focus:border-neutral-900"
        />
        <p className="mt-3 text-sm text-neutral-500">
          {results.length} of {PEPTIDES.length} curated peptides
          {query ? ` matching “${query}”` : ""}. A small, verified set beats a large, invented one.
        </p>

        {results.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
            <p className="font-medium text-neutral-900">No peptide matches that search.</p>
            <p className="mt-1 text-sm text-neutral-500">Try a name (oxytocin), a code (OXT) or a sequence fragment (CYIQ).</p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => {
              const charge = netChargeAtNeutralPH(p.sequence);
              return (
                <li key={p.id} className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-400 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold leading-tight text-neutral-900">{p.name}</h2>
                      <p className="mt-0.5 text-xs uppercase tracking-wider text-neutral-400">{p.shortName} · {p.organismContext}</p>
                    </div>
                    {p.structure.status === "included" ? (
                      <span className="shrink-0 rounded-full bg-neutral-900 px-2.5 py-1 text-[11px] font-medium text-white">3D structure</span>
                    ) : (
                      <span className="shrink-0 rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] text-neutral-500">No 3D bundled</span>
                    )}
                  </div>
                  <p className="mt-3 font-mono text-sm leading-relaxed tracking-wide text-neutral-700">{formatSequence(p.sequence)}</p>
                  <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-neutral-50 py-2">
                      <dt className="text-[11px] text-neutral-500">Length</dt>
                      <dd className="text-sm font-semibold">{p.sequence.length} aa</dd>
                    </div>
                    <div className="rounded-lg bg-neutral-50 py-2">
                      <dt className="text-[11px] text-neutral-500">Weight</dt>
                      <dd className="text-sm font-semibold">{p.molecularWeightDa.toFixed(1)} Da</dd>
                    </div>
                    <div className="rounded-lg bg-neutral-50 py-2">
                      <dt className="text-[11px] text-neutral-500">Charge*</dt>
                      <dd className="text-sm font-semibold">{charge > 0 ? "+" : ""}{charge}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-600">{p.context}</p>
                  <p className="mt-2 text-xs text-neutral-400">GRAVY (calculated): {averageHydropathy(p.sequence)}</p>
                  <Link href={`/peptides/${p.id}`} className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border border-neutral-300 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100">
                    Open detail →
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-4 text-xs text-neutral-400">* Charge and GRAVY are calculated from sequence (see Methodology), not measured. Weight and formula are PubChem values.</p>
      </section>
    </div>
  );
}
