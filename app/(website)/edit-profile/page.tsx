"use client";
import { useState } from "react";

export default function Profile() {
  // State สำหรับข้อมูลโปรไฟล์ที่ปรับตาม Prisma schema
  const [profile, setProfile] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    activity_level: "",
    diet_goal: "",
  });

  // handleInputChange สำหรับจัดการการเปลี่ยนแปลงในฟอร์ม
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // saveProfile สำหรับบันทึกข้อมูลโปรไฟล์
  const saveProfile = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
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
              name="gender"
              value={profile.gender}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
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
         
        </div>
        <div className="p-4 border-t text-right">
          <button
            onClick={saveProfile}
            className="px-4 py-2 bg-blue-950 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    
  );
}
