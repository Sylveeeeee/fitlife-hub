import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  const cookies = req.headers.get('cookie');
  if (!cookies) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const token = cookies
    .split(';')
    .find(cookie => cookie.trim().startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const userId = Number(decoded.userId);

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        sex: true,
        weight: true,
        height: true,
        birthday: true,
        activity_level: true,
        diet_goal: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      userId: user.id.toString(),
      role: user.role ? user.role.name : null,
      email: user.email,
      name: user.name,
      age: user.age,
      sex: user.sex,
      weight: user.weight,
      height: user.height,
      birthday: user.birthday,
      activity_level: user.activity_level,
      diet_goal: user.diet_goal,
    });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ message: 'Unauthorized: Token expired' }, { status: 401 });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    } else {
      return NextResponse.json({ message: 'Unauthorized: Unknown error' }, { status: 401 });
    }
  }
}

// API สำหรับการอัปเดตข้อมูลผู้ใช้
export async function PUT(req: Request) {
  const cookies = req.headers.get('cookie');
  if (!cookies) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const token = cookies
    .split(';')
    .find(cookie => cookie.trim().startsWith('token='))?.split('=')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = Number(decoded.userId);

    const body = await req.json(); // รับข้อมูลใหม่จาก request body
    const { name, age, sex, weight, height, birthday, activity_level, diet_goal } = body;

    // อัปเดตข้อมูลผู้ใช้
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        name: name || undefined,
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
    console.error('Error updating user:', err);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}
