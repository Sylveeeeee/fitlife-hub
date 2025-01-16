// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ใช้ Prisma Client
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // ค้นหาผู้ใช้จากฐานข้อมูล พร้อมดึงข้อมูล role
    const user = await prisma.users.findUnique({
      where: { email },
      include: { role: true }, // ดึงข้อมูล role ด้วย
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role?.name }, // ใช้ role.name
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // ส่ง JWT token กลับไป
    return NextResponse.json({
      message: 'Login successful',
      token,
      role: user.role?.name, // ส่งชื่อ role กลับไป
    });

  } catch (error) {
    // ตรวจสอบว่า error เป็น instance ของ Error
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'Something went wrong', error: 'Unknown error occurred' }, { status: 500 });
    }
  }
}
