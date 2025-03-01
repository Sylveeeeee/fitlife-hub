'use client';
import Posts from "./components/Posts";
import WaterTracker from "./components/WaterTracker";
import Card from "./components/Card";
import Link from "next/link";
import BiometricChart from "./components/BiometricChart";
import EnergyHistoryChart from "./components/EnergyHistoryChart"

export default function Home() {


    return (
      <>
      
        <div className="text-black font-mono flex flex-col mx-[200px]">
          <div className="py-[15px] text-[24px] mt-[30px] font-semibold">Your Dashboard</div>
          <div className="bg-white w-auto flex justify-between pl-[30px] rounded-[4px]">
            <div className="py-[10px] font-semibold text-[18px] flex justify-center items-center">Quick Add to Diary</div>
            <div className="flex items-center justify-between w-[60%] mr-[100px] ml-[100px] h-[50px]">
              <Link href="/diary" >
              <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9px] pt-[13px]">
                <div className="mr-[6px]">🍎</div>FOOD
              </button>
              </Link>
              <Link  href='/diary'>
              <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9px] pt-[13px]">
                <div className="mr-[6px]">💪🏼</div>EXERCISE
              </button>
              </Link>
              <Link href='/diary'>
              <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9px] pt-[13px]">
                <div className="mr-[6px]">🧬</div>BIOMETRIC
              </button>
              </Link>
              <Link href="/posts">
              <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9px] pt-[13px]">
                <div className="mr-[6px]">📝</div>NOTE
              </button>
              </Link>
              
            </div>
          </div>
          < div className="flex justify-between">
          <BiometricChart />
          <EnergyHistoryChart />
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
              Made with ❤️ by FITDREAM
            </p>
          </div>
        </footer>
      </>
    );
}
