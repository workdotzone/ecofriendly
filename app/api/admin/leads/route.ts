import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";
import { requireAdmin } from "@/lib/adminAuth";

// Saari leads fetch karne ke liye (Nayi wali sabse upar ayengi)
export async function GET(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const leads = await Lead.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, leads }, { status: 200 });
  } catch (error) {
    console.error("Admin leads fetch error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Lead ka status update karne ke liye (New -> Contacted)
export async function PATCH(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const { id, status } = await request.json();
    await Lead.findByIdAndUpdate(id, { status });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin lead status update error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Lead delete karne ke liye
export async function DELETE(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Lead.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin lead delete error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}