import Link from "next/link";
import { notFound } from "next/navigation";
import { getPeptide, PEPTIDES } from "@/lib/peptides";
import { MELITTIN_2MLT_CHAIN_A_CA } from "@/lib/melittin-ca";
import { averageHydropathy, formatSequence, molecularWeightFromSequence, netChargeAtNeutralPH } from "@/lib/sequence";
import LiteraturePanel from "@/components/LiteraturePanel";
import AssistantPanel from "@/components/AssistantPanel";
import MoleculeViewer from "@/components/MoleculeViewerLazy";

export function generateStaticParams() {
  return PEPTIDES.map((p) => ({ id: p.id }));
}

export default async function PeptideDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const peptide = getPeptide(id);
  if (!peptide) notFound();

  const calculatedMw = molecularWeightFromSequence(peptide.sequence);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900">← Back to explorer</Link>
      <header className="mt-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">{peptide.organismContext}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">{peptide.name}</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-neutral-600">{peptide.context}</p>
      </header>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-medium uppercase tracking-wider text-neutral-500">Amino acid sequence</h2>
          <p className="mt-3 break-all font-mono text-lg leading-relaxed tracking-wide text-neutral-900">{formatSequence(peptide.sequence)}</p>
          <p className="mt-2 text-sm text-neutral-500">
            {peptide.sequence.length} residues
            {peptide.disulfideBonds ? ` · Disulfide: ${peptide.disulfideBonds}` : " · No disulfide recorded"}
            {peptide.terminalModification ? ` · ${peptide.terminalModification}` : ""}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-medium uppercase tracking-wider text-neutral-500">Sources</h2>
          <ul className="mt-3 space-y-2">
            {peptide.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-neutral-800 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900">{s.label} →</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Molecular weight (PubChem)", value: `${peptide.molecularWeightDa.toFixed(1)} Da`, note: `CID ${peptide.pubchemCid} · ${peptide.formula}` },
          { label: "Calculated weight (sequence)", value: `${calculatedMw.toFixed(1)} Da`, note: "Free linear peptide; ignores disulfides / termini — hence the small difference" },
          { label: "Net charge at ~pH 7 (calculated)", value: `${netChargeAtNeutralPH(peptide.sequence) > 0 ? "+" : ""}${netChargeAtNeutralPH(peptide.sequence)}`, note: "Simplified estimate, not a measurement" },
          { label: "Average hydropathy (calculated)", value: `${averageHydropathy(peptide.sequence)}`, note: "Kyte-Doolittle GRAVY from sequence" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-xs text-neutral-500">{stat.label}</p>
            <p className="mt-1 text-xl font-semibold text-neutral-900">{stat.value}</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-500">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900">Molecular structure</h2>
        {peptide.structure.status === "included" ? (
          <>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-neutral-500">{peptide.structure.note}</p>
            <div className="mt-4">
              <MoleculeViewer atoms={MELITTIN_2MLT_CHAIN_A_CA} />
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              Provenance: RCSB PDB {peptide.structure.pdbId}, {peptide.structure.method}, {peptide.structure.resolutionAngstrom} Å, chain A, 26 Cα atoms.{" "}
              <a href="https://www.rcsb.org/structure/2MLT" target="_blank" rel="noreferrer" className="underline">View the original entry →</a>
            </p>
          </>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-neutral-300 bg-white p-6">
            <p className="font-medium text-neutral-900">No structure bundled for this peptide.</p>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-neutral-600">{peptide.structure.note}</p>
            <p className="mt-3 text-sm text-neutral-500">
              This is deliberate: showing coordinates invented for this peptide would look like science and would not be.
            </p>
          </div>
        )}
      </section>

      <div className="mt-12 space-y-12">
        <LiteraturePanel query={peptide.literatureQuery} peptideName={peptide.name} />
        <AssistantPanel peptideId={peptide.id} peptideName={peptide.name} />
      </div>

      <div className="mt-10">
        <Link href="/compare" className="inline-flex min-h-[44px] items-center rounded-full border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 hover:bg-neutral-100">
          Compare {peptide.name} with another peptide →
        </Link>
      </div>
    </div>
  );
}
