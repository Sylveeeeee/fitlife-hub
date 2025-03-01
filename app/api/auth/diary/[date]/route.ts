import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { calculateMacroTargets, calculateTDEE } from "@/utils/calculations";
import { getUserProfile } from "@/lib/userService";
const WEIGHT_METRIC_ID = 1; // กำหนด metricId สำหรับน้ำหนัก

// ✅ ฟังก์ชันตรวจสอบสิทธิ์ผู้ใช้
async function verifyUser(req: NextRequest) {
  try {
    const cookies = req.headers.get("cookie");
    if (!cookies) return null;

    const token = cookies
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };
    return { userId: Number(decoded.userId) };
  } catch (err) {
    console.error("❌ JWT Error:", err);
    return null;
  }
}

// ✅ POST: เพิ่มอาหารเข้า Food Diary
export async function POST(req: NextRequest, context: { params: { date?: string } }) {
  try {
    const date = context.params?.date;
    if (!date) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    // ✅ ตรวจสอบสิทธิ์ผู้ใช้
    const user = await verifyUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ ตรวจสอบ request body
    const body = await req.json();
    const { meal_type, food_id, quantity, calories, protein, carbs, fat } = body;

    if (!meal_type || !food_id || quantity == null || calories == null || protein == null || carbs == null || fat == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ ใช้ Transaction ในการเพิ่มข้อมูลลง DB
    const diaryEntry = await prisma.foodDiary.create({
      data: {
        userId: user.userId,
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
    });

    console.log("✅ Food added to diary:", diaryEntry);

    // ✅ อัปเดตจำนวนครั้งที่อาหารถูกเพิ่มเข้าไดอารี่ และบันทึกพฤติกรรม
    await prisma.$transaction([
      prisma.foods.update({
        where: { id: food_id },
        data: { added_count: { increment: 1 } },
      }),
      prisma.user_behavior_logs.create({
        data: {
          userId: user.userId,
          action: "Add Food to Diary",
        },
      }),
    ]);

    return NextResponse.json(diaryEntry, { status: 201 });

  } catch (error) {
    console.error("❌ Error saving food diary:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ GET: ดึงรายการอาหาร, ออกกำลังกาย และค่าชีวภาพจากไดอารี่
export async function GET(req: NextRequest, { params }: { params: { date: string } }) {
  try {
    const date = params.date; // ข้อมูล date ควรมีใน params
    if (!date) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    console.log("📅 Fetching diary for date:", date);

    // ✅ ดึง `user` จาก token
    const user = await verifyUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ Authorized User:", user.userId);

    // ✅ ดึงข้อมูลจาก Prisma
    const foodEntries = await prisma.foodDiary.findMany({
      where: { userId: user.userId, date },
      include: { food: { select: { id: true, name: true, unit: true } } },
    });

    const exerciseEntries = await prisma.userExerciseDiary.findMany({
      where: { userId: user.userId, date },
      include: { exercise: { select: { id: true, name: true } } },
    });

    const biometricEntries = await prisma.biometricEntry.findMany({
      where: { userId: user.userId, recordedAt: date },
      include: { metric: { select: { id: true, name: true, unit: true } } },
    });

    console.log("📖 Food Entries:", foodEntries);
    console.log("💪🏼 Exercise Entries:", exerciseEntries);
    console.log("🧬 Biometric Entries:", biometricEntries);

    // ✅ จัดรูปแบบข้อมูลก่อนส่งกลับ
    const formattedFoodEntries = foodEntries.map((entry) => ({
      id: entry.id,
      type: "food",
      foodId: entry.foodId,
      food: entry.food ? { id: entry.food.id, name: entry.food.name ?? "Unknown", unit: entry.food.unit ?? "g" } : null,
      quantity: entry.quantity,
      mealType: entry.mealType,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
    }));

    const formattedExerciseEntries = exerciseEntries.map((entry) => ({
      id: entry.id,
      type: "exercise",
      exerciseId: entry.exercise?.id ?? 0,
      exercise: entry.exercise ? { id: entry.exercise.id, name: entry.exercise.name ?? "Unknown Exercise" } : null,
      duration: entry.duration,
      calories: entry.caloriesBurned,
      mealType: "Exercise",
    }));

    const formattedBiometricEntries = biometricEntries.map((entry) => ({
      id: entry.id,
      type: "biometric",
      metricId: entry.metric.id,
      name: entry.metric.name,
      value: entry.value,
      unit: entry.unit,
      recordedAt: entry.recordedAt,
    }));

    return NextResponse.json({ data: [...formattedFoodEntries, ...formattedExerciseEntries, ...formattedBiometricEntries] }, { status: 200 });

  } catch (error) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ DELETE: ลบอาหาร, การออกกำลังกาย หรือค่าชีวภาพออกจาก Diary
export async function DELETE(req: NextRequest, context: { params: { date?: string } }) {
  try {
    const date = context.params?.date;
    if (!date) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    // ✅ ตรวจสอบสิทธิ์ผู้ใช้
    const user = await verifyUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ อ่านข้อมูลจาก request body
    const body = await req.json();
    const { food_id, exercise_id, meal_type, biometric_id } = body;

    if (!food_id && !exercise_id && !biometric_id) {
      return NextResponse.json({ error: "Provide either 'food_id', 'exercise_id', or 'biometric_id'" }, { status: 400 });
    }

    // ✅ ลบอาหารจากไดอารี่
    if (food_id && meal_type) {
      const existingFoodEntry = await prisma.foodDiary.findFirst({
        where: {
          userId: user.userId,
          date: date,
          mealType: meal_type.toLowerCase(),
          foodId: food_id,
        },
      });

      if (!existingFoodEntry) {
        return NextResponse.json({ error: "Food entry not found" }, { status: 404 });
      }

      // ✅ ใช้ Transaction ลบอาหารออกจากไดอารี่
      await prisma.$transaction([
        prisma.foodDiary.delete({ where: { id: existingFoodEntry.id } }),
        prisma.foods.update({
          where: { id: food_id },
          data: { added_count: { decrement: 1 } },
        }),
      ]);

      return NextResponse.json({ message: "Food entry deleted successfully" }, { status: 200 });
    }

    // ✅ ลบรายการออกกำลังกายจากไดอารี่
    if (exercise_id) {
      const existingExerciseEntry = await prisma.userExerciseDiary.findFirst({
        where: { userId: user.userId, date: date, exerciseId: exercise_id },
      });

      if (!existingExerciseEntry) {
        return NextResponse.json({ error: "Exercise entry not found" }, { status: 404 });
      }

      await prisma.userExerciseDiary.delete({ where: { id: existingExerciseEntry.id } });

      return NextResponse.json({ message: "Exercise entry deleted successfully" }, { status: 200 });
    }

    // ✅ ลบค่าชีวภาพออกจากไดอารี่
    if (biometric_id) {
      const existingBiometricEntry = await prisma.biometricEntry.findFirst({
        where: { userId: user.userId, id: biometric_id },
      });

      if (!existingBiometricEntry) {
        return NextResponse.json({ error: "Biometric entry not found" }, { status: 404 });
      }

      // ✅ ลบค่าชีวภาพจากฐานข้อมูล
      await prisma.biometricEntry.delete({ where: { id: biometric_id } });

      // ✅ ถ้าค่าที่ถูกลบเป็น "น้ำหนัก" ให้ดึงค่าล่าสุดจาก biometricEntry
      if (existingBiometricEntry.metricId === WEIGHT_METRIC_ID) {
        console.log(`✅ Weight entry deleted, updating latest weight for user ${user.userId}`);

        // ✅ ดึงน้ำหนักล่าสุด
        const latestWeightEntry = await prisma.biometricEntry.findFirst({
          where: { userId: user.userId, metricId: WEIGHT_METRIC_ID },
          orderBy: { recordedAt: "desc" },
        });

        const latestWeight = latestWeightEntry ? parseFloat(String(latestWeightEntry.value)) : null;

        // ✅ อัปเดต users.weight ถ้ามีค่าล่าสุด
        if (latestWeight !== null) {
          await prisma.users.update({
            where: { id: user.userId },
            data: { weight: latestWeight },
          });
          console.log(`✅ Updated user weight to latest: ${latestWeight} kg`);

          // ✅ คำนวณ TDEE ใหม่
          const userProfile = await getUserProfile(user.userId);
          if (userProfile) {
            const formattedProfile = {
              weight: latestWeight ?? userProfile.weight ?? 70, // ใช้ค่าน้ำหนักที่อัปเดต
              height: userProfile.height ?? 170,
              age: userProfile.age ?? 25,
              sex: userProfile.sex ?? "male",
              activityLevel: userProfile.activity_level || "sedentary",
            };

            const tdee = calculateTDEE(formattedProfile);
            const { protein, carbs, fat } = calculateMacroTargets(tdee);

            // ✅ อัปเดต diet_goals
            const updatedGoals = await prisma.diet_goals.upsert({
              where: { user_id: user.userId },
              update: {
                daily_calories: tdee,
                daily_protein: protein,
                daily_carbs: carbs,
                daily_fat: fat,
                updated_at: new Date(),
              },
              create: {
                user_id: user.userId,
                daily_calories: tdee,
                daily_protein: protein,
                daily_carbs: carbs,
                daily_fat: fat,
              },
            });

            console.log("✅ Updated diet goals:", updatedGoals);
          }
        }
      }

      return NextResponse.json({ message: "Biometric entry deleted successfully" }, { status: 200 });
    }

  } catch (error) {
    console.error("❌ Error deleting diary entry:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



