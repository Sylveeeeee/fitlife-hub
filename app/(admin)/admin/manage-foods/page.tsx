'use client';

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
  const [formData, setFormData] = useState<Partial<Food>>({
    category: 'COMMON_FOOD',  // กำหนดค่าเริ่มต้น category เป็น COMMON_FOOD
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [, setNotification] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  const validateForm = (): boolean => {
    const requiredFields = ['name', 'calories', 'protein', 'carbs', 'fat', 'category', 'source'];
    const newErrors: Record<string, boolean> = {};

    requiredFields.forEach((field) => {
      if (!formData[field as keyof Food]) {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const url = isEditing && editId ? `/api/auth/foods/${editId}` : '/api/auth/foods';
    const body = JSON.stringify(formData);

    try {
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        const successMessage = isEditing ? 'Food updated successfully!' : 'Food added successfully!';
        setNotification(successMessage);
        setFormData({});
        setIsEditing(false);
        setEditId(null);
        fetchFoods();
      } else {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        alert(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('An unexpected error occurred.');
    }
  };

  const handleEdit = (food: Food) => {
    setIsEditing(true);
    setEditId(food.id);
    setFormData(food);
    setErrors({});
  };

  const confirmDelete = (id: number) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      const response = await fetch(`/api/auth/foods/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotification('Food deleted successfully!');
        setShowDeleteModal(false);
        setDeleteId(null);
        fetchFoods();
      } else {
        const errorText = await response.text();
        console.error('Failed to delete food:', errorText);
        alert(`Failed to delete food: ${errorText}`);
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      alert('An unexpected error occurred while deleting.');
    }
  };

  return (
    <div className="min-h-screen font-mono text-black p-6 mx-10">
      <h1 className="text-2xl font-bold mb-6">Manage Foods</h1>

      {/* Food Form */}
      <form onSubmit={handleFormSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold mb-4">{isEditing ? 'Edit Food' : 'Add Food'}</h2>
        <div className="grid grid-cols-2 gap-4">
          {['name', 'calories', 'protein', 'carbs', 'fat', 'source'].map((field) => (
            <input
              key={field}
              type={field === 'calories' || field === 'protein' || field === 'carbs' || field === 'fat' ? 'number' : 'text'}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={(formData[field as keyof Food] || '').toString()}
              onChange={handleInputChange}
              className={`p-2 border rounded ${errors[field] ? 'border-red-500 ' : 'border-gray-300'}`}
            />
          ))}
          
          {/* Select for category */}
          <select
            name="category"
            value={formData.category }
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="COMMON_FOOD">Common Food</option>
            <option value="BEVERAGES">Beverages</option>
            <option value="RESTAURANTS">Restaurants</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-[#000000ec]"
        >
          {isEditing ? 'Update Food' : 'Add Food'}
        </button>
      </form>

      {/* Food Table */}
      <table className="w-full bg-white rounded-lg shadow-md ">
        <thead>
          <tr>
            
            <th className="text-center p-2 border-b-2 border-[#e2e2e2]">#</th>
            <th className="text-left p-2 border-b-2 border-[#e2e2e2]">Name</th>
            <th className="text-left p-2 border-b-2 border-[#e2e2e2]">Calories</th>
            <th className="text-left p-2 border-b-2 border-[#e2e2e2]">Protein</th>
            <th className="text-left p-2 border-b-2 border-[#e2e2e2]">Carbs</th>
            <th className="text-left p-2 border-b-2 border-[#e2e2e2]">Fat</th>
            <th className="text-left p-2 border-b-2 border-[#e2e2e2]">Category</th>
            <th className="text-center p-2 border-b-2 border-[#e2e2e2]">Actions</th>
          
          </tr>
        </thead>
        <tbody>
          {foods.map((food) => (
            <tr key={food.id}>
              <td className="p-2 text-center">{food.id}</td>
              <td className="p-2">{food.name}</td>
              <td className="p-2">{food.calories}</td>
              <td className="p-2">{food.protein}</td>
              <td className="p-2">{food.carbs}</td>
              <td className="p-2">{food.fat}</td>
              <td className="p-2">{food.category}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => handleEdit(food)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(food.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          {/* ใช้ deleteId เพื่อหาค่าอาหารที่ต้องการลบ */}
          {foods
            .filter((food) => food.id === deleteId) // คัดกรองเฉพาะอาหารที่มี id เท่ากับ deleteId
            .map((food) => (
              <div key={food.id}>
                <p>Are you sure you want to delete {food.name}?</p>
                <div className="mt-4 flex justify-end gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    )}
    </div>
  );
}
