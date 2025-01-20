import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt, { JwtPayload } from 'jsonwebtoken';

// ดึง JWT_SECRET จาก .env
const JWT_SECRET = process.env.JWT_SECRET;

interface JwtPayloadWithRole extends JwtPayload {
  role: string;
}

// ตรวจสอบ Role Admin
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

  const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayloadWithRole;
  console.log('Decoded Token:', decoded);
  if (decoded.role !== 'admin') {
    throw new Error('Forbidden');
  }
}

// จัดการคำขอ GET
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    let query = {};

    if (search) {
      query = {
        ...query,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (category === 'Favorites') {
      query = { ...query, is_favorite: true };
    }

    const foods = await prisma.foods.findMany({ where: query });
    return NextResponse.json(foods);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 });
  }
}

// จัดการคำขอ POST
export async function POST(req: Request) {
  try {
    verifyAdminRole(req);

    const body = await req.json();
    console.log('Received Body:', body);

    const { name, calories, protein, carbs, fat, category, source } = body;

    if (!name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const newFood = await prisma.foods.create({
      data: { name, calories, protein, carbs, fat, category, source },
    });

    return NextResponse.json(newFood, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to add food' }, { status: 500 });
  }
}

// จัดการคำขอ PUT
export async function PUT(req: Request) {
  try {
    verifyAdminRole(req);

    const body = await req.json();
    const { id, name, calories, protein, carbs, fat, category, source } = body;

    if (!id || !name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
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

// จัดการ Method ที่ไม่รองรับ
export async function middleware(req: Request) {
  const { method } = req;
  if (!['GET', 'POST', 'PUT'].includes(method)) {
    return NextResponse.json({ error: `Method ${method} Not Allowed` }, { status: 405 });
  }
}
