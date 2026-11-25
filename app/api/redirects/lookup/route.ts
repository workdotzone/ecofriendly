import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Redirect from "@/models/Redirect";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path")?.trim().toLowerCase();
    if (!path) return NextResponse.json(null);

    await dbConnect();
    const rule = await Redirect.findOneAndUpdate(
      { source: path, isActive: true },
      { $inc: { hits: 1 } },
      { returnDocument: "after" }
    ).lean();

    if (!rule) return NextResponse.json(null);

    return NextResponse.json({
      destination: rule.destination,
      permanent: rule.permanent,
    });
  } catch {
    return NextResponse.json(null);
  }
}