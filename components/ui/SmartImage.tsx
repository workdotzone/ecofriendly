"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";
import { useState } from "react";

/**
 * Responsive image for every source the site uses:
 *  - /public files            → Next.js optimizer (AVIF/WebP, srcset per device)
 *  - ImageKit URLs            → ImageKit's own CDN transforms (w, q, f-auto) — no double optimisation
 *  - any other remote URL     → served as-is (unoptimized) so an unknown host never breaks the page
 *  - empty/broken src         → neutral placeholder, never a broken-image icon (CLS-safe)
 * Always pass `sizes` for fill/responsive images so phones don't download desktop-sized files.
 */

const IMAGEKIT_HOSTS = new Set(
  ["ik.imagekit.io", safeHost(process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT)].filter(Boolean) as string[],
);

function safeHost(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function imageKitLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  // Drop any existing width transform so ours wins; keep other params.
  url.searchParams.delete("tr");
  url.searchParams.set("tr", `w-${width},q-${quality || 75},f-auto`);
  return url.toString();
}

type SmartImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

export default function SmartImage({ src, fallbackSrc = "/og/placeholder.webp", alt, ...props }: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const clean = typeof src === "string" ? src.trim() : "";
  const finalSrc = !clean || failed ? fallbackSrc : clean;

  const isRemote = /^https?:\/\//i.test(finalSrc);
  const isImageKit = isRemote && IMAGEKIT_HOSTS.has(safeHost(finalSrc));
  const isSvg = /\.svg(\?|$)/i.test(finalSrc);

  return (
    <Image
      {...props}
      src={finalSrc}
      alt={alt}
      loader={isImageKit ? imageKitLoader : undefined}
      unoptimized={isSvg || (isRemote && !isImageKit)}
      onError={() => {
        if (!failed && finalSrc !== fallbackSrc) setFailed(true);
      }}
    />
  );
}
