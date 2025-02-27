"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DietGoalCalculation from "../components/DietGoalCalculation";
import Link from "next/link";
import AddBiometricToDiary from "../components/AddBiometricToDiary";

interface BiometricMetric {
  id: number;
  name: string;
  unit: string;
  categoryId: number;
}

interface BiometricEntry {
  userId?: number;
  id: number;
  type: "biometric";
  name: string;
  value: number;
  unit: string;
  date: string; // ✅ วันที่ที่บันทึก
  categoryId: number;  // เพิ่ม categoryId ใน BiometricEntry
  metricId: number;    // เพิ่ม metricId ใน BiometricEntry
  biometric: BiometricMetric; // ✅ เชื่อมโยงกับ `BiometricMetric`
}

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [profile, setProfile] = useState({
    email: "",
    username: "",
    age: "",
    sex: "",
    weight: "",
    height: "",
    activity_level: "",
    diet_goal: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedDate, ] = useState(new Date()); // ✅ ใช้วันที่ปัจจุบัน
  const [, setBiometricEntries] = useState<BiometricEntry[]>([]);
  const [isFromUpdate, setIsFromUpdate] = useState(false); // ✅ บอกว่า Modal ถูกเปิดจากปุ่ม Update หรือไม่

  const handleAddBiometric = async (newEntry: BiometricEntry) => {
    try {
      const response = await fetch("/api/auth/biometric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: newEntry.userId,
          categoryId: newEntry.categoryId,
          metricId: newEntry.metricId,
          value: newEntry.value,
          unit: newEntry.unit,
          recordedAt: newEntry.date,
        }),
      });
  
      if (response.ok) {
        const savedEntry = await response.json();
        setProfile((prevProfile) => ({
          ...prevProfile,
          weight: savedEntry.data.value, // ✅ อัปเดตน้ำหนักที่เพิ่งบันทึก
        }));
        setIsModalOpen(false); // ✅ ปิด Modal
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving biometric:", error);
      alert("Error saving data.");
    }
    setIsFromUpdate(isFromUpdate); // ✅ ตั้งค่าเมื่อกดปุ่ม Update
    setBiometricEntries((prevEntries) => [...prevEntries, newEntry]); // ✅ อัปเดตรายการ  
  };
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setProfile({
            email: data.email,
            username: data.username || "",
            age: data.age?.toString() || "",
            sex: data.sex || "",
            weight: data.weight?.toString() || "",
            height: data.height?.toString() || "",
            activity_level: data.activity_level || "",
            diet_goal: data.diet_goal || "",
          });
        } else {
          throw new Error("Failed to load profile");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while loading the profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      setSuccessMessage("");
  
      const formattedProfile = {
        ...profile,
        age: profile.age ? Number(profile.age) : undefined,
        weight: profile.weight ? Number(profile.weight) : undefined,
        height: profile.height ? Number(profile.height) : undefined,
        diet_goal: profile.diet_goal.toLowerCase().replace(/\s+/g, "_"), // ✅ แปลงให้ตรงกับ Prisma Enum
        activity_level: profile.activity_level.toLowerCase().replace(/\s+/g, "_"), // ✅ แปลงให้ตรงกับ Prisma Enum
      };
  
      console.log("Sending payload:", formattedProfile);
  
      const response = await fetch("/api/auth/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedProfile),
        credentials: "include",
      });
  
      const data = await response.json();
      console.log("Response:", data);
  
      if (response.ok) {
        toast.success("Profile updated successfully!", { autoClose: 3000 });
        setSuccessMessage("✔ Profile updated successfully!");

        if (typeof window !== "undefined") {
          const event = new Event("updateDietGoals");
          window.dispatchEvent(event);
        }
      } else {
        throw new Error(data.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("An error occurred while saving profile.");
      setSuccessMessage("❌ Error updating profile.");
    }
  };
  

  if (isLoading) {
    return <div className="text-center text-lg p-6">Loading...</div>;
  }

  return (
    <div className="font-mono p-6 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h1 className="text-lg text-black font-bold">Edit Profile</h1>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4 text-black">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              className="mt-1 w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="sex"
              value={profile.sex}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
              disabled={!isEditing}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
          <label className="block text-sm font-medium">Weight (kg)</label>
          <div className="flex items-center">
            <input
              type="number"
              name="weight"
              value={profile.weight}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
              disabled={isEditing} 
            />            
          </div>

          {/* ✅ Modal เพิ่มน้ำหนัก */}
          {isModalOpen && (
            <AddBiometricToDiary
              isOpen={isModalOpen}
              closeModal={() => setIsModalOpen(false)}
              selectedDate={selectedDate}
              onAdd={handleAddBiometric} // ✅ เพิ่มข้อมูลใหม่ลงใน State
              onBiometricAdded={() => console.log("Biometric added!")}
              isFromUpdate={true} // ✅ ส่งค่า isFromUpdate = true
            />
          )}
        </div>
          <div>
            <label className="block text-sm font-medium">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={profile.height}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Diet Goal</label>
            <select
              name="diet_goal"
              value={profile.diet_goal}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
              disabled={!isEditing}
            >
              <option value="maintain_weight">Maintain Weight</option>
              <option value="lose_weight">Lose Weight</option>
              <option value="gain_weight">Gain Weight</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Activity Level</label>
            <select
              name="activity_level"
              value={profile.activity_level}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
              disabled={!isEditing}
            >
              <option value="Sedentary">Sedentary</option>
              <option value="light">Lightly</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="veryactive">Very Active</option>
            </select>
          </div>
        </div>

        {/* ปุ่ม Save และ Change Password */}
        <div className="flex flex-col">
        <div className="p-4 border-t flex justify-center items-center gap-2">
          {isEditing ? (
            <button onClick={saveProfile} className="px-4 py-2 bg-black text-white rounded">
              Save Profile
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white text-black rounded">
              Edit Profile
            </button>
          )}
          <Link href="/change-password">
            <button className="px-4 py-2 bg-gray-300 text-black rounded">
              Change Password
            </button>
          </Link>
        </div>
          {successMessage && (
            <div className="text-center">
            <p className="mt-2 text-green-600 font-medium">{successMessage}</p>
            </div>
          )}

        
        </div>
        <div className="px-4 pb-1 border-t">
          <DietGoalCalculation />
        </div>
      </div>
    </div>
  );
}
