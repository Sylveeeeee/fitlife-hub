import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY || 'your_jwt_secret_key'; // คีย์ลับสำหรับการถอดรหัส JWT

export async function authMiddleware(req: Request) {
  try {
    // ดึง token จาก header
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // ตรวจสอบ JWT token
    const decoded = jwt.verify(token, secretKey);

    // เพิ่มข้อมูลผู้ใช้ที่ถอดรหัสแล้วเข้าสู่ request
    (req as any).user = decoded;

    return NextResponse.next(); // อนุญาตให้ดำเนินการต่อ
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
    