'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // การใช้ useRouter ทำงานที่นี่จะทำให้มั่นใจว่าทำงานใน client side
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Reset error state
    setSuccessMessage('');

    try {
      // Log the data to check if email and password are correct
      console.log({ email, password });

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure you're sending JSON
        },
        body: JSON.stringify({ email, password }), // Make sure data is correctly stringified
      });

      // Check if the response is ok or not
      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      console.log('Login response data:', data);
      localStorage.setItem('token', data.token); // Store token in localStorage
      setSuccessMessage('Login successful');

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
