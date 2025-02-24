import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

// ✅ GET: ดึงข้อมูล Exercise ที่บันทึกลง Diary ตามวันที่ของผู้ใช้
export async function GET(req: Request) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const date = url.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  const diaryEntries = await prisma.userExerciseDiary.findMany({
    where: {
      userId: user.userId,
      date,
    },
    include: {
      exercise: true, // ✅ ดึงข้อมูล Exercise ที่เกี่ยวข้อง
      intensity: true, // ✅ ดึงระดับความเข้มข้นของการออกกำลังกาย
    },
  });

  return NextResponse.json({ data: diaryEntries });
}

// ✅ POST: บันทึกข้อมูลการออกกำลังกายของผู้ใช้ลง Diary
export async function POST(req: Request) {
  const user = await verifyUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ✅ ดึงข้อมูลจาก request
    const requestBody = await req.json();
    console.log("📥 Received Data in API:", requestBody);

    const { exerciseId, intensityId, duration, caloriesBurned, date } = requestBody;

    // ✅ ตรวจสอบค่าที่จำเป็น
    if (!exerciseId || !duration || caloriesBurned == null || !date) {
      console.error("🚨 Missing required fields:", { exerciseId, duration, caloriesBurned, date });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ ดึงน้ำหนักของผู้ใช้
    const userProfile = await prisma.users.findUnique({
      where: { id: user.userId },
      select: { weight: true },
    });

    const userWeight = userProfile?.weight || 70; // ค่า default 70 kg หากไม่มีข้อมูล

    // ✅ ตรวจสอบว่า exerciseId มีอยู่ในฐานข้อมูลหรือไม่
    const exerciseExists = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exerciseExists) {
      console.error("🚨 Invalid exerciseId:", exerciseId);
      return NextResponse.json({ error: "Invalid exercise ID" }, { status: 400 });
    }

    // ✅ ตรวจสอบว่า intensityId มีอยู่ในฐานข้อมูลหรือไม่ (ถ้ามีค่า)
    if (intensityId) {
      const intensityExists = await prisma.exerciseIntensity.findUnique({
        where: { id: intensityId },
      });

      if (!intensityExists) {
        console.error("🚨 Invalid intensityId:", intensityId);
        return NextResponse.json({ error: "Invalid intensity ID" }, { status: 400 });
      }
    }
    console.log("📅 Date received:", date);

    // ✅ บันทึกข้อมูลลงในฐานข้อมูล
    const newEntry = await prisma.userExerciseDiary.create({
      data: {
        userId: user.userId,
        exerciseId,
        intensityId,
        duration,
        caloriesBurned,
        weight: userWeight,
        date,
      },
    });

    console.log("✅ Successfully added exercise:", newEntry);
    return NextResponse.json(newEntry, { status: 201 });

  } catch (error) {
    console.error("❌ Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ PUT: อัปเดตข้อมูล Exercise ที่บันทึกใน Diary
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const diaryEntryId = Number(params.id);
  if (isNaN(diaryEntryId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const { duration, caloriesBurned, intensityId, weight, date } = await req.json();

  if (!weight) {
    return NextResponse.json({ error: "Weight is required" }, { status: 400 });
  }

  const updatedEntry = await prisma.userExerciseDiary.update({
    where: { id: diaryEntryId, userId: user.userId },
    data: {
      duration,
      caloriesBurned,
      intensityId,
      weight,  // ✅ เพิ่ม weight
      date,
    },
  });

  return NextResponse.json(updatedEntry);
}

// ✅ DELETE: ลบข้อมูล Exercise ที่บันทึกลง Diary
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const diaryEntryId = Number(params.id);
  if (isNaN(diaryEntryId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  await prisma.userExerciseDiary.delete({
    where: { id: diaryEntryId, userId: user.userId },
  });

  return NextResponse.json({ message: "Exercise entry deleted successfully" }, { status: 204 });
}
