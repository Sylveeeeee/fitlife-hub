"use client";
import { PiCaretLeft, PiCaretRight, PiCaretDownBold,} from "react-icons/pi";
import React, { useState, useMemo, useEffect } from 'react';
import AddFoodtoDiary from "../components/AddFoodtoDiary";
import AddExerciseToDiary from "../components/AddExerciseToDiary"; // ✅ เพิ่ม Component สำหรับ Exercise
// import AddBiometricToDiary from "../components/AddBiometricToDiary"; // ✅ เพิ่ม Component สำหรับ Biometric
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import EnergySummary from "../components/EnergySummary";
import FoodDiaryCalendar from "../components/FoodDiaryCalendar";
import { format } from "date-fns"; 
import Link from "next/link";

interface Food {
  id: number;
  name: string;
  unit?: string;
  mealType: string;
}

interface FoodEntry {
  type: "food";
  food: Food;
  id: number;
  name: string;
  unit?: string;
  servingSize: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
}

interface ExerciseEntry {
  id: number;
  type: "exercise";
  name: string;
  duration: number; // ✅ ใช้ duration แทน servingSize
  calories: number;
  mealType: "Exercise";
  exercise: Exercise;
}

interface Exercise {
  id: number;
  name: string;
  category: string;
  baseCaloriesBurned: number;
}

// ✅ แยก `FoodEntry` และ `ExerciseEntry` ให้ TypeScript เข้าใจ

