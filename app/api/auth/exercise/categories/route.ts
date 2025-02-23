import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ ตรวจสอบ path ของ Prisma

// ✅ ดึงข้อมูลประเภทการออกกำลังกาย (Exercise Categories)
export async function GET() {
  try {
    const categories = await prisma.exerciseCategory.findMany({
      include: { subCategories: true }, // ✅ ดึงหมวดหมู่ย่อยมาด้วย
    });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching exercise categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
