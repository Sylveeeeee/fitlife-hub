import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

interface Food {
  id: number;
  name: string;
  description: string;
  source: string;
}

const AddFoodtoDiary: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
  const [foods, setFoods] = useState<Food[]>([]); // State เพื่อเก็บข้อมูลอาหาร
  const [loading, setLoading] = useState<boolean>(false); // State สำหรับการโหลดข้อมูล
  const [error, setError] = useState<string | null>(null); // State สำหรับแสดงข้อผิดพลาด

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/foods'); // เรียก API ที่สร้างขึ้นใน Next.js
        if (!response.ok) {
          throw new Error('Failed to fetch foods');
        }
        const data = await response.json();
        setFoods(data); // เซ็ตข้อมูลที่ได้รับจาก API ลงใน state
      } catch (error) {
        setError('Error fetching foods: ' + error.message); // แสดงข้อผิดพลาดหากเกิดปัญหา
      } finally {
        setLoading(false); // หยุดการโหลด
      }
    };

    if (isOpen) {
      fetchFoods(); // โหลดข้อมูลเมื่อ modal เปิด
    }
  }, [isOpen]); // เมื่อ isOpen เปลี่ยน จะทำการดึงข้อมูลใหม่

  if (!isOpen) return null; // หาก modal ปิด จะไม่แสดงอะไร

  return (
    <div onClick={closeModal} className="fixed top-0 left-0 right-0 bottom-0 bg-gray-700 bg-opacity-50 flex justify-center items-center font-mono">
      <div className="bg-white p-6 rounded shadow-lg text-black w-[70%] h-[80%]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Add Food to Diary</h2>
          <button onClick={closeModal} className="text-[26px] font-black">
            <IoMdClose />
          </button>
        </div>
        <div className="">{loading ? 'Loading...' : error ? error : 'Search'}</div>
        <div className="">{loading ? 'Loading categories...' : 'Category'}</div>
        <div className="">
          <div className="bg-[#0000001c] flex justify-between text-[18px] font-semibold pl-[10]">
            <a className="py-[6]">Description</a>
            <a className="py-[6] pr-[100]">Source</a>
          </div>
          {foods.map((food) => (
            <div key={food.id} className="bg-[#00000009] pl-[10] py-[4]">{food.name}</div>
          ))}
        </div>
        
        {/* ส่วนของฟอร์มเพิ่มอาหารหรือข้อมูลอื่นๆ */}
      </div>
    </div>
  );
};

export default AddFoodtoDiary;
