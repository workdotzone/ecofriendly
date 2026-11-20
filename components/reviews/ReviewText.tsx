"use client";

import { useState } from "react";

/** Review body with a "Read more" toggle. Full text is always in the HTML (crawlable); only the visual clamp changes. */
export default function ReviewText({ text, id }: { text: string; id: string }) {
  const [expanded, setExpanded] = useState(false);
  const long = text.length > 220;

  return (
    <div className="flex-grow">
      <p
        id={`review-text-${id}`}
        className={`whitespace-pre-line text-[15px] leading-relaxed text-gray-700 ${long && !expanded ? "line-clamp-5" : ""}`}
      >
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={`review-text-${id}`}
          className="mt-2 text-sm font-semibold text-green-700 hover:text-green-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
