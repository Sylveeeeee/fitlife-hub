'use client';
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

interface JwtPayload {
  userId: bigint;
  role: string;
  email: string;
}

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
  }, []);

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

  return (
    <>
      <div
        className="w-full h-[100] flex items-center justify-between"
        onClick={handleOutsideClick}
      >
        <div className="flex items-center ml-[100]">
          <Image
            src="/logo.png" // ใส่ Path ของรูปภาพของคุณ
            alt="FitLifeHub Logo"
            width={40} // ปรับขนาดของรูปภาพ
            height={40} // ปรับขนาดของรูปภาพ
            className="mr-2 rounded-[20px]"
          />        
          <Link href="/"><div className="text-[16px] font-mono text-[#000]">FITLIFE_HUB</div></Link>
          
        </div>
        <div className="font-mono text-[#000] h-[100] items-center mr-[30] flex">
          <Link href="/">
            <button className="py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent hover:font-bold">
              DASHBOARD
            </button>
          </Link>
          <Link href="/diary">
            <button className="py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent hover:font-bold">
              DIARY
            </button>
          </Link>
          <Link href="/posts">
            <button className="py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent hover:font-bold">
              POST
            </button>
          </Link>
          <Link href="/BMI">
            <button className="py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent hover:font-bold">
              CALCULATOR
            </button>
          </Link>
          {user ? (
            <div className="flex items-center relative ">
              <button
                className="py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent hover:font-bold"
                onClick={handlePopupToggle}
              >
                Account
              </button>
            </div>
          ) : (
            <button
              className="h-[40px] w-[40px] text-center rounded-full mx-[10px] flex justify-center items-center"
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
          className="fixed w-full h-full top-16 flex justify-center items-center font-mono text-[#000]"
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

      <div>{children}</div>
    </>
  );
}
