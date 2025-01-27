import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { calculateTDEE, calculateMacroTargets } from '@/utils/calculations';
import { getUserProfile } from '@/lib/userService';
import { getDietGoals, upsertDietGoals } from '@/lib/dietGoalsService';

// ฟังก์ชันในการดึงข้อมูลผู้ใช้จาก JWT
async function getUserIdFromToken(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const cookieHeader = request.headers.get('cookie');
  let token: string | undefined = undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => c.trim().split('='))
    );
    token = cookies.token;
  }

  if (!token) {
    throw new Error('Authorization token is required');
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
  const userId = parseInt(decodedToken.userId, 10);
  if (isNaN(userId)) {
    throw new Error('Invalid user ID in token');
  }

  return userId;
}

// POST สำหรับอัปเดตเป้าหมายอาหาร
export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromToken(request);

    // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // ตรวจสอบว่าโปรไฟล์ผู้ใช้ครบถ้วนหรือไม่
    if (!userProfile.weight || !userProfile.height || !userProfile.age) {
      return NextResponse.json(
        { error: 'Incomplete user profile. Please provide weight, height, and age.' },
        { status: 400 }
      );
    }

    if (userProfile.sex !== 'male' && userProfile.sex !== 'female') {
      return NextResponse.json({ error: 'Invalid sex value. Must be either "male" or "female"' }, { status: 400 });
    }

    // คำนวณ TDEE และเป้าหมายการรับประทานอาหาร
    const formattedProfile = {
      weight: userProfile.weight,
      height: userProfile.height,
      age: userProfile.age,
      sex: userProfile.sex,
      activityLevel: userProfile.activity_level || 'sedentary',
    };
    const tdee = calculateTDEE(formattedProfile);
    const { protein, carbs, fat } = calculateMacroTargets(tdee);

    // อัปเดตหรือเพิ่มเป้าหมายการรับประทานอาหาร
    const updatedGoals = await upsertDietGoals(userId, {
      daily_calories: tdee,
      daily_protein: protein,
      daily_carbs: carbs,
      daily_fat: fat,
    });

    if (!updatedGoals) {
      return NextResponse.json({ error: 'Failed to update diet goals' }, { status: 500 });
    }

    return NextResponse.json(updatedGoals, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // ถ้า error เป็นอินสแตนซ์ของ Error ให้เข้าถึง message
      console.error('Error occurred:', error.message);
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    } else {
      // ถ้าไม่ใช่ Error (เช่น ข้อผิดพลาดที่ไม่คาดคิด)
      console.error('Unknown error occurred:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  
}

// GET สำหรับดึงข้อมูลเป้าหมายอาหาร
export async function GET(request: Request) {
  try {
    const userId = await getUserIdFromToken(request);

    // ดึงข้อมูลเป้าหมายการรับประทานอาหารจากฐานข้อมูล
    const dietGoals = await getDietGoals(userId);
    if (!dietGoals) {
      return NextResponse.json({ error: 'Diet goals not found for this user' }, { status: 404 });
    }

    return NextResponse.json(dietGoals, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // ถ้า error เป็นอินสแตนซ์ของ Error ให้เข้าถึง message
      console.error('Error occurred:', error.message);
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    } else {
      // ถ้าไม่ใช่ Error (เช่น ข้อผิดพลาดที่ไม่คาดคิด)
      console.error('Unknown error occurred:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
}
