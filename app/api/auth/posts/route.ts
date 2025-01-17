import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/lib/prisma'; // สร้าง Prisma Client ใน lib/prisma.ts

// Handle GET and POST Requests
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // ดึงข้อมูลโพสต์ทั้งหมดจาก Prisma
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' }, // เรียงจากใหม่ไปเก่า
      });
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  } else if (req.method === 'POST') {
    try {
      const { content } = req.body;

      if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Content is required' });
      }

      // สร้างโพสต์ใหม่ใน Prisma
      const newPost = await prisma.post.create({
        data: { content },
      });

      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
