import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/authMiddleware'; // อาจจะใช้ middleware สำหรับการตรวจสอบ JWT หรือ session

// ตรวจสอบสิทธิ์การเข้าถึงก่อนที่จะดำเนินการ
export async function PUT(req: Request) {
  try {
    // ตรวจสอบสิทธิ์ (อาจจะใช้ JWT หรือ Cookie)
    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, calories, protein, carbs, fat, category, source, type_of_food } = body;

    // ตรวจสอบค่าที่ได้รับ
    if (!id || !name) {
      return NextResponse.json({ message: 'ID and Name are required' }, { status: 400 });
    }

    // อัปเดตข้อมูลอาหาร
    const updatedFood = await prisma.foods.update({
      where: { id },
      data: {
        name,
        calories: calories || 0.00,
        protein: protein || 0.00,
        carbs: carbs || 0.00,
        fat: fat || 0.00,
        category,
        source,
        ,
      },
    });

    return NextResponse.json({ message: 'Food updated successfully', food: updatedFood });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to update food' }, { status: 500 });
  }
}
