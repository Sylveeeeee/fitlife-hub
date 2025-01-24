// utils/calculations.ts

interface UserProfile {
    weight: number; // kg
    height: number; // cm
    age: number; // years
    sex: 'male' | 'female';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  }
  
  export const calculateTDEE = (profile: UserProfile): number => {
    const { weight, height, age, sex, activityLevel } = profile;
  
    // BMR Calculation (Mifflin-St Jeor Equation)
    const bmr =
      sex === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
  
    // Activity Multipliers
    const activityMultipliers: { [key in UserProfile['activityLevel']]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
  
    return bmr * activityMultipliers[activityLevel];
  };

  export const calculateBMI = (weight: number, height: number): number => {
    // height in cm to meters
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };
    
  export const calculateMacroTargets = (tdee: number): { protein: number; carbs: number; fat: number } => {
    // 40% Carbs, 30% Protein, 30% Fat (example distribution)
    const protein = (tdee * 0.3) / 4; // Protein = 4 kcal/g
    const carbs = (tdee * 0.4) / 4; // Carbs = 4 kcal/g
    const fat = (tdee * 0.3) / 9; // Fat = 9 kcal/g
  
    return { protein, carbs, fat };
  };
  