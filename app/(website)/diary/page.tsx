"use client";
import { VscDiffAdded } from "react-icons/vsc";
import { PiCaretLeft, PiCaretRight, PiCaretDownBold,} from "react-icons/pi";
import React, { useState, useMemo, useEffect } from 'react';
import AddFoodtoDiary from "../components/AddFoodtoDiary";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import EnergySummary from "../components/EnergySummary";
import FoodDiaryCalendar from "../components/FoodDiaryCalendar";
import { format } from "date-fns"; 
import Link from "next/link";

interface FoodEntry {
  id: number;
  name: string;
  unit?: string;
  servingSize: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DiaryEntry {
  foodId: number;
  food: FoodEntry; // ✅ ใช้ FoodEntry ที่มีอยู่แล้ว
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
}

export default function Diary() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // ✅ ให้แน่ใจว่า selectedDate เป็น Date object
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
  const [editingEntry, setEditingEntry] = useState<{ group: string; index: number } | null>(null);
  const [editValue, setEditValue] = useState<number | "">(""); // ใช้ "" เพื่อให้รองรับ input ที่ว่าง
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);


  const startEditing = (group: string, index: number, currentValue: number) => {
    setEditingEntry({ group, index });
    setEditValue(currentValue);
  };

  const saveEdit = async () => {
    if (!editingEntry) return;
  
    const { group, index } = editingEntry;
    const newServingSize = Number(editValue) || 0;
  
    // ✅ อัปเดต State โดยคำนวณค่าใหม่
    setDiaryEntries((prevEntries) => {
      const updatedEntries = { ...prevEntries };
      updatedEntries[group] = [...prevEntries[group]];
      updatedEntries[group][index] = {
        ...prevEntries[group][index],
        servingSize: newServingSize,
        calories: (prevEntries[group][index].calories / prevEntries[group][index].servingSize) * newServingSize,
        protein: (prevEntries[group][index].protein / prevEntries[group][index].servingSize) * newServingSize,
        carbs: (prevEntries[group][index].carbs / prevEntries[group][index].servingSize) * newServingSize,
        fat: (prevEntries[group][index].fat / prevEntries[group][index].servingSize) * newServingSize,
      };
      return updatedEntries;
    });
  
    setEditingEntry(null);
  };
  

  const handleDateChange = (direction: "prev" | "next") => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(direction === "prev" ? prevDate.getDate() - 1 : prevDate.getDate() + 1);
      return newDate;
    });
  };

  const [itemToDelete, setItemToDelete] = useState<{
    group: string;
    index: number;
    name: string;
  } | null>(null);

  const [diaryEntries, setDiaryEntries] = useState<{
    [key: string]: { id: number; name: string; servingSize: number; calories: number; protein: number; carbs: number; fat: number; unit?: string }[];
  }>({
    Uncategorized: [],
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });

  // State สำหรับเก็บ dailyCalorieGoal
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState<number>(0);

  const totals = useMemo(() => {
    const totalValues = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    Object.values(diaryEntries).forEach((group) => {
      group.forEach((entry) => {
        totalValues.calories += Number(entry.calories) || 0;
        totalValues.protein += Number(entry.protein) || 0;
        totalValues.carbs += Number(entry.carbs) || 0;
        totalValues.fat += Number(entry.fat) || 0;
      });
    });

    return totalValues;
  }, [diaryEntries]);

  const categoryTotals = useMemo(() => {
    const totals: { [key: string]: { calories: number; protein: number; carbs: number; fat: number } } = {};
  
    Object.entries(diaryEntries).forEach(([group, entries]) => {
      totals[group] = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
  
      entries.forEach((entry) => {
        totals[group].calories += Number(entry.calories) || 0;
        totals[group].protein += Number(entry.protein) || 0;
        totals[group].carbs += Number(entry.carbs) || 0;
        totals[group].fat += Number(entry.fat) || 0;
      });
    });
  
    console.log("📊 categoryTotals:", totals); // ✅ ตรวจสอบค่าใน Console
  
    return totals;
  }, [diaryEntries]);

  // คำนวณ remainingCalories
  const remainingCalories = dailyCalorieGoal - totals.calories;

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      getDiaryEntries(formattedDate);
    }
    // ฟังก์ชั่น fetch สำหรับดึงค่า dailyCalorieGoal จาก API หรือแหล่งข้อมูลอื่นๆ
    const fetchDailyCalorieGoal = async () => {
      try {
        const response = await fetch("/api/auth/diet-goals", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ใช้ cookies
        });

        if (!response.ok) {
          throw new Error("Failed to fetch diet goals.");
        }

        const data = await response.json();
        setDailyCalorieGoal(data.daily_calories); // เซ็ตค่า dailyCalorieGoal จาก API
      } catch (error) {
        console.error("Error fetching daily calorie goal:", error);
        setDailyCalorieGoal(2000); // กำหนดค่า default หากไม่สามารถดึงข้อมูลได้
      }
    };

    fetchDailyCalorieGoal(); // เรียกใช้ฟังก์ชั่นดึงข้อมูล
  }, [selectedDate]); // เรียกใช้เมื่อ component ถูก mount

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddToDiary = async (group: string, food: FoodEntry) => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
      console.error("❌ Invalid selectedDate:", selectedDate);
      return;
    }
  
    const formattedDate = selectedDate.toISOString().split("T")[0];
  
    if (!food || typeof food.id === "undefined") {
      console.error("❌ Food ID is missing:", food);
      return;
    }
  
    try {
      console.log("📡 Sending request to API...");
      console.log("📆 Date:", formattedDate);
      console.log("🍽 Meal Type:", group);
      console.log("🍎 Food ID:", food.id);
      console.log("🔢 Serving Size:", food.servingSize);
  
      const response = await fetch(`/api/auth/diary/${formattedDate}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          meal_type: group,
          food_id: food.id,
          quantity: food.servingSize,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add food to diary.");
      }
  
      console.log("✅ Food added successfully!");
      await getDiaryEntries(formattedDate); // ดึงข้อมูลใหม่หลังจากเพิ่มอาหาร
  
    } catch (error) {
      console.error("❌ Error adding food to diary:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };
  
  // ✅ ฟังก์ชันสำหรับดึงรายการอาหารจากไดอารี่
  const getDiaryEntries = async (date: string) => {
    try {
      const response = await fetch(`/api/auth/diary/${date}`, {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch diary entries.");
      }
  
      const fetchedEntries: DiaryEntry[] = await response.json(); // ✅ ใช้ Type ที่กำหนด
  
      console.log("📖 Diary Entries:", fetchedEntries);
  
      // ✅ จัดกลุ่มรายการอาหารตามหมวดหมู่
      const categorizedEntries: { [key: string]: FoodEntry[] } = {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: [],
      };
  
      fetchedEntries.forEach((entry: DiaryEntry) => {
        if (categorizedEntries[entry.mealType]) {
          categorizedEntries[entry.mealType].push({
            id: entry.foodId,
            name: entry.food.name, // ✅ ใช้ `food.name` ที่ได้จาก API
            servingSize: entry.quantity,
            unit: entry.food.unit || "g",
            calories: entry.calories,
            protein: entry.protein,
            carbs: entry.carbs,
            fat: entry.fat,
          });
        }
      });
  
      // ✅ อัปเดต State
      setDiaryEntries(categorizedEntries);
  
    } catch (error) {
      console.error("❌ Error fetching diary entries:", error);
    }
  };
  
  const handleRemoveItem = async () => {
    if (!itemToDelete || !(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
      console.error("❌ Invalid data for deletion:", itemToDelete, selectedDate);
      return;
    }
  
    const formattedDate = selectedDate.toISOString().split("T")[0];
  
    try {
      const response = await fetch(`/api/auth/diary/${formattedDate}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          food_id: diaryEntries[itemToDelete.group][itemToDelete.index].id,
          meal_type: itemToDelete.group,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete food entry.");
      }
  
      console.log("✅ Food entry deleted successfully!");
  
      // ✅ อัปเดต UI หลังจากลบสำเร็จ
      await getDiaryEntries(formattedDate);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
  
    } catch (error) {
      console.error("❌ Error deleting food entry:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group], // เปลี่ยนค่า `true` <-> `false`
    }));
  };
  const handleFoodAdded = (mealType: string) => {
    
    const date = selectedDate.toISOString().split("T")[0];
  
    getDiaryEntries(date); // ✅ โหลดข้อมูลใหม่
  
    setExpandedGroups((prev) => ({
      ...prev,
      [mealType]: true, // ✅ เปิดหมวดหมู่ที่เพิ่มอาหารใหม่
    }));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  

  return (
    <>
      <AddFoodtoDiary
        isOpen={isModalOpen}
        closeModal={closeModal}
        onAdd={(group, food) => handleAddToDiary(group, food)} // ✅ ส่งค่าให้ครบ
        selectedDate={selectedDate} // ✅ ส่ง selectedDate ให้ AddFoodToDiary
        onFoodAdded={(mealType) => handleFoodAdded(mealType)}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen && !!itemToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleRemoveItem}
        itemName={itemToDelete?.name || "this item"}
      />
      <div className="">
        <div className="text-black font-mono flex justify-between mx-[50]">
          <div className="flex w-[75%] flex-col">
            <div className="bg-white flex pl-[20] mb-[7]">
              <div className="flex items-center justify-between h-[50] flex-wrap ">
                <button onClick={openModal} className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30] ">
                  <div className="mr-[6]">🍎</div>FOOD
                </button>
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]">
                  <div className="mr-[6]">💪🏼</div>EXERCISE
                </button>
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]">
                  <div className="mr-[6]">🧬</div>BIOMETRIC
                </button>
                <Link href="/posts">
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]">
                  <div className="mr-[6]">📝</div>NOTE
                </button>
                </Link>
              </div>
            </div>
            {/* แสดงรายการอาหาร */}
            {Object.keys(diaryEntries).map((group) => (
              <div key={group} className="bg-white flex flex-col mb-[7]">
                <div className="flex justify-between px-[10] py-[5] border-b">  
                  <span className="font-semibold">{group}</span>
                  <div className="">
                  <span className="text-sm">
                    {categoryTotals[group]?.calories ? categoryTotals[group].calories.toFixed(0) : "0"} kcal • 
                    {categoryTotals[group]?.protein ? categoryTotals[group].protein.toFixed(0) : "0"} g protein • 
                    {categoryTotals[group]?.carbs ? categoryTotals[group].carbs.toFixed(0) : "0"} g carbs • 
                    {categoryTotals[group]?.fat ? categoryTotals[group].fat.toFixed(0) : "0"} g fat
                  </span>
                   
                  <button className="mx-[20] " onClick={() => toggleGroup(group)}>
                    {expandedGroups[group] ? <PiCaretDownBold className="rotate-180 transition-transform duration-300" /> : <PiCaretDownBold className="rotate-0 transition-transform duration-300"/>}
                  </button>
                  </div>
                </div>
                {/* ✅ แสดงรายการอาหาร */}
                {expandedGroups[group] && diaryEntries[group].map((entry, index) => (
                  <div
                    key={index}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setItemToDelete({ group, index, name: entry.name });
                      setIsDeleteModalOpen(true);
                    }}
                    className="flex justify-between px-[10] py-[2] text-sm border-b cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center ">
                      <span className="mr-2">🍎</span>
                      <span>{entry.name}</span>
                    </div>
                    <div className="flex space-x-4">
                    {editingEntry?.group === group && editingEntry?.index === index ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value === "" ? "" : parseFloat(e.target.value))} // ✅ แก้ไขตรงนี้                        
                        onKeyDown={(e) => e.key === "Enter" && saveEdit()} // ✅ บันทึกเมื่อกด Enter
                        className="w-16 border border-gray-400 rounded px-2 py-1 text-right"
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => startEditing(group, index, entry.servingSize)} className="cursor-pointer">
                        {entry.servingSize} {entry.unit || "g"}
                      </span>
                    )}
                    <span>{Number(entry.calories).toFixed(2)} kcal</span>
                  </div>
                  </div>
                ))}
              </div>
            ))}
            <div>
              <div className="mt-6">
                <EnergySummary
                  totals={totals}
                  burnedCalories={dailyCalorieGoal}  // เป้าหมายแคลอรี่ที่เผาผลาญ
                  remainingCalories={remainingCalories}  // แคลอรี่ที่เหลือ
                />
              </div>
            </div>
          </div>
          <div className="w-[350px]   ">
            {/* ✅ แถบเลือกวันที่ (Today, ลูกศร, และปุ่มปฏิทิน) */}
            <div className="flex justify-between  items-center bg-white shadow-md px-4 py-2 rounded-md ">
              {/* เปลี่ยนวันก่อนหน้า */}
              <button className="pr-8" onClick={() => handleDateChange("prev")}>
                <PiCaretLeft size={20} />
              </button>

              <span className="font-semibold">
                {isToday(selectedDate) ? "Today  " : format(selectedDate, "dd MMM")} 
              </span>

              {/* เปลี่ยนวันถัดไป */}
              <button className="px-8" onClick={() => handleDateChange("next")}>
                <PiCaretRight size={20} />
              </button>
              {/* ปุ่มเปิดปฏิทิน */}
              <button className="" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                {isCalendarOpen ? <PiCaretDownBold className="rotate-180 transition-transform duration-300" /> : <PiCaretDownBold className="rotate-0 transition-transform duration-300" />}
              </button>
            </div>

            {/* ✅ แสดงปฏิทินเมื่อ isCalendarOpen = true */}
            {isCalendarOpen && (
            <div className="flex justify-center w-[100%]">
              <div className="left-0 mt-2 z-10 text-center  ">   
                <FoodDiaryCalendar 
                selectedDate={selectedDate} // ✅ ส่ง selectedDate
                setSelectedDate={setSelectedDate}
                  onChange={(date) => {
                    setSelectedDate(date as Date);
                    setIsCalendarOpen(false); // ✅ ปิดปฏิทินเมื่อเลือกวัน
                  }}
                />
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
  }

