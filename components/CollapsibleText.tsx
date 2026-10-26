"use client";

import { useState } from "react";

/**
 * Long text, collapsed by default: shows a short preview with a
 * touch-friendly Show more / Show less toggle. Short texts render whole.
 */
export default function CollapsibleText({ text, previewLength = 120 }: { text: string; previewLength?: number }) {
  const [expanded, setExpanded] = useState(false);
  const needsCollapse = text.length > previewLength;
  const shown = expanded || !needsCollapse ? text : `${text.slice(0, previewLength).trimEnd()}…`;

  return (
    <div>
      <p className="mt-3 max-w-3xl leading-relaxed text-neutral-600">{shown}</p>
      {needsCollapse && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="mt-1 min-h-[44px] cursor-pointer px-1 text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
