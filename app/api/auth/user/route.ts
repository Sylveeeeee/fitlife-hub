import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { users_activity_level, users_diet_goal } from "@prisma/client"; // ✅ นำเข้า Prisma Enum

// ✅ ฟังก์ชันแปลงค่า Activity Level
const normalizeActivityLevel = (value: string | null | undefined): users_activity_level | undefined => {
  if (!value) return undefined;
  switch (value.toLowerCase().replace(/\s+/g, "_")) {
    case "sedentary": return users_activity_level.sedentary;
    case "light": return users_activity_level.light;
    case "moderate": return users_activity_level.moderate;
    case "active": return users_activity_level.active;
    case "veryactive": return users_activity_level.veryActive; // ✅ ตรงกับ Prisma Enum
    default: return users_activity_level.sedentary; // ค่าเริ่มต้น
  }
};

// ✅ ฟังก์ชันแปลงค่า Diet Goal
const normalizeDietGoal = (value: string | null | undefined): users_diet_goal | undefined => {
  if (!value) return undefined;
  switch (value.toLowerCase().replace(/\s+/g, "_")) {
    case "lose_weight": return users_diet_goal.lose_weight;
    case "maintain_weight": return users_diet_goal.maintain_weight;
    case "gain_weight": return users_diet_goal.gain_weight; // ✅ เปลี่ยนจาก gain_muscle เป็น gain_weight
    default: return users_diet_goal.maintain_weight; // ค่าเริ่มต้น
  }
};

const getTokenFromCookies = (cookies: string | null): string | undefined => {
  if (!cookies) return undefined;
  const token = cookies
    .split(';')
    .find(cookie => cookie.trim().startsWith('token='))
    ?.split('=')[1];
  return token;
};

export async function GET(req: Request) {
  const cookies = req.headers.get('cookie');
  const token = getTokenFromCookies(cookies);

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };
    const userId = decoded.userId;

    const user = await prisma.users.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        email: true,
        username: true,
        age: true,
        sex: true,
        height: true,
        activity_level: true,
        diet_goal: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // ✅ ดึงน้ำหนักล่าสุดจาก BiometricEntry
    const latestWeightEntry = await prisma.biometricEntry.findFirst({
      where: { userId: Number(userId), metric: { name: "Weight" } },
      orderBy: {  createdAt: "desc" }, // ดึงค่าล่าสุด
      select: { value: true, unit: true, recordedAt: true },
    });

    return NextResponse.json({
      ...user,
      weight: latestWeightEntry?.value || null, // ถ้าไม่มีค่า ให้เป็น null
      weightUnit: latestWeightEntry?.unit || "kg",
      weightRecordedAt: latestWeightEntry?.recordedAt || null,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  const cookies = req.headers.get("cookie");
  const token = getTokenFromCookies(cookies);

  if (!token) {
    return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };

    if (!decoded || !decoded.userId) {
      throw new Error("Invalid token payload");
    }

    const userId = Number(decoded.userId);
    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }

    let body;
    try {
      body = await req.json();
      if (!body || typeof body !== "object") {
        throw new Error("Invalid request body");
      }
    } catch (error) {
      console.error("Invalid JSON payload:", error);
      return NextResponse.json({ message: "Invalid request payload" }, { status: 400 });
    }

    console.log("Received body:", body);

    const { username, age, sex, weight, height, birthday, activity_level, diet_goal } = body;

    // ✅ ใช้ฟังก์ชันแปลงค่าให้ตรงกับ Prisma Enum
    const normalizedActivityLevel = normalizeActivityLevel(activity_level);
    const normalizedDietGoal = normalizeDietGoal(diet_goal);

    // ✅ อัปเดตข้อมูลผู้ใช้
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        username: username || undefined,
        age: age !== null && age !== undefined ? Number(age) : undefined,
        sex: sex || undefined,
        weight: weight !== null && weight !== undefined ? Number(weight) : undefined,
        height: height !== null && height !== undefined ? Number(height) : undefined,
        birthday: birthday ? new Date(birthday) : undefined,
        activity_level: normalizedActivityLevel, // ✅ ใช้ Enum แทน String
        diet_goal: normalizedDietGoal, // ✅ ใช้ Enum แทน String
        updated_at: new Date(),
      },
    });

    console.log("Updated user:", updatedUser);

    // ✅ ตรวจสอบว่า `updatedUser` ไม่ใช่ `null`
    if (!updatedUser) {
      throw new Error("Failed to update user. No record updated.");
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        ...updatedUser,
        roleId: updatedUser.roleId ? Number(updatedUser.roleId) : null, // ✅ ป้องกัน `BigInt` error
      },
    });
  } catch (err) {
    console.error("Error updating user:", err);

    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error updating user", error: errorMessage }, { status: 500 });
  }
}





