'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Sidebar from '@/app/(website)/components/Sidebar';

interface PopularFood {
  name: string;
  added_count: number;
}

interface NutrientTrend {
  category: string;
  protein: number;
  carbs: number;
  fat: number;
}

interface MonthlyData {
  month: string;
  count: number;
}

interface UserBehavior {
  action: string;  // ✅ เปลี่ยนจาก "type" เป็น "action" ให้ตรงกับ API
  count: number;
}

export default function AdminDashboard() {
  const [popularFoods, setPopularFoods] = useState<PopularFood[]>([]);
  const [nutrientTrends, setNutrientTrends] = useState<NutrientTrend[]>([]);
  const [monthlyFoods, setMonthlyFoods] = useState<MonthlyData[]>([]);
  const [userBehavior, setUserBehavior] = useState<UserBehavior[]>([]);  // ✅ เปลี่ยนจาก setUserActivity เป็น setUserBehavior
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
        setPopularFoods(Array.isArray(data.popularFoods) ? data.popularFoods : []);
        setNutrientTrends(Array.isArray(data.nutrientTrends) ? data.nutrientTrends : []);
        setMonthlyFoods(Array.isArray(data.monthlyFoods) ? data.monthlyFoods : []);
        setUserBehavior(Array.isArray(data.userBehavior) ? data.userBehavior : []);  // ✅ แก้ให้ตรงกับ API
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

        {/* 📊 User Activity Chart */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">User Activity Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            {userBehavior.length > 0 ? (
              <BarChart data={userBehavior}>
                <XAxis dataKey="action" />  {/* ✅ ใช้ action แทน type */}
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            ) : (
              <div className="text-center py-10 text-gray-500">No user activity data available</div>
            )}
          </ResponsiveContainer>
        </div>

        {/* 📈 Nutrient Trends Chart */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Nutrient Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            {nutrientTrends.length > 0 ? (
              <BarChart data={nutrientTrends}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="protein" fill="#82ca9d" name="Protein" />
                <Bar dataKey="carbs" fill="#8884d8" name="Carbs" />
                <Bar dataKey="fat" fill="#ffc658" name="Fat" />
              </BarChart>
            ) : (
              <div className="text-center py-10 text-gray-500">No nutrient data available</div>
            )}
          </ResponsiveContainer>
        </div>

        {/* 📈 Monthly Food Additions Chart */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Monthly Food Additions</h2>
          <ResponsiveContainer width="100%" height={300}>
            {monthlyFoods.length > 0 ? (
              <LineChart data={monthlyFoods}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            ) : (
              <div className="text-center py-10 text-gray-500">No food addition data available</div>
            )}
          </ResponsiveContainer>
        </div>

        {/* 🍽 Most Popular Foods Table */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Most Popular Foods</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Times Added</th>
                </tr>
              </thead>
              <tbody>
                {popularFoods.length > 0 ? (
                  popularFoods.map((food, index) => (
                    <tr key={index} className="text-center border-b">
                      <td className="py-2 px-4 border">{food.name}</td>
                      <td className="py-2 px-4 border">{food.added_count}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center py-4">No popular foods available</td>
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
