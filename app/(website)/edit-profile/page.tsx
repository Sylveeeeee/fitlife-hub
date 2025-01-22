"use client";
import { useState } from "react";

export default function Profile() {
  // ประกาศ state สำหรับข้อมูลโปรไฟล์
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    nation: "",
    gender: "",
    language: "",
    dob: { day: "", month: "", year: "" },
  });

  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;

    // ตรวจสอบหาก name เป็น dob เพื่อแยกการจัดการวันเดือนปีเกิด
    if (name.startsWith("dob")) {
      const dobField = name.replace("dob", "").toLowerCase();
      setProfile({
        ...profile,
        dob: { ...profile.dob, [dobField]: value },
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  
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
    <div className="font-mono p-6  min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h1 className="text-lg text-black font-bold">Edit Profile</h1>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4 text-black ">
          
          <div>
            <label className="block text-sm font-medium ">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border text-black rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
        
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Nation</label>
            <input
              type="text"
              name="nation"
              value={profile.nation}
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
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
       
          <div>
            <label className="block text-sm font-medium">Language</label>
            <input
              type="text"
              name="language"
              value={profile.language}
              onChange={handleInputChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Date of Birth</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="dobDay"
                placeholder="Day"
                value={profile.dob.day}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded"
              />
              <input
                type="text"
                name="dobMonth"
                placeholder="Month"
                value={profile.dob.month}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded"
              />
              <input
                type="text"
                name="dobYear"
                placeholder="Year"
                value={profile.dob.year}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded"
              />
            </div>
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
