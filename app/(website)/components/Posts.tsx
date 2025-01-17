// pages/home.tsx
'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  // ดึงข้อมูลโพสต์จาก API เมื่อ component โหลดครั้งแรก
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts'); // เรียก API
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
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setContent('');
        fetchPosts(); // ดึงโพสต์ใหม่หลังจากเพิ่ม
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <h1>DAILY POST</h1>
      <form onSubmit={handlePostSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <p>{post.content}</p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
