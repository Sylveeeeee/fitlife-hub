import { VscDiffAdded } from "react-icons/vsc";
import { PiCaretLeft, PiCaretRight,PiCaretDownBold } from "react-icons/pi";


export default function Diary() {
    return (
      <>
      <body className="bg-[#e2e2e2]"></body>
      <div className= "text-black font-mono flex justify-between mx-[200px]">
        <div className="bg-white flex pl-[20] w-[75%] mr-[20] flex-col">
            <div className="flex items-center justify-between h-[50] flex-wrap">
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]"><div className="mr-[6]"><VscDiffAdded /></div>FOOD</button>
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]"><div className="mr-[6]"><VscDiffAdded /></div>EXERCISE</button>
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]"><div className="mr-[6]"><VscDiffAdded /></div>BIOMETRIC</button>
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]"><div className="mr-[6]"><VscDiffAdded /></div>NOTE</button>
            </div>
            <div className="bg-black flex pl-[20]">sadasda</div>
        </div>
        <div className="bg-white flex items-center w-[20%] px-[20] justify-between">
            <button className="text-[20px]"><PiCaretLeft /></button>
             Time 
            <button className="text-[20px]"><PiCaretRight /></button>
            <button className="text-[20px]"><PiCaretDownBold/></button>
        </div>
        </div>        
      </>
    );
  }
  