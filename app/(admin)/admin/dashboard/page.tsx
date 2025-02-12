'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Sidebar from '@/app/(website)/components/Sidebar';

interface Food {
  id: number;
  name: string;
  category: string;
  calories: number;
  created_at?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

interface MonthlyData {
  month: string;
  count: number;
}

interface UserBehaviorData {
  type: string;
  count: number;
}

export default function AdminDashboard() {
  const [latestFoods, setLatestFoods] = useState<Food[]>([]);
  const [latestUsers, setLatestUsers] = useState<User[]>([]);
  const [monthlyFoods, setMonthlyFoods] = useState<MonthlyData[]>([]);
  const [userBehavior, setUserBehavior] = useState<UserBehaviorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/auth/admin/dashboard', {
          method: 'GET',
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);

        const data = await res.json();
        setLatestFoods(Array.isArray(data.latestFoods) ? data.latestFoods : []);
        setLatestUsers(Array.isArray(data.latestUsers) ? data.latestUsers : []);
        setMonthlyFoods(Array.isArray(data.monthlyFoods) ? data.monthlyFoods : []);
        setUserBehavior(Array.isArray(data.userBehavior) ? data.userBehavior : []);
      } catch (err) {
        setError(err instanceof Error ? `Failed to load data: ${err.message}` : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex text-gray-900 font-mono">
      <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* 📊 User Behavior Chart */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">User Behavior</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userBehavior}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 📈 Monthly Foods Trend */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Monthly Food Additions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyFoods}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🍽 Latest Foods Table */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Latest Added Foods</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Category</th>
                  <th className="py-2 px-4 border">Calories</th>
                  <th className="py-2 px-4 border">Added At</th>
                </tr>
              </thead>
              <tbody>
                {latestFoods.length > 0 ? (
                  latestFoods.map((food) => (
                    <tr key={food.id} className="text-center border-b">
                      <td className="py-2 px-4 border">{food.id}</td>
                      <td className="py-2 px-4 border">{food.name}</td>
                      <td className="py-2 px-4 border">{food.category}</td>
                      <td className="py-2 px-4 border">{food.calories}</td>
                      <td className="py-2 px-4 border">{food.created_at ? new Date(food.created_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">No food items available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🆕 Latest Registered Users Table */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Latest Registered Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Registered At</th>
                </tr>
              </thead>
              <tbody>
                {latestUsers.length > 0 ? (
                  latestUsers.map((user) => (
                    <tr key={user.id} className="text-center border-b">
                      <td className="py-2 px-4 border">{user.id}</td>
                      <td className="py-2 px-4 border">{user.name}</td>
                      <td className="py-2 px-4 border">{user.email}</td>
                      <td className="py-2 px-4 border">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">No recent users</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
