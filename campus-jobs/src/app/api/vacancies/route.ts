import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/vacancies - список вакансий
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || ""
    const department = searchParams.get("department") || ""
    const format = searchParams.get("format") || ""

    const vacancies = await prisma.vacancy.findMany({
      where: {
        status: "ACTIVE",
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search } },
                  { description: { contains: search } },
                ],
              }
            : {},
          type ? { type } : {},
          department ? { department } : {},
          format ? { format } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
    })

    // Парсим JSON строки
    const parsed = vacancies.map((v) => ({
      ...v,
      tags: JSON.parse(v.tags),
      responsibilities: JSON.parse(v.responsibilities),
      requirements: JSON.parse(v.requirements),
    }))

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Error fetching vacancies:", error)
    return NextResponse.json({ error: "Failed to fetch vacancies" }, { status: 500 })
  }
}

// POST /api/vacancies - создать вакансию
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const vacancy = await prisma.vacancy.create({
      data: {
        ...body,
        tags: JSON.stringify(body.tags),
        responsibilities: JSON.stringify(body.responsibilities),
        requirements: JSON.stringify(body.requirements),
      },
    })
    return NextResponse.json(vacancy)
  } catch (error) {
    console.error("Error creating vacancy:", error)
    return NextResponse.json({ error: "Failed to create vacancy" }, { status: 500 })
  }
}
