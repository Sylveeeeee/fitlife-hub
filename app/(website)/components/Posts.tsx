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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/auth/posts');
      const data = await response.json();
      setPosts(data.reverse());
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
      const response = await fetch('/api/auth/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setContent('');
        fetchPosts();
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="flex justify-center p-4">
      <div className="w-full bg-white shadow-md rounded-lg p-6 grid grid-cols-2 gap-6">
        {/* ส่วนโพสต์ด้านซ้าย */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">📝 DAILY POST NOTE</h1>
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-32 p-4 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
            <button
              type="submit"
              className="w-full py-2 bg-black text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300"
            >
              SUBMIT
            </button>
          </form>
        </div>

        {/* ส่วนรูปภาพด้านขวา */}
        <div className="flex justify-center items-center">
        <div className="text-center m-5 p-6 w-full max-w-sm md:max-w-md lg:max-w-lg bg-gradient-to-r from-black to-blue-400 rounded-xl h-auto min-h-[220px] shadow-xl flex flex-col items-center text-white">
        <p className="text-[40px] mt-[56px] font-mono">
        FITLIFE-HUB
        </p>
      </div>
        </div>
      </div>
    </div>
  );
}
