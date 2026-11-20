import { SERVICE_CONTENT } from "./services";

/**
 * alias slug → canonical service slug, e.g. "rat-control" → "rodent-control".
 * Used by proxy.ts to 308-redirect before the page streams (so search engines get a real redirect).
 * A core service saved in the admin under an alias slug is still published at the canonical slug
 * (lib/data.ts toPublicService), so these redirects can never loop.
 */
export const SERVICE_ALIASES: Record<string, string> = Object.fromEntries(
  SERVICE_CONTENT.flatMap((content) => (content.aliases ?? []).map((alias) => [alias, content.slug])),
);
