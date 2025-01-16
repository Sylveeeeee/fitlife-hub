"use client";

import React, { useEffect, useState } from "react";


interface User {
  id: number;
  name: string;
  email: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/auth/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ใส่ token ที่เก็บใน localStorage
          },
        });
        const data = await res.json();
        
        if (data.message === "Forbidden") {
          setIsAdmin(false); // ถ้าไม่ใช่ admin
        } else {
          setUsers(data); // ถ้าเป็น admin ให้โหลดข้อมูล
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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
          <td colSpan={3} className="border px-4 py-2 text-center">No users found</td>
          </tr>
        )}
        </tbody>
      </table>
      ) : (
        <div>Access Denied</div>
      )}
    </div>
  );
}
