'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Food {
  id: number;
  name: string;
  category: string;
  calories: number;
  price: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function AdminDashboard() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalFoods, setTotalFoods] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Mock API data
    setFoods([
      { id: 1, name: 'Pizza', category: 'Main Dish', calories: 300, price: 8 },
      { id: 2, name: 'Ice Cream', category: 'Dessert', calories: 200, price: 5 },
      { id: 3, name: 'Salad', category: 'Healthy', calories: 100, price: 7 },
    ]);

    setUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ]);

    setCategories(['Main Dish', 'Dessert', 'Healthy', 'Beverage']);
    setTotalFoods(3); // Mock data
    setTotalUsers(2); // Mock data
  }, []);

  return (
    <div className="min-h-screen text-black font-mono">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-1/5 bg-gray-800 text-white p-4">
          <h2 className="text-lg font-bold mb-4">Admin Dashboard</h2>
          <ul>
            <li className="mb-2">
              <Link href="/admin/dashboard">
                <div className="block px-2 py-1 hover:bg-gray-700">Dashboard</div>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/manage-foods">
                <div className="block px-2 py-1 hover:bg-gray-700">Manage Foods</div>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/manage-user">
                <div className="block px-2 py-1 hover:bg-gray-700">Manage Users</div>
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="w-4/5 p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-500 text-white rounded-lg shadow">
              <h3 className="text-sm">Total Foods</h3>
              <p className="text-lg font-bold">{totalFoods}</p>
            </div>
            <div className="p-4 bg-green-500 text-white rounded-lg shadow">
              <h3 className="text-sm">Categories</h3>
              <p className="text-lg font-bold">{categories.length}</p>
            </div>
            <div className="p-4 bg-orange-500 text-white rounded-lg shadow">
              <h3 className="text-sm">Recently Added</h3>
              <p className="text-lg font-bold">{foods[0]?.name}</p>
            </div>
            <div className="p-4 bg-red-500 text-white rounded-lg shadow">
              <h3 className="text-sm">Total Users</h3>
              <p className="text-lg font-bold">{totalUsers}</p>
            </div>
          </div>

          {/* Food Table */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Food List</h2>
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Calories</th>
                  <th className="text-left p-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food.id}>
                    <td className="p-2">{food.id}</td>
                    <td className="p-2">{food.name}</td>
                    <td className="p-2">{food.category}</td>
                    <td className="p-2">{food.calories}</td>
                    <td className="p-2">${food.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Table */}
          <div>
            <h2 className="text-lg font-bold mb-4">User List</h2>
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
