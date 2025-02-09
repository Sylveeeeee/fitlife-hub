"use client";
import { useEffect, useState } from "react";

interface PostPage {
  id: number; // หรือ string หาก id เป็น string ในฐานข้อมูล
  content: string;
  createdAt: string;
}

export default function PostPage() {
  const [posts, setPosts] = useState<PostPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/auth/posts");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      alert("There was an error loading the posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับลบโพสต์
  const deletePost = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/auth/posts?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // อัปเดต state หลังจากลบโพสต์สำเร็จ
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-wrap gap-4 justify-start ml-[140px] font-mono">
      {posts.length === 0 ? (
        <p className="text-black text-[30px] flex items-center justify-center min-h-screen ml-[500px]">
          No posts available!
        </p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="w-[300px] h-auto rounded overflow-hidden shadow-lg bg-white">
            <div className="bg-black text-white w-auto pl-[10px] py-1 font-bold">
              NOTE
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700 text-base break-words whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
            <div className="px-6 py-4 flex justify-between items-center">
              <span className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleString()}
              </span>
              {/* ปุ่มลบโพสต์ */}
              <button
                onClick={() => deletePost(post.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-[12px]"
              >
                🗑
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
