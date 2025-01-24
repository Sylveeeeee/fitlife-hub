// lib/dietGoalsService.ts
import { prisma } from "@/lib/prisma";

// ดึงข้อมูลเป้าหมายอาหารของผู้ใช้
export async function getDietGoals(userId: number) {
  try {
    return await prisma.diet_goals.findFirst({
      where: { user_id: userId }, // ใช้ findFirst แทน findUnique
    });
  } catch (error) {
    console.error("Error fetching diet goals:", error);
    throw new Error("Failed to fetch diet goals");
  }
}

// อัปเดตหรือเพิ่มเป้าหมายอาหารของผู้ใช้
export async function upsertDietGoals(
  userId: number,
  dietGoals: {
    daily_calories: number;
    daily_protein?: number;
    daily_carbs?: number;
    daily_fat?: number;
  }
) {
  try {
    return await prisma.diet_goals.upsert({
      where: { user_id: userId },
      update: {
        daily_calories: dietGoals.daily_calories,
        daily_protein: dietGoals.daily_protein,
        daily_carbs: dietGoals.daily_carbs,
        daily_fat: dietGoals.daily_fat,
        updated_at: new Date(),
      },
      create: {
        user_id: userId,
        daily_calories: dietGoals.daily_calories,
        daily_protein: dietGoals.daily_protein,
        daily_carbs: dietGoals.daily_carbs,
        daily_fat: dietGoals.daily_fat,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Error upserting diet goals:", error);
    throw new Error("Failed to update or create diet goals");
  }
}
