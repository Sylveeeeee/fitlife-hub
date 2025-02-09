import { useState, useEffect } from 'react';
import Image from 'next/image';

const WaterTracker = () => {
  const [glasses, setGlasses] = useState<number[]>([]);
  const maxGlasses = 8;
  const userId = 1; // ปรับให้ dynamic ได้ตามระบบจริง

  // ดึงข้อมูลจาก API เมื่อโหลด Component
  useEffect(() => {
    const fetchGlasses = async () => {
      try {
        const res = await fetch(`/api/auth/watertracker?userId=${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error('Failed to fetch glasses');

        const userGlasses = data.map((glass: { count: number }) => glass.count);
        setGlasses(userGlasses);
        localStorage.setItem('waterGlasses', JSON.stringify(userGlasses));
      } catch (error) {
        console.error('Error fetching glasses:', error);
      }
    };

    fetchGlasses();
  }, []);

  const addGlass = async () => {
    if (glasses.length < maxGlasses) {
      try {
        const newGlassCount = glasses.length + 1;
        await fetch('/api/auth/watertracker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, count: newGlassCount }),
        });

        // ดึงข้อมูลใหม่จาก API
        const res = await fetch(`/api/auth/watertracker?userId=${userId}`);
        const data = await res.json();
        setGlasses(data.map((glass: { count: number }) => glass.count));
      } catch (error) {
        console.error('Error adding glass:', error);
      }
    }
  };

  const removeGlass = async () => {
    if (glasses.length > 0) {
      try {
        const res = await fetch(`/api/auth/watertracker?userId=${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error('Failed to fetch glasses');

        const lastGlass = data.pop();
        if (!lastGlass) return;

        await fetch('/api/auth/watertracker', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: lastGlass.id, userId }),
        });

        // ดึงข้อมูลใหม่จาก API
        const updatedRes = await fetch(`/api/auth/watertracker?userId=${userId}`);
        const updatedData = await updatedRes.json();
        setGlasses(updatedData.map((glass: { count: number }) => glass.count));
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
        body: JSON.stringify({ reset: true, userId }),
      });

      setGlasses([]);
      localStorage.removeItem('waterGlasses');
    } catch (error) {
      console.error('Error resetting glasses:', error);
    }
  };

  return (
    <div className="flex flex-col items-center text-center m-5 p-5 w-full max-w-[600px] bg-white rounded-lg shadow-lg">
      <h1 className="text-xl md:text-2xl font-bold mb-4">WATER TRACKER</h1>
      <div className="flex flex-wrap justify-center gap-2">
        {glasses.map((_, index) => (
          <Image key={index} src="/glass.png" alt="Water Glass" width={50} height={70} className="w-[30px] h-[40px] sm:w-[40px] sm:h-[50px] md:w-[50px] md:h-[60px] lg:w-[60px] lg:h-[70px]" />
        ))}
      </div>
      <p className={`font-bold mt-2 text-sm sm:text-base ${glasses.length >= maxGlasses ? 'text-green-600' : 'text-red-600'}`}>
        {glasses.length >= maxGlasses ? 'You have reached your daily goal!' : "You haven't reached your goal yet!"}
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-4 w-full">
        <button onClick={addGlass} disabled={glasses.length >= maxGlasses} className="bg-black text-white px-4 py-2 rounded-md w-full sm:w-auto">
          + Add Glass
        </button>
        <button onClick={removeGlass} disabled={glasses.length === 0} className="bg-black text-white px-4 py-2 rounded-md w-full sm:w-auto">
          - Remove Glass
        </button>
        <button onClick={resetGlasses} className="bg-red-500 text-white px-4 py-2 rounded-md w-full sm:w-auto">
          Reset
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;