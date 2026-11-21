import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Menu from "@/models/Menu";

export async function GET() {
  try {
    await dbConnect();
    const menuItems = await Menu.find().sort({ createdAt: 1 }); // Purane pehle dikhenge
    return NextResponse.json({ success: true, menuItems }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}