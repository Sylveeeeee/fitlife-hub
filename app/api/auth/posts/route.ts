// pages/api/auth/posts.ts
import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db'; // นำเข้าการเชื่อมต่อกับฐานข้อมูลจาก lib/db.ts

// ฟังก์ชันเพื่อดึงข้อมูลโพสต์ทั้งหมด
const getPosts = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // ใช้ PrismaClient เพื่อดึงข้อมูลโพสต์ทั้งหมดจากฐานข้อมูล
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: 'desc', // เรียงลำดับจากโพสต์ล่าสุด
      },
    });
    res.status(200).json(posts); // ส่งข้อมูลโพสต์กลับ
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Database error while fetching posts' });
  }
};

// ฟังก์ชันเพื่อสร้างโพสต์ใหม่
const createPost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    // ใช้ PrismaClient เพื่อสร้างโพสต์ใหม่ในฐานข้อมูล
    const newPost = await db.post.create({
      data: {
        content,
        createdAt: new Date(),
      },
    });
    res.status(201).json(newPost); // ส่งข้อมูลโพสต์ใหม่กลับ
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Database error while creating post' });
  }
};

// ฟังก์ชันสำหรับการจัดการ API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getPosts(req, res); // ดึงโพสต์ทั้งหมด
  } else if (req.method === 'POST') {
    return createPost(req, res); // สร้างโพสต์ใหม่
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
