'use client';
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// สร้าง interface สำหรับโครงสร้าง payload
interface JwtPayload {
  userId: number;
  role: string;
}

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log("Decoded payload:", decoded);

        if (decoded.userId) {
          // เรียก API เพื่อดึงข้อมูลผู้ใช้จาก Server
          fetch(`/api/auth/getUser?userId=${decoded.userId}`)
            .then(response => response.json())
            .then(data => {
              if (data && data.role) {
                setUser({
                  userId: data.id,
                  role: data.role,
                });
              } else {
                console.error("User not found or no role in user data");
                setUser(null);
              }
            })
            .catch((error) => {
              console.error("Error fetching user from API:", error);
              setUser(null);
            });
        } else {
          console.error("UserId not found in token payload");
          setUser(null);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    Cookies.remove("token");
    setUser(null);
    window.location.href = "/login";
  };

  const handlePopupToggle = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  return (
    <>
      <div className="w-full h-[100] flex items-center justify-between">
        <div>
          <div className="ml-[100] text-[16px] font-mono text-[#000]">FITLIFE_HUB</div>
        </div>
        <div className="font-mono text-[#000] h-[100] items-center mr-[30] flex">
          <Link href="/">
            <button className="py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent">
              DASHBOARD
            </button>
          </Link>
          <Link href="/diary">
            <button className="py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent">
              DIARY
            </button>
          </Link>
          <Link href="/posts">
            <button className="py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent">
              POST
            </button>
          </Link>
          <button className="py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent">
            BMI
          </button>
          {user ? (
            <div className="flex items-center relative">
              <button
                className="h-[40] w-[120px] text-center rounded-full mx-[10px] flex justify-center items-center bg-[#213A58] text-white"
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

      {isPopupOpen && user && (
        <div className="fixed top-10 right-10 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 rounded-lg">
          <div className="bg-white p-6 rounded-lg w-[300px]">
            <h2 className="text-lg font-bold mb-4">User Profile</h2>
            <div>
              <p>UserId: {user.userId}</p>
              <p>Role: {user.role}</p>
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
              onClick={handlePopupToggle}
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
