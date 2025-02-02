import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromToken } from '@/lib/authService';


// ✅ GET: ดึงข้อมูลอาหารรายวัน
export async function GET(req: Request, { params }: { params: { date: string } }) {
  try {
    const userId = await getUserIdFromToken(req);
    const mealDate = new Date(params.date);

    const meals = await prisma.meal_records.findMany({
      where: { user_id: userId, date: mealDate },
      include: { meal_items: true }
    });

    return NextResponse.json(meals);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// ✅ POST: เพิ่มอาหารในวันนั้น
export async function POST(req: Request, { params }: { params: { date: string } }) {
  try {
    const userId = await getUserIdFromToken(req);
    const mealDate = new Date(params.date);
    const { meal_type, food_id, quantity, calories, protein, carbs, fat } = await req.json();

    const existingMeal = await prisma.meal_records.findFirst({
      where: { user_id: userId, date: mealDate, meal_type }
    });

    if (!existingMeal) {
      // ถ้ายังไม่มี meal_records ให้สร้างใหม่
      const newMeal = await prisma.meal_records.create({
        data: {
          user_id: userId,
          date: mealDate,
          meal_type,
          total_calories: calories,
          total_protein: protein,
          total_carbs: carbs,
          total_fat: fat,
          meal_items: {
            create: [{ food_id, quantity, calories, protein, carbs, fat }]
          }
        },
        include: { meal_items: true }
      });

      return NextResponse.json(newMeal);
    } else {
      // ถ้ามี meal_records อยู่แล้วให้เพิ่ม item เข้าไป
      const newItem = await prisma.meal_items.create({
        data: {
          meal_record_id: existingMeal.id,
          food_id,
          quantity,
          calories,
          protein,
          carbs,
          fat
        }
      });

      // อัปเดตค่ารวมของ macros ใน meal_records
      await prisma.meal_records.update({
        where: { id: existingMeal.id },
        data: {
          total_calories: { increment: calories },
          total_protein: { increment: protein },
          total_carbs: { increment: carbs },
          total_fat: { increment: fat }
        }
      });

      return NextResponse.json(newItem);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // 🔹 ดึง userId จาก Token
    const userId = await getUserIdFromToken(req);
    const { meal_item_id } = await req.json();

    // 🔹 ตรวจสอบว่ามี meal item นี้จริงหรือไม่ และเป็นของ user นี้หรือไม่
    const mealItem = await prisma.meal_items.findFirst({
      where: {
        id: meal_item_id,
        meal_records: { user_id: userId },
      },
      include: { foods: true }, // ✅ ดึงข้อมูลอาหารจากตาราง foods
    });

    if (!mealItem) {
      return NextResponse.json({ error: "Meal item not found" }, { status: 404 });
    }

    // 🔹 ลบอาหารจาก meal_items
    await prisma.meal_items.delete({ where: { id: meal_item_id } });

    // 🔹 อัปเดตค่ารวมใน meal_records (ถ้า model มี total_protein, total_carbs, total_fat)
    await prisma.meal_records.update({
      where: { id: mealItem.meal_record_id },
      data: {
        total_calories: { decrement: mealItem.calories ?? 0 },
        total_protein: { decrement: mealItem.protein ?? 0 },
        total_carbs: { decrement: mealItem.carbs ?? 0 },
        total_fat: { decrement: mealItem.fat ?? 0 }
      }
    });    

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: unknown) {
    console.error("Error deleting meal item:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
