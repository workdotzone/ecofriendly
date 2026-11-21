import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { requireAdmin } from "@/lib/adminAuth";

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }
    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Choose an image smaller than 10 MB." }, { status: 413 });
    }
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      return NextResponse.json({ error: "Upload a JPEG, PNG, WebP, or AVIF image." }, { status: 415 });
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120) || "upload-image";

    // Upload to ImageKit
    const response = await imagekit.upload({
      file: buffer,
      fileName,
      folder: "/eco_friendly_pests/blogs", // ImageKit me is folder me save hoga
    });

    // Return the secure URL
    return NextResponse.json({ success: true, url: response.url }, { status: 200 });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}