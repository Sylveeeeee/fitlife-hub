import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { calculateTDEE, calculateMacroTargets } from "@/utils/calculations";
import { getUserProfile } from "@/lib/userService";
import { upsertDietGoals } from "@/lib/dietGoalsService";

// ประเภทสำหรับ JWT Token
interface DecodedToken extends JwtPayload {
  userId: string;
  role: string;
}

export async function POST(request: Request) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  try {
    // ดึง Token จาก Header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header is required" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Token is missing" }, { status: 401 });
    }

    // ถอดรหัส Token
    const decodedToken: DecodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    // ตรวจสอบ userId จาก Token
    const userId = parseInt(decodedToken.userId, 10);
    if (!userId) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    // ดึงข้อมูลผู้ใช้
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    if (!userProfile.weight || !userProfile.height || !userProfile.age) {
      return NextResponse.json(
        { error: "Incomplete user profile. Please provide weight, height, and age." },
        { status: 400 }
      );
    }

    // แปลงฟิลด์ข้อมูลให้ตรงกับ type ที่ `calculateTDEE` ต้องการ
    const formattedProfile = {
      weight: userProfile.weight,
      height: userProfile.height,
      age: userProfile.age,
      sex: userProfile.sex === "male" || userProfile.sex === "female" ? userProfile.sex : "male",
      activityLevel: userProfile.activity_level || "sedentary",
    };

    const tdee = calculateTDEE(formattedProfile);
    const { protein, carbs, fat } = calculateMacroTargets(tdee);

    const updatedGoals = await upsertDietGoals(userId, {
      daily_calories: tdee,
      daily_protein: protein,
      daily_carbs: carbs,
      daily_fat: fat,
    });

    return NextResponse.json(updatedGoals, { status: 200 });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid Token Error:", error.message);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.error("Error calculating or updating diet goals:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
}
