import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { includeToday = "true", includeSupplements = "true" } = req.query;
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const whereClause = {
      OR: [
        includeToday === "true" ? { date: { gte: today } } : null,
        includeSupplements === "true" ? { isSupplement: true } : null,
      ].filter(Boolean),
    };

    const nutritionData = await prisma.userNutritionLog.aggregate({
      _sum: {
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
      },
      where: whereClause,
    });

    const userTarget = await prisma.userTarget.findFirst();

    if (!userTarget) {
      return res.status(404).json({ error: "User target data not found" });
    }

    res.json({
      consumed: nutritionData._sum.calories || 0,
      burned: 1820,
      remaining: Math.max(0, (userTarget.calories || 0) - (nutritionData._sum.calories || 0)),
      energy: userTarget.calories || 0,
      protein: userTarget.protein || 0,
      carbs: userTarget.carbs || 0,
      fat: userTarget.fat || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
