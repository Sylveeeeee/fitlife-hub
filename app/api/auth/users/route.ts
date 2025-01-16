import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";

// ฟังก์ชันตรวจสอบความถูกต้องของ Token
const verifyToken = (token: string): JwtPayload | null => {
  try {
    // ดึงค่า secret key จาก environment variables
    const secretKey = process.env.JWT_SECRET;

    // ตรวจสอบว่า secret key มีอยู่หรือไม่
    if (!secretKey) {
      throw new Error("JWT secret key is missing in environment variables");
    }

    // ตรวจสอบความถูกต้องของ token
    const decoded = jwt.verify(token, secretKey);
    return decoded as JwtPayload; // แปลงค่าเป็น JwtPayload
  } catch (error) {
    // แสดงข้อผิดพลาดถ้ามีการตรวจสอบไม่สำเร็จ
    console.error("Token verification error:", error);
    return null;
  }
};

export const GET = async (req: Request) => {
  try {
    // รับ JWT Token จาก Header Authorization
    const token = req.headers.get("Authorization")?.split(" ")[1];

    // ตรวจสอบว่า token มีอยู่หรือไม่
    if (!token) {
      return new Response("Unauthorized: Token missing", { status: 401 });
    }

    // ตรวจสอบความถูกต้องของ token
    const decoded = verifyToken(token);

    // ถ้า token ไม่ถูกต้องหรือไม่มี role เป็น "admin"
    if (!decoded || decoded.role !== "admin") {
      return new Response("Forbidden: You do not have admin privileges", { status: 403 });
    }

    // ดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูล
    const users = await prisma.users.findMany();

    return new Response(JSON.stringify(users), { status: 200 });

  } catch (error) {
    console.error("Error:", error);

    // ส่งข้อผิดพลาดจากเซิร์ฟเวอร์
    return new Response("Internal Server Error", { status: 500 });
  }
};
