'use client';
import { VscDiffAdded } from "react-icons/vsc";
import Posts from "./components/Posts";

export default function Home() {
    return (
        <>
            <div className="text-black font-mono flex flex-col px-10 lg:px-40">
                <div className="py-[15px] text-[24px] mt-[30px] font-semibold">Your Dashboard</div>
                <div className="bg-white w-full flex justify-between pl-[30px]  ">
                    <div className="py-[10px] font-semibold text-[18px]">Quick Add to Diary</div>
                    <div className="flex items-center justify-between space-x-4 w-[60%] pr-[30px]">
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
            </div>
        </>
    );
}
