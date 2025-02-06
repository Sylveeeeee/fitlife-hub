import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// กำหนด interface สำหรับข้อมูลที่เราคาดหวังใน request.user
interface DecodedToken {
    userId: number; // เปลี่ยนเป็น number
    role: string;
  }
  
  interface CustomNextRequest extends NextRequest {
    user?: DecodedToken;
  }
  
  export async function GET(request: NextRequest) {
    try {
      const user = (request as CustomNextRequest).user; // ดึงข้อมูลผู้ใช้จาก middleware
  
      if (!user) {
        return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
      }
  
      // ดึงข้อมูลจากฐานข้อมูลตาม userId ที่ได้รับ
      const userData = await prisma.users.findUnique({
        where: { id: user.userId }, // ใช้ userId เป็นประเภท number
      });
  
      if (!userData) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({ user: userData });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
      } else {
        return NextResponse.json({ message: 'Internal Server Error', error: 'An unexpected error occurred' }, { status: 500 });
      }
    }
  }
  
