import { revalidateTag } from "next/cache";
import { TAGS } from "@/lib/data";

type Tag = (typeof TAGS)[keyof typeof TAGS];

/**
 * Call after any admin change so the public site (pages, sitemaps, llms.txt) shows it on the next visit.
 * `{ expire: 0 }` = no stale content after an admin edit; the next request re-reads the database.
 */
export function refreshPublicContent(...tags: Tag[]) {
  for (const tag of new Set(tags)) {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch (error) {
      console.error(`revalidateTag(${tag}) failed:`, error);
    }
  }
}
