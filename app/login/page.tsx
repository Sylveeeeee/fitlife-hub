'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      setSuccessMessage('Login successful!');
      setEmail('');
      setPassword('');

      const redirectPath = data.role === 'admin' ? '/dashboard' : '/';
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#e2e2e2] font-mono">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-8 bg-[#213A58] text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">LOGIN</h1>
            <Image src="/sp2.png" alt="illustration" width={500} height={300} />
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
              disabled={loading}
              className={`w-full p-2 rounded-md ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-transparent hover:text-black border-solid border-2 border-black'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          {successMessage && <p className="mt-4 text-sm text-green-500">{successMessage}</p>}
          <p className="mt-4 text-sm text-muted-foreground text-black">
            Don&apos;t have an account yet? <Link href="/register" className="text-primary underline underline-offset hover:text-slate-400">Create an account</Link>
          </p>
          <p className="mt-2 text-sm text-muted-foreground text-[#213A58]"><Link href="/forgot-password" className="text-primary">Forgot Password?</Link></p>
        </div>
      </div>
    </div>
  );
}
