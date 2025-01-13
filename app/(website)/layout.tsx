'use client';
import { FiUser } from "react-icons/fi";
import Link from "next/link";

export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
      <>
      <div className="w-full h-[100]  flex items-center justify-between">
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
       
        </div>
       
      <div className="">{children}</div>
      </>
    )
  }
  
