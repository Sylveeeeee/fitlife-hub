import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // ตรวจสอบให้แน่ใจว่า Prisma Client ถูกตั้งค่าแล้ว

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const whereCondition = categoryId ? { categoryId: Number(categoryId) } : {};

    const biometricMetrics = await prisma.biometricMetric.findMany({
      where: whereCondition,
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ data: biometricMetrics }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching biometric metrics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
