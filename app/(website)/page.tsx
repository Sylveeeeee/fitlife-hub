import { VscDiffAdded } from "react-icons/vsc";


export default function Home() {
    return (
      <>
      <div className= "text-black font-mono flex flex-col mx-[200px]  ">
       <div className="py-[15] text-[24px] mt-[30px] font-semibold">Your Dashboard</div>
       <div className="bg-white w-auto flex justify-between pl-[30] rounded-[4npm install react-icons --save] ">
        <div className="py-[10]  font-semibold text-[18px]">Quick Add to Diary</div>
        <div className="flex items-center justify-between w-[60%] mr-[100] ml-[100] h-[50]">
          <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13]"><div className="mr-[6]"><VscDiffAdded /></div>FOOD</button>
          <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13]"><div className="mr-[6]"><VscDiffAdded /></div>EXERCISE</button>
          <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13]"><div className="mr-[6]"><VscDiffAdded /></div>BIOMETRIC</button>
          <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13]"><div className="mr-[6]"><VscDiffAdded /></div>NOTE</button>
        </div>
       </div>
        </div>        
      </>
    );
  } 
