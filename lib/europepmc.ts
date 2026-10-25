/** Europe PMC client (server-side only). No API key required. */

export type LiteratureArticle = {
  id: string;
  title: string;
  journal: string | null;
  year: string | null;
  authors: string | null;
  doi: string | null;
  pmid: string | null;
  abstract: string | null;
  url: string;
};

type EuropePmcResult = {
  id?: string;
  title?: string;
  journalTitle?: string;
  pubYear?: string;
  authorString?: string;
  doi?: string;
  pmid?: string;
  abstractText?: string;
};

function normalize(r: EuropePmcResult): LiteratureArticle {
  const pmid = r.pmid ?? null;
  return {
    id: r.id ?? pmid ?? r.title ?? "unknown",
    title: r.title ?? "Untitled",
    journal: r.journalTitle ?? null,
    year: r.pubYear ?? null,
    authors: r.authorString ?? null,
    doi: r.doi ?? null,
    pmid,
    abstract: r.abstractText ?? null,
    url: pmid
      ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
      : r.doi
        ? `https://doi.org/${r.doi}`
        : "https://europepmc.org/",
  };
}

export async function searchLiterature(query: string, pageSize = 8): Promise<LiteratureArticle[]> {
  const url =
    "https://www.ebi.ac.uk/europepmc/webservices/rest/search?" +
    new URLSearchParams({
      query,
      format: "json",
      resultType: "core",
      pageSize: String(pageSize),
    }).toString();
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Europe PMC returned ${res.status}`);
  const data = (await res.json()) as { resultList?: { result?: EuropePmcResult[] } };
  return (data.resultList?.result ?? []).map(normalize);
}
