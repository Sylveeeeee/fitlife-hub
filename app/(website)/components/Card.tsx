import Image from 'next/image';


export default function Card() {
    return (
        <div className="flex space-x-4 ">
            
            <div className="text-center m-[20px] p-[20px] max-w-[1000px] bg-white rounded-[10px] h-[270px] w-[570px]">
            <h2 className="text-lg font-bold">Card Content</h2>
            <p className="text-gray-600">Additional content for the card.</p>
            </div> 
          </div>
    );
}
