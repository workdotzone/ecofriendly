import { allSitemapUrls, renderUrlset, xmlResponse } from "@/lib/sitemap";

/**
 * https://ecofriendlypests.com/sitemap.xml — every canonical Next.js page, using extensionless URLs.
 */
export async function GET() {
  return xmlResponse(renderUrlset(await allSitemapUrls()));
}
