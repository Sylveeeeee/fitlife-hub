import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

interface JwtPayloadWithRole {
  role: string;
}

// ฟังก์ชันตรวจสอบ role admin
function verifyAdminRole(req: Request) {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) {
    throw new Error('Unauthorized');
  }

  const cookies = Object.fromEntries(cookieHeader.split('; ').map((c) => c.split('=')));
  const token = cookies['auth-token'];
  if (!token) {
    throw new Error('Unauthorized');
  }

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithRole;
  if (decoded.role !== 'admin') {
    throw new Error('Forbidden');
  }
}

// **GET: ดึงข้อมูลอาหารตาม ID**
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const food = await prisma.foods.findUnique({
      where: { id },
    });

    if (!food) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }

    return NextResponse.json(food);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch food' }, { status: 500 });
  }
}

// **PUT: อัปเดตข้อมูลอาหาร**
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    verifyAdminRole(req);

    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    const { name, calories, protein, carbs, fat, category, source } = body;

    if (!name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const updatedFood = await prisma.foods.update({
      where: { id },
      data: { name, calories, protein, carbs, fat, category, source },
    });

    return NextResponse.json(updatedFood);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 });
  }
}

// **DELETE: ลบข้อมูลอาหาร**
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    verifyAdminRole(req);

    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.foods.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Food deleted successfully' }, { status: 204 });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 });
  }
}

// Middleware สำหรับ Method ที่ไม่รองรับ
export async function middleware(req: Request) {
  const { method } = req;
  if (!['GET', 'PUT', 'DELETE'].includes(method)) {
    return NextResponse.json({ error: `Method ${method} Not Allowed` }, { status: 405 });
  }
}
