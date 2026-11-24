import type { NextConfig } from "next";

const imageKitHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ? new URL(process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT).hostname : "";
  } catch {
    return "";
  }
})();

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [48, 96, 128, 176, 256, 320, 384],
    qualities: [60, 75, 85],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "ik.imagekit.io" },
      ...(imageKitHost && imageKitHost !== "ik.imagekit.io" ? [{ protocol: "https" as const, hostname: imageKitHost }] : []),
    ],
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Long-lived caching for static assets in /public (hashed _next assets are already immutable).
        source: "/:all*(webp|png|jpg|jpeg|svg|ico|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
