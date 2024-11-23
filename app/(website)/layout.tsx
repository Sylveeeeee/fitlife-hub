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
      <div className="w-full h-[100]  flex items-center justify-between">
        <div className="">
          <div className = " pr-[500] ml-[100] text-[16px] font-mono text-[#000]">FITLIFE_HUB  </div>
        </div>
        <div className="font-mono text-[#000] h-[100] items-center mr-[30]">
            <button className = "mt-[15] py-[20] px-[50] text-center hover:text-[#213A58] hover:border-b-2 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a]">HOME</button>
            <button className = "py-[20] px-[50] text-center hover:text-[#213A58] hover:border-b-2 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a]">ABOUT</button>
            <button className = "py-[20] px-[50] text-center hover:text-[#213A58] hover:border-b-2 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a]">BMI</button>
            <button className = "py-[20] px-[50] text-center hover:text-[#213A58] hover:border-b-2 hover:border-[#213A58] mx-[10px] hover:bg-[#0000000a]">SETTING</button>
            <button className = "h-[70] w-[70] bg-[#213A58] text-white  text-center rounded-full mx-[10px] hover:text-[#213A58] hover:bg-[#ffffff] hover:rounded-[40px] hover:border-solid border-2 border-[#213A58] ...">
            PROFILE</button>
        </div>
       
        </div>
       
      <div className="">{children}</div>
      </>
    )
  }
  
