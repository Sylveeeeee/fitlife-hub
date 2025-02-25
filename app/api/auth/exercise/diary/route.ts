import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// ✅ ตรวจสอบสิทธิ์ผู้ใช้
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
    console.error("❌ JWT Error:", err);
    return null;
  }
}

// ✅ POST: เพิ่มข้อมูล Exercise ลงในไดอารี่
export async function POST(req: Request) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { exerciseId, duration, caloriesBurned, date } = await req.json();

  if (!exerciseId || !duration || !caloriesBurned || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const newEntry = await prisma.userExerciseDiary.create({
      data: {
        userId: user.userId,
        exerciseId,
        duration,
        caloriesBurned,
        date,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding exercise:", error);
    return NextResponse.json({ error: "Failed to add exercise" }, { status: 500 });
  }
}
