# STATUS — Peptides

## Done (v0.1, 2026-10-25)

- Next.js 16 + TypeScript strict + Tailwind 4 scaffold, platinum design system.
- Explorer: 6 curated peptides, verified against PubChem (CIDs, formulas, weights).
- Detail pages: sequence, properties (sourced vs calculated, labelled), sources.
- 3D: melittin PDB 2MLT chain A Cα trace (26 atoms, X-ray 2.0 Å), R3F + Drei, orbit/zoom/pan.
- Literature: live Europe PMC per peptide.
- Assistant: Vercel AI SDK, grounded; evidence-summary mode without a key.
- Compare: side-by-side table with provenance.
- Tests: 6/6 sequence tests (validation, length, weight ballpark, charge, hydropathy, composition).
- Docs: README, ARCHITECTURE, DATA_SOURCES, PROJECT_BRIEF, Methodology page.
- CI: GitHub Actions (install, test, lint, build).
- Deployed: GitHub (public) + Vercel — see README links / repo About once live.

## Doing

- Nothing in flight. Awaiting Roger's answers below before v0.2.

## Questions for Roger (answer when you can — no rush)

1. **Next peptides:** ¿cuáles añadimos primero? ¿UniProt como fuente, o una lista tuya?
2. **AlphaFold:** ¿añadimos estructuras predichas con etiqueta dura "PREDICTED", o nos quedamos solo con experimentales?
3. **IA:** ¿qué proveedor/llave usamos para el asistente (OpenAI, Vercel AI Gateway, otro)? Sin llave ya funciona en modo evidencia.
4. **Diseño:** ¿platino claro en toda la app está bien, o quieres también modo oscuro completo? El visor 3D ya es oscuro.
5. **Literatura:** ¿clasificamos evidencia (in vitro / animal / humano) automáticamente en v0.2, aunque sea imperfecta, o seguimos mostrando abstracts sin inferir?
6. **Nombre/dominio:** ¿`peptides` en Vercel está bien, o quieres dominio propio más adelante?
7. **Karpathy skills:** ¿las quieres también dentro de este repo (docs) o solo en tu colección roger-crazy-skills?

## Suggestions (not decided)

- A. UniProt enrichment: canonical IDs, organism, function annotation per peptide.
- B. Sequence tools: composition chart, hydropathy plot (client-side, from the same lib).
- C. Shareable peptide URLs already work (`/peptides/<id>`) — add OG cards for portfolio sharing.
- D. A second real structure (e.g. insulin is a protein, 51 residues across 2 chains — needs chain handling, doable but not trivial).
- E. Offline fallback: if Europe PMC fails, show cached last-known titles instead of only an error.
