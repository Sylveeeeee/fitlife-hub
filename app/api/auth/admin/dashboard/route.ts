import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// ฟังก์ชันตรวจสอบสิทธิ์แอดมิน
async function verifyAdminRole(req: Request) {
  const cookies = req.headers.get('cookie');
  if (!cookies) {
    return null;
  }

  const token = cookies
    .split(';')
    .find(cookie => cookie.trim().startsWith('auth-token='))?.split('=')[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string };
    if (decoded.role !== 'admin') {
      return null;
    }
    return decoded.userId;
  } catch (err) {
    console.error('JWT Error:', err);
    return null;
  }
}

// ฟังก์ชันแปลง BigInt เป็น string
const bigIntToString = (data: unknown): unknown => {
  if (data === null || data === undefined) return data;
  if (typeof data === 'bigint') return data.toString();
  if (Array.isArray(data)) return data.map(bigIntToString);
  if (typeof data === 'object' && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, bigIntToString(value)])
    );
  }
  return data;
};

// API GET: ดึงข้อมูล foods และ users
export async function GET(req: Request) {
  const userId = await verifyAdminRole(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  try {
    // ดึงข้อมูล users
    const users = await prisma.users.findMany({
      select: { id: true, name: true, email: true },
    });

    // ดึงข้อมูล foods
    const foods = await prisma.foods.findMany({
      select: { id: true, name: true, category: true, calories: true },
    });

    // แปลงค่า BigInt (ถ้ามี)
    const usersWithStringIds = bigIntToString(users);
    const foodsWithStringIds = bigIntToString(foods);

    return NextResponse.json({ users: usersWithStringIds, foods: foodsWithStringIds }, { status: 200 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
