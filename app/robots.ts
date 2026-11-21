import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PRIVATE = ["/admin", "/admin/", "/api/"];

/**
 * Search engines and AI answer engines (GEO/AEO) are explicitly allowed so the business can be
 * cited in Google AI Overviews, ChatGPT search, Perplexity, Claude, Copilot and Gemini answers.
 * Private areas stay blocked for everyone.
 */
export default function robots(): MetadataRoute.Robots {
  const aiAndAnswerBots = [
    "Googlebot", "Bingbot", "Google-Extended", "GPTBot", "OAI-SearchBot", "ChatGPT-User",
    "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User",
    "Applebot", "Applebot-Extended", "DuckDuckBot", "CCBot", "Amazonbot", "meta-externalagent",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      ...aiAndAnswerBots.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
