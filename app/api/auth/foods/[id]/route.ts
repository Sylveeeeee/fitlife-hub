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
    .find((cookie) => cookie.trim().startsWith('auth-token='))?.split('=')[1];

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


// GET: ดึงข้อมูลอาหารตาม ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    const foodId = Number(params.id);
    if (isNaN(foodId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const food = await prisma.foods.findUnique({ where: { id: foodId } });
    if (!food) return NextResponse.json({ error: 'Food not found' }, { status: 404 });

    return NextResponse.json(food);
  }catch (error) {
    if (error instanceof Error) {
      console.error('GET error:', error.message);
      return NextResponse.json({ error: 'An unexpected error occurred', details: error.message }, { status: 500 });
    } else {
      console.error('Unknown error occurred:', error);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
  
}

// PUT: อัปเดตข้อมูลอาหาร
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  // ตรวจสอบสิทธิ์ผู้ใช้
  const adminCheck = await verifyAdminRole(req);
  if ('message' in adminCheck) return adminCheck;

  try {
    // รับ ID และตรวจสอบความถูกต้อง
    const foodId = Number(params.id);
    if (isNaN(foodId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // รับข้อมูลใหม่จาก body
    const body = await req.json();
    const { name, calories = 0, protein = 0, carbs = 0, fat = 0, category, source } = body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    if (!category || !source) {
      return NextResponse.json({ error: 'Invalid input: Missing category or source' }, { status: 400 });
    }    

    // ตรวจสอบว่าอาหารที่ต้องการแก้ไขมีอยู่หรือไม่
    const foodExists = await prisma.foods.findUnique({ where: { id: foodId } });
    if (!foodExists) {
      return NextResponse.json({ error: `Food with ID ${foodId} not found` }, { status: 404 });
    }    

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedFood = await prisma.foods.update({
      where: { id: foodId },
      data: { name, calories, protein, carbs, fat, category, source },
    });

    return NextResponse.json(updatedFood, { status: 200 });
  } catch (error) {
    // จัดการข้อผิดพลาด
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update food', details: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
  );
  }
}


// DELETE: ลบข้อมูลอาหาร
export async function DELETE(req: Request, context: { params: { id: string } }) {
  // ตรวจสอบสิทธิ์ผู้ใช้
  const adminCheck = await verifyAdminRole(req);
  if ('message' in adminCheck) return adminCheck;

  try {
    // ใช้ await กับ context.params
    const { id } = await context.params;
    const foodId = Number(id);

    if (isNaN(foodId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    console.log('Attempting to delete food with ID:', foodId);

    await prisma.foods.delete({ where: { id: foodId } });

    console.log('Successfully deleted food with ID:', foodId);

    // ส่ง response ด้วยสถานะ 204 โดยไม่มี body
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete food', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
