import { useState } from 'react';
import Image from 'next/image';

const WaterTracker = () => {
  const [glasses, setGlasses] = useState<number[]>([]); // ระบุประเภทว่าเป็นอาร์เรย์ของ number
  const maxGlasses = 8;

  const addGlass = async () => {
    if (glasses.length < maxGlasses) {
      const newGlassCount = glasses.length + 1;

      // เพิ่มข้อมูลลงในฐานข้อมูล
      try {
        await fetch('/api/glasses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 1, count: newGlassCount }), // userId สามารถเปลี่ยนได้ตามผู้ใช้งานจริง
        });

        setGlasses([...glasses, newGlassCount]);
      } catch (error) {
        console.error('Error adding glass:', error);
      }
    }
  };

  const removeGlass = async () => {
    if (glasses.length > 0) {
      const updatedGlasses = glasses.slice(0, -1);

      // อัปเดตฐานข้อมูล
      try {
        await fetch('/api/glasses', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: glasses.length }), // ใช้ `id` ที่เกี่ยวข้อง
        });

        setGlasses(updatedGlasses);
      } catch (error) {
        console.error('Error removing glass:', error);
      }
    }
  };

  const resetGlasses = async () => {
    // ลบข้อมูลทั้งหมด
    try {
      await fetch('/api/glasses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true }), // สร้างเงื่อนไขใน API สำหรับการรีเซ็ต
      });

      setGlasses([]);
    } catch (error) {
      console.error('Error resetting glasses:', error);
    }
  };

  return (
    <div className="text-center m-5 p-5 max-w-[600px] bg-white rounded-lg shadow-lg w-[550px]">
      <h1 className="text-2xl font-bold mb-4">WATER TRACKER</h1>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {glasses.map((glass, index) => (
          <Image
            key={index}
            src="/glass.png"
            alt="Water Glass"
            width={50}
            height={70}
            className="w-[50px] h-[60px]"
          />
        ))}
      </div>
      {glasses.length >= maxGlasses && (
        <p className="text-green-600 font-bold text-lg mb-4">
          You have reached your daily water intake goal!
        </p>
      )}
      <div className="flex justify-center gap-4">
        <button
          onClick={addGlass}
          disabled={glasses.length >= maxGlasses}
          className={`px-4 py-2 rounded-md text-white font-medium transition ${
            glasses.length >= maxGlasses
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-700'
          }`}
        >
          + Add Glass
        </button>
        <button
          onClick={removeGlass}
          disabled={glasses.length === 0}
          className={`px-4 py-2 rounded-md text-white font-medium transition ${
            glasses.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-700'
          }`}
        >
          - Remove Glass
        </button>
        <button
          onClick={resetGlasses}
          className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-700 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
