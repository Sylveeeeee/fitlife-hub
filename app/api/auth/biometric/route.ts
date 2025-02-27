import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// ✅ ตรวจสอบสิทธิ์ผู้ใช้
async function verifyUser(req: Request) {
  const cookies = req.headers.get("cookie");
  if (!cookies) return null;

  const token = cookies.split(";").find((cookie) => cookie.trim().startsWith("token="))?.split("=")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };
    return { userId: Number(decoded.userId) };
  } catch (err) {
    console.error("JWT Error:", err);
    return null;
  }
}

// ✅ GET: ดึงข้อมูล Biometric ตามวันที่
export async function GET(req: Request) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const date = url.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  try {
    const biometricEntries = await prisma.biometricEntry.findMany({
      where: { userId: user.userId, recordedAt: date },
      include: { metric: true, category: true },
      orderBy: { recordedAt: "asc" },
    });

    const formattedData = biometricEntries.map((entry) => ({
      label: entry.metric.name,
      value: entry.value,
      category: entry.category.name,
      recordedAt: entry.recordedAt,
    }));

    return NextResponse.json({ data: formattedData }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching biometric entries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ POST: เพิ่มข้อมูล Biometric
export async function POST(req: Request) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { weight, bodyFat, muscleMass, bmi, bmr, tdee, hydration } = await req.json();
  if (!weight && !bodyFat && !muscleMass && !bmi) {
    return NextResponse.json({ error: "At least one biometric value is required" }, { status: 400 });
  }

  const newBiometric = await prisma.biometric.create({
    data: { userId: user.userId, weight, bodyFat, muscleMass, bmi, bmr, tdee, hydration },
  });

  return NextResponse.json(newBiometric, { status: 201 });
}
