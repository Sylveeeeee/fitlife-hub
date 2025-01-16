'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data: { message: string } = await res.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await res.json(); // รับข้อมูลจาก API รวมถึง role
      setSuccessMessage('Login successful!');
      setEmail('');
      setPassword('');

      // หน่วงเวลา 2 วินาที (2000ms) ก่อนพาไปหน้า
      setTimeout(() => {
        if (data.role === 'admin') {
          router.push('/dashboard');  // ไปยังหน้า admin dashboard
        } else {
          router.push('/');  // ไปยังหน้าหลัก
        }
      }, 1000); // ปรับเวลาได้ตามต้องการ

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#e2e2e2]">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-8 bg-[#213A58] text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">LOGIN</h1>
            <Image
              src="/sp2.png"
              alt="illustration"
              width={500}
              height={300}
            />
          </div>
        </div>
        <div className="flex-1 p-8">
          <h2 className="text-xl font-semibold mb-6 text-black">LOGIN</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 text-[#000]"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 text-[#000]"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center mb-4">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-black">Remember me</label>
            </div>
            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground bg-black text-white hover:bg-transparent hover:text-black border-solid border-2 border-black p-2 rounded-md"
            >
              Login
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          {successMessage && <p className="mt-4 text-sm text-green-500">{successMessage}</p>}
          <p className="mt-4 text-sm text-muted-foreground text-black">Don&apos;t have an account yet? <a href="#" className="text-primary">Create an account</a></p>
          <p className="mt-2 text-sm text-muted-foreground text-[#213A58]"><a href="#" className="text-primary">Forgot Password?</a></p>
        </div>
      </div>
    </div>
  );
}
