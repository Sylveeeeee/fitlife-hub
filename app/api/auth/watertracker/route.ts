import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ใช้ Route Handlers ใน App Router
export async function GET() {
  try {
    const glasses = await prisma.glass.findMany();
    return NextResponse.json(glasses, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, count } = await req.json();
    const glass = await prisma.glass.create({
      data: { userId, count },
    });
    return NextResponse.json(glass, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create glass entry" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.glass.delete({
      where: { id },
    });
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete glass entry" }, { status: 500 });
  }
}
