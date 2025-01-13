'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
        <div className="flex-1 flex items-center justify-center p-8 bg-[#213A58] text-white w-[500px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">REGISTER</h1>
            <Image
              src="/sp.png"
              alt="illustration"
              width={500}
              height={300}
            />
          </div>
        </div>
        <div className="flex-1 p-8">
          <h2 className="text-xl font-semibold mb-6 text-black">REGISTER</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-zinc-700">Username</label>
              <input
                type="text"
                id="username"
                className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 text-black"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 text-black"
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
                className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 text-black"
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
              className="w-full bg-primary text-primary-foreground bg-black text-white hover:bg-transparent hover:text-black border-solid border-2 border-black p-2 rounded-md"
            >
              REGISTER
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-500">{success}</p>}
        </div>
      </div>
    </div>
  );
}
