import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST: เพิ่มแก้วน้ำใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ตรวจสอบว่ามี `userId` และ `count` หรือไม่
    if (!body.userId || !body.count) {
      return NextResponse.json({ error: "userId and count are required" }, { status: 400 });
    }

    // บันทึกข้อมูลในฐานข้อมูล
    const glass = await prisma.glass.create({
      data: {
        userId: body.userId,
        count: body.count,
      },
    });

    return NextResponse.json(glass, { status: 201 }); // ตอบกลับข้อมูลที่ถูกสร้าง
  } catch (error) {
    console.error("Error creating glass entry:", error);
    return NextResponse.json({ error: "Failed to create glass entry" }, { status: 500 });
  }
}

// DELETE: ลบแก้วน้ำ
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    // รีเซ็ตแก้วน้ำทั้งหมด
    if (body.reset) {
      await prisma.glass.deleteMany();
      return NextResponse.json({ message: "All glasses reset" }, { status: 204 });
    }

    // ลบแก้วน้ำตาม `id`
    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.glass.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ message: "Glass deleted" }, { status: 204 });
  } catch (error) {
    console.error("Error deleting glass entry:", error);
    return NextResponse.json({ error: "Failed to delete glass entry" }, { status: 500 });
  }
}

// GET: ดึงข้อมูลแก้วน้ำทั้งหมด
export async function GET() {
  try {
    const glasses = await prisma.glass.findMany(); // ดึงข้อมูลจากตาราง glass
    return NextResponse.json(glasses, { status: 200 }); // ส่งข้อมูลกลับไป
  } catch (error) {
    console.error("Error fetching glasses:", error);
    return NextResponse.json({ error: "Failed to fetch glasses" }, { status: 500 });
  }
}
