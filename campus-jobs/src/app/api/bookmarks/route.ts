import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/bookmarks - список закладок пользователя
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        vacancy: {
          select: {
            id: true,
            title: true,
            department: true,
            type: true,
            format: true,
            pay: true,
            deadline: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(bookmarks)
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}

// POST /api/bookmarks - добавить вакансию в закладки
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, vacancyId } = body

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        vacancyId,
      },
    })

    return NextResponse.json(bookmark, { status: 201 })
  } catch (error) {
    console.error("Error creating bookmark:", error)
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 })
  }
}

// DELETE /api/bookmarks - удалить закладку
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const vacancyId = searchParams.get("vacancyId")

    if (!userId || !vacancyId) {
      return NextResponse.json({ error: "userId and vacancyId are required" }, { status: 400 })
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId,
        vacancyId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bookmark:", error)
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 })
  }
}
