import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

const SITE_NAME = "Eco-Friendly Pests";
const PAGE_URL = `${SITE_URL}/service-locations`;
const PAGE_TITLE = `Pest Control Service Locations in Mumbai | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Explore 100% safe, odourless, and herbal pest control service locations across Mumbai, Thane, and Navi Mumbai. Book same-day termite, cockroach & bed bug treatment near you.";

export const metadata: Metadata = {
  title: {
    absolute: PAGE_TITLE,
  },
  description: PAGE_DESCRIPTION,
  keywords: [
    "pest control service locations Mumbai",
    "pest control near me Mumbai",
    "eco friendly pest control Thane",
    "herbal pest control Navi Mumbai",
    "same day pest control Mumbai",
    "odourless pest control services",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: PAGE_URL,
    siteName: SITE_NAME,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/banner.png`,
        width: 1200,
        height: 630,
        alt: "Eco-Friendly Pests Service Locations across Mumbai, Thane and Navi Mumbai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [`${SITE_URL}/banner.png`],
  },
};

export default function ServiceLocationsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}