import { NextRequest, NextResponse } from 'next/server'; // ใช้ NextRequest, NextResponse แทน NextApiRequest, NextApiResponse
import db from '@/lib/db'; // เชื่อมต่อกับฐานข้อมูล

// ฟังก์ชันเพื่อดึงข้อมูลโพสต์ทั้งหมด
export async function GET() {
    try {
      const posts = await db.post.findMany({
        orderBy: {
          createdAt: 'desc', // เรียงลำดับจากโพสต์ล่าสุด
        },
      });
      return NextResponse.json(posts); // ส่งข้อมูลโพสต์กลับ
    } catch (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json({ error: 'Database error while fetching posts' }, { status: 500 });
    }
  }
  

// ฟังก์ชันเพื่อสร้างโพสต์ใหม่
export async function POST(req: NextRequest) {
    const { content } = await req.json(); // ใช้ req.json() เพื่อดึงข้อมูล JSON จาก body ของคำขอ
    
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
  
    try {
      const newPost = await db.post.create({
        data: {
          content,
          createdAt: new Date(),
        },
      });
      return NextResponse.json(newPost, { status: 201 }); // ส่งข้อมูลโพสต์ใหม่กลับ
    } catch (error) {
      console.error('Error creating post:', error);
      return NextResponse.json({ error: 'Database error while creating post' }, { status: 500 });
    }
  }
  
