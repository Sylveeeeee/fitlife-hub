"use client";
import React, { useState, useEffect, } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

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
}

const EnergySummary: React.FC<EnergySummaryProps> = ({
  totals,
  burnedCalories,
  remainingCalories,
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

  const progressBarStyle = (current: number, target: number) => {
    const percentage = target ? Math.min((current / target) * 100, 100) : 0;
    return {
      width: `${percentage}%`,
    };
  };

  // Doughnut chart data for the consumed, burned, and remaining calories
  const energyData = {
    labels: ["Consumed", "Remaining"],
    datasets: [
      {
        data: [totals.calories, remainingCalories],
        backgroundColor: ["#FF6384", "#D3D3D3"],
        hoverBackgroundColor: ["#FF6384", "#D3D3D3"],
      },
    ],
  };

  const burnedData = {
    labels: ["Burned", "Remaining"],
    datasets: [
      {
        data: [burnedCalories, remainingCalories],
        backgroundColor: ["#36A2EB", "#D3D3D3"],
        hoverBackgroundColor: ["#36A2EB", "#D3D3D3"],
      },
    ],
  };

  const remainingData = {
    labels: ["Remaining", "Consumed"],
    datasets: [
      {
        data: [remainingCalories, totals.calories],
        backgroundColor: ["#D3D3D3", "#FF6384"],
        hoverBackgroundColor: ["#D3D3D3", "#FF6384"],
      },
    ],
  };

  if (!targets) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-3 gap-8">
        {/* Left Side: Doughnut Chart for Consumed and Remaining */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 mb-4">
            <Doughnut data={energyData} />
          </div>
          <p className="text-lg font-semibold">Energy Summary</p>
          <p className="text-sm text-gray-500">Consumed: {totals.calories} kcal</p>
          <p className="text-sm text-gray-500">Remaining: {remainingCalories} kcal</p>
        </div>

        {/* Middle: Doughnut Chart for Burned and Remaining */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 mb-4">
            <Doughnut data={burnedData} />
          </div>
          <p className="text-lg font-semibold">Burned</p>
          <p className="text-sm text-gray-500">Burned: {burnedCalories} kcal</p>
          <p className="text-sm text-gray-500">Remaining: {remainingCalories} kcal</p>
        </div>

        {/* Right Side: Doughnut Chart for Remaining and Consumed */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 mb-4">
            <Doughnut data={remainingData} />
          </div>
          <p className="text-lg font-semibold">Remaining</p>
          <p className="text-sm text-gray-500">Remaining: {remainingCalories} kcal</p>
        </div>
      </div>

      {/* Targets */}
      <div className="flex flex-col justify-center space-y-4 mt-6">
        {/* Calories Progress */}
        <div>
          <p className="font-semibold">Daily Calories</p>
          <div className="w-full bg-gray-300 rounded h-4 relative">
            <div
              className="bg-gray-600 h-4 rounded"
              style={progressBarStyle(totals.calories, targets.daily_calories)}
            />
            <div className="absolute inset-0 flex justify-between text-xs px-2">
              <span>
                {totals.calories ? totals.calories.toFixed(1) : "0"} /{" "}
                {targets.daily_calories ? targets.daily_calories.toFixed(1) : "0"} kcal
              </span>
              <span>
                {targets.daily_calories
                  ? ((totals.calories / targets.daily_calories) * 100).toFixed(0)
                  : "0"}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Protein Progress */}
        <div>
          <p className="font-semibold">Protein</p>
          <div className="w-full bg-gray-300 rounded h-4 relative">
            <div
              className="bg-green-500 h-4 rounded"
              style={progressBarStyle(totals.protein, targets.daily_protein)}
            />
            <div className="absolute inset-0 flex justify-between text-xs px-2">
              <span>{totals.protein ? totals.protein.toFixed(1) : "0"} g</span>
              <span>
                {targets.daily_protein
                  ? ((totals.protein / targets.daily_protein) * 100).toFixed(0)
                  : "0"}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Carbs Progress */}
        <div>
          <p className="font-semibold">Net Carbs</p>
          <div className="w-full bg-gray-300 rounded h-4 relative">
            <div
              className="bg-blue-500 h-4 rounded"
              style={progressBarStyle(totals.carbs, targets.daily_carbs)}
            />
            <div className="absolute inset-0 flex justify-between text-xs px-2">
              <span>{totals.carbs ? totals.carbs.toFixed(1) : "0"} g</span>
              <span>
                {targets.daily_carbs
                  ? ((totals.carbs / targets.daily_carbs) * 100).toFixed(0)
                  : "0"}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Fat Progress */}
        <div>
          <p className="font-semibold">Fat</p>
          <div className="w-full bg-gray-300 rounded h-4 relative">
            <div
              className="bg-red-500 h-4 rounded"
              style={progressBarStyle(totals.fat, targets.daily_fat)}
            />
            <div className="absolute inset-0 flex justify-between text-xs px-2">
              <span>{totals.fat ? totals.fat.toFixed(1) : "0"} g</span>
              <span>
                {targets.daily_fat
                  ? ((totals.fat / targets.daily_fat) * 100).toFixed(0)
                  : "0"}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && <p className="text-red-500 py-4">{errorMessage}</p>}
    </div>
  );
};

export default EnergySummary;
