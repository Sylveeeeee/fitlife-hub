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

// ✅ GET: ดึงข้อมูล Exercise ทั้งหมดของผู้ใช้
export async function GET(req: Request) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const exercises = await prisma.exercise.findMany({ where: { userId: user.userId } });
  return NextResponse.json(exercises);
}

// ✅ POST: เพิ่มข้อมูลการออกกำลังกาย
export async function POST(req: Request) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, duration, caloriesBurned, intensity, heartRate, distance, steps } = await req.json();
  if (!name || !duration || !caloriesBurned || !intensity) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const newExercise = await prisma.exercise.create({
    data: { userId: user.userId, name, duration, caloriesBurned, intensity, heartRate, distance, steps },
  });

  return NextResponse.json(newExercise, { status: 201 });
}

// ✅ PUT: อัปเดตข้อมูล Exercise
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const exerciseId = Number(params.id);
  if (isNaN(exerciseId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const body = await req.json();
  const { name, duration, caloriesBurned, intensity, heartRate, distance, steps } = body;

  const updatedExercise = await prisma.exercise.update({
    where: { id: exerciseId, userId: user.userId },
    data: { name, duration, caloriesBurned, intensity, heartRate, distance, steps },
  });

  return NextResponse.json(updatedExercise);
}

// ✅ DELETE: ลบข้อมูล Exercise
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const exerciseId = Number(params.id);
  if (isNaN(exerciseId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  await prisma.exercise.delete({ where: { id: exerciseId, userId: user.userId } });

  return NextResponse.json({ message: "Exercise deleted successfully" }, { status: 204 });
}
