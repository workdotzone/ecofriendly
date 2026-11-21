import { refreshPublicContent } from "@/lib/revalidate";
import { TAGS } from "@/lib/data";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Menu from "@/models/Menu";
import { requireAdmin } from "@/lib/adminAuth";

// Naya Menu Item add karna
export async function POST(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const body = await request.json();
    await Menu.create(body);
    refreshPublicContent(TAGS.menu);
    return NextResponse.json({ success: true, message: "Menu Item Added" }, { status: 201 });
  } catch (error) {
    console.error("Admin menu create error:", error);
    return NextResponse.json({ success: false, message: "Error adding menu item" }, { status: 500 });
  }
}

// Menu Item delete karna
export async function DELETE(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Menu.findByIdAndDelete(id);
    refreshPublicContent(TAGS.menu);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin menu delete error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}