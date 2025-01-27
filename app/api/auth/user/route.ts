import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

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
        weight: true,
        height: true,
        activity_level: true,
        diet_goal: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  const cookies = req.headers.get('cookie');
  const token = getTokenFromCookies(cookies);

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  try {
    // ตรวจสอบว่า token ไม่เป็น null หรือ undefined
    if (!token) {
      throw new Error('Token is missing or invalid');
    }

    // ตรวจสอบว่า JWT_SECRET ถูกต้องหรือไม่
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string } | null;
    
    // ตรวจสอบว่า decoded payload เป็นอ็อบเจกต์ที่ถูกต้อง
    if (!decoded || !decoded.userId) {
      throw new Error('Invalid token payload');
    }

    const userId = Number(decoded.userId);
    const body = await req.json();
    const { name, age, sex, weight, height, birthday, activity_level, diet_goal } = body;

    // ตรวจสอบข้อมูลใน body
    if (!name && !age && !sex && !weight && !height && !activity_level && !diet_goal) {
      return NextResponse.json({ message: 'No data provided for update' }, { status: 400 });
    }

    // อัปเดตข้อมูลผู้ใช้
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        username: name || undefined,
        age: age || undefined,
        sex: sex || undefined,
        weight: weight || undefined,
        height: height || undefined,
        birthday: birthday ? new Date(birthday) : undefined,
        activity_level: activity_level || undefined,
        diet_goal: diet_goal || undefined,
        updated_at: new Date(), // อัปเดตเวลาหลังจากการแก้ไข
      },
    });

    return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err); // ตรวจสอบข้อผิดพลาดที่เกิดขึ้น
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}
