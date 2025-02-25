import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

interface Biometric {
  id: number;
  type: string;
  value: number | string;
  unit: string;
}

interface AddBiometricToDiaryProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedDate: Date;
  onAdd: (biometric: Biometric) => Promise<void>;
  onBiometricAdded: () => void;
}

const AddBiometricToDiary: React.FC<AddBiometricToDiaryProps> = ({
  isOpen,
  closeModal,
  selectedDate,
  onAdd,
  onBiometricAdded,
}) => {
  const [biometricType, setBiometricType] = useState<string>("Weight");
  const [value, setValue] = useState<number | string>("");
  const [unit, setUnit] = useState<string>("kg");
  const [systolic, setSystolic] = useState<number | string>("");
  const [diastolic, setDiastolic] = useState<number | string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // อัปเดตหน่วยตามประเภทที่เลือก
  const handleTypeChange = (type: string) => {
    setBiometricType(type);
    setValue(""); // รีเซ็ตค่า
    setSystolic(""); // รีเซ็ตค่าความดันโลหิต
    setDiastolic("");

    switch (type) {
      case "Weight":
        setUnit("kg");
        break;
      case "Body Fat":
        setUnit("%");
        break;
      case "Blood Pressure":
        setUnit("mmHg");
        break;
      default:
        setUnit("");
    }
  };

  const handleAddBiometric = async () => {
    if (biometricType === "Blood Pressure") {
      if (!systolic || !diastolic) {
        alert("Please enter both systolic and diastolic values.");
        return;
      }
    } else {
      if (!value || Number(value) <= 0) {
        alert("Please enter a valid value.");
        return;
      }
    }

    setIsLoading(true);
    const date = selectedDate.toISOString().split("T")[0];

    try {
      const newBiometric =
        biometricType === "Blood Pressure"
          ? { id: Date.now(), type: biometricType, value: `${systolic}/${diastolic}`, unit }
          : { id: Date.now(), type: biometricType, value: Number(value), unit };

      await onAdd(newBiometric);
      closeModal();
      onBiometricAdded();
    } catch (error) {
      alert("Failed to add biometric data.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[80%] max-h-[90%] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Biometric Data</h2>
          <button onClick={closeModal} className="text-xl">
            <IoMdClose />
          </button>
        </div>

        {/* ประเภทข้อมูลชีวภาพ */}
        <label className="block">Biometric Type:</label>
        <select
          value={biometricType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="Weight">Weight</option>
          <option value="Body Fat">Body Fat %</option>
          <option value="Blood Pressure">Blood Pressure</option>
        </select>

        {/* ช่องกรอกค่า */}
        {biometricType === "Blood Pressure" ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block">Systolic (Upper)</label>
              <input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block">Diastolic (Lower)</label>
              <input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <label className="block">Value:</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        )}

        {/* หน่วย */}
        <label className="block mt-4">Unit:</label>
        <input type="text" value={unit} readOnly className="border p-2 rounded w-full bg-gray-100" />

        {/* ปุ่มเพิ่มข้อมูล */}
        <button
          onClick={handleAddBiometric}
          disabled={isLoading}
          className={`mt-4 px-4 py-2 rounded w-full ${
            isLoading ? "bg-gray-400" : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isLoading ? "Adding..." : "Add to Diary"}
        </button>
      </div>
    </div>
  );
};

export default AddBiometricToDiary;
