import { NextResponse } from "next/server";
import { getDietGoals, upsertDietGoals } from "@/lib/dietGoalsService";
import * as z from "zod";

const DietGoalsSchema = z.object({
  daily_calories: z.number().positive(),
  daily_protein: z.number().nonnegative(),
  daily_carbs: z.number().nonnegative(),
  daily_fat: z.number().nonnegative(),
});

// GET Handler
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return NextResponse.json({ error: "Invalid User ID format" }, { status: 400 });
    }

    const dietGoals = await getDietGoals(parsedUserId);
    if (!dietGoals) {
      return NextResponse.json(
        { error: "Diet goals not found for the given user ID" },
        { status: 404 }
      );
    }

    return NextResponse.json(dietGoals, { status: 200 });
  } catch (error) {
    console.error("Error fetching diet goals:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching diet goals" },
      { status: 500 }
    );
  }
}

// POST Handler
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.userId || !body.dietGoals) {
      return NextResponse.json({ error: "userId and dietGoals are required" }, { status: 400 });
    }

    const parsedUserId = parseInt(body.userId);
    if (isNaN(parsedUserId)) {
      return NextResponse.json({ error: "Invalid User ID format" }, { status: 400 });
    }

    const validationResult = DietGoalsSchema.safeParse(body.dietGoals);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid dietGoals format", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const updatedGoals = await upsertDietGoals(parsedUserId, validationResult.data);
    return NextResponse.json(updatedGoals, { status: 200 });
  } catch (error) {
    console.error("Error updating diet goals:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating diet goals" },
      { status: 500 }
    );
  }
}
