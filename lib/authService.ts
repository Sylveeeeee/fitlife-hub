import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface DecodedToken {
  userId: number;
  role: string;
}

// ✅ ฟังก์ชันดึง userId จาก Token
export async function getUserIdFromToken(req: Request): Promise<number> {
  try {
    // 🔹 ดึง token จาก Header หรือ Cookies
    const authHeader = req.headers.get("Authorization");
    const cookieHeader = await cookies(); // ✅ ใช้ await
    const tokenFromCookie = cookieHeader.get("token")?.value;
    
    let token: string | undefined = undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // ใช้ Token จาก Header
    } else if (tokenFromCookie) {
      token = tokenFromCookie; // ใช้ Token จาก Cookies
    }

    if (!token) {
      throw new Error("Unauthorized: Token not provided");
    }

    // 🔹 ถอดรหัส Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (!decoded.userId) {
      throw new Error("Unauthorized: Invalid token");
    }

    return decoded.userId; // ✅ คืนค่า userId
  } catch (error) {
    console.error("Error getting user ID from token:", error);
    throw new Error("Unauthorized: Invalid or expired token");
  }
}
