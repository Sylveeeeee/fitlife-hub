"use client";

interface TDEECardProps {
  tdee: number;
  bmr: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
}

const TDEECard: React.FC<TDEECardProps> = ({ tdee, bmr, macros }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Your TDEE Summary</h2>
      <div className="mb-4">
        <p className="text-gray-700">
          <strong>BMR:</strong> {bmr} kcal/day
        </p>
        <p className="text-gray-700">
          <strong>TDEE:</strong> {tdee} kcal/day
        </p>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Macronutrient Breakdown</h3>
        <ul className="list-disc list-inside">
          <li>
            <strong>Protein:</strong> {macros.protein}
          </li>
          <li>
            <strong>Carbohydrates:</strong> {macros.carbs}
          </li>
          <li>
            <strong>Fats:</strong> {macros.fat}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TDEECard;