export default function Diary() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false); // ✅ State เปิด/ปิด Exercise Modal
  // const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false); // ✅ State เปิด/ปิด Biometric Modal
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
    const newAmount = Number(editValue) || 0;
  
    setDiaryEntries((prevEntries) => {
      const updatedEntries = { ...prevEntries };
      updatedEntries[group] = [...prevEntries[group]];
      
      if (isFoodEntry(updatedEntries[group][index])) {
        // ✅ อัปเดตค่าของอาหาร
        updatedEntries[group][index] = {
          ...updatedEntries[group][index],
          servingSize: newAmount,
          calories: (updatedEntries[group][index].calories / updatedEntries[group][index].servingSize) * newAmount,
          protein: (updatedEntries[group][index].protein / updatedEntries[group][index].servingSize) * newAmount,
          carbs: (updatedEntries[group][index].carbs / updatedEntries[group][index].servingSize) * newAmount,
          fat: (updatedEntries[group][index].fat / updatedEntries[group][index].servingSize) * newAmount,
        };
      } else {
        // ✅ อัปเดตค่าของ Exercise
        updatedEntries[group][index] = {
          ...updatedEntries[group][index],
          duration: newAmount,
          calories: (updatedEntries[group][index].calories / updatedEntries[group][index].duration) * newAmount,
        };
      }
      
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
    [key: string]: (FoodEntry | ExerciseEntry)[];
  }>({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
    Exercise: [],
  });

  const isFoodEntry = (entry: FoodEntry | ExerciseEntry): entry is FoodEntry => {
    return (entry as FoodEntry).servingSize !== undefined;
  };
  
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
  
        if (isFoodEntry(entry)) {
          totalValues.protein += Number(entry.protein) || 0;
          totalValues.carbs += Number(entry.carbs) || 0;
          totalValues.fat += Number(entry.fat) || 0;
        }
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
  
        if (isFoodEntry(entry)) {
          totals[group].protein += Number(entry.protein) || 0;
          totals[group].carbs += Number(entry.carbs) || 0;
          totals[group].fat += Number(entry.fat) || 0;
        }
      });
    });
  
    console.log("📊 categoryTotals:", totals); // ✅ ตรวจสอบค่าใน Console
  
    return totals;
  }, [diaryEntries]);  

  // คำนวณ remainingCalories
  const remainingCalories = dailyCalorieGoal - totals.calories ;

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
          type: "food",
          mealType:food.mealType,
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
  
  const getDiaryEntries = async (date: string) => {
    try {
      console.log("📡 Fetching diary entries for date:", date);
  
      const response = await fetch(`/api/auth/diary/${date}`, {
        method: "GET",
        credentials: "include",
      });
  
      console.log("🔹 API Response Status:", response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch diary entries.");
      }
  
      const responseData: { data: (FoodEntry | ExerciseEntry)[] } = await response.json();
      console.log("📖 Diary Entries from API:", responseData);
  
      if (!Array.isArray(responseData.data)) {
        console.error("❌ Invalid API response:", responseData);
        return;
      }
  
      // ✅ แยกหมวดหมู่ข้อมูล
      const categorizedEntries: { [key: string]: (FoodEntry | ExerciseEntry)[] } = {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: [],
        Exercise: [],
      };
  
      responseData.data.forEach((entry) => {
        if (entry.type === "food") {
          // ✅ ตรวจสอบว่า `entry.food` มีค่าหรือไม่
          if (!entry.food || !entry.food.name) {
            console.error(`❌ Missing food data for id: ${entry.id}`);
            return;
          }
  
          // ✅ ตรวจสอบ mealType
          const mealType = categorizedEntries[entry.mealType] ? entry.mealType : "Snacks";
  
          categorizedEntries[mealType].push({
            type: "food",
            id: entry.id,
            food: entry.food,
            mealType: entry.mealType,
            name: entry.food.name,
            servingSize: entry.servingSize,
            unit: entry.unit,
            calories: entry.calories,
            protein: entry.protein,
            carbs: entry.carbs,
            fat: entry.fat,
          });
  
        } else if (entry.type === "exercise") {
          // ✅ ตรวจสอบว่า `entry.exercise` มีค่าหรือไม่
          if (!entry.exercise || !entry.exercise.name) {
            console.error(`❌ Missing exercise data for id: ${entry.id}`);
            return;
          }
  
          categorizedEntries["Exercise"].push({
            type: "exercise",
            id: entry.id,
            name: entry.exercise.name,
            duration: entry.duration,
            calories: entry.calories,
            mealType: "Exercise",
            exercise: entry.exercise,
          });
        }
      });
  
      console.log("✅ Updated Categorized Entries:", categorizedEntries);
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
  
  useEffect(() => {
    if (isDeleteModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isDeleteModalOpen]);
  
  // ✅ เพิ่มข้อมูล Exercise ลงในไดอารี่
  const handleAddExerciseToDiary = async (exercise: Exercise, duration: number, date: string) => {
    try {
      if (!exercise.baseCaloriesBurned || isNaN(exercise.baseCaloriesBurned)) {
        console.error("🚨 Missing or invalid baseCaloriesBurned value:", exercise.baseCaloriesBurned);
        alert("Exercise data is missing or invalid.");
        return;
      }
  
      const estimatedCaloriesBurned = Number((exercise.baseCaloriesBurned * (duration / 60)).toFixed(2));
  
      if (isNaN(estimatedCaloriesBurned) || estimatedCaloriesBurned <= 0) {
        console.error("🚨 Invalid estimatedCaloriesBurned value:", estimatedCaloriesBurned);
        alert("Cannot calculate calories burned correctly.");
        return;
      }
  
      console.log("📡 Sending request to API with data:", {
        exerciseId: exercise.id,
        duration,
        caloriesBurned: estimatedCaloriesBurned,
        date,
      });
  
      const response = await fetch(`/api/auth/exercise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          exerciseId: exercise.id,
          duration,
          caloriesBurned: estimatedCaloriesBurned,
          date,
        }),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        console.error("❌ API Error Response:", responseData);
        alert(`Error: ${responseData.error || "Failed to add exercise."}`);
        return;
      }
  
      console.log("✅ Exercise added successfully!", responseData);
  
      // ✅ เลือกให้ Exercise ไปอยู่ในหมวดที่เลือก
      const mealType = "Exercise"; // ✅ หรือใช้ค่าอื่นที่เกี่ยวข้อง เช่น Breakfast, Lunch
  
      setDiaryEntries((prevEntries) => {
        const updatedEntries = {
          ...prevEntries,
          [mealType]: [
            ...(prevEntries[mealType] ?? []),
            {
              id: exercise.id,
              name: exercise.name,
              duration,
              calories: estimatedCaloriesBurned,
            } as ExerciseEntry,
          ],
        };
      
        console.log("📖 Updated Diary Entries:", updatedEntries); // ✅ Debugging
        return updatedEntries;
      });
      
      // ✅ โหลดข้อมูลใหม่จาก API
      const formattedDate = selectedDate.toISOString().split("T")[0];
      getDiaryEntries(formattedDate);
      
  
      alert("Exercise added successfully!");
  
    } catch (error) {
      console.error("❌ Error adding exercise to diary:", error);
      alert("An error occurred while adding exercise.");
    }
  };
  
  

  // ✅ เพิ่มข้อมูล Biometric ลงในไดอารี่
  
  return (
    <>
      <AddFoodtoDiary
        isOpen={isModalOpen}
        closeModal={closeModal}
        onAdd={(group, food) => handleAddToDiary(group, food)} // ✅ ส่งค่าให้ครบ
        selectedDate={selectedDate} // ✅ ส่ง selectedDate ให้ AddFoodToDiary
        onFoodAdded={(mealType) => handleFoodAdded(mealType)}
      />
      <AddExerciseToDiary
        isOpen={isExerciseModalOpen}
        closeModal={() => setIsExerciseModalOpen(false)}
        selectedDate={selectedDate}
        onAdd={handleAddExerciseToDiary}
        onExerciseAdded={() => getDiaryEntries(selectedDate.toISOString().split("T")[0])}
      />
      {/* <AddBiometricToDiary
        isOpen={isBiometricModalOpen}
        closeModal={() => setIsBiometricModalOpen(false)}
        selectedDate={selectedDate}
        onAdd={handleAddBiometricToDiary}
        onBiometricAdded={() => getDiaryEntries(selectedDate.toISOString().split("T")[0])}
      /> */}
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
                <button onClick={() => setIsExerciseModalOpen(true)} className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]">
                  <div className="mr-[6]">💪🏼</div>EXERCISE
                </button>
                {/* <button onClick={() => setIsBiometricModalOpen(true)} className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]">
                  <div className="mr-[6]">🧬</div>BIOMETRIC
                </button> */}
                <Link href="/posts">
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]">
                  <div className="mr-[6]">📝</div>NOTE
                </button>
                </Link>
              </div>
            </div>
            {/* แสดงรายการอาหารและ Exercise */}
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

    {/* ✅ แสดงรายการอาหารและออกกำลังกาย */}
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
          <span className="mr-2">{'duration' in entry ? "💪🏼" : "🍎"}</span>
          <span>{entry.name}</span>
        </div>
        <div className="flex space-x-4">
          {/* ✅ แยก FoodEntry และ ExerciseEntry ออกจากกัน */}
          {"duration" in entry ? (
            <>
              <span>{entry.duration} min</span>
              <span>{entry.calories.toFixed(2)} kcal</span>
            </>
          ) : (
            <>
              {editingEntry?.group === group && editingEntry?.index === index ? (
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value === "" ? "" : parseFloat(e.target.value))}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  className="w-16 border border-gray-400 rounded px-2 py-1 text-right"
                  autoFocus
                />
              ) : (
                <span onClick={() => startEditing(group, index, entry.servingSize!)} className="cursor-pointer">
                  {entry.servingSize} {entry.unit || "g"}
                </span>
              )}
              <span>{Number(entry.calories).toFixed(2)} kcal</span>
            </>
          )}
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

