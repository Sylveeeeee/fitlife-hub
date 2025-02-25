import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import jwt from "jsonwebtoken";

// ✅ ฟังก์ชันตรวจสอบสิทธิ์ผู้ใช้
async function verifyUser(req: Request) {
  const cookies = req.headers.get("cookie");
  if (!cookies) return null;

  const token = cookies
    .split(";")
    .find((cookie) => cookie.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };
    return { userId: Number(decoded.userId) };
  } catch (err) {
    console.error("JWT Error:", err);
    return null;
  }
}

// ✅ GET: ดึงค่าชีวภาพที่ผู้ใช้บันทึกลงใน Diary ตามวันที่
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
      where: {
        userId: user.userId,
        recordedAt: {
          gte: new Date(date + "T00:00:00.000Z"),
          lt: new Date(date + "T23:59:59.999Z"),
        },
      },
      include: {
        metric: true, // ✅ รวมข้อมูล Metric เช่น Weight, Body Fat
        category: true, // ✅ รวมข้อมูล Category
      },
      orderBy: {
        recordedAt: "asc",
      },
    });

    return NextResponse.json({ data: biometricEntries }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching biometric entries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ POST: เพิ่มค่าชีวภาพใหม่ลงใน Diary
export async function POST(req: Request) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // ✅ รับค่าจาก request body
    const requestBody = await req.json();
    console.log("📥 Received Data:", requestBody);

    const { categoryId, metricId, value, unit, date } = requestBody;

    // ✅ ตรวจสอบค่าที่จำเป็น
    if (!categoryId || !metricId || value === undefined || !unit || !date) {
      console.error("🚨 Missing required fields:", { categoryId, metricId, value, unit, date });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ ตรวจสอบว่า categoryId มีอยู่ในฐานข้อมูลหรือไม่
    const categoryExists = await prisma.biometricCategory.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      console.error("🚨 Invalid categoryId:", categoryId);
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    // ✅ ตรวจสอบว่า metricId มีอยู่ในฐานข้อมูลหรือไม่
    const metricExists = await prisma.biometricMetric.findUnique({
      where: { id: metricId },
    });

    if (!metricExists) {
      console.error("🚨 Invalid metricId:", metricId);
      return NextResponse.json({ error: "Invalid metric ID" }, { status: 400 });
    }

    console.log("📅 Date received:", date);

    // ✅ บันทึกข้อมูลลงในฐานข้อมูล
    const newEntry = await prisma.biometricEntry.create({
      data: {
        userId: user.userId,
        categoryId,
        metricId,
        value: parseFloat(value),
        unit,
        recordedAt: new Date(date).toISOString().split("T")[0],
      },
    });

    console.log("✅ Successfully added biometric entry:", newEntry);
    return NextResponse.json(newEntry, { status: 201 });

  } catch (error) {
    console.error("❌ Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ PUT: อัปเดตค่าชีวภาพที่บันทึก
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entryId = Number(params.id);
  if (isNaN(entryId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const { categoryId, value, unit, date } = await req.json();

  if (value === undefined) {
    return NextResponse.json({ error: "Value is required" }, { status: 400 });
  }

  try {
    const updatedEntry = await prisma.biometricEntry.update({
      where: { id: entryId, userId: user.userId },
      data: {
        categoryId, // ✅ เพิ่ม categoryId ให้สามารถอัปเดตได้
        value: parseFloat(value),
        unit,
        recordedAt: new Date(date),
      },
    });

    return NextResponse.json(updatedEntry, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating biometric entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ DELETE: ลบค่าชีวภาพที่บันทึก
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entryId = Number(params.id);
  if (isNaN(entryId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    await prisma.biometricEntry.delete({
      where: { id: entryId, userId: user.userId },
    });

    return NextResponse.json({ message: "Biometric entry deleted successfully" }, { status: 204 });
  } catch (error) {
    console.error("❌ Error deleting biometric entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
