import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/authService"; // ตรวจสอบตัวตนผู้ใช้
import { prisma } from "@/lib/prisma"; // Prisma instance

// ✅ POST: เพิ่มอาหารเข้า Food Diary
export async function POST(req: NextRequest, { params }: { params: { date?: string } }) {
  try {
    const date = params?.date;
    if (!date) {
      console.error("❌ Missing date parameter.");
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    // ✅ ตรวจสอบสิทธิ์ผู้ใช้
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      console.error("❌ Unauthorized.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ ตรวจสอบ request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Invalid JSON format:", error);
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { meal_type, food_id, quantity, calories, protein, carbs, fat } = body;

    if (!meal_type || !food_id || quantity == null || calories == null || protein == null || carbs == null || fat == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ เพิ่มข้อมูลเข้า database
    const diaryEntry = await prisma.foodDiary.create({
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
      include: { food: true }, // ดึงข้อมูลอาหารที่เกี่ยวข้อง
    });

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
      include: { food: { select: { id: true, name: true, unit: true } } }, // ✅ ดึงข้อมูลอาหาร
    });
    console.log("📖 Diary Entries from API:", diaryEntries);
    
    return NextResponse.json(diaryEntries, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching diary entries:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { date?: string } }) {
  try {
    const date = params?.date;
    if (!date) {
      console.error("❌ Missing date parameter.");
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    // ✅ ตรวจสอบสิทธิ์ผู้ใช้
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      console.error("❌ Unauthorized.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ ตรวจสอบ request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Invalid JSON format:", error);
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { food_id, meal_type } = body;
    if (!food_id || !meal_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ ค้นหาว่ารายการอาหารนั้นมีอยู่ในไดอารี่ของผู้ใช้หรือไม่
    const existingEntry = await prisma.foodDiary.findFirst({
      where: {
        userId,
        date,
        foodId: food_id,
        mealType: meal_type,
      },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: "Food entry not found" }, { status: 404 });
    }

    // ✅ ลบรายการอาหารจากไดอารี่
    await prisma.foodDiary.delete({
      where: { id: existingEntry.id },
    });

    console.log("✅ Food entry deleted:", existingEntry);
    return NextResponse.json({ message: "Food entry deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("❌ Error deleting food diary entry:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
