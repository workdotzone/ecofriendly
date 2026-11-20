import { refreshPublicContent } from "@/lib/revalidate";
import { TAGS } from "@/lib/data";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, blogs }, { status: 200 });
  } catch (error) {
    console.error("Admin blog fetch error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const body = await request.json();
    await Blog.create(body);
    refreshPublicContent(TAGS.blogs);
    return NextResponse.json({ success: true, message: "Blog Published!" }, { status: 201 });
  } catch (error) {
    console.error("Admin blog publish error:", error);
    return NextResponse.json({ success: false, message: "Failed to publish blog." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Blog.findByIdAndDelete(id);
    refreshPublicContent(TAGS.blogs);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin blog delete error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}