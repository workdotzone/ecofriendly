import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Location from "@/models/Location";

export async function GET() {
  try {
    await dbConnect();
    // Sirf active locations fetch karega
    const locations = await Location.find({ isActive: true }).sort({ name: 1 });
    return NextResponse.json({ success: true, locations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}