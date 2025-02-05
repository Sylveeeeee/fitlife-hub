import { NextResponse, NextRequest  } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/authService";

// ✅ GET: ดึงข้อมูลอาหารรายวัน
export async function GET(req: NextRequest, context: { params: { date?: string } }) {
  try {
    console.log("📥 Fetching meals for date:", context.params.date);

    // ✅ ตรวจสอบและดึง `params`
    const date = await context.params?.date; // ✅ ใช้ await
    if (!date) {
      console.error("❌ Missing date parameter");
      return NextResponse.json({ error: "Missing date parameter." }, { status: 400 });
    }

    // ✅ ตรวจสอบ `userId`
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      console.error("❌ Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ แปลง `date` เป็น `Date Object`
    const mealDate = new Date(date);
    if (isNaN(mealDate.getTime())) {
      console.error("❌ Invalid date format:", date);
      return NextResponse.json({ error: "Invalid date format." }, { status: 400 });
    }

    // ✅ ดึงข้อมูลอาหารรายวัน
    const meals = await prisma.meal_records.findMany({
      where: { user_id: userId, date: mealDate },
      include: {
        meal_items: true, // ✅ ใช้ `meal_items` แทน `meal_record`
      },
    });

    // ✅ ตรวจสอบว่ามีข้อมูลหรือไม่
    if (!meals || meals.length === 0) {
      return NextResponse.json({ error: "No meals found for this date." }, { status: 404 });
    }

    console.log("✅ Meals retrieved successfully");

    return NextResponse.json(meals, { status: 200 });
  } catch (error) {
    console.error("❌ API Error (GET):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ POST: เพิ่มอาหารในวันนั้น
export async function POST(req: Request, context: { params: { date?: string } }) {
  try {
    console.log("📥 Incoming request to add food to diary");

    const params = await context.params;
    const date = params.date;
    if (!date) {
      console.error("❌ Missing date parameter");
      return NextResponse.json({ error: "Missing date parameter." }, { status: 400 });
    }

    console.log("📆 Received date:", date);

    const userId = await getUserIdFromToken(req);
    if (!userId) {
      console.error("❌ Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let requestBody;
    try {
      requestBody = await req.json();
      if (!requestBody || Object.keys(requestBody).length === 0) {
        throw new Error("Request body is empty");
      }
      console.log("✅ Received request body:", requestBody);
    } catch (error) {
      console.error("❌ Invalid JSON format:", error);
      return NextResponse.json({ error: "Invalid JSON format." }, { status: 400 });
    }

    console.log("📦 Request Data:", requestBody);

    const { meal_type, food_id, quantity, calories, protein, carbs, fat } = requestBody;

    if (!meal_type || !food_id || !quantity) {
      console.error("❌ Missing required fields");
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const totalCalories = calories || 0;
    const totalProtein = protein || 0;
    const totalCarbs = carbs || 0;
    const totalFat = fat || 0;

    const mealDate = new Date(date);
    if (isNaN(mealDate.getTime())) {
      console.error("❌ Invalid date format:", date);
      return NextResponse.json({ error: "Invalid date format." }, { status: 400 });
    }

    let mealRecord = await prisma.meal_records.findFirst({
      where: { user_id: userId, date: mealDate, meal_type },
    });

    if (!mealRecord) {
      console.log("📦 Prisma payload (Creating meal_records):", {
        user_id: userId,
        meal_type,
        date: mealDate,
        total_calories: totalCalories,
        total_protein: totalProtein,
        total_carbs: totalCarbs,
        total_fat: totalFat,
      });

      mealRecord = await prisma.meal_records.create({
        data: {
          user_id: userId,
          date: mealDate,
          meal_type,
          total_calories: totalCalories,
          total_protein: totalProtein,
          total_carbs: totalCarbs,
          total_fat: totalFat,
          meal_items: {
            create: [{ food_id, quantity, calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fat: totalFat }],
          },
        },
      });
    }

    if (!mealRecord?.id) {
      console.error("❌ Meal record ID is missing!");
      return NextResponse.json({ error: "Meal record ID is missing" }, { status: 500 });
    }

    console.log("📦 Prisma payload (Creating meal_items):", {
      meal_record_id: mealRecord.id,
      food_id,
      quantity,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    });

    await prisma.meal_items.create({
      data: {
        meal_record_id: mealRecord.id,
        food_id,
        quantity,
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
      },
    });

    console.log("📦 Prisma payload (Updating meal_records totals):", {
      id: mealRecord.id,
      increment_calories: totalCalories,
      increment_protein: totalProtein,
      increment_carbs: totalCarbs,
      increment_fat: totalFat,
    });

    await prisma.meal_records.update({
      where: { id: mealRecord.id },
      data: {
        total_calories: { increment: totalCalories },
        total_protein: { increment: totalProtein },
        total_carbs: { increment: totalCarbs },
        total_fat: { increment: totalFat },
      },
    });

    console.log("✅ Food added successfully");

    return NextResponse.json({ message: "Food added successfully." }, { status: 200 });
  } catch (error) {
    console.error("❌ API Error (POST):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// ✅ DELETE: ลบอาหารออกจากไดอารี่
export async function DELETE(req: NextRequest) {
  try {
    console.log("📥 Incoming request to delete food entry");

    // ✅ ตรวจสอบ `userId`
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      console.error("❌ Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ ดึงและตรวจสอบ `req.json()`
    let requestBody;
    try {
      requestBody = await req.json();
      if (!requestBody || !requestBody.meal_item_id) {
        throw new Error("Missing meal_item_id in request body");
      }
    } catch (error) {
      console.error("❌ Invalid JSON format:", error);
      return NextResponse.json({ error: "Invalid JSON format." }, { status: 400 });
    }

    const { meal_item_id } = requestBody;
    console.log("🗑️ Deleting meal item:", meal_item_id);

    // ✅ ตรวจสอบว่า `meal_item` มีอยู่จริง และดึง `meal_records` มาด้วย
    const mealItem = await prisma.meal_items.findFirst({
      where: { id: meal_item_id },
      include: { meal_records: true }, // ✅ ใช้ `meal_records` แทน `meal_record`
    });

    if (!mealItem || mealItem.meal_records?.user_id !== userId) {
      console.error("❌ Meal item not found or does not belong to the user");
      return NextResponse.json({ error: "Meal item not found or unauthorized" }, { status: 404 });
    }

    // ✅ ลบ `meal_item`
    await prisma.meal_items.delete({ where: { id: meal_item_id } });

    // ✅ อัปเดตค่ารวมใน `meal_records` (เช็ค null safety)
    if (mealItem.meal_record_id) {
      await prisma.meal_records.update({
        where: { id: mealItem.meal_record_id },
        data: {
          total_calories: { decrement: mealItem.calories ?? 0 },
          total_protein: { decrement: mealItem.protein ?? 0 },
          total_carbs: { decrement: mealItem.carbs ?? 0 },
          total_fat: { decrement: mealItem.fat ?? 0 },
        },
      });
    }

    console.log("✅ Deleted successfully");

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ API Error (DELETE):", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}