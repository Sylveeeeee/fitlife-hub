import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

async function verifyUser(req: Request) {
  const cookies = req.headers.get("cookie");
  if (!cookies) return null;

  const token = cookies.split(";").find((cookie) => cookie.trim().startsWith("token="))?.split("=")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };
    return { userId: Number(decoded.userId) };
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entryId = Number(params.id);
  const { duration, caloriesBurned, date } = await req.json();

  try {
    const updatedEntry = await prisma.userExerciseDiary.update({
      where: { id: entryId, userId: user.userId },
      data: { duration, caloriesBurned, date: new Date(date) },
    });
    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to update exercise" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const user = await verifyUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const entryId = Number(params.id);
  
    try {
      await prisma.userExerciseDiary.delete({
        where: { id: entryId, userId: user.userId },
      });
      return NextResponse.json({ message: "Exercise entry deleted successfully" }, { status: 204 });
    } catch (error) {
        console.error("Error fetching data:", error);
      return NextResponse.json({ error: "Failed to delete exercise" }, { status: 500 });
    }
  }
  