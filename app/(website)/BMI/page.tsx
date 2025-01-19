'use client'; // เพิ่มบรรทัดนี้

import { useState } from 'react';

export default function Home() {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [bmi, setBmi] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const calculateBmi = () => {
    if (!weight || !height) return;

    const heightInMeters = parseFloat(height) / 100;
    const bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
    setBmi(bmiValue.toFixed(2));

    if (bmiValue < 18.5) {
      setCategory('Underweight');
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      setCategory('Normal weight');
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      setCategory('Overweight');
    } else {
      setCategory('Obesity');
    }
  };

  return (
    <div className="flex justify-center items-start space-x-10 py-10 mt-[60px]">
      {/* BMI Calculator */}
      <div className="max-w-lg p-6 text-center bg-white shadow-md rounded-lg text-black flex-1">
        <h1 className="text-3xl font-semibold mb-4">BMI Calculator</h1>
        <div className="mb-4">
          <label htmlFor="weight" className="block text-lg mb-2 font-mono">-- Weight (Kg) --</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your weight"
            className="w-full p-2 border-2 border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="height" className="block text-lg mb-2 font-mono">-- Height (Cm) --</label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter your height"
            className="w-full p-2 border-2 border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={calculateBmi}
          className="bg-black text-white py-2 px-6 rounded-md hover:bg-[#000000d4] transition-colors"
        >
          Calculate BMI
        </button>

        {bmi && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Your BMI: {bmi}</h2>
            <p className="text-lg mt-2">Category: {category}</p>
          </div>
        )}
      </div>

      {/* Card to the right */}
      <div className="max-w-md p-6 text-center bg-gray-100 shadow-md rounded-lg text-black flex-1 font-mono h-[330px]">
        <h2 className="text-2xl font-semibold mb-4 text-[#ef3333]">BMI CATEGORIES</h2>
        <ul className="text-left space-y-2">
          <li><strong></strong>---------------------------------------------
          <br/></li>
          <li><strong>Under weight :</strong> BMI less than 18.5
          <br/></li>
          <li><strong>Normal weight :</strong> BMI between 18.5 and 24.9
          <br /></li>
          <li><strong>Ovwer weight :</strong> BMI between 25 and 29.9
          <br/></li>
          <li><strong>Obesity:</strong> BMI of 30 or more
          <br/></li>
          <li><strong>Obesity 1:</strong> BMI of 30 to 35
          <br/></li>
          <li><strong>Obesity 2:</strong> BMI of 35 to 40
          <br/></li>
          <li><strong>Obesity 3:</strong> BMI of 40 or more!
          <br/></li>
        </ul>
      </div>
    </div>
  );
}
