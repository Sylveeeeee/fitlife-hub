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
    <div className='text-center m-[20px] p-[20px] max-w-[450px] bg-white rounded-[10px]'>
      <h1 className='text-[20px]'>WATER TRACKER</h1>
      <div className='flex ml-[2px]'>
        {glasses.map((glass, index) => (
          <Image
            key={index}
            src="/glass.png"
            alt="Water Glass"
            width={60}
            height={70}
            className="w-[50px] h-[60px] mt-[10px]"
          />
        ))}
      </div>
      {glasses.length >= maxGlasses && (
        <p style={{ color: 'green', fontSize: '18px', fontWeight: 'bold' }}>
          You have reached your daily water intake goal!
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <button onClick={addGlass} disabled={glasses.length >= maxGlasses}>
          + Add Glass
        </button>
        <button onClick={removeGlass} disabled={glasses.length === 0}>
          - Remove Glass
        </button>
        <button onClick={resetGlasses} style={{ backgroundColor: 'red' }}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
