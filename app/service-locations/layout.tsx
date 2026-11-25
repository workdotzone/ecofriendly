import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: `Pest Control Service Locations in Mumbai | ${SITE.name}`,
  },
  description:
    "Find professional eco-friendly pest control near you across Mumbai, Thane and Navi Mumbai.",
  alternates: {
    canonical: "https://ecofriendlypests.com/service-locations",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Pest Control Service Locations",
    description: "Explore Eco-Friendly Pests service areas across Mumbai and nearby regions.",
    url: "https://ecofriendlypests.com/service-locations",
    siteName: "Eco-Friendly Pests",
  },
};

export default function ServiceLocationsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}