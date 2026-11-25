import type { ReactNode } from "react";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

/**
 * Tiny, safe markdown-lite renderer for admin/curated content (no dangerouslySetInnerHTML, no XSS).
 * Supports: paragraphs (blank line), "## h2", "### h3", "- / * bullets", "1. ordered", **bold**,
 * and [text](/internal-or-https-link). Plain text with single newlines still renders as readable paragraphs,
 * so content already saved in the admin panel keeps working.
 */

function rewriteInternalHref(href: string) {
  try {
    const url = new URL(href, SITE_URL);
    const hostname = url.hostname.toLowerCase();
    const isLegacyHost = hostname === "ecofriendlypests.com" || hostname === "www.ecofriendlypests.com";
    if (url.origin !== new URL(SITE_URL).origin && !isLegacyHost) return href;
    const pathname = /^\/index\.php$/i.test(url.pathname)
      ? "/"
      : url.pathname.replace(/\.php$/i, "");
    return `${pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={`${keyPrefix}-b${i}`} className="font-semibold text-gray-900">{token.slice(2, -2)}</strong>);
    } else {
      const [, label, href] = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/) ?? [];
      const target = href ? rewriteInternalHref(href) : "";
      const safe = target && (/^\/(?!\/)/.test(target) || /^https?:\/\//i.test(target) || /^(tel|mailto):/i.test(target));
      nodes.push(
        safe && target.startsWith("/") ? (
          <Link
            key={`${keyPrefix}-a${i}`}
            href={target}
            className="font-semibold text-green-700 underline decoration-green-300 underline-offset-2 hover:text-green-800"
          >
            {label}
          </Link>
        ) : safe ? (
          <a
            key={`${keyPrefix}-a${i}`}
            href={target}
            className="font-semibold text-green-700 underline decoration-green-300 underline-offset-2 hover:text-green-800"
            {...(/^https?:\/\//i.test(target) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {label}
          </a>
        ) : (
          label ?? token
        ),
      );
    }
    last = match.index + token.length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

type Block =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "ul" | "ol"; items: string[] };

export function parseBlocks(source: string): Block[] {
  const lines = (source || "").replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ").trim() });
    paragraph = [];
  };
  const flushList = () => {
    if (list?.items.length) blocks.push(list);
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    const bullet = line.match(/^[-*•]\s+(.+)$/);
    const ordered = line.match(/^\d+[.)]\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: heading[1].length === 2 ? "h2" : "h3", text: heading[2] });
    } else if (bullet || ordered) {
      flushParagraph();
      const type = bullet ? "ul" : "ol";
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push((bullet ?? ordered)![1]);
    } else {
      flushList();
      // A single newline inside plain admin text = new paragraph (keeps old content readable).
      flushParagraph();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

export function Markdown({ source, className = "" }: { source: string; className?: string }) {
  const blocks = parseBlocks(source);
  return (
    <div className={`space-y-4 text-base leading-relaxed text-gray-700 sm:text-[17px] ${className}`}>
      {blocks.map((block, index) => {
        const key = `md-${index}`;
        switch (block.type) {
          case "h2":
            return <h2 key={key} className="pt-4 text-2xl font-bold text-gray-900">{inline(block.text, key)}</h2>;
          case "h3":
            return <h3 key={key} className="pt-2 text-xl font-semibold text-gray-900">{inline(block.text, key)}</h3>;
          case "ul":
            return (
              <ul key={key} className="list-disc space-y-2 pl-5 marker:text-green-600">
                {block.items.map((item, i) => <li key={`${key}-${i}`}>{inline(item, `${key}-${i}`)}</li>)}
              </ul>
            );
          case "ol":
            return (
              <ol key={key} className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-green-700">
                {block.items.map((item, i) => <li key={`${key}-${i}`}>{inline(item, `${key}-${i}`)}</li>)}
              </ol>
            );
          default:
            return <p key={key}>{inline(block.text, key)}</p>;
        }
      })}
    </div>
  );
}

/** Plain text version (for JSON-LD, meta descriptions, llms.txt). */
export function stripMarkdown(source: string) {
  return (source || "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

