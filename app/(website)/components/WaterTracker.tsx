import { useState, useEffect } from 'react';
import Image from 'next/image';

const WaterTracker = () => {
  const [glasses, setGlasses] = useState<number[]>([]);
  const maxGlasses = 8;

  // โหลดข้อมูลจาก localStorage เมื่อ Component โหลดเสร็จ
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedGlasses = localStorage.getItem('waterGlasses');
      if (storedGlasses) {
        setGlasses(JSON.parse(storedGlasses));
      }
    }
  }, []);

  // อัปเดต localStorage ทุกครั้งที่ glasses เปลี่ยน
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('waterGlasses', JSON.stringify(glasses));
    }
  }, [glasses]);

  const addGlass = async () => {
    if (glasses.length < maxGlasses) {
      const newGlassCount = glasses.length + 1;

      try {
        await fetch('/api/auth/watertracker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 1, count: newGlassCount }),
        });

        setGlasses((prev) => [...prev, newGlassCount]); // ใช้ prev เพื่อให้แน่ใจว่าอัปเดตค่าใหม่
      } catch (error) {
        console.error('Error adding glass:', error);
      }
    }
  };

  const removeGlass = async () => {
    if (glasses.length > 0) {
      try {
        // 1️⃣ ดึงข้อมูลแก้วน้ำทั้งหมดของ userId 1 (สามารถปรับเป็น dynamic ได้)
        const res = await fetch('/api/auth/watertracker', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error('Failed to fetch glasses');
  
        // 2️⃣ หาค่าแก้วสุดท้ายของ userId 1
        const lastGlass = data
          .filter((glass: { userId: number; }) => glass.userId === 1) // ปรับ userId ตามจริง
          .pop();
  
        if (!lastGlass) return;
  
        console.log('Deleting glass ID:', lastGlass.id);
  
        // 3️⃣ ส่งคำขอลบโดยส่ง `id` ไปให้ API
        await fetch('/api/auth/watertracker', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: lastGlass.id, userId: 1 }), // เพิ่ม userId
        });
  
        // 4️⃣ อัปเดต state และ localStorage
        const updatedGlasses = glasses.slice(0, -1);
        setGlasses(updatedGlasses);
        localStorage.setItem('waterGlasses', JSON.stringify(updatedGlasses));
      } catch (error) {
        console.error('Error removing glass:', error);
      }
    }
  };
  

  const resetGlasses = async () => {
    try {
      await fetch('/api/auth/watertracker', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true }),
      });

      setGlasses([]);
      localStorage.removeItem('waterGlasses'); // เคลียร์ localStorage ด้วย
    } catch (error) {
      console.error('Error resetting glasses:', error);
    }
  };

  return (
    <div className="flex flex-col justify-between text-center m-5 p-5 max-w-[600px] bg-white rounded-lg shadow-lg w-full h-[250px] sm:w-[400px] md:w-[550px] lg:w-[600px]">
      <div className="flex-grow">
        <h1 className="text-xl md:text-2xl font-bold mb-4">WATER TRACKER</h1>
        <div className="flex flex-wrap justify-center gap-2">
          {glasses.map((_, index) => (
            <Image
              key={index}
              src="/glass.png"
              alt="Water Glass"
              width={50}
              height={70}
              className="w-[40px] h-[50px] sm:w-[50px] sm:h-[60px]"
            />
          ))}
        </div>
        <p
          className={`font-bold mt-2 ${
            glasses.length >= maxGlasses ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {glasses.length >= maxGlasses
            ? 'You have reached your daily water intake goal!'
            : "You haven't reached your goal yet!"}
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-4">
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
