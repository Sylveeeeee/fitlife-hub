import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ดึงข้อมูลการบริโภคอาหารจากตาราง UserTarget
    const nutritionData = await prisma.userTarget.aggregate({
      _sum: {
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
      },
    });

    // ดึงเป้าหมายโภชนาการของผู้ใช้
    const userTarget = await prisma.userTarget.findFirst();

    if (!userTarget) {
      return res.status(404).json({ error: "User target data not found" });
    }

    res.json({
      consumed: nutritionData._sum?.calories ?? 0,  // ✅ ป้องกัน undefined
      burned: 1820,
      remaining: Math.max(0, (userTarget.calories ?? 0) - (nutritionData._sum?.calories ?? 0)),  // ✅ ใช้ ?? ป้องกัน undefined
      energy: userTarget.calories ?? 0,
      protein: userTarget.protein ?? 0,
      carbs: userTarget.carbs ?? 0,
      fat: userTarget.fat ?? 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
