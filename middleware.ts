import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("🌍 Middleware running...");

  // ✅ ดึง JWT Token จาก Cookie
  const token = req.cookies.get("token")?.value;
  

  if (!token) {
    console.warn("⚠️ No token found, redirecting to login...");
    
    // ✅ Redirect และบังคับให้ Reload หน้า
    const url = new URL("/login", req.url);
    const response = NextResponse.redirect(url);
    response.headers.set("Cache-Control", "no-store"); // ❌ ปิด Cache
    response.headers.set("Refresh", "0; url=/login"); // ✅ บังคับให้ Browser Redirect
    return response;
  }

  try {
    // ✅ ตรวจสอบ JWT ผ่าน API `/api/auth/protected`
    const response = await fetch(new URL("/api/auth/protected", req.url), {
      method: "GET",
      headers: { Cookie: `token=${token}` }, // ✅ ส่ง Token ไปกับ Header
    });

    if (!response.ok) {
      console.warn("🚫 Unauthorized Token, redirecting to login...");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ ดึงข้อมูลผู้ใช้จาก API
    const userData = await response.json();
    console.log(`✅ Token Verified! User ID: ${userData.userId}, Role: ${userData.role}`);

    // ✅ ป้องกันการเข้าถึง `/admin` ถ้าไม่ใช่ Admin
    if (req.nextUrl.pathname.startsWith("/admin") && userData.role.toLowerCase() !== "admin") {
      console.warn("🚫 Unauthorized access to admin, redirecting to user dashboard...");
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next(); // ✅ อนุญาตให้ Request ผ่านได้

  } catch (err) {
    console.error("❌ Middleware Error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// ✅ ให้ Middleware ทำงานเฉพาะ `/admin`, `/website`, และ `/api/auth/protected`
export const config = {
  matcher: ["/admin/:path*",  "/dashboard", "/profile", "/posts", "/BMI", "/diary", "/foods", "/NutritionReport", "/tdee", "/api/auth/protected"],
};
