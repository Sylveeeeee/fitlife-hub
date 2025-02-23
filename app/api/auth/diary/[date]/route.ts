import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/authService"; // ตรวจสอบตัวตนผู้ใช้
import { prisma } from "@/lib/prisma"; // Prisma instance

// ✅ POST: เพิ่มอาหารเข้า Food Diary
export async function POST(req: NextRequest, { params }: { params: { date?: string } }) {
  try {
    const date = params?.date;
    if (!date) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    // ✅ ตรวจสอบสิทธิ์ผู้ใช้
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ ตรวจสอบ request body
    const body = await req.json();
    const { meal_type, food_id, quantity, calories, protein, carbs, fat } = body;

    if (!meal_type || !food_id || quantity == null || calories == null || protein == null || carbs == null || fat == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ ใช้ Transaction ในการเพิ่มข้อมูลลง DB
    const [diaryEntry] = await prisma.$transaction([
      prisma.foodDiary.create({
        data: {
          userId,
          date,
          mealType: meal_type,
          foodId: food_id,
          quantity,
          calories,
          protein,
          carbs,
          fat,
        },
        include: { food: true },
      }),

      // ✅ อัปเดตจำนวนครั้งที่อาหารถูกเพิ่มเข้าไดอารี่
      prisma.foods.update({
        where: { id: food_id },
        data: { added_count: { increment: 1 } },
      }),

      // ✅ บันทึกพฤติกรรมของผู้ใช้
      prisma.user_behavior_logs.create({
        data: {
          userId,
          action: "Add Food to Diary",
        }
      }),
    ]);

    console.log("✅ Food added to diary:", diaryEntry);
    return NextResponse.json(diaryEntry, { status: 201 });

  } catch (error) {
    console.error("❌ Error saving food diary:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ GET: ดึงรายการอาหารที่บันทึกไว้ใน Food Diary
export async function GET(req: NextRequest, { params }: { params: { date?: string } }) {
  try {
    const date = params?.date;
    if (!date) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    // ✅ ตรวจสอบสิทธิ์ผู้ใช้
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ ดึงข้อมูลจาก database
    const diaryEntries = await prisma.foodDiary.findMany({
      where: { userId, date },
      include: { food: { select: { id: true, name: true, unit: true } } },
    });

    console.log("📖 Diary Entries from API:", diaryEntries);
    return NextResponse.json(diaryEntries, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching diary entries:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ DELETE: ลบอาหารออกจาก Food Diary
export async function DELETE(req: NextRequest, { params }: { params: { date?: string } }) {
  try {
    const date = params?.date;
    if (!date) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    // ✅ ตรวจสอบสิทธิ์ผู้ใช้
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ ตรวจสอบ request body
    const body = await req.json();
    const { food_id, meal_type } = body;

    if (!food_id || !meal_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ ค้นหาและลบรายการอาหาร
    const existingEntry = await prisma.foodDiary.findFirst({
      where: { userId, date, foodId: food_id, mealType: meal_type },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: "Food entry not found" }, { status: 404 });
    }

    await prisma.$transaction([
      // ✅ ลบรายการอาหารจากไดอารี่
      prisma.foodDiary.delete({ where: { id: existingEntry.id } }),

      // ✅ อัปเดตจำนวนครั้งที่อาหารถูกเพิ่มเข้าไดอารี่
      prisma.foods.update({
        where: { id: food_id },
        data: { added_count: { decrement: 1 } },
      }),
    ]);

    console.log("✅ Food entry deleted:", existingEntry);
    return NextResponse.json({ message: "Food entry deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("❌ Error deleting food diary entry:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
