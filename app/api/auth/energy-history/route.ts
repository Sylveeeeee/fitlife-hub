import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// ✅ ฟังก์ชันตรวจสอบสิทธิ์
async function verifyUser(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const token = cookieHeader.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };
    return { userId: Number(decoded.userId) };
  } catch (err) {
    console.error("JWT Error:", err);
    return null;
  }
}

// ✅ GET: ดึงข้อมูล Energy History (kcal) ตามช่วงวันที่
export async function GET(req: Request) {
    const user = await verifyUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
  
    try {
      let foodDiaryEntries;
  
      // ถ้าไม่ได้ส่ง startDate หรือ endDate (กรณี "All Time")
      if (!startDate || !endDate || startDate === "all") {
        foodDiaryEntries = await prisma.foodDiary.findMany({
          where: { userId: user.userId },
          include: { food: true },
          orderBy: { date: "asc" },
        });
      } else {
        // แปลงวันที่เป็น string ในรูปแบบ YYYY-MM-DD
        const startDateStr = new Date(startDate).toLocaleDateString("en-CA");
        const endDateStr = new Date(endDate).toLocaleDateString("en-CA");
  
        foodDiaryEntries = await prisma.foodDiary.findMany({
          where: {
            userId: user.userId,
            date: {
              gte: startDateStr,
              lte: endDateStr,
            },
          },
          include: { food: true },
          orderBy: { date: "asc" },
        });
      }
  
      // คำนวณพลังงานรวม (calories) สำหรับแต่ละวัน
      const energyHistory = foodDiaryEntries.reduce((acc, entry) => {
        const date = entry.date;
        const calories = parseFloat(entry.calories.toString()) * parseFloat(entry.quantity.toString());
  
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += calories;
  
        return acc;
      }, {} as Record<string, number>);
  
      // แปลงข้อมูลให้เหมาะสมสำหรับการแสดงผล
      const labels = Object.keys(energyHistory);
      const values = Object.values(energyHistory);
  
      return NextResponse.json({ data: { labels, values } }, { status: 200 });
    } catch (error) {
      console.error("❌ Error fetching food diary entries:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  
  