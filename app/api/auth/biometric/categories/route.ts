import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const biometricCategories = await prisma.biometricCategory.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ data: biometricCategories }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching biometric categories:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
