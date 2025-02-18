import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function GET(req: NextRequest) {
  const cookies = req.headers.get("cookie");

  if (!cookies) {
    return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
  }

  const token = cookies
    .split(";")
    .find((cookie) => cookie.trim().startsWith("auth-token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: number; role: string };

    return NextResponse.json({ userId: decoded.userId, role: decoded.role });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof jwt.TokenExpiredError ? "Token expired" : "Invalid token" },
      { status: 401 }
    );
  }
}
