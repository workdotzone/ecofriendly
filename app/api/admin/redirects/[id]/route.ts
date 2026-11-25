import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Redirect from "@/models/Redirect";
import { requireAdmin } from "@/lib/adminAuth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const updated = await Redirect.findByIdAndUpdate(id, body, { returnDocument: "after" });
    if (!updated) {
      return NextResponse.json({ error: "Redirect not found" }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/admin/redirects/[id] error:", error);
    return NextResponse.json({ error: "Failed to update redirect" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const { id } = await params;
    await Redirect.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/admin/redirects/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete redirect" }, { status: 500 });
  }
}