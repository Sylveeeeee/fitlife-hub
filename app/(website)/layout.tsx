'use client';

import { useRouter } from 'next/router';

const ProfileButton = () => {
    const router = useRouter();

    const handleNavigate = () => {
        router.push('/login'); 
    };}
export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
      <>
      <div className="w-full h-[auto] bg-[transparent] ">
        <div className=" text-black py-[30px] w-auto pr-[10px] text-[12px] px-[10px] flex justify-start ... ">
        <div className = "py-[10] text-left pr-[500] ml-[100] text-[16px] font-mono">FITLIFE_HUB</div>
          <button className = "flex-[0.2] py-[10] mt-[5] text-center hover:bg-[#213A58] hover:text-white rounded-[40px] mx-[10px]">HOME</button>
          <button className = "flex-[0.2] py-[10] mt-[5] text-center hover:bg-[#213A58] hover:text-white rounded-[40px] mx-[10px]">ABOUT</button>
          <button className = "flex-[0.2] py-[10] mt-[5] text-center hover:bg-[#213A58] hover:text-white rounded-[40px] mx-[10px]">BMI</button>
          <button className = "flex-[0.2] py-[10] mt-[5] text-center hover:bg-[#213A58] hover:text-white rounded-[40px] mx-[10px] ">SETTING</button>
          <button className = "flex-[0.2] py-[10] mt-[5] bg-[#213A58] text-white  text-center rounded-[40px] mx-[10px] hover:text-[#213A58] hover:bg-[#ffffff] hover:rounded-[40px] hover:border-solid border-2 border-[#213A58] ...">
          PROFILE</button>
        </div>
        
      </div>
      <div className="">{children}</div>
      </>
    )
  }
  
