import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// ฟังก์ชันตรวจสอบ role admin
async function verifyAdminRole(req: Request) {
  const cookies = req.headers.get('cookie');
  if (!cookies) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const token = cookies
    .split(';')
    .find(cookie => cookie.trim().startsWith('auth-token='))?.split('=')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: You do not have permission' }, { status: 403 });
    }
    return { userId: Number(decoded.userId) };
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof jwt.TokenExpiredError ? 'Unauthorized: Token expired' : 'Unauthorized: Invalid token' },
      { status: 401 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    const query = {
      ...(search
        ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] }
        : {}),
      ...(category === 'Favorites' ? { is_favorite: true } : {}),
    };

    const foods = await prisma.foods.findMany({ where: query });
    return NextResponse.json(foods);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const adminCheck = await verifyAdminRole(req);
  if ('message' in adminCheck) return adminCheck;

  try {
    const body = await req.json();
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

export async function DELETE(req: Request) {
  const adminCheck = await verifyAdminRole(req);
  if ('message' in adminCheck) return adminCheck;

  const id = Number(new URL(req.url).pathname.split('/').pop());

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await prisma.foods.delete({ where: { id } });
    return NextResponse.json({ message: 'Food deleted successfully' }, { status: 204 });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 });
  }
}
