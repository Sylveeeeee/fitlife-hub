import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "react-datepicker/dist/react-datepicker.css"; // นำเข้า CSS ของ Datepicker
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

interface BiometricEntry {
  id: number;
  value: number;
  recordedAt: string; // วันที่ที่บันทึก
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    borderDash?: number[];
    hidden?: boolean;
  }[];
}

// ติดตั้ง Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BiometricChart = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedRange, setSelectedRange] = useState<number | "all">(7);
  const [showWeightGoal, setShowWeightGoal] = useState<boolean>(false);
  const [weightGoal, setWeightGoal] = useState<number>(70);
  const [weightChange, setWeightChange] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBiometricData = async () => {
      setLoading(true);
      setError(null);

      const now = new Date();
      const endDate = now.toLocaleDateString("en-CA"); // วันที่ปัจจุบัน

      let startDateStr = null;
    if (selectedRange !== "all") {
      const startDate = new Date();
      startDate.setDate(now.getDate() - selectedRange); // คำนวณ startDate
      startDateStr = startDate.toLocaleDateString("en-CA");
    }
  
      try {
        const url = `/api/auth/biometric?${selectedRange !== "all" ? `startDate=${startDateStr}&endDate=${endDate}` : `endDate=${endDate}`}`;
      const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");
  
        const data = await response.json();
        
        if (data.data.length === 0) {
          setChartData(null); // ถ้าไม่มีข้อมูลเลย ให้ setChartData เป็น null
          setWeightChange(0);
          return;
        }
  
        // ✅ ใช้เฉพาะวันที่มีข้อมูล
        const labels = data.data.map((entry: BiometricEntry) => entry.recordedAt);
        const values = data.data.map((entry: BiometricEntry) => entry.value);
  
        // ✅ คำนวณการเปลี่ยนแปลงน้ำหนัก
        const initialWeight = values[0] || 0; // ค่าน้ำหนักในวันแรก
        const lastWeight = values[values.length - 1] || initialWeight; // ค่าน้ำหนักในวันสุดท้าย
        const weightChange = lastWeight - initialWeight;

        setWeightChange(weightChange); // เก็บค่าน้ำหนักที่เปลี่ยนแปลง
  
        setChartData({
          labels, // 👈 แสดงเฉพาะวันที่มีข้อมูล
          datasets: [
            {
              label: "Weight (kg)",
              data: values,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: false,
            },
            {
              label: "Weight Goal",
              data: values.map(() => weightGoal),
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: false,
              borderDash: [5, 5],
              hidden: !showWeightGoal,
            },
          ],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBiometricData();
  }, [selectedRange, weightGoal, showWeightGoal]); // 👈 อย่าลืม dependency
  
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white mt-5 w-[49%]">
      <h2 className="text-xl font-semibold mb-2">Weight Tracking</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && chartData && (
        <>
          <h3
  className={`font-bold mb-2 ${
          weightChange > 0
            ? "text-green-500"
            : weightChange < 0
            ? "text-red-500"
            : "text-gray-700"
        }`}
      >
        Weight Change: {weightChange !== null && weightChange !== undefined ? weightChange.toFixed(1) : "0.0"} kg
      </h3>

          <Line data={chartData} />

          {/* ตัวเลือกช่วงเวลา */}
          <div className="flex justify-between">
          <div className="mt-4 w-[45%]">
            <label className="block font-medium">Time Range:</label>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="border p-2 rounded-md w-full"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* เป้าหมาย */}
          <div className="mt-4 w-[45%] ">
            <label className="block font-medium">Weight Goal:</label>
            <input
              type="number"
              value={weightGoal}
              onChange={(e) => setWeightGoal(Number(e.target.value))}
              className="border p-2 rounded-md text-center w-[30%] h-[39px]"
            />{" "}
            kg
          </div>
          </div>
          {/* แสดง Weight Goal */}
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              checked={showWeightGoal}
              onChange={() => setShowWeightGoal(!showWeightGoal)}
              className="mr-2"
            />
            <label>Show Weight Goal</label>
          </div>
        </>
      )}
    </div>
  );
};

export default BiometricChart;
