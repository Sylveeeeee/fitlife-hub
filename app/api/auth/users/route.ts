import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 

// ✅ ฟังก์ชันแปลง BigInt และ Date ให้เป็น string
const bigIntToString = (data: unknown): unknown => {
  if (data === null || data === undefined) return data;
  if (typeof data === 'bigint') return data.toString();
  if (data instanceof Date) return data.toISOString(); // ✅ แปลง Date เป็น string
  if (Array.isArray(data)) return data.map(bigIntToString);
  if (typeof data === 'object' && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, bigIntToString(value)])
    );
  }
  return data;
};

// ✅ ตรวจสอบ Token และดึง `userId`
async function verifyAdminRole(req: Request) {
  const cookies = req.headers.get('cookie');
  if (!cookies) return null;

  const token = cookies
    .split(';')
    .find(cookie => cookie.trim().startsWith('token='))?.split('=')[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };
    return { userId: Number(decoded.userId) }; // ✅ แปลง userId เป็น number
  } catch (err) {
    console.error('JWT Error:', err);
    return null;
  }
}

// ✅ GET: ดึงรายชื่อผู้ใช้ทั้งหมด
export async function GET(req: Request) {
  const decoded = await verifyAdminRole(req);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  // ✅ ตรวจสอบสิทธิ์ Admin
  const adminUser = await prisma.users.findUnique({
    where: { id: decoded.userId },
    select: { role: { select: { name: true } } },
  });

  if (!adminUser || adminUser.role?.name !== 'admin') {
    return NextResponse.json({ message: 'Forbidden: You do not have admin privileges' }, { status: 403 });
  }

  // ✅ ดึงรายชื่อผู้ใช้ทั้งหมด
  const users = await prisma.users.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      is_active: true,
      total_logins: true,
      last_login: true,
      role: { select: { name: true } }, // ✅ ดึงเฉพาะ role.name
    },
  });

  // ✅ แปลงค่าก่อนส่งออก
  const usersFormatted = users.map(user => ({
    ...(bigIntToString(user) as Record<string, unknown>),
    role: user.role?.name || "user", // ✅ แสดงเฉพาะ role.name
  }));

  return NextResponse.json(usersFormatted, { status: 200 });
}

// ✅ POST: เพิ่มผู้ใช้ใหม่
export async function POST(req: Request) {
  const decoded = await verifyAdminRole(req);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  try {
    const { username, email, roleId, password } = await req.json();

    if (!username || !email || !roleId || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ✅ ตรวจสอบว่า roleId มีอยู่จริง
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      return NextResponse.json({ error: 'Invalid roleId' }, { status: 400 });
    }

    // ✅ ตรวจสอบว่าอีเมลซ้ำหรือไม่
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // ✅ แฮชรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ สร้างผู้ใช้ใหม่
    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roleId,
        is_active: true, // ✅ ทำให้บัญชี Active โดยอัตโนมัติ
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: { select: { name: true } },
      },
    });

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });

  } catch (err) {
    console.error('POST Error:', err);
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
}

// ✅ DELETE: ลบผู้ใช้
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const decoded = await verifyAdminRole(req);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  const userId = Number(params.id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    // ✅ ตรวจสอบว่าผู้ใช้มีอยู่จริง
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, role: { select: { name: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ✅ ป้องกัน Admin จากการลบบัญชีตัวเอง
    if (user.id === decoded.userId) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 403 });
    }

    // ✅ ลบผู้ใช้
    await prisma.users.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
