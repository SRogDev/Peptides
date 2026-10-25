export default function Methodology() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Methodology, sources &amp; limits</h1>
      <p className="mt-3 leading-relaxed text-neutral-600">
        Peptides is deliberately small. Six peptides, one real structure, live literature — and every
        gap labelled as a gap.
      </p>

      <h2 className="mt-10 text-lg font-semibold text-neutral-900">Data sources (verified 2026-10-25)</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700">
        <li><strong>PubChem PUG REST</strong> — molecular formula and weight for all six peptides, by CID (listed on each detail page). No API key required.</li>
        <li><strong>RCSB Protein Data Bank, entry 2MLT</strong> — melittin chain A alpha-carbon coordinates, X-ray diffraction, 2.0 Å, Terwilliger &amp; Eisenberg (1982). Only the backbone trace is rendered; side chains and chain B are omitted by design.</li>
        <li><strong>Europe PMC REST API</strong> — live literature search, titles, journals, years, abstracts and PubMed/DOI links. No API key required.</li>
        <li><strong>AlphaFold Database and PeptiVerse</strong> were investigated per the brief but are not integrated in v0.1: AlphaFold adds predicted (not experimental) structures, which would blur the real-vs-predicted line this demo is built on; PeptiVerse is a research demo space, not a stable data API. Both remain candidates for a later, clearly-labelled predicted-structure layer.</li>
      </ul>

      <h2 className="mt-10 text-lg font-semibold text-neutral-900">What is calculated vs measured</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700">
        <li><strong>Measured / sourced:</strong> PubChem molecular weight and formula; RCSB 2MLT coordinates and resolution.</li>
        <li><strong>Calculated from sequence (labelled *):</strong> length, net charge at ~pH 7 (K/R +1, D/E −1, H +0.1), average hydropathy (Kyte-Doolittle). These are transparent estimates in <code className="rounded bg-neutral-100 px-1">lib/sequence.ts</code>, covered by tests.</li>
        <li><strong>Not claimed:</strong> no activity, potency, dose, safety, or clinical efficacy claims anywhere in the app.</li>
      </ul>

      <h2 className="mt-10 text-lg font-semibold text-neutral-900">AI assistant</h2>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700">
        With <code className="rounded bg-neutral-100 px-1">OPENAI_API_KEY</code> set, the Vercel AI SDK answers from the retrieved
        curated record and Europe PMC results, instructed to cite only those sources and to state when
        evidence is insufficient. Without a key, the route returns a deterministic evidence summary — no
        model text, no invented citations. Set the key in Vercel project settings; it is never committed.
      </p>

      <h2 className="mt-10 text-lg font-semibold text-neutral-900">Known limitations (v0.1)</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700">
        <li>Only melittin has a bundled 3D structure; the other five show an explicit “not bundled” state.</li>
        <li>The viewer is a Cα backbone trace, not a full ball-and-stick model with side chains.</li>
        <li>Literature evidence type (in vitro / animal / human) is not auto-classified — abstracts are shown verbatim instead of guessing.</li>
        <li>No user accounts, no database, no peptide generation, no laboratory integration — by design.</li>
      </ul>
    </div>
  );
}
