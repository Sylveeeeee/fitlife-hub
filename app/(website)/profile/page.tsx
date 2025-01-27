'use client'

import { useState, useEffect, ChangeEvent } from "react";
import DietGoalCalculation from "../components/DietGoalCalculation";
import Link from "next/link"; // ใช้สำหรับลิงก์ไปยังหน้าเปลี่ยนรหัสผ่าน

export default function Profile() {
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
        alert("An error occurred while loading the profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      
      const response = await fetch("/api/auth/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
        credentials: "include",
      });

      if (response.ok) {
        alert("Profile saved successfully!");
      } else {
        throw new Error("Failed to save profile");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the profile.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="sex"
              value={profile.sex}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={profile.weight}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={profile.height}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Diet Goal</label>
            <select
              name="diet_goal"
              value={profile.diet_goal}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="Maintain Weight">Maintain Weight</option>
              <option value="Lose Weight">Lose Weight</option>
              <option value="Gain Muscle">Gain Muscle</option>
              <option value="Improve Health">Improve Health</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Activity Level</label>
            <select
              name="activity_level"
              value={profile.activity_level}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="Sedentary">Sedentary</option>
              <option value="Lightly Active">Lightly Active</option>
              <option value="Moderately Active">Moderately Active</option>
              <option value="Very Active">Very Active</option>
            </select>
          </div>
        </div>

        {/* แสดงผล DietGoalCalculation */}

        <div className="p-4 border-t flex justify-between">
          <button
            onClick={saveProfile}
            className="px-4 py-2 bg-blue-950 text-white rounded"
          >
            Save Profile
          </button>
          <Link href="/change-password">
            <button className="px-4 py-2 bg-gray-300 text-black rounded">
              Change Password
            </button>
          </Link>
        </div>
      </div>
        <div className="p-4 border-t">
          <DietGoalCalculation
          />
        </div>
    </div>
  );
}
