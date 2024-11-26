"use client";
import { VscDiffAdded } from "react-icons/vsc";
import { PiCaretLeft, PiCaretRight,PiCaretDownBold } from "react-icons/pi";
import React, { useState } from 'react';
//import DoughnutChart from "../components/DoughnutChart";
import AddFoodtoDiary from "../components/AddFoodtoDiary";

export default function Diary() {
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
    return (
      <>
      <body className="bg-[#e2e2e2]"></body>
      <div className=" "><AddFoodtoDiary isOpen={isModalOpen} closeModal={closeModal}/></div>
      <div className="">
      <div className= "text-black font-mono flex justify-between mx-[200px]">
        <div className="flex w-[75%] flex-col">
        <div className="bg-white flex pl-[20]">
            <div className="flex items-center justify-between h-[50] flex-wrap">
                <button onClick={openModal} className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]"><div className="mr-[6]"><VscDiffAdded /></div>FOOD</button>
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]"><div className="mr-[6]"><VscDiffAdded /></div>EXERCISE</button>
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]"><div className="mr-[6]"><VscDiffAdded /></div>BIOMETRIC</button>
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]"><div className="mr-[6]"><VscDiffAdded /></div>NOTE</button>
            </div>
        </div>
            <div className="bg-white flex justify-between pl-[10] mt-[7]  ">Uncategorized<button className="mr-[20]"><PiCaretDownBold/></button></div>
            <div className="bg-white flex justify-between pl-[10] mt-[7]  ">Breakfast<button className="mr-[20]"><PiCaretDownBold/></button></div>
            <div className="bg-white flex justify-between pl-[10] mt-[7]  ">Dinner<button className="mr-[20]"><PiCaretDownBold/></button></div>
            <div className="bg-white flex justify-between pl-[10] mt-[7]  ">Snacks<button className="mr-[20]"><PiCaretDownBold/></button></div>
            <div className="bg-white flex pl-[20] mt-[20] w-full py-[20]">
                <div className="w-[50%]">
                    <div className="h-[50] font-semibold text-[20px]">Energy Summary</div>
                    <div className="กราฟ">
                        
                    
                    </div>
                </div>
                <div className="w-[50%] px-[20]">
                <div className="font-semibold text-[20px]">Targets</div>
                <div className="mt-[10] flex justify-between items-center">
                    <div className="w-[30%]">Energy</div>
                    <div className="w-full">
                        <div className="flex justify-between">
                            <div className="">0.0/0.0 kcal</div>
                            <div className="">0%</div>
                        </div>
                        <div className="bg-[#c4c4c4] w-full h-[7]"></div>
                    </div>
                </div>
                <div className="mt-[10] flex justify-between items-center">
                    <div className="w-[30%]">Protein</div>
                    <div className="w-full">
                        <div className="flex justify-between">
                            <div className="">0.0/0.0 kcal</div>
                            <div className="">0%</div>
                        </div>
                        <div className="bg-[#c4c4c4] w-full h-[7]"></div>
                    </div>
                </div>
                <div className="mt-[10] flex justify-between items-center">
                    <div className="w-[30%]">Net Carbs</div>
                    <div className="w-full">
                        <div className="flex justify-between">
                            <div className="">0.0/0.0 kcal</div>
                            <div className="">0%</div>
                        </div>
                        <div className="bg-[#c4c4c4] w-full h-[7]"></div>
                    </div>
                </div>
                <div className="mt-[10] flex justify-between items-center">
                    <div className="w-[30%]">Fat</div>
                    <div className="w-full">
                        <div className="flex justify-between">
                            <div className="">0.0/0.0 kcal</div>
                            <div className="">0%</div>
                        </div>
                        <div className="bg-[#c4c4c4] w-full h-[7]"></div>
                    </div>
                </div>
                </div>

            </div>
        </div>
        <div className="bg-white flex items-center w-[20%] px-[20] justify-between h-[50]">
            <button className="text-[20px]"><PiCaretLeft /></button>
             Time 
            <button className="text-[20px]"><PiCaretRight /></button>
            <button className="text-[20px]"><PiCaretDownBold/></button>
        </div>
        </div> 
        </div>  
      </>
    );
  }
  