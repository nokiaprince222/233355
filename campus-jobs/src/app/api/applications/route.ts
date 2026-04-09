import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/applications - список заявок пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || ""

    const applications = await prisma.application.findMany({
      where: userId ? { userId } : {},
      include: {
        vacancy: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

// POST /api/applications - создать заявку
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const application = await prisma.application.create({
      data: {
        status: "DRAFT",
        coverLetter: body.coverLetter,
        userId: body.userId,
        vacancyId: body.vacancyId,
      },
      include: {
        vacancy: true,
      },
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}
