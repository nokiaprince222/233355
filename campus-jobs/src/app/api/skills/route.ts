import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/skills - список навыков
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(skills)
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}

// POST /api/skills - создать навык (для админа)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category } = body

    const skill = await prisma.skill.create({
      data: {
        name,
        category: category || null,
      },
    })

    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error("Error creating skill:", error)
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
  }
}
