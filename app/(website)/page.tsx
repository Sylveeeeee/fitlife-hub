'use client';
import { VscDiffAdded } from "react-icons/vsc";
import Posts from "./components/Posts";
import WaterTracker from "./components/WaterTracker";
import Card from "./components/Card";

export default function Home() {
    return (
      <>
        <div className="text-black font-mono flex flex-col mx-[200px]">
          <div className="py-[15] text-[24px] mt-[30px] font-semibold">Your Dashboard</div>
          <div className="bg-white w-auto flex justify-between pl-[30] rounded-[4px]">
            <div className="py-[10] font-semibold text-[18px]">Quick Add to Diary</div>
            <div className="flex items-center justify-between w-[60%] mr-[100px] ml-[100px] h-[50px]">
              <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9px] pt-[13px]">
                <div className="mr-[6px]"><VscDiffAdded /></div>FOOD
              </button>
              <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9px] pt-[13px]">
                <div className="mr-[6px]"><VscDiffAdded /></div>EXERCISE
              </button>
              <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9px] pt-[13px]">
                <div className="mr-[6px]"><VscDiffAdded /></div>BIOMETRIC
              </button>
              <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9px] pt-[13px]">
                <div className="mr-[6px]"><VscDiffAdded /></div>NOTE
              </button>
            </div>
          </div>
          <Posts />
          <div className="flex space-x-4">
            <div className="flex-1">
              <WaterTracker />
            </div>
            <Card />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4 mt-10">
          <div className="container mx-auto text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} FitLife Hub. All rights reserved.
            </p>
            <p className="text-xs mt-2">
              Made with ❤️ by JAMJAEW
            </p>
          </div>
        </footer>
      </>
    );
}
