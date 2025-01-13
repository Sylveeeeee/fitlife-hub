import { prisma } from '@/lib/prisma'; // นำเข้า Prisma Client
import bcrypt from 'bcryptjs'; // ใช้ bcryptjs สำหรับการเช็ครหัสผ่าน
import jwt from 'jsonwebtoken'; // ใช้ JWT สำหรับสร้าง token

const JWT_SECRET = process.env.JWT_SECRET || 'YCIFj64PmhasqT9lITr5Sq+6B/A1sOYq7/PC5QevZ5w='; // คีย์ลับจาก environment variables

export const POST = async (req: Request) => {
  const { email, password }: { email: string; password: string } = await req.json();

  console.log('Received data:', { email, password });

  // ตรวจสอบว่า email และ password ถูกส่งมาหรือไม่
  if (!email || !password) {
    return new Response(JSON.stringify({ message: 'Email and password are required' }), {
      status: 400,
    });
  }

  try {
    // ค้นหาผู้ใช้จากฐานข้อมูลโดยใช้ email
    const user = await prisma.users.findUnique({
      where: { email },
    });

    // หากไม่พบผู้ใช้
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 400 });
    }

    // ตรวจสอบรหัสผ่านโดยใช้ bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 400 });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ส่ง token กลับไปพร้อมกับการเปลี่ยนเส้นทาง
    const response = new Response(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`, // เก็บ token ใน cookie
      },
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
};
