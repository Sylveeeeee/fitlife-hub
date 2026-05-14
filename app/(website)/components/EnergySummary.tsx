"use client";
import React, { useState, useEffect,  } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DietGoals {
  daily_calories: number;
  daily_protein: number;
  daily_carbs: number;
  daily_fat: number;
}

interface EnergySummaryProps {
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  burnedCalories: number;
  remainingCalories: number;
  exerciseTotals: number;
}

const EnergySummary: React.FC<EnergySummaryProps> = ({
  totals,
  burnedCalories,
  remainingCalories,
  exerciseTotals,
}) => {
  const [targets, setTargets] = useState<DietGoals | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fetchDietGoals = async () => {
    try {
      const response = await fetch("/api/auth/diet-goals", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch diet goals.");
      }

      const data = await response.json();
      setTargets(data);
    } catch (error) {
      console.error("Error fetching diet goals:", error);
      setErrorMessage("Failed to fetch diet goals.");
    }
  };

  useEffect(() => {
    fetchDietGoals();
  }, []);
  useEffect(() => {
    fetchDietGoals();

    // ✅ ดักฟัง Event `updateDietGoals` แล้วเรียก API ใหม่
    const handleAddBiometricToDiary = () => {
      fetchDietGoals();
    };

    window.addEventListener("updateDietGoals", handleAddBiometricToDiary);

    return () => {
      window.removeEventListener("updateDietGoals", handleAddBiometricToDiary);
    };
  }, []);
  const progressBarStyle = (current: number, target: number) => {
    const percentage = target ? Math.min((current / target) * 100, 100) : 0;
    return {
      width: `${percentage}%`,
    };
  };
 // ✅ ดึงค่าเป้าหมายอาหารเมื่อ Component โหลด
  
  // Doughnut chart data for the consumed, burned, and remaining calories
  const energyData = {
    labels:["Net Carbs", "Fat" ,"Protein"], 
    datasets: [
      {
        data: [totals.carbs,totals.fat,totals.protein ],
        backgroundColor: ["#0de3ff", "#ff4d4d","#30df20"],
        hoverBackgroundColor: ["#0de3ff", "#ff4d4d","#30df20"],
      },
    ],
  };

  
  const burnedData = {
    labels: ["Burned","Exercise"],
    datasets: [
      {
        data: [burnedCalories,exerciseTotals],
        backgroundColor: ["#ffad41", "#f07f90"],
        hoverBackgroundColor: ["#ffad41", "#f07f90"],
      },
    ],
  };

  const remainingData = {
    labels: ["Consumed","Remaining"],
    datasets: [
      {
        data: [totals.calories,remainingCalories, ],
        backgroundColor: ["#7e7e7e","#D3D3D3"],
        hoverBackgroundColor: ["#7e7e7e", "#D3D3D3"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        display: false, // ทำให้ label อยู่ด้านข้างแทนด้านบน
      },
       
    },
  };

  if (!targets) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#fff] p-6 rounded-lg shadow-lg mb-20 flex ">
      <div className="w-[50%]">
      <p className="font-bold text-[20px]">Energy Summary</p>
      <div className="grid grid-cols-3 gap-8 ">
        {/* Left Side: Doughnut Chart for Consumed and Remaining */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-28 h-32 aspect-square mb-4 ">
            <Doughnut  data={energyData} options={options} />
          </div>
          <p className="text-lg font-semibold">Consumed</p>
          <p className="text-sm text-gray-500">{totals.calories} kcal</p>
          
        </div>

        {/* Middle: Doughnut Chart for Burned and Remaining */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-28 h-32 aspect-square  mb-4">
            <Doughnut data={burnedData} options={options} />
          </div>
          <p className="text-lg font-semibold">Burned</p>
          <p className="text-sm text-gray-500">{burnedCalories+exerciseTotals} kcal</p>
        </div>

        {/* Right Side: Doughnut Chart for Remaining and Consumed */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-28 h-32 aspect-square mb-4">
            <Doughnut data={remainingData} options={options} />
          </div>
          <p className="text-lg font-semibold">Remaining</p>
          <p className="text-sm text-gray-500 ">{remainingCalories} kcal</p>
        </div>
      </div>
      </div>

      <div className="border border-gray-300"></div>

      {/* Targets */}
    <div className="w-[50%] ml-10 ">
      <p className="font-bold text-[20px]">Targets</p>
      <div className="flex flex-col justify-center space-y-4  mt-2 ">
        {/* Calories Progress */}
        <div className=" flex items-center">
          <p className="w-[30%]  text-lg">Energy</p>

          {/* ตัวเลขอยู่ด้านบน */}
          <div className="w-[100%]">
          <div className="w-full flex justify-between text-sm ">
          <span>
            {totals.calories ? totals.calories.toFixed(1) : "0"} 
            {exerciseTotals ? ` (${(totals.calories - exerciseTotals).toFixed(1)} net)` : ""} 
            / {targets.daily_calories ? targets.daily_calories.toFixed(1) : "0"} kcal
          </span>
            <span>
              {targets.daily_calories
                ? (((totals.calories-exerciseTotals) / targets.daily_calories) * 100).toFixed(0)
                : "0"}
              %
            </span>
          </div>

          {/* ProgressBar */}
          <div className="w-full bg-gray-300 rounded h-3">
            <div
              className="bg-gray-600 h-3 rounded"
              style={progressBarStyle(totals.calories-exerciseTotals, targets.daily_calories)}
            />
          </div>
        </div>
        </div>
        {/* Protein Progress */}
        <div className="flex items-center">
          <p className="w-[30%] text-lg">Protein</p>

          <div className="w-[100%]">
            <div className="w-full flex justify-between text-sm  ">
              <span>
                {totals.protein ? totals.protein.toFixed(1) : "0"} /{" "}
                {targets.daily_protein ? targets.daily_protein.toFixed(1) : "0"} g
              </span>
              <span>
                {targets.daily_protein
                  ? ((totals.protein / targets.daily_protein) * 100).toFixed(0)
                  : "0"}
                %
              </span>
            </div>

            {/* ProgressBar */}
            <div className="w-full bg-gray-300 rounded h-3">
              <div
                className="bg-[#30df20] h-3 rounded"
                style={progressBarStyle(totals.protein, targets.daily_protein)}
              />
            </div>
          </div>
        </div>

        {/* Carbs Progress */}
        <div className="flex items-center">
          <p className="w-[30%] text-lg">Net Carbs</p>

          <div className="w-[100%]">
            <div className="w-full flex justify-between text-sm  ">
              <span>
                {totals.carbs ? totals.carbs.toFixed(1) : "0"} /{" "}
                {targets.daily_carbs ? targets.daily_carbs.toFixed(1) : "0"} g
              </span>
              <span>
                {targets.daily_carbs
                  ? ((totals.carbs / targets.daily_carbs) * 100).toFixed(0)
                  : "0"}
                %
              </span>
            </div>

            {/* ProgressBar */}
            <div className="w-full bg-gray-300 rounded h-3">
              <div
                className="bg-[#0de3ff] h-3 rounded"
                style={progressBarStyle(totals.carbs, targets.daily_carbs)}
              />
            </div>
          </div>
        </div>

        {/* Fat Progress */}
        <div className="flex items-center">
          <p className="w-[30%] text-lg">Fat</p>

          <div className="w-[100%]">
            <div className="w-full flex justify-between text-sm ">
              <span>
                {totals.fat ? totals.fat.toFixed(1) : "0"} /{" "}
                {targets.daily_fat ? targets.daily_fat.toFixed(1) : "0"} g
              </span>
              <span>
                {targets.daily_fat
                  ? ((totals.fat / targets.daily_fat) * 100).toFixed(0)
                  : "0"}
                %
              </span>
            </div>

            {/* ProgressBar */}
            <div className="w-full bg-gray-300 rounded h-3">
              <div
                className="bg-[#ff4d4d] h-3 rounded"
                style={progressBarStyle(totals.fat, targets.daily_fat)}
              />
            </div>
          </div>
        </div>
      </div>
      {errorMessage && <p className="text-red-500 py-4">{errorMessage}</p>}
    </div>
  </div>
  );
};

export default EnergySummary;
