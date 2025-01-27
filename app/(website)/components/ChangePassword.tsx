'use client'

import { useState } from "react";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });

      if (response.ok) {
        alert("Password changed successfully!");
      } else {
        throw new Error("Failed to change password");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while changing the password.");
    }
  };

  return (
    <div className="font-mono p-6 min-h-screen text-black">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h1 className="text-lg text-black font-bold">Change Password</h1>
        </div>
        <div className="p-4">
          <div>
            <label className="block text-sm font-medium">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
        <div className="p-4 border-t text-right">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-950 text-white rounded"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
