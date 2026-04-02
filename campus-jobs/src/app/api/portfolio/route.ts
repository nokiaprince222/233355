import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/portfolio - получить портфолио пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "";

    const portfolio = await prisma.portfolio.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}

// POST /api/portfolio - создать проект в портфолио
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const portfolio = await prisma.portfolio.create({
      data: {
        title: body.title,
        description: body.description,
        tags: JSON.stringify(body.tags || []),
        links: body.links ? JSON.stringify(body.links) : null,
        files: body.files ? JSON.stringify(body.files) : null,
        visibility: body.visibility || "CAMPUS",
        userId: body.userId,
      },
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 });
  }
}
