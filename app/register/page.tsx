'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
   
  username: z.string().min(3, 'Username must be at least 3 characters'),
  birthday: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    { message: 'Invalid date format (YYYY-MM-DD expected)' }
  ),
  height: z.preprocess(
    (val) => (val ? parseFloat(val as string) : undefined),
    z.number().positive('Height must be a positive number').optional()
  ),
  weight: z.preprocess(
    (val) => (val ? parseFloat(val as string) : undefined),
    z.number().positive('Weight must be a positive number').optional()
  ),
  gender: z.enum(['male', 'female', 'other'], { invalid_type_error: 'Invalid gender value' }),
});

const initialErrorState = {
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  birthday: '',
  height: '',
  weight: '',
  gender: '',
};

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [birthdayDay, setBirthdayDay] = useState('');
  const [birthdayMonth, setBirthdayMonth] = useState('');
  const [birthdayYear, setBirthdayYear] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState(initialErrorState);

  const parseBirthday = () => {
    return `${birthdayYear}-${birthdayMonth}-${birthdayDay}`;
  };

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(initialErrorState);
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const birthday = parseBirthday();

      if (!validatePasswords()) {
        setLoading(false);
        return;
      }

      const data = userSchema.parse({
        email,
        password,
        username,
        birthday,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        gender,
      });

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      setSuccess('Account created successfully!');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setGender('');
      setBirthdayDay('');
      setBirthdayMonth('');
      setBirthdayYear('');
      setHeight('');
      setWeight('');

      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          if (Array.isArray(curr.path) && typeof curr.path[0] === 'string') {
            const pathKey = curr.path[0];
            if (pathKey in acc) {
              acc[pathKey as keyof typeof acc] = curr.message;
            }
          }
          return acc;
        }, { ...initialErrorState }); // ใช้ค่าเริ่มต้นจาก initialErrorState
    
        setErrors((prev) => ({
          ...prev,
          ...fieldErrors, // รวมข้อผิดพลาดจาก fieldErrors
        }));
      } else if (error instanceof Error) {
        setError(error.message); // ข้อผิดพลาดทั่วไป
      } else {
        setError('Something went wrong'); // ข้อผิดพลาดอื่น ๆ
      }

      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const ErrorMessage = ({ message }: { message: string }) => {
    if (!message) return null;
    return <p className="text-red-500 text-sm mt-1">{message}</p>;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5] font-mono">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-screen-xl">
        <div className="flex-1 flex items-center justify-center p-8 bg-[#213A58] text-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Our Platform</h1>
            <Image
              src="/sp.png"
              alt="illustration"
              width={400}
              height={400}
              layout="intrinsic"
            />
          </div>
        </div>
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-semibold mb-6 text-black">Create a New Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-zinc-700">Username</label>
                <input
                  type="text"
                  id="username"
                  className="mt-1 block w-full border border-border rounded-md shadow-sm p-3 text-black"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <ErrorMessage message={errors.username} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full border border-border rounded-md shadow-sm p-3 text-black"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <ErrorMessage message={errors.email} />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="mt-1 block w-full border border-border rounded-md shadow-sm p-3 text-black"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className="mt-1 block w-full border border-border rounded-md shadow-sm p-3 text-black"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-zinc-700">Gender</label>
                <select
                  id="gender"
                  className="block h-[50] w-full border border-border rounded-md shadow-sm p-3 text-black"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">Date of Birth</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Day"
                    min="1"
                    max="31"
                    value={birthdayDay}
                    onChange={(e) => setBirthdayDay(e.target.value)}
                    className="w-1/3 border border-border rounded-md shadow-sm p-3 text-black"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Month"
                    min="1"
                    max="12"
                    value={birthdayMonth}
                    onChange={(e) => setBirthdayMonth(e.target.value)}
                    className="w-1/3 border border-border rounded-md shadow-sm p-3 text-black"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Year"
                    min="1900"
                    max="2100"
                    value={birthdayYear}
                    onChange={(e) => setBirthdayYear(e.target.value)}
                    className="w-1/3 border border-border rounded-md shadow-sm p-3 text-black"
                    required
                  />
                  {errors.birthday && <p className="text-red-500 text-sm mt-1">{errors.birthday}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-zinc-700">Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  className="mt-1 block w-full border border-border rounded-md shadow-sm p-3 text-black"
                  placeholder="Enter your height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-zinc-700">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  className="mt-1 block w-full border border-border rounded-md shadow-sm p-3 text-black"
                  placeholder="Enter your weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>
            </div>

            <div className="flex items-center mb-4">
              <input type="checkbox" id="accept" className="mr-2" required />
              <label htmlFor="accept" className="text-sm text-black">I accept the terms and conditions</label>
            </div>

            <button
              type="submit"
              className={`w-full bg-black text-white p-3 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#333]'}`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'REGISTER'}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-500">
              <strong>Error:</strong> {error}
            </p>
          )}

          {success && (
            <p className="mt-4 text-sm text-green-500">
              <strong>Success:</strong> {success}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
