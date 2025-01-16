'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data: { message: string } = await res.json();
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Account created successfully!');
      setUsername('');
      setEmail('');
      setPassword('');

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5]">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        {/* Left Section (Image) */}
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
        
        {/* Right Section (Form) */}
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-semibold mb-6 text-black">Create a New Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-zinc-700">Username</label>
              <input
                type="text"
                id="username"
                className="mt-1 block w-full border border-border rounded-md shadow-sm p-3 text-black"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-label="Username"
              />
            </div>

            <div className="mb-4">
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
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full border border-border rounded-md shadow-sm p-3 text-black"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center mb-4">
              <input type="checkbox" id="accept" className="mr-2" required />
              <label htmlFor="accept" className="text-sm text-black">I accept the terms and conditions</label>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white hover:bg-[#333] p-3 rounded-md"
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
