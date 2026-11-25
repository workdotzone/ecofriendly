import { allSitemapUrls, renderUrlset, xmlResponse } from "@/lib/sitemap";

/**
 * Every canonical Next.js page, using extensionless URLs.
 */
export async function GET() {
  return xmlResponse(renderUrlset(await allSitemapUrls()));
}
