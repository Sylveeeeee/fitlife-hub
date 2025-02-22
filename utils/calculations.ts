// utils/calculations.ts

export interface UserProfile {
  weight: number; // kg
  height: number; // cm
  age: number; // years
  sex: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
}

// ✅ คำนวณ TDEE (Total Daily Energy Expenditure)
export const calculateTDEE = (profile: UserProfile): number => {
  const { weight, height, age, sex, activityLevel } = profile;

  // ✅ ใช้สมการ Mifflin-St Jeor ในการคำนวณ BMR
  const bmr =
      sex === 'male'
          ? 10 * weight + 6.25 * height - 5 * age + 5
          : 10 * weight + 6.25 * height - 5 * age - 161;

  // ✅ คูณค่า Activity Multiplier เพื่อคำนวณ TDEE
  const activityMultipliers: { [key in UserProfile['activityLevel']]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
  };

  return bmr * activityMultipliers[activityLevel];
};

// ✅ คำนวณ BMI (Body Mass Index)
export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100; // ✅ แปลง cm เป็น m
  return weight / (heightInMeters * heightInMeters);
};

// ✅ คำนวณ Macronutrient Targets
export const calculateMacroTargets = (tdee: number): { protein: number; carbs: number; fat: number } => {
  const protein = (tdee * 0.3) / 4; // ✅ 30% โปรตีน (Protein = 4 kcal/g)
  const carbs = (tdee * 0.4) / 4; // ✅ 40% คาร์บ (Carbs = 4 kcal/g)
  const fat = (tdee * 0.3) / 9; // ✅ 30% ไขมัน (Fat = 9 kcal/g)

  return { protein, carbs, fat };
};

// ✅ **ใหม่! ฟังก์ชันประมาณเปอร์เซ็นต์ไขมันในร่างกาย**
export const estimateBodyFat = (sex: 'male' | 'female', bmi: number, age: number): number => {
  if (sex === 'male') {
      return (1.20 * bmi) + (0.23 * age) - 16.2;
  } else {
      return (1.20 * bmi) + (0.23 * age) - 5.4;
  }
};
