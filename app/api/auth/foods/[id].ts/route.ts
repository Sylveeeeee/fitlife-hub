import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

async function verifyAdminRole(req: Request) {
  const cookies = req.headers.get('cookie');
  if (!cookies) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const token = cookies
    .split(';')
    .find(cookie => cookie.trim().startsWith('auth-token=')) // ใช้ชื่อคุกกี้ที่ถูกต้องคือ 'auth-token'
    ?.split('=')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };

    // แปลง userId จาก string เป็น number
    const userId = Number(decoded.userId);

    // ตรวจสอบ role
    if (decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: You do not have permission' }, { status: 403 });
    }

    return { userId };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ message: 'Unauthorized: Token expired' }, { status: 401 });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Unauthorized: Unknown error' }, { status: 401 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const foodId = Number(params.id);

  if (isNaN(foodId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const food = await prisma.foods.findUnique({ where: { id: foodId } });

    if (!food) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }

    return NextResponse.json(food);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch food' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // ตรวจสอบสิทธิ์การเข้าถึง
    const adminCheck = await verifyAdminRole(req);
    if (adminCheck) return adminCheck;  // ส่งผลลัพธ์หากเป็น Unauthorized หรือ Forbidden

    const foodId = Number(params.id);
    const body = await req.json();
    const { name, calories, protein, carbs, fat, category, source } = body;

    // ตรวจสอบข้อมูลที่ได้รับจาก client
    console.log('Received data for PUT:', body);

    if (isNaN(foodId) || !name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
      console.log('Invalid input data');
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // ตรวจสอบว่าอาหารที่ต้องการอัปเดตมีอยู่ในฐานข้อมูลหรือไม่
    const foodExists = await prisma.foods.findUnique({ where: { id: foodId } });
    if (!foodExists) {
      console.log(`Food with ID ${foodId} not found`);
      return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }

    // อัปเดตข้อมูลอาหาร
    const updatedFood = await prisma.foods.update({
      where: { id: foodId },
      data: { name, calories, protein, carbs, fat, category, source },
    });

    console.log('Successfully updated food:', updatedFood);
    return NextResponse.json(updatedFood);
  } catch (error) {
    // ตรวจสอบประเภทของ error และให้รายละเอียดที่ชัดเจน
    console.error('Error during PUT request:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to update food', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to update food', details: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const adminCheck = await verifyAdminRole(req);
  if ('message' in adminCheck) return adminCheck;

  const foodId = Number(params.id);

  if (isNaN(foodId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await prisma.foods.delete({ where: { id: foodId } });
    return NextResponse.json({ message: 'Food deleted successfully' }, { status: 204 });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 });
  }
}
