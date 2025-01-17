// pages/home.tsx
'use client';
import { useState, useEffect } from 'react';

// กำหนดประเภทของโพสต์
interface Post {
  id: number;
  content: string;
  createdAt: string;
}

export default function Post() {
  const [posts, setPosts] = useState<Post[]>([]); // กำหนดประเภทของ posts
  const [content, setContent] = useState<string>(''); // กำหนดประเภทของ content

  // ดึงข้อมูลโพสต์จาก API เมื่อ component โหลดครั้งแรก
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/auth/posts'); // เรียก API
      const data: Post[] = await response.json(); // กำหนดประเภทของ data
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
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id}>
              <p>{post.content}</p>
              <small>{`Posted on: ${new Date(post.createdAt).toLocaleString()}`}</small>
            </div>
          ))
        ) : (
          <p>No posts yet. Write something to get started!</p>
        )}
      </div>
    </div>
  );
}
