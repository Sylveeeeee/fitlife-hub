import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

interface Biometric {
  id: number;
  type: string;
  value: number;
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
  const [value, setValue] = useState<number>(0);
  const [unit, setUnit] = useState<string>("kg");

  const handleAddBiometric = async () => {
    setIsLoading(true);
    const date = selectedDate.toISOString().split("T")[0];

    try {
      await onAdd({ id: Date.now(), type: biometricType, value, unit });
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

        <label className="block">Biometric Type:</label>
        <select value={biometricType} onChange={(e) => setBiometricType(e.target.value)} className="border p-2 rounded w-full">
          <option value="Weight">Weight</option>
          <option value="Body Fat">Body Fat %</option>
          <option value="Blood Pressure">Blood Pressure</option>
        </select>

        <label className="block mt-4">Value:</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />

        <label className="block mt-4">Unit:</label>
        <input type="text" value={unit} readOnly className="border p-2 rounded w-full" />

        <button onClick={handleAddBiometric} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Add to Diary
        </button>
      </div>
    </div>
  );
};

export default AddBiometricToDiary;
