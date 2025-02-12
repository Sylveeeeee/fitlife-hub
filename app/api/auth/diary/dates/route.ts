import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/authService";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const diaryDates = await prisma.foodDiary.findMany({
      where: { userId },
      select: { date: true },
      distinct: ["date"], // ✅ เอาวันที่ที่ไม่ซ้ำกัน
    });

    const formattedDates = diaryDates.map((entry) => entry.date);

    return NextResponse.json(formattedDates, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching diary dates:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
