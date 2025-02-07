'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Food {
  id: number;
  name: string;
  category: string;
  calories: number;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/auth/admin/dashboard', {
          method: 'GET',
          credentials: 'include', // ใช้ cookie authentication
        });

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await res.json();

        setFoods(data.foods || []);
        setUsers(data.users || []);
        setTotalFoods(data.foods.length || 0);
        setTotalUsers(data.users.length || 0);

        // Extract unique categories from foods
        const uniqueCategories = [...new Set(data.foods.map((food: Food) => food.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen text-black font-mono">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-1/5 bg-black text-white p-4">
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
            <div className="p-4 bg-blue-600 text-white rounded-lg shadow">
              <h3 className="text-sm">Total Foods</h3>
              <p className="text-lg font-bold">{totalFoods}</p>
            </div>
            <div className="p-4 bg-green-500 text-white rounded-lg shadow">
              <h3 className="text-sm">Categories</h3>
              <p className="text-lg font-bold">{categories.length}</p>
            </div>
            <div className="p-4 bg-orange-500 text-white rounded-lg shadow">
              <h3 className="text-sm">Recently Added</h3>
              <p className="text-lg font-bold">{foods[0]?.name || 'N/A'}</p>
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
