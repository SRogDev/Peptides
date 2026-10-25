# Architecture

Simple, modular, easy to extend. No database, no accounts, no microservices in v0.1.

```
Browser
  ├─ Explorer (client search over a static curated list)
  ├─ Detail page (server component: static params, curated record)
  │   ├─ MoleculeViewer — dynamic import, ssr:false (three.js must not SSR)
  │   ├─ LiteraturePanel — client, fetches /api/literature
  │   └─ AssistantPanel — client, posts /api/assistant
  └─ Compare (client, two selects + table)

Server (Next.js route handlers)
  ├─ /api/literature — Europe PMC REST, cached 1h (revalidate: 3600)
  └─ /api/assistant — curated record + Europe PMC → AI SDK (if key) or evidence summary

Data layer (lib/)
  ├─ peptides.ts — curated dataset, the only place peptide facts live
  ├─ sequence.ts — pure calculations (weight, charge, hydropathy, composition)
  ├─ melittin-ca.ts — real 2MLT Cα coordinates, generated from the PDB file
  └─ europepmc.ts — API client + normalisation (PMID/DOI link building)
```

## Design decisions

- **Curated, not indexed.** Six verified peptides beat thousands of scraped rows with
  unknown provenance. Adding a peptide = one entry in `lib/peptides.ts` with a PubChem CID.
- **Viewer is a trace, not a molecule.** Full ball-and-stick needs side-chain atoms; the
  demo renders only what was verified (Cα positions). Labelling that honestly is a feature.
- **Retrieval before generation.** The assistant's context is built server-side from the
  record + Europe PMC before any model call, and the model prompt forbids invented citations.
- **No key, no problem.** The assistant degrades to a deterministic summary, so the demo
  works fully on a fresh Vercel deploy with zero secrets configured.
- **Bundle discipline.** `three` / R3F load only on detail pages via `next/dynamic`
  (Vercel React best practices: dynamic imports for heavy components).

## Adding a structure later

1. Download the PDB/mmCIF from RCSB, extract the chain you will render, verify the
   residue sequence matches the curated sequence.
2. Add the centred coordinates to a new `lib/<pdb>-ca.ts` with a provenance header.
3. Set `structure.status: "included"` in `lib/peptides.ts` and wire the viewer.
4. Never generate coordinates from a sequence and present them as a structure.
