"use client";
import { PiCaretLeft, PiCaretRight, PiCaretDownBold,} from "react-icons/pi";
import React, { useState, useMemo, useEffect } from 'react';
import AddFoodtoDiary from "../components/AddFoodtoDiary";
import AddExerciseToDiary from "../components/AddExerciseToDiary"; // ✅ เพิ่ม Component สำหรับ Exercise
import AddBiometricToDiary from "../components/AddBiometricToDiary"; // ✅ เพิ่ม Component สำหรับ Biometric
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

interface Exercise {
  id: number;
  name: string;
  category: string;
  baseCaloriesBurned: number;
}

interface ExerciseEntry {
  id: number;
  type: "exercise";
  name: string;
  duration: number; 
  calories: number;
  mealType: "Exercise";
  exercise: Exercise;
}

interface Biometric {
  id: number;
  name: string;
  unit: string;
}

interface BiometricEntry {
  id: number;
  type: "biometric"; // ✅ ระบุว่าเป็นค่าชีวภาพ
  name: string;
  value: number;
  unit: string;
  date: string; // ✅ เก็บวันที่ที่บันทึก Biometric
  categoryId: number;  // เพิ่ม categoryId ใน BiometricEntry
  metricId: number;    // เพิ่ม metricId ใน BiometricEntry
  biometric: Biometric; // ✅ ข้อมูลค่าชีวภาพ
}

// ✅ ใช้ Union Type เพื่อรองรับทั้งอาหารและการออกกำลังกาย
type DiaryEntry = FoodEntry | ExerciseEntry | BiometricEntry;


// ✅ แยก `FoodEntry` และ `ExerciseEntry` ให้ TypeScript เข้าใจ

