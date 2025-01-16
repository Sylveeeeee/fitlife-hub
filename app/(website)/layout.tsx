'use client';
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect } from "react";

// สร้าง interface สำหรับข้อมูลผู้ใช้
interface User {
  username: string;
  email: string;
}

export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState<User | null>(null); // ใช้ User | null เพื่อให้สามารถเป็น null ได้
    const [isPopupOpen, setIsPopupOpen] = useState(false); // สถานะของการเปิด/ปิด popup

    // ใช้ useEffect เพื่อดึงข้อมูลผู้ใช้เมื่อโหลดหน้า
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
          const parts = token.split('.');
          if (parts.length === 3) {
              try {
                  const decoded = atob(parts[1]); // Decode the payload
                  const user = JSON.parse(decoded);
                  setUser(user); // Set user data
              } catch (error) {
                  console.error('Error decoding token:', error);
                  setUser(null); // Clear user data in case of an error
              }
          } else {
              console.error('Invalid token format');
              setUser(null); // Clear user data if the token is malformed
          }
      } else {
          setUser(null); // No token, clear user data
      }
    }, []);
    

    const handleLogout = () => {
        // ลบ token ออกจาก localStorage และรีเฟรชหน้า
        localStorage.removeItem('token');
        window.location.href = '/login'; // เปลี่ยนเส้นทางไปที่หน้า login
    };

    const handlePopupToggle = () => {
        setIsPopupOpen(!isPopupOpen); // เปลี่ยนสถานะ popup
    };

    const handleLoginRedirect = () => {
      // หากยังไม่ได้ล็อกอิน ให้พาผู้ใช้ไปหน้า login
      window.location.href = '/login';
    };

    return (
      <>
      <div className="w-full h-[100]  flex items-center justify-between ">
        <div className="">
          <div className = "  ml-[100]  text-[16px] font-mono text-[#000]">FITLIFE_HUB  </div>
        </div>
        <div className="font-mono text-[#000] h-[100] items-center mr-[30] flex">
        <Link href = "/">
          <button className = "py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent">DASHBOARD</button>
        </Link>
        <Link href = "/diary">
          <button className = "py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent">DIARY</button>
        </Link>       
          <button className = "py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent">ABOUT</button>
           <button className = "py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent">BMI</button>
        <Link href = "/login">
         <button className = "h-[70] w-[70]  text-center rounded-full mx-[10px] flex justify-center items-center">
            <div className="text-[30px]"><FiUser /></div>
          </button>
        </Link>
        </div>

        {/* Popup ที่จะเปิดเมื่อกดปุ่ม Profile */}
        {isPopupOpen && user && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[300px]">
              <h2 className="text-lg font-bold mb-4">User Profile</h2>
              <div>
                <p>Email: {user.email}</p>
                {/* เพิ่มช่องทางการแก้ไขข้อมูลที่ต้องการ */}
                <Link href="/edit-profile">
                  <button className="w-full bg-[#213A58] text-white mt-4 p-2 rounded-md">
                    Edit Profile
                  </button>
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white mt-4 p-2 rounded-md"
              >
                Logout
              </button>
              <button
                onClick={handlePopupToggle} // ปิด popup
                className="w-full bg-gray-300 text-black mt-4 p-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div>{children}</div>
      </>
    );
}
