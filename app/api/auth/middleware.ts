import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// กำหนด interface สำหรับข้อมูลใน token ที่ถอดรหัส
interface DecodedToken {
  userId: string;
  role: string;
}

// ขยายประเภทของ NextRequest เพื่อให้รองรับ property user
interface CustomNextRequest extends NextRequest {
  user?: DecodedToken; // เพิ่ม user ใน request
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value; // ใช้ .value เพื่อดึงค่าของ cookie ที่เป็น string

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken; // ระบุประเภทให้กับ decoded

    // กำหนดข้อมูล user ใน request โดยไม่ใช้ any
    (req as CustomNextRequest).user = decoded;

    return NextResponse.next();
  } catch (error) {
    // ตรวจสอบว่า error เป็น instance ของ Error
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Invalid token', error: error.message }, { status: 401 });
    } else {
      // จัดการกับ error ที่ไม่ทราบประเภท
      return NextResponse.json({ message: 'Invalid token', error: 'An unknown error occurred' }, { status: 401 });
    }
  }
}
