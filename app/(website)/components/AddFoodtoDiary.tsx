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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFoods = async (category: string, search: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/auth/foods?category=${category}&search=${search}`);
      if (!response.ok) {
        throw new Error("Failed to fetch foods");
      }
      const data = await response.json();
      setFoods(data);
    } catch (error) {
      console.error("Error fetching foods:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFoods(selectedCategory, searchQuery);
    }
  }, [isOpen, selectedCategory, searchQuery]);

  if (!isOpen) return null;

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
          <button onClick={closeModal} className="text-[26px] font-black" aria-label="Close modal">
            <IoMdClose />
          </button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for food"
          className="border p-2 rounded mt-4 mb-4 w-full"
          aria-label="Search for food"
        />

        <div className="flex space-x-2 mb-4">
          {["All", "Favorites", "Common Foods", "Beverages"].map((category) => (
            <CategoryButton
              key={category}
              category={category}
              selectedCategory={selectedCategory}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : foods.length === 0 ? (
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
  );
};

export default AddFoodtoDiary;
