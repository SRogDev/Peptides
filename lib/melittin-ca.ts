/**
 * Melittin backbone trace — REAL experimental data, not a generated model.
 * Source: RCSB PDB entry 2MLT, chain A, alpha-carbon (CA) atoms only.
 * Method: X-ray diffraction, 2.0 A resolution (Terwilliger & Eisenberg, J. Biol. Chem. 1982).
 * The 27th SEQRES entry is a C-terminal NH2 (amide), not an amino acid, so the
 * chain has 26 CA positions matching GIGAVLKVLTTGLPALISWIKRKRQQ.
 * Coordinates were centred on the CA centroid for display only; no atom was
 * moved relative to another. This is a backbone trace, NOT a full ball-and-stick
 * structure: side chains, hydrogens and the second chain of the 2MLT dimer
 * are intentionally omitted and labelled as such in the UI.
 */
export type CaAtom = { residue: string; position: number; x: number; y: number; z: number };
export const MELITTIN_2MLT_CHAIN_A_CA: CaAtom[] = [
  {
    "residue": "GLY",
    "position": 1,
    "x": 13.311,
    "y": -8.596,
    "z": 7.709
  },
  {
    "residue": "ILE",
    "position": 2,
    "x": 13.908,
    "y": -5.291,
    "z": 5.859
  },
  {
    "residue": "GLY",
    "position": 3,
    "x": 13.707,
    "y": -7.372,
    "z": 2.713
  },
  {
    "residue": "ALA",
    "position": 4,
    "x": 10.086,
    "y": -8.368,
    "z": 3.49
  },
  {
    "residue": "VAL",
    "position": 5,
    "x": 9.063,
    "y": -4.766,
    "z": 4.467
  },
  {
    "residue": "LEU",
    "position": 6,
    "x": 10.77,
    "y": -3.54,
    "z": 1.341
  },
  {
    "residue": "LYS",
    "position": 7,
    "x": 8.787,
    "y": -5.754,
    "z": -0.98
  },
  {
    "residue": "VAL",
    "position": 8,
    "x": 5.5,
    "y": -4.477,
    "z": 0.595
  },
  {
    "residue": "LEU",
    "position": 9,
    "x": 6.607,
    "y": -0.867,
    "z": 0.109
  },
  {
    "residue": "THR",
    "position": 10,
    "x": 7.046,
    "y": -1.616,
    "z": -3.532
  },
  {
    "residue": "THR",
    "position": 11,
    "x": 3.84,
    "y": -3.513,
    "z": -4.273
  },
  {
    "residue": "GLY",
    "position": 12,
    "x": 1.292,
    "y": -3.703,
    "z": -1.476
  },
  {
    "residue": "LEU",
    "position": 13,
    "x": 1.631,
    "y": -0.027,
    "z": -0.252
  },
  {
    "residue": "PRO",
    "position": 14,
    "x": 0.734,
    "y": 1.614,
    "z": -3.586
  },
  {
    "residue": "ALA",
    "position": 15,
    "x": -2.47,
    "y": -0.526,
    "z": -3.892
  },
  {
    "residue": "LEU",
    "position": 16,
    "x": -3.334,
    "y": 0.243,
    "z": -0.265
  },
  {
    "residue": "ILE",
    "position": 17,
    "x": -2.949,
    "y": 3.948,
    "z": -0.998
  },
  {
    "residue": "SER",
    "position": 18,
    "x": -5.467,
    "y": 3.719,
    "z": -3.872
  },
  {
    "residue": "TRP",
    "position": 19,
    "x": -7.8,
    "y": 1.807,
    "z": -1.535
  },
  {
    "residue": "ILE",
    "position": 20,
    "x": -7.664,
    "y": 4.525,
    "z": 1.15
  },
  {
    "residue": "LYS",
    "position": 21,
    "x": -8.404,
    "y": 7.128,
    "z": -1.459
  },
  {
    "residue": "ARG",
    "position": 22,
    "x": -11.552,
    "y": 5.165,
    "z": -2.596
  },
  {
    "residue": "LYS",
    "position": 23,
    "x": -12.792,
    "y": 4.82,
    "z": 0.934
  },
  {
    "residue": "ARG",
    "position": 24,
    "x": -12.233,
    "y": 8.566,
    "z": 1.66
  },
  {
    "residue": "GLN",
    "position": 25,
    "x": -14.456,
    "y": 9.622,
    "z": -1.277
  },
  {
    "residue": "GLN",
    "position": 26,
    "x": -17.16,
    "y": 7.252,
    "z": -0.033
  }
];
