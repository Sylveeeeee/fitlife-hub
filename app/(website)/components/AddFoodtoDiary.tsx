import React, { useState, useEffect, useCallback } from "react";
import { IoMdClose } from "react-icons/io";

interface Food {
  id: number;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  source: string;
  servingSize: number;
}

interface AddFoodToDiaryProps {
  isOpen: boolean;
  onAdd: (group: string, food: Food) => Promise<void>;
  selectedDate: Date;
  closeModal: () => void;
}

const AddFoodToDiary: React.FC<AddFoodToDiaryProps> = ({ isOpen, closeModal }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [servingSize, setServingSize] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mealType, setMealType] = useState<string>("Breakfast");
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchFoods = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const category = activeTab === "All" ? "" : activeTab;
      const response = await fetch(`/api/auth/foods?category=${category}&search=${searchQuery}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch foods: ${response.statusText}`);
      }
      const data: Food[] = await response.json();
      setFoods(data);
    } catch (err) {
      console.error("Error fetching foods:", err);
      setError("Failed to load foods. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    if (isOpen) {
      fetchFoods();
    }
  }, [isOpen, fetchFoods]);

  const handleAddFood = async () => {
    if (!selectedFood) {
      setApiError("Please select a food before adding to the diary.");
      return;
    }
  
    if (!servingSize || servingSize <= 0) {
      setApiError("Please enter a valid serving size.");
      return;
    }
  
    setIsLoading(true); // ✅ เริ่มโหลด
  
    const date = new Date().toISOString().split("T")[0];
  
    const requestData = {
      meal_type: mealType,
      food_id: selectedFood.id,
      quantity: servingSize,
      calories: selectedFood.calories * servingSize,
      protein: selectedFood.protein * servingSize,
      carbs: selectedFood.carbs * servingSize,
      fat: selectedFood.fat * servingSize,
    };
  
    console.log("🔹 Sending data to API:", requestData);
  
    try {
      const response = await fetch(`/api/auth/diary/${date}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ ให้ browser ส่ง HttpOnly cookie ไป
        body: JSON.stringify(requestData),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to add food.");
      }
  
      console.log("✅ Food added successfully:", responseData);
      alert("🎉 Food added successfully!");
      closeModal();
    }  catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("An unknown error occurred while adding food.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  
  if (!isOpen) return null;

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center font-mono"
    >
      <div
        className="bg-white p-4 sm:p-6 md:p-8 rounded shadow-lg text-black w-[95%] sm:w-[80%] md:w-[80%] lg:w-[80%] xl:w-[70%] max-h-[95%] relative z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Add Food to Diary</h2>
          <button onClick={closeModal} className="text-xl sm:text-2xl font-black">
            <IoMdClose />
          </button>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search all foods & recipes..."
          className="border p-2 rounded mb-4 w-full text-sm md:text-base"
        />

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["All", "Favorites", "Common Foods", "Beverages", "Restaurants"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-sm md:text-base font-bold ${
                activeTab === tab
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Food List (Left Column) */}
          <div className="border rounded p-2 overflow-y-auto h-[300px] sm:h-[400px] md:h-[420px]">
            {isLoading && <p className="text-center text-blue-500">Loading foods...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!isLoading && !error && (
              <>
                {foods.length === 0 ? (
                  <p className="text-center">No foods found. Try adjusting your search or category.</p>
                ) : (
                  foods
                    .filter((food) =>
                      food.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((food) => (
                      <div
                        key={food.id}
                        className={`flex justify-between items-center p-2 cursor-pointer ${
                          selectedFood?.id === food.id
                            ? "bg-gray-200"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedFood(food)}
                      >
                        <div className="text-sm md:text-base">{food.name}</div>
                        <div className="text-xs md:text-sm text-gray-500">{food.source}</div>
                      </div>
                    ))
                )}
              </>
            )}
          </div>

          {/* Selected Food Details (Right Column) */}
          {selectedFood && (
            <div className="border rounded p-4 sticky top-0 h-max">
              <h3 className="text-lg sm:text-xl font-bold mb-2">{selectedFood.name}</h3>
              <p className="text-[#ff1cd2]">Calories: {selectedFood.calories} kcal</p>
              <p className="text-[#12ff3e]">Protein: {selectedFood.protein} g</p>
              <p className="text-[#24fff4]">Net Carbs: {selectedFood.carbs} g</p>
              <p className="text-[#ff2525]">Fat: {selectedFood.fat} g</p>
              <p className="text-gray-500">Source: {selectedFood.source}</p>

              <label className="block mt-4">Serving Size:</label>
              <input
                type="number"
                value={servingSize}
                onChange={(e) => setServingSize(Number(e.target.value))}
                className="border p-2 rounded w-full"
                min="1"
              />

              <label className="block mt-4">Meal Type:</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
              </select>

              <button
                onClick={handleAddFood}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              >
                Add to Diary
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFoodToDiary;
