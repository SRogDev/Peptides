"use client";

import { useEffect, useState } from "react";
import type { LiteratureArticle } from "@/lib/europepmc";

type Loaded = { query: string; articles: LiteratureArticle[]; error: string | null };

export default function LiteraturePanel({ query, peptideName }: { query: string; peptideName: string }) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  // Derived, not set in the effect: while the query changes, show loading
  // instead of stale results for the previous peptide.
  const isCurrent = loaded !== null && loaded.query === query;
  const articles = isCurrent ? loaded.articles : null;
  const error = isCurrent ? loaded.error : null;

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/literature?q=${encodeURIComponent(query)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Literature service returned ${r.status}`);
        return r.json();
      })
      .then((data: { articles: LiteratureArticle[] }) => {
        if (!cancelled) setLoaded({ query, articles: data.articles, error: null });
      })
      .catch(() => {
        if (!cancelled)
          setLoaded({
            query,
            articles: [],
            error: "Could not load literature from Europe PMC right now. Try again later, or search Europe PMC directly.",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <section aria-label={`Scientific literature about ${peptideName}`}>
      <h2 className="text-lg font-semibold text-neutral-900">Scientific literature</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Live results from Europe PMC. Titles, dates and abstracts are shown as returned; evidence type
        (in vitro / animal / human) is only stated when the abstract itself makes it clear — it is not
        inferred here.
      </p>
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
      )}
      {!error && articles === null && <p className="mt-4 text-sm text-neutral-500">Loading literature…</p>}
      {!error && articles !== null && articles.length === 0 && (
        <p className="mt-4 text-sm text-neutral-500">No articles returned for this query.</p>
      )}
      <ul className="mt-4 space-y-3">
        {(articles ?? []).map((a) => (
          <li key={a.id} className="rounded-xl border border-neutral-200 bg-white p-4">
            <a href={a.url} target="_blank" rel="noreferrer" className="text-[15px] font-medium leading-snug text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900">
              {a.title}
            </a>
            <p className="mt-1 text-xs text-neutral-500">
              {[a.journal, a.year].filter(Boolean).join(" · ")}
              {a.authors ? ` · ${a.authors}` : ""}
              {a.pmid ? ` · PMID ${a.pmid}` : ""}
              {a.doi ? ` · DOI ${a.doi}` : ""}
            </p>
            {a.abstract && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600">{a.abstract}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
