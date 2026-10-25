# Data sources

Verified 2026-10-25 via the live APIs listed below.

## PubChem (PUG REST, no key)

| Peptide | CID | Formula | MW (Da) |
|---|---|---|---|
| Oxytocin | 439302 | C43H66N12O12S2 | 1007.2 |
| Arginine vasopressin | 644077 | C46H65N15O12S2 | 1084.2 |
| Bradykinin | 439201 | C50H73N15O11 | 1060.2 |
| Angiotensin II | 172198 | C50H71N13O12 | 1046.2 |
| Melittin | 16133648 | C131H229N39O31 | 2846.5 |
| Somatostatin | 16129706 | C76H104N18O19S2 | 1637.9 |

Note: "vasopressin" alone returns no PubChem hit; the verified name is
"arginine vasopressin" (CID 644077).

## RCSB PDB — 2MLT (melittin)

- Method: X-ray diffraction, 2.0 Å resolution.
- Authors: Terwilliger & Eisenberg, J. Biol. Chem. 1982.
- Deposit: 1990-10-04; entry: https://www.rcsb.org/structure/2MLT
- Rendered: chain A, 26 Cα atoms. SEQRES lists 27 entries because the 27th is a
  C-terminal NH2 amide, not an amino acid. Coordinates centred on the Cα centroid
  for display; relative positions unchanged.

## Europe PMC REST (no key)

- Endpoint: `https://www.ebi.ac.uk/europepmc/webservices/rest/search`
- `resultType=core` gives abstracts; links are built from PMID (PubMed) or DOI.
- Hit counts are large (e.g. oxytocin >70k); the app shows the 8 most recent/relevant
  results returned for the peptide query, it does not claim to be exhaustive.

## Investigated, not integrated in v0.1

- **AlphaFold Database** — predicted structures. Integrating them without a very clear
  "predicted, not experimental" label would weaken the app's core promise. Candidate
  for a later, explicitly labelled layer.
- **PeptiVerse (HuggingFace Space)** — research demo, not a stable data API.
- **UniProt** — good next source for canonical sequences/annotations if the dataset grows.
