import React from 'react';

interface CategoryButtonProps {
  category: string;
  selectedCategory: string;
  onClick: (category: string) => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, selectedCategory, onClick }) => {
  return (
    <button
      className={`px-[15] flex items-center justify-center hover:border-b-4 border-b-4 ${selectedCategory === category ? 'border-black font-bold' : 'border-transparent'}`}
      onClick={() => onClick(category)}
    >
      <div className=""></div>
      {category}
    </button>
  );
};

export default CategoryButton;
