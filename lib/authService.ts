import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface DecodedToken {
  userId: number;
  role: string;
}

// ✅ ฟังก์ชันดึง userId จาก Token
export async function getUserIdFromToken(req: Request): Promise<number | null> {
  try {
    // 🔹 ดึง Token จาก Header หรือ Cookies
    const authHeader = req.headers.get("Authorization");
    const cookieStore = await cookies(); // ✅ ใช้ await เพื่อให้ได้ค่า cookies
    const tokenFromCookie = cookieStore.get("token")?.value; // ✅ อ่านค่า token จาก cookie

    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // ✅ ใช้ Token จาก Header
    } else if (tokenFromCookie) {
      token = tokenFromCookie; // ✅ ใช้ Token จาก Cookies
    }

    if (!token) {
      console.error("❌ Unauthorized: Token not provided");
      return null;
    }

    // 🔹 ถอดรหัส Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (!decoded.userId) {
      console.error("❌ Unauthorized: Invalid token payload");
      return null;
    }

    console.log("🔑 Decoded User ID:", decoded.userId);
    return decoded.userId; // ✅ คืนค่า userId

  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
}
