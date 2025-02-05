import React, { useState, useEffect, useCallback } from "react";
import { IoMdClose } from "react-icons/io";

interface FoodEntry {
  id: number;
  name: string;
  servingSize: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  source: string;
}

interface AddFoodToDiaryProps {
  isOpen: boolean;
  closeModal: () => void;
  onAdd: (group: string, food: FoodEntry) => void;
  selectedDate: Date;
}

const AddFoodToDiary: React.FC<AddFoodToDiaryProps> = ({ isOpen, closeModal, onAdd, selectedDate }) => {
  const [foods, setFoods] = useState<FoodEntry[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [servingSize, setServingSize] = useState<number>(100); // ✅ Default serving size
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [diaryGroup, setDiaryGroup] = useState<string>("Breakfast");

  // 📌 ดึงข้อมูลอาหารจาก API
  const fetchFoods = useCallback(async () => {
    if (!isOpen) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/auth/foods?category=${activeTab === "All" ? "" : activeTab}&search=${searchQuery}`);
      if (!response.ok) throw new Error(`Failed to fetch foods: ${response.statusText}`);

      const data: FoodEntry[] = await response.json();
      setFoods(data);
    } catch (err) {
      console.error("Error fetching foods:", err);
      setError("Failed to load foods. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, isOpen]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  // 📌 เพิ่มอาหารลงในไดอารี่ และบันทึกลงฐานข้อมูลผ่าน API
  const handleAddFood = async () => {
    if (!selectedFood || typeof selectedFood.id === "undefined") {
      console.error("❌ No food selected.");
      alert("Please select a food item.");
      return;
    }
  
    if (!(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
      console.error("❌ Invalid selectedDate:", selectedDate);
      alert("Invalid selected date.");
      return;
    }
  
    // คำนวณปริมาณสารอาหารที่ถูกต้อง
    const adjustedCalories = (Number(selectedFood.calories || 0) * servingSize) / 100;
    const adjustedProtein = (Number(selectedFood.protein || 0) * servingSize) / 100;
    const adjustedCarbs = (Number(selectedFood.carbs || 0) * servingSize) / 100;
    const adjustedFat = (Number(selectedFood.fat || 0) * servingSize) / 100;
  
    // แปลงวันที่เป็น "YYYY-MM-DD"
    const formattedDate = selectedDate.toISOString().split("T")[0];
  
    try {
      console.log("📡 Sending request to API...");
      console.log("📆 Date:", formattedDate);
      console.log("🍽 Meal Type:", diaryGroup);
      console.log("🍎 Food ID:", selectedFood.id);
      console.log("🔢 Serving Size:", servingSize);
  
      const response = await fetch(`/api/auth/diary/${formattedDate}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          meal_type: diaryGroup,
          food_id: selectedFood.id,
          quantity: servingSize,
          calories: adjustedCalories,
          protein: adjustedProtein,
          carbs: adjustedCarbs,
          fat: adjustedFat,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add food to diary.");
      }
  
      const newEntry = await response.json();
      console.log("✅ Food added successfully:", newEntry);
  
      // ✅ ใช้ค่าที่ได้จาก API แทนค่าที่คำนวณเอง
      onAdd(diaryGroup, {
        id: newEntry.id || Date.now(), // ใช้ ID ที่ได้จาก API หรือ fallback เป็น timestamp
        name: newEntry.name || selectedFood.name, // ใช้ค่าจาก API ถ้ามี
        servingSize: newEntry.quantity || servingSize,
        calories: newEntry.calories || adjustedCalories,
        protein: newEntry.protein || adjustedProtein,
        carbs: newEntry.carbs || adjustedCarbs,
        fat: newEntry.fat || adjustedFat,
        source: selectedFood.source,
      });
  
      closeModal();
    } catch (error) {
      console.error("❌ Error adding food entry:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };
  
  
  if (!isOpen) return null;

  return (
    <div onClick={closeModal} className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center font-mono">
      <div onClick={(e) => e.stopPropagation()} className="bg-white p-6 rounded shadow-lg text-black w-[90%] max-w-2xl max-h-[90%] overflow-y-auto">
        {/* 🔹 Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Food to Diary</h2>
          <button onClick={closeModal} className="text-2xl"><IoMdClose /></button>
        </div>

        {/* 🔹 Search Bar */}
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search foods..." className="border p-2 rounded mb-4 w-full" />

        {/* 🔹 Tabs */}
        <div className="flex gap-2 mb-4">
          {["All", "Favorites", "Common Foods", "Beverages", "Restaurants"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 text-sm font-bold ${activeTab === tab ? "text-black border-b-2 border-black" : "text-gray-500"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* 🔹 Food List */}
        <div className="border rounded p-2 overflow-y-auto h-60">
          {isLoading && <p className="text-center text-blue-500">Loading foods...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!isLoading && !error && foods.length === 0 && <p className="text-center">No foods found.</p>}
          {foods.map((food) => (
            <div key={food.id} className={`p-2 cursor-pointer ${selectedFood?.id === food.id ? "bg-gray-200" : "hover:bg-gray-100"}`} onClick={() => setSelectedFood(food)}>
              <span>{food.name}</span> <span className="text-gray-500 text-xs">({food.source})</span>
            </div>
          ))}
        </div>

        {/* 🔹 Selected Food Details */}
        {selectedFood && (
          <div className="border rounded p-4 mt-4">
            <h3 className="text-lg font-bold">{selectedFood.name}</h3>
            <p>Calories: {selectedFood.calories} kcal</p>
            <p>Protein: {selectedFood.protein} g</p>
            <p>Carbs: {selectedFood.carbs} g</p>
            <p>Fat: {selectedFood.fat} g</p>

            <label className="block mt-4">Serving Size (g):</label>
            <input type="number" value={servingSize} onChange={(e) => setServingSize(Number(e.target.value))} className="border p-2 rounded w-full" min="1" />

            <label className="block mt-4">Diary Group:</label>
            <select value={diaryGroup} onChange={(e) => setDiaryGroup(e.target.value)} className="border p-2 rounded w-full">
              {["Breakfast", "Lunch", "Dinner", "Snacks"].map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>

            <button onClick={handleAddFood} className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full">Add to Diary</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFoodToDiary;
