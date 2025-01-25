'use client'

import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface EnergySummaryProps {
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const EnergySummary: React.FC<EnergySummaryProps> = ({ totals }) => {
  const [targets, setTargets] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);

  // ดึงข้อมูลเป้าหมาย (targets) จาก API
  const fetchDietGoals = async () => {
    try {
      const response = await fetch("/api/auth/diet-goals", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ใช้ Cookie ที่มีอยู่
      });

      if (!response.ok) {
        throw new Error("Failed to fetch diet goals.");
      }

      const data = await response.json();
      setTargets(data); // เก็บข้อมูลที่ดึงมาใน state
    } catch (error) {
      console.error("Error fetching diet goals:", error);
    }
  };

  useEffect(() => {
    fetchDietGoals(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลเมื่อคอมโพเนนต์โหลด
  }, []);

  const progressBarStyle = (current: number, target: number) => {
    const percentage = target ? Math.min((current / target) * 100, 100) : 0;
    return {
      width: `${percentage}%`,
    };
  };

  if (!targets) {
    return <div>Loading...</div>; // กำลังโหลดข้อมูล targets หรือแสดงข้อความ error
  }

  // ข้อมูล Doughnut สำหรับกราฟ
  const consumedData = {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [
      {
        data: [totals.protein, totals.carbs, totals.fat],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="grid grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow">
      {/* Left Side: Doughnut Chart */}
      <div className="grid grid-cols-3 gap-4 items-center">
        <div>
          <Doughnut data={consumedData} width={200} height={200}  />
          <p className="text-center mt-2 font-semibold">Consumed</p>
        </div>
      </div>

      {/* Right Side: Targets */}
      <div className="flex flex-col justify-center space-y-4">
        {/* Energy */}
        <div className="space-y-2">
          <p className="font-semibold">Energy</p>
          <div className="w-full bg-gray-300 rounded h-4 relative">
            <div
              className="bg-gray-600 h-4 rounded"
              style={progressBarStyle(totals.calories, targets.calories)}
            />
            <div className="absolute inset-0 flex justify-between text-xs px-2">
              <span>{totals.calories ? totals.calories.toFixed(1) : "0"} / {targets.calories ? targets.calories.toFixed(1) : "0"} kcal</span>
              <span>{targets.calories ? ((totals.calories / targets.calories) * 100).toFixed(0) : "0"}%</span>
            </div>
          </div>
        </div>

        {/* Protein */}
        <div className="space-y-2">
          <p className="font-semibold">Protein</p>
          <div className="w-full bg-gray-300 rounded h-4 relative">
            <div
              className="bg-green-500 h-4 rounded"
              style={progressBarStyle(totals.protein, targets.protein)}
            />
            <div className="absolute inset-0 flex justify-between text-xs px-2">
              <span>{totals.protein ? totals.protein.toFixed(1) : "0"} g</span>
              <span>{targets.protein ? ((totals.protein / targets.protein) * 100).toFixed(0) : "0"}%</span>
            </div>
          </div>
        </div>

        {/* Carbs */}
        <div className="space-y-2">
          <p className="font-semibold">Net Carbs</p>
          <div className="w-full bg-gray-300 rounded h-4 relative">
            <div
              className="bg-blue-500 h-4 rounded"
              style={progressBarStyle(totals.carbs, targets.carbs)}
            />
            <div className="absolute inset-0 flex justify-between text-xs px-2">
              <span>{totals.carbs ? totals.carbs.toFixed(1) : "0"} g</span>
              <span>{targets.carbs ? ((totals.carbs / targets.carbs) * 100).toFixed(0) : "0"}%</span>
            </div>
          </div>
        </div>

        {/* Fat */}
        <div className="space-y-2">
          <p className="font-semibold">Fat</p>
          <div className="w-full bg-gray-300 rounded h-4 relative">
            <div
              className="bg-red-500 h-4 rounded"
              style={progressBarStyle(totals.fat, targets.fat)}
            />
            <div className="absolute inset-0 flex justify-between text-xs px-2">
              <span>{totals.fat ? totals.fat.toFixed(1) : "0"} g</span>
              <span>{targets.fat ? ((totals.fat / targets.fat) * 100).toFixed(0) : "0"}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergySummary;
