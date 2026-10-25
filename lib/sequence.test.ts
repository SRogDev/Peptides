import { describe, expect, it } from "vitest";
import {
  aminoAcidComposition,
  averageHydropathy,
  isValidSequence,
  molecularWeightFromSequence,
  netChargeAtNeutralPH,
  sequenceLength,
} from "./sequence";

describe("sequence validation", () => {
  it("accepts the 20 standard amino acids", () => {
    expect(isValidSequence("CYIQNCPLG")).toBe(true);
    expect(isValidSequence("GIGAVLKVLTTGLPALISWIKRKRQQ")).toBe(true);
  });
  it("rejects empty, lowercase-adjacent and non-standard letters", () => {
    expect(isValidSequence("")).toBe(false);
    expect(isValidSequence("CYIQXNCPLG")).toBe(false);
    expect(isValidSequence("CYIQNCPLG ")).toBe(false);
    expect(isValidSequence("123")).toBe(false);
  });
  it("counts length correctly", () => {
    expect(sequenceLength("CYIQNCPLG")).toBe(9);
    expect(sequenceLength("DRVYIHPF")).toBe(8);
    expect(sequenceLength("GIGAVLKVLTTGLPALISWIKRKRQQ")).toBe(26);
  });
});

describe("calculated properties (labelled as calculations, not measurements)", () => {
  it("computes a molecular weight in the right ballpark for oxytocin", () => {
    // Free linear peptide, no disulfide correction: expected within ~5 Da of
    // the PubChem value 1007.2 (the difference is the disulfide / termini).
    const mw = molecularWeightFromSequence("CYIQNCPLG");
    expect(mw).toBeGreaterThan(1000);
    expect(mw).toBeLessThan(1015);
  });
  it("computes net charge and hydropathy with the expected signs", () => {
    expect(netChargeAtNeutralPH("DRVYIHPF")).toBeCloseTo(0, 0);
    expect(netChargeAtNeutralPH("GIGAVLKVLTTGLPALISWIKRKRQQ")).toBeGreaterThan(3);
    expect(averageHydropathy("GIGAVLKVLTTGLPALISWIKRKRQQ")).toBeLessThan(0.5);
  });
  it("counts composition", () => {
    const comp = aminoAcidComposition("CYIQNCPLG");
    expect(comp.C).toBe(2);
    expect(comp.G).toBe(1);
    expect(Object.values(comp).reduce((a, b) => a + b, 0)).toBe(9);
  });
});
