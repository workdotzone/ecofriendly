import { NextResponse } from "next/server";
import { getServices } from "@/lib/data";

/** Public, cached list of active services (same data the website renders). */
export async function GET() {
  const services = await getServices();
  return NextResponse.json({
    success: true,
    services: services.map((s) => ({
      _id: s.id,
      title: s.title,
      slug: s.slug,
      shortDescription: s.shortDescription,
      image: s.image,
      imageAlt: s.imageAlt,
      url: `/services/${s.slug}`,
    })),
  });
}
