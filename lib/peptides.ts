/**
 * Curated peptide dataset — small on purpose.
 *
 * Molecular weight and formula are PubChem values (CID given), verified
 * 2026-10-25 via the PubChem PUG REST API. Sequences are the canonical
 * one-letter sequences for these well-known peptides. Biological context
 * is a one-line summary, not a clinical claim: nothing here is medical
 * advice and no therapeutic efficacy is implied.
 * Fields that are unknown are `null`, never invented.
 */

export type Peptide = {
  id: string;
  name: string;
  shortName: string;
  sequence: string;
  organismContext: string;
  context: string;
  formula: string;
  molecularWeightDa: number;
  pubchemCid: number;
  disulfideBonds: string | null;
  terminalModification: string | null;
  structure: {
    status: "included" | "not-included";
    pdbId: string | null;
    method: string | null;
    resolutionAngstrom: number | null;
    note: string;
  };
  literatureQuery: string;
  sources: { label: string; url: string }[];
};

export const PEPTIDES: Peptide[] = [
  {
    id: "oxytocin",
    name: "Oxytocin",
    shortName: "OXT",
    sequence: "CYIQNCPLG",
    organismContext: "Human hypothalamic nonapeptide",
    context:
      "Cyclic nonapeptide involved in uterine contraction, milk ejection and social-bonding research. Studied extensively; clinical use is outside this tool's scope.",
    formula: "C43H66N12O12S2",
    molecularWeightDa: 1007.2,
    pubchemCid: 439302,
    disulfideBonds: "Cys1–Cys6",
    terminalModification: null,
    structure: {
      status: "not-included",
      pdbId: null,
      method: null,
      resolutionAngstrom: null,
      note: "No structure is bundled for oxytocin in this demo. Search RCSB PDB for oxytocin complexes instead of viewing an invented model.",
    },
    literatureQuery: "oxytocin",
    sources: [
      { label: "PubChem CID 439302", url: "https://pubchem.ncbi.nlm.nih.gov/compound/439302" },
      { label: "RCSB PDB search: oxytocin", url: "https://www.rcsb.org/search?query=oxytocin" },
    ],
  },
  {
    id: "arginine-vasopressin",
    name: "Arginine vasopressin",
    shortName: "AVP",
    sequence: "CYFQNCPRG",
    organismContext: "Human hypothalamic nonapeptide",
    context:
      "Antidiuretic hormone: regulates water reabsorption in the kidney and vascular tone. Closely related to oxytocin, differing at positions 3 and 8.",
    formula: "C46H65N15O12S2",
    molecularWeightDa: 1084.2,
    pubchemCid: 644077,
    disulfideBonds: "Cys1–Cys6",
    terminalModification: null,
    structure: {
      status: "not-included",
      pdbId: null,
      method: null,
      resolutionAngstrom: null,
      note: "No structure is bundled for vasopressin in this demo. Search RCSB PDB instead of viewing an invented model.",
    },
    literatureQuery: "arginine vasopressin",
    sources: [
      { label: "PubChem CID 644077", url: "https://pubchem.ncbi.nlm.nih.gov/compound/644077" },
      { label: "RCSB PDB search: vasopressin", url: "https://www.rcsb.org/search?query=vasopressin" },
    ],
  },
  {
    id: "bradykinin",
    name: "Bradykinin",
    shortName: "BK",
    sequence: "RPPGFSPFR",
    organismContext: "Human plasma kinin",
    context:
      "Nonapeptide released from kininogen that promotes vasodilation and vascular permeability and mediates pain and inflammation signalling.",
    formula: "C50H73N15O11",
    molecularWeightDa: 1060.2,
    pubchemCid: 439201,
    disulfideBonds: null,
    terminalModification: null,
    structure: {
      status: "not-included",
      pdbId: null,
      method: null,
      resolutionAngstrom: null,
      note: "No structure is bundled for bradykinin in this demo. Search RCSB PDB instead of viewing an invented model.",
    },
    literatureQuery: "bradykinin",
    sources: [
      { label: "PubChem CID 439201", url: "https://pubchem.ncbi.nlm.nih.gov/compound/439201" },
      { label: "RCSB PDB search: bradykinin", url: "https://www.rcsb.org/search?query=bradykinin" },
    ],
  },
  {
    id: "angiotensin-ii",
    name: "Angiotensin II",
    shortName: "Ang II",
    sequence: "DRVYIHPF",
    organismContext: "Human renin–angiotensin system",
    context:
      "Octapeptide effector of the renin–angiotensin system: potent vasoconstrictor and regulator of aldosterone release and blood pressure.",
    formula: "C50H71N13O12",
    molecularWeightDa: 1046.2,
    pubchemCid: 172198,
    disulfideBonds: null,
    terminalModification: null,
    structure: {
      status: "not-included",
      pdbId: null,
      method: null,
      resolutionAngstrom: null,
      note: "No structure is bundled for angiotensin II in this demo. Search RCSB PDB instead of viewing an invented model.",
    },
    literatureQuery: "angiotensin II",
    sources: [
      { label: "PubChem CID 172198", url: "https://pubchem.ncbi.nlm.nih.gov/compound/172198" },
      { label: "RCSB PDB search: angiotensin", url: "https://www.rcsb.org/search?query=angiotensin" },
    ],
  },
  {
    id: "melittin",
    name: "Melittin",
    shortName: "MEL",
    sequence: "GIGAVLKVLTTGLPALISWIKRKRQQ",
    organismContext: "Honeybee (Apis mellifera) venom",
    context:
      "26-residue membrane-active peptide and the main component of bee venom. Forms amphipathic helices; its pore-forming behaviour is widely studied in vitro. Not a drug in this tool.",
    formula: "C131H229N39O31",
    molecularWeightDa: 2846.5,
    pubchemCid: 16133648,
    disulfideBonds: null,
    terminalModification: "C-terminal amidation (NH2)",
    structure: {
      status: "included",
      pdbId: "2MLT",
      method: "X-ray diffraction",
      resolutionAngstrom: 2.0,
      note: "Real structure: chain A alpha-carbon trace from RCSB PDB 2MLT (Terwilliger & Eisenberg, 1982). Backbone only — side chains and chain B are omitted.",
    },
    literatureQuery: "melittin",
    sources: [
      { label: "PubChem CID 16133648", url: "https://pubchem.ncbi.nlm.nih.gov/compound/16133648" },
      { label: "RCSB PDB 2MLT", url: "https://www.rcsb.org/structure/2MLT" },
    ],
  },
  {
    id: "somatostatin-14",
    name: "Somatostatin-14",
    shortName: "SST-14",
    sequence: "AGCKNFFWKTFTSC",
    organismContext: "Human hypothalamic / pancreatic peptide",
    context:
      "14-residue cyclic peptide that broadly inhibits the release of growth hormone, insulin, glucagon and other hormones.",
    formula: "C76H104N18O19S2",
    molecularWeightDa: 1637.9,
    pubchemCid: 16129706,
    disulfideBonds: "Cys3–Cys14",
    terminalModification: null,
    structure: {
      status: "not-included",
      pdbId: null,
      method: null,
      resolutionAngstrom: null,
      note: "No structure is bundled for somatostatin-14 in this demo. Search RCSB PDB instead of viewing an invented model.",
    },
    literatureQuery: "somatostatin",
    sources: [
      { label: "PubChem CID 16129706", url: "https://pubchem.ncbi.nlm.nih.gov/compound/16129706" },
      { label: "RCSB PDB search: somatostatin", url: "https://www.rcsb.org/search?query=somatostatin" },
    ],
  },
];

export function getPeptide(id: string): Peptide | undefined {
  return PEPTIDES.find((p) => p.id === id);
}

export function searchPeptides(query: string): Peptide[] {
  const q = query.trim().toLowerCase();
  if (!q) return PEPTIDES;
  return PEPTIDES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.sequence.includes(query.trim().toUpperCase()) ||
      p.context.toLowerCase().includes(q),
  );
}
