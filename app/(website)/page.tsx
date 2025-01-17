'use client';
import { VscDiffAdded } from "react-icons/vsc";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Posts from "./components/Posts";


export default function Home() {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
  
    // ดึงข้อมูลโพสต์จาก API เมื่อ Component โหลดครั้งแรก
    useEffect(() => {
      fetchPosts();
    }, []);
  
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts'); // เรียก API
        setPosts(response.data.reverse()); // เรียงโพสต์ใหม่จากล่าสุดไปเก่าสุด
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    const handlePostSubmit = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      if (!content.trim()) {
        alert('Content cannot be empty!');
        return;
      }
  
      try {
        await axios.post('/api/posts', { content }); // ส่งข้อมูลโพสต์ไปยัง API
        setContent(''); // เคลียร์ input
        fetchPosts(); // ดึงโพสต์ใหม่หลังจากเพิ่ม
      } catch (error) {
        console.error('Error creating post:', error);
      }
    };
  
  
    return (
      <>
      <div className= "text-black font-mono flex flex-col mx-[200px]  ">
       <div className="py-[15] text-[24px] mt-[30px] font-semibold">Your Dashboard</div>
       <div className="bg-white w-auto flex justify-between pl-[30] rounded-[4npm install react-icons --save] ">
        <div className="py-[10]  font-semibold text-[18px]">Quick Add to Diary</div>
        <div className="flex items-center justify-between w-[60%] mr-[100] ml-[100] h-[50]">
          <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13]"><div className="mr-[6]"><VscDiffAdded /></div>FOOD</button>
          <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13]"><div className="mr-[6]"><VscDiffAdded /></div>EXERCISE</button>
          <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13]"><div className="mr-[6]"><VscDiffAdded /></div>BIOMETRIC</button>
          <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13]"><div className="mr-[6]"><VscDiffAdded /></div>NOTE</button>
        </div>
       </div>
       <Posts />
        </div>        
      </>
    );
  } 
