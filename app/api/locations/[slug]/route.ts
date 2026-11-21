import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Location from "@/models/Location";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();
    
    // 🚀 Next.js 15 Fix: Await params
    const resolvedParams = await params;
    
    const location = await Location.findOne({ slug: resolvedParams.slug, isActive: true });
    
    if (!location) {
      return NextResponse.json({ success: false, message: "Location not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, location });
  } catch (error) {
    console.error("Location API error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}