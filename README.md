# Peptides — A Platinum Scientific Exploration Experience

A polished, AI-powered scientific exploration web app focused on peptides: their
sequences, properties, one real 3D molecular structure, and the scientific literature
around them.

**Not** a peptide generator, medical application, or drug-design platform.

## What is in v0.1

- **Peptide Explorer** — 6 curated, verified peptides (oxytocin, arginine vasopressin,
  bradykinin, angiotensin II, melittin, somatostatin-14) with search, sequences,
  PubChem molecular weights/formulas, and calculated properties clearly labelled as calculations.
- **Interactive 3D viewer** — melittin only, and only a real structure: the chain A
  alpha-carbon trace from RCSB PDB **2MLT** (X-ray, 2.0 Å, Terwilliger & Eisenberg 1982).
  Orbit / zoom / pan, auto-rotate, backbone-trace toggle. Every other peptide shows an
  explicit “no structure bundled” state instead of an invented model.
- **Scientific literature** — live Europe PMC search per peptide, with titles, journals,
  years, abstracts and PubMed/DOI links.
- **Research assistant** — Vercel AI SDK, grounded in the curated record + Europe PMC.
  With `OPENAI_API_KEY` it answers as a model from retrieved sources only; without a key
  it returns a deterministic evidence summary. It never invents papers or results.
- **Comparison** — side-by-side table for any two peptides, with provenance per row.

## Stack

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS 4 · React Three Fiber +
Drei · Vercel AI SDK · Vitest · Vercel deployment.

## Quickstart

```bash
npm install --legacy-peer-deps
npm run dev        # http://localhost:3000
npm test           # vitest, sequence calculations
npm run build
```

Optional: copy `.env.example` to `.env.local` and set `OPENAI_API_KEY` to enable model
answers in the assistant. Without it, the assistant still works in evidence-summary mode.

## Project structure

```
app/                  pages, layout, API routes (literature, assistant)
components/           MoleculeViewer (R3F), LiteraturePanel, AssistantPanel
lib/peptides.ts       curated dataset + provenance (PubChem CIDs, RCSB links)
lib/sequence.ts       transparent sequence calculations + tests
lib/melittin-ca.ts    REAL 2MLT chain A Cα coordinates (centred for display only)
lib/europepmc.ts      Europe PMC client (server-side)
docs/                 architecture, data sources, project brief
```

## Scientific credibility rules

1. Never fabricate missing biological data — missing is shown as missing.
2. Measured values cite PubChem / RCSB / Europe PMC; calculated values are labelled.
3. Real structures and illustrative placeholders are never mixed without a label.
4. No clinical efficacy, dose, or safety claims.

See `docs/ARCHITECTURE.md`, `docs/DATA_SOURCES.md` and the in-app Methodology page
(`/methodology`) for the full picture, including known limitations.

## License

MIT. See `LICENSE`.
