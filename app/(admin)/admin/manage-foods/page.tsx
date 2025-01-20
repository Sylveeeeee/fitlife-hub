'use client'

import { useState, useEffect } from 'react';

interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category?: string;
  source?: string;
}

export default function ManageFoods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [formData, setFormData] = useState<Partial<Food>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch foods from the database
  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    const response = await fetch('/api/auth/foods');
    if (!response.ok) {
      console.error('Failed to fetch foods:', response.statusText);
      return;
    }
    const data = await response.json();
    setFoods(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // ตรวจสอบข้อมูลที่จำเป็นในฟอร์ม
    if (!formData.name || formData.calories === undefined || formData.protein === undefined || formData.carbs === undefined || formData.fat === undefined) {
      alert('Please fill in all the fields with valid data.');
      return;
    }
  
    const method = isEditing && editId ? 'PUT' : 'POST';
    const url = isEditing && editId ? `/api/auth/foods/${editId}` : '/api/auth/foods';
    const body = JSON.stringify(formData);
  
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      credentials: 'include', // ส่ง cookies ไปพร้อมคำขอ
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to ${isEditing ? 'update' : 'add'} food:`, errorText);
      alert(`Error: ${errorText}`); // แสดงข้อผิดพลาดจากเซิร์ฟเวอร์
      return;
    }
  
    setIsEditing(false);
    setEditId(null);
    setFormData({});
    fetchFoods();
  };
  
  
  const handleEdit = (food: Food) => {
    setIsEditing(true);
    setEditId(food.id);
    setFormData(food);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/auth/foods/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error('Failed to delete food:', response.statusText);
      return;
    }

    fetchFoods();
  };

  return (
    <div className="min-h-screen font-mono text-black p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Foods</h1>

      {/* Food Form */}
      <form onSubmit={handleFormSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold mb-4">{isEditing ? 'Edit Food' : 'Add Food'}</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Food Name"
            value={formData.name || ''}
            onChange={handleInputChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="calories"
            placeholder="Calories"
            value={formData.calories || ''}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="protein"
            placeholder="Protein"
            value={formData.protein || ''}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="carbs"
            placeholder="Carbs"
            value={formData.carbs || ''}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="fat"
            placeholder="Fat"
            value={formData.fat || ''}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category || ''}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-[#000000ec]"
        >
          {isEditing ? 'Update Food' : 'Add Food'}
        </button>
      </form>

      {/* Food Table */}
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="text-left p-2">#</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Calories</th>
            <th className="text-left p-2">Protein</th>
            <th className="text-left p-2">Carbs</th>
            <th className="text-left p-2">Fat</th>
            <th className="text-left p-2">Category</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {foods.map((food) => (
            <tr key={food.id}>
              <td className="p-2">{food.id}</td>
              <td className="p-2">{food.name}</td>
              <td className="p-2">{food.calories}</td>
              <td className="p-2">{food.protein}</td>
              <td className="p-2">{food.carbs}</td>
              <td className="p-2">{food.fat}</td>
              <td className="p-2">{food.category}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(food)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(food.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
