"use client";
import { useEffect, useState } from "react";

interface PostPage {
  id: number; // หรือ string หาก `id` เป็น string ในฐานข้อมูล
  content: string;
  createdAt: string; // หรือ Date หาก Prisma ส่งข้อมูล `DateTime` มาโดยตรง
}

export default function PostPage() {
  const [posts, setPosts] = useState<PostPage[]>([]); // สร้าง state เพื่อเก็บข้อมูลโพสต์
  const [loading, setLoading] = useState(true); // สร้าง state สำหรับการโหลดข้อมูล

  // ดึงข้อมูลโพสต์จาก API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/auth/posts");
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`); // ให้ throw เมื่อมี error จาก API
        }
  
        const data = await response.json();
        setPosts(data); // เก็บข้อมูลโพสต์
      } catch (error) {
        console.error("Error fetching posts:", error);
        alert("There was an error loading the posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, []); // ทำครั้งเดียวเมื่อ component โหลด
  

  if (loading) {
    return <div>Loading...</div>; // ถ้ากำลังโหลดข้อมูลแสดงข้อความนี้
  }

  return (
    <>
    <div className="flex flex-wrap gap-4 justify-start ml-[140px] font-mono">
  {posts.length === 0 ? (
    <p className="text-black text-[30px] flex items-center justify-center min-h-screen ml-[500px]">
    No posts available!
  </p>
  // หากไม่มีโพสต์จะแสดงข้อความนี้
  ) : (
    posts.map((post) => (
      <div key={post.id} className="w-[300px] h-auto rounded overflow-hidden shadow-lg bg-white">
        <div className="bg-black w-auto pl-[10px]">NOTE </div>
        <div className="px-6 py-4">
          <p className="text-gray-700 text-base">{post.content}</p>
        </div>                                                 
        <div className="px-6 py-4 flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            {new Date(post.createdAt).toLocaleString()} {/* แสดงวันที่ */}
          </span>
        </div>
      </div>
    ))
  )}
</div>


    </>
  );
}
