"use client";

import { useState } from "react";

export default function AssistantPanel({ peptideId, peptideName }: { peptideId: string; peptideName: string }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peptideId, question }),
      });
      if (!res.ok) throw new Error(`Assistant returned ${res.status}`);
      const data = (await res.json()) as { answer: string; mode: string };
      setAnswer(data.answer);
      setMode(data.mode);
    } catch {
      setError("The assistant could not answer right now. The curated data and literature above are still available.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-label={`Research assistant for ${peptideName}`}>
      <h2 className="text-lg font-semibold text-neutral-900">Research assistant</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Answers are grounded in this peptide&apos;s curated record and live Europe PMC results — never
        in invented papers. If the evidence is insufficient, the assistant says so.
      </p>
      <form onSubmit={ask} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="assistant-question">
          Ask about {peptideName}
        </label>
        <input
          id="assistant-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={`Ask about ${peptideName}…`}
          className="min-h-[44px] flex-1 rounded-full border border-neutral-300 bg-white px-4 text-sm text-neutral-900 outline-none focus:border-neutral-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-[44px] cursor-pointer rounded-full bg-neutral-900 px-5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
        >
          {loading ? "Thinking…" : "Ask"}
        </button>
      </form>
      {error && <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {answer && (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
          {mode && (
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
              {mode === "model" ? "AI model answer, grounded in retrieved sources" : "Evidence summary (no model key configured) — facts only, no generated claims"}
            </p>
          )}
          <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-800">{answer}</p>
        </div>
      )}
    </section>
  );
}
