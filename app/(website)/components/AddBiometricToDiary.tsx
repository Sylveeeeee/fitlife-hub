import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FiSearch } from "react-icons/fi";

interface BiometricMetric {
  id: number;
  name: string;
  unit: string;
  categoryId: number;
}

interface BiometricCategory {
  id: number;
  name: string;
}

interface BiometricEntry {
  id: number;
  type: "biometric";
  name: string;
  value: number;
  unit: string;
  date: string; // ✅ วันที่ที่บันทึก
  categoryId: number;  // เพิ่ม categoryId ใน BiometricEntry
  metricId: number;    // เพิ่ม metricId ใน BiometricEntry
  biometric: BiometricMetric; // ✅ เชื่อมโยงกับ `BiometricMetric`
}

interface AddBiometricToDiaryProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedDate: Date;
  onAdd: (biometric: BiometricEntry) => Promise<void>; // ✅ เพิ่ม prop ที่ถูกต้อง
  onBiometricAdded: () => void;
}

const AddBiometricToDiary: React.FC<AddBiometricToDiaryProps> = ({
  isOpen,
  closeModal,
  selectedDate,
  onAdd,
  onBiometricAdded,
}) => {
  const [categories, setCategories] = useState<BiometricCategory[]>([]);
  const [metrics, setMetrics] = useState<BiometricMetric[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BiometricCategory | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<BiometricMetric | null>(null);
  const [value, setValue] = useState<number | string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/auth/biometric/categories");
      if (!response.ok) throw new Error("Failed to fetch categories.");
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error); // ✅ Log Error
      setError("Failed to load categories.");
    }
  };

  useEffect(() => {
    if (selectedCategory) fetchMetrics(selectedCategory.id);
  }, [selectedCategory]);

  const fetchMetrics = async (categoryId: number) => {
    try {
      const response = await fetch(`/api/auth/biometric/metrics?categoryId=${categoryId}`);
      if (!response.ok) throw new Error("Failed to fetch metrics.");
      const data = await response.json();
      setMetrics(data.data);
    } catch (error) {
      console.error("Error fetching metrics:", error); // ✅ Log Error
      setError("Failed to load metrics.");
    }
  };



  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ ป้องกันการกดซ้ำ

const handleAddBiometric = async () => {
  if (isSubmitting) return; // ✅ ป้องกันการกดซ้ำ
  setIsSubmitting(true); // ✅ ล็อกการส่งข้อมูล

  if (!selectedCategory) {
    alert("❌ Please select a category.");
    setIsSubmitting(false);
    return;
  }

  if (!selectedMetric) {
    alert("❌ Please select a biometric metric.");
    setIsSubmitting(false);
    return;
  }

  if (!value || isNaN(Number(value)) || Number(value) <= 0) {
    alert("❌ Please enter a valid numeric value.");
    setIsSubmitting(false);
    return;
  }

  if (!selectedDate || isNaN(selectedDate.getTime())) {
    alert("❌ Invalid selected date.");
    setIsSubmitting(false);
    return;
  }

  const formattedDate = selectedDate.toISOString().split("T")[0];

  try {
    // ✅ ใช้ `onAdd` เพื่ออัปเดต State เท่านั้น (ไม่เรียก API)
    if (typeof onAdd === "function") {
      await onAdd({
        id: Date.now(), // ✅ ใช้ค่า mock ID (ไม่ดึงจาก API)
        type: "biometric",
        name: selectedMetric.name,
        value: Number(value),
        unit: selectedMetric.unit,
        date: formattedDate,
        categoryId: selectedCategory.id,
        metricId: selectedMetric.id,
        biometric: {
          id: selectedMetric.id,
          name: selectedMetric.name,
          unit: selectedMetric.unit,
          categoryId: selectedCategory.id,
        },
      });
    } else {
      console.warn("⚠️ onAdd is not defined");
    }

    // ✅ แจ้งว่าเพิ่ม Biometric สำเร็จ
    if (typeof onBiometricAdded === "function") {
      onBiometricAdded();
    }

    closeModal(); // ✅ ปิด Modal หลังจากบันทึกสำเร็จ
  } catch (error) {
    console.error("❌ Error adding biometric:", error);
    alert(error instanceof Error ? error.message : "Error adding biometric data.");
  } finally {
    setIsSubmitting(false); // ✅ ปลดล็อกเมื่อเสร็จ
  }
};

  

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
      className="fixed top-0 left-0 w-screen h-screen bg-gray-700 bg-opacity-50 flex justify-center items-center z-[9999] text-black font-mono"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[70%] md:w-[50%] max-h-[90%] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Biometric</h2>
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
            placeholder="Search biometrics..."
            className="border p-2 rounded w-full pl-10"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-500" />
        </div>

        {/* Breadcrumb Navigation */}
        <div className="mb-4 text-xl text-gray-700 flex gap-2">
          <span
            className={`cursor-pointer ${selectedCategory ? "text-black font-bold" : "text-gray-500"}`}
            onClick={() => setSelectedCategory(null)}
          >
            ALL CATEGORIES
          </span>
          {selectedCategory && <span className="text-gray-500">›</span>}
          {selectedCategory && (
            <span
              className={`cursor-pointer ${selectedMetric ? "text-black font-bold" : "text-gray-500"}`}
              onClick={() => setSelectedMetric(null)}
            >
              {selectedCategory.name.toUpperCase()}
            </span>
          )}
          {selectedMetric && <span className="text-gray-500">›</span>}
          {selectedMetric && <span className="text-gray-500">{selectedMetric.name.toUpperCase()}</span>}
        </div>

        {/* Step 1: เลือกหมวดหมู่ */}
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

        {/* Step 2: เลือกประเภทค่าชีวภาพ */}
        {selectedCategory && !selectedMetric && (
          <div className="grid grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                className="bg-gray-100 p-4 rounded text-center hover:bg-gray-200"
                onClick={() => setSelectedMetric(metric)}
              >
                {metric.name}
              </button>
            ))}
          </div>
        )}

        {/* Step 3: กรอกค่าชีวภาพ */}
        {selectedMetric && (
          <div className="mt-4">
            <label>Enter Value:</label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2 mt-2 relative">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full focus:outline-none"
                placeholder="Add a value..."
              />
              <span className="text-gray-500">{selectedMetric.unit}</span>
            </div>

            <button
              onClick={handleAddBiometric}
              disabled={!value || Number(value) <= 0}
              className={`mt-4 px-4 py-2 rounded-lg w-full ${
                value && Number(value) > 0 ? "bg-black text-white" : "bg-gray-200 text-gray-400 opacity-50"
              }`}
            >
              ADD TO DIARY
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBiometricToDiary;
