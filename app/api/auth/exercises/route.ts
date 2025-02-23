import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const subCategoryId = url.searchParams.get("subCategoryId");

  if (!subCategoryId) {
    return NextResponse.json({ error: "subCategoryId is required" }, { status: 400 });
  }

  try {
    const exercises = await prisma.exercise.findMany({
      where: { subCategoryId: Number(subCategoryId) },
    });
    return NextResponse.json({ exercises });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 });
  }
}
