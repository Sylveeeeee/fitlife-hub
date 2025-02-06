export default function Card() {
  return (
    <div className="flex justify-center px-4">
      <div className="text-center m-5 p-6 w-full max-w-sm md:max-w-md lg:max-w-lg bg-gradient-to-r from-blue-500 to-green-400 rounded-xl h-auto min-h-[250px] shadow-xl flex flex-col items-center text-white">
        
        <h2 className="text-lg md:text-xl font-bold text-black">FITLIFE-HUB</h2>
        <p className="text-sm md:text-base mt-[10px]">
        Take care of your health and strength with us with an effective exercise program.
        </p>
        <button className="mt-[50px] bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-100 transition">
          START
        </button>
      </div>
    </div>
  );
}
