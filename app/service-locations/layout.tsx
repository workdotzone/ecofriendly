import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Pest Control Service Locations in Mumbai | Eco-Friendly Pests",
  },
  description: "Find professional eco-friendly pest control near you across Mumbai, Thane and Navi Mumbai.",
  alternates: {
    canonical: absoluteUrl("/service-locations"),
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Pest Control Service Locations",
    description: "Explore Eco-Friendly Pests service areas across Mumbai and nearby regions.",
    url: absoluteUrl("/service-locations"),
    siteName: "Eco-Friendly Pests",
  },
};

export default function ServiceLocationsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
