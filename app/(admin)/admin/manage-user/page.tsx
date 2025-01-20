"use client";

import React, { useEffect, useState } from "react";

interface User {
  id: string;  // เปลี่ยน id เป็น string
  name: string;
  email: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = กำลังโหลด
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/auth/users', {
          method: 'GET',
          credentials: 'same-origin', // ใช้ credentials เพื่อให้ cookie ส่งไปกับ request
        });

        if (!res.ok) {
          if (res.status === 403) {
            setIsAdmin(false);
            setError("Access Denied: You do not have admin privileges.");
          } else if (res.status === 401) {
            setIsAdmin(false);
            setError("Unauthorized: Please log in.");
          } else {
            throw new Error(`Unexpected error: ${res.status}`);
          }
          return;
        }

        const data = await res.json();
        setUsers(data.users); // สมมติว่า API ส่งข้อมูลผู้ใช้ทั้งหมดใน field `users`
        setIsAdmin(true);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch data. Please try again later.");
        setIsAdmin(false);
      }
    };

    fetchUsers();
  }, []);  

  if (isAdmin === null) {
    return <div className="text-center">Loading...</div>; // กำลังโหลด
  }

  return (
    <div className="container mx-auto p-4 text-black font-mono">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {isAdmin ? (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="border px-4 py-2 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="text-red-500">{error || "Access Denied"}</div>
      )}
    </div>
  );
}
