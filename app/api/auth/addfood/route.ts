import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // เพิ่ม Prisma สำหรับรองรับ Prisma Error

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, calories, protein, carbs, fat, category, source, type_of_food } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ message: 'Invalid or missing name' }, { status: 400 });
    }

    const newFood = await prisma.foods.create({
      data: {
        name,
        calories: calories ?? 0.00,
        protein: protein ?? 0.00,
        carbs: carbs ?? 0.00,
        fat: fat ?? 0.00,
        category: category || 'Unknown',
        source: source || 'Unknown',
        type_of_food: type_of_food || 'General',
      },
    });

    return NextResponse.json({ message: 'Food created successfully', food: newFood });
  } catch (err) {
    console.error(err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return NextResponse.json({ message: 'Food name must be unique' }, { status: 400 });
      }
    }

    if (err instanceof Error) {
      return NextResponse.json({ message: 'Failed to create food', error: err.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
  }
}
