import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export function POST() {
  // ลบคุกกี้ที่เก็บ JWT token
  const cookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: -1,  // ตั้งค่าให้หมดอายุทันที
  });

  return new NextResponse('Logged out successfully', {
    status: 200,
    headers: {
      'Set-Cookie': cookie,
    },
  });
}
