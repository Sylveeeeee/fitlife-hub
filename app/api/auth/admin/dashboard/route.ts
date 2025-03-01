import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// ✅ ตรวจสอบ Token และดึง `userId`
async function verifyAdminRole(req: Request) {
  const cookies = req.headers.get('cookie');
  if (!cookies) return null;

  const token = cookies
    .split(';')
    .find(cookie => cookie.trim().startsWith('token='))?.split('=')[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };
    return { userId: Number(decoded.userId) }; // ✅ แปลง userId เป็น number
  } catch (err) {
    console.error('JWT Error:', err);
    return null;
  }
}

export async function GET(req: Request) {
  const userId = await verifyAdminRole(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    // ดึงข้อมูลผู้ใช้
    const users = await prisma.users.findMany({
      select: { id: true, username: true, email: true, created_at: true, last_login: true }
    });

    // ดึงข้อมูลอาหาร
    const foods = await prisma.foods.findMany({
      select: { id: true, name: true, category: true, calories: true, protein: true, carbs: true, fat: true, created_at: true }
    });

    // คำนวณ Key Metrics
    const totalFoods = foods.length;
    const totalUsers = users.length;

    const newFoodsToday = foods.filter(food => food.created_at && new Date(food.created_at) >= today).length;
    const newUsersToday = users.filter(user => user.created_at && new Date(user.created_at) >= today).length;

    // อาหารที่ถูกเพิ่มมากที่สุด
    const popularFoods = await prisma.foods.findMany({
      orderBy: { added_count: 'desc' }, // ✅ เรียงจากมากไปน้อย
      take: 5, // ✅ เอาแค่ 5 อันดับ
      select: {
        name: true,
        added_count: true,
      },
    });


    // อาหารที่ถูกเพิ่มตามหมวดหมู่
    const categoryCount = foods.reduce((acc, food) => {
      const category = food.category ?? "Unknown";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    // ผู้ใช้ Active vs Inactive
    const activeUsers = users.filter(user => user.last_login && new Date(user.last_login) >= last30Days);
    const inactiveUsers = users.length - activeUsers.length;

    // พฤติกรรมผู้ใช้แบบใหม่
    const userActivity = [
      { type: "Active Users", count: activeUsers.length },
      { type: "Inactive Users", count: inactiveUsers },
    ];

    // กราฟข้อมูลรายเดือน: ผู้ใช้ล็อกอิน
    const getSafeDate = (date: string | Date | null) => (date ? new Date(date) : null);
    const monthlyLogins = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleString("default", { month: "short" }),
      count: users
        .map((user) => getSafeDate(user.last_login))
        .filter((date) => date && date.getMonth() === i).length,
    }));

    // กราฟข้อมูลรายเดือน: อาหารที่ถูกเพิ่ม
    const monthlyFoods = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleString("default", { month: "short" }),
      count: foods
        .map((food) => getSafeDate(food.created_at))
        .filter((date) => date && date.getMonth() === i).length,
    }));

    // แนวโน้มสารอาหารที่ถูกเพิ่ม
    const nutrientTrends = await prisma.foods.groupBy({
      by: ['category'],
      _avg: { protein: true, carbs: true, fat: true },
      orderBy: { category: 'asc' }
    }).then((data) =>
      data.map((entry) => ({
        category: entry.category,
        protein: entry._avg.protein || 0, // ✅ กรณีไม่มีค่าให้ใส่ 0
        carbs: entry._avg.carbs || 0,
        fat: entry._avg.fat || 0,
      }))
    );    

    // ✅ พฤติกรรมของผู้ใช้ (User Behavior)
    const userBehavior = await prisma.user_behavior_logs.groupBy({
      by: ['action'], 
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }).then((data) =>
      data.map((entry) => ({
        action: entry.action,
        count: entry._count.id, // ✅ ดึงค่าจาก _count.id
      }))
    );
    

    return NextResponse.json(
      {
        totalFoods,
        totalUsers,
        newFoodsToday,
        newUsersToday,
        popularFoods,
        popularCategories,
        userActivity,
        monthlyLogins,
        monthlyFoods,
        nutrientTrends,
        userBehavior,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Failed to fetch data" }, { status: 500 });
  }
}
