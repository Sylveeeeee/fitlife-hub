import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserIdFromToken(req: Request): Promise<number | null> {
  try {
    const authHeader = req.headers.get("Authorization");

    // ✅ ใช้ `await` เพราะ TypeScript แจ้งว่ามันคืนค่า `Promise<ReadonlyRequestCookies>`
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get("token")?.value;

    console.log("🔹 Token from Header:", authHeader);
    console.log("🔹 Token from Cookie:", tokenFromCookie);

    let token: string | undefined;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (tokenFromCookie) {
      token = tokenFromCookie;
    }

    if (!token) {
      console.error("❌ Unauthorized: Token not provided");
      return null;
    }

    console.log("🔹 Decoding Token:", token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
      console.log("✅ Decoded Payload:", decoded);

      if (!decoded.userId) {
        console.error("❌ Invalid Token Payload");
        return null;
      }

      return parseInt(decoded.userId, 10);
    } catch (jwtError) {
      console.error("❌ JWT Error:", jwtError);
      return null;
    }
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
}
