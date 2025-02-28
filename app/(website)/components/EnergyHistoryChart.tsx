import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2"; // เปลี่ยนเป็น Bar chart
import "react-datepicker/dist/react-datepicker.css"; // นำเข้า CSS ของ Datepicker
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// ประกาศ interface สำหรับข้อมูลที่ใช้แสดงในกราฟ

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

// ติดตั้ง Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EnergyHistoryChart = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedRange, setSelectedRange] = useState<number | "all">(7);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnergyHistoryData = async () => {
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
        const url = `/api/auth/energy-history?${selectedRange !== "all" ? `startDate=${startDateStr}&endDate=${endDate}` : `endDate=${endDate}`}`;
        const response = await fetch(url);
  
        if (!response.ok) throw new Error("Failed to fetch data");
  
        const data = await response.json();
  
        console.log("API Response:", data); // ดูโครงสร้างข้อมูล
  
        // ตรวจสอบว่า data.data.labels และ data.data.values เป็นอาร์เรย์หรือไม่
        if (!Array.isArray(data.data.labels) || !Array.isArray(data.data.values)) {
          throw new Error("Data labels or values is not an array");
        }
  
        if (data.data.labels.length === 0 || data.data.values.length === 0) {
          setChartData(null); // ถ้าไม่มีข้อมูลเลย ให้ setChartData เป็น null
          return;
        }
  
        // ใช้ labels และ values จาก response
        const labels = data.data.labels;
        const values = data.data.values;
  
        setChartData({
          labels, // วันที่ที่มีข้อมูล
          datasets: [
            {
              label: "Calories Burned (kcal)",
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.6)", // สีพื้นหลังของแท่ง
              borderColor: "rgb(75, 192, 192)", // สีกรอบแท่ง
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
  
    fetchEnergyHistoryData();
  }, [selectedRange]); // เมื่อ selectedRange เปลี่ยน จะดึงข้อมูลใหม่
  
  

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-[49%] mt-5">
      <h2 className="text-xl font-semibold mb-2">Energy History Tracking</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && chartData && (
        <>
          <Bar data={chartData} />

          {/* ตัวเลือกช่วงเวลา */}
          <div className="mt-4">
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
        </>
      )}
    </div>
  );
};

export default EnergyHistoryChart;
