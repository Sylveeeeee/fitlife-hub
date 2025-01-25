import { NextResponse } from "next/server";
import { getDietGoals, upsertDietGoals } from "@/lib/dietGoalsService";
import * as z from "zod";
import jwt from "jsonwebtoken";

const DietGoalsSchema = z.object({
  daily_calories: z.number().positive(),
  daily_protein: z.number().nonnegative(),
  daily_carbs: z.number().nonnegative(),
  daily_fat: z.number().nonnegative(),
});

// ฟังก์ชันตรวจสอบ JWT Token
function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken || typeof decodedToken !== 'object') {
      throw new Error("Invalid token payload");
    }
    return decodedToken;
  } catch (error) {
    console.error("Error in token verification:", error);
    throw new Error("Invalid or expired token");
  }
}

// ฟังก์ชันที่ใช้ดึง token จาก Cookie
function getTokenFromCookies(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map(cookie => cookie.trim());
  const tokenCookie = cookies.find(cookie => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // ตรวจสอบ Token จาก Authorization Header หรือ Cookie
    let token = null;
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // จาก Bearer token
    } else {
      token = getTokenFromCookies(request); // จาก Cookies
    }

    if (!token) {
      return NextResponse.json({ error: "Authorization token is required" }, { status: 401 });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken?.userId) {
      return NextResponse.json({ error: "Invalid or missing token payload" }, { status: 401 });
    }

    // ตรวจสอบ userId
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

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

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

    // ตรวจสอบ Token จาก Authorization Header หรือ Cookie
    let token = null;
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // จาก Bearer token
    } else {
      token = getTokenFromCookies(request); // จาก Cookies
    }

    if (!token) {
      return NextResponse.json({ error: "Authorization token is required" }, { status: 401 });
    }

    // ตรวจสอบความถูกต้องของ token
    const decodedToken = verifyToken(token);
    if (typeof decodedToken !== "object" || !decodedToken.userId) {
      return NextResponse.json({ error: "Invalid or missing token payload" }, { status: 401 });
    }

    const userId = decodedToken.userId;

    // ตรวจสอบข้อมูลใน body
    if (!body.dietGoals) {
      return NextResponse.json({ error: "dietGoals are required" }, { status: 400 });
    }

    const validationResult = DietGoalsSchema.safeParse(body.dietGoals);
    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid dietGoals format", details: validationResult.error.errors }, { status: 400 });
    }

    const updatedGoals = await upsertDietGoals(userId, validationResult.data);
    return NextResponse.json(updatedGoals, { status: 200 });
  } catch (error) {
    console.error("Error updating diet goals:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ error: "An unexpected error occurred while updating diet goals" }, { status: 500 });
  }
}
