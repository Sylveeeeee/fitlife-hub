'use client';
import { VscDiffAdded } from "react-icons/vsc";
import { useState, useEffect } from 'react';
import axios from 'axios';


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  // ดึงข้อมูลโพสต์จาก API
  useEffect(() => {
      fetchPosts();
  }, []);

  const fetchPosts = async () => {
      try {
          const response = await axios.get('/api/posts');
          setPosts(response.data.reverse());
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
          await axios.post('/api/posts', { content });
          setContent('');
          fetchPosts();
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
       <div style={{ padding: '20px', marginTop:'20px', backgroundColor:'#ffffff', fontSize:'20px' }}>
            <h1 className="mb-[10px] ml-[5px] font-semibold">DAILY POST</h1>
            <form onSubmit={handlePostSubmit} style={{ marginBottom: '0px' }}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor:'#b9b9b9'  }}
                ></textarea>
                <button type="submit"className="bg-transparent border-[1px] border-black px-[5px] py-[5px] ml-[3px] rounded-[5px] font-fantasy hover:text-[#ffffff] hover:bg-black" >
                    SUBMIT
                </button>
                
            </form>
            <div>
                {posts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                            border: '1px solid #ccc',
                            padding: '10px',
                            marginBottom: '10px',
                            borderRadius: '5px',
                        }}
                    >
                        <p>{post.content}</p>
                        <small>{new Date(post.createdAt).toLocaleString()}</small>
                    </div>
                ))}
            </div>
        </div>
        </div>        
      </>
    );
  } 
