'use client';
import { useState, useEffect } from 'react';

interface Post {
  id: number;
  content: string;
  createdAt: string;
}

export default function Post() {
  const [, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');

  // ดึงข้อมูลโพสต์จาก API เมื่อ component โหลดครั้งแรก
  useEffect(() => {
    fetchPosts();
  }, []); 

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/auth/posts'); // เรียก API
      const data = await response.json();
      setPosts(data.reverse()); // เรียงโพสต์ใหม่จากล่าสุดไปเก่าสุด
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Content cannot be empty!');
      return;
    }

    try {
      // ส่งข้อมูลโพสต์ไปยัง API
      const response = await fetch('/api/auth/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }), // ส่งข้อมูล content
      });

      if (response.ok) {
        setContent(''); // เคลียร์ข้อความ
        fetchPosts(); // ดึงโพสต์ใหม่หลังจากเพิ่ม
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="w-full text-black text-[25px] font-bold mb-[1px] mt-[10px] ml-[7px]">DAILY POST NOTE</h1>
      <form onSubmit={handlePostSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full h-32 p-4 border border-gray-300 rounded-md resize-none"
        />
        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded-md hover:bg-[#000000d5] hover:text-white"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
}
