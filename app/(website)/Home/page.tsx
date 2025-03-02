'use client';
import Image from "next/image";
export default function Home() {
  return (
    <div className=" text-black min-h-screen font-mono ">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-4">
        <div className="flex items-center">
          <div className="flex items-center  ">
                  <Image
                    src="/logo.png" // ใส่ Path ของรูปภาพของคุณ
                    alt="FitLifeHub Logo"
                    width={130} // ปรับขนาดของรูปภาพ
                    height={100} // ปรับขนาดของรูปภาพ
                    className="mr-2 rounded-[20px]"
                  />        
                </div>
        </div>
     
        <div>
          <button className="hidden md:block bg-orange-500  px-4 py-2 rounded-full hover:bg-orange-600">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center px-6 md:px-12 py-16">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Transform Your Life with Smart Nutrition Tracking
        </h1>
        <p className="text-lg text-gray-800 mt-4">
          Fitlife-Hub empowers you to take control of your health with precise tracking  
          of your nutrition, exercise, and overall wellness. Gain insights and make informed choices effortlessly.
        </p>
        <button className="mt-6 bg-orange-500 text-black px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-600">
          Get Started for Free!
        </button>
      </section>

      {/* Feature Section */}
      <section className="grid md:grid-cols-3 gap-6 px-6 md:px-12 pb-16">
        <div className="bg-orange-500 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold">Track Your Food</h3>
          <p className=" mt-2">Log your meals and get accurate nutrition insights.</p>
        </div>
        <div className="bg-yellow-500 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold">Build Healthy Habits</h3>
          <p className=" mt-2">Set goals, monitor progress, and stay motivated.</p>
        </div>
        <div className="bg-green-500 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold">Stay in Control</h3>
          <p className=" mt-2">Analyze calories, macros, and nutrients for a balanced lifestyle.</p>
        </div>
      </section>
    </div>
  );
}
