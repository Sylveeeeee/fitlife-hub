import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import * as z from 'zod';

// สร้าง schema สำหรับตรวจสอบข้อมูลที่ได้รับจาก client
const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function POST(request: Request) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  try {
    const body = await request.json();

    // ตรวจสอบความถูกต้องของข้อมูลที่ได้รับจาก client
    const parsedBody = LoginSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json({ message: 'Invalid input', errors: parsedBody.error.errors }, { status: 400 });
    }

    const { email, password } = parsedBody.data;

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await prisma.users.findUnique({
      where: { email },
      select: {  // ใช้ select แทน include
        id: true,
        password: true,
        role: true,  // ถ้าหาก role เป็น relation, ใช้ select ในกรณีนี้
      },
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
      { userId: user.id.toString(),  // แปลง BigInt เป็น string
        role: user.role?.name,  // ตรวจสอบว่า role มีค่า
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    
    console.log('Generated JWT token:', token);
    // สร้างคุกกี้ที่เก็บ JWT token ด้วย httpOnly, secure, sameSite, และ path
    const cookie = serialize('token', token, {
      httpOnly: true,  // ป้องกันไม่ให้เข้าถึงจาก JavaScript
      secure: process.env.NODE_ENV === 'production',  // ใช้ secure ใน production เท่านั้น
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60,  // กำหนด path ให้เป็น root
    });
    
    return new Response(JSON.stringify({ message: 'Login successful', role: user.role?.name }), {
      status: 200,
      headers: {
        'Set-Cookie': cookie,  // ตั้งคุกกี้ใน header
      },
    });
    
  } catch (error) {
    // ตรวจสอบว่า error เป็น instance ของ Error
    if (error instanceof Error) {
      console.error('Error during login:', error.message);
      return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error during login:', error);
      return NextResponse.json({ message: 'Internal server error', error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
