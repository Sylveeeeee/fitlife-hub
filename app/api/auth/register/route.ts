import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { serialize } from 'cookie';
import { calculateTDEE, calculateMacroTargets } from '@/utils/calculations'; // เพิ่มการนำเข้าฟังก์ชันการคำนวณ

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// คำนวณอายุจากวันเกิด
const calculateAge = (birthday: string): number => {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  birthday: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    { message: 'Invalid date format (YYYY-MM-DD expected)' }
  ),
  height: z.preprocess(
    (val) => (val ? parseFloat(val as string) : undefined),
    z.number().positive('Height must be a positive number').optional()
  ),
  weight: z.preprocess(
    (val) => (val ? parseFloat(val as string) : undefined),
    z.number().positive('Weight must be a positive number').optional()
  ),
  sex: z.enum(['male', 'female'], { invalid_type_error: 'Invalid gender value' }),
  activity_level: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive']).default('sedentary'), // ค่าเริ่มต้น
  diet_goal: z.enum(['lose_weight', 'maintain_weight', 'gain_weight']).default('maintain_weight'), // ค่าเริ่มต้น
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // กำหนดค่าเริ่มต้นให้กับ activity_level และ diet_goal หากไม่ได้รับค่าจาก client
    const { email, password, username, birthday, height, weight, sex, activity_level, diet_goal } = userSchema.parse(data);

    // คำนวณอายุจากวันเกิด
    const age = calculateAge(birthday);

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse('Email already registered', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const DEFAULT_ROLE = 'user';
    const role = await prisma.role.findUnique({ where: { name: DEFAULT_ROLE } });
    if (!role) {
      throw new Error('Role not found');
    }

    // คำนวณ TDEE และเป้าหมายการรับประทานอาหาร
    const formattedProfile = {
      weight: weight ?? 0, // ถ้า weight เป็น undefined ให้ใช้ 0
      height: height ?? 0, // ถ้า height เป็น undefined ให้ใช้ 0
      age,
      sex,
      activityLevel: activity_level,
    };
    const tdee = calculateTDEE(formattedProfile);
    const { protein, carbs, fat } = calculateMacroTargets(tdee);

    // สร้างผู้ใช้ใหม่ในฐานข้อมูล
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        username,
        birthday: new Date(birthday),
        height,
        weight,
        sex,
        age,  // บันทึกอายุที่คำนวณแล้ว
        activity_level,  // บันทึกค่า activity_level ที่ส่งมา หรือใช้ค่าเริ่มต้น
        diet_goal,  // ใช้ค่า diet_goal ที่ส่งมา หรือค่าเริ่มต้น
        roleId: role.id,
      },
    });

    // อัปเดตหรือเพิ่มข้อมูลเป้าหมายอาหารให้กับผู้ใช้
    await prisma.diet_goals.create({
      data: {
        user_id: newUser.id,
        daily_calories: tdee,
        daily_protein: protein,
        daily_carbs: carbs,
        daily_fat: fat,
      },
    });
    

    const token = jwt.sign(
      { userId: newUser.id, role: role.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3600,
    });

    const response = NextResponse.json({ message: 'Registration successful' });
    response.headers.append('Set-Cookie', cookie);

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    } else {
      console.error('An unknown error occurred');
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }
}
