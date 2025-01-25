// lib/dietGoalsService.ts
import { prisma } from "@/lib/prisma";

// ดึงข้อมูลเป้าหมายอาหารของผู้ใช้
export async function getDietGoals(userId: number) {
  try {
    const dietGoals = await prisma.diet_goals.findFirst({
      where: { user_id: userId },
    });

    if (!dietGoals) {
      throw new Error("Diet goals not found for this user");
    }

    return dietGoals;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching diet goals:", error.message);
      throw new Error(error.message || "Failed to fetch diet goals");
    } else {
      console.error("Error fetching diet goals:", error);
      throw new Error("Failed to fetch diet goals");
    }
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
    if (!dietGoals.daily_calories) {
      throw new Error("Daily calories is required");
    }

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error upserting diet goals:", error.message);
      throw new Error(error.message || "Failed to update or create diet goals");
    } else {
      console.error("Error upserting diet goals:", error);
      throw new Error("Failed to update or create diet goals");
    }
  }
}
