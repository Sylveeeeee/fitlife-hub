// components/UserTargets.tsx
import React from 'react';
import { useUserContext } from '../contexts/UserContext';
import { calculateTDEE, calculateMacroTargets } from '../../../utils/calculations';

const UserTargets: React.FC = () => {
  const { userProfile } = useUserContext();

  const tdee = calculateTDEE(userProfile);
  const macros = calculateMacroTargets(tdee);

  return (
    <div>
      <h2>Your Daily Targets</h2>
      <p><strong>TDEE:</strong> {tdee.toFixed(1)} kcal</p>
      <h3>Macros</h3>
      <p>Protein: {macros.protein.toFixed(1)} g</p>
      <p>Carbs: {macros.carbs.toFixed(1)} g</p>
      <p>Fat: {macros.fat.toFixed(1)} g</p>
    </div>
  );
};

export default UserTargets;
