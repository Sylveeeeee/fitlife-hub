'use client';
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

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
    const [user, setUser] = useState<User | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        console.log('Token from cookies:', token); // ตรวจสอบว่า token ได้รับจาก cookies หรือไม่
        if (token) {
            const parts = token.split('.');
            if (parts.length === 3) {
                try {
                    const decoded = atob(parts[1]); // Decode the payload
                    const user = JSON.parse(decoded);
                    setUser(user); // Set user data
                    console.log('Decoded user:', user); // ตรวจสอบข้อมูลผู้ใช้ที่ได้รับ
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
        console.log('Logging out...');
        Cookies.remove('token'); // Remove token from cookies
        console.log('Token removed, redirecting to login page');
        window.location.href = '/login'; // Redirect to login page
    };

    const handlePopupToggle = () => {
        setIsPopupOpen(!isPopupOpen); // Toggle the popup state
    };

    const handleLoginRedirect = () => {
        window.location.href = '/login'; // Redirect to login page if not logged in
    };
    
    return (
        <>
            <div className="w-full h-[100] flex items-center justify-between">
                <div className="">
                    <div className="ml-[100] text-[16px] font-mono text-[#000]">FITLIFE_HUB</div>
                </div>
                <div className="font-mono text-[#000] h-[100] items-center mr-[30] flex">
                    <Link href="/">
                        <button className="py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent">DASHBOARD</button>
                    </Link>
                    <Link href="/diary">
                        <button className="py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent">DIARY</button>
                    </Link>
                    <Link href="/posts">
                        <button className="py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent">POST</button>
                    </Link>
                    <button className="py-[10] px-[50] text-center hover:text-[#213A58] hover:border-b-4 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a] border-b-4 border-transparent">BMI</button>
                    <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 text-white mt-4 p-2 rounded-md"
                        >
                            Logout
                        </button>
                    {/* แสดงข้อมูลผู้ใช้หรือแสดง icon login */}
                    {user ? (
                        <div className="flex items-center relative">
                            <button
                                className="h-[40] w-[120px] text-center rounded-full mx-[10px] flex justify-center items-center bg-[#213A58] text-white"
                                onClick={handlePopupToggle} // เปิด/ปิด popup
                            >
                                Account
                            </button>
                        </div>
                    ) : (
                        <button
                            className="h-[40] w-[40] text-center rounded-full mx-[10px] flex justify-center items-center"
                            onClick={handleLoginRedirect} // ถ้ายังไม่ได้ล็อกอินให้ไปหน้า login
                        >
                            <div className="text-[30px]"><FiUser /></div>
                        </button>
                    )}
                </div>
            </div>

            {/* Modal Popup ที่จะเปิดเมื่อกดปุ่ม Account */}
            {isPopupOpen && user && (
                <div className="fixed top-10 right-10 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 rounded-lg">
                    <div className="bg-white p-6 rounded-lg w-[300px]">
                        <h2 className="text-lg font-bold mb-4">User Profile</h2>
                        <div>
                            <p>Email: {user.email}</p>
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
