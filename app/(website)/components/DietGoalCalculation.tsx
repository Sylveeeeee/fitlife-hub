"use client";
import React, { useState, useEffect } from "react";

// ✅ TypeScript Interface สำหรับ Diet Goals
interface DietGoals {
  daily_calories: number;
  daily_protein: number;
  daily_carbs: number;
  daily_fat: number;
}

export default function DietGoalCalculation() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dietGoalsData, setDietGoalsData] = useState<DietGoals | null>(null);

  // ✅ คำนวณและบันทึกเป้าหมายอาหารของผู้ใช้
  const calculateAndSaveDietGoals = async () => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // ✅ ดึง userId จาก Token โดยใช้ API `/api/auth/user`
      const userResponse = await fetch("/api/auth/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!userResponse.ok) {
        setErrorMessage("❌ Failed to fetch user information.");
        return;
      }

      const userData = await userResponse.json();
      if (!userData.id) {
        setErrorMessage("❌ User ID not found.");
        return;
      }

      const userId = userData.id;

      // ✅ เรียก API `/api/auth/diet-goals` เพื่อคำนวณและบันทึก
      const dietGoalsResponse = await fetch("/api/auth/diet-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!dietGoalsResponse.ok) {
        const error = await dietGoalsResponse.json();
        setErrorMessage(error.error || "❌ Failed to calculate diet goals.");
        return;
      }

      const dietGoalsData = await dietGoalsResponse.json();
      setDietGoalsData(dietGoalsData); // ✅ เก็บข้อมูลใน `state`
      setSuccessMessage("✅ Diet goals successfully updated!");
    } catch (error) {
      console.error("❌ Error:", error);
      setErrorMessage("❌ An error occurred while calculating diet goals.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ดึงข้อมูลเป้าหมายอาหารของผู้ใช้
  const fetchDietGoals = async () => {
    try {
      const response = await fetch("/api/auth/diet-goals", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("❌ Failed to fetch diet goals.");
      }

      const data = await response.json();
      setDietGoalsData(data);
    } catch (error) {
      console.error("❌ Error fetching diet goals:", error);
      setErrorMessage("❌ Failed to fetch diet goals.");
    }
  };

  // ✅ ดึงค่าเป้าหมายอาหารเมื่อ Component โหลด
  useEffect(() => {
    fetchDietGoals();
  }, []);

  return (
    <div className="font-mono text-black max-w-4xl mx-auto  shadow-md rounded-lg mt-10 p-6">
      <h2 className="text-center text-xl font-bold mb-4">Diet Goal Calculation</h2>

      {/* ✅ แสดงข้อความแจ้งเตือน */}
      {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

      {/* ✅ แสดงข้อมูล Diet Goals ถ้ามี */}
      {dietGoalsData ? (
        <div className="text-center">
          <p><strong>Total Energy Burned (TDEE) =</strong> {dietGoalsData.daily_calories} kcal</p>
          <p><strong>Protein Goal:</strong> {dietGoalsData.daily_protein} g</p>
          <p><strong>Carbs Goal:</strong> {dietGoalsData.daily_carbs} g</p>
          <p><strong>Fat Goal:</strong> {dietGoalsData.daily_fat} g</p>
        </div>
      ) : (
        <p className="text-center text-gray-500">No diet goals set. Click the button below to calculate.</p>
      )}

      {/* ✅ ปุ่มคำนวณใหม่ */}
      <div className="text-center mt-6">
        <button
          onClick={calculateAndSaveDietGoals}
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 disabled:bg-gray-400"
        >
          {loading ? "Calculating..." : "Calculate Diet Goals"}
        </button>
      </div>
    </div>
  );
}
