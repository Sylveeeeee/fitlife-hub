import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// ฟังก์ชันสำหรับแปลง BigInt เป็น string
const bigIntToString = (data: unknown): unknown => {
  if (data === null || data === undefined) return data; // ถ้าค่าเป็น null หรือ undefined ไม่ทำอะไร
  if (typeof data === 'bigint') return data.toString(); // ถ้าเป็น BigInt ให้แปลงเป็น string
  if (Array.isArray(data)) return data.map(bigIntToString); // ถ้าเป็น array ให้แปลงค่าภายใน array
  if (typeof data === 'object' && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, bigIntToString(value)]) // ถ้าเป็น object ให้แปลงค่าภายใน object
    );
  }
  return data; // ถ้าค่าไม่ใช่ BigInt, array หรือ object ให้คืนค่าดั้งเดิม
};

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };
    const userId = decoded.userId;  // ใช้ string สำหรับ userId
    const user = await prisma.users.findUnique({
      where: { id: Number(userId) },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.role.name !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: You do not have admin privileges' }, { status: 403 });
    }

    // ดึงข้อมูลผู้ใช้ทั้งหมด
    const users = await prisma.users.findMany();

    // แปลง BigInt เป็น string ทุกค่าที่มีใน users
    const usersWithStringIds = bigIntToString(users);

    // ดึงข้อมูลอาหารทั้งหมด
    const foods = await prisma.foods.findMany();

    // แปลง BigInt เป็น string ทุกค่าที่มีใน foods
    const foodsWithStringIds = bigIntToString(foods);

    // ส่งข้อมูลผู้ใช้และอาหารกลับไป
    return NextResponse.json({ users: usersWithStringIds, foods: foodsWithStringIds });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }
}
