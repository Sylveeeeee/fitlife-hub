import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { FoodCategory } from '@prisma/client'; // ✅ นำเข้า Prisma Enum

// ฟังก์ชันสำหรับการแปลง category
const normalizeFoodCategory = (value: string | null | undefined): FoodCategory | undefined => {
  if (!value) return undefined;
  switch (value.toLowerCase().replace(/\s+/g, "_")) {
    case "common_food": return FoodCategory.COMMON_FOOD;
    case "beverages": return FoodCategory.BEVERAGES;
    case "restaurants": return FoodCategory.RESTAURANTS;
    default: return FoodCategory.COMMON_FOOD; // ✅ ค่าเริ่มต้น
  }
};

// ฟังก์ชันตรวจสอบ role admin
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


// GET: ดึงข้อมูลอาหารตาม ID
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const foodId = url.pathname.split('/').pop(); // ดึง id จาก URL path

    if (!foodId) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    const id = Number(foodId);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const food = await prisma.foods.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        category: true,
        source: true,
        unit: true,
      }
    });

    if (!food) return NextResponse.json({ error: 'Food not found' }, { status: 404 });

    return NextResponse.json(food);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// PUT: อัปเดตข้อมูลอาหาร
export async function PUT(req: Request) {
  const decoded = await verifyAdminRole(req);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  // ตรวจสอบสิทธิ์ Admin
  const adminUser = await prisma.users.findUnique({
    where: { id: decoded.userId },
    select: { role: { select: { name: true } } },
  });

  if (!adminUser || adminUser.role?.name !== 'admin') {
    return NextResponse.json({ message: 'Forbidden: You do not have admin privileges' }, { status: 403 });
  }

  const url = new URL(req.url);
  const foodId = Number(url.pathname.split('/').pop()); // ดึง `id` จาก URL

  if (isNaN(foodId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, calories, protein, carbs, fat, category, source, unit } = body;

    if (!name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined || !unit) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const normalizedCategory = normalizeFoodCategory(category);

    const validUnits = ["GRAM", "ML", "CUP", "TBSP", "TSP", "PIECE", "SERVING"];
    if (!validUnits.includes(unit)) {
      return NextResponse.json({ error: "Invalid unit type" }, { status: 400 });
    }

    const updatedFood = await prisma.foods.update({
      where: { id: foodId },
      data: { name, calories, protein, carbs, fat, category: normalizedCategory, source, unit },
    });

    return NextResponse.json(updatedFood, { status: 200 });
  } catch (error) {
    console.error("Error during PUT request:", error);
    return NextResponse.json({ error: "Failed to update food" }, { status: 500 });
  }
}

// DELETE: ลบข้อมูลอาหาร
export async function DELETE(req: Request) {
  const decoded = await verifyAdminRole(req);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  const adminUser = await prisma.users.findUnique({
    where: { id: decoded.userId },
    select: { role: { select: { name: true } } },
  });

  if (!adminUser || adminUser.role?.name !== 'admin') {
    return NextResponse.json({ message: 'Forbidden: You do not have admin privileges' }, { status: 403 });
  }

  const url = new URL(req.url);
  const foodId = Number(url.pathname.split('/').pop()); // ดึง `id` จาก URL

  if (isNaN(foodId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.foods.delete({
      where: { id: foodId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error during DELETE request:", error);
    return NextResponse.json({ error: "Failed to delete food" }, { status: 500 });
  }
}


