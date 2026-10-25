<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Peptides working agreement

- Scientific credibility first: never fabricate biological data. Missing = shown as missing.
- Measured values cite PubChem / RCSB / Europe PMC; calculated values are labelled as calculations.
- Real structures and placeholders are never mixed without a label.
- Stack: Next.js App Router, TypeScript strict, Tailwind 4, R3F + Drei, Vercel AI SDK.
- Tests: `npm test` (Vitest) for sequence calculations and data normalisation before delivery.
- One logical change per commit; README touch-up in the same PR for significant changes.
- No medical claims, no peptide generation, no accounts/billing in v0.x.
