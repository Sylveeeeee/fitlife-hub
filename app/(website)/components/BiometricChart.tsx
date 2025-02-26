import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // นำเข้า CSS ของ Datepicker
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

interface Biometric {
  id: number;
  name: string;
  unit: string;
}

interface BiometricEntry {
  id: number;
  type: "biometric"; // ระบุว่าเป็นค่าชีวภาพ
  name: string;
  value: number;
  unit: string;
  date: string; // วันที่ที่บันทึก Biometric
  categoryId: number;  // เพิ่ม categoryId ใน BiometricEntry
  metricId: number;    // เพิ่ม metricId ใน BiometricEntry
  biometric: Biometric; // ข้อมูลค่าชีวภาพ
  recordedAt: string;   // วันที่ที่บันทึก
}

interface ChartData {
  labels: string[]; // วันที่
  datasets: {
    label: string;
    data: number[];  // ค่าของ Biometrics
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    borderDash?: number[]; // สำหรับเส้นประของ Weight Goal
    hidden?: boolean; // ซ่อนกราฟ Weight Goal
  }[];
}

// ติดตั้ง Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BiometricChart = ({ initialDate }: { initialDate: string }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [showWeightGoal, setShowWeightGoal] = useState<boolean>(false);

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API
  useEffect(() => {
    const fetchBiometricData = async () => {
      const response = await fetch(`/api/auth/biometric?date=${selectedDate}`);
      const data = await response.json();

      if (data.data) {
        // เตรียมข้อมูลกราฟ
        const labels = data.data.map((entry: BiometricEntry) => entry.recordedAt); // วันที่
        const values = data.data.map((entry: BiometricEntry) => entry.value); // ค่า biometrics
        const categories = data.data.map((entry: BiometricEntry) => entry.categoryId); // หมวดหมู่

        setChartData({
          labels,
          datasets: [
            {
              label: categories.join(", "), // แสดงชื่อหมวดหมู่
              data: values,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: false,
            },
            {
              label: "Weight Goal",
              data: values.map(() => 70), // กำหนดเป็นค่าเป้าหมาย เช่น 70 kg
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: false,
              borderDash: [5, 5], // เส้นประสำหรับเป้าหมาย
              hidden: !showWeightGoal, // สามารถซ่อนแสดงค่าเป้าหมาย
            },
          ],
        });
      }
    };

    fetchBiometricData();
  }, [selectedDate, showWeightGoal]);

  if (!chartData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Biometric Data Chart</h2>

      {/* DatePicker เพื่อให้เลือกวันที่ */}
      <div className="mb-4">
        <DatePicker
          selected={new Date(selectedDate)}
          onChange={(date: Date | null) => {
            if (date) {
              setSelectedDate(date.toISOString().split("T")[0]); // แปลง Date เป็น String
            }
          }}
          dateFormat="yyyy-MM-dd"
          className="border p-2 rounded"
        />
      </div>

      {/* กราฟแสดงข้อมูล */}
      <Line data={chartData} />

      {/* ปรับแสดง Weight Goal */}
      <div className="mt-4">
        <div>
          <strong>Weight Goal: </strong> 70 kg
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showWeightGoal}
              onChange={() => setShowWeightGoal(!showWeightGoal)}
            />{" "}
            Show Weight Goal
          </label>
        </div>
      </div>
    </div>
  );
};

export default BiometricChart;
