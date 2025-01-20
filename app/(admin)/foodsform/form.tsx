'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FoodFormProps {
  food?: {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    category: string;
    source: string;
    type_of_food: string;
  };
}

const FoodForm: React.FC<FoodFormProps> = ({ food }) => {
  const [formData, setFormData] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    category: '',
    source: '',
    type_of_food: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        category: food.category,
        source: food.source,
        type_of_food: food.type_of_food,
      });
      setIsEditing(true);
    }
  }, [food]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const url = isEditing ? '/api/auth/updatefood' : '/api/auth/addfood';
      const method = isEditing ? 'PUT' : 'POST';
  
      // ส่งข้อมูลไปยัง API ด้วย fetch พร้อมกับ HttpOnly cookie
      const response = await fetch(url, {
        method, // POST หรือ PUT ขึ้นอยู่กับว่าแก้ไขหรือเพิ่ม
        headers: {
          'Content-Type': 'application/json', // กำหนดประเภทของข้อมูลที่ส่ง
        },
        body: JSON.stringify({ ...formData, id: food?.id }), // ส่งข้อมูลในรูปแบบ JSON
        credentials: 'include', // ส่ง HttpOnly cookie ไปพร้อมกับ request
      });
  
      // ตรวจสอบว่า response.ok เป็น true หรือไม่
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save food data');
      }
  
      // แปลงข้อมูลจาก JSON เป็น Object
      const data = await response.json();
  
      // แสดงข้อความจาก API
      alert(data.message);
  
      // เปลี่ยนเส้นทางไปยังหน้า /admin/foods
      router.push('/admin/foods');
    } catch (err) {
      console.error('Error during API request:', err);
      alert('Error saving food data. Please try again.');
    }
  };
  
  

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Food' : 'Add Food'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Calories</label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Protein</label>
            <input
              type="number"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Carbs</label>
            <input
              type="number"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Fat</label>
            <input
              type="number"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Source</label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Type of Food</label>
            <input
              type="text"
              name="type_of_food"
              value={formData.type_of_food}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
            {isEditing ? 'Update Food' : 'Add Food'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodForm;
