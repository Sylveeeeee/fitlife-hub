import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string; // หรือ number ถ้าคุณใช้ number
  role: string;
  exp: number;
}

export function extractUserIdFromToken(token: string): DecodedToken | null {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error("Failed to verify token:", error);
    return null;
  }
}
