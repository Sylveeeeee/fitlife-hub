import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FiSearch, } from "react-icons/fi";

interface DiaryExercise {
  id: number;
  name: string;
  category: string;
  baseCaloriesBurned: number;
}

interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

interface AddExerciseToDiaryProps {
  isOpen: boolean;
  closeModal: () => void;
  onAdd: (exercise: DiaryExercise, duration: number, date: string, caloriesBurned: number) => Promise<void>;
  selectedDate: Date;
  onExerciseAdded: () => void;
}

const AddExerciseToDiary: React.FC<AddExerciseToDiaryProps> = ({
  isOpen,
  closeModal,
  onAdd,
  selectedDate,
  onExerciseAdded,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [exercises, setExercises] = useState<DiaryExercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<DiaryExercise | null>(null);
  const [duration, setDuration] = useState<number>(30);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, setIsLoading] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);

  // ✅ ดึงข้อมูลประเภทหลัก
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch("/api/auth/exercise/categories");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error); // ✅ Log Error
      setError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  // ✅ ดึงหมวดหมู่ย่อยเมื่อเลือกหมวดหมู่หลัก
  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory.id);
    }
  }, [selectedCategory]);

  const fetchSubCategories = async (categoryId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth/exercise/subcategories?categoryId=${categoryId}`);
      if (!response.ok) throw new Error("Failed to fetch subcategories.");
      const data = await response.json();
      setSubCategories(data.subCategories);
    } catch (err) {
      console.error("Error fetching subcategories:", err); // ✅ ใช้ err เพื่อ debug
      setError("Failed to load subcategories.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ ดึงรายการออกกำลังกายเมื่อเลือกหมวดหมู่ย่อย
  useEffect(() => {
    if (selectedSubCategory) {
      fetchExercises(selectedSubCategory.id);
    }
  }, [selectedSubCategory]);

  const fetchExercises = async (subCategoryId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth/exercises?subCategoryId=${subCategoryId}`);
      if (!response.ok) throw new Error("Failed to fetch exercises.");
      const data = await response.json();
      setExercises(data.exercises);
    } catch (err) {
      console.error("Error fetching exercises:", err); // ✅ ใช้ err เพื่อ debug
      setError("Failed to load exercises.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ เพิ่มออกกำลังกายลงไดอารี่
  const handleAddExercise = async () => {
    if (!selectedExercise) {
      alert("❌ Please select an exercise!");
      return;
    }
    if (duration <= 0) {
      alert("❌ Please enter a valid duration.");
      return;
    }
    if (!selectedDate || isNaN(selectedDate.getTime())) {
      alert("❌ Invalid selected date.");
      return;
    }

    // ✅ คำนวณแคลอรี่ที่เผาผลาญโดยอัตโนมัติ
    const estimatedCaloriesBurned = selectedExercise
    ? (selectedExercise.baseCaloriesBurned * duration) / 60
    : null;

    if (!estimatedCaloriesBurned) {
    console.error("🚨 Missing estimatedCaloriesBurned value");
    return alert("Cannot calculate burned calories. Please try again.");
    }
  
    setIsLoading(true);
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
  
      console.log("📡 Sending API request:", {
        exerciseId: selectedExercise.id,
        duration,
        date: formattedDate,
      });
  

      await onAdd(selectedExercise, duration, formattedDate, estimatedCaloriesBurned);
      closeModal();
      onExerciseAdded();
    } catch (error) {
      console.error("❌ Error adding exercise:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal(); // ✅ ปิดเมื่อกดพื้นหลัง
      }}
      className="fixed top-0 left-0 w-screen h-screen bg-gray-700 bg-opacity-50 flex justify-center items-center z-[9999] text-black font-mono"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[70%] md:w-[50%] max-h-[90%] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Exercise</h2>
          <button onClick={closeModal} className="text-2xl">
            <IoMdClose />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises..."
            className="border p-2 rounded w-full pl-10"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-500" />
        </div>
        {/* Breadcrumb Navigation */}
        <div className="mb-4 text-xl text-gray-700 flex gap-2">
          <span
            className={`cursor-pointer ${selectedCategory ? "text-black font-bold" : "text-gray-500"}`}
            onClick={() => {
              setSelectedCategory(null);
              setSelectedSubCategory(null);
            }}
          >
            ALL CATEGORIES
          </span>
          {selectedCategory && <span className="text-gray-500">›</span>}
          
          {selectedCategory && (
            <span
              className={`cursor-pointer ${selectedSubCategory ? "text-black font-bold" : "text-gray-500"}`}
              onClick={() => setSelectedSubCategory(null)}
            >
              {selectedCategory.name.toUpperCase()}
            </span>
          )}
          {selectedSubCategory && <span className="text-gray-500">›</span>}

          {selectedSubCategory && (
            <span className="text-gray-500">{selectedSubCategory.name.toUpperCase()}</span>
          )}
        </div>
        {/* Step 1: เลือกประเภท */}
        {!selectedCategory && (
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className="bg-gray-100 p-4 rounded text-center hover:bg-gray-200"
                onClick={() => setSelectedCategory(category)}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: เลือกหมวดหมู่ย่อย */}
        {selectedCategory && !selectedSubCategory && (
          <div className="grid grid-cols-3 gap-4">
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                className="bg-gray-100 p-4 rounded text-center hover:bg-gray-200"
                onClick={() => setSelectedSubCategory(sub)}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Step 3: เลือกออกกำลังกาย */}
        {selectedSubCategory && (
          <div className="border rounded p-2 overflow-y-auto max-h-[300px]">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`flex justify-between items-center p-2 cursor-pointer ${
                  selectedExercise?.id === exercise.id ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedExercise(exercise)}
              >
                <div className="text-sm">{exercise.name}</div>
                <div className="text-xs text-gray-500">{exercise.baseCaloriesBurned} kcal/hr</div>
              </div>
            ))}
          </div>
        )}

        {/* ใส่ค่าระยะเวลา และเพิ่มเข้าไดอารี่ */}
        {selectedExercise && (
          <div className="mt-4">
            <label>Duration (minutes):</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="border p-2 rounded w-full"
            />
            <button onClick={handleAddExercise} className="mt-4 bg-black text-white px-4 py-2 rounded w-full">
              Add to Diary
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddExerciseToDiary;
