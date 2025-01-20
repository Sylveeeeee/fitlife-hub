"use client";

import { useState } from "react";

type Item = {
  description: string;
  database: string;
  amount: string;
  unit: string;
  energy: string;
  weight: string;
};

export default function CustomMeals() {
  const [mealName, setMealName] = useState<string>("New Meal");
  const [items, setItems] = useState<Item[]>([]); 

  const addItem = () => {
    setItems([
      ...items,
      { description: "", database: "", amount: "", unit: "", energy: "", weight: "" },
    ]);
  };

  const updateItem = (index: number, key: keyof Item, value: string) => {
    setItems(
      items.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-mono">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">New Meal</h1>
        <p className="text-gray-500 mb-4">Unsaved Meal, Data Source: Custom</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Info</h2>
          <label htmlFor="mealName" className="block text-lg  text-gray-800">
            Meal Name
          </label>
          <input
            id="mealName"
            type="text"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="mt-4 block w-full rounded-lg border-gray-700 shadow-sm focus:border-black focus:ring-gray-800 sm:text-lg p-3"

          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Meal Items</h2>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-300">
            <tr>
                <th className="px-4 py-2 text-black text-lg font-medium">Description</th>
                <th className="px-4 py-2 text-black text-lg font-medium">Database</th>
                <th className="px-4 py-2 text-black text-lg font-medium">Amount</th>
                <th className="px-4 py-2 text-black text-lg font-medium">Unit</th>
                <th className="px-4 py-2 text-black text-lg font-medium">Energy (kcal)</th>
                <th className="px-4 py-2 text-black text-lg font-medium">Weight</th>
            </tr>


            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  {(Object.keys(item) as (keyof Item)[]).map((key) => (
                    <td className="border border-gray-300 px-4 py-2" key={key}>
                      <input
                        type="text"
                        value={item[key]}
                        onChange={(e) =>
                          updateItem(index, key, e.target.value)
                        }
                        className="w-full border-gray-300 rounded-md"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addItem}
            className="mt-4 px-4 py-2 bg-black text-white rounded-md shadow hover:bg-gray-600"
          >
            Add Item
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Nutrition Overview</h2>
          <p className="text-gray-500">
            Percent daily values (DV%) are based on a 2,000 calorie diet. Your daily values may be
            higher or lower depending on your targets.
          </p>

          <div className="mt-6 p-3 border border-gray-300 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="mt-4 text-4xl font-bold text-black">0</div>
                <div className="text-black">kcal</div>
              </div>
              <div className="flex-grow">
                <ul className="flex space-x-4">
                  <li className="text-green-600">Protein: Not Entered</li>
                  <li className="text-blue-600">Carbs: Not Entered</li>
                  <li className="text-red-600">Fat: Not Entered</li>
                  <li className="text-yellow-600">Alcohol: Not Entered</li>
                </ul>
              </div>
            </div>
          </div>

          <table className="mt-4 min-w-full table-auto border-collapse border border-gray-500">
        <thead className="bg-gray-200">
            <tr>
                <th className="border border-gray-500 px-4 py-2 text-black text-xl">General</th>
                <th className="border border-gray-500 px-4 py-2 text-black text-xl">Amount</th>
                <th className="border border-gray-500 px-4 py-2 text-black text-xl">% DV</th>
          </tr>
        </thead>
  <tbody>
    <tr>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">Energy</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">- kcal</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">-</td>
    </tr>
    <tr>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">Alcohol</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">- g</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">-</td>
    </tr>
    <tr>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">Ash</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">- g</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">-</td>
    </tr>
    <tr>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">Beta-Hydroxybutyrate</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">- g</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">-</td>
    </tr>
    <tr>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">Caffeine</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">- mg</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">-</td>
    </tr>
    <tr>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">Oxalate</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">- mg</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">-</td>
    </tr>
    <tr>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">Water</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">- g</td>
      <td className="border border-gray-500 px-4 py-2 text-gray-700">-</td>
    </tr>
  </tbody>
</table>

        </div>
      </div>
    </div>
  );
}
