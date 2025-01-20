"use client";

import { useState } from "react";

export default function NutritionReport() {
  const [dailyAverage, setDailyAverage] = useState("Last 7 days");
  const [includeToday, setIncludeToday] = useState(true);
  const [filterDays, setFilterDays] = useState("All Days");
  const [includeSupplements, setIncludeSupplements] = useState(true);

  return (
    <div className="min-h-screen font-mono bg-gray-50 p-8">

      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Nutrition Report</h1>
        <p className="text-gray-600 mb-6">
          View daily averages for a selected period of time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
  <label className="block text-lg font-medium text-gray-800 mb-2">
    Daily Averages for
  </label>
  <select
    value={dailyAverage}
    onChange={(e) => setDailyAverage(e.target.value)}
    className="block w-full mt-2 p-3 border-gray-200 rounded-lg shadow-sm text-black "
  >
    <option>Last 7 days</option>
    <option>Last 30 days</option>
    <option>Custom Range</option>
  </select>
</div>


          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Filter Days
            </label>
            <select
              value={filterDays}
              onChange={(e) => setFilterDays(e.target.value)}
              className="block w-full mt-2 p-3 border-gray-200 rounded-lg shadow-sm text-black "
            >
              <option>All Days</option>
              <option>Weekdays Only</option>
              <option>Weekends Only</option>
            </select>
          </div>
        </div>


        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="includeToday"
            checked={includeToday}
            onChange={(e) => setIncludeToday(e.target.checked)}
            className="h-5 w-5 border-gray-300 rounded"
          />
          <label htmlFor="includeToday" className="ml-3 text-lg text-gray-700">
            Include Today
          </label>
        </div>
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="includeSupplements"
            checked={includeSupplements}
            onChange={(e) => setIncludeSupplements(e.target.checked)}
            className="h-5 w-5 border-gray-300 rounded"
          />
          <label htmlFor="includeSupplements" className="ml-3 text-lg text-gray-700">
            Include Supplements
          </label>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Energy Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-4xl font-bold text-gray-800">0 kcal</p>
            <p className="text-gray-600">Consumed</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-purple-600">1820 kcal</p>
            <p className="text-gray-600">Burned</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-gray-800">1820 kcal</p>
            <p className="text-gray-600">Remaining</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Targets</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-600">Energy</p>
            <p className="text-gray-800 font-bold">0 / 1820 kcal</p>
          </div>
          <div>
            <p className="text-gray-600">Protein</p>
            <p className="text-gray-800 font-bold">0 / 113.8 g</p>
          </div>
          <div>
            <p className="text-gray-600">Net Carbs</p>
            <p className="text-gray-800 font-bold">0 / 204.8 g</p>
          </div>
          <div>
            <p className="text-gray-600">Fat</p>
            <p className="text-gray-800 font-bold">0 / 60.7 g</p>
          </div>
        </div>
      </div>
    </div>
  );
}
