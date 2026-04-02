import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/me - получить текущего пользователя (первого студента)
export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      where: { role: "STUDENT" },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
