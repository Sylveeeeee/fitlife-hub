import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { serialize } from "cookie";
import { calculateTDEE, calculateMacroTargets, calculateBMI, estimateBodyFat } from "@/utils/calculations"; // ✅ เพิ่มฟังก์ชันคำนวณ

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// ✅ คำนวณอายุจากวันเกิด
const calculateAge = (birthday: string): number => {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (today.getMonth() < birthDate.getMonth() || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const userSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  birthday: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format (YYYY-MM-DD expected)" }),
  height: z.preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().positive().optional()),
  weight: z.preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().positive().optional()),
  sex: z.enum(["male", "female"], { invalid_type_error: "Invalid gender value" }),
  activity_level: z.enum(["sedentary", "light", "moderate", "active", "veryActive"]).default("sedentary"),
  diet_goal: z.enum(["lose_weight", "maintain_weight", "gain_weight"]).default("maintain_weight"),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, password, username, birthday, height, weight, sex, activity_level, diet_goal } = userSchema.parse(data);

    // ✅ คำนวณอายุ
    const age = calculateAge(birthday);

    // ✅ ตรวจสอบว่ามีผู้ใช้ที่ใช้ Email นี้แล้วหรือไม่
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse("Email already registered", { status: 400 });
    }

    // ✅ Hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ กำหนดค่าเริ่มต้น role = 'user'
    const DEFAULT_ROLE = "user";
    const role = await prisma.role.findUnique({ where: { name: DEFAULT_ROLE } });
    if (!role) {
      throw new Error("Role not found");
    }

    // ✅ คำนวณค่าต่างๆ ที่เกี่ยวกับสุขภาพ
    const formattedProfile = {
      weight: weight ?? 0,
      height: height ?? 0,
      age,
      sex,
      activityLevel: activity_level,
    };
    const tdee = calculateTDEE(formattedProfile);
    const { protein, carbs, fat } = calculateMacroTargets(tdee);
    const bmi = calculateBMI(weight ?? 0, height ?? 0);
    const bodyFat = estimateBodyFat(sex, bmi, age);

    // ✅ สร้างบัญชีผู้ใช้ใหม่
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        username,
        birthday: new Date(birthday),
        height,
        weight,
        sex,
        age,
        activity_level,
        diet_goal,
        roleId: role.id,
      },
    });

        // ✅ ค้นหา categoryId และ metricId ที่เกี่ยวข้องกับน้ำหนัก
    const weightCategory = await prisma.biometricCategory.findFirst({
      where: { name: "Body" },  // สมมติว่า category ของน้ำหนักชื่อ "Weight"
    });

    const weightMetric = await prisma.biometricMetric.findFirst({
      where: { name: "Weight" },  // สมมติว่า metric ของน้ำหนักคือ "kg"
    });

    if (!weightCategory || !weightMetric) {
      throw new Error("Biometric category or metric for weight not found");
    }

    // ✅ บันทึกค่า BiometricEntry สำหรับน้ำหนัก
    await prisma.biometricEntry.create({
      data: {
        userId: newUser.id,
        categoryId: weightCategory.id,
        metricId: weightMetric.id,
        value: weight ?? 0,
        unit: "kg",
        recordedAt: new Date().toISOString().slice(0, 10), // วันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
      },
    });

    // ✅ บันทึกค่า `Biometric` ครั้งแรกให้ผู้ใช้
    await prisma.biometric.create({
      data: {
        userId: newUser.id,
        weight: weight ?? 0,
        bodyFat,
        bmi,
        bmr: tdee * 0.9, // ประมาณค่าการเผาผลาญขณะพัก
        tdee,
        hydration: 55, // ค่าเริ่มต้นของปริมาณน้ำในร่างกาย (%)
      },
    });

    // ✅ บันทึกเป้าหมายสารอาหาร (`diet_goals`)
    await prisma.diet_goals.create({
      data: {
        user_id: newUser.id,
        daily_calories: tdee,
        daily_protein: protein,
        daily_carbs: carbs,
        daily_fat: fat,
      },
    });

    // ✅ สร้าง JWT Token
    const token = jwt.sign(
      { userId: newUser.id, role: role.name },
      JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // ✅ สร้าง Cookie
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600,
    });

    // ✅ ตอบกลับว่าการสมัครสำเร็จ
    const response = NextResponse.json({ message: "Registration successful" });
    response.headers.append("Set-Cookie", cookie);

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    } else {
      console.error("An unknown error occurred");
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
}
