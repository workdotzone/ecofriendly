import { refreshPublicContent } from "@/lib/revalidate";
import { TAGS } from "@/lib/data";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const body = await request.json();
    
    // Database me save karna
    await Testimonial.create(body);
    
    refreshPublicContent(TAGS.testimonials);
    return NextResponse.json({ success: true, message: "Review Added Successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Testimonial Add Error:", error);
    return NextResponse.json({ success: false, message: "Failed to add testimonial." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Testimonial.findByIdAndDelete(id);
    refreshPublicContent(TAGS.testimonials);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin testimonial delete error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}