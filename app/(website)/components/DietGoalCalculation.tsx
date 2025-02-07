"use client";
import React, { useState, useEffect } from "react";

// Define the TypeScript interface for the diet goals data
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
  const [dietGoalsData, setDietGoalsData] = useState<DietGoals | null>(null); // Use the DietGoals type

  const calculateAndSaveDietGoals = async () => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // ดึง userId จาก Token โดยใช้ API `/api/auth/user`
      const userResponse = await fetch("/api/auth/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ใช้ Cookie ที่มีอยู่
      });

      if (!userResponse.ok) {
        setErrorMessage("Failed to fetch user information.");
        return;
      }

      const userData = await userResponse.json();
      const userId = userData.id; // คาดหวังว่า API จะคืน `id` เป็น userId

      // เรียก API `/api/auth/diet-goals` เพื่อคำนวณและบันทึกเป้าหมาย
      const dietGoalsResponse = await fetch("/api/auth/diet-goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId, // ส่ง userId ไปพร้อมกับข้อมูล
        }),
      });

      if (!dietGoalsResponse.ok) {
        const error = await dietGoalsResponse.json();
        setErrorMessage(error.error || "Failed to calculate diet goals.");
        return;
      }

      const dietGoalsData = await dietGoalsResponse.json();
      setDietGoalsData(dietGoalsData); // เก็บข้อมูลเป้าหมายอาหารใน state
      setSuccessMessage("Diet goals successfully updated!");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while calculating diet goals.");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันดึงข้อมูลเป้าหมายอาหารของผู้ใช้ (เมื่อล็อกอินแล้ว)
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
      setDietGoalsData(data); // เก็บข้อมูลที่ดึงมาใน state
    } catch (error) {
      console.error("Error fetching diet goals:", error);
      setErrorMessage("Failed to fetch diet goals.");
    }
  };

  useEffect(() => {
    fetchDietGoals(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลเมื่อคอมโพเนนต์โหลด
  }, []);

  return (
    <div className=" font-mono text-black max-w-4xl mx-auto bg-[#cdffe0] shadow-md rounded-lg mt-10 ">
      {dietGoalsData && (
        <div className="">
          
          <div className=" mb-10 p-4 text-center">
          <p><strong>Total Energy Burned (TDEE) =</strong> {dietGoalsData.daily_calories} kcal</p>
          
          </div>
        </div>
      )}
      
    </div>
  );
}
