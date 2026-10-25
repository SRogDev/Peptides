/**
 * Sequence utilities for Peptides.
 *
 * These are simple, transparent calculations from a one-letter sequence.
 * They are NOT experimental measurements. Any value shown in the UI that
 * comes from here must be labelled "calculated from sequence".
 * Authoritative molecular weights and formulas come from PubChem and are
 * stored separately in lib/peptides.ts.
 */

export const STANDARD_AMINO_ACIDS = "ACDEFGHIKLMNPQRSTVWY";

const RESIDUE_MASS: Record<string, number> = {
  A: 71.08, R: 156.19, N: 114.1, D: 115.09, C: 103.14, E: 129.12, Q: 128.13,
  G: 57.05, H: 137.14, I: 113.16, L: 113.16, K: 128.17, M: 131.19, F: 147.18,
  P: 97.12, S: 87.08, T: 101.11, W: 186.21, Y: 163.18, V: 99.13,
};

// Kyte-Doolittle hydropathy scale.
const HYDROPATHY: Record<string, number> = {
  A: 1.8, R: -4.5, N: -3.5, D: -3.5, C: 2.5, E: -3.5, Q: -3.5, G: -0.4,
  H: -3.2, I: 4.5, L: 3.8, K: -3.9, M: 1.9, F: 2.8, P: -1.6, S: -0.8,
  T: -0.7, W: -0.9, Y: -1.3, V: 4.2,
};

export function isValidSequence(sequence: string): boolean {
  if (!sequence || sequence.length === 0) return false;
  return [...sequence].every((aa) => STANDARD_AMINO_ACIDS.includes(aa));
}

export function sequenceLength(sequence: string): number {
  return sequence.length;
}

/** Free linear peptide weight: sum of residue masses + water. Ignores disulfides and terminal modifications. */
export function molecularWeightFromSequence(sequence: string): number {
  if (!isValidSequence(sequence)) throw new Error("Invalid amino acid sequence");
  const sum = [...sequence].reduce((acc, aa) => acc + (RESIDUE_MASS[aa] ?? 0), 0);
  return sum + 18.015;
}

/** Simplified net-charge estimate at ~pH 7: K/R +1, D/E -1, H +0.1. Label as estimate. */
export function netChargeAtNeutralPH(sequence: string): number {
  if (!isValidSequence(sequence)) throw new Error("Invalid amino acid sequence");
  let charge = 0;
  for (const aa of sequence) {
    if (aa === "K" || aa === "R") charge += 1;
    else if (aa === "D" || aa === "E") charge -= 1;
    else if (aa === "H") charge += 0.1;
  }
  return Math.round(charge * 10) / 10;
}

export function averageHydropathy(sequence: string): number {
  if (!isValidSequence(sequence)) throw new Error("Invalid amino acid sequence");
  const sum = [...sequence].reduce((acc, aa) => acc + (HYDROPATHY[aa] ?? 0), 0);
  return Math.round((sum / sequence.length) * 100) / 100;
}

export function aminoAcidComposition(sequence: string): Record<string, number> {
  if (!isValidSequence(sequence)) throw new Error("Invalid amino acid sequence");
  const comp: Record<string, number> = {};
  for (const aa of sequence) comp[aa] = (comp[aa] ?? 0) + 1;
  return comp;
}

export function formatSequence(sequence: string): string {
  return sequence.match(/.{1,10}/g)?.join(" ") ?? sequence;
}
