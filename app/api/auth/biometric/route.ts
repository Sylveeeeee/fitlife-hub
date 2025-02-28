import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

// ✅ GET: ดึงข้อมูล Biometric ตามช่วงวันที่
export async function GET(req: Request) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  try {
    let biometricEntries;

    // ถ้าไม่ได้ส่ง startDate หรือ endDate (กรณี "All Time")
    if (!startDate || !endDate || startDate === "all") {
      biometricEntries = await prisma.biometricEntry.findMany({
        where: { userId: user.userId },
        include: { metric: true, category: true },
        orderBy: { recordedAt: "asc" },  // เรียงลำดับตาม recordedAt
      });
    } else {
      // แปลงวันที่เป็น string ในรูปแบบ YYYY-MM-DD
      const startDateStr = new Date(startDate).toLocaleDateString("en-CA");
      const endDateStr = new Date(endDate).toLocaleDateString("en-CA");

      biometricEntries = await prisma.biometricEntry.findMany({
        where: {
          userId: user.userId,
          recordedAt: {
            gte: startDateStr,  // ใช้ startDateStr
            lte: endDateStr,    // ใช้ endDateStr
          },
        },
        include: { metric: true, category: true },
        orderBy: { recordedAt: "asc" },  // เรียงลำดับตาม recordedAt
      });
    }

    return NextResponse.json({ data: biometricEntries }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching biometric entries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}




