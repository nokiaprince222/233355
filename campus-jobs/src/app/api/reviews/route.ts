import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/reviews - список отзывов
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")

    const reviews = await prisma.review.findMany({
      where: companyId ? { companyId } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

// POST /api/reviews - создать отзыв
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rating, comment, userId, companyId } = body

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment: comment || null,
        userId,
        companyId,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
