import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/lib/site";

const url = absoluteUrl("/service-locations");

export const metadata: Metadata = {
  title: {
    absolute: `Pest Control Service Locations in Mumbai | ${SITE.name}`,
  },
  description:
    "Find professional eco-friendly pest control near you across Mumbai, Thane and Navi Mumbai.",
  alternates: {
    canonical: url,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Pest Control Service Locations",
    description:
      "Explore Eco-Friendly Pests service areas across Mumbai and nearby regions.",
    url,
    siteName: SITE.name,
    images: [
      {
        url: SITE.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `Pest Control Service Locations in Mumbai | ${SITE.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pest Control Service Locations",
    description:
      "Explore Eco-Friendly Pests service areas across Mumbai and nearby regions.",
    images: [SITE.defaultOgImage],
  },
};

export default function ServiceLocationsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}