"use client";
import React, { useState } from "react";

export default function DietGoalCalculation() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!dietGoalsResponse.ok) {
        const error = await dietGoalsResponse.json();
        setErrorMessage(error.error || "Failed to calculate diet goals.");
        return;
      }

      setSuccessMessage("Diet goals successfully updated!");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while calculating diet goals.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Calculate Diet Goals</h1>
      <button
        className={`px-4 py-2 rounded ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
        onClick={calculateAndSaveDietGoals}
        disabled={loading}
      >
        {loading ? "Calculating..." : "Calculate Diet Goals"}
      </button>
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
}
