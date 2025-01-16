import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // ตรวจสอบข้อมูลที่ได้รับ
    if (!email || !password) {
      return new NextResponse('Invalid input', { status: 400 });
    }

    // ตรวจสอบว่าอีเมลมีการใช้งานแล้วหรือไม่
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('Email already registered', { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const role = await prisma.role.findUnique({ where: { name: 'user' } });
    if (!role) {
      throw new Error('Role not found');
    }

    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        roleId: role.id,
      },
    });

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { userId: newUser.id, role: role.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // ส่งข้อมูลสำเร็จ
    return NextResponse.json({ message: 'Registration successful', token });
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
