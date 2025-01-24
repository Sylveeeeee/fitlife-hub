"use client";
import React, { useEffect, useState } from "react";
import { calculateTDEE, calculateMacroTargets } from "@/utils/calculations";
import { UserProfile } from "@/utils/calculations";
import DietGoalCalculation from "../components/DietGoalCalculation"

const TDEEPage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [macros, setMacros] = useState<{
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);

  // Fetch user profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/auth/targets"); // ดึงข้อมูลจาก API
        const data: UserProfile = await response.json();
        setProfile(data);

        // คำนวณ TDEE และเป้าหมายสารอาหาร
        const calculatedTDEE = calculateTDEE(data);
        setTdee(calculatedTDEE);

        const calculatedMacros = calculateMacroTargets(calculatedTDEE);
        setMacros(calculatedMacros);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg text-black font-mono">
      <h1 className="text-2xl font-bold mb-6">Your TDEE and Nutrition Goals</h1>

      {profile ? (
        <div>
          <h2 className="text-xl font-semibold">User Profile</h2>
          <ul className="mb-6">
            <li>Weight: {profile.weight} kg</li>
            <li>Height: {profile.height} cm</li>
            <li>Age: {profile.age} years</li>
            <li>Sex: {profile.sex}</li>
            <li>Activity Level: {profile.activityLevel}</li>
          </ul>

          {tdee !== null && macros ? (
            <>
              <h2 className="text-xl font-semibold">Calculated TDEE</h2>
              <p className="mb-4">Total Daily Energy Expenditure: {tdee} kcal/day</p>

              <h2 className="text-xl font-semibold">Macronutrient Goals</h2>
              <ul>
                <li>Protein: {macros.protein} g/day</li>
                <li>Carbs: {macros.carbs} g/day</li>
                <li>Fat: {macros.fat} g/day</li>
              </ul>
            </>
          ) : (
            <p>Calculating TDEE and macros...</p>
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      <DietGoalCalculation />
    </div>
  );
};

export default TDEEPage;
