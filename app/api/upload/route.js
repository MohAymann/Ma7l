import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudinaryData = new FormData();
    cloudinaryData.append("file", file);
    cloudinaryData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: cloudinaryData,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      console.log("Cloudinary error:", data);
      return NextResponse.json(
        { error: data?.error?.message || "Cloudinary upload failed" },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json({ url: data.secure_url }, { status: 200 });
  } catch (error) {
    console.log("Upload route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
