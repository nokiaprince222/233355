import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/vacancies/[id] - получить вакансию по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const vacancy = await prisma.vacancy.findUnique({
      where: { id },
    })

    if (!vacancy) {
      return NextResponse.json({ error: "Vacancy not found" }, { status: 404 })
    }

    // Парсим JSON строки
    const parsed = {
      ...vacancy,
      tags: JSON.parse(vacancy.tags),
      responsibilities: JSON.parse(vacancy.responsibilities),
      requirements: JSON.parse(vacancy.requirements),
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Error fetching vacancy:", error)
    return NextResponse.json({ error: "Failed to fetch vacancy" }, { status: 500 })
  }
}

// PUT /api/vacancies/[id] - обновить вакансию
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const vacancy = await prisma.vacancy.update({
      where: { id },
      data: {
        ...body,
        tags: JSON.stringify(body.tags),
        responsibilities: JSON.stringify(body.responsibilities),
        requirements: JSON.stringify(body.requirements),
      },
    })

    return NextResponse.json(vacancy)
  } catch (error) {
    console.error("Error updating vacancy:", error)
    return NextResponse.json({ error: "Failed to update vacancy" }, { status: 500 })
  }
}

// DELETE /api/vacancies/[id] - удалить вакансию
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.vacancy.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting vacancy:", error)
    return NextResponse.json({ error: "Failed to delete vacancy" }, { status: 500 })
  }
}

// PATCH /api/vacancies/[id] - обновить статус вакансии
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const vacancy = await prisma.vacancy.update({
      where: { id },
      data: {
        status: body.status,
      },
    })

    return NextResponse.json(vacancy)
  } catch (error) {
    console.error("Error updating vacancy status:", error)
    return NextResponse.json({ error: "Failed to update vacancy status" }, { status: 500 })
  }
}
