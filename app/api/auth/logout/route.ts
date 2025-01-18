import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {  // ใช้ 'req' ตามปกติ
  try {
    // สมมติว่าคุณต้องการตรวจสอบค่า cookie จาก req
    const token = req.cookies.get('token');
    if (!token) {
      return NextResponse.json({ message: 'Token not found' }, { status: 401 });
    }

    return NextResponse.json(
      { message: 'Logged out successfully' },
      {
        status: 200,
        headers: {
          'Set-Cookie': `token=; Path=/; HttpOnly; Secure; Max-Age=0; SameSite=Strict;`,
        },
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'An error occurred while logging out' },
      { status: 500 }
    );
  }
}
