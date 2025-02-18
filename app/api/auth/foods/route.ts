import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import  { FoodCategory }  from "@prisma/client"; // ✅ นำเข้า Prisma Enum

const normalizeFoodCategory = (value: string | null | undefined): FoodCategory | undefined => {
  if (!value) return FoodCategory.COMMON_FOOD;
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

  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");

    // Normalizing category (ถ้าไม่ระบุ category หรือเป็น "All" จะใช้ค่า null)
    const normalizedCategory = category ? normalizeFoodCategory(category) : null;

    const query = {
      ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" } }] } : {}),
      ...(normalizedCategory ? { category: normalizedCategory } : {}), // ถ้ามี category ก็กรองตามหมวดหมู่
    };

    const foods = await prisma.foods.findMany({ where: query });
    return NextResponse.json(foods);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch foods" }, { status: 500 });
  }
}


export async function POST(req: Request) {
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

  try {
    let body;
    try {
      body = await req.json();
      if (!body || typeof body !== "object") {
        throw new Error("Invalid request body");
      }
    } catch (err) {
      console.error("Invalid JSON payload:", err);
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    console.log("Received Body:", body);

    const { name, calories, protein, carbs, fat, category, source } = body;

    if (!name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // กรณีเลือกหมวดหมู่ COMMON_FOOD (หรืออื่น ๆ) ต้องแปลงค่าให้ตรงกับ Prisma Enum
    const normalizedCategory = normalizeFoodCategory(category);
    if (!normalizedCategory) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // เพิ่มอาหารลงฐานข้อมูล
    const newFood = await prisma.foods.create({
      data: { name, calories, protein, carbs, fat, category: normalizedCategory, source },
    });

    console.log("Created Food:", newFood);

    return NextResponse.json(newFood, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to add food" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
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
