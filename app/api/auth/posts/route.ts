import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// ฟังก์ชัน GET: ดึงข้อมูลโพสต์ทั้งหมด
export async function GET() {
  try {
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Database error while fetching posts" }, { status: 500 });
  }
}

// ฟังก์ชัน POST: เพิ่มโพสต์ใหม่
export async function POST(req: NextRequest) {
  const { content } = await req.json();

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  try {
    const newPost = await db.post.create({
      data: {
        content,
        createdAt: new Date(),
      },
    });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Database error while creating post" }, { status: 500 });
  }
}

// ฟังก์ชัน DELETE: ลบโพสต์
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    await db.post.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Database error while deleting post" }, { status: 500 });
  }
}
