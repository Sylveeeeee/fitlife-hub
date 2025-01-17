import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { serialize } from 'cookie';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, password } = userSchema.parse(data);

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse('Email already registered', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const DEFAULT_ROLE = 'user';
    const role = await prisma.role.findUnique({ where: { name: DEFAULT_ROLE } });
    if (!role) {
      throw new Error('Role not found');
    }

    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        roleId: role.id,
      },
    });

    const token = jwt.sign(
      { userId: newUser.id, role: role.name },
      process.env.JWT_SECRET as string,  // ใช้ process.env.JWT_SECRET
      { expiresIn: '1h' }
    );
    
    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3600,
    });

    const response = NextResponse.json({ message: 'Registration successful' });
    response.headers.append('Set-Cookie', cookie);

    return response;
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
