import { NextResponse } from "next/server";
import { getReviews } from "@/lib/data";

/** Public, cached list of published reviews (plus rating summary). */
export async function GET() {
  const { reviews, stats } = await getReviews();
  return NextResponse.json({
    success: true,
    stats,
    testimonials: reviews.map((r) => ({ _id: r.id, name: r.name, designation: r.designation, service: r.service, rating: r.rating, text: r.text, createdAt: r.createdAt })),
  });
}
