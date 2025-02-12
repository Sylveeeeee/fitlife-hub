import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

function getTokenFromCookies(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

async function verifyAdminRole(req: Request) {
  const token = getTokenFromCookies(req);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string };
    return decoded.role === "admin" ? decoded.userId : null;
  } catch (err) {
    console.error("JWT Error:", err);
    return null;
  }
}

export async function GET(req: Request) {
  const userId = await verifyAdminRole(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
  }

  try {
    // ดึงข้อมูลผู้ใช้และอาหารทั้งหมด
    const users = await prisma.users.findMany({ select: { id: true, username: true, email: true, created_at: true } });
    const foods = await prisma.foods.findMany({ select: { id: true, name: true, category: true, calories: true, created_at: true } });

    // คำนวณ Key Metrics
    const totalFoods = foods.length;
    const totalUsers = users.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newFoodsToday = foods.filter((food) => food.created_at && new Date(food.created_at) >= today).length;
    const newUsersToday = users.filter((user) => user.created_at && new Date(user.created_at) >= today).length;

    // รายงานยอดนิยม
    const categoryCount = foods.reduce((acc, food) => {
      const category = food.category ?? "Unknown"; // แก้ null เป็น "Unknown"
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const popularCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    const popularFoods = foods.slice(0, 3).map((food) => food.name);

    // ผู้ใช้ที่มีการใช้งานมากที่สุด (Mock Data)
    const mostActiveUsers = users.slice(0, 3).map((user) => user.username);

    // ระบบแจ้งเตือน
    const latestFoods = foods.slice(-5).map((food) => food.name);
    const latestUsers = users.slice(-5).map((user) => user.username);

    // รายงานกิจกรรม (Mock Data)
    const recentActivity = [
      { user: "Admin", action: "Added new food item", timestamp: new Date().toISOString() },
    ];

    // ฟังก์ชันช่วยแปลงวันที่อย่างปลอดภัย
    const getSafeDate = (date: string | Date | null) => {
      return date ? new Date(date) : null;
    };

    // กราฟข้อมูลรายเดือน
    const monthlyUsers = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleString("default", { month: "short" }),
      count: users
        .map((user) => getSafeDate(user.created_at))
        .filter((date) => date && date.getMonth() === i).length,
    }));

    const monthlyFoods = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleString("default", { month: "short" }),
      count: foods
        .map((food) => getSafeDate(food.created_at))
        .filter((date) => date && date.getMonth() === i).length,
    }));

    const userBehavior = [
      { type: "Login", count: 50 },
      { type: "Add Food", count: 30 },
      { type: "Order", count: 40 },
    ];

    return NextResponse.json(
      {
        users,
        foods,
        totalFoods,
        totalUsers,
        newFoodsToday,
        newUsersToday,
        popularFoods,
        popularCategories,
        mostActiveUsers,
        latestFoods,
        latestUsers,
        recentActivity,
        monthlyUsers,
        monthlyFoods,
        userBehavior,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Failed to fetch data" }, { status: 500 });
  }
}
