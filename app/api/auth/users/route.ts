import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';  // ใช้ bcryptjs สำหรับการแฮชรหัสผ่าน


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

// ฟังก์ชันตรวจสอบ role admin
async function verifyAdminRole(req: Request) {
  const cookies = req.headers.get('cookie');
  if (!cookies) {
    return null; // คืนค่า null ถ้าไม่มี token
  }

  const token = cookies
    .split(';')
    .find(cookie => cookie.trim().startsWith('token='))?.split('=')[1];

  if (!token) {
    return null; // คืนค่า null ถ้าไม่มี token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };
    return decoded; // คืนค่า decoded ถ้าทุกอย่างถูกต้อง
  } catch (err) {
    console.error('JWT Error:', err);
    return null; // คืนค่า null ถ้า token ไม่ถูกต้อง
  }
}

export async function GET(req: Request) {
  const decoded = await verifyAdminRole(req);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  const userId = decoded.userId;

  // ตรวจสอบ role ของผู้ใช้
  const user = await prisma.users.findUnique({
    where: { id: Number(userId) },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user || user.role.name !== 'admin') {
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
}

export async function POST(req: Request) {
  const decoded = await verifyAdminRole(req);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  try {
    let body;
    try {
      body = await req.json();
      if (!body || typeof body !== 'object') {
        throw new Error('Invalid request body');
      }
    } catch (err) {
      console.error('Invalid JSON payload:', err);
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const { username, email, role, password } = body;
    if (!username || !email || !role || !password) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // แฮชรหัสผ่านก่อนการบันทึกลงฐานข้อมูล
    const hashedPassword = await bcrypt.hash(password, 10);  // ใช้ bcrypt แฮชรหัสผ่าน

    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        role,
        password: hashedPassword,  // ส่งรหัสผ่านที่แฮชแล้ว
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error('POST Error:', err);
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const decoded = await verifyAdminRole(req);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  const foodId = Number(params.id);

  if (isNaN(foodId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await prisma.foods.delete({ where: { id: foodId } });

    return NextResponse.json({ message: 'Food deleted successfully' }, { status: 204 });
  } catch (err) {
    console.error('DELETE Error:', err);
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 });
  }
}
