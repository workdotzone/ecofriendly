import { refreshPublicContent } from "@/lib/revalidate";
import { TAGS } from "@/lib/data";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Client from "@/models/Client";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const body = await request.json();
    await Client.create(body);
    refreshPublicContent(TAGS.clients);
    return NextResponse.json({ success: true, message: "Client Logo Added!" }, { status: 201 });
  } catch (error) {
    console.error("Admin client logo create error:", error);
    return NextResponse.json({ success: false, message: "Failed to add client logo." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Client.findByIdAndDelete(id);
    refreshPublicContent(TAGS.clients);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin client logo delete error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}