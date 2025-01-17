import { useState } from 'react';

const WaterTracker = () => {
    const [glasses, setGlasses] = useState<number[]>([]); // ระบุประเภทว่าเป็นอาร์เรย์ของ number
    const maxGlasses = 8;

  const addGlass = () => {
    if (glasses.length < maxGlasses) {
      setGlasses([...glasses, glasses.length + 1]); // เพิ่มแก้วใหม่
    }
  };

  const removeGlass = () => {
    setGlasses(glasses.slice(0, -1)); // ลบแก้วสุดท้าย
  };

  const resetGlasses = () => {
    setGlasses([]); // รีเซ็ตแก้วทั้งหมด
  };

  return (
    <div className='text-center m-[20px] p-[20px] max-w-[450px] bg-white rounded-[10px]'>
      <h1 className='text-[20px]'>WATER TRACKER</h1>
      <div className='flex ml-[2px]'>
        {glasses.map((glass, index) => (
          <img
            key={index}
            src="/glass.png" // รูปแก้วน้ำ
            alt="Water Glass"
            className="w-[70px]"
            style={styles.glass}
          />
        ))}
      </div>
      {glasses.length >= maxGlasses && (
        <p style={styles.message}>You have reached your daily water intake goal!</p>
      )}
      <div style={styles.buttonContainer}>
        <button onClick={addGlass} style={styles.button} disabled={glasses.length >= maxGlasses}>
          + Add Glass
        </button>
        <button onClick={removeGlass} style={styles.button} disabled={glasses.length === 0}>
          - Remove Glass
        </button>
        <button onClick={resetGlasses} style={{ ...styles.button, backgroundColor: 'red' }}>
          Reset
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    margin: '50px auto',
    padding: '20px',
    maxWidth: '500px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  glassContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    margin: '20px 0',
  },
  glass: {
    width: '50px',
    height: '80px',
  },
  message: {
    color: 'green',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: 'black',
    color: 'white',
    transition: 'opacity 0.2s',
  },
};

export default WaterTracker;
