import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/events - список мероприятий
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const events = await prisma.event.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
      orderBy: { date: "asc" },
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

// POST /api/events - создать мероприятие (для админа)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, location, type, status, companyId } = body

    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        date: new Date(date),
        location: location || null,
        type: type || "CAREER_FAIR",
        status: status || "UPCOMING",
        companyId: companyId || null,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
