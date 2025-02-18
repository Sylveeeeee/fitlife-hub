"use client";

import Sidebar from "@/app/(website)/components/Sidebar";
import React, { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  roleId: number; // ✅ ใช้ roleId แทน role
  role:string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", roleId: 2  }); // ✅ ค่าเริ่มต้นเป็น User
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ✅ ฟังก์ชันดึงรายการผู้ใช้
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/users', {
        method: 'GET',
        credentials: 'same-origin',
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
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
      setIsAdmin(true);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch data. Please try again later.");
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ ฟังก์ชันเพิ่มผู้ใช้ใหม่
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert("Please provide a username, email, and password");
      return;
    }
  
    const userPayload = {
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      roleId: Number(newUser.roleId), // ✅ แปลงค่า roleId เป็น `number`
    };
  
    console.log("📤 Sending Payload:", userPayload); // ✅ Debug
  
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload), // ✅ ส่งข้อมูล
      });
  
      if (response.ok) {
        setShowModal(false);
        setNewUser({ username: "", email: "", password: "", roleId: 2 });
  
        // ✅ รีเฟรช users หลังเพิ่ม
        fetchUsers();
      } else {
        const errorData = await response.json();
        console.error("⛔ Error adding user:", response.status, errorData);
        alert(errorData.error || "Failed to add user");
      }
    } catch (err) {
      console.error("⛔ Error during user creation:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // ✅ ฟังก์ชันเปลี่ยน Role ของผู้ใช้
  const handleRoleChange = async (userId: string, roleId: number) => {
    try {
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roleId }), // ✅ ส่ง roleId เป็น number
      });
  
      if (response.ok) {
        // ✅ รีเฟรช users หลังเปลี่ยน role
        setUsers(users.map(user => user.id === userId ? { ...user, roleId } : user));
      } else {
        console.error("Error updating user role");
      }
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };  

  // ✅ ฟังก์ชันลบผู้ใช้
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchUsers(); // ✅ รีเฟรช users หลังลบ
      } else {
        console.error("Error deleting user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const closeModal = () => setShowModal(false);

  if (isAdmin === null) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="container mx-auto p-4 text-black font-mono">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        {isAdmin ? (
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-4 py-2 rounded mb-4"
            >
              Add User
            </button>

            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Role</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2 text-center">{user.id}</td>
                    <td className="border px-4 py-2">{user.username}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2 text-center">                    
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, Number(e.target.value))}
                          className="border p-1 rounded"
                        >
                          <option value={1}>Admin</option>
                          <option value={2}>User</option>
                        </select>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="border px-4 py-2 text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        ) : (
          <div className="text-red-500">{error || "Access Denied"}</div>
        )}

        {showModal && (
          <div
            onClick={closeModal}
            className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center"
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              onClick={(e) => e.stopPropagation()} // ✅ ป้องกันการคลิกปิด modal ถ้าคลิกข้างใน
            >
              <h2 className="text-xl font-bold mb-4 text-center">Add New User</h2>

              {/* Username Input */}
              <label className="block mb-2 text-gray-700 font-medium">Username</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="border p-2 rounded w-full mb-4 focus:ring focus:ring-black outline-none"
                placeholder="Enter username"
              />

              {/* Email Input */}
              <label className="block mb-2 text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="border p-2 rounded w-full mb-4 focus:ring focus:ring-black outline-none"
                placeholder="Enter email"
              />

              {/* Password Input */}
              <label className="block mb-2 text-gray-700 font-medium">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="border p-2 rounded w-full mb-4 focus:ring focus:ring-black outline-none"
                placeholder="Enter password"
              />

              {/* Role Selection */}
              <label className="block mb-2 text-gray-700 font-medium">Role</label>
              <select
                value={newUser.roleId}
                onChange={(e) => setNewUser({ ...newUser, roleId: Number(e.target.value) })} // ✅ แปลง string เป็น number
                className="border p-2 rounded w-full mb-4"
              >
                <option value="2">User</option>
                <option value="1">Admin</option>
              </select>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleAddUser}
                  disabled={isLoading || !newUser.username || !newUser.email || !newUser.password}
                  className={`px-4 py-2 rounded w-full ${
                    isLoading || !newUser.username || !newUser.email || !newUser.password
                      ? "bg-gray-300 cursor-not-allowed text-gray-600"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isLoading ? "Adding..." : "Add User"}
                </button>
                
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded w-full ml-2 hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
    </div>
  );
}
