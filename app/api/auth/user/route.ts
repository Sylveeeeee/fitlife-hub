import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// ระบุชนิดข้อมูลที่ JWT จะถอดรหัสได้
interface DecodedToken {
  userId: number;
  role: string;
  iat?: number; // issued at
  exp?: number; // expiration time
}

export async function GET(request: Request) {
  try {
    // ดึง Cookie จากคำขอ
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const token = cookieHeader.split("=")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token found" }, { status: 401 });
    }

    // ตรวจสอบ JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    // ส่งข้อมูลผู้ใช้ที่ถอดรหัสได้กลับไป
    return NextResponse.json(
      {
        id: decoded.userId, // userId จาก Token
        role: decoded.role, // role จาก Token
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
