"use client";

import Sidebar from "@/app/(website)/components/Sidebar";
import React, { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "user" });
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
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

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert("Please provide a username, email, and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setShowModal(false);
        setNewUser({ username: "", email: "", password: "", role: "user" });

        // ✅ รีเฟรช users หลังเพิ่ม
        const updatedUsers = await fetch("/api/auth/users").then((res) => res.json());
        setUsers(updatedUsers);
      } else {
        console.error("Error adding user:", response.status);
      }
    } catch (err) {
      console.error("Error during user creation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        // ✅ รีเฟรช users หลังเปลี่ยน role
        setUsers(users.map(user => user.id === userId ? { ...user, role } : user));
      } else {
        console.error("Error updating user role");
      }
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // ✅ รีเฟรช users หลังลบ
        setUsers(users.filter(user => user.id !== userId));
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

            {isLoading && <p>Loading...</p>}
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
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="border p-1 rounded"
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
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
            className="bg-white p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <label className="block mb-2">Username</label>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="border p-2 rounded w-full mb-4"
            />
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="border p-2 rounded w-full mb-4"
            />
            <label className="block mb-2">Password</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="border p-2 rounded w-full mb-4"
            />
            <label className="block mb-2">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="border p-2 rounded w-full mb-4"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleAddUser}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Add User
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
