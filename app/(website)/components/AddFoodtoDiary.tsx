import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import CategoryButton from "./CategoryButton";

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
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All"); // ตั้งค่าเริ่มต้นเป็น "All"

  // เรียก API เพื่อดึงข้อมูลอาหารตามหมวดหมู่ที่เลือก
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`/api/foods?category=${selectedCategory}`); // ส่งหมวดหมู่ที่เลือกไปใน API
        if (!response.ok) {
          throw new Error("Failed to fetch foods");
        }
        const data = await response.json(); // แปลงข้อมูลที่ได้รับเป็น JSON
        setFoods(data); // เซ็ตข้อมูลที่ได้จาก API
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    if (isOpen) {
      fetchFoods(); // โหลดข้อมูลเมื่อ modal เปิด
    }
  }, [isOpen, selectedCategory]); // เมื่อ isOpen หรือ selectedCategory เปลี่ยนแปลงให้โหลดข้อมูลใหม่

  if (!isOpen) return null; // หาก modal ปิดก็ไม่ต้องแสดงอะไร

  // ฟังก์ชันที่ใช้เปลี่ยนหมวดหมู่ที่เลือก
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category); // เปลี่ยนหมวดหมู่ที่เลือก
  };

  return (
    <div
      onClick={closeModal}
      className="fixed top-0 left-0 right-0 bottom-0 bg-gray-700 bg-opacity-50 flex justify-center items-center font-mono"
    >
      <div
        className="bg-white p-6 rounded shadow-lg text-black w-[70%] h-[80%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Add Food to Diary</h2>
          <button onClick={closeModal} className="text-[26px] font-black">
            <IoMdClose />
          </button>
        </div>
        <div className="py-[5]">Search</div>
        <div className="mt-">
          <div className="flex mb-[5] mt-[9]">
            <div className="">
              {/* ปุ่มหมวดหมู่ */}
              <div className="flex">
                <CategoryButton
                  category="All"
                  selectedCategory={selectedCategory}
                  onClick={handleCategorySelect}
                />
                <CategoryButton
                  category="Favorites"
                  selectedCategory={selectedCategory}
                  onClick={handleCategorySelect}
                />
                <CategoryButton
                  category="Common Foods"
                  selectedCategory={selectedCategory}
                  onClick={handleCategorySelect}
                />
                <CategoryButton
                  category="Beverages"
                  selectedCategory={selectedCategory}
                  onClick={handleCategorySelect}
                />
              </div>
            </div>
          </div>
          <div className="bg-[#0000001c] flex justify-between text-[18px] font-semibold pl-[10]">
            <span className="py-[6]">Description</span>
            <span className="py-[6] pr-[100]">Source</span>
          </div>
          {/* แสดงข้อมูลอาหาร */}
          {foods.length === 0 ? (
            <div className="text-center py-4">No foods available</div>
          ) : (
            foods.map((food) => (
              <div key={food.id} className="bg-[#00000009] pl-[10] py-[4]">
                <div className="flex justify-between"> 
                <div>{food.name}</div>
                <div className="pr-[110] text-center">{food.source}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFoodtoDiary;
