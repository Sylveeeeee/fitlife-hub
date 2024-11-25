import React from 'react';
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const AddFoodtoDiary: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div onClick={closeModal}  className="fixed top-0 left-0 right-0 bottom-0 bg-gray-700 bg-opacity-50 flex justify-center items-center font-mono">
        <div className="bg-white p-6 rounded shadow-lg text-black w-[70%] h-[80%] "onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between">
        <h2 className="text-xl font-semibold ">Add Food to Diary</h2>
        <button onClick={closeModal} className="text-[26px] font-black ">
        <IoMdClose />
        </button>
        </div>
        <div className="">sersh</div>
        <div className="">หมวดหมู่</div>
        <div className="">
            <div className="bg-[#0000001c] flex justify-between text-[18px] font-semibold pl-[10]">
                <a className='py-[6] '> Discription</a>
                <a className='py-[6] pr-[100]'> Source</a>
            </div>
            <div className="bg-[#00000009] pl-[10] py-[4] ">Banana</div>
            
        </div>
        
        {/* ส่วนของฟอร์มเพิ่มอาหารหรือข้อมูลอื่นๆ */}
      </div>
    </div>
  );
};

export default AddFoodtoDiary;
