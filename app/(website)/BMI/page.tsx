'use client';

import { useState } from 'react';

export default function Home() {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('male');
  const [bmi, setBmi] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [bmr, setBmr] = useState<string | null>(null);

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

  const calculateBmr = () => {
    if (!weight || !height || !age) return;

    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);
    const ageValue = parseInt(age);

    let bmrValue;
    if (gender === 'male') {
      bmrValue = 88.36 + (13.4 * weightValue) + (4.8 * heightValue) - (5.7 * ageValue);
    } else {
      bmrValue = 447.6 + (9.2 * weightValue) + (3.1 * heightValue) - (4.3 * ageValue);
    }
    setBmr(bmrValue.toFixed(2));
  };

  return (
    <><div className="flex justify-center items-start space-x-6 py-10 mt-[60px]">
      {/* BMI Section */}
      <div className="flex bg-white shadow-md rounded-lg text-black p-6 min-h-[570px]">
        {/* BMI Calculator */}
        <div className="flex-1 p-4 border-r-2 border-gray-200">
          <h1 className="text-3xl font-semibold mb-4">BMI Calculator</h1>
          <div className="mb-4">
            <label htmlFor="weight" className="block text-lg mb-2 font-mono">-- Weight (Kg) --</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
              className="w-full p-2 border-2 border-gray-300 rounded-md" />
          </div>
          <div className="mb-4">
            <label htmlFor="height" className="block text-lg mb-2 font-mono">-- Height (Cm) --</label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter your height"
              className="w-full p-2 border-2 border-gray-300 rounded-md" />
          </div>
          <button
            onClick={calculateBmi}
            className="bg-black text-white py-2 px-6 rounded-md hover:bg-[#000000d4] transition-colors mt-[110px]"
          >
            Calculate BMI
          </button>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold">
              {bmi ? `Your BMI: ${bmi}` : 'Your BMI: -'}
            </h2>
            <p className="text-lg mt-2">
              {category ? `Category: ${category}` : 'Category: -'}
            </p>
          </div>
        </div>

        {/* BMI Categories */}
        <div className="flex-1 p-4">
          <h2 className="text-2xl font-semibold mb-4 text-[#ef3333] font-mono">BMI CATEGORIES</h2>
          <ul className="text-left space-y-2 font-mono">
            <li>--------------------------------</li>
            <li><strong>Underweight:</strong> BMI less than 18.5</li>
            <li><strong>Normal weight:</strong> BMI between 18.5 and 24.9</li>
            <li><strong>Overweight:</strong> BMI between 25 and 29.9</li>
            <li><strong>Obesity:</strong> BMI of 30 or more</li>
            <li><strong>Obesity 1:</strong> BMI of 30 to 35</li>
            <li><strong>Obesity 2:</strong> BMI of 35 to 40</li>
            <li><strong>Obesity 3:</strong> BMI of 40 or more!</li>
            
          </ul>
          <div className="mt-4">
    <img
      src="/pic1.png" // แทนที่ด้วยลิงก์รูปภาพของคุณ
      alt="BMI Obesity Levels"
      className="w-[70px] h-auto rounded-lg ml-[110px] mt-[60px]"
    />
  </div>
        </div>
      </div>

      {/* BMR Calculator */}
      <div className="flex-1 max-w-lg p-6 text-center bg-white shadow-md rounded-lg text-black min-h-[500px]">
        <h1 className="text-3xl font-semibold mb-4">BMR Calculator</h1>
        <div className="mb-4">
          <label htmlFor="gender" className="block text-lg mb-2 font-mono">-- Gender --</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 border-2 border-gray-300 rounded-md"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="age" className="block text-lg mb-2 font-mono">-- Age (Years) --</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            className="w-full p-2 border-2 border-gray-300 rounded-md" />
        </div>
        <div className="mb-4">
          <label htmlFor="weight" className="block text-lg mb-2 font-mono">-- Weight (Kg) --</label>
          <input
            type="number"
            id="weight-bmr"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your weight"
            className="w-full p-2 border-2 border-gray-300 rounded-md" />
        </div>
        <div className="mb-4">
          <label htmlFor="height" className="block text-lg mb-2 font-mono">-- Height (Cm) --</label>
          <input
            type="number"
            id="height-bmr"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter your height"
            className="w-full p-2 border-2 border-gray-300 rounded-md" />
        </div>
        <button
          onClick={calculateBmr}
          className="bg-black text-white py-2 px-6 rounded-md hover:bg-[#000000d4] transition-colors"
        >
          Calculate BMR
        </button>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold">
            {bmr ? `Your BMR: ${bmr} kcal/day` : 'Your BMR: -'}
          </h2>
        </div>
      </div>
    </div><footer className="bg-gray-800 text-white py-4 mt-10">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} FitLife Hub. All rights reserved.
          </p>
          <p className="text-xs mt-2">
            Made with ❤️ by FITDREAM
          </p>
        </div>
      </footer></>
  );
}
