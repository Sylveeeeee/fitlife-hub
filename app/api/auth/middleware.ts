import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    // Redirect ไปยังหน้า login หากไม่มี token
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // ตรวจสอบ JWT
    jwt.verify(token, process.env.JWT_SECRET!);

    // อนุญาตให้เข้าถึงหน้าเว็บ
    return NextResponse.next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// ระบุเส้นทางที่ใช้ middleware
export const config = {
  matcher: ['/protected-page/:path*', '/another-protected/:path*'], // กำหนดเส้นทางที่ต้องตรวจสอบ
};
