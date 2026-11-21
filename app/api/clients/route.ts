import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Client from "@/models/Client";

export async function GET() {
  try {
    await dbConnect();
    const clients = await Client.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, clients }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}