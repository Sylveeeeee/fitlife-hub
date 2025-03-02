'use client';
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface JwtPayload {
  userId: bigint;
  role: string;
  email: string;
}

export default function Navbar() {
  const [user, setUser] = useState<JwtPayload | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true); // สร้าง state สำหรับการโหลด
    const pathname = usePathname(); // ดึง path ปัจจุบัน เช่น "/diary"
  
    useEffect(() => {
    
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/auth/protected', {
            method: 'GET',
            credentials: 'include', // ส่ง httpOnly cookie ไปพร้อมกับ request
          });
  
          if (response.ok) {
            const data = await response.json();
            if (data && data.userId && data.role) {
              const role = typeof data.role === 'object' ? data.role.name : data.role;
  
              setUser({
                userId: data.userId,
                role: data.role,
                email: data.email,
              });
              if (role.toLowerCase() === 'admin') {
              }
            } else {
              console.error("Invalid user data from server");
              setUser(null);
            }
          } else if (response.status === 401) {
            console.log("Unauthorized: No valid session");
            setUser(null);
          } else {
            console.error("Unexpected server error:", response.status);
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data from server:", error);
          setUser(null);
        }
      };
      
  
      fetchUserData();
      setTimeout(() => {
        setLoading(false); // เปลี่ยนสถานะการโหลดเมื่อโหลดเสร็จ
      }, 2000);
      
    }, [isPopupOpen]);
  
    async function handleLogout() {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to logout');
        }
  
        // ถ้าการ logout สำเร็จ
        console.log('Logout successful');
        window.location.reload();  // หรือคุณอาจจะใช้ redirect ไปหน้าอื่น
      } catch (error) {
        console.error(error);
        alert('Error: Failed to logout');
      }
    }
  
    const handleOutsideClick = (e: React.MouseEvent) => {
      // ถ้าคลิกนอก component ให้ปิด popup
      if (e.target === e.currentTarget) {
        setIsPopupOpen(false);  // ปิด popup
      }
    };
  
    const handlePopupToggle = () => {
      setIsPopupOpen(!isPopupOpen);
    };
  
    const handleLoginRedirect = () => {
      window.location.href = "/login";
    };
  
  
    useEffect(() => {
      if (isPopupOpen) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
      return () => document.body.classList.remove("overflow-hidden");
    }, [isPopupOpen]);
  
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen ">
          {/* แสดง spinner หรือข้อความระหว่างที่โหลด */}
          <div className="loader text-black">Loading...</div>
        </div>
      );
    }
  
  return (
    <>
      <div
        className="w-full h-[100px] flex items-center justify-between px-10"
        onClick={handleOutsideClick}
      >
        <Link href="/">
        <div className="flex items-center  ">
          <Image
            src="/logo.png" // ใส่ Path ของรูปภาพของคุณ
            alt="FitLifeHub Logo"
            width={130} // ปรับขนาดของรูปภาพ
            height={100} // ปรับขนาดของรูปภาพ
            className="mr-2 rounded-[20px]"
          />        
        </div>
        </Link>
        <div className="font-mono text-[#000] h-[100px] items-center flex">
      <Link href="/">
        <button
          className={`py-[10px] px-[50px] text-center mx-[10px] border-b-4 hover:bg-[#0000000a] hover:font-bold hover:text-[#213A58] ${
            pathname === "/" ? "border-[#213A58] text-[#213A58] font-bold" : "border-transparent " 
          }`}
        >
          DASHBOARD
        </button>
      </Link>
      <Link href="/diary">
        <button
          className={`py-[10px] px-[50px] text-center mx-[10px] border-b-4 hover:bg-[#0000000a] hover:font-bold hover:text-[#213A58] ${
            pathname === "/diary" ? "border-[#213A58] text-[#213A58] font-bold" : "border-transparent"
          }`}
        >
          DIARY
        </button>
      </Link>
      <Link href="/posts">
        <button
          className={`py-[10px] px-[50px] text-center mx-[10px] border-b-4 hover:bg-[#0000000a] hover:font-bold hover:text-[#213A58] ${
            pathname === "/posts" ? "border-[#213A58] text-[#213A58] font-bold" : "border-transparent"
          }`}
        >
          POST
        </button>
      </Link>
      <Link href="/BMI">
        <button
          className={`py-[10px] px-[50px] text-center mx-[10px] border-b-4 hover:bg-[#0000000a]  hover:font-bold hover:text-[#213A58] ${
            pathname === "/BMI" ? "border-[#213A58] text-[#213A58] font-bold  " : "border-transparent  "
          }`}
        >
          CALCULATOR
        </button>
      </Link>
          {user ? (
            <div className="flex items-center relative ">
              <button
                className="py-[10px] px-[50px] text-center hover:text-[#213A58]  hover:bg-[#0000000a] border-b-4 border-transparent hover:font-bold"
                onClick={handlePopupToggle}
              >
                Account
              </button>
            </div>
          ) : (
            <button
              className="h-[40px] w-[40px] text-center rounded-full  flex justify-center items-center"
              onClick={handleLoginRedirect}
            >
              <div className="text-[30px]">
                <FiUser />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Popup */}
      {isPopupOpen && user && (
        <div
          className="fixed w-full h-full top-16 flex justify-center items-center font-mono text-[#000] z-[9999]"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-white p-6 w-[400px] shadow-lg fixed top-20 right-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Current Account</h2>
            <div>
              <p>Email: {user.email}</p>
              <Link href="/profile">
                <button className="w-full bg-[#000000] text-white mt-4 p-2 hover:shadow-md hover:shadow-[#000000cc] ">
                  Targets+Profile
                </button>
              </Link>
              {user.role.toLowerCase() === "admin" && (
                <Link href="/admin/dashboard">
                  <button className="w-full bg-[#213A58] text-white mt-4 p-2 hover:shadow-md hover:shadow-[#213A58cc] ">
                    Admin Dashboard
                  </button>
                </Link>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white mt-4 p-2 hover:shadow-md hover:shadow-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
