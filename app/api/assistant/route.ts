import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getPeptide } from "@/lib/peptides";
import { searchLiterature } from "@/lib/europepmc";
import { averageHydropathy, netChargeAtNeutralPH } from "@/lib/sequence";

/**
 * Research assistant.
 * - Always retrieves: the curated peptide record + live Europe PMC results.
 * - If OPENAI_API_KEY is set, the Vercel AI SDK answers with that retrieved
 *   context and is instructed to cite only those sources and to say when
 *   evidence is insufficient.
 * - If no key is set, it returns a deterministic evidence summary instead of
 *   a model answer. It never invents papers, identifiers or results.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { peptideId?: string; question?: string } | null;
  const peptide = body?.peptideId ? getPeptide(body.peptideId) : undefined;
  const question = body?.question?.trim();
  if (!peptide || !question) {
    return NextResponse.json({ error: "Missing peptide or question" }, { status: 400 });
  }

  let articles: Awaited<ReturnType<typeof searchLiterature>> = [];
  try {
    articles = await searchLiterature(peptide.literatureQuery, 5);
  } catch {
    articles = [];
  }

  const facts = [
    `Name: ${peptide.name} (${peptide.shortName}).`,
    `Sequence: ${peptide.sequence} (${peptide.sequence.length} residues).`,
    `Molecular weight (PubChem, CID ${peptide.pubchemCid}): ${peptide.molecularWeightDa} Da; formula ${peptide.formula}.`,
    `Context: ${peptide.context}`,
    peptide.disulfideBonds ? `Disulfide bonds: ${peptide.disulfideBonds}.` : "Disulfide bonds: none recorded in this dataset.",
    peptide.terminalModification ? `Terminal modification: ${peptide.terminalModification}.` : "",
    `Calculated net charge at ~pH 7 (estimate): ${netChargeAtNeutralPH(peptide.sequence)}.`,
    `Calculated average hydropathy (Kyte-Doolittle, estimate): ${averageHydropathy(peptide.sequence)}.`,
    peptide.structure.status === "included"
      ? `Structure: real PDB ${peptide.structure.pdbId}, ${peptide.structure.method}, ${peptide.structure.resolutionAngstrom} Å.`
      : "Structure: no structure is bundled for this peptide in this demo.",
  ]
    .filter(Boolean)
    .join("\n");

  const literature = articles.length
    ? articles.map((a) => `- ${a.title} (${a.journal ?? "journal unknown"}, ${a.year ?? "year unknown"}) — ${a.url}`).join("\n")
    : "No Europe PMC results could be retrieved for this query.";

  if (!process.env.OPENAI_API_KEY) {
    const answer = [
      `Evidence summary for ${peptide.name} — no model answer, because no AI provider key is configured.`,
      "",
      "Sourced facts from the curated record:",
      facts,
      "",
      "Recent literature from Europe PMC (titles only; open a link to verify any claim):",
      literature,
      "",
      "What this does not establish: this summary does not prove any clinical effect, dose, or safety claim. If the question needs evidence beyond the record and papers above, the honest answer is: insufficient evidence in this tool.",
    ].join("\n");
    return NextResponse.json({ answer, mode: "evidence" });
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: [
        "You are a careful scientific research assistant inside Peptides, a peptide exploration tool.",
        "Answer ONLY from the retrieved facts and literature below. Cite sources by title and link when you use them.",
        "Clearly separate: (1) sourced facts, (2) calculated estimates, (3) uncertain interpretation.",
        "Never invent papers, identifiers, sequences, experimental results or citations.",
        "If the retrieved evidence does not answer the question, say the evidence is insufficient.",
        "Do not give medical advice or imply clinical efficacy. Keep the answer concise.",
      ].join(" "),
      prompt: `Question about ${peptide.name}: ${question}\n\nRetrieved facts:\n${facts}\n\nRetrieved literature:\n${literature}`,
    });
    return NextResponse.json({ answer: text, mode: "model" });
  } catch {
    return NextResponse.json({ error: "AI provider unavailable" }, { status: 502 });
  }
}
