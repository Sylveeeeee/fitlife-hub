import React, { useState, useEffect,useCallback  } from "react";
import { IoMdClose } from "react-icons/io";

interface Food {
  id: number;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  source: string;
}

interface AddFoodToDiaryProps {
  isOpen: boolean;
  closeModal: () => void;
  onAdd: (group: string, food: { 
    name: string; 
    servingSize: number; 
    calories: number; 
    protein: number; 
    carbs: number; 
    fat: number; 
  }) => void;
}

const AddFoodToDiary: React.FC<AddFoodToDiaryProps> = ({ isOpen, closeModal, onAdd }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [servingSize, setServingSize] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [diaryGroup, setDiaryGroup] = useState<string>("Uncategorized");


  const fetchFoods = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/auth/foods?category=${activeTab}&search=${searchQuery}`);
      if (!response.ok) {
        console.log("Response status:", response.status);
        throw new Error(`Failed to fetch foods: ${response.statusText}`);
      }
      const data: Food[] = await response.json();
      console.log("Fetched data:", data);
      setFoods(data);
    } catch (err) {
      console.error("Error fetching foods:", err);
      setError("Failed to load foods. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery]); // ระบุ dependencies ที่เกี่ยวข้อง
  
  useEffect(() => {
    if (isOpen) {
      fetchFoods();
    }
  }, [isOpen, fetchFoods]);

  if (!isOpen) return null;

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center font-mono"
    >
      <div
        className="bg-white p-6 rounded shadow-lg text-black w-[80%] max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Add Food to Diary</h2>
          <button onClick={closeModal} className="text-[26px] font-black">
            <IoMdClose />
          </button>
        </div>
  
        {/* Search Bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search all foods & recipes..."
          className="border p-2 rounded mb-4 w-full"
        />
  
        {/* Tabs */}
        <div className="flex  mb-4">
          {["All", "Favorites", "Common Foods", "Beverages", "Supplements", "Brands", "Restaurants", ].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-bold relative ${
                  activeTab === tab
                    ? "text-black after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[4px] after:h-[2px] after:bg-black"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
  
        {/* Loading and Error States */}
        {isLoading && (
          <div className={`text-center mb-4 border rounded p-2 overflow-y-scroll  ${
              selectedFood ? "h-[200px] md:h-[300px] lg:h-[400px]" : "h-[300px] md:h-[400px] lg:h-[500px]"
            }`}>
            <p className="text-blue-500">Loading foods...</p>
          </div>
        )}
        {error && (
          <div className={`text-center mb-4 text-red-500 border rounded p-2 overflow-y-scroll ${
              selectedFood ? "h-[200px] md:h-[300px] lg:h-[400px]" : "h-[300px] md:h-[400px] lg:h-[500px]"
            }`}>
            <p>{error}</p>
          </div>
        )}
  
        {/* Food List */}
        {!isLoading && !error && (
          <div className={`border rounded p-2 mb-4 overflow-y-scroll ${
            selectedFood ? "h-[200px] md:h-[300px] lg:h-[400px]" : "h-[300px] md:h-[400px] lg:h-[500px]" 
          }`}>
            {foods.length === 0 ? (
              <div className="text-center ">
                <p>No foods found. Try adjusting your search or category.</p>
              </div>
            ) : (
              foods
                .filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((food) => (
                  <div
                  key={food.id}
                  className={`flex justify-between items-center p-2 cursor-pointer ${
                    selectedFood?.id === food.id ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                    onClick={() => setSelectedFood(food)}
                  >
                    <div>{food.name}</div>
                    <div>{food.source}</div>
                  </div>
                ))
            )}
          </div>
        )}
  
        {/* Selected Food Details */}
        {selectedFood && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold mb-2">{selectedFood.name}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>Calories: {selectedFood.calories} kcal</p>
                <p>Protein: {selectedFood.protein} g</p>
                <p>Net Carbs: {selectedFood.carbs} g</p>
                <p>Fat: {selectedFood.fat} g</p>
                <p>Source: {selectedFood.source}</p>
              </div>
              <div>
                <label className="block mb-2">Serving Size:</label>
                <input
                  type="number"
                  value={servingSize}
                  onChange={(e) => setServingSize(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                  min="1"
                />
                <label className="block mt-4 mb-2">Diary Group:</label>
        <select
          value={diaryGroup}
          onChange={(e) => setDiaryGroup(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="Uncategorized">Uncategorized</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snacks">Snacks</option>
        </select>
              </div>
            </div>
            <button
  onClick={() => {
    if (selectedFood) {
      onAdd(diaryGroup, {
        name: selectedFood.name,
        servingSize: servingSize,
        calories: selectedFood.calories,
        protein: selectedFood.protein,
        carbs: selectedFood.carbs,
        fat: selectedFood.fat,
      });
      closeModal();
    }
  }}
  className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
>
  Add to Diary
</button>
          </div>
        )}
      </div>
    </div>
  );  
};

export default AddFoodToDiary;
