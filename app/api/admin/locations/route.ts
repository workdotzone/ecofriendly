import { refreshPublicContent } from "@/lib/revalidate";
import { TAGS } from "@/lib/data";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Location from "@/models/Location";
import { requireAdmin } from "@/lib/adminAuth";

// 🟢 GET ALL LOCATIONS (Admin Panel me show karne ke liye)
export async function GET(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const locations = await Location.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, locations });
  } catch (error) {
    console.error("Admin locations fetch error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// 🟢 POST NEW LOCATION (Admin form save karne ke liye)
export async function POST(req: Request) {
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const body = await req.json();

    // 🚀 Fallback slug logic just in case
    const safeSlug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newLocation = await Location.create({
      name: body.name,
      slug: safeSlug,
      heading: body.heading,
      shortDescription: body.shortDescription,
      detailedContent: body.detailedContent,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      isActive: true
    });

    refreshPublicContent(TAGS.locations);
    return NextResponse.json({ success: true, location: newLocation }, { status: 201 });
  } catch (error) {
    console.error("Location POST Error:", error);
    
    // Handle Duplicate Entry Error (MongoDB code 11000)
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "This Location name or URL slug already exists!" }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Failed to save location data to database." }, 
      { status: 500 }
    );
  }
}

// 🔴 DELETE LOCATION
export async function DELETE(req: Request) {
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

    await Location.findByIdAndDelete(id);
    refreshPublicContent(TAGS.locations);
    return NextResponse.json({ success: true, message: "Location deleted successfully" });
  } catch (error) {
    console.error("Admin location delete error:", error);
    return NextResponse.json({ success: false, message: "Error deleting location" }, { status: 500 });
  }
}