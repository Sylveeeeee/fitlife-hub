"use client";

import Link from "next/link";

export default function NutritionReport() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      <div className="mb-6">
        <Link href="/BMI">
          <button className="py-2 px-8 text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500">
            Go to BMI
          </button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Nutrition Report</h1>
        <p className="text-gray-600 mb-6">
          View daily averages for a selected period of time.
        </p>

        
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Daily Averages for
          </label>
          <select className="block w-full mt-2 p-3 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Custom Range</option>
          </select>
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="includeToday"
            className="h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          />
          <label htmlFor="includeToday" className="ml-3 text-lg text-gray-700">
            Include Today
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Filter Days
          </label>
          <select className="block w-full mt-2 p-3 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option>All Days</option>
            <option>Weekdays Only</option>
            <option>Weekends Only</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeSupplements"
            className="h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          />
          <label htmlFor="includeSupplements" className="ml-3 text-lg text-gray-700">
            Include Supplements
          </label>
        </div>
      </div>
    </div>
  );
}
