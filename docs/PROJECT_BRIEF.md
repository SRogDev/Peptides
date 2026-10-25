# Peptides — Project Brief

## Vision

A premium scientific instrument for exploring peptides: precise, elegant, quietly
futuristic, platinum visual identity. Helps users explore existing peptides, understand
their properties, inspect available 3D structures, compare candidates, and investigate
the literature. Not a generator, not a medical app, not a drug-design platform.

## v0.1 status (2026-10-25)

Done: explorer (6 curated peptides), one real 3D structure (melittin, 2MLT Cα trace),
live Europe PMC literature, grounded AI assistant (model mode with key, evidence mode
without), comparison, methodology page, tests for sequence calculations, CI.

## Next steps (awaiting Roger's answers — see STATUS.md questions)

1. Which peptides to add next, and from which source (UniProt? PubChem list?).
2. Predicted structures: add an AlphaFold layer with a hard "predicted" label, or stay
   experimental-only?
3. AI provider + key: OpenAI via Vercel AI Gateway, or another provider?
4. Deploy target confirmed: Vercel (this repo deploys there by default).
5. Design: keep platinum light theme, or add a dark instrument mode for the whole app
   (viewer is already dark)?

## Non-goals

Peptide generation, laboratory integrations, user accounts, billing, large database,
model training, GPU infrastructure, clinical claims.
