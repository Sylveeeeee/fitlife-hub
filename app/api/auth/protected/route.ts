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

    // แปลง userId จาก string เป็น number
    const userId = Number(decoded.userId);

    // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // แปลง BigInt เป็น string ก่อนส่งกลับ
    return NextResponse.json({
      userId: user.id.toString(),  // แปลง user.id ที่เป็น BigInt เป็น string
      role: user.role ? user.role.toString() : null, // แปลง role เป็น string ถ้ามี
      email: user.email,
    });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.error('Token expired');
      return NextResponse.json({ message: 'Unauthorized: Token expired' }, { status: 401 });
    } else if (err instanceof jwt.JsonWebTokenError) {
      console.error('Invalid token');
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    } else {
      console.error('Unexpected error during token verification:', err);
      return NextResponse.json({ message: 'Unauthorized: Unknown error' }, { status: 401 });
    }
  }
}
                                          