export default function Diary() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false); // ✅ State เปิด/ปิด Exercise Modal
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false); // ✅ State เปิด/ปิด Biometric Modal
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
  
      const entry = updatedEntries[group][index];
  
      if (entry.type === "food") {  // ✅ ใช้ entry.type === "food" แทนการใช้ isFoodEntry()
        // ✅ อัปเดตค่าของอาหาร
        updatedEntries[group][index] = {
          ...entry,
          servingSize: newAmount,
          calories: (entry.calories / entry.servingSize) * newAmount,
          protein: (entry.protein / entry.servingSize) * newAmount,
          carbs: (entry.carbs / entry.servingSize) * newAmount,
          fat: (entry.fat / entry.servingSize) * newAmount,
        };
      } else if (entry.type === "exercise") {
        // ✅ อัปเดตค่าของ Exercise
        updatedEntries[group][index] = {
          ...entry,
          duration: newAmount,
          calories: (entry.calories / entry.duration) * newAmount,
        };
      } else if (entry.type === "biometric") {
        // ✅ อัปเดตค่าของ Biometric
        updatedEntries[group][index] = {
          ...entry,
          value: newAmount, // ✅ Biometric ใช้ value แทน
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
    [key: string]: (FoodEntry | ExerciseEntry | BiometricEntry)[];
  }>({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
    Exercise: [],
    Biometric: [], // ✅ เพิ่มหมวดหมู่ Biometric
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
        if (entry.type === "food" || entry.type === "exercise") { // ✅ ตรวจสอบว่าเป็น Food หรือ Exercise เท่านั้น
          totalValues.calories += Number(entry.calories) || 0;
        }
  
        if (entry.type === "food") { // ✅ ตรวจสอบว่าเป็น Food เท่านั้น
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
        if (entry.type === "food" || entry.type === "exercise") { // ✅ ตรวจสอบว่าเป็น Food หรือ Exercise เท่านั้น
          totals[group].calories += Number(entry.calories) || 0;
        }
  
        if (entry.type === "food") { // ✅ ตรวจสอบว่าเป็น Food เท่านั้น
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

  const handleAddToDiary = async (group: string, item: Food | FoodEntry) => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
      console.error("❌ Invalid selectedDate:", selectedDate);
      return;
    }
  
    const formattedDate = selectedDate.toISOString().split("T")[0];
  
    // ✅ แปลง Food เป็น FoodEntry ถ้ายังไม่ได้แปลง
    const foodEntry: FoodEntry =
      "type" in item && item.type === "food"
        ? item
        : {
            type: "food",
            food: item,
            id: item.id,
            name: item.name,
            unit: item.unit || "g",
            servingSize: 1, // ค่าเริ่มต้น
            calories: 0, // ต้องดึงค่าจาก API หรือกำหนดจากผู้ใช้
            protein: 0,
            carbs: 0,
            fat: 0,
            mealType: group,
          };
  
    try {
      console.log("📡 Sending request to API...");
      console.log("📆 Date:", formattedDate);
      console.log("🍽 Meal Type:", group);
      console.log("🍎 Food ID:", foodEntry.id);
      console.log("🔢 Serving Size:", foodEntry.servingSize);
  
      const response = await fetch(`/api/auth/diary/${formattedDate}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          type: "food",
          mealType: foodEntry.mealType,
          food_id: foodEntry.id,
          quantity: foodEntry.servingSize,
          calories: foodEntry.calories,
          protein: foodEntry.protein,
          carbs: foodEntry.carbs,
          fat: foodEntry.fat,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add food to diary.");
      }
  
      console.log("✅ Food added successfully!");
      await getDiaryEntries(formattedDate);
  
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
  
      const responseData: { data: DiaryEntry[] } = await response.json();
      if (!responseData?.data || !Array.isArray(responseData.data)) {
        console.error("❌ Invalid API response:", responseData);
        return;
      }
  
      // ✅ แยกข้อมูลเป็นหมวดหมู่ (อาหาร, ออกกำลังกาย, และ Biometric)
      const categorizedEntries: { [key: string]: DiaryEntry[] } = {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: [],
        Exercise: [],
        Biometric: [], // ✅ เพิ่ม Biometric ให้เป็นส่วนหนึ่งของไดอารี่
      };
  
      responseData.data.forEach((entry: DiaryEntry) => {
        if (entry.type === "food" && entry.food?.name) {
          const mealType = categorizedEntries[entry.mealType] ? entry.mealType : "Snacks";
          
          categorizedEntries[mealType].push({
            ...entry,
            servingSize: entry.servingSize || 1,
            unit: entry.unit || "g",
            calories: entry.calories || 0,
            protein: entry.protein || 0,
            carbs: entry.carbs || 0,
            fat: entry.fat || 0,
          });
  
        } else if (entry.type === "exercise" && entry.exercise?.name) {
          categorizedEntries["Exercise"].push({
            ...entry,
            duration: entry.duration || 0,
            calories: entry.calories || 0,
          });
  
        } else if (entry.type === "biometric" && entry.name) { // ✅ ใช้ entry.name แทน entry.biometric?.name
          categorizedEntries["Biometric"].push({
            ...entry,
            name: entry.name,
            value: entry.value || 0,
            unit: entry.unit || "",
          });
  
        } else {
          console.warn(`⚠️ Skipping invalid entry:`, entry);
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
    const entry = diaryEntries[itemToDelete.group]?.[itemToDelete.index];
  
    if (!entry) {
      console.error("❌ Entry not found for deletion.");
      return;
    }
  
    try {
      let requestBody;
  
      if (entry.type === "food") {
        requestBody = { food_id: entry.food.id, meal_type: itemToDelete.group }; // ✅ ใช้ entry.food.id เฉพาะเมื่อเป็น food
      } else if (entry.type === "exercise") {
        requestBody = { exercise_id: entry.exercise.id, date: formattedDate }; // ✅ ใช้ entry.exercise.id เฉพาะเมื่อเป็น exercise
      } else if (entry.type === "biometric") {
        requestBody = { biometric_id: entry.id, date: formattedDate }; // ✅ ใช้ entry.id สำหรับ Biometric
      } else {
        console.warn("⚠️ Unknown entry type:", entry);
        return;
      }
  
      console.log("📡 Sending DELETE request:", requestBody); // ✅ Debug
  
      // ✅ ใช้ `/api/auth/diary/${formattedDate}` สำหรับทั้งอาหาร, ออกกำลังกาย และ Biometric
      const endpoint = `/api/auth/diary/${formattedDate}`;
  
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete entry.");
      }
  
      console.log("✅ Entry deleted successfully!", entry);
  
      // ✅ อัปเดต UI โดยไม่ต้องโหลด API ใหม่
      setDiaryEntries((prevEntries) => {
        const updatedEntries = { ...prevEntries };
        updatedEntries[itemToDelete.group] = updatedEntries[itemToDelete.group]?.filter((_, idx) => idx !== itemToDelete.index) || [];
        return updatedEntries;
      });
  
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
  
    } catch (error) {
      console.error("❌ Error deleting entry:", error);
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
  const handleAddExerciseToDiary = async (exercise: Exercise, duration: number) => {
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
        date: selectedDate.toISOString().split("T")[0], // ใช้ selectedDate ที่เลือก
      });
  
      const response = await fetch(`/api/auth/exercise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          exerciseId: exercise.id,
          duration,
          caloriesBurned: estimatedCaloriesBurned,
          date: selectedDate.toISOString().split("T")[0], // ใช้ selectedDate ที่เลือก
        }),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        console.error("❌ API Error Response:", responseData);
        alert(`Error: ${responseData.error || "Failed to add exercise."}`);
        return;
      }
  
      console.log("✅ Exercise added successfully!", responseData);
  
      // ✅ อัปเดตไดอารี่ทันที โดยไม่ต้องเรียก API ซ้ำ
      setDiaryEntries((prevEntries) => {
        const updatedEntries = { ...prevEntries };
        updatedEntries["Exercise"] = [
          ...(prevEntries["Exercise"] ?? []),
          {
            id: responseData.id || exercise.id, // ใช้ id จาก API ถ้ามี
            name: exercise.name,
            duration,
            calories: estimatedCaloriesBurned,
            type: "exercise",
            mealType: "Exercise",
            exercise: exercise,
          } as ExerciseEntry,
        ];
  
        console.log("📖 Updated Diary Entries:", updatedEntries);
        return updatedEntries;
      });
  
      // ✅ เปิดหมวดหมู่ Exercise อัตโนมัติให้เห็นผลทันที
      setExpandedGroups((prev) => ({
        ...prev,
        Exercise: true,
      }));
    
    } catch (error) {
      console.error("❌ Error adding exercise to diary:", error);
      alert("An error occurred while adding exercise.");
    }
  };  

  const handleAddBiometricToDiary = async (biometric: BiometricEntry) => {
    try {
      console.log("📡 Sending request to API for biometric data:", biometric);
  
      // ✅ ตรวจสอบ biometric และข้อมูลที่จำเป็น
      if (!biometric || !biometric.id || !biometric.categoryId || !biometric.metricId) {
        console.error("❌ Invalid biometric data:", biometric);
        alert("Invalid biometric data. Please try again.");
        return;
      }
  
      // ✅ ตรวจสอบ selectedDate และตั้งค่า default หากไม่มี
      const formattedDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime()) 
        ? selectedDate.toISOString().split("T")[0] 
        : new Date().toISOString().split("T")[0];
  
      // ✅ สร้าง request body ตามข้อมูลใน `biometric`
      const requestBody = {
        categoryId: biometric.categoryId,  // ใช้ categoryId จาก `biometric`
        metricId: biometric.metricId,  // ใช้ metricId จาก `biometric`
        value: biometric.value,
        unit: biometric.unit,
        date: formattedDate, // ใช้วันที่จาก selectedDate
      };
  
      console.log("📡 Request Body:", requestBody); // ตรวจสอบ request
  
      const response = await fetch(`/api/auth/biometric/entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });
  
      let responseData;
      try {
        responseData = await response.json();
      } catch (error) {
        console.error("❌ Failed to parse API response:", error);
        alert("Invalid response from server.");
        return;
      }
  
      console.log("🔹 API Response:", responseData); // Log API response
  
      if (!response.ok) {
        console.error("❌ API Error Response:", responseData);
        alert(`Error: ${responseData.error || "Failed to add biometric data."}`);
        return;
      }
  
      console.log("✅ Biometric data added successfully!", responseData);
  
      setDiaryEntries((prevEntries) => {
        const updatedEntries = { ...prevEntries };
        updatedEntries["Biometric"] = [
          ...(prevEntries["Biometric"] ?? []),
          {
            id: responseData.id || biometric.metricId, // ✅ ใช้ id จาก API ถ้ามี
            type: "biometric", // ✅ กำหนดว่าเป็นประเภท biometric
            name: biometric.name,
            value: biometric.value,
            unit: biometric.unit,
            date: formattedDate, // ✅ ใช้ `date` ตามที่ระบุใน Type
            categoryId: biometric.categoryId, // ✅ เพิ่ม categoryId
            metricId: biometric.metricId, // ✅ เพิ่ม metricId
            biometric: {
              id: biometric.metricId, // ✅ ต้องใช้ `id` สำหรับ `Biometric`
              name: biometric.name,
              unit: biometric.unit,
            },
          } as BiometricEntry, // ✅ TypeScript รับรู้ว่าเป็น `BiometricEntry`
        ];
      
        console.log("📖 Updated Diary Entries:", updatedEntries);
        return updatedEntries;
      });
      
      // ✅ อัปเดตไดอารี่
      setExpandedGroups((prev) => ({
        ...prev,
        Biometric: true,
      }));
  
    } catch (error) {
      console.error("❌ Error adding biometric to diary:", error);
      alert(error instanceof Error ? error.message : "An error occurred while adding biometric data.");
    }
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
      <AddExerciseToDiary
        isOpen={isExerciseModalOpen}
        closeModal={() => setIsExerciseModalOpen(false)}
        selectedDate={selectedDate}
        onAdd={handleAddExerciseToDiary}
        onExerciseAdded={() => getDiaryEntries(selectedDate.toISOString().split("T")[0])}
      />
      <AddBiometricToDiary
        isOpen={isBiometricModalOpen}
        closeModal={() => setIsBiometricModalOpen(false)}
        selectedDate={selectedDate}
        onAdd={handleAddBiometricToDiary}
        onBiometricAdded={() => getDiaryEntries(selectedDate.toISOString().split("T")[0])}
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
                <button onClick={() => setIsExerciseModalOpen(true)} className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]">
                  <div className="mr-[6]">💪🏼</div>EXERCISE
                </button>
                <button onClick={() => setIsBiometricModalOpen(true)} className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]">
                  <div className="mr-[6]">🧬</div>BIOMETRIC
                </button>
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

              {/* ✅ แสดงรายการอาหาร, ออกกำลังกาย และค่าชีวภาพ */}
{expandedGroups[group] && diaryEntries[group].map((entry, index) => (
  <div  
    key={index}
    onContextMenu={(e) => {
      e.preventDefault();
      setItemToDelete({ 
        group, 
        index, 
        name: entry.type === "exercise" 
          ? entry.exercise.name 
          : entry.type === "food" 
            ? entry.food.name // ✅ ใช้ entry.food.name เพื่อแสดงชื่ออาหาร
            : entry.name // ✅ รองรับ BiometricEntry
      });
      setIsDeleteModalOpen(true);
    }}
    className="flex justify-between px-[10] py-[2] text-sm border-b cursor-pointer hover:bg-gray-100"
  >
    <div className="flex items-center">
      <span className="mr-2">
        {entry.type === "exercise" ? "💪🏼" : entry.type === "biometric" ? "🧬" : "🍎"}
      </span>
      <span>
        {entry.type === "exercise" 
          ? entry.exercise.name 
          : entry.type === "food" 
            ? entry.food.name  // ✅ ใช้ entry.food.name เพื่อแสดงชื่ออาหาร
            : entry.name}
      </span>
    </div>
    <div className="flex space-x-4">
      {/* ✅ แยก FoodEntry, ExerciseEntry และ BiometricEntry ออกจากกัน */}
      {entry.type === "exercise" ? (
        <>
          <span>{entry.duration} min</span>
          <span>{entry.calories.toFixed(2)} kcal</span>
        </>
      ) : entry.type === "biometric" ? (
        <>
          <span>{entry.value} {entry.unit}</span> {/* ✅ แสดงค่าชีวภาพ */}
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

